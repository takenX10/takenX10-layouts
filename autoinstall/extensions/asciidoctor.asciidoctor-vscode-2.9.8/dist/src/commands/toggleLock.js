"use strict";
/*---------------------------------------------------------------------------------------------
  *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleLockCommand = void 0;
class ToggleLockCommand {
    constructor(previewManager) {
        this.previewManager = previewManager;
        this.id = 'asciidoc.preview.toggleLock';
        this.previewManager = previewManager;
    }
    execute() {
        this.previewManager.toggleLock();
    }
}
exports.ToggleLockCommand = ToggleLockCommand;
//# sourceMappingURL=toggleLock.js.map