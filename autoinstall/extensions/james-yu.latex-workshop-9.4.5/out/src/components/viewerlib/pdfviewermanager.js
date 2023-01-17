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
exports.PdfViewerManagerService = void 0;
const lw = __importStar(require("../../lw"));
class PdfViewerManagerService {
    static toKey(pdfFileUri) {
        return pdfFileUri.toString(true).toLocaleUpperCase();
    }
    static createClientSet(pdfFileUri) {
        const key = PdfViewerManagerService.toKey(pdfFileUri);
        if (!PdfViewerManagerService.clientMap.has(key)) {
            PdfViewerManagerService.clientMap.set(key, new Set());
        }
        if (!PdfViewerManagerService.webviewPanelMap.has(key)) {
            PdfViewerManagerService.webviewPanelMap.set(key, new Set());
        }
    }
    /**
     * Returns the set of client instances of a PDF file.
     * Returns `undefined` if the viewer have not recieved any request for the PDF file.
     *
     * @param pdfFileUri The path of a PDF file.
     */
    static getClientSet(pdfFileUri) {
        return PdfViewerManagerService.clientMap.get(PdfViewerManagerService.toKey(pdfFileUri));
    }
    static getPanelSet(pdfFileUri) {
        return PdfViewerManagerService.webviewPanelMap.get(PdfViewerManagerService.toKey(pdfFileUri));
    }
    static findClient(pdfFileUri, websocket) {
        const clientSet = PdfViewerManagerService.getClientSet(pdfFileUri);
        if (clientSet === undefined) {
            return;
        }
        for (const client of clientSet) {
            if (client.websocket === websocket) {
                return client;
            }
        }
        return;
    }
    static initiatePdfViewerPanel(pdfPanel) {
        const pdfFileUri = pdfPanel.pdfFileUri;
        lw.cacher.watchPdfFile(pdfFileUri);
        PdfViewerManagerService.createClientSet(pdfFileUri);
        const panelSet = PdfViewerManagerService.getPanelSet(pdfFileUri);
        if (!panelSet) {
            return;
        }
        panelSet.add(pdfPanel);
        pdfPanel.webviewPanel.onDidDispose(() => {
            panelSet.delete(pdfPanel);
        });
        return pdfPanel;
    }
}
exports.PdfViewerManagerService = PdfViewerManagerService;
PdfViewerManagerService.webviewPanelMap = new Map();
PdfViewerManagerService.clientMap = new Map();
//# sourceMappingURL=pdfviewermanager.js.map