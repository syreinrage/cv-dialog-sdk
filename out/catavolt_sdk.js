/**
 * Created by rburson on 3/6/15.
 */
var catavolt;
(function (catavolt) {
    var util;
    (function (util) {
        var ArrayUtil = (function () {
            function ArrayUtil() {
            }
            ArrayUtil.copy = function (source) {
                return source.map(function (e) {
                    return e;
                });
            };
            ArrayUtil.find = function (source, f) {
                var value = null;
                source.some(function (v) {
                    if (f(v)) {
                        value = v;
                        return true;
                    }
                    return false;
                });
                return value;
            };
            return ArrayUtil;
        })();
        util.ArrayUtil = ArrayUtil;
    })(util = catavolt.util || (catavolt.util = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/4/15.
 */
///<reference path="../references.ts"/>
/*
    This implementation supports our ECMA 5.1 browser set, including IE9
    If we no longer need to support IE9, a TypedArray implementaion would be more efficient...
 */
var catavolt;
(function (catavolt) {
    var util;
    (function (util) {
        var Base64 = (function () {
            function Base64() {
            }
            Base64.encode = function (input) {
                var output = "";
                var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                var i = 0;
                input = Base64._utf8_encode(input);
                while (i < input.length) {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);
                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;
                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    }
                    else if (isNaN(chr3)) {
                        enc4 = 64;
                    }
                    output = output + Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) + Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);
                }
                return output;
            };
            Base64.decode = function (input) {
                var output = "";
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                while (i < input.length) {
                    enc1 = Base64._keyStr.indexOf(input.charAt(i++));
                    enc2 = Base64._keyStr.indexOf(input.charAt(i++));
                    enc3 = Base64._keyStr.indexOf(input.charAt(i++));
                    enc4 = Base64._keyStr.indexOf(input.charAt(i++));
                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;
                    output = output + String.fromCharCode(chr1);
                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }
                }
                output = Base64._utf8_decode(output);
                return output;
            };
            Base64._utf8_encode = function (s) {
                s = s.replace(/\r\n/g, "\n");
                var utftext = "";
                for (var n = 0; n < s.length; n++) {
                    var c = s.charCodeAt(n);
                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    }
                    else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                    else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                }
                return utftext;
            };
            Base64._utf8_decode = function (utftext) {
                var s = "";
                var i = 0;
                var c = 0, c1 = 0, c2 = 0, c3 = 0;
                while (i < utftext.length) {
                    c = utftext.charCodeAt(i);
                    if (c < 128) {
                        s += String.fromCharCode(c);
                        i++;
                    }
                    else if ((c > 191) && (c < 224)) {
                        c2 = utftext.charCodeAt(i + 1);
                        s += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                        i += 2;
                    }
                    else {
                        c2 = utftext.charCodeAt(i + 1);
                        c3 = utftext.charCodeAt(i + 2);
                        s += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                        i += 3;
                    }
                }
                return s;
            };
            Base64._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            return Base64;
        })();
        util.Base64 = Base64;
    })(util = catavolt.util || (catavolt.util = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/20/15.
 */
var catavolt;
(function (catavolt) {
    var util;
    (function (util) {
        var ObjUtil = (function () {
            function ObjUtil() {
            }
            ObjUtil.addAllProps = function (sourceObj, targetObj) {
                if (null == sourceObj || "object" != typeof sourceObj)
                    return targetObj;
                if (null == targetObj || "object" != typeof targetObj)
                    return targetObj;
                for (var attr in sourceObj) {
                    targetObj[attr] = sourceObj[attr];
                }
                return targetObj;
            };
            ObjUtil.cloneOwnProps = function (sourceObj) {
                if (null == sourceObj || "object" != typeof sourceObj)
                    return sourceObj;
                var copy = sourceObj.constructor();
                for (var attr in sourceObj) {
                    if (sourceObj.hasOwnProperty(attr)) {
                        copy[attr] = ObjUtil.cloneOwnProps(sourceObj[attr]);
                    }
                }
                return copy;
            };
            ObjUtil.formatRecAttr = function (o) {
                return JSON.stringify(o);
            };
            ObjUtil.newInstance = function (type) {
                return new type;
            };
            return ObjUtil;
        })();
        util.ObjUtil = ObjUtil;
    })(util = catavolt.util || (catavolt.util = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/3/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var util;
    (function (util) {
        var StringUtil = (function () {
            function StringUtil() {
            }
            StringUtil.splitSimpleKeyValuePair = function (pairString) {
                var pair = pairString.split(':');
                var code = pair[0];
                var desc = pair.length > 1 ? pair[1] : '';
                return [code, desc];
            };
            return StringUtil;
        })();
        util.StringUtil = StringUtil;
    })(util = catavolt.util || (catavolt.util = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/6/15.
 */
///<reference path="references.ts"/>
var catavolt;
(function (catavolt) {
    var util;
    (function (util) {
        (function (LogLevel) {
            LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
            LogLevel[LogLevel["WARN"] = 1] = "WARN";
            LogLevel[LogLevel["INFO"] = 2] = "INFO";
            LogLevel[LogLevel["DEBUG"] = 3] = "DEBUG";
        })(util.LogLevel || (util.LogLevel = {}));
        var LogLevel = util.LogLevel;
        var Log = (function () {
            function Log() {
            }
            Log.logLevel = function (level) {
                if (level >= 3 /* DEBUG */) {
                    Log.debug = function (message, method, clz) {
                        Log.log(function (o) {
                            console.info(o);
                        }, 'DEBUG: ' + message, method, clz);
                    };
                }
                else {
                    Log.debug = function (message, method, clz) {
                    };
                }
                if (level >= 2 /* INFO */) {
                    Log.info = function (message, method, clz) {
                        Log.log(function (o) {
                            console.info(o);
                        }, 'INFO: ' + message, method, clz);
                    };
                }
                else {
                    Log.info = function (message, method, clz) {
                    };
                }
                if (level >= 1 /* WARN */) {
                    Log.error = function (message, clz, method) {
                        Log.log(function (o) {
                            console.error(o);
                        }, 'ERROR: ' + message, method, clz);
                    };
                }
                else {
                    Log.error = function (message, clz, method) {
                    };
                }
                if (level >= 0 /* ERROR */) {
                    Log.warn = function (message, clz, method) {
                        Log.log(function (o) {
                            console.info(o);
                        }, 'WARN: ' + message, method, clz);
                    };
                }
                else {
                    Log.warn = function (message, clz, method) {
                    };
                }
            };
            Log.log = function (logger, message, method, clz) {
                var m = typeof message !== 'string' ? Log.formatRecString(message) : message;
                if (clz || method) {
                    logger(clz + "::" + method + " : " + m);
                }
                else {
                    logger(m);
                }
            };
            Log.formatRecString = function (o) {
                return util.ObjUtil.formatRecAttr(o);
            };
            Log.init = Log.logLevel(3 /* DEBUG */);
            return Log;
        })();
        util.Log = Log;
    })(util = catavolt.util || (catavolt.util = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/9/15.
 */
/**
 * Created by rburson on 3/16/15.
 */
/**
 * Created by rburson on 3/6/15.
 */
//util
///<reference path="ArrayUtil.ts"/>
///<reference path="Base64.ts"/>
///<reference path="ObjUtil.ts"/>
///<reference path="StringUtil.ts"/>
///<reference path="Log.ts"/>
///<reference path="Types.ts"/>
///<reference path="UserException.ts"/>
var ArrayUtil = catavolt.util.ArrayUtil;
var Base64 = catavolt.util.Base64;
var Log = catavolt.util.Log;
var LogLevel = catavolt.util.LogLevel;
var ObjUtil = catavolt.util.ObjUtil;
var StringUtil = catavolt.util.StringUtil;
/**
 * Created by rburson on 3/9/15.
 */
///<reference path="../fp/references.ts"/>
/**
 * Created by rburson on 3/5/15.
 */
///<reference path="references.ts"/>
var catavolt;
(function (catavolt) {
    var fp;
    (function (fp) {
        var Try = (function () {
            function Try() {
            }
            Try.prototype.bind = function (f) {
                return this.isFailure ? new fp.Failure(this.failure) : f(this.success);
            };
            Object.defineProperty(Try.prototype, "failure", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Try.prototype, "isFailure", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Try.prototype, "isSuccess", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            Try.prototype.map = function (f) {
                return this.isFailure ? new fp.Failure(this.failure) : new fp.Success(f(this.success));
            };
            Object.defineProperty(Try.prototype, "success", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            return Try;
        })();
        fp.Try = Try;
    })(fp = catavolt.fp || (catavolt.fp = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/5/15.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="../fp/references.ts"/>
var catavolt;
(function (catavolt) {
    var fp;
    (function (fp) {
        var Failure = (function (_super) {
            __extends(Failure, _super);
            function Failure(_error) {
                _super.call(this);
                this._error = _error;
            }
            Object.defineProperty(Failure.prototype, "failure", {
                get: function () {
                    return this._error;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Failure.prototype, "isFailure", {
                get: function () {
                    return true;
                },
                enumerable: true,
                configurable: true
            });
            return Failure;
        })(fp.Try);
        fp.Failure = Failure;
    })(fp = catavolt.fp || (catavolt.fp = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/5/15.
 */
///<reference path="../util/references.ts"/>
var catavolt;
(function (catavolt) {
    var fp;
    (function (fp) {
        var Future = (function () {
            /** --------------------- CONSTRUCTORS ------------------------------*/
            function Future(_label) {
                this._label = _label;
                this._completionListeners = new Array();
            }
            /** --------------------- PUBLIC STATIC ------------------------------*/
            Future.createCompletedFuture = function (label, result) {
                var f = new Future(label);
                return f.complete(result);
            };
            Future.createSuccessfulFuture = function (label, value) {
                return Future.createCompletedFuture(label, new fp.Success(value));
            };
            Future.createFailedFuture = function (label, error) {
                return Future.createCompletedFuture(label, new fp.Failure(error));
            };
            Future.createFuture = function (label) {
                var f = new Future(label);
                return f;
            };
            /** --------------------- PUBLIC ------------------------------*/
            Future.prototype.bind = function (f) {
                var p = new fp.Promise('Future.bind:' + this._label);
                this.onComplete(function (t1) {
                    if (t1.isFailure) {
                        p.failure(t1.failure);
                    }
                    else {
                        var a = t1.success;
                        try {
                            var mb = f(a);
                            mb.onComplete(function (t2) {
                                p.complete(t2);
                            });
                        }
                        catch (error) {
                            p.complete(new fp.Failure(error));
                        }
                    }
                });
                return p.future;
            };
            Object.defineProperty(Future.prototype, "failure", {
                get: function () {
                    return this._result ? this._result.failure : null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Future.prototype, "isComplete", {
                get: function () {
                    return !!this._result;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Future.prototype, "isCompleteWithFailure", {
                get: function () {
                    return !!this._result && this._result.isFailure;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Future.prototype, "isCompleteWithSuccess", {
                get: function () {
                    return !!this._result && this._result.isSuccess;
                },
                enumerable: true,
                configurable: true
            });
            Future.prototype.map = function (f) {
                var p = new fp.Promise('Future.map:' + this._label);
                this.onComplete(function (t1) {
                    if (t1.isFailure) {
                        p.failure(t1.failure);
                    }
                    else {
                        var a = t1.success;
                        try {
                            var b = f(a);
                            p.success(b);
                        }
                        catch (error) {
                            p.complete(new fp.Failure(error));
                        }
                    }
                });
                return p.future;
            };
            Future.prototype.onComplete = function (listener) {
                this._result ? listener(this._result) : this._completionListeners.push(listener);
            };
            Future.prototype.onFailure = function (listener) {
                this.onComplete(function (t) {
                    t.isFailure && listener(t.failure);
                });
            };
            Future.prototype.onSuccess = function (listener) {
                this.onComplete(function (t) {
                    t.isSuccess && listener(t.success);
                });
            };
            Object.defineProperty(Future.prototype, "result", {
                get: function () {
                    return this._result;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Future.prototype, "success", {
                get: function () {
                    return this._result ? this.result.success : null;
                },
                enumerable: true,
                configurable: true
            });
            /** --------------------- MODULE ------------------------------*/
            //*** let's pretend this has module level visibility
            Future.prototype.complete = function (t) {
                var _this = this;
                var notifyList = new Array();
                //Log.debug("complete() called on Future " + this._label + ' there are ' + this._completionListeners.length + " listeners.");
                if (t) {
                    if (!this._result) {
                        this._result = t;
                        /* capture the listener set to prevent missing a notification */
                        notifyList = ArrayUtil.copy(this._completionListeners);
                    }
                    else {
                        Log.error("Future::complete() : Future " + this._label + " has already been completed");
                    }
                    notifyList.forEach(function (listener) {
                        listener(_this._result);
                    });
                }
                else {
                    Log.error("Future::complete() : Can't complete Future with null result");
                }
                return this;
            };
            return Future;
        })();
        fp.Future = Future;
    })(fp = catavolt.fp || (catavolt.fp = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/5/15.
 */
///<reference path="../fp/references.ts"/>
var catavolt;
(function (catavolt) {
    var fp;
    (function (fp) {
        var Success = (function (_super) {
            __extends(Success, _super);
            function Success(_value) {
                _super.call(this);
                this._value = _value;
            }
            Object.defineProperty(Success.prototype, "isSuccess", {
                get: function () {
                    return true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Success.prototype, "success", {
                get: function () {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return Success;
        })(fp.Try);
        fp.Success = Success;
    })(fp = catavolt.fp || (catavolt.fp = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/6/15.
 */
///<reference path="../fp/references.ts"/>
var catavolt;
(function (catavolt) {
    var fp;
    (function (fp) {
        var Promise = (function () {
            function Promise(label) {
                this._future = fp.Future.createFuture(label);
            }
            /** --------------------- PUBLIC ------------------------------*/
            Promise.prototype.isComplete = function () {
                return this._future.isComplete;
            };
            Promise.prototype.complete = function (t) {
                //Log.debug('Promise calling complete on Future...');
                this._future.complete(t);
                return this;
            };
            Promise.prototype.failure = function (error) {
                this.complete(new fp.Failure(error));
            };
            Object.defineProperty(Promise.prototype, "future", {
                get: function () {
                    return this._future;
                },
                enumerable: true,
                configurable: true
            });
            Promise.prototype.success = function (value) {
                this.complete(new fp.Success(value));
            };
            return Promise;
        })();
        fp.Promise = Promise;
    })(fp = catavolt.fp || (catavolt.fp = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/16/15.
 */
var catavolt;
(function (catavolt) {
    var fp;
    (function (fp) {
        var Either = (function () {
            function Either() {
            }
            Either.left = function (left) {
                var either = new Either();
                either._left = left;
                return either;
            };
            Either.right = function (right) {
                var either = new Either();
                either._right = right;
                return either;
            };
            Object.defineProperty(Either.prototype, "isLeft", {
                get: function () {
                    return !!this._left;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Either.prototype, "isRight", {
                get: function () {
                    return !!this._right;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Either.prototype, "left", {
                get: function () {
                    return this._left;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Either.prototype, "right", {
                get: function () {
                    return this._right;
                },
                enumerable: true,
                configurable: true
            });
            return Either;
        })();
        fp.Either = Either;
    })(fp = catavolt.fp || (catavolt.fp = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/6/15.
 */
var Either = catavolt.fp.Either;
var Failure = catavolt.fp.Failure;
var Future = catavolt.fp.Future;
var Promise = catavolt.fp.Promise;
var Success = catavolt.fp.Success;
var Try = catavolt.fp.Try;
/**
 * Created by rburson on 3/9/15.
 */
/**
 * Created by rburson on 3/9/15.
 */
/**
 * Created by rburson on 3/9/15.
 */
///<reference path="../fp/references.ts"/>
var catavolt;
(function (catavolt) {
    var ws;
    (function (ws) {
        var XMLHttpClient = (function () {
            function XMLHttpClient() {
            }
            XMLHttpClient.prototype.jsonGet = function (targetUrl, timeoutMillis) {
                return this.jsonCall(targetUrl, null, 'GET', timeoutMillis);
            };
            XMLHttpClient.prototype.jsonPost = function (targetUrl, jsonObj, timeoutMillis) {
                return this.jsonCall(targetUrl, jsonObj, 'POST', timeoutMillis);
            };
            XMLHttpClient.prototype.jsonCall = function (targetUrl, jsonObj, method, timeoutMillis) {
                if (method === void 0) { method = 'GET'; }
                if (timeoutMillis === void 0) { timeoutMillis = 30000; }
                var promise = new Promise("XMLHttpClient::jsonCall");
                if (method !== 'GET' && method !== 'POST') {
                    promise.failure(method + " method not supported.");
                    return promise.future;
                }
                var successCallback = function (request) {
                    try {
                        Log.info("Got successful response: " + request.responseText);
                        var responseObj = JSON.parse(request.responseText);
                        promise.success(responseObj);
                    }
                    catch (error) {
                        promise.failure("XMLHttpClient::jsonCall: Failed to parse response: " + request.responseText);
                    }
                };
                var errorCallback = function (request) {
                    Log.error('XMLHttpClient::jsonCall: call failed with ' + request.status + ":" + request.statusText);
                    promise.failure('XMLHttpClient::jsonCall: call failed with ' + request.status + ":" + request.statusText);
                };
                var timeoutCallback = function () {
                    if (promise.isComplete()) {
                        Log.error('XMLHttpClient::jsonCall: Timeoutreceived but Promise was already complete.');
                    }
                    else {
                        Log.error('XMLHttpClient::jsonCall: Timeoutreceived.');
                        promise.failure('XMLHttpClient::jsonCall: Call timed out');
                    }
                };
                var wRequestTimer = null;
                var xmlHttpRequest = new XMLHttpRequest();
                xmlHttpRequest.onreadystatechange = function () {
                    if (xmlHttpRequest.readyState === 4) {
                        if (wRequestTimer) {
                            clearTimeout(wRequestTimer);
                        }
                        if ((xmlHttpRequest.status !== 200) && (xmlHttpRequest.status !== 304)) {
                            if (errorCallback) {
                                errorCallback(xmlHttpRequest);
                            }
                        }
                        else {
                            successCallback(xmlHttpRequest);
                        }
                    }
                };
                if (timeoutMillis) {
                    //check for timeout support on the xmlHttpRequest itself
                    if (typeof xmlHttpRequest.ontimeout !== "undefined") {
                        xmlHttpRequest.timeout = timeoutMillis;
                        xmlHttpRequest.ontimeout = timeoutCallback;
                    }
                    else {
                        wRequestTimer = setTimeout(timeoutCallback, timeoutMillis);
                    }
                }
                var body = jsonObj && JSON.stringify(jsonObj);
                Log.info("XmlHttpClient: Calling: " + targetUrl);
                Log.info("XmlHttpClient: body: " + body);
                xmlHttpRequest.open(method, targetUrl, true);
                if (method === 'POST') {
                    xmlHttpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    xmlHttpRequest.send(body);
                }
                else {
                    xmlHttpRequest.send();
                }
                return promise.future;
            };
            return XMLHttpClient;
        })();
        ws.XMLHttpClient = XMLHttpClient;
        var Call = (function () {
            function Call(service, method, params, systemContext, sessionContext) {
                this._client = new XMLHttpClient();
                this._performed = false;
                this._cancelled = false;
                this._systemContext = systemContext;
                this._sessionContext = sessionContext;
                this._service = service;
                this._method = method;
                this._params = params;
                this._callId = Call.nextCallId();
                this._responseHeaders = null;
                this.timeoutMillis = 30000;
            }
            Call.nextCallId = function () {
                return ++Call._lastCallId;
            };
            Call.createCall = function (service, method, params, sessionContext) {
                return new Call(service, method, params, sessionContext.systemContext, sessionContext);
            };
            Call.createCallWithoutSession = function (service, method, params, systemContext) {
                return new Call(service, method, params, systemContext, null);
            };
            Call.prototype.cancel = function () {
                Log.error("Needs implementation", "Call", "cancel");
            };
            Call.prototype.perform = function () {
                if (this._performed) {
                    return Future.createFailedFuture("Call::perform", "Call:perform(): Call is already performed");
                }
                this._performed = true;
                if (!this._systemContext) {
                    return Future.createFailedFuture("Call::perform", "Call:perform(): SystemContext cannot be null");
                }
                var jsonObj = {
                    id: this._callId,
                    method: this._method,
                    params: this._params
                };
                var pathPrefix = "";
                if (this._systemContext && this._systemContext.urlString) {
                    pathPrefix = this._systemContext.urlString;
                    if (pathPrefix.charAt(pathPrefix.length - 1) !== '/') {
                        pathPrefix += '/';
                    }
                }
                var servicePath = pathPrefix + (this._service || "");
                return this._client.jsonPost(servicePath, jsonObj, this.timeoutMillis);
            };
            Call._lastCallId = 0;
            return Call;
        })();
        ws.Call = Call;
        var Get = (function () {
            function Get(url) {
                this._client = new XMLHttpClient();
                this._url = url;
                this._performed = false;
                this._promise = new Promise("catavolt.ws.Get");
                this.timeoutMillis = 30000;
            }
            Get.fromUrl = function (url) {
                return new Get(url);
            };
            Get.prototype.cancel = function () {
                Log.error("Needs implementation", "Get", "cancel");
            };
            Get.prototype.perform = function () {
                if (this._performed) {
                    return this.complete(new Failure("Get:perform(): Get is already performed")).future;
                }
                this._performed = true;
                return this._client.jsonGet(this._url, this.timeoutMillis);
            };
            Get.prototype.complete = function (t) {
                if (!this._promise.isComplete()) {
                    this._promise.complete(t);
                }
                return this._promise;
            };
            return Get;
        })();
        ws.Get = Get;
    })(ws = catavolt.ws || (catavolt.ws = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/6/15.
 */
var Call = catavolt.ws.Call;
var Get = catavolt.ws.Get;
/**
 * Created by rburson on 3/31/15.
 */
///<reference path="../references.ts"/>
/*
    @TODO
 */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var CellValueDef = (function () {
            function CellValueDef() {
            }
            CellValueDef.prototype.test = function () {
            };
            return CellValueDef;
        })();
        dialog.CellValueDef = CellValueDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/31/15.
 */
///<reference path="../references.ts"/>
/*
    @TODO
 */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var CellDef = (function () {
            function CellDef() {
            }
            return CellDef;
        })();
        dialog.CellDef = CellDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/31/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var EntityRecDef = (function () {
            function EntityRecDef(_propDefs) {
                this._propDefs = _propDefs;
            }
            Object.defineProperty(EntityRecDef.prototype, "propCount", {
                get: function () {
                    return this.propDefs.length;
                },
                enumerable: true,
                configurable: true
            });
            EntityRecDef.prototype.propDefAtName = function (name) {
                var propDef = null;
                this.propDefs.some(function (p) {
                    if (p.name === name) {
                        propDef = p;
                        return true;
                    }
                    return false;
                });
                return propDef;
            };
            Object.defineProperty(EntityRecDef.prototype, "propDefs", {
                // Note we need to support both 'propDefs' and 'propertyDefs' as both
                // field names seem to be used in the dialog model
                get: function () {
                    return this._propDefs;
                },
                set: function (propDefs) {
                    this._propDefs = propDefs;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EntityRecDef.prototype, "propertyDefs", {
                get: function () {
                    return this._propDefs;
                },
                set: function (propDefs) {
                    this._propDefs = propDefs;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EntityRecDef.prototype, "propNames", {
                get: function () {
                    return this.propDefs.map(function (p) {
                        return p.name;
                    });
                },
                enumerable: true,
                configurable: true
            });
            return EntityRecDef;
        })();
        dialog.EntityRecDef = EntityRecDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/4/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var BinaryRef = (function () {
            function BinaryRef() {
            }
            BinaryRef.fromWSValue = function (encodedValue, settings) {
                if (encodedValue && encodedValue.length > 0) {
                    return new Success(new InlineBinaryRef(Base64.decode(encodedValue), settings));
                }
                else {
                    return new Success(new ObjectBinaryRef(settings));
                }
            };
            return BinaryRef;
        })();
        dialog.BinaryRef = BinaryRef;
        var InlineBinaryRef = (function (_super) {
            __extends(InlineBinaryRef, _super);
            function InlineBinaryRef(_inlineData, _settings) {
                _super.call(this);
                this._inlineData = _inlineData;
                this._settings = _settings;
            }
            return InlineBinaryRef;
        })(BinaryRef);
        dialog.InlineBinaryRef = InlineBinaryRef;
        var ObjectBinaryRef = (function (_super) {
            __extends(ObjectBinaryRef, _super);
            function ObjectBinaryRef(_settings) {
                _super.call(this);
                this._settings = _settings;
            }
            return ObjectBinaryRef;
        })(BinaryRef);
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/5/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var CodeRef = (function () {
            function CodeRef(_code, _description) {
                this._code = _code;
                this._description = _description;
            }
            CodeRef.fromFormattedValue = function (value) {
                var pair = StringUtil.splitSimpleKeyValuePair(value);
                return new CodeRef(pair[0], pair[1]);
            };
            Object.defineProperty(CodeRef.prototype, "code", {
                get: function () {
                    return this._code;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CodeRef.prototype, "description", {
                get: function () {
                    return this._description;
                },
                enumerable: true,
                configurable: true
            });
            CodeRef.prototype.toString = function () {
                return this.code + ":" + this.description;
            };
            return CodeRef;
        })();
        dialog.CodeRef = CodeRef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/5/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var ObjectRef = (function () {
            function ObjectRef(_objectId, _description) {
                this._objectId = _objectId;
                this._description = _description;
            }
            ObjectRef.fromFormattedValue = function (value) {
                var pair = StringUtil.splitSimpleKeyValuePair(value);
                return new ObjectRef(pair[0], pair[1]);
            };
            Object.defineProperty(ObjectRef.prototype, "description", {
                get: function () {
                    return this._description;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ObjectRef.prototype, "objectId", {
                get: function () {
                    return this._objectId;
                },
                enumerable: true,
                configurable: true
            });
            ObjectRef.prototype.toString = function () {
                return this.objectId + ":" + this.description;
            };
            return ObjectRef;
        })();
        dialog.ObjectRef = ObjectRef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/5/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var GeoFix = (function () {
            function GeoFix(_latitude, _longitude, _source, _accuracy) {
                this._latitude = _latitude;
                this._longitude = _longitude;
                this._source = _source;
                this._accuracy = _accuracy;
            }
            GeoFix.fromFormattedValue = function (value) {
                var pair = StringUtil.splitSimpleKeyValuePair(value);
                return new GeoFix(Number(pair[0]), Number(pair[1]), null, null);
            };
            Object.defineProperty(GeoFix.prototype, "latitude", {
                get: function () {
                    return this._latitude;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GeoFix.prototype, "longitude", {
                get: function () {
                    return this._longitude;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GeoFix.prototype, "source", {
                get: function () {
                    return this._source;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GeoFix.prototype, "accuracy", {
                get: function () {
                    return this._accuracy;
                },
                enumerable: true,
                configurable: true
            });
            GeoFix.prototype.toString = function () {
                return this.latitude + ":" + this.longitude;
            };
            return GeoFix;
        })();
        dialog.GeoFix = GeoFix;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/5/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var GeoLocation = (function () {
        function GeoLocation(_latitude, _longitude) {
            this._latitude = _latitude;
            this._longitude = _longitude;
        }
        GeoLocation.fromFormattedValue = function (value) {
            var pair = StringUtil.splitSimpleKeyValuePair(value);
            return new GeoLocation(Number(pair[0]), Number(pair[1]));
        };
        Object.defineProperty(GeoLocation.prototype, "latitude", {
            get: function () {
                return this._latitude;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GeoLocation.prototype, "longitude", {
            get: function () {
                return this._longitude;
            },
            enumerable: true,
            configurable: true
        });
        GeoLocation.prototype.toString = function () {
            return this.latitude + ":" + this.longitude;
        };
        return GeoLocation;
    })();
    catavolt.GeoLocation = GeoLocation;
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/2/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var DataAnno = (function () {
            function DataAnno(_name, _value) {
                this._name = _name;
                this._value = _value;
            }
            DataAnno.annotatePropsUsingWSDataAnnotation = function (props, jsonObj) {
                return dialog.DialogTriple.fromListOfWSDialogObject(jsonObj, 'WSDataAnnotation', dialog.OType.factoryFn).bind(function (propAnnos) {
                    var annotatedProps = [];
                    for (var i = 0; i < props.length; i++) {
                        var p = props[i];
                        var annos = propAnnos[i];
                        if (annos) {
                            annotatedProps.push(new dialog.Prop(p.name, p.value, annos));
                        }
                        else {
                            annotatedProps.push(p);
                        }
                    }
                    return new Success(annotatedProps);
                });
            };
            DataAnno.backgroundColor = function (annos) {
                var result = ArrayUtil.find(annos, function (anno) {
                    return anno.isBackgroundColor;
                });
                return result ? result.backgroundColor : null;
            };
            DataAnno.foregroundColor = function (annos) {
                var result = ArrayUtil.find(annos, function (anno) {
                    return anno.isForegroundColor;
                });
                return result ? result.foregroundColor : null;
            };
            DataAnno.imageName = function (annos) {
                var result = ArrayUtil.find(annos, function (anno) {
                    return anno.isImageName;
                });
                return result ? result.value : null;
            };
            DataAnno.imagePlacement = function (annos) {
                var result = ArrayUtil.find(annos, function (anno) {
                    return anno.isImagePlacement;
                });
                return result ? result.value : null;
            };
            DataAnno.isBoldText = function (annos) {
                return annos.some(function (anno) {
                    return anno.isBoldText;
                });
            };
            DataAnno.isItalicText = function (annos) {
                return annos.some(function (anno) {
                    return anno.isItalicText;
                });
            };
            DataAnno.isPlacementCenter = function (annos) {
                return annos.some(function (anno) {
                    return anno.isPlacementCenter;
                });
            };
            DataAnno.isPlacementLeft = function (annos) {
                return annos.some(function (anno) {
                    return anno.isPlacementLeft;
                });
            };
            DataAnno.isPlacementRight = function (annos) {
                return annos.some(function (anno) {
                    return anno.isPlacementRight;
                });
            };
            DataAnno.isPlacementStretchUnder = function (annos) {
                return annos.some(function (anno) {
                    return anno.isPlacementStretchUnder;
                });
            };
            DataAnno.isPlacementUnder = function (annos) {
                return annos.some(function (anno) {
                    return anno.isPlacementUnder;
                });
            };
            DataAnno.isUnderlineText = function (annos) {
                return annos.some(function (anno) {
                    return anno.isUnderlineText;
                });
            };
            DataAnno.overrideText = function (annos) {
                var result = ArrayUtil.find(annos, function (anno) {
                    return anno.isOverrideText;
                });
                return result ? result.value : null;
            };
            DataAnno.tipText = function (annos) {
                var result = ArrayUtil.find(annos, function (anno) {
                    return anno.isTipText;
                });
                return result ? result.value : null;
            };
            DataAnno.fromWS = function (otype, jsonObj) {
                var stringObj = jsonObj['annotations'];
                if (stringObj['WS_LTYPE'] !== 'String') {
                    return new Failure('DataAnno:fromWS: expected WS_LTYPE of String but found ' + stringObj['WS_LTYPE']);
                }
                var annoStrings = stringObj['values'];
                var annos = [];
                for (var i = 0; i < annoStrings.length; i++) {
                    annos.push(DataAnno.parseString(annoStrings[i]));
                }
                return new Success(annos);
            };
            DataAnno.toListOfWSDataAnno = function (annos) {
                var result = { 'WS_LTYPE': 'WSDataAnno' };
                var values = [];
                annos.forEach(function (anno) {
                    values.push(anno.toWS());
                });
                result['values'] = values;
                return result;
            };
            DataAnno.parseString = function (formatted) {
                var pair = StringUtil.splitSimpleKeyValuePair(formatted);
                return new DataAnno(pair[0], pair[1]);
            };
            Object.defineProperty(DataAnno.prototype, "backgroundColor", {
                get: function () {
                    return this.isBackgroundColor ? this.value : null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "foregroundColor", {
                get: function () {
                    return this.isForegroundColor ? this.value : null;
                },
                enumerable: true,
                configurable: true
            });
            DataAnno.prototype.equals = function (dataAnno) {
                return this.name === dataAnno.name;
            };
            Object.defineProperty(DataAnno.prototype, "isBackgroundColor", {
                get: function () {
                    return this.name === DataAnno.BACKGROUND_COLOR;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isBoldText", {
                get: function () {
                    return this.name === DataAnno.BOLD_TEXT && this.value === DataAnno.TRUE_VALUE;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isForegroundColor", {
                get: function () {
                    return this.name === DataAnno.FOREGROUND_COLOR;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isImageName", {
                get: function () {
                    return this.name === DataAnno.IMAGE_NAME;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isImagePlacement", {
                get: function () {
                    return this.name === DataAnno.IMAGE_PLACEMENT;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isItalicText", {
                get: function () {
                    return this.name === DataAnno.ITALIC_TEXT && this.value === DataAnno.TRUE_VALUE;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isOverrideText", {
                get: function () {
                    return this.name === DataAnno.OVERRIDE_TEXT;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isPlacementCenter", {
                get: function () {
                    return this.isImagePlacement && this.value === DataAnno.PLACEMENT_CENTER;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isPlacementLeft", {
                get: function () {
                    return this.isImagePlacement && this.value === DataAnno.PLACEMENT_LEFT;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isPlacementRight", {
                get: function () {
                    return this.isImagePlacement && this.value === DataAnno.PLACEMENT_RIGHT;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isPlacementStretchUnder", {
                get: function () {
                    return this.isImagePlacement && this.value === DataAnno.PLACEMENT_STRETCH_UNDER;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isPlacementUnder", {
                get: function () {
                    return this.isImagePlacement && this.value === DataAnno.PLACEMENT_UNDER;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isTipText", {
                get: function () {
                    return this.name === DataAnno.TIP_TEXT;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "isUnderlineText", {
                get: function () {
                    return this.name === DataAnno.UNDERLINE && this.value === DataAnno.TRUE_VALUE;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataAnno.prototype, "value", {
                get: function () {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            DataAnno.prototype.toWS = function () {
                return { 'WS_OTYPE': 'WSDataAnno', 'name': this.name, 'value': this.value };
            };
            DataAnno.BOLD_TEXT = "BOLD_TEXT";
            DataAnno.BACKGROUND_COLOR = "BGND_COLOR";
            DataAnno.FOREGROUND_COLOR = "FGND_COLOR";
            DataAnno.IMAGE_NAME = "IMAGE_NAME";
            DataAnno.IMAGE_PLACEMENT = "IMAGE_PLACEMENT";
            DataAnno.ITALIC_TEXT = "ITALIC_TEXT";
            DataAnno.OVERRIDE_TEXT = "OVRD_TEXT";
            DataAnno.TIP_TEXT = "TIP_TEXT";
            DataAnno.UNDERLINE = "UNDERLINE";
            DataAnno.TRUE_VALUE = "1";
            DataAnno.PLACEMENT_CENTER = "CENTER";
            DataAnno.PLACEMENT_LEFT = "LEFT";
            DataAnno.PLACEMENT_RIGHT = "RIGHT";
            DataAnno.PLACEMENT_UNDER = "UNDER";
            DataAnno.PLACEMENT_STRETCH_UNDER = "STRETCH_UNDER";
            return DataAnno;
        })();
        dialog.DataAnno = DataAnno;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/2/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var Prop = (function () {
            function Prop(_name, _value, _annos) {
                if (_annos === void 0) { _annos = []; }
                this._name = _name;
                this._value = _value;
                this._annos = _annos;
            }
            Prop.fromListOfWSValue = function (values) {
                var props = [];
                values.forEach(function (v) {
                    var propTry = Prop.fromWSValue(v);
                    if (propTry.isFailure)
                        return new Failure(propTry.failure);
                    props.push(propTry.success);
                });
                return new Success(props);
            };
            Prop.fromWSNameAndWSValue = function (name, value) {
                var propTry = Prop.fromWSValue(value);
                if (propTry.isFailure) {
                    return new Failure(propTry.failure);
                }
                return new Success(new Prop(name, propTry.success));
            };
            Prop.fromWSNamesAndValues = function (names, values) {
                if (names.length != values.length) {
                    return new Failure("Prop::fromWSNamesAndValues: names and values must be of same length");
                }
                var list = [];
                for (var i = 0; i < names.length; i++) {
                    var propTry = Prop.fromWSNameAndWSValue(names[i], values[i]);
                    if (propTry.isFailure) {
                        return new Failure(propTry.failure);
                    }
                    list.push(propTry.success);
                }
                return new Success(list);
            };
            Prop.fromWSValue = function (value) {
                var propValue = value;
                if ('object' === typeof value) {
                    var PType = value['WS_PTYPE'];
                    var strVal = value['value'];
                    if (PType) {
                        if (PType === 'Decimal') {
                            propValue = Number(strVal);
                        }
                        else if (PType === 'Date') {
                            propValue = new Date(strVal);
                        }
                        else if (PType === 'DateTime') {
                            propValue = new Date(strVal);
                        }
                        else if (PType === 'Time') {
                            propValue = new Date(strVal);
                        }
                        else if (PType === 'BinaryRef') {
                            var binaryRefTry = dialog.BinaryRef.fromWSValue(strVal, value['properties']);
                            if (binaryRefTry.isFailure)
                                return new Failure(binaryRefTry.failure);
                            propValue = binaryRefTry.success;
                        }
                        else if (PType === 'ObjectRef') {
                            propValue = dialog.ObjectRef.fromFormattedValue(strVal);
                        }
                        else if (PType === 'CodeRef') {
                            propValue = dialog.CodeRef.fromFormattedValue(strVal);
                        }
                        else if (PType === 'GeoFix') {
                            propValue = dialog.GeoFix.fromFormattedValue(strVal);
                        }
                        else if (PType === 'GeoLocation') {
                            propValue = catavolt.GeoLocation.fromFormattedValue(strVal);
                        }
                        else {
                            return new Failure('Prop::fromWSValue: Property WS_PTYPE is not valid: ' + PType);
                        }
                    }
                }
                return new Success(propValue);
            };
            Prop.fromWS = function (otype, jsonObj) {
                var name = jsonObj['name'];
                var valueTry = Prop.fromWSValue(jsonObj['value']);
                if (valueTry.isFailure)
                    return new Failure(valueTry.failure);
                var annos = null;
                if (jsonObj['annos']) {
                    var annosListTry = dialog.DialogTriple.fromListOfWSDialogObject(jsonObj['annos'], 'WSDataAnno', dialog.OType.factoryFn);
                    if (annosListTry.isFailure)
                        return new Failure(annosListTry.failure);
                    annos = annosListTry.success;
                }
                return new Success(new Prop(name, valueTry.success, annos));
            };
            Prop.toWSProperty = function (o) {
                if (typeof o === 'number') {
                    return { 'WS_PTYPE': 'Decimal', 'value': String(o) };
                }
                else if (typeof o === 'object') {
                    if (o instanceof Date) {
                        return { 'WS_PTYPE': 'DateTime', 'value': o.toUTCString() };
                    }
                    else if (o instanceof dialog.CodeRef) {
                        return { 'WS_PTYPE': 'CodeRef', 'value': o.toString() };
                    }
                    else if (o instanceof dialog.ObjectRef) {
                        return { 'WS_PTYPE': 'ObjectRef', 'value': o.toString() };
                    }
                    else if (o instanceof dialog.GeoFix) {
                        return { 'WS_PTYPE': 'GeoFix', 'value': o.toString() };
                    }
                    else if (o instanceof catavolt.GeoLocation) {
                        return { 'WS_PTYPE': 'GeoLocation', 'value': o.toString() };
                    }
                }
                else {
                    return o;
                }
            };
            Prop.toWSListOfProperties = function (list) {
                var result = { 'WS_LTYPE': 'Object' };
                var values = [];
                list.forEach(function (o) {
                    values.push(Prop.toWSProperty(o));
                });
                result['values'] = values;
                return result;
            };
            Prop.toWSListOfString = function (list) {
                return { 'WS_LTYPE': 'String', 'values': list };
            };
            Prop.toListOfWSProp = function (props) {
                var result = { 'WS_LTYPE': 'WSProp' };
                var values = [];
                props.forEach(function (prop) {
                    values.push(prop.toWS());
                });
                result['values'] = values;
                return result;
            };
            Object.defineProperty(Prop.prototype, "annos", {
                get: function () {
                    return this._annos;
                },
                enumerable: true,
                configurable: true
            });
            Prop.prototype.equals = function (prop) {
                return this.name === prop.name && this.value === prop.value;
            };
            Object.defineProperty(Prop.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Prop.prototype, "value", {
                get: function () {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            Prop.prototype.toWS = function () {
                var result = { 'WS_OTYPE': 'WSProp', 'name': this.name, 'value': Prop.toWSProperty(this.value) };
                if (this.annos) {
                    result['annos'] = dialog.DataAnno.toListOfWSDataAnno(this.annos);
                }
                return result;
            };
            return Prop;
        })();
        dialog.Prop = Prop;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var PropDef = (function () {
            function PropDef(_name, _type, _elementType, _style, _propertyLength, _propertyScale, _presLength, _presScale, _dataDictionaryKey, _maintainable, _writeEnabled, _canCauseSideEffects) {
                this._name = _name;
                this._type = _type;
                this._elementType = _elementType;
                this._style = _style;
                this._propertyLength = _propertyLength;
                this._propertyScale = _propertyScale;
                this._presLength = _presLength;
                this._presScale = _presScale;
                this._dataDictionaryKey = _dataDictionaryKey;
                this._maintainable = _maintainable;
                this._writeEnabled = _writeEnabled;
                this._canCauseSideEffects = _canCauseSideEffects;
            }
            Object.defineProperty(PropDef.prototype, "canCauseSideEffects", {
                get: function () {
                    return this._canCauseSideEffects;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "dataDictionaryKey", {
                get: function () {
                    return this._dataDictionaryKey;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "elementType", {
                get: function () {
                    return this._elementType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isBarcodeType", {
                get: function () {
                    return this.type && this.type === 'STRING' && this.dataDictionaryKey && this.dataDictionaryKey === 'DATA_BARCODE';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isBinaryType", {
                get: function () {
                    return this.isLargeBinaryType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isBooleanType", {
                get: function () {
                    return this.type && this.type === 'BOOLEAN';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isCodeRefType", {
                get: function () {
                    return this.type && this.type === 'CODE_REF';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isDateType", {
                get: function () {
                    return this.type && this.type === 'DATE';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isDateTimeType", {
                get: function () {
                    return this.type && this.type === 'DATE_TIME';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isDecimalType", {
                get: function () {
                    return this.type && this.type === 'DECIMAL';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isDoubleType", {
                get: function () {
                    return this.type && this.type === 'DOUBLE';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isEmailType", {
                get: function () {
                    return this.type && this.type === 'DATA_EMAIL';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isGeoFixType", {
                get: function () {
                    return this.type && this.type === 'GEO_FIX';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isGeoLocationType", {
                get: function () {
                    return this.type && this.type === 'GEO_LOCATION';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isHTMLType", {
                get: function () {
                    return this.type && this.type === 'DATA_HTML';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isListType", {
                get: function () {
                    return this.type && this.type === 'LIST';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isInlineMediaStyle", {
                get: function () {
                    return this.style && (this.style === PropDef.STYLE_INLINE_MEDIA || this.style === PropDef.STYLE_INLINE_MEDIA2);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isIntType", {
                get: function () {
                    return this.type && this.type === 'INT';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isLargeBinaryType", {
                get: function () {
                    return this.type && this.type === 'com.dgoi.core.domain.BinaryRef' && this.dataDictionaryKey && this.dataDictionaryKey === 'DATA_LARGEBINARY';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isLongType", {
                get: function () {
                    return this.type && this.type === 'LONG';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isMoneyType", {
                get: function () {
                    return this.isNumericType && this.dataDictionaryKey && this.dataDictionaryKey === 'DATA_MONEY';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isNumericType", {
                get: function () {
                    return this.isDecimalType || this.isDoubleType || this.isIntType || this.isLongType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isObjRefType", {
                get: function () {
                    return this.type && this.type === 'OBJ_REF';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isPasswordType", {
                get: function () {
                    return this.isStringType && this.dataDictionaryKey && this.dataDictionaryKey === 'DATA_PASSWORD';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isPercentType", {
                get: function () {
                    return this.isNumericType && this.dataDictionaryKey && this.dataDictionaryKey === 'DATA_PERCENT';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isStringType", {
                get: function () {
                    return this.type && this.type === 'STRING';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isTelephoneType", {
                get: function () {
                    return this.isStringType && this.dataDictionaryKey && this.dataDictionaryKey === 'DATA_TELEPHONE';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isTextBlock", {
                get: function () {
                    return this.dataDictionaryKey && this.dataDictionaryKey === 'DATA_TEXT_BLOCK';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isTimeType", {
                get: function () {
                    return this.type && this.type === 'TIME';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isUnformattedNumericType", {
                get: function () {
                    return this.isNumericType && this.dataDictionaryKey && this.dataDictionaryKey === 'DATA_UNFORMATTED_NUMBER';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "isURLType", {
                get: function () {
                    return this.isStringType && this.dataDictionaryKey && this.dataDictionaryKey === 'DATA_URL';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "maintainable", {
                get: function () {
                    return this._maintainable;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "presLength", {
                get: function () {
                    return this._presLength;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "presScale", {
                get: function () {
                    return this._presScale;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "propLength", {
                get: function () {
                    return this._propertyLength;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "propScale", {
                get: function () {
                    return this._propertyScale;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "style", {
                get: function () {
                    return this._style;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "type", {
                get: function () {
                    return this._type;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDef.prototype, "writeEnabled", {
                get: function () {
                    return this._writeEnabled;
                },
                enumerable: true,
                configurable: true
            });
            PropDef.STYLE_INLINE_MEDIA = "inlineMedia";
            PropDef.STYLE_INLINE_MEDIA2 = "Image/Video";
            return PropDef;
        })();
        dialog.PropDef = PropDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var SortPropDef = (function () {
            function SortPropDef(_name, _direction) {
                this._name = _name;
                this._direction = _direction;
            }
            Object.defineProperty(SortPropDef.prototype, "direction", {
                get: function () {
                    return this._direction;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SortPropDef.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            return SortPropDef;
        })();
        dialog.SortPropDef = SortPropDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var GraphDataPointDef = (function () {
            function GraphDataPointDef() {
            }
            return GraphDataPointDef;
        })();
        dialog.GraphDataPointDef = GraphDataPointDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/17/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XGetSessionListPropertyResult = (function () {
            function XGetSessionListPropertyResult(_list, _dialogProps) {
                this._list = _list;
                this._dialogProps = _dialogProps;
            }
            Object.defineProperty(XGetSessionListPropertyResult.prototype, "dialogProps", {
                get: function () {
                    return this._dialogProps;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(XGetSessionListPropertyResult.prototype, "values", {
                get: function () {
                    return this._list;
                },
                enumerable: true,
                configurable: true
            });
            XGetSessionListPropertyResult.prototype.valuesAsDictionary = function () {
                var result = {};
                this.values.forEach(function (v) {
                    var pair = StringUtil.splitSimpleKeyValuePair(v);
                    result[pair[0]] = pair[1];
                });
                return result;
            };
            return XGetSessionListPropertyResult;
        })();
        dialog.XGetSessionListPropertyResult = XGetSessionListPropertyResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/30/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XPaneDefRef = (function () {
            function XPaneDefRef(name, paneId, title, type) {
                this.name = name;
                this.paneId = paneId;
                this.title = title;
                this.type = type;
            }
            return XPaneDefRef;
        })();
        dialog.XPaneDefRef = XPaneDefRef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/30/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XFormDef = (function () {
            function XFormDef(borderStyle, formLayout, formStyle, name, paneId, title, headerDefRef, paneDefRefs) {
                this.borderStyle = borderStyle;
                this.formLayout = formLayout;
                this.formStyle = formStyle;
                this.name = name;
                this.paneId = paneId;
                this.title = title;
                this.headerDefRef = headerDefRef;
                this.paneDefRefs = paneDefRefs;
            }
            return XFormDef;
        })();
        dialog.XFormDef = XFormDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/30/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        /*
            @TODO
        */
        var XPaneDef = (function () {
            function XPaneDef() {
            }
            XPaneDef.fromWSPaneDef = function (jsonObject) {
                var paneDefTry = null;
                if (jsonObject['listDef']) {
                }
            };
            return XPaneDef;
        })();
        dialog.XPaneDef = XPaneDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var ColumnDef = (function () {
            function ColumnDef() {
            }
            return ColumnDef;
        })();
        dialog.ColumnDef = ColumnDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/31/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XBarcodeScanDef = (function (_super) {
            __extends(XBarcodeScanDef, _super);
            function XBarcodeScanDef(paneId, name, title) {
                _super.call(this);
                this.paneId = paneId;
                this.name = name;
                this.title = title;
            }
            return XBarcodeScanDef;
        })(dialog.XPaneDef);
        dialog.XBarcodeScanDef = XBarcodeScanDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/31/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XCalendarDef = (function (_super) {
            __extends(XCalendarDef, _super);
            function XCalendarDef(paneId, name, title, descriptionProperty, initialStyle, startDateProperty, startTimeProperty, endDateProperty, endTimeProperty, occurDateProperty, occurTimeProperty) {
                _super.call(this);
                this.paneId = paneId;
                this.name = name;
                this.title = title;
                this.descriptionProperty = descriptionProperty;
                this.initialStyle = initialStyle;
                this.startDateProperty = startDateProperty;
                this.startTimeProperty = startTimeProperty;
                this.endDateProperty = endDateProperty;
                this.endTimeProperty = endTimeProperty;
                this.occurDateProperty = occurDateProperty;
                this.occurTimeProperty = occurTimeProperty;
            }
            return XCalendarDef;
        })(dialog.XPaneDef);
        dialog.XCalendarDef = XCalendarDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/31/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XChangePaneModeResult = (function () {
            function XChangePaneModeResult(editorRecordDef, dialogProperties) {
                this.editorRecordDef = editorRecordDef;
                this.dialogProperties = dialogProperties;
            }
            return XChangePaneModeResult;
        })();
        dialog.XChangePaneModeResult = XChangePaneModeResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/30/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XDetailsDef = (function (_super) {
            __extends(XDetailsDef, _super);
            function XDetailsDef(paneId, name, title, cancelButtonText, commitButtonText, editable, focusPropertyName, overrideGML, rows) {
                _super.call(this);
                this.paneId = paneId;
                this.name = name;
                this.title = title;
                this.cancelButtonText = cancelButtonText;
                this.commitButtonText = commitButtonText;
                this.editable = editable;
                this.focusPropertyName = focusPropertyName;
                this.overrideGML = overrideGML;
                this.rows = rows;
            }
            return XDetailsDef;
        })(dialog.XPaneDef);
        dialog.XDetailsDef = XDetailsDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/31/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XFormModel = (function () {
            function XFormModel(form, header, children, placement, refreshTimer, sizeToWindow) {
                this.form = form;
                this.header = header;
                this.children = children;
                this.placement = placement;
                this.refreshTimer = refreshTimer;
                this.sizeToWindow = sizeToWindow;
            }
            return XFormModel;
        })();
        dialog.XFormModel = XFormModel;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/31/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XFormModelComp = (function () {
            function XFormModelComp(paneId, redirection, label, title) {
                this.paneId = paneId;
                this.redirection = redirection;
                this.label = label;
                this.title = title;
            }
            return XFormModelComp;
        })();
        dialog.XFormModelComp = XFormModelComp;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XGeoFixDef = (function (_super) {
            __extends(XGeoFixDef, _super);
            function XGeoFixDef(paneId, name, title) {
                _super.call(this);
                this.paneId = paneId;
                this.name = name;
                this.title = title;
            }
            return XGeoFixDef;
        })(dialog.XPaneDef);
        dialog.XGeoFixDef = XGeoFixDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XGeoLocationDef = (function (_super) {
            __extends(XGeoLocationDef, _super);
            function XGeoLocationDef(paneId, name, title) {
                _super.call(this);
                this.paneId = paneId;
                this.name = name;
                this.title = title;
            }
            return XGeoLocationDef;
        })(dialog.XPaneDef);
        dialog.XGeoLocationDef = XGeoLocationDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XGetActiveColumnDefsResult = (function () {
            function XGetActiveColumnDefsResult(columnStyle, columns) {
                this.columnStyle = columnStyle;
                this.columns = columns;
            }
            return XGetActiveColumnDefsResult;
        })();
        dialog.XGetActiveColumnDefsResult = XGetActiveColumnDefsResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XGetAvailableValuesResult = (function () {
            function XGetAvailableValuesResult(list) {
                this.list = list;
            }
            return XGetAvailableValuesResult;
        })();
        dialog.XGetAvailableValuesResult = XGetAvailableValuesResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XGraphDef = (function (_super) {
            __extends(XGraphDef, _super);
            function XGraphDef(paneId, name, title, graphType, identityDataPoint, groupingDataPoint, dataPoints, filterDataPoints, sampleModel) {
                _super.call(this);
                this.paneId = paneId;
                this.name = name;
                this.title = title;
                this.graphType = graphType;
                this.identityDataPoint = identityDataPoint;
                this.groupingDataPoint = groupingDataPoint;
                this.dataPoints = dataPoints;
                this.filterDataPoints = filterDataPoints;
                this.sampleModel = sampleModel;
            }
            return XGraphDef;
        })(dialog.XPaneDef);
        dialog.XGraphDef = XGraphDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XImagePickerDef = (function (_super) {
            __extends(XImagePickerDef, _super);
            function XImagePickerDef(paneId, name, title, URLProperty, defaultActionId) {
                _super.call(this);
                this.paneId = paneId;
                this.name = name;
                this.title = title;
                this.URLProperty = URLProperty;
                this.defaultActionId = defaultActionId;
            }
            return XImagePickerDef;
        })(dialog.XPaneDef);
        dialog.XImagePickerDef = XImagePickerDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XListDef = (function (_super) {
            __extends(XListDef, _super);
            function XListDef(paneId, name, title, style, initialColumns, columnsStyle, overrideGML) {
                _super.call(this);
                this.paneId = paneId;
                this.name = name;
                this.title = title;
                this.style = style;
                this.initialColumns = initialColumns;
                this.columnsStyle = columnsStyle;
                this.overrideGML = overrideGML;
            }
            Object.defineProperty(XListDef.prototype, "graphicalMarkup", {
                get: function () {
                    return this.overrideGML;
                },
                enumerable: true,
                configurable: true
            });
            return XListDef;
        })(dialog.XPaneDef);
        dialog.XListDef = XListDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XMapDef = (function (_super) {
            __extends(XMapDef, _super);
            function XMapDef(paneId, name, title, descriptionProperty, streetProperty, cityProperty, stateProperty, postalCodeProperty, latitudeProperty, longitudeProperty) {
                _super.call(this);
                this.paneId = paneId;
                this.name = name;
                this.title = title;
                this.descriptionProperty = descriptionProperty;
                this.streetProperty = streetProperty;
                this.cityProperty = cityProperty;
                this.stateProperty = stateProperty;
                this.postalCodeProperty = postalCodeProperty;
                this.latitudeProperty = latitudeProperty;
                this.longitudeProperty = longitudeProperty;
            }
            return XMapDef;
        })(dialog.XPaneDef);
        dialog.XMapDef = XMapDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XOpenEditorModelResult = (function () {
            function XOpenEditorModelResult(editorRecordDef, formModel) {
                this.editorRecordDef = editorRecordDef;
                this.formModel = formModel;
            }
            Object.defineProperty(XOpenEditorModelResult.prototype, "entityRecDef", {
                get: function () {
                    return this.editorRecordDef;
                },
                enumerable: true,
                configurable: true
            });
            return XOpenEditorModelResult;
        })();
        dialog.XOpenEditorModelResult = XOpenEditorModelResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XOpenQueryModelResult = (function () {
            function XOpenQueryModelResult(entityRecDef, sortPropertyDef, defaultActionId) {
                this.entityRecDef = entityRecDef;
                this.sortPropertyDef = sortPropertyDef;
                this.defaultActionId = defaultActionId;
            }
            Object.defineProperty(XOpenQueryModelResult.prototype, "queryRecordDef", {
                set: function (queryRecDef) {
                    this.entityRecDef = new dialog.EntityRecDef(queryRecDef.propDefs);
                },
                enumerable: true,
                configurable: true
            });
            return XOpenQueryModelResult;
        })();
        dialog.XOpenQueryModelResult = XOpenQueryModelResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XPropertyChangeResult = (function () {
            function XPropertyChangeResult(availableValueChanges, propertyName, sideEffects, editorRecordDef) {
                this.availableValueChanges = availableValueChanges;
                this.propertyName = propertyName;
                this.sideEffects = sideEffects;
                this.editorRecordDef = editorRecordDef;
            }
            Object.defineProperty(XPropertyChangeResult.prototype, "sideEffectsDef", {
                get: function () {
                    return this.editorRecordDef;
                },
                enumerable: true,
                configurable: true
            });
            return XPropertyChangeResult;
        })();
        dialog.XPropertyChangeResult = XPropertyChangeResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XQueryResult = (function () {
            function XQueryResult(entityRecs, entityRecDef, hasMore, sortPropDefs, defaultActionId, dialogProps) {
                this.entityRecs = entityRecs;
                this.entityRecDef = entityRecDef;
                this.hasMore = hasMore;
                this.sortPropDefs = sortPropDefs;
                this.defaultActionId = defaultActionId;
                this.dialogProps = dialogProps;
            }
            XQueryResult.fromWS = function (otype, jsonObj) {
                return dialog.DialogTriple.fromWSDialogObject(jsonObj['queryRecordDef'], 'WSQueryRecordDef', dialog.OType.factoryFn).bind(function (entityRecDef) {
                    var entityRecDefJson = jsonObj['queryRecordDef'];
                    var actionId = jsonObj['defaultActionId'];
                    return dialog.DialogTriple.fromListOfWSDialogObject(entityRecDefJson['sortPropertyDefs'], 'WSSortPropertyDef', dialog.OType.factoryFn).bind(function (sortPropDefs) {
                        var queryRecsJson = jsonObj['queryRecords'];
                        if (queryRecsJson['WS_LTYPE'] !== 'WSQueryRecord') {
                            return new Failure('XQueryResult::fromWS: Expected WS_LTYPE of WSQueryRecord but found ' + queryRecsJson['WS_LTYPE']);
                        }
                        var queryRecsValues = queryRecsJson['values'];
                        for (var i = 0; i < queryRecsValues.length; i++) {
                            var queryRecValue = queryRecsValues[i];
                            if (queryRecValue['WS_OTYPE'] !== 'WSQueryRecord') {
                                return new Failure('XQueryResult::fromWS: Expected WS_OTYPE of WSQueryRecord but found ' + queryRecValue['WS_LTYPE']);
                            }
                            var objectId = queryRecValue['objectId'];
                            var recPropsObj = queryRecValue['properties'];
                            if (recPropsObj['WS_LTYPE'] !== 'Object') {
                                return new Failure('XQueryResult::fromWS: Expected WS_LTYPE of Object but found ' + recPropsObj['WS_LTYPE']);
                            }
                            var recPropsObjValues = recPropsObj['values'];
                            var propsTry = dialog.Prop.fromWSNamesAndValues(entityRecDef.propNames, recPropsObjValues);
                            if (propsTry.isFailure)
                                return new Failure(propsTry.failure);
                            var props = propsTry.success;
                            if (queryRecValue['propertyAnnotations']) {
                                var propAnnosJson = queryRecValue['propertyAnnotations'];
                                var annotatedPropsTry = dialog.DataAnno.annotatePropsUsingWSDataAnnotation(props, propAnnosJson);
                                if (annotatedPropsTry.isFailure)
                                    return new Failure(annotatedPropsTry.failure);
                                props = annotatedPropsTry.success;
                            }
                            var recAnnos = null;
                            if (queryRecValue['recordAnnotation']) {
                                var recAnnosTry = dialog.DialogTriple.fromWSDialogObject(queryRecValue['recoredAnnotation'], 'WSDataAnnotation', dialog.OType.factoryFn);
                                if (recAnnosTry.isFailure)
                                    return new Failure(recAnnosTry.failure);
                                recAnnos = recAnnosTry.success;
                            }
                            var entityRec = EntityRec.U;
                        }
                    });
                });
            };
            return XQueryResult;
        })();
        dialog.XQueryResult = XQueryResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XReadPropertyResult = (function () {
            function XReadPropertyResult() {
            }
            return XReadPropertyResult;
        })();
        dialog.XReadPropertyResult = XReadPropertyResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XReadResult = (function () {
            function XReadResult() {
            }
            return XReadResult;
        })();
        dialog.XReadResult = XReadResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 4/1/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XWriteResult = (function () {
            function XWriteResult() {
            }
            return XWriteResult;
        })();
        dialog.XWriteResult = XWriteResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/16/15.
 */
/**
 * Created by rburson on 3/16/15.
 */
///<reference path="../util/references.ts"/>
/**
 * Created by rburson on 3/10/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var Redirection = (function () {
            function Redirection() {
            }
            Redirection.fromWS = function (otype, jsonObj) {
                if (jsonObj && jsonObj['webURL']) {
                    return dialog.OType.deserializeObject(jsonObj, 'WSWebRedirection', dialog.OType.factoryFn);
                }
                else if (jsonObj && jsonObj['workbenchId']) {
                    return dialog.OType.deserializeObject(jsonObj, 'WSWorkbenchRedirection', dialog.OType.factoryFn);
                }
                else {
                    return dialog.OType.deserializeObject(jsonObj, 'WSDialogRedirection', dialog.OType.factoryFn);
                }
            };
            return Redirection;
        })();
        dialog.Redirection = Redirection;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/27/15.
 */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var DialogHandle = (function () {
            function DialogHandle(handleValue, sessionHandle) {
                this.handleValue = handleValue;
                this.sessionHandle = sessionHandle;
            }
            return DialogHandle;
        })();
        dialog.DialogHandle = DialogHandle;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/26/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var DialogRedirection = (function (_super) {
            __extends(DialogRedirection, _super);
            function DialogRedirection(_dialogHandle, _dialogType, _dialogMode, _paneMode, _objectId, _open, _domainClassName, _dialogModelClassName, _dialogProperties, _fromDialogProperties) {
                _super.call(this);
                this._dialogHandle = _dialogHandle;
                this._dialogType = _dialogType;
                this._dialogMode = _dialogMode;
                this._paneMode = _paneMode;
                this._objectId = _objectId;
                this._open = _open;
                this._domainClassName = _domainClassName;
                this._dialogModelClassName = _dialogModelClassName;
                this._dialogProperties = _dialogProperties;
                this._fromDialogProperties = _fromDialogProperties;
            }
            Object.defineProperty(DialogRedirection.prototype, "dialogHandle", {
                get: function () {
                    return this._dialogHandle;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DialogRedirection.prototype, "dialogMode", {
                get: function () {
                    return this._dialogMode;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DialogRedirection.prototype, "dialogModelClassName", {
                get: function () {
                    return this._dialogModelClassName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DialogRedirection.prototype, "dialogProperties", {
                get: function () {
                    return this._dialogProperties;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DialogRedirection.prototype, "dialogType", {
                get: function () {
                    return this._dialogType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DialogRedirection.prototype, "domainClassName", {
                get: function () {
                    return this._domainClassName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DialogRedirection.prototype, "fromDialogProperties", {
                get: function () {
                    return this._fromDialogProperties;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DialogRedirection.prototype, "isEditor", {
                get: function () {
                    return this._dialogType === 'EDITOR';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DialogRedirection.prototype, "isQuery", {
                get: function () {
                    return this._dialogType === 'QUERY';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DialogRedirection.prototype, "objectId", {
                get: function () {
                    return this._objectId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DialogRedirection.prototype, "open", {
                get: function () {
                    return this._open;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DialogRedirection.prototype, "paneMode", {
                get: function () {
                    return this._paneMode;
                },
                enumerable: true,
                configurable: true
            });
            return DialogRedirection;
        })(dialog.Redirection);
        dialog.DialogRedirection = DialogRedirection;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/17/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var NullRedirection = (function (_super) {
            __extends(NullRedirection, _super);
            function NullRedirection(fromDialogProperties) {
                _super.call(this);
                this.fromDialogProperties = fromDialogProperties;
            }
            return NullRedirection;
        })(dialog.Redirection);
        dialog.NullRedirection = NullRedirection;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/27/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var WebRedirection = (function (_super) {
            __extends(WebRedirection, _super);
            function WebRedirection(_webURL, _open, _dialogProperties, _fromDialogProperties) {
                _super.call(this);
                this._webURL = _webURL;
                this._open = _open;
                this._dialogProperties = _dialogProperties;
                this._fromDialogProperties = _fromDialogProperties;
            }
            return WebRedirection;
        })(dialog.Redirection);
        dialog.WebRedirection = WebRedirection;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/27/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var WorkbenchRedirection = (function (_super) {
            __extends(WorkbenchRedirection, _super);
            function WorkbenchRedirection(_workbenchId, _dialogProperties, _fromDialogProperties) {
                _super.call(this);
                this._workbenchId = _workbenchId;
                this._dialogProperties = _dialogProperties;
                this._fromDialogProperties = _fromDialogProperties;
            }
            Object.defineProperty(WorkbenchRedirection.prototype, "workbenchId", {
                get: function () {
                    return this._workbenchId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WorkbenchRedirection.prototype, "dialogProperties", {
                get: function () {
                    return this._dialogProperties;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WorkbenchRedirection.prototype, "fromDialogProperties", {
                get: function () {
                    return this._fromDialogProperties;
                },
                enumerable: true,
                configurable: true
            });
            return WorkbenchRedirection;
        })(dialog.Redirection);
        dialog.WorkbenchRedirection = WorkbenchRedirection;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/9/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var DialogTriple = (function () {
            function DialogTriple() {
            }
            DialogTriple.extractList = function (jsonObject, Ltype, extractor) {
                var result;
                if (jsonObject) {
                    var lt = jsonObject['WS_LTYPE'];
                    if (Ltype === lt) {
                        if (jsonObject['values']) {
                            var realValues = [];
                            var values = jsonObject['values'];
                            values.every(function (item) {
                                var extdValue = extractor(item);
                                if (extdValue.isFailure) {
                                    result = new Failure(extdValue.failure);
                                    return false;
                                }
                                realValues.push(extdValue.success);
                                return true;
                            });
                            if (!result) {
                                result = new Success(realValues);
                            }
                        }
                        else {
                            result = new Failure("DialogTriple::extractList: Values array not found");
                        }
                    }
                    else {
                        result = new Failure("DialogTriple::extractList: Expected WS_LTYPE " + Ltype + " but found " + lt);
                    }
                }
                return result;
            };
            DialogTriple.extractRedirection = function (jsonObject, Otype) {
                var tripleTry = DialogTriple._extractTriple(jsonObject, Otype, false, function () {
                    return new Success(new dialog.NullRedirection({}));
                });
                var answer;
                if (tripleTry.isSuccess) {
                    var triple = tripleTry.success;
                    answer = triple.isLeft ? new Success(triple.left) : new Success(triple.right);
                }
                else {
                    answer = new Failure(tripleTry.failure);
                }
                return answer;
            };
            DialogTriple.extractTriple = function (jsonObject, Otype, extractor) {
                return DialogTriple._extractTriple(jsonObject, Otype, false, extractor);
            };
            DialogTriple.extractValue = function (jsonObject, Otype, extractor) {
                return DialogTriple._extractValue(jsonObject, Otype, false, extractor);
            };
            DialogTriple.extractValueIgnoringRedirection = function (jsonObject, Otype, extractor) {
                return DialogTriple._extractValue(jsonObject, Otype, true, extractor);
            };
            DialogTriple.fromWSDialogObject = function (obj, Otype, factoryFn) {
                if (!obj) {
                    return new Failure('DialogTriple::fromWSDialogObject: Cannot extract from null value');
                }
                else if (typeof obj !== 'object') {
                    return new Success(obj);
                }
                try {
                    if (!factoryFn) {
                        /* Assume we're just going to coerce the exiting object */
                        return DialogTriple.extractValue(obj, Otype, function () {
                            return new Success(obj);
                        });
                    }
                    else {
                        return DialogTriple.extractValue(obj, Otype, function () {
                            return dialog.OType.deserializeObject(obj, Otype, factoryFn);
                        });
                    }
                }
                catch (e) {
                    return new Failure('DialogTriple::fromWSDialogObject: ' + e.name + ": " + e.message);
                }
            };
            DialogTriple.fromListOfWSDialogObject = function (jsonObject, Ltype, factoryFn) {
                return DialogTriple.extractList(jsonObject, Ltype, function (value) {
                    return DialogTriple.fromWSDialogObject(value, Ltype, factoryFn);
                });
            };
            DialogTriple.fromWSDialogObjectResult = function (jsonObject, resultOtype, targetOtype, objPropName, factoryFn) {
                return DialogTriple.extractValue(jsonObject, resultOtype, function () {
                    return DialogTriple.fromWSDialogObject(jsonObject[objPropName], targetOtype, factoryFn);
                });
            };
            DialogTriple.fromWSDialogObjectResultWithFunc = function (jsonObject, resultOtype, objPropName, fromWSObjectFunc) {
                return DialogTriple.extractValue(jsonObject, resultOtype, function () {
                    return fromWSObjectFunc(jsonObject[objPropName]);
                });
            };
            DialogTriple.fromListOfWSDialogObjectWithFunc = function (jsonObject, Ltype, fromWSObjectFunc) {
                return DialogTriple.extractList(jsonObject, Ltype, function (value) {
                    return fromWSObjectFunc(value);
                });
            };
            DialogTriple._extractTriple = function (jsonObject, Otype, ignoreRedirection, extractor) {
                var result;
                if (!jsonObject) {
                    return new Failure('DialogTriple::extractTriple: cannot extract object of WS_OTYPE ' + Otype + ' because json object is null');
                }
                else {
                    var ot = jsonObject['WS_OTYPE'];
                    if (!ot || Otype !== ot) {
                        result = new Failure('DialogTriple:extractTriple: expected O_TYPE ' + Otype + ' but found ' + ot);
                    }
                    else {
                        if (jsonObject['exception']) {
                            var dialogException = jsonObject['exception'];
                            result = new Failure(dialogException);
                        }
                        else if (jsonObject['redirection'] && !ignoreRedirection) {
                            var drt = DialogTriple.fromWSDialogObject(jsonObject['redirection'], 'WSRedirection', dialog.OType.factoryFn);
                            if (drt.isFailure) {
                                result = new Failure(drt.failure);
                            }
                            else {
                                result = new Success(Either.left(drt.success));
                            }
                        }
                        else {
                            if (extractor) {
                                var valueTry = extractor();
                                if (valueTry.isFailure) {
                                    result = new Failure(valueTry.failure);
                                }
                                else {
                                    result = new Success(Either.right(valueTry.success));
                                }
                            }
                            else {
                                result = new Failure('DialogTriple::extractTriple: Triple is not an exception or redirection and no value extractor was provided');
                            }
                        }
                    }
                }
                return result;
            };
            DialogTriple._extractValue = function (jsonObject, Otype, ignoreRedirection, extractor) {
                var tripleTry = DialogTriple._extractTriple(jsonObject, Otype, ignoreRedirection, extractor);
                var result;
                if (tripleTry.isFailure) {
                    result = new Failure(tripleTry.failure);
                }
                else {
                    var triple = tripleTry.success;
                    if (triple.isLeft) {
                        result = new Failure('DialogTriple::extractValue: Unexpected redirection for O_TYPE: ' + Otype);
                    }
                    else {
                        result = new Success(triple.right);
                    }
                }
                return result;
            };
            return DialogTriple;
        })();
        dialog.DialogTriple = DialogTriple;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/27/15.
 */
///<reference path="references.ts"/>
/**
 * Created by rburson on 3/27/15.
 */
///<reference path="references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var ContextAction = (function () {
            function ContextAction(actionId, objectId, fromActionSource) {
                this.actionId = actionId;
                this.objectId = objectId;
                this.fromActionSource = fromActionSource;
            }
            Object.defineProperty(ContextAction.prototype, "virtualPathSuffix", {
                get: function () {
                    return [this.objectId, this.actionId];
                },
                enumerable: true,
                configurable: true
            });
            return ContextAction;
        })();
        dialog.ContextAction = ContextAction;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/17/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var NavRequest;
        (function (NavRequest) {
            var Util;
            (function (Util) {
                function fromRedirection(redirection, actionSource, sessionContext) {
                    var result;
                    if (redirection instanceof dialog.WebRedirection) {
                        result = Future.createFailedFuture('NavRequest::fromRedirection', 'WebRedirection not yet implemented');
                    }
                    else if (redirection instanceof dialog.WorkbenchRedirection) {
                        var wbr = redirection;
                        result = dialog.AppContext.singleton.getWorkbench(sessionContext, wbr.workbenchId).map(function (wb) {
                            return wb;
                        });
                    }
                    else if (redirection instanceof dialog.DialogRedirection) {
                        var dr = redirection;
                    }
                    else if (redirection instanceof dialog.NullRedirection) {
                        var nullRedir = redirection;
                        var nullNavRequest = new dialog.NullNavRequest();
                        ObjUtil.addAllProps(nullRedir.fromDialogProperties, nullNavRequest.fromDialogProperties);
                        result = Future.createSuccessfulFuture('NavRequest:fromRedirection/nullRedirection', nullNavRequest);
                    }
                    else {
                        result = Future.createFailedFuture('NavRequest::fromRedirection', 'Unrecognized type of Redirection ' + ObjUtil.formatRecAttr(redirection));
                    }
                    return result;
                }
                Util.fromRedirection = fromRedirection;
            })(Util = NavRequest.Util || (NavRequest.Util = {}));
        })(NavRequest = dialog.NavRequest || (dialog.NavRequest = {}));
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/30/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var NullNavRequest = (function () {
            function NullNavRequest() {
                this.fromDialogProperties = {};
            }
            return NullNavRequest;
        })();
        dialog.NullNavRequest = NullNavRequest;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/12/15.
 */
/**
 * Created by rburson on 3/13/15.
 */
///<reference path="references.ts"/>
///<reference path="../fp/references.ts"/>
///<reference path="../util/references.ts"/>
///<reference path="../ws/references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var AppContextState;
        (function (AppContextState) {
            AppContextState[AppContextState["LOGGED_OUT"] = 0] = "LOGGED_OUT";
            AppContextState[AppContextState["LOGGED_IN"] = 1] = "LOGGED_IN";
        })(AppContextState || (AppContextState = {}));
        var AppContextValues = (function () {
            function AppContextValues(sessionContext, appWinDef, tenantSettings) {
                this.sessionContext = sessionContext;
                this.appWinDef = appWinDef;
                this.tenantSettings = tenantSettings;
            }
            return AppContextValues;
        })();
        var AppContext = (function () {
            function AppContext() {
                if (AppContext._singleton) {
                    throw new Error("Singleton instance already created");
                }
                this._deviceProps = [];
                this.setAppContextStateToLoggedOut();
                AppContext._singleton = this;
            }
            Object.defineProperty(AppContext, "defaultTTLInMillis", {
                get: function () {
                    return AppContext.ONE_DAY_IN_MILLIS;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppContext, "singleton", {
                get: function () {
                    if (!AppContext._singleton) {
                        AppContext._singleton = new AppContext();
                    }
                    return AppContext._singleton;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppContext.prototype, "appWinDefTry", {
                get: function () {
                    return this._appWinDefTry;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppContext.prototype, "deviceProps", {
                get: function () {
                    return this._deviceProps;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppContext.prototype, "isLoggedIn", {
                get: function () {
                    return this._appContextState === 1 /* LOGGED_IN */;
                },
                enumerable: true,
                configurable: true
            });
            AppContext.prototype.getWorkbench = function (sessionContext, workbenchId) {
                if (this._appContextState === 0 /* LOGGED_OUT */) {
                    return Future.createFailedFuture("AppContext::getWorkbench", "User is logged out");
                }
                return dialog.WorkbenchService.getWorkbench(sessionContext, workbenchId);
            };
            AppContext.prototype.login = function (gatewayHost, tenantId, clientType, userId, password) {
                var _this = this;
                if (this._appContextState === 1 /* LOGGED_IN */) {
                    return Future.createFailedFuture("AppContext::login", "User is already logged in");
                }
                var answer;
                var appContextValuesFr = this.loginOnline(gatewayHost, tenantId, clientType, userId, password, this.deviceProps);
                return appContextValuesFr.bind(function (appContextValues) {
                    _this.setAppContextStateToLoggedIn(appContextValues);
                    return Future.createSuccessfulFuture('AppContext::login', appContextValues.appWinDef);
                });
            };
            AppContext.prototype.performLaunchAction = function (launchAction) {
                if (this._appContextState === 0 /* LOGGED_OUT */) {
                    return Future.createFailedFuture("AppContext::performLaunchAction", "User is logged out");
                }
                return this.performLaunchActionOnline(launchAction, this.sessionContextTry.success);
            };
            Object.defineProperty(AppContext.prototype, "sessionContextTry", {
                get: function () {
                    return this._sessionContextTry;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppContext.prototype, "tenantSettingsTry", {
                get: function () {
                    return this._tenantSettingsTry;
                },
                enumerable: true,
                configurable: true
            });
            AppContext.prototype.finalizeContext = function (sessionContext, deviceProps) {
                var devicePropName = "com.catavolt.session.property.DeviceProperties";
                return dialog.SessionService.setSessionListProperty(devicePropName, deviceProps, sessionContext).bind(function (setPropertyListResult) {
                    var listPropName = "com.catavolt.session.property.TenantProperties";
                    return dialog.SessionService.getSessionListProperty(listPropName, sessionContext).bind(function (listPropertyResult) {
                        return dialog.WorkbenchService.getAppWinDef(sessionContext).bind(function (appWinDef) {
                            return Future.createSuccessfulFuture("AppContextCore:loginFromSystemContext", new AppContextValues(sessionContext, appWinDef, listPropertyResult.valuesAsDictionary()));
                        });
                    });
                });
            };
            AppContext.prototype.loginOnline = function (gatewayHost, tenantId, clientType, userId, password, deviceProps) {
                var _this = this;
                var systemContextFr = this.newSystemContextFr(gatewayHost, tenantId);
                return systemContextFr.bind(function (sc) {
                    return _this.loginFromSystemContext(sc, tenantId, userId, password, deviceProps, clientType);
                });
            };
            AppContext.prototype.loginFromSystemContext = function (systemContext, tenantId, userId, password, deviceProps, clientType) {
                var _this = this;
                var sessionContextFuture = dialog.SessionService.createSession(tenantId, userId, password, clientType, systemContext);
                return sessionContextFuture.bind(function (sessionContext) {
                    return _this.finalizeContext(sessionContext, deviceProps);
                });
            };
            AppContext.prototype.newSystemContextFr = function (gatewayHost, tenantId) {
                var serviceEndpoint = dialog.GatewayService.getServiceEndpoint(tenantId, 'soi-json', gatewayHost);
                return serviceEndpoint.map(function (serviceEndpoint) {
                    return new dialog.SystemContextImpl(serviceEndpoint.serverAssignment);
                });
            };
            AppContext.prototype.performLaunchActionOnline = function (launchAction, sessionContext) {
                var redirFr = dialog.WorkbenchService.performLaunchAction(launchAction.id, launchAction.workbenchId, sessionContext);
                return redirFr.bind(function (r) {
                    return dialog.NavRequest.Util.fromRedirection(r, launchAction, sessionContext);
                });
            };
            AppContext.prototype.setAppContextStateToLoggedIn = function (appContextValues) {
                this._appWinDefTry = new Success(appContextValues.appWinDef);
                this._tenantSettingsTry = new Success(appContextValues.tenantSettings);
                this._sessionContextTry = new Success(appContextValues.sessionContext);
                this._appContextState = 1 /* LOGGED_IN */;
            };
            AppContext.prototype.setAppContextStateToLoggedOut = function () {
                this._appWinDefTry = new Failure("Not logged in");
                this._tenantSettingsTry = new Failure('Not logged in"');
                this._sessionContextTry = new Failure('Not loggged in');
                this._appContextState = 0 /* LOGGED_OUT */;
            };
            AppContext.ONE_DAY_IN_MILLIS = 60 * 60 * 24 * 1000;
            return AppContext;
        })();
        dialog.AppContext = AppContext;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/9/15.
 */
///<reference path="../fp/references.ts"/>
///<reference path="../ws/references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var SessionContextImpl = (function () {
            function SessionContextImpl(sessionHandle, userName, currentDivision, serverVersion, systemContext) {
                this.sessionHandle = sessionHandle;
                this.userName = userName;
                this.currentDivision = currentDivision;
                this.serverVersion = serverVersion;
                this.systemContext = systemContext;
                this._remoteSession = true;
            }
            SessionContextImpl.fromWSCreateSessionResult = function (jsonObject, systemContext) {
                var sessionContextTry = dialog.DialogTriple.fromWSDialogObject(jsonObject, 'WSCreateSessionResult', dialog.OType.factoryFn);
                return sessionContextTry.map(function (sessionContext) {
                    sessionContext.systemContext = systemContext;
                    return sessionContext;
                });
            };
            SessionContextImpl.createSessionContext = function (gatewayHost, tenantId, clientType, userId, password) {
                var sessionContext = new SessionContextImpl(null, userId, "", null, null);
                sessionContext._gatewayHost = gatewayHost;
                sessionContext._tenantId = tenantId;
                sessionContext._clientType = clientType;
                sessionContext._userId = userId;
                sessionContext._password = password;
                sessionContext._remoteSession = false;
                return sessionContext;
            };
            Object.defineProperty(SessionContextImpl.prototype, "clientType", {
                get: function () {
                    return this._clientType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SessionContextImpl.prototype, "gatewayHost", {
                get: function () {
                    return this._gatewayHost;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SessionContextImpl.prototype, "isLocalSession", {
                get: function () {
                    return !this._remoteSession;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SessionContextImpl.prototype, "isRemoteSession", {
                get: function () {
                    return this._remoteSession;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SessionContextImpl.prototype, "password", {
                get: function () {
                    return this._password;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SessionContextImpl.prototype, "tenantId", {
                get: function () {
                    return this._tenantId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SessionContextImpl.prototype, "userId", {
                get: function () {
                    return this._userId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SessionContextImpl.prototype, "online", {
                set: function (online) {
                    this._remoteSession = online;
                },
                enumerable: true,
                configurable: true
            });
            return SessionContextImpl;
        })();
        dialog.SessionContextImpl = SessionContextImpl;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/9/15.
 */
///<reference path="../ws/references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var SystemContextImpl = (function () {
            function SystemContextImpl(_urlString) {
                this._urlString = _urlString;
            }
            Object.defineProperty(SystemContextImpl.prototype, "urlString", {
                get: function () {
                    return this._urlString;
                },
                enumerable: true,
                configurable: true
            });
            return SystemContextImpl;
        })();
        dialog.SystemContextImpl = SystemContextImpl;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/30/15.
 */
/**
 * Created by rburson on 3/13/15.
 */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var AppWinDef = (function () {
            function AppWinDef(workbenches, appVendors, windowTitle, windowWidth, windowHeight) {
                this._workbenches = workbenches || [];
                this._applicationVendors = appVendors || [];
                this._windowTitle = windowTitle;
                this._windowWidth = windowWidth;
                this._windowHeight = windowHeight;
            }
            Object.defineProperty(AppWinDef.prototype, "appVendors", {
                get: function () {
                    return this._applicationVendors;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppWinDef.prototype, "windowHeight", {
                get: function () {
                    return this._windowHeight;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppWinDef.prototype, "windowTitle", {
                get: function () {
                    return this._windowTitle;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppWinDef.prototype, "windowWidth", {
                get: function () {
                    return this._windowWidth;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AppWinDef.prototype, "workbenches", {
                get: function () {
                    return this._workbenches;
                },
                enumerable: true,
                configurable: true
            });
            return AppWinDef;
        })();
        dialog.AppWinDef = AppWinDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/9/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var SessionService = (function () {
            function SessionService() {
            }
            SessionService.createSession = function (tenantId, userId, password, clientType, systemContext) {
                var method = "createSessionDirectly";
                var params = { 'tenantId': tenantId, 'userId': userId, 'password': password, 'clientType': clientType };
                var call = Call.createCallWithoutSession(SessionService.SERVICE_PATH, method, params, systemContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture("createSession/extractSessionContextFromResponse", dialog.SessionContextImpl.fromWSCreateSessionResult(result, systemContext));
                });
            };
            SessionService.getSessionListProperty = function (propertyName, sessionContext) {
                var method = "getSessionListProperty";
                var params = {
                    'propertyName': propertyName,
                    'sessionHandle': sessionContext.sessionHandle
                };
                var call = Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture("getSessionListProperty/extractResultFromResponse", dialog.DialogTriple.fromWSDialogObject(result, 'WSGetSessionListPropertyResult', dialog.OType.factoryFn));
                });
            };
            SessionService.setSessionListProperty = function (propertyName, listProperty, sessionContext) {
                var method = "setSessionListProperty";
                var params = {
                    'propertyName': propertyName,
                    'listProperty': listProperty,
                    'sessionHandle': sessionContext.sessionHandle
                };
                var call = Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createSuccessfulFuture("setSessionListProperty/extractVoidResultFromResponse", result);
                });
            };
            SessionService.SERVICE_NAME = "SessionService";
            SessionService.SERVICE_PATH = "soi-json-v02/" + SessionService.SERVICE_NAME;
            return SessionService;
        })();
        dialog.SessionService = SessionService;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/12/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var GatewayService = (function () {
            function GatewayService() {
            }
            GatewayService.getServiceEndpoint = function (tenantId, serviceName, gatewayHost) {
                //We have to fake this for now, due to cross domain issues
                var fakeResponse = {
                    responseType: "soi-json",
                    tenantId: "***REMOVED***z",
                    serverAssignment: "https://dfw.catavolt.net/vs301",
                    appVersion: "1.3.262",
                    soiVersion: "v02"
                };
                var endPointFuture = Future.createSuccessfulFuture('serviceEndpoint', fakeResponse);
                /*
                var f:Future<StringDictionary> = Get.fromUrl('https://' + gatewayHost + '/' + tenantId + '/' + serviceName).perform();
                var endPointFuture:Future<ServiceEndpoint> = f.bind(
                    (jsonObject:StringDictionary)=>{
                        //'bounce cast' the jsonObject here to coerce into ServiceEndpoint
                        return Future.createSuccessfulFuture<ServiceEndpoint>("serviceEndpoint", <any>jsonObject);
                    }
                );
                */
                return endPointFuture;
            };
            return GatewayService;
        })();
        dialog.GatewayService = GatewayService;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/17/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var Workbench = (function () {
            function Workbench(_id, _name, _alias, _actions) {
                this._id = _id;
                this._name = _name;
                this._alias = _alias;
                this._actions = _actions;
            }
            Object.defineProperty(Workbench.prototype, "alias", {
                get: function () {
                    return this._alias;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Workbench.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Workbench.prototype, "workbenchId", {
                get: function () {
                    return this._id;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Workbench.prototype, "workbenchLaunchActions", {
                get: function () {
                    return ArrayUtil.copy(this._actions);
                },
                enumerable: true,
                configurable: true
            });
            return Workbench;
        })();
        dialog.Workbench = Workbench;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/17/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var WorkbenchLaunchAction = (function () {
            function WorkbenchLaunchAction(id, workbenchId, name, alias, iconBase) {
                this.id = id;
                this.workbenchId = workbenchId;
                this.name = name;
                this.alias = alias;
                this.iconBase = iconBase;
            }
            Object.defineProperty(WorkbenchLaunchAction.prototype, "actionId", {
                get: function () {
                    return this.id;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WorkbenchLaunchAction.prototype, "fromActionSource", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WorkbenchLaunchAction.prototype, "virtualPathSuffix", {
                get: function () {
                    return [this.workbenchId, this.id];
                },
                enumerable: true,
                configurable: true
            });
            return WorkbenchLaunchAction;
        })();
        dialog.WorkbenchLaunchAction = WorkbenchLaunchAction;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/17/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var WorkbenchService = (function () {
            function WorkbenchService() {
            }
            WorkbenchService.getAppWinDef = function (sessionContext) {
                var method = "getApplicationWindowDef";
                var params = { 'sessionHandle': sessionContext.sessionHandle };
                var call = Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture("createSession/extractAppWinDefFromResult", dialog.DialogTriple.fromWSDialogObjectResult(result, 'WSApplicationWindowDefResult', 'WSApplicationWindowDef', 'applicationWindowDef', dialog.OType.factoryFn));
                });
            };
            WorkbenchService.getWorkbench = function (sessionContext, workbenchId) {
                var method = "getWorkbench";
                var params = {
                    'sessionHandle': sessionContext.sessionHandle,
                    'workbenchId': workbenchId
                };
                var call = Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture("getWorkbench/extractObject", dialog.DialogTriple.fromWSDialogObjectResult(result, 'WSWorkbenchResult', 'WSWorkbench', 'workbench', dialog.OType.factoryFn));
                });
            };
            WorkbenchService.performLaunchAction = function (actionId, workbenchId, sessionContext) {
                var method = "performLaunchAction";
                var params = {
                    'actionId': actionId,
                    'workbenchId': workbenchId,
                    'sessionHandle': sessionContext.sessionHandle
                };
                var call = Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
                return call.perform().bind(function (result) {
                    return Future.createCompletedFuture("performLaunchAction/extractRedirection", dialog.DialogTriple.fromWSDialogObject(result['redirection'], 'WSRedirection', dialog.OType.factoryFn));
                });
            };
            WorkbenchService.SERVICE_NAME = "WorkbenchService";
            WorkbenchService.SERVICE_PATH = "soi-json-v02/" + WorkbenchService.SERVICE_NAME;
            return WorkbenchService;
        })();
        dialog.WorkbenchService = WorkbenchService;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/30/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var PaneDef = (function () {
            function PaneDef() {
            }
            return PaneDef;
        })();
        dialog.PaneDef = PaneDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/30/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var FormDef = (function (_super) {
            __extends(FormDef, _super);
            function FormDef() {
                _super.apply(this, arguments);
            }
            return FormDef;
        })(dialog.PaneDef);
        dialog.FormDef = FormDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/30/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var MenuDef = (function () {
            function MenuDef() {
            }
            return MenuDef;
        })();
        dialog.MenuDef = MenuDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/30/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var PaneContext = (function () {
            function PaneContext(paneRef) {
                this._lastRefreshTime = null;
                this._parentContext = null;
                this._paneRef = paneRef;
                this._binaryCache = {};
            }
            PaneContext.ANNO_NAME_KEY = "com.catavolt.annoName";
            PaneContext.PROP_NAME_KEY = "com.catavolt.propName";
            return PaneContext;
        })();
        dialog.PaneContext = PaneContext;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/30/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var FormContext = (function () {
            function FormContext() {
                this._actionSource = null;
            }
            Object.defineProperty(FormContext.prototype, "actionSource", {
                get: function () {
                    return this._actionSource;
                },
                enumerable: true,
                configurable: true
            });
            return FormContext;
        })();
        dialog.FormContext = FormContext;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/30/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var FormContextBuilder = (function () {
            function FormContextBuilder() {
            }
            return FormContextBuilder;
        })();
        dialog.FormContextBuilder = FormContextBuilder;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/23/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var OType = (function () {
            function OType() {
            }
            OType.typeInstance = function (name) {
                var type = OType.types[name];
                return type && new type;
            };
            OType.factoryFn = function (otype, jsonObj) {
                var typeFn = OType.typeFns[otype];
                if (typeFn) {
                    return typeFn(otype, jsonObj);
                }
                return null;
            };
            OType.deserializeObject = function (obj, Otype, factoryFn) {
                if (Array.isArray(obj)) {
                    //it's a nested array (no LTYPE!)
                    return OType.handleNestedArray(Otype, obj);
                }
                else {
                    var newObj = null;
                    var objTry = factoryFn(Otype, obj); //this returns null if there is no custom function
                    if (objTry) {
                        if (objTry.isFailure) {
                            return new Failure('OType::deserializeObject: factory failed to produce object for ' + Otype + " : " + ObjUtil.formatRecAttr(objTry.failure));
                        }
                        newObj = objTry.success;
                    }
                    else {
                        newObj = OType.typeInstance(Otype);
                        if (!newObj)
                            return new Failure('OType::deserializeObject: no type constructor found for ' + Otype);
                        for (var prop in obj) {
                            var value = obj[prop];
                            //Log.info("prop: " + prop + " is type " + typeof value);
                            if (value && typeof value === 'object') {
                                if ('WS_OTYPE' in value) {
                                    var otypeTry = dialog.DialogTriple.fromWSDialogObject(value, value['WS_OTYPE'], OType.factoryFn);
                                    if (otypeTry.isFailure)
                                        return new Failure(otypeTry.failure);
                                    OType.assignPropIfDefined(prop, otypeTry.success, newObj, Otype);
                                }
                                else if ('WS_LTYPE' in value) {
                                    var ltypeTry = dialog.DialogTriple.fromListOfWSDialogObject(value, value['WS_LTYPE'], OType.factoryFn);
                                    if (ltypeTry.isFailure)
                                        return new Failure(ltypeTry.failure);
                                    OType.assignPropIfDefined(prop, ltypeTry.success, newObj, Otype);
                                }
                                else {
                                    OType.assignPropIfDefined(prop, obj[prop], newObj, Otype);
                                }
                            }
                            else {
                                OType.assignPropIfDefined(prop, obj[prop], newObj, Otype);
                            }
                        }
                    }
                    return new Success(newObj);
                }
            };
            OType.handleNestedArray = function (Otype, obj) {
                var ltype = OType.extractLType(Otype);
                var newArrayTry = OType.deserializeNestedArray(obj, ltype);
                if (newArrayTry.isFailure)
                    return new Failure(newArrayTry.failure);
                return new Success(newArrayTry.success);
            };
            OType.deserializeNestedArray = function (array, ltype) {
                var newArray = [];
                for (var i = 0; i < array.length; i++) {
                    var value = array[i];
                    if (value && typeof value === 'object') {
                        var otypeTry = dialog.DialogTriple.fromWSDialogObject(value, ltype, OType.factoryFn);
                        if (otypeTry.isFailure) {
                            return new Failure(otypeTry.failure);
                        }
                        newArray.push(otypeTry.success);
                    }
                    else {
                        newArray.push(value);
                    }
                }
                return new Success(newArray);
            };
            OType.extractLType = function (Otype) {
                if (Otype.length > 5 && Otype.slice(0, 5) === 'List<') {
                    return new Failure('Expected OType of List<some_type> but found ' + Otype);
                }
                var ltype = Otype.slice(5, -1);
                return new Success(ltype);
            };
            OType.assignPropIfDefined = function (prop, value, target, otype) {
                if (otype === void 0) { otype = 'object'; }
                try {
                    if ('_' + prop in target) {
                        target['_' + prop] = value;
                    }
                    else {
                        //it may be public
                        if (prop in target) {
                            target[prop] = value;
                        }
                        else {
                            Log.debug("Didn't find target value for prop " + prop + " on target for " + otype);
                        }
                    }
                }
                catch (error) {
                    Log.error('OType::assignPropIfDefined: Failed to set prop: ' + prop + ' on target: ' + error);
                }
            };
            OType.types = {
                'WSApplicationWindowDef': dialog.AppWinDef,
                'WSCellDef': dialog.CellDef,
                'WSCellValueDef': dialog.CellValueDef,
                "WSCreateSessionResult": dialog.SessionContextImpl,
                "WSContextAction": dialog.ContextAction,
                'WSDialogHandle': dialog.DialogHandle,
                'WSDataAnno': dialog.DataAnno,
                'WSPropertyDef': dialog.PropDef,
                'WSDialogRedirection': dialog.DialogRedirection,
                'WSGetSessionListPropertyResult': dialog.XGetSessionListPropertyResult,
                'WSWebRedirection': dialog.WebRedirection,
                'WSWorkbench': dialog.Workbench,
                'WSWorkbenchRedirection': dialog.WorkbenchRedirection,
                'WSWorkbenchLaunchAction': dialog.WorkbenchLaunchAction,
                'WSPaneDefRef': dialog.XPaneDefRef
            };
            OType.typeFns = {
                'WSProp': dialog.Prop.fromWS,
                'WSDataAnnotation': dialog.DataAnno.fromWS,
                'WSRedirection': dialog.Redirection.fromWS,
                'WSQueryResult': dialog.XQueryResult.fromWS
            };
            return OType;
        })();
        dialog.OType = OType;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
/**
 * Created by rburson on 3/6/15.
 */
//dialog
//note - these have a dependency-based ordering
///<reference path="CellValueDef.ts"/>
///<reference path="CellDef.ts"/>
///<reference path="EntityRec.ts"/>
///<reference path="EntityRecDef.ts"/>
///<reference path="BinaryRef.ts"/>
///<reference path="CodeRef.ts"/>
///<reference path="ObjectRef.ts"/>
///<reference path="GeoFix.ts"/>
///<reference path="GeoLocation.ts"/>
///<reference path="DataAnno.ts"/>
///<reference path="Prop.ts"/>
///<reference path="PropDef.ts"/>
///<reference path="SortPropDef.ts"/>
///<reference path="GraphDataPointDef.ts"/>
///<reference path="XGetSessionListPropertyResult.ts"/>
///<reference path="XPaneDefRef.ts"/>
///<reference path="XFormDef.ts"/>
///<reference path="XPaneDef.ts"/>
///<reference path="ColumnDef.ts"/>
///<reference path="XBarcodeScanDef.ts"/>
///<reference path="XCalendarDef.ts"/>
///<reference path="XChangePaneModeResult.ts"/>
///<reference path="XDetailsDef.ts"/>
///<reference path="XFormModel.ts"/>
///<reference path="XFormModelComp.ts"/>
///<reference path="XGeoFixDef.ts"/>
///<reference path="XGeoLocationDef.ts"/>
///<reference path="XGetActiveColumnDefsResult.ts"/>
///<reference path="XGetAvailableValuesResult.ts"/>
///<reference path="XGetSessionListPropertyResult.ts"/>
///<reference path="XGraphDef.ts"/>
///<reference path="XImagePickerDef.ts"/>
///<reference path="XListDef.ts"/>
///<reference path="XMapDef.ts"/>
///<reference path="XOpenDialogModelResult.ts"/>
///<reference path="XOpenEditorModelResult.ts"/>
///<reference path="XOpenQueryModelResult.ts"/>
///<reference path="XPaneDef.ts"/>
///<reference path="XPaneDefRef.ts"/>
///<reference path="XPropertyChangeResult.ts"/>
///<reference path="XQueryResult.ts"/>
///<reference path="XReadPropertyResult.ts"/>
///<reference path="XReadResult.ts"/>
///<reference path="XWriteResult.ts"/>
///<reference path="VoidResult.ts"/>
///<reference path="DialogException.ts"/>
///<reference path="Redirection.ts"/>
///<reference path="DialogHandle.ts"/>
///<reference path="DialogRedirection.ts"/>
///<reference path="NullRedirection.ts"/>
///<reference path="WebRedirection.ts"/>
///<reference path="WorkbenchRedirection.ts"/>
///<reference path="DialogTriple.ts"/>
///<reference path="ActionSource.ts"/>
///<reference path="ContextAction.ts"/>
///<reference path="NavRequest.ts"/>
///<reference path="NullNavRequest.ts"/>
///<reference path="ServiceEndpoint.ts"/>
///<reference path="AppContext.ts"/>
///<reference path="SessionContextImpl.ts"/>
///<reference path="SystemContextImpl.ts"/>
///<reference path="Binary.ts"/>
///<reference path="AppWinDef.ts"/>
///<reference path="SessionService.ts"/>
///<reference path="GatewayService.ts"/>
///<reference path="Workbench.ts"/>
///<reference path="WorkbenchLaunchAction.ts"/>
///<reference path="WorkbenchService.ts"/>
///<reference path="PaneDef.ts"/>
///<reference path="FormDef.ts"/>
///<reference path="MenuDef.ts"/>
///<reference path="PaneContext.ts"/>
///<reference path="FormContext.ts"/>
///<reference path="FormContextBuilder.ts"/>
///<reference path="OType.ts"/>
/**
 * Created by rburson on 3/6/15.
 */
//util
///<reference path="util/references.ts"/>
//fp
///<reference path="fp/references.ts"/>
//ws
///<reference path="ws/references.ts"/>
//dialog
///<reference path="dialog/references.ts"/>
/**
 * Created by rburson on 3/30/15.
 */
///<reference path="../references.ts"/>
//# sourceMappingURL=catavolt_sdk.js.map