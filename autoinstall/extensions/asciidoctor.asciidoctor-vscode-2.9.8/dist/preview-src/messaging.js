"use strict";
/*---------------------------------------------------------------------------------------------
  *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPosterForVsCode = void 0;
const settings_1 = require("./settings");
const createPosterForVsCode = (vscode) => {
    return new class {
        postMessage(type, body) {
            vscode.postMessage({
                type,
                source: (0, settings_1.getSettings)().source,
                body,
            });
        }
    }();
};
exports.createPosterForVsCode = createPosterForVsCode;
//# sourceMappingURL=messaging.js.map