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
exports.Watcher = void 0;
const vscode = __importStar(require("vscode"));
const chokidar = __importStar(require("chokidar"));
const lw = __importStar(require("../../lw"));
const eventbus = __importStar(require("../eventbus"));
const cacherutils_1 = require("./cacherutils");
const logger_1 = require("../logger");
const logger = (0, logger_1.getLogger)('Cacher', 'Watcher');
class Watcher {
    constructor(cacher) {
        this.cacher = cacher;
        this.watched = new Set();
        this.watcher = chokidar.watch([], this.getWatcherOptions());
        this.initializeWatcher();
        this.registerOptionReload();
    }
    initializeWatcher() {
        this.watcher.on('add', (file) => this.onAdd(file));
        this.watcher.on('change', (file) => this.onChange(file));
        this.watcher.on('unlink', (file) => this.onUnlink(file));
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
    add(filePath) {
        this.watcher.add(filePath);
        this.watched.add(filePath);
    }
    has(filePath) {
        return this.watched.has(filePath);
    }
    async reset() {
        await this.watcher.close();
        this.watched.clear();
        this.initializeWatcher();
        logger.log('Reset.');
    }
    onAdd(filePath) {
        logger.log(`Watched ${filePath} .`);
        lw.eventBus.fire(eventbus.FileWatched, filePath);
    }
    onChange(filePath) {
        if (cacherutils_1.CacherUtils.canCache(filePath)) {
            void this.cacher.refreshCache(filePath);
        }
        void lw.builder.buildOnFileChanged(filePath);
        logger.log(`Changed ${filePath} .`);
        lw.eventBus.fire(eventbus.FileChanged, filePath);
    }
    onUnlink(filePath) {
        this.watcher.unwatch(filePath);
        this.watched.delete(filePath);
        this.cacher.remove(filePath);
        if (filePath === lw.manager.rootFile) {
            logger.log(`Root unlinked ${filePath} .`);
            lw.manager.rootFile = undefined;
            void lw.manager.findRoot();
        }
        else {
            logger.log(`Unlinked ${filePath} .`);
        }
        lw.eventBus.fire(eventbus.FileRemoved, filePath);
    }
    registerOptionReload() {
        lw.registerDisposable(vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('latex-workshop.latex.watch.usePolling') ||
                e.affectsConfiguration('latex-workshop.latex.watch.interval') ||
                e.affectsConfiguration('latex-workshop.latex.watch.delay')) {
                void this.watcher.close();
                const options = this.getWatcherOptions();
                this.watcher = chokidar.watch([], options);
                this.watched.forEach(filePath => this.watcher.add(filePath));
                this.initializeWatcher();
                logger.log(`Option ${JSON.stringify(options)}.`);
            }
            if (e.affectsConfiguration('latex-workshop.latex.watch.files.ignore')) {
                this.watched.forEach(filePath => {
                    if (!cacherutils_1.CacherUtils.isExcluded(filePath)) {
                        return;
                    }
                    this.watcher.unwatch(filePath);
                    this.watched.delete(filePath);
                    this.cacher.remove(filePath);
                    logger.log(`Ignored ${filePath} .`);
                    void lw.manager.findRoot();
                });
            }
        }));
    }
}
exports.Watcher = Watcher;
//# sourceMappingURL=texwatcher.js.map