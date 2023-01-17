import { Disposable, workspace, languages, RelativePattern, Uri, window, commands, env, StatusBarAlignment } from 'vscode';
import { GrammarlyLanguageClient } from 'grammarly-languageclient';

class GrammarlyClient {
    constructor(context) {
        this.context = context;
        this.callbacks = new Set();
        this.isReady = false;
        this.selectors = [];
    }
    onReady(fn) {
        this.callbacks.add(fn);
        if (this.isReady)
            fn();
        return new Disposable(() => this.callbacks.delete(fn));
    }
    matchesDocumentSelector(document) {
        const selector = workspace
            .getConfiguration('grammarly')
            .get('files.exclude', [])
            .map((pattern) => ({ pattern }));
        return languages.match(this.selectors, document) > 0 && languages.match(selector, document) <= 0;
    }
    createClient() {
        var _a;
        const config = workspace.getConfiguration('grammarly');
        const folder = (_a = workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a[0];
        this.selectors = [];
        config.get('patterns', []).forEach((pattern) => {
            this.selectors.push({
                scheme: 'file',
                pattern: folder != null ? new RelativePattern(folder, pattern) : pattern,
            });
        });
        config.get('files.include', []).forEach((pattern) => {
            this.selectors.push({ pattern });
        });
        config.get('selectors', []).forEach((selector) => {
            if (folder != null && selector.pattern != null) {
                this.selectors.push({
                    ...selector,
                    pattern: new RelativePattern(folder, String(selector.pattern)),
                });
            }
            else {
                this.selectors.push(selector);
            }
        });
        const client = new GrammarlyLanguageClient(isNode()
            ? this.context.asAbsolutePath(`dist/server/index.node.js`)
            : Uri.joinPath(this.context.extensionUri, `dist/server/index.browser.js`).toString(), {
            id: 'client_BaDkMgx4X19X9UxxYRCXZo',
            name: 'Grammarly',
            outputChannel: window.createOutputChannel('Grammarly'),
            documentSelector: this.selectors
                .map((selector) => selector.language != null || selector.pattern != null || selector.scheme != null ? selector : null)
                .filter((value) => value != null),
            initializationOptions: {
                startTextCheckInPausedState: config.get('startTextCheckInPausedState'),
            },
            revealOutputChannelOn: 3,
            progressOnInitialization: true,
            errorHandler: {
                error(error) {
                    window.showErrorMessage(error.message);
                    return 2;
                },
                closed() {
                    return 1;
                },
            },
            markdown: {
                isTrusted: true,
                // @ts-ignore
                supportHtml: true,
            },
            middleware: {
                didOpen: (document, next) => {
                    if (this.matchesDocumentSelector(document))
                        next(document);
                },
                didChange: (event, next) => {
                    if (this.matchesDocumentSelector(event.document))
                        next(event);
                },
                didSave: (document, next) => {
                    if (this.matchesDocumentSelector(document))
                        next(document);
                },
            },
        });
        return client;
    }
    register() {
        return Disposable.from(workspace.onDidChangeConfiguration(async (event) => {
            if (event.affectsConfiguration('grammarly.patterns') ||
                event.affectsConfiguration('grammarly.files') ||
                event.affectsConfiguration('grammarly.selectors')) {
                await this.start();
            }
        }), window.registerUriHandler({
            handleUri: async (uri) => {
                if (uri.path === '/auth/callback') {
                    try {
                        await this.client.protocol.handleOAuthCallbackUri(uri.toString(true));
                    }
                    catch (error) {
                        await window.showErrorMessage(error.message);
                        return;
                    }
                    if (await this.client.protocol.isUserAccountConnected()) {
                        await window.showInformationMessage('Account connected.');
                    }
                }
                else {
                    throw new Error(`Unexpected URI: ${uri.toString()}`);
                }
            },
        }), commands.registerCommand('grammarly.check', async () => {
            var _a;
            const document = (_a = window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document;
            if (document == null)
                return console.log('No active document');
            const status = await this.client.protocol.getDocumentStatus(document.uri.toString());
            const excluded = workspace
                .getConfiguration('grammarly')
                .get('files.exclude', [])
                .map((pattern) => ({ pattern }));
            if (this.matchesDocumentSelector(document) && status != null) {
                await window.showInformationMessage(`Grammarly is already enabled for this file.`);
            }
            else if (languages.match(excluded, document) > 0) {
                await window.showInformationMessage(`This file is explicitly excluded using Grammarly > Files > Exclude setting.`);
            }
            else {
                const action = await window.showInformationMessage(`Grammarly is not enabled for this file. Enable now?`, {
                    modal: true,
                    detail: [
                        `- Scheme: ${document.uri.scheme}`,
                        `- Language: ${document.languageId}`,
                        `- Path: ${workspace.asRelativePath(document.uri)}`,
                    ].join('\n'),
                }, 'Current file', `All ${document.languageId} files`);
                if (action != null) {
                    const workspaceConfig = workspace.getConfiguration('grammarly');
                    const workspaceSelectors = workspaceConfig.get('selectors', []);
                    const selector = {
                        language: document.languageId,
                        scheme: document.uri.scheme,
                        pattern: action === 'Current file' ? workspace.asRelativePath(document.uri) : undefined,
                    };
                    const selectors = [...workspaceSelectors, selector];
                    await workspaceConfig.update('selectors', selectors, false);
                    await this.start();
                }
            }
        }), commands.registerCommand('grammarly.dismiss', async (options) => {
            await this.client.protocol.dismissSuggestion(options);
        }), commands.registerCommand('grammarly.login', async () => {
            const internalRedirectUri = Uri.parse(`${env.uriScheme}://znck.grammarly/auth/callback`, true);
            const externalRedirectUri = await env.asExternalUri(internalRedirectUri);
            const isExternalURLDifferent = internalRedirectUri.toString(true) === externalRedirectUri.toString(true);
            const redirectUri = isExternalURLDifferent
                ? internalRedirectUri.toString(true)
                : 'https://vscode-extension-grammarly.netlify.app/.netlify/functions/redirect';
            const url = new URL(await this.client.protocol.getOAuthUrl(redirectUri));
            url.searchParams.set('state', toBase64URL(externalRedirectUri.toString(true)));
            if (!(await env.openExternal(Uri.parse(url.toString(), true)))) {
                await window.showErrorMessage('Failed to open login page.');
            }
        }), commands.registerCommand('grammarly.logout', async () => {
            await this.client.protocol.logout();
            await window.showInformationMessage('Logged out.');
        }), { dispose: () => { var _a; return (_a = this.session) === null || _a === void 0 ? void 0 : _a.dispose(); } });
    }
    async start() {
        var _a;
        const statusbar = window.createStatusBarItem(StatusBarAlignment.Left, Number.MIN_SAFE_INTEGER);
        statusbar.text = `$(sync~spin) ${this.session == null ? 'Starting' : 'Restarting'} Grammarly language server`;
        statusbar.show();
        try {
            (_a = this.session) === null || _a === void 0 ? void 0 : _a.dispose();
            this.client = this.createClient();
            this.session = this.client.start();
            await this.client.onReady();
            await commands.executeCommand('setContext', 'grammarly.isRunning', true);
            this.isReady = true;
            this.callbacks.forEach((fn) => {
                try {
                    fn();
                }
                catch (error) {
                    console.error(error);
                }
            });
        }
        catch (error) {
            await commands.executeCommand('setContext', 'grammarly.isRunning', false);
            await window.showErrorMessage(`The extension couldn't be started. See the output channel for details.`);
        }
        finally {
            statusbar.dispose();
        }
    }
}
function isNode() {
    var _a;
    return typeof process !== 'undefined' && ((_a = process.versions) === null || _a === void 0 ? void 0 : _a.node) != null;
}
function toBase64URL(text) {
    if (typeof Buffer !== 'undefined')
        return Buffer.from(text, 'utf-8').toString('base64url');
    return btoa(text).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

var _StatusBarController_current, _StatusBarController_statusbar;
class StatusBarController {
    constructor(grammarly) {
        this.grammarly = grammarly;
        _StatusBarController_current.set(this, null);
        _StatusBarController_statusbar.set(this, window.createStatusBarItem(StatusBarAlignment.Right, Number.MIN_SAFE_INTEGER));
        grammarly.onReady(() => {
            grammarly.client.protocol.onDocumentStatus(({ uri, status }) => {
                var _a;
                if (uri === ((_a = __classPrivateFieldGet(this, _StatusBarController_current, "f")) === null || _a === void 0 ? void 0 : _a.uri)) {
                    __classPrivateFieldGet(this, _StatusBarController_current, "f").status = status;
                    this.update();
                }
            });
            grammarly.client.protocol.onUserAccountConnectedChange(() => this.update());
        });
    }
    register() {
        this.update();
        let isRestarting = false;
        return Disposable.from(__classPrivateFieldGet(this, _StatusBarController_statusbar, "f"), workspace.onDidCloseTextDocument(() => this.update()), window.onDidChangeActiveTextEditor(() => this.update()), commands.registerCommand('grammarly.restartServer', async () => {
            if (isRestarting)
                return;
            try {
                isRestarting = true;
                await this.grammarly.start();
            }
            finally {
                isRestarting = false;
            }
        }), commands.registerCommand('grammarly.pauseCheck', async (uri) => {
            var _a;
            const id = uri !== null && uri !== void 0 ? uri : (_a = window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.uri;
            if (id == null)
                return;
            await this.grammarly.client.protocol.pause(id.toString());
            await this.update();
        }), commands.registerCommand('grammarly.resumeCheck', async (uri) => {
            var _a;
            const id = uri !== null && uri !== void 0 ? uri : (_a = window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.uri;
            if (id == null)
                return;
            await this.grammarly.client.protocol.resume(id.toString());
            await this.update();
        }));
    }
    async getStatus(document) {
        const uri = document.uri.toString();
        return await this.grammarly.client.protocol.getDocumentStatus(uri);
    }
    async update() {
        var _a;
        await Promise.resolve();
        const document = (_a = window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document;
        const isUser = await this.grammarly.client.protocol.isUserAccountConnected();
        await commands.executeCommand('setContext', 'grammarly.isUserAccountConnected', isUser);
        if (document == null)
            return this.hide();
        const status = await this.getStatus(document);
        __classPrivateFieldSet(this, _StatusBarController_current, { uri: document.uri.toString(), status }, "f");
        if (status == null && !this.grammarly.matchesDocumentSelector(document))
            return this.hide();
        const accountIcon = isUser ? '$(account)' : '';
        const statusIcon = status == null
            ? '$(sync)'
            : status === 'connecting'
                ? '$(sync~spin)'
                : status === 'error'
                    ? accountIcon + '$(warning)'
                    : status === 'idle'
                        ? accountIcon + '$(pass-filled)'
                        : status === 'paused'
                            ? '$(debug-start)'
                            : '$(loading~spin)';
        __classPrivateFieldGet(this, _StatusBarController_statusbar, "f").text = statusIcon;
        __classPrivateFieldGet(this, _StatusBarController_statusbar, "f").color = status === 'error' ? 'red' : '';
        __classPrivateFieldGet(this, _StatusBarController_statusbar, "f").accessibilityInformation = {
            label: status !== null && status !== void 0 ? status : '',
            role: 'button',
        };
        __classPrivateFieldGet(this, _StatusBarController_statusbar, "f").tooltip = [
            `Your Grammarly account is ${isUser ? '' : 'not '}used for this file.`,
            `Connection status: ${status}`,
            status === 'error' ? `Restart now?` : null,
            status === 'paused' ? `Resume text checking?` : null,
        ]
            .filter(Boolean)
            .join('\n');
        __classPrivateFieldGet(this, _StatusBarController_statusbar, "f").command =
            status === 'error'
                ? { title: 'Restart', command: 'grammarly.restartServer' }
                : status === 'paused'
                    ? { title: 'Resume', command: 'grammarly.resumeCheck', arguments: [document.uri] }
                    : { title: 'Pause', command: 'grammarly.pauseCheck', arguments: [document.uri] };
        __classPrivateFieldGet(this, _StatusBarController_statusbar, "f").show();
        await commands.executeCommand('setContext', 'grammarly.isActive', true);
        await commands.executeCommand('setContext', 'grammarly.isPaused', status === 'paused');
    }
    async hide() {
        __classPrivateFieldGet(this, _StatusBarController_statusbar, "f").hide();
        await commands.executeCommand('setContext', 'grammarly.isActive', false);
    }
}
_StatusBarController_current = new WeakMap(), _StatusBarController_statusbar = new WeakMap();

async function activate(context) {
    const grammarly = new GrammarlyClient(context);
    await grammarly.start();
    return Disposable.from(grammarly.register(), new StatusBarController(grammarly).register());
}

export { activate };
//# sourceMappingURL=index.mjs.map
