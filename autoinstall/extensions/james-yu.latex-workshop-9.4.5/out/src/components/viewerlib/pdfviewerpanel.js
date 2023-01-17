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
exports.PdfViewerPanelService = exports.PdfViewerPanelSerializer = exports.PdfViewerPanel = void 0;
const vscode = __importStar(require("vscode"));
const lw = __importStar(require("../../lw"));
const utils_1 = require("../../utils/utils");
const pdfviewermanager_1 = require("./pdfviewermanager");
const eventbus_1 = require("../eventbus");
const logger_1 = require("../logger");
const encodepath_1 = require("../serverlib/encodepath");
const logger = (0, logger_1.getLogger)('Viewer', 'Panel');
class PdfViewerPanel {
    constructor(pdfFileUri, panel) {
        this.pdfFileUri = pdfFileUri;
        this.webviewPanel = panel;
        panel.webview.onDidReceiveMessage((msg) => {
            switch (msg.type) {
                case 'state': {
                    this.viewerState = msg.state;
                    lw.eventBus.fire(eventbus_1.ViewerStatusChanged, msg.state);
                    break;
                }
                default: {
                    break;
                }
            }
        });
    }
    get state() {
        return this.viewerState;
    }
}
exports.PdfViewerPanel = PdfViewerPanel;
class PdfViewerPanelSerializer {
    async deserializeWebviewPanel(panel, argState) {
        await lw.server.serverStarted;
        logger.log(`Restoring at column ${panel.viewColumn} with state ${JSON.stringify(argState.state)}.`);
        const state = argState.state;
        let pdfFileUri;
        if (state.path) {
            pdfFileUri = vscode.Uri.file(state.path);
        }
        else if (state.pdfFileUri) {
            pdfFileUri = vscode.Uri.parse(state.pdfFileUri, true);
        }
        if (!pdfFileUri) {
            logger.log('Failed restoring viewer with undefined PDF path.');
            panel.webview.html = '<!DOCTYPE html> <html lang="en"><meta charset="utf-8"/><br>The path of PDF file is undefined.</html>';
            return;
        }
        if (!await lw.lwfs.exists(pdfFileUri)) {
            const s = (0, utils_1.escapeHtml)(pdfFileUri.toString());
            logger.log(`Failed restoring viewer with non-existent PDF ${pdfFileUri.toString(true)} .`);
            panel.webview.html = `<!DOCTYPE html> <html lang="en"><meta charset="utf-8"/><br>File not found: ${s}</html>`;
            return;
        }
        panel.webview.html = await PdfViewerPanelService.getPDFViewerContent(pdfFileUri);
        const pdfPanel = new PdfViewerPanel(pdfFileUri, panel);
        pdfviewermanager_1.PdfViewerManagerService.initiatePdfViewerPanel(pdfPanel);
        return;
    }
}
exports.PdfViewerPanelSerializer = PdfViewerPanelSerializer;
class PdfViewerPanelService {
    static encodePathWithPrefix(pdfFileUri) {
        return encodepath_1.PdfFilePathEncoder.encodePathWithPrefix(pdfFileUri);
    }
    static async tweakForCodespaces(url) {
        if (this.alreadyOpened) {
            return;
        }
        if (vscode.env.remoteName === 'codespaces' && vscode.env.uiKind === vscode.UIKind.Web) {
            const configuration = vscode.workspace.getConfiguration('latex-workshop');
            const delay = configuration.get('codespaces.portforwarding.openDelay', 20000);
            // We have to open the url in a browser tab for the authentication of port forwarding through githubpreview.dev.
            await vscode.env.openExternal(url);
            await (0, utils_1.sleep)(delay);
        }
        this.alreadyOpened = true;
    }
    static async populatePdfViewerPanel(pdfFileUri, webviewPanel) {
        await lw.server.serverStarted;
        webviewPanel.webview.html = await this.getPDFViewerContent(pdfFileUri);
        return new PdfViewerPanel(pdfFileUri, webviewPanel);
    }
    static getKeyboardEventConfig() {
        const configuration = vscode.workspace.getConfiguration('latex-workshop');
        const setting = configuration.get('viewer.pdf.internal.keyboardEvent', 'auto');
        if (setting === 'auto') {
            return true;
        }
        else if (setting === 'force') {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Returns the HTML content of the internal PDF viewer.
     *
     * @param pdfFile The path of a PDF file to be opened.
     */
    static async getPDFViewerContent(pdfFile) {
        const serverPort = lw.server.port;
        // viewer/viewer.js automatically requests the file to server.ts, and server.ts decodes the encoded path of PDF file.
        const origUrl = `http://127.0.0.1:${serverPort}/viewer.html?file=${this.encodePathWithPrefix(pdfFile)}`;
        const url = await vscode.env.asExternalUri(vscode.Uri.parse(origUrl, true));
        const iframeSrcOrigin = `${url.scheme}://${url.authority}`;
        const iframeSrcUrl = url.toString(true);
        await this.tweakForCodespaces(url);
        logger.log(`Internal PDF viewer at ${iframeSrcUrl} .`);
        const rebroadcast = this.getKeyboardEventConfig();
        return `
        <!DOCTYPE html><html><head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; base-uri 'none'; frame-src ${iframeSrcOrigin}; script-src 'unsafe-inline'; style-src 'unsafe-inline';"></head>
        <body><iframe id="preview-panel" class="preview-panel" src="${iframeSrcUrl}" style="position:absolute; border: none; left: 0; top: 0; width: 100%; height: 100%;">
        </iframe>
        <script>
        // When the tab gets focus again later, move the
        // the focus to the iframe so that keyboard navigation works in the pdf.
        const iframe = document.getElementById('preview-panel');
        window.onfocus = function() {
            setTimeout(function() { // doesn't work immediately
                iframe.contentWindow.focus();
            }, 100);
        }

        // Prevent the whole iframe selected.
        // See https://github.com/James-Yu/LaTeX-Workshop/issues/3408
        window.addEventListener('selectstart', (e) => {
            e.preventDefault();
        });

        const vsStore = acquireVsCodeApi();
        // To enable keyboard shortcuts of VS Code when the iframe is focused,
        // we have to dispatch keyboard events in the parent window.
        // See https://github.com/microsoft/vscode/issues/65452#issuecomment-586036474
        window.addEventListener('message', (e) => {
            if (e.origin !== '${iframeSrcOrigin}') {
                return;
            }
            switch (e.data.type) {
                case 'initialized': {
                    const state = vsStore.getState();
                    if (state) {
                        state.type = 'restore_state';
                        iframe.contentWindow.postMessage(state, '${iframeSrcOrigin}');
                    } else {
                        iframe.contentWindow.postMessage({type: 'restore_state', state: {kind: 'not_stored'} }, '${iframeSrcOrigin}');
                    }
                    break;
                }
                case 'keyboard_event': {
                    if (${rebroadcast}) {
                        window.dispatchEvent(new KeyboardEvent('keydown', e.data.event));
                    }
                    break;
                }
                case 'state': {
                    vsStore.setState(e.data);
                    break;
                }
                default:
                break;
            }
            vsStore.postMessage(e.data)
        });
        </script>
        </body></html>
        `;
    }
}
exports.PdfViewerPanelService = PdfViewerPanelService;
PdfViewerPanelService.alreadyOpened = false;
//# sourceMappingURL=pdfviewerpanel.js.map