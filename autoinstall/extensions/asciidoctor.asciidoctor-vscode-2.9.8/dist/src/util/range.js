"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.range = void 0;
const range = function (min, max) {
    // If only one number is provided, start at one
    if (max === undefined) {
        max = min;
        min = 1;
    }
    // Create a ranged array
    return Array.from(new Array(max - min + 1).keys()).map(function (num) {
        return num + min;
    });
};
exports.range = range;
//# sourceMappingURL=range.js.map