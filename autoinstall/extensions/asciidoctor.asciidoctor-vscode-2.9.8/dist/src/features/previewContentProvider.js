"use strict";
/*---------------------------------------------------------------------------------------------
  *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
exports.AsciidocContentProvider = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const nls = __importStar(require("vscode-nls"));
const localize = nls.loadMessageBundle();
/**
 * Strings used inside the asciidoc preview.
 *
 * Stored here and then injected in the preview so that they
 * can be localized using our normal localization process.
 */
const previewStrings = {
    cspAlertMessageText: localize('preview.securityMessage.text', 'Some content has been disabled in this document'),
    cspAlertMessageTitle: localize('preview.securityMessage.title', 'Potentially unsafe or insecure content has been disabled in the Asciidoc preview. Change the Asciidoc preview security setting to allow insecure content or enable scripts'),
    cspAlertMessageLabel: localize('preview.securityMessage.label', 'Content Disabled Security Warning'),
};
class AsciidocContentProvider {
    constructor(engine, context, cspArbiter, contributions, logger) {
        this.engine = engine;
        this.context = context;
        this.cspArbiter = cspArbiter;
        this.contributions = contributions;
        this.logger = logger;
        this.engine = engine;
        this.context = context;
        this.cspArbiter = cspArbiter;
        this.contributions = contributions;
        this.logger = logger;
    }
    providePreviewHTML(asciidocDocument, previewConfigurations, initialLine = undefined, state, editor) {
        return __awaiter(this, void 0, void 0, function* () {
            const sourceUri = asciidocDocument.uri;
            const config = previewConfigurations.loadAndCacheConfiguration(sourceUri);
            const initialData = {
                source: sourceUri.toString(),
                line: initialLine,
                lineCount: asciidocDocument.lineCount,
                scrollPreviewWithEditor: config.scrollPreviewWithEditor,
                scrollEditorWithPreview: config.scrollEditorWithPreview,
                doubleClickToSwitchToEditor: config.doubleClickToSwitchToEditor,
                disableSecurityWarnings: this.cspArbiter.shouldDisableSecurityWarnings(),
            };
            // Content Security Policy
            const nonce = new Date().getTime() + '' + new Date().getMilliseconds();
            const csp = this.getCspForResource(sourceUri, nonce);
            const { output: body } = yield this.engine.render(sourceUri, config.previewFrontMatter === 'hide', asciidocDocument.getText(), false, 'webview-html5', this.context, editor);
            const bodyClassesRegex = /<body(?:(?:\s+(?:id=".*"\s*)?class(?:\s*=\s*(?:"(.+?)"|'(.+?)')))+\s*)>/;
            const bodyClasses = body.match(bodyClassesRegex);
            const bodyClassesVal = bodyClasses === null ? '' : bodyClasses[1];
            this.logger.log(`Using CSS ${this.getStyles(sourceUri, nonce, config, state)}`);
            return `<!DOCTYPE html>
      <html>
      <head>
        <meta http-equiv="Content-type" content="text/html;charset=UTF-8">
        ${csp}
        <meta id="vscode-asciidoc-preview-data"
          data-settings="${JSON.stringify(initialData).replace(/"/g, '&quot;')}"
          data-strings="${JSON.stringify(previewStrings).replace(/"/g, '&quot;')}"
          data-state="${JSON.stringify(state || {}).replace(/"/g, '&quot;')}">
        <script src="${this.extensionResourcePath(editor.webview, 'pre.js')}" nonce="${nonce}"></script>
        ${this.getStyles(sourceUri, nonce, config, state)}
        <base href="${editor.webview.asWebviewUri(asciidocDocument.uri).toString(true)}">
      </head>
      <body class="${bodyClassesVal} vscode-body ${config.scrollBeyondLastLine ? 'scrollBeyondLastLine' : ''} ${config.wordWrap ? 'wordWrap' : ''} ${config.markEditorSelection ? 'showEditorSelection' : ''}">
        ${body}
        <div class="code-line" data-line="${asciidocDocument.lineCount}"></div>
        <script async src="${this.extensionResourcePath(editor.webview, 'index.js')}" nonce="${nonce}" charset="UTF-8"></script>
      </body>
      </html>`;
        });
    }
    extensionResourcePath(webview, mediaFile) {
        const webviewResource = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dist', mediaFile));
        return webviewResource.toString();
    }
    fixHref(resource, href) {
        if (!href) {
            return href;
        }
        // Use href if it is already an URL
        const hrefUri = vscode.Uri.parse(href);
        if (['http', 'https'].indexOf(hrefUri.scheme) >= 0) {
            return hrefUri.toString();
        }
        // Use href as file URI if it is absolute
        if (path.isAbsolute(href) || hrefUri.scheme === 'file') {
            return vscode.Uri.file(href)
                .with({ scheme: 'vscode-resource' })
                .toString();
        }
        // Use a workspace relative path if there is a workspace
        const root = vscode.workspace.getWorkspaceFolder(resource);
        if (root) {
            return vscode.Uri.file(path.join(root.uri.fsPath, href))
                .with({ scheme: 'vscode-resource' })
                .toString();
        }
        // Otherwise look relative to the asciidoc file
        return vscode.Uri.file(path.join(path.dirname(resource.fsPath), href))
            .with({ scheme: 'vscode-resource' })
            .toString();
    }
    computeCustomStyleSheetIncludes(resource, config) {
        if (Array.isArray(config.styles)) {
            return config.styles.map((style) => {
                return `<link rel="stylesheet" class="code-user-style" data-source="${style.replace(/"/g, '&quot;')}" href="${this.fixHref(resource, style)}" type="text/css" media="screen">`;
            }).join('\n');
        }
        return '';
    }
    getSettingsOverrideStyles(nonce, config) {
        return `<style nonce="${nonce}">
      body {
        ${config.fontFamily ? `font-family: ${config.fontFamily};` : ''}
        ${isNaN(config.fontSize) ? '' : `font-size: ${config.fontSize}px;`}
        ${isNaN(config.lineHeight) ? '' : `line-height: ${config.lineHeight};`}
      }
    </style>`;
    }
    getImageStabilizerStyles(state) {
        let ret = '<style>\n';
        if (state && state.imageInfo) {
            state.imageInfo.forEach((imgInfo) => {
                ret += `#${imgInfo.id}.loading {
          height: ${imgInfo.height}px;
          width: ${imgInfo.width}px;
        }\n`;
            });
        }
        ret += '</style>\n';
        return ret;
    }
    getStyles(resource, nonce, config, state) {
        const useEditorStyle = vscode.workspace.getConfiguration('asciidoc', null).get('preview.useEditorStyle');
        let baseStyles;
        if (useEditorStyle) {
            baseStyles = this.contributions.previewStylesEditor
                .map((resource) => `<link rel="stylesheet" type="text/css" href="${resource.toString()}">`)
                .join('\n');
        }
        else {
            baseStyles = this.contributions.previewStylesDefault
                .map((resource) => `<link rel="stylesheet" type="text/css" href="${resource.toString()}">`)
                .join('\n');
        }
        return `${baseStyles}
      ${this.getSettingsOverrideStyles(nonce, config)}
      ${this.computeCustomStyleSheetIncludes(resource, config)}
      ${this.getImageStabilizerStyles(state)}`;
    }
    getCspForResource(resource, nonce) {
        const highlightjsInlineScriptHash = 'sha256-ZrDBcrmObbqhVV/Mag2fT/y08UJGejdW7UWyEsi4DXw=';
        switch (this.cspArbiter.getSecurityLevelForResource(resource)) {
            case 1 /* AllowInsecureContent */:
                return `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: http: https: data:; media-src vscode-resource: http: https: data:; script-src vscode-resource: 'nonce-${nonce}' '${highlightjsInlineScriptHash}'; style-src vscode-resource: 'unsafe-inline' http: https: data:; font-src vscode-resource: http: https: data:;">`;
            case 3 /* AllowInsecureLocalContent */:
                return `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https: data: http://localhost:* http://127.0.0.1:*; media-src vscode-resource: https: data: http://localhost:* http://127.0.0.1:*; script-src vscode-resource: 'nonce-${nonce}' '${highlightjsInlineScriptHash}'; style-src vscode-resource: 'unsafe-inline' https: data: http://localhost:* http://127.0.0.1:*; font-src vscode-resource: https: data: http://localhost:* http://127.0.0.1:*;">`;
            case 2 /* AllowScriptsAndAllContent */:
                return '';
            case 0 /* Strict */:
            default:
                return `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https: data:; media-src vscode-resource: https: data:; script-src vscode-resource: 'nonce-${nonce}' '${highlightjsInlineScriptHash}'; style-src vscode-resource: 'unsafe-inline' https: data:; font-src vscode-resource: https: data:;">`;
        }
    }
}
exports.AsciidocContentProvider = AsciidocContentProvider;
//# sourceMappingURL=previewContentProvider.js.map