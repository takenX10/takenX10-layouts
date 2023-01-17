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
exports.AsciidocParser = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const asciidoctorWebViewConverter_1 = require("./asciidoctorWebViewConverter");
const asciidoctorFindIncludeProcessor = require('./asciidoctorFindIncludeProcessor');
const asciidoctor = require('@asciidoctor/core');
const docbook = require('@asciidoctor/docbook-converter');
const kroki = require('asciidoctor-kroki');
const processor = asciidoctor();
const highlightjsBuiltInSyntaxHighlighter = processor.SyntaxHighlighter.for('highlight.js');
const highlightjsAdapter = require('./highlightjs-adapter');
class AsciidocParser {
    constructor(extensionUri, errorCollection = null) {
        this.errorCollection = errorCollection;
        this.baseDocumentIncludeItems = null;
        // Asciidoctor.js in the browser environment works with URIs however for desktop clients
        // the stylesdir attribute is expected to look like a file system path (especially on Windows)
        if (process.env.BROWSER_ENV) {
            this.stylesdir = vscode.Uri.joinPath(extensionUri, 'media').toString();
        }
        else {
            this.stylesdir = vscode.Uri.joinPath(extensionUri, 'media').fsPath;
        }
    }
    getMediaDir(text) {
        return text.match(/^\\s*:mediadir:/);
    }
    convertUsingJavascript(text, doc, forHTMLSave, backend, getDocumentInformation, context, editor) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const workspacePath = vscode.workspace.workspaceFolders;
                const containsStyle = !(text.match(/'^\\s*:(stylesheet|stylesdir)/img) == null);
                const useEditorStylesheet = vscode.workspace.getConfiguration('asciidoc', null).get('preview.useEditorStyle', false);
                const previewAttributes = vscode.workspace.getConfiguration('asciidoc', null).get('preview.attributes', {});
                const previewStyle = vscode.workspace.getConfiguration('asciidoc', null).get('preview.style', '');
                const useWorkspaceAsBaseDir = vscode.workspace.getConfiguration('asciidoc', null).get('useWorkspaceRoot');
                const enableErrorDiagnostics = vscode.workspace.getConfiguration('asciidoc', null).get('enableErrorDiagnostics');
                const documentPath = process.env.BROWSER_ENV
                    ? undefined
                    : path.dirname(path.resolve(doc.fileName));
                const baseDir = useWorkspaceAsBaseDir && typeof vscode.workspace.rootPath !== 'undefined'
                    ? vscode.workspace.rootPath
                    : documentPath;
                if (this.errorCollection) {
                    this.errorCollection.clear();
                }
                const memoryLogger = processor.MemoryLogger.create();
                processor.LoggerManager.setLogger(memoryLogger);
                const registry = processor.Extensions.create();
                // registry for processing document differently to find AST/metadata otherwise not available
                const registryForDocumentInfo = processor.Extensions.create();
                const asciidoctorWebViewConverter = new asciidoctorWebViewConverter_1.AsciidoctorWebViewConverter();
                processor.ConverterFactory.register(asciidoctorWebViewConverter, ['webview-html5']);
                const useKroki = vscode.workspace.getConfiguration('asciidoc', null).get('use_kroki');
                if (useKroki) {
                    kroki.register(registry);
                }
                // the include processor is only run to identify includes, not to process them
                if (getDocumentInformation) {
                    asciidoctorFindIncludeProcessor.register(registryForDocumentInfo);
                    asciidoctorFindIncludeProcessor.resetIncludes();
                }
                if (context && editor) {
                    highlightjsAdapter.register(highlightjsBuiltInSyntaxHighlighter, context, editor);
                }
                else {
                    highlightjsBuiltInSyntaxHighlighter.$register_for('highlight.js', 'highlightjs');
                }
                let attributes = {};
                if (containsStyle) {
                    attributes = { copycss: true };
                }
                else if (previewStyle !== '') {
                    let stylesdir, stylesheet;
                    if (path.isAbsolute(previewStyle)) {
                        stylesdir = path.dirname(previewStyle);
                        stylesheet = path.basename(previewStyle);
                    }
                    else {
                        if (workspacePath === undefined) {
                            stylesdir = '';
                        }
                        else if (workspacePath.length > 0) {
                            stylesdir = workspacePath[0].uri.path;
                        }
                        stylesdir = path.dirname(path.join(stylesdir, previewStyle));
                        stylesheet = path.basename(previewStyle);
                    }
                    attributes = {
                        copycss: true,
                        stylesdir: stylesdir,
                        stylesheet: stylesheet,
                    };
                }
                else if (useEditorStylesheet && !forHTMLSave) {
                    attributes = {
                        'allow-uri-read': true,
                        copycss: false,
                        stylesdir: this.stylesdir,
                        stylesheet: 'asciidoctor-editor.css',
                    };
                }
                else {
                    // TODO: decide whether to use the included css or let ascidoctor.js decide
                    // attributes = { 'copycss': true, 'stylesdir': this.stylesdir, 'stylesheet': 'asciidoctor-default.css@' }
                }
                // TODO: Check -- Not clear that this code is functional
                Object.keys(previewAttributes).forEach((key) => {
                    if (typeof previewAttributes[key] === 'string') {
                        attributes[key] = previewAttributes[key];
                        if (workspacePath !== undefined) {
                            // eslint-disable-next-line no-template-curly-in-string
                            attributes[key] = attributes[key].replace('${workspaceFolder}', workspacePath[0].uri.path);
                        }
                    }
                });
                attributes['env-vscode'] = '';
                if (backend.startsWith('docbook')) {
                    docbook.register();
                }
                let options = {
                    attributes: attributes,
                    backend: backend,
                    base_dir: baseDir,
                    extension_registry: getDocumentInformation ? registryForDocumentInfo : registry,
                    header_footer: true,
                    safe: 'unsafe',
                    sourcemap: true,
                    to_file: false,
                };
                if (baseDir) {
                    options = Object.assign(Object.assign({}, options), { base_dir: baseDir });
                }
                try {
                    const document = processor.load(text, options);
                    if (getDocumentInformation) {
                        this.baseDocumentIncludeItems = asciidoctorFindIncludeProcessor.getBaseDocIncludes();
                    }
                    const blocksWithLineNumber = document.findBy(function (b) {
                        return typeof b.getLineNumber() !== 'undefined';
                    });
                    blocksWithLineNumber.forEach(function (block) {
                        block.addRole('data-line-' + block.getLineNumber());
                    });
                    const resultHTML = document.convert(options);
                    if (enableErrorDiagnostics) {
                        const diagnostics = [];
                        memoryLogger.getMessages().forEach((error) => {
                            //console.log(error); //Error from asciidoctor.js
                            let errorMessage = error.getText();
                            let sourceLine = 0;
                            let relatedFile = null;
                            const diagnosticSource = 'asciidoctor.js';
                            // allocate to line 0 in the absence of information
                            let sourceRange = doc.lineAt(0).range;
                            const location = error.getSourceLocation();
                            if (location) { //There is a source location
                                if (location.getPath() === '<stdin>') { //error is within the file we are parsing
                                    sourceLine = location.getLineNumber() - 1;
                                    // ensure errors are always associated with a valid line
                                    sourceLine = sourceLine >= doc.lineCount ? doc.lineCount - 1 : sourceLine;
                                    sourceRange = doc.lineAt(sourceLine).range;
                                }
                                else { //error is coming from an included file
                                    relatedFile = error.getSourceLocation();
                                    // try to find the include responsible from the info provided by asciidoctor.js
                                    sourceLine = doc.getText().split('\n').indexOf(doc.getText().split('\n').find((str) => str.startsWith('include') && str.includes(error.message.source_location.path)));
                                    if (sourceLine !== -1) {
                                        sourceRange = doc.lineAt(sourceLine).range;
                                    }
                                }
                            }
                            else {
                                // generic error (e.g. :source-highlighter: coderay)
                                errorMessage = error.message;
                            }
                            let severity = vscode.DiagnosticSeverity.Information;
                            if (error.severity === 'WARN') {
                                severity = vscode.DiagnosticSeverity.Warning;
                            }
                            else if (error.severity === 'ERROR') {
                                severity = vscode.DiagnosticSeverity.Error;
                            }
                            else if (error.severity === 'DEBUG') {
                                severity = vscode.DiagnosticSeverity.Information;
                            }
                            let diagnosticRelated = null;
                            if (relatedFile) {
                                diagnosticRelated = [
                                    new vscode.DiagnosticRelatedInformation(new vscode.Location(vscode.Uri.file(relatedFile.file), new vscode.Position(0, 0)), errorMessage),
                                ];
                                errorMessage = 'There was an error in an included file';
                            }
                            const diagnosticError = new vscode.Diagnostic(sourceRange, errorMessage, severity);
                            diagnosticError.source = diagnosticSource;
                            if (diagnosticRelated) {
                                diagnosticError.relatedInformation = diagnosticRelated;
                            }
                            diagnostics.push(diagnosticError);
                        });
                        if (this.errorCollection) {
                            this.errorCollection.set(doc.uri, diagnostics);
                        }
                    }
                    resolve({ html: resultHTML, document });
                }
                catch (e) {
                    vscode.window.showErrorMessage(e.toString());
                    reject(e);
                }
            });
        });
    }
    convertUsingApplication(text, doc, forHTMLSave, backend) {
        return __awaiter(this, void 0, void 0, function* () {
            const documentPath = path.dirname(doc.fileName).replace('"', '\\"');
            const workspacePath = vscode.workspace.workspaceFolders;
            const containsStyle = !(text.match(/'^\\s*:(stylesheet|stylesdir):/img) == null);
            const useEditorStylesheet = vscode.workspace.getConfiguration('asciidoc', null).get('preview.useEditorStyle', false);
            const previewAttributes = vscode.workspace.getConfiguration('asciidoc', null).get('preview.attributes', {});
            const previewStyle = vscode.workspace.getConfiguration('asciidoc', null).get('preview.style', '');
            const useWorkspaceAsBaseDir = vscode.workspace.getConfiguration('asciidoc', null).get('useWorkspaceRoot');
            let baseDir = documentPath;
            if (useWorkspaceAsBaseDir && typeof vscode.workspace.rootPath !== 'undefined') {
                baseDir = vscode.workspace.rootPath.replace('"', '\\"');
            }
            return new Promise((resolve) => {
                const asciidoctorCommand = vscode.workspace.getConfiguration('asciidoc', null).get('asciidoctor_command', 'asciidoctor');
                let RUBYOPT = process.env.RUBYOPT;
                if (RUBYOPT) {
                    let prevOpt;
                    RUBYOPT = RUBYOPT.split(' ').reduce((acc, opt) => {
                        acc.push(prevOpt === '-E' ? (prevOpt = 'UTF-8:UTF-8') : (prevOpt = opt));
                        return acc;
                    }, []).join(' ');
                }
                else {
                    RUBYOPT = '-E UTF-8:UTF-8';
                }
                const options = { shell: true, cwd: path.dirname(doc.fileName), env: Object.assign(Object.assign({}, process.env), { RUBYOPT }) };
                const adocCmdArray = asciidoctorCommand.split(/(\s+)/).filter(function (e) {
                    return e.trim().length > 0;
                });
                const adocCmd = adocCmdArray[0];
                const adocCmdArgs = adocCmdArray.slice(1);
                if (containsStyle) {
                    ; // Used an empty if to make it easier to use elses later
                }
                else if (previewStyle !== '') {
                    let stylesdir, stylesheet;
                    if (path.isAbsolute(previewStyle)) {
                        stylesdir = path.dirname(previewStyle);
                        stylesheet = path.basename(previewStyle);
                    }
                    else {
                        if (workspacePath === undefined) {
                            stylesdir = documentPath;
                        }
                        else if (workspacePath.length > 0) {
                            stylesdir = workspacePath[0].uri.path;
                        }
                        stylesdir = path.dirname(path.join(stylesdir, previewStyle));
                        stylesheet = path.basename(previewStyle);
                    }
                    adocCmdArgs.push('-a', `stylesdir=${stylesdir}`);
                    adocCmdArgs.push('-a', `stylesheet=${stylesheet}`);
                }
                else if (useEditorStylesheet && !forHTMLSave) {
                    adocCmdArgs.push('-a', `stylesdir=${this.stylesdir}@`);
                    adocCmdArgs.push('-a', 'stylesheet=asciidoctor-editor.css@');
                }
                else {
                    // TODO: decide whether to use the included css or let ascidoctor decide
                    // adoc_cmd_args.push.apply(adoc_cmd_args, ['-a', `stylesdir=${this.stylesdir}@`])
                    // adoc_cmd_args.push.apply(adoc_cmd_args, ['-a', 'stylesheet=asciidoctor-default.css@'])
                }
                adocCmdArgs.push('-b', backend);
                Object.keys(previewAttributes).forEach((key) => {
                    if (typeof previewAttributes[key] === 'string') {
                        let value = previewAttributes[key];
                        if (workspacePath !== undefined) {
                            // eslint-disable-next-line no-template-curly-in-string
                            value = value.replace('${workspaceFolder}', workspacePath[0].uri.path);
                        }
                        if (value.endsWith('!')) {
                            adocCmdArgs.push('-a', `${value}`);
                        }
                        else {
                            adocCmdArgs.push('-a', `${key}=${value}`);
                        }
                    }
                });
                adocCmdArgs.push('-a', 'env-vscode');
                adocCmdArgs.push('-q', '-B', '"' + baseDir + '"', '-o', '-', '-');
                const asciidoctorProcess = (0, child_process_1.spawn)(adocCmd, adocCmdArgs, options);
                asciidoctorProcess.stderr.on('data', (data) => {
                    let errorMessage = data.toString();
                    console.error(errorMessage);
                    errorMessage += errorMessage.replace('\n', '<br><br>');
                    errorMessage += '<br><br>';
                    errorMessage += '<b>command:</b> ' + adocCmd + ' ' + adocCmdArgs.join(' ');
                    errorMessage += '<br><br>';
                    errorMessage += '<b>If the asciidoctor binary is not in your PATH, you can set the full path.<br>';
                    errorMessage += 'Go to `File -> Preferences -> User settings` and adjust the asciidoc.asciidoctor_command</b>';
                    resolve(errorMessage);
                });
                let resultData = Buffer.from('');
                /* with large outputs we can receive multiple calls */
                asciidoctorProcess.stdout.on('data', (data) => {
                    resultData = Buffer.concat([resultData, data]);
                });
                asciidoctorProcess.on('close', () => {
                    resolve(resultData.toString());
                });
                asciidoctorProcess.stdin.write(text);
                asciidoctorProcess.stdin.end();
            });
        });
    }
    parseText(text, doc, forHTMLSave = false, backend = 'webview-html5', context, editor) {
        return __awaiter(this, void 0, void 0, function* () {
            const useAsciidoctorJs = vscode.workspace.getConfiguration('asciidoc', null).get('use_asciidoctor_js');
            if (useAsciidoctorJs) {
                return this.convertUsingJavascript(text, doc, forHTMLSave, backend, false, context, editor);
            }
            // AsciidoctorWebViewConverter is not available in asciidoctor (Ruby) CLI
            const html = yield this.convertUsingApplication(text, doc, forHTMLSave, backend === 'webview-html5' ? 'html5' : backend);
            return { html };
        });
    }
}
exports.AsciidocParser = AsciidocParser;
//# sourceMappingURL=asciidocParser.js.map