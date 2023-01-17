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
exports.BibLogParser = void 0;
const vscode = __importStar(require("vscode"));
const lw = __importStar(require("../../lw"));
const logger_1 = require("../logger");
const logger = (0, logger_1.getLogger)('Parser', 'BibLog');
const multiLineWarning = /^Warning--(.+)\n--line (\d+) of file (.+)$/gm;
const singleLineWarning = /^Warning--(.+) in ([^\s]+)\s*$/gm;
const multiLineError = /^(.*)---line (\d+) of file (.*)\n([^]+?)\nI'm skipping whatever remains of this entry$/gm;
const badCrossReference = /^(A bad cross reference---entry ".+?"\nrefers to entry.+?, which doesn't exist)$/gm;
const multiLineCommandError = /^(.*)\n?---line (\d+) of file (.*)\n([^]+?)\nI'm skipping whatever remains of this command$/gm;
const errorAuxFile = /^(.*)---while reading file (.*)$/gm;
class BibLogParser {
    static parse(log, rootFile) {
        if (rootFile === undefined) {
            rootFile = lw.manager.rootFile;
        }
        if (rootFile === undefined) {
            logger.log('How can you reach this point?');
            return [];
        }
        const configuration = vscode.workspace.getConfiguration('latex-workshop');
        let excludeRegexp;
        try {
            excludeRegexp = configuration.get('message.bibtexlog.exclude').map(regexp => RegExp(regexp));
        }
        catch (e) {
            logger.logError('Invalid message.bibtexlog.exclude config.', e);
            return [];
        }
        this.buildLog = [];
        let result;
        while ((result = singleLineWarning.exec(log))) {
            const location = this.findKeyLocation(result[2]);
            if (location) {
                this.pushLog('warning', location.file, result[1], location.line, excludeRegexp);
            }
        }
        while ((result = multiLineWarning.exec(log))) {
            const filename = this.resolveBibFile(result[3], rootFile);
            this.pushLog('warning', filename, result[1], parseInt(result[2], 10), excludeRegexp);
        }
        while ((result = multiLineError.exec(log))) {
            const filename = this.resolveBibFile(result[3], rootFile);
            this.pushLog('error', filename, result[1], parseInt(result[2], 10), excludeRegexp);
        }
        while ((result = multiLineCommandError.exec(log))) {
            const filename = this.resolveBibFile(result[3], rootFile);
            this.pushLog('error', filename, result[1], parseInt(result[2], 10), excludeRegexp);
        }
        while ((result = badCrossReference.exec(log))) {
            this.pushLog('error', rootFile, result[1], 1, excludeRegexp);
        }
        while ((result = errorAuxFile.exec(log))) {
            const filename = this.resolveAuxFile(result[2], rootFile);
            this.pushLog('error', filename, result[1], 1, excludeRegexp);
        }
        logger.log(`Logged ${this.buildLog.length} messages.`);
        return this.buildLog;
    }
    static pushLog(type, file, message, line, excludeRegexp) {
        for (const regexp of excludeRegexp) {
            if (message.match(regexp)) {
                return;
            }
        }
        this.buildLog.push({ type, file, text: message, line });
    }
    static resolveAuxFile(filename, rootFile) {
        filename = filename.replace(/\.aux$/, '.tex');
        if (!lw.cacher.get(rootFile)) {
            return filename;
        }
        const texFiles = lw.cacher.getIncludedTeX(rootFile);
        for (const tex of texFiles) {
            if (tex.endsWith(filename)) {
                return tex;
            }
        }
        logger.log(`Cannot resolve file ${filename} .`);
        return filename;
    }
    static resolveBibFile(filename, rootFile) {
        if (!lw.cacher.get(rootFile)) {
            return filename;
        }
        const bibFiles = lw.cacher.getIncludedBib(rootFile);
        for (const bib of bibFiles) {
            if (bib.endsWith(filename)) {
                return bib;
            }
        }
        logger.log(`Cannot resolve file ${filename} .`);
        return filename;
    }
    static findKeyLocation(key) {
        const entry = lw.completer.citation.getEntry(key);
        if (entry) {
            const file = entry.file;
            const line = entry.position.line + 1;
            return { file, line };
        }
        else {
            logger.log(`Cannot find key ${key}`);
            return undefined;
        }
    }
}
exports.BibLogParser = BibLogParser;
BibLogParser.buildLog = [];
//# sourceMappingURL=biblogparser.js.map