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
exports.AttributeReferenceProvider = void 0;
const vscode = __importStar(require("vscode"));
const asciidocParser_1 = require("../asciidocParser");
class AttributeReferenceProvider {
    constructor(extensionUri) {
        this.extensionUri = extensionUri;
    }
    provideCompletionItems(textDocument, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const { document } = yield new asciidocParser_1.AsciidocParser(this.extensionUri).parseText(textDocument.getText(), textDocument);
            if (document) {
                const attributes = document.getAttributes();
                const lineText = textDocument.lineAt(position).text;
                const prefix = lineText.substring(position.character - 1, position.character);
                const suffix = lineText.substring(position.character, position.character + 1);
                return Object.keys(attributes).map((key) => {
                    var _a;
                    const completionItem = new vscode.CompletionItem({
                        label: key,
                        description: (_a = attributes[key]) === null || _a === void 0 ? void 0 : _a.toString(),
                    }, vscode.CompletionItemKind.Variable);
                    let insertText = key;
                    insertText = prefix !== '{' ? `{${insertText}` : insertText;
                    insertText = suffix !== '}' ? `${insertText}}` : insertText;
                    completionItem.insertText = insertText;
                    return completionItem;
                });
            }
        });
    }
}
exports.AttributeReferenceProvider = AttributeReferenceProvider;
//# sourceMappingURL=attributeReferenceProvider.js.map