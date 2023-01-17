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
exports.Import = void 0;
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const asciidocParser_1 = require("./asciidocParser");
var Import;
(function (Import) {
    /**
     * What part of the image macro should the selection be used for.
     *
     * e.g. image::filename[alt-text]
     */
    let SelectionRole;
    (function (SelectionRole) {
        SelectionRole[SelectionRole["Filename"] = 0] = "Filename";
        SelectionRole[SelectionRole["AltText"] = 1] = "AltText";
        SelectionRole[SelectionRole["None"] = 2] = "None";
    })(SelectionRole || (SelectionRole = {}));
    /**
     * Controls how the image filename should be encoded, if at all.
     */
    let FilenameEncoding;
    (function (FilenameEncoding) {
        FilenameEncoding[FilenameEncoding["None"] = 0] = "None";
        FilenameEncoding[FilenameEncoding["URIEncoding"] = 1] = "URIEncoding";
    })(FilenameEncoding || (FilenameEncoding = {}));
    /**
     * Controls if the selection is to be replaced with the image macro, or the
     * image macro is to be inserted at the selection-cursor.
     *
     * e.g. |selection| => ||image:...[]
     *      |selection| => |selection|image:...[]
     */
    let SelectionMode;
    (function (SelectionMode) {
        SelectionMode[SelectionMode["Insert"] = 0] = "Insert";
        SelectionMode[SelectionMode["Replace"] = 1] = "Replace";
    })(SelectionMode || (SelectionMode = {}));
    class Configuration {
        constructor() {
            this.DocumentDirectory = '';
            this.selectionRole = SelectionRole.Filename;
            this.encoding = FilenameEncoding.URIEncoding;
            this.mode = SelectionMode.Replace;
        }
    }
    Import.Configuration = Configuration;
    let SelectionContext;
    (function (SelectionContext) {
        SelectionContext[SelectionContext["Inline"] = 0] = "Inline";
        SelectionContext[SelectionContext["Block"] = 1] = "Block";
        SelectionContext[SelectionContext["Other"] = 2] = "Other";
    })(SelectionContext || (SelectionContext = {}));
    class ScriptArgumentError extends Error {
    }
    class Image {
        /**
         * Saves an image from the clipboard.
         * @param filename the filename of the image file
         */
        static saveImageFromClipboard(filename) {
            const platform = process.platform;
            if (platform === 'win32') {
                const script = path.join(__dirname, '../../res/pc.ps1');
                const promise = new Promise((resolve, reject) => {
                    const child = (0, child_process_1.spawn)('powershell', [
                        '-noprofile',
                        '-noninteractive',
                        '-nologo',
                        '-sta',
                        '-executionpolicy',
                        'unrestricted',
                        '-windowstyle',
                        'hidden',
                        '-file',
                        `${script}`,
                        `${filename}`,
                    ]);
                    child.stdout.once('data', (e) => resolve(e.toString()));
                    child.stderr.once('data', (e) => {
                        const exception = e.toString().trim();
                        if (exception ===
                            'Exception calling "Open" with "2" argument(s): "Could not find a part of the path') {
                            reject(new ScriptArgumentError('bad path exception'));
                        }
                        else if (exception === 'no image') {
                            reject(new ScriptArgumentError('no image exception'));
                        }
                        else if (exception === 'no filename') {
                            reject(new ScriptArgumentError('no filename exception'));
                        }
                    });
                    child.once('error', (e) => reject(e));
                });
                return promise;
            }
            else if (platform === 'darwin') {
                // Mac
                const scriptPath = path.join(__dirname, '../../res/mac.applescript');
                const promise = new Promise((resolve, reject) => {
                    const child = (0, child_process_1.spawn)('osascript', [scriptPath, filename]);
                    child.stdout.once('data', (e) => resolve(e.toString()));
                    child.stderr.once('data', (e) => {
                        console.log(`stderr: ${e}`);
                        const exception = e.toString().trim();
                        if (exception === 'no image') {
                            reject(new ScriptArgumentError('no image exception'));
                        }
                        else {
                            reject(exception);
                        }
                    });
                });
                return promise;
            }
            else {
                // Linux
                const scriptPath = path.join(__dirname, '../../res/linux.sh');
                const promise = new Promise((resolve, reject) => {
                    const child = (0, child_process_1.spawn)(`"${scriptPath}"`, [`"${filename}"`], { shell: true });
                    child.stdout.once('data', (e) => resolve(e.toString()));
                    child.stderr.once('data', (e) => {
                        const exception = e.toString().trim();
                        if (exception === 'no xclip') {
                            reject(new ScriptArgumentError('no xclip'));
                        }
                        else if (exception === 'no image') {
                            reject(new ScriptArgumentError('no image exception'));
                        }
                        else {
                            reject(exception);
                        }
                    });
                });
                return promise;
            }
        }
        static importFromClipboard(config) {
            return __awaiter(this, void 0, void 0, function* () {
                config = config || new Configuration();
                const editor = vscode.window.activeTextEditor;
                const currentDateString = new Date()
                    .toISOString()
                    .replace(':', '-')
                    .replace('.', '-');
                //default filename
                let filename = `${currentDateString}.png`;
                let alttext = ''; //todo:...
                const directory = yield this.getCurrentImagesDir();
                // confirm directory is local--asciidoctor allows external URIs. test for
                // protocol (http, ftp, etc) to determine this
                const remote = /'^(?:[a-z]+:)?\\/i.test(directory);
                if (remote) {
                    vscode.window.showWarningMessage('Cannot determine save location for image because `imagesdir` attribute references a remote location.');
                    return;
                }
                // grab the selected text & update either the alt-attribute or filename
                // corresponding to the selection role.
                const selectedText = editor.document.getText(editor.selection);
                if (!editor.selection.isEmpty) {
                    switch (config.selectionRole) {
                        case SelectionRole.AltText:
                            alttext = selectedText;
                            break;
                        case SelectionRole.Filename:
                            filename = selectedText + '.png';
                            break;
                    }
                }
                switch (config.encoding) {
                    case FilenameEncoding.URIEncoding:
                        filename = encodeURIComponent(filename);
                        break;
                }
                try {
                    const docDir = path.dirname(vscode.window.activeTextEditor.document.uri.fsPath);
                    // docDir === '.' if a document has not yet been saved
                    if (docDir === '.') {
                        vscode.window.showErrorMessage('To allow images to be saved, first save your document.');
                        return;
                    }
                    yield this.saveImageFromClipboard(path.join(docDir, directory, filename));
                }
                catch (error) {
                    if (error instanceof ScriptArgumentError) {
                        if (error.message === 'bad path exception') {
                            const folder = path.join(vscode.workspace.rootPath, directory);
                            vscode.window
                                .showErrorMessage(`The imagesdir folder was not found (${folder}).`, 'Create Folder & Retry')
                                .then((value) => __awaiter(this, void 0, void 0, function* () {
                                if (value === 'Create Folder & Retry') {
                                    fs.mkdirSync(folder);
                                    this.importFromClipboard(config); // try again
                                }
                            }));
                        }
                        else if (error.message === 'no image exception') {
                            vscode.window.showInformationMessage('An image was not found on the clipboard.');
                        }
                        else if (error.message === 'no filename exception') {
                            vscode.window.showErrorMessage('Missing image filename argument.');
                        }
                        else if (error.message === 'no xclip') {
                            vscode.window.showErrorMessage('To use this feature you must install xclip');
                        }
                    }
                    else {
                        vscode.window.showErrorMessage(error.toString());
                    }
                    return;
                }
                const isInline = Image.predict(config.mode, Image.modifiedLines(editor), editor.selection.anchor.character, selectedText);
                let macro = `image${isInline ? ':' : '::'}${filename}[${alttext}]`;
                macro = Image.padMacro(config, editor, macro);
                editor.edit((edit) => {
                    switch (config.mode) {
                        case SelectionMode.Insert:
                            edit.insert(editor.selection.active, macro);
                            break;
                        case SelectionMode.Replace:
                            edit.replace(editor.selection, macro);
                            break;
                    }
                });
            });
        }
        // todo: tag functionl
        static padMacro(config, editor, macro) {
            const { first, second } = config.mode === SelectionMode.Replace
                ? editor.selection.active.isAfter(editor.selection.anchor)
                    ? {
                        first: editor.selection.anchor,
                        second: editor.selection.active,
                    }
                    : {
                        first: editor.selection.active,
                        second: editor.selection.anchor,
                    }
                : { first: editor.selection.active, second: editor.selection.active };
            const selection = editor.document.getText(new vscode.Range(first.translate(0, first.character > 0 ? -1 : 0), second.translate(0, 1)));
            const padHead = first.character !== 0 && !/^\s/.test(selection);
            const padTail = !/\s$/.test(selection);
            macro = `${padHead ? ' ' : ''}${macro}${padTail ? ' ' : ''}`;
            return macro;
        }
        /**
         * Returns the lines that will be effected by the current editor selection
         */
        static modifiedLines(editor) {
            const affectedLines = new vscode.Range(editor.selection.start.line, 0, editor.selection.end.line + 1, 0);
            const affectedText = editor.document.getText(affectedLines);
            return affectedText;
        }
        /**
         * Determines if the resulting image-macro is an inline-image or
         * block-image.
         */
        static predict(selectionMode, affectedText, index, 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        selectedText) {
            // does the macro start at the beginning of the line and end in only
            // whitespace.
            return !((index === 0 && /^\s+$/.test(affectedText)) || /^\s+$|^\S+$/.test(affectedText));
        }
        /**
         * Reads the current `:imagesdir:` [attribute](https://asciidoctor.org/docs/user-manual/#setting-the-location-of-images) from the document.
         *
         *
         * Reads the _nearest_ `:imagesdir:` attribute that appears _before_ the current selection
         * or cursor location, failing that figures it out from the API by converting the document and reading the attribute
         */
        static getCurrentImagesDir() {
            return __awaiter(this, void 0, void 0, function* () {
                const text = vscode.window.activeTextEditor.document.getText();
                const imagesdir = /^[\t\f]*?:imagesdir:\s+(.+?)\s+$/gim;
                let matches = imagesdir.exec(text);
                const index = vscode.window.activeTextEditor.selection.start;
                const cursorIndex = vscode.window.activeTextEditor.document.offsetAt(index);
                let dir = '';
                while (matches && matches.index < cursorIndex) {
                    dir = matches[1] || '';
                    matches = imagesdir.exec(text);
                }
                if (dir === '') {
                    const textDocument = vscode.window.activeTextEditor.document;
                    const extensionUri = vscode.Uri.file(''); // won't be used anyway... needs refactoring!
                    const { document } = yield new asciidocParser_1.AsciidocParser(extensionUri).parseText(textDocument.getText(), textDocument);
                    if (document) {
                        dir = document.getAttribute('imagesdir');
                    }
                }
                return dir !== undefined ? dir : '';
            });
        }
        /**
         * Checks if the given editor is a valid condidate _file_ for pasting images into.
         * @param editor vscode editor to check.
         */
        static isCandidateFile(document) {
            return document.uri.scheme === 'file';
        }
        /**
         * Checks if the given selected text is a valid _filename_ for an image.
         * @param selection Selected text to check.
         */
        static isCandidateSelection(selection) {
            return encodeURIComponent(selection) === selection;
        }
        /**
         * Checks if the current selection is an `inline` element of the document.
         */
        static isInline(document, selection) {
            const line = document.lineAt(selection.start).text;
            const selectedText = document.getText(selection);
            const selectedTextIsBlock = new RegExp(`^${selectedText}\\w*$`);
            return selection.isSingleLine && !selectedTextIsBlock.test(line);
        }
        /**
         * Determines the context of the selection in the document.
         */
        static getSelectionContext(document, selection) {
            // const line = document.lineAt(selection.start).text
            const selectedText = document.getText(selection);
            const selectedTextIsBlock = new RegExp(`^${selectedText}\\w*$`);
            if (!selection.isSingleLine) {
                return SelectionContext.Other;
            }
            else if (selectedTextIsBlock) {
                return SelectionContext.Block;
            }
            else {
                return SelectionContext.Inline;
            }
        }
        static validate(required) {
            if (!this.isCandidateFile(required.editor.document)) {
                return false;
            }
            return true;
        }
        static isValidFilename(selection) {
            if (!this.isCandidateSelection(selection)) {
                return { result: false, value: encodeURIComponent(selection) };
            }
            return { result: true, value: selection };
        }
    }
    Import.Image = Image;
})(Import = exports.Import || (exports.Import = {}));
//# sourceMappingURL=image-paste.js.map