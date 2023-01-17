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
exports.BibWatcher = void 0;
const vscode = __importStar(require("vscode"));
const chokidar = __importStar(require("chokidar"));
const lw = __importStar(require("../../lw"));
const logger_1 = require("../logger");
const logger = (0, logger_1.getLogger)('Cacher', 'Bib');
class BibWatcher {
    constructor() {
        this.bibsWatched = new Set();
        this.bibWatcher = chokidar.watch([], this.getWatcherOptions());
        this.initializeWatcher();
        lw.registerDisposable(vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('latex-workshop.latex.watch.usePolling') ||
                e.affectsConfiguration('latex-workshop.latex.watch.interval') ||
                e.affectsConfiguration('latex-workshop.latex.watch.delay')) {
                void this.bibWatcher.close();
                this.bibWatcher = chokidar.watch([], this.getWatcherOptions());
                this.bibsWatched.forEach(filePath => this.bibWatcher.add(filePath));
                this.initializeWatcher();
            }
        }));
    }
    async dispose() {
        await this.bibWatcher.close();
    }
    initializeWatcher() {
        this.bibWatcher.on('change', (file) => this.onWatchedBibChanged(file));
        this.bibWatcher.on('unlink', (file) => this.onWatchedBibDeleted(file));
    }
    getWatcherOptions() {
        const configuration = vscode.workspace.getConfiguration('latex-workshop');
        return {
            useFsEvents: false,
            usePolling: configuration.get('latex.watch.usePolling'),
            interval: configuration.get('latex.watch.interval'),
            binaryInterval: Math.max(configuration.get('latex.watch.interval'), 1000),
            awaitWriteFinish: { stabilityThreshold: configuration.get('latex.watch.delay') }
        };
    }
    onWatchedBibChanged(filePath) {
        void lw.completer.citation.parseBibFile(filePath);
        void lw.builder.buildOnFileChanged(filePath, true);
        logger.log(`File changed ${filePath} .`);
    }
    onWatchedBibDeleted(filePath) {
        this.bibWatcher.unwatch(filePath);
        this.bibsWatched.delete(filePath);
        lw.completer.citation.removeEntriesInFile(filePath);
        logger.log(`File unlinked ${filePath} .`);
    }
    async watchBibFile(filePath) {
        if (!this.bibsWatched.has(filePath)) {
            this.bibWatcher.add(filePath);
            this.bibsWatched.add(filePath);
            logger.log(`File watched ${filePath} .`);
            await lw.completer.citation.parseBibFile(filePath);
        }
    }
    logWatchedFiles() {
        logger.log(`getWatched() => ${JSON.stringify(this.bibWatcher.getWatched())}`);
        logger.log(`bibsWatched() => ${JSON.stringify(Array.from(this.bibsWatched))}`);
    }
}
exports.BibWatcher = BibWatcher;
//# sourceMappingURL=bibwatcher.js.map