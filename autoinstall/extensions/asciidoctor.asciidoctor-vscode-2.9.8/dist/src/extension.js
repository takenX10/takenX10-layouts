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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const commandManager_1 = require("./commandManager");
const commands = __importStar(require("./commands/index"));
const documentLinkProvider_1 = __importDefault(require("./features/documentLinkProvider"));
const documentSymbolProvider_1 = __importDefault(require("./features/documentSymbolProvider"));
const previewContentProvider_1 = require("./features/previewContentProvider");
const previewManager_1 = require("./features/previewManager");
const workspaceSymbolProvider_1 = __importDefault(require("./features/workspaceSymbolProvider"));
const logger_1 = require("./logger");
const asciidocEngine_1 = require("./asciidocEngine");
const asciidocExtensions_1 = require("./asciidocExtensions");
const security_1 = require("./security");
const slugify_1 = require("./slugify");
const includeAutoCompletion_1 = require("./util/includeAutoCompletion");
const attributeReferenceProvider_1 = require("./features/attributeReferenceProvider");
const builtinDocumentAttributeProvider_1 = require("./features/builtinDocumentAttributeProvider");
function activate(context) {
    const contributions = (0, asciidocExtensions_1.getAsciidocExtensionContributions)(context);
    const cspArbiter = new security_1.ExtensionContentSecurityPolicyArbiter(context.globalState, context.workspaceState);
    const errorCollection = vscode.languages.createDiagnosticCollection('asciidoc');
    const engine = new asciidocEngine_1.AsciidocEngine(contributions, slugify_1.githubSlugifier, errorCollection);
    const logger = new logger_1.Logger();
    logger.log('Extension was started');
    const selector = [
        { language: 'asciidoc', scheme: 'file' },
        { language: 'asciidoc', scheme: 'untitled' },
    ];
    const contentProvider = new previewContentProvider_1.AsciidocContentProvider(engine, context, cspArbiter, contributions, logger);
    const symbolProvider = new documentSymbolProvider_1.default(engine, null);
    const previewManager = new previewManager_1.AsciidocPreviewManager(contentProvider, logger, contributions);
    context.subscriptions.push(previewManager);
    const includeAutoCompletionMonitor = new includeAutoCompletion_1.AsciidocFileIncludeAutoCompletionMonitor();
    context.subscriptions.push(includeAutoCompletionMonitor);
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(selector, symbolProvider));
    context.subscriptions.push(vscode.languages.registerDocumentLinkProvider(selector, new documentLinkProvider_1.default(engine)));
    context.subscriptions.push(vscode.languages.registerWorkspaceSymbolProvider(new workspaceSymbolProvider_1.default(symbolProvider)));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(selector, new attributeReferenceProvider_1.AttributeReferenceProvider(contributions.extensionUri), '{'));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(selector, new builtinDocumentAttributeProvider_1.BuiltinDocumentAttributeProvider(contributions.extensionUri), ':'));
    const previewSecuritySelector = new security_1.PreviewSecuritySelector(cspArbiter, previewManager);
    const commandManager = new commandManager_1.CommandManager();
    context.subscriptions.push(commandManager);
    commandManager.register(new commands.ShowPreviewCommand(previewManager));
    commandManager.register(new commands.ShowPreviewToSideCommand(previewManager));
    commandManager.register(new commands.ShowLockedPreviewToSideCommand(previewManager));
    commandManager.register(new commands.ShowSourceCommand(previewManager));
    commandManager.register(new commands.RefreshPreviewCommand(previewManager));
    commandManager.register(new commands.MoveCursorToPositionCommand());
    commandManager.register(new commands.ShowPreviewSecuritySelectorCommand(previewSecuritySelector, previewManager));
    commandManager.register(new commands.OpenDocumentLinkCommand(engine));
    commandManager.register(new commands.ExportAsPDF(engine, logger));
    commandManager.register(new commands.PasteImage());
    commandManager.register(new commands.ToggleLockCommand(previewManager));
    commandManager.register(new commands.ShowPreviewCommand(previewManager));
    commandManager.register(new commands.SaveHTML(engine));
    commandManager.register(new commands.SaveDocbook(engine));
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(() => {
        logger.updateConfiguration();
        previewManager.updateConfiguration();
        previewManager.refresh(true);
    }));
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(() => {
        errorCollection.clear();
    }));
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(() => {
        previewManager.refresh(true);
    }));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map