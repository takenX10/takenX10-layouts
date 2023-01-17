"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasteImage = void 0;
const vscode_1 = require("vscode");
const image_paste_1 = require("../image-paste");
class PasteImage {
    constructor() {
        this.id = 'asciidoc.pasteImage';
    }
    execute() {
        try {
            image_paste_1.Import.Image.importFromClipboard(undefined);
        }
        catch (e) {
            vscode_1.window.showErrorMessage(e);
        }
    }
}
exports.PasteImage = PasteImage;
//# sourceMappingURL=pasteImage.js.map