"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsciidocFileIncludeAutoCompletionMonitor = void 0;
const vscode = __importStar(require("vscode"));
const asciidoc_provider_1 = require("../providers/asciidoc.provider");
const bibtex_provider_1 = require("../providers/bibtex.provider");
const xref_provider_1 = require("../providers/xref.provider");
const dispose_1 = require("../util/dispose");
class AsciidocFileIncludeAutoCompletionMonitor {
    constructor() {
        this.disposables = [];
        this._onDidIncludeAutoCompletionEmitter = new vscode.EventEmitter();
        this.onDidIncludeAutoCompletionEmitter = this
            ._onDidIncludeAutoCompletionEmitter.event;
        const disposable = vscode.languages.registerCompletionItemProvider({
            language: 'asciidoc',
            scheme: 'file',
        }, asciidoc_provider_1.AsciidocProvider, ...[':', '/']);
        const bibtexDisposable = vscode.languages.registerCompletionItemProvider({
            language: 'asciidoc',
            scheme: 'file',
        }, bibtex_provider_1.BibtexProvider, ...[':', '/']);
        const xrefDisposable = vscode.languages.registerCompletionItemProvider({
            language: 'asciidoc',
            scheme: 'file',
        }, xref_provider_1.xrefProvider, ...[':', '/']);
        this.disposables.push(disposable);
        this.disposables.push(bibtexDisposable);
        this.disposables.push(xrefDisposable);
    }
    dispose() {
        (0, dispose_1.disposeAll)(this.disposables);
    }
}
exports.AsciidocFileIncludeAutoCompletionMonitor = AsciidocFileIncludeAutoCompletionMonitor;
//# sourceMappingURL=includeAutoCompletion.js.map