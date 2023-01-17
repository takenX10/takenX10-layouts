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
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(require("vscode"));
const dispose_1 = require("../util/dispose");
const file_1 = require("../util/file");
const lazy_1 = require("../util/lazy");
class VSCodeWorkspaceAsciidocDocumentProvider {
    constructor() {
        this._onDidChangeAsciidocDocumentEmitter = new vscode.EventEmitter();
        this._onDidCreateAsciidocDocumentEmitter = new vscode.EventEmitter();
        this._onDidDeleteAsciidocDocumentEmitter = new vscode.EventEmitter();
        this._disposables = [];
    }
    dispose() {
        this._onDidChangeAsciidocDocumentEmitter.dispose();
        this._onDidDeleteAsciidocDocumentEmitter.dispose();
        if (this._watcher) {
            this._watcher.dispose();
        }
        (0, dispose_1.disposeAll)(this._disposables);
    }
    getAllAsciidocDocuments() {
        return __awaiter(this, void 0, void 0, function* () {
            const resources = yield vscode.workspace.findFiles('**/*.md', '**/node_modules/**');
            const docs = yield Promise.all(resources.map((doc) => this.getAsciidocDocument(doc)));
            return docs.filter((doc) => !!doc);
        });
    }
    get onDidChangeAsciidocDocument() {
        this.ensureWatcher();
        return this._onDidChangeAsciidocDocumentEmitter.event;
    }
    get onDidCreateAsciidocDocument() {
        this.ensureWatcher();
        return this._onDidCreateAsciidocDocumentEmitter.event;
    }
    get onDidDeleteAsciidocDocument() {
        this.ensureWatcher();
        return this._onDidDeleteAsciidocDocumentEmitter.event;
    }
    ensureWatcher() {
        if (this._watcher) {
            return;
        }
        this._watcher = vscode.workspace.createFileSystemWatcher('**/*.md');
        this._watcher.onDidChange((resource) => __awaiter(this, void 0, void 0, function* () {
            const document = yield this.getAsciidocDocument(resource);
            if (document) {
                this._onDidChangeAsciidocDocumentEmitter.fire(document);
            }
        }), null, this._disposables);
        this._watcher.onDidCreate((resource) => __awaiter(this, void 0, void 0, function* () {
            const document = yield this.getAsciidocDocument(resource);
            if (document) {
                this._onDidCreateAsciidocDocumentEmitter.fire(document);
            }
        }), null, this._disposables);
        this._watcher.onDidDelete((resource) => __awaiter(this, void 0, void 0, function* () {
            this._onDidDeleteAsciidocDocumentEmitter.fire(resource);
        }), null, this._disposables);
        vscode.workspace.onDidChangeTextDocument((e) => {
            if ((0, file_1.isAsciidocFile)(e.document)) {
                this._onDidChangeAsciidocDocumentEmitter.fire(e.document);
            }
        }, null, this._disposables);
    }
    getAsciidocDocument(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield vscode.workspace.openTextDocument(resource);
            return doc && (0, file_1.isAsciidocFile)(doc) ? doc : undefined;
        });
    }
}
class AsciidocWorkspaceSymbolProvider {
    constructor(_symbolProvider, _workspaceAsciidocDocumentProvider = new VSCodeWorkspaceAsciidocDocumentProvider()) {
        this._symbolProvider = _symbolProvider;
        this._workspaceAsciidocDocumentProvider = _workspaceAsciidocDocumentProvider;
        this._symbolCache = new Map();
        this._symbolCachePopulated = false;
        this._disposables = [];
        this._symbolProvider = _symbolProvider;
        this._workspaceAsciidocDocumentProvider = _workspaceAsciidocDocumentProvider;
    }
    provideWorkspaceSymbols(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._symbolCachePopulated) {
                yield this.populateSymbolCache();
                this._symbolCachePopulated = true;
                this._workspaceAsciidocDocumentProvider.onDidChangeAsciidocDocument(this.onDidChangeDocument, this, this._disposables);
                this._workspaceAsciidocDocumentProvider.onDidCreateAsciidocDocument(this.onDidChangeDocument, this, this._disposables);
                this._workspaceAsciidocDocumentProvider.onDidDeleteAsciidocDocument(this.onDidDeleteDocument, this, this._disposables);
            }
            const allSymbolsSets = yield Promise.all(Array.from(this._symbolCache.values()).map((x) => x.value));
            const allSymbols = Array.prototype.concat.apply([], allSymbolsSets);
            return allSymbols.filter((symbolInformation) => symbolInformation.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
        });
    }
    populateSymbolCache() {
        return __awaiter(this, void 0, void 0, function* () {
            const asciidocDocumentUris = yield this._workspaceAsciidocDocumentProvider.getAllAsciidocDocuments();
            for (const document of asciidocDocumentUris) {
                this._symbolCache.set(document.uri.fsPath, this.getSymbols(document));
            }
        });
    }
    dispose() {
        (0, dispose_1.disposeAll)(this._disposables);
    }
    getSymbols(document) {
        return (0, lazy_1.lazy)(() => __awaiter(this, void 0, void 0, function* () {
            return this._symbolProvider.provideDocumentSymbolInformation(document);
        }));
    }
    onDidChangeDocument(document) {
        this._symbolCache.set(document.uri.fsPath, this.getSymbols(document));
    }
    onDidDeleteDocument(resource) {
        this._symbolCache.delete(resource.fsPath);
    }
}
exports.default = AsciidocWorkspaceSymbolProvider;
//# sourceMappingURL=workspaceSymbolProvider.js.map