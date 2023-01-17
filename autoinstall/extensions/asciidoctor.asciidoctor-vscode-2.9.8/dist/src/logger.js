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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const vscode = __importStar(require("vscode"));
const lazy_1 = require("./util/lazy");
var TraceType;
(function (TraceType) {
    TraceType[TraceType["Off"] = 0] = "Off";
    TraceType[TraceType["Verbose"] = 1] = "Verbose";
})(TraceType || (TraceType = {}));
var Trace;
(function (Trace) {
    function fromString(value) {
        value = value.toLowerCase();
        switch (value) {
            case 'off':
                return TraceType.Off;
            case 'verbose':
                return TraceType.Verbose;
            default:
                return TraceType.Off;
        }
    }
    Trace.fromString = fromString;
})(Trace || (Trace = {}));
function isString(value) {
    return Object.prototype.toString.call(value) === '[object String]';
}
class Logger {
    constructor() {
        this.outputChannel = (0, lazy_1.lazy)(() => vscode.window.createOutputChannel('Asciidoc'));
        this.updateConfiguration();
    }
    log(message, data) {
        if (this.trace === TraceType.Verbose) {
            this.appendLine(`[Log - ${new Date().toLocaleTimeString()}] ${message}`);
            if (data) {
                this.appendLine(Logger.data2String(data));
            }
        }
    }
    updateConfiguration() {
        this.trace = this.readTrace();
    }
    appendLine(value) {
        return this.outputChannel.value.appendLine(value);
    }
    readTrace() {
        return Trace.fromString(vscode.workspace
            .getConfiguration(null, null)
            .get('asciidoc.trace', 'off'));
    }
    static data2String(data) {
        if (data instanceof Error) {
            if (isString(data.stack)) {
                return data.stack;
            }
            return data.message;
        }
        if (isString(data)) {
            return data;
        }
        return JSON.stringify(data, undefined, 2);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map