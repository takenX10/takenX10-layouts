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
exports.resolveLinkToAsciidocFile = exports.OpenDocumentLinkCommand = void 0;
const vscode = __importStar(require("vscode"));
const path_1 = require("path");
const tableOfContentsProvider_1 = require("../tableOfContentsProvider");
const file_1 = require("../util/file");
class OpenDocumentLinkCommand {
    constructor(engine) {
        this.engine = engine;
        this.id = OpenDocumentLinkCommand.id;
        this.engine = engine;
    }
    static createCommandUri(path, fragment) {
        return vscode.Uri.parse(`command:${OpenDocumentLinkCommand.id}?${encodeURIComponent(JSON.stringify({ path, fragment }))}`);
    }
    execute(args) {
        const p = decodeURIComponent(args.path);
        return this.tryOpen(p, args).catch(() => __awaiter(this, void 0, void 0, function* () {
            if ((0, path_1.extname)(p) === '') {
                return this.tryOpen(p + '.md', args);
            }
            const resource = vscode.Uri.file(p);
            yield vscode.commands.executeCommand('vscode.open', resource);
            return undefined;
        }));
    }
    tryOpen(path, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = vscode.Uri.file(path);
            if (vscode.window.activeTextEditor && (0, file_1.isAsciidocFile)(vscode.window.activeTextEditor.document) &&
                vscode.window.activeTextEditor.document.uri.fsPath === resource.fsPath) {
                return this.tryRevealLine(vscode.window.activeTextEditor, args.fragment);
            }
            else {
                return vscode.workspace.openTextDocument(resource)
                    .then(vscode.window.showTextDocument)
                    .then((editor) => this.tryRevealLine(editor, args.fragment));
            }
        });
    }
    tryRevealLine(editor, fragment) {
        return __awaiter(this, void 0, void 0, function* () {
            if (editor && fragment) {
                const toc = new tableOfContentsProvider_1.TableOfContentsProvider(this.engine, editor.document);
                const entry = yield toc.lookup(fragment);
                if (entry) {
                    return editor.revealRange(new vscode.Range(entry.line, 0, entry.line, 0), vscode.TextEditorRevealType.AtTop);
                }
                const lineNumberFragment = fragment.match(/^L(\d+)$/i);
                if (lineNumberFragment) {
                    const line = +lineNumberFragment[1] - 1;
                    if (!isNaN(line)) {
                        return editor.revealRange(new vscode.Range(line, 0, line, 0), vscode.TextEditorRevealType.AtTop);
                    }
                }
            }
        });
    }
}
exports.OpenDocumentLinkCommand = OpenDocumentLinkCommand;
OpenDocumentLinkCommand.id = '_asciidoc.openDocumentLink';
function resolveLinkToAsciidocFile(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const standardLink = yield tryResolveLinkToAsciidocFile(path);
            if (standardLink) {
                return standardLink;
            }
        }
        catch (_a) {
            // Noop
        }
        // If no extension, try with `.adoc` extension
        if ((0, path_1.extname)(path) === '') {
            return tryResolveLinkToAsciidocFile(path + '.adoc');
        }
        return undefined;
    });
}
exports.resolveLinkToAsciidocFile = resolveLinkToAsciidocFile;
function tryResolveLinkToAsciidocFile(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const resource = vscode.Uri.file(path);
        let document;
        try {
            document = yield vscode.workspace.openTextDocument(resource);
        }
        catch (_a) {
            return undefined;
        }
        if ((0, file_1.isAsciidocFile)(document)) {
            return document.uri;
        }
        return undefined;
    });
}
//# sourceMappingURL=openDocumentLink.js.map