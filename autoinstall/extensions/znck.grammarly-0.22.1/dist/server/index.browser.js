(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

  // node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/common/ral.js
  var require_ral = __commonJS({
    "node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/common/ral.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var _ral;
      function RAL() {
        if (_ral === void 0) {
          throw new Error(`No runtime abstraction layer installed`);
        }
        return _ral;
      }
      (function(RAL2) {
        function install(ral) {
          if (ral === void 0) {
            throw new Error(`No runtime abstraction layer provided`);
          }
          _ral = ral;
        }
        RAL2.install = install;
      })(RAL || (RAL = {}));
      exports.default = RAL;
    }
  });

  // node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/common/disposable.js
  var require_disposable = __commonJS({
    "node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/common/disposable.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Disposable = void 0;
      var Disposable;
      (function(Disposable2) {
        function create(func) {
          return {
            dispose: func
          };
        }
        Disposable2.create = create;
      })(Disposable = exports.Disposable || (exports.Disposable = {}));
    }
  });

  // node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/common/events.js
  var require_events = __commonJS({
    "node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/common/events.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Emitter = exports.Event = void 0;
      var ral_1 = require_ral();
      var Event;
      (function(Event2) {
        const _disposable = { dispose() {
        } };
        Event2.None = function() {
          return _disposable;
        };
      })(Event = exports.Event || (exports.Event = {}));
      var CallbackList = class {
        add(callback, context = null, bucket) {
          if (!this._callbacks) {
            this._callbacks = [];
            this._contexts = [];
          }
          this._callbacks.push(callback);
          this._contexts.push(context);
          if (Array.isArray(bucket)) {
            bucket.push({ dispose: () => this.remove(callback, context) });
          }
        }
        remove(callback, context = null) {
          if (!this._callbacks) {
            return;
          }
          let foundCallbackWithDifferentContext = false;
          for (let i = 0, len = this._callbacks.length; i < len; i++) {
            if (this._callbacks[i] === callback) {
              if (this._contexts[i] === context) {
                this._callbacks.splice(i, 1);
                this._contexts.splice(i, 1);
                return;
              } else {
                foundCallbackWithDifferentContext = true;
              }
            }
          }
          if (foundCallbackWithDifferentContext) {
            throw new Error("When adding a listener with a context, you should remove it with the same context");
          }
        }
        invoke(...args) {
          if (!this._callbacks) {
            return [];
          }
          const ret = [], callbacks = this._callbacks.slice(0), contexts = this._contexts.slice(0);
          for (let i = 0, len = callbacks.length; i < len; i++) {
            try {
              ret.push(callbacks[i].apply(contexts[i], args));
            } catch (e) {
              ral_1.default().console.error(e);
            }
          }
          return ret;
        }
        isEmpty() {
          return !this._callbacks || this._callbacks.length === 0;
        }
        dispose() {
          this._callbacks = void 0;
          this._contexts = void 0;
        }
      };
      var Emitter = class {
        constructor(_options) {
          this._options = _options;
        }
        get event() {
          if (!this._event) {
            this._event = (listener, thisArgs, disposables) => {
              if (!this._callbacks) {
                this._callbacks = new CallbackList();
              }
              if (this._options && this._options.onFirstListenerAdd && this._callbacks.isEmpty()) {
                this._options.onFirstListenerAdd(this);
              }
              this._callbacks.add(listener, thisArgs);
              const result = {
                dispose: () => {
                  if (!this._callbacks) {
                    return;
                  }
                  this._callbacks.remove(listener, thisArgs);
                  result.dispose = Emitter._noop;
                  if (this._options && this._options.onLastListenerRemove && this._callbacks.isEmpty()) {
                    this._options.onLastListenerRemove(this);
                  }
                }
              };
              if (Array.isArray(disposables)) {
                disposables.push(result);
              }
              return result;
            };
          }
          return this._event;
        }
        fire(event) {
          if (this._callbacks) {
            this._callbacks.invoke.call(this._callbacks, event);
          }
        }
        dispose() {
          if (this._callbacks) {
            this._callbacks.dispose();
            this._callbacks = void 0;
          }
        }
      };
      exports.Emitter = Emitter;
      Emitter._noop = function() {
      };
    }
  });

  // node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/common/messageBuffer.js
  var require_messageBuffer = __commonJS({
    "node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/common/messageBuffer.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.AbstractMessageBuffer = void 0;
      var CR = 13;
      var LF = 10;
      var CRLF = "\r\n";
      var AbstractMessageBuffer = class {
        constructor(encoding = "utf-8") {
          this._encoding = encoding;
          this._chunks = [];
          this._totalLength = 0;
        }
        get encoding() {
          return this._encoding;
        }
        append(chunk) {
          const toAppend = typeof chunk === "string" ? this.fromString(chunk, this._encoding) : chunk;
          this._chunks.push(toAppend);
          this._totalLength += toAppend.byteLength;
        }
        tryReadHeaders() {
          if (this._chunks.length === 0) {
            return void 0;
          }
          let state = 0;
          let chunkIndex = 0;
          let offset = 0;
          let chunkBytesRead = 0;
          row:
            while (chunkIndex < this._chunks.length) {
              const chunk = this._chunks[chunkIndex];
              offset = 0;
              column:
                while (offset < chunk.length) {
                  const value = chunk[offset];
                  switch (value) {
                    case CR:
                      switch (state) {
                        case 0:
                          state = 1;
                          break;
                        case 2:
                          state = 3;
                          break;
                        default:
                          state = 0;
                      }
                      break;
                    case LF:
                      switch (state) {
                        case 1:
                          state = 2;
                          break;
                        case 3:
                          state = 4;
                          offset++;
                          break row;
                        default:
                          state = 0;
                      }
                      break;
                    default:
                      state = 0;
                  }
                  offset++;
                }
              chunkBytesRead += chunk.byteLength;
              chunkIndex++;
            }
          if (state !== 4) {
            return void 0;
          }
          const buffer = this._read(chunkBytesRead + offset);
          const result = /* @__PURE__ */ new Map();
          const headers = this.toString(buffer, "ascii").split(CRLF);
          if (headers.length < 2) {
            return result;
          }
          for (let i = 0; i < headers.length - 2; i++) {
            const header = headers[i];
            const index = header.indexOf(":");
            if (index === -1) {
              throw new Error("Message header must separate key and value using :");
            }
            const key = header.substr(0, index);
            const value = header.substr(index + 1).trim();
            result.set(key, value);
          }
          return result;
        }
        tryReadBody(length) {
          if (this._totalLength < length) {
            return void 0;
          }
          return this._read(length);
        }
        get numberOfBytes() {
          return this._totalLength;
        }
        _read(byteCount) {
          if (byteCount === 0) {
            return this.emptyBuffer();
          }
          if (byteCount > this._totalLength) {
            throw new Error(`Cannot read so many bytes!`);
          }
          if (this._chunks[0].byteLength === byteCount) {
            const chunk = this._chunks[0];
            this._chunks.shift();
            this._totalLength -= byteCount;
            return this.asNative(chunk);
          }
          if (this._chunks[0].byteLength > byteCount) {
            const chunk = this._chunks[0];
            const result2 = this.asNative(chunk, byteCount);
            this._chunks[0] = chunk.slice(byteCount);
            this._totalLength -= byteCount;
            return result2;
          }
          const result = this.allocNative(byteCount);
          let resultOffset = 0;
          let chunkIndex = 0;
          while (byteCount > 0) {
            const chunk = this._chunks[chunkIndex];
            if (chunk.byteLength > byteCount) {
              const chunkPart = chunk.slice(0, byteCount);
              result.set(chunkPart, resultOffset);
              resultOffset += byteCount;
              this._chunks[chunkIndex] = chunk.slice(byteCount);
              this._totalLength -= byteCount;
              byteCount -= byteCount;
            } else {
              result.set(chunk, resultOffset);
              resultOffset += chunk.byteLength;
              this._chunks.shift();
              this._totalLength -= chunk.byteLength;
              byteCount -= chunk.byteLength;
            }
          }
          return result;
        }
      };
      exports.AbstractMessageBuffer = AbstractMessageBuffer;
    }
  });

  // node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/browser/ril.js
  var require_ril = __commonJS({
    "node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/browser/ril.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var ral_1 = require_ral();
      var disposable_1 = require_disposable();
      var events_1 = require_events();
      var messageBuffer_1 = require_messageBuffer();
      var MessageBuffer = class extends messageBuffer_1.AbstractMessageBuffer {
        constructor(encoding = "utf-8") {
          super(encoding);
          this.asciiDecoder = new TextDecoder("ascii");
        }
        emptyBuffer() {
          return MessageBuffer.emptyBuffer;
        }
        fromString(value, _encoding) {
          return new TextEncoder().encode(value);
        }
        toString(value, encoding) {
          if (encoding === "ascii") {
            return this.asciiDecoder.decode(value);
          } else {
            return new TextDecoder(encoding).decode(value);
          }
        }
        asNative(buffer, length) {
          if (length === void 0) {
            return buffer;
          } else {
            return buffer.slice(0, length);
          }
        }
        allocNative(length) {
          return new Uint8Array(length);
        }
      };
      MessageBuffer.emptyBuffer = new Uint8Array(0);
      var ReadableStreamWrapper = class {
        constructor(socket) {
          this.socket = socket;
          this._onData = new events_1.Emitter();
          this._messageListener = (event) => {
            const blob = event.data;
            blob.arrayBuffer().then((buffer) => {
              this._onData.fire(new Uint8Array(buffer));
            });
          };
          this.socket.addEventListener("message", this._messageListener);
        }
        onClose(listener) {
          this.socket.addEventListener("close", listener);
          return disposable_1.Disposable.create(() => this.socket.removeEventListener("close", listener));
        }
        onError(listener) {
          this.socket.addEventListener("error", listener);
          return disposable_1.Disposable.create(() => this.socket.removeEventListener("error", listener));
        }
        onEnd(listener) {
          this.socket.addEventListener("end", listener);
          return disposable_1.Disposable.create(() => this.socket.removeEventListener("end", listener));
        }
        onData(listener) {
          return this._onData.event(listener);
        }
      };
      var WritableStreamWrapper = class {
        constructor(socket) {
          this.socket = socket;
        }
        onClose(listener) {
          this.socket.addEventListener("close", listener);
          return disposable_1.Disposable.create(() => this.socket.removeEventListener("close", listener));
        }
        onError(listener) {
          this.socket.addEventListener("error", listener);
          return disposable_1.Disposable.create(() => this.socket.removeEventListener("error", listener));
        }
        onEnd(listener) {
          this.socket.addEventListener("end", listener);
          return disposable_1.Disposable.create(() => this.socket.removeEventListener("end", listener));
        }
        write(data, encoding) {
          if (typeof data === "string") {
            if (encoding !== void 0 && encoding !== "utf-8") {
              throw new Error(`In a Browser environments only utf-8 text encding is supported. But got encoding: ${encoding}`);
            }
            this.socket.send(data);
          } else {
            this.socket.send(data);
          }
          return Promise.resolve();
        }
        end() {
          this.socket.close();
        }
      };
      var _textEncoder = new TextEncoder();
      var _ril = Object.freeze({
        messageBuffer: Object.freeze({
          create: (encoding) => new MessageBuffer(encoding)
        }),
        applicationJson: Object.freeze({
          encoder: Object.freeze({
            name: "application/json",
            encode: (msg, options) => {
              if (options.charset !== "utf-8") {
                throw new Error(`In a Browser environments only utf-8 text encding is supported. But got encoding: ${options.charset}`);
              }
              return Promise.resolve(_textEncoder.encode(JSON.stringify(msg, void 0, 0)));
            }
          }),
          decoder: Object.freeze({
            name: "application/json",
            decode: (buffer, options) => {
              if (!(buffer instanceof Uint8Array)) {
                throw new Error(`In a Browser environments only Uint8Arrays are supported.`);
              }
              return Promise.resolve(JSON.parse(new TextDecoder(options.charset).decode(buffer)));
            }
          })
        }),
        stream: Object.freeze({
          asReadableStream: (socket) => new ReadableStreamWrapper(socket),
          asWritableStream: (socket) => new WritableStreamWrapper(socket)
        }),
        console,
        timer: Object.freeze({
          setTimeout(callback, ms, ...args) {
            return setTimeout(callback, ms, ...args);
          },
          clearTimeout(handle) {
            clearTimeout(handle);
          },
          setImmediate(callback, ...args) {
            return setTimeout(callback, 0, ...args);
          },
          clearImmediate(handle) {
            clearTimeout(handle);
          }
        })
      });
      function RIL() {
        return _ril;
      }
      (function(RIL2) {
        function install() {
          ral_1.default.install(_ril);
        }
        RIL2.install = install;
      })(RIL || (RIL = {}));
      exports.default = RIL;
    }
  });

  // node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/common/is.js
  var require_is = __commonJS({
    "node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/common/is.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.stringArray = exports.array = exports.func = exports.error = exports.number = exports.string = exports.boolean = void 0;
      function boolean(value) {
        return value === true || value === false;
      }
      exports.boolean = boolean;
      function string(value) {
        return typeof value === "string" || value instanceof String;
      }
      exports.string = string;
      function number(value) {
        return typeof value === "number" || value instanceof Number;
      }
      exports.number = number;
      function error(value) {
        return value instanceof Error;
      }
      exports.error = error;
      function func(value) {
        return typeof value === "function";
      }
      exports.func = func;
      function array(value) {
        return Array.isArray(value);
      }
      exports.array = array;
      function stringArray(value) {
        return array(value) && value.every((elem) => string(elem));
      }
      exports.stringArray = stringArray;
    }
  });

  // node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/common/messages.js
  var require_messages = __commonJS({
    "node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/common/messages.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.isResponseMessage = exports.isNotificationMessage = exports.isRequestMessage = exports.NotificationType9 = exports.NotificationType8 = exports.NotificationType7 = exports.NotificationType6 = exports.NotificationType5 = exports.NotificationType4 = exports.NotificationType3 = exports.NotificationType2 = exports.NotificationType1 = exports.NotificationType0 = exports.NotificationType = exports.RequestType9 = exports.RequestType8 = exports.RequestType7 = exports.RequestType6 = exports.RequestType5 = exports.RequestType4 = exports.RequestType3 = exports.RequestType2 = exports.RequestType1 = exports.RequestType = exports.RequestType0 = exports.AbstractMessageSignature = exports.ParameterStructures = exports.ResponseError = exports.ErrorCodes = void 0;
      var is = require_is();
      var ErrorCodes;
      (function(ErrorCodes2) {
        ErrorCodes2.ParseError = -32700;
        ErrorCodes2.InvalidRequest = -32600;
        ErrorCodes2.MethodNotFound = -32601;
        ErrorCodes2.InvalidParams = -32602;
        ErrorCodes2.InternalError = -32603;
        ErrorCodes2.jsonrpcReservedErrorRangeStart = -32099;
        ErrorCodes2.serverErrorStart = ErrorCodes2.jsonrpcReservedErrorRangeStart;
        ErrorCodes2.MessageWriteError = -32099;
        ErrorCodes2.MessageReadError = -32098;
        ErrorCodes2.ServerNotInitialized = -32002;
        ErrorCodes2.UnknownErrorCode = -32001;
        ErrorCodes2.jsonrpcReservedErrorRangeEnd = -32e3;
        ErrorCodes2.serverErrorEnd = ErrorCodes2.jsonrpcReservedErrorRangeEnd;
      })(ErrorCodes = exports.ErrorCodes || (exports.ErrorCodes = {}));
      var ResponseError = class extends Error {
        constructor(code, message, data) {
          super(message);
          this.code = is.number(code) ? code : ErrorCodes.UnknownErrorCode;
          this.data = data;
          Object.setPrototypeOf(this, ResponseError.prototype);
        }
        toJson() {
          return {
            code: this.code,
            message: this.message,
            data: this.data
          };
        }
      };
      exports.ResponseError = ResponseError;
      var ParameterStructures = class {
        constructor(kind) {
          this.kind = kind;
        }
        static is(value) {
          return value === ParameterStructures.auto || value === ParameterStructures.byName || value === ParameterStructures.byPosition;
        }
        toString() {
          return this.kind;
        }
      };
      exports.ParameterStructures = ParameterStructures;
      ParameterStructures.auto = new ParameterStructures("auto");
      ParameterStructures.byPosition = new ParameterStructures("byPosition");
      ParameterStructures.byName = new ParameterStructures("byName");
      var AbstractMessageSignature = class {
        constructor(method, numberOfParams) {
          this.method = method;
          this.numberOfParams = numberOfParams;
        }
        get parameterStructures() {
          return ParameterStructures.auto;
        }
      };
      exports.AbstractMessageSignature = AbstractMessageSignature;
      var RequestType0 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 0);
        }
      };
      exports.RequestType0 = RequestType0;
      var RequestType = class extends AbstractMessageSignature {
        constructor(method, _parameterStructures = ParameterStructures.auto) {
          super(method, 1);
          this._parameterStructures = _parameterStructures;
        }
        get parameterStructures() {
          return this._parameterStructures;
        }
      };
      exports.RequestType = RequestType;
      var RequestType1 = class extends AbstractMessageSignature {
        constructor(method, _parameterStructures = ParameterStructures.auto) {
          super(method, 1);
          this._parameterStructures = _parameterStructures;
        }
        get parameterStructures() {
          return this._parameterStructures;
        }
      };
      exports.RequestType1 = RequestType1;
      var RequestType2 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 2);
        }
      };
      exports.RequestType2 = RequestType2;
      var RequestType3 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 3);
        }
      };
      exports.RequestType3 = RequestType3;
      var RequestType4 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 4);
        }
      };
      exports.RequestType4 = RequestType4;
      var RequestType5 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 5);
        }
      };
      exports.RequestType5 = RequestType5;
      var RequestType6 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 6);
        }
      };
      exports.RequestType6 = RequestType6;
      var RequestType7 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 7);
        }
      };
      exports.RequestType7 = RequestType7;
      var RequestType8 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 8);
        }
      };
      exports.RequestType8 = RequestType8;
      var RequestType9 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 9);
        }
      };
      exports.RequestType9 = RequestType9;
      var NotificationType = class extends AbstractMessageSignature {
        constructor(method, _parameterStructures = ParameterStructures.auto) {
          super(method, 1);
          this._parameterStructures = _parameterStructures;
        }
        get parameterStructures() {
          return this._parameterStructures;
        }
      };
      exports.NotificationType = NotificationType;
      var NotificationType0 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 0);
        }
      };
      exports.NotificationType0 = NotificationType0;
      var NotificationType1 = class extends AbstractMessageSignature {
        constructor(method, _parameterStructures = ParameterStructures.auto) {
          super(method, 1);
          this._parameterStructures = _parameterStructures;
        }
        get parameterStructures() {
          return this._parameterStructures;
        }
      };
      exports.NotificationType1 = NotificationType1;
      var NotificationType2 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 2);
        }
      };
      exports.NotificationType2 = NotificationType2;
      var NotificationType3 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 3);
        }
      };
      exports.NotificationType3 = NotificationType3;
      var NotificationType4 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 4);
        }
      };
      exports.NotificationType4 = NotificationType4;
      var NotificationType5 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 5);
        }
      };
      exports.NotificationType5 = NotificationType5;
      var NotificationType6 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 6);
        }
      };
      exports.NotificationType6 = NotificationType6;
      var NotificationType7 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 7);
        }
      };
      exports.NotificationType7 = NotificationType7;
      var NotificationType8 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 8);
        }
      };
      exports.NotificationType8 = NotificationType8;
      var NotificationType9 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 9);
        }
      };
      exports.NotificationType9 = NotificationType9;
      function isRequestMessage(message) {
        const candidate = message;
        return candidate && is.string(candidate.method) && (is.string(candidate.id) || is.number(candidate.id));
      }
      exports.isRequestMessage = isRequestMessage;
      function isNotificationMessage(message) {
        const candidate = message;
        return candidate && is.string(candidate.method) && message.id === void 0;
      }
      exports.isNotificationMessage = isNotificationMessage;
      function isResponseMessage(message) {
        const candidate = message;
        return candidate && (candidate.result !== void 0 || !!candidate.error) && (is.string(candidate.id) || is.number(candidate.id) || candidate.id === null);
      }
      exports.isResponseMessage = isResponseMessage;
    }
  });

  // node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/common/cancellation.js
  var require_cancellation = __commonJS({
    "node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/common/cancellation.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.CancellationTokenSource = exports.CancellationToken = void 0;
      var ral_1 = require_ral();
      var Is = require_is();
      var events_1 = require_events();
      var CancellationToken;
      (function(CancellationToken2) {
        CancellationToken2.None = Object.freeze({
          isCancellationRequested: false,
          onCancellationRequested: events_1.Event.None
        });
        CancellationToken2.Cancelled = Object.freeze({
          isCancellationRequested: true,
          onCancellationRequested: events_1.Event.None
        });
        function is(value) {
          const candidate = value;
          return candidate && (candidate === CancellationToken2.None || candidate === CancellationToken2.Cancelled || Is.boolean(candidate.isCancellationRequested) && !!candidate.onCancellationRequested);
        }
        CancellationToken2.is = is;
      })(CancellationToken = exports.CancellationToken || (exports.CancellationToken = {}));
      var shortcutEvent = Object.freeze(function(callback, context) {
        const handle = ral_1.default().timer.setTimeout(callback.bind(context), 0);
        return { dispose() {
          ral_1.default().timer.clearTimeout(handle);
        } };
      });
      var MutableToken = class {
        constructor() {
          this._isCancelled = false;
        }
        cancel() {
          if (!this._isCancelled) {
            this._isCancelled = true;
            if (this._emitter) {
              this._emitter.fire(void 0);
              this.dispose();
            }
          }
        }
        get isCancellationRequested() {
          return this._isCancelled;
        }
        get onCancellationRequested() {
          if (this._isCancelled) {
            return shortcutEvent;
          }
          if (!this._emitter) {
            this._emitter = new events_1.Emitter();
          }
          return this._emitter.event;
        }
        dispose() {
          if (this._emitter) {
            this._emitter.dispose();
            this._emitter = void 0;
          }
        }
      };
      var CancellationTokenSource = class {
        get token() {
          if (!this._token) {
            this._token = new MutableToken();
          }
          return this._token;
        }
        cancel() {
          if (!this._token) {
            this._token = CancellationToken.Cancelled;
          } else {
            this._token.cancel();
          }
        }
        dispose() {
          if (!this._token) {
            this._token = CancellationToken.None;
          } else if (this._token instanceof MutableToken) {
            this._token.dispose();
          }
        }
      };
      exports.CancellationTokenSource = CancellationTokenSource;
    }
  });

  // node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/common/messageReader.js
  var require_messageReader = __commonJS({
    "node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/common/messageReader.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ReadableStreamMessageReader = exports.AbstractMessageReader = exports.MessageReader = void 0;
      var ral_1 = require_ral();
      var Is = require_is();
      var events_1 = require_events();
      var MessageReader;
      (function(MessageReader2) {
        function is(value) {
          let candidate = value;
          return candidate && Is.func(candidate.listen) && Is.func(candidate.dispose) && Is.func(candidate.onError) && Is.func(candidate.onClose) && Is.func(candidate.onPartialMessage);
        }
        MessageReader2.is = is;
      })(MessageReader = exports.MessageReader || (exports.MessageReader = {}));
      var AbstractMessageReader = class {
        constructor() {
          this.errorEmitter = new events_1.Emitter();
          this.closeEmitter = new events_1.Emitter();
          this.partialMessageEmitter = new events_1.Emitter();
        }
        dispose() {
          this.errorEmitter.dispose();
          this.closeEmitter.dispose();
        }
        get onError() {
          return this.errorEmitter.event;
        }
        fireError(error) {
          this.errorEmitter.fire(this.asError(error));
        }
        get onClose() {
          return this.closeEmitter.event;
        }
        fireClose() {
          this.closeEmitter.fire(void 0);
        }
        get onPartialMessage() {
          return this.partialMessageEmitter.event;
        }
        firePartialMessage(info) {
          this.partialMessageEmitter.fire(info);
        }
        asError(error) {
          if (error instanceof Error) {
            return error;
          } else {
            return new Error(`Reader received error. Reason: ${Is.string(error.message) ? error.message : "unknown"}`);
          }
        }
      };
      exports.AbstractMessageReader = AbstractMessageReader;
      var ResolvedMessageReaderOptions;
      (function(ResolvedMessageReaderOptions2) {
        function fromOptions(options) {
          var _a2;
          let charset;
          let result;
          let contentDecoder;
          const contentDecoders = /* @__PURE__ */ new Map();
          let contentTypeDecoder;
          const contentTypeDecoders = /* @__PURE__ */ new Map();
          if (options === void 0 || typeof options === "string") {
            charset = options !== null && options !== void 0 ? options : "utf-8";
          } else {
            charset = (_a2 = options.charset) !== null && _a2 !== void 0 ? _a2 : "utf-8";
            if (options.contentDecoder !== void 0) {
              contentDecoder = options.contentDecoder;
              contentDecoders.set(contentDecoder.name, contentDecoder);
            }
            if (options.contentDecoders !== void 0) {
              for (const decoder of options.contentDecoders) {
                contentDecoders.set(decoder.name, decoder);
              }
            }
            if (options.contentTypeDecoder !== void 0) {
              contentTypeDecoder = options.contentTypeDecoder;
              contentTypeDecoders.set(contentTypeDecoder.name, contentTypeDecoder);
            }
            if (options.contentTypeDecoders !== void 0) {
              for (const decoder of options.contentTypeDecoders) {
                contentTypeDecoders.set(decoder.name, decoder);
              }
            }
          }
          if (contentTypeDecoder === void 0) {
            contentTypeDecoder = ral_1.default().applicationJson.decoder;
            contentTypeDecoders.set(contentTypeDecoder.name, contentTypeDecoder);
          }
          return { charset, contentDecoder, contentDecoders, contentTypeDecoder, contentTypeDecoders };
        }
        ResolvedMessageReaderOptions2.fromOptions = fromOptions;
      })(ResolvedMessageReaderOptions || (ResolvedMessageReaderOptions = {}));
      var ReadableStreamMessageReader = class extends AbstractMessageReader {
        constructor(readable, options) {
          super();
          this.readable = readable;
          this.options = ResolvedMessageReaderOptions.fromOptions(options);
          this.buffer = ral_1.default().messageBuffer.create(this.options.charset);
          this._partialMessageTimeout = 1e4;
          this.nextMessageLength = -1;
          this.messageToken = 0;
        }
        set partialMessageTimeout(timeout) {
          this._partialMessageTimeout = timeout;
        }
        get partialMessageTimeout() {
          return this._partialMessageTimeout;
        }
        listen(callback) {
          this.nextMessageLength = -1;
          this.messageToken = 0;
          this.partialMessageTimer = void 0;
          this.callback = callback;
          const result = this.readable.onData((data) => {
            this.onData(data);
          });
          this.readable.onError((error) => this.fireError(error));
          this.readable.onClose(() => this.fireClose());
          return result;
        }
        onData(data) {
          this.buffer.append(data);
          while (true) {
            if (this.nextMessageLength === -1) {
              const headers = this.buffer.tryReadHeaders();
              if (!headers) {
                return;
              }
              const contentLength = headers.get("Content-Length");
              if (!contentLength) {
                throw new Error("Header must provide a Content-Length property.");
              }
              const length = parseInt(contentLength);
              if (isNaN(length)) {
                throw new Error("Content-Length value must be a number.");
              }
              this.nextMessageLength = length;
            }
            const body = this.buffer.tryReadBody(this.nextMessageLength);
            if (body === void 0) {
              this.setPartialMessageTimer();
              return;
            }
            this.clearPartialMessageTimer();
            this.nextMessageLength = -1;
            let p;
            if (this.options.contentDecoder !== void 0) {
              p = this.options.contentDecoder.decode(body);
            } else {
              p = Promise.resolve(body);
            }
            p.then((value) => {
              this.options.contentTypeDecoder.decode(value, this.options).then((msg) => {
                this.callback(msg);
              }, (error) => {
                this.fireError(error);
              });
            }, (error) => {
              this.fireError(error);
            });
          }
        }
        clearPartialMessageTimer() {
          if (this.partialMessageTimer) {
            ral_1.default().timer.clearTimeout(this.partialMessageTimer);
            this.partialMessageTimer = void 0;
          }
        }
        setPartialMessageTimer() {
          this.clearPartialMessageTimer();
          if (this._partialMessageTimeout <= 0) {
            return;
          }
          this.partialMessageTimer = ral_1.default().timer.setTimeout((token, timeout) => {
            this.partialMessageTimer = void 0;
            if (token === this.messageToken) {
              this.firePartialMessage({ messageToken: token, waitingTime: timeout });
              this.setPartialMessageTimer();
            }
          }, this._partialMessageTimeout, this.messageToken, this._partialMessageTimeout);
        }
      };
      exports.ReadableStreamMessageReader = ReadableStreamMessageReader;
    }
  });

  // node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/common/semaphore.js
  var require_semaphore = __commonJS({
    "node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/common/semaphore.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Semaphore = void 0;
      var ral_1 = require_ral();
      var Semaphore = class {
        constructor(capacity = 1) {
          if (capacity <= 0) {
            throw new Error("Capacity must be greater than 0");
          }
          this._capacity = capacity;
          this._active = 0;
          this._waiting = [];
        }
        lock(thunk) {
          return new Promise((resolve2, reject) => {
            this._waiting.push({ thunk, resolve: resolve2, reject });
            this.runNext();
          });
        }
        get active() {
          return this._active;
        }
        runNext() {
          if (this._waiting.length === 0 || this._active === this._capacity) {
            return;
          }
          ral_1.default().timer.setImmediate(() => this.doRunNext());
        }
        doRunNext() {
          if (this._waiting.length === 0 || this._active === this._capacity) {
            return;
          }
          const next = this._waiting.shift();
          this._active++;
          if (this._active > this._capacity) {
            throw new Error(`To many thunks active`);
          }
          try {
            const result = next.thunk();
            if (result instanceof Promise) {
              result.then((value) => {
                this._active--;
                next.resolve(value);
                this.runNext();
              }, (err) => {
                this._active--;
                next.reject(err);
                this.runNext();
              });
            } else {
              this._active--;
              next.resolve(result);
              this.runNext();
            }
          } catch (err) {
            this._active--;
            next.reject(err);
            this.runNext();
          }
        }
      };
      exports.Semaphore = Semaphore;
    }
  });

  // node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/common/messageWriter.js
  var require_messageWriter = __commonJS({
    "node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/common/messageWriter.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.WriteableStreamMessageWriter = exports.AbstractMessageWriter = exports.MessageWriter = void 0;
      var ral_1 = require_ral();
      var Is = require_is();
      var semaphore_1 = require_semaphore();
      var events_1 = require_events();
      var ContentLength = "Content-Length: ";
      var CRLF = "\r\n";
      var MessageWriter;
      (function(MessageWriter2) {
        function is(value) {
          let candidate = value;
          return candidate && Is.func(candidate.dispose) && Is.func(candidate.onClose) && Is.func(candidate.onError) && Is.func(candidate.write);
        }
        MessageWriter2.is = is;
      })(MessageWriter = exports.MessageWriter || (exports.MessageWriter = {}));
      var AbstractMessageWriter = class {
        constructor() {
          this.errorEmitter = new events_1.Emitter();
          this.closeEmitter = new events_1.Emitter();
        }
        dispose() {
          this.errorEmitter.dispose();
          this.closeEmitter.dispose();
        }
        get onError() {
          return this.errorEmitter.event;
        }
        fireError(error, message, count) {
          this.errorEmitter.fire([this.asError(error), message, count]);
        }
        get onClose() {
          return this.closeEmitter.event;
        }
        fireClose() {
          this.closeEmitter.fire(void 0);
        }
        asError(error) {
          if (error instanceof Error) {
            return error;
          } else {
            return new Error(`Writer received error. Reason: ${Is.string(error.message) ? error.message : "unknown"}`);
          }
        }
      };
      exports.AbstractMessageWriter = AbstractMessageWriter;
      var ResolvedMessageWriterOptions;
      (function(ResolvedMessageWriterOptions2) {
        function fromOptions(options) {
          var _a2, _b;
          if (options === void 0 || typeof options === "string") {
            return { charset: options !== null && options !== void 0 ? options : "utf-8", contentTypeEncoder: ral_1.default().applicationJson.encoder };
          } else {
            return { charset: (_a2 = options.charset) !== null && _a2 !== void 0 ? _a2 : "utf-8", contentEncoder: options.contentEncoder, contentTypeEncoder: (_b = options.contentTypeEncoder) !== null && _b !== void 0 ? _b : ral_1.default().applicationJson.encoder };
          }
        }
        ResolvedMessageWriterOptions2.fromOptions = fromOptions;
      })(ResolvedMessageWriterOptions || (ResolvedMessageWriterOptions = {}));
      var WriteableStreamMessageWriter = class extends AbstractMessageWriter {
        constructor(writable, options) {
          super();
          this.writable = writable;
          this.options = ResolvedMessageWriterOptions.fromOptions(options);
          this.errorCount = 0;
          this.writeSemaphore = new semaphore_1.Semaphore(1);
          this.writable.onError((error) => this.fireError(error));
          this.writable.onClose(() => this.fireClose());
        }
        async write(msg) {
          return this.writeSemaphore.lock(async () => {
            const payload = this.options.contentTypeEncoder.encode(msg, this.options).then((buffer) => {
              if (this.options.contentEncoder !== void 0) {
                return this.options.contentEncoder.encode(buffer);
              } else {
                return buffer;
              }
            });
            return payload.then((buffer) => {
              const headers = [];
              headers.push(ContentLength, buffer.byteLength.toString(), CRLF);
              headers.push(CRLF);
              return this.doWrite(msg, headers, buffer);
            }, (error) => {
              this.fireError(error);
              throw error;
            });
          });
        }
        async doWrite(msg, headers, data) {
          try {
            await this.writable.write(headers.join(""), "ascii");
            return this.writable.write(data);
          } catch (error) {
            this.handleError(error, msg);
            return Promise.reject(error);
          }
        }
        handleError(error, msg) {
          this.errorCount++;
          this.fireError(error, msg, this.errorCount);
        }
        end() {
          this.writable.end();
        }
      };
      exports.WriteableStreamMessageWriter = WriteableStreamMessageWriter;
    }
  });

  // node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/common/linkedMap.js
  var require_linkedMap = __commonJS({
    "node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/common/linkedMap.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.LRUCache = exports.LinkedMap = exports.Touch = void 0;
      var Touch;
      (function(Touch2) {
        Touch2.None = 0;
        Touch2.First = 1;
        Touch2.AsOld = Touch2.First;
        Touch2.Last = 2;
        Touch2.AsNew = Touch2.Last;
      })(Touch = exports.Touch || (exports.Touch = {}));
      var LinkedMap = class {
        constructor() {
          this[Symbol.toStringTag] = "LinkedMap";
          this._map = /* @__PURE__ */ new Map();
          this._head = void 0;
          this._tail = void 0;
          this._size = 0;
          this._state = 0;
        }
        clear() {
          this._map.clear();
          this._head = void 0;
          this._tail = void 0;
          this._size = 0;
          this._state++;
        }
        isEmpty() {
          return !this._head && !this._tail;
        }
        get size() {
          return this._size;
        }
        get first() {
          var _a2;
          return (_a2 = this._head) === null || _a2 === void 0 ? void 0 : _a2.value;
        }
        get last() {
          var _a2;
          return (_a2 = this._tail) === null || _a2 === void 0 ? void 0 : _a2.value;
        }
        has(key) {
          return this._map.has(key);
        }
        get(key, touch = Touch.None) {
          const item = this._map.get(key);
          if (!item) {
            return void 0;
          }
          if (touch !== Touch.None) {
            this.touch(item, touch);
          }
          return item.value;
        }
        set(key, value, touch = Touch.None) {
          let item = this._map.get(key);
          if (item) {
            item.value = value;
            if (touch !== Touch.None) {
              this.touch(item, touch);
            }
          } else {
            item = { key, value, next: void 0, previous: void 0 };
            switch (touch) {
              case Touch.None:
                this.addItemLast(item);
                break;
              case Touch.First:
                this.addItemFirst(item);
                break;
              case Touch.Last:
                this.addItemLast(item);
                break;
              default:
                this.addItemLast(item);
                break;
            }
            this._map.set(key, item);
            this._size++;
          }
          return this;
        }
        delete(key) {
          return !!this.remove(key);
        }
        remove(key) {
          const item = this._map.get(key);
          if (!item) {
            return void 0;
          }
          this._map.delete(key);
          this.removeItem(item);
          this._size--;
          return item.value;
        }
        shift() {
          if (!this._head && !this._tail) {
            return void 0;
          }
          if (!this._head || !this._tail) {
            throw new Error("Invalid list");
          }
          const item = this._head;
          this._map.delete(item.key);
          this.removeItem(item);
          this._size--;
          return item.value;
        }
        forEach(callbackfn, thisArg) {
          const state = this._state;
          let current = this._head;
          while (current) {
            if (thisArg) {
              callbackfn.bind(thisArg)(current.value, current.key, this);
            } else {
              callbackfn(current.value, current.key, this);
            }
            if (this._state !== state) {
              throw new Error(`LinkedMap got modified during iteration.`);
            }
            current = current.next;
          }
        }
        keys() {
          const map = this;
          const state = this._state;
          let current = this._head;
          const iterator = {
            [Symbol.iterator]() {
              return iterator;
            },
            next() {
              if (map._state !== state) {
                throw new Error(`LinkedMap got modified during iteration.`);
              }
              if (current) {
                const result = { value: current.key, done: false };
                current = current.next;
                return result;
              } else {
                return { value: void 0, done: true };
              }
            }
          };
          return iterator;
        }
        values() {
          const map = this;
          const state = this._state;
          let current = this._head;
          const iterator = {
            [Symbol.iterator]() {
              return iterator;
            },
            next() {
              if (map._state !== state) {
                throw new Error(`LinkedMap got modified during iteration.`);
              }
              if (current) {
                const result = { value: current.value, done: false };
                current = current.next;
                return result;
              } else {
                return { value: void 0, done: true };
              }
            }
          };
          return iterator;
        }
        entries() {
          const map = this;
          const state = this._state;
          let current = this._head;
          const iterator = {
            [Symbol.iterator]() {
              return iterator;
            },
            next() {
              if (map._state !== state) {
                throw new Error(`LinkedMap got modified during iteration.`);
              }
              if (current) {
                const result = { value: [current.key, current.value], done: false };
                current = current.next;
                return result;
              } else {
                return { value: void 0, done: true };
              }
            }
          };
          return iterator;
        }
        [Symbol.iterator]() {
          return this.entries();
        }
        trimOld(newSize) {
          if (newSize >= this.size) {
            return;
          }
          if (newSize === 0) {
            this.clear();
            return;
          }
          let current = this._head;
          let currentSize = this.size;
          while (current && currentSize > newSize) {
            this._map.delete(current.key);
            current = current.next;
            currentSize--;
          }
          this._head = current;
          this._size = currentSize;
          if (current) {
            current.previous = void 0;
          }
          this._state++;
        }
        addItemFirst(item) {
          if (!this._head && !this._tail) {
            this._tail = item;
          } else if (!this._head) {
            throw new Error("Invalid list");
          } else {
            item.next = this._head;
            this._head.previous = item;
          }
          this._head = item;
          this._state++;
        }
        addItemLast(item) {
          if (!this._head && !this._tail) {
            this._head = item;
          } else if (!this._tail) {
            throw new Error("Invalid list");
          } else {
            item.previous = this._tail;
            this._tail.next = item;
          }
          this._tail = item;
          this._state++;
        }
        removeItem(item) {
          if (item === this._head && item === this._tail) {
            this._head = void 0;
            this._tail = void 0;
          } else if (item === this._head) {
            if (!item.next) {
              throw new Error("Invalid list");
            }
            item.next.previous = void 0;
            this._head = item.next;
          } else if (item === this._tail) {
            if (!item.previous) {
              throw new Error("Invalid list");
            }
            item.previous.next = void 0;
            this._tail = item.previous;
          } else {
            const next = item.next;
            const previous = item.previous;
            if (!next || !previous) {
              throw new Error("Invalid list");
            }
            next.previous = previous;
            previous.next = next;
          }
          item.next = void 0;
          item.previous = void 0;
          this._state++;
        }
        touch(item, touch) {
          if (!this._head || !this._tail) {
            throw new Error("Invalid list");
          }
          if (touch !== Touch.First && touch !== Touch.Last) {
            return;
          }
          if (touch === Touch.First) {
            if (item === this._head) {
              return;
            }
            const next = item.next;
            const previous = item.previous;
            if (item === this._tail) {
              previous.next = void 0;
              this._tail = previous;
            } else {
              next.previous = previous;
              previous.next = next;
            }
            item.previous = void 0;
            item.next = this._head;
            this._head.previous = item;
            this._head = item;
            this._state++;
          } else if (touch === Touch.Last) {
            if (item === this._tail) {
              return;
            }
            const next = item.next;
            const previous = item.previous;
            if (item === this._head) {
              next.previous = void 0;
              this._head = next;
            } else {
              next.previous = previous;
              previous.next = next;
            }
            item.next = void 0;
            item.previous = this._tail;
            this._tail.next = item;
            this._tail = item;
            this._state++;
          }
        }
        toJSON() {
          const data = [];
          this.forEach((value, key) => {
            data.push([key, value]);
          });
          return data;
        }
        fromJSON(data) {
          this.clear();
          for (const [key, value] of data) {
            this.set(key, value);
          }
        }
      };
      exports.LinkedMap = LinkedMap;
      var LRUCache = class extends LinkedMap {
        constructor(limit, ratio = 1) {
          super();
          this._limit = limit;
          this._ratio = Math.min(Math.max(0, ratio), 1);
        }
        get limit() {
          return this._limit;
        }
        set limit(limit) {
          this._limit = limit;
          this.checkTrim();
        }
        get ratio() {
          return this._ratio;
        }
        set ratio(ratio) {
          this._ratio = Math.min(Math.max(0, ratio), 1);
          this.checkTrim();
        }
        get(key, touch = Touch.AsNew) {
          return super.get(key, touch);
        }
        peek(key) {
          return super.get(key, Touch.None);
        }
        set(key, value) {
          super.set(key, value, Touch.Last);
          this.checkTrim();
          return this;
        }
        checkTrim() {
          if (this.size > this._limit) {
            this.trimOld(Math.round(this._limit * this._ratio));
          }
        }
      };
      exports.LRUCache = LRUCache;
    }
  });

  // node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/common/connection.js
  var require_connection = __commonJS({
    "node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/common/connection.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.createMessageConnection = exports.ConnectionOptions = exports.CancellationStrategy = exports.CancellationSenderStrategy = exports.CancellationReceiverStrategy = exports.ConnectionStrategy = exports.ConnectionError = exports.ConnectionErrors = exports.LogTraceNotification = exports.SetTraceNotification = exports.TraceFormat = exports.Trace = exports.NullLogger = exports.ProgressType = void 0;
      var ral_1 = require_ral();
      var Is = require_is();
      var messages_1 = require_messages();
      var linkedMap_1 = require_linkedMap();
      var events_1 = require_events();
      var cancellation_1 = require_cancellation();
      var CancelNotification;
      (function(CancelNotification2) {
        CancelNotification2.type = new messages_1.NotificationType("$/cancelRequest");
      })(CancelNotification || (CancelNotification = {}));
      var ProgressNotification;
      (function(ProgressNotification2) {
        ProgressNotification2.type = new messages_1.NotificationType("$/progress");
      })(ProgressNotification || (ProgressNotification = {}));
      var ProgressType = class {
        constructor() {
        }
      };
      exports.ProgressType = ProgressType;
      var StarRequestHandler;
      (function(StarRequestHandler2) {
        function is(value) {
          return Is.func(value);
        }
        StarRequestHandler2.is = is;
      })(StarRequestHandler || (StarRequestHandler = {}));
      exports.NullLogger = Object.freeze({
        error: () => {
        },
        warn: () => {
        },
        info: () => {
        },
        log: () => {
        }
      });
      var Trace;
      (function(Trace2) {
        Trace2[Trace2["Off"] = 0] = "Off";
        Trace2[Trace2["Messages"] = 1] = "Messages";
        Trace2[Trace2["Verbose"] = 2] = "Verbose";
      })(Trace = exports.Trace || (exports.Trace = {}));
      (function(Trace2) {
        function fromString(value) {
          if (!Is.string(value)) {
            return Trace2.Off;
          }
          value = value.toLowerCase();
          switch (value) {
            case "off":
              return Trace2.Off;
            case "messages":
              return Trace2.Messages;
            case "verbose":
              return Trace2.Verbose;
            default:
              return Trace2.Off;
          }
        }
        Trace2.fromString = fromString;
        function toString(value) {
          switch (value) {
            case Trace2.Off:
              return "off";
            case Trace2.Messages:
              return "messages";
            case Trace2.Verbose:
              return "verbose";
            default:
              return "off";
          }
        }
        Trace2.toString = toString;
      })(Trace = exports.Trace || (exports.Trace = {}));
      var TraceFormat;
      (function(TraceFormat2) {
        TraceFormat2["Text"] = "text";
        TraceFormat2["JSON"] = "json";
      })(TraceFormat = exports.TraceFormat || (exports.TraceFormat = {}));
      (function(TraceFormat2) {
        function fromString(value) {
          value = value.toLowerCase();
          if (value === "json") {
            return TraceFormat2.JSON;
          } else {
            return TraceFormat2.Text;
          }
        }
        TraceFormat2.fromString = fromString;
      })(TraceFormat = exports.TraceFormat || (exports.TraceFormat = {}));
      var SetTraceNotification;
      (function(SetTraceNotification2) {
        SetTraceNotification2.type = new messages_1.NotificationType("$/setTrace");
      })(SetTraceNotification = exports.SetTraceNotification || (exports.SetTraceNotification = {}));
      var LogTraceNotification;
      (function(LogTraceNotification2) {
        LogTraceNotification2.type = new messages_1.NotificationType("$/logTrace");
      })(LogTraceNotification = exports.LogTraceNotification || (exports.LogTraceNotification = {}));
      var ConnectionErrors;
      (function(ConnectionErrors2) {
        ConnectionErrors2[ConnectionErrors2["Closed"] = 1] = "Closed";
        ConnectionErrors2[ConnectionErrors2["Disposed"] = 2] = "Disposed";
        ConnectionErrors2[ConnectionErrors2["AlreadyListening"] = 3] = "AlreadyListening";
      })(ConnectionErrors = exports.ConnectionErrors || (exports.ConnectionErrors = {}));
      var ConnectionError = class extends Error {
        constructor(code, message) {
          super(message);
          this.code = code;
          Object.setPrototypeOf(this, ConnectionError.prototype);
        }
      };
      exports.ConnectionError = ConnectionError;
      var ConnectionStrategy;
      (function(ConnectionStrategy2) {
        function is(value) {
          const candidate = value;
          return candidate && Is.func(candidate.cancelUndispatched);
        }
        ConnectionStrategy2.is = is;
      })(ConnectionStrategy = exports.ConnectionStrategy || (exports.ConnectionStrategy = {}));
      var CancellationReceiverStrategy;
      (function(CancellationReceiverStrategy2) {
        CancellationReceiverStrategy2.Message = Object.freeze({
          createCancellationTokenSource(_) {
            return new cancellation_1.CancellationTokenSource();
          }
        });
        function is(value) {
          const candidate = value;
          return candidate && Is.func(candidate.createCancellationTokenSource);
        }
        CancellationReceiverStrategy2.is = is;
      })(CancellationReceiverStrategy = exports.CancellationReceiverStrategy || (exports.CancellationReceiverStrategy = {}));
      var CancellationSenderStrategy;
      (function(CancellationSenderStrategy2) {
        CancellationSenderStrategy2.Message = Object.freeze({
          sendCancellation(conn, id2) {
            conn.sendNotification(CancelNotification.type, { id: id2 });
          },
          cleanup(_) {
          }
        });
        function is(value) {
          const candidate = value;
          return candidate && Is.func(candidate.sendCancellation) && Is.func(candidate.cleanup);
        }
        CancellationSenderStrategy2.is = is;
      })(CancellationSenderStrategy = exports.CancellationSenderStrategy || (exports.CancellationSenderStrategy = {}));
      var CancellationStrategy;
      (function(CancellationStrategy2) {
        CancellationStrategy2.Message = Object.freeze({
          receiver: CancellationReceiverStrategy.Message,
          sender: CancellationSenderStrategy.Message
        });
        function is(value) {
          const candidate = value;
          return candidate && CancellationReceiverStrategy.is(candidate.receiver) && CancellationSenderStrategy.is(candidate.sender);
        }
        CancellationStrategy2.is = is;
      })(CancellationStrategy = exports.CancellationStrategy || (exports.CancellationStrategy = {}));
      var ConnectionOptions;
      (function(ConnectionOptions2) {
        function is(value) {
          const candidate = value;
          return candidate && (CancellationStrategy.is(candidate.cancellationStrategy) || ConnectionStrategy.is(candidate.connectionStrategy));
        }
        ConnectionOptions2.is = is;
      })(ConnectionOptions = exports.ConnectionOptions || (exports.ConnectionOptions = {}));
      var ConnectionState;
      (function(ConnectionState2) {
        ConnectionState2[ConnectionState2["New"] = 1] = "New";
        ConnectionState2[ConnectionState2["Listening"] = 2] = "Listening";
        ConnectionState2[ConnectionState2["Closed"] = 3] = "Closed";
        ConnectionState2[ConnectionState2["Disposed"] = 4] = "Disposed";
      })(ConnectionState || (ConnectionState = {}));
      function createMessageConnection(messageReader, messageWriter, _logger, options) {
        const logger = _logger !== void 0 ? _logger : exports.NullLogger;
        let sequenceNumber = 0;
        let notificationSquenceNumber = 0;
        let unknownResponseSquenceNumber = 0;
        const version = "2.0";
        let starRequestHandler = void 0;
        const requestHandlers = /* @__PURE__ */ Object.create(null);
        let starNotificationHandler = void 0;
        const notificationHandlers = /* @__PURE__ */ Object.create(null);
        const progressHandlers = /* @__PURE__ */ new Map();
        let timer;
        let messageQueue = new linkedMap_1.LinkedMap();
        let responsePromises = /* @__PURE__ */ Object.create(null);
        let requestTokens = /* @__PURE__ */ Object.create(null);
        let trace = Trace.Off;
        let traceFormat = TraceFormat.Text;
        let tracer;
        let state = ConnectionState.New;
        const errorEmitter = new events_1.Emitter();
        const closeEmitter = new events_1.Emitter();
        const unhandledNotificationEmitter = new events_1.Emitter();
        const unhandledProgressEmitter = new events_1.Emitter();
        const disposeEmitter = new events_1.Emitter();
        const cancellationStrategy = options && options.cancellationStrategy ? options.cancellationStrategy : CancellationStrategy.Message;
        function createRequestQueueKey(id2) {
          if (id2 === null) {
            throw new Error(`Can't send requests with id null since the response can't be correlated.`);
          }
          return "req-" + id2.toString();
        }
        function createResponseQueueKey(id2) {
          if (id2 === null) {
            return "res-unknown-" + (++unknownResponseSquenceNumber).toString();
          } else {
            return "res-" + id2.toString();
          }
        }
        function createNotificationQueueKey() {
          return "not-" + (++notificationSquenceNumber).toString();
        }
        function addMessageToQueue(queue, message) {
          if (messages_1.isRequestMessage(message)) {
            queue.set(createRequestQueueKey(message.id), message);
          } else if (messages_1.isResponseMessage(message)) {
            queue.set(createResponseQueueKey(message.id), message);
          } else {
            queue.set(createNotificationQueueKey(), message);
          }
        }
        function cancelUndispatched(_message) {
          return void 0;
        }
        function isListening() {
          return state === ConnectionState.Listening;
        }
        function isClosed() {
          return state === ConnectionState.Closed;
        }
        function isDisposed() {
          return state === ConnectionState.Disposed;
        }
        function closeHandler() {
          if (state === ConnectionState.New || state === ConnectionState.Listening) {
            state = ConnectionState.Closed;
            closeEmitter.fire(void 0);
          }
        }
        function readErrorHandler(error) {
          errorEmitter.fire([error, void 0, void 0]);
        }
        function writeErrorHandler(data) {
          errorEmitter.fire(data);
        }
        messageReader.onClose(closeHandler);
        messageReader.onError(readErrorHandler);
        messageWriter.onClose(closeHandler);
        messageWriter.onError(writeErrorHandler);
        function triggerMessageQueue() {
          if (timer || messageQueue.size === 0) {
            return;
          }
          timer = ral_1.default().timer.setImmediate(() => {
            timer = void 0;
            processMessageQueue();
          });
        }
        function processMessageQueue() {
          if (messageQueue.size === 0) {
            return;
          }
          const message = messageQueue.shift();
          try {
            if (messages_1.isRequestMessage(message)) {
              handleRequest(message);
            } else if (messages_1.isNotificationMessage(message)) {
              handleNotification(message);
            } else if (messages_1.isResponseMessage(message)) {
              handleResponse(message);
            } else {
              handleInvalidMessage(message);
            }
          } finally {
            triggerMessageQueue();
          }
        }
        const callback = (message) => {
          try {
            if (messages_1.isNotificationMessage(message) && message.method === CancelNotification.type.method) {
              const key = createRequestQueueKey(message.params.id);
              const toCancel = messageQueue.get(key);
              if (messages_1.isRequestMessage(toCancel)) {
                const strategy = options === null || options === void 0 ? void 0 : options.connectionStrategy;
                const response = strategy && strategy.cancelUndispatched ? strategy.cancelUndispatched(toCancel, cancelUndispatched) : cancelUndispatched(toCancel);
                if (response && (response.error !== void 0 || response.result !== void 0)) {
                  messageQueue.delete(key);
                  response.id = toCancel.id;
                  traceSendingResponse(response, message.method, Date.now());
                  messageWriter.write(response);
                  return;
                }
              }
            }
            addMessageToQueue(messageQueue, message);
          } finally {
            triggerMessageQueue();
          }
        };
        function handleRequest(requestMessage) {
          if (isDisposed()) {
            return;
          }
          function reply(resultOrError, method, startTime2) {
            const message = {
              jsonrpc: version,
              id: requestMessage.id
            };
            if (resultOrError instanceof messages_1.ResponseError) {
              message.error = resultOrError.toJson();
            } else {
              message.result = resultOrError === void 0 ? null : resultOrError;
            }
            traceSendingResponse(message, method, startTime2);
            messageWriter.write(message);
          }
          function replyError(error, method, startTime2) {
            const message = {
              jsonrpc: version,
              id: requestMessage.id,
              error: error.toJson()
            };
            traceSendingResponse(message, method, startTime2);
            messageWriter.write(message);
          }
          function replySuccess(result, method, startTime2) {
            if (result === void 0) {
              result = null;
            }
            const message = {
              jsonrpc: version,
              id: requestMessage.id,
              result
            };
            traceSendingResponse(message, method, startTime2);
            messageWriter.write(message);
          }
          traceReceivedRequest(requestMessage);
          const element = requestHandlers[requestMessage.method];
          let type;
          let requestHandler;
          if (element) {
            type = element.type;
            requestHandler = element.handler;
          }
          const startTime = Date.now();
          if (requestHandler || starRequestHandler) {
            const tokenKey = String(requestMessage.id);
            const cancellationSource = cancellationStrategy.receiver.createCancellationTokenSource(tokenKey);
            requestTokens[tokenKey] = cancellationSource;
            try {
              let handlerResult;
              if (requestHandler) {
                if (requestMessage.params === void 0) {
                  if (type !== void 0 && type.numberOfParams !== 0) {
                    replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines ${type.numberOfParams} params but recevied none.`), requestMessage.method, startTime);
                    return;
                  }
                  handlerResult = requestHandler(cancellationSource.token);
                } else if (Array.isArray(requestMessage.params)) {
                  if (type !== void 0 && type.parameterStructures === messages_1.ParameterStructures.byName) {
                    replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines parameters by name but received parameters by position`), requestMessage.method, startTime);
                    return;
                  }
                  handlerResult = requestHandler(...requestMessage.params, cancellationSource.token);
                } else {
                  if (type !== void 0 && type.parameterStructures === messages_1.ParameterStructures.byPosition) {
                    replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines parameters by position but received parameters by name`), requestMessage.method, startTime);
                    return;
                  }
                  handlerResult = requestHandler(requestMessage.params, cancellationSource.token);
                }
              } else if (starRequestHandler) {
                handlerResult = starRequestHandler(requestMessage.method, requestMessage.params, cancellationSource.token);
              }
              const promise = handlerResult;
              if (!handlerResult) {
                delete requestTokens[tokenKey];
                replySuccess(handlerResult, requestMessage.method, startTime);
              } else if (promise.then) {
                promise.then((resultOrError) => {
                  delete requestTokens[tokenKey];
                  reply(resultOrError, requestMessage.method, startTime);
                }, (error) => {
                  delete requestTokens[tokenKey];
                  if (error instanceof messages_1.ResponseError) {
                    replyError(error, requestMessage.method, startTime);
                  } else if (error && Is.string(error.message)) {
                    replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed with message: ${error.message}`), requestMessage.method, startTime);
                  } else {
                    replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed unexpectedly without providing any details.`), requestMessage.method, startTime);
                  }
                });
              } else {
                delete requestTokens[tokenKey];
                reply(handlerResult, requestMessage.method, startTime);
              }
            } catch (error) {
              delete requestTokens[tokenKey];
              if (error instanceof messages_1.ResponseError) {
                reply(error, requestMessage.method, startTime);
              } else if (error && Is.string(error.message)) {
                replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed with message: ${error.message}`), requestMessage.method, startTime);
              } else {
                replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed unexpectedly without providing any details.`), requestMessage.method, startTime);
              }
            }
          } else {
            replyError(new messages_1.ResponseError(messages_1.ErrorCodes.MethodNotFound, `Unhandled method ${requestMessage.method}`), requestMessage.method, startTime);
          }
        }
        function handleResponse(responseMessage) {
          if (isDisposed()) {
            return;
          }
          if (responseMessage.id === null) {
            if (responseMessage.error) {
              logger.error(`Received response message without id: Error is: 
${JSON.stringify(responseMessage.error, void 0, 4)}`);
            } else {
              logger.error(`Received response message without id. No further error information provided.`);
            }
          } else {
            const key = String(responseMessage.id);
            const responsePromise = responsePromises[key];
            traceReceivedResponse(responseMessage, responsePromise);
            if (responsePromise) {
              delete responsePromises[key];
              try {
                if (responseMessage.error) {
                  const error = responseMessage.error;
                  responsePromise.reject(new messages_1.ResponseError(error.code, error.message, error.data));
                } else if (responseMessage.result !== void 0) {
                  responsePromise.resolve(responseMessage.result);
                } else {
                  throw new Error("Should never happen.");
                }
              } catch (error) {
                if (error.message) {
                  logger.error(`Response handler '${responsePromise.method}' failed with message: ${error.message}`);
                } else {
                  logger.error(`Response handler '${responsePromise.method}' failed unexpectedly.`);
                }
              }
            }
          }
        }
        function handleNotification(message) {
          if (isDisposed()) {
            return;
          }
          let type = void 0;
          let notificationHandler;
          if (message.method === CancelNotification.type.method) {
            notificationHandler = (params) => {
              const id2 = params.id;
              const source = requestTokens[String(id2)];
              if (source) {
                source.cancel();
              }
            };
          } else {
            const element = notificationHandlers[message.method];
            if (element) {
              notificationHandler = element.handler;
              type = element.type;
            }
          }
          if (notificationHandler || starNotificationHandler) {
            try {
              traceReceivedNotification(message);
              if (notificationHandler) {
                if (message.params === void 0) {
                  if (type !== void 0) {
                    if (type.numberOfParams !== 0 && type.parameterStructures !== messages_1.ParameterStructures.byName) {
                      logger.error(`Notification ${message.method} defines ${type.numberOfParams} params but recevied none.`);
                    }
                  }
                  notificationHandler();
                } else if (Array.isArray(message.params)) {
                  if (type !== void 0) {
                    if (type.parameterStructures === messages_1.ParameterStructures.byName) {
                      logger.error(`Notification ${message.method} defines parameters by name but received parameters by position`);
                    }
                    if (type.numberOfParams !== message.params.length) {
                      logger.error(`Notification ${message.method} defines ${type.numberOfParams} params but received ${message.params.length} argumennts`);
                    }
                  }
                  notificationHandler(...message.params);
                } else {
                  if (type !== void 0 && type.parameterStructures === messages_1.ParameterStructures.byPosition) {
                    logger.error(`Notification ${message.method} defines parameters by position but received parameters by name`);
                  }
                  notificationHandler(message.params);
                }
              } else if (starNotificationHandler) {
                starNotificationHandler(message.method, message.params);
              }
            } catch (error) {
              if (error.message) {
                logger.error(`Notification handler '${message.method}' failed with message: ${error.message}`);
              } else {
                logger.error(`Notification handler '${message.method}' failed unexpectedly.`);
              }
            }
          } else {
            unhandledNotificationEmitter.fire(message);
          }
        }
        function handleInvalidMessage(message) {
          if (!message) {
            logger.error("Received empty message.");
            return;
          }
          logger.error(`Received message which is neither a response nor a notification message:
${JSON.stringify(message, null, 4)}`);
          const responseMessage = message;
          if (Is.string(responseMessage.id) || Is.number(responseMessage.id)) {
            const key = String(responseMessage.id);
            const responseHandler = responsePromises[key];
            if (responseHandler) {
              responseHandler.reject(new Error("The received response has neither a result nor an error property."));
            }
          }
        }
        function traceSendingRequest(message) {
          if (trace === Trace.Off || !tracer) {
            return;
          }
          if (traceFormat === TraceFormat.Text) {
            let data = void 0;
            if (trace === Trace.Verbose && message.params) {
              data = `Params: ${JSON.stringify(message.params, null, 4)}

`;
            }
            tracer.log(`Sending request '${message.method} - (${message.id})'.`, data);
          } else {
            logLSPMessage("send-request", message);
          }
        }
        function traceSendingNotification(message) {
          if (trace === Trace.Off || !tracer) {
            return;
          }
          if (traceFormat === TraceFormat.Text) {
            let data = void 0;
            if (trace === Trace.Verbose) {
              if (message.params) {
                data = `Params: ${JSON.stringify(message.params, null, 4)}

`;
              } else {
                data = "No parameters provided.\n\n";
              }
            }
            tracer.log(`Sending notification '${message.method}'.`, data);
          } else {
            logLSPMessage("send-notification", message);
          }
        }
        function traceSendingResponse(message, method, startTime) {
          if (trace === Trace.Off || !tracer) {
            return;
          }
          if (traceFormat === TraceFormat.Text) {
            let data = void 0;
            if (trace === Trace.Verbose) {
              if (message.error && message.error.data) {
                data = `Error data: ${JSON.stringify(message.error.data, null, 4)}

`;
              } else {
                if (message.result) {
                  data = `Result: ${JSON.stringify(message.result, null, 4)}

`;
                } else if (message.error === void 0) {
                  data = "No result returned.\n\n";
                }
              }
            }
            tracer.log(`Sending response '${method} - (${message.id})'. Processing request took ${Date.now() - startTime}ms`, data);
          } else {
            logLSPMessage("send-response", message);
          }
        }
        function traceReceivedRequest(message) {
          if (trace === Trace.Off || !tracer) {
            return;
          }
          if (traceFormat === TraceFormat.Text) {
            let data = void 0;
            if (trace === Trace.Verbose && message.params) {
              data = `Params: ${JSON.stringify(message.params, null, 4)}

`;
            }
            tracer.log(`Received request '${message.method} - (${message.id})'.`, data);
          } else {
            logLSPMessage("receive-request", message);
          }
        }
        function traceReceivedNotification(message) {
          if (trace === Trace.Off || !tracer || message.method === LogTraceNotification.type.method) {
            return;
          }
          if (traceFormat === TraceFormat.Text) {
            let data = void 0;
            if (trace === Trace.Verbose) {
              if (message.params) {
                data = `Params: ${JSON.stringify(message.params, null, 4)}

`;
              } else {
                data = "No parameters provided.\n\n";
              }
            }
            tracer.log(`Received notification '${message.method}'.`, data);
          } else {
            logLSPMessage("receive-notification", message);
          }
        }
        function traceReceivedResponse(message, responsePromise) {
          if (trace === Trace.Off || !tracer) {
            return;
          }
          if (traceFormat === TraceFormat.Text) {
            let data = void 0;
            if (trace === Trace.Verbose) {
              if (message.error && message.error.data) {
                data = `Error data: ${JSON.stringify(message.error.data, null, 4)}

`;
              } else {
                if (message.result) {
                  data = `Result: ${JSON.stringify(message.result, null, 4)}

`;
                } else if (message.error === void 0) {
                  data = "No result returned.\n\n";
                }
              }
            }
            if (responsePromise) {
              const error = message.error ? ` Request failed: ${message.error.message} (${message.error.code}).` : "";
              tracer.log(`Received response '${responsePromise.method} - (${message.id})' in ${Date.now() - responsePromise.timerStart}ms.${error}`, data);
            } else {
              tracer.log(`Received response ${message.id} without active response promise.`, data);
            }
          } else {
            logLSPMessage("receive-response", message);
          }
        }
        function logLSPMessage(type, message) {
          if (!tracer || trace === Trace.Off) {
            return;
          }
          const lspMessage = {
            isLSPMessage: true,
            type,
            message,
            timestamp: Date.now()
          };
          tracer.log(lspMessage);
        }
        function throwIfClosedOrDisposed() {
          if (isClosed()) {
            throw new ConnectionError(ConnectionErrors.Closed, "Connection is closed.");
          }
          if (isDisposed()) {
            throw new ConnectionError(ConnectionErrors.Disposed, "Connection is disposed.");
          }
        }
        function throwIfListening() {
          if (isListening()) {
            throw new ConnectionError(ConnectionErrors.AlreadyListening, "Connection is already listening");
          }
        }
        function throwIfNotListening() {
          if (!isListening()) {
            throw new Error("Call listen() first.");
          }
        }
        function undefinedToNull(param) {
          if (param === void 0) {
            return null;
          } else {
            return param;
          }
        }
        function nullToUndefined(param) {
          if (param === null) {
            return void 0;
          } else {
            return param;
          }
        }
        function isNamedParam(param) {
          return param !== void 0 && param !== null && !Array.isArray(param) && typeof param === "object";
        }
        function computeSingleParam(parameterStructures, param) {
          switch (parameterStructures) {
            case messages_1.ParameterStructures.auto:
              if (isNamedParam(param)) {
                return nullToUndefined(param);
              } else {
                return [undefinedToNull(param)];
              }
              break;
            case messages_1.ParameterStructures.byName:
              if (!isNamedParam(param)) {
                throw new Error(`Recevied parameters by name but param is not an object literal.`);
              }
              return nullToUndefined(param);
            case messages_1.ParameterStructures.byPosition:
              return [undefinedToNull(param)];
            default:
              throw new Error(`Unknown parameter structure ${parameterStructures.toString()}`);
          }
        }
        function computeMessageParams(type, params) {
          let result;
          const numberOfParams = type.numberOfParams;
          switch (numberOfParams) {
            case 0:
              result = void 0;
              break;
            case 1:
              result = computeSingleParam(type.parameterStructures, params[0]);
              break;
            default:
              result = [];
              for (let i = 0; i < params.length && i < numberOfParams; i++) {
                result.push(undefinedToNull(params[i]));
              }
              if (params.length < numberOfParams) {
                for (let i = params.length; i < numberOfParams; i++) {
                  result.push(null);
                }
              }
              break;
          }
          return result;
        }
        const connection = {
          sendNotification: (type, ...args) => {
            throwIfClosedOrDisposed();
            let method;
            let messageParams;
            if (Is.string(type)) {
              method = type;
              const first = args[0];
              let paramStart = 0;
              let parameterStructures = messages_1.ParameterStructures.auto;
              if (messages_1.ParameterStructures.is(first)) {
                paramStart = 1;
                parameterStructures = first;
              }
              let paramEnd = args.length;
              const numberOfParams = paramEnd - paramStart;
              switch (numberOfParams) {
                case 0:
                  messageParams = void 0;
                  break;
                case 1:
                  messageParams = computeSingleParam(parameterStructures, args[paramStart]);
                  break;
                default:
                  if (parameterStructures === messages_1.ParameterStructures.byName) {
                    throw new Error(`Recevied ${numberOfParams} parameters for 'by Name' notification parameter structure.`);
                  }
                  messageParams = args.slice(paramStart, paramEnd).map((value) => undefinedToNull(value));
                  break;
              }
            } else {
              const params = args;
              method = type.method;
              messageParams = computeMessageParams(type, params);
            }
            const notificationMessage = {
              jsonrpc: version,
              method,
              params: messageParams
            };
            traceSendingNotification(notificationMessage);
            messageWriter.write(notificationMessage);
          },
          onNotification: (type, handler) => {
            throwIfClosedOrDisposed();
            let method;
            if (Is.func(type)) {
              starNotificationHandler = type;
            } else if (handler) {
              if (Is.string(type)) {
                method = type;
                notificationHandlers[type] = { type: void 0, handler };
              } else {
                method = type.method;
                notificationHandlers[type.method] = { type, handler };
              }
            }
            return {
              dispose: () => {
                if (method !== void 0) {
                  delete notificationHandlers[method];
                } else {
                  starNotificationHandler = void 0;
                }
              }
            };
          },
          onProgress: (_type, token, handler) => {
            if (progressHandlers.has(token)) {
              throw new Error(`Progress handler for token ${token} already registered`);
            }
            progressHandlers.set(token, handler);
            return {
              dispose: () => {
                progressHandlers.delete(token);
              }
            };
          },
          sendProgress: (_type, token, value) => {
            connection.sendNotification(ProgressNotification.type, { token, value });
          },
          onUnhandledProgress: unhandledProgressEmitter.event,
          sendRequest: (type, ...args) => {
            throwIfClosedOrDisposed();
            throwIfNotListening();
            let method;
            let messageParams;
            let token = void 0;
            if (Is.string(type)) {
              method = type;
              const first = args[0];
              const last = args[args.length - 1];
              let paramStart = 0;
              let parameterStructures = messages_1.ParameterStructures.auto;
              if (messages_1.ParameterStructures.is(first)) {
                paramStart = 1;
                parameterStructures = first;
              }
              let paramEnd = args.length;
              if (cancellation_1.CancellationToken.is(last)) {
                paramEnd = paramEnd - 1;
                token = last;
              }
              const numberOfParams = paramEnd - paramStart;
              switch (numberOfParams) {
                case 0:
                  messageParams = void 0;
                  break;
                case 1:
                  messageParams = computeSingleParam(parameterStructures, args[paramStart]);
                  break;
                default:
                  if (parameterStructures === messages_1.ParameterStructures.byName) {
                    throw new Error(`Recevied ${numberOfParams} parameters for 'by Name' request parameter structure.`);
                  }
                  messageParams = args.slice(paramStart, paramEnd).map((value) => undefinedToNull(value));
                  break;
              }
            } else {
              const params = args;
              method = type.method;
              messageParams = computeMessageParams(type, params);
              const numberOfParams = type.numberOfParams;
              token = cancellation_1.CancellationToken.is(params[numberOfParams]) ? params[numberOfParams] : void 0;
            }
            const id2 = sequenceNumber++;
            let disposable;
            if (token) {
              disposable = token.onCancellationRequested(() => {
                cancellationStrategy.sender.sendCancellation(connection, id2);
              });
            }
            const result = new Promise((resolve2, reject) => {
              const requestMessage = {
                jsonrpc: version,
                id: id2,
                method,
                params: messageParams
              };
              const resolveWithCleanup = (r) => {
                resolve2(r);
                cancellationStrategy.sender.cleanup(id2);
                disposable === null || disposable === void 0 ? void 0 : disposable.dispose();
              };
              const rejectWithCleanup = (r) => {
                reject(r);
                cancellationStrategy.sender.cleanup(id2);
                disposable === null || disposable === void 0 ? void 0 : disposable.dispose();
              };
              let responsePromise = { method, timerStart: Date.now(), resolve: resolveWithCleanup, reject: rejectWithCleanup };
              traceSendingRequest(requestMessage);
              try {
                messageWriter.write(requestMessage);
              } catch (e) {
                responsePromise.reject(new messages_1.ResponseError(messages_1.ErrorCodes.MessageWriteError, e.message ? e.message : "Unknown reason"));
                responsePromise = null;
              }
              if (responsePromise) {
                responsePromises[String(id2)] = responsePromise;
              }
            });
            return result;
          },
          onRequest: (type, handler) => {
            throwIfClosedOrDisposed();
            let method = null;
            if (StarRequestHandler.is(type)) {
              method = void 0;
              starRequestHandler = type;
            } else if (Is.string(type)) {
              method = null;
              if (handler !== void 0) {
                method = type;
                requestHandlers[type] = { handler, type: void 0 };
              }
            } else {
              if (handler !== void 0) {
                method = type.method;
                requestHandlers[type.method] = { type, handler };
              }
            }
            return {
              dispose: () => {
                if (method === null) {
                  return;
                }
                if (method !== void 0) {
                  delete requestHandlers[method];
                } else {
                  starRequestHandler = void 0;
                }
              }
            };
          },
          trace: (_value, _tracer, sendNotificationOrTraceOptions) => {
            let _sendNotification = false;
            let _traceFormat = TraceFormat.Text;
            if (sendNotificationOrTraceOptions !== void 0) {
              if (Is.boolean(sendNotificationOrTraceOptions)) {
                _sendNotification = sendNotificationOrTraceOptions;
              } else {
                _sendNotification = sendNotificationOrTraceOptions.sendNotification || false;
                _traceFormat = sendNotificationOrTraceOptions.traceFormat || TraceFormat.Text;
              }
            }
            trace = _value;
            traceFormat = _traceFormat;
            if (trace === Trace.Off) {
              tracer = void 0;
            } else {
              tracer = _tracer;
            }
            if (_sendNotification && !isClosed() && !isDisposed()) {
              connection.sendNotification(SetTraceNotification.type, { value: Trace.toString(_value) });
            }
          },
          onError: errorEmitter.event,
          onClose: closeEmitter.event,
          onUnhandledNotification: unhandledNotificationEmitter.event,
          onDispose: disposeEmitter.event,
          end: () => {
            messageWriter.end();
          },
          dispose: () => {
            if (isDisposed()) {
              return;
            }
            state = ConnectionState.Disposed;
            disposeEmitter.fire(void 0);
            const error = new Error("Connection got disposed.");
            Object.keys(responsePromises).forEach((key) => {
              responsePromises[key].reject(error);
            });
            responsePromises = /* @__PURE__ */ Object.create(null);
            requestTokens = /* @__PURE__ */ Object.create(null);
            messageQueue = new linkedMap_1.LinkedMap();
            if (Is.func(messageWriter.dispose)) {
              messageWriter.dispose();
            }
            if (Is.func(messageReader.dispose)) {
              messageReader.dispose();
            }
          },
          listen: () => {
            throwIfClosedOrDisposed();
            throwIfListening();
            state = ConnectionState.Listening;
            messageReader.listen(callback);
          },
          inspect: () => {
            ral_1.default().console.log("inspect");
          }
        };
        connection.onNotification(LogTraceNotification.type, (params) => {
          if (trace === Trace.Off || !tracer) {
            return;
          }
          tracer.log(params.message, trace === Trace.Verbose ? params.verbose : void 0);
        });
        connection.onNotification(ProgressNotification.type, (params) => {
          const handler = progressHandlers.get(params.token);
          if (handler) {
            handler(params.value);
          } else {
            unhandledProgressEmitter.fire(params);
          }
        });
        return connection;
      }
      exports.createMessageConnection = createMessageConnection;
    }
  });

  // node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/common/api.js
  var require_api = __commonJS({
    "node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/common/api.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.CancellationSenderStrategy = exports.CancellationReceiverStrategy = exports.ConnectionError = exports.ConnectionErrors = exports.LogTraceNotification = exports.SetTraceNotification = exports.TraceFormat = exports.Trace = exports.ProgressType = exports.createMessageConnection = exports.NullLogger = exports.ConnectionOptions = exports.ConnectionStrategy = exports.WriteableStreamMessageWriter = exports.AbstractMessageWriter = exports.MessageWriter = exports.ReadableStreamMessageReader = exports.AbstractMessageReader = exports.MessageReader = exports.CancellationToken = exports.CancellationTokenSource = exports.Emitter = exports.Event = exports.Disposable = exports.ParameterStructures = exports.NotificationType9 = exports.NotificationType8 = exports.NotificationType7 = exports.NotificationType6 = exports.NotificationType5 = exports.NotificationType4 = exports.NotificationType3 = exports.NotificationType2 = exports.NotificationType1 = exports.NotificationType0 = exports.NotificationType = exports.ErrorCodes = exports.ResponseError = exports.RequestType9 = exports.RequestType8 = exports.RequestType7 = exports.RequestType6 = exports.RequestType5 = exports.RequestType4 = exports.RequestType3 = exports.RequestType2 = exports.RequestType1 = exports.RequestType0 = exports.RequestType = exports.RAL = void 0;
      exports.CancellationStrategy = void 0;
      var messages_1 = require_messages();
      Object.defineProperty(exports, "RequestType", { enumerable: true, get: function() {
        return messages_1.RequestType;
      } });
      Object.defineProperty(exports, "RequestType0", { enumerable: true, get: function() {
        return messages_1.RequestType0;
      } });
      Object.defineProperty(exports, "RequestType1", { enumerable: true, get: function() {
        return messages_1.RequestType1;
      } });
      Object.defineProperty(exports, "RequestType2", { enumerable: true, get: function() {
        return messages_1.RequestType2;
      } });
      Object.defineProperty(exports, "RequestType3", { enumerable: true, get: function() {
        return messages_1.RequestType3;
      } });
      Object.defineProperty(exports, "RequestType4", { enumerable: true, get: function() {
        return messages_1.RequestType4;
      } });
      Object.defineProperty(exports, "RequestType5", { enumerable: true, get: function() {
        return messages_1.RequestType5;
      } });
      Object.defineProperty(exports, "RequestType6", { enumerable: true, get: function() {
        return messages_1.RequestType6;
      } });
      Object.defineProperty(exports, "RequestType7", { enumerable: true, get: function() {
        return messages_1.RequestType7;
      } });
      Object.defineProperty(exports, "RequestType8", { enumerable: true, get: function() {
        return messages_1.RequestType8;
      } });
      Object.defineProperty(exports, "RequestType9", { enumerable: true, get: function() {
        return messages_1.RequestType9;
      } });
      Object.defineProperty(exports, "ResponseError", { enumerable: true, get: function() {
        return messages_1.ResponseError;
      } });
      Object.defineProperty(exports, "ErrorCodes", { enumerable: true, get: function() {
        return messages_1.ErrorCodes;
      } });
      Object.defineProperty(exports, "NotificationType", { enumerable: true, get: function() {
        return messages_1.NotificationType;
      } });
      Object.defineProperty(exports, "NotificationType0", { enumerable: true, get: function() {
        return messages_1.NotificationType0;
      } });
      Object.defineProperty(exports, "NotificationType1", { enumerable: true, get: function() {
        return messages_1.NotificationType1;
      } });
      Object.defineProperty(exports, "NotificationType2", { enumerable: true, get: function() {
        return messages_1.NotificationType2;
      } });
      Object.defineProperty(exports, "NotificationType3", { enumerable: true, get: function() {
        return messages_1.NotificationType3;
      } });
      Object.defineProperty(exports, "NotificationType4", { enumerable: true, get: function() {
        return messages_1.NotificationType4;
      } });
      Object.defineProperty(exports, "NotificationType5", { enumerable: true, get: function() {
        return messages_1.NotificationType5;
      } });
      Object.defineProperty(exports, "NotificationType6", { enumerable: true, get: function() {
        return messages_1.NotificationType6;
      } });
      Object.defineProperty(exports, "NotificationType7", { enumerable: true, get: function() {
        return messages_1.NotificationType7;
      } });
      Object.defineProperty(exports, "NotificationType8", { enumerable: true, get: function() {
        return messages_1.NotificationType8;
      } });
      Object.defineProperty(exports, "NotificationType9", { enumerable: true, get: function() {
        return messages_1.NotificationType9;
      } });
      Object.defineProperty(exports, "ParameterStructures", { enumerable: true, get: function() {
        return messages_1.ParameterStructures;
      } });
      var disposable_1 = require_disposable();
      Object.defineProperty(exports, "Disposable", { enumerable: true, get: function() {
        return disposable_1.Disposable;
      } });
      var events_1 = require_events();
      Object.defineProperty(exports, "Event", { enumerable: true, get: function() {
        return events_1.Event;
      } });
      Object.defineProperty(exports, "Emitter", { enumerable: true, get: function() {
        return events_1.Emitter;
      } });
      var cancellation_1 = require_cancellation();
      Object.defineProperty(exports, "CancellationTokenSource", { enumerable: true, get: function() {
        return cancellation_1.CancellationTokenSource;
      } });
      Object.defineProperty(exports, "CancellationToken", { enumerable: true, get: function() {
        return cancellation_1.CancellationToken;
      } });
      var messageReader_1 = require_messageReader();
      Object.defineProperty(exports, "MessageReader", { enumerable: true, get: function() {
        return messageReader_1.MessageReader;
      } });
      Object.defineProperty(exports, "AbstractMessageReader", { enumerable: true, get: function() {
        return messageReader_1.AbstractMessageReader;
      } });
      Object.defineProperty(exports, "ReadableStreamMessageReader", { enumerable: true, get: function() {
        return messageReader_1.ReadableStreamMessageReader;
      } });
      var messageWriter_1 = require_messageWriter();
      Object.defineProperty(exports, "MessageWriter", { enumerable: true, get: function() {
        return messageWriter_1.MessageWriter;
      } });
      Object.defineProperty(exports, "AbstractMessageWriter", { enumerable: true, get: function() {
        return messageWriter_1.AbstractMessageWriter;
      } });
      Object.defineProperty(exports, "WriteableStreamMessageWriter", { enumerable: true, get: function() {
        return messageWriter_1.WriteableStreamMessageWriter;
      } });
      var connection_1 = require_connection();
      Object.defineProperty(exports, "ConnectionStrategy", { enumerable: true, get: function() {
        return connection_1.ConnectionStrategy;
      } });
      Object.defineProperty(exports, "ConnectionOptions", { enumerable: true, get: function() {
        return connection_1.ConnectionOptions;
      } });
      Object.defineProperty(exports, "NullLogger", { enumerable: true, get: function() {
        return connection_1.NullLogger;
      } });
      Object.defineProperty(exports, "createMessageConnection", { enumerable: true, get: function() {
        return connection_1.createMessageConnection;
      } });
      Object.defineProperty(exports, "ProgressType", { enumerable: true, get: function() {
        return connection_1.ProgressType;
      } });
      Object.defineProperty(exports, "Trace", { enumerable: true, get: function() {
        return connection_1.Trace;
      } });
      Object.defineProperty(exports, "TraceFormat", { enumerable: true, get: function() {
        return connection_1.TraceFormat;
      } });
      Object.defineProperty(exports, "SetTraceNotification", { enumerable: true, get: function() {
        return connection_1.SetTraceNotification;
      } });
      Object.defineProperty(exports, "LogTraceNotification", { enumerable: true, get: function() {
        return connection_1.LogTraceNotification;
      } });
      Object.defineProperty(exports, "ConnectionErrors", { enumerable: true, get: function() {
        return connection_1.ConnectionErrors;
      } });
      Object.defineProperty(exports, "ConnectionError", { enumerable: true, get: function() {
        return connection_1.ConnectionError;
      } });
      Object.defineProperty(exports, "CancellationReceiverStrategy", { enumerable: true, get: function() {
        return connection_1.CancellationReceiverStrategy;
      } });
      Object.defineProperty(exports, "CancellationSenderStrategy", { enumerable: true, get: function() {
        return connection_1.CancellationSenderStrategy;
      } });
      Object.defineProperty(exports, "CancellationStrategy", { enumerable: true, get: function() {
        return connection_1.CancellationStrategy;
      } });
      var ral_1 = require_ral();
      exports.RAL = ral_1.default;
    }
  });

  // node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/browser/main.js
  var require_main = __commonJS({
    "node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/lib/browser/main.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
            __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.createMessageConnection = exports.BrowserMessageWriter = exports.BrowserMessageReader = void 0;
      var ril_1 = require_ril();
      ril_1.default.install();
      var api_1 = require_api();
      __exportStar(require_api(), exports);
      var BrowserMessageReader2 = class extends api_1.AbstractMessageReader {
        constructor(context) {
          super();
          this._onData = new api_1.Emitter();
          this._messageListener = (event) => {
            this._onData.fire(event.data);
          };
          context.addEventListener("error", (event) => this.fireError(event));
          context.onmessage = this._messageListener;
        }
        listen(callback) {
          return this._onData.event(callback);
        }
      };
      exports.BrowserMessageReader = BrowserMessageReader2;
      var BrowserMessageWriter2 = class extends api_1.AbstractMessageWriter {
        constructor(context) {
          super();
          this.context = context;
          this.errorCount = 0;
          context.addEventListener("error", (event) => this.fireError(event));
        }
        write(msg) {
          try {
            this.context.postMessage(msg);
            return Promise.resolve();
          } catch (error) {
            this.handleError(error, msg);
            return Promise.reject(error);
          }
        }
        handleError(error, msg) {
          this.errorCount++;
          this.fireError(error, msg, this.errorCount);
        }
        end() {
        }
      };
      exports.BrowserMessageWriter = BrowserMessageWriter2;
      function createMessageConnection(reader, writer, logger, options) {
        if (logger === void 0) {
          logger = api_1.NullLogger;
        }
        if (api_1.ConnectionStrategy.is(options)) {
          options = { connectionStrategy: options };
        }
        return api_1.createMessageConnection(reader, writer, logger, options);
      }
      exports.createMessageConnection = createMessageConnection;
    }
  });

  // node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/browser.js
  var require_browser = __commonJS({
    "node_modules/.pnpm/vscode-jsonrpc@6.0.0/node_modules/vscode-jsonrpc/browser.js"(exports, module) {
      "use strict";
      module.exports = require_main();
    }
  });

  // node_modules/.pnpm/vscode-languageserver-types@3.16.0/node_modules/vscode-languageserver-types/lib/umd/main.js
  var require_main2 = __commonJS({
    "node_modules/.pnpm/vscode-languageserver-types@3.16.0/node_modules/vscode-languageserver-types/lib/umd/main.js"(exports, module) {
      (function(factory) {
        if (typeof module === "object" && typeof module.exports === "object") {
          var v = factory(__require, exports);
          if (v !== void 0)
            module.exports = v;
        } else if (typeof define === "function" && define.amd) {
          define(["require", "exports"], factory);
        }
      })(function(require2, exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", { value: true });
        exports2.TextDocument = exports2.EOL = exports2.SelectionRange = exports2.DocumentLink = exports2.FormattingOptions = exports2.CodeLens = exports2.CodeAction = exports2.CodeActionContext = exports2.CodeActionKind = exports2.DocumentSymbol = exports2.SymbolInformation = exports2.SymbolTag = exports2.SymbolKind = exports2.DocumentHighlight = exports2.DocumentHighlightKind = exports2.SignatureInformation = exports2.ParameterInformation = exports2.Hover = exports2.MarkedString = exports2.CompletionList = exports2.CompletionItem = exports2.InsertTextMode = exports2.InsertReplaceEdit = exports2.CompletionItemTag = exports2.InsertTextFormat = exports2.CompletionItemKind = exports2.MarkupContent = exports2.MarkupKind = exports2.TextDocumentItem = exports2.OptionalVersionedTextDocumentIdentifier = exports2.VersionedTextDocumentIdentifier = exports2.TextDocumentIdentifier = exports2.WorkspaceChange = exports2.WorkspaceEdit = exports2.DeleteFile = exports2.RenameFile = exports2.CreateFile = exports2.TextDocumentEdit = exports2.AnnotatedTextEdit = exports2.ChangeAnnotationIdentifier = exports2.ChangeAnnotation = exports2.TextEdit = exports2.Command = exports2.Diagnostic = exports2.CodeDescription = exports2.DiagnosticTag = exports2.DiagnosticSeverity = exports2.DiagnosticRelatedInformation = exports2.FoldingRange = exports2.FoldingRangeKind = exports2.ColorPresentation = exports2.ColorInformation = exports2.Color = exports2.LocationLink = exports2.Location = exports2.Range = exports2.Position = exports2.uinteger = exports2.integer = void 0;
        var integer;
        (function(integer2) {
          integer2.MIN_VALUE = -2147483648;
          integer2.MAX_VALUE = 2147483647;
        })(integer = exports2.integer || (exports2.integer = {}));
        var uinteger;
        (function(uinteger2) {
          uinteger2.MIN_VALUE = 0;
          uinteger2.MAX_VALUE = 2147483647;
        })(uinteger = exports2.uinteger || (exports2.uinteger = {}));
        var Position;
        (function(Position2) {
          function create(line, character) {
            if (line === Number.MAX_VALUE) {
              line = uinteger.MAX_VALUE;
            }
            if (character === Number.MAX_VALUE) {
              character = uinteger.MAX_VALUE;
            }
            return { line, character };
          }
          Position2.create = create;
          function is(value) {
            var candidate = value;
            return Is.objectLiteral(candidate) && Is.uinteger(candidate.line) && Is.uinteger(candidate.character);
          }
          Position2.is = is;
        })(Position = exports2.Position || (exports2.Position = {}));
        var Range;
        (function(Range2) {
          function create(one, two, three, four) {
            if (Is.uinteger(one) && Is.uinteger(two) && Is.uinteger(three) && Is.uinteger(four)) {
              return { start: Position.create(one, two), end: Position.create(three, four) };
            } else if (Position.is(one) && Position.is(two)) {
              return { start: one, end: two };
            } else {
              throw new Error("Range#create called with invalid arguments[" + one + ", " + two + ", " + three + ", " + four + "]");
            }
          }
          Range2.create = create;
          function is(value) {
            var candidate = value;
            return Is.objectLiteral(candidate) && Position.is(candidate.start) && Position.is(candidate.end);
          }
          Range2.is = is;
        })(Range = exports2.Range || (exports2.Range = {}));
        var Location;
        (function(Location2) {
          function create(uri, range) {
            return { uri, range };
          }
          Location2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Range.is(candidate.range) && (Is.string(candidate.uri) || Is.undefined(candidate.uri));
          }
          Location2.is = is;
        })(Location = exports2.Location || (exports2.Location = {}));
        var LocationLink;
        (function(LocationLink2) {
          function create(targetUri, targetRange, targetSelectionRange, originSelectionRange) {
            return { targetUri, targetRange, targetSelectionRange, originSelectionRange };
          }
          LocationLink2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Range.is(candidate.targetRange) && Is.string(candidate.targetUri) && (Range.is(candidate.targetSelectionRange) || Is.undefined(candidate.targetSelectionRange)) && (Range.is(candidate.originSelectionRange) || Is.undefined(candidate.originSelectionRange));
          }
          LocationLink2.is = is;
        })(LocationLink = exports2.LocationLink || (exports2.LocationLink = {}));
        var Color;
        (function(Color2) {
          function create(red, green, blue, alpha) {
            return {
              red,
              green,
              blue,
              alpha
            };
          }
          Color2.create = create;
          function is(value) {
            var candidate = value;
            return Is.numberRange(candidate.red, 0, 1) && Is.numberRange(candidate.green, 0, 1) && Is.numberRange(candidate.blue, 0, 1) && Is.numberRange(candidate.alpha, 0, 1);
          }
          Color2.is = is;
        })(Color = exports2.Color || (exports2.Color = {}));
        var ColorInformation;
        (function(ColorInformation2) {
          function create(range, color) {
            return {
              range,
              color
            };
          }
          ColorInformation2.create = create;
          function is(value) {
            var candidate = value;
            return Range.is(candidate.range) && Color.is(candidate.color);
          }
          ColorInformation2.is = is;
        })(ColorInformation = exports2.ColorInformation || (exports2.ColorInformation = {}));
        var ColorPresentation;
        (function(ColorPresentation2) {
          function create(label, textEdit, additionalTextEdits) {
            return {
              label,
              textEdit,
              additionalTextEdits
            };
          }
          ColorPresentation2.create = create;
          function is(value) {
            var candidate = value;
            return Is.string(candidate.label) && (Is.undefined(candidate.textEdit) || TextEdit.is(candidate)) && (Is.undefined(candidate.additionalTextEdits) || Is.typedArray(candidate.additionalTextEdits, TextEdit.is));
          }
          ColorPresentation2.is = is;
        })(ColorPresentation = exports2.ColorPresentation || (exports2.ColorPresentation = {}));
        var FoldingRangeKind;
        (function(FoldingRangeKind2) {
          FoldingRangeKind2["Comment"] = "comment";
          FoldingRangeKind2["Imports"] = "imports";
          FoldingRangeKind2["Region"] = "region";
        })(FoldingRangeKind = exports2.FoldingRangeKind || (exports2.FoldingRangeKind = {}));
        var FoldingRange;
        (function(FoldingRange2) {
          function create(startLine, endLine, startCharacter, endCharacter, kind) {
            var result = {
              startLine,
              endLine
            };
            if (Is.defined(startCharacter)) {
              result.startCharacter = startCharacter;
            }
            if (Is.defined(endCharacter)) {
              result.endCharacter = endCharacter;
            }
            if (Is.defined(kind)) {
              result.kind = kind;
            }
            return result;
          }
          FoldingRange2.create = create;
          function is(value) {
            var candidate = value;
            return Is.uinteger(candidate.startLine) && Is.uinteger(candidate.startLine) && (Is.undefined(candidate.startCharacter) || Is.uinteger(candidate.startCharacter)) && (Is.undefined(candidate.endCharacter) || Is.uinteger(candidate.endCharacter)) && (Is.undefined(candidate.kind) || Is.string(candidate.kind));
          }
          FoldingRange2.is = is;
        })(FoldingRange = exports2.FoldingRange || (exports2.FoldingRange = {}));
        var DiagnosticRelatedInformation;
        (function(DiagnosticRelatedInformation2) {
          function create(location, message) {
            return {
              location,
              message
            };
          }
          DiagnosticRelatedInformation2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Location.is(candidate.location) && Is.string(candidate.message);
          }
          DiagnosticRelatedInformation2.is = is;
        })(DiagnosticRelatedInformation = exports2.DiagnosticRelatedInformation || (exports2.DiagnosticRelatedInformation = {}));
        var DiagnosticSeverity;
        (function(DiagnosticSeverity2) {
          DiagnosticSeverity2.Error = 1;
          DiagnosticSeverity2.Warning = 2;
          DiagnosticSeverity2.Information = 3;
          DiagnosticSeverity2.Hint = 4;
        })(DiagnosticSeverity = exports2.DiagnosticSeverity || (exports2.DiagnosticSeverity = {}));
        var DiagnosticTag;
        (function(DiagnosticTag2) {
          DiagnosticTag2.Unnecessary = 1;
          DiagnosticTag2.Deprecated = 2;
        })(DiagnosticTag = exports2.DiagnosticTag || (exports2.DiagnosticTag = {}));
        var CodeDescription;
        (function(CodeDescription2) {
          function is(value) {
            var candidate = value;
            return candidate !== void 0 && candidate !== null && Is.string(candidate.href);
          }
          CodeDescription2.is = is;
        })(CodeDescription = exports2.CodeDescription || (exports2.CodeDescription = {}));
        var Diagnostic;
        (function(Diagnostic2) {
          function create(range, message, severity, code, source, relatedInformation) {
            var result = { range, message };
            if (Is.defined(severity)) {
              result.severity = severity;
            }
            if (Is.defined(code)) {
              result.code = code;
            }
            if (Is.defined(source)) {
              result.source = source;
            }
            if (Is.defined(relatedInformation)) {
              result.relatedInformation = relatedInformation;
            }
            return result;
          }
          Diagnostic2.create = create;
          function is(value) {
            var _a2;
            var candidate = value;
            return Is.defined(candidate) && Range.is(candidate.range) && Is.string(candidate.message) && (Is.number(candidate.severity) || Is.undefined(candidate.severity)) && (Is.integer(candidate.code) || Is.string(candidate.code) || Is.undefined(candidate.code)) && (Is.undefined(candidate.codeDescription) || Is.string((_a2 = candidate.codeDescription) === null || _a2 === void 0 ? void 0 : _a2.href)) && (Is.string(candidate.source) || Is.undefined(candidate.source)) && (Is.undefined(candidate.relatedInformation) || Is.typedArray(candidate.relatedInformation, DiagnosticRelatedInformation.is));
          }
          Diagnostic2.is = is;
        })(Diagnostic = exports2.Diagnostic || (exports2.Diagnostic = {}));
        var Command;
        (function(Command2) {
          function create(title, command) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
              args[_i - 2] = arguments[_i];
            }
            var result = { title, command };
            if (Is.defined(args) && args.length > 0) {
              result.arguments = args;
            }
            return result;
          }
          Command2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.title) && Is.string(candidate.command);
          }
          Command2.is = is;
        })(Command = exports2.Command || (exports2.Command = {}));
        var TextEdit;
        (function(TextEdit2) {
          function replace(range, newText) {
            return { range, newText };
          }
          TextEdit2.replace = replace;
          function insert(position, newText) {
            return { range: { start: position, end: position }, newText };
          }
          TextEdit2.insert = insert;
          function del2(range) {
            return { range, newText: "" };
          }
          TextEdit2.del = del2;
          function is(value) {
            var candidate = value;
            return Is.objectLiteral(candidate) && Is.string(candidate.newText) && Range.is(candidate.range);
          }
          TextEdit2.is = is;
        })(TextEdit = exports2.TextEdit || (exports2.TextEdit = {}));
        var ChangeAnnotation;
        (function(ChangeAnnotation2) {
          function create(label, needsConfirmation, description) {
            var result = { label };
            if (needsConfirmation !== void 0) {
              result.needsConfirmation = needsConfirmation;
            }
            if (description !== void 0) {
              result.description = description;
            }
            return result;
          }
          ChangeAnnotation2.create = create;
          function is(value) {
            var candidate = value;
            return candidate !== void 0 && Is.objectLiteral(candidate) && Is.string(candidate.label) && (Is.boolean(candidate.needsConfirmation) || candidate.needsConfirmation === void 0) && (Is.string(candidate.description) || candidate.description === void 0);
          }
          ChangeAnnotation2.is = is;
        })(ChangeAnnotation = exports2.ChangeAnnotation || (exports2.ChangeAnnotation = {}));
        var ChangeAnnotationIdentifier;
        (function(ChangeAnnotationIdentifier2) {
          function is(value) {
            var candidate = value;
            return typeof candidate === "string";
          }
          ChangeAnnotationIdentifier2.is = is;
        })(ChangeAnnotationIdentifier = exports2.ChangeAnnotationIdentifier || (exports2.ChangeAnnotationIdentifier = {}));
        var AnnotatedTextEdit;
        (function(AnnotatedTextEdit2) {
          function replace(range, newText, annotation) {
            return { range, newText, annotationId: annotation };
          }
          AnnotatedTextEdit2.replace = replace;
          function insert(position, newText, annotation) {
            return { range: { start: position, end: position }, newText, annotationId: annotation };
          }
          AnnotatedTextEdit2.insert = insert;
          function del2(range, annotation) {
            return { range, newText: "", annotationId: annotation };
          }
          AnnotatedTextEdit2.del = del2;
          function is(value) {
            var candidate = value;
            return TextEdit.is(candidate) && (ChangeAnnotation.is(candidate.annotationId) || ChangeAnnotationIdentifier.is(candidate.annotationId));
          }
          AnnotatedTextEdit2.is = is;
        })(AnnotatedTextEdit = exports2.AnnotatedTextEdit || (exports2.AnnotatedTextEdit = {}));
        var TextDocumentEdit;
        (function(TextDocumentEdit2) {
          function create(textDocument, edits) {
            return { textDocument, edits };
          }
          TextDocumentEdit2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && OptionalVersionedTextDocumentIdentifier.is(candidate.textDocument) && Array.isArray(candidate.edits);
          }
          TextDocumentEdit2.is = is;
        })(TextDocumentEdit = exports2.TextDocumentEdit || (exports2.TextDocumentEdit = {}));
        var CreateFile;
        (function(CreateFile2) {
          function create(uri, options, annotation) {
            var result = {
              kind: "create",
              uri
            };
            if (options !== void 0 && (options.overwrite !== void 0 || options.ignoreIfExists !== void 0)) {
              result.options = options;
            }
            if (annotation !== void 0) {
              result.annotationId = annotation;
            }
            return result;
          }
          CreateFile2.create = create;
          function is(value) {
            var candidate = value;
            return candidate && candidate.kind === "create" && Is.string(candidate.uri) && (candidate.options === void 0 || (candidate.options.overwrite === void 0 || Is.boolean(candidate.options.overwrite)) && (candidate.options.ignoreIfExists === void 0 || Is.boolean(candidate.options.ignoreIfExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
          }
          CreateFile2.is = is;
        })(CreateFile = exports2.CreateFile || (exports2.CreateFile = {}));
        var RenameFile;
        (function(RenameFile2) {
          function create(oldUri, newUri, options, annotation) {
            var result = {
              kind: "rename",
              oldUri,
              newUri
            };
            if (options !== void 0 && (options.overwrite !== void 0 || options.ignoreIfExists !== void 0)) {
              result.options = options;
            }
            if (annotation !== void 0) {
              result.annotationId = annotation;
            }
            return result;
          }
          RenameFile2.create = create;
          function is(value) {
            var candidate = value;
            return candidate && candidate.kind === "rename" && Is.string(candidate.oldUri) && Is.string(candidate.newUri) && (candidate.options === void 0 || (candidate.options.overwrite === void 0 || Is.boolean(candidate.options.overwrite)) && (candidate.options.ignoreIfExists === void 0 || Is.boolean(candidate.options.ignoreIfExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
          }
          RenameFile2.is = is;
        })(RenameFile = exports2.RenameFile || (exports2.RenameFile = {}));
        var DeleteFile;
        (function(DeleteFile2) {
          function create(uri, options, annotation) {
            var result = {
              kind: "delete",
              uri
            };
            if (options !== void 0 && (options.recursive !== void 0 || options.ignoreIfNotExists !== void 0)) {
              result.options = options;
            }
            if (annotation !== void 0) {
              result.annotationId = annotation;
            }
            return result;
          }
          DeleteFile2.create = create;
          function is(value) {
            var candidate = value;
            return candidate && candidate.kind === "delete" && Is.string(candidate.uri) && (candidate.options === void 0 || (candidate.options.recursive === void 0 || Is.boolean(candidate.options.recursive)) && (candidate.options.ignoreIfNotExists === void 0 || Is.boolean(candidate.options.ignoreIfNotExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
          }
          DeleteFile2.is = is;
        })(DeleteFile = exports2.DeleteFile || (exports2.DeleteFile = {}));
        var WorkspaceEdit;
        (function(WorkspaceEdit2) {
          function is(value) {
            var candidate = value;
            return candidate && (candidate.changes !== void 0 || candidate.documentChanges !== void 0) && (candidate.documentChanges === void 0 || candidate.documentChanges.every(function(change) {
              if (Is.string(change.kind)) {
                return CreateFile.is(change) || RenameFile.is(change) || DeleteFile.is(change);
              } else {
                return TextDocumentEdit.is(change);
              }
            }));
          }
          WorkspaceEdit2.is = is;
        })(WorkspaceEdit = exports2.WorkspaceEdit || (exports2.WorkspaceEdit = {}));
        var TextEditChangeImpl = function() {
          function TextEditChangeImpl2(edits, changeAnnotations) {
            this.edits = edits;
            this.changeAnnotations = changeAnnotations;
          }
          TextEditChangeImpl2.prototype.insert = function(position, newText, annotation) {
            var edit;
            var id2;
            if (annotation === void 0) {
              edit = TextEdit.insert(position, newText);
            } else if (ChangeAnnotationIdentifier.is(annotation)) {
              id2 = annotation;
              edit = AnnotatedTextEdit.insert(position, newText, annotation);
            } else {
              this.assertChangeAnnotations(this.changeAnnotations);
              id2 = this.changeAnnotations.manage(annotation);
              edit = AnnotatedTextEdit.insert(position, newText, id2);
            }
            this.edits.push(edit);
            if (id2 !== void 0) {
              return id2;
            }
          };
          TextEditChangeImpl2.prototype.replace = function(range, newText, annotation) {
            var edit;
            var id2;
            if (annotation === void 0) {
              edit = TextEdit.replace(range, newText);
            } else if (ChangeAnnotationIdentifier.is(annotation)) {
              id2 = annotation;
              edit = AnnotatedTextEdit.replace(range, newText, annotation);
            } else {
              this.assertChangeAnnotations(this.changeAnnotations);
              id2 = this.changeAnnotations.manage(annotation);
              edit = AnnotatedTextEdit.replace(range, newText, id2);
            }
            this.edits.push(edit);
            if (id2 !== void 0) {
              return id2;
            }
          };
          TextEditChangeImpl2.prototype.delete = function(range, annotation) {
            var edit;
            var id2;
            if (annotation === void 0) {
              edit = TextEdit.del(range);
            } else if (ChangeAnnotationIdentifier.is(annotation)) {
              id2 = annotation;
              edit = AnnotatedTextEdit.del(range, annotation);
            } else {
              this.assertChangeAnnotations(this.changeAnnotations);
              id2 = this.changeAnnotations.manage(annotation);
              edit = AnnotatedTextEdit.del(range, id2);
            }
            this.edits.push(edit);
            if (id2 !== void 0) {
              return id2;
            }
          };
          TextEditChangeImpl2.prototype.add = function(edit) {
            this.edits.push(edit);
          };
          TextEditChangeImpl2.prototype.all = function() {
            return this.edits;
          };
          TextEditChangeImpl2.prototype.clear = function() {
            this.edits.splice(0, this.edits.length);
          };
          TextEditChangeImpl2.prototype.assertChangeAnnotations = function(value) {
            if (value === void 0) {
              throw new Error("Text edit change is not configured to manage change annotations.");
            }
          };
          return TextEditChangeImpl2;
        }();
        var ChangeAnnotations = function() {
          function ChangeAnnotations2(annotations) {
            this._annotations = annotations === void 0 ? /* @__PURE__ */ Object.create(null) : annotations;
            this._counter = 0;
            this._size = 0;
          }
          ChangeAnnotations2.prototype.all = function() {
            return this._annotations;
          };
          Object.defineProperty(ChangeAnnotations2.prototype, "size", {
            get: function() {
              return this._size;
            },
            enumerable: false,
            configurable: true
          });
          ChangeAnnotations2.prototype.manage = function(idOrAnnotation, annotation) {
            var id2;
            if (ChangeAnnotationIdentifier.is(idOrAnnotation)) {
              id2 = idOrAnnotation;
            } else {
              id2 = this.nextId();
              annotation = idOrAnnotation;
            }
            if (this._annotations[id2] !== void 0) {
              throw new Error("Id " + id2 + " is already in use.");
            }
            if (annotation === void 0) {
              throw new Error("No annotation provided for id " + id2);
            }
            this._annotations[id2] = annotation;
            this._size++;
            return id2;
          };
          ChangeAnnotations2.prototype.nextId = function() {
            this._counter++;
            return this._counter.toString();
          };
          return ChangeAnnotations2;
        }();
        var WorkspaceChange = function() {
          function WorkspaceChange2(workspaceEdit) {
            var _this = this;
            this._textEditChanges = /* @__PURE__ */ Object.create(null);
            if (workspaceEdit !== void 0) {
              this._workspaceEdit = workspaceEdit;
              if (workspaceEdit.documentChanges) {
                this._changeAnnotations = new ChangeAnnotations(workspaceEdit.changeAnnotations);
                workspaceEdit.changeAnnotations = this._changeAnnotations.all();
                workspaceEdit.documentChanges.forEach(function(change) {
                  if (TextDocumentEdit.is(change)) {
                    var textEditChange = new TextEditChangeImpl(change.edits, _this._changeAnnotations);
                    _this._textEditChanges[change.textDocument.uri] = textEditChange;
                  }
                });
              } else if (workspaceEdit.changes) {
                Object.keys(workspaceEdit.changes).forEach(function(key) {
                  var textEditChange = new TextEditChangeImpl(workspaceEdit.changes[key]);
                  _this._textEditChanges[key] = textEditChange;
                });
              }
            } else {
              this._workspaceEdit = {};
            }
          }
          Object.defineProperty(WorkspaceChange2.prototype, "edit", {
            get: function() {
              this.initDocumentChanges();
              if (this._changeAnnotations !== void 0) {
                if (this._changeAnnotations.size === 0) {
                  this._workspaceEdit.changeAnnotations = void 0;
                } else {
                  this._workspaceEdit.changeAnnotations = this._changeAnnotations.all();
                }
              }
              return this._workspaceEdit;
            },
            enumerable: false,
            configurable: true
          });
          WorkspaceChange2.prototype.getTextEditChange = function(key) {
            if (OptionalVersionedTextDocumentIdentifier.is(key)) {
              this.initDocumentChanges();
              if (this._workspaceEdit.documentChanges === void 0) {
                throw new Error("Workspace edit is not configured for document changes.");
              }
              var textDocument = { uri: key.uri, version: key.version };
              var result = this._textEditChanges[textDocument.uri];
              if (!result) {
                var edits = [];
                var textDocumentEdit = {
                  textDocument,
                  edits
                };
                this._workspaceEdit.documentChanges.push(textDocumentEdit);
                result = new TextEditChangeImpl(edits, this._changeAnnotations);
                this._textEditChanges[textDocument.uri] = result;
              }
              return result;
            } else {
              this.initChanges();
              if (this._workspaceEdit.changes === void 0) {
                throw new Error("Workspace edit is not configured for normal text edit changes.");
              }
              var result = this._textEditChanges[key];
              if (!result) {
                var edits = [];
                this._workspaceEdit.changes[key] = edits;
                result = new TextEditChangeImpl(edits);
                this._textEditChanges[key] = result;
              }
              return result;
            }
          };
          WorkspaceChange2.prototype.initDocumentChanges = function() {
            if (this._workspaceEdit.documentChanges === void 0 && this._workspaceEdit.changes === void 0) {
              this._changeAnnotations = new ChangeAnnotations();
              this._workspaceEdit.documentChanges = [];
              this._workspaceEdit.changeAnnotations = this._changeAnnotations.all();
            }
          };
          WorkspaceChange2.prototype.initChanges = function() {
            if (this._workspaceEdit.documentChanges === void 0 && this._workspaceEdit.changes === void 0) {
              this._workspaceEdit.changes = /* @__PURE__ */ Object.create(null);
            }
          };
          WorkspaceChange2.prototype.createFile = function(uri, optionsOrAnnotation, options) {
            this.initDocumentChanges();
            if (this._workspaceEdit.documentChanges === void 0) {
              throw new Error("Workspace edit is not configured for document changes.");
            }
            var annotation;
            if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
              annotation = optionsOrAnnotation;
            } else {
              options = optionsOrAnnotation;
            }
            var operation;
            var id2;
            if (annotation === void 0) {
              operation = CreateFile.create(uri, options);
            } else {
              id2 = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
              operation = CreateFile.create(uri, options, id2);
            }
            this._workspaceEdit.documentChanges.push(operation);
            if (id2 !== void 0) {
              return id2;
            }
          };
          WorkspaceChange2.prototype.renameFile = function(oldUri, newUri, optionsOrAnnotation, options) {
            this.initDocumentChanges();
            if (this._workspaceEdit.documentChanges === void 0) {
              throw new Error("Workspace edit is not configured for document changes.");
            }
            var annotation;
            if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
              annotation = optionsOrAnnotation;
            } else {
              options = optionsOrAnnotation;
            }
            var operation;
            var id2;
            if (annotation === void 0) {
              operation = RenameFile.create(oldUri, newUri, options);
            } else {
              id2 = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
              operation = RenameFile.create(oldUri, newUri, options, id2);
            }
            this._workspaceEdit.documentChanges.push(operation);
            if (id2 !== void 0) {
              return id2;
            }
          };
          WorkspaceChange2.prototype.deleteFile = function(uri, optionsOrAnnotation, options) {
            this.initDocumentChanges();
            if (this._workspaceEdit.documentChanges === void 0) {
              throw new Error("Workspace edit is not configured for document changes.");
            }
            var annotation;
            if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
              annotation = optionsOrAnnotation;
            } else {
              options = optionsOrAnnotation;
            }
            var operation;
            var id2;
            if (annotation === void 0) {
              operation = DeleteFile.create(uri, options);
            } else {
              id2 = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
              operation = DeleteFile.create(uri, options, id2);
            }
            this._workspaceEdit.documentChanges.push(operation);
            if (id2 !== void 0) {
              return id2;
            }
          };
          return WorkspaceChange2;
        }();
        exports2.WorkspaceChange = WorkspaceChange;
        var TextDocumentIdentifier;
        (function(TextDocumentIdentifier2) {
          function create(uri) {
            return { uri };
          }
          TextDocumentIdentifier2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.uri);
          }
          TextDocumentIdentifier2.is = is;
        })(TextDocumentIdentifier = exports2.TextDocumentIdentifier || (exports2.TextDocumentIdentifier = {}));
        var VersionedTextDocumentIdentifier;
        (function(VersionedTextDocumentIdentifier2) {
          function create(uri, version) {
            return { uri, version };
          }
          VersionedTextDocumentIdentifier2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.uri) && Is.integer(candidate.version);
          }
          VersionedTextDocumentIdentifier2.is = is;
        })(VersionedTextDocumentIdentifier = exports2.VersionedTextDocumentIdentifier || (exports2.VersionedTextDocumentIdentifier = {}));
        var OptionalVersionedTextDocumentIdentifier;
        (function(OptionalVersionedTextDocumentIdentifier2) {
          function create(uri, version) {
            return { uri, version };
          }
          OptionalVersionedTextDocumentIdentifier2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.uri) && (candidate.version === null || Is.integer(candidate.version));
          }
          OptionalVersionedTextDocumentIdentifier2.is = is;
        })(OptionalVersionedTextDocumentIdentifier = exports2.OptionalVersionedTextDocumentIdentifier || (exports2.OptionalVersionedTextDocumentIdentifier = {}));
        var TextDocumentItem;
        (function(TextDocumentItem2) {
          function create(uri, languageId, version, text) {
            return { uri, languageId, version, text };
          }
          TextDocumentItem2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.uri) && Is.string(candidate.languageId) && Is.integer(candidate.version) && Is.string(candidate.text);
          }
          TextDocumentItem2.is = is;
        })(TextDocumentItem = exports2.TextDocumentItem || (exports2.TextDocumentItem = {}));
        var MarkupKind;
        (function(MarkupKind2) {
          MarkupKind2.PlainText = "plaintext";
          MarkupKind2.Markdown = "markdown";
        })(MarkupKind = exports2.MarkupKind || (exports2.MarkupKind = {}));
        (function(MarkupKind2) {
          function is(value) {
            var candidate = value;
            return candidate === MarkupKind2.PlainText || candidate === MarkupKind2.Markdown;
          }
          MarkupKind2.is = is;
        })(MarkupKind = exports2.MarkupKind || (exports2.MarkupKind = {}));
        var MarkupContent;
        (function(MarkupContent2) {
          function is(value) {
            var candidate = value;
            return Is.objectLiteral(value) && MarkupKind.is(candidate.kind) && Is.string(candidate.value);
          }
          MarkupContent2.is = is;
        })(MarkupContent = exports2.MarkupContent || (exports2.MarkupContent = {}));
        var CompletionItemKind;
        (function(CompletionItemKind2) {
          CompletionItemKind2.Text = 1;
          CompletionItemKind2.Method = 2;
          CompletionItemKind2.Function = 3;
          CompletionItemKind2.Constructor = 4;
          CompletionItemKind2.Field = 5;
          CompletionItemKind2.Variable = 6;
          CompletionItemKind2.Class = 7;
          CompletionItemKind2.Interface = 8;
          CompletionItemKind2.Module = 9;
          CompletionItemKind2.Property = 10;
          CompletionItemKind2.Unit = 11;
          CompletionItemKind2.Value = 12;
          CompletionItemKind2.Enum = 13;
          CompletionItemKind2.Keyword = 14;
          CompletionItemKind2.Snippet = 15;
          CompletionItemKind2.Color = 16;
          CompletionItemKind2.File = 17;
          CompletionItemKind2.Reference = 18;
          CompletionItemKind2.Folder = 19;
          CompletionItemKind2.EnumMember = 20;
          CompletionItemKind2.Constant = 21;
          CompletionItemKind2.Struct = 22;
          CompletionItemKind2.Event = 23;
          CompletionItemKind2.Operator = 24;
          CompletionItemKind2.TypeParameter = 25;
        })(CompletionItemKind = exports2.CompletionItemKind || (exports2.CompletionItemKind = {}));
        var InsertTextFormat;
        (function(InsertTextFormat2) {
          InsertTextFormat2.PlainText = 1;
          InsertTextFormat2.Snippet = 2;
        })(InsertTextFormat = exports2.InsertTextFormat || (exports2.InsertTextFormat = {}));
        var CompletionItemTag;
        (function(CompletionItemTag2) {
          CompletionItemTag2.Deprecated = 1;
        })(CompletionItemTag = exports2.CompletionItemTag || (exports2.CompletionItemTag = {}));
        var InsertReplaceEdit;
        (function(InsertReplaceEdit2) {
          function create(newText, insert, replace) {
            return { newText, insert, replace };
          }
          InsertReplaceEdit2.create = create;
          function is(value) {
            var candidate = value;
            return candidate && Is.string(candidate.newText) && Range.is(candidate.insert) && Range.is(candidate.replace);
          }
          InsertReplaceEdit2.is = is;
        })(InsertReplaceEdit = exports2.InsertReplaceEdit || (exports2.InsertReplaceEdit = {}));
        var InsertTextMode;
        (function(InsertTextMode2) {
          InsertTextMode2.asIs = 1;
          InsertTextMode2.adjustIndentation = 2;
        })(InsertTextMode = exports2.InsertTextMode || (exports2.InsertTextMode = {}));
        var CompletionItem;
        (function(CompletionItem2) {
          function create(label) {
            return { label };
          }
          CompletionItem2.create = create;
        })(CompletionItem = exports2.CompletionItem || (exports2.CompletionItem = {}));
        var CompletionList;
        (function(CompletionList2) {
          function create(items, isIncomplete) {
            return { items: items ? items : [], isIncomplete: !!isIncomplete };
          }
          CompletionList2.create = create;
        })(CompletionList = exports2.CompletionList || (exports2.CompletionList = {}));
        var MarkedString;
        (function(MarkedString2) {
          function fromPlainText(plainText) {
            return plainText.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&");
          }
          MarkedString2.fromPlainText = fromPlainText;
          function is(value) {
            var candidate = value;
            return Is.string(candidate) || Is.objectLiteral(candidate) && Is.string(candidate.language) && Is.string(candidate.value);
          }
          MarkedString2.is = is;
        })(MarkedString = exports2.MarkedString || (exports2.MarkedString = {}));
        var Hover;
        (function(Hover2) {
          function is(value) {
            var candidate = value;
            return !!candidate && Is.objectLiteral(candidate) && (MarkupContent.is(candidate.contents) || MarkedString.is(candidate.contents) || Is.typedArray(candidate.contents, MarkedString.is)) && (value.range === void 0 || Range.is(value.range));
          }
          Hover2.is = is;
        })(Hover = exports2.Hover || (exports2.Hover = {}));
        var ParameterInformation;
        (function(ParameterInformation2) {
          function create(label, documentation) {
            return documentation ? { label, documentation } : { label };
          }
          ParameterInformation2.create = create;
        })(ParameterInformation = exports2.ParameterInformation || (exports2.ParameterInformation = {}));
        var SignatureInformation;
        (function(SignatureInformation2) {
          function create(label, documentation) {
            var parameters = [];
            for (var _i = 2; _i < arguments.length; _i++) {
              parameters[_i - 2] = arguments[_i];
            }
            var result = { label };
            if (Is.defined(documentation)) {
              result.documentation = documentation;
            }
            if (Is.defined(parameters)) {
              result.parameters = parameters;
            } else {
              result.parameters = [];
            }
            return result;
          }
          SignatureInformation2.create = create;
        })(SignatureInformation = exports2.SignatureInformation || (exports2.SignatureInformation = {}));
        var DocumentHighlightKind;
        (function(DocumentHighlightKind2) {
          DocumentHighlightKind2.Text = 1;
          DocumentHighlightKind2.Read = 2;
          DocumentHighlightKind2.Write = 3;
        })(DocumentHighlightKind = exports2.DocumentHighlightKind || (exports2.DocumentHighlightKind = {}));
        var DocumentHighlight;
        (function(DocumentHighlight2) {
          function create(range, kind) {
            var result = { range };
            if (Is.number(kind)) {
              result.kind = kind;
            }
            return result;
          }
          DocumentHighlight2.create = create;
        })(DocumentHighlight = exports2.DocumentHighlight || (exports2.DocumentHighlight = {}));
        var SymbolKind;
        (function(SymbolKind2) {
          SymbolKind2.File = 1;
          SymbolKind2.Module = 2;
          SymbolKind2.Namespace = 3;
          SymbolKind2.Package = 4;
          SymbolKind2.Class = 5;
          SymbolKind2.Method = 6;
          SymbolKind2.Property = 7;
          SymbolKind2.Field = 8;
          SymbolKind2.Constructor = 9;
          SymbolKind2.Enum = 10;
          SymbolKind2.Interface = 11;
          SymbolKind2.Function = 12;
          SymbolKind2.Variable = 13;
          SymbolKind2.Constant = 14;
          SymbolKind2.String = 15;
          SymbolKind2.Number = 16;
          SymbolKind2.Boolean = 17;
          SymbolKind2.Array = 18;
          SymbolKind2.Object = 19;
          SymbolKind2.Key = 20;
          SymbolKind2.Null = 21;
          SymbolKind2.EnumMember = 22;
          SymbolKind2.Struct = 23;
          SymbolKind2.Event = 24;
          SymbolKind2.Operator = 25;
          SymbolKind2.TypeParameter = 26;
        })(SymbolKind = exports2.SymbolKind || (exports2.SymbolKind = {}));
        var SymbolTag;
        (function(SymbolTag2) {
          SymbolTag2.Deprecated = 1;
        })(SymbolTag = exports2.SymbolTag || (exports2.SymbolTag = {}));
        var SymbolInformation;
        (function(SymbolInformation2) {
          function create(name, kind, range, uri, containerName) {
            var result = {
              name,
              kind,
              location: { uri, range }
            };
            if (containerName) {
              result.containerName = containerName;
            }
            return result;
          }
          SymbolInformation2.create = create;
        })(SymbolInformation = exports2.SymbolInformation || (exports2.SymbolInformation = {}));
        var DocumentSymbol;
        (function(DocumentSymbol2) {
          function create(name, detail, kind, range, selectionRange, children) {
            var result = {
              name,
              detail,
              kind,
              range,
              selectionRange
            };
            if (children !== void 0) {
              result.children = children;
            }
            return result;
          }
          DocumentSymbol2.create = create;
          function is(value) {
            var candidate = value;
            return candidate && Is.string(candidate.name) && Is.number(candidate.kind) && Range.is(candidate.range) && Range.is(candidate.selectionRange) && (candidate.detail === void 0 || Is.string(candidate.detail)) && (candidate.deprecated === void 0 || Is.boolean(candidate.deprecated)) && (candidate.children === void 0 || Array.isArray(candidate.children)) && (candidate.tags === void 0 || Array.isArray(candidate.tags));
          }
          DocumentSymbol2.is = is;
        })(DocumentSymbol = exports2.DocumentSymbol || (exports2.DocumentSymbol = {}));
        var CodeActionKind;
        (function(CodeActionKind2) {
          CodeActionKind2.Empty = "";
          CodeActionKind2.QuickFix = "quickfix";
          CodeActionKind2.Refactor = "refactor";
          CodeActionKind2.RefactorExtract = "refactor.extract";
          CodeActionKind2.RefactorInline = "refactor.inline";
          CodeActionKind2.RefactorRewrite = "refactor.rewrite";
          CodeActionKind2.Source = "source";
          CodeActionKind2.SourceOrganizeImports = "source.organizeImports";
          CodeActionKind2.SourceFixAll = "source.fixAll";
        })(CodeActionKind = exports2.CodeActionKind || (exports2.CodeActionKind = {}));
        var CodeActionContext;
        (function(CodeActionContext2) {
          function create(diagnostics, only) {
            var result = { diagnostics };
            if (only !== void 0 && only !== null) {
              result.only = only;
            }
            return result;
          }
          CodeActionContext2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.typedArray(candidate.diagnostics, Diagnostic.is) && (candidate.only === void 0 || Is.typedArray(candidate.only, Is.string));
          }
          CodeActionContext2.is = is;
        })(CodeActionContext = exports2.CodeActionContext || (exports2.CodeActionContext = {}));
        var CodeAction;
        (function(CodeAction2) {
          function create(title, kindOrCommandOrEdit, kind) {
            var result = { title };
            var checkKind = true;
            if (typeof kindOrCommandOrEdit === "string") {
              checkKind = false;
              result.kind = kindOrCommandOrEdit;
            } else if (Command.is(kindOrCommandOrEdit)) {
              result.command = kindOrCommandOrEdit;
            } else {
              result.edit = kindOrCommandOrEdit;
            }
            if (checkKind && kind !== void 0) {
              result.kind = kind;
            }
            return result;
          }
          CodeAction2.create = create;
          function is(value) {
            var candidate = value;
            return candidate && Is.string(candidate.title) && (candidate.diagnostics === void 0 || Is.typedArray(candidate.diagnostics, Diagnostic.is)) && (candidate.kind === void 0 || Is.string(candidate.kind)) && (candidate.edit !== void 0 || candidate.command !== void 0) && (candidate.command === void 0 || Command.is(candidate.command)) && (candidate.isPreferred === void 0 || Is.boolean(candidate.isPreferred)) && (candidate.edit === void 0 || WorkspaceEdit.is(candidate.edit));
          }
          CodeAction2.is = is;
        })(CodeAction = exports2.CodeAction || (exports2.CodeAction = {}));
        var CodeLens;
        (function(CodeLens2) {
          function create(range, data) {
            var result = { range };
            if (Is.defined(data)) {
              result.data = data;
            }
            return result;
          }
          CodeLens2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Range.is(candidate.range) && (Is.undefined(candidate.command) || Command.is(candidate.command));
          }
          CodeLens2.is = is;
        })(CodeLens = exports2.CodeLens || (exports2.CodeLens = {}));
        var FormattingOptions;
        (function(FormattingOptions2) {
          function create(tabSize, insertSpaces) {
            return { tabSize, insertSpaces };
          }
          FormattingOptions2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.uinteger(candidate.tabSize) && Is.boolean(candidate.insertSpaces);
          }
          FormattingOptions2.is = is;
        })(FormattingOptions = exports2.FormattingOptions || (exports2.FormattingOptions = {}));
        var DocumentLink;
        (function(DocumentLink2) {
          function create(range, target, data) {
            return { range, target, data };
          }
          DocumentLink2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Range.is(candidate.range) && (Is.undefined(candidate.target) || Is.string(candidate.target));
          }
          DocumentLink2.is = is;
        })(DocumentLink = exports2.DocumentLink || (exports2.DocumentLink = {}));
        var SelectionRange;
        (function(SelectionRange2) {
          function create(range, parent) {
            return { range, parent };
          }
          SelectionRange2.create = create;
          function is(value) {
            var candidate = value;
            return candidate !== void 0 && Range.is(candidate.range) && (candidate.parent === void 0 || SelectionRange2.is(candidate.parent));
          }
          SelectionRange2.is = is;
        })(SelectionRange = exports2.SelectionRange || (exports2.SelectionRange = {}));
        exports2.EOL = ["\n", "\r\n", "\r"];
        var TextDocument2;
        (function(TextDocument3) {
          function create(uri, languageId, version, content) {
            return new FullTextDocument2(uri, languageId, version, content);
          }
          TextDocument3.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.uri) && (Is.undefined(candidate.languageId) || Is.string(candidate.languageId)) && Is.uinteger(candidate.lineCount) && Is.func(candidate.getText) && Is.func(candidate.positionAt) && Is.func(candidate.offsetAt) ? true : false;
          }
          TextDocument3.is = is;
          function applyEdits(document, edits) {
            var text = document.getText();
            var sortedEdits = mergeSort2(edits, function(a, b) {
              var diff = a.range.start.line - b.range.start.line;
              if (diff === 0) {
                return a.range.start.character - b.range.start.character;
              }
              return diff;
            });
            var lastModifiedOffset = text.length;
            for (var i = sortedEdits.length - 1; i >= 0; i--) {
              var e = sortedEdits[i];
              var startOffset = document.offsetAt(e.range.start);
              var endOffset = document.offsetAt(e.range.end);
              if (endOffset <= lastModifiedOffset) {
                text = text.substring(0, startOffset) + e.newText + text.substring(endOffset, text.length);
              } else {
                throw new Error("Overlapping edit");
              }
              lastModifiedOffset = startOffset;
            }
            return text;
          }
          TextDocument3.applyEdits = applyEdits;
          function mergeSort2(data, compare) {
            if (data.length <= 1) {
              return data;
            }
            var p = data.length / 2 | 0;
            var left = data.slice(0, p);
            var right = data.slice(p);
            mergeSort2(left, compare);
            mergeSort2(right, compare);
            var leftIdx = 0;
            var rightIdx = 0;
            var i = 0;
            while (leftIdx < left.length && rightIdx < right.length) {
              var ret = compare(left[leftIdx], right[rightIdx]);
              if (ret <= 0) {
                data[i++] = left[leftIdx++];
              } else {
                data[i++] = right[rightIdx++];
              }
            }
            while (leftIdx < left.length) {
              data[i++] = left[leftIdx++];
            }
            while (rightIdx < right.length) {
              data[i++] = right[rightIdx++];
            }
            return data;
          }
        })(TextDocument2 = exports2.TextDocument || (exports2.TextDocument = {}));
        var FullTextDocument2 = function() {
          function FullTextDocument3(uri, languageId, version, content) {
            this._uri = uri;
            this._languageId = languageId;
            this._version = version;
            this._content = content;
            this._lineOffsets = void 0;
          }
          Object.defineProperty(FullTextDocument3.prototype, "uri", {
            get: function() {
              return this._uri;
            },
            enumerable: false,
            configurable: true
          });
          Object.defineProperty(FullTextDocument3.prototype, "languageId", {
            get: function() {
              return this._languageId;
            },
            enumerable: false,
            configurable: true
          });
          Object.defineProperty(FullTextDocument3.prototype, "version", {
            get: function() {
              return this._version;
            },
            enumerable: false,
            configurable: true
          });
          FullTextDocument3.prototype.getText = function(range) {
            if (range) {
              var start = this.offsetAt(range.start);
              var end = this.offsetAt(range.end);
              return this._content.substring(start, end);
            }
            return this._content;
          };
          FullTextDocument3.prototype.update = function(event, version) {
            this._content = event.text;
            this._version = version;
            this._lineOffsets = void 0;
          };
          FullTextDocument3.prototype.getLineOffsets = function() {
            if (this._lineOffsets === void 0) {
              var lineOffsets = [];
              var text = this._content;
              var isLineStart = true;
              for (var i = 0; i < text.length; i++) {
                if (isLineStart) {
                  lineOffsets.push(i);
                  isLineStart = false;
                }
                var ch = text.charAt(i);
                isLineStart = ch === "\r" || ch === "\n";
                if (ch === "\r" && i + 1 < text.length && text.charAt(i + 1) === "\n") {
                  i++;
                }
              }
              if (isLineStart && text.length > 0) {
                lineOffsets.push(text.length);
              }
              this._lineOffsets = lineOffsets;
            }
            return this._lineOffsets;
          };
          FullTextDocument3.prototype.positionAt = function(offset) {
            offset = Math.max(Math.min(offset, this._content.length), 0);
            var lineOffsets = this.getLineOffsets();
            var low = 0, high = lineOffsets.length;
            if (high === 0) {
              return Position.create(0, offset);
            }
            while (low < high) {
              var mid = Math.floor((low + high) / 2);
              if (lineOffsets[mid] > offset) {
                high = mid;
              } else {
                low = mid + 1;
              }
            }
            var line = low - 1;
            return Position.create(line, offset - lineOffsets[line]);
          };
          FullTextDocument3.prototype.offsetAt = function(position) {
            var lineOffsets = this.getLineOffsets();
            if (position.line >= lineOffsets.length) {
              return this._content.length;
            } else if (position.line < 0) {
              return 0;
            }
            var lineOffset = lineOffsets[position.line];
            var nextLineOffset = position.line + 1 < lineOffsets.length ? lineOffsets[position.line + 1] : this._content.length;
            return Math.max(Math.min(lineOffset + position.character, nextLineOffset), lineOffset);
          };
          Object.defineProperty(FullTextDocument3.prototype, "lineCount", {
            get: function() {
              return this.getLineOffsets().length;
            },
            enumerable: false,
            configurable: true
          });
          return FullTextDocument3;
        }();
        var Is;
        (function(Is2) {
          var toString = Object.prototype.toString;
          function defined(value) {
            return typeof value !== "undefined";
          }
          Is2.defined = defined;
          function undefined2(value) {
            return typeof value === "undefined";
          }
          Is2.undefined = undefined2;
          function boolean(value) {
            return value === true || value === false;
          }
          Is2.boolean = boolean;
          function string(value) {
            return toString.call(value) === "[object String]";
          }
          Is2.string = string;
          function number(value) {
            return toString.call(value) === "[object Number]";
          }
          Is2.number = number;
          function numberRange(value, min, max) {
            return toString.call(value) === "[object Number]" && min <= value && value <= max;
          }
          Is2.numberRange = numberRange;
          function integer2(value) {
            return toString.call(value) === "[object Number]" && -2147483648 <= value && value <= 2147483647;
          }
          Is2.integer = integer2;
          function uinteger2(value) {
            return toString.call(value) === "[object Number]" && 0 <= value && value <= 2147483647;
          }
          Is2.uinteger = uinteger2;
          function func(value) {
            return toString.call(value) === "[object Function]";
          }
          Is2.func = func;
          function objectLiteral(value) {
            return value !== null && typeof value === "object";
          }
          Is2.objectLiteral = objectLiteral;
          function typedArray(value, check) {
            return Array.isArray(value) && value.every(check);
          }
          Is2.typedArray = typedArray;
        })(Is || (Is = {}));
      });
    }
  });

  // node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/messages.js
  var require_messages2 = __commonJS({
    "node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/messages.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ProtocolNotificationType = exports.ProtocolNotificationType0 = exports.ProtocolRequestType = exports.ProtocolRequestType0 = exports.RegistrationType = void 0;
      var vscode_jsonrpc_1 = require_main();
      var RegistrationType = class {
        constructor(method) {
          this.method = method;
        }
      };
      exports.RegistrationType = RegistrationType;
      var ProtocolRequestType0 = class extends vscode_jsonrpc_1.RequestType0 {
        constructor(method) {
          super(method);
        }
      };
      exports.ProtocolRequestType0 = ProtocolRequestType0;
      var ProtocolRequestType = class extends vscode_jsonrpc_1.RequestType {
        constructor(method) {
          super(method, vscode_jsonrpc_1.ParameterStructures.byName);
        }
      };
      exports.ProtocolRequestType = ProtocolRequestType;
      var ProtocolNotificationType0 = class extends vscode_jsonrpc_1.NotificationType0 {
        constructor(method) {
          super(method);
        }
      };
      exports.ProtocolNotificationType0 = ProtocolNotificationType0;
      var ProtocolNotificationType = class extends vscode_jsonrpc_1.NotificationType {
        constructor(method) {
          super(method, vscode_jsonrpc_1.ParameterStructures.byName);
        }
      };
      exports.ProtocolNotificationType = ProtocolNotificationType;
    }
  });

  // node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/utils/is.js
  var require_is2 = __commonJS({
    "node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/utils/is.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.objectLiteral = exports.typedArray = exports.stringArray = exports.array = exports.func = exports.error = exports.number = exports.string = exports.boolean = void 0;
      function boolean(value) {
        return value === true || value === false;
      }
      exports.boolean = boolean;
      function string(value) {
        return typeof value === "string" || value instanceof String;
      }
      exports.string = string;
      function number(value) {
        return typeof value === "number" || value instanceof Number;
      }
      exports.number = number;
      function error(value) {
        return value instanceof Error;
      }
      exports.error = error;
      function func(value) {
        return typeof value === "function";
      }
      exports.func = func;
      function array(value) {
        return Array.isArray(value);
      }
      exports.array = array;
      function stringArray(value) {
        return array(value) && value.every((elem) => string(elem));
      }
      exports.stringArray = stringArray;
      function typedArray(value, check) {
        return Array.isArray(value) && value.every(check);
      }
      exports.typedArray = typedArray;
      function objectLiteral(value) {
        return value !== null && typeof value === "object";
      }
      exports.objectLiteral = objectLiteral;
    }
  });

  // node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.implementation.js
  var require_protocol_implementation = __commonJS({
    "node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.implementation.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ImplementationRequest = void 0;
      var messages_1 = require_messages2();
      var ImplementationRequest;
      (function(ImplementationRequest2) {
        ImplementationRequest2.method = "textDocument/implementation";
        ImplementationRequest2.type = new messages_1.ProtocolRequestType(ImplementationRequest2.method);
      })(ImplementationRequest = exports.ImplementationRequest || (exports.ImplementationRequest = {}));
    }
  });

  // node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.typeDefinition.js
  var require_protocol_typeDefinition = __commonJS({
    "node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.typeDefinition.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.TypeDefinitionRequest = void 0;
      var messages_1 = require_messages2();
      var TypeDefinitionRequest;
      (function(TypeDefinitionRequest2) {
        TypeDefinitionRequest2.method = "textDocument/typeDefinition";
        TypeDefinitionRequest2.type = new messages_1.ProtocolRequestType(TypeDefinitionRequest2.method);
      })(TypeDefinitionRequest = exports.TypeDefinitionRequest || (exports.TypeDefinitionRequest = {}));
    }
  });

  // node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.workspaceFolders.js
  var require_protocol_workspaceFolders = __commonJS({
    "node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.workspaceFolders.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.DidChangeWorkspaceFoldersNotification = exports.WorkspaceFoldersRequest = void 0;
      var messages_1 = require_messages2();
      var WorkspaceFoldersRequest;
      (function(WorkspaceFoldersRequest2) {
        WorkspaceFoldersRequest2.type = new messages_1.ProtocolRequestType0("workspace/workspaceFolders");
      })(WorkspaceFoldersRequest = exports.WorkspaceFoldersRequest || (exports.WorkspaceFoldersRequest = {}));
      var DidChangeWorkspaceFoldersNotification;
      (function(DidChangeWorkspaceFoldersNotification2) {
        DidChangeWorkspaceFoldersNotification2.type = new messages_1.ProtocolNotificationType("workspace/didChangeWorkspaceFolders");
      })(DidChangeWorkspaceFoldersNotification = exports.DidChangeWorkspaceFoldersNotification || (exports.DidChangeWorkspaceFoldersNotification = {}));
    }
  });

  // node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.configuration.js
  var require_protocol_configuration = __commonJS({
    "node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.configuration.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ConfigurationRequest = void 0;
      var messages_1 = require_messages2();
      var ConfigurationRequest;
      (function(ConfigurationRequest2) {
        ConfigurationRequest2.type = new messages_1.ProtocolRequestType("workspace/configuration");
      })(ConfigurationRequest = exports.ConfigurationRequest || (exports.ConfigurationRequest = {}));
    }
  });

  // node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.colorProvider.js
  var require_protocol_colorProvider = __commonJS({
    "node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.colorProvider.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ColorPresentationRequest = exports.DocumentColorRequest = void 0;
      var messages_1 = require_messages2();
      var DocumentColorRequest;
      (function(DocumentColorRequest2) {
        DocumentColorRequest2.method = "textDocument/documentColor";
        DocumentColorRequest2.type = new messages_1.ProtocolRequestType(DocumentColorRequest2.method);
      })(DocumentColorRequest = exports.DocumentColorRequest || (exports.DocumentColorRequest = {}));
      var ColorPresentationRequest;
      (function(ColorPresentationRequest2) {
        ColorPresentationRequest2.type = new messages_1.ProtocolRequestType("textDocument/colorPresentation");
      })(ColorPresentationRequest = exports.ColorPresentationRequest || (exports.ColorPresentationRequest = {}));
    }
  });

  // node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.foldingRange.js
  var require_protocol_foldingRange = __commonJS({
    "node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.foldingRange.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.FoldingRangeRequest = exports.FoldingRangeKind = void 0;
      var messages_1 = require_messages2();
      var FoldingRangeKind;
      (function(FoldingRangeKind2) {
        FoldingRangeKind2["Comment"] = "comment";
        FoldingRangeKind2["Imports"] = "imports";
        FoldingRangeKind2["Region"] = "region";
      })(FoldingRangeKind = exports.FoldingRangeKind || (exports.FoldingRangeKind = {}));
      var FoldingRangeRequest;
      (function(FoldingRangeRequest2) {
        FoldingRangeRequest2.method = "textDocument/foldingRange";
        FoldingRangeRequest2.type = new messages_1.ProtocolRequestType(FoldingRangeRequest2.method);
      })(FoldingRangeRequest = exports.FoldingRangeRequest || (exports.FoldingRangeRequest = {}));
    }
  });

  // node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.declaration.js
  var require_protocol_declaration = __commonJS({
    "node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.declaration.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.DeclarationRequest = void 0;
      var messages_1 = require_messages2();
      var DeclarationRequest;
      (function(DeclarationRequest2) {
        DeclarationRequest2.method = "textDocument/declaration";
        DeclarationRequest2.type = new messages_1.ProtocolRequestType(DeclarationRequest2.method);
      })(DeclarationRequest = exports.DeclarationRequest || (exports.DeclarationRequest = {}));
    }
  });

  // node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.selectionRange.js
  var require_protocol_selectionRange = __commonJS({
    "node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.selectionRange.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SelectionRangeRequest = void 0;
      var messages_1 = require_messages2();
      var SelectionRangeRequest;
      (function(SelectionRangeRequest2) {
        SelectionRangeRequest2.method = "textDocument/selectionRange";
        SelectionRangeRequest2.type = new messages_1.ProtocolRequestType(SelectionRangeRequest2.method);
      })(SelectionRangeRequest = exports.SelectionRangeRequest || (exports.SelectionRangeRequest = {}));
    }
  });

  // node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.progress.js
  var require_protocol_progress = __commonJS({
    "node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.progress.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.WorkDoneProgressCancelNotification = exports.WorkDoneProgressCreateRequest = exports.WorkDoneProgress = void 0;
      var vscode_jsonrpc_1 = require_main();
      var messages_1 = require_messages2();
      var WorkDoneProgress;
      (function(WorkDoneProgress2) {
        WorkDoneProgress2.type = new vscode_jsonrpc_1.ProgressType();
        function is(value) {
          return value === WorkDoneProgress2.type;
        }
        WorkDoneProgress2.is = is;
      })(WorkDoneProgress = exports.WorkDoneProgress || (exports.WorkDoneProgress = {}));
      var WorkDoneProgressCreateRequest;
      (function(WorkDoneProgressCreateRequest2) {
        WorkDoneProgressCreateRequest2.type = new messages_1.ProtocolRequestType("window/workDoneProgress/create");
      })(WorkDoneProgressCreateRequest = exports.WorkDoneProgressCreateRequest || (exports.WorkDoneProgressCreateRequest = {}));
      var WorkDoneProgressCancelNotification;
      (function(WorkDoneProgressCancelNotification2) {
        WorkDoneProgressCancelNotification2.type = new messages_1.ProtocolNotificationType("window/workDoneProgress/cancel");
      })(WorkDoneProgressCancelNotification = exports.WorkDoneProgressCancelNotification || (exports.WorkDoneProgressCancelNotification = {}));
    }
  });

  // node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.callHierarchy.js
  var require_protocol_callHierarchy = __commonJS({
    "node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.callHierarchy.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.CallHierarchyOutgoingCallsRequest = exports.CallHierarchyIncomingCallsRequest = exports.CallHierarchyPrepareRequest = void 0;
      var messages_1 = require_messages2();
      var CallHierarchyPrepareRequest;
      (function(CallHierarchyPrepareRequest2) {
        CallHierarchyPrepareRequest2.method = "textDocument/prepareCallHierarchy";
        CallHierarchyPrepareRequest2.type = new messages_1.ProtocolRequestType(CallHierarchyPrepareRequest2.method);
      })(CallHierarchyPrepareRequest = exports.CallHierarchyPrepareRequest || (exports.CallHierarchyPrepareRequest = {}));
      var CallHierarchyIncomingCallsRequest;
      (function(CallHierarchyIncomingCallsRequest2) {
        CallHierarchyIncomingCallsRequest2.method = "callHierarchy/incomingCalls";
        CallHierarchyIncomingCallsRequest2.type = new messages_1.ProtocolRequestType(CallHierarchyIncomingCallsRequest2.method);
      })(CallHierarchyIncomingCallsRequest = exports.CallHierarchyIncomingCallsRequest || (exports.CallHierarchyIncomingCallsRequest = {}));
      var CallHierarchyOutgoingCallsRequest;
      (function(CallHierarchyOutgoingCallsRequest2) {
        CallHierarchyOutgoingCallsRequest2.method = "callHierarchy/outgoingCalls";
        CallHierarchyOutgoingCallsRequest2.type = new messages_1.ProtocolRequestType(CallHierarchyOutgoingCallsRequest2.method);
      })(CallHierarchyOutgoingCallsRequest = exports.CallHierarchyOutgoingCallsRequest || (exports.CallHierarchyOutgoingCallsRequest = {}));
    }
  });

  // node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.js
  var require_protocol_semanticTokens = __commonJS({
    "node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SemanticTokensRefreshRequest = exports.SemanticTokensRangeRequest = exports.SemanticTokensDeltaRequest = exports.SemanticTokensRequest = exports.SemanticTokensRegistrationType = exports.TokenFormat = exports.SemanticTokens = exports.SemanticTokenModifiers = exports.SemanticTokenTypes = void 0;
      var messages_1 = require_messages2();
      var SemanticTokenTypes;
      (function(SemanticTokenTypes2) {
        SemanticTokenTypes2["namespace"] = "namespace";
        SemanticTokenTypes2["type"] = "type";
        SemanticTokenTypes2["class"] = "class";
        SemanticTokenTypes2["enum"] = "enum";
        SemanticTokenTypes2["interface"] = "interface";
        SemanticTokenTypes2["struct"] = "struct";
        SemanticTokenTypes2["typeParameter"] = "typeParameter";
        SemanticTokenTypes2["parameter"] = "parameter";
        SemanticTokenTypes2["variable"] = "variable";
        SemanticTokenTypes2["property"] = "property";
        SemanticTokenTypes2["enumMember"] = "enumMember";
        SemanticTokenTypes2["event"] = "event";
        SemanticTokenTypes2["function"] = "function";
        SemanticTokenTypes2["method"] = "method";
        SemanticTokenTypes2["macro"] = "macro";
        SemanticTokenTypes2["keyword"] = "keyword";
        SemanticTokenTypes2["modifier"] = "modifier";
        SemanticTokenTypes2["comment"] = "comment";
        SemanticTokenTypes2["string"] = "string";
        SemanticTokenTypes2["number"] = "number";
        SemanticTokenTypes2["regexp"] = "regexp";
        SemanticTokenTypes2["operator"] = "operator";
      })(SemanticTokenTypes = exports.SemanticTokenTypes || (exports.SemanticTokenTypes = {}));
      var SemanticTokenModifiers;
      (function(SemanticTokenModifiers2) {
        SemanticTokenModifiers2["declaration"] = "declaration";
        SemanticTokenModifiers2["definition"] = "definition";
        SemanticTokenModifiers2["readonly"] = "readonly";
        SemanticTokenModifiers2["static"] = "static";
        SemanticTokenModifiers2["deprecated"] = "deprecated";
        SemanticTokenModifiers2["abstract"] = "abstract";
        SemanticTokenModifiers2["async"] = "async";
        SemanticTokenModifiers2["modification"] = "modification";
        SemanticTokenModifiers2["documentation"] = "documentation";
        SemanticTokenModifiers2["defaultLibrary"] = "defaultLibrary";
      })(SemanticTokenModifiers = exports.SemanticTokenModifiers || (exports.SemanticTokenModifiers = {}));
      var SemanticTokens;
      (function(SemanticTokens2) {
        function is(value) {
          const candidate = value;
          return candidate !== void 0 && (candidate.resultId === void 0 || typeof candidate.resultId === "string") && Array.isArray(candidate.data) && (candidate.data.length === 0 || typeof candidate.data[0] === "number");
        }
        SemanticTokens2.is = is;
      })(SemanticTokens = exports.SemanticTokens || (exports.SemanticTokens = {}));
      var TokenFormat;
      (function(TokenFormat2) {
        TokenFormat2.Relative = "relative";
      })(TokenFormat = exports.TokenFormat || (exports.TokenFormat = {}));
      var SemanticTokensRegistrationType;
      (function(SemanticTokensRegistrationType2) {
        SemanticTokensRegistrationType2.method = "textDocument/semanticTokens";
        SemanticTokensRegistrationType2.type = new messages_1.RegistrationType(SemanticTokensRegistrationType2.method);
      })(SemanticTokensRegistrationType = exports.SemanticTokensRegistrationType || (exports.SemanticTokensRegistrationType = {}));
      var SemanticTokensRequest;
      (function(SemanticTokensRequest2) {
        SemanticTokensRequest2.method = "textDocument/semanticTokens/full";
        SemanticTokensRequest2.type = new messages_1.ProtocolRequestType(SemanticTokensRequest2.method);
      })(SemanticTokensRequest = exports.SemanticTokensRequest || (exports.SemanticTokensRequest = {}));
      var SemanticTokensDeltaRequest;
      (function(SemanticTokensDeltaRequest2) {
        SemanticTokensDeltaRequest2.method = "textDocument/semanticTokens/full/delta";
        SemanticTokensDeltaRequest2.type = new messages_1.ProtocolRequestType(SemanticTokensDeltaRequest2.method);
      })(SemanticTokensDeltaRequest = exports.SemanticTokensDeltaRequest || (exports.SemanticTokensDeltaRequest = {}));
      var SemanticTokensRangeRequest;
      (function(SemanticTokensRangeRequest2) {
        SemanticTokensRangeRequest2.method = "textDocument/semanticTokens/range";
        SemanticTokensRangeRequest2.type = new messages_1.ProtocolRequestType(SemanticTokensRangeRequest2.method);
      })(SemanticTokensRangeRequest = exports.SemanticTokensRangeRequest || (exports.SemanticTokensRangeRequest = {}));
      var SemanticTokensRefreshRequest;
      (function(SemanticTokensRefreshRequest2) {
        SemanticTokensRefreshRequest2.method = `workspace/semanticTokens/refresh`;
        SemanticTokensRefreshRequest2.type = new messages_1.ProtocolRequestType0(SemanticTokensRefreshRequest2.method);
      })(SemanticTokensRefreshRequest = exports.SemanticTokensRefreshRequest || (exports.SemanticTokensRefreshRequest = {}));
    }
  });

  // node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.showDocument.js
  var require_protocol_showDocument = __commonJS({
    "node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.showDocument.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ShowDocumentRequest = void 0;
      var messages_1 = require_messages2();
      var ShowDocumentRequest;
      (function(ShowDocumentRequest2) {
        ShowDocumentRequest2.method = "window/showDocument";
        ShowDocumentRequest2.type = new messages_1.ProtocolRequestType(ShowDocumentRequest2.method);
      })(ShowDocumentRequest = exports.ShowDocumentRequest || (exports.ShowDocumentRequest = {}));
    }
  });

  // node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.linkedEditingRange.js
  var require_protocol_linkedEditingRange = __commonJS({
    "node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.linkedEditingRange.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.LinkedEditingRangeRequest = void 0;
      var messages_1 = require_messages2();
      var LinkedEditingRangeRequest;
      (function(LinkedEditingRangeRequest2) {
        LinkedEditingRangeRequest2.method = "textDocument/linkedEditingRange";
        LinkedEditingRangeRequest2.type = new messages_1.ProtocolRequestType(LinkedEditingRangeRequest2.method);
      })(LinkedEditingRangeRequest = exports.LinkedEditingRangeRequest || (exports.LinkedEditingRangeRequest = {}));
    }
  });

  // node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.js
  var require_protocol_fileOperations = __commonJS({
    "node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.WillDeleteFilesRequest = exports.DidDeleteFilesNotification = exports.DidRenameFilesNotification = exports.WillRenameFilesRequest = exports.DidCreateFilesNotification = exports.WillCreateFilesRequest = exports.FileOperationPatternKind = void 0;
      var messages_1 = require_messages2();
      var FileOperationPatternKind;
      (function(FileOperationPatternKind2) {
        FileOperationPatternKind2.file = "file";
        FileOperationPatternKind2.folder = "folder";
      })(FileOperationPatternKind = exports.FileOperationPatternKind || (exports.FileOperationPatternKind = {}));
      var WillCreateFilesRequest;
      (function(WillCreateFilesRequest2) {
        WillCreateFilesRequest2.method = "workspace/willCreateFiles";
        WillCreateFilesRequest2.type = new messages_1.ProtocolRequestType(WillCreateFilesRequest2.method);
      })(WillCreateFilesRequest = exports.WillCreateFilesRequest || (exports.WillCreateFilesRequest = {}));
      var DidCreateFilesNotification;
      (function(DidCreateFilesNotification2) {
        DidCreateFilesNotification2.method = "workspace/didCreateFiles";
        DidCreateFilesNotification2.type = new messages_1.ProtocolNotificationType(DidCreateFilesNotification2.method);
      })(DidCreateFilesNotification = exports.DidCreateFilesNotification || (exports.DidCreateFilesNotification = {}));
      var WillRenameFilesRequest;
      (function(WillRenameFilesRequest2) {
        WillRenameFilesRequest2.method = "workspace/willRenameFiles";
        WillRenameFilesRequest2.type = new messages_1.ProtocolRequestType(WillRenameFilesRequest2.method);
      })(WillRenameFilesRequest = exports.WillRenameFilesRequest || (exports.WillRenameFilesRequest = {}));
      var DidRenameFilesNotification;
      (function(DidRenameFilesNotification2) {
        DidRenameFilesNotification2.method = "workspace/didRenameFiles";
        DidRenameFilesNotification2.type = new messages_1.ProtocolNotificationType(DidRenameFilesNotification2.method);
      })(DidRenameFilesNotification = exports.DidRenameFilesNotification || (exports.DidRenameFilesNotification = {}));
      var DidDeleteFilesNotification;
      (function(DidDeleteFilesNotification2) {
        DidDeleteFilesNotification2.method = "workspace/didDeleteFiles";
        DidDeleteFilesNotification2.type = new messages_1.ProtocolNotificationType(DidDeleteFilesNotification2.method);
      })(DidDeleteFilesNotification = exports.DidDeleteFilesNotification || (exports.DidDeleteFilesNotification = {}));
      var WillDeleteFilesRequest;
      (function(WillDeleteFilesRequest2) {
        WillDeleteFilesRequest2.method = "workspace/willDeleteFiles";
        WillDeleteFilesRequest2.type = new messages_1.ProtocolRequestType(WillDeleteFilesRequest2.method);
      })(WillDeleteFilesRequest = exports.WillDeleteFilesRequest || (exports.WillDeleteFilesRequest = {}));
    }
  });

  // node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.moniker.js
  var require_protocol_moniker = __commonJS({
    "node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.moniker.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.MonikerRequest = exports.MonikerKind = exports.UniquenessLevel = void 0;
      var messages_1 = require_messages2();
      var UniquenessLevel;
      (function(UniquenessLevel2) {
        UniquenessLevel2["document"] = "document";
        UniquenessLevel2["project"] = "project";
        UniquenessLevel2["group"] = "group";
        UniquenessLevel2["scheme"] = "scheme";
        UniquenessLevel2["global"] = "global";
      })(UniquenessLevel = exports.UniquenessLevel || (exports.UniquenessLevel = {}));
      var MonikerKind;
      (function(MonikerKind2) {
        MonikerKind2["import"] = "import";
        MonikerKind2["export"] = "export";
        MonikerKind2["local"] = "local";
      })(MonikerKind = exports.MonikerKind || (exports.MonikerKind = {}));
      var MonikerRequest;
      (function(MonikerRequest2) {
        MonikerRequest2.method = "textDocument/moniker";
        MonikerRequest2.type = new messages_1.ProtocolRequestType(MonikerRequest2.method);
      })(MonikerRequest = exports.MonikerRequest || (exports.MonikerRequest = {}));
    }
  });

  // node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.js
  var require_protocol = __commonJS({
    "node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/protocol.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.DocumentLinkRequest = exports.CodeLensRefreshRequest = exports.CodeLensResolveRequest = exports.CodeLensRequest = exports.WorkspaceSymbolRequest = exports.CodeActionResolveRequest = exports.CodeActionRequest = exports.DocumentSymbolRequest = exports.DocumentHighlightRequest = exports.ReferencesRequest = exports.DefinitionRequest = exports.SignatureHelpRequest = exports.SignatureHelpTriggerKind = exports.HoverRequest = exports.CompletionResolveRequest = exports.CompletionRequest = exports.CompletionTriggerKind = exports.PublishDiagnosticsNotification = exports.WatchKind = exports.FileChangeType = exports.DidChangeWatchedFilesNotification = exports.WillSaveTextDocumentWaitUntilRequest = exports.WillSaveTextDocumentNotification = exports.TextDocumentSaveReason = exports.DidSaveTextDocumentNotification = exports.DidCloseTextDocumentNotification = exports.DidChangeTextDocumentNotification = exports.TextDocumentContentChangeEvent = exports.DidOpenTextDocumentNotification = exports.TextDocumentSyncKind = exports.TelemetryEventNotification = exports.LogMessageNotification = exports.ShowMessageRequest = exports.ShowMessageNotification = exports.MessageType = exports.DidChangeConfigurationNotification = exports.ExitNotification = exports.ShutdownRequest = exports.InitializedNotification = exports.InitializeError = exports.InitializeRequest = exports.WorkDoneProgressOptions = exports.TextDocumentRegistrationOptions = exports.StaticRegistrationOptions = exports.FailureHandlingKind = exports.ResourceOperationKind = exports.UnregistrationRequest = exports.RegistrationRequest = exports.DocumentSelector = exports.DocumentFilter = void 0;
      exports.MonikerRequest = exports.MonikerKind = exports.UniquenessLevel = exports.WillDeleteFilesRequest = exports.DidDeleteFilesNotification = exports.WillRenameFilesRequest = exports.DidRenameFilesNotification = exports.WillCreateFilesRequest = exports.DidCreateFilesNotification = exports.FileOperationPatternKind = exports.LinkedEditingRangeRequest = exports.ShowDocumentRequest = exports.SemanticTokensRegistrationType = exports.SemanticTokensRefreshRequest = exports.SemanticTokensRangeRequest = exports.SemanticTokensDeltaRequest = exports.SemanticTokensRequest = exports.TokenFormat = exports.SemanticTokens = exports.SemanticTokenModifiers = exports.SemanticTokenTypes = exports.CallHierarchyPrepareRequest = exports.CallHierarchyOutgoingCallsRequest = exports.CallHierarchyIncomingCallsRequest = exports.WorkDoneProgressCancelNotification = exports.WorkDoneProgressCreateRequest = exports.WorkDoneProgress = exports.SelectionRangeRequest = exports.DeclarationRequest = exports.FoldingRangeRequest = exports.ColorPresentationRequest = exports.DocumentColorRequest = exports.ConfigurationRequest = exports.DidChangeWorkspaceFoldersNotification = exports.WorkspaceFoldersRequest = exports.TypeDefinitionRequest = exports.ImplementationRequest = exports.ApplyWorkspaceEditRequest = exports.ExecuteCommandRequest = exports.PrepareRenameRequest = exports.RenameRequest = exports.PrepareSupportDefaultBehavior = exports.DocumentOnTypeFormattingRequest = exports.DocumentRangeFormattingRequest = exports.DocumentFormattingRequest = exports.DocumentLinkResolveRequest = void 0;
      var Is = require_is2();
      var messages_1 = require_messages2();
      var protocol_implementation_1 = require_protocol_implementation();
      Object.defineProperty(exports, "ImplementationRequest", { enumerable: true, get: function() {
        return protocol_implementation_1.ImplementationRequest;
      } });
      var protocol_typeDefinition_1 = require_protocol_typeDefinition();
      Object.defineProperty(exports, "TypeDefinitionRequest", { enumerable: true, get: function() {
        return protocol_typeDefinition_1.TypeDefinitionRequest;
      } });
      var protocol_workspaceFolders_1 = require_protocol_workspaceFolders();
      Object.defineProperty(exports, "WorkspaceFoldersRequest", { enumerable: true, get: function() {
        return protocol_workspaceFolders_1.WorkspaceFoldersRequest;
      } });
      Object.defineProperty(exports, "DidChangeWorkspaceFoldersNotification", { enumerable: true, get: function() {
        return protocol_workspaceFolders_1.DidChangeWorkspaceFoldersNotification;
      } });
      var protocol_configuration_1 = require_protocol_configuration();
      Object.defineProperty(exports, "ConfigurationRequest", { enumerable: true, get: function() {
        return protocol_configuration_1.ConfigurationRequest;
      } });
      var protocol_colorProvider_1 = require_protocol_colorProvider();
      Object.defineProperty(exports, "DocumentColorRequest", { enumerable: true, get: function() {
        return protocol_colorProvider_1.DocumentColorRequest;
      } });
      Object.defineProperty(exports, "ColorPresentationRequest", { enumerable: true, get: function() {
        return protocol_colorProvider_1.ColorPresentationRequest;
      } });
      var protocol_foldingRange_1 = require_protocol_foldingRange();
      Object.defineProperty(exports, "FoldingRangeRequest", { enumerable: true, get: function() {
        return protocol_foldingRange_1.FoldingRangeRequest;
      } });
      var protocol_declaration_1 = require_protocol_declaration();
      Object.defineProperty(exports, "DeclarationRequest", { enumerable: true, get: function() {
        return protocol_declaration_1.DeclarationRequest;
      } });
      var protocol_selectionRange_1 = require_protocol_selectionRange();
      Object.defineProperty(exports, "SelectionRangeRequest", { enumerable: true, get: function() {
        return protocol_selectionRange_1.SelectionRangeRequest;
      } });
      var protocol_progress_1 = require_protocol_progress();
      Object.defineProperty(exports, "WorkDoneProgress", { enumerable: true, get: function() {
        return protocol_progress_1.WorkDoneProgress;
      } });
      Object.defineProperty(exports, "WorkDoneProgressCreateRequest", { enumerable: true, get: function() {
        return protocol_progress_1.WorkDoneProgressCreateRequest;
      } });
      Object.defineProperty(exports, "WorkDoneProgressCancelNotification", { enumerable: true, get: function() {
        return protocol_progress_1.WorkDoneProgressCancelNotification;
      } });
      var protocol_callHierarchy_1 = require_protocol_callHierarchy();
      Object.defineProperty(exports, "CallHierarchyIncomingCallsRequest", { enumerable: true, get: function() {
        return protocol_callHierarchy_1.CallHierarchyIncomingCallsRequest;
      } });
      Object.defineProperty(exports, "CallHierarchyOutgoingCallsRequest", { enumerable: true, get: function() {
        return protocol_callHierarchy_1.CallHierarchyOutgoingCallsRequest;
      } });
      Object.defineProperty(exports, "CallHierarchyPrepareRequest", { enumerable: true, get: function() {
        return protocol_callHierarchy_1.CallHierarchyPrepareRequest;
      } });
      var protocol_semanticTokens_1 = require_protocol_semanticTokens();
      Object.defineProperty(exports, "SemanticTokenTypes", { enumerable: true, get: function() {
        return protocol_semanticTokens_1.SemanticTokenTypes;
      } });
      Object.defineProperty(exports, "SemanticTokenModifiers", { enumerable: true, get: function() {
        return protocol_semanticTokens_1.SemanticTokenModifiers;
      } });
      Object.defineProperty(exports, "SemanticTokens", { enumerable: true, get: function() {
        return protocol_semanticTokens_1.SemanticTokens;
      } });
      Object.defineProperty(exports, "TokenFormat", { enumerable: true, get: function() {
        return protocol_semanticTokens_1.TokenFormat;
      } });
      Object.defineProperty(exports, "SemanticTokensRequest", { enumerable: true, get: function() {
        return protocol_semanticTokens_1.SemanticTokensRequest;
      } });
      Object.defineProperty(exports, "SemanticTokensDeltaRequest", { enumerable: true, get: function() {
        return protocol_semanticTokens_1.SemanticTokensDeltaRequest;
      } });
      Object.defineProperty(exports, "SemanticTokensRangeRequest", { enumerable: true, get: function() {
        return protocol_semanticTokens_1.SemanticTokensRangeRequest;
      } });
      Object.defineProperty(exports, "SemanticTokensRefreshRequest", { enumerable: true, get: function() {
        return protocol_semanticTokens_1.SemanticTokensRefreshRequest;
      } });
      Object.defineProperty(exports, "SemanticTokensRegistrationType", { enumerable: true, get: function() {
        return protocol_semanticTokens_1.SemanticTokensRegistrationType;
      } });
      var protocol_showDocument_1 = require_protocol_showDocument();
      Object.defineProperty(exports, "ShowDocumentRequest", { enumerable: true, get: function() {
        return protocol_showDocument_1.ShowDocumentRequest;
      } });
      var protocol_linkedEditingRange_1 = require_protocol_linkedEditingRange();
      Object.defineProperty(exports, "LinkedEditingRangeRequest", { enumerable: true, get: function() {
        return protocol_linkedEditingRange_1.LinkedEditingRangeRequest;
      } });
      var protocol_fileOperations_1 = require_protocol_fileOperations();
      Object.defineProperty(exports, "FileOperationPatternKind", { enumerable: true, get: function() {
        return protocol_fileOperations_1.FileOperationPatternKind;
      } });
      Object.defineProperty(exports, "DidCreateFilesNotification", { enumerable: true, get: function() {
        return protocol_fileOperations_1.DidCreateFilesNotification;
      } });
      Object.defineProperty(exports, "WillCreateFilesRequest", { enumerable: true, get: function() {
        return protocol_fileOperations_1.WillCreateFilesRequest;
      } });
      Object.defineProperty(exports, "DidRenameFilesNotification", { enumerable: true, get: function() {
        return protocol_fileOperations_1.DidRenameFilesNotification;
      } });
      Object.defineProperty(exports, "WillRenameFilesRequest", { enumerable: true, get: function() {
        return protocol_fileOperations_1.WillRenameFilesRequest;
      } });
      Object.defineProperty(exports, "DidDeleteFilesNotification", { enumerable: true, get: function() {
        return protocol_fileOperations_1.DidDeleteFilesNotification;
      } });
      Object.defineProperty(exports, "WillDeleteFilesRequest", { enumerable: true, get: function() {
        return protocol_fileOperations_1.WillDeleteFilesRequest;
      } });
      var protocol_moniker_1 = require_protocol_moniker();
      Object.defineProperty(exports, "UniquenessLevel", { enumerable: true, get: function() {
        return protocol_moniker_1.UniquenessLevel;
      } });
      Object.defineProperty(exports, "MonikerKind", { enumerable: true, get: function() {
        return protocol_moniker_1.MonikerKind;
      } });
      Object.defineProperty(exports, "MonikerRequest", { enumerable: true, get: function() {
        return protocol_moniker_1.MonikerRequest;
      } });
      var DocumentFilter;
      (function(DocumentFilter2) {
        function is(value) {
          const candidate = value;
          return Is.string(candidate.language) || Is.string(candidate.scheme) || Is.string(candidate.pattern);
        }
        DocumentFilter2.is = is;
      })(DocumentFilter = exports.DocumentFilter || (exports.DocumentFilter = {}));
      var DocumentSelector;
      (function(DocumentSelector2) {
        function is(value) {
          if (!Array.isArray(value)) {
            return false;
          }
          for (let elem of value) {
            if (!Is.string(elem) && !DocumentFilter.is(elem)) {
              return false;
            }
          }
          return true;
        }
        DocumentSelector2.is = is;
      })(DocumentSelector = exports.DocumentSelector || (exports.DocumentSelector = {}));
      var RegistrationRequest;
      (function(RegistrationRequest2) {
        RegistrationRequest2.type = new messages_1.ProtocolRequestType("client/registerCapability");
      })(RegistrationRequest = exports.RegistrationRequest || (exports.RegistrationRequest = {}));
      var UnregistrationRequest;
      (function(UnregistrationRequest2) {
        UnregistrationRequest2.type = new messages_1.ProtocolRequestType("client/unregisterCapability");
      })(UnregistrationRequest = exports.UnregistrationRequest || (exports.UnregistrationRequest = {}));
      var ResourceOperationKind;
      (function(ResourceOperationKind2) {
        ResourceOperationKind2.Create = "create";
        ResourceOperationKind2.Rename = "rename";
        ResourceOperationKind2.Delete = "delete";
      })(ResourceOperationKind = exports.ResourceOperationKind || (exports.ResourceOperationKind = {}));
      var FailureHandlingKind;
      (function(FailureHandlingKind2) {
        FailureHandlingKind2.Abort = "abort";
        FailureHandlingKind2.Transactional = "transactional";
        FailureHandlingKind2.TextOnlyTransactional = "textOnlyTransactional";
        FailureHandlingKind2.Undo = "undo";
      })(FailureHandlingKind = exports.FailureHandlingKind || (exports.FailureHandlingKind = {}));
      var StaticRegistrationOptions;
      (function(StaticRegistrationOptions2) {
        function hasId(value) {
          const candidate = value;
          return candidate && Is.string(candidate.id) && candidate.id.length > 0;
        }
        StaticRegistrationOptions2.hasId = hasId;
      })(StaticRegistrationOptions = exports.StaticRegistrationOptions || (exports.StaticRegistrationOptions = {}));
      var TextDocumentRegistrationOptions;
      (function(TextDocumentRegistrationOptions2) {
        function is(value) {
          const candidate = value;
          return candidate && (candidate.documentSelector === null || DocumentSelector.is(candidate.documentSelector));
        }
        TextDocumentRegistrationOptions2.is = is;
      })(TextDocumentRegistrationOptions = exports.TextDocumentRegistrationOptions || (exports.TextDocumentRegistrationOptions = {}));
      var WorkDoneProgressOptions;
      (function(WorkDoneProgressOptions2) {
        function is(value) {
          const candidate = value;
          return Is.objectLiteral(candidate) && (candidate.workDoneProgress === void 0 || Is.boolean(candidate.workDoneProgress));
        }
        WorkDoneProgressOptions2.is = is;
        function hasWorkDoneProgress(value) {
          const candidate = value;
          return candidate && Is.boolean(candidate.workDoneProgress);
        }
        WorkDoneProgressOptions2.hasWorkDoneProgress = hasWorkDoneProgress;
      })(WorkDoneProgressOptions = exports.WorkDoneProgressOptions || (exports.WorkDoneProgressOptions = {}));
      var InitializeRequest;
      (function(InitializeRequest2) {
        InitializeRequest2.type = new messages_1.ProtocolRequestType("initialize");
      })(InitializeRequest = exports.InitializeRequest || (exports.InitializeRequest = {}));
      var InitializeError;
      (function(InitializeError2) {
        InitializeError2.unknownProtocolVersion = 1;
      })(InitializeError = exports.InitializeError || (exports.InitializeError = {}));
      var InitializedNotification;
      (function(InitializedNotification2) {
        InitializedNotification2.type = new messages_1.ProtocolNotificationType("initialized");
      })(InitializedNotification = exports.InitializedNotification || (exports.InitializedNotification = {}));
      var ShutdownRequest;
      (function(ShutdownRequest2) {
        ShutdownRequest2.type = new messages_1.ProtocolRequestType0("shutdown");
      })(ShutdownRequest = exports.ShutdownRequest || (exports.ShutdownRequest = {}));
      var ExitNotification;
      (function(ExitNotification2) {
        ExitNotification2.type = new messages_1.ProtocolNotificationType0("exit");
      })(ExitNotification = exports.ExitNotification || (exports.ExitNotification = {}));
      var DidChangeConfigurationNotification;
      (function(DidChangeConfigurationNotification2) {
        DidChangeConfigurationNotification2.type = new messages_1.ProtocolNotificationType("workspace/didChangeConfiguration");
      })(DidChangeConfigurationNotification = exports.DidChangeConfigurationNotification || (exports.DidChangeConfigurationNotification = {}));
      var MessageType;
      (function(MessageType2) {
        MessageType2.Error = 1;
        MessageType2.Warning = 2;
        MessageType2.Info = 3;
        MessageType2.Log = 4;
      })(MessageType = exports.MessageType || (exports.MessageType = {}));
      var ShowMessageNotification;
      (function(ShowMessageNotification2) {
        ShowMessageNotification2.type = new messages_1.ProtocolNotificationType("window/showMessage");
      })(ShowMessageNotification = exports.ShowMessageNotification || (exports.ShowMessageNotification = {}));
      var ShowMessageRequest;
      (function(ShowMessageRequest2) {
        ShowMessageRequest2.type = new messages_1.ProtocolRequestType("window/showMessageRequest");
      })(ShowMessageRequest = exports.ShowMessageRequest || (exports.ShowMessageRequest = {}));
      var LogMessageNotification;
      (function(LogMessageNotification2) {
        LogMessageNotification2.type = new messages_1.ProtocolNotificationType("window/logMessage");
      })(LogMessageNotification = exports.LogMessageNotification || (exports.LogMessageNotification = {}));
      var TelemetryEventNotification;
      (function(TelemetryEventNotification2) {
        TelemetryEventNotification2.type = new messages_1.ProtocolNotificationType("telemetry/event");
      })(TelemetryEventNotification = exports.TelemetryEventNotification || (exports.TelemetryEventNotification = {}));
      var TextDocumentSyncKind;
      (function(TextDocumentSyncKind2) {
        TextDocumentSyncKind2.None = 0;
        TextDocumentSyncKind2.Full = 1;
        TextDocumentSyncKind2.Incremental = 2;
      })(TextDocumentSyncKind = exports.TextDocumentSyncKind || (exports.TextDocumentSyncKind = {}));
      var DidOpenTextDocumentNotification;
      (function(DidOpenTextDocumentNotification2) {
        DidOpenTextDocumentNotification2.method = "textDocument/didOpen";
        DidOpenTextDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidOpenTextDocumentNotification2.method);
      })(DidOpenTextDocumentNotification = exports.DidOpenTextDocumentNotification || (exports.DidOpenTextDocumentNotification = {}));
      var TextDocumentContentChangeEvent;
      (function(TextDocumentContentChangeEvent2) {
        function isIncremental(event) {
          let candidate = event;
          return candidate !== void 0 && candidate !== null && typeof candidate.text === "string" && candidate.range !== void 0 && (candidate.rangeLength === void 0 || typeof candidate.rangeLength === "number");
        }
        TextDocumentContentChangeEvent2.isIncremental = isIncremental;
        function isFull(event) {
          let candidate = event;
          return candidate !== void 0 && candidate !== null && typeof candidate.text === "string" && candidate.range === void 0 && candidate.rangeLength === void 0;
        }
        TextDocumentContentChangeEvent2.isFull = isFull;
      })(TextDocumentContentChangeEvent = exports.TextDocumentContentChangeEvent || (exports.TextDocumentContentChangeEvent = {}));
      var DidChangeTextDocumentNotification;
      (function(DidChangeTextDocumentNotification2) {
        DidChangeTextDocumentNotification2.method = "textDocument/didChange";
        DidChangeTextDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidChangeTextDocumentNotification2.method);
      })(DidChangeTextDocumentNotification = exports.DidChangeTextDocumentNotification || (exports.DidChangeTextDocumentNotification = {}));
      var DidCloseTextDocumentNotification;
      (function(DidCloseTextDocumentNotification2) {
        DidCloseTextDocumentNotification2.method = "textDocument/didClose";
        DidCloseTextDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidCloseTextDocumentNotification2.method);
      })(DidCloseTextDocumentNotification = exports.DidCloseTextDocumentNotification || (exports.DidCloseTextDocumentNotification = {}));
      var DidSaveTextDocumentNotification;
      (function(DidSaveTextDocumentNotification2) {
        DidSaveTextDocumentNotification2.method = "textDocument/didSave";
        DidSaveTextDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidSaveTextDocumentNotification2.method);
      })(DidSaveTextDocumentNotification = exports.DidSaveTextDocumentNotification || (exports.DidSaveTextDocumentNotification = {}));
      var TextDocumentSaveReason;
      (function(TextDocumentSaveReason2) {
        TextDocumentSaveReason2.Manual = 1;
        TextDocumentSaveReason2.AfterDelay = 2;
        TextDocumentSaveReason2.FocusOut = 3;
      })(TextDocumentSaveReason = exports.TextDocumentSaveReason || (exports.TextDocumentSaveReason = {}));
      var WillSaveTextDocumentNotification;
      (function(WillSaveTextDocumentNotification2) {
        WillSaveTextDocumentNotification2.method = "textDocument/willSave";
        WillSaveTextDocumentNotification2.type = new messages_1.ProtocolNotificationType(WillSaveTextDocumentNotification2.method);
      })(WillSaveTextDocumentNotification = exports.WillSaveTextDocumentNotification || (exports.WillSaveTextDocumentNotification = {}));
      var WillSaveTextDocumentWaitUntilRequest;
      (function(WillSaveTextDocumentWaitUntilRequest2) {
        WillSaveTextDocumentWaitUntilRequest2.method = "textDocument/willSaveWaitUntil";
        WillSaveTextDocumentWaitUntilRequest2.type = new messages_1.ProtocolRequestType(WillSaveTextDocumentWaitUntilRequest2.method);
      })(WillSaveTextDocumentWaitUntilRequest = exports.WillSaveTextDocumentWaitUntilRequest || (exports.WillSaveTextDocumentWaitUntilRequest = {}));
      var DidChangeWatchedFilesNotification;
      (function(DidChangeWatchedFilesNotification2) {
        DidChangeWatchedFilesNotification2.type = new messages_1.ProtocolNotificationType("workspace/didChangeWatchedFiles");
      })(DidChangeWatchedFilesNotification = exports.DidChangeWatchedFilesNotification || (exports.DidChangeWatchedFilesNotification = {}));
      var FileChangeType;
      (function(FileChangeType2) {
        FileChangeType2.Created = 1;
        FileChangeType2.Changed = 2;
        FileChangeType2.Deleted = 3;
      })(FileChangeType = exports.FileChangeType || (exports.FileChangeType = {}));
      var WatchKind;
      (function(WatchKind2) {
        WatchKind2.Create = 1;
        WatchKind2.Change = 2;
        WatchKind2.Delete = 4;
      })(WatchKind = exports.WatchKind || (exports.WatchKind = {}));
      var PublishDiagnosticsNotification;
      (function(PublishDiagnosticsNotification2) {
        PublishDiagnosticsNotification2.type = new messages_1.ProtocolNotificationType("textDocument/publishDiagnostics");
      })(PublishDiagnosticsNotification = exports.PublishDiagnosticsNotification || (exports.PublishDiagnosticsNotification = {}));
      var CompletionTriggerKind;
      (function(CompletionTriggerKind2) {
        CompletionTriggerKind2.Invoked = 1;
        CompletionTriggerKind2.TriggerCharacter = 2;
        CompletionTriggerKind2.TriggerForIncompleteCompletions = 3;
      })(CompletionTriggerKind = exports.CompletionTriggerKind || (exports.CompletionTriggerKind = {}));
      var CompletionRequest;
      (function(CompletionRequest2) {
        CompletionRequest2.method = "textDocument/completion";
        CompletionRequest2.type = new messages_1.ProtocolRequestType(CompletionRequest2.method);
      })(CompletionRequest = exports.CompletionRequest || (exports.CompletionRequest = {}));
      var CompletionResolveRequest;
      (function(CompletionResolveRequest2) {
        CompletionResolveRequest2.method = "completionItem/resolve";
        CompletionResolveRequest2.type = new messages_1.ProtocolRequestType(CompletionResolveRequest2.method);
      })(CompletionResolveRequest = exports.CompletionResolveRequest || (exports.CompletionResolveRequest = {}));
      var HoverRequest;
      (function(HoverRequest2) {
        HoverRequest2.method = "textDocument/hover";
        HoverRequest2.type = new messages_1.ProtocolRequestType(HoverRequest2.method);
      })(HoverRequest = exports.HoverRequest || (exports.HoverRequest = {}));
      var SignatureHelpTriggerKind;
      (function(SignatureHelpTriggerKind2) {
        SignatureHelpTriggerKind2.Invoked = 1;
        SignatureHelpTriggerKind2.TriggerCharacter = 2;
        SignatureHelpTriggerKind2.ContentChange = 3;
      })(SignatureHelpTriggerKind = exports.SignatureHelpTriggerKind || (exports.SignatureHelpTriggerKind = {}));
      var SignatureHelpRequest;
      (function(SignatureHelpRequest2) {
        SignatureHelpRequest2.method = "textDocument/signatureHelp";
        SignatureHelpRequest2.type = new messages_1.ProtocolRequestType(SignatureHelpRequest2.method);
      })(SignatureHelpRequest = exports.SignatureHelpRequest || (exports.SignatureHelpRequest = {}));
      var DefinitionRequest;
      (function(DefinitionRequest2) {
        DefinitionRequest2.method = "textDocument/definition";
        DefinitionRequest2.type = new messages_1.ProtocolRequestType(DefinitionRequest2.method);
      })(DefinitionRequest = exports.DefinitionRequest || (exports.DefinitionRequest = {}));
      var ReferencesRequest;
      (function(ReferencesRequest2) {
        ReferencesRequest2.method = "textDocument/references";
        ReferencesRequest2.type = new messages_1.ProtocolRequestType(ReferencesRequest2.method);
      })(ReferencesRequest = exports.ReferencesRequest || (exports.ReferencesRequest = {}));
      var DocumentHighlightRequest;
      (function(DocumentHighlightRequest2) {
        DocumentHighlightRequest2.method = "textDocument/documentHighlight";
        DocumentHighlightRequest2.type = new messages_1.ProtocolRequestType(DocumentHighlightRequest2.method);
      })(DocumentHighlightRequest = exports.DocumentHighlightRequest || (exports.DocumentHighlightRequest = {}));
      var DocumentSymbolRequest;
      (function(DocumentSymbolRequest2) {
        DocumentSymbolRequest2.method = "textDocument/documentSymbol";
        DocumentSymbolRequest2.type = new messages_1.ProtocolRequestType(DocumentSymbolRequest2.method);
      })(DocumentSymbolRequest = exports.DocumentSymbolRequest || (exports.DocumentSymbolRequest = {}));
      var CodeActionRequest;
      (function(CodeActionRequest2) {
        CodeActionRequest2.method = "textDocument/codeAction";
        CodeActionRequest2.type = new messages_1.ProtocolRequestType(CodeActionRequest2.method);
      })(CodeActionRequest = exports.CodeActionRequest || (exports.CodeActionRequest = {}));
      var CodeActionResolveRequest;
      (function(CodeActionResolveRequest2) {
        CodeActionResolveRequest2.method = "codeAction/resolve";
        CodeActionResolveRequest2.type = new messages_1.ProtocolRequestType(CodeActionResolveRequest2.method);
      })(CodeActionResolveRequest = exports.CodeActionResolveRequest || (exports.CodeActionResolveRequest = {}));
      var WorkspaceSymbolRequest;
      (function(WorkspaceSymbolRequest2) {
        WorkspaceSymbolRequest2.method = "workspace/symbol";
        WorkspaceSymbolRequest2.type = new messages_1.ProtocolRequestType(WorkspaceSymbolRequest2.method);
      })(WorkspaceSymbolRequest = exports.WorkspaceSymbolRequest || (exports.WorkspaceSymbolRequest = {}));
      var CodeLensRequest;
      (function(CodeLensRequest2) {
        CodeLensRequest2.method = "textDocument/codeLens";
        CodeLensRequest2.type = new messages_1.ProtocolRequestType(CodeLensRequest2.method);
      })(CodeLensRequest = exports.CodeLensRequest || (exports.CodeLensRequest = {}));
      var CodeLensResolveRequest;
      (function(CodeLensResolveRequest2) {
        CodeLensResolveRequest2.method = "codeLens/resolve";
        CodeLensResolveRequest2.type = new messages_1.ProtocolRequestType(CodeLensResolveRequest2.method);
      })(CodeLensResolveRequest = exports.CodeLensResolveRequest || (exports.CodeLensResolveRequest = {}));
      var CodeLensRefreshRequest;
      (function(CodeLensRefreshRequest2) {
        CodeLensRefreshRequest2.method = `workspace/codeLens/refresh`;
        CodeLensRefreshRequest2.type = new messages_1.ProtocolRequestType0(CodeLensRefreshRequest2.method);
      })(CodeLensRefreshRequest = exports.CodeLensRefreshRequest || (exports.CodeLensRefreshRequest = {}));
      var DocumentLinkRequest;
      (function(DocumentLinkRequest2) {
        DocumentLinkRequest2.method = "textDocument/documentLink";
        DocumentLinkRequest2.type = new messages_1.ProtocolRequestType(DocumentLinkRequest2.method);
      })(DocumentLinkRequest = exports.DocumentLinkRequest || (exports.DocumentLinkRequest = {}));
      var DocumentLinkResolveRequest;
      (function(DocumentLinkResolveRequest2) {
        DocumentLinkResolveRequest2.method = "documentLink/resolve";
        DocumentLinkResolveRequest2.type = new messages_1.ProtocolRequestType(DocumentLinkResolveRequest2.method);
      })(DocumentLinkResolveRequest = exports.DocumentLinkResolveRequest || (exports.DocumentLinkResolveRequest = {}));
      var DocumentFormattingRequest;
      (function(DocumentFormattingRequest2) {
        DocumentFormattingRequest2.method = "textDocument/formatting";
        DocumentFormattingRequest2.type = new messages_1.ProtocolRequestType(DocumentFormattingRequest2.method);
      })(DocumentFormattingRequest = exports.DocumentFormattingRequest || (exports.DocumentFormattingRequest = {}));
      var DocumentRangeFormattingRequest;
      (function(DocumentRangeFormattingRequest2) {
        DocumentRangeFormattingRequest2.method = "textDocument/rangeFormatting";
        DocumentRangeFormattingRequest2.type = new messages_1.ProtocolRequestType(DocumentRangeFormattingRequest2.method);
      })(DocumentRangeFormattingRequest = exports.DocumentRangeFormattingRequest || (exports.DocumentRangeFormattingRequest = {}));
      var DocumentOnTypeFormattingRequest;
      (function(DocumentOnTypeFormattingRequest2) {
        DocumentOnTypeFormattingRequest2.method = "textDocument/onTypeFormatting";
        DocumentOnTypeFormattingRequest2.type = new messages_1.ProtocolRequestType(DocumentOnTypeFormattingRequest2.method);
      })(DocumentOnTypeFormattingRequest = exports.DocumentOnTypeFormattingRequest || (exports.DocumentOnTypeFormattingRequest = {}));
      var PrepareSupportDefaultBehavior;
      (function(PrepareSupportDefaultBehavior2) {
        PrepareSupportDefaultBehavior2.Identifier = 1;
      })(PrepareSupportDefaultBehavior = exports.PrepareSupportDefaultBehavior || (exports.PrepareSupportDefaultBehavior = {}));
      var RenameRequest;
      (function(RenameRequest2) {
        RenameRequest2.method = "textDocument/rename";
        RenameRequest2.type = new messages_1.ProtocolRequestType(RenameRequest2.method);
      })(RenameRequest = exports.RenameRequest || (exports.RenameRequest = {}));
      var PrepareRenameRequest;
      (function(PrepareRenameRequest2) {
        PrepareRenameRequest2.method = "textDocument/prepareRename";
        PrepareRenameRequest2.type = new messages_1.ProtocolRequestType(PrepareRenameRequest2.method);
      })(PrepareRenameRequest = exports.PrepareRenameRequest || (exports.PrepareRenameRequest = {}));
      var ExecuteCommandRequest;
      (function(ExecuteCommandRequest2) {
        ExecuteCommandRequest2.type = new messages_1.ProtocolRequestType("workspace/executeCommand");
      })(ExecuteCommandRequest = exports.ExecuteCommandRequest || (exports.ExecuteCommandRequest = {}));
      var ApplyWorkspaceEditRequest;
      (function(ApplyWorkspaceEditRequest2) {
        ApplyWorkspaceEditRequest2.type = new messages_1.ProtocolRequestType("workspace/applyEdit");
      })(ApplyWorkspaceEditRequest = exports.ApplyWorkspaceEditRequest || (exports.ApplyWorkspaceEditRequest = {}));
    }
  });

  // node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/connection.js
  var require_connection2 = __commonJS({
    "node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/connection.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.createProtocolConnection = void 0;
      var vscode_jsonrpc_1 = require_main();
      function createProtocolConnection(input, output, logger, options) {
        if (vscode_jsonrpc_1.ConnectionStrategy.is(options)) {
          options = { connectionStrategy: options };
        }
        return vscode_jsonrpc_1.createMessageConnection(input, output, logger, options);
      }
      exports.createProtocolConnection = createProtocolConnection;
    }
  });

  // node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/api.js
  var require_api2 = __commonJS({
    "node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/common/api.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
            __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.LSPErrorCodes = exports.createProtocolConnection = void 0;
      __exportStar(require_main(), exports);
      __exportStar(require_main2(), exports);
      __exportStar(require_messages2(), exports);
      __exportStar(require_protocol(), exports);
      var connection_1 = require_connection2();
      Object.defineProperty(exports, "createProtocolConnection", { enumerable: true, get: function() {
        return connection_1.createProtocolConnection;
      } });
      var LSPErrorCodes;
      (function(LSPErrorCodes2) {
        LSPErrorCodes2.lspReservedErrorRangeStart = -32899;
        LSPErrorCodes2.ContentModified = -32801;
        LSPErrorCodes2.RequestCancelled = -32800;
        LSPErrorCodes2.lspReservedErrorRangeEnd = -32800;
      })(LSPErrorCodes = exports.LSPErrorCodes || (exports.LSPErrorCodes = {}));
    }
  });

  // node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/browser/main.js
  var require_main3 = __commonJS({
    "node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/lib/browser/main.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
            __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.createProtocolConnection = void 0;
      var browser_1 = require_browser();
      __exportStar(require_browser(), exports);
      __exportStar(require_api2(), exports);
      function createProtocolConnection(reader, writer, logger, options) {
        return browser_1.createMessageConnection(reader, writer, logger, options);
      }
      exports.createProtocolConnection = createProtocolConnection;
    }
  });

  // node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/common/semanticTokens.js
  var require_semanticTokens = __commonJS({
    "node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/common/semanticTokens.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SemanticTokensBuilder = exports.SemanticTokensFeature = void 0;
      var vscode_languageserver_protocol_1 = require_main3();
      var SemanticTokensFeature = (Base) => {
        return class extends Base {
          get semanticTokens() {
            return {
              on: (handler) => {
                const type = vscode_languageserver_protocol_1.SemanticTokensRequest.type;
                this.connection.onRequest(type, (params, cancel) => {
                  return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
                });
              },
              onDelta: (handler) => {
                const type = vscode_languageserver_protocol_1.SemanticTokensDeltaRequest.type;
                this.connection.onRequest(type, (params, cancel) => {
                  return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
                });
              },
              onRange: (handler) => {
                const type = vscode_languageserver_protocol_1.SemanticTokensRangeRequest.type;
                this.connection.onRequest(type, (params, cancel) => {
                  return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
                });
              }
            };
          }
        };
      };
      exports.SemanticTokensFeature = SemanticTokensFeature;
      var SemanticTokensBuilder = class {
        constructor() {
          this._prevData = void 0;
          this.initialize();
        }
        initialize() {
          this._id = Date.now();
          this._prevLine = 0;
          this._prevChar = 0;
          this._data = [];
          this._dataLen = 0;
        }
        push(line, char, length, tokenType, tokenModifiers) {
          let pushLine = line;
          let pushChar = char;
          if (this._dataLen > 0) {
            pushLine -= this._prevLine;
            if (pushLine === 0) {
              pushChar -= this._prevChar;
            }
          }
          this._data[this._dataLen++] = pushLine;
          this._data[this._dataLen++] = pushChar;
          this._data[this._dataLen++] = length;
          this._data[this._dataLen++] = tokenType;
          this._data[this._dataLen++] = tokenModifiers;
          this._prevLine = line;
          this._prevChar = char;
        }
        get id() {
          return this._id.toString();
        }
        previousResult(id2) {
          if (this.id === id2) {
            this._prevData = this._data;
          }
          this.initialize();
        }
        build() {
          this._prevData = void 0;
          return {
            resultId: this.id,
            data: this._data
          };
        }
        canBuildEdits() {
          return this._prevData !== void 0;
        }
        buildEdits() {
          if (this._prevData !== void 0) {
            const prevDataLength = this._prevData.length;
            const dataLength = this._data.length;
            let startIndex = 0;
            while (startIndex < dataLength && startIndex < prevDataLength && this._prevData[startIndex] === this._data[startIndex]) {
              startIndex++;
            }
            if (startIndex < dataLength && startIndex < prevDataLength) {
              let endIndex = 0;
              while (endIndex < dataLength && endIndex < prevDataLength && this._prevData[prevDataLength - 1 - endIndex] === this._data[dataLength - 1 - endIndex]) {
                endIndex++;
              }
              const newData = this._data.slice(startIndex, dataLength - endIndex);
              const result = {
                resultId: this.id,
                edits: [
                  { start: startIndex, deleteCount: prevDataLength - endIndex - startIndex, data: newData }
                ]
              };
              return result;
            } else if (startIndex < dataLength) {
              return { resultId: this.id, edits: [
                { start: startIndex, deleteCount: 0, data: this._data.slice(startIndex) }
              ] };
            } else if (startIndex < prevDataLength) {
              return { resultId: this.id, edits: [
                { start: startIndex, deleteCount: prevDataLength - startIndex }
              ] };
            } else {
              return { resultId: this.id, edits: [] };
            }
          } else {
            return this.build();
          }
        }
      };
      exports.SemanticTokensBuilder = SemanticTokensBuilder;
    }
  });

  // node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/common/utils/is.js
  var require_is3 = __commonJS({
    "node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/common/utils/is.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.thenable = exports.typedArray = exports.stringArray = exports.array = exports.func = exports.error = exports.number = exports.string = exports.boolean = void 0;
      function boolean(value) {
        return value === true || value === false;
      }
      exports.boolean = boolean;
      function string(value) {
        return typeof value === "string" || value instanceof String;
      }
      exports.string = string;
      function number(value) {
        return typeof value === "number" || value instanceof Number;
      }
      exports.number = number;
      function error(value) {
        return value instanceof Error;
      }
      exports.error = error;
      function func(value) {
        return typeof value === "function";
      }
      exports.func = func;
      function array(value) {
        return Array.isArray(value);
      }
      exports.array = array;
      function stringArray(value) {
        return array(value) && value.every((elem) => string(elem));
      }
      exports.stringArray = stringArray;
      function typedArray(value, check) {
        return Array.isArray(value) && value.every(check);
      }
      exports.typedArray = typedArray;
      function thenable(value) {
        return value && func(value.then);
      }
      exports.thenable = thenable;
    }
  });

  // node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/common/utils/uuid.js
  var require_uuid = __commonJS({
    "node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/common/utils/uuid.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.generateUuid = exports.parse = exports.isUUID = exports.v4 = exports.empty = void 0;
      var ValueUUID = class {
        constructor(_value) {
          this._value = _value;
        }
        asHex() {
          return this._value;
        }
        equals(other) {
          return this.asHex() === other.asHex();
        }
      };
      var V4UUID = class extends ValueUUID {
        constructor() {
          super([
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            "-",
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            "-",
            "4",
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            "-",
            V4UUID._oneOf(V4UUID._timeHighBits),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            "-",
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex()
          ].join(""));
        }
        static _oneOf(array) {
          return array[Math.floor(array.length * Math.random())];
        }
        static _randomHex() {
          return V4UUID._oneOf(V4UUID._chars);
        }
      };
      V4UUID._chars = ["0", "1", "2", "3", "4", "5", "6", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
      V4UUID._timeHighBits = ["8", "9", "a", "b"];
      exports.empty = new ValueUUID("00000000-0000-0000-0000-000000000000");
      function v4() {
        return new V4UUID();
      }
      exports.v4 = v4;
      var _UUIDPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      function isUUID(value) {
        return _UUIDPattern.test(value);
      }
      exports.isUUID = isUUID;
      function parse(value) {
        if (!isUUID(value)) {
          throw new Error("invalid uuid");
        }
        return new ValueUUID(value);
      }
      exports.parse = parse;
      function generateUuid() {
        return v4().asHex();
      }
      exports.generateUuid = generateUuid;
    }
  });

  // node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/common/progress.js
  var require_progress = __commonJS({
    "node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/common/progress.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.attachPartialResult = exports.ProgressFeature = exports.attachWorkDone = void 0;
      var vscode_languageserver_protocol_1 = require_main3();
      var uuid_1 = require_uuid();
      var WorkDoneProgressReporterImpl = class {
        constructor(_connection, _token) {
          this._connection = _connection;
          this._token = _token;
          WorkDoneProgressReporterImpl.Instances.set(this._token, this);
        }
        begin(title, percentage, message, cancellable) {
          let param = {
            kind: "begin",
            title,
            percentage,
            message,
            cancellable
          };
          this._connection.sendProgress(vscode_languageserver_protocol_1.WorkDoneProgress.type, this._token, param);
        }
        report(arg0, arg1) {
          let param = {
            kind: "report"
          };
          if (typeof arg0 === "number") {
            param.percentage = arg0;
            if (arg1 !== void 0) {
              param.message = arg1;
            }
          } else {
            param.message = arg0;
          }
          this._connection.sendProgress(vscode_languageserver_protocol_1.WorkDoneProgress.type, this._token, param);
        }
        done() {
          WorkDoneProgressReporterImpl.Instances.delete(this._token);
          this._connection.sendProgress(vscode_languageserver_protocol_1.WorkDoneProgress.type, this._token, { kind: "end" });
        }
      };
      WorkDoneProgressReporterImpl.Instances = /* @__PURE__ */ new Map();
      var WorkDoneProgressServerReporterImpl = class extends WorkDoneProgressReporterImpl {
        constructor(connection, token) {
          super(connection, token);
          this._source = new vscode_languageserver_protocol_1.CancellationTokenSource();
        }
        get token() {
          return this._source.token;
        }
        done() {
          this._source.dispose();
          super.done();
        }
        cancel() {
          this._source.cancel();
        }
      };
      var NullProgressReporter = class {
        constructor() {
        }
        begin() {
        }
        report() {
        }
        done() {
        }
      };
      var NullProgressServerReporter = class extends NullProgressReporter {
        constructor() {
          super();
          this._source = new vscode_languageserver_protocol_1.CancellationTokenSource();
        }
        get token() {
          return this._source.token;
        }
        done() {
          this._source.dispose();
        }
        cancel() {
          this._source.cancel();
        }
      };
      function attachWorkDone(connection, params) {
        if (params === void 0 || params.workDoneToken === void 0) {
          return new NullProgressReporter();
        }
        const token = params.workDoneToken;
        delete params.workDoneToken;
        return new WorkDoneProgressReporterImpl(connection, token);
      }
      exports.attachWorkDone = attachWorkDone;
      var ProgressFeature = (Base) => {
        return class extends Base {
          constructor() {
            super();
            this._progressSupported = false;
          }
          initialize(capabilities) {
            var _a2;
            if (((_a2 = capabilities === null || capabilities === void 0 ? void 0 : capabilities.window) === null || _a2 === void 0 ? void 0 : _a2.workDoneProgress) === true) {
              this._progressSupported = true;
              this.connection.onNotification(vscode_languageserver_protocol_1.WorkDoneProgressCancelNotification.type, (params) => {
                let progress = WorkDoneProgressReporterImpl.Instances.get(params.token);
                if (progress instanceof WorkDoneProgressServerReporterImpl || progress instanceof NullProgressServerReporter) {
                  progress.cancel();
                }
              });
            }
          }
          attachWorkDoneProgress(token) {
            if (token === void 0) {
              return new NullProgressReporter();
            } else {
              return new WorkDoneProgressReporterImpl(this.connection, token);
            }
          }
          createWorkDoneProgress() {
            if (this._progressSupported) {
              const token = uuid_1.generateUuid();
              return this.connection.sendRequest(vscode_languageserver_protocol_1.WorkDoneProgressCreateRequest.type, { token }).then(() => {
                const result = new WorkDoneProgressServerReporterImpl(this.connection, token);
                return result;
              });
            } else {
              return Promise.resolve(new NullProgressServerReporter());
            }
          }
        };
      };
      exports.ProgressFeature = ProgressFeature;
      var ResultProgress;
      (function(ResultProgress2) {
        ResultProgress2.type = new vscode_languageserver_protocol_1.ProgressType();
      })(ResultProgress || (ResultProgress = {}));
      var ResultProgressReporterImpl = class {
        constructor(_connection, _token) {
          this._connection = _connection;
          this._token = _token;
        }
        report(data) {
          this._connection.sendProgress(ResultProgress.type, this._token, data);
        }
      };
      function attachPartialResult(connection, params) {
        if (params === void 0 || params.partialResultToken === void 0) {
          return void 0;
        }
        const token = params.partialResultToken;
        delete params.partialResultToken;
        return new ResultProgressReporterImpl(connection, token);
      }
      exports.attachPartialResult = attachPartialResult;
    }
  });

  // node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/common/configuration.js
  var require_configuration = __commonJS({
    "node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/common/configuration.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ConfigurationFeature = void 0;
      var vscode_languageserver_protocol_1 = require_main3();
      var Is = require_is3();
      var ConfigurationFeature = (Base) => {
        return class extends Base {
          getConfiguration(arg) {
            if (!arg) {
              return this._getConfiguration({});
            } else if (Is.string(arg)) {
              return this._getConfiguration({ section: arg });
            } else {
              return this._getConfiguration(arg);
            }
          }
          _getConfiguration(arg) {
            let params = {
              items: Array.isArray(arg) ? arg : [arg]
            };
            return this.connection.sendRequest(vscode_languageserver_protocol_1.ConfigurationRequest.type, params).then((result) => {
              return Array.isArray(arg) ? result : result[0];
            });
          }
        };
      };
      exports.ConfigurationFeature = ConfigurationFeature;
    }
  });

  // node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/common/workspaceFolders.js
  var require_workspaceFolders = __commonJS({
    "node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/common/workspaceFolders.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.WorkspaceFoldersFeature = void 0;
      var vscode_languageserver_protocol_1 = require_main3();
      var WorkspaceFoldersFeature = (Base) => {
        return class extends Base {
          initialize(capabilities) {
            let workspaceCapabilities = capabilities.workspace;
            if (workspaceCapabilities && workspaceCapabilities.workspaceFolders) {
              this._onDidChangeWorkspaceFolders = new vscode_languageserver_protocol_1.Emitter();
              this.connection.onNotification(vscode_languageserver_protocol_1.DidChangeWorkspaceFoldersNotification.type, (params) => {
                this._onDidChangeWorkspaceFolders.fire(params.event);
              });
            }
          }
          getWorkspaceFolders() {
            return this.connection.sendRequest(vscode_languageserver_protocol_1.WorkspaceFoldersRequest.type);
          }
          get onDidChangeWorkspaceFolders() {
            if (!this._onDidChangeWorkspaceFolders) {
              throw new Error("Client doesn't support sending workspace folder change events.");
            }
            if (!this._unregistration) {
              this._unregistration = this.connection.client.register(vscode_languageserver_protocol_1.DidChangeWorkspaceFoldersNotification.type);
            }
            return this._onDidChangeWorkspaceFolders.event;
          }
        };
      };
      exports.WorkspaceFoldersFeature = WorkspaceFoldersFeature;
    }
  });

  // node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/common/callHierarchy.js
  var require_callHierarchy = __commonJS({
    "node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/common/callHierarchy.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.CallHierarchyFeature = void 0;
      var vscode_languageserver_protocol_1 = require_main3();
      var CallHierarchyFeature = (Base) => {
        return class extends Base {
          get callHierarchy() {
            return {
              onPrepare: (handler) => {
                this.connection.onRequest(vscode_languageserver_protocol_1.CallHierarchyPrepareRequest.type, (params, cancel) => {
                  return handler(params, cancel, this.attachWorkDoneProgress(params), void 0);
                });
              },
              onIncomingCalls: (handler) => {
                const type = vscode_languageserver_protocol_1.CallHierarchyIncomingCallsRequest.type;
                this.connection.onRequest(type, (params, cancel) => {
                  return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
                });
              },
              onOutgoingCalls: (handler) => {
                const type = vscode_languageserver_protocol_1.CallHierarchyOutgoingCallsRequest.type;
                this.connection.onRequest(type, (params, cancel) => {
                  return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
                });
              }
            };
          }
        };
      };
      exports.CallHierarchyFeature = CallHierarchyFeature;
    }
  });

  // node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/common/showDocument.js
  var require_showDocument = __commonJS({
    "node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/common/showDocument.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ShowDocumentFeature = void 0;
      var vscode_languageserver_protocol_1 = require_main3();
      var ShowDocumentFeature = (Base) => {
        return class extends Base {
          showDocument(params) {
            return this.connection.sendRequest(vscode_languageserver_protocol_1.ShowDocumentRequest.type, params);
          }
        };
      };
      exports.ShowDocumentFeature = ShowDocumentFeature;
    }
  });

  // node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/common/fileOperations.js
  var require_fileOperations = __commonJS({
    "node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/common/fileOperations.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.FileOperationsFeature = void 0;
      var vscode_languageserver_protocol_1 = require_main3();
      var FileOperationsFeature = (Base) => {
        return class extends Base {
          onDidCreateFiles(handler) {
            this.connection.onNotification(vscode_languageserver_protocol_1.DidCreateFilesNotification.type, (params) => {
              handler(params);
            });
          }
          onDidRenameFiles(handler) {
            this.connection.onNotification(vscode_languageserver_protocol_1.DidRenameFilesNotification.type, (params) => {
              handler(params);
            });
          }
          onDidDeleteFiles(handler) {
            this.connection.onNotification(vscode_languageserver_protocol_1.DidDeleteFilesNotification.type, (params) => {
              handler(params);
            });
          }
          onWillCreateFiles(handler) {
            return this.connection.onRequest(vscode_languageserver_protocol_1.WillCreateFilesRequest.type, (params, cancel) => {
              return handler(params, cancel);
            });
          }
          onWillRenameFiles(handler) {
            return this.connection.onRequest(vscode_languageserver_protocol_1.WillRenameFilesRequest.type, (params, cancel) => {
              return handler(params, cancel);
            });
          }
          onWillDeleteFiles(handler) {
            return this.connection.onRequest(vscode_languageserver_protocol_1.WillDeleteFilesRequest.type, (params, cancel) => {
              return handler(params, cancel);
            });
          }
        };
      };
      exports.FileOperationsFeature = FileOperationsFeature;
    }
  });

  // node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/common/linkedEditingRange.js
  var require_linkedEditingRange = __commonJS({
    "node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/common/linkedEditingRange.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.LinkedEditingRangeFeature = void 0;
      var vscode_languageserver_protocol_1 = require_main3();
      var LinkedEditingRangeFeature = (Base) => {
        return class extends Base {
          onLinkedEditingRange(handler) {
            this.connection.onRequest(vscode_languageserver_protocol_1.LinkedEditingRangeRequest.type, (params, cancel) => {
              return handler(params, cancel, this.attachWorkDoneProgress(params), void 0);
            });
          }
        };
      };
      exports.LinkedEditingRangeFeature = LinkedEditingRangeFeature;
    }
  });

  // node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/common/moniker.js
  var require_moniker = __commonJS({
    "node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/common/moniker.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.MonikerFeature = void 0;
      var vscode_languageserver_protocol_1 = require_main3();
      var MonikerFeature = (Base) => {
        return class extends Base {
          get moniker() {
            return {
              on: (handler) => {
                const type = vscode_languageserver_protocol_1.MonikerRequest.type;
                this.connection.onRequest(type, (params, cancel) => {
                  return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
                });
              }
            };
          }
        };
      };
      exports.MonikerFeature = MonikerFeature;
    }
  });

  // node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/common/server.js
  var require_server = __commonJS({
    "node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/common/server.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.createConnection = exports.combineFeatures = exports.combineLanguagesFeatures = exports.combineWorkspaceFeatures = exports.combineWindowFeatures = exports.combineClientFeatures = exports.combineTracerFeatures = exports.combineTelemetryFeatures = exports.combineConsoleFeatures = exports._LanguagesImpl = exports.BulkUnregistration = exports.BulkRegistration = exports.ErrorMessageTracker = exports.TextDocuments = void 0;
      var vscode_languageserver_protocol_1 = require_main3();
      var Is = require_is3();
      var UUID = require_uuid();
      var progress_1 = require_progress();
      var configuration_1 = require_configuration();
      var workspaceFolders_1 = require_workspaceFolders();
      var callHierarchy_1 = require_callHierarchy();
      var semanticTokens_1 = require_semanticTokens();
      var showDocument_1 = require_showDocument();
      var fileOperations_1 = require_fileOperations();
      var linkedEditingRange_1 = require_linkedEditingRange();
      var moniker_1 = require_moniker();
      function null2Undefined(value) {
        if (value === null) {
          return void 0;
        }
        return value;
      }
      var TextDocuments2 = class {
        constructor(configuration) {
          this._documents = /* @__PURE__ */ Object.create(null);
          this._configuration = configuration;
          this._onDidChangeContent = new vscode_languageserver_protocol_1.Emitter();
          this._onDidOpen = new vscode_languageserver_protocol_1.Emitter();
          this._onDidClose = new vscode_languageserver_protocol_1.Emitter();
          this._onDidSave = new vscode_languageserver_protocol_1.Emitter();
          this._onWillSave = new vscode_languageserver_protocol_1.Emitter();
        }
        get onDidChangeContent() {
          return this._onDidChangeContent.event;
        }
        get onDidOpen() {
          return this._onDidOpen.event;
        }
        get onWillSave() {
          return this._onWillSave.event;
        }
        onWillSaveWaitUntil(handler) {
          this._willSaveWaitUntil = handler;
        }
        get onDidSave() {
          return this._onDidSave.event;
        }
        get onDidClose() {
          return this._onDidClose.event;
        }
        get(uri) {
          return this._documents[uri];
        }
        all() {
          return Object.keys(this._documents).map((key) => this._documents[key]);
        }
        keys() {
          return Object.keys(this._documents);
        }
        listen(connection) {
          connection.__textDocumentSync = vscode_languageserver_protocol_1.TextDocumentSyncKind.Full;
          connection.onDidOpenTextDocument((event) => {
            let td = event.textDocument;
            let document = this._configuration.create(td.uri, td.languageId, td.version, td.text);
            this._documents[td.uri] = document;
            let toFire = Object.freeze({ document });
            this._onDidOpen.fire(toFire);
            this._onDidChangeContent.fire(toFire);
          });
          connection.onDidChangeTextDocument((event) => {
            let td = event.textDocument;
            let changes = event.contentChanges;
            if (changes.length === 0) {
              return;
            }
            let document = this._documents[td.uri];
            const { version } = td;
            if (version === null || version === void 0) {
              throw new Error(`Received document change event for ${td.uri} without valid version identifier`);
            }
            document = this._configuration.update(document, changes, version);
            this._documents[td.uri] = document;
            this._onDidChangeContent.fire(Object.freeze({ document }));
          });
          connection.onDidCloseTextDocument((event) => {
            let document = this._documents[event.textDocument.uri];
            if (document) {
              delete this._documents[event.textDocument.uri];
              this._onDidClose.fire(Object.freeze({ document }));
            }
          });
          connection.onWillSaveTextDocument((event) => {
            let document = this._documents[event.textDocument.uri];
            if (document) {
              this._onWillSave.fire(Object.freeze({ document, reason: event.reason }));
            }
          });
          connection.onWillSaveTextDocumentWaitUntil((event, token) => {
            let document = this._documents[event.textDocument.uri];
            if (document && this._willSaveWaitUntil) {
              return this._willSaveWaitUntil(Object.freeze({ document, reason: event.reason }), token);
            } else {
              return [];
            }
          });
          connection.onDidSaveTextDocument((event) => {
            let document = this._documents[event.textDocument.uri];
            if (document) {
              this._onDidSave.fire(Object.freeze({ document }));
            }
          });
        }
      };
      exports.TextDocuments = TextDocuments2;
      var ErrorMessageTracker = class {
        constructor() {
          this._messages = /* @__PURE__ */ Object.create(null);
        }
        add(message) {
          let count = this._messages[message];
          if (!count) {
            count = 0;
          }
          count++;
          this._messages[message] = count;
        }
        sendErrors(connection) {
          Object.keys(this._messages).forEach((message) => {
            connection.window.showErrorMessage(message);
          });
        }
      };
      exports.ErrorMessageTracker = ErrorMessageTracker;
      var RemoteConsoleImpl = class {
        constructor() {
        }
        rawAttach(connection) {
          this._rawConnection = connection;
        }
        attach(connection) {
          this._connection = connection;
        }
        get connection() {
          if (!this._connection) {
            throw new Error("Remote is not attached to a connection yet.");
          }
          return this._connection;
        }
        fillServerCapabilities(_capabilities) {
        }
        initialize(_capabilities) {
        }
        error(message) {
          this.send(vscode_languageserver_protocol_1.MessageType.Error, message);
        }
        warn(message) {
          this.send(vscode_languageserver_protocol_1.MessageType.Warning, message);
        }
        info(message) {
          this.send(vscode_languageserver_protocol_1.MessageType.Info, message);
        }
        log(message) {
          this.send(vscode_languageserver_protocol_1.MessageType.Log, message);
        }
        send(type, message) {
          if (this._rawConnection) {
            this._rawConnection.sendNotification(vscode_languageserver_protocol_1.LogMessageNotification.type, { type, message });
          }
        }
      };
      var _RemoteWindowImpl = class {
        constructor() {
        }
        attach(connection) {
          this._connection = connection;
        }
        get connection() {
          if (!this._connection) {
            throw new Error("Remote is not attached to a connection yet.");
          }
          return this._connection;
        }
        initialize(_capabilities) {
        }
        fillServerCapabilities(_capabilities) {
        }
        showErrorMessage(message, ...actions) {
          let params = { type: vscode_languageserver_protocol_1.MessageType.Error, message, actions };
          return this.connection.sendRequest(vscode_languageserver_protocol_1.ShowMessageRequest.type, params).then(null2Undefined);
        }
        showWarningMessage(message, ...actions) {
          let params = { type: vscode_languageserver_protocol_1.MessageType.Warning, message, actions };
          return this.connection.sendRequest(vscode_languageserver_protocol_1.ShowMessageRequest.type, params).then(null2Undefined);
        }
        showInformationMessage(message, ...actions) {
          let params = { type: vscode_languageserver_protocol_1.MessageType.Info, message, actions };
          return this.connection.sendRequest(vscode_languageserver_protocol_1.ShowMessageRequest.type, params).then(null2Undefined);
        }
      };
      var RemoteWindowImpl = showDocument_1.ShowDocumentFeature(progress_1.ProgressFeature(_RemoteWindowImpl));
      var BulkRegistration;
      (function(BulkRegistration2) {
        function create() {
          return new BulkRegistrationImpl();
        }
        BulkRegistration2.create = create;
      })(BulkRegistration = exports.BulkRegistration || (exports.BulkRegistration = {}));
      var BulkRegistrationImpl = class {
        constructor() {
          this._registrations = [];
          this._registered = /* @__PURE__ */ new Set();
        }
        add(type, registerOptions) {
          const method = Is.string(type) ? type : type.method;
          if (this._registered.has(method)) {
            throw new Error(`${method} is already added to this registration`);
          }
          const id2 = UUID.generateUuid();
          this._registrations.push({
            id: id2,
            method,
            registerOptions: registerOptions || {}
          });
          this._registered.add(method);
        }
        asRegistrationParams() {
          return {
            registrations: this._registrations
          };
        }
      };
      var BulkUnregistration;
      (function(BulkUnregistration2) {
        function create() {
          return new BulkUnregistrationImpl(void 0, []);
        }
        BulkUnregistration2.create = create;
      })(BulkUnregistration = exports.BulkUnregistration || (exports.BulkUnregistration = {}));
      var BulkUnregistrationImpl = class {
        constructor(_connection, unregistrations) {
          this._connection = _connection;
          this._unregistrations = /* @__PURE__ */ new Map();
          unregistrations.forEach((unregistration) => {
            this._unregistrations.set(unregistration.method, unregistration);
          });
        }
        get isAttached() {
          return !!this._connection;
        }
        attach(connection) {
          this._connection = connection;
        }
        add(unregistration) {
          this._unregistrations.set(unregistration.method, unregistration);
        }
        dispose() {
          let unregistrations = [];
          for (let unregistration of this._unregistrations.values()) {
            unregistrations.push(unregistration);
          }
          let params = {
            unregisterations: unregistrations
          };
          this._connection.sendRequest(vscode_languageserver_protocol_1.UnregistrationRequest.type, params).then(void 0, (_error) => {
            this._connection.console.info(`Bulk unregistration failed.`);
          });
        }
        disposeSingle(arg) {
          const method = Is.string(arg) ? arg : arg.method;
          const unregistration = this._unregistrations.get(method);
          if (!unregistration) {
            return false;
          }
          let params = {
            unregisterations: [unregistration]
          };
          this._connection.sendRequest(vscode_languageserver_protocol_1.UnregistrationRequest.type, params).then(() => {
            this._unregistrations.delete(method);
          }, (_error) => {
            this._connection.console.info(`Un-registering request handler for ${unregistration.id} failed.`);
          });
          return true;
        }
      };
      var RemoteClientImpl = class {
        attach(connection) {
          this._connection = connection;
        }
        get connection() {
          if (!this._connection) {
            throw new Error("Remote is not attached to a connection yet.");
          }
          return this._connection;
        }
        initialize(_capabilities) {
        }
        fillServerCapabilities(_capabilities) {
        }
        register(typeOrRegistrations, registerOptionsOrType, registerOptions) {
          if (typeOrRegistrations instanceof BulkRegistrationImpl) {
            return this.registerMany(typeOrRegistrations);
          } else if (typeOrRegistrations instanceof BulkUnregistrationImpl) {
            return this.registerSingle1(typeOrRegistrations, registerOptionsOrType, registerOptions);
          } else {
            return this.registerSingle2(typeOrRegistrations, registerOptionsOrType);
          }
        }
        registerSingle1(unregistration, type, registerOptions) {
          const method = Is.string(type) ? type : type.method;
          const id2 = UUID.generateUuid();
          let params = {
            registrations: [{ id: id2, method, registerOptions: registerOptions || {} }]
          };
          if (!unregistration.isAttached) {
            unregistration.attach(this.connection);
          }
          return this.connection.sendRequest(vscode_languageserver_protocol_1.RegistrationRequest.type, params).then((_result) => {
            unregistration.add({ id: id2, method });
            return unregistration;
          }, (_error) => {
            this.connection.console.info(`Registering request handler for ${method} failed.`);
            return Promise.reject(_error);
          });
        }
        registerSingle2(type, registerOptions) {
          const method = Is.string(type) ? type : type.method;
          const id2 = UUID.generateUuid();
          let params = {
            registrations: [{ id: id2, method, registerOptions: registerOptions || {} }]
          };
          return this.connection.sendRequest(vscode_languageserver_protocol_1.RegistrationRequest.type, params).then((_result) => {
            return vscode_languageserver_protocol_1.Disposable.create(() => {
              this.unregisterSingle(id2, method);
            });
          }, (_error) => {
            this.connection.console.info(`Registering request handler for ${method} failed.`);
            return Promise.reject(_error);
          });
        }
        unregisterSingle(id2, method) {
          let params = {
            unregisterations: [{ id: id2, method }]
          };
          return this.connection.sendRequest(vscode_languageserver_protocol_1.UnregistrationRequest.type, params).then(void 0, (_error) => {
            this.connection.console.info(`Un-registering request handler for ${id2} failed.`);
          });
        }
        registerMany(registrations) {
          let params = registrations.asRegistrationParams();
          return this.connection.sendRequest(vscode_languageserver_protocol_1.RegistrationRequest.type, params).then(() => {
            return new BulkUnregistrationImpl(this._connection, params.registrations.map((registration) => {
              return { id: registration.id, method: registration.method };
            }));
          }, (_error) => {
            this.connection.console.info(`Bulk registration failed.`);
            return Promise.reject(_error);
          });
        }
      };
      var _RemoteWorkspaceImpl = class {
        constructor() {
        }
        attach(connection) {
          this._connection = connection;
        }
        get connection() {
          if (!this._connection) {
            throw new Error("Remote is not attached to a connection yet.");
          }
          return this._connection;
        }
        initialize(_capabilities) {
        }
        fillServerCapabilities(_capabilities) {
        }
        applyEdit(paramOrEdit) {
          function isApplyWorkspaceEditParams(value) {
            return value && !!value.edit;
          }
          let params = isApplyWorkspaceEditParams(paramOrEdit) ? paramOrEdit : { edit: paramOrEdit };
          return this.connection.sendRequest(vscode_languageserver_protocol_1.ApplyWorkspaceEditRequest.type, params);
        }
      };
      var RemoteWorkspaceImpl = fileOperations_1.FileOperationsFeature(workspaceFolders_1.WorkspaceFoldersFeature(configuration_1.ConfigurationFeature(_RemoteWorkspaceImpl)));
      var TracerImpl = class {
        constructor() {
          this._trace = vscode_languageserver_protocol_1.Trace.Off;
        }
        attach(connection) {
          this._connection = connection;
        }
        get connection() {
          if (!this._connection) {
            throw new Error("Remote is not attached to a connection yet.");
          }
          return this._connection;
        }
        initialize(_capabilities) {
        }
        fillServerCapabilities(_capabilities) {
        }
        set trace(value) {
          this._trace = value;
        }
        log(message, verbose) {
          if (this._trace === vscode_languageserver_protocol_1.Trace.Off) {
            return;
          }
          this.connection.sendNotification(vscode_languageserver_protocol_1.LogTraceNotification.type, {
            message,
            verbose: this._trace === vscode_languageserver_protocol_1.Trace.Verbose ? verbose : void 0
          });
        }
      };
      var TelemetryImpl = class {
        constructor() {
        }
        attach(connection) {
          this._connection = connection;
        }
        get connection() {
          if (!this._connection) {
            throw new Error("Remote is not attached to a connection yet.");
          }
          return this._connection;
        }
        initialize(_capabilities) {
        }
        fillServerCapabilities(_capabilities) {
        }
        logEvent(data) {
          this.connection.sendNotification(vscode_languageserver_protocol_1.TelemetryEventNotification.type, data);
        }
      };
      var _LanguagesImpl = class {
        constructor() {
        }
        attach(connection) {
          this._connection = connection;
        }
        get connection() {
          if (!this._connection) {
            throw new Error("Remote is not attached to a connection yet.");
          }
          return this._connection;
        }
        initialize(_capabilities) {
        }
        fillServerCapabilities(_capabilities) {
        }
        attachWorkDoneProgress(params) {
          return progress_1.attachWorkDone(this.connection, params);
        }
        attachPartialResultProgress(_type, params) {
          return progress_1.attachPartialResult(this.connection, params);
        }
      };
      exports._LanguagesImpl = _LanguagesImpl;
      var LanguagesImpl = moniker_1.MonikerFeature(linkedEditingRange_1.LinkedEditingRangeFeature(semanticTokens_1.SemanticTokensFeature(callHierarchy_1.CallHierarchyFeature(_LanguagesImpl))));
      function combineConsoleFeatures(one, two) {
        return function(Base) {
          return two(one(Base));
        };
      }
      exports.combineConsoleFeatures = combineConsoleFeatures;
      function combineTelemetryFeatures(one, two) {
        return function(Base) {
          return two(one(Base));
        };
      }
      exports.combineTelemetryFeatures = combineTelemetryFeatures;
      function combineTracerFeatures(one, two) {
        return function(Base) {
          return two(one(Base));
        };
      }
      exports.combineTracerFeatures = combineTracerFeatures;
      function combineClientFeatures(one, two) {
        return function(Base) {
          return two(one(Base));
        };
      }
      exports.combineClientFeatures = combineClientFeatures;
      function combineWindowFeatures(one, two) {
        return function(Base) {
          return two(one(Base));
        };
      }
      exports.combineWindowFeatures = combineWindowFeatures;
      function combineWorkspaceFeatures(one, two) {
        return function(Base) {
          return two(one(Base));
        };
      }
      exports.combineWorkspaceFeatures = combineWorkspaceFeatures;
      function combineLanguagesFeatures(one, two) {
        return function(Base) {
          return two(one(Base));
        };
      }
      exports.combineLanguagesFeatures = combineLanguagesFeatures;
      function combineFeatures(one, two) {
        function combine(one2, two2, func) {
          if (one2 && two2) {
            return func(one2, two2);
          } else if (one2) {
            return one2;
          } else {
            return two2;
          }
        }
        let result = {
          __brand: "features",
          console: combine(one.console, two.console, combineConsoleFeatures),
          tracer: combine(one.tracer, two.tracer, combineTracerFeatures),
          telemetry: combine(one.telemetry, two.telemetry, combineTelemetryFeatures),
          client: combine(one.client, two.client, combineClientFeatures),
          window: combine(one.window, two.window, combineWindowFeatures),
          workspace: combine(one.workspace, two.workspace, combineWorkspaceFeatures)
        };
        return result;
      }
      exports.combineFeatures = combineFeatures;
      function createConnection2(connectionFactory, watchDog, factories) {
        const logger = factories && factories.console ? new (factories.console(RemoteConsoleImpl))() : new RemoteConsoleImpl();
        const connection = connectionFactory(logger);
        logger.rawAttach(connection);
        const tracer = factories && factories.tracer ? new (factories.tracer(TracerImpl))() : new TracerImpl();
        const telemetry = factories && factories.telemetry ? new (factories.telemetry(TelemetryImpl))() : new TelemetryImpl();
        const client = factories && factories.client ? new (factories.client(RemoteClientImpl))() : new RemoteClientImpl();
        const remoteWindow = factories && factories.window ? new (factories.window(RemoteWindowImpl))() : new RemoteWindowImpl();
        const workspace = factories && factories.workspace ? new (factories.workspace(RemoteWorkspaceImpl))() : new RemoteWorkspaceImpl();
        const languages = factories && factories.languages ? new (factories.languages(LanguagesImpl))() : new LanguagesImpl();
        const allRemotes = [logger, tracer, telemetry, client, remoteWindow, workspace, languages];
        function asPromise(value) {
          if (value instanceof Promise) {
            return value;
          } else if (Is.thenable(value)) {
            return new Promise((resolve2, reject) => {
              value.then((resolved) => resolve2(resolved), (error) => reject(error));
            });
          } else {
            return Promise.resolve(value);
          }
        }
        let shutdownHandler = void 0;
        let initializeHandler = void 0;
        let exitHandler = void 0;
        let protocolConnection = {
          listen: () => connection.listen(),
          sendRequest: (type, ...params) => connection.sendRequest(Is.string(type) ? type : type.method, ...params),
          onRequest: (type, handler) => connection.onRequest(type, handler),
          sendNotification: (type, param) => {
            const method = Is.string(type) ? type : type.method;
            if (arguments.length === 1) {
              connection.sendNotification(method);
            } else {
              connection.sendNotification(method, param);
            }
          },
          onNotification: (type, handler) => connection.onNotification(type, handler),
          onProgress: connection.onProgress,
          sendProgress: connection.sendProgress,
          onInitialize: (handler) => initializeHandler = handler,
          onInitialized: (handler) => connection.onNotification(vscode_languageserver_protocol_1.InitializedNotification.type, handler),
          onShutdown: (handler) => shutdownHandler = handler,
          onExit: (handler) => exitHandler = handler,
          get console() {
            return logger;
          },
          get telemetry() {
            return telemetry;
          },
          get tracer() {
            return tracer;
          },
          get client() {
            return client;
          },
          get window() {
            return remoteWindow;
          },
          get workspace() {
            return workspace;
          },
          get languages() {
            return languages;
          },
          onDidChangeConfiguration: (handler) => connection.onNotification(vscode_languageserver_protocol_1.DidChangeConfigurationNotification.type, handler),
          onDidChangeWatchedFiles: (handler) => connection.onNotification(vscode_languageserver_protocol_1.DidChangeWatchedFilesNotification.type, handler),
          __textDocumentSync: void 0,
          onDidOpenTextDocument: (handler) => connection.onNotification(vscode_languageserver_protocol_1.DidOpenTextDocumentNotification.type, handler),
          onDidChangeTextDocument: (handler) => connection.onNotification(vscode_languageserver_protocol_1.DidChangeTextDocumentNotification.type, handler),
          onDidCloseTextDocument: (handler) => connection.onNotification(vscode_languageserver_protocol_1.DidCloseTextDocumentNotification.type, handler),
          onWillSaveTextDocument: (handler) => connection.onNotification(vscode_languageserver_protocol_1.WillSaveTextDocumentNotification.type, handler),
          onWillSaveTextDocumentWaitUntil: (handler) => connection.onRequest(vscode_languageserver_protocol_1.WillSaveTextDocumentWaitUntilRequest.type, handler),
          onDidSaveTextDocument: (handler) => connection.onNotification(vscode_languageserver_protocol_1.DidSaveTextDocumentNotification.type, handler),
          sendDiagnostics: (params) => connection.sendNotification(vscode_languageserver_protocol_1.PublishDiagnosticsNotification.type, params),
          onHover: (handler) => connection.onRequest(vscode_languageserver_protocol_1.HoverRequest.type, (params, cancel) => {
            return handler(params, cancel, progress_1.attachWorkDone(connection, params), void 0);
          }),
          onCompletion: (handler) => connection.onRequest(vscode_languageserver_protocol_1.CompletionRequest.type, (params, cancel) => {
            return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
          }),
          onCompletionResolve: (handler) => connection.onRequest(vscode_languageserver_protocol_1.CompletionResolveRequest.type, handler),
          onSignatureHelp: (handler) => connection.onRequest(vscode_languageserver_protocol_1.SignatureHelpRequest.type, (params, cancel) => {
            return handler(params, cancel, progress_1.attachWorkDone(connection, params), void 0);
          }),
          onDeclaration: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DeclarationRequest.type, (params, cancel) => {
            return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
          }),
          onDefinition: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DefinitionRequest.type, (params, cancel) => {
            return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
          }),
          onTypeDefinition: (handler) => connection.onRequest(vscode_languageserver_protocol_1.TypeDefinitionRequest.type, (params, cancel) => {
            return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
          }),
          onImplementation: (handler) => connection.onRequest(vscode_languageserver_protocol_1.ImplementationRequest.type, (params, cancel) => {
            return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
          }),
          onReferences: (handler) => connection.onRequest(vscode_languageserver_protocol_1.ReferencesRequest.type, (params, cancel) => {
            return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
          }),
          onDocumentHighlight: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DocumentHighlightRequest.type, (params, cancel) => {
            return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
          }),
          onDocumentSymbol: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DocumentSymbolRequest.type, (params, cancel) => {
            return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
          }),
          onWorkspaceSymbol: (handler) => connection.onRequest(vscode_languageserver_protocol_1.WorkspaceSymbolRequest.type, (params, cancel) => {
            return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
          }),
          onCodeAction: (handler) => connection.onRequest(vscode_languageserver_protocol_1.CodeActionRequest.type, (params, cancel) => {
            return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
          }),
          onCodeActionResolve: (handler) => connection.onRequest(vscode_languageserver_protocol_1.CodeActionResolveRequest.type, (params, cancel) => {
            return handler(params, cancel);
          }),
          onCodeLens: (handler) => connection.onRequest(vscode_languageserver_protocol_1.CodeLensRequest.type, (params, cancel) => {
            return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
          }),
          onCodeLensResolve: (handler) => connection.onRequest(vscode_languageserver_protocol_1.CodeLensResolveRequest.type, (params, cancel) => {
            return handler(params, cancel);
          }),
          onDocumentFormatting: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DocumentFormattingRequest.type, (params, cancel) => {
            return handler(params, cancel, progress_1.attachWorkDone(connection, params), void 0);
          }),
          onDocumentRangeFormatting: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DocumentRangeFormattingRequest.type, (params, cancel) => {
            return handler(params, cancel, progress_1.attachWorkDone(connection, params), void 0);
          }),
          onDocumentOnTypeFormatting: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DocumentOnTypeFormattingRequest.type, (params, cancel) => {
            return handler(params, cancel);
          }),
          onRenameRequest: (handler) => connection.onRequest(vscode_languageserver_protocol_1.RenameRequest.type, (params, cancel) => {
            return handler(params, cancel, progress_1.attachWorkDone(connection, params), void 0);
          }),
          onPrepareRename: (handler) => connection.onRequest(vscode_languageserver_protocol_1.PrepareRenameRequest.type, (params, cancel) => {
            return handler(params, cancel);
          }),
          onDocumentLinks: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DocumentLinkRequest.type, (params, cancel) => {
            return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
          }),
          onDocumentLinkResolve: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DocumentLinkResolveRequest.type, (params, cancel) => {
            return handler(params, cancel);
          }),
          onDocumentColor: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DocumentColorRequest.type, (params, cancel) => {
            return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
          }),
          onColorPresentation: (handler) => connection.onRequest(vscode_languageserver_protocol_1.ColorPresentationRequest.type, (params, cancel) => {
            return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
          }),
          onFoldingRanges: (handler) => connection.onRequest(vscode_languageserver_protocol_1.FoldingRangeRequest.type, (params, cancel) => {
            return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
          }),
          onSelectionRanges: (handler) => connection.onRequest(vscode_languageserver_protocol_1.SelectionRangeRequest.type, (params, cancel) => {
            return handler(params, cancel, progress_1.attachWorkDone(connection, params), progress_1.attachPartialResult(connection, params));
          }),
          onExecuteCommand: (handler) => connection.onRequest(vscode_languageserver_protocol_1.ExecuteCommandRequest.type, (params, cancel) => {
            return handler(params, cancel, progress_1.attachWorkDone(connection, params), void 0);
          }),
          dispose: () => connection.dispose()
        };
        for (let remote of allRemotes) {
          remote.attach(protocolConnection);
        }
        connection.onRequest(vscode_languageserver_protocol_1.InitializeRequest.type, (params) => {
          watchDog.initialize(params);
          if (Is.string(params.trace)) {
            tracer.trace = vscode_languageserver_protocol_1.Trace.fromString(params.trace);
          }
          for (let remote of allRemotes) {
            remote.initialize(params.capabilities);
          }
          if (initializeHandler) {
            let result = initializeHandler(params, new vscode_languageserver_protocol_1.CancellationTokenSource().token, progress_1.attachWorkDone(connection, params), void 0);
            return asPromise(result).then((value) => {
              if (value instanceof vscode_languageserver_protocol_1.ResponseError) {
                return value;
              }
              let result2 = value;
              if (!result2) {
                result2 = { capabilities: {} };
              }
              let capabilities = result2.capabilities;
              if (!capabilities) {
                capabilities = {};
                result2.capabilities = capabilities;
              }
              if (capabilities.textDocumentSync === void 0 || capabilities.textDocumentSync === null) {
                capabilities.textDocumentSync = Is.number(protocolConnection.__textDocumentSync) ? protocolConnection.__textDocumentSync : vscode_languageserver_protocol_1.TextDocumentSyncKind.None;
              } else if (!Is.number(capabilities.textDocumentSync) && !Is.number(capabilities.textDocumentSync.change)) {
                capabilities.textDocumentSync.change = Is.number(protocolConnection.__textDocumentSync) ? protocolConnection.__textDocumentSync : vscode_languageserver_protocol_1.TextDocumentSyncKind.None;
              }
              for (let remote of allRemotes) {
                remote.fillServerCapabilities(capabilities);
              }
              return result2;
            });
          } else {
            let result = { capabilities: { textDocumentSync: vscode_languageserver_protocol_1.TextDocumentSyncKind.None } };
            for (let remote of allRemotes) {
              remote.fillServerCapabilities(result.capabilities);
            }
            return result;
          }
        });
        connection.onRequest(vscode_languageserver_protocol_1.ShutdownRequest.type, () => {
          watchDog.shutdownReceived = true;
          if (shutdownHandler) {
            return shutdownHandler(new vscode_languageserver_protocol_1.CancellationTokenSource().token);
          } else {
            return void 0;
          }
        });
        connection.onNotification(vscode_languageserver_protocol_1.ExitNotification.type, () => {
          try {
            if (exitHandler) {
              exitHandler();
            }
          } finally {
            if (watchDog.shutdownReceived) {
              watchDog.exit(0);
            } else {
              watchDog.exit(1);
            }
          }
        });
        connection.onNotification(vscode_languageserver_protocol_1.SetTraceNotification.type, (params) => {
          tracer.trace = vscode_languageserver_protocol_1.Trace.fromString(params.value);
        });
        return protocolConnection;
      }
      exports.createConnection = createConnection2;
    }
  });

  // node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/common/api.js
  var require_api3 = __commonJS({
    "node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/common/api.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
            __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ProposedFeatures = exports.SemanticTokensBuilder = void 0;
      var semanticTokens_1 = require_semanticTokens();
      Object.defineProperty(exports, "SemanticTokensBuilder", { enumerable: true, get: function() {
        return semanticTokens_1.SemanticTokensBuilder;
      } });
      __exportStar(require_main3(), exports);
      __exportStar(require_server(), exports);
      var ProposedFeatures2;
      (function(ProposedFeatures3) {
        ProposedFeatures3.all = {
          __brand: "features"
        };
      })(ProposedFeatures2 = exports.ProposedFeatures || (exports.ProposedFeatures = {}));
    }
  });

  // node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/browser.js
  var require_browser2 = __commonJS({
    "node_modules/.pnpm/vscode-languageserver-protocol@3.16.0/node_modules/vscode-languageserver-protocol/browser.js"(exports, module) {
      "use strict";
      module.exports = require_main3();
    }
  });

  // node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/browser/main.js
  var require_main4 = __commonJS({
    "node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/lib/browser/main.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
            __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.createConnection = void 0;
      var api_1 = require_api3();
      __exportStar(require_browser2(), exports);
      __exportStar(require_api3(), exports);
      var _shutdownReceived = false;
      var watchDog = {
        initialize: (_params) => {
        },
        get shutdownReceived() {
          return _shutdownReceived;
        },
        set shutdownReceived(value) {
          _shutdownReceived = value;
        },
        exit: (_code) => {
        }
      };
      function createConnection2(arg1, arg2, arg3, arg4) {
        let factories;
        let reader;
        let writer;
        let options;
        if (arg1 !== void 0 && arg1.__brand === "features") {
          factories = arg1;
          arg1 = arg2;
          arg2 = arg3;
          arg3 = arg4;
        }
        if (api_1.ConnectionStrategy.is(arg1) || api_1.ConnectionOptions.is(arg1)) {
          options = arg1;
        } else {
          reader = arg1;
          writer = arg2;
          options = arg3;
        }
        const connectionFactory = (logger) => {
          return api_1.createProtocolConnection(reader, writer, logger, options);
        };
        return api_1.createConnection(connectionFactory, watchDog, factories);
      }
      exports.createConnection = createConnection2;
    }
  });

  // node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/browser.js
  var require_browser3 = __commonJS({
    "node_modules/.pnpm/vscode-languageserver@7.0.0/node_modules/vscode-languageserver/browser.js"(exports, module) {
      "use strict";
      module.exports = require_main4();
    }
  });

  // polyfills/empty.js
  var require_empty = __commonJS({
    "polyfills/empty.js"() {
      throw new Error("Not available");
    }
  });

  // node_modules/.pnpm/web-tree-sitter@0.20.5/node_modules/web-tree-sitter/tree-sitter.js
  var require_tree_sitter = __commonJS({
    "node_modules/.pnpm/web-tree-sitter@0.20.5/node_modules/web-tree-sitter/tree-sitter.js"(exports, module) {
      var Module = Module !== void 0 ? Module : {};
      var TreeSitter = function() {
        var e, t = typeof window == "object" ? { currentScript: window.document.currentScript } : null;
        class Parser3 {
          constructor() {
            this.initialize();
          }
          initialize() {
            throw new Error("cannot construct a Parser before calling `init()`");
          }
          static init(r) {
            return e || (Module = Object.assign({}, Module, r), e = new Promise((e2) => {
              var r2, n = {};
              for (r2 in Module)
                Module.hasOwnProperty(r2) && (n[r2] = Module[r2]);
              var s, o, _ = [], a = "./this.program", u = function(e3, t2) {
                throw t2;
              }, i = false, l = false;
              i = typeof window == "object", l = typeof importScripts == "function", s = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string", o = !i && !s && !l;
              var d, c, m, f, p, h = "";
              s ? (h = l ? require_empty().dirname(h) + "/" : __dirname + "/", d = function(e3, t2) {
                return f || (f = require_empty()), p || (p = require_empty()), e3 = p.normalize(e3), f.readFileSync(e3, t2 ? null : "utf8");
              }, m = function(e3) {
                var t2 = d(e3, true);
                return t2.buffer || (t2 = new Uint8Array(t2)), k(t2.buffer), t2;
              }, process.argv.length > 1 && (a = process.argv[1].replace(/\\/g, "/")), _ = process.argv.slice(2), typeof module != "undefined" && (module.exports = Module), u = function(e3) {
                process.exit(e3);
              }, Module.inspect = function() {
                return "[Emscripten Module object]";
              }) : o ? (typeof read != "undefined" && (d = function(e3) {
                return read(e3);
              }), m = function(e3) {
                var t2;
                return typeof readbuffer == "function" ? new Uint8Array(readbuffer(e3)) : (k(typeof (t2 = read(e3, "binary")) == "object"), t2);
              }, typeof scriptArgs != "undefined" ? _ = scriptArgs : arguments !== void 0 && (_ = arguments), typeof quit == "function" && (u = function(e3) {
                quit(e3);
              }), typeof print != "undefined" && (typeof console == "undefined" && (console = {}), console.log = print, console.warn = console.error = typeof printErr != "undefined" ? printErr : print)) : (i || l) && (l ? h = self.location.href : t !== void 0 && t.currentScript && (h = t.currentScript.src), h = h.indexOf("blob:") !== 0 ? h.substr(0, h.lastIndexOf("/") + 1) : "", d = function(e3) {
                var t2 = new XMLHttpRequest();
                return t2.open("GET", e3, false), t2.send(null), t2.responseText;
              }, l && (m = function(e3) {
                var t2 = new XMLHttpRequest();
                return t2.open("GET", e3, false), t2.responseType = "arraybuffer", t2.send(null), new Uint8Array(t2.response);
              }), c = function(e3, t2, r3) {
                var n2 = new XMLHttpRequest();
                n2.open("GET", e3, true), n2.responseType = "arraybuffer", n2.onload = function() {
                  n2.status == 200 || n2.status == 0 && n2.response ? t2(n2.response) : r3();
                }, n2.onerror = r3, n2.send(null);
              });
              Module.print || console.log.bind(console);
              var g = Module.printErr || console.warn.bind(console);
              for (r2 in n)
                n.hasOwnProperty(r2) && (Module[r2] = n[r2]);
              n = null, Module.arguments && (_ = Module.arguments), Module.thisProgram && (a = Module.thisProgram), Module.quit && (u = Module.quit);
              var w = 16;
              var y, M = [];
              function b(e3, t2) {
                if (!y) {
                  y = /* @__PURE__ */ new WeakMap();
                  for (var r3 = 0; r3 < K.length; r3++) {
                    var n2 = K.get(r3);
                    n2 && y.set(n2, r3);
                  }
                }
                if (y.has(e3))
                  return y.get(e3);
                var s2 = function() {
                  if (M.length)
                    return M.pop();
                  try {
                    K.grow(1);
                  } catch (e4) {
                    if (!(e4 instanceof RangeError))
                      throw e4;
                    throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
                  }
                  return K.length - 1;
                }();
                try {
                  K.set(s2, e3);
                } catch (r4) {
                  if (!(r4 instanceof TypeError))
                    throw r4;
                  var o2 = function(e4, t3) {
                    if (typeof WebAssembly.Function == "function") {
                      for (var r5 = { i: "i32", j: "i64", f: "f32", d: "f64" }, n3 = { parameters: [], results: t3[0] == "v" ? [] : [r5[t3[0]]] }, s3 = 1; s3 < t3.length; ++s3)
                        n3.parameters.push(r5[t3[s3]]);
                      return new WebAssembly.Function(n3, e4);
                    }
                    var o3 = [1, 0, 1, 96], _2 = t3.slice(0, 1), a2 = t3.slice(1), u2 = { i: 127, j: 126, f: 125, d: 124 };
                    for (o3.push(a2.length), s3 = 0; s3 < a2.length; ++s3)
                      o3.push(u2[a2[s3]]);
                    _2 == "v" ? o3.push(0) : o3 = o3.concat([1, u2[_2]]), o3[1] = o3.length - 2;
                    var i2 = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0].concat(o3, [2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0])), l2 = new WebAssembly.Module(i2);
                    return new WebAssembly.Instance(l2, { e: { f: e4 } }).exports.f;
                  }(e3, t2);
                  K.set(s2, o2);
                }
                return y.set(e3, s2), s2;
              }
              var v, E = function(e3) {
                e3;
              }, I = Module.dynamicLibraries || [];
              Module.wasmBinary && (v = Module.wasmBinary);
              var A, S = Module.noExitRuntime || true;
              function x(e3, t2, r3, n2) {
                switch ((r3 = r3 || "i8").charAt(r3.length - 1) === "*" && (r3 = "i32"), r3) {
                  case "i1":
                  case "i8":
                    R[e3 >> 0] = t2;
                    break;
                  case "i16":
                    L[e3 >> 1] = t2;
                    break;
                  case "i32":
                    W[e3 >> 2] = t2;
                    break;
                  case "i64":
                    ue = [t2 >>> 0, (ae = t2, +Math.abs(ae) >= 1 ? ae > 0 ? (0 | Math.min(+Math.floor(ae / 4294967296), 4294967295)) >>> 0 : ~~+Math.ceil((ae - +(~~ae >>> 0)) / 4294967296) >>> 0 : 0)], W[e3 >> 2] = ue[0], W[e3 + 4 >> 2] = ue[1];
                    break;
                  case "float":
                    O[e3 >> 2] = t2;
                    break;
                  case "double":
                    Z[e3 >> 3] = t2;
                    break;
                  default:
                    oe("invalid type for setValue: " + r3);
                }
              }
              function N(e3, t2, r3) {
                switch ((t2 = t2 || "i8").charAt(t2.length - 1) === "*" && (t2 = "i32"), t2) {
                  case "i1":
                  case "i8":
                    return R[e3 >> 0];
                  case "i16":
                    return L[e3 >> 1];
                  case "i32":
                  case "i64":
                    return W[e3 >> 2];
                  case "float":
                    return O[e3 >> 2];
                  case "double":
                    return Z[e3 >> 3];
                  default:
                    oe("invalid type for getValue: " + t2);
                }
                return null;
              }
              typeof WebAssembly != "object" && oe("no native wasm support detected");
              var P = false;
              function k(e3, t2) {
                e3 || oe("Assertion failed: " + t2);
              }
              var C = 1;
              var q, R, T, L, W, O, Z, F = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : void 0;
              function $(e3, t2, r3) {
                for (var n2 = t2 + r3, s2 = t2; e3[s2] && !(s2 >= n2); )
                  ++s2;
                if (s2 - t2 > 16 && e3.subarray && F)
                  return F.decode(e3.subarray(t2, s2));
                for (var o2 = ""; t2 < s2; ) {
                  var _2 = e3[t2++];
                  if (128 & _2) {
                    var a2 = 63 & e3[t2++];
                    if ((224 & _2) != 192) {
                      var u2 = 63 & e3[t2++];
                      if ((_2 = (240 & _2) == 224 ? (15 & _2) << 12 | a2 << 6 | u2 : (7 & _2) << 18 | a2 << 12 | u2 << 6 | 63 & e3[t2++]) < 65536)
                        o2 += String.fromCharCode(_2);
                      else {
                        var i2 = _2 - 65536;
                        o2 += String.fromCharCode(55296 | i2 >> 10, 56320 | 1023 & i2);
                      }
                    } else
                      o2 += String.fromCharCode((31 & _2) << 6 | a2);
                  } else
                    o2 += String.fromCharCode(_2);
                }
                return o2;
              }
              function j(e3, t2) {
                return e3 ? $(T, e3, t2) : "";
              }
              function U(e3, t2, r3, n2) {
                if (!(n2 > 0))
                  return 0;
                for (var s2 = r3, o2 = r3 + n2 - 1, _2 = 0; _2 < e3.length; ++_2) {
                  var a2 = e3.charCodeAt(_2);
                  if (a2 >= 55296 && a2 <= 57343)
                    a2 = 65536 + ((1023 & a2) << 10) | 1023 & e3.charCodeAt(++_2);
                  if (a2 <= 127) {
                    if (r3 >= o2)
                      break;
                    t2[r3++] = a2;
                  } else if (a2 <= 2047) {
                    if (r3 + 1 >= o2)
                      break;
                    t2[r3++] = 192 | a2 >> 6, t2[r3++] = 128 | 63 & a2;
                  } else if (a2 <= 65535) {
                    if (r3 + 2 >= o2)
                      break;
                    t2[r3++] = 224 | a2 >> 12, t2[r3++] = 128 | a2 >> 6 & 63, t2[r3++] = 128 | 63 & a2;
                  } else {
                    if (r3 + 3 >= o2)
                      break;
                    t2[r3++] = 240 | a2 >> 18, t2[r3++] = 128 | a2 >> 12 & 63, t2[r3++] = 128 | a2 >> 6 & 63, t2[r3++] = 128 | 63 & a2;
                  }
                }
                return t2[r3] = 0, r3 - s2;
              }
              function D(e3, t2, r3) {
                return U(e3, T, t2, r3);
              }
              function z(e3) {
                for (var t2 = 0, r3 = 0; r3 < e3.length; ++r3) {
                  var n2 = e3.charCodeAt(r3);
                  n2 >= 55296 && n2 <= 57343 && (n2 = 65536 + ((1023 & n2) << 10) | 1023 & e3.charCodeAt(++r3)), n2 <= 127 ? ++t2 : t2 += n2 <= 2047 ? 2 : n2 <= 65535 ? 3 : 4;
                }
                return t2;
              }
              function G(e3) {
                var t2 = z(e3) + 1, r3 = ze(t2);
                return U(e3, R, r3, t2), r3;
              }
              function H(e3) {
                q = e3, Module.HEAP8 = R = new Int8Array(e3), Module.HEAP16 = L = new Int16Array(e3), Module.HEAP32 = W = new Int32Array(e3), Module.HEAPU8 = T = new Uint8Array(e3), Module.HEAPU16 = new Uint16Array(e3), Module.HEAPU32 = new Uint32Array(e3), Module.HEAPF32 = O = new Float32Array(e3), Module.HEAPF64 = Z = new Float64Array(e3);
              }
              var B = Module.INITIAL_MEMORY || 33554432;
              (A = Module.wasmMemory ? Module.wasmMemory : new WebAssembly.Memory({ initial: B / 65536, maximum: 32768 })) && (q = A.buffer), B = q.byteLength, H(q);
              var K = new WebAssembly.Table({ initial: 17, element: "anyfunc" }), V = [], X = [], Q = [], J = [], Y = false;
              var ee = 0, te = null, re = null;
              function ne(e3) {
                ee++, Module.monitorRunDependencies && Module.monitorRunDependencies(ee);
              }
              function se(e3) {
                if (ee--, Module.monitorRunDependencies && Module.monitorRunDependencies(ee), ee == 0 && (te !== null && (clearInterval(te), te = null), re)) {
                  var t2 = re;
                  re = null, t2();
                }
              }
              function oe(e3) {
                throw Module.onAbort && Module.onAbort(e3), g(e3 += ""), P = true, 1, e3 = "abort(" + e3 + "). Build with -s ASSERTIONS=1 for more info.", new WebAssembly.RuntimeError(e3);
              }
              Module.preloadedImages = {}, Module.preloadedAudios = {}, Module.preloadedWasm = {};
              var _e, ae, ue, ie = "data:application/octet-stream;base64,";
              function le(e3) {
                return e3.startsWith(ie);
              }
              function de(e3) {
                return e3.startsWith("file://");
              }
              function ce(e3) {
                try {
                  if (e3 == _e && v)
                    return new Uint8Array(v);
                  if (m)
                    return m(e3);
                  throw "both async and sync fetching of the wasm failed";
                } catch (e4) {
                  oe(e4);
                }
              }
              le(_e = "tree-sitter.wasm") || (_e = function(e3) {
                return Module.locateFile ? Module.locateFile(e3, h) : h + e3;
              }(_e));
              var me = {}, fe = { get: function(e3, t2) {
                return me[t2] || (me[t2] = new WebAssembly.Global({ value: "i32", mutable: true })), me[t2];
              } };
              function pe(e3) {
                for (; e3.length > 0; ) {
                  var t2 = e3.shift();
                  if (typeof t2 != "function") {
                    var r3 = t2.func;
                    typeof r3 == "number" ? t2.arg === void 0 ? K.get(r3)() : K.get(r3)(t2.arg) : r3(t2.arg === void 0 ? null : t2.arg);
                  } else
                    t2(Module);
                }
              }
              function he(e3) {
                var t2 = 0;
                function r3() {
                  for (var r4 = 0, n3 = 1; ; ) {
                    var s3 = e3[t2++];
                    if (r4 += (127 & s3) * n3, n3 *= 128, !(128 & s3))
                      break;
                  }
                  return r4;
                }
                if (e3 instanceof WebAssembly.Module) {
                  var n2 = WebAssembly.Module.customSections(e3, "dylink");
                  k(n2.length != 0, "need dylink section"), e3 = new Int8Array(n2[0]);
                } else {
                  k(new Uint32Array(new Uint8Array(e3.subarray(0, 24)).buffer)[0] == 1836278016, "need to see wasm magic number"), k(e3[8] === 0, "need the dylink section to be first"), t2 = 9, r3(), k(e3[t2] === 6), k(e3[++t2] === "d".charCodeAt(0)), k(e3[++t2] === "y".charCodeAt(0)), k(e3[++t2] === "l".charCodeAt(0)), k(e3[++t2] === "i".charCodeAt(0)), k(e3[++t2] === "n".charCodeAt(0)), k(e3[++t2] === "k".charCodeAt(0)), t2++;
                }
                var s2 = {};
                s2.memorySize = r3(), s2.memoryAlign = r3(), s2.tableSize = r3(), s2.tableAlign = r3();
                var o2 = r3();
                s2.neededDynlibs = [];
                for (var _2 = 0; _2 < o2; ++_2) {
                  var a2 = r3(), u2 = e3.subarray(t2, t2 + a2);
                  t2 += a2;
                  var i2 = $(u2, 0);
                  s2.neededDynlibs.push(i2);
                }
                return s2;
              }
              var ge = 0;
              function we() {
                return S || ge > 0;
              }
              function ye(e3) {
                return e3.indexOf("dynCall_") == 0 || ["stackAlloc", "stackSave", "stackRestore"].includes(e3) ? e3 : "_" + e3;
              }
              function Me(e3, t2) {
                for (var r3 in e3)
                  if (e3.hasOwnProperty(r3)) {
                    Fe.hasOwnProperty(r3) || (Fe[r3] = e3[r3]);
                    var n2 = ye(r3);
                    Module.hasOwnProperty(n2) || (Module[n2] = e3[r3]);
                  }
              }
              var be = { nextHandle: 1, loadedLibs: {}, loadedLibNames: {} };
              function ve(e3, t2, r3) {
                return e3.includes("j") ? function(e4, t3, r4) {
                  var n2 = Module["dynCall_" + e4];
                  return r4 && r4.length ? n2.apply(null, [t3].concat(r4)) : n2.call(null, t3);
                }(e3, t2, r3) : K.get(t2).apply(null, r3);
              }
              var Ee = 5250880;
              function Ie(e3) {
                return ["__cpp_exception", "__wasm_apply_data_relocs", "__dso_handle", "__set_stack_limits"].includes(e3);
              }
              function Ae(e3, t2) {
                var r3 = {};
                for (var n2 in e3) {
                  var s2 = e3[n2];
                  typeof s2 == "object" && (s2 = s2.value), typeof s2 == "number" && (s2 += t2), r3[n2] = s2;
                }
                return function(e4) {
                  for (var t3 in e4)
                    if (!Ie(t3)) {
                      var r4 = false, n3 = e4[t3];
                      t3.startsWith("orig$") && (t3 = t3.split("$")[1], r4 = true), me[t3] || (me[t3] = new WebAssembly.Global({ value: "i32", mutable: true })), (r4 || me[t3].value == 0) && (typeof n3 == "function" ? me[t3].value = b(n3) : typeof n3 == "number" ? me[t3].value = n3 : g("unhandled export type for `" + t3 + "`: " + typeof n3));
                    }
                }(r3), r3;
              }
              function Se(e3, t2) {
                var r3, n2;
                return t2 && (r3 = Fe["orig$" + e3]), r3 || (r3 = Fe[e3]), r3 || (r3 = Module[ye(e3)]), !r3 && e3.startsWith("invoke_") && (n2 = e3.split("_")[1], r3 = function() {
                  var e4 = Ue();
                  try {
                    return ve(n2, arguments[0], Array.prototype.slice.call(arguments, 1));
                  } catch (t3) {
                    if (De(e4), t3 !== t3 + 0 && t3 !== "longjmp")
                      throw t3;
                    Ge(1, 0);
                  }
                }), r3;
              }
              function xe(e3, t2) {
                var r3 = he(e3);
                function n2() {
                  var n3 = Math.pow(2, r3.memoryAlign);
                  n3 = Math.max(n3, w);
                  var s2, o2, _2, a2 = (s2 = function(e4) {
                    if (Y)
                      return $e(e4);
                    var t3 = Ee, r4 = t3 + e4 + 15 & -16;
                    return Ee = r4, me.__heap_base.value = r4, t3;
                  }(r3.memorySize + n3), (o2 = n3) || (o2 = w), Math.ceil(s2 / o2) * o2), u2 = K.length;
                  K.grow(r3.tableSize);
                  for (var i2 = a2; i2 < a2 + r3.memorySize; i2++)
                    R[i2] = 0;
                  for (i2 = u2; i2 < u2 + r3.tableSize; i2++)
                    K.set(i2, null);
                  var l2 = new Proxy({}, { get: function(e4, t3) {
                    switch (t3) {
                      case "__memory_base":
                        return a2;
                      case "__table_base":
                        return u2;
                    }
                    if (t3 in Fe)
                      return Fe[t3];
                    var r4;
                    t3 in e4 || (e4[t3] = function() {
                      return r4 || (r4 = function(e5) {
                        var t4 = Se(e5, false);
                        return t4 || (t4 = _2[e5]), t4;
                      }(t3)), r4.apply(null, arguments);
                    });
                    return e4[t3];
                  } }), d2 = { "GOT.mem": new Proxy({}, fe), "GOT.func": new Proxy({}, fe), env: l2, wasi_snapshot_preview1: l2 };
                  function c2(e4) {
                    for (var n4 = 0; n4 < r3.tableSize; n4++) {
                      var s3 = K.get(u2 + n4);
                      s3 && y.set(s3, u2 + n4);
                    }
                    _2 = Ae(e4.exports, a2), t2.allowUndefined || Pe();
                    var o3 = _2.__wasm_call_ctors;
                    return o3 || (o3 = _2.__post_instantiate), o3 && (Y ? o3() : X.push(o3)), _2;
                  }
                  if (t2.loadAsync) {
                    if (e3 instanceof WebAssembly.Module) {
                      var m2 = new WebAssembly.Instance(e3, d2);
                      return Promise.resolve(c2(m2));
                    }
                    return WebAssembly.instantiate(e3, d2).then(function(e4) {
                      return c2(e4.instance);
                    });
                  }
                  var f2 = e3 instanceof WebAssembly.Module ? e3 : new WebAssembly.Module(e3);
                  return c2(m2 = new WebAssembly.Instance(f2, d2));
                }
                return t2.loadAsync ? r3.neededDynlibs.reduce(function(e4, r4) {
                  return e4.then(function() {
                    return Ne(r4, t2);
                  });
                }, Promise.resolve()).then(function() {
                  return n2();
                }) : (r3.neededDynlibs.forEach(function(e4) {
                  Ne(e4, t2);
                }), n2());
              }
              function Ne(e3, t2) {
                e3 != "__main__" || be.loadedLibNames[e3] || (be.loadedLibs[-1] = { refcount: 1 / 0, name: "__main__", module: Module.asm, global: true }, be.loadedLibNames.__main__ = -1), t2 = t2 || { global: true, nodelete: true };
                var r3, n2 = be.loadedLibNames[e3];
                if (n2)
                  return r3 = be.loadedLibs[n2], t2.global && !r3.global && (r3.global = true, r3.module !== "loading" && Me(r3.module)), t2.nodelete && r3.refcount !== 1 / 0 && (r3.refcount = 1 / 0), r3.refcount++, t2.loadAsync ? Promise.resolve(n2) : n2;
                function s2(e4) {
                  if (t2.fs) {
                    var r4 = t2.fs.readFile(e4, { encoding: "binary" });
                    return r4 instanceof Uint8Array || (r4 = new Uint8Array(r4)), t2.loadAsync ? Promise.resolve(r4) : r4;
                  }
                  return t2.loadAsync ? (n3 = e4, fetch(n3, { credentials: "same-origin" }).then(function(e5) {
                    if (!e5.ok)
                      throw "failed to load binary file at '" + n3 + "'";
                    return e5.arrayBuffer();
                  }).then(function(e5) {
                    return new Uint8Array(e5);
                  })) : m(e4);
                  var n3;
                }
                function o2() {
                  if (Module.preloadedWasm !== void 0 && Module.preloadedWasm[e3] !== void 0) {
                    var r4 = Module.preloadedWasm[e3];
                    return t2.loadAsync ? Promise.resolve(r4) : r4;
                  }
                  return t2.loadAsync ? s2(e3).then(function(e4) {
                    return xe(e4, t2);
                  }) : xe(s2(e3), t2);
                }
                function _2(e4) {
                  r3.global && Me(e4), r3.module = e4;
                }
                return n2 = be.nextHandle++, r3 = { refcount: t2.nodelete ? 1 / 0 : 1, name: e3, module: "loading", global: t2.global }, be.loadedLibNames[e3] = n2, be.loadedLibs[n2] = r3, t2.loadAsync ? o2().then(function(e4) {
                  return _2(e4), n2;
                }) : (_2(o2()), n2);
              }
              function Pe() {
                for (var e3 in me)
                  if (me[e3].value == 0) {
                    var t2 = Se(e3, true);
                    typeof t2 == "function" ? me[e3].value = b(t2, t2.sig) : typeof t2 == "number" ? me[e3].value = t2 : k(false, "bad export type for `" + e3 + "`: " + typeof t2);
                  }
              }
              Module.___heap_base = Ee;
              var ke, Ce = new WebAssembly.Global({ value: "i32", mutable: true }, 5250880);
              function qe() {
                oe();
              }
              Module._abort = qe, qe.sig = "v", ke = s ? function() {
                var e3 = process.hrtime();
                return 1e3 * e3[0] + e3[1] / 1e6;
              } : typeof dateNow != "undefined" ? dateNow : function() {
                return performance.now();
              };
              var Re = true;
              function Te(e3, t2) {
                var r3, n2;
                if (e3 === 0)
                  r3 = Date.now();
                else {
                  if (e3 !== 1 && e3 !== 4 || !Re)
                    return n2 = 28, W[je() >> 2] = n2, -1;
                  r3 = ke();
                }
                return W[t2 >> 2] = r3 / 1e3 | 0, W[t2 + 4 >> 2] = r3 % 1e3 * 1e3 * 1e3 | 0, 0;
              }
              function Le(e3) {
                try {
                  return A.grow(e3 - q.byteLength + 65535 >>> 16), H(A.buffer), 1;
                } catch (e4) {
                }
              }
              function We(e3) {
                Ve(e3);
              }
              function Oe(e3) {
                E(e3);
              }
              Te.sig = "iii", We.sig = "vi", Oe.sig = "vi";
              var Ze, Fe = { __heap_base: Ee, __indirect_function_table: K, __memory_base: 1024, __stack_pointer: Ce, __table_base: 1, abort: qe, clock_gettime: Te, emscripten_memcpy_big: function(e3, t2, r3) {
                T.copyWithin(e3, t2, t2 + r3);
              }, emscripten_resize_heap: function(e3) {
                var t2, r3, n2 = T.length;
                if ((e3 >>>= 0) > 2147483648)
                  return false;
                for (var s2 = 1; s2 <= 4; s2 *= 2) {
                  var o2 = n2 * (1 + 0.2 / s2);
                  if (o2 = Math.min(o2, e3 + 100663296), Le(Math.min(2147483648, ((t2 = Math.max(e3, o2)) % (r3 = 65536) > 0 && (t2 += r3 - t2 % r3), t2))))
                    return true;
                }
                return false;
              }, exit: We, memory: A, setTempRet0: Oe, tree_sitter_log_callback: function(e3, t2) {
                if (ct) {
                  const r3 = j(t2);
                  ct(r3, e3 !== 0);
                }
              }, tree_sitter_parse_callback: function(e3, t2, r3, n2, s2) {
                var o2 = dt(t2, { row: r3, column: n2 });
                typeof o2 == "string" ? (x(s2, o2.length, "i32"), function(e4, t3, r4) {
                  if (r4 === void 0 && (r4 = 2147483647), r4 < 2)
                    return 0;
                  for (var n3 = (r4 -= 2) < 2 * e4.length ? r4 / 2 : e4.length, s3 = 0; s3 < n3; ++s3) {
                    var o3 = e4.charCodeAt(s3);
                    L[t3 >> 1] = o3, t3 += 2;
                  }
                  L[t3 >> 1] = 0;
                }(o2, e3, 10240)) : x(s2, 0, "i32");
              } }, $e = (function() {
                var e3 = { env: Fe, wasi_snapshot_preview1: Fe, "GOT.mem": new Proxy(Fe, fe), "GOT.func": new Proxy(Fe, fe) };
                function t2(e4, t3) {
                  var r4 = e4.exports;
                  r4 = Ae(r4, 1024), Module.asm = r4;
                  var n3, s2 = he(t3);
                  s2.neededDynlibs && (I = s2.neededDynlibs.concat(I)), Me(r4), n3 = Module.asm.__wasm_call_ctors, X.unshift(n3), se();
                }
                function r3(e4) {
                  t2(e4.instance, e4.module);
                }
                function n2(t3) {
                  return function() {
                    if (!v && (i || l)) {
                      if (typeof fetch == "function" && !de(_e))
                        return fetch(_e, { credentials: "same-origin" }).then(function(e4) {
                          if (!e4.ok)
                            throw "failed to load wasm binary file at '" + _e + "'";
                          return e4.arrayBuffer();
                        }).catch(function() {
                          return ce(_e);
                        });
                      if (c)
                        return new Promise(function(e4, t4) {
                          c(_e, function(t5) {
                            e4(new Uint8Array(t5));
                          }, t4);
                        });
                    }
                    return Promise.resolve().then(function() {
                      return ce(_e);
                    });
                  }().then(function(t4) {
                    return WebAssembly.instantiate(t4, e3);
                  }).then(t3, function(e4) {
                    g("failed to asynchronously prepare wasm: " + e4), oe(e4);
                  });
                }
                if (ne(), Module.instantiateWasm)
                  try {
                    return Module.instantiateWasm(e3, t2);
                  } catch (e4) {
                    return g("Module.instantiateWasm callback failed with error: " + e4), false;
                  }
                v || typeof WebAssembly.instantiateStreaming != "function" || le(_e) || de(_e) || typeof fetch != "function" ? n2(r3) : fetch(_e, { credentials: "same-origin" }).then(function(t3) {
                  return WebAssembly.instantiateStreaming(t3, e3).then(r3, function(e4) {
                    return g("wasm streaming compile failed: " + e4), g("falling back to ArrayBuffer instantiation"), n2(r3);
                  });
                });
              }(), Module.___wasm_call_ctors = function() {
                return (Module.___wasm_call_ctors = Module.asm.__wasm_call_ctors).apply(null, arguments);
              }, Module._malloc = function() {
                return ($e = Module._malloc = Module.asm.malloc).apply(null, arguments);
              }), je = (Module._calloc = function() {
                return (Module._calloc = Module.asm.calloc).apply(null, arguments);
              }, Module._realloc = function() {
                return (Module._realloc = Module.asm.realloc).apply(null, arguments);
              }, Module._free = function() {
                return (Module._free = Module.asm.free).apply(null, arguments);
              }, Module._ts_language_symbol_count = function() {
                return (Module._ts_language_symbol_count = Module.asm.ts_language_symbol_count).apply(null, arguments);
              }, Module._ts_language_version = function() {
                return (Module._ts_language_version = Module.asm.ts_language_version).apply(null, arguments);
              }, Module._ts_language_field_count = function() {
                return (Module._ts_language_field_count = Module.asm.ts_language_field_count).apply(null, arguments);
              }, Module._ts_language_symbol_name = function() {
                return (Module._ts_language_symbol_name = Module.asm.ts_language_symbol_name).apply(null, arguments);
              }, Module._ts_language_symbol_for_name = function() {
                return (Module._ts_language_symbol_for_name = Module.asm.ts_language_symbol_for_name).apply(null, arguments);
              }, Module._ts_language_symbol_type = function() {
                return (Module._ts_language_symbol_type = Module.asm.ts_language_symbol_type).apply(null, arguments);
              }, Module._ts_language_field_name_for_id = function() {
                return (Module._ts_language_field_name_for_id = Module.asm.ts_language_field_name_for_id).apply(null, arguments);
              }, Module._memcpy = function() {
                return (Module._memcpy = Module.asm.memcpy).apply(null, arguments);
              }, Module._ts_parser_delete = function() {
                return (Module._ts_parser_delete = Module.asm.ts_parser_delete).apply(null, arguments);
              }, Module._ts_parser_reset = function() {
                return (Module._ts_parser_reset = Module.asm.ts_parser_reset).apply(null, arguments);
              }, Module._ts_parser_set_language = function() {
                return (Module._ts_parser_set_language = Module.asm.ts_parser_set_language).apply(null, arguments);
              }, Module._ts_parser_timeout_micros = function() {
                return (Module._ts_parser_timeout_micros = Module.asm.ts_parser_timeout_micros).apply(null, arguments);
              }, Module._ts_parser_set_timeout_micros = function() {
                return (Module._ts_parser_set_timeout_micros = Module.asm.ts_parser_set_timeout_micros).apply(null, arguments);
              }, Module._memmove = function() {
                return (Module._memmove = Module.asm.memmove).apply(null, arguments);
              }, Module._memcmp = function() {
                return (Module._memcmp = Module.asm.memcmp).apply(null, arguments);
              }, Module._ts_query_new = function() {
                return (Module._ts_query_new = Module.asm.ts_query_new).apply(null, arguments);
              }, Module._ts_query_delete = function() {
                return (Module._ts_query_delete = Module.asm.ts_query_delete).apply(null, arguments);
              }, Module._iswspace = function() {
                return (Module._iswspace = Module.asm.iswspace).apply(null, arguments);
              }, Module._iswalnum = function() {
                return (Module._iswalnum = Module.asm.iswalnum).apply(null, arguments);
              }, Module._ts_query_pattern_count = function() {
                return (Module._ts_query_pattern_count = Module.asm.ts_query_pattern_count).apply(null, arguments);
              }, Module._ts_query_capture_count = function() {
                return (Module._ts_query_capture_count = Module.asm.ts_query_capture_count).apply(null, arguments);
              }, Module._ts_query_string_count = function() {
                return (Module._ts_query_string_count = Module.asm.ts_query_string_count).apply(null, arguments);
              }, Module._ts_query_capture_name_for_id = function() {
                return (Module._ts_query_capture_name_for_id = Module.asm.ts_query_capture_name_for_id).apply(null, arguments);
              }, Module._ts_query_string_value_for_id = function() {
                return (Module._ts_query_string_value_for_id = Module.asm.ts_query_string_value_for_id).apply(null, arguments);
              }, Module._ts_query_predicates_for_pattern = function() {
                return (Module._ts_query_predicates_for_pattern = Module.asm.ts_query_predicates_for_pattern).apply(null, arguments);
              }, Module._ts_tree_copy = function() {
                return (Module._ts_tree_copy = Module.asm.ts_tree_copy).apply(null, arguments);
              }, Module._ts_tree_delete = function() {
                return (Module._ts_tree_delete = Module.asm.ts_tree_delete).apply(null, arguments);
              }, Module._ts_init = function() {
                return (Module._ts_init = Module.asm.ts_init).apply(null, arguments);
              }, Module._ts_parser_new_wasm = function() {
                return (Module._ts_parser_new_wasm = Module.asm.ts_parser_new_wasm).apply(null, arguments);
              }, Module._ts_parser_enable_logger_wasm = function() {
                return (Module._ts_parser_enable_logger_wasm = Module.asm.ts_parser_enable_logger_wasm).apply(null, arguments);
              }, Module._ts_parser_parse_wasm = function() {
                return (Module._ts_parser_parse_wasm = Module.asm.ts_parser_parse_wasm).apply(null, arguments);
              }, Module._ts_language_type_is_named_wasm = function() {
                return (Module._ts_language_type_is_named_wasm = Module.asm.ts_language_type_is_named_wasm).apply(null, arguments);
              }, Module._ts_language_type_is_visible_wasm = function() {
                return (Module._ts_language_type_is_visible_wasm = Module.asm.ts_language_type_is_visible_wasm).apply(null, arguments);
              }, Module._ts_tree_root_node_wasm = function() {
                return (Module._ts_tree_root_node_wasm = Module.asm.ts_tree_root_node_wasm).apply(null, arguments);
              }, Module._ts_tree_edit_wasm = function() {
                return (Module._ts_tree_edit_wasm = Module.asm.ts_tree_edit_wasm).apply(null, arguments);
              }, Module._ts_tree_get_changed_ranges_wasm = function() {
                return (Module._ts_tree_get_changed_ranges_wasm = Module.asm.ts_tree_get_changed_ranges_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_new_wasm = function() {
                return (Module._ts_tree_cursor_new_wasm = Module.asm.ts_tree_cursor_new_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_delete_wasm = function() {
                return (Module._ts_tree_cursor_delete_wasm = Module.asm.ts_tree_cursor_delete_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_reset_wasm = function() {
                return (Module._ts_tree_cursor_reset_wasm = Module.asm.ts_tree_cursor_reset_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_goto_first_child_wasm = function() {
                return (Module._ts_tree_cursor_goto_first_child_wasm = Module.asm.ts_tree_cursor_goto_first_child_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_goto_next_sibling_wasm = function() {
                return (Module._ts_tree_cursor_goto_next_sibling_wasm = Module.asm.ts_tree_cursor_goto_next_sibling_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_goto_parent_wasm = function() {
                return (Module._ts_tree_cursor_goto_parent_wasm = Module.asm.ts_tree_cursor_goto_parent_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_current_node_type_id_wasm = function() {
                return (Module._ts_tree_cursor_current_node_type_id_wasm = Module.asm.ts_tree_cursor_current_node_type_id_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_current_node_is_named_wasm = function() {
                return (Module._ts_tree_cursor_current_node_is_named_wasm = Module.asm.ts_tree_cursor_current_node_is_named_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_current_node_is_missing_wasm = function() {
                return (Module._ts_tree_cursor_current_node_is_missing_wasm = Module.asm.ts_tree_cursor_current_node_is_missing_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_current_node_id_wasm = function() {
                return (Module._ts_tree_cursor_current_node_id_wasm = Module.asm.ts_tree_cursor_current_node_id_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_start_position_wasm = function() {
                return (Module._ts_tree_cursor_start_position_wasm = Module.asm.ts_tree_cursor_start_position_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_end_position_wasm = function() {
                return (Module._ts_tree_cursor_end_position_wasm = Module.asm.ts_tree_cursor_end_position_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_start_index_wasm = function() {
                return (Module._ts_tree_cursor_start_index_wasm = Module.asm.ts_tree_cursor_start_index_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_end_index_wasm = function() {
                return (Module._ts_tree_cursor_end_index_wasm = Module.asm.ts_tree_cursor_end_index_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_current_field_id_wasm = function() {
                return (Module._ts_tree_cursor_current_field_id_wasm = Module.asm.ts_tree_cursor_current_field_id_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_current_node_wasm = function() {
                return (Module._ts_tree_cursor_current_node_wasm = Module.asm.ts_tree_cursor_current_node_wasm).apply(null, arguments);
              }, Module._ts_node_symbol_wasm = function() {
                return (Module._ts_node_symbol_wasm = Module.asm.ts_node_symbol_wasm).apply(null, arguments);
              }, Module._ts_node_child_count_wasm = function() {
                return (Module._ts_node_child_count_wasm = Module.asm.ts_node_child_count_wasm).apply(null, arguments);
              }, Module._ts_node_named_child_count_wasm = function() {
                return (Module._ts_node_named_child_count_wasm = Module.asm.ts_node_named_child_count_wasm).apply(null, arguments);
              }, Module._ts_node_child_wasm = function() {
                return (Module._ts_node_child_wasm = Module.asm.ts_node_child_wasm).apply(null, arguments);
              }, Module._ts_node_named_child_wasm = function() {
                return (Module._ts_node_named_child_wasm = Module.asm.ts_node_named_child_wasm).apply(null, arguments);
              }, Module._ts_node_child_by_field_id_wasm = function() {
                return (Module._ts_node_child_by_field_id_wasm = Module.asm.ts_node_child_by_field_id_wasm).apply(null, arguments);
              }, Module._ts_node_next_sibling_wasm = function() {
                return (Module._ts_node_next_sibling_wasm = Module.asm.ts_node_next_sibling_wasm).apply(null, arguments);
              }, Module._ts_node_prev_sibling_wasm = function() {
                return (Module._ts_node_prev_sibling_wasm = Module.asm.ts_node_prev_sibling_wasm).apply(null, arguments);
              }, Module._ts_node_next_named_sibling_wasm = function() {
                return (Module._ts_node_next_named_sibling_wasm = Module.asm.ts_node_next_named_sibling_wasm).apply(null, arguments);
              }, Module._ts_node_prev_named_sibling_wasm = function() {
                return (Module._ts_node_prev_named_sibling_wasm = Module.asm.ts_node_prev_named_sibling_wasm).apply(null, arguments);
              }, Module._ts_node_parent_wasm = function() {
                return (Module._ts_node_parent_wasm = Module.asm.ts_node_parent_wasm).apply(null, arguments);
              }, Module._ts_node_descendant_for_index_wasm = function() {
                return (Module._ts_node_descendant_for_index_wasm = Module.asm.ts_node_descendant_for_index_wasm).apply(null, arguments);
              }, Module._ts_node_named_descendant_for_index_wasm = function() {
                return (Module._ts_node_named_descendant_for_index_wasm = Module.asm.ts_node_named_descendant_for_index_wasm).apply(null, arguments);
              }, Module._ts_node_descendant_for_position_wasm = function() {
                return (Module._ts_node_descendant_for_position_wasm = Module.asm.ts_node_descendant_for_position_wasm).apply(null, arguments);
              }, Module._ts_node_named_descendant_for_position_wasm = function() {
                return (Module._ts_node_named_descendant_for_position_wasm = Module.asm.ts_node_named_descendant_for_position_wasm).apply(null, arguments);
              }, Module._ts_node_start_point_wasm = function() {
                return (Module._ts_node_start_point_wasm = Module.asm.ts_node_start_point_wasm).apply(null, arguments);
              }, Module._ts_node_end_point_wasm = function() {
                return (Module._ts_node_end_point_wasm = Module.asm.ts_node_end_point_wasm).apply(null, arguments);
              }, Module._ts_node_start_index_wasm = function() {
                return (Module._ts_node_start_index_wasm = Module.asm.ts_node_start_index_wasm).apply(null, arguments);
              }, Module._ts_node_end_index_wasm = function() {
                return (Module._ts_node_end_index_wasm = Module.asm.ts_node_end_index_wasm).apply(null, arguments);
              }, Module._ts_node_to_string_wasm = function() {
                return (Module._ts_node_to_string_wasm = Module.asm.ts_node_to_string_wasm).apply(null, arguments);
              }, Module._ts_node_children_wasm = function() {
                return (Module._ts_node_children_wasm = Module.asm.ts_node_children_wasm).apply(null, arguments);
              }, Module._ts_node_named_children_wasm = function() {
                return (Module._ts_node_named_children_wasm = Module.asm.ts_node_named_children_wasm).apply(null, arguments);
              }, Module._ts_node_descendants_of_type_wasm = function() {
                return (Module._ts_node_descendants_of_type_wasm = Module.asm.ts_node_descendants_of_type_wasm).apply(null, arguments);
              }, Module._ts_node_is_named_wasm = function() {
                return (Module._ts_node_is_named_wasm = Module.asm.ts_node_is_named_wasm).apply(null, arguments);
              }, Module._ts_node_has_changes_wasm = function() {
                return (Module._ts_node_has_changes_wasm = Module.asm.ts_node_has_changes_wasm).apply(null, arguments);
              }, Module._ts_node_has_error_wasm = function() {
                return (Module._ts_node_has_error_wasm = Module.asm.ts_node_has_error_wasm).apply(null, arguments);
              }, Module._ts_node_is_missing_wasm = function() {
                return (Module._ts_node_is_missing_wasm = Module.asm.ts_node_is_missing_wasm).apply(null, arguments);
              }, Module._ts_query_matches_wasm = function() {
                return (Module._ts_query_matches_wasm = Module.asm.ts_query_matches_wasm).apply(null, arguments);
              }, Module._ts_query_captures_wasm = function() {
                return (Module._ts_query_captures_wasm = Module.asm.ts_query_captures_wasm).apply(null, arguments);
              }, Module._iswdigit = function() {
                return (Module._iswdigit = Module.asm.iswdigit).apply(null, arguments);
              }, Module._iswalpha = function() {
                return (Module._iswalpha = Module.asm.iswalpha).apply(null, arguments);
              }, Module._iswlower = function() {
                return (Module._iswlower = Module.asm.iswlower).apply(null, arguments);
              }, Module._towupper = function() {
                return (Module._towupper = Module.asm.towupper).apply(null, arguments);
              }, Module.___errno_location = function() {
                return (je = Module.___errno_location = Module.asm.__errno_location).apply(null, arguments);
              }), Ue = (Module._memchr = function() {
                return (Module._memchr = Module.asm.memchr).apply(null, arguments);
              }, Module._strlen = function() {
                return (Module._strlen = Module.asm.strlen).apply(null, arguments);
              }, Module.stackSave = function() {
                return (Ue = Module.stackSave = Module.asm.stackSave).apply(null, arguments);
              }), De = Module.stackRestore = function() {
                return (De = Module.stackRestore = Module.asm.stackRestore).apply(null, arguments);
              }, ze = Module.stackAlloc = function() {
                return (ze = Module.stackAlloc = Module.asm.stackAlloc).apply(null, arguments);
              }, Ge = Module._setThrew = function() {
                return (Ge = Module._setThrew = Module.asm.setThrew).apply(null, arguments);
              };
              Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev = function() {
                return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev = Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev).apply(null, arguments);
              }, Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm = function() {
                return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm = Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm).apply(null, arguments);
              }, Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm = function() {
                return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm = Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm).apply(null, arguments);
              }, Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm = function() {
                return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm = Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm).apply(null, arguments);
              }, Module.__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm = function() {
                return (Module.__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm = Module.asm._ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm).apply(null, arguments);
              }, Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc = function() {
                return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc = Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc).apply(null, arguments);
              }, Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev = function() {
                return (Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev = Module.asm._ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev).apply(null, arguments);
              }, Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw = function() {
                return (Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw = Module.asm._ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw).apply(null, arguments);
              }, Module.__Znwm = function() {
                return (Module.__Znwm = Module.asm._Znwm).apply(null, arguments);
              }, Module.__ZdlPv = function() {
                return (Module.__ZdlPv = Module.asm._ZdlPv).apply(null, arguments);
              }, Module.__ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv = function() {
                return (Module.__ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv = Module.asm._ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv).apply(null, arguments);
              }, Module._orig$ts_parser_timeout_micros = function() {
                return (Module._orig$ts_parser_timeout_micros = Module.asm.orig$ts_parser_timeout_micros).apply(null, arguments);
              }, Module._orig$ts_parser_set_timeout_micros = function() {
                return (Module._orig$ts_parser_set_timeout_micros = Module.asm.orig$ts_parser_set_timeout_micros).apply(null, arguments);
              };
              function He(e3) {
                this.name = "ExitStatus", this.message = "Program terminated with exit(" + e3 + ")", this.status = e3;
              }
              Module.allocate = function(e3, t2) {
                var r3;
                return r3 = t2 == C ? ze(e3.length) : $e(e3.length), e3.subarray || e3.slice ? T.set(e3, r3) : T.set(new Uint8Array(e3), r3), r3;
              };
              re = function e3() {
                Ze || Ke(), Ze || (re = e3);
              };
              var Be = false;
              function Ke(e3) {
                function t2() {
                  Ze || (Ze = true, Module.calledRun = true, P || (Y = true, pe(X), pe(Q), Module.onRuntimeInitialized && Module.onRuntimeInitialized(), Xe && function(e4) {
                    var t3 = Module._main;
                    if (t3) {
                      var r3 = (e4 = e4 || []).length + 1, n2 = ze(4 * (r3 + 1));
                      W[n2 >> 2] = G(a);
                      for (var s2 = 1; s2 < r3; s2++)
                        W[(n2 >> 2) + s2] = G(e4[s2 - 1]);
                      W[(n2 >> 2) + r3] = 0;
                      try {
                        Ve(t3(r3, n2), true);
                      } catch (e5) {
                        if (e5 instanceof He)
                          return;
                        if (e5 == "unwind")
                          return;
                        var o2 = e5;
                        e5 && typeof e5 == "object" && e5.stack && (o2 = [e5, e5.stack]), g("exception thrown: " + o2), u(1, e5);
                      } finally {
                      }
                    }
                  }(e3), function() {
                    if (Module.postRun)
                      for (typeof Module.postRun == "function" && (Module.postRun = [Module.postRun]); Module.postRun.length; )
                        e4 = Module.postRun.shift(), J.unshift(e4);
                    var e4;
                    pe(J);
                  }()));
                }
                e3 = e3 || _, ee > 0 || !Be && (function() {
                  if (I.length) {
                    if (!m)
                      return ne(), void I.reduce(function(e4, t3) {
                        return e4.then(function() {
                          return Ne(t3, { loadAsync: true, global: true, nodelete: true, allowUndefined: true });
                        });
                      }, Promise.resolve()).then(function() {
                        se(), Pe();
                      });
                    I.forEach(function(e4) {
                      Ne(e4, { global: true, nodelete: true, allowUndefined: true });
                    }), Pe();
                  } else
                    Pe();
                }(), Be = true, ee > 0) || (!function() {
                  if (Module.preRun)
                    for (typeof Module.preRun == "function" && (Module.preRun = [Module.preRun]); Module.preRun.length; )
                      e4 = Module.preRun.shift(), V.unshift(e4);
                  var e4;
                  pe(V);
                }(), ee > 0 || (Module.setStatus ? (Module.setStatus("Running..."), setTimeout(function() {
                  setTimeout(function() {
                    Module.setStatus("");
                  }, 1), t2();
                }, 1)) : t2()));
              }
              function Ve(e3, t2) {
                e3, t2 && we() && e3 === 0 || (we() || (true, Module.onExit && Module.onExit(e3), P = true), u(e3, new He(e3)));
              }
              if (Module.run = Ke, Module.preInit)
                for (typeof Module.preInit == "function" && (Module.preInit = [Module.preInit]); Module.preInit.length > 0; )
                  Module.preInit.pop()();
              var Xe = true;
              Module.noInitialRun && (Xe = false), Ke();
              const Qe = Module, Je = {}, Ye = 4, et = 5 * Ye, tt = 2 * Ye, rt = 2 * Ye + 2 * tt, nt = { row: 0, column: 0 }, st = /[\w-.]*/g, ot = 1, _t = 2, at = /^_?tree_sitter_\w+/;
              var ut, it, lt, dt, ct;
              class ParserImpl {
                static init() {
                  lt = Qe._ts_init(), ut = N(lt, "i32"), it = N(lt + Ye, "i32");
                }
                initialize() {
                  Qe._ts_parser_new_wasm(), this[0] = N(lt, "i32"), this[1] = N(lt + Ye, "i32");
                }
                delete() {
                  Qe._ts_parser_delete(this[0]), Qe._free(this[1]), this[0] = 0, this[1] = 0;
                }
                setLanguage(e3) {
                  let t2;
                  if (e3) {
                    if (e3.constructor !== Language)
                      throw new Error("Argument must be a Language");
                    {
                      t2 = e3[0];
                      const r3 = Qe._ts_language_version(t2);
                      if (r3 < it || ut < r3)
                        throw new Error(`Incompatible language version ${r3}. Compatibility range ${it} through ${ut}.`);
                    }
                  } else
                    t2 = 0, e3 = null;
                  return this.language = e3, Qe._ts_parser_set_language(this[0], t2), this;
                }
                getLanguage() {
                  return this.language;
                }
                parse(e3, t2, r3) {
                  if (typeof e3 == "string")
                    dt = (t3, r4, n3) => e3.slice(t3, n3);
                  else {
                    if (typeof e3 != "function")
                      throw new Error("Argument must be a string or a function");
                    dt = e3;
                  }
                  this.logCallback ? (ct = this.logCallback, Qe._ts_parser_enable_logger_wasm(this[0], 1)) : (ct = null, Qe._ts_parser_enable_logger_wasm(this[0], 0));
                  let n2 = 0, s2 = 0;
                  if (r3 && r3.includedRanges) {
                    n2 = r3.includedRanges.length;
                    let e4 = s2 = Qe._calloc(n2, rt);
                    for (let t3 = 0; t3 < n2; t3++)
                      Et(e4, r3.includedRanges[t3]), e4 += rt;
                  }
                  const o2 = Qe._ts_parser_parse_wasm(this[0], this[1], t2 ? t2[0] : 0, s2, n2);
                  if (!o2)
                    throw dt = null, ct = null, new Error("Parsing failed");
                  const _2 = new Tree(Je, o2, this.language, dt);
                  return dt = null, ct = null, _2;
                }
                reset() {
                  Qe._ts_parser_reset(this[0]);
                }
                setTimeoutMicros(e3) {
                  Qe._ts_parser_set_timeout_micros(this[0], e3);
                }
                getTimeoutMicros() {
                  return Qe._ts_parser_timeout_micros(this[0]);
                }
                setLogger(e3) {
                  if (e3) {
                    if (typeof e3 != "function")
                      throw new Error("Logger callback must be a function");
                  } else
                    e3 = null;
                  return this.logCallback = e3, this;
                }
                getLogger() {
                  return this.logCallback;
                }
              }
              class Tree {
                constructor(e3, t2, r3, n2) {
                  pt(e3), this[0] = t2, this.language = r3, this.textCallback = n2;
                }
                copy() {
                  const e3 = Qe._ts_tree_copy(this[0]);
                  return new Tree(Je, e3, this.language, this.textCallback);
                }
                delete() {
                  Qe._ts_tree_delete(this[0]), this[0] = 0;
                }
                edit(e3) {
                  !function(e4) {
                    let t2 = lt;
                    bt(t2, e4.startPosition), bt(t2 += tt, e4.oldEndPosition), bt(t2 += tt, e4.newEndPosition), x(t2 += tt, e4.startIndex, "i32"), x(t2 += Ye, e4.oldEndIndex, "i32"), x(t2 += Ye, e4.newEndIndex, "i32"), t2 += Ye;
                  }(e3), Qe._ts_tree_edit_wasm(this[0]);
                }
                get rootNode() {
                  return Qe._ts_tree_root_node_wasm(this[0]), wt(this);
                }
                getLanguage() {
                  return this.language;
                }
                walk() {
                  return this.rootNode.walk();
                }
                getChangedRanges(e3) {
                  if (e3.constructor !== Tree)
                    throw new TypeError("Argument must be a Tree");
                  Qe._ts_tree_get_changed_ranges_wasm(this[0], e3[0]);
                  const t2 = N(lt, "i32"), r3 = N(lt + Ye, "i32"), n2 = new Array(t2);
                  if (t2 > 0) {
                    let e4 = r3;
                    for (let r4 = 0; r4 < t2; r4++)
                      n2[r4] = It(e4), e4 += rt;
                    Qe._free(r3);
                  }
                  return n2;
                }
              }
              class Node2 {
                constructor(e3, t2) {
                  pt(e3), this.tree = t2;
                }
                get typeId() {
                  return gt(this), Qe._ts_node_symbol_wasm(this.tree[0]);
                }
                get type() {
                  return this.tree.language.types[this.typeId] || "ERROR";
                }
                get endPosition() {
                  return gt(this), Qe._ts_node_end_point_wasm(this.tree[0]), vt(lt);
                }
                get endIndex() {
                  return gt(this), Qe._ts_node_end_index_wasm(this.tree[0]);
                }
                get text() {
                  return mt(this.tree, this.startIndex, this.endIndex);
                }
                isNamed() {
                  return gt(this), Qe._ts_node_is_named_wasm(this.tree[0]) === 1;
                }
                hasError() {
                  return gt(this), Qe._ts_node_has_error_wasm(this.tree[0]) === 1;
                }
                hasChanges() {
                  return gt(this), Qe._ts_node_has_changes_wasm(this.tree[0]) === 1;
                }
                isMissing() {
                  return gt(this), Qe._ts_node_is_missing_wasm(this.tree[0]) === 1;
                }
                equals(e3) {
                  return this.id === e3.id;
                }
                child(e3) {
                  return gt(this), Qe._ts_node_child_wasm(this.tree[0], e3), wt(this.tree);
                }
                namedChild(e3) {
                  return gt(this), Qe._ts_node_named_child_wasm(this.tree[0], e3), wt(this.tree);
                }
                childForFieldId(e3) {
                  return gt(this), Qe._ts_node_child_by_field_id_wasm(this.tree[0], e3), wt(this.tree);
                }
                childForFieldName(e3) {
                  const t2 = this.tree.language.fields.indexOf(e3);
                  if (t2 !== -1)
                    return this.childForFieldId(t2);
                }
                get childCount() {
                  return gt(this), Qe._ts_node_child_count_wasm(this.tree[0]);
                }
                get namedChildCount() {
                  return gt(this), Qe._ts_node_named_child_count_wasm(this.tree[0]);
                }
                get firstChild() {
                  return this.child(0);
                }
                get firstNamedChild() {
                  return this.namedChild(0);
                }
                get lastChild() {
                  return this.child(this.childCount - 1);
                }
                get lastNamedChild() {
                  return this.namedChild(this.namedChildCount - 1);
                }
                get children() {
                  if (!this._children) {
                    gt(this), Qe._ts_node_children_wasm(this.tree[0]);
                    const e3 = N(lt, "i32"), t2 = N(lt + Ye, "i32");
                    if (this._children = new Array(e3), e3 > 0) {
                      let r3 = t2;
                      for (let t3 = 0; t3 < e3; t3++)
                        this._children[t3] = wt(this.tree, r3), r3 += et;
                      Qe._free(t2);
                    }
                  }
                  return this._children;
                }
                get namedChildren() {
                  if (!this._namedChildren) {
                    gt(this), Qe._ts_node_named_children_wasm(this.tree[0]);
                    const e3 = N(lt, "i32"), t2 = N(lt + Ye, "i32");
                    if (this._namedChildren = new Array(e3), e3 > 0) {
                      let r3 = t2;
                      for (let t3 = 0; t3 < e3; t3++)
                        this._namedChildren[t3] = wt(this.tree, r3), r3 += et;
                      Qe._free(t2);
                    }
                  }
                  return this._namedChildren;
                }
                descendantsOfType(e3, t2, r3) {
                  Array.isArray(e3) || (e3 = [e3]), t2 || (t2 = nt), r3 || (r3 = nt);
                  const n2 = [], s2 = this.tree.language.types;
                  for (let t3 = 0, r4 = s2.length; t3 < r4; t3++)
                    e3.includes(s2[t3]) && n2.push(t3);
                  const o2 = Qe._malloc(Ye * n2.length);
                  for (let e4 = 0, t3 = n2.length; e4 < t3; e4++)
                    x(o2 + e4 * Ye, n2[e4], "i32");
                  gt(this), Qe._ts_node_descendants_of_type_wasm(this.tree[0], o2, n2.length, t2.row, t2.column, r3.row, r3.column);
                  const _2 = N(lt, "i32"), a2 = N(lt + Ye, "i32"), u2 = new Array(_2);
                  if (_2 > 0) {
                    let e4 = a2;
                    for (let t3 = 0; t3 < _2; t3++)
                      u2[t3] = wt(this.tree, e4), e4 += et;
                  }
                  return Qe._free(a2), Qe._free(o2), u2;
                }
                get nextSibling() {
                  return gt(this), Qe._ts_node_next_sibling_wasm(this.tree[0]), wt(this.tree);
                }
                get previousSibling() {
                  return gt(this), Qe._ts_node_prev_sibling_wasm(this.tree[0]), wt(this.tree);
                }
                get nextNamedSibling() {
                  return gt(this), Qe._ts_node_next_named_sibling_wasm(this.tree[0]), wt(this.tree);
                }
                get previousNamedSibling() {
                  return gt(this), Qe._ts_node_prev_named_sibling_wasm(this.tree[0]), wt(this.tree);
                }
                get parent() {
                  return gt(this), Qe._ts_node_parent_wasm(this.tree[0]), wt(this.tree);
                }
                descendantForIndex(e3, t2 = e3) {
                  if (typeof e3 != "number" || typeof t2 != "number")
                    throw new Error("Arguments must be numbers");
                  gt(this);
                  let r3 = lt + et;
                  return x(r3, e3, "i32"), x(r3 + Ye, t2, "i32"), Qe._ts_node_descendant_for_index_wasm(this.tree[0]), wt(this.tree);
                }
                namedDescendantForIndex(e3, t2 = e3) {
                  if (typeof e3 != "number" || typeof t2 != "number")
                    throw new Error("Arguments must be numbers");
                  gt(this);
                  let r3 = lt + et;
                  return x(r3, e3, "i32"), x(r3 + Ye, t2, "i32"), Qe._ts_node_named_descendant_for_index_wasm(this.tree[0]), wt(this.tree);
                }
                descendantForPosition(e3, t2 = e3) {
                  if (!ht(e3) || !ht(t2))
                    throw new Error("Arguments must be {row, column} objects");
                  gt(this);
                  let r3 = lt + et;
                  return bt(r3, e3), bt(r3 + tt, t2), Qe._ts_node_descendant_for_position_wasm(this.tree[0]), wt(this.tree);
                }
                namedDescendantForPosition(e3, t2 = e3) {
                  if (!ht(e3) || !ht(t2))
                    throw new Error("Arguments must be {row, column} objects");
                  gt(this);
                  let r3 = lt + et;
                  return bt(r3, e3), bt(r3 + tt, t2), Qe._ts_node_named_descendant_for_position_wasm(this.tree[0]), wt(this.tree);
                }
                walk() {
                  return gt(this), Qe._ts_tree_cursor_new_wasm(this.tree[0]), new TreeCursor(Je, this.tree);
                }
                toString() {
                  gt(this);
                  const e3 = Qe._ts_node_to_string_wasm(this.tree[0]), t2 = function(e4) {
                    for (var t3 = ""; ; ) {
                      var r3 = T[e4++ >> 0];
                      if (!r3)
                        return t3;
                      t3 += String.fromCharCode(r3);
                    }
                  }(e3);
                  return Qe._free(e3), t2;
                }
              }
              class TreeCursor {
                constructor(e3, t2) {
                  pt(e3), this.tree = t2, Mt(this);
                }
                delete() {
                  yt(this), Qe._ts_tree_cursor_delete_wasm(this.tree[0]), this[0] = this[1] = this[2] = 0;
                }
                reset(e3) {
                  gt(e3), yt(this, lt + et), Qe._ts_tree_cursor_reset_wasm(this.tree[0]), Mt(this);
                }
                get nodeType() {
                  return this.tree.language.types[this.nodeTypeId] || "ERROR";
                }
                get nodeTypeId() {
                  return yt(this), Qe._ts_tree_cursor_current_node_type_id_wasm(this.tree[0]);
                }
                get nodeId() {
                  return yt(this), Qe._ts_tree_cursor_current_node_id_wasm(this.tree[0]);
                }
                get nodeIsNamed() {
                  return yt(this), Qe._ts_tree_cursor_current_node_is_named_wasm(this.tree[0]) === 1;
                }
                get nodeIsMissing() {
                  return yt(this), Qe._ts_tree_cursor_current_node_is_missing_wasm(this.tree[0]) === 1;
                }
                get nodeText() {
                  yt(this);
                  const e3 = Qe._ts_tree_cursor_start_index_wasm(this.tree[0]), t2 = Qe._ts_tree_cursor_end_index_wasm(this.tree[0]);
                  return mt(this.tree, e3, t2);
                }
                get startPosition() {
                  return yt(this), Qe._ts_tree_cursor_start_position_wasm(this.tree[0]), vt(lt);
                }
                get endPosition() {
                  return yt(this), Qe._ts_tree_cursor_end_position_wasm(this.tree[0]), vt(lt);
                }
                get startIndex() {
                  return yt(this), Qe._ts_tree_cursor_start_index_wasm(this.tree[0]);
                }
                get endIndex() {
                  return yt(this), Qe._ts_tree_cursor_end_index_wasm(this.tree[0]);
                }
                currentNode() {
                  return yt(this), Qe._ts_tree_cursor_current_node_wasm(this.tree[0]), wt(this.tree);
                }
                currentFieldId() {
                  return yt(this), Qe._ts_tree_cursor_current_field_id_wasm(this.tree[0]);
                }
                currentFieldName() {
                  return this.tree.language.fields[this.currentFieldId()];
                }
                gotoFirstChild() {
                  yt(this);
                  const e3 = Qe._ts_tree_cursor_goto_first_child_wasm(this.tree[0]);
                  return Mt(this), e3 === 1;
                }
                gotoNextSibling() {
                  yt(this);
                  const e3 = Qe._ts_tree_cursor_goto_next_sibling_wasm(this.tree[0]);
                  return Mt(this), e3 === 1;
                }
                gotoParent() {
                  yt(this);
                  const e3 = Qe._ts_tree_cursor_goto_parent_wasm(this.tree[0]);
                  return Mt(this), e3 === 1;
                }
              }
              class Language {
                constructor(e3, t2) {
                  pt(e3), this[0] = t2, this.types = new Array(Qe._ts_language_symbol_count(this[0]));
                  for (let e4 = 0, t3 = this.types.length; e4 < t3; e4++)
                    Qe._ts_language_symbol_type(this[0], e4) < 2 && (this.types[e4] = j(Qe._ts_language_symbol_name(this[0], e4)));
                  this.fields = new Array(Qe._ts_language_field_count(this[0]) + 1);
                  for (let e4 = 0, t3 = this.fields.length; e4 < t3; e4++) {
                    const t4 = Qe._ts_language_field_name_for_id(this[0], e4);
                    this.fields[e4] = t4 !== 0 ? j(t4) : null;
                  }
                }
                get version() {
                  return Qe._ts_language_version(this[0]);
                }
                get fieldCount() {
                  return this.fields.length - 1;
                }
                fieldIdForName(e3) {
                  const t2 = this.fields.indexOf(e3);
                  return t2 !== -1 ? t2 : null;
                }
                fieldNameForId(e3) {
                  return this.fields[e3] || null;
                }
                idForNodeType(e3, t2) {
                  const r3 = z(e3), n2 = Qe._malloc(r3 + 1);
                  D(e3, n2, r3 + 1);
                  const s2 = Qe._ts_language_symbol_for_name(this[0], n2, r3, t2);
                  return Qe._free(n2), s2 || null;
                }
                get nodeTypeCount() {
                  return Qe._ts_language_symbol_count(this[0]);
                }
                nodeTypeForId(e3) {
                  const t2 = Qe._ts_language_symbol_name(this[0], e3);
                  return t2 ? j(t2) : null;
                }
                nodeTypeIsNamed(e3) {
                  return !!Qe._ts_language_type_is_named_wasm(this[0], e3);
                }
                nodeTypeIsVisible(e3) {
                  return !!Qe._ts_language_type_is_visible_wasm(this[0], e3);
                }
                query(e3) {
                  const t2 = z(e3), r3 = Qe._malloc(t2 + 1);
                  D(e3, r3, t2 + 1);
                  const n2 = Qe._ts_query_new(this[0], r3, t2, lt, lt + Ye);
                  if (!n2) {
                    const t3 = N(lt + Ye, "i32"), n3 = j(r3, N(lt, "i32")).length, s3 = e3.substr(n3, 100).split("\n")[0];
                    let o3, _3 = s3.match(st)[0];
                    switch (t3) {
                      case 2:
                        o3 = new RangeError(`Bad node name '${_3}'`);
                        break;
                      case 3:
                        o3 = new RangeError(`Bad field name '${_3}'`);
                        break;
                      case 4:
                        o3 = new RangeError(`Bad capture name @${_3}`);
                        break;
                      case 5:
                        o3 = new TypeError(`Bad pattern structure at offset ${n3}: '${s3}'...`), _3 = "";
                        break;
                      default:
                        o3 = new SyntaxError(`Bad syntax at offset ${n3}: '${s3}'...`), _3 = "";
                    }
                    throw o3.index = n3, o3.length = _3.length, Qe._free(r3), o3;
                  }
                  const s2 = Qe._ts_query_string_count(n2), o2 = Qe._ts_query_capture_count(n2), _2 = Qe._ts_query_pattern_count(n2), a2 = new Array(o2), u2 = new Array(s2);
                  for (let e4 = 0; e4 < o2; e4++) {
                    const t3 = Qe._ts_query_capture_name_for_id(n2, e4, lt), r4 = N(lt, "i32");
                    a2[e4] = j(t3, r4);
                  }
                  for (let e4 = 0; e4 < s2; e4++) {
                    const t3 = Qe._ts_query_string_value_for_id(n2, e4, lt), r4 = N(lt, "i32");
                    u2[e4] = j(t3, r4);
                  }
                  const i2 = new Array(_2), l2 = new Array(_2), d2 = new Array(_2), c2 = new Array(_2), m2 = new Array(_2);
                  for (let e4 = 0; e4 < _2; e4++) {
                    const t3 = Qe._ts_query_predicates_for_pattern(n2, e4, lt), r4 = N(lt, "i32");
                    c2[e4] = [], m2[e4] = [];
                    const s3 = [];
                    let o3 = t3;
                    for (let t4 = 0; t4 < r4; t4++) {
                      const t5 = N(o3, "i32"), r5 = N(o3 += Ye, "i32");
                      if (o3 += Ye, t5 === ot)
                        s3.push({ type: "capture", name: a2[r5] });
                      else if (t5 === _t)
                        s3.push({ type: "string", value: u2[r5] });
                      else if (s3.length > 0) {
                        if (s3[0].type !== "string")
                          throw new Error("Predicates must begin with a literal value");
                        const t6 = s3[0].value;
                        let r6 = true;
                        switch (t6) {
                          case "not-eq?":
                            r6 = false;
                          case "eq?":
                            if (s3.length !== 3)
                              throw new Error(`Wrong number of arguments to \`#eq?\` predicate. Expected 2, got ${s3.length - 1}`);
                            if (s3[1].type !== "capture")
                              throw new Error(`First argument of \`#eq?\` predicate must be a capture. Got "${s3[1].value}"`);
                            if (s3[2].type === "capture") {
                              const t7 = s3[1].name, n4 = s3[2].name;
                              m2[e4].push(function(e5) {
                                let s4, o5;
                                for (const r7 of e5)
                                  r7.name === t7 && (s4 = r7.node), r7.name === n4 && (o5 = r7.node);
                                return s4 === void 0 || o5 === void 0 || s4.text === o5.text === r6;
                              });
                            } else {
                              const t7 = s3[1].name, n4 = s3[2].value;
                              m2[e4].push(function(e5) {
                                for (const s4 of e5)
                                  if (s4.name === t7)
                                    return s4.node.text === n4 === r6;
                                return true;
                              });
                            }
                            break;
                          case "not-match?":
                            r6 = false;
                          case "match?":
                            if (s3.length !== 3)
                              throw new Error(`Wrong number of arguments to \`#match?\` predicate. Expected 2, got ${s3.length - 1}.`);
                            if (s3[1].type !== "capture")
                              throw new Error(`First argument of \`#match?\` predicate must be a capture. Got "${s3[1].value}".`);
                            if (s3[2].type !== "string")
                              throw new Error(`Second argument of \`#match?\` predicate must be a string. Got @${s3[2].value}.`);
                            const n3 = s3[1].name, o4 = new RegExp(s3[2].value);
                            m2[e4].push(function(e5) {
                              for (const t7 of e5)
                                if (t7.name === n3)
                                  return o4.test(t7.node.text) === r6;
                              return true;
                            });
                            break;
                          case "set!":
                            if (s3.length < 2 || s3.length > 3)
                              throw new Error(`Wrong number of arguments to \`#set!\` predicate. Expected 1 or 2. Got ${s3.length - 1}.`);
                            if (s3.some((e5) => e5.type !== "string"))
                              throw new Error('Arguments to `#set!` predicate must be a strings.".');
                            i2[e4] || (i2[e4] = {}), i2[e4][s3[1].value] = s3[2] ? s3[2].value : null;
                            break;
                          case "is?":
                          case "is-not?":
                            if (s3.length < 2 || s3.length > 3)
                              throw new Error(`Wrong number of arguments to \`#${t6}\` predicate. Expected 1 or 2. Got ${s3.length - 1}.`);
                            if (s3.some((e5) => e5.type !== "string"))
                              throw new Error(`Arguments to \`#${t6}\` predicate must be a strings.".`);
                            const _3 = t6 === "is?" ? l2 : d2;
                            _3[e4] || (_3[e4] = {}), _3[e4][s3[1].value] = s3[2] ? s3[2].value : null;
                            break;
                          default:
                            c2[e4].push({ operator: t6, operands: s3.slice(1) });
                        }
                        s3.length = 0;
                      }
                    }
                    Object.freeze(i2[e4]), Object.freeze(l2[e4]), Object.freeze(d2[e4]);
                  }
                  return Qe._free(r3), new Query(Je, n2, a2, m2, c2, Object.freeze(i2), Object.freeze(l2), Object.freeze(d2));
                }
                static load(e3) {
                  let t2;
                  if (e3 instanceof Uint8Array)
                    t2 = Promise.resolve(e3);
                  else {
                    const r4 = e3;
                    if (typeof process != "undefined" && process.versions && process.versions.node) {
                      const e4 = require_empty();
                      t2 = Promise.resolve(e4.readFileSync(r4));
                    } else
                      t2 = fetch(r4).then((e4) => e4.arrayBuffer().then((t3) => {
                        if (e4.ok)
                          return new Uint8Array(t3);
                        {
                          const r5 = new TextDecoder("utf-8").decode(t3);
                          throw new Error(`Language.load failed with status ${e4.status}.

${r5}`);
                        }
                      }));
                  }
                  const r3 = typeof loadSideModule == "function" ? loadSideModule : xe;
                  return t2.then((e4) => r3(e4, { loadAsync: true })).then((e4) => {
                    const t3 = Object.keys(e4), r4 = t3.find((e5) => at.test(e5) && !e5.includes("external_scanner_"));
                    r4 || console.log(`Couldn't find language function in WASM file. Symbols:
${JSON.stringify(t3, null, 2)}`);
                    const n2 = e4[r4]();
                    return new Language(Je, n2);
                  });
                }
              }
              class Query {
                constructor(e3, t2, r3, n2, s2, o2, _2, a2) {
                  pt(e3), this[0] = t2, this.captureNames = r3, this.textPredicates = n2, this.predicates = s2, this.setProperties = o2, this.assertedProperties = _2, this.refutedProperties = a2, this.exceededMatchLimit = false;
                }
                delete() {
                  Qe._ts_query_delete(this[0]), this[0] = 0;
                }
                matches(e3, t2, r3, n2) {
                  t2 || (t2 = nt), r3 || (r3 = nt), n2 || (n2 = {});
                  let s2 = n2.matchLimit;
                  if (s2 === void 0)
                    s2 = 0;
                  else if (typeof s2 != "number")
                    throw new Error("Arguments must be numbers");
                  gt(e3), Qe._ts_query_matches_wasm(this[0], e3.tree[0], t2.row, t2.column, r3.row, r3.column, s2);
                  const o2 = N(lt, "i32"), _2 = N(lt + Ye, "i32"), a2 = N(lt + 2 * Ye, "i32"), u2 = new Array(o2);
                  this.exceededMatchLimit = !!a2;
                  let i2 = 0, l2 = _2;
                  for (let t3 = 0; t3 < o2; t3++) {
                    const r4 = N(l2, "i32"), n3 = N(l2 += Ye, "i32");
                    l2 += Ye;
                    const s3 = new Array(n3);
                    if (l2 = ft(this, e3.tree, l2, s3), this.textPredicates[r4].every((e4) => e4(s3))) {
                      u2[i2++] = { pattern: r4, captures: s3 };
                      const e4 = this.setProperties[r4];
                      e4 && (u2[t3].setProperties = e4);
                      const n4 = this.assertedProperties[r4];
                      n4 && (u2[t3].assertedProperties = n4);
                      const o3 = this.refutedProperties[r4];
                      o3 && (u2[t3].refutedProperties = o3);
                    }
                  }
                  return u2.length = i2, Qe._free(_2), u2;
                }
                captures(e3, t2, r3, n2) {
                  t2 || (t2 = nt), r3 || (r3 = nt), n2 || (n2 = {});
                  let s2 = n2.matchLimit;
                  if (s2 === void 0)
                    s2 = 0;
                  else if (typeof s2 != "number")
                    throw new Error("Arguments must be numbers");
                  gt(e3), Qe._ts_query_captures_wasm(this[0], e3.tree[0], t2.row, t2.column, r3.row, r3.column, s2);
                  const o2 = N(lt, "i32"), _2 = N(lt + Ye, "i32"), a2 = N(lt + 2 * Ye, "i32"), u2 = [];
                  this.exceededMatchLimit = !!a2;
                  const i2 = [];
                  let l2 = _2;
                  for (let t3 = 0; t3 < o2; t3++) {
                    const t4 = N(l2, "i32"), r4 = N(l2 += Ye, "i32"), n3 = N(l2 += Ye, "i32");
                    if (l2 += Ye, i2.length = r4, l2 = ft(this, e3.tree, l2, i2), this.textPredicates[t4].every((e4) => e4(i2))) {
                      const e4 = i2[n3], r5 = this.setProperties[t4];
                      r5 && (e4.setProperties = r5);
                      const s3 = this.assertedProperties[t4];
                      s3 && (e4.assertedProperties = s3);
                      const o3 = this.refutedProperties[t4];
                      o3 && (e4.refutedProperties = o3), u2.push(e4);
                    }
                  }
                  return Qe._free(_2), u2;
                }
                predicatesForPattern(e3) {
                  return this.predicates[e3];
                }
                didExceedMatchLimit() {
                  return this.exceededMatchLimit;
                }
              }
              function mt(e3, t2, r3) {
                const n2 = r3 - t2;
                let s2 = e3.textCallback(t2, null, r3);
                for (t2 += s2.length; t2 < r3; ) {
                  const n3 = e3.textCallback(t2, null, r3);
                  if (!(n3 && n3.length > 0))
                    break;
                  t2 += n3.length, s2 += n3;
                }
                return t2 > r3 && (s2 = s2.slice(0, n2)), s2;
              }
              function ft(e3, t2, r3, n2) {
                for (let s2 = 0, o2 = n2.length; s2 < o2; s2++) {
                  const o3 = N(r3, "i32"), _2 = wt(t2, r3 += Ye);
                  r3 += et, n2[s2] = { name: e3.captureNames[o3], node: _2 };
                }
                return r3;
              }
              function pt(e3) {
                if (e3 !== Je)
                  throw new Error("Illegal constructor");
              }
              function ht(e3) {
                return e3 && typeof e3.row == "number" && typeof e3.column == "number";
              }
              function gt(e3) {
                let t2 = lt;
                x(t2, e3.id, "i32"), x(t2 += Ye, e3.startIndex, "i32"), x(t2 += Ye, e3.startPosition.row, "i32"), x(t2 += Ye, e3.startPosition.column, "i32"), x(t2 += Ye, e3[0], "i32");
              }
              function wt(e3, t2 = lt) {
                const r3 = N(t2, "i32");
                if (r3 === 0)
                  return null;
                const n2 = N(t2 += Ye, "i32"), s2 = N(t2 += Ye, "i32"), o2 = N(t2 += Ye, "i32"), _2 = N(t2 += Ye, "i32"), a2 = new Node2(Je, e3);
                return a2.id = r3, a2.startIndex = n2, a2.startPosition = { row: s2, column: o2 }, a2[0] = _2, a2;
              }
              function yt(e3, t2 = lt) {
                x(t2 + 0 * Ye, e3[0], "i32"), x(t2 + 1 * Ye, e3[1], "i32"), x(t2 + 2 * Ye, e3[2], "i32");
              }
              function Mt(e3) {
                e3[0] = N(lt + 0 * Ye, "i32"), e3[1] = N(lt + 1 * Ye, "i32"), e3[2] = N(lt + 2 * Ye, "i32");
              }
              function bt(e3, t2) {
                x(e3, t2.row, "i32"), x(e3 + Ye, t2.column, "i32");
              }
              function vt(e3) {
                return { row: N(e3, "i32"), column: N(e3 + Ye, "i32") };
              }
              function Et(e3, t2) {
                bt(e3, t2.startPosition), bt(e3 += tt, t2.endPosition), x(e3 += tt, t2.startIndex, "i32"), x(e3 += Ye, t2.endIndex, "i32"), e3 += Ye;
              }
              function It(e3) {
                const t2 = {};
                return t2.startPosition = vt(e3), e3 += tt, t2.endPosition = vt(e3), e3 += tt, t2.startIndex = N(e3, "i32"), e3 += Ye, t2.endIndex = N(e3, "i32"), t2;
              }
              for (const e3 of Object.getOwnPropertyNames(ParserImpl.prototype))
                Object.defineProperty(Parser3.prototype, e3, { value: ParserImpl.prototype[e3], enumerable: false, writable: false });
              Parser3.Language = Language, Module.onRuntimeInitialized = () => {
                ParserImpl.init(), e2();
              };
            }));
          }
        }
        return Parser3;
      }();
      typeof exports == "object" && (module.exports = TreeSitter);
    }
  });

  // packages/grammarly-languageserver/dist/index.browser.mjs
  var import_browser = __toESM(require_browser3(), 1);

  // node_modules/.pnpm/reflect-metadata@0.1.13/node_modules/reflect-metadata/Reflect.js
  var Reflect2;
  (function(Reflect3) {
    (function(factory) {
      var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : Function("return this;")();
      var exporter = makeExporter(Reflect3);
      if (typeof root.Reflect === "undefined") {
        root.Reflect = Reflect3;
      } else {
        exporter = makeExporter(root.Reflect, exporter);
      }
      factory(exporter);
      function makeExporter(target, previous) {
        return function(key, value) {
          if (typeof target[key] !== "function") {
            Object.defineProperty(target, key, { configurable: true, writable: true, value });
          }
          if (previous)
            previous(key, value);
        };
      }
    })(function(exporter) {
      var hasOwn = Object.prototype.hasOwnProperty;
      var supportsSymbol = typeof Symbol === "function";
      var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
      var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
      var supportsCreate = typeof Object.create === "function";
      var supportsProto = { __proto__: [] } instanceof Array;
      var downLevel = !supportsCreate && !supportsProto;
      var HashMap = {
        create: supportsCreate ? function() {
          return MakeDictionary(/* @__PURE__ */ Object.create(null));
        } : supportsProto ? function() {
          return MakeDictionary({ __proto__: null });
        } : function() {
          return MakeDictionary({});
        },
        has: downLevel ? function(map, key) {
          return hasOwn.call(map, key);
        } : function(map, key) {
          return key in map;
        },
        get: downLevel ? function(map, key) {
          return hasOwn.call(map, key) ? map[key] : void 0;
        } : function(map, key) {
          return map[key];
        }
      };
      var functionPrototype = Object.getPrototypeOf(Function);
      var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
      var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
      var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
      var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
      var Metadata2 = new _WeakMap();
      function decorate(decorators, target, propertyKey, attributes) {
        if (!IsUndefined(propertyKey)) {
          if (!IsArray(decorators))
            throw new TypeError();
          if (!IsObject(target))
            throw new TypeError();
          if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
            throw new TypeError();
          if (IsNull(attributes))
            attributes = void 0;
          propertyKey = ToPropertyKey(propertyKey);
          return DecorateProperty(decorators, target, propertyKey, attributes);
        } else {
          if (!IsArray(decorators))
            throw new TypeError();
          if (!IsConstructor(target))
            throw new TypeError();
          return DecorateConstructor(decorators, target);
        }
      }
      exporter("decorate", decorate);
      function metadata(metadataKey, metadataValue) {
        function decorator(target, propertyKey) {
          if (!IsObject(target))
            throw new TypeError();
          if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
            throw new TypeError();
          OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        return decorator;
      }
      exporter("metadata", metadata);
      function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
        if (!IsObject(target))
          throw new TypeError();
        if (!IsUndefined(propertyKey))
          propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
      }
      exporter("defineMetadata", defineMetadata);
      function hasMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
          throw new TypeError();
        if (!IsUndefined(propertyKey))
          propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasMetadata(metadataKey, target, propertyKey);
      }
      exporter("hasMetadata", hasMetadata);
      function hasOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
          throw new TypeError();
        if (!IsUndefined(propertyKey))
          propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
      }
      exporter("hasOwnMetadata", hasOwnMetadata);
      function getMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
          throw new TypeError();
        if (!IsUndefined(propertyKey))
          propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetMetadata(metadataKey, target, propertyKey);
      }
      exporter("getMetadata", getMetadata);
      function getOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
          throw new TypeError();
        if (!IsUndefined(propertyKey))
          propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
      }
      exporter("getOwnMetadata", getOwnMetadata);
      function getMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
          throw new TypeError();
        if (!IsUndefined(propertyKey))
          propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryMetadataKeys(target, propertyKey);
      }
      exporter("getMetadataKeys", getMetadataKeys);
      function getOwnMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
          throw new TypeError();
        if (!IsUndefined(propertyKey))
          propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryOwnMetadataKeys(target, propertyKey);
      }
      exporter("getOwnMetadataKeys", getOwnMetadataKeys);
      function deleteMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
          throw new TypeError();
        if (!IsUndefined(propertyKey))
          propertyKey = ToPropertyKey(propertyKey);
        var metadataMap = GetOrCreateMetadataMap(target, propertyKey, false);
        if (IsUndefined(metadataMap))
          return false;
        if (!metadataMap.delete(metadataKey))
          return false;
        if (metadataMap.size > 0)
          return true;
        var targetMetadata = Metadata2.get(target);
        targetMetadata.delete(propertyKey);
        if (targetMetadata.size > 0)
          return true;
        Metadata2.delete(target);
        return true;
      }
      exporter("deleteMetadata", deleteMetadata);
      function DecorateConstructor(decorators, target) {
        for (var i = decorators.length - 1; i >= 0; --i) {
          var decorator = decorators[i];
          var decorated = decorator(target);
          if (!IsUndefined(decorated) && !IsNull(decorated)) {
            if (!IsConstructor(decorated))
              throw new TypeError();
            target = decorated;
          }
        }
        return target;
      }
      function DecorateProperty(decorators, target, propertyKey, descriptor) {
        for (var i = decorators.length - 1; i >= 0; --i) {
          var decorator = decorators[i];
          var decorated = decorator(target, propertyKey, descriptor);
          if (!IsUndefined(decorated) && !IsNull(decorated)) {
            if (!IsObject(decorated))
              throw new TypeError();
            descriptor = decorated;
          }
        }
        return descriptor;
      }
      function GetOrCreateMetadataMap(O, P, Create) {
        var targetMetadata = Metadata2.get(O);
        if (IsUndefined(targetMetadata)) {
          if (!Create)
            return void 0;
          targetMetadata = new _Map();
          Metadata2.set(O, targetMetadata);
        }
        var metadataMap = targetMetadata.get(P);
        if (IsUndefined(metadataMap)) {
          if (!Create)
            return void 0;
          metadataMap = new _Map();
          targetMetadata.set(P, metadataMap);
        }
        return metadataMap;
      }
      function OrdinaryHasMetadata(MetadataKey, O, P) {
        var hasOwn2 = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn2)
          return true;
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
          return OrdinaryHasMetadata(MetadataKey, parent, P);
        return false;
      }
      function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, false);
        if (IsUndefined(metadataMap))
          return false;
        return ToBoolean(metadataMap.has(MetadataKey));
      }
      function OrdinaryGetMetadata(MetadataKey, O, P) {
        var hasOwn2 = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn2)
          return OrdinaryGetOwnMetadata(MetadataKey, O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
          return OrdinaryGetMetadata(MetadataKey, parent, P);
        return void 0;
      }
      function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, false);
        if (IsUndefined(metadataMap))
          return void 0;
        return metadataMap.get(MetadataKey);
      }
      function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, true);
        metadataMap.set(MetadataKey, MetadataValue);
      }
      function OrdinaryMetadataKeys(O, P) {
        var ownKeys = OrdinaryOwnMetadataKeys(O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (parent === null)
          return ownKeys;
        var parentKeys = OrdinaryMetadataKeys(parent, P);
        if (parentKeys.length <= 0)
          return ownKeys;
        if (ownKeys.length <= 0)
          return parentKeys;
        var set2 = new _Set();
        var keys2 = [];
        for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
          var key = ownKeys_1[_i];
          var hasKey = set2.has(key);
          if (!hasKey) {
            set2.add(key);
            keys2.push(key);
          }
        }
        for (var _a2 = 0, parentKeys_1 = parentKeys; _a2 < parentKeys_1.length; _a2++) {
          var key = parentKeys_1[_a2];
          var hasKey = set2.has(key);
          if (!hasKey) {
            set2.add(key);
            keys2.push(key);
          }
        }
        return keys2;
      }
      function OrdinaryOwnMetadataKeys(O, P) {
        var keys2 = [];
        var metadataMap = GetOrCreateMetadataMap(O, P, false);
        if (IsUndefined(metadataMap))
          return keys2;
        var keysObj = metadataMap.keys();
        var iterator = GetIterator(keysObj);
        var k = 0;
        while (true) {
          var next = IteratorStep(iterator);
          if (!next) {
            keys2.length = k;
            return keys2;
          }
          var nextValue = IteratorValue(next);
          try {
            keys2[k] = nextValue;
          } catch (e) {
            try {
              IteratorClose(iterator);
            } finally {
              throw e;
            }
          }
          k++;
        }
      }
      function Type(x) {
        if (x === null)
          return 1;
        switch (typeof x) {
          case "undefined":
            return 0;
          case "boolean":
            return 2;
          case "string":
            return 3;
          case "symbol":
            return 4;
          case "number":
            return 5;
          case "object":
            return x === null ? 1 : 6;
          default:
            return 6;
        }
      }
      function IsUndefined(x) {
        return x === void 0;
      }
      function IsNull(x) {
        return x === null;
      }
      function IsSymbol(x) {
        return typeof x === "symbol";
      }
      function IsObject(x) {
        return typeof x === "object" ? x !== null : typeof x === "function";
      }
      function ToPrimitive(input, PreferredType) {
        switch (Type(input)) {
          case 0:
            return input;
          case 1:
            return input;
          case 2:
            return input;
          case 3:
            return input;
          case 4:
            return input;
          case 5:
            return input;
        }
        var hint = PreferredType === 3 ? "string" : PreferredType === 5 ? "number" : "default";
        var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
        if (exoticToPrim !== void 0) {
          var result = exoticToPrim.call(input, hint);
          if (IsObject(result))
            throw new TypeError();
          return result;
        }
        return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
      }
      function OrdinaryToPrimitive(O, hint) {
        if (hint === "string") {
          var toString_1 = O.toString;
          if (IsCallable(toString_1)) {
            var result = toString_1.call(O);
            if (!IsObject(result))
              return result;
          }
          var valueOf = O.valueOf;
          if (IsCallable(valueOf)) {
            var result = valueOf.call(O);
            if (!IsObject(result))
              return result;
          }
        } else {
          var valueOf = O.valueOf;
          if (IsCallable(valueOf)) {
            var result = valueOf.call(O);
            if (!IsObject(result))
              return result;
          }
          var toString_2 = O.toString;
          if (IsCallable(toString_2)) {
            var result = toString_2.call(O);
            if (!IsObject(result))
              return result;
          }
        }
        throw new TypeError();
      }
      function ToBoolean(argument) {
        return !!argument;
      }
      function ToString(argument) {
        return "" + argument;
      }
      function ToPropertyKey(argument) {
        var key = ToPrimitive(argument, 3);
        if (IsSymbol(key))
          return key;
        return ToString(key);
      }
      function IsArray(argument) {
        return Array.isArray ? Array.isArray(argument) : argument instanceof Object ? argument instanceof Array : Object.prototype.toString.call(argument) === "[object Array]";
      }
      function IsCallable(argument) {
        return typeof argument === "function";
      }
      function IsConstructor(argument) {
        return typeof argument === "function";
      }
      function IsPropertyKey(argument) {
        switch (Type(argument)) {
          case 3:
            return true;
          case 4:
            return true;
          default:
            return false;
        }
      }
      function GetMethod(V, P) {
        var func = V[P];
        if (func === void 0 || func === null)
          return void 0;
        if (!IsCallable(func))
          throw new TypeError();
        return func;
      }
      function GetIterator(obj) {
        var method = GetMethod(obj, iteratorSymbol);
        if (!IsCallable(method))
          throw new TypeError();
        var iterator = method.call(obj);
        if (!IsObject(iterator))
          throw new TypeError();
        return iterator;
      }
      function IteratorValue(iterResult) {
        return iterResult.value;
      }
      function IteratorStep(iterator) {
        var result = iterator.next();
        return result.done ? false : result;
      }
      function IteratorClose(iterator) {
        var f = iterator["return"];
        if (f)
          f.call(iterator);
      }
      function OrdinaryGetPrototypeOf(O) {
        var proto = Object.getPrototypeOf(O);
        if (typeof O !== "function" || O === functionPrototype)
          return proto;
        if (proto !== functionPrototype)
          return proto;
        var prototype = O.prototype;
        var prototypeProto = prototype && Object.getPrototypeOf(prototype);
        if (prototypeProto == null || prototypeProto === Object.prototype)
          return proto;
        var constructor = prototypeProto.constructor;
        if (typeof constructor !== "function")
          return proto;
        if (constructor === O)
          return proto;
        return constructor;
      }
      function CreateMapPolyfill() {
        var cacheSentinel = {};
        var arraySentinel = [];
        var MapIterator = function() {
          function MapIterator2(keys2, values, selector) {
            this._index = 0;
            this._keys = keys2;
            this._values = values;
            this._selector = selector;
          }
          MapIterator2.prototype["@@iterator"] = function() {
            return this;
          };
          MapIterator2.prototype[iteratorSymbol] = function() {
            return this;
          };
          MapIterator2.prototype.next = function() {
            var index = this._index;
            if (index >= 0 && index < this._keys.length) {
              var result = this._selector(this._keys[index], this._values[index]);
              if (index + 1 >= this._keys.length) {
                this._index = -1;
                this._keys = arraySentinel;
                this._values = arraySentinel;
              } else {
                this._index++;
              }
              return { value: result, done: false };
            }
            return { value: void 0, done: true };
          };
          MapIterator2.prototype.throw = function(error) {
            if (this._index >= 0) {
              this._index = -1;
              this._keys = arraySentinel;
              this._values = arraySentinel;
            }
            throw error;
          };
          MapIterator2.prototype.return = function(value) {
            if (this._index >= 0) {
              this._index = -1;
              this._keys = arraySentinel;
              this._values = arraySentinel;
            }
            return { value, done: true };
          };
          return MapIterator2;
        }();
        return function() {
          function Map2() {
            this._keys = [];
            this._values = [];
            this._cacheKey = cacheSentinel;
            this._cacheIndex = -2;
          }
          Object.defineProperty(Map2.prototype, "size", {
            get: function() {
              return this._keys.length;
            },
            enumerable: true,
            configurable: true
          });
          Map2.prototype.has = function(key) {
            return this._find(key, false) >= 0;
          };
          Map2.prototype.get = function(key) {
            var index = this._find(key, false);
            return index >= 0 ? this._values[index] : void 0;
          };
          Map2.prototype.set = function(key, value) {
            var index = this._find(key, true);
            this._values[index] = value;
            return this;
          };
          Map2.prototype.delete = function(key) {
            var index = this._find(key, false);
            if (index >= 0) {
              var size = this._keys.length;
              for (var i = index + 1; i < size; i++) {
                this._keys[i - 1] = this._keys[i];
                this._values[i - 1] = this._values[i];
              }
              this._keys.length--;
              this._values.length--;
              if (key === this._cacheKey) {
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
              }
              return true;
            }
            return false;
          };
          Map2.prototype.clear = function() {
            this._keys.length = 0;
            this._values.length = 0;
            this._cacheKey = cacheSentinel;
            this._cacheIndex = -2;
          };
          Map2.prototype.keys = function() {
            return new MapIterator(this._keys, this._values, getKey);
          };
          Map2.prototype.values = function() {
            return new MapIterator(this._keys, this._values, getValue);
          };
          Map2.prototype.entries = function() {
            return new MapIterator(this._keys, this._values, getEntry);
          };
          Map2.prototype["@@iterator"] = function() {
            return this.entries();
          };
          Map2.prototype[iteratorSymbol] = function() {
            return this.entries();
          };
          Map2.prototype._find = function(key, insert) {
            if (this._cacheKey !== key) {
              this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
            }
            if (this._cacheIndex < 0 && insert) {
              this._cacheIndex = this._keys.length;
              this._keys.push(key);
              this._values.push(void 0);
            }
            return this._cacheIndex;
          };
          return Map2;
        }();
        function getKey(key, _) {
          return key;
        }
        function getValue(_, value) {
          return value;
        }
        function getEntry(key, value) {
          return [key, value];
        }
      }
      function CreateSetPolyfill() {
        return function() {
          function Set2() {
            this._map = new _Map();
          }
          Object.defineProperty(Set2.prototype, "size", {
            get: function() {
              return this._map.size;
            },
            enumerable: true,
            configurable: true
          });
          Set2.prototype.has = function(value) {
            return this._map.has(value);
          };
          Set2.prototype.add = function(value) {
            return this._map.set(value, value), this;
          };
          Set2.prototype.delete = function(value) {
            return this._map.delete(value);
          };
          Set2.prototype.clear = function() {
            this._map.clear();
          };
          Set2.prototype.keys = function() {
            return this._map.keys();
          };
          Set2.prototype.values = function() {
            return this._map.values();
          };
          Set2.prototype.entries = function() {
            return this._map.entries();
          };
          Set2.prototype["@@iterator"] = function() {
            return this.keys();
          };
          Set2.prototype[iteratorSymbol] = function() {
            return this.keys();
          };
          return Set2;
        }();
      }
      function CreateWeakMapPolyfill() {
        var UUID_SIZE = 16;
        var keys2 = HashMap.create();
        var rootKey = CreateUniqueKey();
        return function() {
          function WeakMap2() {
            this._key = CreateUniqueKey();
          }
          WeakMap2.prototype.has = function(target) {
            var table = GetOrCreateWeakMapTable(target, false);
            return table !== void 0 ? HashMap.has(table, this._key) : false;
          };
          WeakMap2.prototype.get = function(target) {
            var table = GetOrCreateWeakMapTable(target, false);
            return table !== void 0 ? HashMap.get(table, this._key) : void 0;
          };
          WeakMap2.prototype.set = function(target, value) {
            var table = GetOrCreateWeakMapTable(target, true);
            table[this._key] = value;
            return this;
          };
          WeakMap2.prototype.delete = function(target) {
            var table = GetOrCreateWeakMapTable(target, false);
            return table !== void 0 ? delete table[this._key] : false;
          };
          WeakMap2.prototype.clear = function() {
            this._key = CreateUniqueKey();
          };
          return WeakMap2;
        }();
        function CreateUniqueKey() {
          var key;
          do
            key = "@@WeakMap@@" + CreateUUID();
          while (HashMap.has(keys2, key));
          keys2[key] = true;
          return key;
        }
        function GetOrCreateWeakMapTable(target, create) {
          if (!hasOwn.call(target, rootKey)) {
            if (!create)
              return void 0;
            Object.defineProperty(target, rootKey, { value: HashMap.create() });
          }
          return target[rootKey];
        }
        function FillRandomBytes(buffer, size) {
          for (var i = 0; i < size; ++i)
            buffer[i] = Math.random() * 255 | 0;
          return buffer;
        }
        function GenRandomBytes(size) {
          if (typeof Uint8Array === "function") {
            if (typeof crypto !== "undefined")
              return crypto.getRandomValues(new Uint8Array(size));
            if (typeof msCrypto !== "undefined")
              return msCrypto.getRandomValues(new Uint8Array(size));
            return FillRandomBytes(new Uint8Array(size), size);
          }
          return FillRandomBytes(new Array(size), size);
        }
        function CreateUUID() {
          var data = GenRandomBytes(UUID_SIZE);
          data[6] = data[6] & 79 | 64;
          data[8] = data[8] & 191 | 128;
          var result = "";
          for (var offset = 0; offset < UUID_SIZE; ++offset) {
            var byte = data[offset];
            if (offset === 4 || offset === 6 || offset === 8)
              result += "-";
            if (byte < 16)
              result += "0";
            result += byte.toString(16).toLowerCase();
          }
          return result;
        }
      }
      function MakeDictionary(obj) {
        obj.__ = void 0;
        delete obj.__;
        return obj;
      }
    });
  })(Reflect2 || (Reflect2 = {}));

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/constants/metadata_keys.js
  var NAMED_TAG = "named";
  var NAME_TAG = "name";
  var UNMANAGED_TAG = "unmanaged";
  var OPTIONAL_TAG = "optional";
  var INJECT_TAG = "inject";
  var MULTI_INJECT_TAG = "multi_inject";
  var TAGGED = "inversify:tagged";
  var TAGGED_PROP = "inversify:tagged_props";
  var PARAM_TYPES = "inversify:paramtypes";
  var DESIGN_PARAM_TYPES = "design:paramtypes";
  var POST_CONSTRUCT = "post_construct";
  var PRE_DESTROY = "pre_destroy";
  function getNonCustomTagKeys() {
    return [
      INJECT_TAG,
      MULTI_INJECT_TAG,
      NAME_TAG,
      UNMANAGED_TAG,
      NAMED_TAG,
      OPTIONAL_TAG
    ];
  }
  var NON_CUSTOM_TAG_KEYS = getNonCustomTagKeys();

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/constants/literal_types.js
  var BindingScopeEnum = {
    Request: "Request",
    Singleton: "Singleton",
    Transient: "Transient"
  };
  var BindingTypeEnum = {
    ConstantValue: "ConstantValue",
    Constructor: "Constructor",
    DynamicValue: "DynamicValue",
    Factory: "Factory",
    Function: "Function",
    Instance: "Instance",
    Invalid: "Invalid",
    Provider: "Provider"
  };
  var TargetTypeEnum = {
    ClassProperty: "ClassProperty",
    ConstructorArgument: "ConstructorArgument",
    Variable: "Variable"
  };

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/utils/id.js
  var idCounter = 0;
  function id() {
    return idCounter++;
  }

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/bindings/binding.js
  var Binding = function() {
    function Binding2(serviceIdentifier, scope) {
      this.id = id();
      this.activated = false;
      this.serviceIdentifier = serviceIdentifier;
      this.scope = scope;
      this.type = BindingTypeEnum.Invalid;
      this.constraint = function(request) {
        return true;
      };
      this.implementationType = null;
      this.cache = null;
      this.factory = null;
      this.provider = null;
      this.onActivation = null;
      this.onDeactivation = null;
      this.dynamicValue = null;
    }
    Binding2.prototype.clone = function() {
      var clone = new Binding2(this.serviceIdentifier, this.scope);
      clone.activated = clone.scope === BindingScopeEnum.Singleton ? this.activated : false;
      clone.implementationType = this.implementationType;
      clone.dynamicValue = this.dynamicValue;
      clone.scope = this.scope;
      clone.type = this.type;
      clone.factory = this.factory;
      clone.provider = this.provider;
      clone.constraint = this.constraint;
      clone.onActivation = this.onActivation;
      clone.onDeactivation = this.onDeactivation;
      clone.cache = this.cache;
      return clone;
    };
    return Binding2;
  }();

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/constants/error_msgs.js
  var DUPLICATED_INJECTABLE_DECORATOR = "Cannot apply @injectable decorator multiple times.";
  var DUPLICATED_METADATA = "Metadata key was used more than once in a parameter:";
  var NULL_ARGUMENT = "NULL argument";
  var KEY_NOT_FOUND = "Key Not Found";
  var AMBIGUOUS_MATCH = "Ambiguous match found for serviceIdentifier:";
  var CANNOT_UNBIND = "Could not unbind serviceIdentifier:";
  var NOT_REGISTERED = "No matching bindings found for serviceIdentifier:";
  var MISSING_INJECTABLE_ANNOTATION = "Missing required @injectable annotation in:";
  var MISSING_INJECT_ANNOTATION = "Missing required @inject or @multiInject annotation in:";
  var UNDEFINED_INJECT_ANNOTATION = function(name) {
    return "@inject called with undefined this could mean that the class " + name + " has a circular dependency problem. You can use a LazyServiceIdentifer to  overcome this limitation.";
  };
  var CIRCULAR_DEPENDENCY = "Circular dependency found:";
  var INVALID_BINDING_TYPE = "Invalid binding type:";
  var NO_MORE_SNAPSHOTS_AVAILABLE = "No snapshot available to restore.";
  var INVALID_MIDDLEWARE_RETURN = "Invalid return type in middleware. Middleware must return!";
  var INVALID_FUNCTION_BINDING = "Value provided to function binding must be a function!";
  var LAZY_IN_SYNC = function(key) {
    return "You are attempting to construct '" + key + "' in a synchronous way\n but it has asynchronous dependencies.";
  };
  var INVALID_TO_SELF_VALUE = "The toSelf function can only be applied when a constructor is used as service identifier";
  var INVALID_DECORATOR_OPERATION = "The @inject @multiInject @tagged and @named decorators must be applied to the parameters of a class constructor or a class property.";
  var ARGUMENTS_LENGTH_MISMATCH = function() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      values[_i] = arguments[_i];
    }
    return "The number of constructor arguments in the derived class " + (values[0] + " must be >= than the number of constructor arguments of its base class.");
  };
  var CONTAINER_OPTIONS_MUST_BE_AN_OBJECT = "Invalid Container constructor argument. Container options must be an object.";
  var CONTAINER_OPTIONS_INVALID_DEFAULT_SCOPE = "Invalid Container option. Default scope must be a string ('singleton' or 'transient').";
  var CONTAINER_OPTIONS_INVALID_AUTO_BIND_INJECTABLE = "Invalid Container option. Auto bind injectable must be a boolean";
  var CONTAINER_OPTIONS_INVALID_SKIP_BASE_CHECK = "Invalid Container option. Skip base check must be a boolean";
  var ASYNC_UNBIND_REQUIRED = "Attempting to unbind dependency with asynchronous destruction (@preDestroy or onDeactivation)";
  var POST_CONSTRUCT_ERROR = function(clazz, errorMessage) {
    return "@postConstruct error in class " + clazz + ": " + errorMessage;
  };
  var PRE_DESTROY_ERROR = function(clazz, errorMessage) {
    return "@preDestroy error in class " + clazz + ": " + errorMessage;
  };
  var ON_DEACTIVATION_ERROR = function(clazz, errorMessage) {
    return "onDeactivation() error in class " + clazz + ": " + errorMessage;
  };
  var CIRCULAR_DEPENDENCY_IN_FACTORY = function(factoryType, serviceIdentifier) {
    return "It looks like there is a circular dependency in one of the '" + factoryType + "' bindings. Please investigate bindings with" + ("service identifier '" + serviceIdentifier + "'.");
  };
  var STACK_OVERFLOW = "Maximum call stack size exceeded";

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/planning/metadata_reader.js
  var MetadataReader = function() {
    function MetadataReader2() {
    }
    MetadataReader2.prototype.getConstructorMetadata = function(constructorFunc) {
      var compilerGeneratedMetadata = Reflect.getMetadata(PARAM_TYPES, constructorFunc);
      var userGeneratedMetadata = Reflect.getMetadata(TAGGED, constructorFunc);
      return {
        compilerGeneratedMetadata,
        userGeneratedMetadata: userGeneratedMetadata || {}
      };
    };
    MetadataReader2.prototype.getPropertiesMetadata = function(constructorFunc) {
      var userGeneratedMetadata = Reflect.getMetadata(TAGGED_PROP, constructorFunc) || [];
      return userGeneratedMetadata;
    };
    return MetadataReader2;
  }();

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/bindings/binding_count.js
  var BindingCount = {
    MultipleBindingsAvailable: 2,
    NoBindingsAvailable: 0,
    OnlyOneBindingAvailable: 1
  };

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/utils/exceptions.js
  function isStackOverflowExeption(error) {
    return error instanceof RangeError || error.message === STACK_OVERFLOW;
  }
  var tryAndThrowErrorIfStackOverflow = function(fn, errorCallback) {
    try {
      return fn();
    } catch (error) {
      if (isStackOverflowExeption(error)) {
        error = errorCallback();
      }
      throw error;
    }
  };

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/utils/serialization.js
  function getServiceIdentifierAsString(serviceIdentifier) {
    if (typeof serviceIdentifier === "function") {
      var _serviceIdentifier = serviceIdentifier;
      return _serviceIdentifier.name;
    } else if (typeof serviceIdentifier === "symbol") {
      return serviceIdentifier.toString();
    } else {
      var _serviceIdentifier = serviceIdentifier;
      return _serviceIdentifier;
    }
  }
  function listRegisteredBindingsForServiceIdentifier(container, serviceIdentifier, getBindings2) {
    var registeredBindingsList = "";
    var registeredBindings = getBindings2(container, serviceIdentifier);
    if (registeredBindings.length !== 0) {
      registeredBindingsList = "\nRegistered bindings:";
      registeredBindings.forEach(function(binding) {
        var name = "Object";
        if (binding.implementationType !== null) {
          name = getFunctionName(binding.implementationType);
        }
        registeredBindingsList = registeredBindingsList + "\n " + name;
        if (binding.constraint.metaData) {
          registeredBindingsList = registeredBindingsList + " - " + binding.constraint.metaData;
        }
      });
    }
    return registeredBindingsList;
  }
  function alreadyDependencyChain(request, serviceIdentifier) {
    if (request.parentRequest === null) {
      return false;
    } else if (request.parentRequest.serviceIdentifier === serviceIdentifier) {
      return true;
    } else {
      return alreadyDependencyChain(request.parentRequest, serviceIdentifier);
    }
  }
  function dependencyChainToString(request) {
    function _createStringArr(req, result) {
      if (result === void 0) {
        result = [];
      }
      var serviceIdentifier = getServiceIdentifierAsString(req.serviceIdentifier);
      result.push(serviceIdentifier);
      if (req.parentRequest !== null) {
        return _createStringArr(req.parentRequest, result);
      }
      return result;
    }
    var stringArr = _createStringArr(request);
    return stringArr.reverse().join(" --> ");
  }
  function circularDependencyToException(request) {
    request.childRequests.forEach(function(childRequest) {
      if (alreadyDependencyChain(childRequest, childRequest.serviceIdentifier)) {
        var services = dependencyChainToString(childRequest);
        throw new Error(CIRCULAR_DEPENDENCY + " " + services);
      } else {
        circularDependencyToException(childRequest);
      }
    });
  }
  function listMetadataForTarget(serviceIdentifierString, target) {
    if (target.isTagged() || target.isNamed()) {
      var m_1 = "";
      var namedTag = target.getNamedTag();
      var otherTags = target.getCustomTags();
      if (namedTag !== null) {
        m_1 += namedTag.toString() + "\n";
      }
      if (otherTags !== null) {
        otherTags.forEach(function(tag) {
          m_1 += tag.toString() + "\n";
        });
      }
      return " " + serviceIdentifierString + "\n " + serviceIdentifierString + " - " + m_1;
    } else {
      return " " + serviceIdentifierString;
    }
  }
  function getFunctionName(func) {
    if (func.name) {
      return func.name;
    } else {
      var name_1 = func.toString();
      var match = name_1.match(/^function\s*([^\s(]+)/);
      return match ? match[1] : "Anonymous function: " + name_1;
    }
  }
  function getSymbolDescription(symbol) {
    return symbol.toString().slice(7, -1);
  }

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/planning/context.js
  var Context = function() {
    function Context2(container) {
      this.id = id();
      this.container = container;
    }
    Context2.prototype.addPlan = function(plan2) {
      this.plan = plan2;
    };
    Context2.prototype.setCurrentRequest = function(currentRequest) {
      this.currentRequest = currentRequest;
    };
    return Context2;
  }();

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/planning/metadata.js
  var Metadata = function() {
    function Metadata2(key, value) {
      this.key = key;
      this.value = value;
    }
    Metadata2.prototype.toString = function() {
      if (this.key === NAMED_TAG) {
        return "named: " + String(this.value).toString() + " ";
      } else {
        return "tagged: { key:" + this.key.toString() + ", value: " + String(this.value) + " }";
      }
    };
    return Metadata2;
  }();

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/planning/plan.js
  var Plan = function() {
    function Plan2(parentContext, rootRequest) {
      this.parentContext = parentContext;
      this.rootRequest = rootRequest;
    }
    return Plan2;
  }();

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/annotation/lazy_service_identifier.js
  var LazyServiceIdentifer = function() {
    function LazyServiceIdentifer2(cb) {
      this._cb = cb;
    }
    LazyServiceIdentifer2.prototype.unwrap = function() {
      return this._cb();
    };
    return LazyServiceIdentifer2;
  }();

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/planning/queryable_string.js
  var QueryableString = function() {
    function QueryableString2(str) {
      this.str = str;
    }
    QueryableString2.prototype.startsWith = function(searchString) {
      return this.str.indexOf(searchString) === 0;
    };
    QueryableString2.prototype.endsWith = function(searchString) {
      var reverseString = "";
      var reverseSearchString = searchString.split("").reverse().join("");
      reverseString = this.str.split("").reverse().join("");
      return this.startsWith.call({ str: reverseString }, reverseSearchString);
    };
    QueryableString2.prototype.contains = function(searchString) {
      return this.str.indexOf(searchString) !== -1;
    };
    QueryableString2.prototype.equals = function(compareString) {
      return this.str === compareString;
    };
    QueryableString2.prototype.value = function() {
      return this.str;
    };
    return QueryableString2;
  }();

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/planning/target.js
  var Target = function() {
    function Target2(type, identifier, serviceIdentifier, namedOrTagged) {
      this.id = id();
      this.type = type;
      this.serviceIdentifier = serviceIdentifier;
      var queryableName = typeof identifier === "symbol" ? getSymbolDescription(identifier) : identifier;
      this.name = new QueryableString(queryableName || "");
      this.identifier = identifier;
      this.metadata = new Array();
      var metadataItem = null;
      if (typeof namedOrTagged === "string") {
        metadataItem = new Metadata(NAMED_TAG, namedOrTagged);
      } else if (namedOrTagged instanceof Metadata) {
        metadataItem = namedOrTagged;
      }
      if (metadataItem !== null) {
        this.metadata.push(metadataItem);
      }
    }
    Target2.prototype.hasTag = function(key) {
      for (var _i = 0, _a2 = this.metadata; _i < _a2.length; _i++) {
        var m = _a2[_i];
        if (m.key === key) {
          return true;
        }
      }
      return false;
    };
    Target2.prototype.isArray = function() {
      return this.hasTag(MULTI_INJECT_TAG);
    };
    Target2.prototype.matchesArray = function(name) {
      return this.matchesTag(MULTI_INJECT_TAG)(name);
    };
    Target2.prototype.isNamed = function() {
      return this.hasTag(NAMED_TAG);
    };
    Target2.prototype.isTagged = function() {
      return this.metadata.some(function(metadata) {
        return NON_CUSTOM_TAG_KEYS.every(function(key) {
          return metadata.key !== key;
        });
      });
    };
    Target2.prototype.isOptional = function() {
      return this.matchesTag(OPTIONAL_TAG)(true);
    };
    Target2.prototype.getNamedTag = function() {
      if (this.isNamed()) {
        return this.metadata.filter(function(m) {
          return m.key === NAMED_TAG;
        })[0];
      }
      return null;
    };
    Target2.prototype.getCustomTags = function() {
      if (this.isTagged()) {
        return this.metadata.filter(function(metadata) {
          return NON_CUSTOM_TAG_KEYS.every(function(key) {
            return metadata.key !== key;
          });
        });
      } else {
        return null;
      }
    };
    Target2.prototype.matchesNamedTag = function(name) {
      return this.matchesTag(NAMED_TAG)(name);
    };
    Target2.prototype.matchesTag = function(key) {
      var _this = this;
      return function(value) {
        for (var _i = 0, _a2 = _this.metadata; _i < _a2.length; _i++) {
          var m = _a2[_i];
          if (m.key === key && m.value === value) {
            return true;
          }
        }
        return false;
      };
    };
    return Target2;
  }();

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/planning/reflection_utils.js
  var __spreadArray = function(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  function getDependencies(metadataReader, func) {
    var constructorName = getFunctionName(func);
    return getTargets(metadataReader, constructorName, func, false);
  }
  function getTargets(metadataReader, constructorName, func, isBaseClass) {
    var metadata = metadataReader.getConstructorMetadata(func);
    var serviceIdentifiers = metadata.compilerGeneratedMetadata;
    if (serviceIdentifiers === void 0) {
      var msg = MISSING_INJECTABLE_ANNOTATION + " " + constructorName + ".";
      throw new Error(msg);
    }
    var constructorArgsMetadata = metadata.userGeneratedMetadata;
    var keys2 = Object.keys(constructorArgsMetadata);
    var hasUserDeclaredUnknownInjections = func.length === 0 && keys2.length > 0;
    var hasOptionalParameters = keys2.length > func.length;
    var iterations = hasUserDeclaredUnknownInjections || hasOptionalParameters ? keys2.length : func.length;
    var constructorTargets = getConstructorArgsAsTargets(isBaseClass, constructorName, serviceIdentifiers, constructorArgsMetadata, iterations);
    var propertyTargets = getClassPropsAsTargets(metadataReader, func, constructorName);
    var targets = __spreadArray(__spreadArray([], constructorTargets, true), propertyTargets, true);
    return targets;
  }
  function getConstructorArgsAsTarget(index, isBaseClass, constructorName, serviceIdentifiers, constructorArgsMetadata) {
    var targetMetadata = constructorArgsMetadata[index.toString()] || [];
    var metadata = formatTargetMetadata(targetMetadata);
    var isManaged = metadata.unmanaged !== true;
    var serviceIdentifier = serviceIdentifiers[index];
    var injectIdentifier = metadata.inject || metadata.multiInject;
    serviceIdentifier = injectIdentifier ? injectIdentifier : serviceIdentifier;
    if (serviceIdentifier instanceof LazyServiceIdentifer) {
      serviceIdentifier = serviceIdentifier.unwrap();
    }
    if (isManaged) {
      var isObject = serviceIdentifier === Object;
      var isFunction = serviceIdentifier === Function;
      var isUndefined = serviceIdentifier === void 0;
      var isUnknownType = isObject || isFunction || isUndefined;
      if (!isBaseClass && isUnknownType) {
        var msg = MISSING_INJECT_ANNOTATION + " argument " + index + " in class " + constructorName + ".";
        throw new Error(msg);
      }
      var target = new Target(TargetTypeEnum.ConstructorArgument, metadata.targetName, serviceIdentifier);
      target.metadata = targetMetadata;
      return target;
    }
    return null;
  }
  function getConstructorArgsAsTargets(isBaseClass, constructorName, serviceIdentifiers, constructorArgsMetadata, iterations) {
    var targets = [];
    for (var i = 0; i < iterations; i++) {
      var index = i;
      var target = getConstructorArgsAsTarget(index, isBaseClass, constructorName, serviceIdentifiers, constructorArgsMetadata);
      if (target !== null) {
        targets.push(target);
      }
    }
    return targets;
  }
  function _getServiceIdentifierForProperty(inject2, multiInject, propertyName, className) {
    var serviceIdentifier = inject2 || multiInject;
    if (serviceIdentifier === void 0) {
      var msg = MISSING_INJECTABLE_ANNOTATION + " for property " + String(propertyName) + " in class " + className + ".";
      throw new Error(msg);
    }
    return serviceIdentifier;
  }
  function getClassPropsAsTargets(metadataReader, constructorFunc, constructorName) {
    var classPropsMetadata = metadataReader.getPropertiesMetadata(constructorFunc);
    var targets = [];
    var symbolKeys = Object.getOwnPropertySymbols(classPropsMetadata);
    var stringKeys = Object.keys(classPropsMetadata);
    var keys2 = stringKeys.concat(symbolKeys);
    for (var _i = 0, keys_1 = keys2; _i < keys_1.length; _i++) {
      var key = keys_1[_i];
      var targetMetadata = classPropsMetadata[key];
      var metadata = formatTargetMetadata(targetMetadata);
      var identifier = metadata.targetName || key;
      var serviceIdentifier = _getServiceIdentifierForProperty(metadata.inject, metadata.multiInject, key, constructorName);
      var target = new Target(TargetTypeEnum.ClassProperty, identifier, serviceIdentifier);
      target.metadata = targetMetadata;
      targets.push(target);
    }
    var baseConstructor = Object.getPrototypeOf(constructorFunc.prototype).constructor;
    if (baseConstructor !== Object) {
      var baseTargets = getClassPropsAsTargets(metadataReader, baseConstructor, constructorName);
      targets = __spreadArray(__spreadArray([], targets, true), baseTargets, true);
    }
    return targets;
  }
  function getBaseClassDependencyCount(metadataReader, func) {
    var baseConstructor = Object.getPrototypeOf(func.prototype).constructor;
    if (baseConstructor !== Object) {
      var baseConstructorName = getFunctionName(baseConstructor);
      var targets = getTargets(metadataReader, baseConstructorName, baseConstructor, true);
      var metadata = targets.map(function(t) {
        return t.metadata.filter(function(m) {
          return m.key === UNMANAGED_TAG;
        });
      });
      var unmanagedCount = [].concat.apply([], metadata).length;
      var dependencyCount = targets.length - unmanagedCount;
      if (dependencyCount > 0) {
        return dependencyCount;
      } else {
        return getBaseClassDependencyCount(metadataReader, baseConstructor);
      }
    } else {
      return 0;
    }
  }
  function formatTargetMetadata(targetMetadata) {
    var targetMetadataMap = {};
    targetMetadata.forEach(function(m) {
      targetMetadataMap[m.key.toString()] = m.value;
    });
    return {
      inject: targetMetadataMap[INJECT_TAG],
      multiInject: targetMetadataMap[MULTI_INJECT_TAG],
      targetName: targetMetadataMap[NAME_TAG],
      unmanaged: targetMetadataMap[UNMANAGED_TAG]
    };
  }

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/planning/request.js
  var Request = function() {
    function Request2(serviceIdentifier, parentContext, parentRequest, bindings, target) {
      this.id = id();
      this.serviceIdentifier = serviceIdentifier;
      this.parentContext = parentContext;
      this.parentRequest = parentRequest;
      this.target = target;
      this.childRequests = [];
      this.bindings = Array.isArray(bindings) ? bindings : [bindings];
      this.requestScope = parentRequest === null ? /* @__PURE__ */ new Map() : null;
    }
    Request2.prototype.addChildRequest = function(serviceIdentifier, bindings, target) {
      var child = new Request2(serviceIdentifier, this.parentContext, this, bindings, target);
      this.childRequests.push(child);
      return child;
    };
    return Request2;
  }();

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/planning/planner.js
  function getBindingDictionary(cntnr) {
    return cntnr._bindingDictionary;
  }
  function _createTarget(isMultiInject, targetType, serviceIdentifier, name, key, value) {
    var metadataKey = isMultiInject ? MULTI_INJECT_TAG : INJECT_TAG;
    var injectMetadata = new Metadata(metadataKey, serviceIdentifier);
    var target = new Target(targetType, name, serviceIdentifier, injectMetadata);
    if (key !== void 0) {
      var tagMetadata = new Metadata(key, value);
      target.metadata.push(tagMetadata);
    }
    return target;
  }
  function _getActiveBindings(metadataReader, avoidConstraints, context, parentRequest, target) {
    var bindings = getBindings(context.container, target.serviceIdentifier);
    var activeBindings = [];
    if (bindings.length === BindingCount.NoBindingsAvailable && context.container.options.autoBindInjectable && typeof target.serviceIdentifier === "function" && metadataReader.getConstructorMetadata(target.serviceIdentifier).compilerGeneratedMetadata) {
      context.container.bind(target.serviceIdentifier).toSelf();
      bindings = getBindings(context.container, target.serviceIdentifier);
    }
    if (!avoidConstraints) {
      activeBindings = bindings.filter(function(binding) {
        var request = new Request(binding.serviceIdentifier, context, parentRequest, binding, target);
        return binding.constraint(request);
      });
    } else {
      activeBindings = bindings;
    }
    _validateActiveBindingCount(target.serviceIdentifier, activeBindings, target, context.container);
    return activeBindings;
  }
  function _validateActiveBindingCount(serviceIdentifier, bindings, target, container) {
    switch (bindings.length) {
      case BindingCount.NoBindingsAvailable:
        if (target.isOptional()) {
          return bindings;
        } else {
          var serviceIdentifierString = getServiceIdentifierAsString(serviceIdentifier);
          var msg = NOT_REGISTERED;
          msg += listMetadataForTarget(serviceIdentifierString, target);
          msg += listRegisteredBindingsForServiceIdentifier(container, serviceIdentifierString, getBindings);
          throw new Error(msg);
        }
      case BindingCount.OnlyOneBindingAvailable:
        return bindings;
      case BindingCount.MultipleBindingsAvailable:
      default:
        if (!target.isArray()) {
          var serviceIdentifierString = getServiceIdentifierAsString(serviceIdentifier);
          var msg = AMBIGUOUS_MATCH + " " + serviceIdentifierString;
          msg += listRegisteredBindingsForServiceIdentifier(container, serviceIdentifierString, getBindings);
          throw new Error(msg);
        } else {
          return bindings;
        }
    }
  }
  function _createSubRequests(metadataReader, avoidConstraints, serviceIdentifier, context, parentRequest, target) {
    var activeBindings;
    var childRequest;
    if (parentRequest === null) {
      activeBindings = _getActiveBindings(metadataReader, avoidConstraints, context, null, target);
      childRequest = new Request(serviceIdentifier, context, null, activeBindings, target);
      var thePlan = new Plan(context, childRequest);
      context.addPlan(thePlan);
    } else {
      activeBindings = _getActiveBindings(metadataReader, avoidConstraints, context, parentRequest, target);
      childRequest = parentRequest.addChildRequest(target.serviceIdentifier, activeBindings, target);
    }
    activeBindings.forEach(function(binding) {
      var subChildRequest = null;
      if (target.isArray()) {
        subChildRequest = childRequest.addChildRequest(binding.serviceIdentifier, binding, target);
      } else {
        if (binding.cache) {
          return;
        }
        subChildRequest = childRequest;
      }
      if (binding.type === BindingTypeEnum.Instance && binding.implementationType !== null) {
        var dependencies = getDependencies(metadataReader, binding.implementationType);
        if (!context.container.options.skipBaseClassChecks) {
          var baseClassDependencyCount = getBaseClassDependencyCount(metadataReader, binding.implementationType);
          if (dependencies.length < baseClassDependencyCount) {
            var error = ARGUMENTS_LENGTH_MISMATCH(getFunctionName(binding.implementationType));
            throw new Error(error);
          }
        }
        dependencies.forEach(function(dependency) {
          _createSubRequests(metadataReader, false, dependency.serviceIdentifier, context, subChildRequest, dependency);
        });
      }
    });
  }
  function getBindings(container, serviceIdentifier) {
    var bindings = [];
    var bindingDictionary = getBindingDictionary(container);
    if (bindingDictionary.hasKey(serviceIdentifier)) {
      bindings = bindingDictionary.get(serviceIdentifier);
    } else if (container.parent !== null) {
      bindings = getBindings(container.parent, serviceIdentifier);
    }
    return bindings;
  }
  function plan(metadataReader, container, isMultiInject, targetType, serviceIdentifier, key, value, avoidConstraints) {
    if (avoidConstraints === void 0) {
      avoidConstraints = false;
    }
    var context = new Context(container);
    var target = _createTarget(isMultiInject, targetType, serviceIdentifier, "", key, value);
    try {
      _createSubRequests(metadataReader, avoidConstraints, serviceIdentifier, context, null, target);
      return context;
    } catch (error) {
      if (isStackOverflowExeption(error)) {
        circularDependencyToException(context.plan.rootRequest);
      }
      throw error;
    }
  }
  function createMockRequest(container, serviceIdentifier, key, value) {
    var target = new Target(TargetTypeEnum.Variable, "", serviceIdentifier, new Metadata(key, value));
    var context = new Context(container);
    var request = new Request(serviceIdentifier, context, null, [], target);
    return request;
  }

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/utils/async.js
  function isPromise(object) {
    var isObjectOrFunction = typeof object === "object" && object !== null || typeof object === "function";
    return isObjectOrFunction && typeof object.then === "function";
  }
  function isPromiseOrContainsPromise(object) {
    if (isPromise(object)) {
      return true;
    }
    return Array.isArray(object) && object.some(isPromise);
  }

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/scope/scope.js
  var __awaiter = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1)
        throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f)
        throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
            return t;
          if (y = 0, t)
            op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2])
                _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5)
        throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var tryGetFromScope = function(requestScope, binding) {
    if (binding.scope === BindingScopeEnum.Singleton && binding.activated) {
      return binding.cache;
    }
    if (binding.scope === BindingScopeEnum.Request && requestScope.has(binding.id)) {
      return requestScope.get(binding.id);
    }
    return null;
  };
  var saveToScope = function(requestScope, binding, result) {
    if (binding.scope === BindingScopeEnum.Singleton) {
      _saveToSingletonScope(binding, result);
    }
    if (binding.scope === BindingScopeEnum.Request) {
      _saveToRequestScope(requestScope, binding, result);
    }
  };
  var _saveToRequestScope = function(requestScope, binding, result) {
    if (!requestScope.has(binding.id)) {
      requestScope.set(binding.id, result);
    }
  };
  var _saveToSingletonScope = function(binding, result) {
    binding.cache = result;
    binding.activated = true;
    if (isPromise(result)) {
      void _saveAsyncResultToSingletonScope(binding, result);
    }
  };
  var _saveAsyncResultToSingletonScope = function(binding, asyncResult) {
    return __awaiter(void 0, void 0, void 0, function() {
      var result, ex_1;
      return __generator(this, function(_a2) {
        switch (_a2.label) {
          case 0:
            _a2.trys.push([0, 2, , 3]);
            return [4, asyncResult];
          case 1:
            result = _a2.sent();
            binding.cache = result;
            return [3, 3];
          case 2:
            ex_1 = _a2.sent();
            binding.cache = null;
            binding.activated = false;
            throw ex_1;
          case 3:
            return [2];
        }
      });
    });
  };

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/utils/factory_type.js
  var FactoryType;
  (function(FactoryType2) {
    FactoryType2["DynamicValue"] = "toDynamicValue";
    FactoryType2["Factory"] = "toFactory";
    FactoryType2["Provider"] = "toProvider";
  })(FactoryType || (FactoryType = {}));

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/utils/binding_utils.js
  var ensureFullyBound = function(binding) {
    var boundValue = null;
    switch (binding.type) {
      case BindingTypeEnum.ConstantValue:
      case BindingTypeEnum.Function:
        boundValue = binding.cache;
        break;
      case BindingTypeEnum.Constructor:
      case BindingTypeEnum.Instance:
        boundValue = binding.implementationType;
        break;
      case BindingTypeEnum.DynamicValue:
        boundValue = binding.dynamicValue;
        break;
      case BindingTypeEnum.Provider:
        boundValue = binding.provider;
        break;
      case BindingTypeEnum.Factory:
        boundValue = binding.factory;
        break;
    }
    if (boundValue === null) {
      var serviceIdentifierAsString = getServiceIdentifierAsString(binding.serviceIdentifier);
      throw new Error(INVALID_BINDING_TYPE + " " + serviceIdentifierAsString);
    }
  };
  var getFactoryDetails = function(binding) {
    switch (binding.type) {
      case BindingTypeEnum.Factory:
        return { factory: binding.factory, factoryType: FactoryType.Factory };
      case BindingTypeEnum.Provider:
        return { factory: binding.provider, factoryType: FactoryType.Provider };
      case BindingTypeEnum.DynamicValue:
        return { factory: binding.dynamicValue, factoryType: FactoryType.DynamicValue };
      default:
        throw new Error("Unexpected factory type " + binding.type);
    }
  };

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/resolution/instantiation.js
  var __assign = function() {
    __assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator2 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1)
        throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f)
        throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
            return t;
          if (y = 0, t)
            op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2])
                _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5)
        throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __spreadArray2 = function(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  function _resolveRequests(childRequests, resolveRequest) {
    return childRequests.reduce(function(resolvedRequests, childRequest) {
      var injection = resolveRequest(childRequest);
      var targetType = childRequest.target.type;
      if (targetType === TargetTypeEnum.ConstructorArgument) {
        resolvedRequests.constructorInjections.push(injection);
      } else {
        resolvedRequests.propertyRequests.push(childRequest);
        resolvedRequests.propertyInjections.push(injection);
      }
      if (!resolvedRequests.isAsync) {
        resolvedRequests.isAsync = isPromiseOrContainsPromise(injection);
      }
      return resolvedRequests;
    }, { constructorInjections: [], propertyInjections: [], propertyRequests: [], isAsync: false });
  }
  function _createInstance(constr, childRequests, resolveRequest) {
    var result;
    if (childRequests.length > 0) {
      var resolved = _resolveRequests(childRequests, resolveRequest);
      var createInstanceWithInjectionsArg = __assign(__assign({}, resolved), { constr });
      if (resolved.isAsync) {
        result = createInstanceWithInjectionsAsync(createInstanceWithInjectionsArg);
      } else {
        result = createInstanceWithInjections(createInstanceWithInjectionsArg);
      }
    } else {
      result = new constr();
    }
    return result;
  }
  function createInstanceWithInjections(args) {
    var _a2;
    var instance = new ((_a2 = args.constr).bind.apply(_a2, __spreadArray2([void 0], args.constructorInjections, false)))();
    args.propertyRequests.forEach(function(r, index) {
      var property = r.target.identifier;
      var injection = args.propertyInjections[index];
      instance[property] = injection;
    });
    return instance;
  }
  function createInstanceWithInjectionsAsync(args) {
    return __awaiter2(this, void 0, void 0, function() {
      var constructorInjections, propertyInjections;
      return __generator2(this, function(_a2) {
        switch (_a2.label) {
          case 0:
            return [4, possiblyWaitInjections(args.constructorInjections)];
          case 1:
            constructorInjections = _a2.sent();
            return [4, possiblyWaitInjections(args.propertyInjections)];
          case 2:
            propertyInjections = _a2.sent();
            return [2, createInstanceWithInjections(__assign(__assign({}, args), { constructorInjections, propertyInjections }))];
        }
      });
    });
  }
  function possiblyWaitInjections(possiblePromiseinjections) {
    return __awaiter2(this, void 0, void 0, function() {
      var injections, _i, possiblePromiseinjections_1, injection;
      return __generator2(this, function(_a2) {
        injections = [];
        for (_i = 0, possiblePromiseinjections_1 = possiblePromiseinjections; _i < possiblePromiseinjections_1.length; _i++) {
          injection = possiblePromiseinjections_1[_i];
          if (Array.isArray(injection)) {
            injections.push(Promise.all(injection));
          } else {
            injections.push(injection);
          }
        }
        return [2, Promise.all(injections)];
      });
    });
  }
  function _getInstanceAfterPostConstruct(constr, result) {
    var postConstructResult = _postConstruct(constr, result);
    if (isPromise(postConstructResult)) {
      return postConstructResult.then(function() {
        return result;
      });
    } else {
      return result;
    }
  }
  function _postConstruct(constr, instance) {
    var _a2, _b;
    if (Reflect.hasMetadata(POST_CONSTRUCT, constr)) {
      var data = Reflect.getMetadata(POST_CONSTRUCT, constr);
      try {
        return (_b = (_a2 = instance)[data.value]) === null || _b === void 0 ? void 0 : _b.call(_a2);
      } catch (e) {
        throw new Error(POST_CONSTRUCT_ERROR(constr.name, e.message));
      }
    }
  }
  function _validateInstanceResolution(binding, constr) {
    if (binding.scope !== BindingScopeEnum.Singleton) {
      _throwIfHandlingDeactivation(binding, constr);
    }
  }
  function _throwIfHandlingDeactivation(binding, constr) {
    var scopeErrorMessage = "Class cannot be instantiated in " + (binding.scope === BindingScopeEnum.Request ? "request" : "transient") + " scope.";
    if (typeof binding.onDeactivation === "function") {
      throw new Error(ON_DEACTIVATION_ERROR(constr.name, scopeErrorMessage));
    }
    if (Reflect.hasMetadata(PRE_DESTROY, constr)) {
      throw new Error(PRE_DESTROY_ERROR(constr.name, scopeErrorMessage));
    }
  }
  function resolveInstance(binding, constr, childRequests, resolveRequest) {
    _validateInstanceResolution(binding, constr);
    var result = _createInstance(constr, childRequests, resolveRequest);
    if (isPromise(result)) {
      return result.then(function(resolvedResult) {
        return _getInstanceAfterPostConstruct(constr, resolvedResult);
      });
    } else {
      return _getInstanceAfterPostConstruct(constr, result);
    }
  }

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/resolution/resolver.js
  var __awaiter3 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator3 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1)
        throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f)
        throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
            return t;
          if (y = 0, t)
            op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2])
                _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5)
        throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var _resolveRequest = function(requestScope) {
    return function(request) {
      request.parentContext.setCurrentRequest(request);
      var bindings = request.bindings;
      var childRequests = request.childRequests;
      var targetIsAnArray = request.target && request.target.isArray();
      var targetParentIsNotAnArray = !request.parentRequest || !request.parentRequest.target || !request.target || !request.parentRequest.target.matchesArray(request.target.serviceIdentifier);
      if (targetIsAnArray && targetParentIsNotAnArray) {
        return childRequests.map(function(childRequest) {
          var _f = _resolveRequest(requestScope);
          return _f(childRequest);
        });
      } else {
        if (request.target.isOptional() && bindings.length === 0) {
          return void 0;
        }
        var binding = bindings[0];
        return _resolveBinding(requestScope, request, binding);
      }
    };
  };
  var _resolveFactoryFromBinding = function(binding, context) {
    var factoryDetails = getFactoryDetails(binding);
    return tryAndThrowErrorIfStackOverflow(function() {
      return factoryDetails.factory.bind(binding)(context);
    }, function() {
      return new Error(CIRCULAR_DEPENDENCY_IN_FACTORY(factoryDetails.factoryType, context.currentRequest.serviceIdentifier.toString()));
    });
  };
  var _getResolvedFromBinding = function(requestScope, request, binding) {
    var result;
    var childRequests = request.childRequests;
    ensureFullyBound(binding);
    switch (binding.type) {
      case BindingTypeEnum.ConstantValue:
      case BindingTypeEnum.Function:
        result = binding.cache;
        break;
      case BindingTypeEnum.Constructor:
        result = binding.implementationType;
        break;
      case BindingTypeEnum.Instance:
        result = resolveInstance(binding, binding.implementationType, childRequests, _resolveRequest(requestScope));
        break;
      default:
        result = _resolveFactoryFromBinding(binding, request.parentContext);
    }
    return result;
  };
  var _resolveInScope = function(requestScope, binding, resolveFromBinding) {
    var result = tryGetFromScope(requestScope, binding);
    if (result !== null) {
      return result;
    }
    result = resolveFromBinding();
    saveToScope(requestScope, binding, result);
    return result;
  };
  var _resolveBinding = function(requestScope, request, binding) {
    return _resolveInScope(requestScope, binding, function() {
      var result = _getResolvedFromBinding(requestScope, request, binding);
      if (isPromise(result)) {
        result = result.then(function(resolved) {
          return _onActivation(request, binding, resolved);
        });
      } else {
        result = _onActivation(request, binding, result);
      }
      return result;
    });
  };
  function _onActivation(request, binding, resolved) {
    var result = _bindingActivation(request.parentContext, binding, resolved);
    var containersIterator = _getContainersIterator(request.parentContext.container);
    var container;
    var containersIteratorResult = containersIterator.next();
    do {
      container = containersIteratorResult.value;
      var context_1 = request.parentContext;
      var serviceIdentifier = request.serviceIdentifier;
      var activationsIterator = _getContainerActivationsForService(container, serviceIdentifier);
      if (isPromise(result)) {
        result = _activateContainerAsync(activationsIterator, context_1, result);
      } else {
        result = _activateContainer(activationsIterator, context_1, result);
      }
      containersIteratorResult = containersIterator.next();
    } while (containersIteratorResult.done !== true && !getBindingDictionary(container).hasKey(request.serviceIdentifier));
    return result;
  }
  var _bindingActivation = function(context, binding, previousResult) {
    var result;
    if (typeof binding.onActivation === "function") {
      result = binding.onActivation(context, previousResult);
    } else {
      result = previousResult;
    }
    return result;
  };
  var _activateContainer = function(activationsIterator, context, result) {
    var activation = activationsIterator.next();
    while (!activation.done) {
      result = activation.value(context, result);
      if (isPromise(result)) {
        return _activateContainerAsync(activationsIterator, context, result);
      }
      activation = activationsIterator.next();
    }
    return result;
  };
  var _activateContainerAsync = function(activationsIterator, context, resultPromise) {
    return __awaiter3(void 0, void 0, void 0, function() {
      var result, activation;
      return __generator3(this, function(_a2) {
        switch (_a2.label) {
          case 0:
            return [4, resultPromise];
          case 1:
            result = _a2.sent();
            activation = activationsIterator.next();
            _a2.label = 2;
          case 2:
            if (!!activation.done)
              return [3, 4];
            return [4, activation.value(context, result)];
          case 3:
            result = _a2.sent();
            activation = activationsIterator.next();
            return [3, 2];
          case 4:
            return [2, result];
        }
      });
    });
  };
  var _getContainerActivationsForService = function(container, serviceIdentifier) {
    var activations = container._activations;
    return activations.hasKey(serviceIdentifier) ? activations.get(serviceIdentifier).values() : [].values();
  };
  var _getContainersIterator = function(container) {
    var containersStack = [container];
    var parent = container.parent;
    while (parent !== null) {
      containersStack.push(parent);
      parent = parent.parent;
    }
    var getNextContainer = function() {
      var nextContainer = containersStack.pop();
      if (nextContainer !== void 0) {
        return { done: false, value: nextContainer };
      } else {
        return { done: true, value: void 0 };
      }
    };
    var containersIterator = {
      next: getNextContainer
    };
    return containersIterator;
  };
  function resolve(context) {
    var _f = _resolveRequest(context.plan.rootRequest.requestScope);
    return _f(context.plan.rootRequest);
  }

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/syntax/constraint_helpers.js
  var traverseAncerstors = function(request, constraint) {
    var parent = request.parentRequest;
    if (parent !== null) {
      return constraint(parent) ? true : traverseAncerstors(parent, constraint);
    } else {
      return false;
    }
  };
  var taggedConstraint = function(key) {
    return function(value) {
      var constraint = function(request) {
        return request !== null && request.target !== null && request.target.matchesTag(key)(value);
      };
      constraint.metaData = new Metadata(key, value);
      return constraint;
    };
  };
  var namedConstraint = taggedConstraint(NAMED_TAG);
  var typeConstraint = function(type) {
    return function(request) {
      var binding = null;
      if (request !== null) {
        binding = request.bindings[0];
        if (typeof type === "string") {
          var serviceIdentifier = binding.serviceIdentifier;
          return serviceIdentifier === type;
        } else {
          var constructor = request.bindings[0].implementationType;
          return type === constructor;
        }
      }
      return false;
    };
  };

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/syntax/binding_when_syntax.js
  var BindingWhenSyntax = function() {
    function BindingWhenSyntax2(binding) {
      this._binding = binding;
    }
    BindingWhenSyntax2.prototype.when = function(constraint) {
      this._binding.constraint = constraint;
      return new BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax2.prototype.whenTargetNamed = function(name) {
      this._binding.constraint = namedConstraint(name);
      return new BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax2.prototype.whenTargetIsDefault = function() {
      this._binding.constraint = function(request) {
        if (request === null) {
          return false;
        }
        var targetIsDefault = request.target !== null && !request.target.isNamed() && !request.target.isTagged();
        return targetIsDefault;
      };
      return new BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax2.prototype.whenTargetTagged = function(tag, value) {
      this._binding.constraint = taggedConstraint(tag)(value);
      return new BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax2.prototype.whenInjectedInto = function(parent) {
      this._binding.constraint = function(request) {
        return request !== null && typeConstraint(parent)(request.parentRequest);
      };
      return new BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax2.prototype.whenParentNamed = function(name) {
      this._binding.constraint = function(request) {
        return request !== null && namedConstraint(name)(request.parentRequest);
      };
      return new BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax2.prototype.whenParentTagged = function(tag, value) {
      this._binding.constraint = function(request) {
        return request !== null && taggedConstraint(tag)(value)(request.parentRequest);
      };
      return new BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax2.prototype.whenAnyAncestorIs = function(ancestor) {
      this._binding.constraint = function(request) {
        return request !== null && traverseAncerstors(request, typeConstraint(ancestor));
      };
      return new BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax2.prototype.whenNoAncestorIs = function(ancestor) {
      this._binding.constraint = function(request) {
        return request !== null && !traverseAncerstors(request, typeConstraint(ancestor));
      };
      return new BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax2.prototype.whenAnyAncestorNamed = function(name) {
      this._binding.constraint = function(request) {
        return request !== null && traverseAncerstors(request, namedConstraint(name));
      };
      return new BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax2.prototype.whenNoAncestorNamed = function(name) {
      this._binding.constraint = function(request) {
        return request !== null && !traverseAncerstors(request, namedConstraint(name));
      };
      return new BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax2.prototype.whenAnyAncestorTagged = function(tag, value) {
      this._binding.constraint = function(request) {
        return request !== null && traverseAncerstors(request, taggedConstraint(tag)(value));
      };
      return new BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax2.prototype.whenNoAncestorTagged = function(tag, value) {
      this._binding.constraint = function(request) {
        return request !== null && !traverseAncerstors(request, taggedConstraint(tag)(value));
      };
      return new BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax2.prototype.whenAnyAncestorMatches = function(constraint) {
      this._binding.constraint = function(request) {
        return request !== null && traverseAncerstors(request, constraint);
      };
      return new BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax2.prototype.whenNoAncestorMatches = function(constraint) {
      this._binding.constraint = function(request) {
        return request !== null && !traverseAncerstors(request, constraint);
      };
      return new BindingOnSyntax(this._binding);
    };
    return BindingWhenSyntax2;
  }();

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/syntax/binding_on_syntax.js
  var BindingOnSyntax = function() {
    function BindingOnSyntax2(binding) {
      this._binding = binding;
    }
    BindingOnSyntax2.prototype.onActivation = function(handler) {
      this._binding.onActivation = handler;
      return new BindingWhenSyntax(this._binding);
    };
    BindingOnSyntax2.prototype.onDeactivation = function(handler) {
      this._binding.onDeactivation = handler;
      return new BindingWhenSyntax(this._binding);
    };
    return BindingOnSyntax2;
  }();

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/syntax/binding_when_on_syntax.js
  var BindingWhenOnSyntax = function() {
    function BindingWhenOnSyntax2(binding) {
      this._binding = binding;
      this._bindingWhenSyntax = new BindingWhenSyntax(this._binding);
      this._bindingOnSyntax = new BindingOnSyntax(this._binding);
    }
    BindingWhenOnSyntax2.prototype.when = function(constraint) {
      return this._bindingWhenSyntax.when(constraint);
    };
    BindingWhenOnSyntax2.prototype.whenTargetNamed = function(name) {
      return this._bindingWhenSyntax.whenTargetNamed(name);
    };
    BindingWhenOnSyntax2.prototype.whenTargetIsDefault = function() {
      return this._bindingWhenSyntax.whenTargetIsDefault();
    };
    BindingWhenOnSyntax2.prototype.whenTargetTagged = function(tag, value) {
      return this._bindingWhenSyntax.whenTargetTagged(tag, value);
    };
    BindingWhenOnSyntax2.prototype.whenInjectedInto = function(parent) {
      return this._bindingWhenSyntax.whenInjectedInto(parent);
    };
    BindingWhenOnSyntax2.prototype.whenParentNamed = function(name) {
      return this._bindingWhenSyntax.whenParentNamed(name);
    };
    BindingWhenOnSyntax2.prototype.whenParentTagged = function(tag, value) {
      return this._bindingWhenSyntax.whenParentTagged(tag, value);
    };
    BindingWhenOnSyntax2.prototype.whenAnyAncestorIs = function(ancestor) {
      return this._bindingWhenSyntax.whenAnyAncestorIs(ancestor);
    };
    BindingWhenOnSyntax2.prototype.whenNoAncestorIs = function(ancestor) {
      return this._bindingWhenSyntax.whenNoAncestorIs(ancestor);
    };
    BindingWhenOnSyntax2.prototype.whenAnyAncestorNamed = function(name) {
      return this._bindingWhenSyntax.whenAnyAncestorNamed(name);
    };
    BindingWhenOnSyntax2.prototype.whenAnyAncestorTagged = function(tag, value) {
      return this._bindingWhenSyntax.whenAnyAncestorTagged(tag, value);
    };
    BindingWhenOnSyntax2.prototype.whenNoAncestorNamed = function(name) {
      return this._bindingWhenSyntax.whenNoAncestorNamed(name);
    };
    BindingWhenOnSyntax2.prototype.whenNoAncestorTagged = function(tag, value) {
      return this._bindingWhenSyntax.whenNoAncestorTagged(tag, value);
    };
    BindingWhenOnSyntax2.prototype.whenAnyAncestorMatches = function(constraint) {
      return this._bindingWhenSyntax.whenAnyAncestorMatches(constraint);
    };
    BindingWhenOnSyntax2.prototype.whenNoAncestorMatches = function(constraint) {
      return this._bindingWhenSyntax.whenNoAncestorMatches(constraint);
    };
    BindingWhenOnSyntax2.prototype.onActivation = function(handler) {
      return this._bindingOnSyntax.onActivation(handler);
    };
    BindingWhenOnSyntax2.prototype.onDeactivation = function(handler) {
      return this._bindingOnSyntax.onDeactivation(handler);
    };
    return BindingWhenOnSyntax2;
  }();

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/syntax/binding_in_syntax.js
  var BindingInSyntax = function() {
    function BindingInSyntax2(binding) {
      this._binding = binding;
    }
    BindingInSyntax2.prototype.inRequestScope = function() {
      this._binding.scope = BindingScopeEnum.Request;
      return new BindingWhenOnSyntax(this._binding);
    };
    BindingInSyntax2.prototype.inSingletonScope = function() {
      this._binding.scope = BindingScopeEnum.Singleton;
      return new BindingWhenOnSyntax(this._binding);
    };
    BindingInSyntax2.prototype.inTransientScope = function() {
      this._binding.scope = BindingScopeEnum.Transient;
      return new BindingWhenOnSyntax(this._binding);
    };
    return BindingInSyntax2;
  }();

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/syntax/binding_in_when_on_syntax.js
  var BindingInWhenOnSyntax = function() {
    function BindingInWhenOnSyntax2(binding) {
      this._binding = binding;
      this._bindingWhenSyntax = new BindingWhenSyntax(this._binding);
      this._bindingOnSyntax = new BindingOnSyntax(this._binding);
      this._bindingInSyntax = new BindingInSyntax(binding);
    }
    BindingInWhenOnSyntax2.prototype.inRequestScope = function() {
      return this._bindingInSyntax.inRequestScope();
    };
    BindingInWhenOnSyntax2.prototype.inSingletonScope = function() {
      return this._bindingInSyntax.inSingletonScope();
    };
    BindingInWhenOnSyntax2.prototype.inTransientScope = function() {
      return this._bindingInSyntax.inTransientScope();
    };
    BindingInWhenOnSyntax2.prototype.when = function(constraint) {
      return this._bindingWhenSyntax.when(constraint);
    };
    BindingInWhenOnSyntax2.prototype.whenTargetNamed = function(name) {
      return this._bindingWhenSyntax.whenTargetNamed(name);
    };
    BindingInWhenOnSyntax2.prototype.whenTargetIsDefault = function() {
      return this._bindingWhenSyntax.whenTargetIsDefault();
    };
    BindingInWhenOnSyntax2.prototype.whenTargetTagged = function(tag, value) {
      return this._bindingWhenSyntax.whenTargetTagged(tag, value);
    };
    BindingInWhenOnSyntax2.prototype.whenInjectedInto = function(parent) {
      return this._bindingWhenSyntax.whenInjectedInto(parent);
    };
    BindingInWhenOnSyntax2.prototype.whenParentNamed = function(name) {
      return this._bindingWhenSyntax.whenParentNamed(name);
    };
    BindingInWhenOnSyntax2.prototype.whenParentTagged = function(tag, value) {
      return this._bindingWhenSyntax.whenParentTagged(tag, value);
    };
    BindingInWhenOnSyntax2.prototype.whenAnyAncestorIs = function(ancestor) {
      return this._bindingWhenSyntax.whenAnyAncestorIs(ancestor);
    };
    BindingInWhenOnSyntax2.prototype.whenNoAncestorIs = function(ancestor) {
      return this._bindingWhenSyntax.whenNoAncestorIs(ancestor);
    };
    BindingInWhenOnSyntax2.prototype.whenAnyAncestorNamed = function(name) {
      return this._bindingWhenSyntax.whenAnyAncestorNamed(name);
    };
    BindingInWhenOnSyntax2.prototype.whenAnyAncestorTagged = function(tag, value) {
      return this._bindingWhenSyntax.whenAnyAncestorTagged(tag, value);
    };
    BindingInWhenOnSyntax2.prototype.whenNoAncestorNamed = function(name) {
      return this._bindingWhenSyntax.whenNoAncestorNamed(name);
    };
    BindingInWhenOnSyntax2.prototype.whenNoAncestorTagged = function(tag, value) {
      return this._bindingWhenSyntax.whenNoAncestorTagged(tag, value);
    };
    BindingInWhenOnSyntax2.prototype.whenAnyAncestorMatches = function(constraint) {
      return this._bindingWhenSyntax.whenAnyAncestorMatches(constraint);
    };
    BindingInWhenOnSyntax2.prototype.whenNoAncestorMatches = function(constraint) {
      return this._bindingWhenSyntax.whenNoAncestorMatches(constraint);
    };
    BindingInWhenOnSyntax2.prototype.onActivation = function(handler) {
      return this._bindingOnSyntax.onActivation(handler);
    };
    BindingInWhenOnSyntax2.prototype.onDeactivation = function(handler) {
      return this._bindingOnSyntax.onDeactivation(handler);
    };
    return BindingInWhenOnSyntax2;
  }();

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/syntax/binding_to_syntax.js
  var BindingToSyntax = function() {
    function BindingToSyntax2(binding) {
      this._binding = binding;
    }
    BindingToSyntax2.prototype.to = function(constructor) {
      this._binding.type = BindingTypeEnum.Instance;
      this._binding.implementationType = constructor;
      return new BindingInWhenOnSyntax(this._binding);
    };
    BindingToSyntax2.prototype.toSelf = function() {
      if (typeof this._binding.serviceIdentifier !== "function") {
        throw new Error("" + INVALID_TO_SELF_VALUE);
      }
      var self2 = this._binding.serviceIdentifier;
      return this.to(self2);
    };
    BindingToSyntax2.prototype.toConstantValue = function(value) {
      this._binding.type = BindingTypeEnum.ConstantValue;
      this._binding.cache = value;
      this._binding.dynamicValue = null;
      this._binding.implementationType = null;
      this._binding.scope = BindingScopeEnum.Singleton;
      return new BindingWhenOnSyntax(this._binding);
    };
    BindingToSyntax2.prototype.toDynamicValue = function(func) {
      this._binding.type = BindingTypeEnum.DynamicValue;
      this._binding.cache = null;
      this._binding.dynamicValue = func;
      this._binding.implementationType = null;
      return new BindingInWhenOnSyntax(this._binding);
    };
    BindingToSyntax2.prototype.toConstructor = function(constructor) {
      this._binding.type = BindingTypeEnum.Constructor;
      this._binding.implementationType = constructor;
      this._binding.scope = BindingScopeEnum.Singleton;
      return new BindingWhenOnSyntax(this._binding);
    };
    BindingToSyntax2.prototype.toFactory = function(factory) {
      this._binding.type = BindingTypeEnum.Factory;
      this._binding.factory = factory;
      this._binding.scope = BindingScopeEnum.Singleton;
      return new BindingWhenOnSyntax(this._binding);
    };
    BindingToSyntax2.prototype.toFunction = function(func) {
      if (typeof func !== "function") {
        throw new Error(INVALID_FUNCTION_BINDING);
      }
      var bindingWhenOnSyntax = this.toConstantValue(func);
      this._binding.type = BindingTypeEnum.Function;
      this._binding.scope = BindingScopeEnum.Singleton;
      return bindingWhenOnSyntax;
    };
    BindingToSyntax2.prototype.toAutoFactory = function(serviceIdentifier) {
      this._binding.type = BindingTypeEnum.Factory;
      this._binding.factory = function(context) {
        var autofactory = function() {
          return context.container.get(serviceIdentifier);
        };
        return autofactory;
      };
      this._binding.scope = BindingScopeEnum.Singleton;
      return new BindingWhenOnSyntax(this._binding);
    };
    BindingToSyntax2.prototype.toAutoNamedFactory = function(serviceIdentifier) {
      this._binding.type = BindingTypeEnum.Factory;
      this._binding.factory = function(context) {
        return function(named) {
          return context.container.getNamed(serviceIdentifier, named);
        };
      };
      return new BindingWhenOnSyntax(this._binding);
    };
    BindingToSyntax2.prototype.toProvider = function(provider) {
      this._binding.type = BindingTypeEnum.Provider;
      this._binding.provider = provider;
      this._binding.scope = BindingScopeEnum.Singleton;
      return new BindingWhenOnSyntax(this._binding);
    };
    BindingToSyntax2.prototype.toService = function(service) {
      this.toDynamicValue(function(context) {
        return context.container.get(service);
      });
    };
    return BindingToSyntax2;
  }();

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/container/container_snapshot.js
  var ContainerSnapshot = function() {
    function ContainerSnapshot2() {
    }
    ContainerSnapshot2.of = function(bindings, middleware, activations, deactivations, moduleActivationStore) {
      var snapshot = new ContainerSnapshot2();
      snapshot.bindings = bindings;
      snapshot.middleware = middleware;
      snapshot.deactivations = deactivations;
      snapshot.activations = activations;
      snapshot.moduleActivationStore = moduleActivationStore;
      return snapshot;
    };
    return ContainerSnapshot2;
  }();

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/utils/clonable.js
  function isClonable(obj) {
    return typeof obj === "object" && obj !== null && "clone" in obj && typeof obj.clone === "function";
  }

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/container/lookup.js
  var Lookup = function() {
    function Lookup2() {
      this._map = /* @__PURE__ */ new Map();
    }
    Lookup2.prototype.getMap = function() {
      return this._map;
    };
    Lookup2.prototype.add = function(serviceIdentifier, value) {
      if (serviceIdentifier === null || serviceIdentifier === void 0) {
        throw new Error(NULL_ARGUMENT);
      }
      if (value === null || value === void 0) {
        throw new Error(NULL_ARGUMENT);
      }
      var entry = this._map.get(serviceIdentifier);
      if (entry !== void 0) {
        entry.push(value);
      } else {
        this._map.set(serviceIdentifier, [value]);
      }
    };
    Lookup2.prototype.get = function(serviceIdentifier) {
      if (serviceIdentifier === null || serviceIdentifier === void 0) {
        throw new Error(NULL_ARGUMENT);
      }
      var entry = this._map.get(serviceIdentifier);
      if (entry !== void 0) {
        return entry;
      } else {
        throw new Error(KEY_NOT_FOUND);
      }
    };
    Lookup2.prototype.remove = function(serviceIdentifier) {
      if (serviceIdentifier === null || serviceIdentifier === void 0) {
        throw new Error(NULL_ARGUMENT);
      }
      if (!this._map.delete(serviceIdentifier)) {
        throw new Error(KEY_NOT_FOUND);
      }
    };
    Lookup2.prototype.removeIntersection = function(lookup) {
      var _this = this;
      this.traverse(function(serviceIdentifier, value) {
        var lookupActivations = lookup.hasKey(serviceIdentifier) ? lookup.get(serviceIdentifier) : void 0;
        if (lookupActivations !== void 0) {
          var filteredValues = value.filter(function(lookupValue) {
            return !lookupActivations.some(function(moduleActivation) {
              return lookupValue === moduleActivation;
            });
          });
          _this._setValue(serviceIdentifier, filteredValues);
        }
      });
    };
    Lookup2.prototype.removeByCondition = function(condition) {
      var _this = this;
      var removals = [];
      this._map.forEach(function(entries, key) {
        var updatedEntries = [];
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
          var entry = entries_1[_i];
          var remove = condition(entry);
          if (remove) {
            removals.push(entry);
          } else {
            updatedEntries.push(entry);
          }
        }
        _this._setValue(key, updatedEntries);
      });
      return removals;
    };
    Lookup2.prototype.hasKey = function(serviceIdentifier) {
      if (serviceIdentifier === null || serviceIdentifier === void 0) {
        throw new Error(NULL_ARGUMENT);
      }
      return this._map.has(serviceIdentifier);
    };
    Lookup2.prototype.clone = function() {
      var copy = new Lookup2();
      this._map.forEach(function(value, key) {
        value.forEach(function(b) {
          return copy.add(key, isClonable(b) ? b.clone() : b);
        });
      });
      return copy;
    };
    Lookup2.prototype.traverse = function(func) {
      this._map.forEach(function(value, key) {
        func(key, value);
      });
    };
    Lookup2.prototype._setValue = function(serviceIdentifier, value) {
      if (value.length > 0) {
        this._map.set(serviceIdentifier, value);
      } else {
        this._map.delete(serviceIdentifier);
      }
    };
    return Lookup2;
  }();

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/container/module_activation_store.js
  var ModuleActivationStore = function() {
    function ModuleActivationStore2() {
      this._map = /* @__PURE__ */ new Map();
    }
    ModuleActivationStore2.prototype.remove = function(moduleId) {
      if (this._map.has(moduleId)) {
        var handlers = this._map.get(moduleId);
        this._map.delete(moduleId);
        return handlers;
      }
      return this._getEmptyHandlersStore();
    };
    ModuleActivationStore2.prototype.addDeactivation = function(moduleId, serviceIdentifier, onDeactivation) {
      this._getModuleActivationHandlers(moduleId).onDeactivations.add(serviceIdentifier, onDeactivation);
    };
    ModuleActivationStore2.prototype.addActivation = function(moduleId, serviceIdentifier, onActivation) {
      this._getModuleActivationHandlers(moduleId).onActivations.add(serviceIdentifier, onActivation);
    };
    ModuleActivationStore2.prototype.clone = function() {
      var clone = new ModuleActivationStore2();
      this._map.forEach(function(handlersStore, moduleId) {
        clone._map.set(moduleId, {
          onActivations: handlersStore.onActivations.clone(),
          onDeactivations: handlersStore.onDeactivations.clone()
        });
      });
      return clone;
    };
    ModuleActivationStore2.prototype._getModuleActivationHandlers = function(moduleId) {
      var moduleActivationHandlers = this._map.get(moduleId);
      if (moduleActivationHandlers === void 0) {
        moduleActivationHandlers = this._getEmptyHandlersStore();
        this._map.set(moduleId, moduleActivationHandlers);
      }
      return moduleActivationHandlers;
    };
    ModuleActivationStore2.prototype._getEmptyHandlersStore = function() {
      var handlersStore = {
        onActivations: new Lookup(),
        onDeactivations: new Lookup()
      };
      return handlersStore;
    };
    return ModuleActivationStore2;
  }();

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/container/container.js
  var __assign2 = function() {
    __assign2 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign2.apply(this, arguments);
  };
  var __awaiter4 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator4 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1)
        throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f)
        throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
            return t;
          if (y = 0, t)
            op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2])
                _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5)
        throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __spreadArray3 = function(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var Container = function() {
    function Container2(containerOptions) {
      var options = containerOptions || {};
      if (typeof options !== "object") {
        throw new Error("" + CONTAINER_OPTIONS_MUST_BE_AN_OBJECT);
      }
      if (options.defaultScope === void 0) {
        options.defaultScope = BindingScopeEnum.Transient;
      } else if (options.defaultScope !== BindingScopeEnum.Singleton && options.defaultScope !== BindingScopeEnum.Transient && options.defaultScope !== BindingScopeEnum.Request) {
        throw new Error("" + CONTAINER_OPTIONS_INVALID_DEFAULT_SCOPE);
      }
      if (options.autoBindInjectable === void 0) {
        options.autoBindInjectable = false;
      } else if (typeof options.autoBindInjectable !== "boolean") {
        throw new Error("" + CONTAINER_OPTIONS_INVALID_AUTO_BIND_INJECTABLE);
      }
      if (options.skipBaseClassChecks === void 0) {
        options.skipBaseClassChecks = false;
      } else if (typeof options.skipBaseClassChecks !== "boolean") {
        throw new Error("" + CONTAINER_OPTIONS_INVALID_SKIP_BASE_CHECK);
      }
      this.options = {
        autoBindInjectable: options.autoBindInjectable,
        defaultScope: options.defaultScope,
        skipBaseClassChecks: options.skipBaseClassChecks
      };
      this.id = id();
      this._bindingDictionary = new Lookup();
      this._snapshots = [];
      this._middleware = null;
      this._activations = new Lookup();
      this._deactivations = new Lookup();
      this.parent = null;
      this._metadataReader = new MetadataReader();
      this._moduleActivationStore = new ModuleActivationStore();
    }
    Container2.merge = function(container1, container2) {
      var containers = [];
      for (var _i = 2; _i < arguments.length; _i++) {
        containers[_i - 2] = arguments[_i];
      }
      var container = new Container2();
      var targetContainers = __spreadArray3([container1, container2], containers, true).map(function(targetContainer) {
        return getBindingDictionary(targetContainer);
      });
      var bindingDictionary = getBindingDictionary(container);
      function copyDictionary(origin, destination) {
        origin.traverse(function(_key, value) {
          value.forEach(function(binding) {
            destination.add(binding.serviceIdentifier, binding.clone());
          });
        });
      }
      targetContainers.forEach(function(targetBindingDictionary) {
        copyDictionary(targetBindingDictionary, bindingDictionary);
      });
      return container;
    };
    Container2.prototype.load = function() {
      var modules = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        modules[_i] = arguments[_i];
      }
      var getHelpers = this._getContainerModuleHelpersFactory();
      for (var _a2 = 0, modules_1 = modules; _a2 < modules_1.length; _a2++) {
        var currentModule = modules_1[_a2];
        var containerModuleHelpers = getHelpers(currentModule.id);
        currentModule.registry(containerModuleHelpers.bindFunction, containerModuleHelpers.unbindFunction, containerModuleHelpers.isboundFunction, containerModuleHelpers.rebindFunction, containerModuleHelpers.unbindAsyncFunction, containerModuleHelpers.onActivationFunction, containerModuleHelpers.onDeactivationFunction);
      }
    };
    Container2.prototype.loadAsync = function() {
      var modules = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        modules[_i] = arguments[_i];
      }
      return __awaiter4(this, void 0, void 0, function() {
        var getHelpers, _a2, modules_2, currentModule, containerModuleHelpers;
        return __generator4(this, function(_b) {
          switch (_b.label) {
            case 0:
              getHelpers = this._getContainerModuleHelpersFactory();
              _a2 = 0, modules_2 = modules;
              _b.label = 1;
            case 1:
              if (!(_a2 < modules_2.length))
                return [3, 4];
              currentModule = modules_2[_a2];
              containerModuleHelpers = getHelpers(currentModule.id);
              return [4, currentModule.registry(containerModuleHelpers.bindFunction, containerModuleHelpers.unbindFunction, containerModuleHelpers.isboundFunction, containerModuleHelpers.rebindFunction, containerModuleHelpers.unbindAsyncFunction, containerModuleHelpers.onActivationFunction, containerModuleHelpers.onDeactivationFunction)];
            case 2:
              _b.sent();
              _b.label = 3;
            case 3:
              _a2++;
              return [3, 1];
            case 4:
              return [2];
          }
        });
      });
    };
    Container2.prototype.unload = function() {
      var _this = this;
      var modules = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        modules[_i] = arguments[_i];
      }
      modules.forEach(function(module) {
        var deactivations = _this._removeModuleBindings(module.id);
        _this._deactivateSingletons(deactivations);
        _this._removeModuleHandlers(module.id);
      });
    };
    Container2.prototype.unloadAsync = function() {
      var modules = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        modules[_i] = arguments[_i];
      }
      return __awaiter4(this, void 0, void 0, function() {
        var _a2, modules_3, module_1, deactivations;
        return __generator4(this, function(_b) {
          switch (_b.label) {
            case 0:
              _a2 = 0, modules_3 = modules;
              _b.label = 1;
            case 1:
              if (!(_a2 < modules_3.length))
                return [3, 4];
              module_1 = modules_3[_a2];
              deactivations = this._removeModuleBindings(module_1.id);
              return [4, this._deactivateSingletonsAsync(deactivations)];
            case 2:
              _b.sent();
              this._removeModuleHandlers(module_1.id);
              _b.label = 3;
            case 3:
              _a2++;
              return [3, 1];
            case 4:
              return [2];
          }
        });
      });
    };
    Container2.prototype.bind = function(serviceIdentifier) {
      var scope = this.options.defaultScope || BindingScopeEnum.Transient;
      var binding = new Binding(serviceIdentifier, scope);
      this._bindingDictionary.add(serviceIdentifier, binding);
      return new BindingToSyntax(binding);
    };
    Container2.prototype.rebind = function(serviceIdentifier) {
      this.unbind(serviceIdentifier);
      return this.bind(serviceIdentifier);
    };
    Container2.prototype.rebindAsync = function(serviceIdentifier) {
      return __awaiter4(this, void 0, void 0, function() {
        return __generator4(this, function(_a2) {
          switch (_a2.label) {
            case 0:
              return [4, this.unbindAsync(serviceIdentifier)];
            case 1:
              _a2.sent();
              return [2, this.bind(serviceIdentifier)];
          }
        });
      });
    };
    Container2.prototype.unbind = function(serviceIdentifier) {
      if (this._bindingDictionary.hasKey(serviceIdentifier)) {
        var bindings = this._bindingDictionary.get(serviceIdentifier);
        this._deactivateSingletons(bindings);
      }
      this._removeServiceFromDictionary(serviceIdentifier);
    };
    Container2.prototype.unbindAsync = function(serviceIdentifier) {
      return __awaiter4(this, void 0, void 0, function() {
        var bindings;
        return __generator4(this, function(_a2) {
          switch (_a2.label) {
            case 0:
              if (!this._bindingDictionary.hasKey(serviceIdentifier))
                return [3, 2];
              bindings = this._bindingDictionary.get(serviceIdentifier);
              return [4, this._deactivateSingletonsAsync(bindings)];
            case 1:
              _a2.sent();
              _a2.label = 2;
            case 2:
              this._removeServiceFromDictionary(serviceIdentifier);
              return [2];
          }
        });
      });
    };
    Container2.prototype.unbindAll = function() {
      var _this = this;
      this._bindingDictionary.traverse(function(_key, value) {
        _this._deactivateSingletons(value);
      });
      this._bindingDictionary = new Lookup();
    };
    Container2.prototype.unbindAllAsync = function() {
      return __awaiter4(this, void 0, void 0, function() {
        var promises;
        var _this = this;
        return __generator4(this, function(_a2) {
          switch (_a2.label) {
            case 0:
              promises = [];
              this._bindingDictionary.traverse(function(_key, value) {
                promises.push(_this._deactivateSingletonsAsync(value));
              });
              return [4, Promise.all(promises)];
            case 1:
              _a2.sent();
              this._bindingDictionary = new Lookup();
              return [2];
          }
        });
      });
    };
    Container2.prototype.onActivation = function(serviceIdentifier, onActivation) {
      this._activations.add(serviceIdentifier, onActivation);
    };
    Container2.prototype.onDeactivation = function(serviceIdentifier, onDeactivation) {
      this._deactivations.add(serviceIdentifier, onDeactivation);
    };
    Container2.prototype.isBound = function(serviceIdentifier) {
      var bound = this._bindingDictionary.hasKey(serviceIdentifier);
      if (!bound && this.parent) {
        bound = this.parent.isBound(serviceIdentifier);
      }
      return bound;
    };
    Container2.prototype.isCurrentBound = function(serviceIdentifier) {
      return this._bindingDictionary.hasKey(serviceIdentifier);
    };
    Container2.prototype.isBoundNamed = function(serviceIdentifier, named) {
      return this.isBoundTagged(serviceIdentifier, NAMED_TAG, named);
    };
    Container2.prototype.isBoundTagged = function(serviceIdentifier, key, value) {
      var bound = false;
      if (this._bindingDictionary.hasKey(serviceIdentifier)) {
        var bindings = this._bindingDictionary.get(serviceIdentifier);
        var request_1 = createMockRequest(this, serviceIdentifier, key, value);
        bound = bindings.some(function(b) {
          return b.constraint(request_1);
        });
      }
      if (!bound && this.parent) {
        bound = this.parent.isBoundTagged(serviceIdentifier, key, value);
      }
      return bound;
    };
    Container2.prototype.snapshot = function() {
      this._snapshots.push(ContainerSnapshot.of(this._bindingDictionary.clone(), this._middleware, this._activations.clone(), this._deactivations.clone(), this._moduleActivationStore.clone()));
    };
    Container2.prototype.restore = function() {
      var snapshot = this._snapshots.pop();
      if (snapshot === void 0) {
        throw new Error(NO_MORE_SNAPSHOTS_AVAILABLE);
      }
      this._bindingDictionary = snapshot.bindings;
      this._activations = snapshot.activations;
      this._deactivations = snapshot.deactivations;
      this._middleware = snapshot.middleware;
      this._moduleActivationStore = snapshot.moduleActivationStore;
    };
    Container2.prototype.createChild = function(containerOptions) {
      var child = new Container2(containerOptions || this.options);
      child.parent = this;
      return child;
    };
    Container2.prototype.applyMiddleware = function() {
      var middlewares = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        middlewares[_i] = arguments[_i];
      }
      var initial = this._middleware ? this._middleware : this._planAndResolve();
      this._middleware = middlewares.reduce(function(prev, curr) {
        return curr(prev);
      }, initial);
    };
    Container2.prototype.applyCustomMetadataReader = function(metadataReader) {
      this._metadataReader = metadataReader;
    };
    Container2.prototype.get = function(serviceIdentifier) {
      var getArgs = this._getNotAllArgs(serviceIdentifier, false);
      return this._getButThrowIfAsync(getArgs);
    };
    Container2.prototype.getAsync = function(serviceIdentifier) {
      return __awaiter4(this, void 0, void 0, function() {
        var getArgs;
        return __generator4(this, function(_a2) {
          getArgs = this._getNotAllArgs(serviceIdentifier, false);
          return [2, this._get(getArgs)];
        });
      });
    };
    Container2.prototype.getTagged = function(serviceIdentifier, key, value) {
      var getArgs = this._getNotAllArgs(serviceIdentifier, false, key, value);
      return this._getButThrowIfAsync(getArgs);
    };
    Container2.prototype.getTaggedAsync = function(serviceIdentifier, key, value) {
      return __awaiter4(this, void 0, void 0, function() {
        var getArgs;
        return __generator4(this, function(_a2) {
          getArgs = this._getNotAllArgs(serviceIdentifier, false, key, value);
          return [2, this._get(getArgs)];
        });
      });
    };
    Container2.prototype.getNamed = function(serviceIdentifier, named) {
      return this.getTagged(serviceIdentifier, NAMED_TAG, named);
    };
    Container2.prototype.getNamedAsync = function(serviceIdentifier, named) {
      return this.getTaggedAsync(serviceIdentifier, NAMED_TAG, named);
    };
    Container2.prototype.getAll = function(serviceIdentifier) {
      var getArgs = this._getAllArgs(serviceIdentifier);
      return this._getButThrowIfAsync(getArgs);
    };
    Container2.prototype.getAllAsync = function(serviceIdentifier) {
      var getArgs = this._getAllArgs(serviceIdentifier);
      return this._getAll(getArgs);
    };
    Container2.prototype.getAllTagged = function(serviceIdentifier, key, value) {
      var getArgs = this._getNotAllArgs(serviceIdentifier, true, key, value);
      return this._getButThrowIfAsync(getArgs);
    };
    Container2.prototype.getAllTaggedAsync = function(serviceIdentifier, key, value) {
      var getArgs = this._getNotAllArgs(serviceIdentifier, true, key, value);
      return this._getAll(getArgs);
    };
    Container2.prototype.getAllNamed = function(serviceIdentifier, named) {
      return this.getAllTagged(serviceIdentifier, NAMED_TAG, named);
    };
    Container2.prototype.getAllNamedAsync = function(serviceIdentifier, named) {
      return this.getAllTaggedAsync(serviceIdentifier, NAMED_TAG, named);
    };
    Container2.prototype.resolve = function(constructorFunction) {
      var isBound = this.isBound(constructorFunction);
      if (!isBound) {
        this.bind(constructorFunction).toSelf();
      }
      var resolved = this.get(constructorFunction);
      if (!isBound) {
        this.unbind(constructorFunction);
      }
      return resolved;
    };
    Container2.prototype._preDestroy = function(constructor, instance) {
      if (Reflect.hasMetadata(PRE_DESTROY, constructor)) {
        var data = Reflect.getMetadata(PRE_DESTROY, constructor);
        return instance[data.value]();
      }
    };
    Container2.prototype._removeModuleHandlers = function(moduleId) {
      var moduleActivationsHandlers = this._moduleActivationStore.remove(moduleId);
      this._activations.removeIntersection(moduleActivationsHandlers.onActivations);
      this._deactivations.removeIntersection(moduleActivationsHandlers.onDeactivations);
    };
    Container2.prototype._removeModuleBindings = function(moduleId) {
      return this._bindingDictionary.removeByCondition(function(binding) {
        return binding.moduleId === moduleId;
      });
    };
    Container2.prototype._deactivate = function(binding, instance) {
      var _this = this;
      var constructor = Object.getPrototypeOf(instance).constructor;
      try {
        if (this._deactivations.hasKey(binding.serviceIdentifier)) {
          var result = this._deactivateContainer(instance, this._deactivations.get(binding.serviceIdentifier).values());
          if (isPromise(result)) {
            return this._handleDeactivationError(result.then(function() {
              return _this._propagateContainerDeactivationThenBindingAndPreDestroyAsync(binding, instance, constructor);
            }), constructor);
          }
        }
        var propagateDeactivationResult = this._propagateContainerDeactivationThenBindingAndPreDestroy(binding, instance, constructor);
        if (isPromise(propagateDeactivationResult)) {
          return this._handleDeactivationError(propagateDeactivationResult, constructor);
        }
      } catch (ex) {
        throw new Error(ON_DEACTIVATION_ERROR(constructor.name, ex.message));
      }
    };
    Container2.prototype._handleDeactivationError = function(asyncResult, constructor) {
      return __awaiter4(this, void 0, void 0, function() {
        var ex_1;
        return __generator4(this, function(_a2) {
          switch (_a2.label) {
            case 0:
              _a2.trys.push([0, 2, , 3]);
              return [4, asyncResult];
            case 1:
              _a2.sent();
              return [3, 3];
            case 2:
              ex_1 = _a2.sent();
              throw new Error(ON_DEACTIVATION_ERROR(constructor.name, ex_1.message));
            case 3:
              return [2];
          }
        });
      });
    };
    Container2.prototype._deactivateContainer = function(instance, deactivationsIterator) {
      var _this = this;
      var deactivation = deactivationsIterator.next();
      while (deactivation.value) {
        var result = deactivation.value(instance);
        if (isPromise(result)) {
          return result.then(function() {
            return _this._deactivateContainerAsync(instance, deactivationsIterator);
          });
        }
        deactivation = deactivationsIterator.next();
      }
    };
    Container2.prototype._deactivateContainerAsync = function(instance, deactivationsIterator) {
      return __awaiter4(this, void 0, void 0, function() {
        var deactivation;
        return __generator4(this, function(_a2) {
          switch (_a2.label) {
            case 0:
              deactivation = deactivationsIterator.next();
              _a2.label = 1;
            case 1:
              if (!deactivation.value)
                return [3, 3];
              return [4, deactivation.value(instance)];
            case 2:
              _a2.sent();
              deactivation = deactivationsIterator.next();
              return [3, 1];
            case 3:
              return [2];
          }
        });
      });
    };
    Container2.prototype._getContainerModuleHelpersFactory = function() {
      var _this = this;
      var setModuleId = function(bindingToSyntax, moduleId) {
        bindingToSyntax._binding.moduleId = moduleId;
      };
      var getBindFunction = function(moduleId) {
        return function(serviceIdentifier) {
          var bindingToSyntax = _this.bind(serviceIdentifier);
          setModuleId(bindingToSyntax, moduleId);
          return bindingToSyntax;
        };
      };
      var getUnbindFunction = function() {
        return function(serviceIdentifier) {
          return _this.unbind(serviceIdentifier);
        };
      };
      var getUnbindAsyncFunction = function() {
        return function(serviceIdentifier) {
          return _this.unbindAsync(serviceIdentifier);
        };
      };
      var getIsboundFunction = function() {
        return function(serviceIdentifier) {
          return _this.isBound(serviceIdentifier);
        };
      };
      var getRebindFunction = function(moduleId) {
        return function(serviceIdentifier) {
          var bindingToSyntax = _this.rebind(serviceIdentifier);
          setModuleId(bindingToSyntax, moduleId);
          return bindingToSyntax;
        };
      };
      var getOnActivationFunction = function(moduleId) {
        return function(serviceIdentifier, onActivation) {
          _this._moduleActivationStore.addActivation(moduleId, serviceIdentifier, onActivation);
          _this.onActivation(serviceIdentifier, onActivation);
        };
      };
      var getOnDeactivationFunction = function(moduleId) {
        return function(serviceIdentifier, onDeactivation) {
          _this._moduleActivationStore.addDeactivation(moduleId, serviceIdentifier, onDeactivation);
          _this.onDeactivation(serviceIdentifier, onDeactivation);
        };
      };
      return function(mId) {
        return {
          bindFunction: getBindFunction(mId),
          isboundFunction: getIsboundFunction(),
          onActivationFunction: getOnActivationFunction(mId),
          onDeactivationFunction: getOnDeactivationFunction(mId),
          rebindFunction: getRebindFunction(mId),
          unbindFunction: getUnbindFunction(),
          unbindAsyncFunction: getUnbindAsyncFunction()
        };
      };
    };
    Container2.prototype._getAll = function(getArgs) {
      return Promise.all(this._get(getArgs));
    };
    Container2.prototype._get = function(getArgs) {
      var planAndResolveArgs = __assign2(__assign2({}, getArgs), { contextInterceptor: function(context) {
        return context;
      }, targetType: TargetTypeEnum.Variable });
      if (this._middleware) {
        var middlewareResult = this._middleware(planAndResolveArgs);
        if (middlewareResult === void 0 || middlewareResult === null) {
          throw new Error(INVALID_MIDDLEWARE_RETURN);
        }
        return middlewareResult;
      }
      return this._planAndResolve()(planAndResolveArgs);
    };
    Container2.prototype._getButThrowIfAsync = function(getArgs) {
      var result = this._get(getArgs);
      if (isPromiseOrContainsPromise(result)) {
        throw new Error(LAZY_IN_SYNC(getArgs.serviceIdentifier));
      }
      return result;
    };
    Container2.prototype._getAllArgs = function(serviceIdentifier) {
      var getAllArgs = {
        avoidConstraints: true,
        isMultiInject: true,
        serviceIdentifier
      };
      return getAllArgs;
    };
    Container2.prototype._getNotAllArgs = function(serviceIdentifier, isMultiInject, key, value) {
      var getNotAllArgs = {
        avoidConstraints: false,
        isMultiInject,
        serviceIdentifier,
        key,
        value
      };
      return getNotAllArgs;
    };
    Container2.prototype._planAndResolve = function() {
      var _this = this;
      return function(args) {
        var context = plan(_this._metadataReader, _this, args.isMultiInject, args.targetType, args.serviceIdentifier, args.key, args.value, args.avoidConstraints);
        context = args.contextInterceptor(context);
        var result = resolve(context);
        return result;
      };
    };
    Container2.prototype._deactivateIfSingleton = function(binding) {
      var _this = this;
      if (!binding.activated) {
        return;
      }
      if (isPromise(binding.cache)) {
        return binding.cache.then(function(resolved) {
          return _this._deactivate(binding, resolved);
        });
      }
      return this._deactivate(binding, binding.cache);
    };
    Container2.prototype._deactivateSingletons = function(bindings) {
      for (var _i = 0, bindings_1 = bindings; _i < bindings_1.length; _i++) {
        var binding = bindings_1[_i];
        var result = this._deactivateIfSingleton(binding);
        if (isPromise(result)) {
          throw new Error(ASYNC_UNBIND_REQUIRED);
        }
      }
    };
    Container2.prototype._deactivateSingletonsAsync = function(bindings) {
      return __awaiter4(this, void 0, void 0, function() {
        var _this = this;
        return __generator4(this, function(_a2) {
          switch (_a2.label) {
            case 0:
              return [4, Promise.all(bindings.map(function(b) {
                return _this._deactivateIfSingleton(b);
              }))];
            case 1:
              _a2.sent();
              return [2];
          }
        });
      });
    };
    Container2.prototype._propagateContainerDeactivationThenBindingAndPreDestroy = function(binding, instance, constructor) {
      if (this.parent) {
        return this._deactivate.bind(this.parent)(binding, instance);
      } else {
        return this._bindingDeactivationAndPreDestroy(binding, instance, constructor);
      }
    };
    Container2.prototype._propagateContainerDeactivationThenBindingAndPreDestroyAsync = function(binding, instance, constructor) {
      return __awaiter4(this, void 0, void 0, function() {
        return __generator4(this, function(_a2) {
          switch (_a2.label) {
            case 0:
              if (!this.parent)
                return [3, 2];
              return [4, this._deactivate.bind(this.parent)(binding, instance)];
            case 1:
              _a2.sent();
              return [3, 4];
            case 2:
              return [4, this._bindingDeactivationAndPreDestroyAsync(binding, instance, constructor)];
            case 3:
              _a2.sent();
              _a2.label = 4;
            case 4:
              return [2];
          }
        });
      });
    };
    Container2.prototype._removeServiceFromDictionary = function(serviceIdentifier) {
      try {
        this._bindingDictionary.remove(serviceIdentifier);
      } catch (e) {
        throw new Error(CANNOT_UNBIND + " " + getServiceIdentifierAsString(serviceIdentifier));
      }
    };
    Container2.prototype._bindingDeactivationAndPreDestroy = function(binding, instance, constructor) {
      var _this = this;
      if (typeof binding.onDeactivation === "function") {
        var result = binding.onDeactivation(instance);
        if (isPromise(result)) {
          return result.then(function() {
            return _this._preDestroy(constructor, instance);
          });
        }
      }
      return this._preDestroy(constructor, instance);
    };
    Container2.prototype._bindingDeactivationAndPreDestroyAsync = function(binding, instance, constructor) {
      return __awaiter4(this, void 0, void 0, function() {
        return __generator4(this, function(_a2) {
          switch (_a2.label) {
            case 0:
              if (!(typeof binding.onDeactivation === "function"))
                return [3, 2];
              return [4, binding.onDeactivation(instance)];
            case 1:
              _a2.sent();
              _a2.label = 2;
            case 2:
              return [4, this._preDestroy(constructor, instance)];
            case 3:
              _a2.sent();
              return [2];
          }
        });
      });
    };
    return Container2;
  }();

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/utils/js.js
  function getFirstArrayDuplicate(array) {
    var seenValues = /* @__PURE__ */ new Set();
    for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
      var entry = array_1[_i];
      if (seenValues.has(entry)) {
        return entry;
      } else {
        seenValues.add(entry);
      }
    }
    return void 0;
  }

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/annotation/decorator_utils.js
  function targetIsConstructorFunction(target) {
    return target.prototype !== void 0;
  }
  function _throwIfMethodParameter(parameterName) {
    if (parameterName !== void 0) {
      throw new Error(INVALID_DECORATOR_OPERATION);
    }
  }
  function tagParameter(annotationTarget, parameterName, parameterIndex, metadata) {
    _throwIfMethodParameter(parameterName);
    _tagParameterOrProperty(TAGGED, annotationTarget, parameterIndex.toString(), metadata);
  }
  function tagProperty(annotationTarget, propertyName, metadata) {
    if (targetIsConstructorFunction(annotationTarget)) {
      throw new Error(INVALID_DECORATOR_OPERATION);
    }
    _tagParameterOrProperty(TAGGED_PROP, annotationTarget.constructor, propertyName, metadata);
  }
  function _ensureNoMetadataKeyDuplicates(metadata) {
    var metadatas = [];
    if (Array.isArray(metadata)) {
      metadatas = metadata;
      var duplicate = getFirstArrayDuplicate(metadatas.map(function(md) {
        return md.key;
      }));
      if (duplicate !== void 0) {
        throw new Error(DUPLICATED_METADATA + " " + duplicate.toString());
      }
    } else {
      metadatas = [metadata];
    }
    return metadatas;
  }
  function _tagParameterOrProperty(metadataKey, annotationTarget, key, metadata) {
    var metadatas = _ensureNoMetadataKeyDuplicates(metadata);
    var paramsOrPropertiesMetadata = {};
    if (Reflect.hasOwnMetadata(metadataKey, annotationTarget)) {
      paramsOrPropertiesMetadata = Reflect.getMetadata(metadataKey, annotationTarget);
    }
    var paramOrPropertyMetadata = paramsOrPropertiesMetadata[key];
    if (paramOrPropertyMetadata === void 0) {
      paramOrPropertyMetadata = [];
    } else {
      var _loop_1 = function(m2) {
        if (metadatas.some(function(md) {
          return md.key === m2.key;
        })) {
          throw new Error(DUPLICATED_METADATA + " " + m2.key.toString());
        }
      };
      for (var _i = 0, paramOrPropertyMetadata_1 = paramOrPropertyMetadata; _i < paramOrPropertyMetadata_1.length; _i++) {
        var m = paramOrPropertyMetadata_1[_i];
        _loop_1(m);
      }
    }
    paramOrPropertyMetadata.push.apply(paramOrPropertyMetadata, metadatas);
    paramsOrPropertiesMetadata[key] = paramOrPropertyMetadata;
    Reflect.defineMetadata(metadataKey, paramsOrPropertiesMetadata, annotationTarget);
  }
  function createTaggedDecorator(metadata) {
    return function(target, targetKey, indexOrPropertyDescriptor) {
      if (typeof indexOrPropertyDescriptor === "number") {
        tagParameter(target, targetKey, indexOrPropertyDescriptor, metadata);
      } else {
        tagProperty(target, targetKey, metadata);
      }
    };
  }

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/annotation/injectable.js
  function injectable() {
    return function(target) {
      if (Reflect.hasOwnMetadata(PARAM_TYPES, target)) {
        throw new Error(DUPLICATED_INJECTABLE_DECORATOR);
      }
      var types = Reflect.getMetadata(DESIGN_PARAM_TYPES, target) || [];
      Reflect.defineMetadata(PARAM_TYPES, types, target);
      return target;
    };
  }

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/annotation/inject_base.js
  function injectBase(metadataKey) {
    return function(serviceIdentifier) {
      return function(target, targetKey, indexOrPropertyDescriptor) {
        if (serviceIdentifier === void 0) {
          var className = typeof target === "function" ? target.name : target.constructor.name;
          throw new Error(UNDEFINED_INJECT_ANNOTATION(className));
        }
        return createTaggedDecorator(new Metadata(metadataKey, serviceIdentifier))(target, targetKey, indexOrPropertyDescriptor);
      };
    };
  }

  // node_modules/.pnpm/inversify@6.0.1/node_modules/inversify/es/annotation/inject.js
  var inject = injectBase(INJECT_TAG);

  // node_modules/.pnpm/vscode-languageserver-textdocument@1.0.4/node_modules/vscode-languageserver-textdocument/lib/esm/main.js
  var FullTextDocument = class {
    constructor(uri, languageId, version, content) {
      this._uri = uri;
      this._languageId = languageId;
      this._version = version;
      this._content = content;
      this._lineOffsets = void 0;
    }
    get uri() {
      return this._uri;
    }
    get languageId() {
      return this._languageId;
    }
    get version() {
      return this._version;
    }
    getText(range) {
      if (range) {
        const start = this.offsetAt(range.start);
        const end = this.offsetAt(range.end);
        return this._content.substring(start, end);
      }
      return this._content;
    }
    update(changes, version) {
      for (let change of changes) {
        if (FullTextDocument.isIncremental(change)) {
          const range = getWellformedRange(change.range);
          const startOffset = this.offsetAt(range.start);
          const endOffset = this.offsetAt(range.end);
          this._content = this._content.substring(0, startOffset) + change.text + this._content.substring(endOffset, this._content.length);
          const startLine = Math.max(range.start.line, 0);
          const endLine = Math.max(range.end.line, 0);
          let lineOffsets = this._lineOffsets;
          const addedLineOffsets = computeLineOffsets(change.text, false, startOffset);
          if (endLine - startLine === addedLineOffsets.length) {
            for (let i = 0, len = addedLineOffsets.length; i < len; i++) {
              lineOffsets[i + startLine + 1] = addedLineOffsets[i];
            }
          } else {
            if (addedLineOffsets.length < 1e4) {
              lineOffsets.splice(startLine + 1, endLine - startLine, ...addedLineOffsets);
            } else {
              this._lineOffsets = lineOffsets = lineOffsets.slice(0, startLine + 1).concat(addedLineOffsets, lineOffsets.slice(endLine + 1));
            }
          }
          const diff = change.text.length - (endOffset - startOffset);
          if (diff !== 0) {
            for (let i = startLine + 1 + addedLineOffsets.length, len = lineOffsets.length; i < len; i++) {
              lineOffsets[i] = lineOffsets[i] + diff;
            }
          }
        } else if (FullTextDocument.isFull(change)) {
          this._content = change.text;
          this._lineOffsets = void 0;
        } else {
          throw new Error("Unknown change event received");
        }
      }
      this._version = version;
    }
    getLineOffsets() {
      if (this._lineOffsets === void 0) {
        this._lineOffsets = computeLineOffsets(this._content, true);
      }
      return this._lineOffsets;
    }
    positionAt(offset) {
      offset = Math.max(Math.min(offset, this._content.length), 0);
      let lineOffsets = this.getLineOffsets();
      let low = 0, high = lineOffsets.length;
      if (high === 0) {
        return { line: 0, character: offset };
      }
      while (low < high) {
        let mid = Math.floor((low + high) / 2);
        if (lineOffsets[mid] > offset) {
          high = mid;
        } else {
          low = mid + 1;
        }
      }
      let line = low - 1;
      return { line, character: offset - lineOffsets[line] };
    }
    offsetAt(position) {
      let lineOffsets = this.getLineOffsets();
      if (position.line >= lineOffsets.length) {
        return this._content.length;
      } else if (position.line < 0) {
        return 0;
      }
      let lineOffset = lineOffsets[position.line];
      let nextLineOffset = position.line + 1 < lineOffsets.length ? lineOffsets[position.line + 1] : this._content.length;
      return Math.max(Math.min(lineOffset + position.character, nextLineOffset), lineOffset);
    }
    get lineCount() {
      return this.getLineOffsets().length;
    }
    static isIncremental(event) {
      let candidate = event;
      return candidate !== void 0 && candidate !== null && typeof candidate.text === "string" && candidate.range !== void 0 && (candidate.rangeLength === void 0 || typeof candidate.rangeLength === "number");
    }
    static isFull(event) {
      let candidate = event;
      return candidate !== void 0 && candidate !== null && typeof candidate.text === "string" && candidate.range === void 0 && candidate.rangeLength === void 0;
    }
  };
  var TextDocument;
  (function(TextDocument2) {
    function create(uri, languageId, version, content) {
      return new FullTextDocument(uri, languageId, version, content);
    }
    TextDocument2.create = create;
    function update(document, changes, version) {
      if (document instanceof FullTextDocument) {
        document.update(changes, version);
        return document;
      } else {
        throw new Error("TextDocument.update: document must be created by TextDocument.create");
      }
    }
    TextDocument2.update = update;
    function applyEdits(document, edits) {
      let text = document.getText();
      let sortedEdits = mergeSort(edits.map(getWellformedEdit), (a, b) => {
        let diff = a.range.start.line - b.range.start.line;
        if (diff === 0) {
          return a.range.start.character - b.range.start.character;
        }
        return diff;
      });
      let lastModifiedOffset = 0;
      const spans = [];
      for (const e of sortedEdits) {
        let startOffset = document.offsetAt(e.range.start);
        if (startOffset < lastModifiedOffset) {
          throw new Error("Overlapping edit");
        } else if (startOffset > lastModifiedOffset) {
          spans.push(text.substring(lastModifiedOffset, startOffset));
        }
        if (e.newText.length) {
          spans.push(e.newText);
        }
        lastModifiedOffset = document.offsetAt(e.range.end);
      }
      spans.push(text.substr(lastModifiedOffset));
      return spans.join("");
    }
    TextDocument2.applyEdits = applyEdits;
  })(TextDocument || (TextDocument = {}));
  function mergeSort(data, compare) {
    if (data.length <= 1) {
      return data;
    }
    const p = data.length / 2 | 0;
    const left = data.slice(0, p);
    const right = data.slice(p);
    mergeSort(left, compare);
    mergeSort(right, compare);
    let leftIdx = 0;
    let rightIdx = 0;
    let i = 0;
    while (leftIdx < left.length && rightIdx < right.length) {
      let ret = compare(left[leftIdx], right[rightIdx]);
      if (ret <= 0) {
        data[i++] = left[leftIdx++];
      } else {
        data[i++] = right[rightIdx++];
      }
    }
    while (leftIdx < left.length) {
      data[i++] = left[leftIdx++];
    }
    while (rightIdx < right.length) {
      data[i++] = right[rightIdx++];
    }
    return data;
  }
  function computeLineOffsets(text, isAtLineStart, textOffset = 0) {
    const result = isAtLineStart ? [textOffset] : [];
    for (let i = 0; i < text.length; i++) {
      let ch = text.charCodeAt(i);
      if (ch === 13 || ch === 10) {
        if (ch === 13 && i + 1 < text.length && text.charCodeAt(i + 1) === 10) {
          i++;
        }
        result.push(textOffset + i + 1);
      }
    }
    return result;
  }
  function getWellformedRange(range) {
    const start = range.start;
    const end = range.end;
    if (start.line > end.line || start.line === end.line && start.character > end.character) {
      return { start: end, end: start };
    }
    return range;
  }
  function getWellformedEdit(textEdit) {
    const range = getWellformedRange(textEdit.range);
    if (range !== textEdit.range) {
      return { newText: textEdit.newText, range };
    }
    return textEdit;
  }

  // packages/grammarly-richtext-encoder/dist/index.mjs
  var import_web_tree_sitter = __toESM(require_tree_sitter(), 1);
  function createTransformer(options) {
    return { encode, decode };
    function encode(tree) {
      let offset = 0;
      let attributes = {};
      const richtext = { ops: [] };
      const sourcemap = [];
      processNode(tree.rootNode);
      return [richtext, sourcemap];
      function processNode(node) {
        if (options.shouldIgnoreSubtree(node))
          return;
        const previousAttributes = attributes;
        attributes = { ...previousAttributes, ...options.getAttributesFor(node, { ...attributes }) };
        options.processNode(node, insert);
        node.children.forEach(processNode);
        if (options.isBlockNode(node) && !hasTrailingNewline())
          insert("\n");
        attributes = previousAttributes;
      }
      function insert(text, node, skip = 0) {
        richtext.ops.push({
          insert: text,
          attributes: text === "\n" ? pickBlockAttributes(attributes) : pickInlineAttributes(attributes)
        });
        if (node != null)
          sourcemap.push([node.startIndex + skip, offset, text.length]);
        else if (sourcemap.length > 0) {
          const last = sourcemap[sourcemap.length - 1];
          sourcemap.push([last[0] + last[2], offset, 0]);
        } else {
          sourcemap.push([0, offset, 0]);
        }
        offset += text.length;
      }
      function hasTrailingNewline() {
        return richtext.ops.length > 0 && String(richtext.ops[richtext.ops.length - 1].insert).endsWith("\n");
      }
    }
    function decode(text) {
      var _a2, _b, _c, _d;
      const ops = text.ops.reduce((ops2, op) => {
        if (ops2.length === 0 || op.insert === "\n") {
          ops2.push(op);
        } else {
          const last = ops2[ops2.length - 1];
          if (typeof last.insert === "string" && typeof op.insert === "string" && last.insert !== "\n" && sameAttributes(last.attributes, op.attributes)) {
            last.insert += op.insert;
          } else {
            ops2.push(op);
          }
        }
        return ops2;
      }, []);
      const root = { type: "block", childNodes: [], attributes: {}, value: {} };
      function findParent(node, attributes) {
        if (node === root) {
          const parent = { type: "inline", attributes, value: attributes, childNodes: [], parent: node };
          root.childNodes.push(parent);
          return parent;
        }
        const diff = diffAttributes(node.attributes, attributes);
        if (diff.removed.length == 0 && diff.added.length === 0)
          return node;
        if (diff.removed.length === 0) {
          const value = {};
          diff.added.forEach((key) => {
            value[key] = attributes[key];
          });
          const parent = { type: "inline", attributes, value, childNodes: [], parent: node };
          node.childNodes.push(parent);
          return parent;
        }
        if (node.parent == null)
          throw new Error("Unexpected");
        return findParent(node.parent, attributes);
      }
      let current = root;
      const leaves = [];
      for (let i = 0; i < ops.length; i += 1) {
        const op = ops[i];
        if (op.insert === "\n" && i > 0) {
          let j = i;
          for (; j >= 0; --j) {
            if (((_a2 = ops[j - 1]) === null || _a2 === void 0 ? void 0 : _a2.insert) === "\n")
              break;
          }
          const target = commonAncestor(leaves.find((leave) => leave.op === ops[j]), leaves[leaves.length - 1]);
          const parent = target.parent;
          const node = {
            type: "block",
            attributes: (_b = op.attributes) !== null && _b !== void 0 ? _b : {},
            value: (_c = op.attributes) !== null && _c !== void 0 ? _c : {},
            childNodes: [target],
            parent
          };
          const index = parent.childNodes.indexOf(target);
          parent.childNodes.splice(index, 1);
          parent.childNodes.push(node);
          target.parent = node;
        } else {
          const node = { type: "#text", op };
          leaves.push(node);
          current = findParent(current, (_d = op.attributes) !== null && _d !== void 0 ? _d : {});
          current.childNodes.push(node);
        }
      }
      return processNode(root);
      function processNode(node) {
        if (node.type === "#text")
          return options.stringify(node, "");
        return options.stringify(node, node.childNodes.map((node2) => processNode(node2)).join(""));
      }
    }
  }
  function commonAncestor(a, b) {
    const pa = pathFromRoot(a);
    const pb = pathFromRoot(b);
    const n = Math.min(pa.length, pb.length);
    for (let i = 0; i < n; ++i) {
      if (pa[i] !== pb[i])
        return getEl(pa[i - 1]);
    }
    throw new Error("No commont ancestor");
    function getEl(node) {
      if (node.type === "#text")
        return node.parent;
      return node;
    }
  }
  function pathFromRoot(node) {
    const path = [];
    let current = node;
    while (current != null) {
      path.push(current);
      current = current.parent;
    }
    return path.reverse();
  }
  function sameAttributes(a, b) {
    if (a === b)
      return true;
    if (a == null || b == null)
      return false;
    if (Object.keys(a).length !== Object.keys(b).length)
      return false;
    return Object.keys(a).every((key) => a[key] === b[key]);
  }
  function diffAttributes(target, source) {
    if (target == null && source == null)
      return { added: [], removed: [] };
    else if (target == null && source != null)
      return { added: Object.keys(source), removed: [] };
    else if (target != null && source == null)
      return { added: [], removed: Object.keys(target) };
    else if (target != null && source != null) {
      const added = [];
      const removed = [];
      for (const key of Object.keys(target)) {
        if (!(key in source)) {
          removed.push(key);
        } else if (source[key] !== target[key]) {
          added.push(key);
          removed.push(key);
        }
      }
      for (const key of Object.keys(source)) {
        if (!(key in target)) {
          added.push(key);
        }
      }
      return { added, removed };
    }
    return { added: [], removed: [] };
  }
  function pickBlockAttributes(attributes) {
    const picked = {};
    for (const key of ["header", "list", "indent"]) {
      if (key in attributes) {
        picked[key] = attributes[key];
      }
    }
    return picked;
  }
  function pickInlineAttributes(attributes) {
    const picked = {};
    for (const key of ["bold", "italic", "underline", "code", "link"]) {
      if (key in attributes) {
        picked[key] = attributes[key];
      }
    }
    return picked;
  }
  var IGNORED_NODES$1 = /* @__PURE__ */ new Set([
    "'",
    "/>",
    '"',
    "<",
    "<!",
    "</",
    "=",
    ">",
    "attribute",
    "attribute_name",
    "attribute_value",
    "comment",
    "doctype",
    "end_tag",
    "erroneous_end_tag",
    "erroneous_end_tag_name",
    "fragment",
    "quoted_attribute_value",
    "raw_text",
    "script_element",
    "self_closing_tag",
    "start_tag",
    "style_element",
    "tag_name"
  ]);
  var BLOCK_NODES$1 = /* @__PURE__ */ new Set(["element"]);
  var html = createTransformer({
    isBlockNode(node) {
      return BLOCK_NODES$1.has(node.type);
    },
    shouldIgnoreSubtree(node) {
      return IGNORED_NODES$1.has(node.type);
    },
    getAttributesFor(node) {
      switch (node.type) {
        case "strong_emphasis":
          return { bold: true };
        case "emphasis":
          return { italic: true };
        case "code_span":
          return { code: true };
        case "atx_heading":
          if (node.firstChild != null) {
            return { header: parseInt(node.firstChild.type.substring(5, 6), 10) };
          }
          return {};
        default:
          return {};
      }
    },
    stringify(node, content) {
      if (node.type === "#text") {
        if (typeof node.op === "string")
          return node.op;
        return "\n";
      }
      return toHTML(content, node.value);
      function toHTML(text, attributes) {
        if (attributes.bold)
          return `<b>${text}</b>`;
        if (attributes.italic)
          return `<i>${text}</i>`;
        if (attributes.code)
          return `<code>${text}</code>`;
        if (attributes.linebreak)
          return `<br />`;
        if (attributes.link)
          return `<a href=${JSON.stringify(attributes.link)}>${text}</a>`;
        if (attributes.header)
          return `<h${attributes.header}>${content}</h${attributes.header}>`;
        return text;
      }
    },
    processNode(node, insert) {
      if (node.type === "text") {
        insert(node.text, node);
      }
    }
  });
  var IGNORED_NODES = /* @__PURE__ */ new Set([
    "atx_h1_marker",
    "atx_h2_marker",
    "atx_h3_marker",
    "atx_h4_marker",
    "atx_h5_marker",
    "atx_h6_marker",
    "block_quote",
    "code_fence_content",
    "fenced_code_block",
    "html_atrribute",
    "html_attribute_key",
    "html_attribute_value",
    "html_cdata_section",
    "html_close_tag",
    "html_comment",
    "html_declaration_name",
    "html_declaration",
    "html_open_tag",
    "html_processing_instruction",
    "html_self_closing_tag",
    "html_tag_name",
    "link_destination",
    "link_reference_definition",
    "list_marker",
    "setext_h1_underline",
    "setext_h2_underline",
    "table_cell",
    "table_column_alignment",
    "table_data_row",
    "table_delimiter_row",
    "table_header_row",
    "table",
    "task_list_item_marker"
  ]);
  var BLOCK_NODES = /* @__PURE__ */ new Set([
    "document",
    "atx_heading",
    "setext_heading",
    "task_list_item",
    "html_block",
    "image_description",
    "indented_code_block",
    "list_item",
    "paragraph",
    "thematic_break",
    "tight_list"
  ]);
  var markdown = createTransformer({
    isBlockNode(node) {
      return BLOCK_NODES.has(node.type);
    },
    shouldIgnoreSubtree(node) {
      return IGNORED_NODES.has(node.type);
    },
    getAttributesFor(node, attributes) {
      var _a2, _b, _c, _d, _e, _f;
      switch (node.type) {
        case "strong_emphasis":
          return { bold: true };
        case "emphasis":
          return { italic: true };
        case "code_span":
          return { code: true };
        case "atx_heading":
          if (node.firstChild != null) {
            return { header: parseInt(node.firstChild.type.substring(5, 6), 10) };
          }
          return {};
        case "setext_heading":
          if (node.lastNamedChild != null) {
            return {
              header: parseInt(node.lastNamedChild.type.substring("setext_h".length, "setext_h".length + 1), 10)
            };
          }
          return {};
        case "link":
          if (((_a2 = node.lastNamedChild) === null || _a2 === void 0 ? void 0 : _a2.type) === "link_destination") {
            return {
              link: (_c = (_b = node.lastNamedChild.firstNamedChild) === null || _b === void 0 ? void 0 : _b.text) !== null && _c !== void 0 ? _c : ""
            };
          }
          return { link: "" };
        case "tight_list":
          return {
            list: /[0-9]/.test((_f = (_e = (_d = node.firstNamedChild) === null || _d === void 0 ? void 0 : _d.firstNamedChild) === null || _e === void 0 ? void 0 : _e.text) !== null && _f !== void 0 ? _f : "") ? "number" : "bullet",
            indent: attributes.indent != null ? attributes.indent + 1 : 1
          };
        default:
          return {};
      }
    },
    stringify(node, content) {
      if (node.type === "#text") {
        if (typeof node.op.insert === "string")
          return node.op.insert;
        return "\n";
      }
      return toMarkdown(content, node.value);
    },
    processNode(node, insert) {
      var _a2, _b, _c;
      if (node.type === "text") {
        if (((_b = (_a2 = node.parent) === null || _a2 === void 0 ? void 0 : _a2.parent) === null || _b === void 0 ? void 0 : _b.type) === "atx_heading") {
          insert(node.text.slice(1), node, 1);
        } else if (((_c = node.parent) === null || _c === void 0 ? void 0 : _c.type) === "paragraph" && node.text.startsWith(": ")) {
          insert(node.text.slice(2), node, 2);
        } else
          insert(node.text, node);
      } else if (node.type === "line_break" || node.type === "hard_line_break") {
        insert("\n", node);
      } else if (node.type === "soft_line_break") {
        insert(" ", node);
      }
    }
  });
  function toMarkdown(text, attributes) {
    if (attributes == null)
      return text;
    if (attributes.bold)
      return `**${text}**`;
    if (attributes.italic)
      return `_${text}_`;
    if (attributes.code)
      return "`" + text + "`";
    if (attributes.link)
      return `[${text}](${attributes.link})`;
    if (attributes.list && attributes.indent != null)
      return `${"  ".repeat(attributes.indent - 1)}${attributes.list === "number" ? "1. " : "- "}${text}
`;
    if (attributes.header)
      return "#".repeat(attributes.header) + " " + text + "\n";
    if (attributes["code-block"])
      return "```\n" + text + "\n```\n";
    return text;
  }
  var parsers = /* @__PURE__ */ new Map();
  var parsersPending = /* @__PURE__ */ new Map();
  async function createParser(language) {
    const previous = parsers.get(language);
    if (previous != null)
      return previous;
    const parser = createParserInner();
    parsersPending.set(language, parser);
    return await parser;
    async function createParserInner() {
      await import_web_tree_sitter.default.init();
      const parser2 = new import_web_tree_sitter.default();
      parser2.setLanguage(await import_web_tree_sitter.default.Language.load(getLanguageFile()));
      parsers.set(language, parser2);
      parsersPending.delete(language);
      return parser2;
    }
    function getLanguageFile() {
      var _a2;
      if (typeof process !== "undefined" && ((_a2 = process.versions) === null || _a2 === void 0 ? void 0 : _a2.node) != null) {
        if (false) {
          return __require.resolve(`../dist/tree-sitter-${language}.wasm`);
        }
        return __require.resolve(`./tree-sitter-${language}.wasm`);
      }
      return `tree-sitter-${language}.wasm`;
    }
  }
  var transformers = { html, markdown };

  // node_modules/.pnpm/entities@4.3.0/node_modules/entities/lib/esm/generated/decode-data-html.js
  var decode_data_html_default = new Uint16Array([7489, 60, 213, 305, 650, 1181, 1403, 1488, 1653, 1758, 1954, 2006, 2063, 2634, 2705, 3489, 3693, 3849, 3878, 4298, 4648, 4833, 5141, 5277, 5315, 5343, 5413, 0, 0, 0, 0, 0, 0, 5483, 5837, 6541, 7186, 7645, 8062, 8288, 8624, 8845, 9152, 9211, 9282, 10276, 10514, 11528, 11848, 12238, 12310, 12986, 13881, 14252, 14590, 14888, 14961, 15072, 15150, 2048, 69, 77, 97, 98, 99, 102, 103, 108, 109, 110, 111, 112, 114, 115, 116, 117, 92, 98, 102, 109, 115, 127, 132, 139, 144, 149, 152, 166, 179, 185, 200, 207, 108, 105, 103, 32827, 198, 16582, 80, 32827, 38, 16422, 99, 117, 116, 101, 32827, 193, 16577, 114, 101, 118, 101, 59, 16642, 256, 105, 121, 120, 125, 114, 99, 32827, 194, 16578, 59, 17424, 114, 59, 49152, 55349, 56580, 114, 97, 118, 101, 32827, 192, 16576, 112, 104, 97, 59, 17297, 97, 99, 114, 59, 16640, 100, 59, 27219, 256, 103, 112, 157, 161, 111, 110, 59, 16644, 102, 59, 49152, 55349, 56632, 112, 108, 121, 70, 117, 110, 99, 116, 105, 111, 110, 59, 24673, 105, 110, 103, 32827, 197, 16581, 256, 99, 115, 190, 195, 114, 59, 49152, 55349, 56476, 105, 103, 110, 59, 25172, 105, 108, 100, 101, 32827, 195, 16579, 109, 108, 32827, 196, 16580, 1024, 97, 99, 101, 102, 111, 114, 115, 117, 229, 251, 254, 279, 284, 290, 295, 298, 256, 99, 114, 234, 242, 107, 115, 108, 97, 115, 104, 59, 25110, 374, 246, 248, 59, 27367, 101, 100, 59, 25350, 121, 59, 17425, 384, 99, 114, 116, 261, 267, 276, 97, 117, 115, 101, 59, 25141, 110, 111, 117, 108, 108, 105, 115, 59, 24876, 97, 59, 17298, 114, 59, 49152, 55349, 56581, 112, 102, 59, 49152, 55349, 56633, 101, 118, 101, 59, 17112, 99, 242, 275, 109, 112, 101, 113, 59, 25166, 1792, 72, 79, 97, 99, 100, 101, 102, 104, 105, 108, 111, 114, 115, 117, 333, 337, 342, 384, 414, 418, 437, 439, 442, 476, 533, 627, 632, 638, 99, 121, 59, 17447, 80, 89, 32827, 169, 16553, 384, 99, 112, 121, 349, 354, 378, 117, 116, 101, 59, 16646, 256, 59, 105, 359, 360, 25298, 116, 97, 108, 68, 105, 102, 102, 101, 114, 101, 110, 116, 105, 97, 108, 68, 59, 24901, 108, 101, 121, 115, 59, 24877, 512, 97, 101, 105, 111, 393, 398, 404, 408, 114, 111, 110, 59, 16652, 100, 105, 108, 32827, 199, 16583, 114, 99, 59, 16648, 110, 105, 110, 116, 59, 25136, 111, 116, 59, 16650, 256, 100, 110, 423, 429, 105, 108, 108, 97, 59, 16568, 116, 101, 114, 68, 111, 116, 59, 16567, 242, 383, 105, 59, 17319, 114, 99, 108, 101, 512, 68, 77, 80, 84, 455, 459, 465, 470, 111, 116, 59, 25241, 105, 110, 117, 115, 59, 25238, 108, 117, 115, 59, 25237, 105, 109, 101, 115, 59, 25239, 111, 256, 99, 115, 482, 504, 107, 119, 105, 115, 101, 67, 111, 110, 116, 111, 117, 114, 73, 110, 116, 101, 103, 114, 97, 108, 59, 25138, 101, 67, 117, 114, 108, 121, 256, 68, 81, 515, 527, 111, 117, 98, 108, 101, 81, 117, 111, 116, 101, 59, 24605, 117, 111, 116, 101, 59, 24601, 512, 108, 110, 112, 117, 542, 552, 583, 597, 111, 110, 256, 59, 101, 549, 550, 25143, 59, 27252, 384, 103, 105, 116, 559, 566, 570, 114, 117, 101, 110, 116, 59, 25185, 110, 116, 59, 25135, 111, 117, 114, 73, 110, 116, 101, 103, 114, 97, 108, 59, 25134, 256, 102, 114, 588, 590, 59, 24834, 111, 100, 117, 99, 116, 59, 25104, 110, 116, 101, 114, 67, 108, 111, 99, 107, 119, 105, 115, 101, 67, 111, 110, 116, 111, 117, 114, 73, 110, 116, 101, 103, 114, 97, 108, 59, 25139, 111, 115, 115, 59, 27183, 99, 114, 59, 49152, 55349, 56478, 112, 256, 59, 67, 644, 645, 25299, 97, 112, 59, 25165, 1408, 68, 74, 83, 90, 97, 99, 101, 102, 105, 111, 115, 672, 684, 688, 692, 696, 715, 727, 737, 742, 819, 1165, 256, 59, 111, 377, 677, 116, 114, 97, 104, 100, 59, 26897, 99, 121, 59, 17410, 99, 121, 59, 17413, 99, 121, 59, 17423, 384, 103, 114, 115, 703, 708, 711, 103, 101, 114, 59, 24609, 114, 59, 24993, 104, 118, 59, 27364, 256, 97, 121, 720, 725, 114, 111, 110, 59, 16654, 59, 17428, 108, 256, 59, 116, 733, 734, 25095, 97, 59, 17300, 114, 59, 49152, 55349, 56583, 256, 97, 102, 747, 807, 256, 99, 109, 752, 802, 114, 105, 116, 105, 99, 97, 108, 512, 65, 68, 71, 84, 768, 774, 790, 796, 99, 117, 116, 101, 59, 16564, 111, 372, 779, 781, 59, 17113, 98, 108, 101, 65, 99, 117, 116, 101, 59, 17117, 114, 97, 118, 101, 59, 16480, 105, 108, 100, 101, 59, 17116, 111, 110, 100, 59, 25284, 102, 101, 114, 101, 110, 116, 105, 97, 108, 68, 59, 24902, 1136, 829, 0, 0, 0, 834, 852, 0, 1029, 102, 59, 49152, 55349, 56635, 384, 59, 68, 69, 840, 841, 845, 16552, 111, 116, 59, 24796, 113, 117, 97, 108, 59, 25168, 98, 108, 101, 768, 67, 68, 76, 82, 85, 86, 867, 882, 898, 975, 994, 1016, 111, 110, 116, 111, 117, 114, 73, 110, 116, 101, 103, 114, 97, 236, 569, 111, 628, 889, 0, 0, 891, 187, 841, 110, 65, 114, 114, 111, 119, 59, 25043, 256, 101, 111, 903, 932, 102, 116, 384, 65, 82, 84, 912, 918, 929, 114, 114, 111, 119, 59, 25040, 105, 103, 104, 116, 65, 114, 114, 111, 119, 59, 25044, 101, 229, 714, 110, 103, 256, 76, 82, 939, 964, 101, 102, 116, 256, 65, 82, 947, 953, 114, 114, 111, 119, 59, 26616, 105, 103, 104, 116, 65, 114, 114, 111, 119, 59, 26618, 105, 103, 104, 116, 65, 114, 114, 111, 119, 59, 26617, 105, 103, 104, 116, 256, 65, 84, 984, 990, 114, 114, 111, 119, 59, 25042, 101, 101, 59, 25256, 112, 577, 1001, 0, 0, 1007, 114, 114, 111, 119, 59, 25041, 111, 119, 110, 65, 114, 114, 111, 119, 59, 25045, 101, 114, 116, 105, 99, 97, 108, 66, 97, 114, 59, 25125, 110, 768, 65, 66, 76, 82, 84, 97, 1042, 1066, 1072, 1118, 1151, 892, 114, 114, 111, 119, 384, 59, 66, 85, 1053, 1054, 1058, 24979, 97, 114, 59, 26899, 112, 65, 114, 114, 111, 119, 59, 25077, 114, 101, 118, 101, 59, 17169, 101, 102, 116, 722, 1082, 0, 1094, 0, 1104, 105, 103, 104, 116, 86, 101, 99, 116, 111, 114, 59, 26960, 101, 101, 86, 101, 99, 116, 111, 114, 59, 26974, 101, 99, 116, 111, 114, 256, 59, 66, 1113, 1114, 25021, 97, 114, 59, 26966, 105, 103, 104, 116, 468, 1127, 0, 1137, 101, 101, 86, 101, 99, 116, 111, 114, 59, 26975, 101, 99, 116, 111, 114, 256, 59, 66, 1146, 1147, 25025, 97, 114, 59, 26967, 101, 101, 256, 59, 65, 1158, 1159, 25252, 114, 114, 111, 119, 59, 24999, 256, 99, 116, 1170, 1175, 114, 59, 49152, 55349, 56479, 114, 111, 107, 59, 16656, 2048, 78, 84, 97, 99, 100, 102, 103, 108, 109, 111, 112, 113, 115, 116, 117, 120, 1213, 1216, 1220, 1227, 1246, 1250, 1255, 1262, 1269, 1313, 1327, 1334, 1362, 1373, 1376, 1381, 71, 59, 16714, 72, 32827, 208, 16592, 99, 117, 116, 101, 32827, 201, 16585, 384, 97, 105, 121, 1234, 1239, 1244, 114, 111, 110, 59, 16666, 114, 99, 32827, 202, 16586, 59, 17453, 111, 116, 59, 16662, 114, 59, 49152, 55349, 56584, 114, 97, 118, 101, 32827, 200, 16584, 101, 109, 101, 110, 116, 59, 25096, 256, 97, 112, 1274, 1278, 99, 114, 59, 16658, 116, 121, 595, 1286, 0, 0, 1298, 109, 97, 108, 108, 83, 113, 117, 97, 114, 101, 59, 26107, 101, 114, 121, 83, 109, 97, 108, 108, 83, 113, 117, 97, 114, 101, 59, 26027, 256, 103, 112, 1318, 1322, 111, 110, 59, 16664, 102, 59, 49152, 55349, 56636, 115, 105, 108, 111, 110, 59, 17301, 117, 256, 97, 105, 1340, 1353, 108, 256, 59, 84, 1346, 1347, 27253, 105, 108, 100, 101, 59, 25154, 108, 105, 98, 114, 105, 117, 109, 59, 25036, 256, 99, 105, 1367, 1370, 114, 59, 24880, 109, 59, 27251, 97, 59, 17303, 109, 108, 32827, 203, 16587, 256, 105, 112, 1386, 1391, 115, 116, 115, 59, 25091, 111, 110, 101, 110, 116, 105, 97, 108, 69, 59, 24903, 640, 99, 102, 105, 111, 115, 1413, 1416, 1421, 1458, 1484, 121, 59, 17444, 114, 59, 49152, 55349, 56585, 108, 108, 101, 100, 595, 1431, 0, 0, 1443, 109, 97, 108, 108, 83, 113, 117, 97, 114, 101, 59, 26108, 101, 114, 121, 83, 109, 97, 108, 108, 83, 113, 117, 97, 114, 101, 59, 26026, 880, 1466, 0, 1471, 0, 0, 1476, 102, 59, 49152, 55349, 56637, 65, 108, 108, 59, 25088, 114, 105, 101, 114, 116, 114, 102, 59, 24881, 99, 242, 1483, 1536, 74, 84, 97, 98, 99, 100, 102, 103, 111, 114, 115, 116, 1512, 1516, 1519, 1530, 1536, 1554, 1558, 1563, 1565, 1571, 1644, 1650, 99, 121, 59, 17411, 32827, 62, 16446, 109, 109, 97, 256, 59, 100, 1527, 1528, 17299, 59, 17372, 114, 101, 118, 101, 59, 16670, 384, 101, 105, 121, 1543, 1548, 1552, 100, 105, 108, 59, 16674, 114, 99, 59, 16668, 59, 17427, 111, 116, 59, 16672, 114, 59, 49152, 55349, 56586, 59, 25305, 112, 102, 59, 49152, 55349, 56638, 101, 97, 116, 101, 114, 768, 69, 70, 71, 76, 83, 84, 1589, 1604, 1614, 1622, 1627, 1638, 113, 117, 97, 108, 256, 59, 76, 1598, 1599, 25189, 101, 115, 115, 59, 25307, 117, 108, 108, 69, 113, 117, 97, 108, 59, 25191, 114, 101, 97, 116, 101, 114, 59, 27298, 101, 115, 115, 59, 25207, 108, 97, 110, 116, 69, 113, 117, 97, 108, 59, 27262, 105, 108, 100, 101, 59, 25203, 99, 114, 59, 49152, 55349, 56482, 59, 25195, 1024, 65, 97, 99, 102, 105, 111, 115, 117, 1669, 1675, 1686, 1691, 1694, 1706, 1726, 1738, 82, 68, 99, 121, 59, 17450, 256, 99, 116, 1680, 1684, 101, 107, 59, 17095, 59, 16478, 105, 114, 99, 59, 16676, 114, 59, 24844, 108, 98, 101, 114, 116, 83, 112, 97, 99, 101, 59, 24843, 496, 1711, 0, 1714, 102, 59, 24845, 105, 122, 111, 110, 116, 97, 108, 76, 105, 110, 101, 59, 25856, 256, 99, 116, 1731, 1733, 242, 1705, 114, 111, 107, 59, 16678, 109, 112, 324, 1744, 1752, 111, 119, 110, 72, 117, 109, 240, 303, 113, 117, 97, 108, 59, 25167, 1792, 69, 74, 79, 97, 99, 100, 102, 103, 109, 110, 111, 115, 116, 117, 1786, 1790, 1795, 1799, 1806, 1818, 1822, 1825, 1832, 1860, 1912, 1931, 1935, 1941, 99, 121, 59, 17429, 108, 105, 103, 59, 16690, 99, 121, 59, 17409, 99, 117, 116, 101, 32827, 205, 16589, 256, 105, 121, 1811, 1816, 114, 99, 32827, 206, 16590, 59, 17432, 111, 116, 59, 16688, 114, 59, 24849, 114, 97, 118, 101, 32827, 204, 16588, 384, 59, 97, 112, 1824, 1839, 1855, 256, 99, 103, 1844, 1847, 114, 59, 16682, 105, 110, 97, 114, 121, 73, 59, 24904, 108, 105, 101, 243, 989, 500, 1865, 0, 1890, 256, 59, 101, 1869, 1870, 25132, 256, 103, 114, 1875, 1880, 114, 97, 108, 59, 25131, 115, 101, 99, 116, 105, 111, 110, 59, 25282, 105, 115, 105, 98, 108, 101, 256, 67, 84, 1900, 1906, 111, 109, 109, 97, 59, 24675, 105, 109, 101, 115, 59, 24674, 384, 103, 112, 116, 1919, 1923, 1928, 111, 110, 59, 16686, 102, 59, 49152, 55349, 56640, 97, 59, 17305, 99, 114, 59, 24848, 105, 108, 100, 101, 59, 16680, 491, 1946, 0, 1950, 99, 121, 59, 17414, 108, 32827, 207, 16591, 640, 99, 102, 111, 115, 117, 1964, 1975, 1980, 1986, 2e3, 256, 105, 121, 1969, 1973, 114, 99, 59, 16692, 59, 17433, 114, 59, 49152, 55349, 56589, 112, 102, 59, 49152, 55349, 56641, 483, 1991, 0, 1996, 114, 59, 49152, 55349, 56485, 114, 99, 121, 59, 17416, 107, 99, 121, 59, 17412, 896, 72, 74, 97, 99, 102, 111, 115, 2020, 2024, 2028, 2033, 2045, 2050, 2056, 99, 121, 59, 17445, 99, 121, 59, 17420, 112, 112, 97, 59, 17306, 256, 101, 121, 2038, 2043, 100, 105, 108, 59, 16694, 59, 17434, 114, 59, 49152, 55349, 56590, 112, 102, 59, 49152, 55349, 56642, 99, 114, 59, 49152, 55349, 56486, 1408, 74, 84, 97, 99, 101, 102, 108, 109, 111, 115, 116, 2085, 2089, 2092, 2128, 2147, 2483, 2488, 2503, 2509, 2615, 2631, 99, 121, 59, 17417, 32827, 60, 16444, 640, 99, 109, 110, 112, 114, 2103, 2108, 2113, 2116, 2125, 117, 116, 101, 59, 16697, 98, 100, 97, 59, 17307, 103, 59, 26602, 108, 97, 99, 101, 116, 114, 102, 59, 24850, 114, 59, 24990, 384, 97, 101, 121, 2135, 2140, 2145, 114, 111, 110, 59, 16701, 100, 105, 108, 59, 16699, 59, 17435, 256, 102, 115, 2152, 2416, 116, 1280, 65, 67, 68, 70, 82, 84, 85, 86, 97, 114, 2174, 2217, 2225, 2272, 2278, 2300, 2351, 2395, 912, 2410, 256, 110, 114, 2179, 2191, 103, 108, 101, 66, 114, 97, 99, 107, 101, 116, 59, 26600, 114, 111, 119, 384, 59, 66, 82, 2201, 2202, 2206, 24976, 97, 114, 59, 25060, 105, 103, 104, 116, 65, 114, 114, 111, 119, 59, 25030, 101, 105, 108, 105, 110, 103, 59, 25352, 111, 501, 2231, 0, 2243, 98, 108, 101, 66, 114, 97, 99, 107, 101, 116, 59, 26598, 110, 468, 2248, 0, 2258, 101, 101, 86, 101, 99, 116, 111, 114, 59, 26977, 101, 99, 116, 111, 114, 256, 59, 66, 2267, 2268, 25027, 97, 114, 59, 26969, 108, 111, 111, 114, 59, 25354, 105, 103, 104, 116, 256, 65, 86, 2287, 2293, 114, 114, 111, 119, 59, 24980, 101, 99, 116, 111, 114, 59, 26958, 256, 101, 114, 2305, 2327, 101, 384, 59, 65, 86, 2313, 2314, 2320, 25251, 114, 114, 111, 119, 59, 24996, 101, 99, 116, 111, 114, 59, 26970, 105, 97, 110, 103, 108, 101, 384, 59, 66, 69, 2340, 2341, 2345, 25266, 97, 114, 59, 27087, 113, 117, 97, 108, 59, 25268, 112, 384, 68, 84, 86, 2359, 2370, 2380, 111, 119, 110, 86, 101, 99, 116, 111, 114, 59, 26961, 101, 101, 86, 101, 99, 116, 111, 114, 59, 26976, 101, 99, 116, 111, 114, 256, 59, 66, 2390, 2391, 25023, 97, 114, 59, 26968, 101, 99, 116, 111, 114, 256, 59, 66, 2405, 2406, 25020, 97, 114, 59, 26962, 105, 103, 104, 116, 225, 924, 115, 768, 69, 70, 71, 76, 83, 84, 2430, 2443, 2453, 2461, 2466, 2477, 113, 117, 97, 108, 71, 114, 101, 97, 116, 101, 114, 59, 25306, 117, 108, 108, 69, 113, 117, 97, 108, 59, 25190, 114, 101, 97, 116, 101, 114, 59, 25206, 101, 115, 115, 59, 27297, 108, 97, 110, 116, 69, 113, 117, 97, 108, 59, 27261, 105, 108, 100, 101, 59, 25202, 114, 59, 49152, 55349, 56591, 256, 59, 101, 2493, 2494, 25304, 102, 116, 97, 114, 114, 111, 119, 59, 25050, 105, 100, 111, 116, 59, 16703, 384, 110, 112, 119, 2516, 2582, 2587, 103, 512, 76, 82, 108, 114, 2526, 2551, 2562, 2576, 101, 102, 116, 256, 65, 82, 2534, 2540, 114, 114, 111, 119, 59, 26613, 105, 103, 104, 116, 65, 114, 114, 111, 119, 59, 26615, 105, 103, 104, 116, 65, 114, 114, 111, 119, 59, 26614, 101, 102, 116, 256, 97, 114, 947, 2570, 105, 103, 104, 116, 225, 959, 105, 103, 104, 116, 225, 970, 102, 59, 49152, 55349, 56643, 101, 114, 256, 76, 82, 2594, 2604, 101, 102, 116, 65, 114, 114, 111, 119, 59, 24985, 105, 103, 104, 116, 65, 114, 114, 111, 119, 59, 24984, 384, 99, 104, 116, 2622, 2624, 2626, 242, 2124, 59, 25008, 114, 111, 107, 59, 16705, 59, 25194, 1024, 97, 99, 101, 102, 105, 111, 115, 117, 2650, 2653, 2656, 2679, 2684, 2693, 2699, 2702, 112, 59, 26885, 121, 59, 17436, 256, 100, 108, 2661, 2671, 105, 117, 109, 83, 112, 97, 99, 101, 59, 24671, 108, 105, 110, 116, 114, 102, 59, 24883, 114, 59, 49152, 55349, 56592, 110, 117, 115, 80, 108, 117, 115, 59, 25107, 112, 102, 59, 49152, 55349, 56644, 99, 242, 2678, 59, 17308, 1152, 74, 97, 99, 101, 102, 111, 115, 116, 117, 2723, 2727, 2733, 2752, 2836, 2841, 3473, 3479, 3486, 99, 121, 59, 17418, 99, 117, 116, 101, 59, 16707, 384, 97, 101, 121, 2740, 2745, 2750, 114, 111, 110, 59, 16711, 100, 105, 108, 59, 16709, 59, 17437, 384, 103, 115, 119, 2759, 2800, 2830, 97, 116, 105, 118, 101, 384, 77, 84, 86, 2771, 2783, 2792, 101, 100, 105, 117, 109, 83, 112, 97, 99, 101, 59, 24587, 104, 105, 256, 99, 110, 2790, 2776, 235, 2777, 101, 114, 121, 84, 104, 105, 238, 2777, 116, 101, 100, 256, 71, 76, 2808, 2822, 114, 101, 97, 116, 101, 114, 71, 114, 101, 97, 116, 101, 242, 1651, 101, 115, 115, 76, 101, 115, 243, 2632, 76, 105, 110, 101, 59, 16394, 114, 59, 49152, 55349, 56593, 512, 66, 110, 112, 116, 2850, 2856, 2871, 2874, 114, 101, 97, 107, 59, 24672, 66, 114, 101, 97, 107, 105, 110, 103, 83, 112, 97, 99, 101, 59, 16544, 102, 59, 24853, 1664, 59, 67, 68, 69, 71, 72, 76, 78, 80, 82, 83, 84, 86, 2901, 2902, 2922, 2940, 2977, 3051, 3076, 3166, 3204, 3238, 3288, 3425, 3461, 27372, 256, 111, 117, 2907, 2916, 110, 103, 114, 117, 101, 110, 116, 59, 25186, 112, 67, 97, 112, 59, 25197, 111, 117, 98, 108, 101, 86, 101, 114, 116, 105, 99, 97, 108, 66, 97, 114, 59, 25126, 384, 108, 113, 120, 2947, 2954, 2971, 101, 109, 101, 110, 116, 59, 25097, 117, 97, 108, 256, 59, 84, 2962, 2963, 25184, 105, 108, 100, 101, 59, 49152, 8770, 824, 105, 115, 116, 115, 59, 25092, 114, 101, 97, 116, 101, 114, 896, 59, 69, 70, 71, 76, 83, 84, 2998, 2999, 3005, 3017, 3027, 3032, 3045, 25199, 113, 117, 97, 108, 59, 25201, 117, 108, 108, 69, 113, 117, 97, 108, 59, 49152, 8807, 824, 114, 101, 97, 116, 101, 114, 59, 49152, 8811, 824, 101, 115, 115, 59, 25209, 108, 97, 110, 116, 69, 113, 117, 97, 108, 59, 49152, 10878, 824, 105, 108, 100, 101, 59, 25205, 117, 109, 112, 324, 3058, 3069, 111, 119, 110, 72, 117, 109, 112, 59, 49152, 8782, 824, 113, 117, 97, 108, 59, 49152, 8783, 824, 101, 256, 102, 115, 3082, 3111, 116, 84, 114, 105, 97, 110, 103, 108, 101, 384, 59, 66, 69, 3098, 3099, 3105, 25322, 97, 114, 59, 49152, 10703, 824, 113, 117, 97, 108, 59, 25324, 115, 768, 59, 69, 71, 76, 83, 84, 3125, 3126, 3132, 3140, 3147, 3160, 25198, 113, 117, 97, 108, 59, 25200, 114, 101, 97, 116, 101, 114, 59, 25208, 101, 115, 115, 59, 49152, 8810, 824, 108, 97, 110, 116, 69, 113, 117, 97, 108, 59, 49152, 10877, 824, 105, 108, 100, 101, 59, 25204, 101, 115, 116, 101, 100, 256, 71, 76, 3176, 3193, 114, 101, 97, 116, 101, 114, 71, 114, 101, 97, 116, 101, 114, 59, 49152, 10914, 824, 101, 115, 115, 76, 101, 115, 115, 59, 49152, 10913, 824, 114, 101, 99, 101, 100, 101, 115, 384, 59, 69, 83, 3218, 3219, 3227, 25216, 113, 117, 97, 108, 59, 49152, 10927, 824, 108, 97, 110, 116, 69, 113, 117, 97, 108, 59, 25312, 256, 101, 105, 3243, 3257, 118, 101, 114, 115, 101, 69, 108, 101, 109, 101, 110, 116, 59, 25100, 103, 104, 116, 84, 114, 105, 97, 110, 103, 108, 101, 384, 59, 66, 69, 3275, 3276, 3282, 25323, 97, 114, 59, 49152, 10704, 824, 113, 117, 97, 108, 59, 25325, 256, 113, 117, 3293, 3340, 117, 97, 114, 101, 83, 117, 256, 98, 112, 3304, 3321, 115, 101, 116, 256, 59, 69, 3312, 3315, 49152, 8847, 824, 113, 117, 97, 108, 59, 25314, 101, 114, 115, 101, 116, 256, 59, 69, 3331, 3334, 49152, 8848, 824, 113, 117, 97, 108, 59, 25315, 384, 98, 99, 112, 3347, 3364, 3406, 115, 101, 116, 256, 59, 69, 3355, 3358, 49152, 8834, 8402, 113, 117, 97, 108, 59, 25224, 99, 101, 101, 100, 115, 512, 59, 69, 83, 84, 3378, 3379, 3387, 3398, 25217, 113, 117, 97, 108, 59, 49152, 10928, 824, 108, 97, 110, 116, 69, 113, 117, 97, 108, 59, 25313, 105, 108, 100, 101, 59, 49152, 8831, 824, 101, 114, 115, 101, 116, 256, 59, 69, 3416, 3419, 49152, 8835, 8402, 113, 117, 97, 108, 59, 25225, 105, 108, 100, 101, 512, 59, 69, 70, 84, 3438, 3439, 3445, 3455, 25153, 113, 117, 97, 108, 59, 25156, 117, 108, 108, 69, 113, 117, 97, 108, 59, 25159, 105, 108, 100, 101, 59, 25161, 101, 114, 116, 105, 99, 97, 108, 66, 97, 114, 59, 25124, 99, 114, 59, 49152, 55349, 56489, 105, 108, 100, 101, 32827, 209, 16593, 59, 17309, 1792, 69, 97, 99, 100, 102, 103, 109, 111, 112, 114, 115, 116, 117, 118, 3517, 3522, 3529, 3541, 3547, 3552, 3559, 3580, 3586, 3616, 3618, 3634, 3647, 3652, 108, 105, 103, 59, 16722, 99, 117, 116, 101, 32827, 211, 16595, 256, 105, 121, 3534, 3539, 114, 99, 32827, 212, 16596, 59, 17438, 98, 108, 97, 99, 59, 16720, 114, 59, 49152, 55349, 56594, 114, 97, 118, 101, 32827, 210, 16594, 384, 97, 101, 105, 3566, 3570, 3574, 99, 114, 59, 16716, 103, 97, 59, 17321, 99, 114, 111, 110, 59, 17311, 112, 102, 59, 49152, 55349, 56646, 101, 110, 67, 117, 114, 108, 121, 256, 68, 81, 3598, 3610, 111, 117, 98, 108, 101, 81, 117, 111, 116, 101, 59, 24604, 117, 111, 116, 101, 59, 24600, 59, 27220, 256, 99, 108, 3623, 3628, 114, 59, 49152, 55349, 56490, 97, 115, 104, 32827, 216, 16600, 105, 364, 3639, 3644, 100, 101, 32827, 213, 16597, 101, 115, 59, 27191, 109, 108, 32827, 214, 16598, 101, 114, 256, 66, 80, 3659, 3680, 256, 97, 114, 3664, 3667, 114, 59, 24638, 97, 99, 256, 101, 107, 3674, 3676, 59, 25566, 101, 116, 59, 25524, 97, 114, 101, 110, 116, 104, 101, 115, 105, 115, 59, 25564, 1152, 97, 99, 102, 104, 105, 108, 111, 114, 115, 3711, 3719, 3722, 3727, 3730, 3732, 3741, 3760, 3836, 114, 116, 105, 97, 108, 68, 59, 25090, 121, 59, 17439, 114, 59, 49152, 55349, 56595, 105, 59, 17318, 59, 17312, 117, 115, 77, 105, 110, 117, 115, 59, 16561, 256, 105, 112, 3746, 3757, 110, 99, 97, 114, 101, 112, 108, 97, 110, 229, 1693, 102, 59, 24857, 512, 59, 101, 105, 111, 3769, 3770, 3808, 3812, 27323, 99, 101, 100, 101, 115, 512, 59, 69, 83, 84, 3784, 3785, 3791, 3802, 25210, 113, 117, 97, 108, 59, 27311, 108, 97, 110, 116, 69, 113, 117, 97, 108, 59, 25212, 105, 108, 100, 101, 59, 25214, 109, 101, 59, 24627, 256, 100, 112, 3817, 3822, 117, 99, 116, 59, 25103, 111, 114, 116, 105, 111, 110, 256, 59, 97, 549, 3833, 108, 59, 25117, 256, 99, 105, 3841, 3846, 114, 59, 49152, 55349, 56491, 59, 17320, 512, 85, 102, 111, 115, 3857, 3862, 3867, 3871, 79, 84, 32827, 34, 16418, 114, 59, 49152, 55349, 56596, 112, 102, 59, 24858, 99, 114, 59, 49152, 55349, 56492, 1536, 66, 69, 97, 99, 101, 102, 104, 105, 111, 114, 115, 117, 3902, 3907, 3911, 3936, 3955, 4007, 4010, 4013, 4246, 4265, 4276, 4286, 97, 114, 114, 59, 26896, 71, 32827, 174, 16558, 384, 99, 110, 114, 3918, 3923, 3926, 117, 116, 101, 59, 16724, 103, 59, 26603, 114, 256, 59, 116, 3932, 3933, 24992, 108, 59, 26902, 384, 97, 101, 121, 3943, 3948, 3953, 114, 111, 110, 59, 16728, 100, 105, 108, 59, 16726, 59, 17440, 256, 59, 118, 3960, 3961, 24860, 101, 114, 115, 101, 256, 69, 85, 3970, 3993, 256, 108, 113, 3975, 3982, 101, 109, 101, 110, 116, 59, 25099, 117, 105, 108, 105, 98, 114, 105, 117, 109, 59, 25035, 112, 69, 113, 117, 105, 108, 105, 98, 114, 105, 117, 109, 59, 26991, 114, 187, 3961, 111, 59, 17313, 103, 104, 116, 1024, 65, 67, 68, 70, 84, 85, 86, 97, 4033, 4075, 4083, 4130, 4136, 4187, 4231, 984, 256, 110, 114, 4038, 4050, 103, 108, 101, 66, 114, 97, 99, 107, 101, 116, 59, 26601, 114, 111, 119, 384, 59, 66, 76, 4060, 4061, 4065, 24978, 97, 114, 59, 25061, 101, 102, 116, 65, 114, 114, 111, 119, 59, 25028, 101, 105, 108, 105, 110, 103, 59, 25353, 111, 501, 4089, 0, 4101, 98, 108, 101, 66, 114, 97, 99, 107, 101, 116, 59, 26599, 110, 468, 4106, 0, 4116, 101, 101, 86, 101, 99, 116, 111, 114, 59, 26973, 101, 99, 116, 111, 114, 256, 59, 66, 4125, 4126, 25026, 97, 114, 59, 26965, 108, 111, 111, 114, 59, 25355, 256, 101, 114, 4141, 4163, 101, 384, 59, 65, 86, 4149, 4150, 4156, 25250, 114, 114, 111, 119, 59, 24998, 101, 99, 116, 111, 114, 59, 26971, 105, 97, 110, 103, 108, 101, 384, 59, 66, 69, 4176, 4177, 4181, 25267, 97, 114, 59, 27088, 113, 117, 97, 108, 59, 25269, 112, 384, 68, 84, 86, 4195, 4206, 4216, 111, 119, 110, 86, 101, 99, 116, 111, 114, 59, 26959, 101, 101, 86, 101, 99, 116, 111, 114, 59, 26972, 101, 99, 116, 111, 114, 256, 59, 66, 4226, 4227, 25022, 97, 114, 59, 26964, 101, 99, 116, 111, 114, 256, 59, 66, 4241, 4242, 25024, 97, 114, 59, 26963, 256, 112, 117, 4251, 4254, 102, 59, 24861, 110, 100, 73, 109, 112, 108, 105, 101, 115, 59, 26992, 105, 103, 104, 116, 97, 114, 114, 111, 119, 59, 25051, 256, 99, 104, 4281, 4284, 114, 59, 24859, 59, 25009, 108, 101, 68, 101, 108, 97, 121, 101, 100, 59, 27124, 1664, 72, 79, 97, 99, 102, 104, 105, 109, 111, 113, 115, 116, 117, 4324, 4337, 4343, 4349, 4377, 4382, 4433, 4438, 4449, 4455, 4533, 4539, 4543, 256, 67, 99, 4329, 4334, 72, 99, 121, 59, 17449, 121, 59, 17448, 70, 84, 99, 121, 59, 17452, 99, 117, 116, 101, 59, 16730, 640, 59, 97, 101, 105, 121, 4360, 4361, 4366, 4371, 4375, 27324, 114, 111, 110, 59, 16736, 100, 105, 108, 59, 16734, 114, 99, 59, 16732, 59, 17441, 114, 59, 49152, 55349, 56598, 111, 114, 116, 512, 68, 76, 82, 85, 4394, 4404, 4414, 4425, 111, 119, 110, 65, 114, 114, 111, 119, 187, 1054, 101, 102, 116, 65, 114, 114, 111, 119, 187, 2202, 105, 103, 104, 116, 65, 114, 114, 111, 119, 187, 4061, 112, 65, 114, 114, 111, 119, 59, 24977, 103, 109, 97, 59, 17315, 97, 108, 108, 67, 105, 114, 99, 108, 101, 59, 25112, 112, 102, 59, 49152, 55349, 56650, 626, 4461, 0, 0, 4464, 116, 59, 25114, 97, 114, 101, 512, 59, 73, 83, 85, 4475, 4476, 4489, 4527, 26017, 110, 116, 101, 114, 115, 101, 99, 116, 105, 111, 110, 59, 25235, 117, 256, 98, 112, 4495, 4510, 115, 101, 116, 256, 59, 69, 4503, 4504, 25231, 113, 117, 97, 108, 59, 25233, 101, 114, 115, 101, 116, 256, 59, 69, 4520, 4521, 25232, 113, 117, 97, 108, 59, 25234, 110, 105, 111, 110, 59, 25236, 99, 114, 59, 49152, 55349, 56494, 97, 114, 59, 25286, 512, 98, 99, 109, 112, 4552, 4571, 4617, 4619, 256, 59, 115, 4557, 4558, 25296, 101, 116, 256, 59, 69, 4557, 4565, 113, 117, 97, 108, 59, 25222, 256, 99, 104, 4576, 4613, 101, 101, 100, 115, 512, 59, 69, 83, 84, 4589, 4590, 4596, 4607, 25211, 113, 117, 97, 108, 59, 27312, 108, 97, 110, 116, 69, 113, 117, 97, 108, 59, 25213, 105, 108, 100, 101, 59, 25215, 84, 104, 225, 3980, 59, 25105, 384, 59, 101, 115, 4626, 4627, 4643, 25297, 114, 115, 101, 116, 256, 59, 69, 4636, 4637, 25219, 113, 117, 97, 108, 59, 25223, 101, 116, 187, 4627, 1408, 72, 82, 83, 97, 99, 102, 104, 105, 111, 114, 115, 4670, 4676, 4681, 4693, 4702, 4721, 4726, 4767, 4802, 4808, 4817, 79, 82, 78, 32827, 222, 16606, 65, 68, 69, 59, 24866, 256, 72, 99, 4686, 4690, 99, 121, 59, 17419, 121, 59, 17446, 256, 98, 117, 4698, 4700, 59, 16393, 59, 17316, 384, 97, 101, 121, 4709, 4714, 4719, 114, 111, 110, 59, 16740, 100, 105, 108, 59, 16738, 59, 17442, 114, 59, 49152, 55349, 56599, 256, 101, 105, 4731, 4745, 498, 4736, 0, 4743, 101, 102, 111, 114, 101, 59, 25140, 97, 59, 17304, 256, 99, 110, 4750, 4760, 107, 83, 112, 97, 99, 101, 59, 49152, 8287, 8202, 83, 112, 97, 99, 101, 59, 24585, 108, 100, 101, 512, 59, 69, 70, 84, 4779, 4780, 4786, 4796, 25148, 113, 117, 97, 108, 59, 25155, 117, 108, 108, 69, 113, 117, 97, 108, 59, 25157, 105, 108, 100, 101, 59, 25160, 112, 102, 59, 49152, 55349, 56651, 105, 112, 108, 101, 68, 111, 116, 59, 24795, 256, 99, 116, 4822, 4827, 114, 59, 49152, 55349, 56495, 114, 111, 107, 59, 16742, 2785, 4855, 4878, 4890, 4902, 0, 4908, 4913, 0, 0, 0, 0, 0, 4920, 4925, 4983, 4997, 0, 5119, 5124, 5130, 5136, 256, 99, 114, 4859, 4865, 117, 116, 101, 32827, 218, 16602, 114, 256, 59, 111, 4871, 4872, 24991, 99, 105, 114, 59, 26953, 114, 483, 4883, 0, 4886, 121, 59, 17422, 118, 101, 59, 16748, 256, 105, 121, 4894, 4899, 114, 99, 32827, 219, 16603, 59, 17443, 98, 108, 97, 99, 59, 16752, 114, 59, 49152, 55349, 56600, 114, 97, 118, 101, 32827, 217, 16601, 97, 99, 114, 59, 16746, 256, 100, 105, 4929, 4969, 101, 114, 256, 66, 80, 4936, 4957, 256, 97, 114, 4941, 4944, 114, 59, 16479, 97, 99, 256, 101, 107, 4951, 4953, 59, 25567, 101, 116, 59, 25525, 97, 114, 101, 110, 116, 104, 101, 115, 105, 115, 59, 25565, 111, 110, 256, 59, 80, 4976, 4977, 25283, 108, 117, 115, 59, 25230, 256, 103, 112, 4987, 4991, 111, 110, 59, 16754, 102, 59, 49152, 55349, 56652, 1024, 65, 68, 69, 84, 97, 100, 112, 115, 5013, 5038, 5048, 5060, 1e3, 5074, 5079, 5107, 114, 114, 111, 119, 384, 59, 66, 68, 4432, 5024, 5028, 97, 114, 59, 26898, 111, 119, 110, 65, 114, 114, 111, 119, 59, 25029, 111, 119, 110, 65, 114, 114, 111, 119, 59, 24981, 113, 117, 105, 108, 105, 98, 114, 105, 117, 109, 59, 26990, 101, 101, 256, 59, 65, 5067, 5068, 25253, 114, 114, 111, 119, 59, 24997, 111, 119, 110, 225, 1011, 101, 114, 256, 76, 82, 5086, 5096, 101, 102, 116, 65, 114, 114, 111, 119, 59, 24982, 105, 103, 104, 116, 65, 114, 114, 111, 119, 59, 24983, 105, 256, 59, 108, 5113, 5114, 17362, 111, 110, 59, 17317, 105, 110, 103, 59, 16750, 99, 114, 59, 49152, 55349, 56496, 105, 108, 100, 101, 59, 16744, 109, 108, 32827, 220, 16604, 1152, 68, 98, 99, 100, 101, 102, 111, 115, 118, 5159, 5164, 5168, 5171, 5182, 5253, 5258, 5264, 5270, 97, 115, 104, 59, 25259, 97, 114, 59, 27371, 121, 59, 17426, 97, 115, 104, 256, 59, 108, 5179, 5180, 25257, 59, 27366, 256, 101, 114, 5187, 5189, 59, 25281, 384, 98, 116, 121, 5196, 5200, 5242, 97, 114, 59, 24598, 256, 59, 105, 5199, 5205, 99, 97, 108, 512, 66, 76, 83, 84, 5217, 5221, 5226, 5236, 97, 114, 59, 25123, 105, 110, 101, 59, 16508, 101, 112, 97, 114, 97, 116, 111, 114, 59, 26456, 105, 108, 100, 101, 59, 25152, 84, 104, 105, 110, 83, 112, 97, 99, 101, 59, 24586, 114, 59, 49152, 55349, 56601, 112, 102, 59, 49152, 55349, 56653, 99, 114, 59, 49152, 55349, 56497, 100, 97, 115, 104, 59, 25258, 640, 99, 101, 102, 111, 115, 5287, 5292, 5297, 5302, 5308, 105, 114, 99, 59, 16756, 100, 103, 101, 59, 25280, 114, 59, 49152, 55349, 56602, 112, 102, 59, 49152, 55349, 56654, 99, 114, 59, 49152, 55349, 56498, 512, 102, 105, 111, 115, 5323, 5328, 5330, 5336, 114, 59, 49152, 55349, 56603, 59, 17310, 112, 102, 59, 49152, 55349, 56655, 99, 114, 59, 49152, 55349, 56499, 1152, 65, 73, 85, 97, 99, 102, 111, 115, 117, 5361, 5365, 5369, 5373, 5380, 5391, 5396, 5402, 5408, 99, 121, 59, 17455, 99, 121, 59, 17415, 99, 121, 59, 17454, 99, 117, 116, 101, 32827, 221, 16605, 256, 105, 121, 5385, 5389, 114, 99, 59, 16758, 59, 17451, 114, 59, 49152, 55349, 56604, 112, 102, 59, 49152, 55349, 56656, 99, 114, 59, 49152, 55349, 56500, 109, 108, 59, 16760, 1024, 72, 97, 99, 100, 101, 102, 111, 115, 5429, 5433, 5439, 5451, 5455, 5469, 5472, 5476, 99, 121, 59, 17430, 99, 117, 116, 101, 59, 16761, 256, 97, 121, 5444, 5449, 114, 111, 110, 59, 16765, 59, 17431, 111, 116, 59, 16763, 498, 5460, 0, 5467, 111, 87, 105, 100, 116, 232, 2777, 97, 59, 17302, 114, 59, 24872, 112, 102, 59, 24868, 99, 114, 59, 49152, 55349, 56501, 3041, 5507, 5514, 5520, 0, 5552, 5558, 5567, 0, 0, 0, 0, 5574, 5595, 5611, 5727, 5741, 0, 5781, 5787, 5810, 5817, 0, 5822, 99, 117, 116, 101, 32827, 225, 16609, 114, 101, 118, 101, 59, 16643, 768, 59, 69, 100, 105, 117, 121, 5532, 5533, 5537, 5539, 5544, 5549, 25150, 59, 49152, 8766, 819, 59, 25151, 114, 99, 32827, 226, 16610, 116, 101, 32955, 180, 774, 59, 17456, 108, 105, 103, 32827, 230, 16614, 256, 59, 114, 178, 5562, 59, 49152, 55349, 56606, 114, 97, 118, 101, 32827, 224, 16608, 256, 101, 112, 5578, 5590, 256, 102, 112, 5583, 5588, 115, 121, 109, 59, 24885, 232, 5587, 104, 97, 59, 17329, 256, 97, 112, 5599, 99, 256, 99, 108, 5604, 5607, 114, 59, 16641, 103, 59, 27199, 612, 5616, 0, 0, 5642, 640, 59, 97, 100, 115, 118, 5626, 5627, 5631, 5633, 5639, 25127, 110, 100, 59, 27221, 59, 27228, 108, 111, 112, 101, 59, 27224, 59, 27226, 896, 59, 101, 108, 109, 114, 115, 122, 5656, 5657, 5659, 5662, 5695, 5711, 5721, 25120, 59, 27044, 101, 187, 5657, 115, 100, 256, 59, 97, 5669, 5670, 25121, 1121, 5680, 5682, 5684, 5686, 5688, 5690, 5692, 5694, 59, 27048, 59, 27049, 59, 27050, 59, 27051, 59, 27052, 59, 27053, 59, 27054, 59, 27055, 116, 256, 59, 118, 5701, 5702, 25119, 98, 256, 59, 100, 5708, 5709, 25278, 59, 27037, 256, 112, 116, 5716, 5719, 104, 59, 25122, 187, 185, 97, 114, 114, 59, 25468, 256, 103, 112, 5731, 5735, 111, 110, 59, 16645, 102, 59, 49152, 55349, 56658, 896, 59, 69, 97, 101, 105, 111, 112, 4801, 5755, 5757, 5762, 5764, 5767, 5770, 59, 27248, 99, 105, 114, 59, 27247, 59, 25162, 100, 59, 25163, 115, 59, 16423, 114, 111, 120, 256, 59, 101, 4801, 5778, 241, 5763, 105, 110, 103, 32827, 229, 16613, 384, 99, 116, 121, 5793, 5798, 5800, 114, 59, 49152, 55349, 56502, 59, 16426, 109, 112, 256, 59, 101, 4801, 5807, 241, 648, 105, 108, 100, 101, 32827, 227, 16611, 109, 108, 32827, 228, 16612, 256, 99, 105, 5826, 5832, 111, 110, 105, 110, 244, 626, 110, 116, 59, 27153, 2048, 78, 97, 98, 99, 100, 101, 102, 105, 107, 108, 110, 111, 112, 114, 115, 117, 5869, 5873, 5936, 5948, 5955, 5960, 6008, 6013, 6112, 6118, 6201, 6224, 5901, 6461, 6472, 6512, 111, 116, 59, 27373, 256, 99, 114, 5878, 5918, 107, 512, 99, 101, 112, 115, 5888, 5893, 5901, 5907, 111, 110, 103, 59, 25164, 112, 115, 105, 108, 111, 110, 59, 17398, 114, 105, 109, 101, 59, 24629, 105, 109, 256, 59, 101, 5914, 5915, 25149, 113, 59, 25293, 374, 5922, 5926, 101, 101, 59, 25277, 101, 100, 256, 59, 103, 5932, 5933, 25349, 101, 187, 5933, 114, 107, 256, 59, 116, 4956, 5943, 98, 114, 107, 59, 25526, 256, 111, 121, 5889, 5953, 59, 17457, 113, 117, 111, 59, 24606, 640, 99, 109, 112, 114, 116, 5971, 5979, 5985, 5988, 5992, 97, 117, 115, 256, 59, 101, 266, 265, 112, 116, 121, 118, 59, 27056, 115, 233, 5900, 110, 111, 245, 275, 384, 97, 104, 119, 5999, 6001, 6003, 59, 17330, 59, 24886, 101, 101, 110, 59, 25196, 114, 59, 49152, 55349, 56607, 103, 896, 99, 111, 115, 116, 117, 118, 119, 6029, 6045, 6067, 6081, 6101, 6107, 6110, 384, 97, 105, 117, 6036, 6038, 6042, 240, 1888, 114, 99, 59, 26095, 112, 187, 4977, 384, 100, 112, 116, 6052, 6056, 6061, 111, 116, 59, 27136, 108, 117, 115, 59, 27137, 105, 109, 101, 115, 59, 27138, 625, 6073, 0, 0, 6078, 99, 117, 112, 59, 27142, 97, 114, 59, 26117, 114, 105, 97, 110, 103, 108, 101, 256, 100, 117, 6093, 6098, 111, 119, 110, 59, 26045, 112, 59, 26035, 112, 108, 117, 115, 59, 27140, 101, 229, 5188, 229, 5293, 97, 114, 111, 119, 59, 26893, 384, 97, 107, 111, 6125, 6182, 6197, 256, 99, 110, 6130, 6179, 107, 384, 108, 115, 116, 6138, 1451, 6146, 111, 122, 101, 110, 103, 101, 59, 27115, 114, 105, 97, 110, 103, 108, 101, 512, 59, 100, 108, 114, 6162, 6163, 6168, 6173, 26036, 111, 119, 110, 59, 26046, 101, 102, 116, 59, 26050, 105, 103, 104, 116, 59, 26040, 107, 59, 25635, 433, 6187, 0, 6195, 434, 6191, 0, 6193, 59, 26002, 59, 26001, 52, 59, 26003, 99, 107, 59, 25992, 256, 101, 111, 6206, 6221, 256, 59, 113, 6211, 6214, 49152, 61, 8421, 117, 105, 118, 59, 49152, 8801, 8421, 116, 59, 25360, 512, 112, 116, 119, 120, 6233, 6238, 6247, 6252, 102, 59, 49152, 55349, 56659, 256, 59, 116, 5067, 6243, 111, 109, 187, 5068, 116, 105, 101, 59, 25288, 1536, 68, 72, 85, 86, 98, 100, 104, 109, 112, 116, 117, 118, 6277, 6294, 6314, 6331, 6359, 6363, 6380, 6399, 6405, 6410, 6416, 6433, 512, 76, 82, 108, 114, 6286, 6288, 6290, 6292, 59, 25943, 59, 25940, 59, 25942, 59, 25939, 640, 59, 68, 85, 100, 117, 6305, 6306, 6308, 6310, 6312, 25936, 59, 25958, 59, 25961, 59, 25956, 59, 25959, 512, 76, 82, 108, 114, 6323, 6325, 6327, 6329, 59, 25949, 59, 25946, 59, 25948, 59, 25945, 896, 59, 72, 76, 82, 104, 108, 114, 6346, 6347, 6349, 6351, 6353, 6355, 6357, 25937, 59, 25964, 59, 25955, 59, 25952, 59, 25963, 59, 25954, 59, 25951, 111, 120, 59, 27081, 512, 76, 82, 108, 114, 6372, 6374, 6376, 6378, 59, 25941, 59, 25938, 59, 25872, 59, 25868, 640, 59, 68, 85, 100, 117, 1725, 6391, 6393, 6395, 6397, 59, 25957, 59, 25960, 59, 25900, 59, 25908, 105, 110, 117, 115, 59, 25247, 108, 117, 115, 59, 25246, 105, 109, 101, 115, 59, 25248, 512, 76, 82, 108, 114, 6425, 6427, 6429, 6431, 59, 25947, 59, 25944, 59, 25880, 59, 25876, 896, 59, 72, 76, 82, 104, 108, 114, 6448, 6449, 6451, 6453, 6455, 6457, 6459, 25858, 59, 25962, 59, 25953, 59, 25950, 59, 25916, 59, 25892, 59, 25884, 256, 101, 118, 291, 6466, 98, 97, 114, 32827, 166, 16550, 512, 99, 101, 105, 111, 6481, 6486, 6490, 6496, 114, 59, 49152, 55349, 56503, 109, 105, 59, 24655, 109, 256, 59, 101, 5914, 5916, 108, 384, 59, 98, 104, 6504, 6505, 6507, 16476, 59, 27077, 115, 117, 98, 59, 26568, 364, 6516, 6526, 108, 256, 59, 101, 6521, 6522, 24610, 116, 187, 6522, 112, 384, 59, 69, 101, 303, 6533, 6535, 59, 27310, 256, 59, 113, 1756, 1755, 3297, 6567, 0, 6632, 6673, 6677, 6706, 0, 6711, 6736, 0, 0, 6836, 0, 0, 6849, 0, 0, 6945, 6958, 6989, 6994, 0, 7165, 0, 7180, 384, 99, 112, 114, 6573, 6578, 6621, 117, 116, 101, 59, 16647, 768, 59, 97, 98, 99, 100, 115, 6591, 6592, 6596, 6602, 6613, 6617, 25129, 110, 100, 59, 27204, 114, 99, 117, 112, 59, 27209, 256, 97, 117, 6607, 6610, 112, 59, 27211, 112, 59, 27207, 111, 116, 59, 27200, 59, 49152, 8745, 65024, 256, 101, 111, 6626, 6629, 116, 59, 24641, 238, 1683, 512, 97, 101, 105, 117, 6640, 6651, 6657, 6661, 496, 6645, 0, 6648, 115, 59, 27213, 111, 110, 59, 16653, 100, 105, 108, 32827, 231, 16615, 114, 99, 59, 16649, 112, 115, 256, 59, 115, 6668, 6669, 27212, 109, 59, 27216, 111, 116, 59, 16651, 384, 100, 109, 110, 6683, 6688, 6694, 105, 108, 32955, 184, 429, 112, 116, 121, 118, 59, 27058, 116, 33024, 162, 59, 101, 6701, 6702, 16546, 114, 228, 434, 114, 59, 49152, 55349, 56608, 384, 99, 101, 105, 6717, 6720, 6733, 121, 59, 17479, 99, 107, 256, 59, 109, 6727, 6728, 26387, 97, 114, 107, 187, 6728, 59, 17351, 114, 896, 59, 69, 99, 101, 102, 109, 115, 6751, 6752, 6754, 6763, 6820, 6826, 6830, 26059, 59, 27075, 384, 59, 101, 108, 6761, 6762, 6765, 17094, 113, 59, 25175, 101, 609, 6772, 0, 0, 6792, 114, 114, 111, 119, 256, 108, 114, 6780, 6785, 101, 102, 116, 59, 25018, 105, 103, 104, 116, 59, 25019, 640, 82, 83, 97, 99, 100, 6802, 6804, 6806, 6810, 6815, 187, 3911, 59, 25800, 115, 116, 59, 25243, 105, 114, 99, 59, 25242, 97, 115, 104, 59, 25245, 110, 105, 110, 116, 59, 27152, 105, 100, 59, 27375, 99, 105, 114, 59, 27074, 117, 98, 115, 256, 59, 117, 6843, 6844, 26211, 105, 116, 187, 6844, 748, 6855, 6868, 6906, 0, 6922, 111, 110, 256, 59, 101, 6861, 6862, 16442, 256, 59, 113, 199, 198, 621, 6873, 0, 0, 6882, 97, 256, 59, 116, 6878, 6879, 16428, 59, 16448, 384, 59, 102, 108, 6888, 6889, 6891, 25089, 238, 4448, 101, 256, 109, 120, 6897, 6902, 101, 110, 116, 187, 6889, 101, 243, 589, 487, 6910, 0, 6919, 256, 59, 100, 4795, 6914, 111, 116, 59, 27245, 110, 244, 582, 384, 102, 114, 121, 6928, 6932, 6935, 59, 49152, 55349, 56660, 111, 228, 596, 33024, 169, 59, 115, 341, 6941, 114, 59, 24855, 256, 97, 111, 6949, 6953, 114, 114, 59, 25013, 115, 115, 59, 26391, 256, 99, 117, 6962, 6967, 114, 59, 49152, 55349, 56504, 256, 98, 112, 6972, 6980, 256, 59, 101, 6977, 6978, 27343, 59, 27345, 256, 59, 101, 6985, 6986, 27344, 59, 27346, 100, 111, 116, 59, 25327, 896, 100, 101, 108, 112, 114, 118, 119, 7008, 7020, 7031, 7042, 7084, 7124, 7161, 97, 114, 114, 256, 108, 114, 7016, 7018, 59, 26936, 59, 26933, 624, 7026, 0, 0, 7029, 114, 59, 25310, 99, 59, 25311, 97, 114, 114, 256, 59, 112, 7039, 7040, 25014, 59, 26941, 768, 59, 98, 99, 100, 111, 115, 7055, 7056, 7062, 7073, 7077, 7080, 25130, 114, 99, 97, 112, 59, 27208, 256, 97, 117, 7067, 7070, 112, 59, 27206, 112, 59, 27210, 111, 116, 59, 25229, 114, 59, 27205, 59, 49152, 8746, 65024, 512, 97, 108, 114, 118, 7093, 7103, 7134, 7139, 114, 114, 256, 59, 109, 7100, 7101, 25015, 59, 26940, 121, 384, 101, 118, 119, 7111, 7124, 7128, 113, 624, 7118, 0, 0, 7122, 114, 101, 227, 7027, 117, 227, 7029, 101, 101, 59, 25294, 101, 100, 103, 101, 59, 25295, 101, 110, 32827, 164, 16548, 101, 97, 114, 114, 111, 119, 256, 108, 114, 7150, 7155, 101, 102, 116, 187, 7040, 105, 103, 104, 116, 187, 7101, 101, 228, 7133, 256, 99, 105, 7169, 7175, 111, 110, 105, 110, 244, 503, 110, 116, 59, 25137, 108, 99, 116, 121, 59, 25389, 2432, 65, 72, 97, 98, 99, 100, 101, 102, 104, 105, 106, 108, 111, 114, 115, 116, 117, 119, 122, 7224, 7227, 7231, 7261, 7273, 7285, 7306, 7326, 7340, 7351, 7419, 7423, 7437, 7547, 7569, 7595, 7611, 7622, 7629, 114, 242, 897, 97, 114, 59, 26981, 512, 103, 108, 114, 115, 7240, 7245, 7250, 7252, 103, 101, 114, 59, 24608, 101, 116, 104, 59, 24888, 242, 4403, 104, 256, 59, 118, 7258, 7259, 24592, 187, 2314, 363, 7265, 7271, 97, 114, 111, 119, 59, 26895, 97, 227, 789, 256, 97, 121, 7278, 7283, 114, 111, 110, 59, 16655, 59, 17460, 384, 59, 97, 111, 818, 7292, 7300, 256, 103, 114, 703, 7297, 114, 59, 25034, 116, 115, 101, 113, 59, 27255, 384, 103, 108, 109, 7313, 7316, 7320, 32827, 176, 16560, 116, 97, 59, 17332, 112, 116, 121, 118, 59, 27057, 256, 105, 114, 7331, 7336, 115, 104, 116, 59, 27007, 59, 49152, 55349, 56609, 97, 114, 256, 108, 114, 7347, 7349, 187, 2268, 187, 4126, 640, 97, 101, 103, 115, 118, 7362, 888, 7382, 7388, 7392, 109, 384, 59, 111, 115, 806, 7370, 7380, 110, 100, 256, 59, 115, 806, 7377, 117, 105, 116, 59, 26214, 97, 109, 109, 97, 59, 17373, 105, 110, 59, 25330, 384, 59, 105, 111, 7399, 7400, 7416, 16631, 100, 101, 33024, 247, 59, 111, 7399, 7408, 110, 116, 105, 109, 101, 115, 59, 25287, 110, 248, 7415, 99, 121, 59, 17490, 99, 623, 7430, 0, 0, 7434, 114, 110, 59, 25374, 111, 112, 59, 25357, 640, 108, 112, 116, 117, 119, 7448, 7453, 7458, 7497, 7509, 108, 97, 114, 59, 16420, 102, 59, 49152, 55349, 56661, 640, 59, 101, 109, 112, 115, 779, 7469, 7479, 7485, 7490, 113, 256, 59, 100, 850, 7475, 111, 116, 59, 25169, 105, 110, 117, 115, 59, 25144, 108, 117, 115, 59, 25108, 113, 117, 97, 114, 101, 59, 25249, 98, 108, 101, 98, 97, 114, 119, 101, 100, 103, 229, 250, 110, 384, 97, 100, 104, 4398, 7517, 7527, 111, 119, 110, 97, 114, 114, 111, 119, 243, 7299, 97, 114, 112, 111, 111, 110, 256, 108, 114, 7538, 7542, 101, 102, 244, 7348, 105, 103, 104, 244, 7350, 354, 7551, 7557, 107, 97, 114, 111, 247, 3906, 623, 7562, 0, 0, 7566, 114, 110, 59, 25375, 111, 112, 59, 25356, 384, 99, 111, 116, 7576, 7587, 7590, 256, 114, 121, 7581, 7585, 59, 49152, 55349, 56505, 59, 17493, 108, 59, 27126, 114, 111, 107, 59, 16657, 256, 100, 114, 7600, 7604, 111, 116, 59, 25329, 105, 256, 59, 102, 7610, 6166, 26047, 256, 97, 104, 7616, 7619, 114, 242, 1065, 97, 242, 4006, 97, 110, 103, 108, 101, 59, 27046, 256, 99, 105, 7634, 7637, 121, 59, 17503, 103, 114, 97, 114, 114, 59, 26623, 2304, 68, 97, 99, 100, 101, 102, 103, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 120, 7681, 7689, 7705, 7736, 1400, 7740, 7753, 7777, 7806, 7845, 7855, 7869, 7905, 7978, 7991, 8004, 8014, 8026, 256, 68, 111, 7686, 7476, 111, 244, 7305, 256, 99, 115, 7694, 7700, 117, 116, 101, 32827, 233, 16617, 116, 101, 114, 59, 27246, 512, 97, 105, 111, 121, 7714, 7719, 7729, 7734, 114, 111, 110, 59, 16667, 114, 256, 59, 99, 7725, 7726, 25174, 32827, 234, 16618, 108, 111, 110, 59, 25173, 59, 17485, 111, 116, 59, 16663, 256, 68, 114, 7745, 7749, 111, 116, 59, 25170, 59, 49152, 55349, 56610, 384, 59, 114, 115, 7760, 7761, 7767, 27290, 97, 118, 101, 32827, 232, 16616, 256, 59, 100, 7772, 7773, 27286, 111, 116, 59, 27288, 512, 59, 105, 108, 115, 7786, 7787, 7794, 7796, 27289, 110, 116, 101, 114, 115, 59, 25575, 59, 24851, 256, 59, 100, 7801, 7802, 27285, 111, 116, 59, 27287, 384, 97, 112, 115, 7813, 7817, 7831, 99, 114, 59, 16659, 116, 121, 384, 59, 115, 118, 7826, 7827, 7829, 25093, 101, 116, 187, 7827, 112, 256, 49, 59, 7837, 7844, 307, 7841, 7843, 59, 24580, 59, 24581, 24579, 256, 103, 115, 7850, 7852, 59, 16715, 112, 59, 24578, 256, 103, 112, 7860, 7864, 111, 110, 59, 16665, 102, 59, 49152, 55349, 56662, 384, 97, 108, 115, 7876, 7886, 7890, 114, 256, 59, 115, 7882, 7883, 25301, 108, 59, 27107, 117, 115, 59, 27249, 105, 384, 59, 108, 118, 7898, 7899, 7903, 17333, 111, 110, 187, 7899, 59, 17397, 512, 99, 115, 117, 118, 7914, 7923, 7947, 7971, 256, 105, 111, 7919, 7729, 114, 99, 187, 7726, 617, 7929, 0, 0, 7931, 237, 1352, 97, 110, 116, 256, 103, 108, 7938, 7942, 116, 114, 187, 7773, 101, 115, 115, 187, 7802, 384, 97, 101, 105, 7954, 7958, 7962, 108, 115, 59, 16445, 115, 116, 59, 25183, 118, 256, 59, 68, 565, 7968, 68, 59, 27256, 112, 97, 114, 115, 108, 59, 27109, 256, 68, 97, 7983, 7987, 111, 116, 59, 25171, 114, 114, 59, 26993, 384, 99, 100, 105, 7998, 8001, 7928, 114, 59, 24879, 111, 244, 850, 256, 97, 104, 8009, 8011, 59, 17335, 32827, 240, 16624, 256, 109, 114, 8019, 8023, 108, 32827, 235, 16619, 111, 59, 24748, 384, 99, 105, 112, 8033, 8036, 8039, 108, 59, 16417, 115, 244, 1390, 256, 101, 111, 8044, 8052, 99, 116, 97, 116, 105, 111, 238, 1369, 110, 101, 110, 116, 105, 97, 108, 229, 1401, 2529, 8082, 0, 8094, 0, 8097, 8103, 0, 0, 8134, 8140, 0, 8147, 0, 8166, 8170, 8192, 0, 8200, 8282, 108, 108, 105, 110, 103, 100, 111, 116, 115, 101, 241, 7748, 121, 59, 17476, 109, 97, 108, 101, 59, 26176, 384, 105, 108, 114, 8109, 8115, 8129, 108, 105, 103, 59, 32768, 64259, 617, 8121, 0, 0, 8125, 103, 59, 32768, 64256, 105, 103, 59, 32768, 64260, 59, 49152, 55349, 56611, 108, 105, 103, 59, 32768, 64257, 108, 105, 103, 59, 49152, 102, 106, 384, 97, 108, 116, 8153, 8156, 8161, 116, 59, 26221, 105, 103, 59, 32768, 64258, 110, 115, 59, 26033, 111, 102, 59, 16786, 496, 8174, 0, 8179, 102, 59, 49152, 55349, 56663, 256, 97, 107, 1471, 8183, 256, 59, 118, 8188, 8189, 25300, 59, 27353, 97, 114, 116, 105, 110, 116, 59, 27149, 256, 97, 111, 8204, 8277, 256, 99, 115, 8209, 8274, 945, 8218, 8240, 8248, 8261, 8264, 0, 8272, 946, 8226, 8229, 8231, 8234, 8236, 0, 8238, 32827, 189, 16573, 59, 24915, 32827, 188, 16572, 59, 24917, 59, 24921, 59, 24923, 435, 8244, 0, 8246, 59, 24916, 59, 24918, 692, 8254, 8257, 0, 0, 8259, 32827, 190, 16574, 59, 24919, 59, 24924, 53, 59, 24920, 438, 8268, 0, 8270, 59, 24922, 59, 24925, 56, 59, 24926, 108, 59, 24644, 119, 110, 59, 25378, 99, 114, 59, 49152, 55349, 56507, 2176, 69, 97, 98, 99, 100, 101, 102, 103, 105, 106, 108, 110, 111, 114, 115, 116, 118, 8322, 8329, 8351, 8357, 8368, 8372, 8432, 8437, 8442, 8447, 8451, 8466, 8504, 791, 8510, 8530, 8606, 256, 59, 108, 1613, 8327, 59, 27276, 384, 99, 109, 112, 8336, 8341, 8349, 117, 116, 101, 59, 16885, 109, 97, 256, 59, 100, 8348, 7386, 17331, 59, 27270, 114, 101, 118, 101, 59, 16671, 256, 105, 121, 8362, 8366, 114, 99, 59, 16669, 59, 17459, 111, 116, 59, 16673, 512, 59, 108, 113, 115, 1598, 1602, 8381, 8393, 384, 59, 113, 115, 1598, 1612, 8388, 108, 97, 110, 244, 1637, 512, 59, 99, 100, 108, 1637, 8402, 8405, 8421, 99, 59, 27305, 111, 116, 256, 59, 111, 8412, 8413, 27264, 256, 59, 108, 8418, 8419, 27266, 59, 27268, 256, 59, 101, 8426, 8429, 49152, 8923, 65024, 115, 59, 27284, 114, 59, 49152, 55349, 56612, 256, 59, 103, 1651, 1563, 109, 101, 108, 59, 24887, 99, 121, 59, 17491, 512, 59, 69, 97, 106, 1626, 8460, 8462, 8464, 59, 27282, 59, 27301, 59, 27300, 512, 69, 97, 101, 115, 8475, 8477, 8489, 8500, 59, 25193, 112, 256, 59, 112, 8483, 8484, 27274, 114, 111, 120, 187, 8484, 256, 59, 113, 8494, 8495, 27272, 256, 59, 113, 8494, 8475, 105, 109, 59, 25319, 112, 102, 59, 49152, 55349, 56664, 256, 99, 105, 8515, 8518, 114, 59, 24842, 109, 384, 59, 101, 108, 1643, 8526, 8528, 59, 27278, 59, 27280, 33536, 62, 59, 99, 100, 108, 113, 114, 1518, 8544, 8554, 8558, 8563, 8569, 256, 99, 105, 8549, 8551, 59, 27303, 114, 59, 27258, 111, 116, 59, 25303, 80, 97, 114, 59, 27029, 117, 101, 115, 116, 59, 27260, 640, 97, 100, 101, 108, 115, 8580, 8554, 8592, 1622, 8603, 496, 8585, 0, 8590, 112, 114, 111, 248, 8350, 114, 59, 27e3, 113, 256, 108, 113, 1599, 8598, 108, 101, 115, 243, 8328, 105, 237, 1643, 256, 101, 110, 8611, 8621, 114, 116, 110, 101, 113, 113, 59, 49152, 8809, 65024, 197, 8618, 1280, 65, 97, 98, 99, 101, 102, 107, 111, 115, 121, 8644, 8647, 8689, 8693, 8698, 8728, 8733, 8751, 8808, 8829, 114, 242, 928, 512, 105, 108, 109, 114, 8656, 8660, 8663, 8667, 114, 115, 240, 5252, 102, 187, 8228, 105, 108, 244, 1705, 256, 100, 114, 8672, 8676, 99, 121, 59, 17482, 384, 59, 99, 119, 2292, 8683, 8687, 105, 114, 59, 26952, 59, 25005, 97, 114, 59, 24847, 105, 114, 99, 59, 16677, 384, 97, 108, 114, 8705, 8718, 8723, 114, 116, 115, 256, 59, 117, 8713, 8714, 26213, 105, 116, 187, 8714, 108, 105, 112, 59, 24614, 99, 111, 110, 59, 25273, 114, 59, 49152, 55349, 56613, 115, 256, 101, 119, 8739, 8745, 97, 114, 111, 119, 59, 26917, 97, 114, 111, 119, 59, 26918, 640, 97, 109, 111, 112, 114, 8762, 8766, 8771, 8798, 8803, 114, 114, 59, 25087, 116, 104, 116, 59, 25147, 107, 256, 108, 114, 8777, 8787, 101, 102, 116, 97, 114, 114, 111, 119, 59, 25001, 105, 103, 104, 116, 97, 114, 114, 111, 119, 59, 25002, 102, 59, 49152, 55349, 56665, 98, 97, 114, 59, 24597, 384, 99, 108, 116, 8815, 8820, 8824, 114, 59, 49152, 55349, 56509, 97, 115, 232, 8692, 114, 111, 107, 59, 16679, 256, 98, 112, 8834, 8839, 117, 108, 108, 59, 24643, 104, 101, 110, 187, 7259, 2785, 8867, 0, 8874, 0, 8888, 8901, 8910, 0, 8917, 8947, 0, 0, 8952, 8994, 9063, 9058, 9087, 0, 9094, 9130, 9140, 99, 117, 116, 101, 32827, 237, 16621, 384, 59, 105, 121, 1905, 8880, 8885, 114, 99, 32827, 238, 16622, 59, 17464, 256, 99, 120, 8892, 8895, 121, 59, 17461, 99, 108, 32827, 161, 16545, 256, 102, 114, 927, 8905, 59, 49152, 55349, 56614, 114, 97, 118, 101, 32827, 236, 16620, 512, 59, 105, 110, 111, 1854, 8925, 8937, 8942, 256, 105, 110, 8930, 8934, 110, 116, 59, 27148, 116, 59, 25133, 102, 105, 110, 59, 27100, 116, 97, 59, 24873, 108, 105, 103, 59, 16691, 384, 97, 111, 112, 8958, 8986, 8989, 384, 99, 103, 116, 8965, 8968, 8983, 114, 59, 16683, 384, 101, 108, 112, 1823, 8975, 8979, 105, 110, 229, 1934, 97, 114, 244, 1824, 104, 59, 16689, 102, 59, 25271, 101, 100, 59, 16821, 640, 59, 99, 102, 111, 116, 1268, 9004, 9009, 9021, 9025, 97, 114, 101, 59, 24837, 105, 110, 256, 59, 116, 9016, 9017, 25118, 105, 101, 59, 27101, 100, 111, 244, 8985, 640, 59, 99, 101, 108, 112, 1879, 9036, 9040, 9051, 9057, 97, 108, 59, 25274, 256, 103, 114, 9045, 9049, 101, 114, 243, 5475, 227, 9037, 97, 114, 104, 107, 59, 27159, 114, 111, 100, 59, 27196, 512, 99, 103, 112, 116, 9071, 9074, 9078, 9083, 121, 59, 17489, 111, 110, 59, 16687, 102, 59, 49152, 55349, 56666, 97, 59, 17337, 117, 101, 115, 116, 32827, 191, 16575, 256, 99, 105, 9098, 9103, 114, 59, 49152, 55349, 56510, 110, 640, 59, 69, 100, 115, 118, 1268, 9115, 9117, 9121, 1267, 59, 25337, 111, 116, 59, 25333, 256, 59, 118, 9126, 9127, 25332, 59, 25331, 256, 59, 105, 1911, 9134, 108, 100, 101, 59, 16681, 491, 9144, 0, 9148, 99, 121, 59, 17494, 108, 32827, 239, 16623, 768, 99, 102, 109, 111, 115, 117, 9164, 9175, 9180, 9185, 9191, 9205, 256, 105, 121, 9169, 9173, 114, 99, 59, 16693, 59, 17465, 114, 59, 49152, 55349, 56615, 97, 116, 104, 59, 16951, 112, 102, 59, 49152, 55349, 56667, 483, 9196, 0, 9201, 114, 59, 49152, 55349, 56511, 114, 99, 121, 59, 17496, 107, 99, 121, 59, 17492, 1024, 97, 99, 102, 103, 104, 106, 111, 115, 9227, 9238, 9250, 9255, 9261, 9265, 9269, 9275, 112, 112, 97, 256, 59, 118, 9235, 9236, 17338, 59, 17392, 256, 101, 121, 9243, 9248, 100, 105, 108, 59, 16695, 59, 17466, 114, 59, 49152, 55349, 56616, 114, 101, 101, 110, 59, 16696, 99, 121, 59, 17477, 99, 121, 59, 17500, 112, 102, 59, 49152, 55349, 56668, 99, 114, 59, 49152, 55349, 56512, 2944, 65, 66, 69, 72, 97, 98, 99, 100, 101, 102, 103, 104, 106, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 9328, 9345, 9350, 9357, 9361, 9486, 9533, 9562, 9600, 9806, 9822, 9829, 9849, 9853, 9882, 9906, 9944, 10077, 10088, 10123, 10176, 10241, 10258, 384, 97, 114, 116, 9335, 9338, 9340, 114, 242, 2502, 242, 917, 97, 105, 108, 59, 26907, 97, 114, 114, 59, 26894, 256, 59, 103, 2452, 9355, 59, 27275, 97, 114, 59, 26978, 2403, 9381, 0, 9386, 0, 9393, 0, 0, 0, 0, 0, 9397, 9402, 0, 9414, 9416, 9421, 0, 9465, 117, 116, 101, 59, 16698, 109, 112, 116, 121, 118, 59, 27060, 114, 97, 238, 2124, 98, 100, 97, 59, 17339, 103, 384, 59, 100, 108, 2190, 9409, 9411, 59, 27025, 229, 2190, 59, 27269, 117, 111, 32827, 171, 16555, 114, 1024, 59, 98, 102, 104, 108, 112, 115, 116, 2201, 9438, 9446, 9449, 9451, 9454, 9457, 9461, 256, 59, 102, 2205, 9443, 115, 59, 26911, 115, 59, 26909, 235, 8786, 112, 59, 25003, 108, 59, 26937, 105, 109, 59, 26995, 108, 59, 24994, 384, 59, 97, 101, 9471, 9472, 9476, 27307, 105, 108, 59, 26905, 256, 59, 115, 9481, 9482, 27309, 59, 49152, 10925, 65024, 384, 97, 98, 114, 9493, 9497, 9501, 114, 114, 59, 26892, 114, 107, 59, 26482, 256, 97, 107, 9506, 9516, 99, 256, 101, 107, 9512, 9514, 59, 16507, 59, 16475, 256, 101, 115, 9521, 9523, 59, 27019, 108, 256, 100, 117, 9529, 9531, 59, 27023, 59, 27021, 512, 97, 101, 117, 121, 9542, 9547, 9558, 9560, 114, 111, 110, 59, 16702, 256, 100, 105, 9552, 9556, 105, 108, 59, 16700, 236, 2224, 226, 9513, 59, 17467, 512, 99, 113, 114, 115, 9571, 9574, 9581, 9597, 97, 59, 26934, 117, 111, 256, 59, 114, 3609, 5958, 256, 100, 117, 9586, 9591, 104, 97, 114, 59, 26983, 115, 104, 97, 114, 59, 26955, 104, 59, 25010, 640, 59, 102, 103, 113, 115, 9611, 9612, 2441, 9715, 9727, 25188, 116, 640, 97, 104, 108, 114, 116, 9624, 9636, 9655, 9666, 9704, 114, 114, 111, 119, 256, 59, 116, 2201, 9633, 97, 233, 9462, 97, 114, 112, 111, 111, 110, 256, 100, 117, 9647, 9652, 111, 119, 110, 187, 1114, 112, 187, 2406, 101, 102, 116, 97, 114, 114, 111, 119, 115, 59, 25031, 105, 103, 104, 116, 384, 97, 104, 115, 9677, 9686, 9694, 114, 114, 111, 119, 256, 59, 115, 2292, 2215, 97, 114, 112, 111, 111, 110, 243, 3992, 113, 117, 105, 103, 97, 114, 114, 111, 247, 8688, 104, 114, 101, 101, 116, 105, 109, 101, 115, 59, 25291, 384, 59, 113, 115, 9611, 2451, 9722, 108, 97, 110, 244, 2476, 640, 59, 99, 100, 103, 115, 2476, 9738, 9741, 9757, 9768, 99, 59, 27304, 111, 116, 256, 59, 111, 9748, 9749, 27263, 256, 59, 114, 9754, 9755, 27265, 59, 27267, 256, 59, 101, 9762, 9765, 49152, 8922, 65024, 115, 59, 27283, 640, 97, 100, 101, 103, 115, 9779, 9785, 9789, 9801, 9803, 112, 112, 114, 111, 248, 9414, 111, 116, 59, 25302, 113, 256, 103, 113, 9795, 9797, 244, 2441, 103, 116, 242, 9356, 244, 2459, 105, 237, 2482, 384, 105, 108, 114, 9813, 2273, 9818, 115, 104, 116, 59, 27004, 59, 49152, 55349, 56617, 256, 59, 69, 2460, 9827, 59, 27281, 353, 9833, 9846, 114, 256, 100, 117, 9650, 9838, 256, 59, 108, 2405, 9843, 59, 26986, 108, 107, 59, 25988, 99, 121, 59, 17497, 640, 59, 97, 99, 104, 116, 2632, 9864, 9867, 9873, 9878, 114, 242, 9665, 111, 114, 110, 101, 242, 7432, 97, 114, 100, 59, 26987, 114, 105, 59, 26106, 256, 105, 111, 9887, 9892, 100, 111, 116, 59, 16704, 117, 115, 116, 256, 59, 97, 9900, 9901, 25520, 99, 104, 101, 187, 9901, 512, 69, 97, 101, 115, 9915, 9917, 9929, 9940, 59, 25192, 112, 256, 59, 112, 9923, 9924, 27273, 114, 111, 120, 187, 9924, 256, 59, 113, 9934, 9935, 27271, 256, 59, 113, 9934, 9915, 105, 109, 59, 25318, 1024, 97, 98, 110, 111, 112, 116, 119, 122, 9961, 9972, 9975, 10010, 10031, 10049, 10055, 10064, 256, 110, 114, 9966, 9969, 103, 59, 26604, 114, 59, 25085, 114, 235, 2241, 103, 384, 108, 109, 114, 9983, 9997, 10004, 101, 102, 116, 256, 97, 114, 2534, 9991, 105, 103, 104, 116, 225, 2546, 97, 112, 115, 116, 111, 59, 26620, 105, 103, 104, 116, 225, 2557, 112, 97, 114, 114, 111, 119, 256, 108, 114, 10021, 10025, 101, 102, 244, 9453, 105, 103, 104, 116, 59, 25004, 384, 97, 102, 108, 10038, 10041, 10045, 114, 59, 27013, 59, 49152, 55349, 56669, 117, 115, 59, 27181, 105, 109, 101, 115, 59, 27188, 353, 10059, 10063, 115, 116, 59, 25111, 225, 4942, 384, 59, 101, 102, 10071, 10072, 6144, 26058, 110, 103, 101, 187, 10072, 97, 114, 256, 59, 108, 10084, 10085, 16424, 116, 59, 27027, 640, 97, 99, 104, 109, 116, 10099, 10102, 10108, 10117, 10119, 114, 242, 2216, 111, 114, 110, 101, 242, 7564, 97, 114, 256, 59, 100, 3992, 10115, 59, 26989, 59, 24590, 114, 105, 59, 25279, 768, 97, 99, 104, 105, 113, 116, 10136, 10141, 2624, 10146, 10158, 10171, 113, 117, 111, 59, 24633, 114, 59, 49152, 55349, 56513, 109, 384, 59, 101, 103, 2482, 10154, 10156, 59, 27277, 59, 27279, 256, 98, 117, 9514, 10163, 111, 256, 59, 114, 3615, 10169, 59, 24602, 114, 111, 107, 59, 16706, 33792, 60, 59, 99, 100, 104, 105, 108, 113, 114, 2091, 10194, 9785, 10204, 10208, 10213, 10218, 10224, 256, 99, 105, 10199, 10201, 59, 27302, 114, 59, 27257, 114, 101, 229, 9714, 109, 101, 115, 59, 25289, 97, 114, 114, 59, 26998, 117, 101, 115, 116, 59, 27259, 256, 80, 105, 10229, 10233, 97, 114, 59, 27030, 384, 59, 101, 102, 10240, 2349, 6171, 26051, 114, 256, 100, 117, 10247, 10253, 115, 104, 97, 114, 59, 26954, 104, 97, 114, 59, 26982, 256, 101, 110, 10263, 10273, 114, 116, 110, 101, 113, 113, 59, 49152, 8808, 65024, 197, 10270, 1792, 68, 97, 99, 100, 101, 102, 104, 105, 108, 110, 111, 112, 115, 117, 10304, 10309, 10370, 10382, 10387, 10400, 10405, 10408, 10458, 10466, 10468, 2691, 10483, 10498, 68, 111, 116, 59, 25146, 512, 99, 108, 112, 114, 10318, 10322, 10339, 10365, 114, 32827, 175, 16559, 256, 101, 116, 10327, 10329, 59, 26178, 256, 59, 101, 10334, 10335, 26400, 115, 101, 187, 10335, 256, 59, 115, 4155, 10344, 116, 111, 512, 59, 100, 108, 117, 4155, 10355, 10359, 10363, 111, 119, 238, 1164, 101, 102, 244, 2319, 240, 5073, 107, 101, 114, 59, 26030, 256, 111, 121, 10375, 10380, 109, 109, 97, 59, 27177, 59, 17468, 97, 115, 104, 59, 24596, 97, 115, 117, 114, 101, 100, 97, 110, 103, 108, 101, 187, 5670, 114, 59, 49152, 55349, 56618, 111, 59, 24871, 384, 99, 100, 110, 10415, 10420, 10441, 114, 111, 32827, 181, 16565, 512, 59, 97, 99, 100, 5220, 10429, 10432, 10436, 115, 244, 5799, 105, 114, 59, 27376, 111, 116, 32955, 183, 437, 117, 115, 384, 59, 98, 100, 10450, 6403, 10451, 25106, 256, 59, 117, 7484, 10456, 59, 27178, 355, 10462, 10465, 112, 59, 27355, 242, 8722, 240, 2689, 256, 100, 112, 10473, 10478, 101, 108, 115, 59, 25255, 102, 59, 49152, 55349, 56670, 256, 99, 116, 10488, 10493, 114, 59, 49152, 55349, 56514, 112, 111, 115, 187, 5533, 384, 59, 108, 109, 10505, 10506, 10509, 17340, 116, 105, 109, 97, 112, 59, 25272, 3072, 71, 76, 82, 86, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 108, 109, 111, 112, 114, 115, 116, 117, 118, 119, 10562, 10579, 10622, 10633, 10648, 10714, 10729, 10773, 10778, 10840, 10845, 10883, 10901, 10916, 10920, 11012, 11015, 11076, 11135, 11182, 11316, 11367, 11388, 11497, 256, 103, 116, 10567, 10571, 59, 49152, 8921, 824, 256, 59, 118, 10576, 3023, 49152, 8811, 8402, 384, 101, 108, 116, 10586, 10610, 10614, 102, 116, 256, 97, 114, 10593, 10599, 114, 114, 111, 119, 59, 25037, 105, 103, 104, 116, 97, 114, 114, 111, 119, 59, 25038, 59, 49152, 8920, 824, 256, 59, 118, 10619, 3143, 49152, 8810, 8402, 105, 103, 104, 116, 97, 114, 114, 111, 119, 59, 25039, 256, 68, 100, 10638, 10643, 97, 115, 104, 59, 25263, 97, 115, 104, 59, 25262, 640, 98, 99, 110, 112, 116, 10659, 10663, 10668, 10673, 10700, 108, 97, 187, 734, 117, 116, 101, 59, 16708, 103, 59, 49152, 8736, 8402, 640, 59, 69, 105, 111, 112, 3460, 10684, 10688, 10693, 10696, 59, 49152, 10864, 824, 100, 59, 49152, 8779, 824, 115, 59, 16713, 114, 111, 248, 3460, 117, 114, 256, 59, 97, 10707, 10708, 26222, 108, 256, 59, 115, 10707, 2872, 499, 10719, 0, 10723, 112, 32955, 160, 2871, 109, 112, 256, 59, 101, 3065, 3072, 640, 97, 101, 111, 117, 121, 10740, 10750, 10755, 10768, 10771, 496, 10745, 0, 10747, 59, 27203, 111, 110, 59, 16712, 100, 105, 108, 59, 16710, 110, 103, 256, 59, 100, 3454, 10762, 111, 116, 59, 49152, 10861, 824, 112, 59, 27202, 59, 17469, 97, 115, 104, 59, 24595, 896, 59, 65, 97, 100, 113, 115, 120, 2962, 10793, 10797, 10811, 10817, 10821, 10832, 114, 114, 59, 25047, 114, 256, 104, 114, 10803, 10806, 107, 59, 26916, 256, 59, 111, 5106, 5104, 111, 116, 59, 49152, 8784, 824, 117, 105, 246, 2915, 256, 101, 105, 10826, 10830, 97, 114, 59, 26920, 237, 2968, 105, 115, 116, 256, 59, 115, 2976, 2975, 114, 59, 49152, 55349, 56619, 512, 69, 101, 115, 116, 3013, 10854, 10873, 10876, 384, 59, 113, 115, 3004, 10861, 3041, 384, 59, 113, 115, 3004, 3013, 10868, 108, 97, 110, 244, 3042, 105, 237, 3050, 256, 59, 114, 2998, 10881, 187, 2999, 384, 65, 97, 112, 10890, 10893, 10897, 114, 242, 10609, 114, 114, 59, 25006, 97, 114, 59, 27378, 384, 59, 115, 118, 3981, 10908, 3980, 256, 59, 100, 10913, 10914, 25340, 59, 25338, 99, 121, 59, 17498, 896, 65, 69, 97, 100, 101, 115, 116, 10935, 10938, 10942, 10946, 10949, 10998, 11001, 114, 242, 10598, 59, 49152, 8806, 824, 114, 114, 59, 24986, 114, 59, 24613, 512, 59, 102, 113, 115, 3131, 10958, 10979, 10991, 116, 256, 97, 114, 10964, 10969, 114, 114, 111, 247, 10945, 105, 103, 104, 116, 97, 114, 114, 111, 247, 10896, 384, 59, 113, 115, 3131, 10938, 10986, 108, 97, 110, 244, 3157, 256, 59, 115, 3157, 10996, 187, 3126, 105, 237, 3165, 256, 59, 114, 3125, 11006, 105, 256, 59, 101, 3098, 3109, 105, 228, 3472, 256, 112, 116, 11020, 11025, 102, 59, 49152, 55349, 56671, 33152, 172, 59, 105, 110, 11033, 11034, 11062, 16556, 110, 512, 59, 69, 100, 118, 2953, 11044, 11048, 11054, 59, 49152, 8953, 824, 111, 116, 59, 49152, 8949, 824, 481, 2953, 11059, 11061, 59, 25335, 59, 25334, 105, 256, 59, 118, 3256, 11068, 481, 3256, 11073, 11075, 59, 25342, 59, 25341, 384, 97, 111, 114, 11083, 11107, 11113, 114, 512, 59, 97, 115, 116, 2939, 11093, 11098, 11103, 108, 108, 101, 236, 2939, 108, 59, 49152, 11005, 8421, 59, 49152, 8706, 824, 108, 105, 110, 116, 59, 27156, 384, 59, 99, 101, 3218, 11120, 11123, 117, 229, 3237, 256, 59, 99, 3224, 11128, 256, 59, 101, 3218, 11133, 241, 3224, 512, 65, 97, 105, 116, 11144, 11147, 11165, 11175, 114, 242, 10632, 114, 114, 384, 59, 99, 119, 11156, 11157, 11161, 24987, 59, 49152, 10547, 824, 59, 49152, 8605, 824, 103, 104, 116, 97, 114, 114, 111, 119, 187, 11157, 114, 105, 256, 59, 101, 3275, 3286, 896, 99, 104, 105, 109, 112, 113, 117, 11197, 11213, 11225, 11012, 2936, 11236, 11247, 512, 59, 99, 101, 114, 3378, 11206, 3383, 11209, 117, 229, 3397, 59, 49152, 55349, 56515, 111, 114, 116, 621, 11013, 0, 0, 11222, 97, 114, 225, 11094, 109, 256, 59, 101, 3438, 11231, 256, 59, 113, 3444, 3443, 115, 117, 256, 98, 112, 11243, 11245, 229, 3320, 229, 3339, 384, 98, 99, 112, 11254, 11281, 11289, 512, 59, 69, 101, 115, 11263, 11264, 3362, 11268, 25220, 59, 49152, 10949, 824, 101, 116, 256, 59, 101, 3355, 11275, 113, 256, 59, 113, 3363, 11264, 99, 256, 59, 101, 3378, 11287, 241, 3384, 512, 59, 69, 101, 115, 11298, 11299, 3423, 11303, 25221, 59, 49152, 10950, 824, 101, 116, 256, 59, 101, 3416, 11310, 113, 256, 59, 113, 3424, 11299, 512, 103, 105, 108, 114, 11325, 11327, 11333, 11335, 236, 3031, 108, 100, 101, 32827, 241, 16625, 231, 3139, 105, 97, 110, 103, 108, 101, 256, 108, 114, 11346, 11356, 101, 102, 116, 256, 59, 101, 3098, 11354, 241, 3110, 105, 103, 104, 116, 256, 59, 101, 3275, 11365, 241, 3287, 256, 59, 109, 11372, 11373, 17341, 384, 59, 101, 115, 11380, 11381, 11385, 16419, 114, 111, 59, 24854, 112, 59, 24583, 1152, 68, 72, 97, 100, 103, 105, 108, 114, 115, 11407, 11412, 11417, 11422, 11427, 11440, 11446, 11475, 11491, 97, 115, 104, 59, 25261, 97, 114, 114, 59, 26884, 112, 59, 49152, 8781, 8402, 97, 115, 104, 59, 25260, 256, 101, 116, 11432, 11436, 59, 49152, 8805, 8402, 59, 49152, 62, 8402, 110, 102, 105, 110, 59, 27102, 384, 65, 101, 116, 11453, 11457, 11461, 114, 114, 59, 26882, 59, 49152, 8804, 8402, 256, 59, 114, 11466, 11469, 49152, 60, 8402, 105, 101, 59, 49152, 8884, 8402, 256, 65, 116, 11480, 11484, 114, 114, 59, 26883, 114, 105, 101, 59, 49152, 8885, 8402, 105, 109, 59, 49152, 8764, 8402, 384, 65, 97, 110, 11504, 11508, 11522, 114, 114, 59, 25046, 114, 256, 104, 114, 11514, 11517, 107, 59, 26915, 256, 59, 111, 5095, 5093, 101, 97, 114, 59, 26919, 4691, 6805, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11565, 0, 11576, 11592, 11616, 11621, 11634, 11652, 6919, 0, 0, 11661, 11691, 0, 11720, 11726, 0, 11740, 11801, 11819, 11838, 11843, 256, 99, 115, 11569, 6807, 117, 116, 101, 32827, 243, 16627, 256, 105, 121, 11580, 11589, 114, 256, 59, 99, 6814, 11586, 32827, 244, 16628, 59, 17470, 640, 97, 98, 105, 111, 115, 6816, 11602, 11607, 456, 11610, 108, 97, 99, 59, 16721, 118, 59, 27192, 111, 108, 100, 59, 27068, 108, 105, 103, 59, 16723, 256, 99, 114, 11625, 11629, 105, 114, 59, 27071, 59, 49152, 55349, 56620, 879, 11641, 0, 0, 11644, 0, 11650, 110, 59, 17115, 97, 118, 101, 32827, 242, 16626, 59, 27073, 256, 98, 109, 11656, 3572, 97, 114, 59, 27061, 512, 97, 99, 105, 116, 11669, 11672, 11685, 11688, 114, 242, 6784, 256, 105, 114, 11677, 11680, 114, 59, 27070, 111, 115, 115, 59, 27067, 110, 229, 3666, 59, 27072, 384, 97, 101, 105, 11697, 11701, 11705, 99, 114, 59, 16717, 103, 97, 59, 17353, 384, 99, 100, 110, 11712, 11717, 461, 114, 111, 110, 59, 17343, 59, 27062, 112, 102, 59, 49152, 55349, 56672, 384, 97, 101, 108, 11732, 11735, 466, 114, 59, 27063, 114, 112, 59, 27065, 896, 59, 97, 100, 105, 111, 115, 118, 11754, 11755, 11758, 11784, 11789, 11792, 11798, 25128, 114, 242, 6790, 512, 59, 101, 102, 109, 11767, 11768, 11778, 11781, 27229, 114, 256, 59, 111, 11774, 11775, 24884, 102, 187, 11775, 32827, 170, 16554, 32827, 186, 16570, 103, 111, 102, 59, 25270, 114, 59, 27222, 108, 111, 112, 101, 59, 27223, 59, 27227, 384, 99, 108, 111, 11807, 11809, 11815, 242, 11777, 97, 115, 104, 32827, 248, 16632, 108, 59, 25240, 105, 364, 11823, 11828, 100, 101, 32827, 245, 16629, 101, 115, 256, 59, 97, 475, 11834, 115, 59, 27190, 109, 108, 32827, 246, 16630, 98, 97, 114, 59, 25405, 2785, 11870, 0, 11901, 0, 11904, 11933, 0, 11938, 11961, 0, 0, 11979, 3740, 0, 12051, 0, 0, 12075, 12220, 0, 12232, 114, 512, 59, 97, 115, 116, 1027, 11879, 11890, 3717, 33024, 182, 59, 108, 11885, 11886, 16566, 108, 101, 236, 1027, 617, 11896, 0, 0, 11899, 109, 59, 27379, 59, 27389, 121, 59, 17471, 114, 640, 99, 105, 109, 112, 116, 11915, 11919, 11923, 6245, 11927, 110, 116, 59, 16421, 111, 100, 59, 16430, 105, 108, 59, 24624, 101, 110, 107, 59, 24625, 114, 59, 49152, 55349, 56621, 384, 105, 109, 111, 11944, 11952, 11956, 256, 59, 118, 11949, 11950, 17350, 59, 17365, 109, 97, 244, 2678, 110, 101, 59, 26126, 384, 59, 116, 118, 11967, 11968, 11976, 17344, 99, 104, 102, 111, 114, 107, 187, 8189, 59, 17366, 256, 97, 117, 11983, 11999, 110, 256, 99, 107, 11989, 11997, 107, 256, 59, 104, 8692, 11995, 59, 24846, 246, 8692, 115, 1152, 59, 97, 98, 99, 100, 101, 109, 115, 116, 12019, 12020, 6408, 12025, 12029, 12036, 12038, 12042, 12046, 16427, 99, 105, 114, 59, 27171, 105, 114, 59, 27170, 256, 111, 117, 7488, 12034, 59, 27173, 59, 27250, 110, 32955, 177, 3741, 105, 109, 59, 27174, 119, 111, 59, 27175, 384, 105, 112, 117, 12057, 12064, 12069, 110, 116, 105, 110, 116, 59, 27157, 102, 59, 49152, 55349, 56673, 110, 100, 32827, 163, 16547, 1280, 59, 69, 97, 99, 101, 105, 110, 111, 115, 117, 3784, 12095, 12097, 12100, 12103, 12161, 12169, 12178, 12158, 12214, 59, 27315, 112, 59, 27319, 117, 229, 3801, 256, 59, 99, 3790, 12108, 768, 59, 97, 99, 101, 110, 115, 3784, 12121, 12127, 12134, 12136, 12158, 112, 112, 114, 111, 248, 12099, 117, 114, 108, 121, 101, 241, 3801, 241, 3790, 384, 97, 101, 115, 12143, 12150, 12154, 112, 112, 114, 111, 120, 59, 27321, 113, 113, 59, 27317, 105, 109, 59, 25320, 105, 237, 3807, 109, 101, 256, 59, 115, 12168, 3758, 24626, 384, 69, 97, 115, 12152, 12176, 12154, 240, 12149, 384, 100, 102, 112, 3820, 12185, 12207, 384, 97, 108, 115, 12192, 12197, 12202, 108, 97, 114, 59, 25390, 105, 110, 101, 59, 25362, 117, 114, 102, 59, 25363, 256, 59, 116, 3835, 12212, 239, 3835, 114, 101, 108, 59, 25264, 256, 99, 105, 12224, 12229, 114, 59, 49152, 55349, 56517, 59, 17352, 110, 99, 115, 112, 59, 24584, 768, 102, 105, 111, 112, 115, 117, 12250, 8930, 12255, 12261, 12267, 12273, 114, 59, 49152, 55349, 56622, 112, 102, 59, 49152, 55349, 56674, 114, 105, 109, 101, 59, 24663, 99, 114, 59, 49152, 55349, 56518, 384, 97, 101, 111, 12280, 12297, 12307, 116, 256, 101, 105, 12286, 12293, 114, 110, 105, 111, 110, 243, 1712, 110, 116, 59, 27158, 115, 116, 256, 59, 101, 12304, 12305, 16447, 241, 7961, 244, 3860, 2688, 65, 66, 72, 97, 98, 99, 100, 101, 102, 104, 105, 108, 109, 110, 111, 112, 114, 115, 116, 117, 120, 12352, 12369, 12373, 12377, 12512, 12558, 12587, 12615, 12642, 12658, 12686, 12806, 12821, 12836, 12841, 12888, 12910, 12914, 12944, 12976, 12983, 384, 97, 114, 116, 12359, 12362, 12364, 114, 242, 4275, 242, 989, 97, 105, 108, 59, 26908, 97, 114, 242, 7269, 97, 114, 59, 26980, 896, 99, 100, 101, 110, 113, 114, 116, 12392, 12405, 12408, 12415, 12431, 12436, 12492, 256, 101, 117, 12397, 12401, 59, 49152, 8765, 817, 116, 101, 59, 16725, 105, 227, 4462, 109, 112, 116, 121, 118, 59, 27059, 103, 512, 59, 100, 101, 108, 4049, 12425, 12427, 12429, 59, 27026, 59, 27045, 229, 4049, 117, 111, 32827, 187, 16571, 114, 1408, 59, 97, 98, 99, 102, 104, 108, 112, 115, 116, 119, 4060, 12460, 12463, 12471, 12473, 12476, 12478, 12480, 12483, 12487, 12490, 112, 59, 26997, 256, 59, 102, 4064, 12468, 115, 59, 26912, 59, 26931, 115, 59, 26910, 235, 8797, 240, 10030, 108, 59, 26949, 105, 109, 59, 26996, 108, 59, 24995, 59, 24989, 256, 97, 105, 12497, 12501, 105, 108, 59, 26906, 111, 256, 59, 110, 12507, 12508, 25142, 97, 108, 243, 3870, 384, 97, 98, 114, 12519, 12522, 12526, 114, 242, 6117, 114, 107, 59, 26483, 256, 97, 107, 12531, 12541, 99, 256, 101, 107, 12537, 12539, 59, 16509, 59, 16477, 256, 101, 115, 12546, 12548, 59, 27020, 108, 256, 100, 117, 12554, 12556, 59, 27022, 59, 27024, 512, 97, 101, 117, 121, 12567, 12572, 12583, 12585, 114, 111, 110, 59, 16729, 256, 100, 105, 12577, 12581, 105, 108, 59, 16727, 236, 4082, 226, 12538, 59, 17472, 512, 99, 108, 113, 115, 12596, 12599, 12605, 12612, 97, 59, 26935, 100, 104, 97, 114, 59, 26985, 117, 111, 256, 59, 114, 526, 525, 104, 59, 25011, 384, 97, 99, 103, 12622, 12639, 3908, 108, 512, 59, 105, 112, 115, 3960, 12632, 12635, 4252, 110, 229, 4283, 97, 114, 244, 4009, 116, 59, 26029, 384, 105, 108, 114, 12649, 4131, 12654, 115, 104, 116, 59, 27005, 59, 49152, 55349, 56623, 256, 97, 111, 12663, 12678, 114, 256, 100, 117, 12669, 12671, 187, 1147, 256, 59, 108, 4241, 12676, 59, 26988, 256, 59, 118, 12683, 12684, 17345, 59, 17393, 384, 103, 110, 115, 12693, 12793, 12796, 104, 116, 768, 97, 104, 108, 114, 115, 116, 12708, 12720, 12738, 12760, 12772, 12782, 114, 114, 111, 119, 256, 59, 116, 4060, 12717, 97, 233, 12488, 97, 114, 112, 111, 111, 110, 256, 100, 117, 12731, 12735, 111, 119, 238, 12670, 112, 187, 4242, 101, 102, 116, 256, 97, 104, 12746, 12752, 114, 114, 111, 119, 243, 4074, 97, 114, 112, 111, 111, 110, 243, 1361, 105, 103, 104, 116, 97, 114, 114, 111, 119, 115, 59, 25033, 113, 117, 105, 103, 97, 114, 114, 111, 247, 12491, 104, 114, 101, 101, 116, 105, 109, 101, 115, 59, 25292, 103, 59, 17114, 105, 110, 103, 100, 111, 116, 115, 101, 241, 7986, 384, 97, 104, 109, 12813, 12816, 12819, 114, 242, 4074, 97, 242, 1361, 59, 24591, 111, 117, 115, 116, 256, 59, 97, 12830, 12831, 25521, 99, 104, 101, 187, 12831, 109, 105, 100, 59, 27374, 512, 97, 98, 112, 116, 12850, 12861, 12864, 12882, 256, 110, 114, 12855, 12858, 103, 59, 26605, 114, 59, 25086, 114, 235, 4099, 384, 97, 102, 108, 12871, 12874, 12878, 114, 59, 27014, 59, 49152, 55349, 56675, 117, 115, 59, 27182, 105, 109, 101, 115, 59, 27189, 256, 97, 112, 12893, 12903, 114, 256, 59, 103, 12899, 12900, 16425, 116, 59, 27028, 111, 108, 105, 110, 116, 59, 27154, 97, 114, 242, 12771, 512, 97, 99, 104, 113, 12923, 12928, 4284, 12933, 113, 117, 111, 59, 24634, 114, 59, 49152, 55349, 56519, 256, 98, 117, 12539, 12938, 111, 256, 59, 114, 532, 531, 384, 104, 105, 114, 12951, 12955, 12960, 114, 101, 229, 12792, 109, 101, 115, 59, 25290, 105, 512, 59, 101, 102, 108, 12970, 4185, 6177, 12971, 26041, 116, 114, 105, 59, 27086, 108, 117, 104, 97, 114, 59, 26984, 59, 24862, 3425, 13013, 13019, 13023, 13100, 13112, 13169, 0, 13178, 13220, 0, 0, 13292, 13296, 0, 13352, 13384, 13402, 13485, 13489, 13514, 13553, 0, 13846, 0, 0, 13875, 99, 117, 116, 101, 59, 16731, 113, 117, 239, 10170, 1280, 59, 69, 97, 99, 101, 105, 110, 112, 115, 121, 4589, 13043, 13045, 13055, 13058, 13067, 13071, 13087, 13094, 13097, 59, 27316, 496, 13050, 0, 13052, 59, 27320, 111, 110, 59, 16737, 117, 229, 4606, 256, 59, 100, 4595, 13063, 105, 108, 59, 16735, 114, 99, 59, 16733, 384, 69, 97, 115, 13078, 13080, 13083, 59, 27318, 112, 59, 27322, 105, 109, 59, 25321, 111, 108, 105, 110, 116, 59, 27155, 105, 237, 4612, 59, 17473, 111, 116, 384, 59, 98, 101, 13108, 7495, 13109, 25285, 59, 27238, 896, 65, 97, 99, 109, 115, 116, 120, 13126, 13130, 13143, 13147, 13150, 13155, 13165, 114, 114, 59, 25048, 114, 256, 104, 114, 13136, 13138, 235, 8744, 256, 59, 111, 2614, 2612, 116, 32827, 167, 16551, 105, 59, 16443, 119, 97, 114, 59, 26921, 109, 256, 105, 110, 13161, 240, 110, 117, 243, 241, 116, 59, 26422, 114, 256, 59, 111, 13174, 8277, 49152, 55349, 56624, 512, 97, 99, 111, 121, 13186, 13190, 13201, 13216, 114, 112, 59, 26223, 256, 104, 121, 13195, 13199, 99, 121, 59, 17481, 59, 17480, 114, 116, 621, 13209, 0, 0, 13212, 105, 228, 5220, 97, 114, 97, 236, 11887, 32827, 173, 16557, 256, 103, 109, 13224, 13236, 109, 97, 384, 59, 102, 118, 13233, 13234, 13234, 17347, 59, 17346, 1024, 59, 100, 101, 103, 108, 110, 112, 114, 4779, 13253, 13257, 13262, 13270, 13278, 13281, 13286, 111, 116, 59, 27242, 256, 59, 113, 4785, 4784, 256, 59, 69, 13267, 13268, 27294, 59, 27296, 256, 59, 69, 13275, 13276, 27293, 59, 27295, 101, 59, 25158, 108, 117, 115, 59, 27172, 97, 114, 114, 59, 26994, 97, 114, 242, 4413, 512, 97, 101, 105, 116, 13304, 13320, 13327, 13335, 256, 108, 115, 13309, 13316, 108, 115, 101, 116, 109, 233, 13162, 104, 112, 59, 27187, 112, 97, 114, 115, 108, 59, 27108, 256, 100, 108, 5219, 13332, 101, 59, 25379, 256, 59, 101, 13340, 13341, 27306, 256, 59, 115, 13346, 13347, 27308, 59, 49152, 10924, 65024, 384, 102, 108, 112, 13358, 13363, 13378, 116, 99, 121, 59, 17484, 256, 59, 98, 13368, 13369, 16431, 256, 59, 97, 13374, 13375, 27076, 114, 59, 25407, 102, 59, 49152, 55349, 56676, 97, 256, 100, 114, 13389, 1026, 101, 115, 256, 59, 117, 13396, 13397, 26208, 105, 116, 187, 13397, 384, 99, 115, 117, 13408, 13433, 13471, 256, 97, 117, 13413, 13423, 112, 256, 59, 115, 4488, 13419, 59, 49152, 8851, 65024, 112, 256, 59, 115, 4532, 13429, 59, 49152, 8852, 65024, 117, 256, 98, 112, 13439, 13455, 384, 59, 101, 115, 4503, 4508, 13446, 101, 116, 256, 59, 101, 4503, 13453, 241, 4509, 384, 59, 101, 115, 4520, 4525, 13462, 101, 116, 256, 59, 101, 4520, 13469, 241, 4526, 384, 59, 97, 102, 4475, 13478, 1456, 114, 357, 13483, 1457, 187, 4476, 97, 114, 242, 4424, 512, 99, 101, 109, 116, 13497, 13502, 13506, 13509, 114, 59, 49152, 55349, 56520, 116, 109, 238, 241, 105, 236, 13333, 97, 114, 230, 4542, 256, 97, 114, 13518, 13525, 114, 256, 59, 102, 13524, 6079, 26118, 256, 97, 110, 13530, 13549, 105, 103, 104, 116, 256, 101, 112, 13539, 13546, 112, 115, 105, 108, 111, 238, 7904, 104, 233, 11951, 115, 187, 10322, 640, 98, 99, 109, 110, 112, 13563, 13662, 4617, 13707, 13710, 1152, 59, 69, 100, 101, 109, 110, 112, 114, 115, 13582, 13583, 13585, 13589, 13598, 13603, 13612, 13617, 13622, 25218, 59, 27333, 111, 116, 59, 27325, 256, 59, 100, 4570, 13594, 111, 116, 59, 27331, 117, 108, 116, 59, 27329, 256, 69, 101, 13608, 13610, 59, 27339, 59, 25226, 108, 117, 115, 59, 27327, 97, 114, 114, 59, 27001, 384, 101, 105, 117, 13629, 13650, 13653, 116, 384, 59, 101, 110, 13582, 13637, 13643, 113, 256, 59, 113, 4570, 13583, 101, 113, 256, 59, 113, 13611, 13608, 109, 59, 27335, 256, 98, 112, 13658, 13660, 59, 27349, 59, 27347, 99, 768, 59, 97, 99, 101, 110, 115, 4589, 13676, 13682, 13689, 13691, 13094, 112, 112, 114, 111, 248, 13050, 117, 114, 108, 121, 101, 241, 4606, 241, 4595, 384, 97, 101, 115, 13698, 13704, 13083, 112, 112, 114, 111, 248, 13082, 113, 241, 13079, 103, 59, 26218, 1664, 49, 50, 51, 59, 69, 100, 101, 104, 108, 109, 110, 112, 115, 13737, 13740, 13743, 4636, 13746, 13748, 13760, 13769, 13781, 13786, 13791, 13800, 13805, 32827, 185, 16569, 32827, 178, 16562, 32827, 179, 16563, 59, 27334, 256, 111, 115, 13753, 13756, 116, 59, 27326, 117, 98, 59, 27352, 256, 59, 100, 4642, 13765, 111, 116, 59, 27332, 115, 256, 111, 117, 13775, 13778, 108, 59, 26569, 98, 59, 27351, 97, 114, 114, 59, 27003, 117, 108, 116, 59, 27330, 256, 69, 101, 13796, 13798, 59, 27340, 59, 25227, 108, 117, 115, 59, 27328, 384, 101, 105, 117, 13812, 13833, 13836, 116, 384, 59, 101, 110, 4636, 13820, 13826, 113, 256, 59, 113, 4642, 13746, 101, 113, 256, 59, 113, 13799, 13796, 109, 59, 27336, 256, 98, 112, 13841, 13843, 59, 27348, 59, 27350, 384, 65, 97, 110, 13852, 13856, 13869, 114, 114, 59, 25049, 114, 256, 104, 114, 13862, 13864, 235, 8750, 256, 59, 111, 2603, 2601, 119, 97, 114, 59, 26922, 108, 105, 103, 32827, 223, 16607, 3041, 13905, 13917, 13920, 4814, 13939, 13945, 0, 13950, 14018, 0, 0, 0, 0, 0, 14043, 14083, 0, 14089, 14188, 0, 0, 0, 14215, 626, 13910, 0, 0, 13915, 103, 101, 116, 59, 25366, 59, 17348, 114, 235, 3679, 384, 97, 101, 121, 13926, 13931, 13936, 114, 111, 110, 59, 16741, 100, 105, 108, 59, 16739, 59, 17474, 108, 114, 101, 99, 59, 25365, 114, 59, 49152, 55349, 56625, 512, 101, 105, 107, 111, 13958, 13981, 14005, 14012, 498, 13963, 0, 13969, 101, 256, 52, 102, 4740, 4737, 97, 384, 59, 115, 118, 13976, 13977, 13979, 17336, 121, 109, 59, 17361, 256, 99, 110, 13986, 14002, 107, 256, 97, 115, 13992, 13998, 112, 112, 114, 111, 248, 4801, 105, 109, 187, 4780, 115, 240, 4766, 256, 97, 115, 14010, 13998, 240, 4801, 114, 110, 32827, 254, 16638, 492, 799, 14022, 8935, 101, 115, 33152, 215, 59, 98, 100, 14031, 14032, 14040, 16599, 256, 59, 97, 6415, 14037, 114, 59, 27185, 59, 27184, 384, 101, 112, 115, 14049, 14051, 14080, 225, 10829, 512, 59, 98, 99, 102, 1158, 14060, 14064, 14068, 111, 116, 59, 25398, 105, 114, 59, 27377, 256, 59, 111, 14073, 14076, 49152, 55349, 56677, 114, 107, 59, 27354, 225, 13154, 114, 105, 109, 101, 59, 24628, 384, 97, 105, 112, 14095, 14098, 14180, 100, 229, 4680, 896, 97, 100, 101, 109, 112, 115, 116, 14113, 14157, 14144, 14161, 14167, 14172, 14175, 110, 103, 108, 101, 640, 59, 100, 108, 113, 114, 14128, 14129, 14134, 14144, 14146, 26037, 111, 119, 110, 187, 7611, 101, 102, 116, 256, 59, 101, 10240, 14142, 241, 2350, 59, 25180, 105, 103, 104, 116, 256, 59, 101, 12970, 14155, 241, 4186, 111, 116, 59, 26092, 105, 110, 117, 115, 59, 27194, 108, 117, 115, 59, 27193, 98, 59, 27085, 105, 109, 101, 59, 27195, 101, 122, 105, 117, 109, 59, 25570, 384, 99, 104, 116, 14194, 14205, 14209, 256, 114, 121, 14199, 14203, 59, 49152, 55349, 56521, 59, 17478, 99, 121, 59, 17499, 114, 111, 107, 59, 16743, 256, 105, 111, 14219, 14222, 120, 244, 6007, 104, 101, 97, 100, 256, 108, 114, 14231, 14240, 101, 102, 116, 97, 114, 114, 111, 247, 2127, 105, 103, 104, 116, 97, 114, 114, 111, 119, 187, 3933, 2304, 65, 72, 97, 98, 99, 100, 102, 103, 104, 108, 109, 111, 112, 114, 115, 116, 117, 119, 14288, 14291, 14295, 14308, 14320, 14332, 14350, 14364, 14371, 14388, 14417, 14429, 14443, 14505, 14540, 14546, 14570, 14582, 114, 242, 1005, 97, 114, 59, 26979, 256, 99, 114, 14300, 14306, 117, 116, 101, 32827, 250, 16634, 242, 4432, 114, 483, 14314, 0, 14317, 121, 59, 17502, 118, 101, 59, 16749, 256, 105, 121, 14325, 14330, 114, 99, 32827, 251, 16635, 59, 17475, 384, 97, 98, 104, 14339, 14342, 14347, 114, 242, 5037, 108, 97, 99, 59, 16753, 97, 242, 5059, 256, 105, 114, 14355, 14360, 115, 104, 116, 59, 27006, 59, 49152, 55349, 56626, 114, 97, 118, 101, 32827, 249, 16633, 353, 14375, 14385, 114, 256, 108, 114, 14380, 14382, 187, 2391, 187, 4227, 108, 107, 59, 25984, 256, 99, 116, 14393, 14413, 623, 14399, 0, 0, 14410, 114, 110, 256, 59, 101, 14405, 14406, 25372, 114, 187, 14406, 111, 112, 59, 25359, 114, 105, 59, 26104, 256, 97, 108, 14422, 14426, 99, 114, 59, 16747, 32955, 168, 841, 256, 103, 112, 14434, 14438, 111, 110, 59, 16755, 102, 59, 49152, 55349, 56678, 768, 97, 100, 104, 108, 115, 117, 4427, 14456, 14461, 4978, 14481, 14496, 111, 119, 110, 225, 5043, 97, 114, 112, 111, 111, 110, 256, 108, 114, 14472, 14476, 101, 102, 244, 14381, 105, 103, 104, 244, 14383, 105, 384, 59, 104, 108, 14489, 14490, 14492, 17349, 187, 5114, 111, 110, 187, 14490, 112, 97, 114, 114, 111, 119, 115, 59, 25032, 384, 99, 105, 116, 14512, 14532, 14536, 623, 14518, 0, 0, 14529, 114, 110, 256, 59, 101, 14524, 14525, 25373, 114, 187, 14525, 111, 112, 59, 25358, 110, 103, 59, 16751, 114, 105, 59, 26105, 99, 114, 59, 49152, 55349, 56522, 384, 100, 105, 114, 14553, 14557, 14562, 111, 116, 59, 25328, 108, 100, 101, 59, 16745, 105, 256, 59, 102, 14128, 14568, 187, 6163, 256, 97, 109, 14575, 14578, 114, 242, 14504, 108, 32827, 252, 16636, 97, 110, 103, 108, 101, 59, 27047, 1920, 65, 66, 68, 97, 99, 100, 101, 102, 108, 110, 111, 112, 114, 115, 122, 14620, 14623, 14633, 14637, 14773, 14776, 14781, 14815, 14820, 14824, 14835, 14841, 14845, 14849, 14880, 114, 242, 1015, 97, 114, 256, 59, 118, 14630, 14631, 27368, 59, 27369, 97, 115, 232, 993, 256, 110, 114, 14642, 14647, 103, 114, 116, 59, 27036, 896, 101, 107, 110, 112, 114, 115, 116, 13539, 14662, 14667, 14674, 14685, 14692, 14742, 97, 112, 112, 225, 9237, 111, 116, 104, 105, 110, 231, 7830, 384, 104, 105, 114, 13547, 11976, 14681, 111, 112, 244, 12213, 256, 59, 104, 5047, 14690, 239, 12685, 256, 105, 117, 14697, 14701, 103, 109, 225, 13235, 256, 98, 112, 14706, 14724, 115, 101, 116, 110, 101, 113, 256, 59, 113, 14717, 14720, 49152, 8842, 65024, 59, 49152, 10955, 65024, 115, 101, 116, 110, 101, 113, 256, 59, 113, 14735, 14738, 49152, 8843, 65024, 59, 49152, 10956, 65024, 256, 104, 114, 14747, 14751, 101, 116, 225, 13980, 105, 97, 110, 103, 108, 101, 256, 108, 114, 14762, 14767, 101, 102, 116, 187, 2341, 105, 103, 104, 116, 187, 4177, 121, 59, 17458, 97, 115, 104, 187, 4150, 384, 101, 108, 114, 14788, 14802, 14807, 384, 59, 98, 101, 11754, 14795, 14799, 97, 114, 59, 25275, 113, 59, 25178, 108, 105, 112, 59, 25326, 256, 98, 116, 14812, 5224, 97, 242, 5225, 114, 59, 49152, 55349, 56627, 116, 114, 233, 14766, 115, 117, 256, 98, 112, 14831, 14833, 187, 3356, 187, 3417, 112, 102, 59, 49152, 55349, 56679, 114, 111, 240, 3835, 116, 114, 233, 14772, 256, 99, 117, 14854, 14859, 114, 59, 49152, 55349, 56523, 256, 98, 112, 14864, 14872, 110, 256, 69, 101, 14720, 14870, 187, 14718, 110, 256, 69, 101, 14738, 14878, 187, 14736, 105, 103, 122, 97, 103, 59, 27034, 896, 99, 101, 102, 111, 112, 114, 115, 14902, 14907, 14934, 14939, 14932, 14945, 14954, 105, 114, 99, 59, 16757, 256, 100, 105, 14912, 14929, 256, 98, 103, 14917, 14921, 97, 114, 59, 27231, 101, 256, 59, 113, 5626, 14927, 59, 25177, 101, 114, 112, 59, 24856, 114, 59, 49152, 55349, 56628, 112, 102, 59, 49152, 55349, 56680, 256, 59, 101, 5241, 14950, 97, 116, 232, 5241, 99, 114, 59, 49152, 55349, 56524, 2787, 6030, 14983, 0, 14987, 0, 14992, 15003, 0, 0, 15005, 15016, 15019, 15023, 0, 0, 15043, 15054, 0, 15064, 6108, 6111, 116, 114, 233, 6097, 114, 59, 49152, 55349, 56629, 256, 65, 97, 14996, 14999, 114, 242, 963, 114, 242, 2550, 59, 17342, 256, 65, 97, 15009, 15012, 114, 242, 952, 114, 242, 2539, 97, 240, 10003, 105, 115, 59, 25339, 384, 100, 112, 116, 6052, 15029, 15038, 256, 102, 108, 15034, 6057, 59, 49152, 55349, 56681, 105, 109, 229, 6066, 256, 65, 97, 15047, 15050, 114, 242, 974, 114, 242, 2561, 256, 99, 113, 15058, 6072, 114, 59, 49152, 55349, 56525, 256, 112, 116, 6102, 15068, 114, 233, 6100, 1024, 97, 99, 101, 102, 105, 111, 115, 117, 15088, 15101, 15112, 15116, 15121, 15125, 15131, 15137, 99, 256, 117, 121, 15094, 15099, 116, 101, 32827, 253, 16637, 59, 17487, 256, 105, 121, 15106, 15110, 114, 99, 59, 16759, 59, 17483, 110, 32827, 165, 16549, 114, 59, 49152, 55349, 56630, 99, 121, 59, 17495, 112, 102, 59, 49152, 55349, 56682, 99, 114, 59, 49152, 55349, 56526, 256, 99, 109, 15142, 15145, 121, 59, 17486, 108, 32827, 255, 16639, 1280, 97, 99, 100, 101, 102, 104, 105, 111, 115, 119, 15170, 15176, 15188, 15192, 15204, 15209, 15213, 15220, 15226, 15232, 99, 117, 116, 101, 59, 16762, 256, 97, 121, 15181, 15186, 114, 111, 110, 59, 16766, 59, 17463, 111, 116, 59, 16764, 256, 101, 116, 15197, 15201, 116, 114, 230, 5471, 97, 59, 17334, 114, 59, 49152, 55349, 56631, 99, 121, 59, 17462, 103, 114, 97, 114, 114, 59, 25053, 112, 102, 59, 49152, 55349, 56683, 99, 114, 59, 49152, 55349, 56527, 256, 106, 110, 15237, 15239, 59, 24589, 106, 59, 24588]);

  // node_modules/.pnpm/entities@4.3.0/node_modules/entities/lib/esm/generated/decode-data-xml.js
  var decode_data_xml_default = new Uint16Array([512, 97, 103, 108, 113, 9, 21, 24, 27, 621, 15, 0, 0, 18, 112, 59, 16422, 111, 115, 59, 16423, 116, 59, 16446, 116, 59, 16444, 117, 111, 116, 59, 16418]);

  // node_modules/.pnpm/entities@4.3.0/node_modules/entities/lib/esm/decode_codepoint.js
  var _a;
  var decodeMap = /* @__PURE__ */ new Map([
    [0, 65533],
    [128, 8364],
    [130, 8218],
    [131, 402],
    [132, 8222],
    [133, 8230],
    [134, 8224],
    [135, 8225],
    [136, 710],
    [137, 8240],
    [138, 352],
    [139, 8249],
    [140, 338],
    [142, 381],
    [145, 8216],
    [146, 8217],
    [147, 8220],
    [148, 8221],
    [149, 8226],
    [150, 8211],
    [151, 8212],
    [152, 732],
    [153, 8482],
    [154, 353],
    [155, 8250],
    [156, 339],
    [158, 382],
    [159, 376]
  ]);
  var fromCodePoint = (_a = String.fromCodePoint) !== null && _a !== void 0 ? _a : function(codePoint) {
    let output = "";
    if (codePoint > 65535) {
      codePoint -= 65536;
      output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
      codePoint = 56320 | codePoint & 1023;
    }
    output += String.fromCharCode(codePoint);
    return output;
  };
  function replaceCodePoint(codePoint) {
    var _a2;
    if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
      return 65533;
    }
    return (_a2 = decodeMap.get(codePoint)) !== null && _a2 !== void 0 ? _a2 : codePoint;
  }
  function decodeCodePoint(codePoint) {
    return fromCodePoint(replaceCodePoint(codePoint));
  }

  // node_modules/.pnpm/entities@4.3.0/node_modules/entities/lib/esm/decode.js
  var CharCodes;
  (function(CharCodes3) {
    CharCodes3[CharCodes3["NUM"] = 35] = "NUM";
    CharCodes3[CharCodes3["SEMI"] = 59] = "SEMI";
    CharCodes3[CharCodes3["ZERO"] = 48] = "ZERO";
    CharCodes3[CharCodes3["NINE"] = 57] = "NINE";
    CharCodes3[CharCodes3["LOWER_A"] = 97] = "LOWER_A";
    CharCodes3[CharCodes3["LOWER_F"] = 102] = "LOWER_F";
    CharCodes3[CharCodes3["LOWER_X"] = 120] = "LOWER_X";
    CharCodes3[CharCodes3["To_LOWER_BIT"] = 32] = "To_LOWER_BIT";
  })(CharCodes || (CharCodes = {}));
  var BinTrieFlags;
  (function(BinTrieFlags2) {
    BinTrieFlags2[BinTrieFlags2["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
    BinTrieFlags2[BinTrieFlags2["BRANCH_LENGTH"] = 16256] = "BRANCH_LENGTH";
    BinTrieFlags2[BinTrieFlags2["JUMP_TABLE"] = 127] = "JUMP_TABLE";
  })(BinTrieFlags || (BinTrieFlags = {}));
  function getDecoder(decodeTree) {
    return function decodeHTMLBinary(str, strict) {
      let ret = "";
      let lastIdx = 0;
      let strIdx = 0;
      while ((strIdx = str.indexOf("&", strIdx)) >= 0) {
        ret += str.slice(lastIdx, strIdx);
        lastIdx = strIdx;
        strIdx += 1;
        if (str.charCodeAt(strIdx) === CharCodes.NUM) {
          let start = strIdx + 1;
          let base = 10;
          let cp = str.charCodeAt(start);
          if ((cp | CharCodes.To_LOWER_BIT) === CharCodes.LOWER_X) {
            base = 16;
            strIdx += 1;
            start += 1;
          }
          do
            cp = str.charCodeAt(++strIdx);
          while (cp >= CharCodes.ZERO && cp <= CharCodes.NINE || base === 16 && (cp | CharCodes.To_LOWER_BIT) >= CharCodes.LOWER_A && (cp | CharCodes.To_LOWER_BIT) <= CharCodes.LOWER_F);
          if (start !== strIdx) {
            const entity = str.substring(start, strIdx);
            const parsed = parseInt(entity, base);
            if (str.charCodeAt(strIdx) === CharCodes.SEMI) {
              strIdx += 1;
            } else if (strict) {
              continue;
            }
            ret += decodeCodePoint(parsed);
            lastIdx = strIdx;
          }
          continue;
        }
        let resultIdx = 0;
        let excess = 1;
        let treeIdx = 0;
        let current = decodeTree[treeIdx];
        for (; strIdx < str.length; strIdx++, excess++) {
          treeIdx = determineBranch(decodeTree, current, treeIdx + 1, str.charCodeAt(strIdx));
          if (treeIdx < 0)
            break;
          current = decodeTree[treeIdx];
          const masked = current & BinTrieFlags.VALUE_LENGTH;
          if (masked) {
            if (!strict || str.charCodeAt(strIdx) === CharCodes.SEMI) {
              resultIdx = treeIdx;
              excess = 0;
            }
            const valueLength = (masked >> 14) - 1;
            if (valueLength === 0)
              break;
            treeIdx += valueLength;
          }
        }
        if (resultIdx !== 0) {
          const valueLength = (decodeTree[resultIdx] & BinTrieFlags.VALUE_LENGTH) >> 14;
          ret += valueLength === 1 ? String.fromCharCode(decodeTree[resultIdx] & ~BinTrieFlags.VALUE_LENGTH) : valueLength === 2 ? String.fromCharCode(decodeTree[resultIdx + 1]) : String.fromCharCode(decodeTree[resultIdx + 1], decodeTree[resultIdx + 2]);
          lastIdx = strIdx - excess + 1;
        }
      }
      return ret + str.slice(lastIdx);
    };
  }
  function determineBranch(decodeTree, current, nodeIdx, char) {
    const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
    const jumpOffset = current & BinTrieFlags.JUMP_TABLE;
    if (branchCount === 0) {
      return jumpOffset !== 0 && char === jumpOffset ? nodeIdx : -1;
    }
    if (jumpOffset) {
      const value = char - jumpOffset;
      return value < 0 || value > branchCount ? -1 : decodeTree[nodeIdx + value] - 1;
    }
    let lo = nodeIdx;
    let hi = lo + branchCount - 1;
    while (lo <= hi) {
      const mid = lo + hi >>> 1;
      const midVal = decodeTree[mid];
      if (midVal < char) {
        lo = mid + 1;
      } else if (midVal > char) {
        hi = mid - 1;
      } else {
        return decodeTree[mid + branchCount];
      }
    }
    return -1;
  }
  var htmlDecoder = getDecoder(decode_data_html_default);
  var xmlDecoder = getDecoder(decode_data_xml_default);

  // node_modules/.pnpm/htmlparser2@8.0.1/node_modules/htmlparser2/lib/esm/Tokenizer.js
  var CharCodes2;
  (function(CharCodes3) {
    CharCodes3[CharCodes3["Tab"] = 9] = "Tab";
    CharCodes3[CharCodes3["NewLine"] = 10] = "NewLine";
    CharCodes3[CharCodes3["FormFeed"] = 12] = "FormFeed";
    CharCodes3[CharCodes3["CarriageReturn"] = 13] = "CarriageReturn";
    CharCodes3[CharCodes3["Space"] = 32] = "Space";
    CharCodes3[CharCodes3["ExclamationMark"] = 33] = "ExclamationMark";
    CharCodes3[CharCodes3["Num"] = 35] = "Num";
    CharCodes3[CharCodes3["Amp"] = 38] = "Amp";
    CharCodes3[CharCodes3["SingleQuote"] = 39] = "SingleQuote";
    CharCodes3[CharCodes3["DoubleQuote"] = 34] = "DoubleQuote";
    CharCodes3[CharCodes3["Dash"] = 45] = "Dash";
    CharCodes3[CharCodes3["Slash"] = 47] = "Slash";
    CharCodes3[CharCodes3["Zero"] = 48] = "Zero";
    CharCodes3[CharCodes3["Nine"] = 57] = "Nine";
    CharCodes3[CharCodes3["Semi"] = 59] = "Semi";
    CharCodes3[CharCodes3["Lt"] = 60] = "Lt";
    CharCodes3[CharCodes3["Eq"] = 61] = "Eq";
    CharCodes3[CharCodes3["Gt"] = 62] = "Gt";
    CharCodes3[CharCodes3["Questionmark"] = 63] = "Questionmark";
    CharCodes3[CharCodes3["UpperA"] = 65] = "UpperA";
    CharCodes3[CharCodes3["LowerA"] = 97] = "LowerA";
    CharCodes3[CharCodes3["UpperF"] = 70] = "UpperF";
    CharCodes3[CharCodes3["LowerF"] = 102] = "LowerF";
    CharCodes3[CharCodes3["UpperZ"] = 90] = "UpperZ";
    CharCodes3[CharCodes3["LowerZ"] = 122] = "LowerZ";
    CharCodes3[CharCodes3["LowerX"] = 120] = "LowerX";
    CharCodes3[CharCodes3["OpeningSquareBracket"] = 91] = "OpeningSquareBracket";
  })(CharCodes2 || (CharCodes2 = {}));
  var State;
  (function(State2) {
    State2[State2["Text"] = 1] = "Text";
    State2[State2["BeforeTagName"] = 2] = "BeforeTagName";
    State2[State2["InTagName"] = 3] = "InTagName";
    State2[State2["InSelfClosingTag"] = 4] = "InSelfClosingTag";
    State2[State2["BeforeClosingTagName"] = 5] = "BeforeClosingTagName";
    State2[State2["InClosingTagName"] = 6] = "InClosingTagName";
    State2[State2["AfterClosingTagName"] = 7] = "AfterClosingTagName";
    State2[State2["BeforeAttributeName"] = 8] = "BeforeAttributeName";
    State2[State2["InAttributeName"] = 9] = "InAttributeName";
    State2[State2["AfterAttributeName"] = 10] = "AfterAttributeName";
    State2[State2["BeforeAttributeValue"] = 11] = "BeforeAttributeValue";
    State2[State2["InAttributeValueDq"] = 12] = "InAttributeValueDq";
    State2[State2["InAttributeValueSq"] = 13] = "InAttributeValueSq";
    State2[State2["InAttributeValueNq"] = 14] = "InAttributeValueNq";
    State2[State2["BeforeDeclaration"] = 15] = "BeforeDeclaration";
    State2[State2["InDeclaration"] = 16] = "InDeclaration";
    State2[State2["InProcessingInstruction"] = 17] = "InProcessingInstruction";
    State2[State2["BeforeComment"] = 18] = "BeforeComment";
    State2[State2["CDATASequence"] = 19] = "CDATASequence";
    State2[State2["InSpecialComment"] = 20] = "InSpecialComment";
    State2[State2["InCommentLike"] = 21] = "InCommentLike";
    State2[State2["BeforeSpecialS"] = 22] = "BeforeSpecialS";
    State2[State2["SpecialStartSequence"] = 23] = "SpecialStartSequence";
    State2[State2["InSpecialTag"] = 24] = "InSpecialTag";
    State2[State2["BeforeEntity"] = 25] = "BeforeEntity";
    State2[State2["BeforeNumericEntity"] = 26] = "BeforeNumericEntity";
    State2[State2["InNamedEntity"] = 27] = "InNamedEntity";
    State2[State2["InNumericEntity"] = 28] = "InNumericEntity";
    State2[State2["InHexEntity"] = 29] = "InHexEntity";
  })(State || (State = {}));
  function isWhitespace(c) {
    return c === CharCodes2.Space || c === CharCodes2.NewLine || c === CharCodes2.Tab || c === CharCodes2.FormFeed || c === CharCodes2.CarriageReturn;
  }
  function isEndOfTagSection(c) {
    return c === CharCodes2.Slash || c === CharCodes2.Gt || isWhitespace(c);
  }
  function isNumber(c) {
    return c >= CharCodes2.Zero && c <= CharCodes2.Nine;
  }
  function isASCIIAlpha(c) {
    return c >= CharCodes2.LowerA && c <= CharCodes2.LowerZ || c >= CharCodes2.UpperA && c <= CharCodes2.UpperZ;
  }
  function isHexDigit(c) {
    return c >= CharCodes2.UpperA && c <= CharCodes2.UpperF || c >= CharCodes2.LowerA && c <= CharCodes2.LowerF;
  }
  var QuoteType;
  (function(QuoteType2) {
    QuoteType2[QuoteType2["NoValue"] = 0] = "NoValue";
    QuoteType2[QuoteType2["Unquoted"] = 1] = "Unquoted";
    QuoteType2[QuoteType2["Single"] = 2] = "Single";
    QuoteType2[QuoteType2["Double"] = 3] = "Double";
  })(QuoteType || (QuoteType = {}));
  var Sequences = {
    Cdata: new Uint8Array([67, 68, 65, 84, 65, 91]),
    CdataEnd: new Uint8Array([93, 93, 62]),
    CommentEnd: new Uint8Array([45, 45, 62]),
    ScriptEnd: new Uint8Array([60, 47, 115, 99, 114, 105, 112, 116]),
    StyleEnd: new Uint8Array([60, 47, 115, 116, 121, 108, 101]),
    TitleEnd: new Uint8Array([60, 47, 116, 105, 116, 108, 101])
  };
  var Tokenizer = class {
    constructor({ xmlMode = false, decodeEntities = true }, cbs) {
      this.cbs = cbs;
      this.state = State.Text;
      this.buffer = "";
      this.sectionStart = 0;
      this.index = 0;
      this.baseState = State.Text;
      this.isSpecial = false;
      this.running = true;
      this.offset = 0;
      this.sequenceIndex = 0;
      this.trieIndex = 0;
      this.trieCurrent = 0;
      this.entityResult = 0;
      this.entityExcess = 0;
      this.xmlMode = xmlMode;
      this.decodeEntities = decodeEntities;
      this.entityTrie = xmlMode ? decode_data_xml_default : decode_data_html_default;
    }
    reset() {
      this.state = State.Text;
      this.buffer = "";
      this.sectionStart = 0;
      this.index = 0;
      this.baseState = State.Text;
      this.currentSequence = void 0;
      this.running = true;
      this.offset = 0;
    }
    write(chunk) {
      this.offset += this.buffer.length;
      this.buffer = chunk;
      this.parse();
    }
    end() {
      if (this.running)
        this.finish();
    }
    pause() {
      this.running = false;
    }
    resume() {
      this.running = true;
      if (this.index < this.buffer.length + this.offset) {
        this.parse();
      }
    }
    getIndex() {
      return this.index;
    }
    getSectionStart() {
      return this.sectionStart;
    }
    stateText(c) {
      if (c === CharCodes2.Lt || !this.decodeEntities && this.fastForwardTo(CharCodes2.Lt)) {
        if (this.index > this.sectionStart) {
          this.cbs.ontext(this.sectionStart, this.index);
        }
        this.state = State.BeforeTagName;
        this.sectionStart = this.index;
      } else if (this.decodeEntities && c === CharCodes2.Amp) {
        this.state = State.BeforeEntity;
      }
    }
    stateSpecialStartSequence(c) {
      const isEnd = this.sequenceIndex === this.currentSequence.length;
      const isMatch = isEnd ? isEndOfTagSection(c) : (c | 32) === this.currentSequence[this.sequenceIndex];
      if (!isMatch) {
        this.isSpecial = false;
      } else if (!isEnd) {
        this.sequenceIndex++;
        return;
      }
      this.sequenceIndex = 0;
      this.state = State.InTagName;
      this.stateInTagName(c);
    }
    stateInSpecialTag(c) {
      if (this.sequenceIndex === this.currentSequence.length) {
        if (c === CharCodes2.Gt || isWhitespace(c)) {
          const endOfText = this.index - this.currentSequence.length;
          if (this.sectionStart < endOfText) {
            const actualIndex = this.index;
            this.index = endOfText;
            this.cbs.ontext(this.sectionStart, endOfText);
            this.index = actualIndex;
          }
          this.isSpecial = false;
          this.sectionStart = endOfText + 2;
          this.stateInClosingTagName(c);
          return;
        }
        this.sequenceIndex = 0;
      }
      if ((c | 32) === this.currentSequence[this.sequenceIndex]) {
        this.sequenceIndex += 1;
      } else if (this.sequenceIndex === 0) {
        if (this.currentSequence === Sequences.TitleEnd) {
          if (this.decodeEntities && c === CharCodes2.Amp) {
            this.state = State.BeforeEntity;
          }
        } else if (this.fastForwardTo(CharCodes2.Lt)) {
          this.sequenceIndex = 1;
        }
      } else {
        this.sequenceIndex = Number(c === CharCodes2.Lt);
      }
    }
    stateCDATASequence(c) {
      if (c === Sequences.Cdata[this.sequenceIndex]) {
        if (++this.sequenceIndex === Sequences.Cdata.length) {
          this.state = State.InCommentLike;
          this.currentSequence = Sequences.CdataEnd;
          this.sequenceIndex = 0;
          this.sectionStart = this.index + 1;
        }
      } else {
        this.sequenceIndex = 0;
        this.state = State.InDeclaration;
        this.stateInDeclaration(c);
      }
    }
    fastForwardTo(c) {
      while (++this.index < this.buffer.length + this.offset) {
        if (this.buffer.charCodeAt(this.index - this.offset) === c) {
          return true;
        }
      }
      this.index = this.buffer.length + this.offset - 1;
      return false;
    }
    stateInCommentLike(c) {
      if (c === this.currentSequence[this.sequenceIndex]) {
        if (++this.sequenceIndex === this.currentSequence.length) {
          if (this.currentSequence === Sequences.CdataEnd) {
            this.cbs.oncdata(this.sectionStart, this.index, 2);
          } else {
            this.cbs.oncomment(this.sectionStart, this.index, 2);
          }
          this.sequenceIndex = 0;
          this.sectionStart = this.index + 1;
          this.state = State.Text;
        }
      } else if (this.sequenceIndex === 0) {
        if (this.fastForwardTo(this.currentSequence[0])) {
          this.sequenceIndex = 1;
        }
      } else if (c !== this.currentSequence[this.sequenceIndex - 1]) {
        this.sequenceIndex = 0;
      }
    }
    isTagStartChar(c) {
      return this.xmlMode ? !isEndOfTagSection(c) : isASCIIAlpha(c);
    }
    startSpecial(sequence, offset) {
      this.isSpecial = true;
      this.currentSequence = sequence;
      this.sequenceIndex = offset;
      this.state = State.SpecialStartSequence;
    }
    stateBeforeTagName(c) {
      if (c === CharCodes2.ExclamationMark) {
        this.state = State.BeforeDeclaration;
        this.sectionStart = this.index + 1;
      } else if (c === CharCodes2.Questionmark) {
        this.state = State.InProcessingInstruction;
        this.sectionStart = this.index + 1;
      } else if (this.isTagStartChar(c)) {
        const lower = c | 32;
        this.sectionStart = this.index;
        if (!this.xmlMode && lower === Sequences.TitleEnd[2]) {
          this.startSpecial(Sequences.TitleEnd, 3);
        } else {
          this.state = !this.xmlMode && lower === Sequences.ScriptEnd[2] ? State.BeforeSpecialS : State.InTagName;
        }
      } else if (c === CharCodes2.Slash) {
        this.state = State.BeforeClosingTagName;
      } else {
        this.state = State.Text;
        this.stateText(c);
      }
    }
    stateInTagName(c) {
      if (isEndOfTagSection(c)) {
        this.cbs.onopentagname(this.sectionStart, this.index);
        this.sectionStart = -1;
        this.state = State.BeforeAttributeName;
        this.stateBeforeAttributeName(c);
      }
    }
    stateBeforeClosingTagName(c) {
      if (isWhitespace(c)) {
      } else if (c === CharCodes2.Gt) {
        this.state = State.Text;
      } else {
        this.state = this.isTagStartChar(c) ? State.InClosingTagName : State.InSpecialComment;
        this.sectionStart = this.index;
      }
    }
    stateInClosingTagName(c) {
      if (c === CharCodes2.Gt || isWhitespace(c)) {
        this.cbs.onclosetag(this.sectionStart, this.index);
        this.sectionStart = -1;
        this.state = State.AfterClosingTagName;
        this.stateAfterClosingTagName(c);
      }
    }
    stateAfterClosingTagName(c) {
      if (c === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
        this.state = State.Text;
        this.sectionStart = this.index + 1;
      }
    }
    stateBeforeAttributeName(c) {
      if (c === CharCodes2.Gt) {
        this.cbs.onopentagend(this.index);
        if (this.isSpecial) {
          this.state = State.InSpecialTag;
          this.sequenceIndex = 0;
        } else {
          this.state = State.Text;
        }
        this.baseState = this.state;
        this.sectionStart = this.index + 1;
      } else if (c === CharCodes2.Slash) {
        this.state = State.InSelfClosingTag;
      } else if (!isWhitespace(c)) {
        this.state = State.InAttributeName;
        this.sectionStart = this.index;
      }
    }
    stateInSelfClosingTag(c) {
      if (c === CharCodes2.Gt) {
        this.cbs.onselfclosingtag(this.index);
        this.state = State.Text;
        this.baseState = State.Text;
        this.sectionStart = this.index + 1;
        this.isSpecial = false;
      } else if (!isWhitespace(c)) {
        this.state = State.BeforeAttributeName;
        this.stateBeforeAttributeName(c);
      }
    }
    stateInAttributeName(c) {
      if (c === CharCodes2.Eq || isEndOfTagSection(c)) {
        this.cbs.onattribname(this.sectionStart, this.index);
        this.sectionStart = -1;
        this.state = State.AfterAttributeName;
        this.stateAfterAttributeName(c);
      }
    }
    stateAfterAttributeName(c) {
      if (c === CharCodes2.Eq) {
        this.state = State.BeforeAttributeValue;
      } else if (c === CharCodes2.Slash || c === CharCodes2.Gt) {
        this.cbs.onattribend(QuoteType.NoValue, this.index);
        this.state = State.BeforeAttributeName;
        this.stateBeforeAttributeName(c);
      } else if (!isWhitespace(c)) {
        this.cbs.onattribend(QuoteType.NoValue, this.index);
        this.state = State.InAttributeName;
        this.sectionStart = this.index;
      }
    }
    stateBeforeAttributeValue(c) {
      if (c === CharCodes2.DoubleQuote) {
        this.state = State.InAttributeValueDq;
        this.sectionStart = this.index + 1;
      } else if (c === CharCodes2.SingleQuote) {
        this.state = State.InAttributeValueSq;
        this.sectionStart = this.index + 1;
      } else if (!isWhitespace(c)) {
        this.sectionStart = this.index;
        this.state = State.InAttributeValueNq;
        this.stateInAttributeValueNoQuotes(c);
      }
    }
    handleInAttributeValue(c, quote) {
      if (c === quote || !this.decodeEntities && this.fastForwardTo(quote)) {
        this.cbs.onattribdata(this.sectionStart, this.index);
        this.sectionStart = -1;
        this.cbs.onattribend(quote === CharCodes2.DoubleQuote ? QuoteType.Double : QuoteType.Single, this.index);
        this.state = State.BeforeAttributeName;
      } else if (this.decodeEntities && c === CharCodes2.Amp) {
        this.baseState = this.state;
        this.state = State.BeforeEntity;
      }
    }
    stateInAttributeValueDoubleQuotes(c) {
      this.handleInAttributeValue(c, CharCodes2.DoubleQuote);
    }
    stateInAttributeValueSingleQuotes(c) {
      this.handleInAttributeValue(c, CharCodes2.SingleQuote);
    }
    stateInAttributeValueNoQuotes(c) {
      if (isWhitespace(c) || c === CharCodes2.Gt) {
        this.cbs.onattribdata(this.sectionStart, this.index);
        this.sectionStart = -1;
        this.cbs.onattribend(QuoteType.Unquoted, this.index);
        this.state = State.BeforeAttributeName;
        this.stateBeforeAttributeName(c);
      } else if (this.decodeEntities && c === CharCodes2.Amp) {
        this.baseState = this.state;
        this.state = State.BeforeEntity;
      }
    }
    stateBeforeDeclaration(c) {
      if (c === CharCodes2.OpeningSquareBracket) {
        this.state = State.CDATASequence;
        this.sequenceIndex = 0;
      } else {
        this.state = c === CharCodes2.Dash ? State.BeforeComment : State.InDeclaration;
      }
    }
    stateInDeclaration(c) {
      if (c === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
        this.cbs.ondeclaration(this.sectionStart, this.index);
        this.state = State.Text;
        this.sectionStart = this.index + 1;
      }
    }
    stateInProcessingInstruction(c) {
      if (c === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
        this.cbs.onprocessinginstruction(this.sectionStart, this.index);
        this.state = State.Text;
        this.sectionStart = this.index + 1;
      }
    }
    stateBeforeComment(c) {
      if (c === CharCodes2.Dash) {
        this.state = State.InCommentLike;
        this.currentSequence = Sequences.CommentEnd;
        this.sequenceIndex = 2;
        this.sectionStart = this.index + 1;
      } else {
        this.state = State.InDeclaration;
      }
    }
    stateInSpecialComment(c) {
      if (c === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
        this.cbs.oncomment(this.sectionStart, this.index, 0);
        this.state = State.Text;
        this.sectionStart = this.index + 1;
      }
    }
    stateBeforeSpecialS(c) {
      const lower = c | 32;
      if (lower === Sequences.ScriptEnd[3]) {
        this.startSpecial(Sequences.ScriptEnd, 4);
      } else if (lower === Sequences.StyleEnd[3]) {
        this.startSpecial(Sequences.StyleEnd, 4);
      } else {
        this.state = State.InTagName;
        this.stateInTagName(c);
      }
    }
    stateBeforeEntity(c) {
      this.entityExcess = 1;
      this.entityResult = 0;
      if (c === CharCodes2.Num) {
        this.state = State.BeforeNumericEntity;
      } else if (c === CharCodes2.Amp) {
      } else {
        this.trieIndex = 0;
        this.trieCurrent = this.entityTrie[0];
        this.state = State.InNamedEntity;
        this.stateInNamedEntity(c);
      }
    }
    stateInNamedEntity(c) {
      this.entityExcess += 1;
      this.trieIndex = determineBranch(this.entityTrie, this.trieCurrent, this.trieIndex + 1, c);
      if (this.trieIndex < 0) {
        this.emitNamedEntity();
        this.index--;
        return;
      }
      this.trieCurrent = this.entityTrie[this.trieIndex];
      const masked = this.trieCurrent & BinTrieFlags.VALUE_LENGTH;
      if (masked) {
        const valueLength = (masked >> 14) - 1;
        if (!this.allowLegacyEntity() && c !== CharCodes2.Semi) {
          this.trieIndex += valueLength;
        } else {
          const entityStart = this.index - this.entityExcess + 1;
          if (entityStart > this.sectionStart) {
            this.emitPartial(this.sectionStart, entityStart);
          }
          this.entityResult = this.trieIndex;
          this.trieIndex += valueLength;
          this.entityExcess = 0;
          this.sectionStart = this.index + 1;
          if (valueLength === 0) {
            this.emitNamedEntity();
          }
        }
      }
    }
    emitNamedEntity() {
      this.state = this.baseState;
      if (this.entityResult === 0) {
        return;
      }
      const valueLength = (this.entityTrie[this.entityResult] & BinTrieFlags.VALUE_LENGTH) >> 14;
      switch (valueLength) {
        case 1:
          this.emitCodePoint(this.entityTrie[this.entityResult] & ~BinTrieFlags.VALUE_LENGTH);
          break;
        case 2:
          this.emitCodePoint(this.entityTrie[this.entityResult + 1]);
          break;
        case 3: {
          this.emitCodePoint(this.entityTrie[this.entityResult + 1]);
          this.emitCodePoint(this.entityTrie[this.entityResult + 2]);
        }
      }
    }
    stateBeforeNumericEntity(c) {
      if ((c | 32) === CharCodes2.LowerX) {
        this.entityExcess++;
        this.state = State.InHexEntity;
      } else {
        this.state = State.InNumericEntity;
        this.stateInNumericEntity(c);
      }
    }
    emitNumericEntity(strict) {
      const entityStart = this.index - this.entityExcess - 1;
      const numberStart = entityStart + 2 + Number(this.state === State.InHexEntity);
      if (numberStart !== this.index) {
        if (entityStart > this.sectionStart) {
          this.emitPartial(this.sectionStart, entityStart);
        }
        this.sectionStart = this.index + Number(strict);
        this.emitCodePoint(replaceCodePoint(this.entityResult));
      }
      this.state = this.baseState;
    }
    stateInNumericEntity(c) {
      if (c === CharCodes2.Semi) {
        this.emitNumericEntity(true);
      } else if (isNumber(c)) {
        this.entityResult = this.entityResult * 10 + (c - CharCodes2.Zero);
        this.entityExcess++;
      } else {
        if (this.allowLegacyEntity()) {
          this.emitNumericEntity(false);
        } else {
          this.state = this.baseState;
        }
        this.index--;
      }
    }
    stateInHexEntity(c) {
      if (c === CharCodes2.Semi) {
        this.emitNumericEntity(true);
      } else if (isNumber(c)) {
        this.entityResult = this.entityResult * 16 + (c - CharCodes2.Zero);
        this.entityExcess++;
      } else if (isHexDigit(c)) {
        this.entityResult = this.entityResult * 16 + ((c | 32) - CharCodes2.LowerA + 10);
        this.entityExcess++;
      } else {
        if (this.allowLegacyEntity()) {
          this.emitNumericEntity(false);
        } else {
          this.state = this.baseState;
        }
        this.index--;
      }
    }
    allowLegacyEntity() {
      return !this.xmlMode && (this.baseState === State.Text || this.baseState === State.InSpecialTag);
    }
    cleanup() {
      if (this.running && this.sectionStart !== this.index) {
        if (this.state === State.Text || this.state === State.InSpecialTag && this.sequenceIndex === 0) {
          this.cbs.ontext(this.sectionStart, this.index);
          this.sectionStart = this.index;
        } else if (this.state === State.InAttributeValueDq || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueNq) {
          this.cbs.onattribdata(this.sectionStart, this.index);
          this.sectionStart = this.index;
        }
      }
    }
    shouldContinue() {
      return this.index < this.buffer.length + this.offset && this.running;
    }
    parse() {
      while (this.shouldContinue()) {
        const c = this.buffer.charCodeAt(this.index - this.offset);
        if (this.state === State.Text) {
          this.stateText(c);
        } else if (this.state === State.SpecialStartSequence) {
          this.stateSpecialStartSequence(c);
        } else if (this.state === State.InSpecialTag) {
          this.stateInSpecialTag(c);
        } else if (this.state === State.CDATASequence) {
          this.stateCDATASequence(c);
        } else if (this.state === State.InAttributeValueDq) {
          this.stateInAttributeValueDoubleQuotes(c);
        } else if (this.state === State.InAttributeName) {
          this.stateInAttributeName(c);
        } else if (this.state === State.InCommentLike) {
          this.stateInCommentLike(c);
        } else if (this.state === State.InSpecialComment) {
          this.stateInSpecialComment(c);
        } else if (this.state === State.BeforeAttributeName) {
          this.stateBeforeAttributeName(c);
        } else if (this.state === State.InTagName) {
          this.stateInTagName(c);
        } else if (this.state === State.InClosingTagName) {
          this.stateInClosingTagName(c);
        } else if (this.state === State.BeforeTagName) {
          this.stateBeforeTagName(c);
        } else if (this.state === State.AfterAttributeName) {
          this.stateAfterAttributeName(c);
        } else if (this.state === State.InAttributeValueSq) {
          this.stateInAttributeValueSingleQuotes(c);
        } else if (this.state === State.BeforeAttributeValue) {
          this.stateBeforeAttributeValue(c);
        } else if (this.state === State.BeforeClosingTagName) {
          this.stateBeforeClosingTagName(c);
        } else if (this.state === State.AfterClosingTagName) {
          this.stateAfterClosingTagName(c);
        } else if (this.state === State.BeforeSpecialS) {
          this.stateBeforeSpecialS(c);
        } else if (this.state === State.InAttributeValueNq) {
          this.stateInAttributeValueNoQuotes(c);
        } else if (this.state === State.InSelfClosingTag) {
          this.stateInSelfClosingTag(c);
        } else if (this.state === State.InDeclaration) {
          this.stateInDeclaration(c);
        } else if (this.state === State.BeforeDeclaration) {
          this.stateBeforeDeclaration(c);
        } else if (this.state === State.BeforeComment) {
          this.stateBeforeComment(c);
        } else if (this.state === State.InProcessingInstruction) {
          this.stateInProcessingInstruction(c);
        } else if (this.state === State.InNamedEntity) {
          this.stateInNamedEntity(c);
        } else if (this.state === State.BeforeEntity) {
          this.stateBeforeEntity(c);
        } else if (this.state === State.InHexEntity) {
          this.stateInHexEntity(c);
        } else if (this.state === State.InNumericEntity) {
          this.stateInNumericEntity(c);
        } else {
          this.stateBeforeNumericEntity(c);
        }
        this.index++;
      }
      this.cleanup();
    }
    finish() {
      if (this.state === State.InNamedEntity) {
        this.emitNamedEntity();
      }
      if (this.sectionStart < this.index) {
        this.handleTrailingData();
      }
      this.cbs.onend();
    }
    handleTrailingData() {
      const endIndex = this.buffer.length + this.offset;
      if (this.state === State.InCommentLike) {
        if (this.currentSequence === Sequences.CdataEnd) {
          this.cbs.oncdata(this.sectionStart, endIndex, 0);
        } else {
          this.cbs.oncomment(this.sectionStart, endIndex, 0);
        }
      } else if (this.state === State.InNumericEntity && this.allowLegacyEntity()) {
        this.emitNumericEntity(false);
      } else if (this.state === State.InHexEntity && this.allowLegacyEntity()) {
        this.emitNumericEntity(false);
      } else if (this.state === State.InTagName || this.state === State.BeforeAttributeName || this.state === State.BeforeAttributeValue || this.state === State.AfterAttributeName || this.state === State.InAttributeName || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueDq || this.state === State.InAttributeValueNq || this.state === State.InClosingTagName) {
      } else {
        this.cbs.ontext(this.sectionStart, endIndex);
      }
    }
    emitPartial(start, endIndex) {
      if (this.baseState !== State.Text && this.baseState !== State.InSpecialTag) {
        this.cbs.onattribdata(start, endIndex);
      } else {
        this.cbs.ontext(start, endIndex);
      }
    }
    emitCodePoint(cp) {
      if (this.baseState !== State.Text && this.baseState !== State.InSpecialTag) {
        this.cbs.onattribentity(cp);
      } else {
        this.cbs.ontextentity(cp);
      }
    }
  };

  // node_modules/.pnpm/htmlparser2@8.0.1/node_modules/htmlparser2/lib/esm/Parser.js
  var formTags = /* @__PURE__ */ new Set([
    "input",
    "option",
    "optgroup",
    "select",
    "button",
    "datalist",
    "textarea"
  ]);
  var pTag = /* @__PURE__ */ new Set(["p"]);
  var tableSectionTags = /* @__PURE__ */ new Set(["thead", "tbody"]);
  var ddtTags = /* @__PURE__ */ new Set(["dd", "dt"]);
  var rtpTags = /* @__PURE__ */ new Set(["rt", "rp"]);
  var openImpliesClose = /* @__PURE__ */ new Map([
    ["tr", /* @__PURE__ */ new Set(["tr", "th", "td"])],
    ["th", /* @__PURE__ */ new Set(["th"])],
    ["td", /* @__PURE__ */ new Set(["thead", "th", "td"])],
    ["body", /* @__PURE__ */ new Set(["head", "link", "script"])],
    ["li", /* @__PURE__ */ new Set(["li"])],
    ["p", pTag],
    ["h1", pTag],
    ["h2", pTag],
    ["h3", pTag],
    ["h4", pTag],
    ["h5", pTag],
    ["h6", pTag],
    ["select", formTags],
    ["input", formTags],
    ["output", formTags],
    ["button", formTags],
    ["datalist", formTags],
    ["textarea", formTags],
    ["option", /* @__PURE__ */ new Set(["option"])],
    ["optgroup", /* @__PURE__ */ new Set(["optgroup", "option"])],
    ["dd", ddtTags],
    ["dt", ddtTags],
    ["address", pTag],
    ["article", pTag],
    ["aside", pTag],
    ["blockquote", pTag],
    ["details", pTag],
    ["div", pTag],
    ["dl", pTag],
    ["fieldset", pTag],
    ["figcaption", pTag],
    ["figure", pTag],
    ["footer", pTag],
    ["form", pTag],
    ["header", pTag],
    ["hr", pTag],
    ["main", pTag],
    ["nav", pTag],
    ["ol", pTag],
    ["pre", pTag],
    ["section", pTag],
    ["table", pTag],
    ["ul", pTag],
    ["rt", rtpTags],
    ["rp", rtpTags],
    ["tbody", tableSectionTags],
    ["tfoot", tableSectionTags]
  ]);
  var voidElements = /* @__PURE__ */ new Set([
    "area",
    "base",
    "basefont",
    "br",
    "col",
    "command",
    "embed",
    "frame",
    "hr",
    "img",
    "input",
    "isindex",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ]);
  var foreignContextElements = /* @__PURE__ */ new Set(["math", "svg"]);
  var htmlIntegrationElements = /* @__PURE__ */ new Set([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext",
    "annotation-xml",
    "foreignobject",
    "desc",
    "title"
  ]);
  var reNameEnd = /\s|\//;
  var Parser2 = class {
    constructor(cbs, options = {}) {
      var _a2, _b, _c, _d, _e;
      this.options = options;
      this.startIndex = 0;
      this.endIndex = 0;
      this.openTagStart = 0;
      this.tagname = "";
      this.attribname = "";
      this.attribvalue = "";
      this.attribs = null;
      this.stack = [];
      this.foreignContext = [];
      this.buffers = [];
      this.bufferOffset = 0;
      this.writeIndex = 0;
      this.ended = false;
      this.cbs = cbs !== null && cbs !== void 0 ? cbs : {};
      this.lowerCaseTagNames = (_a2 = options.lowerCaseTags) !== null && _a2 !== void 0 ? _a2 : !options.xmlMode;
      this.lowerCaseAttributeNames = (_b = options.lowerCaseAttributeNames) !== null && _b !== void 0 ? _b : !options.xmlMode;
      this.tokenizer = new ((_c = options.Tokenizer) !== null && _c !== void 0 ? _c : Tokenizer)(this.options, this);
      (_e = (_d = this.cbs).onparserinit) === null || _e === void 0 ? void 0 : _e.call(_d, this);
    }
    ontext(start, endIndex) {
      var _a2, _b;
      const data = this.getSlice(start, endIndex);
      this.endIndex = endIndex - 1;
      (_b = (_a2 = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a2, data);
      this.startIndex = endIndex;
    }
    ontextentity(cp) {
      var _a2, _b;
      const idx = this.tokenizer.getSectionStart();
      this.endIndex = idx - 1;
      (_b = (_a2 = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a2, fromCodePoint(cp));
      this.startIndex = idx;
    }
    isVoidElement(name) {
      return !this.options.xmlMode && voidElements.has(name);
    }
    onopentagname(start, endIndex) {
      this.endIndex = endIndex;
      let name = this.getSlice(start, endIndex);
      if (this.lowerCaseTagNames) {
        name = name.toLowerCase();
      }
      this.emitOpenTag(name);
    }
    emitOpenTag(name) {
      var _a2, _b, _c, _d;
      this.openTagStart = this.startIndex;
      this.tagname = name;
      const impliesClose = !this.options.xmlMode && openImpliesClose.get(name);
      if (impliesClose) {
        while (this.stack.length > 0 && impliesClose.has(this.stack[this.stack.length - 1])) {
          const el = this.stack.pop();
          (_b = (_a2 = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a2, el, true);
        }
      }
      if (!this.isVoidElement(name)) {
        this.stack.push(name);
        if (foreignContextElements.has(name)) {
          this.foreignContext.push(true);
        } else if (htmlIntegrationElements.has(name)) {
          this.foreignContext.push(false);
        }
      }
      (_d = (_c = this.cbs).onopentagname) === null || _d === void 0 ? void 0 : _d.call(_c, name);
      if (this.cbs.onopentag)
        this.attribs = {};
    }
    endOpenTag(isImplied) {
      var _a2, _b;
      this.startIndex = this.openTagStart;
      if (this.attribs) {
        (_b = (_a2 = this.cbs).onopentag) === null || _b === void 0 ? void 0 : _b.call(_a2, this.tagname, this.attribs, isImplied);
        this.attribs = null;
      }
      if (this.cbs.onclosetag && this.isVoidElement(this.tagname)) {
        this.cbs.onclosetag(this.tagname, true);
      }
      this.tagname = "";
    }
    onopentagend(endIndex) {
      this.endIndex = endIndex;
      this.endOpenTag(false);
      this.startIndex = endIndex + 1;
    }
    onclosetag(start, endIndex) {
      var _a2, _b, _c, _d, _e, _f;
      this.endIndex = endIndex;
      let name = this.getSlice(start, endIndex);
      if (this.lowerCaseTagNames) {
        name = name.toLowerCase();
      }
      if (foreignContextElements.has(name) || htmlIntegrationElements.has(name)) {
        this.foreignContext.pop();
      }
      if (!this.isVoidElement(name)) {
        const pos = this.stack.lastIndexOf(name);
        if (pos !== -1) {
          if (this.cbs.onclosetag) {
            let count = this.stack.length - pos;
            while (count--) {
              this.cbs.onclosetag(this.stack.pop(), count !== 0);
            }
          } else
            this.stack.length = pos;
        } else if (!this.options.xmlMode && name === "p") {
          this.emitOpenTag("p");
          this.closeCurrentTag(true);
        }
      } else if (!this.options.xmlMode && name === "br") {
        (_b = (_a2 = this.cbs).onopentagname) === null || _b === void 0 ? void 0 : _b.call(_a2, "br");
        (_d = (_c = this.cbs).onopentag) === null || _d === void 0 ? void 0 : _d.call(_c, "br", {}, true);
        (_f = (_e = this.cbs).onclosetag) === null || _f === void 0 ? void 0 : _f.call(_e, "br", false);
      }
      this.startIndex = endIndex + 1;
    }
    onselfclosingtag(endIndex) {
      this.endIndex = endIndex;
      if (this.options.xmlMode || this.options.recognizeSelfClosing || this.foreignContext[this.foreignContext.length - 1]) {
        this.closeCurrentTag(false);
        this.startIndex = endIndex + 1;
      } else {
        this.onopentagend(endIndex);
      }
    }
    closeCurrentTag(isOpenImplied) {
      var _a2, _b;
      const name = this.tagname;
      this.endOpenTag(isOpenImplied);
      if (this.stack[this.stack.length - 1] === name) {
        (_b = (_a2 = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a2, name, !isOpenImplied);
        this.stack.pop();
      }
    }
    onattribname(start, endIndex) {
      this.startIndex = start;
      const name = this.getSlice(start, endIndex);
      this.attribname = this.lowerCaseAttributeNames ? name.toLowerCase() : name;
    }
    onattribdata(start, endIndex) {
      this.attribvalue += this.getSlice(start, endIndex);
    }
    onattribentity(cp) {
      this.attribvalue += fromCodePoint(cp);
    }
    onattribend(quote, endIndex) {
      var _a2, _b;
      this.endIndex = endIndex;
      (_b = (_a2 = this.cbs).onattribute) === null || _b === void 0 ? void 0 : _b.call(_a2, this.attribname, this.attribvalue, quote === QuoteType.Double ? '"' : quote === QuoteType.Single ? "'" : quote === QuoteType.NoValue ? void 0 : null);
      if (this.attribs && !Object.prototype.hasOwnProperty.call(this.attribs, this.attribname)) {
        this.attribs[this.attribname] = this.attribvalue;
      }
      this.attribvalue = "";
    }
    getInstructionName(value) {
      const idx = value.search(reNameEnd);
      let name = idx < 0 ? value : value.substr(0, idx);
      if (this.lowerCaseTagNames) {
        name = name.toLowerCase();
      }
      return name;
    }
    ondeclaration(start, endIndex) {
      this.endIndex = endIndex;
      const value = this.getSlice(start, endIndex);
      if (this.cbs.onprocessinginstruction) {
        const name = this.getInstructionName(value);
        this.cbs.onprocessinginstruction(`!${name}`, `!${value}`);
      }
      this.startIndex = endIndex + 1;
    }
    onprocessinginstruction(start, endIndex) {
      this.endIndex = endIndex;
      const value = this.getSlice(start, endIndex);
      if (this.cbs.onprocessinginstruction) {
        const name = this.getInstructionName(value);
        this.cbs.onprocessinginstruction(`?${name}`, `?${value}`);
      }
      this.startIndex = endIndex + 1;
    }
    oncomment(start, endIndex, offset) {
      var _a2, _b, _c, _d;
      this.endIndex = endIndex;
      (_b = (_a2 = this.cbs).oncomment) === null || _b === void 0 ? void 0 : _b.call(_a2, this.getSlice(start, endIndex - offset));
      (_d = (_c = this.cbs).oncommentend) === null || _d === void 0 ? void 0 : _d.call(_c);
      this.startIndex = endIndex + 1;
    }
    oncdata(start, endIndex, offset) {
      var _a2, _b, _c, _d, _e, _f, _g, _h, _j, _k;
      this.endIndex = endIndex;
      const value = this.getSlice(start, endIndex - offset);
      if (this.options.xmlMode || this.options.recognizeCDATA) {
        (_b = (_a2 = this.cbs).oncdatastart) === null || _b === void 0 ? void 0 : _b.call(_a2);
        (_d = (_c = this.cbs).ontext) === null || _d === void 0 ? void 0 : _d.call(_c, value);
        (_f = (_e = this.cbs).oncdataend) === null || _f === void 0 ? void 0 : _f.call(_e);
      } else {
        (_h = (_g = this.cbs).oncomment) === null || _h === void 0 ? void 0 : _h.call(_g, `[CDATA[${value}]]`);
        (_k = (_j = this.cbs).oncommentend) === null || _k === void 0 ? void 0 : _k.call(_j);
      }
      this.startIndex = endIndex + 1;
    }
    onend() {
      var _a2, _b;
      if (this.cbs.onclosetag) {
        this.endIndex = this.startIndex;
        for (let i = this.stack.length; i > 0; this.cbs.onclosetag(this.stack[--i], true))
          ;
      }
      (_b = (_a2 = this.cbs).onend) === null || _b === void 0 ? void 0 : _b.call(_a2);
    }
    reset() {
      var _a2, _b, _c, _d;
      (_b = (_a2 = this.cbs).onreset) === null || _b === void 0 ? void 0 : _b.call(_a2);
      this.tokenizer.reset();
      this.tagname = "";
      this.attribname = "";
      this.attribs = null;
      this.stack.length = 0;
      this.startIndex = 0;
      this.endIndex = 0;
      (_d = (_c = this.cbs).onparserinit) === null || _d === void 0 ? void 0 : _d.call(_c, this);
      this.buffers.length = 0;
      this.bufferOffset = 0;
      this.writeIndex = 0;
      this.ended = false;
    }
    parseComplete(data) {
      this.reset();
      this.end(data);
    }
    getSlice(start, end) {
      while (start - this.bufferOffset >= this.buffers[0].length) {
        this.shiftBuffer();
      }
      let str = this.buffers[0].slice(start - this.bufferOffset, end - this.bufferOffset);
      while (end - this.bufferOffset > this.buffers[0].length) {
        this.shiftBuffer();
        str += this.buffers[0].slice(0, end - this.bufferOffset);
      }
      return str;
    }
    shiftBuffer() {
      this.bufferOffset += this.buffers[0].length;
      this.writeIndex--;
      this.buffers.shift();
    }
    write(chunk) {
      var _a2, _b;
      if (this.ended) {
        (_b = (_a2 = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a2, new Error(".write() after done!"));
        return;
      }
      this.buffers.push(chunk);
      if (this.tokenizer.running) {
        this.tokenizer.write(chunk);
        this.writeIndex++;
      }
    }
    end(chunk) {
      var _a2, _b;
      if (this.ended) {
        (_b = (_a2 = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a2, Error(".end() after done!"));
        return;
      }
      if (chunk)
        this.write(chunk);
      this.ended = true;
      this.tokenizer.end();
    }
    pause() {
      this.tokenizer.pause();
    }
    resume() {
      this.tokenizer.resume();
      while (this.tokenizer.running && this.writeIndex < this.buffers.length) {
        this.tokenizer.write(this.buffers[this.writeIndex++]);
      }
      if (this.ended)
        this.tokenizer.end();
    }
    parseChunk(chunk) {
      this.write(chunk);
    }
    done(chunk) {
      this.end(chunk);
    }
  };

  // node_modules/.pnpm/domelementtype@2.3.0/node_modules/domelementtype/lib/esm/index.js
  var ElementType;
  (function(ElementType2) {
    ElementType2["Root"] = "root";
    ElementType2["Text"] = "text";
    ElementType2["Directive"] = "directive";
    ElementType2["Comment"] = "comment";
    ElementType2["Script"] = "script";
    ElementType2["Style"] = "style";
    ElementType2["Tag"] = "tag";
    ElementType2["CDATA"] = "cdata";
    ElementType2["Doctype"] = "doctype";
  })(ElementType || (ElementType = {}));
  function isTag(elem) {
    return elem.type === ElementType.Tag || elem.type === ElementType.Script || elem.type === ElementType.Style;
  }
  var Root = ElementType.Root;
  var Text = ElementType.Text;
  var Directive = ElementType.Directive;
  var Comment = ElementType.Comment;
  var Script = ElementType.Script;
  var Style = ElementType.Style;
  var Tag = ElementType.Tag;
  var CDATA = ElementType.CDATA;
  var Doctype = ElementType.Doctype;

  // node_modules/.pnpm/domhandler@5.0.3/node_modules/domhandler/lib/esm/node.js
  var Node = class {
    constructor() {
      this.parent = null;
      this.prev = null;
      this.next = null;
      this.startIndex = null;
      this.endIndex = null;
    }
    get parentNode() {
      return this.parent;
    }
    set parentNode(parent) {
      this.parent = parent;
    }
    get previousSibling() {
      return this.prev;
    }
    set previousSibling(prev) {
      this.prev = prev;
    }
    get nextSibling() {
      return this.next;
    }
    set nextSibling(next) {
      this.next = next;
    }
    cloneNode(recursive = false) {
      return cloneNode(this, recursive);
    }
  };
  var DataNode = class extends Node {
    constructor(data) {
      super();
      this.data = data;
    }
    get nodeValue() {
      return this.data;
    }
    set nodeValue(data) {
      this.data = data;
    }
  };
  var Text2 = class extends DataNode {
    constructor() {
      super(...arguments);
      this.type = ElementType.Text;
    }
    get nodeType() {
      return 3;
    }
  };
  var Comment2 = class extends DataNode {
    constructor() {
      super(...arguments);
      this.type = ElementType.Comment;
    }
    get nodeType() {
      return 8;
    }
  };
  var ProcessingInstruction = class extends DataNode {
    constructor(name, data) {
      super(data);
      this.name = name;
      this.type = ElementType.Directive;
    }
    get nodeType() {
      return 1;
    }
  };
  var NodeWithChildren = class extends Node {
    constructor(children) {
      super();
      this.children = children;
    }
    get firstChild() {
      var _a2;
      return (_a2 = this.children[0]) !== null && _a2 !== void 0 ? _a2 : null;
    }
    get lastChild() {
      return this.children.length > 0 ? this.children[this.children.length - 1] : null;
    }
    get childNodes() {
      return this.children;
    }
    set childNodes(children) {
      this.children = children;
    }
  };
  var CDATA2 = class extends NodeWithChildren {
    constructor() {
      super(...arguments);
      this.type = ElementType.CDATA;
    }
    get nodeType() {
      return 4;
    }
  };
  var Document = class extends NodeWithChildren {
    constructor() {
      super(...arguments);
      this.type = ElementType.Root;
    }
    get nodeType() {
      return 9;
    }
  };
  var Element = class extends NodeWithChildren {
    constructor(name, attribs, children = [], type = name === "script" ? ElementType.Script : name === "style" ? ElementType.Style : ElementType.Tag) {
      super(children);
      this.name = name;
      this.attribs = attribs;
      this.type = type;
    }
    get nodeType() {
      return 1;
    }
    get tagName() {
      return this.name;
    }
    set tagName(name) {
      this.name = name;
    }
    get attributes() {
      return Object.keys(this.attribs).map((name) => {
        var _a2, _b;
        return {
          name,
          value: this.attribs[name],
          namespace: (_a2 = this["x-attribsNamespace"]) === null || _a2 === void 0 ? void 0 : _a2[name],
          prefix: (_b = this["x-attribsPrefix"]) === null || _b === void 0 ? void 0 : _b[name]
        };
      });
    }
  };
  function isTag2(node) {
    return isTag(node);
  }
  function isCDATA(node) {
    return node.type === ElementType.CDATA;
  }
  function isText(node) {
    return node.type === ElementType.Text;
  }
  function isComment(node) {
    return node.type === ElementType.Comment;
  }
  function isDirective(node) {
    return node.type === ElementType.Directive;
  }
  function isDocument(node) {
    return node.type === ElementType.Root;
  }
  function cloneNode(node, recursive = false) {
    let result;
    if (isText(node)) {
      result = new Text2(node.data);
    } else if (isComment(node)) {
      result = new Comment2(node.data);
    } else if (isTag2(node)) {
      const children = recursive ? cloneChildren(node.children) : [];
      const clone = new Element(node.name, { ...node.attribs }, children);
      children.forEach((child) => child.parent = clone);
      if (node.namespace != null) {
        clone.namespace = node.namespace;
      }
      if (node["x-attribsNamespace"]) {
        clone["x-attribsNamespace"] = { ...node["x-attribsNamespace"] };
      }
      if (node["x-attribsPrefix"]) {
        clone["x-attribsPrefix"] = { ...node["x-attribsPrefix"] };
      }
      result = clone;
    } else if (isCDATA(node)) {
      const children = recursive ? cloneChildren(node.children) : [];
      const clone = new CDATA2(children);
      children.forEach((child) => child.parent = clone);
      result = clone;
    } else if (isDocument(node)) {
      const children = recursive ? cloneChildren(node.children) : [];
      const clone = new Document(children);
      children.forEach((child) => child.parent = clone);
      if (node["x-mode"]) {
        clone["x-mode"] = node["x-mode"];
      }
      result = clone;
    } else if (isDirective(node)) {
      const instruction = new ProcessingInstruction(node.name, node.data);
      if (node["x-name"] != null) {
        instruction["x-name"] = node["x-name"];
        instruction["x-publicId"] = node["x-publicId"];
        instruction["x-systemId"] = node["x-systemId"];
      }
      result = instruction;
    } else {
      throw new Error(`Not implemented yet: ${node.type}`);
    }
    result.startIndex = node.startIndex;
    result.endIndex = node.endIndex;
    if (node.sourceCodeLocation != null) {
      result.sourceCodeLocation = node.sourceCodeLocation;
    }
    return result;
  }
  function cloneChildren(childs) {
    const children = childs.map((child) => cloneNode(child, true));
    for (let i = 1; i < children.length; i++) {
      children[i].prev = children[i - 1];
      children[i - 1].next = children[i];
    }
    return children;
  }

  // node_modules/.pnpm/domhandler@5.0.3/node_modules/domhandler/lib/esm/index.js
  var defaultOpts = {
    withStartIndices: false,
    withEndIndices: false,
    xmlMode: false
  };
  var DomHandler = class {
    constructor(callback, options, elementCB) {
      this.dom = [];
      this.root = new Document(this.dom);
      this.done = false;
      this.tagStack = [this.root];
      this.lastNode = null;
      this.parser = null;
      if (typeof options === "function") {
        elementCB = options;
        options = defaultOpts;
      }
      if (typeof callback === "object") {
        options = callback;
        callback = void 0;
      }
      this.callback = callback !== null && callback !== void 0 ? callback : null;
      this.options = options !== null && options !== void 0 ? options : defaultOpts;
      this.elementCB = elementCB !== null && elementCB !== void 0 ? elementCB : null;
    }
    onparserinit(parser) {
      this.parser = parser;
    }
    onreset() {
      this.dom = [];
      this.root = new Document(this.dom);
      this.done = false;
      this.tagStack = [this.root];
      this.lastNode = null;
      this.parser = null;
    }
    onend() {
      if (this.done)
        return;
      this.done = true;
      this.parser = null;
      this.handleCallback(null);
    }
    onerror(error) {
      this.handleCallback(error);
    }
    onclosetag() {
      this.lastNode = null;
      const elem = this.tagStack.pop();
      if (this.options.withEndIndices) {
        elem.endIndex = this.parser.endIndex;
      }
      if (this.elementCB)
        this.elementCB(elem);
    }
    onopentag(name, attribs) {
      const type = this.options.xmlMode ? ElementType.Tag : void 0;
      const element = new Element(name, attribs, void 0, type);
      this.addNode(element);
      this.tagStack.push(element);
    }
    ontext(data) {
      const { lastNode } = this;
      if (lastNode && lastNode.type === ElementType.Text) {
        lastNode.data += data;
        if (this.options.withEndIndices) {
          lastNode.endIndex = this.parser.endIndex;
        }
      } else {
        const node = new Text2(data);
        this.addNode(node);
        this.lastNode = node;
      }
    }
    oncomment(data) {
      if (this.lastNode && this.lastNode.type === ElementType.Comment) {
        this.lastNode.data += data;
        return;
      }
      const node = new Comment2(data);
      this.addNode(node);
      this.lastNode = node;
    }
    oncommentend() {
      this.lastNode = null;
    }
    oncdatastart() {
      const text = new Text2("");
      const node = new CDATA2([text]);
      this.addNode(node);
      text.parent = node;
      this.lastNode = text;
    }
    oncdataend() {
      this.lastNode = null;
    }
    onprocessinginstruction(name, data) {
      const node = new ProcessingInstruction(name, data);
      this.addNode(node);
    }
    handleCallback(error) {
      if (typeof this.callback === "function") {
        this.callback(error, this.dom);
      } else if (error) {
        throw error;
      }
    }
    addNode(node) {
      const parent = this.tagStack[this.tagStack.length - 1];
      const previousSibling = parent.children[parent.children.length - 1];
      if (this.options.withStartIndices) {
        node.startIndex = this.parser.startIndex;
      }
      if (this.options.withEndIndices) {
        node.endIndex = this.parser.endIndex;
      }
      parent.children.push(node);
      if (previousSibling) {
        node.prev = previousSibling;
        previousSibling.next = node;
      }
      node.parent = parent;
      this.lastNode = null;
    }
  };

  // node_modules/.pnpm/entities@4.3.0/node_modules/entities/lib/esm/escape.js
  var xmlCodeMap = /* @__PURE__ */ new Map([
    [34, "&quot;"],
    [38, "&amp;"],
    [39, "&apos;"],
    [60, "&lt;"],
    [62, "&gt;"]
  ]);
  var getCodePoint = String.prototype.codePointAt != null ? (str, index) => str.codePointAt(index) : (c, index) => (c.charCodeAt(index) & 64512) === 55296 ? (c.charCodeAt(index) - 55296) * 1024 + c.charCodeAt(index + 1) - 56320 + 65536 : c.charCodeAt(index);
  function getEscaper(regex, map) {
    return function escape2(data) {
      let match;
      let lastIdx = 0;
      let result = "";
      while (match = regex.exec(data)) {
        if (lastIdx !== match.index) {
          result += data.substring(lastIdx, match.index);
        }
        result += map.get(match[0].charCodeAt(0));
        lastIdx = match.index + 1;
      }
      return result + data.substring(lastIdx);
    };
  }
  var escapeUTF8 = getEscaper(/[&<>'"]/g, xmlCodeMap);
  var escapeAttribute = getEscaper(/["&\u00A0]/g, /* @__PURE__ */ new Map([
    [34, "&quot;"],
    [38, "&amp;"],
    [160, "&nbsp;"]
  ]));
  var escapeText = getEscaper(/[&<>\u00A0]/g, /* @__PURE__ */ new Map([
    [38, "&amp;"],
    [60, "&lt;"],
    [62, "&gt;"],
    [160, "&nbsp;"]
  ]));

  // node_modules/.pnpm/entities@4.3.0/node_modules/entities/lib/esm/index.js
  var EntityLevel;
  (function(EntityLevel2) {
    EntityLevel2[EntityLevel2["XML"] = 0] = "XML";
    EntityLevel2[EntityLevel2["HTML"] = 1] = "HTML";
  })(EntityLevel || (EntityLevel = {}));
  var DecodingMode;
  (function(DecodingMode2) {
    DecodingMode2[DecodingMode2["Legacy"] = 0] = "Legacy";
    DecodingMode2[DecodingMode2["Strict"] = 1] = "Strict";
  })(DecodingMode || (DecodingMode = {}));
  var EncodingMode;
  (function(EncodingMode2) {
    EncodingMode2[EncodingMode2["UTF8"] = 0] = "UTF8";
    EncodingMode2[EncodingMode2["ASCII"] = 1] = "ASCII";
    EncodingMode2[EncodingMode2["Extensive"] = 2] = "Extensive";
    EncodingMode2[EncodingMode2["Attribute"] = 3] = "Attribute";
    EncodingMode2[EncodingMode2["Text"] = 4] = "Text";
  })(EncodingMode || (EncodingMode = {}));

  // node_modules/.pnpm/dom-serializer@2.0.0/node_modules/dom-serializer/lib/esm/foreignNames.js
  var elementNames = new Map([
    "altGlyph",
    "altGlyphDef",
    "altGlyphItem",
    "animateColor",
    "animateMotion",
    "animateTransform",
    "clipPath",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feDropShadow",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
    "foreignObject",
    "glyphRef",
    "linearGradient",
    "radialGradient",
    "textPath"
  ].map((val) => [val.toLowerCase(), val]));
  var attributeNames = new Map([
    "definitionURL",
    "attributeName",
    "attributeType",
    "baseFrequency",
    "baseProfile",
    "calcMode",
    "clipPathUnits",
    "diffuseConstant",
    "edgeMode",
    "filterUnits",
    "glyphRef",
    "gradientTransform",
    "gradientUnits",
    "kernelMatrix",
    "kernelUnitLength",
    "keyPoints",
    "keySplines",
    "keyTimes",
    "lengthAdjust",
    "limitingConeAngle",
    "markerHeight",
    "markerUnits",
    "markerWidth",
    "maskContentUnits",
    "maskUnits",
    "numOctaves",
    "pathLength",
    "patternContentUnits",
    "patternTransform",
    "patternUnits",
    "pointsAtX",
    "pointsAtY",
    "pointsAtZ",
    "preserveAlpha",
    "preserveAspectRatio",
    "primitiveUnits",
    "refX",
    "refY",
    "repeatCount",
    "repeatDur",
    "requiredExtensions",
    "requiredFeatures",
    "specularConstant",
    "specularExponent",
    "spreadMethod",
    "startOffset",
    "stdDeviation",
    "stitchTiles",
    "surfaceScale",
    "systemLanguage",
    "tableValues",
    "targetX",
    "targetY",
    "textLength",
    "viewBox",
    "viewTarget",
    "xChannelSelector",
    "yChannelSelector",
    "zoomAndPan"
  ].map((val) => [val.toLowerCase(), val]));

  // node_modules/.pnpm/domutils@3.0.1/node_modules/domutils/lib/esm/helpers.js
  var DocumentPosition;
  (function(DocumentPosition2) {
    DocumentPosition2[DocumentPosition2["DISCONNECTED"] = 1] = "DISCONNECTED";
    DocumentPosition2[DocumentPosition2["PRECEDING"] = 2] = "PRECEDING";
    DocumentPosition2[DocumentPosition2["FOLLOWING"] = 4] = "FOLLOWING";
    DocumentPosition2[DocumentPosition2["CONTAINS"] = 8] = "CONTAINS";
    DocumentPosition2[DocumentPosition2["CONTAINED_BY"] = 16] = "CONTAINED_BY";
  })(DocumentPosition || (DocumentPosition = {}));

  // node_modules/.pnpm/htmlparser2@8.0.1/node_modules/htmlparser2/lib/esm/index.js
  function parseDocument(data, options) {
    const handler = new DomHandler(void 0, options);
    new Parser2(handler, options).end(data);
    return handler.root;
  }

  // node_modules/.pnpm/safari-14-idb-fix@3.0.0/node_modules/safari-14-idb-fix/dist/index.js
  function idbReady() {
    var isSafari = !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent);
    if (!isSafari || !indexedDB.databases)
      return Promise.resolve();
    var intervalId;
    return new Promise(function(resolve2) {
      var tryIdb = function() {
        return indexedDB.databases().finally(resolve2);
      };
      intervalId = setInterval(tryIdb, 100);
      tryIdb();
    }).finally(function() {
      return clearInterval(intervalId);
    });
  }
  var dist_default = idbReady;

  // node_modules/.pnpm/idb-keyval@6.1.0/node_modules/idb-keyval/dist/index.js
  function promisifyRequest(request) {
    return new Promise((resolve2, reject) => {
      request.oncomplete = request.onsuccess = () => resolve2(request.result);
      request.onabort = request.onerror = () => reject(request.error);
    });
  }
  function createStore(dbName, storeName) {
    const dbp = dist_default().then(() => {
      const request = indexedDB.open(dbName);
      request.onupgradeneeded = () => request.result.createObjectStore(storeName);
      return promisifyRequest(request);
    });
    return (txMode, callback) => dbp.then((db) => callback(db.transaction(storeName, txMode).objectStore(storeName)));
  }
  var defaultGetStoreFunc;
  function defaultGetStore() {
    if (!defaultGetStoreFunc) {
      defaultGetStoreFunc = createStore("keyval-store", "keyval");
    }
    return defaultGetStoreFunc;
  }
  function get(key, customStore = defaultGetStore()) {
    return customStore("readonly", (store) => promisifyRequest(store.get(key)));
  }
  function set(key, value, customStore = defaultGetStore()) {
    return customStore("readwrite", (store) => {
      store.put(value, key);
      return promisifyRequest(store.transaction);
    });
  }
  function del(key, customStore = defaultGetStore()) {
    return customStore("readwrite", (store) => {
      store.delete(key);
      return promisifyRequest(store.transaction);
    });
  }
  function delMany(keys2, customStore = defaultGetStore()) {
    return customStore("readwrite", (store) => {
      keys2.forEach((key) => store.delete(key));
      return promisifyRequest(store.transaction);
    });
  }
  function eachCursor(store, callback) {
    store.openCursor().onsuccess = function() {
      if (!this.result)
        return;
      callback(this.result);
      this.result.continue();
    };
    return promisifyRequest(store.transaction);
  }
  function keys(customStore = defaultGetStore()) {
    return customStore("readonly", (store) => {
      if (store.getAllKeys) {
        return promisifyRequest(store.getAllKeys());
      }
      const items = [];
      return eachCursor(store, (cursor) => items.push(cursor.key)).then(() => items);
    });
  }

  // packages/grammarly-languageserver/dist/index.browser.mjs
  var GRAMMARLY_SDK = Symbol("GrammarlySDK");
  var TEXT_DOCUMENTS_FACTORY = Symbol("TextDocuments");
  var CLIENT = Symbol("ClientCapabilities");
  var CLIENT_INFO = Symbol("ClientInfo");
  var CLIENT_INITIALIZATION_OPTIONS = Symbol("ClientInitializationOptions");
  var SERVER = Symbol("ServerCapabilities");
  var CONNECTION = Symbol("Connection");
  function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  }
  function __param(paramIndex, decorator) {
    return function(target, key) {
      decorator(target, key, paramIndex);
    };
  }
  function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(metadataKey, metadataValue);
  }
  function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  }
  function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m")
      throw new TypeError("Private method is not writable");
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  }
  var _ConfigurationService_connection;
  var ConfigurationService = class ConfigurationService2 {
    constructor(connection) {
      _ConfigurationService_connection.set(this, void 0);
      __classPrivateFieldSet(this, _ConfigurationService_connection, connection, "f");
    }
    register() {
      return { dispose() {
      } };
    }
    async getSettings() {
      var _a2;
      const result = await __classPrivateFieldGet(this, _ConfigurationService_connection, "f").workspace.getConfiguration("grammarly");
      return (_a2 = result === null || result === void 0 ? void 0 : result.config) !== null && _a2 !== void 0 ? _a2 : {};
    }
    async getDocumentSettings(uri) {
      var _a2;
      const result = await Promise.race([
        __classPrivateFieldGet(this, _ConfigurationService_connection, "f").workspace.getConfiguration({ scopeUri: uri, section: "grammarly" }),
        new Promise((resolve2) => setTimeout(resolve2, 1e3, {}))
      ]);
      return (_a2 = result === null || result === void 0 ? void 0 : result.config) !== null && _a2 !== void 0 ? _a2 : {};
    }
  };
  _ConfigurationService_connection = /* @__PURE__ */ new WeakMap();
  ConfigurationService = __decorate([
    injectable(),
    __param(0, inject(CONNECTION)),
    __metadata("design:paramtypes", [Object])
  ], ConfigurationService);
  var _DocumentService_config;
  var _DocumentService_connection;
  var _DocumentService_capabilities;
  var _DocumentService_documents;
  var _DocumentService_onDocumentOpenCbs;
  var _DocumentService_onDocumentCloseCbs;
  var _GrammarlyDocument_instances;
  var _GrammarlyDocument_context;
  var _GrammarlyDocument_createTree;
  var _GrammarlyDocument_sync;
  var DocumentService = class DocumentService2 {
    constructor(connection, capabilities, sdk, createTextDocuments2, options, config) {
      _DocumentService_config.set(this, void 0);
      _DocumentService_connection.set(this, void 0);
      _DocumentService_capabilities.set(this, void 0);
      _DocumentService_documents.set(this, void 0);
      _DocumentService_onDocumentOpenCbs.set(this, []);
      _DocumentService_onDocumentCloseCbs.set(this, []);
      __classPrivateFieldSet(this, _DocumentService_connection, connection, "f");
      __classPrivateFieldSet(this, _DocumentService_capabilities, capabilities, "f");
      __classPrivateFieldSet(this, _DocumentService_config, config, "f");
      __classPrivateFieldSet(this, _DocumentService_documents, createTextDocuments2({
        create(uri, languageId, version, content) {
          const document = new GrammarlyDocument(TextDocument.create(uri, languageId, version, content), async () => {
            const options2 = await config.getDocumentSettings(uri);
            connection.console.log(`create text checking session for "${uri}" with ${JSON.stringify(options2, null, 2)} `);
            return sdk.withText({ ops: [] }, options2);
          });
          if (options.startTextCheckInPausedState === true)
            document.pause();
          return document;
        },
        update(document, changes, version) {
          document.update(changes, version);
          return document;
        }
      }), "f");
    }
    register() {
      __classPrivateFieldGet(this, _DocumentService_capabilities, "f").textDocumentSync = {
        openClose: true,
        change: 2
      };
      __classPrivateFieldGet(this, _DocumentService_documents, "f").listen(__classPrivateFieldGet(this, _DocumentService_connection, "f"));
      __classPrivateFieldGet(this, _DocumentService_connection, "f").onRequest("$/getDocumentStatus", async ([uri]) => {
        const document = __classPrivateFieldGet(this, _DocumentService_documents, "f").get(uri);
        if (document == null)
          return null;
        if (document.isPaused)
          return "paused";
        await document.isReady();
        return document.session.status;
      });
      __classPrivateFieldGet(this, _DocumentService_connection, "f").onRequest("$/dismissSuggestion", async ([options]) => {
        const document = __classPrivateFieldGet(this, _DocumentService_documents, "f").get(options.uri);
        if (document == null)
          return;
        await document.session.dismissSuggestion({ suggestionId: options.suggestionId });
      });
      __classPrivateFieldGet(this, _DocumentService_connection, "f").onDidChangeConfiguration(async () => {
        await Promise.all(__classPrivateFieldGet(this, _DocumentService_documents, "f").all().map(async (document) => {
          await document.isReady();
          document.session.setConfig(await __classPrivateFieldGet(this, _DocumentService_config, "f").getDocumentSettings(document.original.uri));
        }));
      });
      const disposables = [
        __classPrivateFieldGet(this, _DocumentService_documents, "f").onDidOpen(async ({ document }) => {
          __classPrivateFieldGet(this, _DocumentService_connection, "f").console.log("open " + document.original.uri);
          await document.isReady();
          __classPrivateFieldGet(this, _DocumentService_connection, "f").console.log("ready " + document.original.uri);
          __classPrivateFieldGet(this, _DocumentService_connection, "f").sendNotification("$/grammarlyCheckingStatus", {
            uri: document.original.uri,
            status: document.session.status
          });
          __classPrivateFieldGet(this, _DocumentService_onDocumentOpenCbs, "f").forEach((cb) => cb(document));
        }),
        __classPrivateFieldGet(this, _DocumentService_documents, "f").onDidClose(({ document }) => {
          __classPrivateFieldGet(this, _DocumentService_connection, "f").console.log("close " + document.original.uri);
          __classPrivateFieldGet(this, _DocumentService_onDocumentCloseCbs, "f").forEach((cb) => cb(document));
          document.session.disconnect();
        }),
        {
          dispose: () => {
            __classPrivateFieldGet(this, _DocumentService_documents, "f").all().forEach((document) => document.session.disconnect());
            __classPrivateFieldGet(this, _DocumentService_onDocumentOpenCbs, "f").length = 0;
            __classPrivateFieldGet(this, _DocumentService_onDocumentCloseCbs, "f").length = 0;
          }
        }
      ];
      return {
        dispose() {
          disposables.forEach((disposable) => disposable.dispose());
        }
      };
    }
    get(uri) {
      return __classPrivateFieldGet(this, _DocumentService_documents, "f").get(uri);
    }
    onDidOpen(fn) {
      __classPrivateFieldGet(this, _DocumentService_onDocumentOpenCbs, "f").push(fn);
    }
    onDidClose(fn) {
      __classPrivateFieldGet(this, _DocumentService_onDocumentCloseCbs, "f").push(fn);
    }
  };
  _DocumentService_config = /* @__PURE__ */ new WeakMap(), _DocumentService_connection = /* @__PURE__ */ new WeakMap(), _DocumentService_capabilities = /* @__PURE__ */ new WeakMap(), _DocumentService_documents = /* @__PURE__ */ new WeakMap(), _DocumentService_onDocumentOpenCbs = /* @__PURE__ */ new WeakMap(), _DocumentService_onDocumentCloseCbs = /* @__PURE__ */ new WeakMap();
  DocumentService = __decorate([
    injectable(),
    __param(0, inject(CONNECTION)),
    __param(1, inject(SERVER)),
    __param(2, inject(GRAMMARLY_SDK)),
    __param(3, inject(TEXT_DOCUMENTS_FACTORY)),
    __param(4, inject(CLIENT_INITIALIZATION_OPTIONS)),
    __metadata("design:paramtypes", [Object, Object, Function, Function, Object, ConfigurationService])
  ], DocumentService);
  var GrammarlyDocument = class {
    constructor(original, createSession) {
      _GrammarlyDocument_instances.add(this);
      _GrammarlyDocument_context.set(this, null);
      this._isReady = null;
      this._isPaused = false;
      this.original = original;
      this.createSession = createSession;
    }
    get isPaused() {
      return this._isPaused;
    }
    pause() {
      this._isPaused = true;
    }
    resume() {
      this._isPaused = false;
      __classPrivateFieldGet(this, _GrammarlyDocument_instances, "m", _GrammarlyDocument_sync).call(this);
    }
    async isReady() {
      if (this._isReady != null)
        await this._isReady;
      if (this.session != null)
        return;
      this._isReady = (async () => {
        this.session = await this.createSession();
        await __classPrivateFieldGet(this, _GrammarlyDocument_instances, "m", _GrammarlyDocument_createTree).call(this);
        __classPrivateFieldGet(this, _GrammarlyDocument_instances, "m", _GrammarlyDocument_sync).call(this);
        this._isReady = null;
      })();
      await this._isReady;
    }
    findOriginalOffset(offset) {
      if (__classPrivateFieldGet(this, _GrammarlyDocument_context, "f") == null)
        return offset;
      const map = __classPrivateFieldGet(this, _GrammarlyDocument_context, "f").sourcemap;
      const index = binarySearchLowerBound(0, map.length - 1, (index2) => map[index2][1] < offset);
      const node = map[index];
      if (node == null)
        return 0;
      return node[0] + Math.max(0, offset - node[1]);
    }
    findOriginalRange(start, end) {
      return {
        start: this.original.positionAt(this.findOriginalOffset(start)),
        end: this.original.positionAt(this.findOriginalOffset(end))
      };
    }
    toText(text) {
      var _a2, _b;
      return (_b = (_a2 = __classPrivateFieldGet(this, _GrammarlyDocument_context, "f")) === null || _a2 === void 0 ? void 0 : _a2.transformer.decode(text)) !== null && _b !== void 0 ? _b : text.ops.map((op) => op.insert).join("");
    }
    update(changes, version) {
      const context = __classPrivateFieldGet(this, _GrammarlyDocument_context, "f");
      if (context == null) {
        TextDocument.update(this.original, changes, version);
      } else if (changes.every((change) => "range" in change)) {
        const _changes = changes;
        const offsets = _changes.map((change) => ({
          start: this.original.offsetAt(change.range.start),
          end: this.original.offsetAt(change.range.end)
        }));
        TextDocument.update(this.original, changes, version);
        _changes.forEach((change, index) => {
          const newEndIndex = offsets[index].start + change.text.length;
          const newEndPosition = this.original.positionAt(newEndIndex);
          context.tree.edit({
            startIndex: offsets[index].start,
            oldEndIndex: offsets[index].end,
            newEndIndex: offsets[index].start + change.text.length,
            startPosition: { row: change.range.start.line, column: change.range.start.character },
            oldEndPosition: { row: change.range.end.line, column: change.range.end.character },
            newEndPosition: { row: newEndPosition.line, column: newEndPosition.character }
          });
        });
        context.tree = context.parser.parse(this.original.getText(), context.tree);
      } else {
        TextDocument.update(this.original, changes, version);
        context.tree = context.parser.parse(this.original.getText());
      }
      __classPrivateFieldGet(this, _GrammarlyDocument_instances, "m", _GrammarlyDocument_sync).call(this);
    }
  };
  _GrammarlyDocument_context = /* @__PURE__ */ new WeakMap(), _GrammarlyDocument_instances = /* @__PURE__ */ new WeakSet(), _GrammarlyDocument_createTree = async function _GrammarlyDocument_createTree2() {
    const language = this.original.languageId;
    switch (language) {
      case "html":
      case "markdown":
        const parser = await createParser(language);
        const transformer = transformers[language];
        const tree = parser.parse(this.original.getText());
        __classPrivateFieldSet(this, _GrammarlyDocument_context, { parser, tree, transformer, sourcemap: [] }, "f");
        break;
    }
  }, _GrammarlyDocument_sync = function _GrammarlyDocument_sync2() {
    if (this._isPaused)
      return;
    if (__classPrivateFieldGet(this, _GrammarlyDocument_context, "f") != null) {
      const [text, map] = __classPrivateFieldGet(this, _GrammarlyDocument_context, "f").transformer.encode(__classPrivateFieldGet(this, _GrammarlyDocument_context, "f").tree);
      this.session.setText(text);
      __classPrivateFieldGet(this, _GrammarlyDocument_context, "f").sourcemap = map;
    } else {
      this.session.setText({ ops: [{ insert: this.original.getText() }] });
    }
  };
  function binarySearchLowerBound(lo, hi, isValid) {
    while (lo < hi) {
      const mid = Math.ceil((hi + lo) / 2);
      if (isValid(mid)) {
        lo = mid;
      } else {
        hi = mid - 1;
      }
    }
    return hi;
  }
  var _DiagnosticsService_instances;
  var _DiagnosticsService_connection;
  var _DiagnosticsService_documents;
  var _DiagnosticsService_diagnostics;
  var _DiagnosticsService_setupDiagnostics;
  var _DiagnosticsService_sendDiagnostics;
  var _DiagnosticsService_clearDiagnostics;
  var _DiagnosticsService_toDiagnostic;
  var DiagnosticsService = class DiagnosticsService2 {
    constructor(connection, documents) {
      _DiagnosticsService_instances.add(this);
      _DiagnosticsService_connection.set(this, void 0);
      _DiagnosticsService_documents.set(this, void 0);
      _DiagnosticsService_diagnostics.set(this, void 0);
      __classPrivateFieldSet(this, _DiagnosticsService_connection, connection, "f");
      __classPrivateFieldSet(this, _DiagnosticsService_documents, documents, "f");
      __classPrivateFieldSet(this, _DiagnosticsService_diagnostics, /* @__PURE__ */ new Map(), "f");
    }
    register() {
      __classPrivateFieldGet(this, _DiagnosticsService_documents, "f").onDidOpen((document) => __classPrivateFieldGet(this, _DiagnosticsService_instances, "m", _DiagnosticsService_setupDiagnostics).call(this, document));
      __classPrivateFieldGet(this, _DiagnosticsService_documents, "f").onDidClose((document) => __classPrivateFieldGet(this, _DiagnosticsService_instances, "m", _DiagnosticsService_clearDiagnostics).call(this, document));
      __classPrivateFieldGet(this, _DiagnosticsService_connection, "f").onRequest("$/pause", ([uri]) => {
        const document = __classPrivateFieldGet(this, _DiagnosticsService_documents, "f").get(uri);
        if (document == null)
          return;
        document.pause();
        __classPrivateFieldGet(this, _DiagnosticsService_instances, "m", _DiagnosticsService_sendDiagnostics).call(this, document);
      });
      __classPrivateFieldGet(this, _DiagnosticsService_connection, "f").onRequest("$/resume", ([uri]) => {
        const document = __classPrivateFieldGet(this, _DiagnosticsService_documents, "f").get(uri);
        if (document == null)
          return;
        document.resume();
        __classPrivateFieldGet(this, _DiagnosticsService_instances, "m", _DiagnosticsService_sendDiagnostics).call(this, document);
      });
      return { dispose() {
      } };
    }
    findSuggestionDiagnostics(document, range) {
      var _a2;
      const diagnostics = [];
      const s = document.original.offsetAt(range.start);
      const e = document.original.offsetAt(range.end);
      (_a2 = __classPrivateFieldGet(this, _DiagnosticsService_diagnostics, "f").get(document.original.uri)) === null || _a2 === void 0 ? void 0 : _a2.forEach((item) => {
        const start = document.original.offsetAt(item.diagnostic.range.start);
        const end = document.original.offsetAt(item.diagnostic.range.end);
        if (start <= e && s <= end)
          diagnostics.push(item);
      });
      return diagnostics;
    }
    getSuggestionDiagnostic(document, code) {
      var _a2;
      return (_a2 = __classPrivateFieldGet(this, _DiagnosticsService_diagnostics, "f").get(document.original.uri)) === null || _a2 === void 0 ? void 0 : _a2.get(code);
    }
  };
  _DiagnosticsService_connection = /* @__PURE__ */ new WeakMap(), _DiagnosticsService_documents = /* @__PURE__ */ new WeakMap(), _DiagnosticsService_diagnostics = /* @__PURE__ */ new WeakMap(), _DiagnosticsService_instances = /* @__PURE__ */ new WeakSet(), _DiagnosticsService_setupDiagnostics = function _DiagnosticsService_setupDiagnostics2(document) {
    __classPrivateFieldGet(this, _DiagnosticsService_connection, "f").console.log(`${document.session.status} ${document.original.uri}`);
    const diagnostics = /* @__PURE__ */ new Map();
    const sendDiagnostics = () => __classPrivateFieldGet(this, _DiagnosticsService_instances, "m", _DiagnosticsService_sendDiagnostics).call(this, document);
    __classPrivateFieldGet(this, _DiagnosticsService_diagnostics, "f").set(document.original.uri, diagnostics);
    document.session.addEventListener("suggestions", (event) => {
      event.detail.added.forEach((suggestion) => {
        diagnostics.set(suggestion.id, { suggestion, diagnostic: __classPrivateFieldGet(this, _DiagnosticsService_instances, "m", _DiagnosticsService_toDiagnostic).call(this, document, suggestion) });
      });
      event.detail.updated.forEach((suggestion) => {
        diagnostics.set(suggestion.id, { suggestion, diagnostic: __classPrivateFieldGet(this, _DiagnosticsService_instances, "m", _DiagnosticsService_toDiagnostic).call(this, document, suggestion) });
      });
      event.detail.removed.forEach((suggestion) => {
        diagnostics.delete(suggestion.id);
      });
      sendDiagnostics();
    });
    document.session.addEventListener("status", (event) => {
      __classPrivateFieldGet(this, _DiagnosticsService_connection, "f").console.log(`${event.detail} ${document.original.uri}`);
      __classPrivateFieldGet(this, _DiagnosticsService_connection, "f").sendNotification("$/onDocumentStatus", {
        uri: document.original.uri,
        status: event.detail
      });
      switch (event.detail) {
        case "idle":
          diagnostics.clear();
          document.session.suggestions.forEach((suggestion) => {
            diagnostics.set(suggestion.id, { suggestion, diagnostic: __classPrivateFieldGet(this, _DiagnosticsService_instances, "m", _DiagnosticsService_toDiagnostic).call(this, document, suggestion) });
          });
          sendDiagnostics();
          break;
      }
    });
  }, _DiagnosticsService_sendDiagnostics = function _DiagnosticsService_sendDiagnostics2(document) {
    var _a2;
    const diagnostics = (_a2 = __classPrivateFieldGet(this, _DiagnosticsService_diagnostics, "f").get(document.original.uri)) !== null && _a2 !== void 0 ? _a2 : /* @__PURE__ */ new Map();
    __classPrivateFieldGet(this, _DiagnosticsService_connection, "f").sendDiagnostics({
      uri: document.original.uri,
      diagnostics: document.isPaused ? [] : Array.from(diagnostics.values()).map((item) => item.diagnostic)
    });
  }, _DiagnosticsService_clearDiagnostics = function _DiagnosticsService_clearDiagnostics2(document) {
    __classPrivateFieldGet(this, _DiagnosticsService_connection, "f").sendDiagnostics({
      uri: document.original.uri,
      version: document.original.version,
      diagnostics: []
    });
  }, _DiagnosticsService_toDiagnostic = function _DiagnosticsService_toDiagnostic2(document, suggestion) {
    const highlight = suggestion.highlights[0];
    return {
      data: suggestion.id,
      message: suggestion.title,
      range: document.findOriginalRange(highlight.start, highlight.end),
      source: "Grammarly",
      severity: suggestion.type === "corrective" ? 1 : 3
    };
  };
  DiagnosticsService = __decorate([
    injectable(),
    __param(0, inject(CONNECTION)),
    __metadata("design:paramtypes", [Object, DocumentService])
  ], DiagnosticsService);
  var _CodeActionService_connection;
  var _CodeActionService_capabilities;
  var _CodeActionService_documents;
  var _CodeActionService_diagnostics;
  var CodeActionService = class CodeActionService2 {
    constructor(connection, capabilities, diagnostics, documents) {
      _CodeActionService_connection.set(this, void 0);
      _CodeActionService_capabilities.set(this, void 0);
      _CodeActionService_documents.set(this, void 0);
      _CodeActionService_diagnostics.set(this, void 0);
      __classPrivateFieldSet(this, _CodeActionService_connection, connection, "f");
      __classPrivateFieldSet(this, _CodeActionService_capabilities, capabilities, "f");
      __classPrivateFieldSet(this, _CodeActionService_diagnostics, diagnostics, "f");
      __classPrivateFieldSet(this, _CodeActionService_documents, documents, "f");
    }
    register() {
      __classPrivateFieldGet(this, _CodeActionService_capabilities, "f").codeActionProvider = {
        codeActionKinds: ["quickfix"],
        resolveProvider: true
      };
      __classPrivateFieldGet(this, _CodeActionService_connection, "f").onCodeAction(async ({ textDocument, context }) => {
        const document = __classPrivateFieldGet(this, _CodeActionService_documents, "f").get(textDocument.uri);
        if (document == null)
          return [];
        return await Promise.all(context.diagnostics.map((diagnostic) => typeof diagnostic.data === "string" ? __classPrivateFieldGet(this, _CodeActionService_diagnostics, "f").getSuggestionDiagnostic(document, diagnostic.data) : null).filter((item) => item != null).flatMap(({ suggestion, diagnostic }) => {
          const actions = suggestion.replacements.map((replacement) => {
            return {
              title: suggestion.title + (replacement.label != null ? ` \u2014 ${replacement.label}` : ""),
              kind: "quickfix",
              diagnostics: [diagnostic],
              data: {
                uri: document.original.uri,
                suggestionId: suggestion.id,
                replacementId: replacement.id
              }
            };
          });
          const dismiss = {
            title: `Dismiss \u2014 ${suggestion.title}`,
            kind: "quickfix",
            diagnostics: [diagnostic],
            command: {
              title: "Dismiss suggestion",
              command: "grammarly.dismiss",
              arguments: [
                {
                  uri: document.original.uri,
                  suggestionId: suggestion.id
                }
              ]
            }
          };
          actions.push(dismiss);
          return actions;
        }));
      });
      __classPrivateFieldGet(this, _CodeActionService_connection, "f").onCodeActionResolve(async (codeAction) => {
        if (codeAction.data == null)
          return codeAction;
        const { uri, suggestionId, replacementId } = codeAction.data;
        const document = __classPrivateFieldGet(this, _CodeActionService_documents, "f").get(uri);
        if (document == null)
          return codeAction;
        const edit = await document.session.applySuggestion({
          suggestionId,
          replacementId
        });
        __classPrivateFieldGet(this, _CodeActionService_connection, "f").console.log(JSON.stringify(edit, null, 2));
        const range = document.findOriginalRange(edit.range.start, edit.range.end);
        const newText = document.toText(edit.content);
        codeAction.edit = {
          changes: {
            [uri]: [{ range, newText }]
          }
        };
        return codeAction;
      });
      return { dispose() {
      } };
    }
  };
  _CodeActionService_connection = /* @__PURE__ */ new WeakMap(), _CodeActionService_capabilities = /* @__PURE__ */ new WeakMap(), _CodeActionService_documents = /* @__PURE__ */ new WeakMap(), _CodeActionService_diagnostics = /* @__PURE__ */ new WeakMap();
  CodeActionService = __decorate([
    injectable(),
    __param(0, inject(CONNECTION)),
    __param(1, inject(SERVER)),
    __metadata("design:paramtypes", [
      Object,
      Object,
      DiagnosticsService,
      DocumentService
    ])
  ], CodeActionService);
  function encodeLeadingAndTrailingSpace(text) {
    return text.replace(/^\n+|\n+$/, "").replace(/^[ ]+|[ ]+$/g, (m) => "&nbsp;".repeat(m.length));
  }
  function toMarkdown2(markup) {
    let indent = 0;
    function stringify(node) {
      if (typeof node === "string")
        return node + "\n";
      const children = [];
      node.children.forEach((child) => {
        if (typeof child !== "string" && ["del", "em", "strong"].includes(child.type) && children.length > 0) {
          const last = children[children.length - 1];
          if (typeof last !== "string" && last.type === child.type) {
            last.children.push(...child.children);
          }
        }
        if (typeof child === "string") {
          children.push(child);
        } else {
          children.push({ type: child.type, children: child.children.slice() });
        }
      });
      switch (node.type) {
        case "ul":
          try {
            indent += 2;
            return `${processChildren(node.children)}
`;
          } finally {
            indent -= 2;
          }
        case "li":
          return " ".repeat(indent - 2) + `- ${processChildren(node.children)}
`;
        case "del":
          return `<span style="color:#F00;">~~${encodeLeadingAndTrailingSpace(processChildren(node.children))}~~</span>
`;
        case "em":
          return `_${encodeLeadingAndTrailingSpace(processChildren(node.children))}_
`;
        case "strong":
          return `**${encodeLeadingAndTrailingSpace(processChildren(node.children))}**
`;
        case "ins":
          return `<span style="color:#0F0;">${processChildren(node.children)}</span>
`;
        default:
          return processChildren(node.children);
      }
    }
    return processChildren(markup);
    function processChildren(nodes) {
      return nodes.map((node) => stringify(node)).join("");
    }
  }
  var _HoverService_connection;
  var _HoverService_capabilities;
  var _HoverService_documents;
  var _HoverService_diagnostics;
  var HoverService = class HoverService2 {
    constructor(connection, capabilities, diagnostics, documents) {
      _HoverService_connection.set(this, void 0);
      _HoverService_capabilities.set(this, void 0);
      _HoverService_documents.set(this, void 0);
      _HoverService_diagnostics.set(this, void 0);
      __classPrivateFieldSet(this, _HoverService_connection, connection, "f");
      __classPrivateFieldSet(this, _HoverService_capabilities, capabilities, "f");
      __classPrivateFieldSet(this, _HoverService_diagnostics, diagnostics, "f");
      __classPrivateFieldSet(this, _HoverService_documents, documents, "f");
    }
    register() {
      __classPrivateFieldGet(this, _HoverService_capabilities, "f").hoverProvider = true;
      __classPrivateFieldGet(this, _HoverService_connection, "f").onHover(async ({ textDocument, position }) => {
        const document = __classPrivateFieldGet(this, _HoverService_documents, "f").get(textDocument.uri);
        if (document == null)
          return null;
        const diagnostics = __classPrivateFieldGet(this, _HoverService_diagnostics, "f").findSuggestionDiagnostics(document, { start: position, end: position });
        diagnostics.sort((a, b) => b.suggestion.highlights[0].start - a.suggestion.highlights[0].start);
        const diagnostic = diagnostics[0];
        if (diagnostic == null)
          return null;
        const contents = `**${diagnostic.suggestion.title.trim()}**

${toMarkdown2(diagnostic.suggestion.description).trim()}


${diagnostic.suggestion.replacements.length === 1 ? `\u2026 ${toMarkdown2(diagnostic.suggestion.replacements[0].preview).trim()} \u2026` : diagnostic.suggestion.replacements.map((replacement) => `1. \u2026 ${toMarkdown2(replacement.preview).trim()} \u2026
`).join("")}`;
        return {
          range: diagnostic.diagnostic.range,
          contents: {
            kind: "markdown",
            value: contents
          }
        };
      });
      return { dispose() {
      } };
    }
  };
  _HoverService_connection = /* @__PURE__ */ new WeakMap(), _HoverService_capabilities = /* @__PURE__ */ new WeakMap(), _HoverService_documents = /* @__PURE__ */ new WeakMap(), _HoverService_diagnostics = /* @__PURE__ */ new WeakMap();
  HoverService = __decorate([
    injectable(),
    __param(0, inject(CONNECTION)),
    __param(1, inject(SERVER)),
    __metadata("design:paramtypes", [
      Object,
      Object,
      DiagnosticsService,
      DocumentService
    ])
  ], HoverService);
  function createLanguageServer({ getConnection: getConnection2, createTextDocuments: createTextDocuments2, init, pathEnvironmentForSDK }) {
    return () => {
      const disposables = [];
      const capabilities = {};
      const container = new Container({
        autoBindInjectable: true,
        defaultScope: "Singleton"
      });
      const connection = getConnection2();
      container.bind(CONNECTION).toConstantValue(connection);
      container.bind(SERVER).toConstantValue(capabilities);
      connection.onInitialize(async (params) => {
        const options = params.initializationOptions;
        if ((options === null || options === void 0 ? void 0 : options.clientId) == null)
          throw new Error("clientId is required");
        await pathEnvironmentForSDK(options.clientId);
        const sdk = await init(options.clientId);
        container.bind(CLIENT).toConstantValue(params.capabilities);
        container.bind(CLIENT_INFO).toConstantValue({ ...params.clientInfo, id: options.clientId });
        container.bind(CLIENT_INITIALIZATION_OPTIONS).toConstantValue(options);
        container.bind(GRAMMARLY_SDK).toConstantValue(sdk);
        container.bind(TEXT_DOCUMENTS_FACTORY).toConstantValue(createTextDocuments2);
        disposables.push(container.get(ConfigurationService).register(), container.get(DocumentService).register(), container.get(DiagnosticsService).register(), container.get(HoverService).register(), container.get(CodeActionService).register());
        connection.onRequest("$/handleOAuthCallbackUri", async (url) => {
          await sdk.handleOAuthCallback(url);
        });
        connection.onRequest("$/isUserAccountConnected", async () => {
          return sdk.isUserAccountConnected;
        });
        connection.onRequest("$/getOAuthUrl", async (oauthRedirectUri) => {
          try {
            return await sdk.getOAuthUrl(oauthRedirectUri);
          } catch (error) {
            console.error(error);
            throw error;
          }
        });
        connection.onRequest("$/logout", async () => {
          await sdk.logout();
        });
        sdk.addEventListener("isUserAccountConnected", () => {
          connection.sendNotification("$/onUserAccountConnectedChange", {
            isUserAccountConnected: sdk.isUserAccountConnected
          });
        });
        connection.console.log("Initialized!");
        return {
          serverInfo: {
            name: "Grammarly"
          },
          capabilities
        };
      });
      connection.onExit(() => {
        disposables.forEach((disposable) => disposable.dispose());
      });
      connection.listen();
      connection.console.log("Ready!");
    };
  }
  var DOMParser = class {
    parseFromString(code) {
      const doc = parseDocument(code);
      const body = {
        childNodes: doc.children.map((node) => this._createDomNode(node))
      };
      return { body };
    }
    _createDomNode(node) {
      if ("children" in node) {
        if (node.type !== "tag")
          return;
        return {
          nodeType: node.nodeType,
          nodeName: node.tagName.toUpperCase(),
          childNodes: node.children.map((node2) => this._createDomNode(node2))
        };
      } else if ("data" in node) {
        return {
          nodeType: node.nodeType,
          nodeName: "#text",
          textContent: node.data
        };
      }
    }
  };
  var VirtualStorage = class {
    constructor() {
      this.items = /* @__PURE__ */ new Map();
    }
    get length() {
      return this.items.size;
    }
    clear() {
      this.items.clear();
    }
    getItem(key) {
      var _a2;
      return (_a2 = this.items.get(key)) !== null && _a2 !== void 0 ? _a2 : null;
    }
    key(index) {
      var _a2;
      return (_a2 = Array.from(this.items.keys())[index]) !== null && _a2 !== void 0 ? _a2 : null;
    }
    removeItem(key) {
      this.items.delete(key);
    }
    setItem(key, value) {
      this.items.set(key, value);
    }
  };
  var IDBStorage = class extends VirtualStorage {
    constructor() {
      super(...arguments);
      this.store = createStore("grammarly-languageserver", "localStorage");
    }
    async load() {
      for (const key of await keys(this.store)) {
        const value = await get(key, this.store);
        if (value != null) {
          this.items.set(key, value);
        }
      }
    }
    clear() {
      delMany(Array.from(this.items.keys()), this.store);
      super.clear();
    }
    getItem(key) {
      get(key, this.store).then((value) => {
        if (value != null) {
          this.items.set(key, value);
        } else {
          this.items.delete(key);
        }
      });
      return super.getItem(key);
    }
    removeItem(key) {
      del(key, this.store);
      this.items.delete(key);
    }
    setItem(key, value) {
      set(key, value, this.store);
      this.items.set(key, value);
    }
  };
  function getConnection() {
    const messageReader = new import_browser.BrowserMessageReader(self);
    const messageWriter = new import_browser.BrowserMessageWriter(self);
    return (0, import_browser.createConnection)(import_browser.ProposedFeatures.all, messageReader, messageWriter);
  }
  function createTextDocuments(config) {
    return new import_browser.TextDocuments(config);
  }
  if (!("DOMParser" in globalThis))
    globalThis.DOMParser = DOMParser;
  var localStorage = new IDBStorage();
  if (!("localStorage" in globalThis))
    globalThis.localStorage = localStorage;
  var sessionStorage = new VirtualStorage();
  if (!("sessionStorage" in globalThis))
    globalThis.sessionStorage = sessionStorage;
  var startLanguageServer = createLanguageServer({
    getConnection,
    createTextDocuments,
    init(clientId) {
      return new globalThis.Grammarly.SDK(clientId);
    },
    async pathEnvironmentForSDK() {
      if (globalThis.localStorage === localStorage) {
        await localStorage.load();
      }
    }
  });

  // extension/dist/server/index.mjs
  startLanguageServer();
})();
/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
;globalThis.window=globalThis;/**
 * @license
 * (c) Copyright 2021 Grammarly, Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
!function(t){"use strict";function e(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function n(t){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?e(Object(r),!0).forEach((function(e){i(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):e(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function i(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var r="undefined"!=typeof navigator&&"undefined"!=typeof matchMedia&&null!=window.Cypress;class s{constructor(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{showTimestamps:!1,useColors:r};i(this,"_l",new Map),i(this,"_m",void 0),i(this,"_n",void 0),i(this,"_o",0),this._m=t.showTimestamps,this._n=t.useColors}write(t){for(var e of t)switch(e.type){case"log":console[e.level.toLowerCase()](...this._p(e),...this._q(e));break;case"counter":console.log(...this._p(e),"Counters"),console.count(e.metric)}}_p(t){var e=this._n?["%c".concat(t.logger.name,"%c"),this._r(t.logger.name),""]:["[".concat(t.logger.name,"]")];return t.logger.id>0&&e.push("(".concat(t.logger.id,")")),this._m&&e.unshift("".concat(t.timestamp)),e}_q(t){var{message:e,data:n}=t.message;return[e,...n]}_r(t){var e;return null!==(e=this._l.get(t))&&void 0!==e?e:this._s(t)}_s(t){var e,n=function(t,e,n){n/=100;var i=e*Math.min(n,1-n)/100,r=e=>{var r=(e+t/30)%12,s=n-i*Math.max(Math.min(r-3,9-r,1),-1);return Math.round(255*s).toString(16).padStart(2,"0")};return"#".concat(r(0)).concat(r(8)).concat(r(4))}(this._o,36,null!==(e=matchMedia("(prefers-color-scheme: dark)"))&&void 0!==e&&e.matches?25:75),i="background: ".concat(n,"; border-radius: 2px; padding: 0 4px; display: inline-block;");return this._l.set(t,i),this._o=this._o+180/this._l.size,i}}class o{constructor(t){i(this,"_t",void 0),i(this,"_u",[]),i(this,"_v",0),this._t=t}write(t){for(var e of t)this._u[this._v]=e,this._v=(this._v+1)%this._t}getLogs(){return[...this._u.slice(this._v+1),...this._u.slice(0,this._v+1)]}printToConsole(){var t=this.getLogs();console.group("Editor SDK v".concat("1.7.5")),new s({showTimestamps:!0,useColors:!1}).write(t),console.groupEnd()}}var a=0;class c{constructor(t){i(this,"_w",void 0),i(this,"_x",void 0),this._x=a++,this._w=t}get name(){return this._w}count(t){c._y(this._z({metric:t}))}debug(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),i=1;i<e;i++)n[i-1]=arguments[i];c._y(this._A({level:"DEBUG",message:{message:t,data:n}}))}log(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),i=1;i<e;i++)n[i-1]=arguments[i];this.info(t,...n)}info(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),i=1;i<e;i++)n[i-1]=arguments[i];c._y(this._A({level:"INFO",message:{message:t,data:n}}))}warn(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),i=1;i<e;i++)n[i-1]=arguments[i];c._y(this._A({level:"WARN",message:{message:t,data:n}}))}error(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),i=1;i<e;i++)n[i-1]=arguments[i];c._y(this._A({level:"ERROR",message:{message:t,data:n}}))}createLogger(t){return new c("".concat(this.name,".").concat(t))}_A(t){return n({type:"log",logger:{id:this._x,name:this._w},timestamp:Date.now()},t)}_z(t){return n({type:"counter",logger:{id:this._x,name:this._w},timestamp:Date.now()},t)}static get level(){var t;return null!==(t=this._B[this._C])&&void 0!==t?t:"OFF"}static set level(t){this._C=this._B.indexOf(t)}static _y(t){var e=Array.from(this.writers).find((t=>t instanceof o));if(null==e||e.write([t]),!this.mutedLoggers.has(t.logger.name)){var n="level"in t?this._B.indexOf(t.level):1/0;this._C<=n&&this.writers.forEach((n=>{n!==e&&n.write([t])}))}}}i(c,"writers",new Set),i(c,"mutedLoggers",new Set),i(c,"_C",0),i(c,"_B",["DEBUG","INFO","WARN","ERROR","OFF"]);var u=new c("Default");function l(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}class h{constructor(t,e){l(this,"type",void 0),l(this,"detail",void 0),this.type=t,this.detail=e}}class d{constructor(){l(this,"_D",{}),l(this,"__type_helper_",void 0)}addEventListener(t,e){var n=this._D[t];null!=n?n.add(e):this._D[t]=new Set([e])}removeEventListener(t,e){var n;null===(n=this._D[t])||void 0===n||n.delete(e)}dispatchEvent(t,e){var n;null===(n=this._D[t])||void 0===n||n.forEach((n=>{try{var i=n(new h(t,e));null!=i&&i.catch((t=>u.error(t)))}catch(t){u.error(t)}}))}emit(t,e){this.dispatchEvent(t,e)}dispose(){this._D={}}}var g=/^(get|set|setAll|addEventListener|removeEventListener|dispatchEvent|dispose)$/;function f(t){var e=new _(t),n=t=>"string"==typeof t&&!g.test(t)&&!t.startsWith("_");return new Proxy(e,{get:(t,e,i)=>n(e)?t.get(e):Reflect.get(t,e,i),set:(t,e,i,r)=>n(e)?(t.set(e,i),!0):Reflect.set(t,e,i,r),has:(t,i)=>Reflect.has(n(i)?e[v]:t,i),ownKeys:t=>Reflect.ownKeys(e[v]),getOwnPropertyDescriptor:(t,n)=>Reflect.getOwnPropertyDescriptor(e[v],n)})}var v=Symbol("State");class _ extends d{constructor(t){super(),l(this,v,void 0),this[v]=t}set(t,e){this.setAll({[t]:e})}setAll(t){var e=[];for(var n of(Object.entries(t).forEach((t=>{var n=t[0],i=this[v][n],r=t[1];i!==r&&(this[v][n]=r,e.push([n,{value:r,previousValue:i}]))})),this.dispatchEvent("@updated",e.map((t=>t[0]))),e))this.dispatchEvent(n[0],n[1])}get(t){return this[v][t]}}class p{constructor(){l(this,"_E",[])}add(t){var e="function"==typeof t?{dispose:t}:t;return this._E.push((()=>e.dispose())),this}run(t){return this.add(t()),this}emitter(t){if(t instanceof d){var e={on:(n,i)=>(this.run((()=>(t.addEventListener(n,i),()=>t.removeEventListener(n,i)))),e),end:()=>this};return e}var n={on:(e,i,r)=>(this.run((()=>(t.addEventListener(e,i,r),()=>{t.removeEventListener(e,i,r)}))),n),end:()=>this};return n}dispose(){this._E.forEach((t=>t())),this._E.length=0}}function b(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function m(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?b(Object(n),!0).forEach((function(e){y(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):b(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function y(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function w(t){var e,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:t;return{get:()=>(void 0===e&&(e=t()),e),update(t){void 0!==e&&(e=n(t,this.get()))},clear(){e=void 0}}}function k(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(t===e)return!0;if(null!==t&&null!==e&&"object"==typeof t&&"object"==typeof e){if(t.constructor!==e.constructor)return!1;if(Array.isArray(t)){var i=t.length;if(i!==e.length)return!1;for(var r=i;0!=r--;)if(!k(t[r],e[r],n))return!1;return!0}if(t instanceof Map&&e instanceof Map){if(t.size!==e.size)return!1;for(var s of t.entries())if(!e.has(s[0]))return!1;for(var o of t.entries())if(!k(o[1],e.get(o[0]),n))return!1;return!0}if(t instanceof Set&&e instanceof Set){if(t.size!==e.size)return!1;for(var a of t.entries())if(!e.has(a[0]))return!1;return!0}if(t.constructor===RegExp)return t.source===e.source&&t.flags===e.flags;if(t.valueOf!==Object.prototype.valueOf)return t.valueOf()===e.valueOf();if(t.toString!==Object.prototype.toString)return t.toString()===e.toString();var c=Object.keys(t),u=c.length;if(u!==Object.keys(e).length)return!1;for(var l=u;0!=l--;)if(!Object.prototype.hasOwnProperty.call(e,c[l]))return!1;for(var h=u;0!=h--;){var d=c[h];if(!k(t[d],e[d],n))return!1}return!0}return!(!n||"function"!=typeof t||"function"!=typeof e)||t!=t&&e!=e}function x(t){return void 0!==t.delete}function E(t){return void 0!==t.insert}function S(t){return void 0!==t.retain}function T(t,e){if(t===e)return!0;if(null==t||null==e)return!1;var n=I(t),i=I(t);if(n!==i)return!1;var r="attributes";return k({type:t[n],attributes:t[r]},{type:e[i],attributes:e[r]})}function A(t){return E(t)&&"string"==typeof t.insert}function O(t){return E(t)?"string"==typeof t.insert?t.insert.length:1:S(t)?t.retain:t.delete}function I(t){return E(t)?"insert":S(t)?"retain":"delete"}function P(t){return{insert:t.insert,delete:t.delete,retain:t.retain,attributes:t.attributes}}class C{constructor(t){y(this,"ops",void 0),y(this,"index",void 0),y(this,"offset",void 0),this.ops=t,this.index=0,this.offset=0}hasNext(){return this.peekLength()<1/0}next(){var t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1/0,n=this.ops[this.index];if(null!=n){var i=this.offset,r=O(n);e>=r-i?(e=r-i,this.index+=1,this.offset=0):this.offset+=e,t=x(n)?P({delete:e}):S(n)?{retain:e,attributes:n.attributes}:A(n)?P({insert:n.insert.slice(i,i+e),attributes:n.attributes}):n}else t=P({retain:1/0});return t}peek(){return this.ops[this.index]}peekLength(){return null!=this.ops[this.index]?O(this.ops[this.index])-this.offset:1/0}peekType(){return null!=this.ops[this.index]?I(this.ops[this.index]):"retain"}rest(){if(this.hasNext()){if(0===this.offset)return this.ops.slice(this.index);var t=this.offset,e=this.index,n=this.next(),i=this.ops.slice(this.index);return this.offset=t,this.index=e,[n].concat(i)}return[]}}function j(t,e){return void 0!==e&&Object.keys(e).length>0?t.attributes=m({},e):t.attributes=void 0,t}function R(t){for(;t.ops.length>0;){var e=t.ops[t.ops.length-1];if(null==e||!S(e)||null!=e.attributes)break;t.ops.pop()}return t}var L=String.fromCharCode(0);class N{get ops(){return this._b}get changeLength(){return this._c.get()}constructor(t){y(this,"_b",void 0),y(this,"_c",w((()=>this._b.reduce(((t,e)=>E(e)?t+O(e):x(e)?t-e.delete:t),0)),((t,e)=>E(t)?e+O(t):x(t)?e-t.delete:e))),this._b=function(t){return Array.isArray(t)?t.slice():null!=t&&Array.isArray(t.ops)?t.ops.slice():[]}(t),0===this._b.length&&this.changeLength}insert(t,e){return"string"==typeof t&&0===t.length?this:this.push(j({insert:t},e))}delete(t){return t<=0?this:this.push({delete:t})}retain(t,e){return t<=0?this:this.push(j({retain:t},e))}push(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];if(0===e.length)return this;var i=e[0];this._c.update(i);var r=this._b.length,s=this._b[r-1],o=function(t){var e=P(t);return E(e)&&"object"==typeof e.insert&&(e.insert=JSON.parse(JSON.stringify(e.insert))),void 0!==e.attributes&&(e.attributes=m({},e.attributes)),e}(i);if(void 0!==s){if(x(o)&&x(s))return this._b[r-1]=P({delete:s.delete+o.delete}),this;if(x(s)&&E(o)&&(r-=1,void 0===(s=this._b[r-1])))return this._b.unshift(o),this;if(function(t,e){return k(t.attributes,e.attributes)}(o,s)){if(A(o)&&A(s))return this._b[r-1]=P(j({insert:s.insert+o.insert},o.attributes)),this;if(S(o)&&S(s))return this._b[r-1]=P(j({retain:s.retain+o.retain},o.attributes)),this}}if(r===this._b.length?this._b.push(o):this._b.splice(r,0,o),e.length>1){var a=e.slice(1);this._b.push(...a),a.forEach((t=>{this._c.update(t)}))}return this}slice(){for(var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1/0,n=[],i=new C(this._b),r=0;r<e&&i.hasNext();){var s=void 0;r<t?s=i.next(t-r):(s=i.next(e-r),n.push(s)),r+=O(s)}return new N(n)}compose(t){return D(this,new N,t)}transformPosition(t){for(var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=new C(this._b),i=0;n.hasNext()&&i<=t;){var r=n.peekLength(),s=n.peekType();n.next(),"delete"!==s?("insert"===s&&(!e||i<t)&&(t+=r),i+=r):t-=Math.min(r,t-i)}return t}toJSON(){return JSON.stringify({ops:this._b})}toRaw(){return{ops:this._b}}}function M(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=n?m({},e):{};if(!n)for(var r of Object.entries(e))null!=r[1]&&(i[r[0]]=r[1]);for(var s of Object.keys(t))void 0!==t[s]&&void 0===e[s]&&(i[s]=t[s]);return Object.keys(i).length>0?i:void 0}function D(t,e,n){var i=new C(t.ops),r=new C(n.ops),s=r.peek();if(void 0!==s&&S(s)&&void 0===s.attributes){for(var o=s.retain;"insert"===i.peekType()&&i.peekLength()<=o;)o-=i.peekLength(),e.push(i.next());s.retain-o>0&&r.next(s.retain-o)}for(;i.hasNext()||r.hasNext();)if("insert"===r.peekType())e.push(r.next());else if("delete"===i.peekType())e.push(i.next());else{var a=Math.min(i.peekLength(),r.peekLength()),c=i.next(a),u=r.next(a);if(S(u)){var l=void 0;if(l=S(c)?{retain:a}:{insert:c.insert},e.push(j(l,M(c.attributes,u.attributes,S(c)))),!r.hasNext()&&T(e.ops[e.ops.length-1],l))return R(e.push(...i.rest()))}else x(u)&&S(c)&&e.push(u)}return R(e)}class U{constructor(t){y(this,"_d",void 0),this._d=new Array((Array.isArray(t)?0:t)+1),this._d.fill(0),Array.isArray(t)&&this.push(...t)}clone(){var t=new U(0);return t._d=this._d.slice(),t}getPrefixSum(t){for(var e=0;t>0;)e+=this._d[t],t=this._e(t);return e}get(t){return this.getPrefixSum(t+1)-this.getPrefixSum(t)}set(t,e){return this.update(t,e-this.get(t))}update(t,e){for(++t;t<this._d.length;)this._d[t]+=e,t=this._f(t)}push(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];this.updateAll(this._d.length-1,e)}updateAll(t,e){t+=1;var n=this._d.length;this._d.length=t+e.length,this._d.fill(0,n);for(var i=1;i<this._d.length;++i){i>=t&&(this._d[i]+=e[i-t]);var r=this._f(i);r>=t&&r<this._d.length&&(this._d[r]+=this._d[i])}}setAll(t){this._d=[0],this.updateAll(0,t)}rank(t){t-=this._d[0];for(var e=B(0),n=B(1),i=B(this._d.length);n<i;)n<<=1;for(;n>0;n>>=1)e+n<i&&this._d[e+n]<=t&&(t-=this._d[e+n],e+=n);return e}_e(t){return t-F(t)}_f(t){return t+F(t)}}function F(t){return t&-t}function B(t){return new Uint32Array([t])[0]}var q=-1;function J(t,e,n,i){if(t===e)return t?[[0,t]]:[];if(null!=n){var r=function(t,e,n){var i="number"==typeof n?{index:n,length:0}:n.oldRange,r="number"==typeof n?null:n.newRange,s=t.length,o=e.length;if(0===i.length&&(null===r||0===r.length)){var a=i.index,c=t.slice(0,a),u=t.slice(a),l=r?r.index:null,h=a+o-s;if((null===l||l===h)&&!(h<0||h>o)){var d=e.slice(0,h);if((v=e.slice(h))===u){var g=Math.min(a,h);if((p=c.slice(0,g))===(m=d.slice(0,g)))return Y(p,c.slice(g),d.slice(g),u)}}if(null===l||l===a){var f=a,v=(d=e.slice(0,f),e.slice(f));if(d===c){var _=Math.min(s-f,o-f);if((b=u.slice(u.length-_))===(y=v.slice(v.length-_)))return Y(c,u.slice(0,u.length-_),v.slice(0,v.length-_),b)}}}if(i.length>0&&r&&0===r.length){var p=t.slice(0,i.index),b=t.slice(i.index+i.length);if(!(o<(g=p.length)+(_=b.length))){var m=e.slice(0,g),y=e.slice(o-_);if(p===m&&b===y)return Y(p,t.slice(g,s-_),e.slice(g,o-_),b)}}return null}(t,e,n);if(r)return r}var s=W(t,e),o=t.substring(0,s);s=V(t=t.substring(s),e=e.substring(s));var a=t.substring(t.length-s),c=$(t=t.substring(0,t.length-s),e=e.substring(0,e.length-s));return o&&c.unshift([0,o]),a&&c.push([0,a]),G(c,i),c}function $(t,e){var n;if(!t)return[[1,e]];if(!e)return[[q,t]];var i=t.length>e.length?t:e,r=t.length>e.length?e:t,s=i.indexOf(r);if(-1!==s)return n=[[1,i.substring(0,s)],[0,r],[1,i.substring(s+r.length)]],t.length>e.length&&(n[0][0]=n[2][0]=q),n;if(1===r.length)return[[q,t],[1,e]];var o=function(t,e){var n=t.length>e.length?t:e,i=t.length>e.length?e:t;if(n.length<4||2*i.length<n.length)return null;function r(t,e,n){for(var i,r,s,o,a=t.substring(n,n+Math.floor(t.length/4)),c=-1,u="";-1!==(c=e.indexOf(a,c+1));){var l=W(t.substring(n),e.substring(c)),h=V(t.substring(0,n),e.substring(0,c));u.length<h+l&&(u=e.substring(c-h,c)+e.substring(c,c+l),i=t.substring(0,n-h),r=t.substring(n+l),s=e.substring(0,c-h),o=e.substring(c+l))}return 2*u.length>=t.length?[i,r,s,o,u]:null}var s,o,a,c,u,l=r(n,i,Math.ceil(n.length/4)),h=r(n,i,Math.ceil(n.length/2));if(!l&&!h)return null;s=h?l&&l[4].length>h[4].length?l:h:l;t.length>e.length?(o=s[0],a=s[1],c=s[2],u=s[3]):(c=s[0],u=s[1],o=s[2],a=s[3]);var d=s[4];return[o,a,c,u,d]}(t,e);if(o){var a=o[0],c=o[1],u=o[2],l=o[3],h=o[4],d=J(a,u),g=J(c,l);return d.concat([[0,h]],g)}return function(t,e){for(var n=t.length,i=e.length,r=Math.ceil((n+i)/2),s=r,o=2*r,a=new Array(o),c=new Array(o),u=0;u<o;u++)a[u]=-1,c[u]=-1;a[s+1]=0,c[s+1]=0;for(var l=n-i,h=l%2!=0,d=0,g=0,f=0,v=0,_=0;_<r;_++){for(var p=-_+d;p<=_-g;p+=2){for(var b=s+p,m=(E=p===-_||p!==_&&a[b-1]<a[b+1]?a[b+1]:a[b-1]+1)-p;E<n&&m<i&&t.charAt(E)===e.charAt(m);)E++,m++;if(a[b]=E,E>n)g+=2;else if(m>i)d+=2;else if(h){if((k=s+l-p)>=0&&k<o&&-1!==c[k])if(E>=(w=n-c[k]))return H(t,e,E,m)}}for(var y=-_+f;y<=_-v;y+=2){for(var w,k=s+y,x=(w=y===-_||y!==_&&c[k-1]<c[k+1]?c[k+1]:c[k-1]+1)-y;w<n&&x<i&&t.charAt(n-w-1)===e.charAt(i-x-1);)w++,x++;if(c[k]=w,w>n)v+=2;else if(x>i)f+=2;else if(!h){if((b=s+l-y)>=0&&b<o&&-1!==a[b]){var E;m=s+(E=a[b])-b;if(E>=(w=n-w))return H(t,e,E,m)}}}}return[[q,t],[1,e]]}(t,e)}function H(t,e,n,i){var r=t.substring(0,n),s=e.substring(0,i),o=t.substring(n),a=e.substring(i),c=J(r,s),u=J(o,a);return c.concat(u)}function W(t,e){if(!t||!e||t.charAt(0)!==e.charAt(0))return 0;for(var n=0,i=Math.min(t.length,e.length),r=i,s=0;n<r;)t.substring(s,r)==e.substring(s,r)?s=n=r:i=r,r=Math.floor((i-n)/2+n);return z(t.charCodeAt(r-1))&&r--,r}function V(t,e){if(!t||!e||t.slice(-1)!==e.slice(-1))return 0;for(var n=0,i=Math.min(t.length,e.length),r=i,s=0;n<r;)t.substring(t.length-r,t.length-s)==e.substring(e.length-r,e.length-s)?s=n=r:i=r,r=Math.floor((i-n)/2+n);return K(t.charCodeAt(t.length-r))&&r--,r}function G(t,e){t.push([0,""]);for(var n,i=0,r=0,s=0,o="",a="";i<t.length;)if(i<t.length-1&&!t[i][1])t.splice(i,1);else switch(t[i][0]){case 1:s++,a+=t[i][1],i++;break;case q:r++,o+=t[i][1],i++;break;case 0:var c=i-s-r-1;if(e){if(c>=0&&Q(t[c][1])){var u=t[c][1].slice(-1);if(t[c][1]=t[c][1].slice(0,-1),o=u+o,a=u+a,!t[c][1]){t.splice(c,1),i--;var l=c-1;t[l]&&1===t[l][0]&&(s++,a=t[l][1]+a,l--),t[l]&&t[l][0]===q&&(r++,o=t[l][1]+o,l--),c=l}}if(X(t[i][1])){u=t[i][1].charAt(0);t[i][1]=t[i][1].slice(1),o+=u,a+=u}}if(i<t.length-1&&!t[i][1]){t.splice(i,1);break}if(o.length>0||a.length>0){o.length>0&&a.length>0&&(0!==(n=W(a,o))&&(c>=0?t[c][1]+=a.substring(0,n):(t.splice(0,0,[0,a.substring(0,n)]),i++),a=a.substring(n),o=o.substring(n)),0!==(n=V(a,o))&&(t[i][1]=a.substring(a.length-n)+t[i][1],a=a.substring(0,a.length-n),o=o.substring(0,o.length-n)));var h=s+r;0===o.length&&0===a.length?(t.splice(i-h,h),i-=h):0===o.length?(t.splice(i-h,h,[1,a]),i=i-h+1):0===a.length?(t.splice(i-h,h,[q,o]),i=i-h+1):(t.splice(i-h,h,[q,o],[1,a]),i=i-h+2)}0!==i&&0===t[i-1][0]?(t[i-1][1]+=t[i][1],t.splice(i,1)):i++,s=0,r=0,o="",a=""}""===t[t.length-1][1]&&t.pop();var d=!1;for(i=1;i<t.length-1;)0===t[i-1][0]&&0===t[i+1][0]&&(t[i][1].substring(t[i][1].length-t[i-1][1].length)===t[i-1][1]?(t[i][1]=t[i-1][1]+t[i][1].substring(0,t[i][1].length-t[i-1][1].length),t[i+1][1]=t[i-1][1]+t[i+1][1],t.splice(i-1,1),d=!0):t[i][1].substring(0,t[i+1][1].length)==t[i+1][1]&&(t[i-1][1]+=t[i+1][1],t[i][1]=t[i][1].substring(t[i+1][1].length)+t[i+1][1],t.splice(i+1,1),d=!0)),i++;d&&G(t,e)}function z(t){return t>=55296&&t<=56319}function K(t){return t>=56320&&t<=57343}function X(t){return K(t.charCodeAt(0))}function Q(t){return z(t.charCodeAt(t.length-1))}function Y(t,e,n,i){return Q(t)||X(i)?null:function(t){for(var e=[],n=0;n<t.length;n++)t[n][1].length>0&&e.push(t[n]);return e}([[0,t],[q,e],[1,n],[0,i]])}function Z(t,e,n){return J(t,e,n,!0)}Z.INSERT=1,Z.DELETE=q,Z.EQUAL=0;var tt=Z;class et extends N{constructor(t){super(t),y(this,"_g",!0),y(this,"_h",void 0),y(this,"_i",w((()=>{var t="";return this.ops.forEach((e=>{t+=nt(e)})),t}),((t,e)=>e+nt(t)))),this._h=new U(this.ops.length),0===this.ops.length&&this.toString()}get length(){return this.toString().length}retain(t,e){throw new Error("Unsupported")}delete(t,e){throw new Error("Unsupported")}insert(t,e){return"string"==typeof t&&0===t.length?this:this.push({insert:t,attributes:e})}push(){for(var t=this.ops.length-1,e=arguments.length,n=new Array(e),i=0;i<e;i++)n[i]=arguments[i];return n.forEach((t=>this._i.update(t))),super.push(...n),this._g||(this._h.set(t,O(this.ops[t])),this._h.push(...this.ops.slice(t+1).map((t=>O(t))))),this}concat(t){var e=new et(this.ops.slice());return t.ops.length>0?(e.push(t.ops[0]),new et([...e.ops,...t.ops.slice(1)])):e}diff(t,e){if(this===t)return new N;var n=this._j(t,e);if(3===n.length){var[i,r,s]=n;if(0===i[0]&&0!==r[0]&&0===s[0]&&!r[1].includes(L)){if(r[0]>0){this._k();var o=Math.min(this._h.rank(i[1].length+r[1].length),this.ops.length-1),a=this.ops[o],c=[{insert:r[1],attributes:null==a?void 0:a.attributes}];return i[1].length>0&&c.unshift({retain:i[1].length}),new N(c)}if(r[0]<0){var u=[{delete:r[1].length}];return i[1].length>0&&u.unshift({retain:i[1].length}),new N(u)}}}var l=new N,h=new C(this.ops),d=new C(t.ops);return n.forEach((t=>{for(var e=t[1].length;e>0;){var n=0;switch(t[0]){case 1:n=Math.min(d.peekLength(),e),l.push(d.next(n));break;case-1:n=Math.min(e,h.peekLength()),h.next(n),l.delete(n);break;case 0:n=Math.min(h.peekLength(),d.peekLength(),e);var i=h.next(n),r=d.next(n);k(i.insert,r.insert)?l.retain(n,it(i.attributes,r.attributes)):l.push(r).delete(n)}e-=n}})),R(l)}_k(){this._g&&(this._h.setAll(this.ops.map((t=>O(t)))),this._g=!1)}_j(t,e){var n=this.toString(),i=t.toString();if(n===i)return[[0,n]];if("number"==typeof e){var r=i.length-n.length,s=Math.abs(r);if(r>0){if(e>=s&&n.slice(e-s)===i.slice(e)&&n.slice(0,e-s)===i.slice(0,e-s))return[[0,n.slice(0,e-s)],[1,i.slice(e-s,e)],[0,n.slice(e-s)]];if(n.slice(0,e)===i.slice(0,e)&&n.slice(e)===i.slice(e+s))return[[0,n.slice(0,e)],[1,i.slice(e,e+s)],[0,n.slice(e)]]}else if(r<0&&n.slice(0,e)===i.slice(0,e)&&n.slice(e+s)===i.slice(e))return[[0,i.slice(0,e)],[-1,n.slice(e,e+s)],[0,i.slice(e)]]}return tt(n,i,e)}compose(t){var e=D(this,new et,t);if(e._g=this._g,e._h=this._h.clone(),!e._g&&t.ops.length>0){var n=t.ops[0],i=S(n)?e._h.rank(n.retain):0;e._h.updateAll(i,e.ops.slice(i).map((t=>{var e=this.ops[i],n=null!=e?O(e):0;return O(t)-n})))}return e}toString(){return this._i.get()}toPlainText(){return this._i.get()}slice(t,e){return new et(super.slice(t,e))}}function nt(t){return"string"==typeof t.insert?t.insert:k(t.insert,{linebreak:!0})?"\n":L}function it(t,e){if(null==t)return rt(e);if(null==e)return rt(Object.fromEntries(Array.from(Object.keys(t)).map((t=>[t,null]))));var n=new Set([...Object.keys(t),...Object.keys(e)]),i={};for(var r of n)t[r]!==e[r]&&(i[r]=void 0===e[r]?null:e[r]);return rt(i)}function rt(t){if(null!=t&&0!==Object.keys(t).length)return t}function st(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}class ot extends Error{constructor(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"";super(),st(this,"args",void 0),st(this,"code",void 0),st(this,"url",void 0);var i=new URL("https://developer.grammarly.com/docs/error-explainer");i.searchParams.set("code",t.toString()),e.forEach((t=>i.searchParams.append("args",String(t)))),null!=this.stack&&i.searchParams.set("trace",this.stack),this.message="Minified error #".concat(t,": ").concat(n," See ").concat(i.toString()," for details."),this.args=e,this.code=t,this.url=i.toString()}}function at(t,e,n,i,r,s,o){try{var a=t[s](o),c=a.value}catch(t){return void n(t)}a.done?e(c):Promise.resolve(c).then(i,r)}function ct(t){return function(){var e=this,n=arguments;return new Promise((function(i,r){var s=t.apply(e,n);function o(t){at(s,i,r,o,a,"next",t)}function a(t){at(s,i,r,o,a,"throw",t)}o(void 0)}))}}function ut(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}class lt extends Error{constructor(t,e){super(t),ut(this,"event",void 0),ut(this,"message",void 0),this.message=t,this.event=e}}class ht extends d{get messagesSent(){return this._L.sent}get messagesReceived(){return this._L.received}get messagesPending(){return this._F.size}constructor(t,e,n){super(),ut(this,"_logger",new c("Channel")),ut(this,"_F",new Map),ut(this,"_G",new Set),ut(this,"_H",[]),ut(this,"_I",void 0),ut(this,"_J",void 0),ut(this,"_K",void 0),ut(this,"_L",void 0),this._I=t,this._J=e,this._K=n,this._L={sent:0,received:0},this._I.addEventListener("open",(()=>{for(var t of(this.dispatchEvent("_open",null),this._H))this._M(t);this._H.length=0})),this._I.addEventListener("close",(()=>{this.dispatchEvent("_close",null);var t=new lt("Closed");this._F.forEach((e=>{e.reject(t)})),this._F.clear()})),this._I.addEventListener("error",(t=>{var e=new lt("Error",t);this.dispatchEvent("_error",e),this._F.forEach((t=>{t.reject(e)})),this._F.clear()})),this._I.addEventListener("message",(t=>{var e=JSON.parse(t.data),n=this._J(e),i=this._K(e);if(this._L.received+=1,this.dispatchEvent("_message",e),null!=i){var r;if(this._G.has(String(i))&&this._F.has(n))null===(r=this._F.get(n))||void 0===r||r.handle(e),this._F.delete(n);this.dispatchEvent(i,e)}}))}get isOpen(){return this._I.readyState===WebSocket.OPEN}close(){this._I.readyState!==WebSocket.CLOSING&&this._I.readyState!==WebSocket.CLOSED&&this._I.close()}send(t){var e=this;return ct((function*(){return yield new Promise(((n,i)=>{var r=e._J(t),s=e._K(t);switch(e._G.add(String(s)),e._I.readyState){case 1:e._M(t);break;case 3:case 2:throw new lt("Closed");case 0:e._H.push(t)}e._F.set(r,{request:t,handle:t=>n(t),reject:t=>{i(t)}})}))}))()}_M(t){this._I.send(JSON.stringify(t)),this._L.sent+=1}}var dt={prod:"wss://capi.grammarly.com",preprod:"wss://capi.ppgr.io",qa:"wss://capi.qagr.io"},gt={"/pws":{id:"id",type:"action"}};class ft{constructor(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"prod",e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(){var t=ct((function*(t){return new WebSocket(t)}));return function(e){return t.apply(this,arguments)}}();ut(this,"_N",void 0),ut(this,"_O",void 0),this._N=dt[t],this._O=e}createChannel(t){var e=this;return ct((function*(){var n=gt[t],i=yield e._O(e._N+t);return new ht(i,(t=>t[n.id]),(t=>t[n.type]))}))()}}function vt(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function _t(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?vt(Object(n),!0).forEach((function(e){pt(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):vt(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function pt(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function bt(t,e,n,i,r,s,o){try{var a=t[s](o),c=a.value}catch(t){return void n(t)}a.done?e(c):Promise.resolve(c).then(i,r)}function mt(t){return function(){var e=this,n=arguments;return new Promise((function(i,r){var s=t.apply(e,n);function o(t){bt(s,i,r,o,a,"next",t)}function a(t){bt(s,i,r,o,a,"throw",t)}o(void 0)}))}}function yt(t){var{sessionStats:e}=t;return{duration:e.durationSeconds,wordsChecked:e.checkedWords,suggestionsSent:e.alertsStats.sent,suggestionsAccepted:e.alertsStats.accepted}}function wt(t,e){var n=function(t){var e=Math.floor(t/3600),n=Math.floor((t-3600*e)/60);return{h:e,m:n,s:t-3600*e-60*n}}(t/(e/60));return n.s=n.h>0&&n.m>10?0:Math.floor(n.s),n}function kt(t){return wt(t,250)}function xt(t){return wt(t,130)}var Et={type:"js_plugin",sub:"general"},St="1.7.5",Tt={felog:"https://f-log-js-plugin.grammarly.io"},At={anonymousToken:t=>"https://tokens.".concat(t,"/oauth2/token"),oauth2Token:t=>"https://tokens.".concat(t,"/oauth2/token"),capi:t=>"wss://capi.".concat(t,"/pws"),consentScreen:t=>"https://www.".concat(t,"/signin/app"),gnar:t=>"https://gnar.".concat(t),feedback:t=>"https://apps.".concat(t,"/v1/feedback/editor-sdk"),clientInfo:t=>"grammarly.com"===t?"https://apps-public.grammarly.com/client-info":"https://apps.".concat(t,"/v1/apps-public/client-info")};function Ot(){var t;return null!==(t="prod")?t:"prod"}function It(t){var e,n=null!==(e="grammarly.com")?e:"grammarly.com";return At[t](n)}function Pt(t){var e=!1;return{promise:t,get isCancelled(){return e},cancel(){e=!0}}}Object.freeze({__proto__:null,clientInfo:Et,clientVersion:St,tracking:Tt,getEnv:Ot,getUrl:It});class Ct extends Error{}function jt(t,e){var n,i=!0,r=f({get value(){return i&&(i=!1,n=e()),n}});return t.forEach((t=>{!function(t,e,n){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{immediate:!0},r=new p,s=r.emitter(t),o=new Set(e);s.on("@updated",(t=>{t.detail.some((t=>o.has(t)))&&n()})),i.immediate&&n()}(t[0],t[1],(()=>{i=!0,r.dispatchEvent("@updated",["value"]),void 0!==n&&r.dispatchEvent("value",{get value(){return r.value},previousValue:n})}))})),r}function Rt(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=t;return{next(){var t=e;return e+=1,t},peekNext:()=>e,reset(){e=t}}}function Lt(){return Nt.apply(this,arguments)}function Nt(){return Nt=mt((function*(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;yield new Promise((e=>setTimeout(e,t)))})),Nt.apply(this,arguments)}function Mt(t){null!=t&&t.catch((t=>{u.error("Error in detached promise",t)}))}var Dt="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};class Ut extends Error{constructor(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"unknown";super(arguments.length>2?arguments[2]:void 0),pt(this,"serverCode",void 0),pt(this,"response",void 0),this.serverCode=e,this.response=t}get status(){return this.response.status}get statusText(){return this.response.statusText}}function Ft(t){return Bt.apply(this,arguments)}function Bt(){return Bt=mt((function*(t){var e,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i={"Content-Type":"application/json"},r=yield fetch(t,_t(_t({},n),{},{mode:"cors",headers:_t(_t(_t({},n.headers),null!=(null==n?void 0:n.body)?i:{}),{},{Accept:"application/json","x-client-type":Et.type,"x-client-version":St})}));try{if(r.ok)return yield r.json()}catch(o){throw new Ut(r,"client",o.message)}var s=yield r.clone().json().catch((t=>({error:"unknown",message:t.message}))),o=new Ut(r,null!==(e=s.error)&&void 0!==e?e:"unknown",s.message);throw r.status>=500&&u.error(o,{status:r.status,url:t}),o})),Bt.apply(this,arguments)}function qt(t){if("object"==typeof t&&null!==t){if("function"==typeof Object.getPrototypeOf){var e=Object.getPrototypeOf(t);return e===Object.prototype||null===e}return"[object Object]"===Object.prototype.toString.call(t)}return!1}function Jt(){return"undefined"!=typeof navigator}function $t(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(t=>{var e=16*Math.random()|0;return("x"===t?e:3&e|8).toString(16)}))}var Ht=$t();function Wt(t,e,n,i,r){return Vt.apply(this,arguments)}function Vt(){return Vt=mt((function*(t,e,n,i,r){for(var s=Date.now(),o="".concat(e,"__$$MUTEX_x"),a="".concat(e,"__$$MUTEX_y"),c=Gt(s);;){if(h(),!(Date.now()-s<n))throw new ot(4,[e,n]);if(null==t.getItem(o))if(t.setItem(o,c),null==t.getItem(a)){if(t.setItem(a,c),yield Lt(zt()),t.getItem(o)===c){try{var u=Gt(Date.now());t.setItem(o,u),t.setItem(a,u),yield r()}finally{t.removeItem(o),t.removeItem(a)}break}yield Lt(zt()),t.getItem(a)!==c&&(yield Lt(zt()))}else yield Lt(zt());else yield Lt(zt())}function l(e){var n=t.getItem(e);if(null==n)return!1;if(n===c)return!0;var r=parseInt(String(n.split(":")[1]),10);return!Number.isFinite(r)||r+i<Date.now()}function h(){l(o)&&t.removeItem(o),l(a)&&t.removeItem(a)}})),Vt.apply(this,arguments)}function Gt(t){return"".concat(Ht,":").concat(t,":").concat(Math.floor(1e6*(1+Math.random())))}function zt(){return Math.floor(1+9*Math.random())}function Kt(t,e,n){return Xt.apply(this,arguments)}function Xt(){return Xt=mt((function*(t,e,n){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:12e4,r=arguments.length>4&&void 0!==arguments[4]?arguments[4]:6e4;yield Wt(t,e,i,r,mt((function*(){return yield n()})))})),Xt.apply(this,arguments)}function Qt(t,e){return e()}function Yt(t){return Mt(function(t){return Zt.apply(this,arguments)}(t)),!0}function Zt(){return Zt=mt((function*(t){try{yield fetch(t,{mode:"no-cors",cache:"no-cache"})}catch(t){}})),Zt.apply(this,arguments)}function te(t){var e=null,n=null;return mt((function*(){return null!=e?yield e:(null!=n||(e=t(),n=yield e,e=null),n)}))}function ee(t){return ne.apply(this,arguments)}function ne(){return ne=mt((function*(t){for(var e,n=_t({backoffFn:(e=mt((function*(t){var{tryNo:e}=t;return yield Lt(100*Math.pow(2,e-1))})),function(t){return e.apply(this,arguments)}),maxRetries:10},t),i=0,r=!1,s=null,o=null,a=Date.now(),c=()=>{r=!0};i<=n.maxRetries;)try{return{result:o=yield n.fn({tryNo:i,startedAt:a,abort:c}),error:null}}catch(t){if(s=t,++i,r)break;i<=n.maxRetries&&(yield n.backoffFn({tryNo:i,startedAt:a,abort:c}))}return{error:s,result:o}})),ne.apply(this,arguments)}var ie=/^(type|data-grammarly.*|contenteditable|style)$/;function re(t){var e=Object.getPrototypeOf(t);return null!=e&&"constructor"in e&&"function"==typeof e.constructor?e.constructor.name:Object.prototype.toString.call(t).replace(/^\[object|\]$/,"")}var se=new Set;function oe(t,e){return!se.has(t)&&(Mt(function(t,e,n){return ce.apply(this,arguments)}(t,e,function(t){return t.startsWith("https://f-log-js-plugin.grammarly.io")}(t))),!0)}function ae(t){return JSON.stringify(t,((t,e)=>"object"!=typeof e||qt(e)||Array.isArray(e)?e:function(t){return null==t||qt(t)?t:t instanceof ot?{name:"InvariantError",message:t.url,stack:t.stack,code:t.code,args:t.args}:t instanceof Error?{__type:re(t),name:t.name,message:t.message,stack:t.stack}:t instanceof Request?{__type:"Request",url:t.url,method:t.method}:t instanceof Response?{__type:"Response",url:t.url,status:t.status,statusText:t.statusText}:Jt()&&t instanceof HTMLElement?{__type:"#element",tag:t.tagName,attributes:Object.fromEntries(t.getAttributeNames().filter((t=>ie.test(t))).map((e=>[e,t.getAttribute(e)])))}:Jt()&&t instanceof Text?{__type:"#text",length:t.length}:{__type:re(t),instance:t}}(e)))}function ce(){return ce=mt((function*(t,e,n){try{yield fetch(t,{method:"POST",body:ae(e),headers:{"Content-Type":"application/json"},mode:n?"no-cors":"cors",cache:"no-cache"})}catch(e){e instanceof Error&&/NetworkError/i.test(e.message)&&"undefined"!=typeof navigator&&navigator.onLine&&se.add(t)}})),ce.apply(this,arguments)}class ue{constructor(t){pt(this,"_P",null),pt(this,"_Q",void 0),pt(this,"_R",void 0),this._Q=t;for(var e=arguments.length,n=new Array(e>1?e-1:0),i=1;i<e;i++)n[i-1]=arguments[i];this._R=n}getInstance(){if(null==this._P){if(!this.hasConstructorParameters)throw new ot(5,[this._Q.length,this._R.length]);this._P=new this._Q(...this._R)}return this._P}get hasConstructorParameters(){return this._Q.length<=this._R.length}clear(){this._P=null}setConstructorParameters(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];this._R=e}getConstructorParameters(){return this._R}}function le(){return"".concat(Date.now(),".").concat(Math.random())}function he(){return function(){var t=mt((function*(t){return yield Promise.resolve(t)}));return function(e){return t.apply(this,arguments)}}()}class de{constructor(t){pt(this,"gnar",void 0),this.gnar=t}autocompleteSuggestionAccept(t){return this.gnar.track({action:"accept",eventName:"editorPlugin/autocomplete-suggestion-accept",object:"suggestion",objectId:"autocomplete",suggestionID:t})}autocompleteSuggestionDismiss(t){return this.gnar.track({action:"dismiss",eventName:"editorPlugin/autocomplete-suggestion-dismiss",object:"suggestion",objectId:"autocomplete",suggestionID:t})}autocompleteSuggestionShow(t){return this.gnar.track({action:"show",eventName:"editorPlugin/autocomplete-suggestion-show",object:"suggestion",objectId:"autocomplete",suggestionID:t})}autocompleteTurnOffButtonClick(){return this.gnar.track({action:"click",eventName:"editorPlugin/autocompleteTurnOff-button-click",object:"button",objectId:"autocompleteTurnOff"})}connectAccountButtonClick(t){return this.gnar.track({action:"click",eventName:"editorPlugin/connectAccount-button-click",object:"button",objectId:"connectAccount",popupBlocked:t})}dialectSelectClick(t){return this.gnar.track({action:"click",eventName:"editorPlugin/dialect-select-click",object:"select",objectId:"dialect",dialect:t})}editorConfigUpdated(t){return this.gnar.track({action:"updated",eventName:"editorPlugin/editorConfig-updated",objectId:"editorConfig",config:t})}gButtonClick(){return this.gnar.track({action:"click",eventName:"editorPlugin/g-button-click",object:"button",objectId:"g"})}gButtonEnable(){return this.gnar.track({action:"enable",eventName:"editorPlugin/g-button-enable",object:"button",objectId:"g"})}gButtonShow(t,e){return this.gnar.track({action:"show",eventName:"editorPlugin/g-button-show",object:"button",objectId:"g",enabled:t,disabledReason:e})}gPopupClose(){return this.gnar.track({action:"close",eventName:"editorPlugin/g-popup-close",object:"popup",objectId:"g"})}gPopupShow(){return this.gnar.track({action:"show",eventName:"editorPlugin/g-popup-show",object:"popup",objectId:"g"})}learnMoreButtonClick(){return this.gnar.track({action:"click",eventName:"editorPlugin/learnMore-button-click",object:"button",objectId:"learnMore"})}logoutButtonClick(){return this.gnar.track({action:"click",eventName:"editorPlugin/logout-button-click",object:"button",objectId:"logout"})}myGrammarlyButtonClick(){return this.gnar.track({action:"click",eventName:"editorPlugin/myGrammarly-button-click",object:"button",objectId:"myGrammarly"})}sdkEditorConnect(t,e,n){return this.gnar.track({action:"connect",eventName:"editorPlugin/sdk-editor-connect",object:"editor",objectId:"sdk",editorClassList:t,editorKind:e,viewportClassList:n})}showAutocompleteToggleClick(t){return this.gnar.track({action:"click",eventName:"editorPlugin/showAutocomplete-toggle-click",object:"toggle",objectId:"showAutocomplete",state:t})}showDetectedToneToggleClick(t){return this.gnar.track({action:"click",eventName:"editorPlugin/showDetectedTone-toggle-click",object:"toggle",objectId:"showDetectedTone",state:t})}toneButtonClick(){return this.gnar.track({action:"click",eventName:"editorPlugin/tone-button-click",object:"button",objectId:"tone"})}tonePopupShow(){return this.gnar.track({action:"show",eventName:"editorPlugin/tone-popup-show",object:"popup",objectId:"tone"})}turnOffButtonClick(){return this.gnar.track({action:"click",eventName:"editorPlugin/turnOff-button-click",object:"button",objectId:"turnOff"})}userFeedbackDisableButtonClick(t,e,n){return this.gnar.track({action:"click",eventName:"editorPlugin/userFeedbackDisable-button-click",object:"button",objectId:"userFeedbackDisable",initiatedBy:t,placement:e,url:n})}userFeedbackFormSuccess(t,e,n){return this.gnar.track({action:"success",eventName:"editorPlugin/userFeedback-form-success",object:"form",objectId:"userFeedback",feedbackRating:t,feedbackComment:e,url:n})}userFeedbackPopupClose(t,e){return this.gnar.track({action:"close",eventName:"editorPlugin/userFeedback-popup-close",object:"popup",objectId:"userFeedback",dismissedBy:t,url:e})}userFeedbackPopupShow(t,e){return this.gnar.track({action:"show",eventName:"editorPlugin/userFeedback-popup-show",object:"popup",objectId:"userFeedback",initiatedBy:t,url:e})}viewSuggestionsButtonClick(){return this.gnar.track({action:"click",eventName:"editorPlugin/viewSuggestions-button-click",object:"button",objectId:"viewSuggestions"})}viewSuggestionsToggleClick(t){return this.gnar.track({action:"click",eventName:"editorPlugin/viewSuggestions-toggle-click",object:"toggle",objectId:"viewSuggestions",state:t})}}var ge="com.grammarly.plugin",fe={dialect:null,isEnabled:!0,showDetectedTone:!0,showUnderlines:!0,shownCardIntro:!1,toneMenuCount:0,showAutocomplete:!0},ve=Object.keys(fe);var _e=new ue(class{constructor(t){pt(this,"_S",void 0),pt(this,"_T",void 0),pt(this,"_U",void 0),pt(this,"_logger",new c("PreferencesManager")),this._U=t,this._T=f(this._V()),this._S=new p,Jt()&&(this._S.emitter(t.window).on("storage",(t=>{(null==t.key||t.key.startsWith(ge))&&this._W()})),this._S.emitter(this._T).on("@updated",(()=>{window.dispatchEvent(new CustomEvent("grammarlyConfigChange"))})))}get state(){return this._T}setSiteState(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:fe[t];this._X(this._U.sessionStorage,{[t]:e}),this._X(this._U.localStorage,{[t]:e}),this._W()}setSessionState(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:fe[t];this._X(this._U.sessionStorage,{[t]:e}),this._W()}_W(){var t=this._V();ve.forEach((e=>{this._T.set(e,t[e])}))}_V(){var t=_t({},fe);try{var e=this._Y(this._U.localStorage);Object.assign(t,e)}catch(t){this._logger.error("Failed to read local storage",t)}try{var n=this._Y(this._U.sessionStorage);Object.assign(t,n)}catch(t){this._logger.error("Failed to read session storage",t)}return t}_Y(t){var e={};return ve.forEach((n=>{var i="".concat(ge,".").concat(n),r=t.getItem(i);if(null!=r)try{e[n]=JSON.parse(r)}catch(t){this._logger.error("Failed to parse",t)}})),e}_X(t,e){ve.forEach((n=>{if(n in e){var i="".concat(ge,".").concat(n),r=e[n];try{null==r?t.removeItem(i):t.setItem(i,JSON.stringify(r))}catch(t){this._logger.error("Failed to write",t)}}}))}dispose(){this._S.dispose()}},{window:globalThis,localStorage:globalThis.localStorage,sessionStorage:globalThis.sessionStorage}),pe="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";function be(t){for(var e="",n=0;n<t;++n)e+=pe.charAt(Math.floor(Math.random()*pe.length));return e}var me="".concat(ge,".gnarContainerId");function ye(){var t,e=null!==(t=function(){if("undefined"!=typeof location&&/(?:^|\.)(grammarly.com|ppgr.io|qagr.io)$/.test(location.hostname)){try{var t=/gnar_containerId=([^;]+)/.exec(document.cookie);if(null!=t)return t[1]}catch(t){}try{var e=localStorage.getItem("gnar_containerId");if(null!=e)return e}catch(t){}}try{var n=localStorage.getItem(me);if(null!=n)return n.startsWith('"')?JSON.parse(n):n}catch(t){}return null}())&&void 0!==t?t:be(10);try{localStorage.setItem(me,e)}catch(t){}return e}var we="editorPlugin";var ke=new ue(class{constructor(){var t=this;pt(this,"containerId",ye()),pt(this,"_Z",Rt(0)),pt(this,"_0",[]),pt(this,"_1",new URL("/events-with-token",It("gnar")).toString()),pt(this,"_logger",new c("TrackingService")),pt(this,"_2",void 0),pt(this,"_3",null);var e,n="undefined"!=typeof document?{runtimeType:"browser",url:location.href,referrer:document.referrer,userAgent:navigator.userAgent,containerWidth:document.documentElement.clientWidth||document.body.clientWidth,containerHeight:document.documentElement.clientHeight||document.body.clientHeight,screenWidth:screen.width,screenHeight:screen.height,devicePixelRatio:window.devicePixelRatio}:{runtimeType:"nodejs"},i={client:we,clientVersion:St,containerId:this.containerId,instanceId:be(8),isTest:!1};this._2=new de({track:(e=mt((function*(e){var r=_t(_t(_t({},n),e),i);null==t._3?t._0.push(r):yield t._M([r])})),function(t){return e.apply(this,arguments)})}),this._0.push(_t(_t({eventName:"".concat(we,"/ping")},n),i))}setAuthProvider(t){this._3=t,this._0.length>0&&(Mt(this._M(this._0.slice())),this._0.length=0)}track(t,e){Mt(this._4(t,e))}_4(t,e){var n=this;return mt((function*(){var i=n._2[t];try{yield i.apply(n._2,e)}catch(t){n._logger.error(t)}}))()}_M(t){var e=this;return mt((function*(){var n=t.map((t=>{var e;return null!==(e=t.eventName)&&void 0!==e?e:"n/a"})),i=null,r=null;try{if(null==e._3)throw new ot(1,[]);if(i=yield e._3.createAccessToken(),null==(r=e._3.state.user))throw new ot(2,[]);var s=r.id,o=e._3.getClientId(),a=e._Z.next();yield oe(e._1,{jwt:i,events:t.map((t=>_t(_t({},t),{},{batchId:a,clientId:o,userId:s})))})}catch(t){e._logger.error("GnarSend",t,{jwt:Boolean(i),user:r,eventNames:n})}}))()}});class xe{constructor(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};pt(this,"_5",void 0),pt(this,"_U",void 0),pt(this,"_6",[]),pt(this,"_7",Date.now()),pt(this,"_8",null),pt(this,"_9",(()=>{void 0!==globalThis.document?"hidden"===globalThis.document.visibilityState&&this._P():this._P()})),this._5=t,this._U=_t({size:25,duration:5e3},e),void 0!==globalThis.document&&globalThis.document.addEventListener("visibilitychange",this._9)}write(t){this._6.push(...t),this._$()}dispose(){this._a(),void 0!==globalThis.document&&globalThis.document.removeEventListener("visibilitychange",this._9)}_$(){this._6.length>=this._U.size||this._7+this._U.duration<Date.now()?this._P():null==this._8&&(this._8=setTimeout((()=>{this._8=null,this._$()}),this._U.duration))}_P(){this._7=Date.now(),this._5.write([...this._6]),this._a(),this._6.length=0}_a(){null!=this._8&&(clearTimeout(this._8),this._8=null)}}class Ee{constructor(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:t=>t;pt(this,"_Q",void 0),pt(this,"_R",void 0),this._Q=t,this._R=e}write(t){oe(this._Q,this._R(t))}}var Se=new class{constructor(t,e){pt(this,"_5",void 0),pt(this,"_S",void 0),pt(this,"_T",void 0),this._T=e,this._S=t,this._5=new Ee("".concat(t,"/batch/log"),(t=>t.map((t=>{var e=t.message,n={message:"string"==typeof e.message?e.message:e.message.message,exception:"string"==typeof e.message?e.data.find((t=>t instanceof Error)):e.message};return _t(_t(_t({},this._T),n),{},{logger:t.logger.name,level:t.level,extra:{data:e.data.length>0?e.data:void 0}})}))))}setExtra(t){this._T=_t(_t({},this._T),t)}write(t){this._U(t.filter((t=>"log"===t.type))),this._V(t.filter((t=>"counter"===t.type)))}_U(t){0!==t.length&&this._5.write(t)}_V(t){if(0!==t.length){var e={};for(var n of t){var i;if("counter"===n.type)e[n.metric]=(null!==(i=e[n.metric])&&void 0!==i?i:0)+1}var r=this._T.env,s=Object.entries(e).map((t=>{var[e,n]=t;return"c.".concat(r,".").concat(e,"=").concat(n)})).join("&");Yt("".concat(this._S,"/ts?").concat(s))}}}(Tt.felog,{application:"js-plugin",version:"1.7.5",env:Ot(),context:_t({},function(){if(Jt())return{userAgent:globalThis.navigator.userAgent,windowWidth:window.innerWidth,windowHeight:window.innerHeight,origin:globalThis.location.origin};return{}}())}),Te=!1;var Ae={init:function(){if(!Te){Te=!0;var t=new o(100);c.writers.add(t),function(t,e){var n;(null!==(n=Dt.Grammarly)&&void 0!==n?n:Dt.Grammarly={})[t]=e}("printLogs",(()=>{t.printToConsole()})),c.level="INFO",c.writers.add(new xe(Se)),u.count("session")}return u},getLogger:function(t){return new c(t)},setContext:function(t){null!=Se&&Se.setExtra(t)},count:function(t){return u.count(t)},track:function(t){if(Te){for(var e=arguments.length,n=new Array(e>1?e-1:0),i=1;i<e;i++)n[i-1]=arguments[i];ke.getInstance().track(t,n)}}};function Oe(t){for(var e,n,i=(new DOMParser).parseFromString(t,"text/html"),r="P"===(null===(e=i.body.childNodes[0])||void 0===e?void 0:e.nodeName)?i.body.childNodes[0]:i.body,s=Array.from(null!==(n=null==r?void 0:r.childNodes)&&void 0!==n?n:[]),o=[],a=null==r?void 0:r.nextSibling;null!=a;)o.push(a),a=a.nextSibling;return[...s,...o].flatMap((t=>Ie(t)))}function Ie(t){if(null==t)return[];switch(t.nodeName){case"#text":var e,n=null===(e=t.textContent)||void 0===e?void 0:e.replace("\n","");return null==n||0===n.length?[]:[n];case"BR":return[];case"I":return[{type:"em",children:Pe(t)}];case"B":return[{type:"strong",children:Pe(t)}];case"UL":return[{type:"ul",children:Pe(t)}];case"LI":return[{type:"li",children:Pe(t)}];case"P":return Pe(t);default:return u.warn("parseExplanationNode: unknown node:",t),Pe(t)}}function Pe(t){var e;return Array.from(null!==(e=t.childNodes)&&void 0!==e?e:[]).flatMap(Ie)}It("feedback");class Ce{constructor(t,e){pt(this,"start",void 0),pt(this,"end",void 0),this.start=t,this.end=e}toString(){return"[".concat(this.start,", ").concat(this.end,"]")}static equals(t,e){return t.start===e.start&&t.end===e.end}static contains(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return e.start>=t.start&&(n?e.start<=t.end:e.start<t.end)&&e.end>=t.start&&e.end<=t.end}}var je=new Map;function Re(){return Re=mt((function*(t){var e,n=null!==(e=je.get(t))&&void 0!==e?e:te(mt((function*(){var e,n=new URL("".concat(It("clientInfo"),"/").concat(t)),{result:i,error:r}=yield ee({fn:(e=mt((function*(t){var{tryNo:e}=t;return e>0&&n.searchParams.set("retry",e.toString()),yield Ft(n.toString())})),function(t){return e.apply(this,arguments)})});if(null!=i)return i;if(null==r)throw new ot(10,[]);throw r})));return je.set(t,n),yield n()})),Re.apply(this,arguments)}function Le(t){return btoa(function(t){return String.fromCharCode.apply(null,Array.from(new Uint8Array(t)))}(t)).replace(/[=]+$/,"").replace(/[+]/g,"-").replace(/[/]/g,"_")}class Ne{constructor(t,e){pt(this,"_X",void 0),pt(this,"_Y",void 0),this._X=t,this._Y=e}authenticate(){var t=this;return mt((function*(){var e,{result:n,error:i}=yield ee({maxRetries:7,fn:(e=mt((function*(e){var{tryNo:n,abort:i}=e;try{var r=It("anonymousToken")+(n>0?"?retry=".concat(n):""),s=yield Ft(r,{method:"POST",body:JSON.stringify({client_id:t._X,grant_type:"Desktop"===t._Y()?"urn:ietf:params:oauth:grant-type:client_id":"urn:ietf:params:oauth:grant-type:origin"})});return{accessToken:s.access_token,refreshToken:s.refresh_token,expiresAt:Date.now()+s.expires_in}}catch(n){throw n instanceof Ut&&(function(t){400===t.status&&"Invalid origin"===t.message&&Jt()&&console.info("The current origin (".concat(String(window.location.origin),") has not been allowed for the Grammarly Editor SDK"))}(n),n.status>=400&&n.status<=499&&429!==n.status&&i()),n}})),function(t){return e.apply(this,arguments)})});if(null!=n)return n;if(null!=i)throw i;throw new ot(11,[])}))()}}var Me=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]);function De(t,e,n,i,r){for(var s,o,a,c,u,l,h,d,g,f,v,_,p;r>=64;){for(s=e[0],o=e[1],a=e[2],c=e[3],u=e[4],l=e[5],h=e[6],d=e[7],f=0;f<16;f++)v=i+4*f,t[f]=(255&n[v])<<24|(255&n[v+1])<<16|(255&n[v+2])<<8|255&n[v+3];for(f=16;f<64;f++)_=((g=t[f-2])>>>17|g<<15)^(g>>>19|g<<13)^g>>>10,p=((g=t[f-15])>>>7|g<<25)^(g>>>18|g<<14)^g>>>3,t[f]=(_+t[f-7]|0)+(p+t[f-16]|0);for(f=0;f<64;f++)_=(((u>>>6|u<<26)^(u>>>11|u<<21)^(u>>>25|u<<7))+(u&l^~u&h)|0)+(d+(Me[f]+t[f]|0)|0)|0,p=((s>>>2|s<<30)^(s>>>13|s<<19)^(s>>>22|s<<10))+(s&o^s&a^o&a)|0,d=h,h=l,l=u,u=c+_|0,c=a,a=o,o=s,s=_+p|0;e[0]+=s,e[1]+=o,e[2]+=a,e[3]+=c,e[4]+=u,e[5]+=l,e[6]+=h,e[7]+=d,i+=64,r-=64}return i}class Ue{constructor(){pt(this,"digestLength",32),pt(this,"blockSize",64),pt(this,"state",new Int32Array(8)),pt(this,"temp",new Int32Array(64)),pt(this,"buffer",new Uint8Array(128)),pt(this,"bufferLength",0),pt(this,"bytesHashed",0),pt(this,"finished",!1),this.reset()}reset(){return this.state[0]=1779033703,this.state[1]=3144134277,this.state[2]=1013904242,this.state[3]=2773480762,this.state[4]=1359893119,this.state[5]=2600822924,this.state[6]=528734635,this.state[7]=1541459225,this.bufferLength=0,this.bytesHashed=0,this.finished=!1,this}clean(){for(var t=0;t<this.buffer.length;t++)this.buffer[t]=0;for(var e=0;e<this.temp.length;e++)this.temp[e]=0;this.reset()}update(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:t.length;if(this.finished)throw new ot(12,[]);var n=0;if(this.bytesHashed+=e,this.bufferLength>0){for(;this.bufferLength<64&&e>0;)this.buffer[this.bufferLength++]=t[n++],e--;64===this.bufferLength&&(De(this.temp,this.state,this.buffer,0,64),this.bufferLength=0)}for(e>=64&&(n=De(this.temp,this.state,t,n,e),e%=64);e>0;)this.buffer[this.bufferLength++]=t[n++],e--;return this}finish(t){if(!this.finished){var e=this.bytesHashed,n=this.bufferLength,i=e/536870912|0,r=e<<3,s=e%64<56?64:128;this.buffer[n]=128;for(var o=n+1;o<s-8;o++)this.buffer[o]=0;this.buffer[s-8]=i>>>24&255,this.buffer[s-7]=i>>>16&255,this.buffer[s-6]=i>>>8&255,this.buffer[s-5]=i>>>0&255,this.buffer[s-4]=r>>>24&255,this.buffer[s-3]=r>>>16&255,this.buffer[s-2]=r>>>8&255,this.buffer[s-1]=r>>>0&255,De(this.temp,this.state,this.buffer,0,s),this.finished=!0}for(var a=0;a<8;a++)t[4*a+0]=this.state[a]>>>24&255,t[4*a+1]=this.state[a]>>>16&255,t[4*a+2]=this.state[a]>>>8&255,t[4*a+3]=this.state[a]>>>0&255;return this}digest(){var t=new Uint8Array(this.digestLength);return this.finish(t),t}_Z(t){for(var e=0;e<this.state.length;e++)t[e]=this.state[e]}_0(t,e){for(var n=0;n<this.state.length;n++)this.state[n]=t[n];this.bytesHashed=e,this.finished=!1,this.bufferLength=0}}function Fe(t){var e=(new Ue).update(t),n=e.digest();return e.clean(),n}class Be{constructor(t){pt(this,"_X",void 0),this._X=t}createAuthorizationRequest(t){var e=this;return mt((function*(){var{scopes:n,redirectUri:i,mode:r,state:s}=t,o=function(t){var e=new Uint16Array(t);if("undefined"==typeof crypto){for(var n=0;n<t;++n)e[n]=65535*Math.random()|0;return Le(e)}return Le(crypto.getRandomValues(e))}(32),a=yield function(t){return qe.apply(this,arguments)}(o),c=It("consentScreen");return{origin:new URL(c).origin,authorizeUrl:"".concat(c,"?")+["scopes=".concat(encodeURIComponent(n.join(" "))),"redirect_uri=".concat(encodeURIComponent(i)),"client_id=".concat(e._X),"response_mode=".concat(r),"code_challenge=".concat(encodeURIComponent(a)),"state=".concat(encodeURIComponent(null!=s?s:""))].join("&"),codeVerifier:o}}))()}exchangeCode(t,e){var n=this;return mt((function*(){var i=yield Ft(It("oauth2Token"),{method:"POST",body:JSON.stringify({client_id:n._X,grant_type:"authorization_code",authorization_code:t,code_verifier:e})});return n._1(i)}))()}refresh(t){var e=this;return mt((function*(){var n=yield Ft(It("oauth2Token"),{method:"POST",body:JSON.stringify({client_id:e._X,grant_type:"refresh_token",refresh_token:t})});return e._1(n)}))()}_1(t){return{accessToken:t.access_token,refreshToken:t.refresh_token,expiresAt:Date.now()+18e4}}}function qe(){return qe=mt((function*(t){var e=(new TextEncoder).encode(t);return"undefined"==typeof crypto||void 0===crypto.subtle?Le(Fe(e)):Le(yield crypto.subtle.digest("SHA-256",e))})),qe.apply(this,arguments)}var Je=new ue(class{constructor(){pt(this,"tokens",null),pt(this,"tokensPromise",null)}}),$e="com.grammarly.plugin.refresh_token",He="com.grammarly.plugin.connected_account";var We=new ue(class extends d{constructor(t,e){var n;super(),n=this,pt(this,"_u",void 0),pt(this,"_T",void 0),pt(this,"_2",void 0),pt(this,"_3",void 0),pt(this,"_4",void 0),pt(this,"_logger",Ae.getLogger("AuthManager")),pt(this,"_X",void 0),pt(this,"_5",void 0),pt(this,"_6",void 0),Ae.setContext({clientId:t}),this._X=t,this._5=Jt()?window.origin:"",this._u=e,this._2=new Be(t),this._3=new Ne(t,(()=>{var t;return null===(t=this._T.clientInfo)||void 0===t?void 0:t.type})),this._4=Je.getInstance(),this._T=f({clientInfo:null,user:null,activeRequest:null,connectedAccountStatus:e.getItem(He)}),this._6=new Promise((e=>{mt((function*(){try{n._T.clientInfo=yield function(t){return Re.apply(this,arguments)}(t)}catch(t){n._logger.error(t)}finally{e()}}))()})),this.state.addEventListener("user",(t=>{var e=t.detail.value,n=t.detail.previousValue;this.dispatchEvent("userTokenChange",null),null!=e&&null!=n&&e.isAnonymous!==n.isAnonymous&&this.dispatchEvent("reconnect",e.isAnonymous?"account-disconnected":"account-connected")})),this.state.addEventListener("connectedAccountStatus",(()=>{this.dispatchEvent("userAccountStatusChange",null)})),this.state.addEventListener("clientInfo",(()=>{this.dispatchEvent("userAccountStatusChange",null)}))}get state(){return this._T}setRedirectUri(t){this._5=t}get redirectUri(){return this._5}getAccessToken(){var t=this;return mt((function*(){return yield t.createAccessToken()}))()}createAccessToken(){var t=this;return mt((function*(){if(yield t._6,null!=t._4.tokens&&Date.now()<t._4.tokens.expiresAt)return t._4.tokens.accessToken;if(null!=t._4.tokensPromise){var e,n,{accessToken:i}=yield t._4.tokensPromise.promise;return null!==(e=null===(n=t._4.tokens)||void 0===n?void 0:n.accessToken)&&void 0!==e?e:i}var r=Pt(t._7().then(function(){var e=mt((function*(e){return r.isCancelled||(yield t._8(e)),e}));return function(t){return e.apply(this,arguments)}}()));try{return t._4.tokens=null,t._4.tokensPromise=r,(yield r.promise).accessToken}finally{t._4.tokensPromise=null}}))()}setAccountStatus(t){var e=this;return mt((function*(){yield e._9(t)}))()}createOAuthRequest(t){var e=this;return mt((function*(){var n;if(yield e._6,!0!==(null===(n=e._T.clientInfo)||void 0===n?void 0:n.oauthEnabled))return null;switch(e._T.clientInfo.type){case"Desktop":t.mode="redirect_json";break;case"Web":t.mode="web_message"}return yield e._2.createAuthorizationRequest(t)}))()}handleOAuthCallback(t){var e=this;return mt((function*(){var n,{code:i,codeVerifier:r}=t;r===(null===(n=e._T.activeRequest)||void 0===n?void 0:n.codeVerifier)&&(e._T.activeRequest=null);try{var s,o=yield e._2.exchangeCode(i,r);null===(s=e._4.tokensPromise)||void 0===s||s.cancel(),yield e._8(o)}catch(i){e._logger.error("OAuthCallback failed",i),yield e._9("failed"),e._logger.count("auth.failed")}}))()}logout(){var t=this;return mt((function*(){var e;null===(e=t._4.tokensPromise)||void 0===e||e.cancel(),yield Kt(t._u,$e,(()=>{t._u.removeItem($e)})),t._4.tokens=null,t._T.user=null,yield t._9(null)}))()}getAccountStatus(){return this._T.connectedAccountStatus}getAuthorizeUrl(t){var e=this;return mt((function*(){return yield e.createOAuthRequest(t)}))()}exchangeAuthorizationCode(t,e){var n=this;return mt((function*(){yield n.handleOAuthCallback({code:t,codeVerifier:e})}))()}getClientId(){return this._X}getUser(){return this._T.user}getAppId(){var t,e;return null!==(t=null===(e=this._T.clientInfo)||void 0===e?void 0:e.appId)&&void 0!==t?t:null}setActiveOAuthRequest(t){this._T.activeRequest=t}_9(t){var e=this;return mt((function*(){yield Kt(e._u,He,(()=>{null==t?e._u.removeItem(He):e._u.setItem(He,t),e._T.connectedAccountStatus=t}))}))()}_8(t){var e=this;return mt((function*(){yield e._$(t.refreshToken);var{sub:n}=JSON.parse(atob(t.accessToken.split(".")[1]));e._4.tokens=t,e._T.user={id:n,isAnonymous:n.startsWith("-")},Ae.setContext({userId:n}),e._T.user.isAnonymous?"connected"===e._T.connectedAccountStatus&&(yield e._9("disconnected")):yield e._9("connected")}))()}_$(t){var e=this;return mt((function*(){yield Kt(e._u,$e,(()=>{e._u.setItem($e,t)}))}))()}_7(){var t=this;return mt((function*(){var e;if(null!=t._u.getItem($e)){var n;try{yield Kt(t._u,$e,mt((function*(){var e="com.grammarly.plugin.refresh_token_worker.",i=e+$t();t._u.setItem(i,String(Date.now()));var r=t._u.getItem($e);if(t._u.removeItem($e),null!=r)try{n=yield t._2.refresh(r)}catch(n){if(n instanceof Ut&&500===n.status&&"Unable to update token"===n.message){for(var s=[],o=0;o<t._u.length;++o){var a=t._u.key(o);!0===(null==a?void 0:a.startsWith(e))&&s.push(a)}t._logger.warn("Possible refreshToken reuse",{lock:[t._u.getItem($e+"__$$MUTEX_x"),t._u.getItem($e+"__$$MUTEX_y")],threads:s.map((e=>({id:e,startedAt:t._u.getItem(e)})))})}t._u.removeItem($e)}t._u.removeItem(i)})))}catch(e){t._logger.error("Failed to get a lock on refreshToken",e)}if(null!=n)return n}return yield t._3.authenticate()}))()}});function Ve(){return Ve=mt((function*(t){var e,n=new URL(t).searchParams.get("code"),i=We.hasConstructorParameters?We.getInstance():null,r=null==i||null===(e=i.state.activeRequest)||void 0===e?void 0:e.codeVerifier;if(null==i)throw new ot(6,[]);if(null==r)throw new ot(7,[]);if(null==n)throw new ot(8,[t]);try{yield i.handleOAuthCallback({code:n,codeVerifier:r})}finally{i.setActiveOAuthRequest(null)}})),Ve.apply(this,arguments)}var Ge={Correctness:10,Clarity:20,Engagement:30,Tone:40,"Style guide":0,Originality:50};function ze(t){var e=Ge[t.cardLayout.outcome];return null!=e?e:60}function Ke(t,e){var n,i,r,s,o=null!==(n=null===(i=t.transformJson)||void 0===i?void 0:i.context.s)&&void 0!==n?n:Math.min(t.begin,t.highlightBegin),a=null!==(r=null===(s=t.transformJson)||void 0===s?void 0:s.context.e)&&void 0!==r?r:Math.min(t.end,t.highlightEnd),c=a-o,u=e.transformPosition(o),l=e.transformPosition(a),h=l-u;return u===o&&l===a&&h===c?t:c!==h?null:_t(_t({},t),{},{highlightBegin:e.transformPosition(t.highlightBegin),highlightEnd:e.transformPosition(t.highlightEnd),begin:e.transformPosition(t.begin),end:e.transformPosition(t.end),transformJson:null!=t.transformJson?Xe(t.transformJson,e):void 0})}function Xe(t,e){var{context:n,highlights:i,alternatives:r}=t;return{context:{s:e.transformPosition(n.s),e:e.transformPosition(n.e)},highlights:i,alternatives:r}}class Qe extends d{constructor(t){super(),pt(this,"_nb",void 0),pt(this,"_bb",void 0),pt(this,"_ob",void 0),this._nb=t,this._bb=new p,this._ob=new Set,this._bb.emitter(t).on("suggestion",(t=>{var e=this._pb(t.detail);null!=e&&(this._ob.add(e.id),this.dispatchEvent("suggestionAdded",[e]))})).on("suggestionRemoved",(t=>{var e=this._qb(t.detail.id);this._ob.delete(e),this.dispatchEvent("suggestionRemoved",[{id:e}])})).on("connecting",(()=>{this.dispatchEvent("suggestionRemoved",Array.from(this._ob).map((t=>({id:t})))),this._ob.clear()}))}accept(t){var e=arguments,n=this;return mt((function*(){var i=e.length>1&&void 0!==e[1]?e[1]:0;yield n._nb.accept(n._rb(t),i)}))()}dismiss(t){var e=arguments,n=this;return mt((function*(){var i=e.length>1&&void 0!==e[1]?e[1]:"unknown";yield n._nb.dismiss(n._rb(t),i)}))()}show(t){var e=this;return mt((function*(){yield e._nb.cardShown(e._rb(t))}))()}resolveConflict(t,e){if(null==t.rawAlert||null==e.rawAlert)throw new ot(9,[]);return function(t,e){return k(Ye(t),Ye(e))}(e,t)||function(t,e){var n,i,r,s,o=t.rawAlert,a=e.rawAlert,c=parseInt(null!==(n=null===(i=o.extra_properties)||void 0===i?void 0:i.priority)&&void 0!==n?n:"0",10),u=parseInt(null!==(r=null===(s=a.extra_properties)||void 0===s?void 0:s.priority)&&void 0!==r?r:"0",10);if(o.free!==a.free)return o.free;if("Spelling"===o.group&&"Spelling"===a.group||"ContextualSpelling"===o.group&&"ContextualSpelling"===a.group)return c>=u;if("Spelling"===o.group)return!0;if("Spelling"===a.group)return!1;return c<=u}(e,t)?"incoming":"current"}rebase(t,e){return Ke(t,e)}_pb(t){if("ToneDetection"!==t.category&&!t.muted&&!0!==t.hidden)return{id:this._qb(t.id),type:"critical"===t.impact||"Correctness"===t.cardLayout.outcome?"corrective":"Vox"===t.cardLayout.outcome?"styleguide":"advanced",title:t.minicardTitle,description:Oe(t.explanation),sortOrder:ze(t),transformJson:null!=t.transformJson?t.transformJson:this._sb(t),experimental_point:t.point,rawAlert:t}}_sb(t){var e=Math.min(t.begin,t.highlightBegin),n=Math.min(t.end,t.highlightEnd),i=(new et).insert(t.text);return{context:{s:e,e:n},highlights:[{s:t.highlightBegin-e,e:t.highlightEnd-e}],alternatives:t.replacements.map((t=>i.diff((new et).insert(t)).toRaw()))}}_qb(t){return"_".concat(String(t))}_rb(t){return parseInt(t.slice(1),10)}dispose(){super.dispose(),this._bb.dispose()}}var Ye=t=>{var e=t.rawAlert;return{transformJson:t.transformJson,priority:null==e?void 0:e.extra_properties.priority,free:null==e?void 0:e.free,group:null==e?void 0:e.group,outcome:null==e?void 0:e.cardLayout.outcome,category:null==e?void 0:e.category}};var Ze="undefined"!=typeof navigator,tn=new ue(class{constructor(t,e){pt(this,"_logger",new c("TimeKeeper")),pt(this,"_U",void 0),pt(this,"_tb",void 0),pt(this,"_ub",void 0),pt(this,"_vb",void 0),pt(this,"_wb",void 0),this._U=t,this._tb=e,this._wb=Rt(),this._vb={idle:new Map,animation:new Map,default:new Map},this._ub={}}requestAnimationFrame(t,e){return this._xb("animation",t,e)}requestIdleCallback(t,e){return this._xb("idle",t,e)}requestCallback(t,e){return this._xb("default",t,e)}_xb(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:2e3,i={id:this._wb.next(),runnable:e,deadline:performance.now()+n};return this._vb[t].set(i.id,i),this._yb(t),{dispose:()=>{this._vb[t].delete(i.id)}}}_yb(t){0!==this._vb[t].size&&null==this._ub[t]&&(this._ub[t]=this._tb[t]((e=>{var n=null==e?this._U.maxRunDuration:"number"==typeof e?Math.max(0,performance.now()-e):e.timeRemaining();this._zb(t,Math.min(this._U.maxRunDuration,n))})))}_zb(t,e){var n=this,i=performance.now(),r=i+e,s=new Map(this._vb[t]),o=()=>Math.max(0,r-performance.now()),a=function(e){var i=arguments.length>1&&void 0!==arguments[1]&&arguments[1];s.delete(e.id),n._vb[t].delete(e.id),e.runnable({didTimeout:i,timeRemaining:o})};for(var c of s.values()){if(!(o()>0))break;a(c)}for(var u of s.values())u.deadline<i&&a(u);this._ub[t]=void 0,this._yb(t)}},{maxRunDuration:Ze?5:50},{default:t=>setTimeout(t),animation:Ze&&void 0!==window.requestAnimationFrame?t=>window.requestAnimationFrame(t):t=>setTimeout(t,1e3/60),idle:Ze&&void 0!==window.requestIdleCallback?t=>window.requestIdleCallback(t):t=>setTimeout(t,1e3/60)});class en extends d{constructor(t){super(),pt(this,"_T",void 0),pt(this,"_bb",new p),pt(this,"_ab",void 0),pt(this,"_Ab",new Map),pt(this,"_ob",new Map),pt(this,"_logger",Ae.getLogger("SuggestionManager")),pt(this,"_Bb",tn.getInstance()),pt(this,"_Cb",function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:he(),n={token:"",queue(){for(var i=arguments.length,r=new Array(i),s=0;s<i;s++)r[s]=arguments[s];n.token=le(),Mt(e(n.token).then((e=>{if(""!==e&&n.token===e){var i=t(...r);i instanceof Promise?i.finally((()=>{n.token=""})):n.token=""}})))},cancel(){n.token=""}};return n}((()=>{var t=Array.from(this._ob.values());this._Db=t.reduce(((t,e)=>Math.min(t,e.localRevision)),1/0),this._Db!==1/0&&Array.from(this._Eb.keys()).filter((t=>t<this._Db)).forEach((t=>this._Eb.delete(t))),this._T.suggestions=t,this._T.setAll({suggestions:t.slice().sort(((t,e)=>t.highlightBegin-e.highlightBegin)),suggestionsInPriorityOrder:t.slice().sort(((t,e)=>t.sortOrder-e.sortOrder))})}))),pt(this,"_Fb",[]),pt(this,"_Gb",!1),pt(this,"_Db",1/0),pt(this,"_Hb",0),pt(this,"_Eb",new Map),this._ab=t,this._T=f({suggestions:[],suggestionsInPriorityOrder:[],active:null}),this._Hb=t.state.revision,this._bb.emitter(t).on("change",(t=>{var{changes:e,previous:n,next:i}=t.detail;this._Eb=new Map(Array.from(this._Eb.entries()).map((t=>[t[0],t[1].compose(e)]))),this._Eb.set(n.revision,e),this._Hb=i.revision,this._Ib()})).end()}get state(){return this._T}get suggestions(){return this._T.suggestions}dispose(){super.dispose(),this._bb.dispose()}accept(t){var e=arguments,n=this;return mt((function*(){var i=e.length>1&&void 0!==e[1]?e[1]:0,r=n._Ab.get(t),s=n._ob.get(t);n._Jb(t),yield null==r?void 0:r.accept(t,i),null!=s&&n.dispatchEvent("accept",{suggestion:s,replacementIndex:i})}))()}dismiss(t){var e=arguments,n=this;return mt((function*(){var i=e.length>1&&void 0!==e[1]?e[1]:"unknown",r=n._Ab.get(t),s=n._ob.get(t);n._Jb(t),yield null==r?void 0:r.dismiss(t,i),null!=s&&n.dispatchEvent("dismiss",{suggestion:s,reason:i})}))()}setActiveSuggestion(t,e){var n,i,r=null!=t?this._ob.get(t):null;null==r?this._T.active=null:(this._T.active={source:e,suggestion:r},Mt(null===(n=this._Ab.get(r.id))||void 0===n||null===(i=n.show)||void 0===i?void 0:i.call(n,r.id)))}getSuggestion(t){var e;return null!==(e=this._ob.get(t))&&void 0!==e?e:null}clear(){this._Kb(Array.from(this._ob.values())),this._Ab.clear(),this._ob.clear(),this._Eb.clear(),this._Fb.length=0,this._T.suggestions.length=0}_Jb(t){var e=this._ob.get(t);null!=e&&this._Kb([e])}_Lb(t,e){var n=this,i=[],r=[],s=function(e){var s=n._Mb(e);if(!n._Nb(s)||!n._Ob(s))return"continue";var o=Array.from(n._ob.values()).find((e=>n._Ab.get(e.id)===t&&(e.id!==s.id&&function(t,e){return Ce.equals(nn(t),nn(e))||Ce.equals(rn(t),rn(e))}(e,s))));if(null!=o)switch(t.resolveConflict(o,s)){case"current":return"continue";case"incoming":i.push(o)}n._ob.has(s.id)||r.push(s),n._Ab.set(s.id,t),n._ob.set(s.id,s)};for(var o of e)s(o);this._Kb(i),r.length>0&&(this._Cb.queue(),this.dispatchEvent("added",r))}_Mb(t){var{transformJson:e}=t,n=e.context.s+Math.min(...e.highlights.map((t=>t.s))),i=e.context.s+Math.min(...e.highlights.map((t=>t.e))),r=e.context.s,s=e.context.e;return _t(_t({},t),{},{localRevision:this._Hb,highlightBegin:n,highlightEnd:i,highlightText:this._ab.text.slice(n,i).toPlainText(),begin:r,end:s,text:this._ab.text.slice(r,s).toPlainText()})}_Kb(t){var e=[];for(var n of t){var i=this._ob.get(n.id);this._Ab.delete(n.id),this._ob.delete(n.id),null!=i&&e.push(i)}e.length>0&&(this._Cb.queue(),this.dispatchEvent("removed",e))}_Pb(t){var e=[];for(var n of t)this._ob.has(n.id)&&(this._ob.set(n.id,n),e.push(n));e.length>0&&(this.dispatchEvent("updated",e),this._Cb.queue())}_Nb(t){var e=new Ce(0,this._ab.text.length),n=rn(t),i=nn(t),r=t.transformJson.highlights.some((t=>"prompt"===t.type));return Ce.contains(e,n,r)&&Ce.contains(e,i)}_Ob(t){var e=this._ab.text.slice(t.begin,t.end).toPlainText()===t.text,n=this._ab.text.slice(t.highlightBegin,t.highlightEnd).toPlainText()===t.highlightText;return e&&n}register(t){var e=(new p).emitter(t).on("suggestionAdded",(e=>this._Lb(t,e.detail))).on("suggestionRemoved",(t=>this._Kb(t.detail))).on("suggestionUpdated",(t=>{this._Pb(t.detail.map((t=>this._Mb(t))))})).end();return this._bb.add(e),e}_Ib(){var{start:t,end:e}=this._ab.state.priority,n=[],i=new Set(this._Fb);this._ob.forEach((r=>{t<=r.highlightEnd&&r.highlightBegin<=e?n.push(r.id):i.has(r.id)||this._Fb.push(r.id)})),Qt(0,(()=>this._Qb(n))),this._Rb()}_Rb(){this._Gb||0!==this._Fb.length&&(this._Gb=!0,this._Bb.requestIdleCallback((t=>{this._Fb=this._Qb(this._Fb,(()=>t.timeRemaining())),this._Gb=!1,this._Rb()})))}_Qb(t,e){for(var n=[],i=[],r=null==e;t.length>0&&(r||e()>1);){var s,o=t.shift();if(null!=o){var a=this._ob.get(o);if(null!=a){a.localRevision<this._Db&&(this._Db=a.localRevision);var c=this._Eb.get(a.localRevision);if(null!=c){var u=null===(s=this._Ab.get(a.id))||void 0===s?void 0:s.rebase(a,c);null==u?i.push(a):u!==a?(u.localRevision=this._Hb,n.push(u)):u.localRevision=this._Hb}}}}return this._Kb(i),this._Pb(n),t}}function nn(t){return new Ce(t.begin,t.end)}function rn(t){return new Ce(t.highlightBegin,t.highlightEnd)}var sn={encode:t=>t,decode:t=>t,getOriginalPosition:t=>t,getTransformedPosition:t=>t};class on extends d{constructor(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:sn;super(),pt(this,"_T",void 0),pt(this,"_logger2",Ae.getLogger("TextManager")),pt(this,"transformer",void 0),this._T=f({cursor:null,priority:{start:0,end:1/0},revision:0,original:new et,transformed:new et}),this.transformer=t}get state(){return this._T}get text(){return this._T.transformed}get cursor(){return this._T.cursor}setPriorityRange(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=new Ce(this.state.priority.start,this.state.priority.end),i=new Ce(Math.max(0,t.start-e/2),t.start+e/2),r={start:Math.max(0,t.start-e),end:t.end+e};k(r,this._T.priority)||Number.isFinite(n.end)&&Ce.contains(n,i,!0)||(this._T.priority=r)}setText(t,e){var n="string"==typeof t?(new et).insert(t):t,i=this.transformer.encode(n),r=this._T.revision+1,s=Qt(0,(()=>this._T.transformed.diff(i,null==e?void 0:e.index)));if(0!==s.ops.length){var o={text:this._T.transformed,cursor:this._T.cursor,revision:this._T.revision},a={text:i,cursor:e,revision:r},c={changes:s,next:a,previous:o};this._T.setAll({original:n,transformed:a.text,cursor:a.cursor,revision:a.revision}),this.dispatchEvent("change",c)}else this.setCursor(e)}setCursor(t){k(this._T.cursor,t)||(this._T.cursor=t)}reset(){this._T.setAll({priority:{start:0,end:1/0}}),this.setText(new et,null)}}var an={Variety:!0,Vocabulary:!0,Fluency:!0,OxfordComma:!1,UnnecessaryEllipses:!1,PunctuationWithQuotation:!0,StylisticFragments:!1,InformalPronounsAcademic:!1,ConjunctionAtStartOfSentence:!1,PrepositionAtTheEndOfSentence:!1,SentenceVariety:!0,SpacesSurroundingSlash:!0,SplitInfinitive:!0,MissingSpaces:!0,NounStrings:!0,PassiveVoice:!1,PossiblyBiasedLanguageHumanRights:!0,PossiblyBiasedLanguageHumanRightsRelated:!0,ReadabilityFillerwords:!0,ReadabilityTransforms:!0,PersonFirstLanguage:!0,PossiblyBiasedLanguageGenderRelated:!0,PossiblyBiasedLanguageLgbtRelated:!0,PossiblyOutdatedLanguageLgbtRelated:!0,PossiblyBiasedLanguageLgbtqiaRelated:!0,ReclaimedLanguage:!0,PossiblyBiasedLanguage:!0,NumbersZeroThroughTen:!0,NumbersBeginningSentences:!0,PossiblyPoliticallyIncorrectLanguage:!0,PossiblyBiasedLanguageRaceEthnicityRelated:!0,PossiblyBiasedLanguageAgeRelated:!0,PossiblyBiasedLanguageDisabilityRelated:!0,PossiblyBiasedLanguageFamilyRelated:!0};function cn(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=[],n=_t(_t({},an),t);for(var[i,r]of Object.entries(n))r||e.push(i);return e}function un(t,e){if(null!=t)return t;if(null==e||"auto-text"===e)return"undefined";if("auto-browser"===e||"auto"===e){var{locale:n}=Intl.NumberFormat().resolvedOptions();switch(n){case"en-GB":case"en-IN":return"british";case"en-AU":case"en-NZ":return"australian";case"en-CA":return"canadian"}return"undefined"}return e}class ln extends Error{constructor(t,e){super(e),pt(this,"event",void 0),this.event=t}}class hn extends d{constructor(t,e){var n,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:3e3;super(),n=this,pt(this,"_logger",Ae.getLogger("CapiManager")),pt(this,"_2b",null),pt(this,"_3b",void 0),pt(this,"_4b",null),pt(this,"_5b",void 0),pt(this,"_6b",new Map),pt(this,"_bb",void 0),pt(this,"_7b",void 0),pt(this,"_8b",void 0),pt(this,"_T",void 0),pt(this,"_9b",void 0),pt(this,"_ab",void 0),pt(this,"_$b",void 0),pt(this,"_ac",void 0),pt(this,"_ic",null),pt(this,"_jc",0);var s=Ot();this._ac=r,this._ab=e,this._$b={text:new et,revision:0},this._T=f({isActive:!1,status:"idle",config:i}),this._7b=Rt(),this._8b=Rt(),this._5b=new ft("dev"===s?"preprod":s,function(){var e=mt((function*(e){var n=new URL(e),i=yield t.createAccessToken();return n.searchParams.set("accessToken",i),new WebSocket(n)}));return function(t){return e.apply(this,arguments)}}());var o=function(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),i=1;i<e;i++)n[i-1]=arguments[i];return jt(n,t)}((()=>{var{dialect:t,context:e}=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=t.documentDialect,n=un(_e.getInstance().state.dialect,e),i={domain:t.documentDomain,dialect:n};return{dialect:n,context:i}}(this._T.config);return{dialect:t,documentContext:e,partnerConfiguration:{muteCategories:cn(this._T.config.suggestions)}}}),[this.state,["config"]],[_e.getInstance().state,["dialect"]]);o.addEventListener("value",function(){var t=mt((function*(t){var{value:e,previousValue:i}=t.detail;k(e.documentContext,i.documentContext)||(yield n._bc(function(){var t=mt((function*(t){try{yield t.send({id:n._7b.next(),action:"set_context",documentContext:e.documentContext,rev:n._$b.revision})}catch(t){n._cc(t)}}));return function(e){return t.apply(this,arguments)}}())),k(e.partnerConfiguration.muteCategories,i.partnerConfiguration.muteCategories)||(n._9b.dispose(),yield n._dc())}));return function(e){return t.apply(this,arguments)}}()),this._9b=function(t,e){var n=null,i=null;return{currentInstance:()=>n,getInstance:()=>mt((function*(){if(null!=n)return n;if(null!=i&&!i.isCancelled)return yield i.promise;var r=i=Pt(t()),s=yield i.promise;if(i=null,r.isCancelled){if(e(s),null!=n)return n;throw new Ct("cancelled")}return n=s}))(),dispose(){null!=n&&e(n),null!=i&&i.cancel(),n=null,i=null}}}(mt((function*(){n._T.status="connecting",n.dispatchEvent("connecting",null);var t=yield n._ec(o.get("value"));return n.dispatchEvent("connected",t),t.addEventListener("_close",(()=>{var e;n._4b=null!==(e=n._4b)&&void 0!==e?e:{ok:!0},n.dispatchEvent("disconnected",n._4b),t===n._9b.currentInstance()&&n._9b.dispose()})),t})),(t=>{this.dispatchEvent("disconnecting",null),t.close()})),this._bb=new p,this._bb.emitter(t).on("reconnect",mt((function*(){n._9b.dispose(),yield n._dc()}))).end().emitter(e).on("change",mt((function*(){yield n._dc()}))).end()}get sessionUuid(){return this._2b}get state(){return this._T}get isConnected(){var t;return!0===(null===(t=this._9b.currentInstance())||void 0===t?void 0:t.isOpen)}setConfig(t){k(this._T.config,t)||(this._T.config=t)}pause(){this._T.isActive=!1}resume(){this._T.isActive=!0,Mt(this._dc())}refresh(){Mt(this._dc())}disconnect(){this._T.isActive=!1,this._9b.dispose()}accept(t,e){var n=this;return mt((function*(){yield n._fc({type:"ACCEPTED",alertId:t,alternativeIndex:e})}))()}dismiss(t,e){var n=this;return mt((function*(){yield n._fc({type:"IGNORE",alertId:t,userReason:e})}))()}cardShown(t){var e=this;return mt((function*(){yield e._fc({type:"LOOKED",alertId:t})}))()}sendToneFeedback(t,e){var n=this;return mt((function*(){yield n._fc({type:t,emotionName:e,rev:n._$b.revision})}))()}mute(t){var e=arguments,n=this;return mt((function*(){var i=e.length>1&&void 0!==e[1]?e[1]:"SESSION";yield n._fc({type:"MUTE",userMuteScope:i,userMuteCategories:t})}))()}unmute(t){var e=arguments,n=this;return mt((function*(){var i=e.length>1&&void 0!==e[1]?e[1]:"SESSION";yield n._fc({type:"UNMUTE",userMuteScope:i,userMuteCategories:t})}))()}_dc(){var t=this;return mt((function*(){t._T.isActive&&(yield t._gc(function(){var e=mt((function*(e){yield t._hc(e)}));return function(t){return e.apply(this,arguments)}}()))}))()}_fc(t){var e=this;return mt((function*(){try{return yield e._bc(function(){var n=mt((function*(n){var i=yield n.send(_t(_t({},t),{},{id:e._7b.next(),action:"feedback"}));return i.scoresStatus,i}));return function(t){return n.apply(this,arguments)}}())}catch(t){e._cc(t)}}))()}_bc(t){var e=this._9b.currentInstance();if(!0===(null==e?void 0:e.isOpen))return t(e)}_gc(t){var e=this;return mt((function*(){if(e._T.isActive)try{return yield t(yield e._9b.getInstance())}catch(t){if(t instanceof Ct)return;e._cc(t)}}))()}_hc(t){var e=this;return mt((function*(){if(e._T.isActive&&null==e._ic){var n=e._ab.text,i=e._$b.text;if(n!==i){var r=Qt(0,(()=>i.diff(n)));if(0!==r.ops.length){var s=Date.now(),o=s-e._jc<e._ac,a=function(t){var e=t.ops.filter((t=>!S(t)));if(1!==e.length)return!1;var n=e[0];if(A(n))return!/[^a-z]/i.test(n.insert);if(x(n))return n.delete<=3;return!1}(r);e._ic=t;try{if(o&&a)return void(yield function(){return dn.apply(this,arguments)}(100));yield e._kc(t,n,i,r,s)}catch(t){e._cc(t)}finally{e._ic=null,t.isOpen&&e._ab.text!==e._$b.text&&Mt(e._hc(t))}}else e._$b.text=n}}}))()}_kc(t,e,n,i){var r=arguments,s=this;return mt((function*(){var o=r.length>4&&void 0!==r[4]?r[4]:Date.now(),a=s._8b.next();s._T.status="checking",s._6b.set(a,e);if(i.changeLength>5e4||i.ops.length>500){var c=function(t,e){for(var n=[],i=0;i<t.length;i+=e)n.push(t.slice(i,i+e));return n}(JSON.stringify([i.toRaw()]),5e4);yield Promise.all(c.map(function(){var e=mt((function*(e){return yield t.send({id:s._7b.next(),action:"submit_ot_chunk",chunk:e})}));return function(t){return e.apply(this,arguments)}}())),yield t.send({id:s._7b.next(),action:"submit_ot",rev:a,doc_len:n.length,chunked:!0})}else yield t.send({id:s._7b.next(),action:"submit_ot",rev:a,doc_len:n.length,deltas:[i.toRaw()]});s._$b.text=e,s._$b.revision=a,s._jc=o}))()}_cc(t){this._T.status="error";var e=t instanceof Error?t:new Error(String(t));if(!(e instanceof Ct)){if(e instanceof lt){if("Closed"===e.message)return;if(null!=e.event&&(this._logger.warn("SocketError: ".concat(e.event.code),{code:e.event.code,wasClean:e.event.wasClean,reason:e.event.reason}),1006===e.event.code))return void this._9b.dispose()}else if(e instanceof ln){switch(e.event.error){case"CANNOT_FIND_SYNONYM":case"CANNOT_GET_TEXT_STATS":case"ILLEGAL_DICT_WORD":return void this._logger.info("RuntimeError: ".concat(e.event.error),{code:e.event.error,message:e.event.details});case"BAD_REQUEST":case"RUNTIME_ERROR":case"SESSION_NOT_INITIALIZED":return this._logger.info("RuntimeError: ".concat(e.event.error),{code:e.event.error,message:e.event.details}),this._9b.dispose(),void this.refresh();case"AUTH_ERROR":case"CLIENT_BLOCKED_BY_SECURITY_CONTROL":case"NOT_AUTHORIZED":case"SERVER_OVERLOADED":case"TIMEOUT":return this._logger.warn("RuntimeError: ".concat(e.event.error),{code:e.event.error,message:e.event.details}),void this._9b.dispose();default:this._logger.warn("Unhandled CAPI error code: "+e.event.error,e.event)}if("ERROR"!==e.event.severity)return}this._9b.dispose(),this.dispatchEvent("error",e)}}_ec(t){var e=this;return mt((function*(){var n=e._ab.text;if(null!=e._3b)try{var i=yield e._lc(t,n.toRaw());return e._8b.reset(),yield e._kc(i,n,n,new N),i}catch(t){}var r=yield e._mc(t);return e._8b.reset(),yield e._kc(r,n,new et,n),r}))()}_lc(t,e){var n=this;return mt((function*(){var i=yield n._mc(_t(_t({},t),{},{reconnectInfo:n._3b,delta:e}));return n._3b=void 0,i}))()}_mc(t){var e=this;return mt((function*(){var n=yield e._5b.createChannel("/pws");e._4b=null,n.addEventListener("_close",(()=>{e._nc(n),e._2b=null})),n.addEventListener("_error",(t=>{e._4b=_t(_t({},e._4b),{},{ok:!1,socketError:t.detail})})),n.addEventListener("error",(t=>{e._4b=_t(_t({},e._4b),{},{ok:!1,capiError:t.detail}),e._cc(new ln(t.detail,t.detail.error))})),n.addEventListener("alert",(t=>{var n=e._6b.get(t.detail.rev);if(null!=n){var i=n.diff(e._ab.text),r=Ke(t.detail,i);if(null!=r)return void e.dispatchEvent("suggestion",r)}e.dispatchEvent("suggestion",t.detail)})),n.addEventListener("remove",(t=>{e.dispatchEvent("suggestionRemoved",t.detail)})),n.addEventListener("emotions",(t=>{e.dispatchEvent("emotions",t.detail)})),n.addEventListener("text_info",(t=>{e.dispatchEvent("textInfo",t.detail)})),n.addEventListener("finished",(t=>{var n=t.detail;n.rev===e._$b.revision&&(e._T.status="idle"),e._6b.delete(n.rev)}));var i=yield n.send(_t({id:e._7b.next(),action:"start",client:Et.type,clientSubtype:Et.sub,clientVersion:St,clientSupports:["full_sentence_rewrite_card","readability_check","sentence_variety_check","text_info","tone_cards","user_mutes","vox_check"]},t));return e._2b=i.sessionUuid,yield n.send({id:e._7b.next(),action:"option",name:"gnar_containerId",value:ke.getInstance().containerId}),n}))()}_nc(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;null!=this._2b&&null!=t?this._3b={sessionUuid:this._2b,messagesSent:t.messagesSent,messagesReceived:t.messagesReceived}:this._3b=void 0}dispose(){this.disconnect(),super.dispose()}}function dn(){return dn=mt((function*(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:500;return yield new Promise((e=>setTimeout(e,t)))})),dn.apply(this,arguments)}function gn(t,e){const n=t.slice(e.transformJson.context.s,e.transformJson.context.e);return(e.transformJson.alternatives??[]).map(((t,e)=>{let i=n.toString();const r=[];for(const e of t.ops)S(e)?(r.push(i.slice(0,e.retain)),i=i.slice(e.retain)):x(e)?(r.push({type:"del",children:[i.slice(0,e.delete)]}),i=i.slice(e.delete)):r.push("string"==typeof e.insert?e.insert:!0===e.insert.newline?"\n":" ");return{id:e,label:t.ops.find((t=>A(t)))?.insert,preview:r}}))}function fn(t){const{context:e,highlights:n}=t.transformJson;return n.map((t=>({start:e.s+t.s,end:e.s+t.e})))}function vn(t,e){return{id:e.id,type:e.type,title:e.title,description:e.description,highlights:fn(e),replacements:gn(t,e)}}Ae.init();class _n extends d{#t;#e;#n;#i;#r;#s;constructor(t){super(),this.#t=t,this.#e=new Map,this.#r=t.capi.state.status,this.#n=new p,this.#s={charsCount:0,wordsCount:0,suggestionsCount:0,readabilityScore:0,readingTime:{h:0,m:0,s:0},speakingTime:{h:0,m:0,s:0},session:{duration:0,wordsChecked:0,suggestionsAccepted:{total:0,correctness:0,delivery:0,clarity:0,engagement:0},suggestionsSent:{total:0,correctness:0,delivery:0,clarity:0,engagement:0}}},this.#n.emitter(t).on("error",(t=>this.dispatchEvent("error",t.detail))).end().emitter(t.suggestions).on("added",(t=>{const e=t.detail.map((t=>vn(this.#t.source.text,t)));e.forEach((t=>this.#e.set(t.id,t))),this.dispatchEvent("suggestions",{added:e,removed:[],updated:[]})})).on("updated",(t=>{const e=t.detail.map((t=>vn(this.#t.source.text,t)));e.forEach((t=>this.#e.set(t.id,t))),this.dispatchEvent("suggestions",{added:[],removed:[],updated:e})})).on("removed",(t=>{const e=t.detail.map((t=>this.#e.get(t.id)));e.forEach((t=>this.#e.delete(t.id))),this.dispatchEvent("suggestions",{added:[],removed:e,updated:[]})})).end().emitter(this.#t.capi.state).on("status",(t=>{const e=this.#r;this.#r=t.detail.value,e!==this.#r&&this.dispatchEvent("status",this.#r)})).end().emitter(this.#t.capi).on("textInfo",(t=>{const e=this.#t.suggestions.suggestions.length;this.#s=function(t,e){var{charsCount:n,wordsCount:i,readabilityScore:r}=t;return{charsCount:n,wordsCount:i,suggestionsCount:e,readabilityScore:r,readingTime:kt(i),speakingTime:xt(i),session:yt(t)}}(t.detail,e),this.dispatchEvent("stats",this.#s)})).end()}get suggestions(){return Array.from(this.#e.values())}get status(){return this.#r}get stats(){return this.#s}get config(){return this.#t.config}setConfig(t){this.#t.setConfig(t)}setText(t,e){const n="string"==typeof t?"plain":"rich";if(null==this.#i)this.#i=n;else if(n!==this.#i)throw new Error(`Unexpected ${n} text in ${this.#i} text session`);this.#t.source.setText("string"==typeof t?t:new et(t),null!=e?{index:e,length:1}:null)}async applySuggestion(t){const{suggestionId:e,replacementId:n=0}=t,i=e,r=this.#t.suggestions.getSuggestion(i);if(null==r)throw new Error("Unknown suggestion");const{context:s,alternatives:o}=r.transformJson;if(null==o||null==o[n])return{range:new Ce(-1,-1),content:"plain"===this.#i?"":new et};const a=this.#t.source.text.slice(s.s,s.e).compose(new N(o[n]));return{range:new Ce(s.s,s.e),content:"plain"===this.#i?a.toPlainText():a}}async dismissSuggestion(t){const e=t.suggestionId;await this.#t.suggestions.dismiss(e,"unknown")}async disconnect(){return this.#t.disconnect()}}const pn=Ae.getLogger("SessionManager");let bn=0;class mn extends d{instanceId=bn++;auth;capi;source;suggestions;_scope;_config;constructor(t,e){super(),We.hasConstructorParameters||We.setConstructorParameters(t,globalThis.localStorage),this.auth=We.getInstance(),this.source=new on,this.capi=new hn(this.auth,this.source,e),this.suggestions=new en(this.source),this.suggestions.register(new Qe(this.capi)),this.capi.addEventListener("error",(t=>{this.handleFatalError(t.detail)})),this.capi.resume(),this._config=e,this._scope=(new p).add(this.source).add(this.capi)}get config(){return this._config}setConfig(t){this._config=t,this.capi.setConfig(t)}disconnect(){this.capi.disconnect()}dispose(){this._scope.dispose()}handleFatalError(t){pn.error(t,"Fatal error - disabling Grammarly SDK"),Ae.count("error"),this.dispatchEvent("error",t),this.disconnect()}}t.SDK=class extends d{#o;#a;#c;constructor(t,e={}){super(),We.setConstructorParameters(t,localStorage),this.#o=We.getInstance(),this.#a=t,this.#c=e,this.#o.addEventListener("userAccountStatusChange",(()=>{this.dispatchEvent("isUserAccountConnected",this.isUserAccountConnected)}))}get isUserAccountConnected(){const t=this.#o.state.user;return null!=t&&!t.isAnonymous}withText(t,e){const n=new _n(new mn(this.#a,{...this.#c,...e}));return n.setText(t),n}async handleOAuthCallback(t){await function(t){return Ve.apply(this,arguments)}(t)}async getOAuthUrl(t){const e=await this.#o.createOAuthRequest({mode:"redirect_json",redirectUri:t,scopes:["grammarly.capi.all"]});if(null==e)throw new Error("Cannot create OAuth request");return this.#o.setActiveOAuthRequest(e),e.authorizeUrl}async logout(){this.isUserAccountConnected&&await this.#o.logout()}},Object.defineProperty(t,"__esModule",{value:!0})}(this.Grammarly=this.Grammarly||{});


