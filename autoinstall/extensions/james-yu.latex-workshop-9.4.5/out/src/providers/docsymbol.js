"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.DocSymbolProvider = void 0;
const vscode = __importStar(require("vscode"));
const lw = __importStar(require("../lw"));
const structure_1 = require("./structure");
class DocSymbolProvider {
    constructor() {
        this.sectionNodeProvider = new structure_1.SectionNodeProvider();
    }
    async provideDocumentSymbols(document) {
        if (document.languageId === 'bibtex') {
            return this.sectionNodeProvider.buildBibTeXModel(document).then((sections) => this.sectionToSymbols(sections));
        }
        if (lw.lwfs.isVirtualUri(document.uri)) {
            return [];
        }
        return this.sectionToSymbols(await this.sectionNodeProvider.buildLaTeXModel(document.fileName, false));
    }
    sectionToSymbols(sections) {
        const symbols = [];
        sections.forEach(section => {
            const range = new vscode.Range(section.lineNumber, 0, section.toLine, 65535);
            const symbol = new vscode.DocumentSymbol(section.label || 'empty', '', section.depth < 0 ? vscode.SymbolKind.Method : vscode.SymbolKind.Module, range, range);
            symbols.push(symbol);
            if (section.children.length > 0) {
                symbol.children = this.sectionToSymbols(section.children);
            }
        });
        return symbols;
    }
}
exports.DocSymbolProvider = DocSymbolProvider;
//# sourceMappingURL=docsymbol.js.map