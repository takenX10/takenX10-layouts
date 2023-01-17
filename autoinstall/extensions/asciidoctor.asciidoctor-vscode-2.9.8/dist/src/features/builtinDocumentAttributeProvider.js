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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuiltinDocumentAttributeProvider = void 0;
const vscode = __importStar(require("vscode"));
const builtinDocumentAttribute_json_1 = __importDefault(require("./builtinDocumentAttribute.json"));
class BuiltinDocumentAttributeProvider {
    constructor(extensionUri) {
        this.extensionUri = extensionUri;
        this.completionItems = Object.keys(builtinDocumentAttribute_json_1.default).map((key) => {
            const value = builtinDocumentAttribute_json_1.default[key];
            const completionItem = new vscode.CompletionItem({ label: value.label, description: value.description }, vscode.CompletionItemKind.Text);
            completionItem.insertText = new vscode.SnippetString(value.insertText);
            return completionItem;
        });
    }
    provideCompletionItems(textDocument, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const linePrefix = textDocument.lineAt(position).text.substr(0, position.character);
            if (linePrefix !== ':') {
                return undefined;
            }
            return this.completionItems;
        });
    }
}
exports.BuiltinDocumentAttributeProvider = BuiltinDocumentAttributeProvider;
//# sourceMappingURL=builtinDocumentAttributeProvider.js.map