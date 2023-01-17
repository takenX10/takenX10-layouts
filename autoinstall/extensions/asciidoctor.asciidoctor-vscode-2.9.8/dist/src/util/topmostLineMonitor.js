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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisibleLine = exports.AsciidocFileTopmostLineMonitor = void 0;
const vscode = __importStar(require("vscode"));
const dispose_1 = require("../util/dispose");
const file_1 = require("./file");
class AsciidocFileTopmostLineMonitor {
    constructor() {
        this.disposables = [];
        this.pendingUpdates = new Map();
        this.throttle = 50;
        this._onDidChangeTopmostLineEmitter = new vscode.EventEmitter();
        this.onDidChangeTopmostLine = this._onDidChangeTopmostLineEmitter.event;
        vscode.window.onDidChangeTextEditorVisibleRanges((event) => {
            if ((0, file_1.isAsciidocFile)(event.textEditor.document)) {
                const line = getVisibleLine(event.textEditor);
                if (typeof line === 'number') {
                    this.updateLine(event.textEditor.document.uri, line);
                }
            }
        }, null, this.disposables);
    }
    dispose() {
        (0, dispose_1.disposeAll)(this.disposables);
    }
    updateLine(resource, line) {
        const key = resource.toString();
        if (!this.pendingUpdates.has(key)) {
            // schedule update
            setTimeout(() => {
                if (this.pendingUpdates.has(key)) {
                    this._onDidChangeTopmostLineEmitter.fire({
                        resource,
                        line: this.pendingUpdates.get(key),
                    });
                    this.pendingUpdates.delete(key);
                }
            }, this.throttle);
        }
        this.pendingUpdates.set(key, line);
    }
}
exports.AsciidocFileTopmostLineMonitor = AsciidocFileTopmostLineMonitor;
/**
 * Get the top-most visible range of `editor`.
 *
 * Returns a fractional line number based the visible character within the line.
 * Floor to get real line number
 */
function getVisibleLine(editor) {
    if (!editor.visibleRanges.length) {
        return undefined;
    }
    const firstVisiblePosition = editor.visibleRanges[0].start;
    const lineNumber = firstVisiblePosition.line;
    const line = editor.document.lineAt(lineNumber);
    const progress = firstVisiblePosition.character / (line.text.length + 2);
    return lineNumber + progress;
}
exports.getVisibleLine = getVisibleLine;
//# sourceMappingURL=topmostLineMonitor.js.map