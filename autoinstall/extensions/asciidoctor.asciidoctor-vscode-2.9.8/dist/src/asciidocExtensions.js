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
exports.getAsciidocExtensionContributions = void 0;
const vscode = __importStar(require("vscode"));
class AsciidocExtensionContributions {
    constructor(_extensionContext) {
        this._extensionContext = _extensionContext;
        this._scripts = [];
        this._stylesEditor = [];
        this._stylesDefault = [];
        this._previewResourceRoots = [];
        this._plugins = [];
        this._loaded = false;
    }
    get extensionUri() { return this._extensionContext.extensionUri; }
    get previewScripts() {
        this.ensureLoaded();
        return this._scripts;
    }
    get previewStylesEditor() {
        this.ensureLoaded();
        return this._stylesEditor;
    }
    get previewStylesDefault() {
        this.ensureLoaded();
        return this._stylesDefault;
    }
    get previewResourceRoots() {
        this.ensureLoaded();
        return this._previewResourceRoots;
    }
    get asciidocItPlugins() {
        this.ensureLoaded();
        return this._plugins;
    }
    ensureLoaded() {
        if (this._loaded) {
            return;
        }
        this._loaded = true;
        for (const extension of vscode.extensions.all) {
            const contributes = extension.packageJSON && extension.packageJSON.contributes;
            if (!contributes) {
                continue;
            }
        }
    }
}
function getAsciidocExtensionContributions(context) {
    return new AsciidocExtensionContributions(context);
}
exports.getAsciidocExtensionContributions = getAsciidocExtensionContributions;
//# sourceMappingURL=asciidocExtensions.js.map