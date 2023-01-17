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
exports.provideCompletionItems = exports.BibtexProvider = void 0;
const vscode = __importStar(require("vscode"));
const createContext_1 = require("./createContext");
const fs_1 = require("fs");
const bibtexParse = require('@orcid/bibtex-parse-js');
exports.BibtexProvider = {
    provideCompletionItems,
};
function provideCompletionItems(document, position) {
    return __awaiter(this, void 0, void 0, function* () {
        const context = (0, createContext_1.createContext)(document, position);
        return shouldProvide(context) ? provide(context) : Promise.resolve([]);
    });
}
exports.provideCompletionItems = provideCompletionItems;
/**
 * Checks if we should provide any CompletionItems
 * @param context
 */
function shouldProvide(context) {
    const keyword = 'citenp:';
    // Check if cursor is after citenp:
    const occurence = context.textFullLine.indexOf(keyword, context.position.character - keyword.length);
    return occurence === context.position.character - keyword.length;
}
function getCitationKeys() {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield vscode.workspace.findFiles('*.bib');
        const filesContent = files.map((file) => (0, fs_1.readFileSync)(file.path).toString('utf-8'));
        const bibtexJson = filesContent.map((content) => bibtexParse.toJSON(content));
        const flatMap = (f, xs) => xs.reduce((r, x) => r.concat(f(x)), []);
        return flatMap((jsons) => jsons.map((entries) => entries.citationKey), bibtexJson);
    });
}
/**
 * Provide Completion Items
 */
function provide(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { textFullLine, position } = context;
        const indexOfNextWhiteSpace = textFullLine.includes(' ', position.character)
            ? textFullLine.indexOf(' ', position.character)
            : textFullLine.length;
        //Find the text between citenp: and the next whitespace character
        const bibtexSearch = textFullLine.substring(textFullLine.lastIndexOf(':', position.character + 1) + 1, indexOfNextWhiteSpace);
        const citationKeys = yield getCitationKeys();
        return citationKeys
            .filter((citationKeys) => citationKeys.match(bibtexSearch))
            .map((citationKey) => ({
            label: `[${citationKey}]`,
            kind: vscode.CompletionItemKind.Reference,
        }));
    });
}
//# sourceMappingURL=bibtex.provider.js.map