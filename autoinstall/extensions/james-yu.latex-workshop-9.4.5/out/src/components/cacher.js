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
exports.Cacher = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const lw = __importStar(require("../lw"));
const eventbus = __importStar(require("./eventbus"));
const utils = __importStar(require("../utils/utils"));
const inputfilepath_1 = require("../utils/inputfilepath");
const cacherutils_1 = require("./cacherlib/cacherutils");
const pathutils_1 = require("./cacherlib/pathutils");
const texwatcher_1 = require("./cacherlib/texwatcher");
const pdfwatcher_1 = require("./cacherlib/pdfwatcher");
const bibwatcher_1 = require("./cacherlib/bibwatcher");
const logger_1 = require("./logger");
const syntax_1 = require("./parser/syntax");
const logger = (0, logger_1.getLogger)('Cacher');
class Cacher {
    constructor() {
        this.caches = {};
        this.watcher = new texwatcher_1.Watcher(this);
        this.pdfWatcher = new pdfwatcher_1.PdfWatcher();
        this.bibWatcher = new bibwatcher_1.BibWatcher();
    }
    add(filePath) {
        if (cacherutils_1.CacherUtils.isExcluded(filePath)) {
            logger.log(`Ignored ${filePath} .`);
            return;
        }
        if (!this.watcher.has(filePath)) {
            logger.log(`Adding ${filePath} .`);
            this.watcher.add(filePath);
        }
    }
    remove(filePath) {
        if (!(filePath in this.caches)) {
            return;
        }
        delete this.caches[filePath];
        logger.log(`Removed ${filePath} .`);
    }
    has(filePath) {
        return Object.keys(this.caches).includes(filePath);
    }
    get(filePath) {
        return this.caches[filePath];
    }
    get allPaths() {
        return Object.keys(this.caches);
    }
    watched(filePath) {
        return this.watcher.has(filePath);
    }
    async resetWatcher() {
        await this.watcher.reset();
    }
    async dispose() {
        await this.watcher.watcher.close();
        await this.pdfWatcher.dispose();
        await this.bibWatcher.dispose();
    }
    async refreshCache(filePath, rootPath) {
        if (cacherutils_1.CacherUtils.isExcluded(filePath)) {
            logger.log(`Ignored ${filePath} .`);
            return;
        }
        if (!cacherutils_1.CacherUtils.canCache(filePath)) {
            return;
        }
        logger.log(`Caching ${filePath} .`);
        const content = lw.lwfs.readFileSyncGracefully(filePath);
        this.caches[filePath] = { content, elements: {}, children: [], bibfiles: new Set() };
        if (content === undefined) {
            logger.log(`Cannot read ${filePath} .`);
            return;
        }
        const contentTrimmed = utils.stripCommentsAndVerbatim(content);
        rootPath = rootPath || lw.manager.rootFile;
        this.updateChildren(filePath, rootPath, contentTrimmed);
        await this.updateElements(filePath, content, contentTrimmed);
        await this.updateBibfiles(filePath, contentTrimmed);
        logger.log(`Cached ${filePath} .`);
        void lw.structureViewer.computeTreeStructure();
        lw.eventBus.fire(eventbus.FileParsed, filePath);
    }
    updateChildren(filePath, rootPath, contentTrimmed) {
        rootPath = rootPath || filePath;
        const inputFileRegExp = new inputfilepath_1.InputFileRegExp();
        while (true) {
            const result = inputFileRegExp.exec(contentTrimmed, filePath, rootPath);
            if (!result) {
                break;
            }
            if (!fs.existsSync(result.path) || path.relative(result.path, rootPath) === '') {
                continue;
            }
            this.caches[rootPath].children.push({
                index: result.match.index,
                file: result.path
            });
            logger.log(`Input ${result.path} from ${filePath} .`);
            if (this.watcher.has(result.path)) {
                continue;
            }
            this.add(result.path);
            void this.refreshCache(result.path, rootPath);
        }
        logger.log(`Updated inputs of ${filePath} .`);
    }
    async updateElements(filePath, content, contentTrimmed) {
        lw.completer.citation.update(filePath, content);
        const languageId = vscode.window.activeTextEditor?.document.languageId;
        let latexAst = undefined;
        if (!languageId || languageId !== 'latex-expl3') {
            latexAst = await syntax_1.UtensilsParser.parseLatex(content);
        }
        if (latexAst) {
            const nodes = latexAst.content;
            const lines = content.split('\n');
            lw.completer.reference.update(filePath, nodes, lines);
            lw.completer.glossary.update(filePath, nodes);
            lw.completer.environment.update(filePath, nodes, lines);
            lw.completer.command.update(filePath, nodes);
        }
        else {
            logger.log(`Cannot parse AST, use RegExp on ${filePath} .`);
            lw.completer.reference.update(filePath, undefined, undefined, contentTrimmed);
            lw.completer.glossary.update(filePath, undefined, contentTrimmed);
            lw.completer.environment.update(filePath, undefined, undefined, contentTrimmed);
            lw.completer.command.update(filePath, undefined, contentTrimmed);
        }
        lw.duplicateLabels.run(filePath);
        logger.log(`Updated elements of ${filePath} .`);
    }
    async updateBibfiles(filePath, contentTrimmed) {
        const bibReg = /(?:\\(?:bibliography|addbibresource)(?:\[[^[\]{}]*\])?){(.+?)}|(?:\\putbib)\[(.+?)\]/g;
        while (true) {
            const result = bibReg.exec(contentTrimmed);
            if (!result) {
                break;
            }
            const bibs = (result[1] ? result[1] : result[2]).split(',').map(bib => bib.trim());
            for (const bib of bibs) {
                const bibPath = pathutils_1.PathUtils.resolveBibPath(bib, path.dirname(filePath));
                if (bibPath === undefined) {
                    continue;
                }
                this.caches[filePath].bibfiles.add(bibPath);
                logger.log(`Bib ${bibPath} from ${filePath} .`);
                await this.bibWatcher.watchBibFile(bibPath);
            }
        }
        logger.log(`Updated bibs of ${filePath} .`);
    }
    /**
     * Parses the content of a `.fls` file attached to the given `srcFile`.
     * All `INPUT` files are considered as subfiles/non-tex files included in `srcFile`,
     * and all `OUTPUT` files will be checked if they are `.aux` files.
     * If so, the `.aux` files are parsed for any possible `.bib` files.
     *
     * This function is called after a successful build, when looking for the root file,
     * and to compute the cachedContent tree.
     *
     * @param filePath The path of a LaTeX file.
     */
    async loadFlsFile(filePath) {
        const flsPath = pathutils_1.PathUtils.getFlsFilePath(filePath);
        if (flsPath === undefined) {
            return;
        }
        logger.log(`Parsing .fls ${flsPath} .`);
        const rootDir = path.dirname(filePath);
        const outDir = lw.manager.getOutDir(filePath);
        const ioFiles = cacherutils_1.CacherUtils.parseFlsContent(fs.readFileSync(flsPath).toString(), rootDir);
        for (const inputFile of ioFiles.input) {
            // Drop files that are also listed as OUTPUT or should be ignored
            if (ioFiles.output.includes(inputFile) ||
                cacherutils_1.CacherUtils.isExcluded(inputFile) ||
                !fs.existsSync(inputFile)) {
                continue;
            }
            if (inputFile === filePath || this.watched(inputFile)) {
                // Drop the current rootFile often listed as INPUT
                // Drop any file that is already watched as it is handled by
                // onWatchedFileChange.
                continue;
            }
            if (path.extname(inputFile) === '.tex') {
                if (!this.has(filePath)) {
                    await this.refreshCache(filePath);
                }
                // Parse tex files as imported subfiles.
                this.caches[filePath].children.push({
                    index: Number.MAX_VALUE,
                    file: inputFile
                });
                this.add(inputFile);
                logger.log(`Found ${inputFile} from .fls ${flsPath} .`);
                await this.refreshCache(inputFile, filePath);
            }
            else if (!this.watched(inputFile)) {
                // Watch non-tex files.
                this.add(inputFile);
            }
        }
        for (const outputFile of ioFiles.output) {
            if (path.extname(outputFile) === '.aux' && fs.existsSync(outputFile)) {
                logger.log(`Found .aux ${filePath} from .fls ${flsPath} , parsing.`);
                await this.parseAuxFile(outputFile, path.dirname(outputFile).replace(outDir, rootDir));
                logger.log(`Parsed .aux ${filePath} .`);
            }
        }
        logger.log(`Parsed .fls ${flsPath} .`);
    }
    async parseAuxFile(filePath, srcDir) {
        const content = fs.readFileSync(filePath).toString();
        const regex = /^\\bibdata{(.*)}$/gm;
        while (true) {
            const result = regex.exec(content);
            if (!result) {
                return;
            }
            const bibs = (result[1] ? result[1] : result[2]).split(',').map((bib) => {
                return bib.trim();
            });
            for (const bib of bibs) {
                const bibPath = pathutils_1.PathUtils.resolveBibPath(bib, srcDir);
                if (bibPath === undefined) {
                    continue;
                }
                const rootFile = lw.manager.rootFile;
                if (rootFile && !this.get(rootFile)?.bibfiles.has(bibPath)) {
                    this.get(rootFile)?.bibfiles.add(bibPath);
                    logger.log(`Found .bib ${bibPath} from .aux ${filePath} .`);
                }
                await this.bibWatcher.watchBibFile(bibPath);
            }
        }
    }
    getTeXChildrenFromFls(texFile) {
        const flsFile = pathutils_1.PathUtils.getFlsFilePath(texFile);
        if (flsFile === undefined) {
            return [];
        }
        const rootDir = path.dirname(texFile);
        const ioFiles = cacherutils_1.CacherUtils.parseFlsContent(fs.readFileSync(flsFile).toString(), rootDir);
        return ioFiles.input;
    }
    /**
     * Return a string array which holds all imported bib files
     * from the given tex `file`. If `file` is `undefined`, traces from the
     * root file, or return empty array if the root file is `undefined`
     *
     * @param file The path of a LaTeX file
     */
    getIncludedBib(file, includedBib = [], children = []) {
        if (file === undefined) {
            file = lw.manager.rootFile;
        }
        if (file === undefined) {
            return [];
        }
        if (!this.has(file)) {
            return [];
        }
        children.push(file);
        const cache = this.get(file);
        if (cache) {
            includedBib.push(...cache.bibfiles);
            for (const child of cache.children) {
                if (children.includes(child.file)) {
                    // Already parsed
                    continue;
                }
                this.getIncludedBib(child.file, includedBib);
            }
        }
        // Make sure to return an array with unique entries
        return Array.from(new Set(includedBib));
    }
    /**
     * Return a string array which holds all imported tex files
     * from the given `file` including the `file` itself.
     * If `file` is `undefined`, trace from the * root file,
     * or return empty array if the root file is `undefined`
     *
     * @param file The path of a LaTeX file
     */
    getIncludedTeX(file, includedTeX = []) {
        if (file === undefined) {
            file = lw.manager.rootFile;
        }
        if (file === undefined) {
            return [];
        }
        if (!this.has(file)) {
            return [];
        }
        includedTeX.push(file);
        const cache = this.get(file);
        if (cache) {
            for (const child of cache.children) {
                if (includedTeX.includes(child.file)) {
                    // Already included
                    continue;
                }
                this.getIncludedTeX(child.file, includedTeX);
            }
        }
        return includedTeX;
    }
    /**
     * Return the list of files (recursively) included in `file`
     *
     * @param file The file in which children are recursively computed
     * @param baseFile The file currently considered as the rootFile
     * @param children The list of already computed children
     */
    async getTeXChildren(file, baseFile, children) {
        if (!this.has(file)) {
            await this.refreshCache(file, baseFile);
        }
        this.get(file)?.children.forEach(async (child) => {
            if (children.includes(child.file)) {
                // Already included
                return;
            }
            children.push(child.file);
            await this.getTeXChildren(child.file, baseFile, children);
        });
        return children;
    }
    ignorePdfFile(rootFile) {
        const pdfFilePath = lw.manager.tex2pdf(rootFile);
        const pdfFileUri = vscode.Uri.file(pdfFilePath);
        this.pdfWatcher.ignorePdfFile(pdfFileUri);
    }
    watchPdfFile(pdfFileUri) {
        this.pdfWatcher.watchPdfFile(pdfFileUri);
    }
}
exports.Cacher = Cacher;
//# sourceMappingURL=cacher.js.map