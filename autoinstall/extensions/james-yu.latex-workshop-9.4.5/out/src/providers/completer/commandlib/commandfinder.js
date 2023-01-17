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
exports.CommandSignatureDuplicationDetector = exports.CommandFinder = exports.resolvePkgFile = exports.isTriggerSuggestNeeded = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const latex_utensils_1 = require("latex-utensils");
const lw = __importStar(require("../../../lw"));
const completerutils_1 = require("../completerutils");
function isTriggerSuggestNeeded(name) {
    const reg = /^(?:[a-z]*(cite|ref|input)[a-z]*|begin|bibitem|(sub)?(import|includefrom|inputfrom)|gls(?:pl|text|first|plural|firstplural|name|symbol|desc|user(?:i|ii|iii|iv|v|vi))?|Acr(?:long|full|short)?(?:pl)?|ac[slf]?p?)/i;
    return reg.test(name);
}
exports.isTriggerSuggestNeeded = isTriggerSuggestNeeded;
function resolvePkgFile(name, dataDir) {
    const dirs = vscode.workspace.getConfiguration('latex-workshop').get('intellisense.package.dirs');
    dirs.push(dataDir);
    for (const dir of dirs) {
        const f = `${dir}/${name}`;
        if (fs.existsSync(f)) {
            return f;
        }
    }
    // Many package with names like toppackage-config.sty are just wrappers around
    // the general package toppacke.sty and do not define commands on their own.
    const indexDash = name.lastIndexOf('-');
    if (indexDash > -1) {
        const generalPkg = name.substring(0, indexDash);
        const f = `${dataDir}/${generalPkg}.json`;
        if (fs.existsSync(f)) {
            return f;
        }
    }
    return undefined;
}
exports.resolvePkgFile = resolvePkgFile;
class CommandFinder {
    static getCmdFromNodeArray(file, nodes, commandSignatureDuplicationDetector) {
        let cmds = [];
        nodes.forEach((node, index) => {
            const prev = nodes[index - 1];
            const next = nodes[index + 1];
            cmds = cmds.concat(CommandFinder.getCmdFromNode(file, node, commandSignatureDuplicationDetector, latex_utensils_1.latexParser.isCommand(prev) ? prev : undefined, latex_utensils_1.latexParser.isCommand(next) ? next : undefined));
        });
        return cmds;
    }
    static getCmdFromNode(file, node, commandSignatureDuplicationDetector, prev, next) {
        const cmds = [];
        const newCommandDeclarations = ['newcommand', 'renewcommand', 'providecommand', 'DeclareMathOperator', 'DeclarePairedDelimiter', 'DeclarePairedDelimiterX', 'DeclarePairedDelimiterXPP'];
        if (latex_utensils_1.latexParser.isDefCommand(node)) {
            const name = node.token.slice(1);
            const args = CommandFinder.getArgsFromNode(node);
            const cmd = new completerutils_1.CmdEnvSuggestion(`\\${name}${args}`, '', [], -1, { name, args }, vscode.CompletionItemKind.Function);
            cmd.documentation = '`' + name + '`';
            cmd.insertText = new vscode.SnippetString(name + CommandFinder.getTabStopsFromNode(node));
            cmd.filterText = name;
            if (isTriggerSuggestNeeded(name)) {
                cmd.command = { title: 'Post-Action', command: 'editor.action.triggerSuggest' };
            }
            if (!commandSignatureDuplicationDetector.has(cmd)) {
                cmds.push(cmd);
                commandSignatureDuplicationDetector.add(cmd);
            }
        }
        else if (latex_utensils_1.latexParser.isCommand(node)) {
            if (latex_utensils_1.latexParser.isCommand(prev) && newCommandDeclarations.includes(prev.name) && prev.args.length === 0) {
                return cmds;
            }
            const args = CommandFinder.getArgsFromNode(node);
            const cmd = new completerutils_1.CmdEnvSuggestion(`\\${node.name}${args}`, CommandFinder.whichPackageProvidesCommand(node.name), [], -1, { name: node.name, args }, vscode.CompletionItemKind.Function);
            cmd.documentation = '`' + node.name + '`';
            cmd.insertText = new vscode.SnippetString(node.name + CommandFinder.getTabStopsFromNode(node));
            if (isTriggerSuggestNeeded(node.name)) {
                cmd.command = { title: 'Post-Action', command: 'editor.action.triggerSuggest' };
            }
            if (!commandSignatureDuplicationDetector.has(cmd) && !newCommandDeclarations.includes(node.name)) {
                cmds.push(cmd);
                commandSignatureDuplicationDetector.add(cmd);
            }
            if (newCommandDeclarations.includes(node.name.replace(/\*$/, '')) &&
                (node.args.length > 0 &&
                    latex_utensils_1.latexParser.isGroup(node.args[0]) && node.args[0].content.length > 0 &&
                    latex_utensils_1.latexParser.isCommand(node.args[0].content[0])) ||
                (next && next.args.length > 0)) {
                const isInsideNewCommand = node.args.length > 0;
                const label = (isInsideNewCommand ? node.args[0].content[0] : next).name;
                let tabStops = '';
                let newargs = '';
                const argsNode = isInsideNewCommand ? node.args : next?.args || [];
                const argNumNode = isInsideNewCommand ? argsNode[1] : argsNode[0];
                if (latex_utensils_1.latexParser.isOptionalArg(argNumNode)) {
                    const numArgs = parseInt(argNumNode.content[0].content);
                    let index = 1;
                    for (let i = (isInsideNewCommand ? 2 : 1); i <= argsNode.length - 1; ++i) {
                        if (!latex_utensils_1.latexParser.isOptionalArg(argsNode[i])) {
                            break;
                        }
                        tabStops += '[${' + index + '}]';
                        newargs += '[]';
                        index++;
                    }
                    for (; index <= numArgs; ++index) {
                        tabStops += '{${' + index + '}}';
                        newargs += '{}';
                    }
                }
                const newcmd = new completerutils_1.CmdEnvSuggestion(`\\${label}${newargs}`, 'user-defined', [], -1, { name: label, args: newargs }, vscode.CompletionItemKind.Function);
                newcmd.documentation = '`' + label + '`';
                newcmd.insertText = new vscode.SnippetString(label + tabStops);
                newcmd.filterText = label;
                if (isTriggerSuggestNeeded(label)) {
                    newcmd.command = { title: 'Post-Action', command: 'editor.action.triggerSuggest' };
                }
                if (!commandSignatureDuplicationDetector.has(newcmd)) {
                    cmds.push(newcmd);
                    CommandFinder.definedCmds.set(cmd.signatureAsString(), {
                        file,
                        location: new vscode.Location(vscode.Uri.file(file), new vscode.Position(node.location.start.line - 1, node.location.start.column))
                    });
                    commandSignatureDuplicationDetector.add(newcmd);
                }
            }
        }
        if (latex_utensils_1.latexParser.hasContentArray(node)) {
            return cmds.concat(CommandFinder.getCmdFromNodeArray(file, node.content, commandSignatureDuplicationDetector));
        }
        return cmds;
    }
    static getArgsHelperFromNode(node, helper) {
        let args = '';
        if (!('args' in node)) {
            return args;
        }
        let index = 0;
        if (latex_utensils_1.latexParser.isCommand(node)) {
            node.args.forEach(arg => {
                ++index;
                if (latex_utensils_1.latexParser.isOptionalArg(arg)) {
                    args += '[' + helper(index) + ']';
                }
                else {
                    args += '{' + helper(index) + '}';
                }
            });
            return args;
        }
        if (latex_utensils_1.latexParser.isDefCommand(node)) {
            node.args.forEach(arg => {
                ++index;
                if (latex_utensils_1.latexParser.isCommandParameter(arg)) {
                    args += '{' + helper(index) + '}';
                }
            });
            return args;
        }
        return args;
    }
    static getTabStopsFromNode(node) {
        return CommandFinder.getArgsHelperFromNode(node, (i) => { return '${' + i + '}'; });
    }
    static getArgsFromNode(node) {
        return CommandFinder.getArgsHelperFromNode(node, (_) => { return ''; });
    }
    static getCmdFromContent(file, content) {
        const cmdReg = /\\([a-zA-Z@_]+(?::[a-zA-Z]*)?\*?)({[^{}]*})?({[^{}]*})?({[^{}]*})?/g;
        const cmds = [];
        const commandSignatureDuplicationDetector = new CommandSignatureDuplicationDetector();
        let explSyntaxOn = false;
        while (true) {
            const result = cmdReg.exec(content);
            if (result === null) {
                break;
            }
            if (result[1] === 'ExplSyntaxOn') {
                explSyntaxOn = true;
                continue;
            }
            else if (result[1] === 'ExplSyntaxOff') {
                explSyntaxOn = false;
                continue;
            }
            if (!explSyntaxOn) {
                const len = result[1].search(/[_:]/);
                if (len > -1) {
                    result[1] = result[1].slice(0, len);
                }
            }
            const args = CommandFinder.getArgsFromRegResult(result);
            const cmd = new completerutils_1.CmdEnvSuggestion(`\\${result[1]}${args}`, CommandFinder.whichPackageProvidesCommand(result[1]), [], -1, { name: result[1], args }, vscode.CompletionItemKind.Function);
            cmd.documentation = '`' + result[1] + '`';
            cmd.insertText = new vscode.SnippetString(result[1] + CommandFinder.getTabStopsFromRegResult(result));
            cmd.filterText = result[1];
            if (isTriggerSuggestNeeded(result[1])) {
                cmd.command = { title: 'Post-Action', command: 'editor.action.triggerSuggest' };
            }
            if (!commandSignatureDuplicationDetector.has(cmd)) {
                cmds.push(cmd);
                commandSignatureDuplicationDetector.add(cmd);
            }
        }
        const newCommandReg = /\\(?:(?:(?:re|provide)?(?:new)?command)|(?:DeclarePairedDelimiter(?:X|XPP)?)|DeclareMathOperator)\*?{?\\(\w+)}?(?:\[([1-9])\])?/g;
        while (true) {
            const result = newCommandReg.exec(content);
            if (result === null) {
                break;
            }
            let tabStops = '';
            let args = '';
            if (result[2]) {
                const numArgs = parseInt(result[2]);
                for (let i = 1; i <= numArgs; ++i) {
                    tabStops += '{${' + i + '}}';
                    args += '{}';
                }
            }
            const cmd = new completerutils_1.CmdEnvSuggestion(`\\${result[1]}${args}`, 'user-defined', [], -1, { name: result[1], args }, vscode.CompletionItemKind.Function);
            cmd.documentation = '`' + result[1] + '`';
            cmd.insertText = new vscode.SnippetString(result[1] + tabStops);
            cmd.filterText = result[1];
            if (!commandSignatureDuplicationDetector.has(cmd)) {
                cmds.push(cmd);
                commandSignatureDuplicationDetector.add(cmd);
            }
            CommandFinder.definedCmds.set(result[1], {
                file,
                location: new vscode.Location(vscode.Uri.file(file), new vscode.Position(content.substring(0, result.index).split('\n').length - 1, 0))
            });
        }
        return cmds;
    }
    static getTabStopsFromRegResult(result) {
        let text = '';
        if (result[2]) {
            text += '{${1}}';
        }
        if (result[3]) {
            text += '{${2}}';
        }
        if (result[4]) {
            text += '{${3}}';
        }
        return text;
    }
    static getArgsFromRegResult(result) {
        return '{}'.repeat(result.length - 1);
    }
    /**
     * Return the name of the package providing cmdName among all the packages
     * included in the rootFile. If no package matches, return ''
     *
     * @param cmdName the name of a command (without the leading '\')
     */
    static whichPackageProvidesCommand(cmdName) {
        if (lw.manager.rootFile !== undefined) {
            for (const file of lw.cacher.getIncludedTeX()) {
                const packages = lw.cacher.get(file)?.elements.package;
                if (packages === undefined) {
                    continue;
                }
                for (const packageName of Object.keys(packages)) {
                    const commands = [];
                    lw.completer.command.provideCmdInPkg(packageName, packages[packageName], commands, new CommandSignatureDuplicationDetector());
                    for (const cmd of commands) {
                        const label = cmd.label.slice(1);
                        if (label.startsWith(cmdName) &&
                            ((label.length === cmdName.length) ||
                                (label.charAt(cmdName.length) === '[') ||
                                (label.charAt(cmdName.length) === '{'))) {
                            return packageName;
                        }
                    }
                }
            }
        }
        return '';
    }
}
exports.CommandFinder = CommandFinder;
CommandFinder.definedCmds = new Map();
class CommandSignatureDuplicationDetector {
    constructor(suggestions = []) {
        this.cmdSignatureList = new Set();
        this.cmdSignatureList = new Set(suggestions.map(s => s.signatureAsString()));
    }
    add(cmd) {
        this.cmdSignatureList.add(cmd.signatureAsString());
    }
    has(cmd) {
        return this.cmdSignatureList.has(cmd.signatureAsString());
    }
}
exports.CommandSignatureDuplicationDetector = CommandSignatureDuplicationDetector;
//# sourceMappingURL=commandfinder.js.map