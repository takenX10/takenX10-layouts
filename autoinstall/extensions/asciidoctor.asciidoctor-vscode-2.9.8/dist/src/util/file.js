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
exports.sortFilesAndDirectories = exports.getChildrenOfPath = exports.getPathOfFolderToLookupFiles = exports.FileInfo = exports.isAsciidocFile = void 0;
const ospath = __importStar(require("path"));
const fs = __importStar(require("fs"));
function isAsciidocFile(document) {
    return document.languageId === 'asciidoc';
}
exports.isAsciidocFile = isAsciidocFile;
class FileInfo {
    constructor(path, file) {
        this.file = file;
        this.isFile = fs.statSync(ospath.join(path, file)).isFile();
    }
}
exports.FileInfo = FileInfo;
/**
 * @param fileName  {string} current filename the look up is done. Absolute path
 * @param text      {string} text in import string. e.g. './src/'
 */
function getPathOfFolderToLookupFiles(fileName, text, rootPath) {
    const normalizedText = ospath.normalize(text || '');
    const isPathAbsolute = normalizedText.startsWith(ospath.sep);
    let rootFolder = ospath.dirname(fileName);
    const pathEntered = normalizedText;
    if (isPathAbsolute) {
        rootFolder = rootPath || '';
    }
    return ospath.join(rootFolder, pathEntered);
}
exports.getPathOfFolderToLookupFiles = getPathOfFolderToLookupFiles;
function getChildrenOfPath(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const files = yield new Promise((resolve, reject) => {
                fs.readdir(path, (err, files) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(files);
                    }
                });
            });
            const filesDbg = files
                .map((f) => new FileInfo(path, f));
            return filesDbg;
        }
        catch (error) {
            return [];
        }
    });
}
exports.getChildrenOfPath = getChildrenOfPath;
const sortFilesAndDirectories = (filesAndDirs) => {
    const dirs = filesAndDirs.filter((f) => f.isFile !== true);
    const files = filesAndDirs.filter((f) => f.isFile === true);
    return [...dirs, ...files];
};
exports.sortFilesAndDirectories = sortFilesAndDirectories;
//# sourceMappingURL=file.js.map