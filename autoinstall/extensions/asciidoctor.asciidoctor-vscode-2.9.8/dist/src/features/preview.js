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
exports.AsciidocPreview = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const dispose_1 = require("../util/dispose");
const nls = __importStar(require("vscode-nls"));
const topmostLineMonitor_1 = require("../util/topmostLineMonitor");
const file_1 = require("../util/file");
const openDocumentLink_1 = require("../commands/openDocumentLink");
const localize = nls.loadMessageBundle();
class AsciidocPreview {
    constructor(webview, resource, locked, _contentProvider, _previewConfigurations, _logger, topmostLineMonitor, _contributions) {
        this._contentProvider = _contentProvider;
        this._previewConfigurations = _previewConfigurations;
        this._logger = _logger;
        this._contributions = _contributions;
        this.line = undefined;
        this.disposables = [];
        this.firstUpdate = true;
        this.forceUpdate = false;
        this.isScrolling = false;
        this._disposed = false;
        this.imageInfo = [];
        this._onDisposeEmitter = new vscode.EventEmitter();
        this.onDispose = this._onDisposeEmitter.event;
        this._onDidChangeViewStateEmitter = new vscode.EventEmitter();
        this.onDidChangeViewState = this._onDidChangeViewStateEmitter.event;
        this._resource = resource;
        this._locked = locked;
        this.editor = webview;
        this.config = vscode.workspace.getConfiguration('asciidoc', this.resource);
        this.refreshInterval = this.config.get('preview.refreshInterval');
        this.editor.onDidDispose(() => {
            this.dispose();
        }, null, this.disposables);
        this.editor.onDidChangeViewState((e) => {
            this._onDidChangeViewStateEmitter.fire(e);
        }, null, this.disposables);
        this.editor.webview.onDidReceiveMessage((e) => {
            if (e.source !== this._resource.toString()) {
                return;
            }
            switch (e.type) {
                case 'cacheImageSizes':
                    this.onCacheImageSizes(e.body);
                    break;
                case 'revealLine':
                    this.onDidScrollPreview(e.body.line);
                    break;
                case 'didClick':
                    this.onDidClickPreview(e.body.line);
                    break;
                case 'clickLink':
                    this.onDidClickPreviewLink(e.body.href);
                    break;
                case 'showPreviewSecuritySelector':
                    vscode.commands.executeCommand('asciidoc.showPreviewSecuritySelector', e.body.source);
                    break;
                case 'previewStyleLoadError':
                    vscode.window.showWarningMessage(localize('onPreviewStyleLoadError', "Could not load 'asciidoc.styles': {0}", e.body.unloadedStyles.join(', ')));
                    break;
            }
        }, null, this.disposables);
        vscode.workspace.onDidChangeTextDocument((event) => {
            if (this.isPreviewOf(event.document.uri)) {
                this.refresh();
            }
        }, null, this.disposables);
        topmostLineMonitor.onDidChangeTopmostLine((event) => {
            if (this.isPreviewOf(event.resource)) {
                this.updateForView(event.resource, event.line);
            }
        }, null, this.disposables);
        vscode.window.onDidChangeTextEditorSelection((event) => {
            if (this.isPreviewOf(event.textEditor.document.uri)) {
                this.postMessage({
                    type: 'onDidChangeTextEditorSelection',
                    line: event.selections[0].active.line,
                    source: this.resource.toString(),
                });
            }
        }, null, this.disposables);
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor && (0, file_1.isAsciidocFile)(editor.document) && !this._locked) {
                this.update(editor.document.uri);
            }
        }, null, this.disposables);
    }
    static revive(webview, state, contentProvider, previewConfigurations, logger, topmostLineMonitor, contributions) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = vscode.Uri.parse(state.resource);
            const locked = state.locked;
            const line = state.line;
            const preview = new AsciidocPreview(webview, resource, locked, contentProvider, previewConfigurations, logger, topmostLineMonitor, contributions);
            preview.editor.webview.options = AsciidocPreview.getWebviewOptions(resource, contributions);
            if (!isNaN(line)) {
                preview.line = line;
            }
            yield preview.doUpdate();
            return preview;
        });
    }
    static create(resource, previewColumn, locked, contentProvider, previewConfigurations, logger, topmostLineMonitor, contributions) {
        const webview = vscode.window.createWebviewPanel(AsciidocPreview.viewType, AsciidocPreview.getPreviewTitle(resource, locked), previewColumn, Object.assign({ enableFindWidget: true }, AsciidocPreview.getWebviewOptions(resource, contributions)));
        return new AsciidocPreview(webview, resource, locked, contentProvider, previewConfigurations, logger, topmostLineMonitor, contributions);
    }
    get resource() {
        return this._resource;
    }
    get state() {
        return {
            resource: this.resource.toString(),
            locked: this._locked,
            line: this.line,
            imageInfo: this.imageInfo,
        };
    }
    dispose() {
        if (this._disposed) {
            return;
        }
        this._disposed = true;
        this._onDisposeEmitter.fire();
        this._onDisposeEmitter.dispose();
        this._onDidChangeViewStateEmitter.dispose();
        this.editor.dispose();
        (0, dispose_1.disposeAll)(this.disposables);
    }
    // This method is invoked evrytime there is a document update
    update(resource) {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.uri.fsPath === resource.fsPath) {
            this.line = (0, topmostLineMonitor_1.getVisibleLine)(editor);
        }
        // If we have changed resources, cancel any pending updates
        const isResourceChange = resource.fsPath !== this._resource.fsPath;
        if (isResourceChange) {
            clearTimeout(this.throttleTimer);
            this.throttleTimer = undefined;
        }
        this._resource = resource;
        // Schedule update if none is pending
        if (!this.throttleTimer) {
            if (isResourceChange || this.firstUpdate || this.forceUpdate) {
                this.doUpdate();
            }
            else {
                if (this.refreshInterval > 0) {
                    this.throttleTimer = setTimeout(() => this.doUpdate(), this.refreshInterval);
                }
            }
        }
        this.firstUpdate = false;
    }
    refresh(forceUpdate = false) {
        this.forceUpdate = forceUpdate;
        this.update(this._resource);
    }
    updateConfiguration() {
        if (this._previewConfigurations.hasConfigurationChanged(this._resource)) {
            this.config = vscode.workspace.getConfiguration('asciidoc', this.resource);
            this.refreshInterval = this.config.get('preview.refreshInterval');
            this.refresh();
        }
    }
    get position() {
        return this.editor.viewColumn;
    }
    matchesResource(otherResource, otherPosition, otherLocked) {
        if (this.position !== otherPosition) {
            return false;
        }
        if (this._locked) {
            return otherLocked && this.isPreviewOf(otherResource);
        }
        else {
            return !otherLocked;
        }
    }
    matches(otherPreview) {
        return this.matchesResource(otherPreview._resource, otherPreview.position, otherPreview._locked);
    }
    reveal(viewColumn) {
        this.editor.reveal(viewColumn);
    }
    toggleLock() {
        this._locked = !this._locked;
        this.editor.title = AsciidocPreview.getPreviewTitle(this._resource, this._locked);
    }
    get iconPath() {
        const root = vscode.Uri.joinPath(this._contributions.extensionUri, 'media');
        return {
            light: vscode.Uri.joinPath(root, 'preview-light.svg'),
            dark: vscode.Uri.joinPath(root, 'preview-dark.svg'),
        };
    }
    isPreviewOf(resource) {
        return this._resource.fsPath === resource.fsPath;
    }
    static getPreviewTitle(resource, locked) {
        return locked
            ? localize('lockedPreviewTitle', '[Preview] {0}', path.basename(resource.fsPath))
            : localize('previewTitle', 'Preview {0}', path.basename(resource.fsPath));
    }
    updateForView(resource, topLine) {
        if (!this.isPreviewOf(resource)) {
            return;
        }
        if (this.isScrolling) {
            this.isScrolling = false;
            return;
        }
        if (typeof topLine === 'number') {
            this.line = topLine;
            this.postMessage({
                type: 'updateView',
                line: topLine,
                source: resource.toString(),
            });
        }
    }
    postMessage(msg) {
        if (!this._disposed) {
            this.editor.webview.postMessage(msg);
        }
    }
    // Do the preview content update
    doUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.log('Updating the preview content');
            const resource = this._resource;
            clearTimeout(this.throttleTimer);
            this.throttleTimer = undefined;
            const document = yield vscode.workspace.openTextDocument(resource);
            if (!this.forceUpdate && this.currentVersion &&
                this.currentVersion.resource.fsPath === resource.fsPath &&
                this.currentVersion.version === document.version) {
                if (this.line) {
                    this.updateForView(resource, this.line);
                }
                return;
            }
            this.forceUpdate = false;
            this.currentVersion = { resource, version: document.version };
            // add webView
            if (this._resource === resource) {
                this.editor.title = AsciidocPreview.getPreviewTitle(this._resource, this._locked);
            }
            this.editor.iconPath = this.iconPath;
            this.editor.webview.options = AsciidocPreview.getWebviewOptions(resource, this._contributions);
            const content = yield this._contentProvider.providePreviewHTML(document, this._previewConfigurations, this.line, this.state, this.editor);
            this.editor.webview.html = content;
        });
    }
    static getWebviewOptions(resource, contributions) {
        return {
            enableScripts: true,
            enableCommandUris: true,
            localResourceRoots: AsciidocPreview.getLocalResourceRoots(resource, contributions),
        };
    }
    static getLocalResourceRoots(resource, contributions) {
        const baseRoots = [
            vscode.Uri.joinPath(contributions.extensionUri, 'media'),
            vscode.Uri.joinPath(contributions.extensionUri, 'dist'),
        ];
        const folder = vscode.workspace.getWorkspaceFolder(resource);
        if (folder) {
            return baseRoots.concat(folder.uri);
        }
        if (!resource.scheme || resource.scheme === 'file') {
            return baseRoots.concat(vscode.Uri.file(path.dirname(resource.fsPath)));
        }
        return baseRoots;
    }
    onDidScrollPreview(line) {
        this.line = line;
        for (const editor of vscode.window.visibleTextEditors) {
            if (!this.isPreviewOf(editor.document.uri)) {
                continue;
            }
            this.isScrolling = true;
            const sourceLine = Math.floor(line);
            const fraction = line - sourceLine;
            const text = editor.document.lineAt(sourceLine).text;
            const start = Math.floor(fraction * text.length);
            editor.revealRange(new vscode.Range(sourceLine, start, sourceLine + 1, 0), vscode.TextEditorRevealType.AtTop);
        }
    }
    onDidClickPreview(line) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const visibleEditor of vscode.window.visibleTextEditors) {
                if (this.isPreviewOf(visibleEditor.document.uri)) {
                    const editor = yield vscode.window.showTextDocument(visibleEditor.document, visibleEditor.viewColumn);
                    const position = new vscode.Position(line, 0);
                    editor.selection = new vscode.Selection(position, position);
                    return;
                }
            }
            vscode.workspace.openTextDocument(this._resource).then(vscode.window.showTextDocument);
        });
    }
    onDidClickPreviewLink(href) {
        return __awaiter(this, void 0, void 0, function* () {
            let [hrefPath, fragment] = decodeURIComponent(href).split('#');
            // From Markdown plugin
            if (hrefPath[0] !== '/') {
                hrefPath = path.join(path.dirname(this.resource.fsPath), hrefPath);
            }
            else {
                // Handle any normalized file paths
                hrefPath = vscode.Uri.parse(hrefPath.replace('/file', '')).fsPath;
            }
            const openLinks = this.config.get('preview.openAsciidocLinks', 'inPreview');
            if (openLinks === 'inPreview') {
                const asciidocLink = yield (0, openDocumentLink_1.resolveLinkToAsciidocFile)(hrefPath);
                if (asciidocLink) {
                    this.update(asciidocLink);
                    return;
                }
            }
            vscode.commands.executeCommand('_asciidoc.openDocumentLink', { path, fragment });
        });
    }
    onCacheImageSizes(imageInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            this.imageInfo = imageInfo;
        });
    }
}
exports.AsciidocPreview = AsciidocPreview;
AsciidocPreview.viewType = 'asciidoc.preview';
//# sourceMappingURL=preview.js.map