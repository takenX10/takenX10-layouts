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
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
const nls = __importStar(require("vscode-nls"));
const openDocumentLink_1 = require("../commands/openDocumentLink");
const links_1 = require("../util/links");
const similarArrayMatch_1 = require("../similarArrayMatch");
const linkSanitizer_1 = require("../linkSanitizer");
const localize = nls.loadMessageBundle();
function normalizeLink(document, link, base) {
    const externalSchemeUri = (0, links_1.getUriForLinkWithKnownExternalScheme)(link);
    if (externalSchemeUri) {
        return externalSchemeUri;
    }
    // Assume it must be an relative or absolute file path
    // Use a fake scheme to avoid parse warnings
    const tempUri = vscode.Uri.parse(`vscode-resource:${link}`);
    let resourcePath;
    if (!tempUri.path) {
        resourcePath = document.uri.path;
    }
    else if (link[0] === '/') {
        resourcePath = tempUri.path;
    }
    else {
        resourcePath = path.join(base, tempUri.path);
    }
    const sanitizedResourcePath = (0, linkSanitizer_1.isSchemeBlacklisted)(link) ? '#' : resourcePath;
    return openDocumentLink_1.OpenDocumentLinkCommand.createCommandUri(sanitizedResourcePath, tempUri.fragment);
}
class LinkProvider {
    constructor(engine) {
        this.engine = engine;
    }
    provideDocumentLinks(textDocument, _token) {
        return __awaiter(this, void 0, void 0, function* () {
            const asciidocParser = this.engine.getEngine();
            const { document } = yield asciidocParser.convertUsingJavascript(textDocument.getText(), textDocument, false, 'webview-html5', true);
            const results = [];
            const lines = document.getSourceLines();
            // includes from the reader are resolved correctly but the line numbers may be offset and not exactly match the document
            let baseDocumentProcessorIncludes = asciidocParser.baseDocumentIncludeItems;
            const includeDirective = /^(\\)?include::([^[][^[]*)\[([^\n]+)?\]$/;
            // get includes from document text. These may be inside ifeval or ifdef but the line numbers are correct.
            const baseDocumentRegexIncludes = new Map();
            lines.forEach((line, index) => {
                const match = includeDirective.exec(line);
                if (match) {
                    // match[2] is the include reference
                    baseDocumentRegexIncludes.set(index, match[2].length);
                }
            });
            // find a corrected mapping for line numbers
            const betterIncludeMatching = (0, similarArrayMatch_1.similarArrayMatch)(Array.from(baseDocumentRegexIncludes.keys()), baseDocumentProcessorIncludes.map((entry) => { return entry.position; }));
            // update line items in reader results
            baseDocumentProcessorIncludes = baseDocumentProcessorIncludes.map((entry) => {
                return Object.assign(Object.assign({}, entry), { index: betterIncludeMatching[entry.index] });
            });
            // create include links
            if (baseDocumentProcessorIncludes) {
                const base = path.dirname(textDocument.uri.fsPath);
                baseDocumentProcessorIncludes.forEach((entry) => {
                    const lineNo = entry.position - 1;
                    const documentLink = new vscode.DocumentLink(new vscode.Range(
                    // don't link to the include:: part or the square bracket contents
                    new vscode.Position(lineNo, 9), new vscode.Position(lineNo, entry.length + 9)), normalizeLink(document, entry.name, base));
                    documentLink.tooltip = localize('documentLink.tooltip', 'Open file') + ' ' + entry.name;
                    results.push(documentLink);
                });
            }
            return results;
        });
    }
}
exports.default = LinkProvider;
//# sourceMappingURL=documentLinkProvider.js.map