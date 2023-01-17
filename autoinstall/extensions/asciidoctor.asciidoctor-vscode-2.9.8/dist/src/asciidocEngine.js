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
exports.AsciidocEngine = void 0;
const vscode = __importStar(require("vscode"));
const asciidocParser_1 = require("./asciidocParser");
const FrontMatterRegex = /^---\s*[^]*?(-{3}|\.{3})\s*/;
class AsciidocEngine {
    constructor(extensionPreviewResourceProvider, slugifier, errorCollection = null) {
        this.extensionPreviewResourceProvider = extensionPreviewResourceProvider;
        this.slugifier = slugifier;
        this.errorCollection = errorCollection;
        this.extensionPreviewResourceProvider = extensionPreviewResourceProvider;
        this.slugifier = slugifier;
        this.errorCollection = errorCollection;
    }
    getEngine() {
        // singleton
        if (!this.ad) {
            this.ad = new asciidocParser_1.AsciidocParser(this.extensionPreviewResourceProvider.extensionUri, this.errorCollection);
        }
        return this.ad;
    }
    stripFrontmatter(text) {
        let offset = 0;
        const frontMatterMatch = FrontMatterRegex.exec(text);
        if (frontMatterMatch) {
            const frontMatter = frontMatterMatch[0];
            offset = frontMatter.split(/\r\n|\n|\r/g).length - 1;
            text = text.substr(frontMatter.length);
        }
        return { text, offset };
    }
    render(documentUri, stripFrontmatter, text, forHTML = false, backend = 'webview-html5', context, editor) {
        return __awaiter(this, void 0, void 0, function* () {
            let offset = 0;
            if (stripFrontmatter) {
                const asciidocContent = this.stripFrontmatter(text);
                offset = asciidocContent.offset;
                text = asciidocContent.text;
            }
            this.firstLine = offset;
            const textDocument = yield vscode.workspace.openTextDocument(documentUri);
            const { html: output, document } = yield this.getEngine().parseText(text, textDocument, forHTML, backend, context, editor);
            return { output, document };
        });
    }
    load(documentUri, source) {
        return __awaiter(this, void 0, void 0, function* () {
            const textDocument = yield vscode.workspace.openTextDocument(documentUri);
            const { document } = yield this.getEngine().parseText(source, textDocument);
            return document;
        });
    }
}
exports.AsciidocEngine = AsciidocEngine;
//# sourceMappingURL=asciidocEngine.js.map