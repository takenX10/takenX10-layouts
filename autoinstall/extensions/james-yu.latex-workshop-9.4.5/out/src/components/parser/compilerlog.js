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
exports.CompilerLogParser = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const lw = __importStar(require("../../lw"));
const convertfilename_1 = require("../../utils/convertfilename");
const biblogparser_1 = require("./biblogparser");
const latexlog_1 = require("./latexlog");
// Notice that 'Output written on filename.pdf' isn't output in draft mode.
// https://github.com/James-Yu/LaTeX-Workshop/issues/2893#issuecomment-936312853
const latexPattern = /^Output\swritten\son\s(.*)\s\(.*\)\.$/gm;
const latexFatalPattern = /Fatal error occurred, no output PDF file produced!/gm;
const latexmkPattern = /^Latexmk:\sapplying\srule/gm;
const latexmkLog = /^Latexmk:\sapplying\srule/;
const latexmkLogLatex = /^Latexmk:\sapplying\srule\s'(pdf|lua|xe)?latex'/;
const latexmkUpToDate = /^Latexmk: All targets \(.*\) are up-to-date/m;
const texifyPattern = /^running\s(pdf|lua|xe)?latex/gm;
const texifyLog = /^running\s((pdf|lua|xe)?latex|miktex-bibtex)/;
const texifyLogLatex = /^running\s(pdf|lua|xe)?latex/;
const bibtexPattern = /^This is BibTeX, Version.*$/m;
const DIAGNOSTIC_SEVERITY = {
    'typesetting': vscode.DiagnosticSeverity.Information,
    'warning': vscode.DiagnosticSeverity.Warning,
    'error': vscode.DiagnosticSeverity.Error,
};
class CompilerLogParser {
    static parse(log, rootFile) {
        CompilerLogParser.isLaTeXmkSkipped = false;
        // Canonicalize line-endings
        log = log.replace(/(\r\n)|\r/g, '\n');
        if (log.match(bibtexPattern)) {
            let logs;
            if (log.match(latexmkPattern)) {
                logs = biblogparser_1.BibLogParser.parse(CompilerLogParser.trimLaTeXmkBibTeX(log), rootFile);
            }
            else {
                logs = biblogparser_1.BibLogParser.parse(log, rootFile);
            }
            CompilerLogParser.showCompilerDiagnostics(CompilerLogParser.bibDiagnostics, logs, 'BibTeX');
        }
        if (log.match(latexmkPattern)) {
            log = CompilerLogParser.trimLaTeXmk(log);
        }
        else if (log.match(texifyPattern)) {
            log = CompilerLogParser.trimTexify(log);
        }
        if (log.match(latexPattern) || log.match(latexFatalPattern)) {
            const logs = latexlog_1.LatexLogParser.parse(log, rootFile);
            CompilerLogParser.showCompilerDiagnostics(CompilerLogParser.texDiagnostics, logs, 'LaTeX');
        }
        else if (CompilerLogParser.latexmkSkipped(log)) {
            CompilerLogParser.isLaTeXmkSkipped = true;
        }
    }
    static trimLaTeXmk(log) {
        return CompilerLogParser.trimPattern(log, latexmkLogLatex, latexmkLog);
    }
    static trimLaTeXmkBibTeX(log) {
        return CompilerLogParser.trimPattern(log, bibtexPattern, latexmkLogLatex);
    }
    static trimTexify(log) {
        return CompilerLogParser.trimPattern(log, texifyLogLatex, texifyLog);
    }
    /**
     * Return the lines between the last occurrences of `beginPattern` and `endPattern`.
     * If `endPattern` is not found, the lines from the last occurrence of
     * `beginPattern` up to the end is returned.
     */
    static trimPattern(log, beginPattern, endPattern) {
        const lines = log.split('\n');
        let startLine = -1;
        let finalLine = -1;
        for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
            let result = line.match(beginPattern);
            if (result) {
                startLine = index;
            }
            result = line.match(endPattern);
            if (result) {
                finalLine = index;
            }
        }
        if (finalLine <= startLine) {
            return lines.slice(startLine).join('\n');
        }
        else {
            return lines.slice(startLine, finalLine).join('\n');
        }
    }
    static latexmkSkipped(log) {
        if (log.match(latexmkUpToDate) && !log.match(latexmkPattern)) {
            CompilerLogParser.showCompilerDiagnostics(CompilerLogParser.texDiagnostics, latexlog_1.LatexLogParser.buildLog, 'LaTeX');
            CompilerLogParser.showCompilerDiagnostics(CompilerLogParser.bibDiagnostics, biblogparser_1.BibLogParser.buildLog, 'BibTeX');
            return true;
        }
        return false;
    }
    static getErrorPosition(item) {
        if (!item.errorPosText) {
            return undefined;
        }
        const content = lw.cacher.get(item.file)?.content;
        if (!content) {
            return undefined;
        }
        // Try to find the errorPosText in the respective line of the document
        const lines = content.split('\n');
        if (lines.length >= item.line) {
            const line = lines[item.line - 1];
            let pos = line.indexOf(item.errorPosText);
            if (pos >= 0) {
                pos += item.errorPosText.length;
                // Find the length of the last word in the error.
                // This is the length of the error-range
                const len = item.errorPosText.length - item.errorPosText.lastIndexOf(' ') - 1;
                if (len > 0) {
                    return { start: pos - len, end: pos };
                }
            }
        }
        return undefined;
    }
    static showCompilerDiagnostics(compilerDiagnostics, buildLog, source) {
        compilerDiagnostics.clear();
        const diagsCollection = Object.create(null);
        for (const item of buildLog) {
            let startChar = 0;
            let endChar = 65535;
            // Try to compute a more precise position
            const preciseErrorPos = CompilerLogParser.getErrorPosition(item);
            if (preciseErrorPos) {
                startChar = preciseErrorPos.start;
                endChar = preciseErrorPos.end;
            }
            const range = new vscode.Range(new vscode.Position(item.line - 1, startChar), new vscode.Position(item.line - 1, endChar));
            const diag = new vscode.Diagnostic(range, item.text, DIAGNOSTIC_SEVERITY[item.type]);
            diag.source = source;
            if (diagsCollection[item.file] === undefined) {
                diagsCollection[item.file] = [];
            }
            diagsCollection[item.file].push(diag);
        }
        const configuration = vscode.workspace.getConfiguration('latex-workshop');
        const convEnc = configuration.get('message.convertFilenameEncoding');
        for (const file in diagsCollection) {
            let file1 = file;
            if (!fs.existsSync(file1) && convEnc) {
                const f = (0, convertfilename_1.convertFilenameEncoding)(file1);
                if (f !== undefined) {
                    file1 = f;
                }
            }
            compilerDiagnostics.set(vscode.Uri.file(file1), diagsCollection[file]);
        }
    }
}
exports.CompilerLogParser = CompilerLogParser;
CompilerLogParser.bibDiagnostics = vscode.languages.createDiagnosticCollection('BibTeX');
CompilerLogParser.texDiagnostics = vscode.languages.createDiagnosticCollection('LaTeX');
CompilerLogParser.isLaTeXmkSkipped = false;
//# sourceMappingURL=compilerlog.js.map