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
exports.LatexFormatterProvider = exports.OperatingSystem = void 0;
const vscode = __importStar(require("vscode"));
const cs = __importStar(require("cross-spawn"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const lw = __importStar(require("../lw"));
const utils_1 = require("../utils/utils");
const logger_1 = require("../components/logger");
const logger = (0, logger_1.getLogger)('Format', 'TeX');
const fullRange = (doc) => doc.validateRange(new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE));
class OperatingSystem {
    constructor(name, fileExt, checker) {
        this.name = name;
        this.fileExt = fileExt;
        this.checker = checker;
    }
}
exports.OperatingSystem = OperatingSystem;
const windows = new OperatingSystem('win32', '.exe', 'where');
const linux = new OperatingSystem('linux', '.pl', 'which');
const mac = new OperatingSystem('darwin', '.pl', 'which');
class LaTeXFormatter {
    static get instance() {
        return this._instance || (this._instance = new LaTeXFormatter());
    }
    constructor() {
        this.formatter = '';
        this.formatterArgs = [];
        this.formatting = false;
        const machineOs = os.platform();
        if (machineOs === windows.name) {
            this.currentOs = windows;
        }
        else if (machineOs === linux.name) {
            this.currentOs = linux;
        }
        else if (machineOs === mac.name) {
            this.currentOs = mac;
        }
        else {
            logger.log('LaTexFormatter: Unsupported OS');
        }
        lw.registerDisposable(vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('latex-workshop.latexindent.path')) {
                this.formatter = '';
            }
        }));
    }
    async formatDocument(document, range) {
        if (this.formatting) {
            logger.log('Formatting in progress. Aborted.');
        }
        this.formatting = true;
        const configuration = vscode.workspace.getConfiguration('latex-workshop', document.uri);
        const pathMeta = configuration.get('latexindent.path');
        this.formatterArgs = configuration.get('latexindent.args');
        logger.log('Start formatting with latexindent.');
        try {
            if (this.formatter === '') {
                this.formatter = pathMeta;
                const latexindentPresent = await this.checkPath();
                if (!latexindentPresent) {
                    this.formatter = '';
                    logger.log(`Can not find ${this.formatter} in PATH: ${process.env.PATH}`);
                    void logger.showErrorMessage('Can not find latexindent in PATH.');
                    return [];
                }
            }
            const edit = await this.format(document, range);
            return edit;
        }
        finally {
            this.formatting = false;
        }
    }
    checkPath() {
        const configuration = vscode.workspace.getConfiguration('latex-workshop');
        const useDocker = configuration.get('docker.enabled');
        if (useDocker) {
            logger.log('Use Docker to invoke the command.');
            if (process.platform === 'win32') {
                this.formatter = path.resolve(lw.extensionRoot, './scripts/latexindent.bat');
            }
            else {
                this.formatter = path.resolve(lw.extensionRoot, './scripts/latexindent');
                fs.chmodSync(this.formatter, 0o755);
            }
            return Promise.resolve(true);
        }
        if (path.isAbsolute(this.formatter)) {
            if (fs.existsSync(this.formatter)) {
                return Promise.resolve(true);
            }
            else {
                logger.log(`The path of latexindent is absolute and not found: ${this.formatter}`);
                return Promise.resolve(false);
            }
        }
        if (!this.currentOs) {
            logger.log('The current platform is undefined.');
            return Promise.resolve(false);
        }
        const checker = this.currentOs.checker;
        const fileExt = this.currentOs.fileExt;
        const checkFormatter = (resolve, isFirstTry = true) => {
            const check = cs.spawn(checker, [this.formatter]);
            let stdout = '';
            let stderr = '';
            check.stdout.setEncoding('utf8');
            check.stderr.setEncoding('utf8');
            check.stdout.on('data', d => { stdout += d; });
            check.stderr.on('data', d => { stderr += d; });
            check.on('close', code => {
                if (code && isFirstTry) {
                    logger.log(`Error when checking latexindent: ${stderr}`);
                    this.formatter += fileExt;
                    logger.log(`Checking latexindent: ${checker} ${this.formatter}`);
                    checkFormatter(resolve, false);
                }
                else if (code) {
                    logger.log(`Error when checking latexindent: ${stderr}`);
                    resolve(false);
                }
                else {
                    logger.log(`Checking latexindent is ok: ${stdout}`);
                    resolve(true);
                }
            });
        };
        return new Promise((resolve, _) => {
            logger.log(`Checking latexindent: ${checker} ${this.formatter}`);
            checkFormatter(resolve);
        });
    }
    format(document, range) {
        return new Promise((resolve, _reject) => {
            const configuration = vscode.workspace.getConfiguration('latex-workshop');
            const useDocker = configuration.get('docker.enabled');
            if (!vscode.window.activeTextEditor) {
                logger.log('Exit formatting. The active textEditor is undefined.');
                return;
            }
            const options = vscode.window.activeTextEditor.options;
            const tabSize = options.tabSize ? +options.tabSize : 4;
            const useSpaces = options.insertSpaces;
            const indent = useSpaces ? ' '.repeat(tabSize) : '\\t';
            const documentDirectory = path.dirname(document.fileName);
            // The version of latexindent shipped with current latex distributions doesn't support piping in the data using stdin, support was
            // only added on 2018-01-13 with version 3.4 so we have to create a temporary file
            const textToFormat = document.getText(range);
            const temporaryFile = documentDirectory + path.sep + '__latexindent_temp_' + path.basename(document.fileName);
            fs.writeFileSync(temporaryFile, textToFormat);
            const removeTemporaryFiles = () => {
                try {
                    fs.unlinkSync(temporaryFile);
                    fs.unlinkSync(documentDirectory + path.sep + 'indent.log');
                }
                catch (ignored) {
                }
            };
            // generate command line arguments
            const rootFile = lw.manager.rootFile || document.fileName;
            const args = this.formatterArgs.map(arg => {
                return (0, utils_1.replaceArgumentPlaceholders)(rootFile, lw.manager.tmpDir)(arg)
                    // this.ts specific tokens
                    .replace(/%TMPFILE%/g, useDocker ? path.basename(temporaryFile) : temporaryFile.split(path.sep).join('/'))
                    .replace(/%INDENT%/g, indent);
            });
            logger.logCommand('Formatting LaTeX.', this.formatter, args);
            const worker = cs.spawn(this.formatter, args, { stdio: 'pipe', cwd: documentDirectory });
            // handle stdout/stderr
            const stdoutBuffer = [];
            const stderrBuffer = [];
            worker.stdout.on('data', (chunk) => stdoutBuffer.push(chunk.toString()));
            worker.stderr.on('data', (chunk) => stderrBuffer.push(chunk.toString()));
            worker.on('error', err => {
                removeTemporaryFiles();
                void logger.showErrorMessage('Formatting failed. Please refer to LaTeX Workshop Output for details.');
                logger.log(`Formatting failed: ${err.message}`);
                logger.log(`stderr: ${stderrBuffer.join('')}`);
                resolve([]);
            });
            worker.on('close', code => {
                removeTemporaryFiles();
                if (code !== 0) {
                    void logger.showErrorMessage('Formatting failed. Please refer to LaTeX Workshop Output for details.');
                    logger.log(`Formatting failed with exit code ${code}`);
                    logger.log(`stderr: ${stderrBuffer.join('')}`);
                    return resolve([]);
                }
                const stdout = stdoutBuffer.join('');
                if (stdout !== '') {
                    const edit = [vscode.TextEdit.replace(range || fullRange(document), stdout)];
                    logger.log('Formatted ' + document.fileName);
                    return resolve(edit);
                }
                return resolve([]);
            });
        });
    }
}
class LatexFormatterProvider {
    static get instance() {
        return this._instance || (this._instance = new LatexFormatterProvider());
    }
    constructor() { }
    provideDocumentFormattingEdits(document, _options, _token) {
        return LaTeXFormatter.instance.formatDocument(document);
    }
    provideDocumentRangeFormattingEdits(document, range, _options, _token) {
        return LaTeXFormatter.instance.formatDocument(document, range);
    }
}
exports.LatexFormatterProvider = LatexFormatterProvider;
//# sourceMappingURL=latexformatter.js.map