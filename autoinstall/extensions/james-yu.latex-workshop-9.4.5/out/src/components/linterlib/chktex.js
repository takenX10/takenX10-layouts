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
exports.ChkTeX = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const lw = __importStar(require("../../lw"));
const linterutils_1 = require("./linterutils");
const convertfilename_1 = require("../../utils/convertfilename");
const logger_1 = require("../logger");
const logger = (0, logger_1.getLogger)('Linter', 'ChkTeX');
class ChkTeX {
    constructor() {
        this.linterName = 'ChkTeX';
        this.linterDiagnostics = vscode.languages.createDiagnosticCollection(this.linterName);
    }
    getName() {
        return this.linterName;
    }
    async lintRootFile(rootPath) {
        const requiredArgs = ['-f%f:%l:%c:%d:%k:%n:%m\n', rootPath];
        const stdout = await this.chktexWrapper('root', vscode.Uri.file(rootPath), rootPath, requiredArgs, undefined);
        if (stdout === undefined) { // It's possible to have empty string as output
            return;
        }
        const tabSize = this.getChktexrcTabSize(rootPath);
        this.parseLog(stdout, undefined, tabSize);
    }
    async lintFile(document) {
        const filePath = document.fileName;
        const content = document.getText();
        const requiredArgs = ['-I0', '-f%f:%l:%c:%d:%k:%n:%m\n'];
        const stdout = await this.chktexWrapper('active', document, filePath, requiredArgs, content);
        if (stdout === undefined) { // It's possible to have empty string as output
            return;
        }
        // provide the original path to the active file as the second argument, so
        // we report this second path in the diagnostics instead of the temporary one.
        const tabSize = this.getChktexrcTabSize(document.fileName);
        this.parseLog(stdout, filePath, tabSize);
    }
    async chktexWrapper(linterid, configScope, filePath, requiredArgs, content) {
        const configuration = vscode.workspace.getConfiguration('latex-workshop', configScope);
        const command = configuration.get('linting.chktex.exec.path');
        const args = [...configuration.get('linting.chktex.exec.args')];
        if (!args.includes('-l')) {
            const rcPath = this.rcPath;
            if (rcPath) {
                args.push('-l', rcPath);
            }
        }
        let stdout;
        try {
            stdout = await linterutils_1.LinterUtils.processWrapper(linterid, command, args.concat(requiredArgs).filter(arg => arg !== ''), { cwd: path.dirname(filePath) }, content);
        }
        catch (err) {
            if ('stdout' in err) {
                stdout = err.stdout;
            }
            else {
                return undefined;
            }
        }
        return stdout;
    }
    get rcPath() {
        let rcPath;
        // 0. root file folder
        const root = lw.manager.rootFile;
        if (root) {
            rcPath = path.resolve(path.dirname(root), './.chktexrc');
        }
        else {
            return;
        }
        if (fs.existsSync(rcPath)) {
            return rcPath;
        }
        // 1. project root folder
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (workspaceFolder) {
            rcPath = path.resolve(workspaceFolder.uri.fsPath, './.chktexrc');
        }
        if (fs.existsSync(rcPath)) {
            return rcPath;
        }
        return undefined;
    }
    globalRcPath() {
        const rcPathArray = [];
        if (os.platform() === 'win32') {
            if (process.env.CHKTEXRC) {
                rcPathArray.push(path.join(process.env.CHKTEXRC, 'chktexrc'));
            }
            if (process.env.CHKTEX_HOME) {
                rcPathArray.push(path.join(process.env.CHKTEX_HOME, 'chktexrc'));
            }
            if (process.env.EMTEXDIR) {
                rcPathArray.push(path.join(process.env.EMTEXDIR, 'data', 'chktexrc'));
            }
        }
        else {
            if (process.env.HOME) {
                rcPathArray.push(path.join(process.env.HOME, '.chktexrc'));
            }
            if (process.env.LOGDIR) {
                rcPathArray.push(path.join(process.env.LOGDIR, '.chktexrc'));
            }
            if (process.env.CHKTEXRC) {
                rcPathArray.push(path.join(process.env.CHKTEXRC, '.chktexrc'));
            }
        }
        for (const rcPath of rcPathArray) {
            if (fs.existsSync(rcPath)) {
                return rcPath;
            }
        }
        return;
    }
    getChktexrcTabSize(file) {
        const configuration = vscode.workspace.getConfiguration('latex-workshop', vscode.Uri.file(file));
        const args = configuration.get('linting.chktex.exec.args');
        let filePath;
        if (args.includes('-l')) {
            const idx = args.indexOf('-l');
            if (idx >= 0) {
                const rcpath = args[idx + 1];
                if (fs.existsSync(rcpath)) {
                    filePath = rcpath;
                }
            }
        }
        else {
            if (this.rcPath) {
                filePath = this.rcPath;
            }
            else {
                filePath = this.globalRcPath();
            }
        }
        if (!filePath) {
            logger.log('No .chktexrc file is found to determine TabSize.');
            return;
        }
        const rcFile = fs.readFileSync(filePath).toString();
        const reg = /^\s*TabSize\s*=\s*(\d+)\s*$/m;
        const match = reg.exec(rcFile);
        if (match) {
            const ret = Number(match[1]);
            logger.log(`TabSize ${ret} defined in .chktexrc ${filePath} .`);
            return ret;
        }
        logger.log(`No TabSize is found in .chktexrc ${filePath} .`);
        return;
    }
    parseLog(log, singleFileOriginalPath, tabSizeArg) {
        const re = /^(.*?):(\d+):(\d+):(\d+):(.*?):(\d+):(.*?)$/gm;
        const linterLog = [];
        let match = re.exec(log);
        while (match) {
            // This log may be for a single file in memory, in which case we override the
            // path with what is provided
            let filePath = singleFileOriginalPath ? singleFileOriginalPath : match[1];
            if (!path.isAbsolute(filePath) && lw.manager.rootDir !== undefined) {
                filePath = path.resolve(lw.manager.rootDir, filePath);
            }
            const line = parseInt(match[2]);
            const column = this.callConvertColumn(parseInt(match[3]), filePath, line, tabSizeArg);
            linterLog.push({
                file: filePath,
                line,
                column,
                length: parseInt(match[4]),
                type: match[5].toLowerCase(),
                code: parseInt(match[6]),
                text: `${match[6]}: ${match[7]}`
            });
            match = re.exec(log);
        }
        logger.log(`Logged ${linterLog.length} messages.`);
        if (singleFileOriginalPath === undefined) {
            // A full lint of the project has taken place - clear all previous results.
            this.linterDiagnostics.clear();
        }
        else if (linterLog.length === 0) {
            // We are linting a single file and the new log is empty for it -
            // clean existing records.
            this.linterDiagnostics.set(vscode.Uri.file(singleFileOriginalPath), []);
        }
        this.showLinterDiagnostics(linterLog);
    }
    callConvertColumn(column, filePathArg, line, tabSizeArg) {
        const configuration = vscode.workspace.getConfiguration('latex-workshop', lw.manager.getWorkspaceFolderRootDir());
        if (!configuration.get('linting.chktex.convertOutput.column.enabled', true)) {
            return column;
        }
        const filePath = (0, convertfilename_1.convertFilenameEncoding)(filePathArg);
        if (!filePath) {
            logger.log(`Column number not converted on non-existent ${filePathArg} .`);
            return column;
        }
        const lineString = fs.readFileSync(filePath).toString().split('\n')[line - 1];
        let tabSize;
        const tabSizeConfig = configuration.get('linting.chktex.convertOutput.column.chktexrcTabSize', -1);
        if (tabSizeConfig >= 0) {
            tabSize = tabSizeConfig;
        }
        else {
            tabSize = tabSizeArg;
        }
        if (lineString === undefined) {
            logger.log(`Column number not converted by invalid line ${line} of ${filePathArg}.`);
            return column;
        }
        return this.convertColumn(column, lineString, tabSize);
    }
    /**
     * @param colArg One-based value.
     * @param tabSize The default value used by chktex is 8.
     * @returns One-based value.
     */
    convertColumn(colArg, lineString, tabSize = 8) {
        const col = colArg - 1;
        const charByteArray = lineString.split('').map((c) => Buffer.byteLength(c));
        let i = 0;
        let pos = 0;
        while (i < charByteArray.length) {
            if (col <= pos) {
                break;
            }
            if (lineString[i] === '\t') {
                pos += tabSize;
            }
            else {
                pos += charByteArray[i];
            }
            i += 1;
        }
        return i + 1;
    }
    showLinterDiagnostics(linterLog) {
        const diagsCollection = Object.create(null);
        for (const item of linterLog) {
            const range = new vscode.Range(new vscode.Position(item.line - 1, item.column - 1), new vscode.Position(item.line - 1, item.column - 1 + item.length));
            const diag = new vscode.Diagnostic(range, item.text, DIAGNOSTIC_SEVERITY[item.type]);
            diag.code = item.code;
            diag.source = this.linterName;
            if (diagsCollection[item.file] === undefined) {
                diagsCollection[item.file] = [];
            }
            diagsCollection[item.file].push(diag);
        }
        const configuration = vscode.workspace.getConfiguration('latex-workshop');
        const convEnc = configuration.get('message.convertFilenameEncoding');
        for (const file in diagsCollection) {
            let file1 = file;
            if (['.tex', '.bbx', '.cbx', '.dtx'].includes(path.extname(file))) {
                // Only report ChkTeX errors on TeX files. This is done to avoid
                // reporting errors in .sty files, which are irrelevant for most users.
                if (!fs.existsSync(file1) && convEnc) {
                    const f = (0, convertfilename_1.convertFilenameEncoding)(file1);
                    if (f !== undefined) {
                        file1 = f;
                    }
                }
                this.linterDiagnostics.set(vscode.Uri.file(file1), diagsCollection[file]);
            }
        }
    }
}
exports.ChkTeX = ChkTeX;
const DIAGNOSTIC_SEVERITY = {
    'typesetting': vscode.DiagnosticSeverity.Information,
    'warning': vscode.DiagnosticSeverity.Warning,
    'error': vscode.DiagnosticSeverity.Error,
};
//# sourceMappingURL=chktex.js.map