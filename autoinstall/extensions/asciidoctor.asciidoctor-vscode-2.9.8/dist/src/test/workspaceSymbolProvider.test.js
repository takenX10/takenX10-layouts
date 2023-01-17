"use strict";
/*---------------------------------------------------------------------------------------------
  *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("assert"));
require("mocha");
const vscode = __importStar(require("vscode"));
const documentSymbolProvider_1 = __importDefault(require("../features/documentSymbolProvider"));
const workspaceSymbolProvider_1 = __importDefault(require("../features/workspaceSymbolProvider"));
const engine_1 = require("./engine");
const symbolProvider = new documentSymbolProvider_1.default((0, engine_1.createNewAsciidocEngine)(), null);
suite('asciidoc.WorkspaceSymbolProvider', () => {
    test('Should not return anything for empty workspace', () => __awaiter(void 0, void 0, void 0, function* () {
        const provider = new workspaceSymbolProvider_1.default(symbolProvider, new InMemoryWorkspaceAsciidocDocumentProvider([]));
        assert.deepEqual(yield provider.provideWorkspaceSymbols(''), []);
    }));
});
class InMemoryWorkspaceAsciidocDocumentProvider {
    constructor(documents) {
        this._documents = new Map();
        this._onDidChangeAsciidocDocumentEmitter = new vscode.EventEmitter();
        this.onDidChangeAsciidocDocument = this._onDidChangeAsciidocDocumentEmitter.event;
        this._onDidCreateAsciidocDocumentEmitter = new vscode.EventEmitter();
        this.onDidCreateAsciidocDocument = this._onDidCreateAsciidocDocumentEmitter.event;
        this._onDidDeleteAsciidocDocumentEmitter = new vscode.EventEmitter();
        this.onDidDeleteAsciidocDocument = this._onDidDeleteAsciidocDocumentEmitter.event;
        for (const doc of documents) {
            this._documents.set(doc.fileName, doc);
        }
    }
    getAllAsciidocDocuments() {
        return __awaiter(this, void 0, void 0, function* () {
            return Array.from(this._documents.values());
        });
    }
    updateDocument(document) {
        this._documents.set(document.fileName, document);
        this._onDidChangeAsciidocDocumentEmitter.fire(document);
    }
    createDocument(document) {
        assert.ok(!this._documents.has(document.uri.fsPath));
        this._documents.set(document.uri.fsPath, document);
        this._onDidCreateAsciidocDocumentEmitter.fire(document);
    }
    deleteDocument(resource) {
        this._documents.delete(resource.fsPath);
        this._onDidDeleteAsciidocDocumentEmitter.fire(resource);
    }
}
//# sourceMappingURL=workspaceSymbolProvider.test.js.map