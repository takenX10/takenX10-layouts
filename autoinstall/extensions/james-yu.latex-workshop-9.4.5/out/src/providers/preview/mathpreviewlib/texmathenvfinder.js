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
exports.TeXMathEnvFinder = void 0;
const vscode = __importStar(require("vscode"));
const utils = __importStar(require("../../../utils/utils"));
const textdocumentlike_1 = require("./textdocumentlike");
class TeXMathEnvFinder {
    static findHoverOnTex(document, position) {
        const envBeginPat = /\\begin\{(align|align\*|alignat|alignat\*|aligned|alignedat|array|Bmatrix|bmatrix|cases|CD|eqnarray|eqnarray\*|equation|equation\*|flalign|flalign\*|gather|gather\*|gathered|matrix|multline|multline\*|pmatrix|smallmatrix|split|subarray|Vmatrix|vmatrix)\}/;
        let r = document.getWordRangeAtPosition(position, envBeginPat);
        if (r) {
            const envname = TeXMathEnvFinder.getFirstRememberedSubstring(document.getText(r), envBeginPat);
            return TeXMathEnvFinder.findHoverOnEnv(document, envname, r.start);
        }
        const parenBeginPat = /(\\\[|\\\(|\$\$)/;
        r = document.getWordRangeAtPosition(position, parenBeginPat);
        if (r) {
            const paren = TeXMathEnvFinder.getFirstRememberedSubstring(document.getText(r), parenBeginPat);
            return TeXMathEnvFinder.findHoverOnParen(document, paren, r.start);
        }
        return TeXMathEnvFinder.findHoverOnInline(document, position);
    }
    static findHoverOnRef(document, position, refData, token) {
        const limit = vscode.workspace.getConfiguration('latex-workshop').get('hover.preview.maxLines');
        const docOfRef = textdocumentlike_1.TextDocumentLike.load(refData.file);
        const envBeginPatMathMode = /\\begin\{(align|align\*|alignat|alignat\*|eqnarray|eqnarray\*|equation|equation\*|flalign|flalign\*|gather|gather\*)\}/;
        const l = docOfRef.lineAt(refData.position.line).text;
        const pat = new RegExp('\\\\label\\{' + utils.escapeRegExp(token) + '\\}');
        const m = l.match(pat);
        if (m && m.index !== undefined) {
            const labelPos = new vscode.Position(refData.position.line, m.index);
            const beginPos = TeXMathEnvFinder.findBeginPair(docOfRef, envBeginPatMathMode, labelPos, limit);
            if (beginPos) {
                const t = TeXMathEnvFinder.findHoverOnTex(docOfRef, beginPos);
                if (t) {
                    const beginEndRange = t.range;
                    const refRange = document.getWordRangeAtPosition(position, /\S+?\{.*?\}/);
                    if (refRange && beginEndRange.contains(labelPos)) {
                        t.range = refRange;
                        return t;
                    }
                }
            }
        }
        return undefined;
    }
    static findMathEnvIncludingPosition(document, position) {
        const limit = vscode.workspace.getConfiguration('latex-workshop').get('hover.preview.maxLines');
        const envNamePatMathMode = /(align|align\*|alignat|alignat\*|eqnarray|eqnarray\*|equation|equation\*|flalign|flalign\*|gather|gather\*)/;
        const envBeginPatMathMode = /\\\[|\\\(|\\begin\{(align|align\*|alignat|alignat\*|eqnarray|eqnarray\*|equation|equation\*|flalign|flalign\*|gather|gather\*)\}/;
        let texMath = TeXMathEnvFinder.findHoverOnTex(document, position);
        if (texMath && (texMath.envname === '$' || texMath.envname.match(envNamePatMathMode))) {
            return texMath;
        }
        const beginPos = TeXMathEnvFinder.findBeginPair(document, envBeginPatMathMode, position, limit);
        if (beginPos) {
            texMath = TeXMathEnvFinder.findHoverOnTex(document, beginPos);
            if (texMath) {
                const beginEndRange = texMath.range;
                if (beginEndRange.contains(position)) {
                    return texMath;
                }
            }
        }
        return;
    }
    static getFirstRememberedSubstring(s, pat) {
        const m = s.match(pat);
        if (m && m[1]) {
            return m[1];
        }
        return 'never return here';
    }
    //  \begin{...}                \end{...}
    //             ^
    //             startPos1
    static findEndPair(document, endPat, startPos1) {
        const currentLine = document.lineAt(startPos1).text.substring(startPos1.character);
        const l = utils.stripCommentsAndVerbatim(currentLine);
        let m = l.match(endPat);
        if (m && m.index !== undefined) {
            return new vscode.Position(startPos1.line, startPos1.character + m.index + m[0].length);
        }
        let lineNum = startPos1.line + 1;
        while (lineNum <= document.lineCount) {
            m = utils.stripCommentsAndVerbatim(document.lineAt(lineNum).text).match(endPat);
            if (m && m.index !== undefined) {
                return new vscode.Position(lineNum, m.index + m[0].length);
            }
            lineNum += 1;
        }
        return undefined;
    }
    //  \begin{...}                \end{...}
    //  ^                          ^
    //  return pos                 endPos1
    static findBeginPair(document, beginPat, endPos1, limit) {
        const currentLine = document.lineAt(endPos1).text.substring(0, endPos1.character);
        let l = utils.stripCommentsAndVerbatim(currentLine);
        let m = l.match(beginPat);
        if (m && m.index !== undefined) {
            return new vscode.Position(endPos1.line, m.index);
        }
        let lineNum = endPos1.line - 1;
        let i = 0;
        while (lineNum >= 0 && i < limit) {
            l = document.lineAt(lineNum).text;
            l = utils.stripCommentsAndVerbatim(l);
            m = l.match(beginPat);
            if (m && m.index !== undefined) {
                return new vscode.Position(lineNum, m.index);
            }
            lineNum -= 1;
            i += 1;
        }
        return undefined;
    }
    //  \begin{...}                \end{...}
    //  ^
    //  startPos
    static findHoverOnEnv(document, envname, startPos) {
        const pattern = new RegExp('\\\\end\\{' + utils.escapeRegExp(envname) + '\\}');
        const startPos1 = new vscode.Position(startPos.line, startPos.character + envname.length + '\\begin{}'.length);
        const endPos = TeXMathEnvFinder.findEndPair(document, pattern, startPos1);
        if (endPos) {
            const range = new vscode.Range(startPos, endPos);
            return { texString: document.getText(range), range, envname };
        }
        return undefined;
    }
    //  \[                \]
    //  ^
    //  startPos
    static findHoverOnParen(document, envname, startPos) {
        const pattern = envname === '\\[' ? /\\\]/ : envname === '\\(' ? /\\\)/ : /\$\$/;
        const startPos1 = new vscode.Position(startPos.line, startPos.character + envname.length);
        const endPos = TeXMathEnvFinder.findEndPair(document, pattern, startPos1);
        if (endPos) {
            const range = new vscode.Range(startPos, endPos);
            return { texString: document.getText(range), range, envname };
        }
        return undefined;
    }
    static findHoverOnInline(document, position) {
        const currentLine = document.lineAt(position.line).text;
        const regex = /(?<!\$|\\)\$(?!\$)(?:\\.|[^\\])+?\$|\\\(.+?\\\)/;
        let s = currentLine;
        let base = 0;
        let m = s.match(regex);
        while (m) {
            if (m.index !== undefined) {
                const matchStart = base + m.index;
                const matchEnd = base + m.index + m[0].length;
                if (matchStart <= position.character && position.character <= matchEnd) {
                    const range = new vscode.Range(position.line, matchStart, position.line, matchEnd);
                    return { texString: document.getText(range), range, envname: '$' };
                }
                else {
                    base = matchEnd;
                    s = currentLine.substring(base);
                }
            }
            else {
                break;
            }
            m = s.match(regex);
        }
        return undefined;
    }
}
exports.TeXMathEnvFinder = TeXMathEnvFinder;
//# sourceMappingURL=texmathenvfinder.js.map