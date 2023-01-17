"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.PdfWatcher = void 0;
const vscode = __importStar(require("vscode"));
const chokidar = __importStar(require("chokidar"));
const lw = __importStar(require("../../lw"));
const logger_1 = require("../logger");
const logger = (0, logger_1.getLogger)('Cacher', 'PDF');
class PdfWatcher {
    constructor() {
        this.watchedPdfLocalPaths = new Set();
        this.watchedPdfVirtualUris = new Set();
        this.ignoredPdfUris = new Set();
        this.pdfWatcher = chokidar.watch([], this.getWatcherOptions());
        this.initializeWatcher();
        this.initiateVirtualUriWatcher();
        lw.registerDisposable(vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('latex-workshop.latex.watch.usePolling') ||
                e.affectsConfiguration('latex-workshop.latex.watch.interval') ||
                e.affectsConfiguration('latex-workshop.latex.watch.pdf.delay')) {
                void this.pdfWatcher.close();
                this.pdfWatcher = chokidar.watch([], this.getWatcherOptions());
                this.watchedPdfLocalPaths.forEach(filePath => this.pdfWatcher.add(filePath));
                this.initializeWatcher();
            }
        }));
    }
    async dispose() {
        await this.pdfWatcher.close();
    }
    toKey(fileUri) {
        return fileUri.toString(true);
    }
    initializeWatcher() {
        this.pdfWatcher.on('change', (file) => this.onWatchedPdfChanged(file));
        this.pdfWatcher.on('unlink', (file) => this.onWatchedPdfDeleted(file));
    }
    getWatcherOptions() {
        const configuration = vscode.workspace.getConfiguration('latex-workshop');
        return {
            useFsEvents: false,
            usePolling: configuration.get('latex.watch.usePolling'),
            interval: configuration.get('latex.watch.interval'),
            binaryInterval: Math.max(configuration.get('latex.watch.interval'), 1000),
            awaitWriteFinish: { stabilityThreshold: configuration.get('latex.watch.pdf.delay') }
        };
    }
    isWatchedVirtualUri(fileUri) {
        if (lw.lwfs.isVirtualUri(fileUri)) {
            const key = this.toKey(fileUri);
            return this.watchedPdfVirtualUris.has(key);
        }
        else {
            return false;
        }
    }
    initiateVirtualUriWatcher() {
        const virtualUriWatcher = vscode.workspace.createFileSystemWatcher('**/*.{pdf,PDF}', false, false, true);
        const cb = (fileUri) => {
            if (this.isIgnored(fileUri)) {
                return;
            }
            if (this.isWatchedVirtualUri(fileUri)) {
                lw.viewer.refreshExistingViewer();
            }
        };
        // It is recommended to react to both change and create events.
        // See https://github.com/microsoft/vscode/issues/136460#issuecomment-982605100
        virtualUriWatcher.onDidChange(cb);
        virtualUriWatcher.onDidCreate(cb);
        return virtualUriWatcher;
    }
    onWatchedPdfChanged(filePath) {
        if (this.isIgnored(filePath)) {
            return;
        }
        lw.viewer.refreshExistingViewer(undefined, filePath);
        logger.log(`Changed ${filePath} .`);
    }
    onWatchedPdfDeleted(filePath) {
        this.pdfWatcher.unwatch(filePath);
        this.watchedPdfLocalPaths.delete(filePath);
        logger.log(`Unlinked ${filePath} .`);
    }
    watchPdfFile(fileUri) {
        const isLocal = lw.lwfs.isLocalUri(fileUri);
        if (isLocal) {
            const pdfFilePath = fileUri.fsPath;
            if (!this.watchedPdfLocalPaths.has(pdfFilePath)) {
                this.pdfWatcher.add(pdfFilePath);
                this.watchedPdfLocalPaths.add(pdfFilePath);
                logger.log(`Watched ${fileUri.toString(true)} .`);
            }
        }
        else {
            this.watchedPdfVirtualUris.add(this.toKey(fileUri));
            logger.log(`Watched ${this.toKey(fileUri)} .`);
        }
    }
    isIgnored(file) {
        let pdfFileUri;
        if (typeof file === 'string') {
            pdfFileUri = vscode.Uri.file(file);
        }
        else {
            pdfFileUri = file;
        }
        const key = this.toKey(pdfFileUri);
        return this.ignoredPdfUris.has(key);
    }
    ignorePdfFile(fileUri) {
        this.ignoredPdfUris.add(this.toKey(fileUri));
    }
    logWatchedFiles() {
        logger.log(`${JSON.stringify(this.pdfWatcher.getWatched())}`);
        logger.log(`${JSON.stringify(Array.from(this.watchedPdfLocalPaths))}`);
        logger.log(`${JSON.stringify(Array.from(this.watchedPdfVirtualUris))}`);
        logger.log(`${JSON.stringify(Array.from(this.ignoredPdfUris))}`);
    }
}
exports.PdfWatcher = PdfWatcher;
//# sourceMappingURL=pdfwatcher.js.map