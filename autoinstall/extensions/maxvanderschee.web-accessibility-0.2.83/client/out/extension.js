"use strict";
/*! extension.ts
 * Flamingos are pretty badass!
 * Copyright (c) 2018 Max van der Schee; Licensed MIT */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const path = require("path");
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
let client;
function activate(context) {
    // The server is implemented in node
    let serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
    // The debug options for the server
    // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
    let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    let serverOptions = {
        run: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: vscode_languageclient_1.TransportKind.ipc,
            options: debugOptions,
        },
    };
    // Options to control the language client
    let clientOptions = {
        // Register the server for HTML documents
        documentSelector: [
            { language: 'html', scheme: 'file' },
            { language: 'javascriptreact', scheme: 'file' },
            { language: 'vue-html', scheme: 'file' },
            { language: 'vue', scheme: 'file' },
            { language: 'handlebars', scheme: 'file' },
        ],
        synchronize: {
            // Notify the server about file changes to '.clientrc files contained in the workspace
            fileEvents: vscode_1.workspace.createFileSystemWatcher('**/.clientrc'),
        },
    };
    // Create the language client and start the client.
    client = new vscode_languageclient_1.LanguageClient('webAccessibilityServer', 'Web Accessibility Server', serverOptions, clientOptions);
    // Start the client. This will also launch the server
    client.start();
}
exports.activate = activate;
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
exports.deactivate = deactivate;
