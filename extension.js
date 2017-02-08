var vscode = require('vscode');
var fs = require('fs');

var snipetsArr      = getJson('/snippets/filters.json');
var functionsArr    = getJson('/snippets/functions.json');
var twigArr         = getJson('/snippets/twig.json');
var loopArr         = getJson('/objects/loop.json');
var testsArr        = getJson('/objects/tests.json');

function getJson(relativePath){
    var file = fs.readFileSync( __dirname + relativePath, 'utf8');
    return JSON.parse(file);
}

function createHover(snipet){
    var example = (typeof snipet.example == "undefined")?"":snipet.example;
    var description = (typeof snipet.description == "undefined")?"":snipet.description;
    return new vscode.Hover({ language: "html", value: description + "\n\n" + example });
}

function activate(context) {

    var hovers = vscode.languages.registerHoverProvider('html', {
        provideHover(document, position, token) {
            var range =  document.getWordRangeAtPosition(position);
            var word = document.getText(range);

            for( var snipet in snipetsArr ) {
                if (snipetsArr[snipet].prefix == word || snipetsArr[snipet].hover == word) {
                    return createHover(snipetsArr[snipet]);
                }
            }

            for( var snipet in functionsArr ) {
                if (functionsArr[snipet].prefix == word || functionsArr[snipet].hover == word) {
                    return createHover(functionsArr[snipet]);
                }
            }

            for( var snipet in twigArr ) {
                if (twigArr[snipet].prefix == word || twigArr[snipet].hover == word) {
                    return createHover(twigArr[snipet]);
                }
            }

        }
    });

    context.subscriptions.push(hovers);

    var filters = vscode.languages.registerCompletionItemProvider('html',{

        provideCompletionItems(document, position, token) {
            var start = new vscode.Position(position.line, 0);
            var range = new vscode.Range(start, position);
            var text = document.getText(range);
            var completionItems = [];

            if(text[text.length-1] != "|"){
                return completionItems;
            }
            for( var snipet in snipetsArr ) {

                if(typeof snipetsArr[snipet].text != "undefined"){

                    var description = (typeof snipetsArr[snipet].description == "undefined") ? "" : snipetsArr[snipet].description;
                    var example = (typeof snipetsArr[snipet].example == "undefined") ? "" : "\n\n" + snipetsArr[snipet].example;

                    var item = new vscode.CompletionItem(snipet);
                    item.kind = vscode.CompletionItemKind.Function;
                    item.detail = snipetsArr[snipet].description;
                    item.documentation = description +  example;
                    item.insertText = snipetsArr[snipet].text;

                    completionItems.push(item);
                }
            }

            return completionItems;
        },
        resolveCompletionItem(item, token) {

            return item;
        }


    },'|');


    context.subscriptions.push(filters);


    var loopField = vscode.languages.registerCompletionItemProvider('html',{

        provideCompletionItems(document, position, token) {
            var start = new vscode.Position(position.line, 0);
            var range = new vscode.Range(start, position);
            var text = document.getText(range);
            var completionItems = [];

            if(text.substring(text.length - 5) != "loop."){
                return completionItems;
            }

            for( var snipet in loopArr ) {

                var description = (typeof loopArr[snipet].description == "undefined") ? "" : loopArr[snipet].description;
                var item = new vscode.CompletionItem(snipet);

                item.kind = vscode.CompletionItemKind.Property;
                item.detail = description;

                completionItems.push(item);

            }

            return completionItems;
        },
        resolveCompletionItem(item, token) {

            return item;
        }


    },'.');


    context.subscriptions.push(loopField);


    var tests = vscode.languages.registerCompletionItemProvider('html',{

        provideCompletionItems(document, position, token) {
            var start = new vscode.Position(position.line, 0);
            var range = new vscode.Range(start, position);
            var text = document.getText(range);
            var completionItems = [];

            if(! (text.substring(text.length - 3) == "is ") || (text.substring(text.length - 3) == "not ")){
                return completionItems;
            }

            for( var snipet in testsArr ) {

                var description = (typeof testsArr[snipet].description == "undefined") ? "" : testsArr[snipet].description;
                var item = new vscode.CompletionItem(snipet);

                item.kind = vscode.CompletionItemKind.Keyword;
                item.detail = description;

                completionItems.push(item);

            }

            return completionItems;
        },
        resolveCompletionItem(item, token) {
            console.log(item, token);
            return item;
        }


    },' ');


    context.subscriptions.push(tests);

}
exports.activate = activate;

function deactivate() { }
exports.deactivate = deactivate;
