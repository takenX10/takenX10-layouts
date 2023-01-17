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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtensilsParser = void 0;
const path = __importStar(require("path"));
const workerpool = __importStar(require("workerpool"));
class UtensilsParser {
    static dispose() {
        return {
            dispose: async () => { await UtensilsParser.pool.terminate(true); }
        };
    }
    /**
     * Parse a LaTeX file.
     *
     * @param s The content of a LaTeX file to be parsed.
     * @param options
     * @return undefined if parsing fails
     */
    static async parseLatex(s, options) {
        return (await UtensilsParser.proxy).parseLatex(s, options).timeout(3000).catch(() => undefined);
    }
    static async parseLatexPreamble(s) {
        return (await UtensilsParser.proxy).parseLatexPreamble(s).timeout(500);
    }
    static async parseBibtex(s, options) {
        return (await UtensilsParser.proxy).parseBibtex(s, options).timeout(30000).catch(() => { return { content: [] }; });
    }
}
exports.UtensilsParser = UtensilsParser;
_a = UtensilsParser;
UtensilsParser.pool = workerpool.pool(path.join(__dirname, 'syntax_worker.js'), { minWorkers: 1, maxWorkers: 1, workerType: 'process' });
UtensilsParser.proxy = _a.pool.proxy();
//# sourceMappingURL=syntax.js.map