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
exports.LatexLogParser = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const lw = __importStar(require("../../lw"));
const logger_1 = require("../logger");
const logger = (0, logger_1.getLogger)('Parser', 'TexLog');
const latexError = /^(?:(.*):(\d+):|!)(?: (.+) Error:)? (.+?)$/;
const latexBox = /^((?:Over|Under)full \\[vh]box \([^)]*\)) in paragraph at lines (\d+)--(\d+)$/;
const latexBoxAlt = /^((?:Over|Under)full \\[vh]box \([^)]*\)) detected at line (\d+)$/;
const latexBoxOutput = /^((?:Over|Under)full \\[vh]box \([^)]*\)) has occurred while \\output is active(?: \[(\d+)\])?/;
const latexWarn = /^((?:(?:Class|Package) \S*)|LaTeX(?: \S*)?|LaTeX3) (Warning|Info):\s+(.*?)(?: on input line (\d+))?(\.|\?|)$/;
const latexPackageWarningExtraLines = /^\((.*)\)\s+(.*?)(?: +on input line (\d+))?(\.)?$/;
const bibEmpty = /^Empty `thebibliography' environment/;
const biberWarn = /^Biber warning:.*WARN - I didn't find a database entry for '([^']+)'/;
// const truncatedLine = /(.{77}[^\.](\w|\s|-|\\|\/))(\r\n|\n)/g
// A line with an error message will start with an 'l' character followed by a line number and then a space.
// After that it shows the line with the error but only up to the position of the error.
// If the error comes very late in the line, the error output will start with 3 dots.
// The regular expression is set up to include the 3 dots as an optional element, such that the capture group $2
// always contains actual text that appears in the line.
const messageLine = /^l\.\d+\s(\.\.\.)?(.*)$/;
class ParserState {
    constructor(rootFilename) {
        this.searchEmptyLine = false;
        this.insideBoxWarn = false;
        this.insideError = false;
        this.currentResult = { type: '', file: '', text: '', line: 1 };
        this.nested = 0;
        this.rootFile = rootFilename;
        this.fileStack = [this.rootFile];
    }
}
class LatexLogParser {
    static parse(log, rootFile) {
        if (rootFile === undefined) {
            rootFile = lw.manager.rootFile;
        }
        if (rootFile === undefined) {
            logger.log('How can you reach this point?');
            return [];
        }
        const lines = log.split('\n');
        this.buildLog = [];
        const state = new ParserState(rootFile);
        for (const line of lines) {
            this.parseLine(line, state, this.buildLog);
        }
        // Push the final result
        if (state.currentResult.type !== '' && !state.currentResult.text.match(bibEmpty)) {
            this.buildLog.push(state.currentResult);
        }
        logger.log(`Logged ${this.buildLog.length} messages.`);
        return this.buildLog;
    }
    static parseLine(line, state, buildLog) {
        const configuration = vscode.workspace.getConfiguration('latex-workshop');
        let excludeRegexp;
        try {
            excludeRegexp = configuration.get('message.latexlog.exclude').map(regexp => RegExp(regexp));
        }
        catch (e) {
            logger.logError('Invalid message.latexlog.exclude config.', e);
            return;
        }
        // Compose the current file
        const filename = path.resolve(path.dirname(state.rootFile), state.fileStack[state.fileStack.length - 1]);
        // Skip the first line after a box warning, this is just garbage
        if (state.insideBoxWarn) {
            state.insideBoxWarn = false;
            return;
        }
        // Append the read line, since we have a corresponding result in the matching
        if (state.searchEmptyLine) {
            if (line.trim() === '' || (state.insideError && line.match(/^\s/))) {
                state.currentResult.text = state.currentResult.text + '\n';
                state.searchEmptyLine = false;
                state.insideError = false;
            }
            else {
                const packageExtraLineResult = line.match(latexPackageWarningExtraLines);
                if (packageExtraLineResult) {
                    state.currentResult.text += '\n(' + packageExtraLineResult[1] + ')\t' + packageExtraLineResult[2] + (packageExtraLineResult[4] ? '.' : '');
                    state.currentResult.line = parseInt(packageExtraLineResult[3], 10);
                }
                else if (state.insideError) {
                    const match = messageLine.exec(line);
                    if (match && match.length >= 2) {
                        const subLine = match[2];
                        // remember the text where the error message occurred:
                        state.currentResult.errorPosText = subLine;
                        // skip rest of error message (usually not useful)
                        state.searchEmptyLine = false;
                        state.insideError = false;
                    }
                    else {
                        state.currentResult.text = state.currentResult.text + '\n' + line;
                    }
                }
                else {
                    state.currentResult.text = state.currentResult.text + '\n' + line;
                }
            }
            return;
        }
        for (const regexp of excludeRegexp) {
            if (line.match(regexp)) {
                return;
            }
        }
        let result = line.match(latexBox);
        if (!result) {
            result = line.match(latexBoxAlt);
        }
        if (result && configuration.get('message.badbox.show')) {
            if (state.currentResult.type !== '') {
                buildLog.push(state.currentResult);
            }
            state.currentResult = {
                type: 'typesetting',
                file: filename,
                line: parseInt(result[2], 10),
                text: result[1]
            };
            state.searchEmptyLine = false;
            state.insideBoxWarn = true;
            this.parseLine(line.substring(result[0].length), state, buildLog);
            return;
        }
        result = line.match(latexBoxOutput);
        if (result && configuration.get('message.badbox.show')) {
            if (state.currentResult.type !== '') {
                buildLog.push(state.currentResult);
            }
            state.currentResult = {
                type: 'typesetting',
                file: filename,
                line: 1,
                text: result[2] ? `${result[1]} in page ${result[2]}` : result[1]
            };
            state.searchEmptyLine = false;
            this.parseLine(line.substring(result[0].length), state, buildLog);
            return;
        }
        result = line.match(latexWarn);
        if (result) {
            if (state.currentResult.type !== '') {
                buildLog.push(state.currentResult);
            }
            state.currentResult = {
                type: 'warning',
                file: filename,
                line: parseInt(result[4], 10),
                text: result[3] + result[5]
            };
            state.searchEmptyLine = true;
            return;
        }
        result = line.match(biberWarn);
        if (result) {
            if (state.currentResult.type !== '') {
                buildLog.push(state.currentResult);
            }
            state.currentResult = {
                type: 'warning',
                file: '',
                line: 1,
                text: `No bib entry found for '${result[1]}'`
            };
            state.searchEmptyLine = false;
            this.parseLine(line.substring(result[0].length), state, buildLog);
            return;
        }
        result = line.match(latexError);
        if (result) {
            if (state.currentResult.type !== '') {
                buildLog.push(state.currentResult);
            }
            state.currentResult = {
                type: 'error',
                text: (result[3] && result[3] !== 'LaTeX') ? `${result[3]}: ${result[4]}` : result[4],
                file: result[1] ? path.resolve(path.dirname(state.rootFile), result[1]) : filename,
                line: result[2] ? parseInt(result[2], 10) : 1
            };
            state.searchEmptyLine = true;
            state.insideError = true;
            return;
        }
        state.nested = this.parseLaTeXFileStack(line, state.fileStack, state.nested);
        if (state.fileStack.length === 0) {
            state.fileStack.push(state.rootFile);
        }
    }
    static parseLaTeXFileStack(line, fileStack, nested) {
        const result = line.match(/(\(|\))/);
        if (result && result.index !== undefined && result.index > -1) {
            line = line.substring(result.index + 1);
            if (result[1] === '(') {
                const pathResult = line.match(/^"?((?:(?:[a-zA-Z]:|\.|\/)?(?:\/|\\\\?))[^"()[\]]*)/);
                const mikTeXPathResult = line.match(/^"?([^"()[\]]*\.[a-z]{3,})/);
                if (pathResult) {
                    fileStack.push(pathResult[1].trim());
                }
                else if (mikTeXPathResult) {
                    fileStack.push(`./${mikTeXPathResult[1].trim()}`);
                }
                else {
                    nested += 1;
                }
            }
            else {
                if (nested > 0) {
                    nested -= 1;
                }
                else {
                    fileStack.pop();
                }
            }
            nested = this.parseLaTeXFileStack(line, fileStack, nested);
        }
        return nested;
    }
}
exports.LatexLogParser = LatexLogParser;
LatexLogParser.buildLog = [];
//# sourceMappingURL=latexlog.js.map