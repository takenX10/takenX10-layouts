"use strict";
//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const vscode_1 = require("vscode");
const fs_extra_1 = require("fs-extra");
const extension = require("../src/extension");
extension.activate();
let extensionID = 'bradgashler.htmltagwrap';
let samplesFolder = vscode_1.extensions.getExtension(extensionID).extensionPath + '/test/sampleFiles/';
let tempFolder = samplesFolder + 'temp/';
function parametrizedSingleSelectionTest(startFilePath, expectedResultFilePath, selectionStart, selectionEnd, failMessage) {
    const selection = [selectionStart, selectionEnd];
    const selections = [selection];
    return parametrizedMultiSelectionTest(startFilePath, expectedResultFilePath, selections, failMessage);
}
function parametrizedMultiSelectionTest(startFilePath, expectedResultFilePath, selections, failMessage, options) {
    let result;
    let expectedResult;
    let editor;
    let workingFilePath = tempFolder + startFilePath;
    let tagWasUpdatedByTest;
    const tagConfig = vscode_1.workspace.getConfiguration('htmltagwrap');
    fs_extra_1.copySync(samplesFolder + startFilePath, workingFilePath, { clobber: true });
    let testPromise = vscode_1.workspace.openTextDocument(workingFilePath).then((workingDocument) => {
        return vscode_1.window.showTextDocument(workingDocument);
    }).then((_editor) => {
        return new Promise(resolve => {
            editor = _editor;
            if (options) {
                tagConfig.update('tag', 'helloworld', true).then(success => {
                    tagWasUpdatedByTest = true;
                    resolve('✔ Updated tag to "helloworld"');
                }, rejected => {
                    rejected('failed to update tag to "helloworld"');
                });
            }
            else {
                resolve('No need to update tag');
            }
        }).then(success => {
            editor.selections = selections.map(s => new vscode_1.Selection(s[0], s[1]));
            return vscode_1.commands.executeCommand('extension.htmlTagWrap').then(() => new Promise((f) => setTimeout(f, 500)));
        }, failure => {
            console.error(failure);
        }).then(() => {
            return new Promise(resolve => {
                if (tagWasUpdatedByTest) {
                    tagConfig.update('tag', undefined, true).then(success => {
                        resolve('✔ Removed temporary tag setting for "helloworld" tag');
                        tagWasUpdatedByTest = false;
                    }, rejected => {
                        rejected('failed to remove temporary tag setting for "helloworld"');
                    });
                }
                else {
                    resolve();
                }
            }).then(() => {
                result = editor.document.getText();
            }, failure => {
                console.error(failure);
            });
        }).then(() => {
            return vscode_1.workspace.openTextDocument(samplesFolder + expectedResultFilePath);
        }).then((expectedResultDocument) => {
            expectedResult = expectedResultDocument.getText();
        }).then(() => {
            return vscode_1.commands.executeCommand('workbench.action.closeActiveEditor').then(() => new Promise((f) => setTimeout(f, 500)));
        });
    });
    return testPromise.then(() => {
        chai_1.expect(result).not.to.be.equal(undefined, 'File loding error');
        chai_1.expect(expectedResult).not.to.be.equal(undefined, 'File loding error');
        chai_1.expect(result).to.be.equal(expectedResult, failMessage);
    });
}
suite('Extension Tests', function () {
    // Single selection tests
    test('HTML with tabs block wrap test', function () {
        return parametrizedSingleSelectionTest('tabFile.html', 'expectedTabBlockWrapFileResult.html', new vscode_1.Position(1, 1), new vscode_1.Position(6, 6), 'Tab using block wrap does not work');
    });
    test('HTML with spaces block wrap test', function () {
        return parametrizedSingleSelectionTest('spaceFile.html', 'expectedSpaceBlockWrapFileResult.html', new vscode_1.Position(1, 4), new vscode_1.Position(7, 9), 'Space using block wrap does not work');
    });
    test('HTML with tabs line wrap test', function () {
        return parametrizedSingleSelectionTest('tabFile.html', 'expectedTabLineWrapFileResult.html', new vscode_1.Position(2, 2), new vscode_1.Position(2, 11), 'Tab using line wrap does not work');
    });
    test('HTML with spaces line wrap test', function () {
        return parametrizedSingleSelectionTest('spaceFile.html', 'expectedSpaceLineWrapFileResult.html', new vscode_1.Position(2, 8), new vscode_1.Position(2, 17), 'Space using line wrap does not work');
    });
    test('Empty selection line wrap test', function () {
        return parametrizedSingleSelectionTest('emptyFile.html', 'expectedEmptyFileSingleCursorResult.html', new vscode_1.Position(0, 0), new vscode_1.Position(0, 0), 'Empty selection tag wrap does not work');
    });
    // Multiple selecetion tests
    test('Multiple Empty selections line wrap test', function () {
        const selections = [
            [new vscode_1.Position(1, 0), new vscode_1.Position(1, 0)],
            [new vscode_1.Position(2, 0), new vscode_1.Position(2, 0)],
            [new vscode_1.Position(3, 0), new vscode_1.Position(3, 0)]
        ];
        return parametrizedMultiSelectionTest('emptySelectionMultipleCursors.html', 'expectedEmptySelectionMultipleCursorsResult.html', selections, 'Empty selection tag wrap does not work with multiple selections');
    });
    test('Multiple selections block wrap test', function () {
        const selections = [
            [new vscode_1.Position(1, 4), new vscode_1.Position(2, 17)],
            [new vscode_1.Position(5, 0), new vscode_1.Position(6, 13)],
            [new vscode_1.Position(10, 8), new vscode_1.Position(11, 15)]
        ];
        return parametrizedMultiSelectionTest('textBlocks.html', 'expectedMultiSelectionTextBlocksFileResult.html', selections, 'Multiple selections text block wrap does not work');
    });
    test('Multiple selections block wrap test', function () {
        const selections = [
            [new vscode_1.Position(1, 4), new vscode_1.Position(2, 17)],
            [new vscode_1.Position(5, 0), new vscode_1.Position(6, 13)],
            [new vscode_1.Position(10, 8), new vscode_1.Position(11, 15)]
        ];
        return parametrizedMultiSelectionTest('textBlocks.html', 'expectedMultiSelectionTextBlocksFileResult.html', selections, 'Multiple selections text block wrap does not work');
    });
    test('Multiple selections mix block / text wrap test', function () {
        const selections = [
            [new vscode_1.Position(1, 4), new vscode_1.Position(1, 21)],
            [new vscode_1.Position(2, 4), new vscode_1.Position(2, 17)],
            [new vscode_1.Position(5, 0), new vscode_1.Position(6, 13)],
            [new vscode_1.Position(10, 8), new vscode_1.Position(10, 19)],
            [new vscode_1.Position(11, 11), new vscode_1.Position(11, 15)]
        ];
        return parametrizedMultiSelectionTest('textBlocks.html', 'expectedMultiSelectionMixedLineBlockFileResult.html', selections, 'Multiple selections mixed (text and block) does not work');
    });
    test('Custom tag test', function () {
        const selections = [
            [new vscode_1.Position(1, 4), new vscode_1.Position(1, 21)],
            [new vscode_1.Position(2, 4), new vscode_1.Position(2, 17)],
            [new vscode_1.Position(5, 0), new vscode_1.Position(6, 13)],
            [new vscode_1.Position(10, 8), new vscode_1.Position(10, 19)],
            [new vscode_1.Position(11, 11), new vscode_1.Position(11, 15)]
        ];
        const options = {
            customTag: true
        };
        return parametrizedMultiSelectionTest('textBlocks.html', 'expectedCustomTagFileResult.html', selections, 'Custom tag value "helloworld" does not work', options);
    });
    test('Multiple same line selections (regression test)', function () {
        const selections = [
            [new vscode_1.Position(10, 8), new vscode_1.Position(10, 12)],
            [new vscode_1.Position(10, 13), new vscode_1.Position(10, 15)],
            [new vscode_1.Position(10, 16), new vscode_1.Position(10, 19)],
            [new vscode_1.Position(10, 20), new vscode_1.Position(10, 25)],
            [new vscode_1.Position(10, 26), new vscode_1.Position(10, 31)],
        ];
        const options = {
            customTag: true
        };
        return parametrizedMultiSelectionTest('textBlocks.html', 'expectedMultipleSameLineSelectionsFileResult.html', selections, 'Multiple same line selections error. (regression)', options);
    });
    teardown((done) => fs_extra_1.emptyDir(tempFolder, done));
});
//# sourceMappingURL=extension.test.js.map