"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractExtension = exports.createContext = void 0;
function createContext(document, position) {
    const textFullLine = document.getText(document.lineAt(position).range);
    const documentExtension = extractExtension(document);
    return {
        textFullLine,
        document,
        documentExtension,
        position,
    };
}
exports.createContext = createContext;
function extractExtension(document) {
    if (document.isUntitled) {
        return undefined;
    }
    const fragments = document.fileName.split('.');
    const extension = fragments[fragments.length - 1];
    if (!extension || extension.length > 3) {
        return undefined;
    }
    return extension;
}
exports.extractExtension = extractExtension;
//# sourceMappingURL=createContext.js.map