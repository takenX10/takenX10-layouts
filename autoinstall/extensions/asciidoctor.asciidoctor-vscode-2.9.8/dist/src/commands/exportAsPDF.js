"use strict";
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
exports.html2pdf = exports._generateCoverHtmlContent = exports.ExportAsPDF = void 0;
const vscode = __importStar(require("vscode"));
const os = __importStar(require("os"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const uuid_1 = require("uuid");
const zlib = __importStar(require("zlib"));
const url = require("url");
class ExportAsPDF {
    constructor(engine, logger) {
        this.engine = engine;
        this.logger = logger;
        this.id = 'asciidoc.exportAsPDF';
        this.engine = engine;
        this.logger = logger;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const editor = vscode.window.activeTextEditor;
            if (editor === null || editor === undefined) {
                return;
            }
            const doc = editor.document;
            const sourceName = path.parse(path.resolve(doc.fileName));
            const pdfFilename = vscode.Uri.file(path.join(sourceName.root, sourceName.dir, sourceName.name + '.pdf'));
            const text = doc.getText();
            if (vscode.workspace.getConfiguration('asciidoc', null).get('use_asciidoctorpdf')) {
                const docPath = path.parse(path.resolve(doc.fileName));
                let pdfPath = '';
                const pdfUri = yield vscode.window.showSaveDialog({ defaultUri: pdfFilename });
                if (pdfUri) {
                    pdfPath = pdfUri.fsPath;
                }
                else {
                    console.error(`ERROR: invalid pdfUri "${pdfUri}"`);
                    return;
                }
                const asciidoctorPDFCommand = vscode.workspace
                    .getConfiguration('asciidoc', null)
                    .get('asciidoctorpdf_command', 'asciidoctor-pdf');
                const adocPDFCmdArray = asciidoctorPDFCommand
                    .split(/(\s+)/)
                    .filter(function (e) { return e.trim().length > 0; });
                const adocPDFCmd = adocPDFCmdArray[0];
                const adocPDFCmdArgs = adocPDFCmdArray.slice(1);
                adocPDFCmdArgs.push('-q', '-B', '"' + docPath.dir.replace('"', '\\"') + '"', '-o', '"' + pdfPath.replace('"', '\\"') + '"', '-');
                const options = { shell: true, cwd: docPath.dir };
                const asciidoctorPDF = (0, child_process_1.spawn)(adocPDFCmd, adocPDFCmdArgs, options);
                asciidoctorPDF.stderr.on('data', (data) => {
                    let errorMessage = data.toString();
                    errorMessage += '\n';
                    errorMessage += 'command: ' + adocPDFCmd + ' ' + adocPDFCmdArgs.join(' ');
                    errorMessage += '\n';
                    errorMessage += 'If the asciidoctor-pdf binary is not in your PATH, you can set the full path.';
                    errorMessage += 'Go to `File -> Preferences -> User settings` and adjust the asciidoc.asciidoctorPDFCommand';
                    console.error(errorMessage);
                    vscode.window.showErrorMessage(errorMessage);
                });
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                asciidoctorPDF.on('close', (code) => {
                    offerOpen(pdfPath);
                });
                asciidoctorPDF.stdin.write(text);
                asciidoctorPDF.stdin.end();
            }
            else {
                const wkHTMLtoPDFPath = vscode.workspace
                    .getConfiguration('asciidoc')
                    .get('wkhtmltopdf_path', '');
                const { output: html, document } = yield this.engine.render(doc.uri, true, text, false, 'webview-html5');
                const showTitlePage = document === null || document === void 0 ? void 0 : document.isAttribute('showTitlePage'); // incorrect type definition in Asciidoctor.js
                const titlePageLogo = document === null || document === void 0 ? void 0 : document.getAttribute('titlePageLogo');
                const footerCenter = document === null || document === void 0 ? void 0 : document.getAttribute('footer-center');
                const coverFilePath = showTitlePage ? createCoverFile(titlePageLogo, sourceName.dir, document) : undefined;
                const binaryPath = wkHTMLtoPDFPath || path.resolve(path.join(__dirname, `wkhtmltopdf-${process.platform}-${process.arch}${process.platform === 'win32' ? '.exe' : ''}`));
                if (!fs.existsSync(binaryPath)) {
                    const label = yield vscode.window.showInformationMessage('This feature requires wkhtmltopdf\ndo you want to download', 'Download');
                    if (label !== 'Download') {
                        return;
                    }
                    const downloadSuccessful = yield vscode.window.withProgress({
                        location: vscode.ProgressLocation.Window,
                        title: 'Downloading wkhtmltopdf',
                        // cancellable: true
                    }, (progress) => __awaiter(this, void 0, void 0, function* () {
                        progress.report({ message: 'Downloading wkhtmltopdf...' });
                        const downloadURL = `https://github.com/joaompinto/wkhtmltopdf/releases/download/v0.0.1/wkhtmltopdf-${process.platform}-${process.arch}${process.platform === 'win32' ? '.exe' : ''}.gz`;
                        this.logger.log('Downloading ' + downloadURL);
                        try {
                            yield downloadFile(downloadURL, binaryPath + '.gz', progress);
                            progress.report({ message: 'Unzipping wkhtmltopdf...' });
                            const ungzip = zlib.createGunzip();
                            const inp = fs.createReadStream(binaryPath + '.gz');
                            const out = fs.createWriteStream(binaryPath);
                            inp.pipe(ungzip).pipe(out);
                            fs.chmodSync(binaryPath, 0x755);
                            return true;
                        }
                        catch (err) {
                            console.error('Error downloading', downloadURL, ' ', err);
                            yield vscode.window.showErrorMessage('Error installing wkhtmltopdf, ' + err.toString());
                            return false;
                        }
                    }));
                    if (!downloadSuccessful) {
                        // abort!
                        return;
                    }
                }
                const saveFileUri = yield vscode.window.showSaveDialog({ defaultUri: pdfFilename });
                if (saveFileUri) {
                    try {
                        const generatedPdf = yield html2pdf(html, binaryPath, coverFilePath, footerCenter, saveFileUri.fsPath);
                        offerOpen(generatedPdf);
                    }
                    catch (err) {
                        console.error('Got error', err);
                        yield vscode.window.showErrorMessage('Error converting to PDF, ' + err.toString());
                    }
                    finally {
                        if (coverFilePath) {
                            // remove temporary file
                            fs.unlinkSync(coverFilePath);
                        }
                    }
                }
            }
        });
    }
}
exports.ExportAsPDF = ExportAsPDF;
function _generateCoverHtmlContent(titlePageLogo, baseDir, document, extensionUri) {
    let imageHTML = '';
    if (titlePageLogo) {
        const imageURL = titlePageLogo.startsWith('http') ? titlePageLogo : path.join(baseDir, titlePageLogo);
        imageHTML = `<img src="${imageURL}">`;
    }
    const styleHref = vscode.Uri.joinPath(extensionUri, 'media', 'all-centered.css');
    const doctitle = document === null || document === void 0 ? void 0 : document.getAttribute('doctitle', '');
    const author = document === null || document === void 0 ? void 0 : document.getAttribute('author', '');
    const email = document === null || document === void 0 ? void 0 : document.getAttribute('email', '');
    return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="${styleHref}">
  </head>
  <body>
  <div class="outer">
    <div class="middle">
      <div class="inner">
${imageHTML}
        <h1>${doctitle}</h1>
        p>${author} &lt;${email}&gt;</p>
      </div>
    </div>
  </div>
  </body>
  </html>`;
}
exports._generateCoverHtmlContent = _generateCoverHtmlContent;
function createCoverFile(titlePageLogo, baseDir, document) {
    const extensionContext = vscode.extensions.getExtension('asciidoctor.asciidoctor-vscode');
    const coverHtmlContent = _generateCoverHtmlContent(titlePageLogo, baseDir, document, extensionContext.extensionUri);
    const tmpFilePath = path.join(os.tmpdir(), (0, uuid_1.uuidv4)() + '.html');
    fs.writeFileSync(tmpFilePath, coverHtmlContent, 'utf-8');
    return tmpFilePath;
}
function downloadFile(downloadURL, filename, progress) {
    return __awaiter(this, void 0, void 0, function* () {
        // load "follow-redirects" only when needed (because this module cannot be loaded in a browser environment)
        const followRedirects = yield Promise.resolve().then(() => __importStar(require('follow-redirects')));
        return new Promise((resolve, reject) => {
            const downloadOptions = url.parse(downloadURL);
            const wstream = fs.createWriteStream(filename);
            let totalDownloaded = 0;
            // Proxy support needs to be reworked
            // var proxy = process.env.http_proxy || vscode.workspace.getConfiguration("http", null)["proxy"].trim();
            // var proxyStrictSSL = vscode.workspace.getConfiguration("http", null)["proxyStrictSSL"];
            // if (proxy != '')
            // {
            //   var agent = new HttpsProxyAgent(proxy);
            //   downloadOptions.agent = agent
            //   downloadOptions.rejectUnauthorized = proxyStrictSSL
            // }
            followRedirects.https.get(downloadOptions, (resp) => {
                const contentSize = resp.headers['content-length'];
                if (resp.statusCode !== 200) {
                    wstream.end();
                    fs.unlinkSync(filename);
                    return reject(new Error('http error' + resp.statusCode));
                }
                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    totalDownloaded += chunk.length;
                    progress.report({ message: 'Downloading wkhtmltopdf ... ' + ((totalDownloaded / contentSize) * 100.0).toFixed(0) + '%' });
                    wstream.write(chunk);
                });
                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    wstream.end();
                    resolve();
                });
            }).on('error', (err) => {
                console.error('Error: ' + err.message);
                reject(err);
            });
        });
    });
}
function offerOpen(destination) {
    // Saving the JSON that represents the document to a temporary JSON-file.
    vscode.window.showInformationMessage(('Successfully converted to ' + path.basename(destination)), 'Open File').then((label) => {
        if (label === 'Open File') {
            switch (process.platform) {
                // Use backticks for unix systems to run the open command directly
                // This avoids having to wrap the command AND path in quotes which
                // breaks if there is a single quote (') in the path
                case 'win32':
                    (0, child_process_1.exec)(`"${destination.replace('"', '\\"')}"`);
                    break;
                case 'darwin':
                    (0, child_process_1.exec)(`\`open "${destination.replace('"', '\\"')}" ; exit\``);
                    break;
                case 'linux':
                    (0, child_process_1.exec)(`\`xdg-open "${destination.replace('"', '\\"')}" ; exit\``);
                    break;
                default:
                    vscode.window.showWarningMessage('Output type is not supported');
                    break;
            }
        }
    });
}
function html2pdf(html, binaryPath, coverFilePath, footerCenter, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const documentPath = path.dirname(filename);
        return new Promise((resolve, reject) => {
            const cmdArguments = ['--encoding', ' utf-8', '--javascript-delay', '1000'];
            if (footerCenter) {
                cmdArguments.push('--footer-center', footerCenter);
            }
            if (coverFilePath) {
                cmdArguments.push('cover', coverFilePath);
            }
            cmdArguments.push('-', filename);
            const command = (0, child_process_1.spawn)(binaryPath, cmdArguments, { cwd: documentPath, stdio: ['pipe', 'ignore', 'pipe'] });
            let errorData = '';
            command.stdin.write(html);
            command.stdin.end();
            command.stderr.on('data', (data) => {
                errorData += data;
            });
            command.on('close', (code) => {
                if (code === 0) {
                    resolve(filename);
                }
                else {
                    reject(errorData);
                }
            });
        });
    });
}
exports.html2pdf = html2pdf;
//# sourceMappingURL=exportAsPDF.js.map