"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacherUtils = void 0;
const vscode_1 = __importDefault(require("vscode"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const micromatch_1 = __importDefault(require("micromatch"));
const manager_1 = require("../manager");
class CacherUtils {
    static canCache(filePath) {
        return [...manager_1.TEX_EXT, ...manager_1.RSWEAVE_EXT, ...manager_1.JLWEAVE_EXT, ...manager_1.PWEAVE_EXT].includes(path_1.default.extname(filePath))
            && !filePath.includes('expl3-code.tex');
    }
    static isExcluded(filePath) {
        const globsToIgnore = vscode_1.default.workspace.getConfiguration('latex-workshop').get('latex.watch.files.ignore');
        const format = (str) => {
            if (os_1.default.platform() === 'win32') {
                return str.replace(/\\/g, '/');
            }
            return str;
        };
        return micromatch_1.default.some(filePath, globsToIgnore, { format });
    }
    static parseFlsContent(content, rootDir) {
        const inputFiles = new Set();
        const outputFiles = new Set();
        const regex = /^(?:(INPUT)\s*(.*))|(?:(OUTPUT)\s*(.*))$/gm;
        // regex groups
        // #1: an INPUT entry --> #2 input file path
        // #3: an OUTPUT entry --> #4: output file path
        while (true) {
            const result = regex.exec(content);
            if (!result) {
                break;
            }
            if (result[1]) {
                const inputFilePath = path_1.default.resolve(rootDir, result[2]);
                if (inputFilePath) {
                    inputFiles.add(inputFilePath);
                }
            }
            else if (result[3]) {
                const outputFilePath = path_1.default.resolve(rootDir, result[4]);
                if (outputFilePath) {
                    outputFiles.add(outputFilePath);
                }
            }
        }
        return { input: Array.from(inputFiles), output: Array.from(outputFiles) };
    }
}
exports.CacherUtils = CacherUtils;
//# sourceMappingURL=cacherutils.js.map