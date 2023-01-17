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
exports.PreviewSecuritySelector = exports.ExtensionContentSecurityPolicyArbiter = void 0;
const vscode = __importStar(require("vscode"));
const nls = __importStar(require("vscode-nls"));
const localize = nls.loadMessageBundle();
class ExtensionContentSecurityPolicyArbiter {
    constructor(globalState, workspaceState) {
        this.globalState = globalState;
        this.workspaceState = workspaceState;
        this.oldTrustedWorkspaceKey = 'trusted_preview_workspace:';
        this.securityLevelKey = 'preview_security_level:';
        this.shouldDisableSecurityWarningKey = 'preview_should_show_security_warning:';
        this.globalState = globalState;
        this.workspaceState = workspaceState;
    }
    getSecurityLevelForResource(resource) {
        // Use new security level setting first
        const level = this.globalState.get(this.securityLevelKey + this.getRoot(resource), undefined);
        if (typeof level !== 'undefined') {
            return level;
        }
        // Fallback to old trusted workspace setting
        if (this.globalState.get(this.oldTrustedWorkspaceKey + this.getRoot(resource), false)) {
            return 2 /* AllowScriptsAndAllContent */;
        }
        return 0 /* Strict */;
    }
    setSecurityLevelForResource(resource, level) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.globalState.update(this.securityLevelKey + this.getRoot(resource), level);
        });
    }
    shouldAllowSvgsForResource(resource) {
        const securityLevel = this.getSecurityLevelForResource(resource);
        return securityLevel === 1 /* AllowInsecureContent */ || securityLevel === 2 /* AllowScriptsAndAllContent */;
    }
    shouldDisableSecurityWarnings() {
        return this.workspaceState.get(this.shouldDisableSecurityWarningKey, false);
    }
    setShouldDisableSecurityWarning(disabled) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.workspaceState.update(this.shouldDisableSecurityWarningKey, disabled);
        });
    }
    getRoot(resource) {
        if (vscode.workspace.workspaceFolders) {
            const folderForResource = vscode.workspace.getWorkspaceFolder(resource);
            if (folderForResource) {
                return folderForResource.uri;
            }
            if (vscode.workspace.workspaceFolders.length) {
                return vscode.workspace.workspaceFolders[0].uri;
            }
        }
        return resource;
    }
}
exports.ExtensionContentSecurityPolicyArbiter = ExtensionContentSecurityPolicyArbiter;
class PreviewSecuritySelector {
    constructor(cspArbiter, webviewManager) {
        this.cspArbiter = cspArbiter;
        this.webviewManager = webviewManager;
        this.cspArbiter = cspArbiter;
        this.webviewManager = webviewManager;
    }
    showSecuritySelectorForResource(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            function markActiveWhen(when) {
                return when ? '• ' : '';
            }
            const currentSecurityLevel = this.cspArbiter.getSecurityLevelForResource(resource);
            const selection = yield vscode.window.showQuickPick([
                {
                    type: 0 /* Strict */,
                    label: markActiveWhen(currentSecurityLevel === 0 /* Strict */) + localize('strict.title', 'Strict'),
                    description: localize('strict.description', 'Only load secure content'),
                }, {
                    type: 3 /* AllowInsecureLocalContent */,
                    label: markActiveWhen(currentSecurityLevel === 3 /* AllowInsecureLocalContent */) + localize('insecureLocalContent.title', 'Allow insecure local content'),
                    description: localize('insecureLocalContent.description', 'Enable loading content over http served from localhost'),
                }, {
                    type: 1 /* AllowInsecureContent */,
                    label: markActiveWhen(currentSecurityLevel === 1 /* AllowInsecureContent */) + localize('insecureContent.title', 'Allow insecure content'),
                    description: localize('insecureContent.description', 'Enable loading content over http'),
                }, {
                    type: 2 /* AllowScriptsAndAllContent */,
                    label: markActiveWhen(currentSecurityLevel === 2 /* AllowScriptsAndAllContent */) + localize('disable.title', 'Disable'),
                    description: localize('disable.description', 'Allow all content and script execution. Not recommended'),
                }, {
                    type: 'moreinfo',
                    label: localize('moreInfo.title', 'More Information'),
                    description: '',
                }, {
                    type: 'toggle',
                    label: this.cspArbiter.shouldDisableSecurityWarnings()
                        ? localize('enableSecurityWarning.title', 'Enable preview security warnings in this workspace')
                        : localize('disableSecurityWarning.title', 'Disable preview security warning in this workspace'),
                    description: localize('toggleSecurityWarning.description', 'Does not affect the content security level'),
                },
            ], {
                placeHolder: localize('preview.showPreviewSecuritySelector.title', 'Select security settings for Asciidoc previews in this workspace'),
            });
            if (!selection) {
                return;
            }
            if (selection.type === 'moreinfo') {
                vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://go.microsoft.com/fwlink/?linkid=854414'));
                return;
            }
            if (selection.type === 'toggle') {
                yield this.cspArbiter.setShouldDisableSecurityWarning(!this.cspArbiter.shouldDisableSecurityWarnings());
                return;
            }
            yield this.cspArbiter.setSecurityLevelForResource(resource, selection.type);
            this.webviewManager.refresh();
        });
    }
}
exports.PreviewSecuritySelector = PreviewSecuritySelector;
//# sourceMappingURL=security.js.map