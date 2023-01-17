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
exports.SelectionRangeProvider = void 0;
const latex_utensils_1 = require("latex-utensils");
const vscode = __importStar(require("vscode"));
const syntax_1 = require("../components/parser/syntax");
class LuRange {
    constructor(arg) {
        this.start = LuPos.from(arg.start);
        this.end = LuPos.from(arg.end);
    }
    contains(pos) {
        return this.start.isBeforeOrEqual(pos) && this.end.isAfterOrEqual(pos);
    }
}
class LuPos {
    static from(loc) {
        return new LuPos(loc.line, loc.column);
    }
    constructor(line, column) {
        this.line = line;
        this.column = column;
    }
    isAfter(other) {
        return this.line > other.line || (this.line === other.line && this.column > other.column);
    }
    isAfterOrEqual(other) {
        return this.line > other.line || (this.line === other.line && this.column >= other.column);
    }
    isBefore(other) {
        return this.line < other.line || (this.line === other.line && this.column < other.column);
    }
    isBeforeOrEqual(other) {
        return this.line < other.line || (this.line === other.line && this.column <= other.column);
    }
}
function toVscodeRange(loc) {
    return new vscode.Range(loc.start.line - 1, loc.start.column - 1, loc.end.line - 1, loc.end.column - 1);
}
function toLatexUtensilPosition(pos) {
    return new LuPos(pos.line + 1, pos.character + 1);
}
class SelectionRangeProvider {
    async provideSelectionRanges(document, positions) {
        const content = document.getText();
        const latexAst = await syntax_1.UtensilsParser.parseLatex(content, { enableMathCharacterLocation: true });
        if (!latexAst) {
            return [];
        }
        const ret = [];
        positions.forEach(pos => {
            const lupos = toLatexUtensilPosition(pos);
            const result = latex_utensils_1.latexParser.findNodeAt(latexAst.content, lupos);
            const selectionRange = this.resultToSelectionRange(lupos, result);
            if (selectionRange) {
                ret.push(selectionRange);
            }
        });
        return ret;
    }
    getInnerContentLuRange(node) {
        if (latex_utensils_1.latexParser.isEnvironment(node) || latex_utensils_1.latexParser.isMathEnv(node) || latex_utensils_1.latexParser.isMathEnvAligned(node)) {
            return new LuRange({
                start: {
                    line: node.location.start.line,
                    column: node.location.start.column + '\\begin{}'.length + node.name.length
                },
                end: {
                    line: node.location.end.line,
                    column: node.location.end.column - '\\end{}'.length - node.name.length
                }
            });
        }
        else if (latex_utensils_1.latexParser.isGroup(node) || latex_utensils_1.latexParser.isInlienMath(node)) {
            return new LuRange({
                start: {
                    line: node.location.start.line,
                    column: node.location.start.column + 1
                },
                end: {
                    line: node.location.end.line,
                    column: node.location.end.column - 1
                }
            });
        }
        else if (latex_utensils_1.latexParser.isLabelCommand(node)) {
            return new LuRange({
                start: {
                    line: node.location.start.line,
                    column: node.location.start.column + '\\{'.length + node.name.length
                },
                end: {
                    line: node.location.end.line,
                    column: node.location.end.column - '}'.length
                }
            });
        }
        else if (latex_utensils_1.latexParser.isMathDelimiters(node)) {
            return new LuRange({
                start: {
                    line: node.location.start.line,
                    column: node.location.start.column + node.left.length + node.lcommand.length
                },
                end: {
                    line: node.location.end.line,
                    column: node.location.end.column - node.right.length - node.rcommand.length
                }
            });
        }
        return;
    }
    findInnerContentIncludingPos(lupos, content, sepNodes, innerContentRange) {
        const startSep = Array.from(sepNodes).reverse().find((node) => node.location && lupos.isAfterOrEqual(node.location.end));
        const endSep = sepNodes.find((node) => node.location && lupos.isBeforeOrEqual(node.location.start));
        const startSepPos = startSep?.location ? LuPos.from(startSep.location.end) : innerContentRange?.start;
        const endSepPos = endSep?.location ? LuPos.from(endSep.location.start) : innerContentRange?.end;
        if (!startSepPos || !endSepPos) {
            return;
        }
        const innerContent = content.filter((node) => {
            return node.location && startSepPos.isBeforeOrEqual(node.location.start) && endSepPos.isAfterOrEqual(node.location.end);
        });
        return {
            content: innerContent,
            contentLuRange: new LuRange({
                start: startSepPos,
                end: endSepPos
            }),
            startSep,
            endSep
        };
    }
    resultToSelectionRange(lupos, findNodeAtResult) {
        if (!findNodeAtResult) {
            return;
        }
        const curNode = findNodeAtResult.node;
        const parentNode = findNodeAtResult.parent;
        const parentSelectionRange = parentNode ? this.resultToSelectionRange(lupos, parentNode) : undefined;
        if (!curNode.location) {
            return parentSelectionRange;
        }
        const curRange = toVscodeRange(curNode.location);
        let curSelectionRange = new vscode.SelectionRange(curRange, parentSelectionRange);
        let innerContentLuRange = this.getInnerContentLuRange(curNode);
        if (innerContentLuRange) {
            if (!innerContentLuRange.contains(lupos)) {
                return curSelectionRange;
            }
            const newCurRange = toVscodeRange(innerContentLuRange);
            curSelectionRange = new vscode.SelectionRange(newCurRange, curSelectionRange);
        }
        if (latex_utensils_1.latexParser.hasContentArray(curNode)) {
            let innerContent = curNode.content;
            let newInnerContent;
            if (latex_utensils_1.latexParser.isEnvironment(curNode) && (curNode.name === 'itemize' || curNode.name === 'enumerate')) {
                let itemNodes = curNode.content.filter(latex_utensils_1.latexParser.isCommand);
                itemNodes = itemNodes.filter((node) => node.name === 'item');
                newInnerContent = this.findInnerContentIncludingPos(lupos, innerContent, itemNodes, innerContentLuRange);
                if (newInnerContent) {
                    innerContent = newInnerContent.content;
                    innerContentLuRange = newInnerContent.contentLuRange;
                    let newContentRange = toVscodeRange(innerContentLuRange);
                    if (newInnerContent.startSep?.location) {
                        const start = LuPos.from(newInnerContent.startSep.location.start);
                        newContentRange = toVscodeRange({ start, end: innerContentLuRange.end });
                    }
                    curSelectionRange = new vscode.SelectionRange(newContentRange, curSelectionRange);
                }
            }
            const linebreaksNodes = innerContent.filter(latex_utensils_1.latexParser.isLinebreak);
            newInnerContent = this.findInnerContentIncludingPos(lupos, innerContent, linebreaksNodes, innerContentLuRange);
            if (newInnerContent) {
                innerContent = newInnerContent.content;
                innerContentLuRange = newInnerContent.contentLuRange;
                let newContentRange = toVscodeRange(innerContentLuRange);
                if (newInnerContent.endSep?.location) {
                    const end = LuPos.from(newInnerContent.endSep.location.end);
                    newContentRange = toVscodeRange({ start: innerContentLuRange.start, end });
                }
                curSelectionRange = new vscode.SelectionRange(newContentRange, curSelectionRange);
            }
            const alignmentTabNodes = innerContent.filter(latex_utensils_1.latexParser.isAlignmentTab);
            newInnerContent = this.findInnerContentIncludingPos(lupos, innerContent, alignmentTabNodes, innerContentLuRange);
            if (newInnerContent) {
                // curContent = newContent.innerContent
                innerContentLuRange = newInnerContent.contentLuRange;
                const newContentRange = toVscodeRange(innerContentLuRange);
                curSelectionRange = new vscode.SelectionRange(newContentRange, curSelectionRange);
            }
        }
        return curSelectionRange;
    }
}
exports.SelectionRangeProvider = SelectionRangeProvider;
//# sourceMappingURL=selection.js.map