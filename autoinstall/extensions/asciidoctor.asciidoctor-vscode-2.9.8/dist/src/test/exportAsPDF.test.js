"use strict";
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
const assert = __importStar(require("assert"));
require("mocha");
const vscode = __importStar(require("vscode"));
const exportAsPDF_1 = require("../commands/exportAsPDF");
const asciidoctor = require('@asciidoctor/core');
const processor = asciidoctor();
suite('asciidoc.exportAsPDF', () => __awaiter(void 0, void 0, void 0, function* () {
    test('Should create an HTML cover page without title page logo', () => __awaiter(void 0, void 0, void 0, function* () {
        const document = processor.load(`= The Intrepid Chronicles
Kismet R. Lee <kismet@asciidoctor.org>`);
        const coverHtmlContent = (0, exportAsPDF_1._generateCoverHtmlContent)(undefined, __dirname, document, vscode.Uri.parse(''));
        assert.strictEqual(coverHtmlContent, `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="file:///media/all-centered.css">
  </head>
  <body>
  <div class="outer">
    <div class="middle">
      <div class="inner">

        <h1>The Intrepid Chronicles</h1>
        p>Kismet R. Lee &lt;kismet@asciidoctor.org&gt;</p>
      </div>
    </div>
  </div>
  </body>
  </html>`);
    }));
}));
//# sourceMappingURL=exportAsPDF.test.js.map