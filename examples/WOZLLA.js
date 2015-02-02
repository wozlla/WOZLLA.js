var WOZLLA;
(function (WOZLLA) {
    var event;
    (function (event) {
        /**
         * @enum {number} WOZLLA.event.EventPhase
         * all enumerations of event phase
         */
        (function (EventPhase) {
            /** @property {number} [CAPTURE] */
            EventPhase[EventPhase["CAPTURE"] = 0] = "CAPTURE";
            /** @property {number} [BUBBLE] */
            EventPhase[EventPhase["BUBBLE"] = 1] = "BUBBLE";
            /** @property {number} [TARGET] */
            EventPhase[EventPhase["TARGET"] = 2] = "TARGET";
        })(event.EventPhase || (event.EventPhase = {}));
        var EventPhase = event.EventPhase;
        /**
         * @class WOZLLA.event.Event
         * Base class for all event object of WOZLLA engine.    <br/>
         * see also:    <br/>
         * {@link WOZLLA.event.EventPhase}  <br/>
         * {@link WOZLLA.event.EventDispatcher}     <br/>
         */
        var Event = (function () {
            /**
             * @method constructor
             * create a new Event object
             * @member WOZLLA.event.Event
             * @param {string} type
             * @param {boolean} bubbles
             * @param {any} data
             * @param {boolean} canStopBubbles
             */
            function Event(type, bubbles, data, canStopBubbles) {
                if (bubbles === void 0) { bubbles = false; }
                if (data === void 0) { data = null; }
                if (canStopBubbles === void 0) { canStopBubbles = true; }
                this._eventPhase = 0 /* CAPTURE */;
                this._immediatePropagationStoped = false;
                this._propagationStoped = false;
                this._listenerRemove = false;
                this._type = type;
                this._bubbles = bubbles;
                this._data = data;
                this._canStopBubbles = canStopBubbles;
            }
            Object.defineProperty(Event.prototype, "data", {
                /**
                 * event data.
                 * @member WOZLLA.event.Event
                 * @property {any} data
                 * @readonly
                 */
                get: function () {
                    return this._data;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Event.prototype, "type", {
                /**
                 * event type.
                 * @member WOZLLA.event.Event
                 * @property {string} type
                 * @readonly
                 */
                get: function () {
                    return this._type;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Event.prototype, "target", {
                /**
                 * event origin target.
                 * @member WOZLLA.event.Event
                 * @property {WOZLLA.event.EventDispatcher} target
                 * @readonly
                 */
                get: function () {
                    return this._target;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Event.prototype, "currentTarget", {
                /**
                 * current event target in event bubbling.
                 * @member WOZLLA.event.Event
                 * @property {WOZLLA.event.EventDispatcher} currentTarget
                 * @readonly
                 */
                get: function () {
                    return this._currentTarget;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Event.prototype, "eventPhase", {
                /**
                 * which phase this event is in.
                 * @member WOZLLA.event.Event
                 * @property {WOZLLA.event.EventPhase} eventPhase
                 * @readonly
                 */
                get: function () {
                    return this._eventPhase;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Event.prototype, "bubbles", {
                /**
                 * true to identify this event could be bubbled, false otherwise.
                 * @member WOZLLA.event.Event
                 * @property {boolean} bubbles
                 * @readonly
                 */
                get: function () {
                    return this._bubbles;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Event.prototype, "canStopBubbles", {
                /**
                 * true to identify this event could be stop bubbles, false otherwise.
                 * @member WOZLLA.event.Event
                 * @property {boolean} canStopBubbles
                 * @readonly
                 */
                get: function () {
                    return this._canStopBubbles;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @method isStopPropagation
             * @member WOZLLA.event.Event
             * @returns {boolean}
             */
            Event.prototype.isStopPropagation = function () {
                return this._propagationStoped;
            };
            /**
             * stop bubble to next parent
             * @method stopPropagation
             * @member WOZLLA.event.Event
             */
            Event.prototype.stopPropagation = function () {
                if (!this._canStopBubbles) {
                    return;
                }
                this._propagationStoped = true;
            };
            /**
             * @method isStopImmediatePropagation
             * @member WOZLLA.event.Event
             * @returns {boolean}
             */
            Event.prototype.isStopImmediatePropagation = function () {
                return this._immediatePropagationStoped;
            };
            /**
             * stop event bubble immediately even other listeners dosen't receive this event.
             * @method stopImmediatePropagation
             * @member WOZLLA.event.Event
             */
            Event.prototype.stopImmediatePropagation = function () {
                if (!this._canStopBubbles) {
                    return;
                }
                this._immediatePropagationStoped = true;
                this._propagationStoped = true;
            };
            /**
             * call from current listener to remove the current listener
             */
            Event.prototype.removeCurrentListener = function () {
                this._listenerRemove = true;
            };
            return Event;
        })();
        event.Event = Event;
    })(event = WOZLLA.event || (WOZLLA.event = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="Event.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var event;
    (function (_event) {
        var SCOPE = '_EventDispatcher_scope';
        var ListenerList = (function () {
            function ListenerList() {
                this._listeners = [];
            }
            ListenerList.prototype.add = function (listener) {
                this._listeners.push(listener);
            };
            ListenerList.prototype.remove = function (listener, scope) {
                var i, len = this._listeners.length;
                var l;
                for (i = 0; i < len; i++) {
                    l = this._listeners[i];
                    if (l === listener) {
                        if (!scope || scope === l[SCOPE]) {
                            this._listeners.splice(i, 1);
                        }
                        return true;
                    }
                }
                return false;
            };
            ListenerList.prototype.removeAt = function (idx) {
                return this._listeners.splice(idx, 1);
            };
            ListenerList.prototype.get = function (idx) {
                return this._listeners[idx];
            };
            ListenerList.prototype.length = function () {
                return this._listeners.length;
            };
            ListenerList.prototype.clear = function () {
                this._listeners.length = 0;
            };
            return ListenerList;
        })();
        /**
         * @class WOZLLA.event.EventDispatcher
         * Base class for bubblable event system
         *
         */
        var EventDispatcher = (function () {
            function EventDispatcher() {
                this._captureDict = {};
                this._bubbleDict = {};
            }
            /**
             * @method setBubbleParent
             * set bubble parent of this dispatcher
             * @param {WOZLLA.event.EventDispatcher} bubbleParent
             */
            EventDispatcher.prototype.setBubbleParent = function (bubbleParent) {
                this._bubbleParent = bubbleParent;
            };
            /**
             * @method hasListener
             * @param {string} type
             * @param {boolean} useCapture true to check capture phase, false to check bubble and target phases.
             */
            EventDispatcher.prototype.hasListener = function (type, useCapture) {
                if (useCapture === void 0) { useCapture = false; }
                return this._getListenerList(type, useCapture).length() > 0;
            };
            /**
             * @method getListenerCount
             * @param {string} type
             * @param {boolean} useCapture true to check capture phase, false to check bubble and target phases.
             * @returns {number}
             */
            EventDispatcher.prototype.getListenerCount = function (type, useCapture) {
                return this._getListenerList(type, useCapture).length();
            };
            /**
             * @method addListener
             * @param {string} type
             * @param {boolean} useCapture true to check capture phase, false to check bubble and target phases.
             */
            EventDispatcher.prototype.addListener = function (type, listener, useCapture) {
                if (useCapture === void 0) { useCapture = false; }
                this._getListenerList(type, useCapture).add(listener);
            };
            EventDispatcher.prototype.addListenerScope = function (type, listener, scope, useCapture) {
                if (useCapture === void 0) { useCapture = false; }
                listener[SCOPE] = scope;
                this.addListener(type, listener, useCapture);
            };
            /**
             * @method removeListener
             * @param {string} type
             * @param {boolean} useCapture true to check capture phase, false to check bubble and target phases.
             */
            EventDispatcher.prototype.removeListener = function (type, listener, useCapture) {
                if (useCapture === void 0) { useCapture = false; }
                return this._getListenerList(type, useCapture).remove(listener);
            };
            EventDispatcher.prototype.removeListenerScope = function (type, listener, scope, userCapture) {
                if (userCapture === void 0) { userCapture = false; }
                return this._getListenerList(type, userCapture).remove(listener, scope);
            };
            /**
             * @method clearListeners
             * @param {string} type
             * @param {boolean} useCapture true to check capture phase, false to check bubble and target phases.
             */
            EventDispatcher.prototype.clearListeners = function (type, useCapture) {
                this._getListenerList(type, useCapture).clear();
            };
            /**
             * @method clearAllListeners
             *  clear all listeners
             */
            EventDispatcher.prototype.clearAllListeners = function () {
                this._captureDict = {};
                this._bubbleDict = {};
            };
            /**
             * @method dispatch an event
             * @param {WOZLLA.event.Event} event
             */
            EventDispatcher.prototype.dispatchEvent = function (event) {
                var i, len, ancients, ancient;
                event._target = this;
                if (!event.bubbles) {
                    this._dispatchEventInPhase(event, 2 /* TARGET */);
                    return;
                }
                ancients = this._getAncients();
                len = ancients.length;
                for (i = len - 1; i >= 0; i--) {
                    ancient = ancients[i];
                    if (ancient._dispatchEventInPhase(event, 0 /* CAPTURE */)) {
                        return;
                    }
                }
                if (this._dispatchEventInPhase(event, 0 /* CAPTURE */)) {
                    return;
                }
                if (this._dispatchEventInPhase(event, 2 /* TARGET */)) {
                    return;
                }
                for (i = 0; i < len; i++) {
                    ancient = ancients[i];
                    if (ancient._dispatchEventInPhase(event, 1 /* BUBBLE */)) {
                        return;
                    }
                }
            };
            EventDispatcher.prototype._dispatchEventInPhase = function (event, phase) {
                var i, len;
                var listener;
                var scope;
                var listenerList;
                event._eventPhase = phase;
                event._listenerRemove = false;
                event._currentTarget = this;
                listenerList = this._getListenerList(event.type, phase === 0 /* CAPTURE */);
                len = listenerList.length();
                if (len > 0) {
                    for (i = len - 1; i >= 0; i--) {
                        listener = listenerList.get(i);
                        scope = listener[SCOPE];
                        if (scope) {
                            listener.call(scope, event);
                        }
                        else {
                            listener(event);
                        }
                        // handle remove listener when client call event.removeCurrentListener();
                        if (event._listenerRemove) {
                            event._listenerRemove = false;
                            listenerList.removeAt(i);
                        }
                        if (event.isStopImmediatePropagation()) {
                            return true;
                        }
                    }
                    if (event.isStopPropagation()) {
                        return true;
                    }
                }
                return false;
            };
            EventDispatcher.prototype._getAncients = function () {
                var ancients = [];
                var parent = this;
                while (parent._bubbleParent) {
                    parent = parent._bubbleParent;
                    ancients.push(parent);
                }
                return ancients;
            };
            EventDispatcher.prototype._getListenerList = function (type, useCapture) {
                var listenerList;
                var dict = useCapture ? this._captureDict : this._bubbleDict;
                listenerList = dict[type];
                if (!listenerList) {
                    listenerList = new ListenerList();
                    dict[type] = listenerList;
                }
                return listenerList;
            };
            return EventDispatcher;
        })();
        _event.EventDispatcher = EventDispatcher;
    })(event = WOZLLA.event || (WOZLLA.event = {}));
})(WOZLLA || (WOZLLA = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="../event/Event.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var assets;
    (function (assets) {
        /**
         * Base class of all assets in WOZLLA engine.
         * an asset contains a reference count which increase by **retain** function,
         * decrease by **release** function.
         * an asset would be unload when reference count reach 0.
         * @class WOZLLA.assets.Asset
         * @extends WOZLLA.event.EventDispatcher
         * @abstract
         */
        var Asset = (function (_super) {
            __extends(Asset, _super);
            function Asset(src, baseDir) {
                if (baseDir === void 0) { baseDir = ''; }
                _super.call(this);
                this._refCount = 0;
                this._src = src;
                this._baseDir = baseDir;
            }
            Object.defineProperty(Asset.prototype, "src", {
                /**
                 * @property {string} src
                 * @readonly
                 */
                get: function () {
                    return this._src;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Asset.prototype, "fullPath", {
                get: function () {
                    return this._baseDir + this._src;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * retain this asset
             */
            Asset.prototype.retain = function () {
                this._refCount++;
            };
            /**
             * release this asset
             * @param {boolean} [decreaceRefCount=true]
             */
            Asset.prototype.release = function (decreaceRefCount) {
                if (decreaceRefCount === void 0) { decreaceRefCount = true; }
                if (decreaceRefCount) {
                    if (this._refCount > 0) {
                        this._refCount--;
                    }
                }
                if (this._refCount === 0) {
                    this.unload();
                }
            };
            /**
             * load this asset
             * @param onSuccess
             * @param onError
             */
            Asset.prototype.load = function (onSuccess, onError) {
                onSuccess();
            };
            /**
             * unload this asset
             * @fires unload event
             */
            Asset.prototype.unload = function () {
                this.dispatchEvent(new WOZLLA.event.Event(Asset.EVENT_UNLOAD, false));
            };
            Asset.EVENT_UNLOAD = 'unload';
            return Asset;
        })(WOZLLA.event.EventDispatcher);
        assets.Asset = Asset;
    })(assets = WOZLLA.assets || (WOZLLA.assets = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var assets;
    (function (assets) {
        /**
         * an singleton class for asset loading and asset management
         * @class WOZLLA.assets.AssetLoader
         * @singleton
         */
        var AssetLoader = (function () {
            function AssetLoader() {
                this._loadedAssets = {};
                this._loadingUnits = {};
                this._baseDir = '';
            }
            /**
             * return the singleton of this class
             * @method getInstance
             * @static
             * @returns {WOZLLA.assets.AssetLoader}
             */
            AssetLoader.getInstance = function () {
                if (!AssetLoader.instance) {
                    AssetLoader.instance = new AssetLoader();
                }
                return AssetLoader.instance;
            };
            AssetLoader.prototype.getBaseDir = function () {
                return this._baseDir;
            };
            AssetLoader.prototype.setBaseDir = function (baseDir) {
                this._baseDir = baseDir;
            };
            /**
             * get an asset by src
             * @param src
             * @returns {any}
             */
            AssetLoader.prototype.getAsset = function (src) {
                return this._loadedAssets[src];
            };
            /**
             * add asset to asset loader, the asset would be auto removed when unloaded.
             * @param asset
             */
            AssetLoader.prototype.addAsset = function (asset) {
                var _this = this;
                this._loadedAssets[asset.src] = asset;
                asset.addListener(assets.Asset.EVENT_UNLOAD, function (e) {
                    e.removeCurrentListener();
                    _this.removeAsset(asset);
                });
            };
            /**
             * remove asset from asset loader
             * @param asset
             */
            AssetLoader.prototype.removeAsset = function (asset) {
                delete this._loadedAssets[asset.src];
            };
            /**
             * load all asset
             * @param items
             */
            AssetLoader.prototype.loadAll = function (items) {
                var item, i, len;
                for (i = 0, len = items.length; i < len; i++) {
                    item = items[i];
                    this.load(item.src, item.AssetClass, item.callback);
                }
            };
            /**
             * load an asset by src, AssetClass(constructor/factory)
             * @param src
             * @param AssetClass
             * @param callback
             */
            AssetLoader.prototype.load = function (src, AssetClass, callback) {
                var _this = this;
                var asset, loadUnit;
                asset = this._loadedAssets[src];
                if (asset) {
                    callback && callback();
                    return;
                }
                loadUnit = this._loadingUnits[src];
                if (loadUnit) {
                    loadUnit.addCallback(callback, callback);
                    return;
                }
                asset = (new AssetClass(src, this._baseDir ? this._baseDir + "/" : ""));
                loadUnit = new LoadUnit(src);
                loadUnit.addCallback(callback, callback);
                this._loadingUnits[src] = loadUnit;
                asset.load(function () {
                    delete _this._loadingUnits[src];
                    _this.addAsset(asset);
                    loadUnit.complete(null, asset);
                }, function (error) {
                    console.log(error);
                    delete _this._loadingUnits[src];
                    loadUnit.complete(error);
                });
            };
            return AssetLoader;
        })();
        assets.AssetLoader = AssetLoader;
        var LoadUnit = (function () {
            function LoadUnit(src) {
                this.callbacks = [];
                this.src = src;
            }
            LoadUnit.prototype.addCallback = function (onSuccess, onError) {
                this.callbacks.push({
                    onSuccess: onSuccess,
                    onError: onError
                });
            };
            LoadUnit.prototype.complete = function (error, asset) {
                this.callbacks.forEach(function (callback) {
                    if (error) {
                        callback.onError && callback.onError(error);
                    }
                    else {
                        callback.onSuccess && callback.onSuccess(asset);
                    }
                });
            };
            return LoadUnit;
        })();
    })(assets = WOZLLA.assets || (WOZLLA.assets = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var renderer;
    (function (renderer) {
        var ITexture;
        (function (ITexture) {
            /**
             * @property DOC
             * @readonly
             * @static
             * @member WOZLLA.renderer.ITexture
             */
            ITexture.DOC = 'DOC';
        })(ITexture = renderer.ITexture || (renderer.ITexture = {}));
    })(renderer = WOZLLA.renderer || (WOZLLA.renderer = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var renderer;
    (function (renderer) {
        var IRenderer;
        (function (IRenderer) {
            /**
             * @property DOC
             * @readonly
             * @static
             * @member WOZLLA.renderer.IRenderer
             */
            IRenderer.DOC = 'DOC';
        })(IRenderer = renderer.IRenderer || (renderer.IRenderer = {}));
    })(renderer = WOZLLA.renderer || (WOZLLA.renderer = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var math;
    (function (math) {
        /**
         * @class WOZLLA.math.Matrix
         * a util class for 2d matrix
         */
        var Matrix = (function () {
            function Matrix() {
                /**
                 * get values of this matrix
                 * @property {Float32Array} values
                 * @readonly
                 */
                this.values = new Float32Array(9);
                this.identity();
            }
            /**
             * apply from another matrix
             * @param matrix
             */
            Matrix.prototype.applyMatrix = function (matrix) {
                this.values.set(matrix.values);
            };
            /**
             * identify this matrix
             */
            Matrix.prototype.identity = function () {
                this.values[0] = 1; // a
                this.values[1] = 0; // b
                this.values[2] = 0;
                this.values[3] = 0; // c
                this.values[4] = 1; // d
                this.values[5] = 0;
                this.values[6] = 0; // tx
                this.values[7] = 0; // ty
                this.values[8] = 1;
            };
            /**
             * invert this matrix
             */
            Matrix.prototype.invert = function () {
                var a1 = this.values[0];
                var b1 = this.values[1];
                var c1 = this.values[3];
                var d1 = this.values[4];
                var tx1 = this.values[6];
                var ty1 = this.values[7];
                var n = a1 * d1 - b1 * c1;
                this.values[0] = d1 / n;
                this.values[1] = -b1 / n;
                this.values[3] = -c1 / n;
                this.values[4] = a1 / n;
                this.values[6] = (c1 * ty1 - d1 * tx1) / n;
                this.values[7] = -(a1 * ty1 - b1 * tx1) / n;
            };
            /**
             * prepend 2d params to this matrix
             * @param a
             * @param b
             * @param c
             * @param d
             * @param tx
             * @param ty
             */
            Matrix.prototype.prepend = function (a, b, c, d, tx, ty) {
                var a1, b1, c1, d1;
                var values = this.values;
                var tx1 = values[6];
                var ty1 = values[7];
                if (a != 1 || b != 0 || c != 0 || d != 1) {
                    a1 = values[0];
                    b1 = values[1];
                    c1 = values[3];
                    d1 = values[4];
                    values[0] = a1 * a + b1 * c;
                    values[1] = a1 * b + b1 * d;
                    values[3] = c1 * a + d1 * c;
                    values[4] = c1 * b + d1 * d;
                }
                values[6] = tx1 * a + ty1 * c + tx;
                values[7] = tx1 * b + ty1 * d + ty;
            };
            /**
             * append 2d params to this matrix
             * @param a
             * @param b
             * @param c
             * @param d
             * @param tx
             * @param ty
             */
            Matrix.prototype.append = function (a, b, c, d, tx, ty) {
                var a1, b1, c1, d1;
                var values = this.values;
                a1 = values[0];
                b1 = values[1];
                c1 = values[3];
                d1 = values[4];
                values[0] = a * a1 + b * c1;
                values[1] = a * b1 + b * d1;
                values[3] = c * a1 + d * c1;
                values[4] = c * b1 + d * d1;
                values[6] = tx * a1 + ty * c1 + values[6];
                values[7] = tx * b1 + ty * d1 + values[7];
            };
            /**
             * prepend 2d transform params to this matrix
             * @param x
             * @param y
             * @param scaleX
             * @param scaleY
             * @param rotation
             * @param skewX
             * @param skewY
             * @param regX
             * @param regY
             * @returns {WOZLLA.math.Matrix}
             */
            Matrix.prototype.prependTransform = function (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
                if (rotation % 360) {
                    var r = rotation * Matrix.DEG_TO_RAD;
                    var cos = Math.cos(r);
                    var sin = Math.sin(r);
                }
                else {
                    cos = 1;
                    sin = 0;
                }
                if (regX || regY) {
                    this.values[6] -= regX;
                    this.values[7] -= regY;
                }
                if (skewX || skewY) {
                    skewX *= Matrix.DEG_TO_RAD;
                    skewY *= Matrix.DEG_TO_RAD;
                    this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
                    this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
                }
                else {
                    this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
                }
                return this;
            };
            /**
             * append 2d transform params to this matrix
             * @param x
             * @param y
             * @param scaleX
             * @param scaleY
             * @param rotation
             * @param skewX
             * @param skewY
             * @param regX
             * @param regY
             * @returns {WOZLLA.math.Matrix}
             */
            Matrix.prototype.appendTransform = function (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
                if (rotation % 360) {
                    var r = rotation * Matrix.DEG_TO_RAD;
                    var cos = Math.cos(r);
                    var sin = Math.sin(r);
                }
                else {
                    cos = 1;
                    sin = 0;
                }
                if (skewX || skewY) {
                    skewX *= Matrix.DEG_TO_RAD;
                    skewY *= Matrix.DEG_TO_RAD;
                    this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
                    this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
                }
                else {
                    this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
                }
                if (regX || regY) {
                    // prepend the registration offset:
                    this.values[6] -= regX * this.values[0] + regY * this.values[3];
                    this.values[7] -= regX * this.values[1] + regY * this.values[4];
                }
                return this;
            };
            /**
             * @property DEG_TO_RAD
             * @member WOZLLA.math.Matrix
             * @readonly
             * @static
             */
            Matrix.DEG_TO_RAD = Math.PI / 180;
            return Matrix;
        })();
        math.Matrix = Matrix;
    })(math = WOZLLA.math || (WOZLLA.math = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var utils;
    (function (utils) {
        var Tween = (function () {
            function Tween(target, props, pluginData) {
                this._target = null;
                this._useTicks = false;
                this.ignoreGlobalPause = false;
                this.loop = false;
                this.pluginData = null;
                this._steps = null;
                this._actions = null;
                this.paused = false;
                this.duration = 0;
                this._prevPos = -1;
                this.position = null;
                this._prevPosition = 0;
                this._stepPosition = 0;
                this.passive = false;
                this.initialize(target, props, pluginData);
            }
            Tween.get = function (target, props, pluginData, override) {
                if (props === void 0) { props = null; }
                if (pluginData === void 0) { pluginData = null; }
                if (override === void 0) { override = false; }
                if (override) {
                    Tween.removeTweens(target);
                }
                return new Tween(target, props, pluginData);
            };
            Tween.removeTweens = function (target) {
                if (!target.tween_count) {
                    return;
                }
                var tweens = Tween._tweens;
                for (var i = tweens.length - 1; i >= 0; i--) {
                    if (tweens[i]._target == target) {
                        tweens[i].paused = true;
                        tweens.splice(i, 1);
                    }
                }
                target.tween_count = 0;
            };
            Tween.tick = function (delta, paused) {
                if (paused === void 0) { paused = false; }
                var tweens = Tween._tweens.concat();
                for (var i = tweens.length - 1; i >= 0; i--) {
                    var tween = tweens[i];
                    if ((paused && !tween.ignoreGlobalPause) || tween.paused) {
                        continue;
                    }
                    tween.tick(tween._useTicks ? 1 : delta);
                }
            };
            Tween._register = function (tween, value) {
                var target = tween._target;
                var tweens = Tween._tweens;
                if (value) {
                    if (target) {
                        target.tween_count = target.tween_count ? target.tween_count + 1 : 1;
                    }
                    tweens.push(tween);
                }
                else {
                    if (target) {
                        target.tween_count--;
                    }
                    var i = tweens.length;
                    while (i--) {
                        if (tweens[i] == tween) {
                            tweens.splice(i, 1);
                            return;
                        }
                    }
                }
            };
            Tween.removeAllTweens = function () {
                var tweens = Tween._tweens;
                for (var i = 0, l = tweens.length; i < l; i++) {
                    var tween = tweens[i];
                    tween.paused = true;
                    tween._target.tweenjs_count = 0;
                }
                tweens.length = 0;
            };
            Tween.prototype.initialize = function (target, props, pluginData) {
                this._target = target;
                if (props) {
                    this._useTicks = props.useTicks;
                    this.ignoreGlobalPause = props.ignoreGlobalPause;
                    this.loop = props.loop;
                    //                props.onChange && this.addEventListener("change", props.onChange, props.onChangeObj);
                    if (props.override) {
                        Tween.removeTweens(target);
                    }
                }
                this.pluginData = pluginData || {};
                this._curQueueProps = {};
                this._initQueueProps = {};
                this._steps = [];
                this._actions = [];
                if (props && props.paused) {
                    this.paused = true;
                }
                else {
                    Tween._register(this, true);
                }
                if (props && props.position != null) {
                    this.setPosition(props.position, Tween.NONE);
                }
            };
            Tween.prototype.setPosition = function (value, actionsMode) {
                if (actionsMode === void 0) { actionsMode = 1; }
                if (value < 0) {
                    value = 0;
                }
                var t = value;
                var end = false;
                if (t >= this.duration) {
                    if (this.loop) {
                        t = t % this.duration;
                    }
                    else {
                        t = this.duration;
                        end = true;
                    }
                }
                if (t == this._prevPos) {
                    return end;
                }
                var prevPos = this._prevPos;
                this.position = this._prevPos = t;
                this._prevPosition = value;
                if (this._target) {
                    if (end) {
                        this._updateTargetProps(null, 1);
                    }
                    else if (this._steps.length > 0) {
                        for (var i = 0, l = this._steps.length; i < l; i++) {
                            if (this._steps[i].t > t) {
                                break;
                            }
                        }
                        var step = this._steps[i - 1];
                        this._updateTargetProps(step, (this._stepPosition = t - step.t) / step.d);
                    }
                }
                if (actionsMode != 0 && this._actions.length > 0) {
                    if (this._useTicks) {
                        this._runActions(t, t);
                    }
                    else if (actionsMode == 1 && t < prevPos) {
                        if (prevPos != this.duration) {
                            this._runActions(prevPos, this.duration);
                        }
                        this._runActions(0, t, true);
                    }
                    else {
                        this._runActions(prevPos, t);
                    }
                }
                if (end) {
                    this.setPaused(true);
                }
                //            this.dispatchEventWith("change");
                return end;
            };
            Tween.prototype._runActions = function (startPos, endPos, includeStart) {
                if (includeStart === void 0) { includeStart = false; }
                var sPos = startPos;
                var ePos = endPos;
                var i = -1;
                var j = this._actions.length;
                var k = 1;
                if (startPos > endPos) {
                    sPos = endPos;
                    ePos = startPos;
                    i = j;
                    j = k = -1;
                }
                while ((i += k) != j) {
                    var action = this._actions[i];
                    var pos = action.t;
                    if (pos == ePos || (pos > sPos && pos < ePos) || (includeStart && pos == startPos)) {
                        action.f.apply(action.o, action.p);
                    }
                }
            };
            Tween.prototype._updateTargetProps = function (step, ratio) {
                var p0, p1, v, v0, v1, arr;
                if (!step && ratio == 1) {
                    this.passive = false;
                    p0 = p1 = this._curQueueProps;
                }
                else {
                    this.passive = !!step.v;
                    if (this.passive) {
                        return;
                    }
                    if (step.e) {
                        ratio = step.e(ratio, 0, 1, 1);
                    }
                    p0 = step.p0;
                    p1 = step.p1;
                }
                for (var n in this._initQueueProps) {
                    if ((v0 = p0[n]) == null) {
                        p0[n] = v0 = this._initQueueProps[n];
                    }
                    if ((v1 = p1[n]) == null) {
                        p1[n] = v1 = v0;
                    }
                    if (v0 == v1 || ratio == 0 || ratio == 1 || (typeof (v0) != "number")) {
                        v = ratio == 1 ? v1 : v0;
                    }
                    else {
                        v = v0 + (v1 - v0) * ratio;
                    }
                    var ignore = false;
                    if (arr = Tween._plugins[n]) {
                        for (var i = 0, l = arr.length; i < l; i++) {
                            var v2 = arr[i].tween(this, n, v, p0, p1, ratio, !!step && p0 == p1, !step);
                            if (v2 == Tween.IGNORE) {
                                ignore = true;
                            }
                            else {
                                v = v2;
                            }
                        }
                    }
                    if (!ignore) {
                        this._target[n] = v;
                    }
                }
            };
            Tween.prototype.setPaused = function (value) {
                this.paused = value;
                Tween._register(this, !value);
                return this;
            };
            Tween.prototype._cloneProps = function (props) {
                var o = {};
                for (var n in props) {
                    o[n] = props[n];
                }
                return o;
            };
            Tween.prototype._addStep = function (o) {
                if (o.d > 0) {
                    this._steps.push(o);
                    o.t = this.duration;
                    this.duration += o.d;
                }
                return this;
            };
            Tween.prototype._appendQueueProps = function (o) {
                var arr, oldValue, i, l, injectProps;
                for (var n in o) {
                    if (this._initQueueProps[n] === undefined) {
                        oldValue = this._target[n];
                        if (arr = Tween._plugins[n]) {
                            for (i = 0, l = arr.length; i < l; i++) {
                                oldValue = arr[i].init(this, n, oldValue);
                            }
                        }
                        this._initQueueProps[n] = this._curQueueProps[n] = (oldValue === undefined) ? null : oldValue;
                    }
                    else {
                        oldValue = this._curQueueProps[n];
                    }
                }
                for (var n in o) {
                    oldValue = this._curQueueProps[n];
                    if (arr = Tween._plugins[n]) {
                        injectProps = injectProps || {};
                        for (i = 0, l = arr.length; i < l; i++) {
                            if (arr[i].step) {
                                arr[i].step(this, n, oldValue, o[n], injectProps);
                            }
                        }
                    }
                    this._curQueueProps[n] = o[n];
                }
                if (injectProps) {
                    this._appendQueueProps(injectProps);
                }
                return this._curQueueProps;
            };
            Tween.prototype._addAction = function (o) {
                o.t = this.duration;
                this._actions.push(o);
                return this;
            };
            Tween.prototype._set = function (props, o) {
                for (var n in props) {
                    o[n] = props[n];
                }
            };
            Tween.prototype.wait = function (duration, passive) {
                if (passive === void 0) { passive = false; }
                if (duration == null || duration <= 0) {
                    return this;
                }
                var o = this._cloneProps(this._curQueueProps);
                return this._addStep({ d: duration, p0: o, p1: o, v: passive });
            };
            Tween.prototype.to = function (props, duration, ease) {
                if (ease === void 0) { ease = undefined; }
                if (isNaN(duration) || duration < 0) {
                    duration = 0;
                }
                return this._addStep({ d: duration || 0, p0: this._cloneProps(this._curQueueProps), e: ease, p1: this._cloneProps(this._appendQueueProps(props)) });
            };
            Tween.prototype.call = function (callback, thisObj, params) {
                if (thisObj === void 0) { thisObj = undefined; }
                if (params === void 0) { params = undefined; }
                if (!callback) {
                    callback = function () {
                    };
                }
                return this._addAction({ f: callback, p: params ? params : [this], o: thisObj ? thisObj : this._target });
            };
            Tween.prototype.set = function (props, target) {
                if (target === void 0) { target = null; }
                return this._addAction({ f: this._set, o: this, p: [props, target ? target : this._target] });
            };
            Tween.prototype.play = function (tween) {
                if (!tween) {
                    tween = this;
                }
                return this.call(tween.setPaused, [false], tween);
            };
            Tween.prototype.pause = function (tween) {
                if (!tween) {
                    tween = this;
                }
                return this.call(tween.setPaused, [true], tween);
            };
            Tween.prototype.tick = function (delta) {
                if (this.paused) {
                    return;
                }
                this.setPosition(this._prevPosition + delta);
            };
            Tween.NONE = 0;
            Tween.LOOP = 1;
            Tween.REVERSE = 2;
            Tween._tweens = [];
            Tween.IGNORE = {};
            Tween._plugins = {};
            Tween._inited = false;
            return Tween;
        })();
        utils.Tween = Tween;
    })(utils = WOZLLA.utils || (WOZLLA.utils = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="../math/Matrix.ts"/>
/// <reference path="../utils/Tween.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var helpMatrix = new WOZLLA.math.Matrix();
    /**
     * this class define the position, scale, rotation and about transform information of {@link WOZLLA.GameObject}
     * @class WOZLLA.Transform
     */
    var Transform = (function () {
        function Transform() {
            /**
             * @property {WOZLLA.math.Matrix} worldMatrix
             * @readonly
             */
            this.worldMatrix = new WOZLLA.math.Matrix();
            /**
             * specify this tranform
             * @type {boolean}
             */
            this.useGLCoords = false;
            this._relative = true;
            this._dirty = false;
            this._values = new Array(9);
            this.reset();
        }
        Object.defineProperty(Transform.prototype, "x", {
            get: function () {
                return this._values[0];
            },
            set: function (value) {
                this._values[0] = value;
                this._dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "y", {
            get: function () {
                return this._values[1];
            },
            set: function (value) {
                this._values[1] = value;
                this._dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "rotation", {
            get: function () {
                return this._values[4];
            },
            set: function (value) {
                this._values[4] = value;
                this._dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "scaleX", {
            get: function () {
                return this._values[5];
            },
            set: function (value) {
                this._values[5] = value;
                this._dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "scaleY", {
            get: function () {
                return this._values[6];
            },
            set: function (value) {
                this._values[6] = value;
                this._dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "skewX", {
            get: function () {
                return this._values[7];
            },
            set: function (value) {
                this._values[7] = value;
                this._dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "skewY", {
            get: function () {
                return this._values[8];
            },
            set: function (value) {
                this._values[8] = value;
                this._dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "relative", {
            get: function () {
                return this._relative;
            },
            set: function (relative) {
                this._relative = relative;
                this._dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "dirty", {
            get: function () {
                return this._dirty;
            },
            set: function (value) {
                this._dirty = value;
            },
            enumerable: true,
            configurable: true
        });
        Transform.prototype.setPosition = function (x, y) {
            this._values[0] = x;
            this._values[1] = y;
            this._dirty = true;
        };
        Transform.prototype.setAnchor = function (anchorX, anchorY) {
            this._values[2] = anchorX;
            this._values[3] = anchorY;
            this._dirty = true;
        };
        Transform.prototype.setRotation = function (rotation) {
            this._values[4] = rotation;
            this._dirty = true;
        };
        Transform.prototype.setScale = function (scaleX, scaleY) {
            this._values[5] = scaleX;
            this._values[6] = scaleY;
            this._dirty = true;
        };
        Transform.prototype.setSkew = function (skewX, skewY) {
            this._values[7] = skewX;
            this._values[8] = skewY;
            this._dirty = true;
        };
        Transform.prototype.reset = function () {
            this._values[0] = 0; // x
            this._values[1] = 0; // y
            this._values[2] = 0; // @deprecated
            this._values[3] = 0; // @deprecated
            this._values[4] = 0; // rotation
            this._values[5] = 1; // scaleX
            this._values[6] = 1; // scaleY
            this._values[7] = 0; // skewX
            this._values[8] = 0; // skewY
        };
        Transform.prototype.set = function (transform) {
            if (typeof transform.x === "number") {
                this._values[0] = transform.x; //x
            }
            if (typeof transform.y === "number") {
                this._values[1] = transform.y; // y
            }
            if (typeof transform.rotation === 'number') {
                this._values[4] = transform.rotation; // rotation
            }
            if (typeof transform.scaleX === 'number') {
                this._values[5] = transform.scaleX; // scaleX
            }
            if (typeof transform.scaleY === 'number') {
                this._values[6] = transform.scaleY; // scaleY
            }
            if (typeof transform.skewX === 'number') {
                this._values[7] = transform.skewX; // skewX
            }
            if (typeof transform.skewY === 'number') {
                this._values[8] = transform.skewY; // skewY
            }
            if (typeof transform.relative !== 'undefined') {
                this._relative = transform.relative;
            }
            this._dirty = true;
        };
        Transform.prototype.transform = function (parentTransform) {
            if (parentTransform === void 0) { parentTransform = null; }
            var cos, sin, r;
            var matrix;
            var worldMatrix = this.worldMatrix;
            var x = this._values[0];
            var y = this._values[1];
            var rotation = this._values[4];
            var scaleX = this._values[5];
            var scaleY = this._values[6];
            var skewX = this._values[7];
            var skewY = this._values[8];
            if (this.useGLCoords) {
                skewX += 180;
            }
            if (parentTransform && this._relative) {
                worldMatrix.applyMatrix(parentTransform.worldMatrix);
            }
            else {
                //                worldMatrix.identity();
                //                parentTransform = Director.getInstance().getStage().transform;
                // if this is the transform of stage
                if (this === parentTransform) {
                    worldMatrix.identity();
                }
                else {
                    worldMatrix.applyMatrix(parentTransform.worldMatrix);
                }
            }
            if (this.__local_matrix) {
                matrix = this.__local_matrix;
                worldMatrix.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
                this._dirty = false;
                return;
            }
            if (rotation % 360) {
                r = rotation * Transform.DEG_TO_RAD;
                cos = Math.cos(r);
                sin = Math.sin(r);
            }
            else {
                cos = 1;
                sin = 0;
            }
            if (skewX || skewY) {
                skewX *= Transform.DEG_TO_RAD;
                skewY *= Transform.DEG_TO_RAD;
                worldMatrix.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
                worldMatrix.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
            }
            else {
                worldMatrix.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
            }
            this._dirty = false;
        };
        Transform.prototype.updateWorldMatrix = function () {
            if (!this._dirty) {
                return;
            }
            var matrix = this.worldMatrix;
            if (matrix) {
                matrix.identity();
            }
            else {
                matrix = new WOZLLA.math.Matrix();
            }
            var o = this;
            while (o != null) {
                matrix.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, 0, 0);
                o = o.parent;
            }
        };
        Transform.prototype.globalToLocal = function (x, y, updateMatrix) {
            if (updateMatrix === void 0) { updateMatrix = false; }
            if (updateMatrix) {
                this.updateWorldMatrix();
            }
            helpMatrix.applyMatrix(this.worldMatrix);
            helpMatrix.invert();
            helpMatrix.append(1, 0, 0, 1, x, y);
            return {
                x: helpMatrix.values[6],
                y: helpMatrix.values[7]
            };
        };
        Transform.prototype.localToGlobal = function (x, y, updateMatrix) {
            if (updateMatrix === void 0) { updateMatrix = false; }
            if (updateMatrix) {
                this.updateWorldMatrix();
            }
            helpMatrix.applyMatrix(this.worldMatrix);
            helpMatrix.append(1, 0, 0, 1, x, y);
            return {
                x: helpMatrix.values[6],
                y: helpMatrix.values[7]
            };
        };
        Transform.prototype.tween = function (override) {
            return WOZLLA.utils.Tween.get(this, null, null, override);
        };
        Transform.prototype.clearTweens = function () {
            return WOZLLA.utils.Tween.removeTweens(this);
        };
        /**
         * @property {number} DEG_TO_RAD
         * @readonly
         * @static
         */
        Transform.DEG_TO_RAD = Math.PI / 180;
        return Transform;
    })();
    WOZLLA.Transform = Transform;
})(WOZLLA || (WOZLLA = {}));
/// <reference path="Transform.ts"/>
var WOZLLA;
(function (WOZLLA) {
    /**
     * RectTransform is a subclass of {@link WOZLLA.Transform}, define a rect region
     * for {@WOZLLA.GameObject} and a anchor mode to specify how to related to it's parent.
     * @class WOZLLA.RectTransform
     */
    var RectTransform = (function (_super) {
        __extends(RectTransform, _super);
        function RectTransform() {
            _super.apply(this, arguments);
            this._width = 0;
            this._height = 0;
            this._top = 0;
            this._left = 0;
            this._right = 0;
            this._bottom = 0;
            this._px = 0;
            this._py = 0;
            this._anchorMode = RectTransform.ANCHOR_CENTER | RectTransform.ANCHOR_MIDDLE;
        }
        RectTransform.getMode = function (name) {
            var names = name.split('_');
            var value = 0;
            switch (names[0]) {
                case 'Left':
                    value |= RectTransform.ANCHOR_LEFT;
                    break;
                case 'Right':
                    value |= RectTransform.ANCHOR_RIGHT;
                    break;
                case 'HStrength':
                    value |= RectTransform.ANCHOR_HORIZONTAL_STRENGTH;
                    break;
                default:
                    value |= RectTransform.ANCHOR_CENTER;
                    break;
            }
            switch (names[1]) {
                case 'Top':
                    value |= RectTransform.ANCHOR_TOP;
                    break;
                case 'Bottom':
                    value |= RectTransform.ANCHOR_BOTTOM;
                    break;
                case 'VStrength':
                    value |= RectTransform.ANCHOR_VERTICAL_STRENGTH;
                    break;
                default:
                    value |= RectTransform.ANCHOR_MIDDLE;
                    break;
            }
            return value;
        };
        Object.defineProperty(RectTransform.prototype, "width", {
            /**
             * get or set width, this property only effect on fixed size mode
             * @property {number} width
             */
            get: function () {
                return this._width;
            },
            set: function (value) {
                if (this._width === value)
                    return;
                this._width = value;
                this.dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RectTransform.prototype, "height", {
            /**
             * get or set height, this property only effect on fixed size mode
             * @property {number} height
             */
            get: function () {
                return this._height;
            },
            set: function (value) {
                if (this._height === value)
                    return;
                this._height = value;
                this.dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RectTransform.prototype, "top", {
            /**
             * get or set top
             * @property {number} top
             */
            get: function () {
                return this._top;
            },
            set: function (value) {
                if (this._top === value)
                    return;
                this._top = value;
                this.dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RectTransform.prototype, "left", {
            /**
             * get or set left
             * @property {number} left
             */
            get: function () {
                return this._left;
            },
            set: function (value) {
                if (this._left === value)
                    return;
                this._left = value;
                this.dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RectTransform.prototype, "right", {
            /**
             * get or set right
             * @property {number} right
             */
            get: function () {
                return this._right;
            },
            set: function (value) {
                if (this._right === value)
                    return;
                this._right = value;
                this.dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RectTransform.prototype, "bottom", {
            /**
             * get or set bottom
             * @property {number} bottom
             */
            get: function () {
                return this._bottom;
            },
            set: function (value) {
                if (this._bottom === value)
                    return;
                this._bottom = value;
                this.dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RectTransform.prototype, "px", {
            /**
             * get or set px, this only effect on strengthen mode
             * @property {number} px specify x coords
             */
            get: function () {
                return this._px;
            },
            set: function (value) {
                if (this._px === value)
                    return;
                this._px = value;
                this.dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RectTransform.prototype, "py", {
            /**
             * get or set py, this only effect on strengthen mode
             * @property {number} py specify y coords
             */
            get: function () {
                return this._py;
            },
            set: function (value) {
                if (this._py === value)
                    return;
                this._py = value;
                this.dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RectTransform.prototype, "anchorMode", {
            /**
             * get or set anchor mode
             * @property {number} anchorMode
             */
            get: function () {
                return this._anchorMode;
            },
            set: function (value) {
                if (this._anchorMode === value)
                    return;
                this._anchorMode = value;
                this.dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * set rect transform
         * @param {WOZLLA.RectTransform} rectTransform
         */
        RectTransform.prototype.set = function (rectTransform) {
            var anchorMode = rectTransform.anchorMode;
            if (typeof anchorMode === 'string') {
                anchorMode = RectTransform.getMode(anchorMode);
            }
            this._anchorMode = anchorMode;
            this._width = rectTransform.width || 0;
            this._height = rectTransform.height || 0;
            this._top = rectTransform.top || 0;
            this._left = rectTransform.left || 0;
            this._right = rectTransform.right || 0;
            this._bottom = rectTransform.bottom || 0;
            this._px = rectTransform.px || 0;
            this._px = rectTransform.py || 0;
            this.dirty = true;
        };
        /**
         * transform with parent transform
         * @param {WOZLLA.Transform} parentTransform
         */
        RectTransform.prototype.transform = function (parentTransform) {
            if (parentTransform === void 0) { parentTransform = null; }
            var m, R, p;
            if (!parentTransform || !this._relative || !(parentTransform instanceof RectTransform)) {
                p = WOZLLA.Director.getInstance().viewRectTransform;
            }
            else {
                p = parentTransform;
            }
            m = this._anchorMode;
            R = RectTransform;
            if ((m & R.ANCHOR_LEFT) === R.ANCHOR_LEFT) {
                this.x = this._px;
            }
            else if ((m & R.ANCHOR_RIGHT) === R.ANCHOR_RIGHT) {
                this.x = p._width + this._px;
            }
            else if ((m & R.ANCHOR_HORIZONTAL_STRENGTH) === R.ANCHOR_HORIZONTAL_STRENGTH) {
                this.x = this._left;
                this._width = p._width - this._left - this._right;
            }
            else {
                this.x = p._width / 2 + this._px;
            }
            if ((m & R.ANCHOR_TOP) === R.ANCHOR_TOP) {
                this.y = this._py;
            }
            else if ((m & R.ANCHOR_BOTTOM) === R.ANCHOR_BOTTOM) {
                this.y = p._height + this._py;
            }
            else if ((m & R.ANCHOR_VERTICAL_STRENGTH) === R.ANCHOR_VERTICAL_STRENGTH) {
                this.y = this._top;
                this._height = p._height - this._top - this._bottom;
            }
            else {
                this.y = p._height / 2 + this._py;
            }
            _super.prototype.transform.call(this, parentTransform);
        };
        /**
         * vertical anchor mode
         * @property {number} ANCHOR_TOP
         * @readonly
         * @static
         */
        RectTransform.ANCHOR_TOP = 0x1;
        /**
         * vertical anchor mode
         * @property {number} ANCHOR_MIDDLE
         * @readonly
         * @static
         */
        RectTransform.ANCHOR_MIDDLE = 0x10;
        /**
         * vertical anchor mode
         * @property {number} ANCHOR_BOTTOM
         * @readonly
         * @static
         */
        RectTransform.ANCHOR_BOTTOM = 0x100;
        /**
         * vertical anchor mode
         * @property {number} ANCHOR_VERTICAL_STRENGTH
         * @readonly
         * @static
         */
        RectTransform.ANCHOR_VERTICAL_STRENGTH = 0x1000;
        /**
         * horizontal anchor mode
         * @property {number} ANCHOR_LEFT
         * @readonly
         * @static
         */
        RectTransform.ANCHOR_LEFT = 0x10000;
        /**
         * horizontal anchor mode
         * @property {number} ANCHOR_CENTER
         * @readonly
         * @static
         */
        RectTransform.ANCHOR_CENTER = 0x100000;
        /**
         * horizontal anchor mode
         * @property {number} ANCHOR_RIGHT
         * @readonly
         * @static
         */
        RectTransform.ANCHOR_RIGHT = 0x1000000;
        /**
         * horizontal anchor mode
         * @property {number} ANCHOR_HORIZONTAL_STRENGTH
         * @readonly
         * @static
         */
        RectTransform.ANCHOR_HORIZONTAL_STRENGTH = 0x10000000;
        return RectTransform;
    })(WOZLLA.Transform);
    WOZLLA.RectTransform = RectTransform;
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var Assert = (function () {
        function Assert() {
        }
        Assert.isTrue = function (test, msg) {
            if (msg === void 0) { msg = Assert.DEFAULT_MESSAGE; }
            if (test !== true) {
                throw new Error(msg);
            }
        };
        Assert.isFalse = function (test, msg) {
            if (msg === void 0) { msg = Assert.DEFAULT_MESSAGE; }
            if (test !== false) {
                throw new Error(msg);
            }
        };
        Assert.isTypeof = function (test, type, msg) {
            if (msg === void 0) { msg = Assert.DEFAULT_MESSAGE; }
            if (typeof test !== type) {
                throw new Error(msg);
            }
        };
        Assert.isNotTypeof = function (test, type, msg) {
            if (msg === void 0) { msg = Assert.DEFAULT_MESSAGE; }
            if (typeof test === type) {
                throw new Error(msg);
            }
        };
        Assert.isString = function (test, msg) {
            if (msg === void 0) { msg = Assert.DEFAULT_MESSAGE; }
            Assert.isTypeof(test, 'string', msg);
        };
        Assert.isObject = function (test, msg) {
            if (msg === void 0) { msg = Assert.DEFAULT_MESSAGE; }
            Assert.isTypeof(test, 'object', msg);
        };
        Assert.isUndefined = function (test, msg) {
            if (msg === void 0) { msg = Assert.DEFAULT_MESSAGE; }
            Assert.isTypeof(test, 'undefined', msg);
        };
        Assert.isNotUndefined = function (test, msg) {
            if (msg === void 0) { msg = Assert.DEFAULT_MESSAGE; }
            Assert.isNotTypeof(test, 'undefined', msg);
        };
        Assert.isFunction = function (test, msg) {
            if (msg === void 0) { msg = Assert.DEFAULT_MESSAGE; }
            Assert.isTypeof(test, 'function', msg);
        };
        Assert.DEFAULT_MESSAGE = 'Assertion Fail';
        return Assert;
    })();
    WOZLLA.Assert = Assert;
})(WOZLLA || (WOZLLA = {}));
/// <reference path="Transform.ts"/>
/// <reference path="../utils/Assert.ts"/>
var WOZLLA;
(function (WOZLLA) {
    /**
     * Top class of all components
     * @class WOZLLA.Component
     * @extends WOZLLA.event.EventDispatcher
     * @abstract
     */
    var Component = (function (_super) {
        __extends(Component, _super);
        function Component() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(Component.prototype, "gameObject", {
            /**
             * get the GameObject of this component belongs to.
             * @property {WOZLLA.GameObject} gameObject
             */
            get: function () {
                return this._gameObject;
            },
            set: function (value) {
                this._gameObject = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Component.prototype, "transform", {
            /**
             *  get transform of the gameObject of this component
             *  @property {WOZLLA.Transform} transform
             */
            get: function () {
                return this._gameObject.transform;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * init this component
         */
        Component.prototype.init = function () {
        };
        /**
         * destroy this component
         */
        Component.prototype.destroy = function () {
        };
        Component.prototype.loadAssets = function (callback) {
            callback && callback();
        };
        Component.prototype.listRequiredComponents = function () {
            return [];
        };
        Component.getType = function (name) {
            var ret = this.ctorMap[name];
            WOZLLA.Assert.isNotUndefined(ret, 'Can\'t found component: ' + name);
            return ret;
        };
        Component.getName = function (Type) {
            return Type.componentName;
        };
        /**
         * register an component class and it's configuration
         * @method register
         * @static
         * @param ctor
         * @param configuration
         */
        Component.register = function (ctor, config) {
            WOZLLA.Assert.isObject(config);
            WOZLLA.Assert.isString(config.name);
            WOZLLA.Assert.isUndefined(Component.configMap[config.name]);
            Component.ctorMap[config.name] = ctor;
            Component.configMap[config.name] = config;
            ctor.componentName = config.name;
        };
        Component.unregister = function (name) {
            WOZLLA.Assert.isString(name);
            WOZLLA.Assert.isNotUndefined(Component.configMap[name]);
            delete Component.ctorMap[name];
            delete Component.configMap[name];
        };
        /**
         * create component by it's registed name.
         * @param name the component name
         * @returns {WOZLLA.Component}
         */
        Component.create = function (name) {
            WOZLLA.Assert.isString(name);
            var ctor = Component.ctorMap[name];
            WOZLLA.Assert.isFunction(ctor);
            return new ctor();
        };
        Component.getConfig = function (name) {
            var config;
            WOZLLA.Assert.isNotUndefined(name);
            if (typeof name === 'function') {
                name = Component.getName(name);
            }
            config = Component.configMap[name];
            WOZLLA.Assert.isNotUndefined(config);
            return config;
        };
        Component.extendConfig = function (Type) {
            var name = Component.getName(Type);
            return {
                group: name,
                properties: Component.getConfig(name).properties
            };
        };
        Component.ctorMap = {};
        Component.configMap = {};
        return Component;
    })(WOZLLA.event.EventDispatcher);
    WOZLLA.Component = Component;
})(WOZLLA || (WOZLLA = {}));
/// <reference path="Component.ts"/>
var WOZLLA;
(function (WOZLLA) {
    /**
     * abstract base class for all colliders
     * @class WOZLLA.Collider
     * @extends WOZLLA.Component
     * @abstract
     */
    var Collider = (function (_super) {
        __extends(Collider, _super);
        function Collider() {
            _super.apply(this, arguments);
        }
        /**
         * @method {boolean} containsXY
         * @param localX x coords relate to the gameObject of this collider
         * @param localY y coords relate to the gameObject of this collider
         * @returns {boolean}
         */
        Collider.prototype.collideXY = function (localX, localY) {
            return false;
        };
        Collider.prototype.collide = function (collider) {
            return false;
        };
        return Collider;
    })(WOZLLA.Component);
    WOZLLA.Collider = Collider;
})(WOZLLA || (WOZLLA = {}));
/// <reference path="Transform.ts"/>
/// <reference path="RectTransform.ts"/>
/// <reference path="Collider.ts"/>
/// <reference path="../event/EventDispatcher.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var comparator = function (a, b) {
        return a.z - b.z;
    };
    var idMap = {};
    /**
     * GameObject is the base element in WOZLLA engine. It contains
     * many child instance of {@link WOZLLA.GameObject} and many
     * instance of {@link WOZLLA.Component}.
     * <br/>
     * <br/>
     * Tree structure of the GameObject is the core of WOZLLA engine.
     *
     * @class WOZLLA.GameObject
     * @extends WOZLLA.event.EventDispatcher
     */
    var GameObject = (function (_super) {
        __extends(GameObject, _super);
        /**
         * new a GameObject
         * @method constructor
         * @member WOZLLA.GameObject
         * @param {boolean} useRectTransform specify which transform this game object should be used.
         */
        function GameObject(useRectTransform) {
            if (useRectTransform === void 0) { useRectTransform = false; }
            _super.call(this);
            this._active = true;
            this._visible = true;
            this._initialized = false;
            this._destroyed = false;
            this._touchable = false;
            this._loadingAssets = false;
            this._name = 'GameObject';
            this._children = [];
            this._components = [];
            this._transform = useRectTransform ? new WOZLLA.RectTransform() : new WOZLLA.Transform();
            this._rectTransform = useRectTransform ? this._transform : null;
            this._z = 0;
            this._behaviours = [];
        }
        /**
         * return the GameObject with the specified id.
         * @method {WOZLLA.GameObject} getById
         * @static
         * @param id the specified id
         * @member WOZLLA.GameObject
         */
        GameObject.getById = function (id) {
            return idMap[id];
        };
        Object.defineProperty(GameObject.prototype, "id", {
            /**
             * get or set the id of this game object
             * @property {string} id
             * @member WOZLLA.GameObject
             */
            get: function () {
                return this._id;
            },
            set: function (value) {
                var oldId = this._id;
                this._id = value;
                if (oldId) {
                    delete idMap[oldId];
                }
                idMap[value] = this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "name", {
            /**
             * get or set the name of this game object
             * @property {string} name
             * @member WOZLLA.GameObject
             */
            get: function () {
                return this._name;
            },
            set: function (value) {
                this._name = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "transform", {
            /**
             * get transform of this game object
             * @property {WOZLLA.Transform} transform
             * @member WOZLLA.GameObject
             * @readonly
             */
            get: function () {
                return this._transform;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "rectTransform", {
            /**
             * get rect transform of this game object
             * @property {WOZLLA.RectTransform} rectTransform
             * @member WOZLLA.GameObject
             * @readonly
             */
            get: function () {
                return this._rectTransform;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "parent", {
            /**
             * get parent game object
             * @property {WOZLLA.GameObject} parent
             * @member WOZLLA.GameObject
             * @readonly
             */
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "children", {
            /**
             * get children of this game object
             * @property {WOZLLA.GameObject[]} children
             * @member WOZLLA.GameObject
             * @readonly
             */
            get: function () {
                return this._children.slice(0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "rawChildren", {
            /**
             * get raw children
             * @returns {WOZLLA.GameObject[]}
             */
            get: function () {
                return this._children;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "childCount", {
            /**
             * get child count
             * @property {number} childCount
             * @member WOZLLA.GameObject
             * @readonly
             */
            get: function () {
                return this._children.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "z", {
            /**
             * get or set z order of this game object, and then resort children.
             * @property {number} z
             * @member WOZLLA.GameObject
             */
            get: function () {
                return this._z;
            },
            set: function (value) {
                this.setZ(value, true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "active", {
            /**
             * get or set active of this game object.
             * the update method would be call every frame when active was true, false otherwise.
             * if active is set from false to true, the transform dirty would be true.
             * @property {boolean} active
             * @member WOZLLA.GameObject
             */
            get: function () {
                return this._active;
            },
            set: function (value) {
                var oldActive = this._active;
                this._active = value;
                if (!oldActive && value) {
                    this._transform.dirty = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "visible", {
            /**
             * get visible of this game object.
             * the render method would be call every frame when visible and active both true.
             * @property {boolean} visible
             * @member WOZLLA.GameObject
             */
            get: function () {
                return this._visible;
            },
            set: function (value) {
                this._visible = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "initialized", {
            /**
             * get initialized of this game object
             * @property {boolean} initialized
             * @member WOZLLA.GameObject
             * @readonly
             */
            get: function () {
                return this._initialized;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "destroyed", {
            /**
             * get destroyed of this game object
             * @property {boolean} destroyed
             * @member WOZLLA.GameObject
             * @readonly
             */
            get: function () {
                return this._destroyed;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "touchable", {
            /**
             * get or set touchable of this game object. identify this game object is interactive.
             * @property {boolean} touchable
             * @member WOZLLA.GameObject
             * @readonly
             */
            get: function () {
                return this._touchable;
            },
            set: function (value) {
                this._touchable = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "renderer", {
            /**
             * get renderer component of this game object
             * @property {WOZLLA.Renderer} renderer
             * @member WOZLLA.GameObject
             * @readonly
             */
            get: function () {
                return this._renderer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "collider", {
            /**
             * get collider of this game object
             * @property {WOZLLA.Collider} collider
             * @member WOZLLA.GameObject
             * @readonly
             */
            get: function () {
                return this._collider;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "behaviours", {
            /**
             * get behaviours of this game object
             * @property {WOZLLA.Behaviour[]} behaviours
             * @member WOZLLA.GameObject
             * @readonly
             */
            get: function () {
                return this._behaviours.slice(0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "mask", {
            /**
             * get mask component of this game object
             * @property {WOZLLA.Mask} mask
             * @member WOZLLA.GameObject
             * @readonly
             */
            get: function () {
                return this._mask;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * set z order
         * @param value
         * @param sort true is set to resort children
         */
        GameObject.prototype.setZ = function (value, sort) {
            if (sort === void 0) { sort = true; }
            if (this._z === value)
                return;
            this._z = value;
            if (sort) {
                this._children.sort(comparator);
            }
        };
        /**
         * add a child game object, it would be fail when this game object has contains the child.
         * @param child
         * @param sort true is set to resort children
         * @returns {boolean} true is success to, false otherwise.
         */
        GameObject.prototype.addChild = function (child, sort) {
            if (sort === void 0) { sort = true; }
            if (this._children.indexOf(child) !== -1) {
                return false;
            }
            if (child._parent) {
                child.removeMe();
            }
            child.dispatchEvent(new WOZLLA.CoreEvent('beforeadd', false, {
                parent: this
            }));
            this._children.push(child);
            if (sort) {
                this._children.sort(comparator);
            }
            child._parent = this;
            child._transform.dirty = true;
            child.dispatchEvent(new WOZLLA.CoreEvent('add', false));
            this.dispatchEvent(new WOZLLA.CoreEvent('childadd', false, {
                child: child
            }));
            return true;
        };
        /**
         * remove the specified child.
         * @param child
         * @returns {boolean} true is success to, false otherwise.
         */
        GameObject.prototype.removeChild = function (child) {
            var idx = this._children.indexOf(child);
            if (idx !== -1) {
                child.dispatchEvent(new WOZLLA.CoreEvent('beforeremove', false));
                this._children.splice(idx, 1);
                child._parent = null;
                child.dispatchEvent(new WOZLLA.CoreEvent('remove', false, {
                    parent: this
                }));
                this.dispatchEvent(new WOZLLA.CoreEvent('childremove', false, {
                    child: child
                }));
                return true;
            }
            return false;
        };
        /**
         * get the first child with the specified name.
         * @param name
         * @returns {WOZLLA.GameObject}
         */
        GameObject.prototype.getChild = function (name) {
            var child, i, len;
            for (i = 0, len = this._children.length; i < len; i++) {
                child = this._children[i];
                if (child._name === name) {
                    return child;
                }
            }
            return null;
        };
        /**
         * get all children with the specified name.
         * @param name
         * @returns {Array}
         */
        GameObject.prototype.getChildren = function (name) {
            var child, i, len;
            var result = [];
            for (i = 0, len = this._children.length; i < len; i++) {
                child = this._children[i];
                if (child._name === name) {
                    result.push(child);
                }
            }
            return result;
        };
        /**
         * remove this game object from parent.
         * @returns {boolean}
         */
        GameObject.prototype.removeMe = function () {
            var parent = this._parent;
            return parent && parent.removeChild(this);
        };
        /**
         * iterator children of this game object
         * @param func interator function.
         */
        GameObject.prototype.eachChild = function (func) {
            this._children.forEach(func);
        };
        /**
         * sort children
         */
        GameObject.prototype.sortChildren = function () {
            this._children.sort(comparator);
        };
        /**
         * get path of this game object
         * @param split delimiter
         * @returns {string}
         */
        GameObject.prototype.getPath = function (split) {
            if (split === void 0) { split = '/'; }
            var arr = [];
            var obj = this;
            while (obj) {
                arr.unshift(obj.name);
                obj = obj.parent;
            }
            return arr.join(split);
        };
        /**
         * whether contains the specified game object of this tree structure.
         * @param child
         * @returns {boolean}
         */
        GameObject.prototype.contains = function (child) {
            if (child === this) {
                return true;
            }
            var parent = child;
            while (parent = parent.parent) {
                if (parent === this) {
                    return true;
                }
            }
            return false;
        };
        /**
         * get first component of type of the specified Type(constructor).
         * @param Type
         * @returns {WOZLLA.Component}
         */
        GameObject.prototype.getComponent = function (Type) {
            var comp, i, len;
            if (this._components.length <= 0) {
                return null;
            }
            for (i = 0, len = this._components.length; i < len; i++) {
                comp = this._components[i];
                if (comp instanceof Type) {
                    return comp;
                }
            }
            return null;
        };
        /**
         * @method hasComponent
         * @param Type
         * @returns {boolean}
         */
        GameObject.prototype.hasComponent = function (Type) {
            var comp, i, len;
            if (Type === WOZLLA.RectTransform) {
                return !!this._rectTransform;
            }
            if (this._components.length <= 0) {
                return false;
            }
            for (i = 0, len = this._components.length; i < len; i++) {
                comp = this._components[i];
                if (comp instanceof Type) {
                    return true;
                }
            }
            return false;
        };
        /**
         * get all components of type of Type(constructor).
         * @param Type
         * @returns {Array}
         */
        GameObject.prototype.getComponents = function (Type) {
            var comp, i, len;
            var result = [];
            if (this._components.length <= 0) {
                return result;
            }
            for (i = 0, len = this._components.length; i < len; i++) {
                comp = this._components[i];
                if (comp instanceof Type) {
                    result.push(comp);
                }
            }
            return result;
        };
        /**
         * add componen to this game object. this method would check component dependency
         * by method of component's listRequiredComponents.
         * @param comp
         * @returns {boolean}
         */
        GameObject.prototype.addComponent = function (comp) {
            if (this._components.indexOf(comp) !== -1) {
                return false;
            }
            this.checkComponentDependency(comp);
            if (comp._gameObject) {
                comp._gameObject.removeComponent(comp);
            }
            this._components.push(comp);
            comp._gameObject = this;
            if (comp instanceof WOZLLA.Behaviour) {
                this._behaviours.push(comp);
            }
            else if (comp instanceof WOZLLA.Renderer) {
                this._renderer = comp;
            }
            else if (comp instanceof WOZLLA.Collider) {
                this._collider = comp;
            }
            else if (comp instanceof WOZLLA.Mask) {
                this._mask = comp;
            }
            return true;
        };
        /**
         * remove the specified component
         * @param comp
         * @returns {boolean}
         */
        GameObject.prototype.removeComponent = function (comp) {
            var i, len, otherComp;
            var idx = this._components.indexOf(comp);
            if (idx !== -1) {
                for (i = 0, len = this._components.length; i < len; i++) {
                    otherComp = this._components[i];
                    if (otherComp !== comp) {
                        this.checkComponentDependency(otherComp, true);
                    }
                }
                this._components.splice(idx, 1);
                if (comp instanceof WOZLLA.Behaviour) {
                    this._behaviours.splice(this._behaviours.indexOf(comp), 1);
                }
                else if (comp instanceof WOZLLA.Renderer) {
                    this._renderer = null;
                }
                else if (comp instanceof WOZLLA.Collider) {
                    this._collider = null;
                }
                else if (comp instanceof WOZLLA.Mask) {
                    this._mask = null;
                }
                comp._gameObject = null;
                return true;
            }
            return false;
        };
        /**
         * init this game object.
         */
        GameObject.prototype.init = function () {
            var i, len;
            if (this._initialized || this._destroyed)
                return;
            for (i = 0, len = this._components.length; i < len; i++) {
                this._components[i].init();
            }
            for (i = 0, len = this._children.length; i < len; i++) {
                this._children[i].init();
            }
            this._initialized = true;
        };
        /**
         * destroy this game object.
         */
        GameObject.prototype.destroy = function () {
            var i, len;
            if (this._destroyed || !this._initialized)
                return;
            for (i = 0, len = this._components.length; i < len; i++) {
                this._components[i].destroy();
            }
            for (i = 0, len = this._children.length; i < len; i++) {
                this._children[i].destroy();
            }
            if (this._id) {
                delete idMap[this._id];
            }
            this.clearAllListeners();
            this._destroyed = true;
        };
        /**
         * call every frame when active was true.
         */
        GameObject.prototype.update = function () {
            var i, len, behaviour;
            if (!this._active)
                return;
            if (this._behaviours.length > 0) {
                for (i = 0, len = this._behaviours.length; i < len; i++) {
                    behaviour = this._behaviours[i];
                    behaviour.enabled && behaviour.update();
                }
            }
            if (this._children.length > 0) {
                for (i = 0, len = this._children.length; i < len; i++) {
                    this._children[i].update();
                }
            }
        };
        /**
         * visit this game object and it's all chidlren, children of children.
         * @param renderer
         * @param parentTransform
         * @param flags
         */
        GameObject.prototype.visit = function (renderer, parentTransform, flags) {
            var i, len;
            if (!this._active || !this._initialized || this._destroyed) {
                if ((flags & GameObject.MASK_TRANSFORM_DIRTY) === GameObject.MASK_TRANSFORM_DIRTY) {
                    this._transform.dirty = true;
                }
                return;
            }
            if (this._transform.dirty) {
                flags |= GameObject.MASK_TRANSFORM_DIRTY;
            }
            if ((flags & GameObject.MASK_TRANSFORM_DIRTY) == GameObject.MASK_TRANSFORM_DIRTY) {
                this._transform.transform(parentTransform);
            }
            if (!this._visible) {
                flags &= (~GameObject.MASK_VISIBLE);
            }
            if ((flags & GameObject.MASK_VISIBLE) === GameObject.MASK_VISIBLE) {
                this.render(renderer, flags);
            }
            for (i = 0, len = this._children.length; i < len; i++) {
                this._children[i].visit(renderer, this._transform, flags);
            }
            return flags;
        };
        /**
         * render this game object
         * @param renderer
         * @param flags
         */
        GameObject.prototype.render = function (renderer, flags) {
            this._mask && this._mask.render(renderer, flags);
            this._renderer && this._renderer.render(renderer, flags);
        };
        /**
         * get a game object under the point.
         * @param x
         * @param y
         * @param touchable
         * @returns {WOZLLA.GameObject}
         */
        GameObject.prototype.getUnderPoint = function (x, y, touchable) {
            if (touchable === void 0) { touchable = false; }
            var found, localP, child;
            var childrenArr;
            if (!this._active || !this._visible)
                return null;
            childrenArr = this._children;
            if (childrenArr.length > 0) {
                for (var i = childrenArr.length - 1; i >= 0; i--) {
                    child = childrenArr[i];
                    found = child.getUnderPoint(x, y, touchable);
                    if (found) {
                        return found;
                    }
                }
            }
            if (!touchable || this._touchable) {
                localP = this.transform.globalToLocal(x, y);
                if (this.testHit(localP.x, localP.y)) {
                    return this;
                }
            }
            return null;
        };
        /**
         * try to do a hit test
         * @param localX
         * @param localY
         * @returns {boolean}
         */
        GameObject.prototype.testHit = function (localX, localY) {
            var collider = this._collider;
            return collider && collider.collideXY(localX, localY);
        };
        GameObject.prototype.loadAssets = function (callback) {
            var i, len, count, comp;
            if (this._loadingAssets)
                return;
            count = this._components.length + this._children.length;
            if (count === 0) {
                callback && callback();
                return;
            }
            for (i = 0, len = this._components.length; i < len; i++) {
                comp = this._components[i];
                comp.loadAssets(function () {
                    if (--count === 0) {
                        callback && callback();
                    }
                });
            }
            for (i = 0, len = this._children.length; i < len; i++) {
                this._children[i].loadAssets(function () {
                    if (--count === 0) {
                        callback && callback();
                    }
                });
            }
        };
        GameObject.prototype.query = function (expr, record) {
            var result, compExpr, objExpr, compName, attrName;
            var objArr;
            var hasAttr = expr.indexOf('[') !== -1 && expr.indexOf(']') !== -1;
            var hasComp = expr.indexOf(':') !== -1;
            if (hasComp && hasAttr) {
                result = GameObject.QUERY_FULL_REGEX.exec(expr);
                compExpr = result[1];
                objExpr = result[2];
                compName = result[3];
                attrName = result[4];
            }
            else if (hasComp && !hasAttr) {
                result = GameObject.QUERY_COMP_REGEX.exec(expr);
                compExpr = result[1];
                objExpr = result[2];
                compName = result[3];
            }
            else if (!hasComp && hasAttr) {
                result = GameObject.QUERY_OBJ_ATTR_REGEX.exec(expr);
                objExpr = result[1];
                attrName = result[2];
            }
            else {
                objExpr = expr;
            }
            if (record) {
                record.compExpr = compExpr;
                record.objExpr = objExpr;
                record.compName = compName;
                record.attrName = attrName;
            }
            if (!objExpr) {
                result = this;
            }
            else {
                result = this;
                objArr = objExpr.split('/');
                for (var i = 0, len = objArr.length; i < len; i++) {
                    if (!objArr[i]) {
                        break;
                    }
                    result = result.getChild(objArr[i]);
                    if (!result) {
                        break;
                    }
                }
            }
            if (result && compName) {
                result = result.getComponent(WOZLLA.Component.getType(compName));
            }
            if (result && record) {
                record.target = result;
            }
            if (result && attrName) {
                result = result[attrName];
            }
            return result;
        };
        GameObject.prototype.checkComponentDependency = function (comp, isRemove) {
            if (isRemove === void 0) { isRemove = false; }
            var Type;
            var requires = comp.listRequiredComponents();
            if (!requires || requires.length === 0)
                return;
            for (var i = 0, len = requires.length; i < len; i++) {
                Type = requires[i];
                if (!this.hasComponent(Type)) {
                    if (isRemove) {
                        throw new Error('Can NOT remove: Component[' + WOZLLA.Component.getName(comp['constructor']) + '] depend on it');
                    }
                    else {
                        var name = Type === WOZLLA.RectTransform ? 'RectTransform' : WOZLLA.Component.getName(Type);
                        throw new Error('Can NOT add: Component[' + name + '] required');
                    }
                }
            }
        };
        GameObject.MASK_TRANSFORM_DIRTY = 0x1;
        GameObject.MASK_VISIBLE = 0x10;
        GameObject.QUERY_FULL_REGEX = /((.*?):(.*?))\[(.*?)\]$/;
        GameObject.QUERY_COMP_REGEX = /((.*?):(.*?))$/;
        GameObject.QUERY_OBJ_ATTR_REGEX = /(.*?)\[(.*?)\]$/;
        return GameObject;
    })(WOZLLA.event.EventDispatcher);
    WOZLLA.GameObject = GameObject;
    var QueryRecord = (function () {
        function QueryRecord() {
            this.compExpr = null;
            this.objExpr = null;
            this.compName = null;
            this.attrName = null;
            this.target = null;
        }
        return QueryRecord;
    })();
    WOZLLA.QueryRecord = QueryRecord;
})(WOZLLA || (WOZLLA = {}));
/// <reference path="GameObject.ts"/>
var WOZLLA;
(function (WOZLLA) {
    /**
     * the root game object of WOZLLA engine
     * @class WOZLLA.Stage
     * @extends WOZLLA.GameObject
     */
    var Stage = (function (_super) {
        __extends(Stage, _super);
        function Stage() {
            _super.call(this);
            this.id = Stage.ID;
            this.name = Stage.ID;
            this._rootTransform = new WOZLLA.Transform();
            this._viewRectTransform = new WOZLLA.RectTransform();
            this._viewRectTransform.anchorMode = WOZLLA.RectTransform.ANCHOR_TOP | WOZLLA.RectTransform.ANCHOR_LEFT;
            this._viewRectTransform.width = WOZLLA.Director.getInstance().renderer.viewport.width;
            this._viewRectTransform.height = WOZLLA.Director.getInstance().renderer.viewport.height;
            this._viewRectTransform.px = 0;
            this._viewRectTransform.py = 0;
            this.init();
        }
        Object.defineProperty(Stage.prototype, "viewRectTransform", {
            get: function () {
                return this._viewRectTransform;
            },
            enumerable: true,
            configurable: true
        });
        Stage.prototype.visitStage = function (renderer) {
            _super.prototype.visit.call(this, renderer, this._rootTransform, WOZLLA.GameObject.MASK_VISIBLE);
        };
        Stage.ID = 'WOZLLAStage';
        return Stage;
    })(WOZLLA.GameObject);
    WOZLLA.Stage = Stage;
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    /**
     * @class WOZLLA.Time
     * @static
     */
    var Time = (function () {
        function Time() {
        }
        Time.update = function (timeScale) {
            var now = Date.now() + this._nowIncrease;
            if (this.now) {
                this.delta = (now - this.now) * timeScale;
                this._nowIncrease += this.delta * (timeScale - 1);
                this.now += this.delta;
                this.measuredFPS = 1000 / this.delta;
            }
            else {
                this.now = now;
                this.delta = 1000 / 60;
            }
        };
        Time.reset = function () {
            this.delta = 0;
            this.now = 0;
            this._nowIncrease = 0;
            this.measuredFPS = 0;
        };
        /**
         * @property {number} delta
         * @readonly
         * @static
         */
        Time.delta = 0;
        /**
         * @property {number} now
         * @readonly
         * @static
         */
        Time.now = 0;
        /**
         * @property {number} measuredFPS
         * @readonly
         * @static
         */
        Time.measuredFPS = 0;
        Time._nowIncrease = 0;
        return Time;
    })();
    WOZLLA.Time = Time;
})(WOZLLA || (WOZLLA = {}));
/// <reference path="Time.ts"/>
var WOZLLA;
(function (WOZLLA) {
    /**
     * @class WOZLLA.Scheduler
     * @singleton
     */
    var Scheduler = (function () {
        function Scheduler() {
            this._scheduleCount = 0;
            this._schedules = {};
        }
        /**
         * @method {WOZLLA.Scheduler} getInstance
         * @static
         * @member WOZLLA.Scheduler
         */
        Scheduler.getInstance = function () {
            if (!Scheduler.instance) {
                Scheduler.instance = new Scheduler();
            }
            return Scheduler.instance;
        };
        Scheduler.prototype.runSchedule = function () {
            var scheduleId, scheduleItem, schedules;
            var markScheduleCount = this._scheduleCount;
            if (this._lastSchedules) {
                for (scheduleId in this._schedules) {
                    this._lastSchedules[scheduleId] = this._schedules[scheduleId];
                }
            }
            else {
                this._lastSchedules = this._schedules;
            }
            this._schedules = {};
            schedules = this._lastSchedules;
            for (scheduleId in schedules) {
                scheduleItem = schedules[scheduleId];
                if (scheduleItem.isFrame && !scheduleItem.paused) {
                    scheduleItem.frame--;
                    if (scheduleItem.frame < 0) {
                        delete schedules[scheduleId];
                        scheduleItem.task.apply(scheduleItem, scheduleItem.args);
                    }
                }
                else if (scheduleItem.isTime && !scheduleItem.paused) {
                    scheduleItem.time -= WOZLLA.Time.delta;
                    if (scheduleItem.time < 0) {
                        delete schedules[scheduleId];
                        scheduleItem.task.apply(scheduleItem, scheduleItem.args);
                    }
                }
                else if (scheduleItem.isInterval && !scheduleItem.paused) {
                    scheduleItem.time -= WOZLLA.Time.delta;
                    if (scheduleItem.time < 0) {
                        scheduleItem.task.apply(scheduleItem, scheduleItem.args);
                        scheduleItem.time += scheduleItem.intervalTime;
                    }
                }
                else if (scheduleItem.isLoop && !scheduleItem.paused) {
                    scheduleItem.task.apply(scheduleItem, scheduleItem.args);
                }
            }
            if (markScheduleCount < this._scheduleCount) {
                this.runSchedule();
            }
        };
        /**
         * remove the specify schedule by id
         * @param id
         */
        Scheduler.prototype.removeSchedule = function (id) {
            delete this._schedules[id];
        };
        /**
         * schedule the task to each frame
         * @param task
         * @param args
         * @returns {string} schedule id
         */
        Scheduler.prototype.scheduleLoop = function (task, args) {
            var scheduleId = 'Schedule_' + (this._scheduleCount++);
            this._schedules[scheduleId] = {
                task: task,
                args: args,
                isLoop: true
            };
            return scheduleId;
        };
        /**
         * schedule the task to the next speficied frame
         * @param task
         * @param {number} frame
         * @param args
         * @returns {string} schedule id
         */
        Scheduler.prototype.scheduleFrame = function (task, frame, args) {
            if (frame === void 0) { frame = 0; }
            var scheduleId = 'Schedule_' + (this._scheduleCount++);
            this._schedules[scheduleId] = {
                task: task,
                frame: frame,
                args: args,
                isFrame: true
            };
            return scheduleId;
        };
        /**
         * schedule the task to internal, like setInterval
         * @param task
         * @param time
         * @param args
         * @returns {string} schedule id
         */
        Scheduler.prototype.scheduleInterval = function (task, time, args) {
            if (time === void 0) { time = 0; }
            var scheduleId = 'Schedule_' + (this._scheduleCount++);
            this._schedules[scheduleId] = {
                task: task,
                intervalTime: time,
                time: time,
                args: args,
                isInterval: true
            };
            return scheduleId;
        };
        /**
         * schedule the task to time, like setTimeout
         * @param task
         * @param time
         * @param args
         * @returns {string} schedule id
         */
        Scheduler.prototype.scheduleTime = function (task, time, args) {
            if (time === void 0) { time = 0; }
            var scheduleId = 'Schedule_' + (this._scheduleCount++);
            time = time || 0;
            this._schedules[scheduleId] = {
                task: task,
                time: time,
                args: args,
                isTime: true
            };
            return scheduleId;
        };
        /**
         * resume the specified schedule
         * @param scheduleId
         */
        Scheduler.prototype.resumeSchedule = function (scheduleId) {
            this._schedules[scheduleId].paused = false;
        };
        /**
         * pause the specified schedule
         * @param scheduleId
         */
        Scheduler.prototype.pauseSchedule = function (scheduleId) {
            this._schedules[scheduleId].paused = true;
        };
        return Scheduler;
    })();
    WOZLLA.Scheduler = Scheduler;
})(WOZLLA || (WOZLLA = {}));
/// <reference path="../../typings/tsd.d.ts"/>
/// <reference path="Scheduler.ts"/>
/// <reference path="Stage.ts"/>
/// <reference path="Director.ts"/>
var WOZLLA;
(function (WOZLLA) {
    function getCanvasOffset(canvas) {
        var obj = canvas;
        var offset = { x: obj.offsetLeft, y: obj.offsetTop };
        while (obj = obj.offsetParent) {
            offset.x += obj.offsetLeft;
            offset.y += obj.offsetTop;
        }
        return offset;
    }
    var GestureEvent = (function (_super) {
        __extends(GestureEvent, _super);
        function GestureEvent(params) {
            _super.call(this, params.type, params.bubbles, params.data);
            this.touchMoveDetection = false;
            this.x = params.x;
            this.y = params.y;
            this.touch = params.touch;
            this.touchMoveDetection = params.touchMoveDetection;
            this.gesture = params.gesture;
            this.identifier = params.identifier;
        }
        GestureEvent.prototype.setTouchMoveDetection = function (value) {
            this.touchMoveDetection = value;
        };
        return GestureEvent;
    })(WOZLLA.event.Event);
    WOZLLA.GestureEvent = GestureEvent;
    /**
     * class for touch management <br/>
     * get the instance form {@link WOZLLA.Director}
     * @class WOZLLA.Touch
     * @protected
     */
    var Touch = (function () {
        function Touch(canvas, touchScale) {
            if (touchScale === void 0) { touchScale = 1; }
            /**
             * get or set enabled of touch system
             * @property {boolean} enabled
             */
            this.enabled = true;
            this.canvas = null;
            this.canvasOffset = null;
            this.channelMap = {};
            var me = this;
            var nav = window.navigator;
            me.canvas = canvas;
            me.canvasOffset = getCanvasOffset(canvas);
            me.touchScale = touchScale;
            me.hammer = new Hammer(canvas, {
                transform: false,
                doubletap: false,
                hold: false,
                rotate: false,
                pinch: false
            });
            me.hammer.on(Touch.enabledGestures || 'touch release tap swipe drag dragstart dragend', function (e) {
                if (e.type === 'release' || me.enabled) {
                    WOZLLA.Scheduler.getInstance().scheduleFrame(function () {
                        me.onGestureEvent(e);
                    });
                }
            });
        }
        Touch.setEanbledGestures = function (gestures) {
            this.enabledGestures = gestures;
        };
        Touch.prototype.onGestureEvent = function (e) {
            var x, y, i, len, touch, identifier, channel, changedTouches, target, type = e.type, stage = WOZLLA.Director.getInstance().stage;
            var me = this;
            var canvasScale = this.touchScale || 1;
            changedTouches = e.gesture.srcEvent.changedTouches;
            if (!changedTouches) {
                identifier = 1;
                x = e.gesture.srcEvent.pageX - me.canvasOffset.x;
                y = e.gesture.srcEvent.pageY - me.canvasOffset.y;
                x *= canvasScale;
                y *= canvasScale;
                if (type === 'touch') {
                    target = stage.getUnderPoint(x, y, true);
                    if (target) {
                        me.channelMap[identifier] = me.createDispatchChanel(target);
                    }
                    else {
                        delete me.channelMap[identifier];
                    }
                }
                channel = me.channelMap[identifier];
                channel && channel.onGestureEvent(e, target, x, y, identifier);
            }
            else {
                len = changedTouches.length;
                for (i = 0; i < len; i++) {
                    touch = changedTouches[i];
                    identifier = parseInt(touch.identifier);
                    x = touch.pageX - me.canvasOffset.x;
                    y = touch.pageY - me.canvasOffset.y;
                    x *= canvasScale;
                    y *= canvasScale;
                    if (type === 'touch') {
                        target = stage.getUnderPoint(x, y, true);
                        if (target) {
                            me.channelMap[identifier] = me.createDispatchChanel(target);
                            delete me.channelMap[identifier - 10];
                        }
                    }
                    channel = me.channelMap[identifier];
                    channel && channel.onGestureEvent(e, target, x, y, identifier);
                }
            }
        };
        Touch.prototype.createDispatchChanel = function (touchTarget) {
            var touchMoveDetection = true;
            return {
                onGestureEvent: function (e, target, x, y, identifier) {
                    var touchEvent, type = e.type, stage = WOZLLA.Director.getInstance().stage;
                    switch (type) {
                        case 'drag':
                            if (!touchMoveDetection) {
                                target = touchTarget;
                                break;
                            }
                        case 'tap':
                        case 'release':
                            target = stage.getUnderPoint(x, y, true);
                            break;
                    }
                    if (type === 'tap' && touchTarget !== target) {
                        return;
                    }
                    touchEvent = new GestureEvent({
                        x: x,
                        y: y,
                        type: type,
                        bubbles: true,
                        touch: target,
                        gesture: e.gesture,
                        identifier: identifier,
                        touchMoveDetection: false
                    });
                    touchTarget.dispatchEvent(touchEvent);
                    touchMoveDetection = touchEvent.touchMoveDetection;
                }
            };
        };
        return Touch;
    })();
    WOZLLA.Touch = Touch;
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var renderer;
    (function (renderer) {
        function applyProperties(target, source) {
            for (var i in source) {
                if (typeof target[i] === 'undefined') {
                    target[i] = source[i];
                }
            }
            return target;
        }
        /**
         * @class WOZLLA.renderer.WebGLUtils
         * @abstract
         */
        var WebGLUtils = (function () {
            function WebGLUtils() {
            }
            WebGLUtils.getGLContext = function (canvas, options) {
                var gl;
                options = applyProperties(options || {}, {
                    alpha: true,
                    antialias: true,
                    premultipliedAlpha: false,
                    stencil: true
                });
                try {
                    gl = canvas.getContext('experimental-webgl', options);
                }
                catch (e) {
                    try {
                        gl = canvas.getContext('webgl', options);
                    }
                    catch (e2) {
                    }
                }
                return gl;
            };
            WebGLUtils.compileShader = function (gl, shaderType, shaderSrc) {
                var src = shaderSrc;
                var shader = gl.createShader(shaderType);
                gl.shaderSource(shader, src);
                gl.compileShader(shader);
                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    console.log(gl.getShaderInfoLog(shader));
                    return null;
                }
                return shader;
            };
            WebGLUtils.compileProgram = function (gl, vertexSrc, fragmentSrc) {
                var vertexShader = WebGLUtils.compileShader(gl, gl.VERTEX_SHADER, vertexSrc);
                var fragmentShader = WebGLUtils.compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);
                var shaderProgram = gl.createProgram();
                gl.attachShader(shaderProgram, vertexShader);
                gl.attachShader(shaderProgram, fragmentShader);
                gl.linkProgram(shaderProgram);
                if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                    console.log("Could not initialise program");
                }
                return {
                    program: shaderProgram,
                    vertexShader: vertexShader,
                    fragmentShader: fragmentShader
                };
            };
            return WebGLUtils;
        })();
        renderer.WebGLUtils = WebGLUtils;
    })(renderer = WOZLLA.renderer || (WOZLLA.renderer = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var renderer;
    (function (renderer) {
        var ILayerManager;
        (function (ILayerManager) {
            /**
             * @property {string} DEFAULT
             * @readonly
             * @static
             * @member WOZLLA.renderer.ILayerManager
             */
            ILayerManager.DEFAULT = 'default';
        })(ILayerManager = renderer.ILayerManager || (renderer.ILayerManager = {}));
    })(renderer = WOZLLA.renderer || (WOZLLA.renderer = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="../ILayerManager.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var renderer;
    (function (renderer) {
        /**
         * @class WOZLLA.renderer.LayerManager
         * @extends WOZLLA.renderer.ILayerManager
         */
        var LayerManager = (function () {
            function LayerManager() {
                this._layerIndexMap = {};
                this._sortedLayers = [];
                this.define(renderer.ILayerManager.DEFAULT, 0);
            }
            LayerManager.prototype.define = function (layer, zindex) {
                var _this = this;
                if (this._layerIndexMap[layer]) {
                    throw new Error('Layer has been defined: ' + layer);
                }
                this._layerIndexMap[layer] = zindex;
                this._sortedLayers.push(layer);
                this._sortedLayers.sort(function (a, b) {
                    return _this.getZIndex(a) - _this.getZIndex(b);
                });
            };
            LayerManager.prototype.undefine = function (layer) {
                this._sortedLayers.splice(this._sortedLayers.indexOf(layer), 1);
                delete this._layerIndexMap[layer];
            };
            LayerManager.prototype.getZIndex = function (layer) {
                return this._layerIndexMap[layer];
            };
            LayerManager.prototype.getSortedLayers = function () {
                return this._sortedLayers.slice(0);
            };
            LayerManager.prototype._getSortedLayers = function () {
                return this._sortedLayers;
            };
            return LayerManager;
        })();
        renderer.LayerManager = LayerManager;
    })(renderer = WOZLLA.renderer || (WOZLLA.renderer = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var renderer;
    (function (renderer) {
        /**
         * @class WOZLLA.renderer.BlendType
         */
        var BlendType = (function () {
            function BlendType(srcFactor, distFactor) {
                this._srcFactor = srcFactor;
                this._distFactor = distFactor;
            }
            Object.defineProperty(BlendType.prototype, "srcFactor", {
                get: function () {
                    return this._srcFactor;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BlendType.prototype, "distFactor", {
                get: function () {
                    return this._distFactor;
                },
                enumerable: true,
                configurable: true
            });
            BlendType.prototype.applyBlend = function (gl) {
                gl.blendFunc(this._srcFactor, this._distFactor);
            };
            BlendType.NORMAL = 1;
            BlendType.ADD = 2;
            BlendType.MULTIPLY = 3;
            BlendType.SCREEN = 4;
            return BlendType;
        })();
        renderer.BlendType = BlendType;
    })(renderer = WOZLLA.renderer || (WOZLLA.renderer = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var renderer;
    (function (renderer) {
        /**
         * @class WOZLLA.renderer.Material
         * @extends WOZLLA.renderer.IMaterial
         */
        var Material = (function () {
            function Material(id, shaderProgramId, blendType) {
                this._id = id;
                this._shaderProgramId = shaderProgramId;
                this._blendType = blendType;
            }
            Object.defineProperty(Material.prototype, "id", {
                get: function () {
                    return this._id;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Material.prototype, "shaderProgramId", {
                get: function () {
                    return this._shaderProgramId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Material.prototype, "blendType", {
                get: function () {
                    return this._blendType;
                },
                enumerable: true,
                configurable: true
            });
            Material.prototype.equals = function (other) {
                return other.blendType === this._blendType && other.shaderProgramId === this._shaderProgramId;
            };
            return Material;
        })();
        renderer.Material = Material;
    })(renderer = WOZLLA.renderer || (WOZLLA.renderer = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var renderer;
    (function (renderer) {
        var IMaterial;
        (function (IMaterial) {
            /**
             * default material key of built-in
             * @property {string} DEFAULT
             * @readonly
             * @static
             * @member WOZLLA.renderer.IMaterial
             */
            IMaterial.DEFAULT = 'Builtin_default';
        })(IMaterial = renderer.IMaterial || (renderer.IMaterial = {}));
    })(renderer = WOZLLA.renderer || (WOZLLA.renderer = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var renderer;
    (function (renderer) {
        var IShaderProgram;
        (function (IShaderProgram) {
            /**
             * @property {string} V2T2C1A1
             * @readonly
             * @static
             * @member WOZLLA.renderer.IShaderProgram
             */
            IShaderProgram.V2T2C1A1 = 'Builtin_V2T2C1A1';
        })(IShaderProgram = renderer.IShaderProgram || (renderer.IShaderProgram = {}));
    })(renderer = WOZLLA.renderer || (WOZLLA.renderer = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="Material.ts"/>
/// <reference path="../IMaterial.ts"/>
/// <reference path="../IShaderProgram.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var renderer;
    (function (renderer) {
        /**
         * @class WOZLLA.renderer.MaterialManager
         * @extends WOZLLA.renderer.IMaterialManager
         */
        var MaterialManager = (function () {
            function MaterialManager() {
                this._materialMap = {};
                this._materialMap[renderer.IMaterial.DEFAULT] = this.createMaterial(renderer.IMaterial.DEFAULT, renderer.IShaderProgram.V2T2C1A1, renderer.BlendType.NORMAL);
            }
            MaterialManager.prototype.createMaterial = function (id, shaderProgramId, blendType) {
                var material = new renderer.Material(id, shaderProgramId, blendType);
                this._materialMap[id] = material;
                return material;
            };
            MaterialManager.prototype.getMaterial = function (id) {
                return this._materialMap[id];
            };
            MaterialManager.prototype.deleteMaterial = function (material) {
                delete this._materialMap[material.id];
            };
            MaterialManager.prototype.clear = function () {
                this._materialMap = {};
            };
            return MaterialManager;
        })();
        renderer.MaterialManager = MaterialManager;
    })(renderer = WOZLLA.renderer || (WOZLLA.renderer = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var renderer;
    (function (renderer) {
        /**
         * @class WOZLLA.renderer.ShaderProgram
         * @extends WOZLLA.renderer.IShaderProgram
         */
        var ShaderProgram = (function () {
            function ShaderProgram(id, vertexShader, fragmentShader) {
                this._id = id;
                this._vertexShader = vertexShader;
                this._fragmentShader = fragmentShader;
            }
            Object.defineProperty(ShaderProgram.prototype, "id", {
                get: function () {
                    return this._id;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ShaderProgram.prototype, "vertexShader", {
                get: function () {
                    return this._vertexShader;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ShaderProgram.prototype, "fragmentShader", {
                get: function () {
                    return this._fragmentShader;
                },
                enumerable: true,
                configurable: true
            });
            ShaderProgram.prototype.useProgram = function (gl) {
                gl.useProgram(this._id);
            };
            ShaderProgram.prototype.syncUniforms = function (gl, uniforms) {
            };
            return ShaderProgram;
        })();
        renderer.ShaderProgram = ShaderProgram;
    })(renderer = WOZLLA.renderer || (WOZLLA.renderer = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var renderer;
    (function (renderer) {
        var shader;
        (function (shader) {
            /**
             * @class WOZLLA.renderer.shader.V2T2C1A1
             */
            var V2T2C1A1 = (function (_super) {
                __extends(V2T2C1A1, _super);
                function V2T2C1A1(id, vertexShader, fragmentShader) {
                    _super.call(this, id, vertexShader, fragmentShader);
                    this._locations = {
                        initialized: false
                    };
                }
                V2T2C1A1.prototype.useProgram = function (gl) {
                    _super.prototype.useProgram.call(this, gl);
                    if (!this._locations.initialized) {
                        this._initLocaitions(gl);
                        this._locations.initialized = true;
                    }
                    this._activate(gl);
                };
                V2T2C1A1.prototype.syncUniforms = function (gl, uniforms) {
                    gl.uniform2f(this._locations.projectionVector, uniforms.projection.x, uniforms.projection.y);
                };
                V2T2C1A1.prototype._initLocaitions = function (gl) {
                    var program = this._id;
                    this._locations.uSampler = gl.getUniformLocation(program, 'uSampler');
                    this._locations.projectionVector = gl.getUniformLocation(program, 'projectionVector');
                    this._locations.offsetVector = gl.getUniformLocation(program, 'offsetVector');
                    this._locations.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
                    this._locations.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');
                    this._locations.aColor = gl.getAttribLocation(program, 'aColor');
                };
                V2T2C1A1.prototype._activate = function (gl) {
                    gl.activeTexture(gl.TEXTURE0);
                    var stride = renderer.Quad.V2T2C1A1.strade * 4;
                    gl.vertexAttribPointer(this._locations.aVertexPosition, 2, gl.FLOAT, false, stride, 0);
                    gl.vertexAttribPointer(this._locations.aTextureCoord, 2, gl.FLOAT, false, stride, 2 * 4);
                    gl.vertexAttribPointer(this._locations.aColor, 2, gl.FLOAT, false, stride, 4 * 4);
                    gl.enableVertexAttribArray(this._locations.aVertexPosition);
                    gl.enableVertexAttribArray(this._locations.aTextureCoord);
                    gl.enableVertexAttribArray(this._locations.aColor);
                };
                V2T2C1A1.VERTEX_SOURCE = [
                    'attribute vec2 aVertexPosition;\n',
                    'attribute vec2 aTextureCoord;\n',
                    'attribute vec2 aColor;\n',
                    'uniform vec2 projectionVector;\n',
                    'uniform vec2 offsetVector;\n',
                    'varying vec2 vTextureCoord;\n',
                    'varying vec4 vColor;\n',
                    'const vec2 center = vec2(-1.0, 1.0);\n',
                    'void main(void) {\n',
                    'gl_Position = vec4( ((aVertexPosition + offsetVector) / projectionVector) + center , 0.0, 1.0);\n',
                    'vTextureCoord = aTextureCoord;\n',
                    'vec3 color = mod(vec3(aColor.y/65536.0, aColor.y/256.0, aColor.y), 256.0) / 256.0;\n',
                    'vColor = vec4(color * aColor.x, aColor.x);\n',
                    '}'
                ].join('');
                V2T2C1A1.FRAGMENT_SOURCE = [
                    'precision mediump float;\n',
                    'varying vec2 vTextureCoord;\n',
                    'varying vec4 vColor;\n',
                    'uniform sampler2D uSampler;\n',
                    'void main(void) {\n',
                    'gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;\n',
                    '}'
                ].join('');
                return V2T2C1A1;
            })(WOZLLA.renderer.ShaderProgram);
            shader.V2T2C1A1 = V2T2C1A1;
        })(shader = renderer.shader || (renderer.shader = {}));
    })(renderer = WOZLLA.renderer || (WOZLLA.renderer = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="ShaderProgram.ts"/>
/// <reference path="../IShaderProgram.ts"/>
/// <reference path="../shader/V2T2C1A1.ts"/>
/// <reference path="../WebGLUtils.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var renderer;
    (function (renderer) {
        /**
         * @class WOZLLA.renderer.ShaderManager
         * @extends WOZLLA.renderer.IShaderManager
         */
        var ShaderManager = (function () {
            function ShaderManager(gl) {
                this._gl = gl;
                this._shaderMap = {};
                this._shaderMap[renderer.IShaderProgram.V2T2C1A1] = this.createShaderProgram(renderer.shader.V2T2C1A1.VERTEX_SOURCE, renderer.shader.V2T2C1A1.FRAGMENT_SOURCE, renderer.shader.V2T2C1A1);
            }
            ShaderManager.prototype.getShaderProgram = function (id) {
                return this._shaderMap[id];
            };
            ShaderManager.prototype.createShaderProgram = function (vertexSource, fragmentSource, ShaderClass) {
                if (ShaderClass === void 0) { ShaderClass = renderer.ShaderProgram; }
                var result = renderer.WebGLUtils.compileProgram(this._gl, vertexSource, fragmentSource);
                var shaderProgram = new ShaderClass(result.program, result.vertexShader, result.fragmentShader);
                this._shaderMap[shaderProgram.id] = shaderProgram;
                return shaderProgram;
            };
            ShaderManager.prototype.deleteShaderProgram = function (shaderProgram) {
                this._gl.deleteProgram(shaderProgram.id);
                this._gl.deleteShader(shaderProgram.vertexShader);
                this._gl.deleteShader(shaderProgram.fragmentShader);
                delete this._shaderMap[shaderProgram.id];
            };
            ShaderManager.prototype.clear = function () {
                for (var id in this._shaderMap) {
                    this.deleteShaderProgram(this._shaderMap[id]);
                }
            };
            return ShaderManager;
        })();
        renderer.ShaderManager = ShaderManager;
    })(renderer = WOZLLA.renderer || (WOZLLA.renderer = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var renderer;
    (function (renderer) {
        /**
         * @class WOZLLA.renderer.Texture
         * @extends WOZLLA.renderer.ITexture
         */
        var Texture = (function () {
            function Texture(id, descriptor) {
                this._id = id;
                this._descriptor = descriptor;
            }
            Object.defineProperty(Texture.prototype, "id", {
                get: function () {
                    return this._id;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Texture.prototype, "descriptor", {
                get: function () {
                    return this._descriptor;
                },
                enumerable: true,
                configurable: true
            });
            Texture.prototype.bind = function (gl) {
                gl.bindTexture(gl.TEXTURE_2D, this._id);
            };
            return Texture;
        })();
        renderer.Texture = Texture;
    })(renderer = WOZLLA.renderer || (WOZLLA.renderer = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="Texture.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var renderer;
    (function (renderer) {
        function isPowerOf2(num) {
            return (num & (num - 1)) === 0;
        }
        /**
         * @class WOZLLA.renderer.TextureManager
         * @extends WOZLLA.renderer.ITextureManager
         */
        var TextureManager = (function () {
            function TextureManager(gl) {
                this._gl = gl;
                this._textureMap = {};
            }
            TextureManager.prototype.getTexture = function (id) {
                return this._textureMap[id];
            };
            TextureManager.prototype.generateTexture = function (descriptor, textureId) {
                var texture;
                var pvrtcExt;
                var compressedType;
                var gl = this._gl;
                var id = textureId || gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, id);
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                if (isPowerOf2(descriptor.width) && isPowerOf2(descriptor.height)) {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                }
                else {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                }
                switch (descriptor.textureFormat) {
                    case 0 /* PNG */:
                    case 1 /* JPEG */:
                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, descriptor.source);
                        break;
                    case 2 /* PVR */:
                        switch (descriptor.pixelFormat) {
                            case 5 /* PVRTC2 */:
                                pvrtcExt = renderer.WebGLExtension.getExtension(gl, renderer.WebGLExtension.PVRTC);
                                compressedType = pvrtcExt.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
                                break;
                            case 4 /* PVRTC4 */:
                                pvrtcExt = renderer.WebGLExtension.getExtension(gl, renderer.WebGLExtension.PVRTC);
                                compressedType = pvrtcExt.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
                                break;
                            default:
                                throw new Error('Unsupported pixel format: ' + descriptor.pixelFormat);
                        }
                        gl.compressedTexImage2D(gl.TEXTURE_2D, 0, compressedType, descriptor.width, descriptor.height, 0, descriptor.source);
                        break;
                    default:
                        throw new Error('Unsupported texture format: ' + descriptor.textureFormat);
                }
                texture = new renderer.Texture(id, descriptor);
                this._textureMap[id] = texture;
                return texture;
            };
            TextureManager.prototype.updateTexture = function (texture) {
                this.generateTexture(texture.descriptor, texture.id);
            };
            TextureManager.prototype.deleteTexture = function (texture) {
                this._gl.deleteTexture(texture.id);
                delete this._textureMap[texture.id];
            };
            TextureManager.prototype.clear = function () {
                for (var id in this._textureMap) {
                    this.deleteTexture(this._textureMap[id]);
                }
            };
            return TextureManager;
        })();
        renderer.TextureManager = TextureManager;
    })(renderer = WOZLLA.renderer || (WOZLLA.renderer = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="LayerManager.ts"/>
/// <reference path="../BlendType.ts"/>
/// <reference path="MaterialManager.ts"/>
/// <reference path="ShaderManager.ts"/>
/// <reference path="TextureManager.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var renderer;
    (function (renderer) {
        var Renderer = (function () {
            function Renderer(gl, viewport) {
                this._commandQueueMap = {};
                this._blendModes = {};
                this._uniforms = {};
                this._gl = gl;
                this._viewport = viewport;
                this._blendModes[renderer.BlendType.NORMAL] = new renderer.BlendType(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                this._blendModes[renderer.BlendType.ADD] = new renderer.BlendType(gl.SRC_ALPHA, gl.DST_ALPHA);
                this._blendModes[renderer.BlendType.MULTIPLY] = new renderer.BlendType(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
                this._blendModes[renderer.BlendType.SCREEN] = new renderer.BlendType(gl.SRC_ALPHA, gl.ONE);
                this._layerManager = new renderer.LayerManager();
                this._materialManager = new renderer.MaterialManager();
                this._shaderManager = new renderer.ShaderManager(gl);
                this._textureManager = new renderer.TextureManager(gl);
                this._quadBatch = new QuadBatch(gl);
                this._uniforms.projection = {
                    x: viewport.width / 2,
                    y: -viewport.height / 2
                };
                gl.disable(gl.DEPTH_TEST);
                gl.disable(gl.CULL_FACE);
                gl.enable(gl.BLEND);
            }
            Object.defineProperty(Renderer.prototype, "layerManager", {
                get: function () {
                    return this._layerManager;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Renderer.prototype, "materialManager", {
                get: function () {
                    return this._materialManager;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Renderer.prototype, "shaderManager", {
                get: function () {
                    return this._shaderManager;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Renderer.prototype, "textureManager", {
                get: function () {
                    return this._textureManager;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Renderer.prototype, "gl", {
                get: function () {
                    return this._gl;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Renderer.prototype, "viewport", {
                get: function () {
                    return this._viewport;
                },
                enumerable: true,
                configurable: true
            });
            Renderer.prototype.addCommand = function (command) {
                var layer = command.layer;
                var commandQueue = this._commandQueueMap[layer];
                if (!commandQueue) {
                    commandQueue = this._commandQueueMap[layer] = new CommandQueue(layer);
                }
                commandQueue.add(command);
            };
            Renderer.prototype.render = function () {
                var _this = this;
                var lastCommand;
                var currentTexture;
                var currentMaterial;
                var gl = this._gl;
                gl.viewport(0, 0, this._viewport.width, this._viewport.height);
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                this._eachCommand(function (command) {
                    var quadCommand;
                    var customCommand;
                    if (!lastCommand) {
                        _this.flush();
                    }
                    else if (lastCommand instanceof renderer.CustomCommand) {
                        _this.flush();
                    }
                    else if (command instanceof renderer.CustomCommand) {
                        _this.flush();
                    }
                    else if (command.materialId !== currentMaterial.id) {
                        _this.flush();
                    }
                    else if (command.texture !== currentTexture) {
                        _this.flush();
                    }
                    if (command instanceof renderer.CustomCommand) {
                        customCommand = command;
                        customCommand.execute(_this);
                    }
                    else {
                        quadCommand = command;
                        if (_this._quadBatch.canFill(quadCommand.quad)) {
                            _this._quadBatch.fillQuad(quadCommand.quad);
                        }
                        else {
                            _this.flush();
                            _this._quadBatch.fillQuad(quadCommand.quad);
                        }
                    }
                    _this._usingMaterial = currentMaterial = _this._materialManager.getMaterial(command.materialId);
                    _this._usingTexture = currentTexture = command.texture;
                    lastCommand = command;
                });
                if (lastCommand) {
                    this.flush();
                    this._clearCommands();
                    this._usingTexture = null;
                    this._usingMaterial = null;
                }
            };
            Renderer.prototype.flush = function () {
                var gl, shaderProgram;
                if (!this._usingMaterial) {
                    return;
                }
                gl = this._gl;
                shaderProgram = this._shaderManager.getShaderProgram(this._usingMaterial.shaderProgramId);
                shaderProgram.useProgram(gl);
                shaderProgram.syncUniforms(gl, this._uniforms);
                this._blendModes[this._usingMaterial.blendType].applyBlend(gl);
                if (this._usingTexture) {
                    this._usingTexture.bind(gl);
                }
                this._quadBatch.flush(gl);
            };
            Renderer.prototype._clearCommands = function () {
                var commandQueueMap = this._commandQueueMap;
                for (var layer in commandQueueMap) {
                    commandQueueMap[layer].clear();
                }
            };
            Renderer.prototype._eachCommand = function (func) {
                var i, len, j, len2;
                var layer;
                var commandQueue;
                var zQueue;
                var command;
                var commandQueueMap = this._commandQueueMap;
                var layers = this._layerManager._getSortedLayers();
                for (i = 0, len = layers.length; i < len; i++) {
                    layer = layers[i];
                    commandQueue = commandQueueMap[layer];
                    if (commandQueue) {
                        zQueue = commandQueue.negativeZQueue;
                        if (zQueue.length > 0) {
                            for (j = 0, len2 = zQueue.length; j < len2; j++) {
                                command = zQueue[j];
                                func(command);
                            }
                        }
                        zQueue = commandQueue.zeroZQueue;
                        if (zQueue.length > 0) {
                            for (j = 0, len2 = zQueue.length; j < len2; j++) {
                                command = zQueue[j];
                                func(command);
                            }
                        }
                        zQueue = commandQueue.positiveZQueue;
                        if (zQueue.length > 0) {
                            for (j = 0, len2 = zQueue.length; j < len2; j++) {
                                command = zQueue[j];
                                func(command);
                            }
                        }
                    }
                }
            };
            Renderer.MAX_QUAD_SIZE = 500;
            return Renderer;
        })();
        renderer.Renderer = Renderer;
        function compareCommandByGlobalZ(a, b) {
            if (a.globalZ === b.globalZ) {
                return a._addIndex - b._addIndex;
            }
            return a.globalZ - b.globalZ;
        }
        var CommandQueue = (function () {
            function CommandQueue(layer) {
                this._addIndex = 0;
                this.negativeZQueue = [];
                this.zeroZQueue = [];
                this.positiveZQueue = [];
                this.layer = layer;
            }
            CommandQueue.prototype.add = function (command) {
                command._addIndex = this._addIndex++;
                if (command.globalZ === 0) {
                    this.zeroZQueue.push(command);
                }
                else if (command.globalZ > 0) {
                    this.positiveZQueue.push(command);
                }
                else {
                    this.negativeZQueue.push(command);
                }
            };
            CommandQueue.prototype.clear = function () {
                var i, len, command;
                for (i = 0, len = this.negativeZQueue.length; i < len; i++) {
                    command = this.negativeZQueue[i];
                    if (command.isPoolable) {
                        command.release();
                    }
                }
                for (i = 0, len = this.zeroZQueue.length; i < len; i++) {
                    command = this.zeroZQueue[i];
                    if (command.isPoolable) {
                        command.release();
                    }
                }
                for (i = 0, len = this.positiveZQueue.length; i < len; i++) {
                    command = this.positiveZQueue[i];
                    if (command.isPoolable) {
                        command.release();
                    }
                }
                this.negativeZQueue.length = 0;
                this.zeroZQueue.length = 0;
                this.positiveZQueue.length = 0;
                this._addIndex = 0;
            };
            CommandQueue.prototype.sort = function () {
                this.positiveZQueue.sort(compareCommandByGlobalZ);
                this.negativeZQueue.sort(compareCommandByGlobalZ);
            };
            return CommandQueue;
        })();
        var QuadBatch = (function () {
            function QuadBatch(gl) {
                this._size = Renderer.MAX_QUAD_SIZE;
                this._curVertexIndex = 0;
                this._curBatchSize = 0;
                this._gl = gl;
                this._initBuffers();
            }
            Object.defineProperty(QuadBatch.prototype, "vertexBuffer", {
                get: function () {
                    return this._vertexBuffer;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QuadBatch.prototype, "indexBuffer", {
                get: function () {
                    return this._indexBuffer;
                },
                enumerable: true,
                configurable: true
            });
            QuadBatch.prototype.canFill = function (quad) {
                return this._curVertexIndex < this._size;
            };
            QuadBatch.prototype.fillQuad = function (quad) {
                var vertexIndex, storage;
                var vertices = this._vertices;
                vertexIndex = this._curVertexIndex;
                if (quad.count === quad.renderCount) {
                    vertices.set(quad.storage, vertexIndex);
                }
                else {
                    var j = 0;
                    var i = quad.renderOffset * quad.type.size;
                    var len = quad.renderCount * quad.type.size;
                    storage = quad.storage;
                    for (; j < len; i++, j++) {
                        vertices[vertexIndex + j] = storage[i];
                    }
                }
                this._curVertexIndex += quad.renderCount * quad.type.size;
                this._curBatchSize += quad.renderCount;
            };
            QuadBatch.prototype.flush = function (gl) {
                if (this._curBatchSize === 0) {
                    return;
                }
                gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, this._vertices, gl.DYNAMIC_DRAW);
                gl.drawElements(gl.TRIANGLES, this._curBatchSize * 6, gl.UNSIGNED_SHORT, 0);
                this._curVertexIndex = 0;
                this._curBatchSize = 0;
            };
            QuadBatch.prototype._initBuffers = function () {
                var i, j;
                var gl = this._gl;
                var numVerts = this._size * 4 * 6;
                var numIndices = this._size * 6;
                this._vertices = new Float32Array(numVerts);
                this._indices = new Uint16Array(numIndices);
                for (i = 0, j = 0; i < numIndices; i += 6, j += 4) {
                    this._indices[i] = j;
                    this._indices[i + 1] = j + 1;
                    this._indices[i + 2] = j + 2;
                    this._indices[i + 3] = j;
                    this._indices[i + 4] = j + 2;
                    this._indices[i + 5] = j + 3;
                }
                // create a couple of buffers
                this._vertexBuffer = gl.createBuffer();
                this._indexBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._indices, gl.STATIC_DRAW);
                gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, this._vertices, gl.DYNAMIC_DRAW);
            };
            return QuadBatch;
        })();
    })(renderer = WOZLLA.renderer || (WOZLLA.renderer = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="Stage.ts"/>
/// <reference path="Touch.ts"/>
/// <reference path="../renderer/WebGLUtils.ts"/>
/// <reference path="../renderer/internal/Renderer.ts"/>
/// <reference path="Scheduler.ts"/>
/// <reference path="../assets/AssetLoader.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var requestAnimationFrame = window.requestAnimationFrame || window.msRequestAnimationFrame || function (frameCall, intervalTime) {
        if (intervalTime === void 0) { intervalTime = 1000 / 62; }
        setTimeout(frameCall, intervalTime);
    };
    /**
     * a director hold this instances: <br/>
     * 1. {@link WOZLLA.Stage} <br/>
     * 2. {@link WOZLLA.renderer.IRenderer} <br/>
     * 3. {@link WOZLLA.Scheduler} <br/>
     * 4. {@link WOZLLA.Touch} <br/>
     * 5. {@link WOZLLA.assets.AssetLoader} <br/>
     * <br/>
     * <br/>
     * and also responsable to setup engine and control main loop.
     *
     * @class WOZLLA.Director
     * @singleton
     */
    var Director = (function () {
        function Director(view, options) {
            if (options === void 0) { options = {}; }
            this._runing = false;
            this._paused = false;
            this._timeScale = 1;
            Director.instance = this;
            this._view = typeof view === 'string' ? document.getElementById('canvas') : view;
            this._scheduler = WOZLLA.Scheduler.getInstance();
            this._assetLoader = WOZLLA.assets.AssetLoader.getInstance();
            this._touch = new WOZLLA.Touch(view, options.touchScale);
            this._renderer = new WOZLLA.renderer.Renderer(WOZLLA.renderer.WebGLUtils.getGLContext(view, options.renderer), {
                x: 0,
                y: 0,
                width: view.width,
                height: view.height
            });
            this._stage = new WOZLLA.Stage();
        }
        Director.getInstance = function () {
            return Director.instance;
        };
        Object.defineProperty(Director.prototype, "view", {
            /**
             * get the canvas element
             * @property {any} view
             */
            get: function () {
                return this._view;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Director.prototype, "touch", {
            /**
             * get the touch instance
             * @property {WOZLLA.Touch} touch
             * @readonly
             */
            get: function () {
                return this._touch;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Director.prototype, "stage", {
            /**
             * get the stage instance
             * @property {WOZLLA.Stage} stage
             * @readonly
             */
            get: function () {
                return this._stage;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Director.prototype, "scheduler", {
            /**
             * get the scheduler instance
             * @property {WOZLLA.Scheduler} scheduler
             * @readonly
             */
            get: function () {
                return this._scheduler;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Director.prototype, "renderer", {
            /**
             * get the renderer instance
             * @property {WOZLLA.renderer.IRenderer} renderer
             * @readonly
             */
            get: function () {
                return this._renderer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Director.prototype, "assetLoader", {
            /**
             * get the asset loader instance
             * @property {WOZLLA.assets.AssetLoader} assetLoader
             * @readonly
             */
            get: function () {
                return this._assetLoader;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Director.prototype, "viewRectTransform", {
            /**
             * get the root instance of RectTransform
             * @returns {WOZLLA.RectTransform} viewRectTransform
             */
            get: function () {
                return this._stage.viewRectTransform;
            },
            enumerable: true,
            configurable: true
        });
        /**
         *  start main loop
         */
        Director.prototype.start = function () {
            var _this = this;
            var frame;
            if (this._runing) {
                return;
            }
            this._runing = true;
            WOZLLA.Time.reset();
            frame = function () {
                if (_this._runing) {
                    requestAnimationFrame(frame);
                }
                _this.runStep();
            };
            requestAnimationFrame(frame);
        };
        /**
         * stop main loop
         */
        Director.prototype.stop = function () {
            this._runing = false;
        };
        /**
         * run one frame
         * @param {number} [timeScale=1]
         */
        Director.prototype.runStep = function (timeScale) {
            if (timeScale === void 0) { timeScale = this._timeScale; }
            WOZLLA.Time.update(timeScale);
            this._stage.update();
            this._stage.visitStage(this._renderer);
            this._renderer.render();
            this._scheduler.runSchedule();
            WOZLLA.utils.Tween.tick(WOZLLA.Time.delta);
        };
        return Director;
    })();
    WOZLLA.Director = Director;
})(WOZLLA || (WOZLLA = {}));
/// <reference path="Asset.ts"/>
/// <reference path="../renderer/ITexture.ts"/>
/// <reference path="../renderer/IRenderer.ts"/>
/// <reference path="../core/Director.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var assets;
    (function (assets) {
        /**
         * internal class
         * @class WOZLLA.assets.GLTextureAsset
         * @extends WOZLLA.assets.Asset
         * @abstract
         */
        var GLTextureAsset = (function (_super) {
            __extends(GLTextureAsset, _super);
            function GLTextureAsset() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(GLTextureAsset.prototype, "glTexture", {
                get: function () {
                    return this._glTexture;
                },
                enumerable: true,
                configurable: true
            });
            GLTextureAsset.prototype._generateTexture = function (image) {
                var renderer = WOZLLA.Director.getInstance().renderer;
                if (!renderer) {
                    throw new Error("Director not initialized");
                }
                this._glTexture = renderer.textureManager.generateTexture(new HTMLImageDescriptor(image));
            };
            GLTextureAsset.prototype._generatePVRTexture = function (pvrSource) {
                throw new Error("Unsupported now");
            };
            return GLTextureAsset;
        })(assets.Asset);
        assets.GLTextureAsset = GLTextureAsset;
        var HTMLImageDescriptor = (function () {
            function HTMLImageDescriptor(source) {
                this._source = source;
                this._textureFormat = 0 /* PNG */;
                this._pixelFormat = 0 /* RGBA8888 */;
            }
            Object.defineProperty(HTMLImageDescriptor.prototype, "width", {
                get: function () {
                    return this._source.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HTMLImageDescriptor.prototype, "height", {
                get: function () {
                    return this._source.height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HTMLImageDescriptor.prototype, "source", {
                get: function () {
                    return this._source;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HTMLImageDescriptor.prototype, "textureFormat", {
                get: function () {
                    return this._textureFormat;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HTMLImageDescriptor.prototype, "pixelFormat", {
                get: function () {
                    return this._pixelFormat;
                },
                enumerable: true,
                configurable: true
            });
            return HTMLImageDescriptor;
        })();
        assets.HTMLImageDescriptor = HTMLImageDescriptor;
        var PVRDescriptor = (function () {
            function PVRDescriptor(source, pixelFormat) {
                this._source = source;
                this._textureFormat = 2 /* PVR */;
                this._pixelFormat = pixelFormat;
            }
            Object.defineProperty(PVRDescriptor.prototype, "width", {
                get: function () {
                    return this._source.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PVRDescriptor.prototype, "height", {
                get: function () {
                    return this._source.height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PVRDescriptor.prototype, "source", {
                get: function () {
                    return this._source;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PVRDescriptor.prototype, "textureFormat", {
                get: function () {
                    return this._textureFormat;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PVRDescriptor.prototype, "pixelFormat", {
                get: function () {
                    return this._pixelFormat;
                },
                enumerable: true,
                configurable: true
            });
            return PVRDescriptor;
        })();
        assets.PVRDescriptor = PVRDescriptor;
    })(assets = WOZLLA.assets || (WOZLLA.assets = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var utils;
    (function (utils) {
        function applyProperties(target, source) {
            for (var i in source) {
                if (typeof target[i] === 'undefined') {
                    target[i] = source[i];
                }
            }
            return target;
        }
        var contentParser = {
            'json': function (xhr) {
                return JSON.parse(xhr.responseText);
            },
            'arraybuffer': function (xhr) {
                return xhr.response;
            }
        };
        var empty = function () {
        };
        /**
         * @class WOZLLA.utils.Ajax
         */
        var Ajax = (function () {
            function Ajax() {
            }
            /**
             * send a request with options
             * @param {object} options
             * @param {boolean} options.async
             * @param {string} options.method GET/POST
             * @param {string} options.contentType text/json/xml
             * @param {string} options.responseType text/plain,text/javascript,text/css,arraybuffer
             * @param {number} [options.timeout=30000]
             * @param {function} options.success call when ajax request successfully
             * @param {function} options.error call when ajax request error
             */
            Ajax.request = function (options) {
                if (options === void 0) { options = {}; }
                var xhr;
                var timeoutId;
                options = applyProperties(options, {
                    url: '',
                    async: true,
                    method: 'GET',
                    dataType: 'text',
                    responseType: 'text/plain',
                    timeout: 30000,
                    success: empty,
                    error: empty,
                    withCredentials: false
                });
                xhr = new XMLHttpRequest();
                xhr.responseType = options.responseType;
                xhr.onreadystatechange = function () {
                    var parser;
                    if (xhr.readyState === 4) {
                        xhr.onreadystatechange = empty;
                        clearTimeout(timeoutId);
                        parser = contentParser[options.dataType] || function () {
                            return xhr.responseText;
                        };
                        options.success(parser(xhr));
                    }
                };
                xhr.open(options.method, options.url, options.async);
                xhr.withCredentials = options.withCredentials;
                timeoutId = setTimeout(function () {
                    xhr.onreadystatechange = empty;
                    xhr.abort();
                    options.error({
                        code: Ajax.ERROR_TIMEOUT,
                        message: 'request timeout'
                    });
                }, options.timeout);
                xhr.send();
            };
            /**
             * internal ajax error code when timeout
             * @property ERROR_TIMEOUT
             * @static
             * @readonly
             */
            Ajax.ERROR_TIMEOUT = 1;
            /**
             * internal ajax error code when server error
             * @property ERROR_SERVER
             * @static
             * @readonly
             */
            Ajax.ERROR_SERVER = 2;
            return Ajax;
        })();
        utils.Ajax = Ajax;
    })(utils = WOZLLA.utils || (WOZLLA.utils = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="Asset.ts"/>
/// <reference path="../utils/Ajax.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var assets;
    (function (assets) {
        function deepCopyJSON(o) {
            var copy = o, k;
            if (o && typeof o === 'object') {
                copy = Object.prototype.toString.call(o) === '[object Array]' ? [] : {};
                for (k in o) {
                    copy[k] = deepCopyJSON(o[k]);
                }
            }
            return copy;
        }
        var JSONAsset = (function (_super) {
            __extends(JSONAsset, _super);
            function JSONAsset() {
                _super.apply(this, arguments);
            }
            JSONAsset.prototype.cloneData = function () {
                if (!this._data) {
                    return this._data;
                }
                return deepCopyJSON(this._data);
            };
            JSONAsset.prototype.load = function (onSuccess, onError) {
                var _this = this;
                WOZLLA.utils.Ajax.request({
                    url: this.fullPath,
                    dataType: 'json',
                    success: function (data) {
                        _this._data = data;
                        onSuccess();
                    },
                    error: function (error) {
                        onError(error);
                    }
                });
            };
            JSONAsset.prototype.unload = function () {
                this._data = null;
                _super.prototype.unload.call(this);
            };
            return JSONAsset;
        })(assets.Asset);
        assets.JSONAsset = JSONAsset;
    })(assets = WOZLLA.assets || (WOZLLA.assets = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var assets;
    (function (assets) {
        var proxy;
        (function (proxy) {
            var AssetProxy = (function () {
                function AssetProxy(proxyTarget) {
                    this.loading = false;
                    this.proxyTarget = proxyTarget;
                }
                AssetProxy.prototype.setAssetSrc = function (src) {
                    this.newAssetSrc = src;
                };
                AssetProxy.prototype.loadAsset = function (callback) {
                    var _this = this;
                    if (this.checkDirty()) {
                        if (this.loading) {
                            callback && callback();
                            return;
                        }
                        this.loading = true;
                        this.asset && this.asset.release();
                        this.asset = null;
                        this.doLoad(function (asset) {
                            if (!asset) {
                                _this.asset = null;
                                callback && callback();
                            }
                            else if (asset.src !== _this.newAssetSrc) {
                                asset.retain();
                                asset.release();
                                _this.asset = null;
                            }
                            else {
                                _this.asset = asset;
                                _this.asset.retain();
                            }
                            _this.loading = false;
                            _this.proxyTarget.onAssetLoaded(asset);
                            callback && callback();
                        });
                    }
                    else {
                        callback && callback();
                    }
                };
                AssetProxy.prototype.onDestroy = function () {
                    this.asset && this.asset.release();
                    this.asset = null;
                };
                AssetProxy.prototype.checkDirty = function () {
                    if (!this.asset) {
                        return !!this.newAssetSrc;
                    }
                    return this.newAssetSrc !== this.asset.src;
                };
                AssetProxy.prototype.doLoad = function (callback) {
                    callback(null);
                };
                return AssetProxy;
            })();
            proxy.AssetProxy = AssetProxy;
        })(proxy = assets.proxy || (assets.proxy = {}));
    })(assets = WOZLLA.assets || (WOZLLA.assets = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var assets;
    (function (assets) {
        var proxy;
        (function (proxy) {
            var SpriteAtlasProxy = (function (_super) {
                __extends(SpriteAtlasProxy, _super);
                function SpriteAtlasProxy() {
                    _super.apply(this, arguments);
                }
                SpriteAtlasProxy.prototype.getSprite = function (spriteName) {
                    if (this.asset) {
                        return this.asset.getSprite(spriteName);
                    }
                    return null;
                };
                SpriteAtlasProxy.prototype.getFrameLength = function () {
                    if (!this.asset) {
                        return 0;
                    }
                    return this.asset.getFrameLength();
                };
                SpriteAtlasProxy.prototype.doLoad = function (callback) {
                    var src = this.newAssetSrc;
                    if (!src) {
                        callback(null);
                        return;
                    }
                    assets.AssetLoader.getInstance().load(src, assets.SpriteAtlas, function () {
                        callback(assets.AssetLoader.getInstance().getAsset(src));
                    });
                };
                return SpriteAtlasProxy;
            })(proxy.AssetProxy);
            proxy.SpriteAtlasProxy = SpriteAtlasProxy;
        })(proxy = assets.proxy || (assets.proxy = {}));
    })(assets = WOZLLA.assets || (WOZLLA.assets = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var assets;
    (function (assets) {
        /**
         * an sprite is a part of a sprite atlas
         * @class WOZLLA.assets.Sprite
         * <br/>
         * see also: <br/>
         * {@link WOZLLA.assets.SpriteAtlas}<br/>
         */
        var Sprite = (function () {
            /**
             * new a sprite
             * @method constructor
             * @param spriteAtlas
             * @param frame
             * @param name
             */
            function Sprite(spriteAtlas, frame, name) {
                this._spriteAtlas = spriteAtlas;
                this._frame = frame;
                this._name = name;
            }
            Object.defineProperty(Sprite.prototype, "spriteAtlas", {
                /**
                 * get the sprite atlas of this sprite belongs to
                 * @property {WOZLLA.assets.SpriteAtlas} spriteAltas
                 * @readonly
                 */
                get: function () {
                    return this._spriteAtlas;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Sprite.prototype, "frame", {
                /**
                 * get frame info
                 * @property {any} frame
                 * @readonly
                 */
                get: function () {
                    return this._frame;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Sprite.prototype, "name", {
                /**
                 * get sprite name
                 * @property {string} name
                 * @readonly
                 */
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            return Sprite;
        })();
        assets.Sprite = Sprite;
    })(assets = WOZLLA.assets || (WOZLLA.assets = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="Sprite.ts"/>
/// <reference path="../utils/Ajax.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var assets;
    (function (assets) {
        var imageTest = /(\.png|\.jpg)$/i;
        function isImageURL(url) {
            return imageTest.test(url);
        }
        function getFileName(url) {
            var idx = url.lastIndexOf('/');
            if (idx !== -1) {
                return url.substr(idx + 1, url.length);
            }
            return url;
        }
        /**
         * a sprite atlas contains many {@link WOZLLA.assets.Sprite}.
         * it's recommended to user {@link WOZLLA.assets.AssetLoader} to load SpriteAtlas.
         * @class WOZLLA.assets.SpriteAtlas
         * @extends WOZLLA.assets.GLTextureAsset
         * <br/>
         * see also:
         * {@link WOZLLA.assets.Sprite}
         * {@link WOZLLA.assets.AssetLoader}
         */
        var SpriteAtlas = (function (_super) {
            __extends(SpriteAtlas, _super);
            function SpriteAtlas() {
                _super.apply(this, arguments);
                this._spriteCache = {};
            }
            Object.defineProperty(SpriteAtlas.prototype, "imageSrc", {
                /**
                 * @property {string} imageSrc
                 * @readonly
                 */
                get: function () {
                    return this._imageSrc;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpriteAtlas.prototype, "metaSrc", {
                /**
                 * an file url descript sprite atlas infos.
                 * @property {string} metaSrc
                 * @readonly
                 */
                get: function () {
                    return this._metaSrc;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpriteAtlas.prototype, "sourceImage", {
                /**
                 * @property {any} sourceImage
                 * @readonly
                 */
                get: function () {
                    return this._sourceImage;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpriteAtlas.prototype, "spriteData", {
                /**
                 * @property {any} spriteData
                 * @readonly
                 */
                get: function () {
                    return this._spriteData;
                },
                enumerable: true,
                configurable: true
            });
            SpriteAtlas.prototype.getFrameLength = function () {
                var frames;
                if (!this._spriteData) {
                    return 1;
                }
                frames = this._spriteData.frames;
                if (Object.prototype.toString.call(frames) === '[object Array]') {
                    return frames.length;
                }
                if (this._frameLengthCache == void 0) {
                    this._frameLengthCache = 0;
                    for (var _ in frames) {
                        this._frameLengthCache++;
                    }
                }
                return this._frameLengthCache;
            };
            /**
             * get sprite by name
             * @param name
             * @returns {WOZLLA.assets.Sprite}
             */
            SpriteAtlas.prototype.getSprite = function (name) {
                var frameData, sprite;
                if (name == void 0) {
                    return this._entireSprite;
                }
                sprite = this._spriteCache[name];
                if (sprite) {
                    return sprite;
                }
                if (!this._spriteData) {
                    return null;
                }
                frameData = this._spriteData.frames[name];
                if (frameData) {
                    if (typeof frameData.frame.width === 'undefined') {
                        frameData.frame.width = frameData.frame.w;
                        frameData.frame.height = frameData.frame.h;
                    }
                    sprite = new assets.Sprite(this, {
                        x: frameData.frame.x,
                        y: frameData.frame.y,
                        width: frameData.frame.width,
                        height: frameData.frame.height,
                        offsetX: Math.ceil(frameData.spriteSourceSize ? (frameData.spriteSourceSize.x || 0) : 0),
                        offsetY: Math.ceil(frameData.spriteSourceSize ? (frameData.spriteSourceSize.y || 0) : 0)
                    }, name);
                    this._spriteCache[name] = sprite;
                    return sprite;
                }
                return null;
            };
            /**
             * load this asset
             * @param onSuccess
             * @param onError
             */
            SpriteAtlas.prototype.load = function (onSuccess, onError) {
                var _this = this;
                if (isImageURL(this.fullPath)) {
                    this._imageSrc = this.fullPath;
                    this._loadImage(function (error, image) {
                        if (error) {
                            onError && onError(error);
                        }
                        else {
                            _this._generateTexture(image);
                            _this._sourceImage = image;
                            _this._entireSprite = new assets.Sprite(_this, {
                                x: 0,
                                y: 0,
                                width: image.width,
                                height: image.height
                            });
                            onSuccess && onSuccess();
                        }
                    });
                }
                else {
                    this._metaSrc = this.fullPath;
                    this._loadSpriteAtlas(function (error, image, spriteData) {
                        if (error) {
                            onError && onError(error);
                        }
                        else {
                            _this._sourceImage = image;
                            _this._generateTexture(image);
                            _this._entireSprite = new assets.Sprite(_this, {
                                x: 0,
                                y: 0,
                                width: image.width,
                                height: image.height
                            });
                            _this._spriteData = spriteData;
                            onSuccess && onSuccess();
                        }
                    });
                }
            };
            SpriteAtlas.prototype._loadImage = function (callback) {
                var _this = this;
                var image = new Image();
                image.src = this._imageSrc;
                image.onload = function () {
                    callback && callback(null, image);
                };
                image.onerror = function () {
                    callback('Fail to load image: ' + _this._imageSrc);
                };
            };
            SpriteAtlas.prototype._loadSpriteAtlas = function (callback) {
                var me = this;
                WOZLLA.utils.Ajax.request({
                    url: me._metaSrc,
                    dataType: 'json',
                    success: function (data) {
                        var imageSuffix = data.meta.image;
                        var metaFileName = getFileName(me._metaSrc);
                        me._imageSrc = me._metaSrc.replace(new RegExp(metaFileName + '$'), imageSuffix);
                        me._loadImage(function (error, image) {
                            if (error) {
                                callback && callback(error);
                            }
                            else {
                                callback && callback(null, image, data);
                            }
                        });
                    },
                    error: function (err) {
                        callback('Fail to load sprite: ' + this._metaSrc + ', ' + err.code + ':' + err.message);
                    }
                });
            };
            return SpriteAtlas;
        })(assets.GLTextureAsset);
        assets.SpriteAtlas = SpriteAtlas;
    })(assets = WOZLLA.assets || (WOZLLA.assets = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var math;
    (function (math) {
        /**
         * @class WOZLLA.math.Rectangle
         *  a utils class for rectangle, provider some math methods
         */
        var Rectangle = (function () {
            function Rectangle(x, y, width, height) {
                /**
                 * get or set x
                 * @property {number} x
                 */
                this.x = x;
                /**
                 * get or set y
                 * @property {number} y
                 */
                this.y = y;
                /**
                 * get or set width
                 * @property {number} width
                 */
                this.width = width;
                /**
                 * get or set height
                 * @property {number} height
                 */
                this.height = height;
            }
            Object.defineProperty(Rectangle.prototype, "left", {
                /**
                 * @property {number} left x
                 * @readonly
                 */
                get: function () {
                    return this.x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "right", {
                /**
                 * @property {number} right x+width
                 * @readonly
                 */
                get: function () {
                    return this.x + this.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "top", {
                /**
                 * @property {number} top y
                 * @readonly
                 */
                get: function () {
                    return this.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "bottom", {
                /**
                 * @property {number} bottom y+height
                 * @readonly
                 */
                get: function () {
                    return this.y + this.height;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @method containsXY
             * @param x
             * @param y
             * @returns {boolean}
             */
            Rectangle.prototype.containsXY = function (x, y) {
                return this.x <= x && this.right > x && this.y <= y && this.bottom > y;
            };
            /**
             * get simple description of this object
             * @returns {string}
             */
            Rectangle.prototype.toString = function () {
                return 'Rectangle[' + this.x + ',' + this.y + ',' + this.width + ',' + this.height + ']';
            };
            return Rectangle;
        })();
        math.Rectangle = Rectangle;
    })(math = WOZLLA.math || (WOZLLA.math = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="../../core/Collider.ts"/>
/// <reference path="../../math/Rectangle.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var component;
    (function (component) {
        /**
         * @class WOZLLA.component.CircleCollider
         */
        var CircleCollider = (function (_super) {
            __extends(CircleCollider, _super);
            function CircleCollider() {
                _super.apply(this, arguments);
            }
            CircleCollider.prototype.collideXY = function (localX, localY) {
                return this.region && this.region.containsXY(localX, localY);
            };
            CircleCollider.prototype.collide = function (collider) {
                return false;
            };
            return CircleCollider;
        })(WOZLLA.Collider);
        component.CircleCollider = CircleCollider;
    })(component = WOZLLA.component || (WOZLLA.component = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="../../core/Collider.ts"/>
/// <reference path="../../math/Rectangle.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var component;
    (function (component) {
        /**
         * @class WOZLLA.component.MaskCollider
         */
        var MaskCollider = (function (_super) {
            __extends(MaskCollider, _super);
            function MaskCollider() {
                _super.apply(this, arguments);
            }
            MaskCollider.prototype.collideXY = function (localX, localY) {
                return true;
            };
            MaskCollider.prototype.collide = function (collider) {
                return false;
            };
            return MaskCollider;
        })(WOZLLA.Collider);
        component.MaskCollider = MaskCollider;
    })(component = WOZLLA.component || (WOZLLA.component = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="../../core/Collider.ts"/>
/// <reference path="../../math/Rectangle.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var component;
    (function (component) {
        /**
         * @class WOZLLA.component.RectCollider
         */
        var RectCollider = (function (_super) {
            __extends(RectCollider, _super);
            function RectCollider() {
                _super.apply(this, arguments);
            }
            RectCollider.fromSpriteRenderer = function (spriteRenderer) {
                var rectCollider = new WOZLLA.component.RectCollider();
                var frame = spriteRenderer.sprite.frame;
                var offset = spriteRenderer.spriteOffset;
                rectCollider.region = new WOZLLA.math.Rectangle(0 - frame.width * offset.x, 0 - frame.height * offset.y, frame.width, frame.height);
                return rectCollider;
            };
            RectCollider.prototype.collideXY = function (localX, localY) {
                return this.region && this.region.containsXY(localX, localY);
            };
            RectCollider.prototype.collide = function (collider) {
                return false;
            };
            return RectCollider;
        })(WOZLLA.Collider);
        component.RectCollider = RectCollider;
    })(component = WOZLLA.component || (WOZLLA.component = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var renderer;
    (function (renderer) {
        /**
         * @class WOZLLA.renderer.RenderCommandBase
         * @abstract
         */
        var RenderCommandBase = (function () {
            function RenderCommandBase(globalZ, layer) {
                this._globalZ = globalZ;
                this._layer = layer;
            }
            Object.defineProperty(RenderCommandBase.prototype, "globalZ", {
                get: function () {
                    return this._globalZ;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RenderCommandBase.prototype, "layer", {
                get: function () {
                    return this._layer;
                },
                enumerable: true,
                configurable: true
            });
            return RenderCommandBase;
        })();
        renderer.RenderCommandBase = RenderCommandBase;
    })(renderer = WOZLLA.renderer || (WOZLLA.renderer = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="RenderCommandBase.ts"/>
/// <reference path="IRenderer.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var renderer;
    (function (_renderer) {
        /**
         * @class WOZLLA.renderer.CustomCommand
         * @extends WOZLLA.renderer.RenderCommandBase
         */
        var CustomCommand = (function (_super) {
            __extends(CustomCommand, _super);
            function CustomCommand(globalZ, layer) {
                _super.call(this, globalZ, layer);
            }
            CustomCommand.prototype.execute = function (renderer) {
                throw new Error('abstract method');
            };
            return CustomCommand;
        })(_renderer.RenderCommandBase);
        _renderer.CustomCommand = CustomCommand;
    })(renderer = WOZLLA.renderer || (WOZLLA.renderer = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="Component.ts"/>
/// <reference path="../renderer/ILayerManager.ts"/>
/// <reference path="../renderer/CustomCommand.ts"/>
var WOZLLA;
(function (WOZLLA) {
    /**
     * Base class for all mask, mask is based on webgl stencil.
     * @class WOZLLA.Mask
     * @extends WOZLLA.Component
     * @abstract
     */
    var Mask = (function (_super) {
        __extends(Mask, _super);
        function Mask() {
            _super.apply(this, arguments);
            this.reverse = false;
            this._startGlobalZ = 0;
            this._endGlobalZ = 0;
            this._maskLayer = WOZLLA.renderer.ILayerManager.DEFAULT;
        }
        /**
         * set mask range, mask range is effect on globalZ of render commmand
         * @param start
         * @param end
         * @param layer
         */
        Mask.prototype.setMaskRange = function (start, end, layer) {
            if (layer === void 0) { layer = WOZLLA.renderer.ILayerManager.DEFAULT; }
            this._startGlobalZ = start;
            this._endGlobalZ = end;
            this._maskLayer = layer;
        };
        /**
         * render this mask
         * @param renderer
         * @param flags
         */
        Mask.prototype.render = function (renderer, flags) {
            renderer.addCommand(new EnableMaskCommand(this._startGlobalZ, this._maskLayer));
            this.renderMask(renderer, flags);
            renderer.addCommand(new EndMaskCommand(this._startGlobalZ, this._maskLayer, this.reverse));
            renderer.addCommand(new DisableMaskCommand(this._endGlobalZ, this._maskLayer));
        };
        /**
         * do render mask graphics
         * @param renderer
         * @param flags
         */
        Mask.prototype.renderMask = function (renderer, flags) {
        };
        return Mask;
    })(WOZLLA.Component);
    WOZLLA.Mask = Mask;
    var EnableMaskCommand = (function (_super) {
        __extends(EnableMaskCommand, _super);
        function EnableMaskCommand(globalZ, layer) {
            _super.call(this, globalZ, layer);
        }
        EnableMaskCommand.prototype.execute = function (renderer) {
            var gl = renderer.gl;
            gl.enable(gl.STENCIL_TEST);
            gl.clear(gl.STENCIL_BUFFER_BIT);
            gl.colorMask(false, false, false, false);
            gl.stencilFunc(gl.ALWAYS, 1, 0);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
        };
        return EnableMaskCommand;
    })(WOZLLA.renderer.CustomCommand);
    var EndMaskCommand = (function (_super) {
        __extends(EndMaskCommand, _super);
        function EndMaskCommand(globalZ, layer, reverse) {
            _super.call(this, globalZ, layer);
            this.reverse = reverse;
        }
        EndMaskCommand.prototype.execute = function (renderer) {
            var gl = renderer.gl;
            gl.colorMask(true, true, true, true);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
            gl.stencilFunc(this.reverse ? gl.NOTEQUAL : gl.EQUAL, 1, 0xFF);
        };
        return EndMaskCommand;
    })(WOZLLA.renderer.CustomCommand);
    var DisableMaskCommand = (function (_super) {
        __extends(DisableMaskCommand, _super);
        function DisableMaskCommand(globalZ, layer) {
            _super.call(this, globalZ, layer);
        }
        DisableMaskCommand.prototype.execute = function (renderer) {
            renderer.gl.disable(renderer.gl.STENCIL_TEST);
        };
        return DisableMaskCommand;
    })(WOZLLA.renderer.CustomCommand);
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    /**
     * Abstract base class for Renderer component
     * @class WOZLLA.Renderer
     * @abstract
     */
    var Renderer = (function (_super) {
        __extends(Renderer, _super);
        function Renderer() {
            _super.apply(this, arguments);
        }
        /**
         * render this object
         * @param renderer
         * @param flags
         */
        Renderer.prototype.render = function (renderer, flags) {
        };
        return Renderer;
    })(WOZLLA.Component);
    WOZLLA.Renderer = Renderer;
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var renderer;
    (function (renderer) {
        /**
         * @class WOZLLA.renderer.QuadType
         */
        var QuadType = (function () {
            function QuadType(info) {
                this._info = info;
            }
            Object.defineProperty(QuadType.prototype, "size", {
                get: function () {
                    return this.strade * 4;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QuadType.prototype, "strade", {
                get: function () {
                    return this._info[0];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QuadType.prototype, "vertexIndex", {
                get: function () {
                    return this._info[1];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QuadType.prototype, "texCoordIndex", {
                get: function () {
                    return this._info[2];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QuadType.prototype, "alphaIndex", {
                get: function () {
                    return this._info[3];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QuadType.prototype, "colorIndex", {
                get: function () {
                    return this._info[4];
                },
                enumerable: true,
                configurable: true
            });
            return QuadType;
        })();
        renderer.QuadType = QuadType;
        /**
         * @class WOZLLA.renderer.Quad
         */
        var Quad = (function () {
            function Quad(count, type) {
                if (type === void 0) { type = Quad.V2T2C1A1; }
                this._count = count;
                this._type = type;
                this._storage = new Array(type.size * count);
                this._renderOffset = 0;
                this._renderCount = count;
            }
            Object.defineProperty(Quad.prototype, "storage", {
                get: function () {
                    return this._storage;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Quad.prototype, "count", {
                get: function () {
                    return this._count;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Quad.prototype, "type", {
                get: function () {
                    return this._type;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Quad.prototype, "renderOffset", {
                get: function () {
                    return this._renderOffset;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Quad.prototype, "renderCount", {
                get: function () {
                    return this._renderCount;
                },
                enumerable: true,
                configurable: true
            });
            Quad.prototype.setRenderRange = function (offset, count) {
                this._renderOffset = offset;
                this._renderCount = count;
            };
            Quad.prototype.setVertices = function (x1, y1, x2, y2, x3, y3, x4, y4, offset) {
                if (offset === void 0) { offset = 0; }
                var strade = this._type.strade;
                var size = this._type.size;
                var index = this._type.vertexIndex;
                var base = size * offset + index;
                this._storage[0 + base] = x1;
                this._storage[1 + base] = y1;
                this._storage[0 + base + strade * 1] = x2;
                this._storage[1 + base + strade * 1] = y2;
                this._storage[0 + base + strade * 2] = x3;
                this._storage[1 + base + strade * 2] = y3;
                this._storage[0 + base + strade * 3] = x4;
                this._storage[1 + base + strade * 3] = y4;
            };
            Quad.prototype.setTexCoords = function (x1, y1, x2, y2, x3, y3, x4, y4, offset) {
                if (offset === void 0) { offset = 0; }
                var strade = this._type.strade;
                var size = this._type.size;
                var index = this._type.texCoordIndex;
                var base = size * offset + index;
                this._storage[0 + base] = x1;
                this._storage[1 + base] = y1;
                this._storage[0 + base + strade * 1] = x2;
                this._storage[1 + base + strade * 1] = y2;
                this._storage[0 + base + strade * 2] = x3;
                this._storage[1 + base + strade * 2] = y3;
                this._storage[0 + base + strade * 3] = x4;
                this._storage[1 + base + strade * 3] = y4;
            };
            Quad.prototype.setAlpha = function (alpha, offset) {
                if (offset === void 0) { offset = 0; }
                var strade = this._type.strade;
                var size = this._type.size;
                var index = this._type.alphaIndex;
                var base = size * offset + index;
                this._storage[base] = alpha;
                this._storage[base + strade * 1] = alpha;
                this._storage[base + strade * 2] = alpha;
                this._storage[base + strade * 3] = alpha;
            };
            Quad.prototype.setColor = function (color, offset) {
                if (offset === void 0) { offset = 0; }
                var strade = this._type.strade;
                var size = this._type.size;
                var index = this._type.colorIndex;
                var base = size * offset + index;
                this._storage[base] = color;
                this._storage[base + strade * 1] = color;
                this._storage[base + strade * 2] = color;
                this._storage[base + strade * 3] = color;
            };
            Quad.V2T2C1A1 = new QuadType([6, 0, 2, 4, 5]);
            return Quad;
        })();
        renderer.Quad = Quad;
    })(renderer = WOZLLA.renderer || (WOZLLA.renderer = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var utils;
    (function (utils) {
        var ObjectPool = (function () {
            function ObjectPool(minCount, factory) {
                this._minCount = minCount;
                this._factory = factory;
                this._pool = [];
                for (var i = 0; i < this._minCount; i++) {
                    this._pool.push(this._factory());
                }
            }
            ObjectPool.prototype.retain = function () {
                var object = this._pool.shift();
                if (object) {
                    return object;
                }
                return this._factory();
            };
            ObjectPool.prototype.release = function (obj) {
                if (this._pool.indexOf(obj) !== -1) {
                    return;
                }
                this._pool.push(obj);
            };
            return ObjectPool;
        })();
        utils.ObjectPool = ObjectPool;
    })(utils = WOZLLA.utils || (WOZLLA.utils = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="ITexture.ts"/>
/// <reference path="Quad.ts"/>
/// <reference path="RenderCommandBase.ts"/>
/// <reference path="ILayerManager.ts"/>
/// <reference path="../utils/ObjectPool.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var renderer;
    (function (renderer) {
        var quadCommandPool;
        /**
         * @class WOZLLA.renderer.QuadCommand
         * @extends WOZLLA.renderer.RenderCommandBase
         */
        var QuadCommand = (function (_super) {
            __extends(QuadCommand, _super);
            function QuadCommand(globalZ, layer) {
                _super.call(this, globalZ, layer);
                this.isPoolable = true;
            }
            QuadCommand.init = function (globalZ, layer, texture, materialId, quad) {
                var quadCommand = quadCommandPool.retain();
                quadCommand.initWith(globalZ, layer, texture, materialId, quad);
                return quadCommand;
            };
            Object.defineProperty(QuadCommand.prototype, "texture", {
                get: function () {
                    return this._texture;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QuadCommand.prototype, "materialId", {
                get: function () {
                    return this._materialId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QuadCommand.prototype, "quad", {
                get: function () {
                    return this._quad;
                },
                enumerable: true,
                configurable: true
            });
            QuadCommand.prototype.initWith = function (globalZ, layer, texture, materialId, quad) {
                this._globalZ = globalZ;
                this._layer = layer;
                this._texture = texture;
                this._materialId = materialId;
                this._quad = quad;
            };
            QuadCommand.prototype.release = function () {
                quadCommandPool.release(this);
            };
            return QuadCommand;
        })(renderer.RenderCommandBase);
        renderer.QuadCommand = QuadCommand;
        quadCommandPool = new WOZLLA.utils.ObjectPool(200, function () {
            return new QuadCommand(0, renderer.ILayerManager.DEFAULT);
        });
    })(renderer = WOZLLA.renderer || (WOZLLA.renderer = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="../../core/Renderer.ts"/>
/// <reference path="../../renderer/IRenderer.ts"/>
/// <reference path="../../renderer/ILayerManager.ts"/>
/// <reference path="../../renderer/QuadCommand.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var component;
    (function (component) {
        var QuadCommand = WOZLLA.renderer.QuadCommand;
        /**
         * @class WOZLLA.component.QuadRenderer
         * @abstract
         */
        var QuadRenderer = (function (_super) {
            __extends(QuadRenderer, _super);
            function QuadRenderer() {
                _super.apply(this, arguments);
                this._quadLayer = WOZLLA.renderer.ILayerManager.DEFAULT;
                this._quadMaterialId = WOZLLA.renderer.IMaterial.DEFAULT;
                this._quadGlobalZ = 0;
                this._quadAlpha = 1;
                this._quadColor = 0xFFFFFF;
                this._quadVertexDirty = true;
                this._quadAlphaDirty = true;
                this._quadColorDirty = true;
                this._textureUpdated = false;
            }
            QuadRenderer.prototype.setQuadRenderRange = function (offset, count) {
                this._quad.setRenderRange(offset, count);
            };
            QuadRenderer.prototype.setQuadGlobalZ = function (globalZ) {
                this._quadGlobalZ = globalZ;
            };
            QuadRenderer.prototype.setQuadLayer = function (layer) {
                this._quadLayer = layer;
            };
            QuadRenderer.prototype.setQuadMaterialId = function (materialId) {
                this._quadMaterialId = materialId;
            };
            QuadRenderer.prototype.setQuadAlpha = function (alpha) {
                this._quadAlpha = alpha;
                this._quadAlphaDirty = true;
            };
            QuadRenderer.prototype.setQuadColor = function (color) {
                this._quadColor = color;
                this._quadColorDirty = true;
            };
            QuadRenderer.prototype.setTexture = function (texture) {
                this._texture = texture;
                this._textureUVS = null;
                this._textureUpdated = true;
            };
            QuadRenderer.prototype.setTextureFrame = function (frame) {
                this._textureFrame = frame;
                this._textureUVS = null;
                this._textureUpdated = true;
            };
            QuadRenderer.prototype.setTextureOffset = function (offset) {
                this._textureOffset = offset;
                this._textureUpdated = true;
            };
            QuadRenderer.prototype.init = function () {
                this._initQuad();
                _super.prototype.init.call(this);
            };
            QuadRenderer.prototype.render = function (renderer, flags) {
                if (!this._texture) {
                    return;
                }
                if ((flags & WOZLLA.GameObject.MASK_TRANSFORM_DIRTY) === WOZLLA.GameObject.MASK_TRANSFORM_DIRTY) {
                    this._quadVertexDirty = true;
                }
                if (this._textureUpdated) {
                    this._updateQuad();
                }
                if (this._quadVertexDirty) {
                    this._updateQuadVertices();
                    this._quadVertexDirty = false;
                }
                if (this._quadAlphaDirty) {
                    this._updateQuadAlpha();
                }
                if (this._quadColorDirty) {
                    this._updateQuadColor();
                }
                renderer.addCommand(QuadCommand.init(this._quadGlobalZ, this._quadLayer, this._texture, this._quadMaterialId, this._quad));
            };
            QuadRenderer.prototype._initQuad = function () {
                this._quad = new WOZLLA.renderer.Quad(1);
            };
            QuadRenderer.prototype._getTextureFrame = function () {
                return this._textureFrame || {
                    x: 0,
                    y: 0,
                    width: this._texture.descriptor.width,
                    height: this._texture.descriptor.height
                };
            };
            QuadRenderer.prototype._getTextureOffset = function () {
                return this._textureOffset || { x: 0, y: 0 };
            };
            QuadRenderer.prototype._getTextureUVS = function () {
                var tw, th, frame, uvs;
                if (this._textureUVS) {
                    return this._textureUVS;
                }
                tw = this._texture.descriptor.width;
                th = this._texture.descriptor.height;
                frame = this._textureFrame || {
                    x: 0,
                    y: 0,
                    width: tw,
                    height: th
                };
                uvs = {};
                uvs.x0 = frame.x / tw;
                uvs.y0 = frame.y / th;
                uvs.x1 = (frame.x + frame.width) / tw;
                uvs.y1 = frame.y / th;
                uvs.x2 = (frame.x + frame.width) / tw;
                uvs.y2 = (frame.y + frame.height) / th;
                uvs.x3 = frame.x / tw;
                uvs.y3 = (frame.y + frame.height) / th;
                this._textureUVS = uvs;
                return uvs;
            };
            QuadRenderer.prototype._updateQuad = function (quadIndex) {
                if (quadIndex === void 0) { quadIndex = 0; }
                this._updateQuadVertices(quadIndex);
                this._updateQuadAlpha(quadIndex);
                this._updateQuadColor(quadIndex);
                this._textureUpdated = false;
            };
            QuadRenderer.prototype._updateQuadVertices = function (quadIndex) {
                if (quadIndex === void 0) { quadIndex = 0; }
                var uvs = this._getTextureUVS();
                var frame = this._getTextureFrame();
                var offset = this._getTextureOffset();
                var matrix = this._gameObject.transform.worldMatrix;
                this._updateQuadVerticesByArgs(uvs, frame, offset, matrix, quadIndex);
                this._quadVertexDirty = false;
            };
            QuadRenderer.prototype._updateQuadVerticesByArgs = function (uvs, frame, offset, matrix, quadIndex) {
                if (quadIndex === void 0) { quadIndex = 0; }
                var a = matrix.values[0];
                var c = matrix.values[1];
                var b = matrix.values[3];
                var d = matrix.values[4];
                var tx = matrix.values[6];
                var ty = matrix.values[7];
                var w1 = -offset.x * frame.width;
                var w0 = w1 + frame.width;
                var h1 = -offset.y * frame.height;
                var h0 = h1 + frame.height;
                var x1 = a * w1 + b * h1 + tx;
                var y1 = d * h1 + c * w1 + ty;
                var x2 = a * w0 + b * h1 + tx;
                var y2 = d * h1 + c * w0 + ty;
                var x3 = a * w0 + b * h0 + tx;
                var y3 = d * h0 + c * w0 + ty;
                var x4 = a * w1 + b * h0 + tx;
                var y4 = d * h0 + c * w1 + ty;
                this._quad.setVertices(x1, y1, x2, y2, x3, y3, x4, y4, quadIndex);
                this._quad.setTexCoords(uvs.x0, uvs.y0, uvs.x1, uvs.y1, uvs.x2, uvs.y2, uvs.x3, uvs.y3, quadIndex);
            };
            QuadRenderer.prototype._clearQuadVertices = function (quadIndex) {
                if (quadIndex === void 0) { quadIndex = 0; }
                this._quad.setVertices(0, 0, 0, 0, 0, 0, 0, 0);
                this._quad.setTexCoords(0, 0, 0, 0, 0, 0, 0, 0);
            };
            QuadRenderer.prototype._updateQuadAlpha = function (quadIndex) {
                if (quadIndex === void 0) { quadIndex = 0; }
                this._quad.setAlpha(this._quadAlpha, quadIndex);
                this._quadAlphaDirty = false;
            };
            QuadRenderer.prototype._updateQuadColor = function (quadIndex) {
                if (quadIndex === void 0) { quadIndex = 0; }
                this._quad.setColor(this._quadColor, quadIndex);
                this._quadColorDirty = false;
            };
            return QuadRenderer;
        })(WOZLLA.Renderer);
        component.QuadRenderer = QuadRenderer;
    })(component = WOZLLA.component || (WOZLLA.component = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="../../core/Mask.ts"/>
/// <reference path="../renderer/QuadRenderer.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var component;
    (function (component) {
        /**
         * @class WOZLLA.component.RectMask
         */
        var RectMask = (function (_super) {
            __extends(RectMask, _super);
            function RectMask() {
                _super.apply(this, arguments);
                this._helperGameObject = new WOZLLA.GameObject();
            }
            Object.defineProperty(RectMask.prototype, "region", {
                get: function () {
                    return this._region;
                },
                set: function (value) {
                    this._region = value;
                    this._helperGameObject.transform.setPosition(value.x, value.y);
                    this._helperGameObject.transform.setScale(value.width, value.height);
                },
                enumerable: true,
                configurable: true
            });
            RectMask.prototype.renderMask = function (renderer, flags) {
                if (this._region) {
                    if (!this._maskQuadRenderer) {
                        this._initMaskQuadRenderer(renderer);
                    }
                    if (this._helperGameObject.transform.dirty) {
                        flags |= WOZLLA.GameObject.MASK_TRANSFORM_DIRTY;
                    }
                    if ((flags & WOZLLA.GameObject.MASK_TRANSFORM_DIRTY) == WOZLLA.GameObject.MASK_TRANSFORM_DIRTY) {
                        this._helperGameObject.transform.transform(this.transform);
                    }
                    this._maskQuadRenderer.setQuadGlobalZ(this._startGlobalZ);
                    this._maskQuadRenderer.render(renderer, flags);
                }
            };
            RectMask.prototype._initMaskQuadRenderer = function (renderer) {
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                canvas.width = 1;
                canvas.height = 1;
                context.fillStyle = '#FFFFFF';
                context.fillRect(0, 0, canvas.width, canvas.height);
                var descriptor = new WOZLLA.assets.HTMLImageDescriptor(canvas);
                var texture = renderer.textureManager.generateTexture(descriptor);
                this._maskQuadRenderer = new WOZLLA.component.QuadRenderer();
                this._maskQuadRenderer.setTexture(texture);
                this._helperGameObject.addComponent(this._maskQuadRenderer);
                this._helperGameObject.init();
            };
            return RectMask;
        })(WOZLLA.Mask);
        component.RectMask = RectMask;
    })(component = WOZLLA.component || (WOZLLA.component = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="../../assets/GLTextureAsset.ts"/>
/// <reference path="QuadRenderer.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var component;
    (function (component) {
        var CanvasRenderer = (function (_super) {
            __extends(CanvasRenderer, _super);
            function CanvasRenderer() {
                _super.apply(this, arguments);
                this._canvasSize = new WOZLLA.math.Size(0, 0);
                this._graphicsDirty = true;
                this._sizeDirty = true;
            }
            Object.defineProperty(CanvasRenderer.prototype, "canvasSize", {
                get: function () {
                    return this._canvasSize;
                },
                set: function (value) {
                    this._canvasSize = value;
                    this._sizeDirty = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CanvasRenderer.prototype, "canvasWidth", {
                get: function () {
                    return this._canvasSize.width;
                },
                set: function (value) {
                    this._canvasSize.width = value;
                    this._sizeDirty = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CanvasRenderer.prototype, "canvasHeight", {
                get: function () {
                    return this._canvasSize.height;
                },
                set: function (value) {
                    this._canvasSize.height = value;
                    this._sizeDirty = true;
                },
                enumerable: true,
                configurable: true
            });
            CanvasRenderer.prototype.destroy = function () {
                this.destroyCanvas();
                _super.prototype.destroy.call(this);
            };
            CanvasRenderer.prototype.draw = function (context) {
                throw new Error('abstract method');
            };
            CanvasRenderer.prototype.render = function (renderer, flags) {
                if (!this._canvas) {
                    this.initCanvas();
                }
                if (!this._canvas) {
                    return;
                }
                if (this._sizeDirty) {
                    this.updateCanvas();
                }
                if (this._graphicsDirty) {
                    this.clearCanvas();
                    this.draw(this._context);
                    this._graphicsDirty = false;
                    this.generateCanvasTexture(renderer);
                }
                if (this._glTexture) {
                    _super.prototype.render.call(this, renderer, flags);
                }
            };
            CanvasRenderer.prototype.clearCanvas = function () {
                this._context.clearRect(0, 0, this._canvasSize.width, this._canvasSize.height);
            };
            CanvasRenderer.prototype.initCanvas = function () {
                if (this._canvasSize.width <= 0 || this._canvasSize.height <= 0) {
                    return;
                }
                this._canvas = document.createElement('canvas');
                this._canvas.width = this._canvasSize.width;
                this._canvas.height = this._canvasSize.height;
                this._context = this._canvas.getContext('2d');
                this._sizeDirty = false;
                this._graphicsDirty = true;
            };
            CanvasRenderer.prototype.updateCanvas = function () {
                if (this._canvasSize.width <= 0 || this._canvasSize.height <= 0) {
                    this.destroyCanvas();
                    this._graphicsDirty = true;
                }
                this._canvas.width = this._canvasSize.width;
                this._canvas.height = this._canvasSize.height;
                this._sizeDirty = false;
                this._graphicsDirty = true;
            };
            CanvasRenderer.prototype.destroyCanvas = function () {
                this._canvas && this._canvas.dispose && this._canvas.dispose();
                this._context && this._context.dispose && this._context.dispose();
                this._canvas = this._context = null;
            };
            CanvasRenderer.prototype.generateCanvasTexture = function (renderer) {
                if (!this._glTexture) {
                    this._glTexture = renderer.textureManager.generateTexture(new WOZLLA.assets.HTMLImageDescriptor(this._canvas));
                    this.setTexture(this._glTexture);
                }
                else {
                    renderer.textureManager.updateTexture(this._glTexture);
                    this.setTexture(this._glTexture);
                }
            };
            return CanvasRenderer;
        })(component.QuadRenderer);
        component.CanvasRenderer = CanvasRenderer;
    })(component = WOZLLA.component || (WOZLLA.component = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="../renderer/CanvasRenderer.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var component;
    (function (component) {
        var PrimitiveRenderer = (function (_super) {
            __extends(PrimitiveRenderer, _super);
            function PrimitiveRenderer() {
                _super.apply(this, arguments);
                this._primitiveStyle = new PrimitiveStyle();
            }
            Object.defineProperty(PrimitiveRenderer.prototype, "primitiveStyle", {
                get: function () {
                    return this._primitiveStyle;
                },
                set: function (value) {
                    this._primitiveStyle = value;
                    this._graphicsDirty = true;
                },
                enumerable: true,
                configurable: true
            });
            PrimitiveRenderer.prototype.render = function (renderer, flags) {
                var size;
                if (this._graphicsDirty || this._primitiveStyle.dirty) {
                    size = this.measurePrimitiveSize();
                    this.canvasWidth = size.width;
                    this.canvasHeight = size.height;
                    this._graphicsDirty = true;
                    this._primitiveStyle.dirty = false;
                }
                _super.prototype.render.call(this, renderer, flags);
            };
            PrimitiveRenderer.prototype.draw = function (context) {
                context.save();
                this.applyPrimitiveStyle(context);
                this.drawPrimitive(context);
                context.restore();
            };
            PrimitiveRenderer.prototype.applyPrimitiveStyle = function (context) {
                if (this._primitiveStyle.stroke) {
                    context.lineWidth = this._primitiveStyle.strokeWidth;
                    context.strokeStyle = this._primitiveStyle.strokeColor;
                }
                if (this._primitiveStyle.fill) {
                    context.fillStyle = this._primitiveStyle.fillColor;
                }
            };
            PrimitiveRenderer.prototype.drawPrimitive = function (context) {
                throw new Error('abstract method');
            };
            PrimitiveRenderer.prototype.measurePrimitiveSize = function () {
                throw new Error('abstract method');
            };
            return PrimitiveRenderer;
        })(component.CanvasRenderer);
        component.PrimitiveRenderer = PrimitiveRenderer;
        var PrimitiveStyle = (function () {
            function PrimitiveStyle() {
                this.dirty = true;
                this._stroke = true;
                this._fill = false;
                this._strokeColor = '#000000';
                this._strokeWidth = 1;
                this._fillColor = '#FFFFFF';
            }
            Object.defineProperty(PrimitiveStyle.prototype, "stroke", {
                get: function () {
                    return this._stroke;
                },
                set: function (value) {
                    if (value === this._stroke)
                        return;
                    this._stroke = value;
                    this.dirty = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PrimitiveStyle.prototype, "strokeColor", {
                get: function () {
                    return this._strokeColor;
                },
                set: function (value) {
                    if (value === this._strokeColor)
                        return;
                    this._strokeColor = value;
                    this.dirty = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PrimitiveStyle.prototype, "strokeWidth", {
                get: function () {
                    return this._strokeWidth;
                },
                set: function (value) {
                    if (value === this._strokeWidth)
                        return;
                    this._strokeWidth = value;
                    this.dirty = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PrimitiveStyle.prototype, "fill", {
                get: function () {
                    return this._fill;
                },
                set: function (value) {
                    if (value === this._fill)
                        return;
                    this._fill = value;
                    this.dirty = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PrimitiveStyle.prototype, "fillColor", {
                get: function () {
                    return this._fillColor;
                },
                set: function (value) {
                    if (value === this._fillColor)
                        return;
                    this._fillColor = value;
                    this.dirty = true;
                },
                enumerable: true,
                configurable: true
            });
            return PrimitiveStyle;
        })();
        component.PrimitiveStyle = PrimitiveStyle;
    })(component = WOZLLA.component || (WOZLLA.component = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="PrimitiveRenderer.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var component;
    (function (component) {
        var CircleRenderer = (function (_super) {
            __extends(CircleRenderer, _super);
            function CircleRenderer() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(CircleRenderer.prototype, "circle", {
                get: function () {
                    return this._circle;
                },
                set: function (value) {
                    this._circle = value;
                    this._graphicsDirty = true;
                },
                enumerable: true,
                configurable: true
            });
            CircleRenderer.prototype.drawPrimitive = function (context) {
                var style = this._primitiveStyle;
                var centerX = this._canvasSize.width / 2;
                var centerY = this._canvasSize.height / 2;
                context.beginPath();
                context.arc(centerX, centerY, this._circle.radius, 0, 2 * Math.PI);
                if (style.stroke) {
                    context.stroke();
                }
                if (style.fill) {
                    context.fill();
                }
            };
            CircleRenderer.prototype.measurePrimitiveSize = function () {
                var style = this._primitiveStyle;
                if (!this._circle) {
                    return {
                        width: 0,
                        height: 0
                    };
                }
                return {
                    width: Math.ceil(this._circle.radius * 2 + (style.stroke ? style.strokeWidth : 0)),
                    height: Math.ceil(this._circle.radius * 2 + (style.stroke ? style.strokeWidth : 0))
                };
            };
            CircleRenderer.prototype.generateCanvasTexture = function (renderer) {
                var offset = {
                    x: this._circle.centerX / this._circle.radius + 0.5,
                    y: this._circle.centerY / this._circle.radius + 0.5
                };
                _super.prototype.generateCanvasTexture.call(this, renderer);
                this.setTextureOffset(offset);
            };
            return CircleRenderer;
        })(component.PrimitiveRenderer);
        component.CircleRenderer = CircleRenderer;
    })(component = WOZLLA.component || (WOZLLA.component = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="PrimitiveRenderer.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var component;
    (function (component) {
        var RectRenderer = (function (_super) {
            __extends(RectRenderer, _super);
            function RectRenderer() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(RectRenderer.prototype, "rect", {
                get: function () {
                    return this._rect;
                },
                set: function (value) {
                    this._rect = value;
                    this._graphicsDirty = true;
                },
                enumerable: true,
                configurable: true
            });
            RectRenderer.prototype.drawPrimitive = function (context) {
                var style = this._primitiveStyle;
                if (style.stroke) {
                    context.rect(style.strokeWidth / 2, style.strokeWidth / 2, this._rect.width, this._rect.height);
                    context.stroke();
                }
                else {
                    context.rect(0, 0, this._rect.width, this._rect.height);
                }
                if (style.fill) {
                    context.fill();
                }
            };
            RectRenderer.prototype.measurePrimitiveSize = function () {
                var style = this._primitiveStyle;
                if (!this._rect) {
                    return {
                        width: 0,
                        height: 0
                    };
                }
                return {
                    width: Math.ceil(this._rect.width + (style.stroke ? style.strokeWidth : 0)),
                    height: Math.ceil(this._rect.height + (style.stroke ? style.strokeWidth : 0))
                };
            };
            RectRenderer.prototype.generateCanvasTexture = function (renderer) {
                var offset = {
                    x: -this._rect.x / this._rect.width,
                    y: -this._rect.y / this._rect.height
                };
                _super.prototype.generateCanvasTexture.call(this, renderer);
                this.setTextureOffset(offset);
            };
            return RectRenderer;
        })(component.PrimitiveRenderer);
        component.RectRenderer = RectRenderer;
    })(component = WOZLLA.component || (WOZLLA.component = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var component;
    (function (component) {
        var PropertyConverter = (function () {
            function PropertyConverter() {
            }
            PropertyConverter.array2rect = function (arr) {
                return new WOZLLA.math.Rectangle(arr[0], arr[1], arr[2], arr[3]);
            };
            PropertyConverter.array2circle = function (arr) {
                return new WOZLLA.math.Circle(arr[0], arr[1], arr[2]);
            };
            PropertyConverter.json2TextStyle = function (json) {
                var style = new component.TextStyle();
                for (var i in json) {
                    style[i] = json[i];
                }
                return style;
            };
            PropertyConverter.array2Padding = function (arr) {
                return new WOZLLA.layout.Padding(arr[0], arr[1], arr[2], arr[3]);
            };
            PropertyConverter.array2Margin = function (arr) {
                return new WOZLLA.layout.Margin(arr[0], arr[1], arr[2], arr[3]);
            };
            return PropertyConverter;
        })();
        component.PropertyConverter = PropertyConverter;
    })(component = WOZLLA.component || (WOZLLA.component = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="QuadRenderer.ts"/>
/// <reference path="../../assets/proxy/SpriteAtlasProxy.ts"/>
/// <reference path="../../assets/Sprite.ts"/>
/// <reference path="../../assets/SpriteAtlas.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var component;
    (function (component) {
        /**
         * @class WOZLLA.component.SpriteRenderer
         */
        var SpriteRenderer = (function (_super) {
            __extends(SpriteRenderer, _super);
            function SpriteRenderer() {
                _super.call(this);
                this._spriteProxy = new WOZLLA.assets.proxy.SpriteAtlasProxy(this);
            }
            Object.defineProperty(SpriteRenderer.prototype, "color", {
                get: function () {
                    return this._quadColor;
                },
                set: function (value) {
                    this.setQuadColor(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpriteRenderer.prototype, "alpha", {
                get: function () {
                    return this._quadAlpha;
                },
                set: function (value) {
                    this.setQuadAlpha(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpriteRenderer.prototype, "materialId", {
                get: function () {
                    return this._quadMaterialId;
                },
                set: function (value) {
                    this.setQuadMaterialId(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpriteRenderer.prototype, "renderLayer", {
                get: function () {
                    return this._quadLayer;
                },
                set: function (value) {
                    this.setQuadLayer(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpriteRenderer.prototype, "renderOrder", {
                get: function () {
                    return this._quadGlobalZ;
                },
                set: function (value) {
                    this.setQuadGlobalZ(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpriteRenderer.prototype, "sprite", {
                get: function () {
                    return this._sprite;
                },
                set: function (sprite) {
                    var oldSprite = this._sprite;
                    if (oldSprite === sprite)
                        return;
                    this._sprite = sprite;
                    if (!sprite) {
                        this.setTexture(null);
                        this.setTextureFrame(null);
                    }
                    else {
                        this.setTextureFrame(sprite.frame);
                        if (!oldSprite || oldSprite.spriteAtlas !== sprite.spriteAtlas) {
                            this.setTexture(sprite.spriteAtlas.glTexture);
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpriteRenderer.prototype, "spriteOffset", {
                get: function () {
                    return this._getTextureOffset();
                },
                set: function (value) {
                    this.setTextureOffset(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpriteRenderer.prototype, "imageSrc", {
                get: function () {
                    return this._spriteAtlasSrc;
                },
                set: function (value) {
                    this.spriteAtlasSrc = value;
                    this.spriteName = null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpriteRenderer.prototype, "spriteAtlasSrc", {
                get: function () {
                    return this._spriteAtlasSrc;
                },
                set: function (value) {
                    this._spriteAtlasSrc = value;
                    this._spriteProxy.setAssetSrc(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpriteRenderer.prototype, "spriteName", {
                get: function () {
                    return this._spriteName;
                },
                set: function (value) {
                    this._spriteName = value;
                    this.sprite = this._spriteProxy.getSprite(value);
                },
                enumerable: true,
                configurable: true
            });
            SpriteRenderer.prototype.destroy = function () {
                this._spriteProxy.onDestroy();
                _super.prototype.destroy.call(this);
            };
            SpriteRenderer.prototype.onAssetLoaded = function (asset) {
                if (asset) {
                    this.sprite = asset.getSprite(this._spriteName);
                }
                else {
                    this.sprite = null;
                }
            };
            SpriteRenderer.prototype.loadAssets = function (callback) {
                this._spriteProxy.loadAsset(callback);
            };
            return SpriteRenderer;
        })(component.QuadRenderer);
        component.SpriteRenderer = SpriteRenderer;
        WOZLLA.Component.register(SpriteRenderer, {
            name: "SpriteRenderer",
            properties: [{
                name: 'color',
                type: 'int',
                defaultValue: 0xFFFFFF
            }, {
                name: 'alpha',
                type: 'int',
                defaultValue: 1
            }, {
                name: 'spriteAtlasSrc',
                type: 'string'
            }, {
                name: 'spriteName',
                type: 'string'
            }, {
                name: 'imageSrc',
                type: 'string'
            }]
        });
    })(component = WOZLLA.component || (WOZLLA.component = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="SpriteRenderer.ts"/>
/// <reference path="../../utils/Tween.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var component;
    (function (component) {
        var AnimationRenderer = (function (_super) {
            __extends(AnimationRenderer, _super);
            function AnimationRenderer() {
                _super.apply(this, arguments);
                this._frameNumDirty = true;
                this._autoOffset = true;
                this._playMode = AnimationRenderer.MODE_NONLOOP;
                this._playing = false;
            }
            Object.defineProperty(AnimationRenderer.prototype, "autoOffset", {
                get: function () {
                    return this._autoOffset;
                },
                set: function (value) {
                    this._autoOffset = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AnimationRenderer.prototype, "frameNum", {
                get: function () {
                    return this._frameNum;
                },
                set: function (value) {
                    var value = Math.floor(value);
                    if (this._frameNum === value)
                        return;
                    this._frameNum = value;
                    this._frameNumDirty = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AnimationRenderer.prototype, "duration", {
                get: function () {
                    return this._duration;
                },
                set: function (value) {
                    this._duration = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AnimationRenderer.prototype, "playMode", {
                get: function () {
                    return this._playMode;
                },
                set: function (value) {
                    this._playMode = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AnimationRenderer.prototype, "frameLength", {
                get: function () {
                    return this._spriteProxy.getFrameLength();
                },
                enumerable: true,
                configurable: true
            });
            AnimationRenderer.prototype.play = function (duration) {
                if (duration === void 0) { duration = this._duration; }
                if (this.frameLength <= 0)
                    return;
                this._duration = duration;
                this._playing = true;
                this._frameNum = 0;
                if (this._playTween) {
                    this._playTween.setPaused(true);
                }
                this._playTween = WOZLLA.utils.Tween.get(this).to({
                    frameNum: this.frameLength
                }, duration);
            };
            AnimationRenderer.prototype.pause = function () {
                if (this._playing) {
                    this._playTween.setPaused(true);
                    this._playing = false;
                }
            };
            AnimationRenderer.prototype.resume = function () {
                if (!this._playing && this._playTween) {
                    this._playTween.setPaused(false);
                    this._playing = true;
                }
            };
            AnimationRenderer.prototype.stop = function () {
                if (this._playing || this._playTween) {
                    this._playTween.setPaused(false);
                    this._playTween = null;
                }
            };
            AnimationRenderer.prototype.render = function (renderer, flags) {
                if (this._frameNumDirty) {
                    this._frameNumDirty = false;
                    this.updateAnimationFrame();
                }
                _super.prototype.render.call(this, renderer, flags);
            };
            AnimationRenderer.prototype.updateAnimationFrame = function () {
                var frame;
                var frameLength = this.frameLength;
                if (frameLength === 0) {
                    this.sprite = null;
                }
                else {
                    if (this._frameNum >= frameLength) {
                        if (this._playMode === AnimationRenderer.MODE_LOOP) {
                            this.play();
                        }
                        else {
                            this._frameNum = frameLength - 1;
                            this.dispatchEvent(new WOZLLA.event.Event('animationend'));
                            this.stop();
                        }
                    }
                    this.sprite = this._spriteProxy.getSprite(this._frameNum);
                    frame = this.sprite.frame;
                    if (this._autoOffset) {
                        this.spriteOffset = {
                            x: -frame.offsetX / frame.width || 0,
                            y: -frame.offsetY / frame.height || 0
                        };
                    }
                    this.dispatchEvent(new WOZLLA.event.Event('framechanged', false, {
                        frame: this._frameNum
                    }));
                }
            };
            AnimationRenderer.MODE_LOOP = 'loop';
            AnimationRenderer.MODE_NONLOOP = 'nonloop';
            return AnimationRenderer;
        })(component.SpriteRenderer);
        component.AnimationRenderer = AnimationRenderer;
    })(component = WOZLLA.component || (WOZLLA.component = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="SpriteRenderer.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var component;
    (function (component) {
        var QuadCommand = WOZLLA.renderer.QuadCommand;
        /**
         * @class WOZLLA.component.NinePatchRenderer
         */
        var NinePatchRenderer = (function (_super) {
            __extends(NinePatchRenderer, _super);
            function NinePatchRenderer() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(NinePatchRenderer.prototype, "renderRegion", {
                get: function () {
                    return this._renderRegion;
                },
                set: function (value) {
                    this._renderRegion = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NinePatchRenderer.prototype, "patch", {
                get: function () {
                    return this._patch;
                },
                set: function (value) {
                    this._patch = value;
                    this._quadVertexDirty = true;
                },
                enumerable: true,
                configurable: true
            });
            NinePatchRenderer.prototype._initQuad = function () {
                this._quad = new WOZLLA.renderer.Quad(9);
            };
            NinePatchRenderer.prototype._updateNinePatchQuads = function () {
                this._updateNinePatchQuadVertices();
                this._updateNinePatchQuadAlpha();
                this._updateNinePatchQuadColor();
                this._textureUpdated = false;
            };
            NinePatchRenderer.prototype._updateNinePatchQuadVertices = function () {
                var transform = new WOZLLA.Transform();
                var frame = this._getTextureFrame();
                var patchUVS;
                var patchOffset = { x: 0, y: 0 };
                var patch = this._patch || new WOZLLA.math.Rectangle(0, 0, frame.width, frame.height);
                var region = this._renderRegion || patch;
                function getPatchUVS(patchFrame, texture) {
                    var tw = texture.descriptor.width;
                    var th = texture.descriptor.height;
                    var patchUVS = {};
                    patchUVS.x0 = patchFrame.x / tw;
                    patchUVS.y0 = patchFrame.y / th;
                    patchUVS.x1 = (patchFrame.x + patchFrame.width) / tw;
                    patchUVS.y1 = patchFrame.y / th;
                    patchUVS.x2 = (patchFrame.x + patchFrame.width) / tw;
                    patchUVS.y2 = (patchFrame.y + patchFrame.height) / th;
                    patchUVS.x3 = patchFrame.x / tw;
                    patchUVS.y3 = (patchFrame.y + patchFrame.height) / th;
                    return patchUVS;
                }
                var patches = [{
                    // left top
                    frame: {
                        x: frame.x,
                        y: frame.y,
                        width: patch.left,
                        height: patch.top
                    },
                    pos: {
                        x: region.x,
                        y: region.y
                    },
                    size: {
                        width: 1,
                        height: 1
                    }
                }, {
                    // left center
                    frame: {
                        x: frame.x + patch.left,
                        y: frame.y,
                        width: patch.width,
                        height: patch.top
                    },
                    pos: {
                        x: region.x + patch.left,
                        y: region.y
                    },
                    size: {
                        width: (region.width - (patch.right - patch.width)) / patch.width,
                        height: 1
                    }
                }, {
                    // right top
                    frame: {
                        x: frame.x + patch.right,
                        y: frame.y,
                        width: frame.width - patch.right,
                        height: patch.top
                    },
                    pos: {
                        x: region.right,
                        y: region.y
                    },
                    size: {
                        width: 1,
                        height: 1
                    }
                }, {
                    // left middle
                    frame: {
                        x: frame.x,
                        y: frame.y + patch.top,
                        width: patch.left,
                        height: patch.height
                    },
                    pos: {
                        x: region.x,
                        y: region.y + patch.top
                    },
                    size: {
                        width: 1,
                        height: (region.height - (patch.bottom - patch.height)) / patch.height
                    }
                }, {
                    // center middle
                    frame: {
                        x: frame.x + patch.left,
                        y: frame.y + patch.top,
                        width: patch.width,
                        height: patch.height
                    },
                    pos: {
                        x: region.x + patch.left,
                        y: region.y + patch.top
                    },
                    size: {
                        width: (region.width - (patch.right - patch.width)) / patch.width,
                        height: (region.height - (patch.bottom - patch.height)) / patch.height
                    }
                }, {
                    // right middle
                    frame: {
                        x: frame.x + patch.right,
                        y: frame.y + patch.top,
                        width: frame.width - patch.right,
                        height: patch.height
                    },
                    pos: {
                        x: region.right,
                        y: region.y + patch.top
                    },
                    size: {
                        width: 1,
                        height: (region.height - (patch.bottom - patch.height)) / patch.height
                    }
                }, {
                    // left bottom
                    frame: {
                        x: frame.x,
                        y: frame.y + patch.bottom,
                        width: frame.width - patch.right,
                        height: frame.height - patch.bottom
                    },
                    pos: {
                        x: region.x,
                        y: region.bottom
                    },
                    size: {
                        width: 1,
                        height: 1
                    }
                }, {
                    // center bottom
                    frame: {
                        x: frame.x + patch.left,
                        y: frame.y + patch.bottom,
                        width: patch.width,
                        height: frame.height - patch.bottom
                    },
                    pos: {
                        x: region.x + patch.left,
                        y: region.bottom
                    },
                    size: {
                        width: (region.width - (patch.right - patch.width)) / patch.width,
                        height: 1
                    }
                }, {
                    // right bottom
                    frame: {
                        x: frame.x + patch.right,
                        y: frame.y + patch.bottom,
                        width: frame.width - patch.right,
                        height: frame.height - patch.bottom
                    },
                    pos: {
                        x: region.right,
                        y: region.bottom
                    },
                    size: {
                        width: 1,
                        height: 1
                    }
                }];
                for (var i = 0, p; i < 9; i++) {
                    p = patches[i];
                    if (p.frame.width > 0 && p.frame.height > 0) {
                        patchUVS = getPatchUVS(p.frame, this._texture);
                        transform.set(this.gameObject.transform);
                        transform.x += p.pos.x;
                        transform.y += p.pos.y;
                        transform.setScale(p.size.width, p.size.height);
                        transform.updateWorldMatrix();
                        this._updateQuadVerticesByArgs(patchUVS, p.frame, patchOffset, transform.worldMatrix, i);
                    }
                    else {
                        this._clearQuadVertices(i);
                    }
                }
                this._quadVertexDirty = false;
            };
            NinePatchRenderer.prototype._updateNinePatchQuadAlpha = function () {
                for (var i = 0; i < 9; i++) {
                    this._updateQuadAlpha(i);
                }
                this._quadAlphaDirty = false;
            };
            NinePatchRenderer.prototype._updateNinePatchQuadColor = function () {
                for (var i = 0; i < 9; i++) {
                    this._updateQuadColor(i);
                }
                this._quadColorDirty = false;
            };
            NinePatchRenderer.prototype.render = function (renderer, flags) {
                if (!this._texture) {
                    return;
                }
                if ((flags & WOZLLA.GameObject.MASK_TRANSFORM_DIRTY) === WOZLLA.GameObject.MASK_TRANSFORM_DIRTY) {
                    this._quadVertexDirty = true;
                }
                if (this._textureUpdated) {
                    this._updateNinePatchQuads();
                }
                if (this._quadVertexDirty) {
                    this._updateNinePatchQuadVertices();
                    this._quadVertexDirty = false;
                }
                if (this._quadAlphaDirty) {
                    this._updateNinePatchQuadAlpha();
                }
                if (this._quadColorDirty) {
                    this._updateNinePatchQuadColor();
                }
                renderer.addCommand(QuadCommand.init(this._quadGlobalZ, this._quadLayer, this._texture, this._quadMaterialId, this._quad));
            };
            return NinePatchRenderer;
        })(component.SpriteRenderer);
        component.NinePatchRenderer = NinePatchRenderer;
        WOZLLA.Component.register(NinePatchRenderer, {
            name: "NinePatchRenderer",
            properties: [
                WOZLLA.Component.extendConfig(component.SpriteRenderer),
                {
                    name: 'patch',
                    type: 'rect',
                    defaultValue: [0, 0, 0, 0],
                    convert: component.PropertyConverter.array2rect
                },
                {
                    name: 'renderRegion',
                    type: 'rect',
                    defaultValue: [0, 0, 0, 0],
                    convert: component.PropertyConverter.array2rect
                }
            ]
        });
    })(component = WOZLLA.component || (WOZLLA.component = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="../renderer/CanvasRenderer.ts"/>
/// <reference path="../PropertyConverter.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var component;
    (function (component) {
        var helpCanvas = document.createElement('canvas');
        helpCanvas.width = 1;
        helpCanvas.height = 1;
        var helpContext = helpCanvas.getContext('2d');
        var TextRenderer = (function (_super) {
            __extends(TextRenderer, _super);
            function TextRenderer() {
                _super.apply(this, arguments);
                this._textDirty = true;
                this._textStyle = new TextStyle();
            }
            TextRenderer.measureText = function (style, text) {
                var measuredWidth, measuredHeight;
                var extendSize;
                helpContext.font = style.font;
                measuredWidth = Math.ceil(helpContext.measureText(text).width);
                measuredHeight = Math.ceil(helpContext.measureText("M").width * 1.2);
                if (style.shadow || style.stroke) {
                    extendSize = Math.max(style.strokeWidth, Math.abs(style.shadowOffsetX), Math.abs(style.shadowOffsetY));
                    measuredWidth += extendSize * 2;
                    measuredHeight += extendSize * 2 + 4;
                }
                measuredWidth = Math.ceil(measuredWidth);
                measuredHeight = Math.ceil(measuredHeight);
                if (measuredWidth % 2 !== 0) {
                    measuredWidth += 1;
                }
                if (measuredHeight % 2 !== 0) {
                    measuredHeight += 1;
                }
                return {
                    width: measuredWidth,
                    height: measuredHeight
                };
            };
            Object.defineProperty(TextRenderer.prototype, "text", {
                get: function () {
                    return this._text;
                },
                set: function (value) {
                    if (typeof value !== 'string') {
                        value = value + '';
                    }
                    if (value === this._text)
                        return;
                    this._text = value;
                    this._textDirty = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextRenderer.prototype, "textStyle", {
                get: function () {
                    return this._textStyle;
                },
                set: function (value) {
                    this._textStyle = value;
                    this._textDirty = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextRenderer.prototype, "textWidth", {
                get: function () {
                    return this._canvasSize.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextRenderer.prototype, "textHeight", {
                get: function () {
                    return this._canvasSize.height;
                },
                enumerable: true,
                configurable: true
            });
            TextRenderer.prototype.render = function (renderer, flags) {
                var size;
                if (this._textDirty || this._textStyle.dirty) {
                    size = this.measureTextSize();
                    this.canvasWidth = size.width;
                    this.canvasHeight = size.height;
                    this._textStyle.dirty = false;
                    this._textDirty = false;
                    this._graphicsDirty = true;
                }
                _super.prototype.render.call(this, renderer, flags);
            };
            TextRenderer.prototype.draw = function (context) {
                this.drawText(context, this._canvasSize.width, this._canvasSize.height);
            };
            TextRenderer.prototype.drawText = function (context, measuredWidth, measuredHeight) {
                context.save();
                context.font = this._textStyle.font;
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                if (this._textStyle.shadow && (this._textStyle.shadowOffsetX > 0 || this._textStyle.shadowOffsetY > 0)) {
                    context.fillStyle = this._textStyle.shadowColor;
                    context.fillText(this._text, measuredWidth / 2 + this._textStyle.shadowOffsetX, measuredHeight / 2 + this._textStyle.shadowOffsetY);
                }
                if (this._textStyle.stroke && this._textStyle.strokeWidth > 0) {
                    context.strokeStyle = this._textStyle.strokeColor;
                    context.lineWidth = this._textStyle.strokeWidth;
                    context.strokeText(this._text, measuredWidth / 2, measuredHeight / 2);
                }
                context.fillStyle = this._textStyle.color;
                context.fillText(this._text, measuredWidth / 2, measuredHeight / 2);
                context.restore();
            };
            TextRenderer.prototype.measureTextSize = function () {
                var measureSize;
                if (!this._text) {
                    measureSize = {
                        width: 0,
                        height: 0
                    };
                }
                else {
                    measureSize = TextRenderer.measureText(this._textStyle, this._text);
                }
                return measureSize;
            };
            TextRenderer.prototype.generateCanvasTexture = function (renderer) {
                var offset = { x: 0, y: 0 };
                _super.prototype.generateCanvasTexture.call(this, renderer);
                if (this._textStyle.align === TextStyle.CENTER) {
                    offset.x = 0.5;
                }
                else if (this._textStyle.align === TextStyle.END) {
                    offset.x = 1;
                }
                if (this._textStyle.baseline === TextStyle.MIDDLE) {
                    offset.y = 0.5;
                }
                else if (this._textStyle.baseline === TextStyle.BOTTOM) {
                    offset.y = 1;
                }
                this.setTextureOffset(offset);
            };
            return TextRenderer;
        })(component.CanvasRenderer);
        component.TextRenderer = TextRenderer;
        var TextStyle = (function () {
            function TextStyle() {
                this.dirty = true;
                this._font = 'normal 24px Arial';
                this._color = '#000000';
                this._shadow = false;
                this._shadowColor = '#000000';
                this._shadowOffsetX = 0;
                this._shadowOffsetY = 0;
                this._stroke = false;
                this._strokeColor = '#000000';
                this._strokeWidth = 0;
                this._align = TextStyle.START;
                this._baseline = TextStyle.TOP;
            }
            Object.defineProperty(TextStyle.prototype, "font", {
                get: function () {
                    return this._font;
                },
                set: function (value) {
                    if (value === this._font)
                        return;
                    this._font = value;
                    this.dirty = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextStyle.prototype, "color", {
                get: function () {
                    return this._color;
                },
                set: function (value) {
                    if (value === this._color)
                        return;
                    this._color = value;
                    this.dirty = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextStyle.prototype, "shadow", {
                get: function () {
                    return this._shadow;
                },
                set: function (value) {
                    if (value === this._shadow)
                        return;
                    this._shadow = value;
                    this.dirty = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextStyle.prototype, "shadowColor", {
                get: function () {
                    return this._shadowColor;
                },
                set: function (value) {
                    this._shadowColor = value;
                    this.dirty = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextStyle.prototype, "shadowOffsetX", {
                get: function () {
                    return this._shadowOffsetX;
                },
                set: function (value) {
                    if (value === this._shadowOffsetX)
                        return;
                    this._shadowOffsetX = value;
                    this.dirty = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextStyle.prototype, "shadowOffsetY", {
                get: function () {
                    return this._shadowOffsetY;
                },
                set: function (value) {
                    if (value === this._shadowOffsetY)
                        return;
                    this._shadowOffsetY = value;
                    this.dirty = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextStyle.prototype, "stroke", {
                get: function () {
                    return this._stroke;
                },
                set: function (value) {
                    if (value === this._stroke)
                        return;
                    this._stroke = value;
                    this.dirty = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextStyle.prototype, "strokeColor", {
                get: function () {
                    return this._strokeColor;
                },
                set: function (value) {
                    if (value === this._strokeColor)
                        return;
                    this._strokeColor = value;
                    this.dirty = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextStyle.prototype, "strokeWidth", {
                get: function () {
                    return this._strokeWidth;
                },
                set: function (value) {
                    if (value === this._strokeWidth)
                        return;
                    this._strokeWidth = value;
                    this.dirty = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextStyle.prototype, "align", {
                get: function () {
                    return this._align;
                },
                set: function (value) {
                    if (value === this._align)
                        return;
                    this._align = value;
                    this.dirty = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextStyle.prototype, "baseline", {
                get: function () {
                    return this._baseline;
                },
                set: function (value) {
                    if (value === this._baseline)
                        return;
                    this._baseline = value;
                    this.dirty = true;
                },
                enumerable: true,
                configurable: true
            });
            TextStyle.START = 'start';
            TextStyle.CENTER = 'center';
            TextStyle.END = 'end';
            TextStyle.TOP = 'top';
            TextStyle.MIDDLE = 'middle';
            TextStyle.BOTTOM = 'bottom';
            return TextStyle;
        })();
        component.TextStyle = TextStyle;
        WOZLLA.Component.register(TextRenderer, {
            name: 'TextRenderer',
            properties: [{
                name: 'text',
                type: 'string'
            }, {
                name: 'style',
                type: 'object',
                convert: component.PropertyConverter.json2TextStyle,
                editor: 'textStyle'
            }]
        });
    })(component = WOZLLA.component || (WOZLLA.component = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="Component.ts"/>
var WOZLLA;
(function (WOZLLA) {
    /**
     * Abstract base class for all behaviours, the {@link WOZLLA.Behaviour#update} function would be call
     * by WOZLLA engine every frame when the gameObject is actived and the property enabled of this behaviour is true
     * @class WOZLLA.Behaviour
     * @extends WOZLLA.Component
     * @abstract
     */
    var Behaviour = (function (_super) {
        __extends(Behaviour, _super);
        function Behaviour() {
            _super.apply(this, arguments);
            /**
             * enabled or disabled this behaviour
             * @property {boolean} [enabled=true]
             */
            this.enabled = true;
        }
        /**
         * call by Engine every frame
         * @method update
         */
        Behaviour.prototype.update = function () {
        };
        return Behaviour;
    })(WOZLLA.Component);
    WOZLLA.Behaviour = Behaviour;
})(WOZLLA || (WOZLLA = {}));
/// <reference path="../event/Event.ts"/>
var WOZLLA;
(function (WOZLLA) {
    /**
     * internal class
     * @class WOZLLA.CoreEvent
     * @extends WOZLLA.event.Event
     */
    var CoreEvent = (function (_super) {
        __extends(CoreEvent, _super);
        /**
         * new a CoreEvent
         * @method constructor
         * @param type
         * @param bubbles
         * @param data
         * @param canStopBubbles
         */
        function CoreEvent(type, bubbles, data, canStopBubbles) {
            if (bubbles === void 0) { bubbles = false; }
            if (data === void 0) { data = null; }
            if (canStopBubbles === void 0) { canStopBubbles = true; }
            _super.call(this, type, bubbles, data, canStopBubbles);
        }
        return CoreEvent;
    })(WOZLLA.event.Event);
    WOZLLA.CoreEvent = CoreEvent;
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var jsonx;
    (function (jsonx) {
        function emptyCallback(root, done) {
            done();
        }
        // reference: @src#asGameObject
        var JSONXBuilder = (function () {
            function JSONXBuilder() {
                this.doLoad = false;
                this.doInit = false;
                this.async = true;
                this.uuidMap = {};
            }
            JSONXBuilder.create = function () {
                if (JSONXBuilder.Factory) {
                    return (new (JSONXBuilder.Factory)());
                }
                return new JSONXBuilder();
            };
            JSONXBuilder.prototype.getByUUID = function (uuid) {
                return this.uuidMap[uuid];
            };
            JSONXBuilder.prototype.setSync = function () {
                this.async = false;
            };
            JSONXBuilder.prototype.instantiateWithSrc = function (src, callback) {
                if (callback === void 0) { callback = emptyCallback; }
                this.src = src;
                this.newCallback = callback;
                return this;
            };
            JSONXBuilder.prototype.instantiateWithJSON = function (data, callback) {
                if (callback === void 0) { callback = emptyCallback; }
                this.data = data;
                this.newCallback = callback;
                return this;
            };
            JSONXBuilder.prototype.load = function (callback) {
                if (callback === void 0) { callback = emptyCallback; }
                this.doLoad = true;
                this.loadCallback = callback;
                return this;
            };
            JSONXBuilder.prototype.init = function () {
                if (this.doLoad) {
                    this.doInit = true;
                }
                else {
                    this.err = 'JSONXBuilder: init must after load';
                }
                return this;
            };
            JSONXBuilder.prototype.build = function (callback) {
                var _this = this;
                this._loadJSONData(function () {
                    if (_this._checkError(callback))
                        return;
                    _this._newGameObjectTree(function () {
                        if (_this._checkError(callback))
                            return;
                        if (!_this.doLoad) {
                            callback(_this.err, _this.root);
                            return;
                        }
                        _this.newCallback(_this.root, function () {
                            _this._loadAssets(function () {
                                if (_this._checkError(callback))
                                    return;
                                if (!_this.doInit) {
                                    callback(_this.err, _this.root);
                                    return;
                                }
                                _this._init();
                                callback(_this.err, _this.root);
                            });
                        });
                    });
                });
            };
            JSONXBuilder.prototype._checkError = function (callback) {
                if (this.err) {
                    callback(this.err, null);
                    return true;
                }
                return false;
            };
            JSONXBuilder.prototype._loadJSONData = function (callback) {
                var _this = this;
                if (this.src && !this.data) {
                    WOZLLA.utils.Ajax.request({
                        url: WOZLLA.Director.getInstance().assetLoader.getBaseDir() + '/' + this.src,
                        dataType: 'json',
                        async: this.async,
                        withCredentials: true,
                        success: function (data) {
                            _this.data = data;
                            callback && callback();
                        },
                        error: function (err) {
                            _this.err = err;
                            callback && callback();
                        }
                    });
                }
                else {
                    callback && callback();
                }
            };
            JSONXBuilder.prototype._newGameObjectTree = function (callback) {
                var _this = this;
                this._newGameObject(this.data.root, function (root) {
                    _this.root = root;
                    callback && callback();
                });
            };
            JSONXBuilder.prototype._newGameObject = function (data, callback) {
                var _this = this;
                var gameObj = new WOZLLA.GameObject(data.rect);
                gameObj._uuid = data.uuid;
                this.uuidMap[data.uuid] = gameObj;
                gameObj.id = data.id;
                gameObj.name = data.name;
                gameObj.active = data.active;
                gameObj.visible = data.visible;
                gameObj.touchable = data.touchable;
                gameObj.transform.set(data.transform);
                var components = data.components;
                if (components && components.length > 0) {
                    components.forEach(function (compData) {
                        gameObj.addComponent(_this._newComponent(compData, gameObj));
                    });
                }
                var createdChildCount = 0;
                var children = data.children;
                if (!children || children.length === 0) {
                    callback(gameObj);
                    return;
                }
                children.forEach(function (childData) {
                    if (childData.reference) {
                        _this._newReferenceObject(childData, function (child) {
                            if (child) {
                                gameObj.addChild(child);
                            }
                            createdChildCount++;
                            if (createdChildCount === children.length) {
                                callback(gameObj);
                            }
                        });
                    }
                    else {
                        _this._newGameObject(childData, function (child) {
                            gameObj.addChild(child);
                            createdChildCount++;
                            if (createdChildCount === children.length) {
                                callback(gameObj);
                            }
                        });
                    }
                });
            };
            JSONXBuilder.prototype._newReferenceObject = function (data, callback) {
                var _this = this;
                var builder = new JSONXBuilder();
                builder.instantiateWithSrc(data.reference).build(function (err, root) {
                    if (err) {
                        _this.err = err;
                    }
                    else if (root) {
                        root._uuid = data.uuid;
                        _this.uuidMap[data.uuid] = root;
                        root.name = data.name;
                        root.id = data.id;
                        root.active = data.active;
                        root.visible = data.visible;
                        root.touchable = data.touchable;
                        root.transform.set(data.transform);
                    }
                    callback(root);
                });
            };
            JSONXBuilder.prototype._newComponent = function (compData, gameObj) {
                var component = WOZLLA.Component.create(compData.name);
                var config = WOZLLA.Component.getConfig(compData.name);
                component._uuid = compData.uuid;
                this.uuidMap[compData.uuid] = component;
                component.gameObject = gameObj;
                this._applyComponentProperties(component, config.properties, compData);
                return component;
            };
            JSONXBuilder.prototype._applyComponentProperties = function (component, properties, compData) {
                var _this = this;
                if (properties && properties.length > 0) {
                    properties.forEach(function (prop) {
                        if (prop.group) {
                            _this._applyComponentProperties(component, prop.properties, compData);
                        }
                        else if (prop.extend) {
                            var config = WOZLLA.Component.getConfig(prop.extend);
                            if (config) {
                                _this._applyComponentProperties(component, config.properties, compData);
                            }
                        }
                        else {
                            var value = compData.properties[prop.name];
                            value = value == void 0 ? prop.defaultValue : value;
                            if (prop.convert && value) {
                                value = prop.convert(value);
                            }
                            component[prop.name] = value;
                        }
                    });
                }
            };
            JSONXBuilder.prototype._loadAssets = function (callback) {
                this.root.loadAssets(callback);
            };
            JSONXBuilder.prototype._init = function () {
                this.root.init();
            };
            return JSONXBuilder;
        })();
        jsonx.JSONXBuilder = JSONXBuilder;
    })(jsonx = WOZLLA.jsonx || (WOZLLA.jsonx = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var layout;
    (function (layout) {
        var LayoutBase = (function (_super) {
            __extends(LayoutBase, _super);
            function LayoutBase() {
                _super.apply(this, arguments);
                this._layoutRequired = true;
            }
            LayoutBase.prototype.init = function () {
                _super.prototype.init.call(this);
                this.gameObject.addListenerScope('childadd', this.onChildAdd, this);
                this.gameObject.addListenerScope('childremove', this.onChildRemove, this);
                this.requestLayout();
            };
            LayoutBase.prototype.destroy = function () {
                this.gameObject.removeListenerScope('childadd', this.onChildAdd, this);
                this.gameObject.removeListenerScope('childremove', this.onChildRemove, this);
                _super.prototype.destroy.call(this);
            };
            LayoutBase.prototype.doLayout = function () {
            };
            LayoutBase.prototype.requestLayout = function () {
                this._layoutRequired = true;
            };
            LayoutBase.prototype.update = function () {
                if (this._layoutRequired) {
                    this._layoutRequired = false;
                    this.doLayout();
                }
            };
            LayoutBase.prototype.onChildAdd = function (e) {
                this.requestLayout();
            };
            LayoutBase.prototype.onChildRemove = function (e) {
                alert('remove');
                this.requestLayout();
            };
            return LayoutBase;
        })(WOZLLA.Behaviour);
        layout.LayoutBase = LayoutBase;
    })(layout = WOZLLA.layout || (WOZLLA.layout = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var math;
    (function (math) {
        /**
         * @class WOZLLA.math.Size
         * a util class contains width and height properties
         */
        var Size = (function () {
            /**
             * @method constructor
             * create a new instance of Size
             * @member WOZLLA.math.Size
             * @param {number} width
             * @param {number} height
             */
            function Size(width, height) {
                /**
                 * @property {number} width
                 * get or set width of this object
                 * @member WOZLLA.math.Size
                 */
                this.width = width;
                /**
                 * @property {number} height
                 * get or set height of this object
                 * @member WOZLLA.math.Size
                 */
                this.height = height;
            }
            /**
             * get simple description of this object
             * @returns {string}
             */
            Size.prototype.toString = function () {
                return 'Size[' + this.width + ',' + this.height + ']';
            };
            return Size;
        })();
        math.Size = Size;
    })(math = WOZLLA.math || (WOZLLA.math = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="LayoutBase.ts"/>
/// <reference path="../math/Size.ts"/>
/// <reference path="../component/PropertyConverter.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var layout;
    (function (layout) {
        var helpSize = new WOZLLA.math.Size(0, 0);
        var Grid = (function (_super) {
            __extends(Grid, _super);
            function Grid() {
                _super.apply(this, arguments);
            }
            Grid.prototype.listRequiredComponents = function () {
                return [WOZLLA.RectTransform];
            };
            Object.defineProperty(Grid.prototype, "padding", {
                get: function () {
                    return this._padding;
                },
                set: function (padding) {
                    if (this._padding && this._padding.equals(padding))
                        return;
                    this._padding = padding;
                    this.requestLayout();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Grid.prototype, "itemMargin", {
                get: function () {
                    return this._itemMargin;
                },
                set: function (margin) {
                    if (this._itemMargin && this._itemMargin.equals(margin))
                        return;
                    this._itemMargin = margin;
                    this.requestLayout();
                },
                enumerable: true,
                configurable: true
            });
            Grid.prototype.doLayout = function () {
                var padding = this._padding;
                var margin = this._itemMargin;
                var children = this.gameObject.rawChildren;
                var col = 0;
                var row = 0;
                var rowHeight = 0;
                var x = padding.left;
                var y = padding.top;
                var child;
                var rect = this.gameObject.rectTransform;
                for (var i = 0, len = children.length; i < len; i++) {
                    child = children[i];
                    this.measureChildSize(child, i, helpSize);
                    // measure x, y
                    x += margin.left;
                    y += margin.top;
                    // resolve new row
                    if (x + helpSize.width + margin.right + padding.right > rect.width) {
                        row++;
                        col = 0;
                        y += margin.bottom;
                        y += helpSize.height;
                        x = padding.left + margin.left;
                    }
                    // apply position
                    if (child.rectTransform) {
                        child.rectTransform.px = x;
                        child.rectTransform.py = y;
                    }
                    else {
                        child.transform.x = x;
                        child.transform.y = y;
                    }
                    // determine row height
                    if (helpSize.height > rowHeight) {
                        rowHeight = helpSize.height;
                    }
                    // grow col num
                    x += margin.right + helpSize.width;
                    col++;
                }
            };
            Grid.prototype.measureChildSize = function (child, idx, size) {
                var rectTransform = child.rectTransform;
                if (!rectTransform) {
                    size.height = size.width = 0;
                }
                else {
                    size.width = rectTransform.width;
                    size.height = rectTransform.height;
                }
            };
            return Grid;
        })(layout.LayoutBase);
        layout.Grid = Grid;
        WOZLLA.Component.register(Grid, {
            name: 'Grid',
            properties: [{
                name: 'padding',
                type: 'Padding',
                convert: WOZLLA.component.PropertyConverter.array2Padding,
                defaultValue: [0, 0, 0, 0]
            }, {
                name: 'itemMargin',
                type: 'Margin',
                convert: WOZLLA.component.PropertyConverter.array2Margin,
                defaultValue: [0, 0, 0, 0]
            }]
        });
    })(layout = WOZLLA.layout || (WOZLLA.layout = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var layout;
    (function (layout) {
        var Margin = (function () {
            function Margin(top, left, bottom, right) {
                this.top = top;
                this.left = left;
                this.bottom = bottom;
                this.right = right;
            }
            Margin.prototype.equals = function (padding) {
                return this.top === padding.top && this.bottom === padding.bottom && this.right === padding.right && this.left === padding.left;
            };
            return Margin;
        })();
        layout.Margin = Margin;
    })(layout = WOZLLA.layout || (WOZLLA.layout = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var layout;
    (function (layout) {
        var Padding = (function () {
            function Padding(top, left, bottom, right) {
                this.top = top;
                this.left = left;
                this.bottom = bottom;
                this.right = right;
            }
            Padding.prototype.equals = function (padding) {
                return this.top === padding.top && this.bottom === padding.bottom && this.right === padding.right && this.left === padding.left;
            };
            return Padding;
        })();
        layout.Padding = Padding;
    })(layout = WOZLLA.layout || (WOZLLA.layout = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="LayoutBase.ts"/>
/// <reference path="../component/PropertyConverter.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var layout;
    (function (layout) {
        var VBox = (function (_super) {
            __extends(VBox, _super);
            function VBox() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(VBox.prototype, "padding", {
                get: function () {
                    return this._padding;
                },
                set: function (padding) {
                    if (this._padding && this._padding.equals(padding))
                        return;
                    this._padding = padding;
                    this.requestLayout();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(VBox.prototype, "itemMargin", {
                get: function () {
                    return this._itemMargin;
                },
                set: function (margin) {
                    if (this._itemMargin === margin)
                        return;
                    this._itemMargin = margin;
                    this.requestLayout();
                },
                enumerable: true,
                configurable: true
            });
            VBox.prototype.doLayout = function () {
                var _this = this;
                var padding = this._padding;
                var y = padding.top;
                this.gameObject.eachChild(function (child, idx) {
                    var rectTransform = child.rectTransform;
                    if (!rectTransform) {
                        child.transform.x = padding.left;
                        child.transform.y = y;
                    }
                    else {
                        rectTransform.anchorMode = WOZLLA.RectTransform.ANCHOR_LEFT | WOZLLA.RectTransform.ANCHOR_TOP;
                        rectTransform.px = padding.left;
                        rectTransform.py = y;
                    }
                    y += _this._itemMargin + _this.measureChildHeight(child, idx);
                });
            };
            VBox.prototype.measureChildHeight = function (child, idx) {
                var rectTransform = child.rectTransform;
                if (!rectTransform) {
                    return 0;
                }
                else {
                    return rectTransform.height;
                }
            };
            return VBox;
        })(layout.LayoutBase);
        layout.VBox = VBox;
        WOZLLA.Component.register(VBox, {
            name: 'VBox',
            properties: [{
                name: 'padding',
                type: 'Padding',
                convert: WOZLLA.component.PropertyConverter.array2Padding,
                defaultValue: [0, 0, 0, 0]
            }, {
                name: 'itemMargin',
                type: 'int',
                defaultValue: 0
            }]
        });
    })(layout = WOZLLA.layout || (WOZLLA.layout = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var math;
    (function (math) {
        /**
         * @class WOZLLA.math.Circle
         * a util class for circle
         */
        var Circle = (function () {
            function Circle(centerX, centerY, radius) {
                /**
                 * get or set centerX
                 * @property {number} centerX
                 */
                this.centerX = centerX;
                /**
                 * get or set centerY
                 * @property {number} centerY
                 */
                this.centerY = centerY;
                /**
                 * get or set radius
                 * @property {number} radius
                 */
                this.radius = radius;
            }
            /**
             * @method containsXY
             * @param x
             * @param y
             * @returns {boolean}
             */
            Circle.prototype.containsXY = function (x, y) {
                return Math.pow((x - this.centerX), 2) + Math.pow((y - this.centerY), 2) <= this.radius;
            };
            /**
             * get simple description of this object
             * @returns {string}
             */
            Circle.prototype.toString = function () {
                return 'Circle[' + this.centerX + ',' + this.centerY + ',' + this.radius + ']';
            };
            return Circle;
        })();
        math.Circle = Circle;
    })(math = WOZLLA.math || (WOZLLA.math = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var math;
    (function (math) {
        var MathUtils;
        (function (MathUtils) {
            function rectIntersect(a, b) {
                return a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
            }
            MathUtils.rectIntersect = rectIntersect;
            function rectIntersect2(ax, ay, aw, ah, bx, by, bw, bh) {
                return ax <= bx + bw && bx <= ax + aw && ay <= by + bh && by <= ay + ah;
            }
            MathUtils.rectIntersect2 = rectIntersect2;
        })(MathUtils = math.MathUtils || (math.MathUtils = {}));
    })(math = WOZLLA.math || (WOZLLA.math = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var renderer;
    (function (renderer) {
        var IMaterialManager;
        (function (IMaterialManager) {
            /**
             * @property DOC
             * @readonly
             * @static
             * @member WOZLLA.renderer.IMaterialManager
             */
            IMaterialManager.DOC = 'DOC';
        })(IMaterialManager = renderer.IMaterialManager || (renderer.IMaterialManager = {}));
    })(renderer = WOZLLA.renderer || (WOZLLA.renderer = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var renderer;
    (function (renderer) {
        var IShaderManager;
        (function (IShaderManager) {
            /**
             * @property DOC
             * @readonly
             * @static
             * @member WOZLLA.renderer.IShaderManager
             */
            IShaderManager.DOC = 'DOC';
        })(IShaderManager = renderer.IShaderManager || (renderer.IShaderManager = {}));
    })(renderer = WOZLLA.renderer || (WOZLLA.renderer = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var renderer;
    (function (renderer) {
        /**
         * @enum WOZLLA.renderer.TextureFormat
         */
        (function (TextureFormat) {
            /** @property {number} [PNG] */
            TextureFormat[TextureFormat["PNG"] = 0] = "PNG";
            /** @property {number} [JPEG] */
            TextureFormat[TextureFormat["JPEG"] = 1] = "JPEG";
            /** @property {number} [PVR] */
            TextureFormat[TextureFormat["PVR"] = 2] = "PVR";
        })(renderer.TextureFormat || (renderer.TextureFormat = {}));
        var TextureFormat = renderer.TextureFormat;
        /**
         * @enum WOZLLA.renderer.PixelFormat
         */
        (function (PixelFormat) {
            /** @property {number} [RPGA8888] */
            PixelFormat[PixelFormat["RGBA8888"] = 0] = "RGBA8888";
            /** @property {number} [RGBA4444] */
            PixelFormat[PixelFormat["RGBA4444"] = 1] = "RGBA4444";
            /** @property {number} [RGB888] */
            PixelFormat[PixelFormat["RGB888"] = 2] = "RGB888";
            /** @property {number} [RGB565] */
            PixelFormat[PixelFormat["RGB565"] = 3] = "RGB565";
            /** @property {number} [PVRTC4] */
            PixelFormat[PixelFormat["PVRTC4"] = 4] = "PVRTC4";
            /** @property {number} [PVRTC2] */
            PixelFormat[PixelFormat["PVRTC2"] = 5] = "PVRTC2";
        })(renderer.PixelFormat || (renderer.PixelFormat = {}));
        var PixelFormat = renderer.PixelFormat;
    })(renderer = WOZLLA.renderer || (WOZLLA.renderer = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var renderer;
    (function (renderer) {
        var ITextureManager;
        (function (ITextureManager) {
            /**
             * @property DOC
             * @readonly
             * @static
             * @member WOZLLA.renderer.ITextureManager
             */
            ITextureManager.DOC = 'DOC';
        })(ITextureManager = renderer.ITextureManager || (renderer.ITextureManager = {}));
    })(renderer = WOZLLA.renderer || (WOZLLA.renderer = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var renderer;
    (function (renderer) {
        /**
         * @class WOZLLA.renderer.WebGLExtension
         */
        var WebGLExtension = (function () {
            function WebGLExtension() {
            }
            WebGLExtension.getExtension = function (gl, extName, doThrow) {
                if (doThrow === void 0) { doThrow = true; }
                var ext = gl.getExtension(extName) || gl.getExtension(gl, WebGLExtension.VENDOR_WEBKIT + extName);
                if (ext != null) {
                    return ext;
                }
                else if (doThrow) {
                    throw new Error('Unsupported extension: ' + extName);
                }
            };
            WebGLExtension.VENDOR_WEBKIT = 'WEBKIT_';
            WebGLExtension.PVRTC = 'WEBGL_compressed_texture_pvrtc';
            WebGLExtension.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02;
            WebGLExtension.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03;
            return WebGLExtension;
        })();
        renderer.WebGLExtension = WebGLExtension;
    })(renderer = WOZLLA.renderer || (WOZLLA.renderer = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="Assert.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var utils;
    (function (utils) {
        var StateMachine = (function (_super) {
            __extends(StateMachine, _super);
            function StateMachine() {
                _super.apply(this, arguments);
                this._stateConfig = {};
            }
            StateMachine.prototype.defineState = function (name, isDefault) {
                if (isDefault === void 0) { isDefault = false; }
                WOZLLA.Assert.isUndefined(this._stateConfig[name], 'state "' + name + '" has been defined');
                this._stateConfig[name] = {
                    data: {}
                };
                if (isDefault) {
                    this._defaultState = name;
                }
            };
            StateMachine.prototype.getStateData = function (state, key) {
                WOZLLA.Assert.isNotUndefined(this._stateConfig[state], 'state "' + state + '" not defined');
                return this._stateConfig[state].data[key];
            };
            StateMachine.prototype.setStateData = function (state, key, data) {
                WOZLLA.Assert.isNotUndefined(this._stateConfig[state], 'state "' + state + '" not defined');
                this._stateConfig[state].data[key] = data;
            };
            StateMachine.prototype.defineTransition = function (fromState, toState, transition) {
                WOZLLA.Assert.isNotUndefined(this._stateConfig[fromState], 'state "' + fromState + '" not defined');
                WOZLLA.Assert.isNotUndefined(this._stateConfig[toState], 'state "' + toState + '" not defined');
                this._stateConfig[fromState][toState] = transition;
            };
            StateMachine.prototype.init = function () {
                this._currentState = this._defaultState;
                this.dispatchEvent(new WOZLLA.event.Event(StateMachine.INIT, false, new StateEventData(this._currentState)));
            };
            StateMachine.prototype.getCurrentState = function () {
                return this._currentState;
            };
            StateMachine.prototype.changeState = function (state) {
                var _this = this;
                var from, to, transition;
                WOZLLA.Assert.isNotUndefined(this._stateConfig[state]);
                from = this._currentState;
                to = state;
                transition = this._stateConfig[state][to] || EmptyTransition.getInstance();
                if (this._currentTransition) {
                    this._currentTransition.cancel();
                }
                transition.reset();
                transition.execute(from, to, function () {
                    _this._currentTransition = null;
                    _this._currentState = to;
                    _this.dispatchEvent(new WOZLLA.event.Event(StateMachine.CHANGE, false, new StateEventData(_this._currentState)));
                });
                this._currentTransition = transition;
            };
            StateMachine.INIT = 'state.init';
            StateMachine.CHANGE = 'state.change';
            return StateMachine;
        })(WOZLLA.event.EventDispatcher);
        utils.StateMachine = StateMachine;
        var StateEventData = (function () {
            function StateEventData(state) {
                this.state = state;
            }
            return StateEventData;
        })();
        utils.StateEventData = StateEventData;
        var EmptyTransition = (function () {
            function EmptyTransition() {
                this._canceled = false;
            }
            EmptyTransition.getInstance = function () {
                if (!EmptyTransition.instance) {
                    EmptyTransition.instance = new EmptyTransition();
                }
                return EmptyTransition.instance;
            };
            EmptyTransition.prototype.reset = function () {
                this._canceled = false;
            };
            EmptyTransition.prototype.cancel = function () {
                this._canceled = true;
            };
            EmptyTransition.prototype.execute = function (fromState, toState, onComplete) {
                if (this._canceled) {
                    return;
                }
                onComplete();
            };
            return EmptyTransition;
        })();
        utils.EmptyTransition = EmptyTransition;
    })(utils = WOZLLA.utils || (WOZLLA.utils = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="../core/Component.ts"/>
/// <reference path="../utils/StateMachine.ts"/>
/// <reference path="../component/renderer/SpriteRenderer.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var ui;
    (function (ui) {
        var StateMachine = WOZLLA.utils.StateMachine;
        /**
         * @class WOZLLA.ui.StateWidget
         * @protected
         */
        var StateWidget = (function (_super) {
            __extends(StateWidget, _super);
            function StateWidget() {
                _super.call(this);
                this._stateMachine = new WOZLLA.utils.StateMachine();
                this.initStates();
            }
            StateWidget.prototype.init = function () {
                var _this = this;
                this._stateMachine.addListener(StateMachine.INIT, function (e) { return _this.onStateChange(e); });
                this._stateMachine.addListener(StateMachine.CHANGE, function (e) { return _this.onStateChange(e); });
                this._stateMachine.init();
                _super.prototype.init.call(this);
            };
            StateWidget.prototype.initStates = function () {
            };
            StateWidget.prototype.getStateSpriteName = function (state) {
                return this._stateMachine.getStateData(state, 'spriteName');
            };
            StateWidget.prototype.setStateSpriteName = function (state, spriteName) {
                this._stateMachine.setStateData(state, 'spriteName', spriteName);
            };
            StateWidget.prototype.onStateChange = function (e) {
                this.spriteName = this.getStateSpriteName(e.data.state);
            };
            return StateWidget;
        })(WOZLLA.component.SpriteRenderer);
        ui.StateWidget = StateWidget;
    })(ui = WOZLLA.ui || (WOZLLA.ui = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="StateWidget.ts"/>
/// <reference path="../component/renderer/SpriteRenderer.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var ui;
    (function (ui) {
        /**
         * @class WOZLLA.ui.Button
         */
        var Button = (function (_super) {
            __extends(Button, _super);
            function Button() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(Button.prototype, "normalSpriteName", {
                get: function () {
                    return this.getStateSpriteName(Button.STATE_NORMAL);
                },
                set: function (spriteName) {
                    this.setStateSpriteName(Button.STATE_NORMAL, spriteName);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Button.prototype, "disabledSpriteName", {
                get: function () {
                    return this.getStateSpriteName(Button.STATE_DISABLED);
                },
                set: function (spriteName) {
                    this.setStateSpriteName(Button.STATE_DISABLED, spriteName);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Button.prototype, "pressedSpriteName", {
                get: function () {
                    return this.getStateSpriteName(Button.STATE_PRESSED);
                },
                set: function (spriteName) {
                    this.setStateSpriteName(Button.STATE_PRESSED, spriteName);
                },
                enumerable: true,
                configurable: true
            });
            Button.prototype.init = function () {
                var _this = this;
                this.gameObject.addListener('touch', function (e) { return _this.onTouch(e); });
                this.gameObject.addListener('release', function (e) { return _this.onRelease(e); });
                this.gameObject.addListener('tap', function (e) { return _this.onTap(e); });
                _super.prototype.init.call(this);
            };
            Button.prototype.destroy = function () {
                this._stateMachine.clearAllListeners();
                _super.prototype.destroy.call(this);
            };
            Button.prototype.isEnabled = function () {
                return this._stateMachine.getCurrentState() !== Button.STATE_DISABLED;
            };
            Button.prototype.setEnabled = function (enabled) {
                if (enabled === void 0) { enabled = true; }
                this._stateMachine.changeState(enabled ? Button.STATE_NORMAL : Button.STATE_DISABLED);
                this._gameObject.touchable = enabled;
            };
            Button.prototype.initStates = function () {
                this._stateMachine.defineState(Button.STATE_NORMAL, true);
                this._stateMachine.defineState(Button.STATE_DISABLED);
                this._stateMachine.defineState(Button.STATE_PRESSED);
            };
            Button.prototype.onTouch = function (e) {
                this._stateMachine.changeState(Button.STATE_PRESSED);
            };
            Button.prototype.onRelease = function (e) {
                this._stateMachine.changeState(Button.STATE_NORMAL);
            };
            Button.prototype.onTap = function (e) {
            };
            Button.STATE_NORMAL = 'normal';
            Button.STATE_DISABLED = 'disabled';
            Button.STATE_PRESSED = 'pressed';
            return Button;
        })(ui.StateWidget);
        ui.Button = Button;
    })(ui = WOZLLA.ui || (WOZLLA.ui = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="StateWidget.ts"/>
/// <reference path="../component/renderer/SpriteRenderer.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var ui;
    (function (ui) {
        /**
         * @class WOZLLA.ui.CheckBox
         */
        var CheckBox = (function (_super) {
            __extends(CheckBox, _super);
            function CheckBox() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(CheckBox.prototype, "uncheckedSpriteName", {
                get: function () {
                    return this.getStateSpriteName(CheckBox.STATE_UNCHECKED);
                },
                set: function (spriteName) {
                    this.setStateSpriteName(CheckBox.STATE_UNCHECKED, spriteName);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CheckBox.prototype, "disabledSpriteName", {
                get: function () {
                    return this.getStateSpriteName(CheckBox.STATE_DISABLED);
                },
                set: function (spriteName) {
                    this.setStateSpriteName(CheckBox.STATE_DISABLED, spriteName);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CheckBox.prototype, "checkedSpriteName", {
                get: function () {
                    return this.getStateSpriteName(CheckBox.STATE_CHECKED);
                },
                set: function (spriteName) {
                    this.setStateSpriteName(CheckBox.STATE_CHECKED, spriteName);
                },
                enumerable: true,
                configurable: true
            });
            CheckBox.prototype.init = function () {
                var _this = this;
                this._gameObject.addListener('tap', function (e) { return _this.onTap(e); });
                _super.prototype.init.call(this);
            };
            CheckBox.prototype.destroy = function () {
                this._stateMachine.clearAllListeners();
                _super.prototype.destroy.call(this);
            };
            CheckBox.prototype.isEnabled = function () {
                return this._stateMachine.getCurrentState() !== CheckBox.STATE_DISABLED;
            };
            CheckBox.prototype.setEnabled = function (enabled) {
                if (enabled === void 0) { enabled = true; }
                this._stateMachine.changeState(enabled ? CheckBox.STATE_UNCHECKED : CheckBox.STATE_DISABLED);
                this._gameObject.touchable = enabled;
            };
            CheckBox.prototype.initStates = function () {
                this._stateMachine.defineState(CheckBox.STATE_UNCHECKED, true);
                this._stateMachine.defineState(CheckBox.STATE_DISABLED);
                this._stateMachine.defineState(CheckBox.STATE_CHECKED);
            };
            CheckBox.prototype.onTap = function (e) {
                if (this._stateMachine.getCurrentState() === CheckBox.STATE_CHECKED) {
                    this._stateMachine.changeState(CheckBox.STATE_UNCHECKED);
                }
                else {
                    this._stateMachine.changeState(CheckBox.STATE_CHECKED);
                }
            };
            CheckBox.STATE_UNCHECKED = 'unchecked';
            CheckBox.STATE_CHECKED = 'checked';
            CheckBox.STATE_DISABLED = 'disabled';
            return CheckBox;
        })(ui.StateWidget);
        ui.CheckBox = CheckBox;
    })(ui = WOZLLA.ui || (WOZLLA.ui = {}));
})(WOZLLA || (WOZLLA = {}));
/// <reference path="../core/Component.ts"/>
var WOZLLA;
(function (WOZLLA) {
    var ui;
    (function (ui) {
        function middle(a, b, c) {
            return (a < b ? (b < c ? b : a < c ? c : a) : (b > c ? b : a > c ? c : a));
        }
        var ScrollRect = (function (_super) {
            __extends(ScrollRect, _super);
            function ScrollRect() {
                _super.apply(this, arguments);
                this._direction = ScrollRect.VERTICAL;
                this._enabled = true;
                this._bufferBackEnabled = true;
                this._momentumEnabled = true;
                this._dragMovedInLastSession = false;
                this._values = {
                    velocityX: 0,
                    velocityY: 0,
                    momentumX: 0,
                    momentumY: 0,
                    lastDragX: 0,
                    lastDragY: 0,
                    momentumXTween: undefined,
                    momentumYTween: undefined,
                    bufferXTween: undefined,
                    bufferYTween: undefined
                };
            }
            Object.defineProperty(ScrollRect.prototype, "direction", {
                get: function () {
                    return this._direction;
                },
                set: function (value) {
                    this._direction = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ScrollRect.prototype, "enabled", {
                get: function () {
                    return this._enabled;
                },
                set: function (value) {
                    this._enabled = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ScrollRect.prototype, "content", {
                get: function () {
                    return this._content;
                },
                set: function (value) {
                    this._content = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ScrollRect.prototype, "visibleWidth", {
                get: function () {
                    return this.gameObject.rectTransform.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ScrollRect.prototype, "visibleHeight", {
                get: function () {
                    return this.gameObject.rectTransform.height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ScrollRect.prototype, "contentWidth", {
                get: function () {
                    return this._contentGameObject.rectTransform.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ScrollRect.prototype, "contentHeight", {
                get: function () {
                    return this._contentGameObject.rectTransform.height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ScrollRect.prototype, "bufferBackEnabled", {
                get: function () {
                    return this._bufferBackEnabled;
                },
                set: function (value) {
                    this._bufferBackEnabled = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ScrollRect.prototype, "momentumEnabled", {
                get: function () {
                    return this._momentumEnabled;
                },
                set: function (value) {
                    this._momentumEnabled = value;
                },
                enumerable: true,
                configurable: true
            });
            ScrollRect.prototype.listRequiredComponents = function () {
                return [WOZLLA.RectTransform];
            };
            ScrollRect.prototype.init = function () {
                if (this._content) {
                    this._contentGameObject = this.gameObject.query(this._content);
                }
                this.gameObject.addListenerScope('dragstart', this.onDragStart, this);
                this.gameObject.addListenerScope('drag', this.onDrag, this);
                this.gameObject.addListenerScope('dragend', this.onDragEnd, this);
                _super.prototype.init.call(this);
            };
            ScrollRect.prototype.destroy = function () {
                this.gameObject.removeListenerScope('dragstart', this.onDragStart, this);
                this.gameObject.removeListenerScope('drag', this.onDrag, this);
                this.gameObject.removeListenerScope('dragend', this.onDragEnd, this);
                _super.prototype.destroy.call(this);
            };
            ScrollRect.prototype.update = function () {
                var _this = this;
                if (!this._contentGameObject)
                    return;
                if (!this._bufferBackEnabled && !this._momentumEnabled)
                    return;
                var contentTrans = this._contentGameObject.rectTransform;
                if (this._direction === ScrollRect.BOTH || this._direction === ScrollRect.HORIZONTAL) {
                    contentTrans.px += (this._values.velocityX + this._values.momentumX) * WOZLLA.Time.delta;
                    var minScrollX = this.getMinScrollX();
                    if (!this._bufferBackEnabled) {
                        contentTrans.px = middle(contentTrans.px, minScrollX, 0);
                    }
                    var bufferMomentumX = false;
                    if (contentTrans.px > 0 && this._values.velocityX !== 0) {
                        contentTrans.px = 0;
                        this._values.momentumX = this._values.velocityX;
                        bufferMomentumX = true;
                    }
                    else if (contentTrans.px < minScrollX && this._values.velocityX !== 0) {
                        contentTrans.px = minScrollX;
                        this._values.momentumX = this._values.velocityX;
                        bufferMomentumX = true;
                    }
                    if (bufferMomentumX) {
                        if (this._values.momentumXTween) {
                            this._values.momentumXTween.setPaused(true);
                        }
                        this._values.momentumXTween = WOZLLA.utils.Tween.get(this._values).to({
                            momentumX: 0
                        }, 100).call(function () {
                            _this.tryBufferBackX();
                        });
                    }
                }
                if (this._direction === ScrollRect.BOTH || this._direction === ScrollRect.VERTICAL) {
                    contentTrans.py += (this._values.velocityY + this._values.momentumY) * WOZLLA.Time.delta;
                    var minScrollY = this.getMinScrollY();
                    if (!this._bufferBackEnabled) {
                        contentTrans.py = middle(contentTrans.py, minScrollY, 0);
                    }
                    var bufferMomentumY = false;
                    if (contentTrans.py > 0 && this._values.velocityY !== 0) {
                        contentTrans.py = 0;
                        this._values.momentumY = this._values.velocityY;
                        bufferMomentumY = true;
                    }
                    else if (contentTrans.py < minScrollY && this._values.velocityY !== 0) {
                        contentTrans.py = minScrollY;
                        this._values.momentumY = this._values.velocityY;
                        bufferMomentumY = true;
                    }
                    if (bufferMomentumY) {
                        if (this._values.momentumYTween) {
                            this._values.momentumYTween.setPaused(true);
                        }
                        this._values.momentumYTween = WOZLLA.utils.Tween.get(this._values).to({
                            momentumY: 0
                        }, 100).call(function () {
                            _this.tryBufferBackY();
                        });
                    }
                }
            };
            ScrollRect.prototype.isScrollable = function () {
                return this._contentGameObject && ScrollRect.globalScrollEnabled && this._enabled;
            };
            ScrollRect.prototype.getMinScrollX = function () {
                return this.visibleWidth - this.contentWidth;
            };
            ScrollRect.prototype.getMinScrollY = function () {
                return this.visibleHeight - this.contentHeight;
            };
            ScrollRect.prototype.onDragStart = function (e) {
                if (!this.isScrollable()) {
                    return;
                }
                this._dragMovedInLastSession = true;
                this._values.lastDragX = e.x;
                this._values.lastDragY = e.y;
                this._values.velocityX = 0;
                this._values.velocityY = 0;
                this._values.momentumX = 0;
                this._values.momentumY = 0;
                this._contentGameObject.rectTransform.clearTweens();
                WOZLLA.utils.Tween.removeTweens(this);
            };
            ScrollRect.prototype.onDrag = function (e) {
                if (!this.isScrollable()) {
                    return;
                }
                var contentTrans = this._contentGameObject.rectTransform;
                if (this._direction === ScrollRect.BOTH || this._direction === ScrollRect.HORIZONTAL) {
                    var deltaX = e.x - this._values.lastDragX;
                    var minScrollX = this.getMinScrollX();
                    if (minScrollX === 0 || (contentTrans.px >= 0 && deltaX > 0) || (contentTrans.px <= minScrollX && deltaX < 0)) {
                        deltaX /= 10;
                    }
                    contentTrans.px += deltaX;
                    this._values.lastDragX += deltaX;
                    if (!this._bufferBackEnabled) {
                        contentTrans.px = middle(contentTrans.px, minScrollX, 0);
                    }
                }
                if (this._direction === ScrollRect.BOTH || this._direction === ScrollRect.VERTICAL) {
                    var deltaY = e.y - this._values.lastDragY;
                    var minScrollY = this.getMinScrollY();
                    if (minScrollY === 0 || (contentTrans.py >= 0 && deltaY > 0) || (contentTrans.py <= minScrollY && deltaY < 0)) {
                        deltaY /= 10;
                    }
                    contentTrans.py += deltaY;
                    this._values.lastDragY += deltaY;
                    if (!this._bufferBackEnabled) {
                        contentTrans.py = middle(contentTrans.py, minScrollY, 0);
                    }
                }
            };
            ScrollRect.prototype.onDragEnd = function (e) {
                if (!this.isScrollable()) {
                    return;
                }
                if (this._direction === ScrollRect.BOTH || this._direction === ScrollRect.HORIZONTAL) {
                    if (!this.tryBufferBackX()) {
                        if (this._momentumEnabled) {
                            this._values.velocityX = e.gesture.velocityX * (e.gesture.deltaX >= 0 ? 1 : -1);
                            if (this._values.momentumXTween) {
                                this._values.momentumXTween.setPaused(true);
                            }
                            this._values.momentumXTween = WOZLLA.utils.Tween.get(this._values).to({
                                velocityX: 0
                            }, 1000);
                        }
                        else {
                            this._values.velocityX = 0;
                            this._values.momentumY = 0;
                        }
                    }
                }
                if (this._direction === ScrollRect.BOTH || this._direction === ScrollRect.VERTICAL) {
                    if (!this.tryBufferBackY()) {
                        if (this._momentumEnabled) {
                            this._values.velocityY = e.gesture.velocityY * (e.gesture.deltaY >= 0 ? 1 : -1);
                            if (this._values.momentumYTween) {
                                this._values.momentumYTween.setPaused(true);
                            }
                            this._values.momentumYTween = WOZLLA.utils.Tween.get(this._values).to({
                                velocityY: 0
                            }, 1000);
                        }
                        else {
                            this._values.velocityY = 0;
                            this._values.momentumY = 0;
                        }
                    }
                }
            };
            ScrollRect.prototype.tryBufferBackX = function () {
                if (!this._bufferBackEnabled) {
                    return false;
                }
                var minScrollX = this.getMinScrollX();
                var contentTrans = this._contentGameObject.rectTransform;
                if (contentTrans.px > 0) {
                    if (this._values.bufferXTween) {
                        this._values.bufferXTween.setPaused(true);
                    }
                    this._values.bufferXTween = contentTrans.tween(false).to({
                        px: 0
                    }, 100);
                    return true;
                }
                else if (contentTrans.px < minScrollX) {
                    if (this._values.bufferXTween) {
                        this._values.bufferXTween.setPaused(true);
                    }
                    this._values.bufferXTween = contentTrans.tween(false).to({
                        px: minScrollX
                    }, 100);
                    return true;
                }
                return false;
            };
            ScrollRect.prototype.tryBufferBackY = function () {
                if (!this._bufferBackEnabled) {
                    return false;
                }
                var minScrollY = this.getMinScrollY();
                var contentTrans = this._contentGameObject.rectTransform;
                if (contentTrans.py > 0) {
                    if (this._values.bufferYTween) {
                        this._values.bufferYTween.setPaused(true);
                    }
                    this._values.bufferYTween = contentTrans.tween(false).to({
                        py: 0
                    }, 100);
                    return true;
                }
                else if (contentTrans.py < minScrollY) {
                    if (this._values.bufferYTween) {
                        this._values.bufferYTween.setPaused(true);
                    }
                    this._values.bufferYTween = contentTrans.tween(false).to({
                        py: minScrollY
                    }, 100);
                    return true;
                }
                return false;
            };
            ScrollRect.globalScrollEnabled = true;
            ScrollRect.HORIZONTAL = 'Horizontal';
            ScrollRect.VERTICAL = 'Vertical';
            ScrollRect.BOTH = 'both';
            return ScrollRect;
        })(WOZLLA.Behaviour);
        ui.ScrollRect = ScrollRect;
        WOZLLA.Component.register(ScrollRect, {
            name: 'UI.ScrollRect',
            properties: [{
                name: 'enabeld',
                type: 'boolean',
                defaultValue: true
            }, {
                name: 'direction',
                type: 'string',
                defaultValue: ScrollRect.VERTICAL,
                editor: 'combobox',
                data: [
                    ScrollRect.HORIZONTAL,
                    ScrollRect.VERTICAL,
                    ScrollRect.BOTH
                ]
            }, {
                name: 'content',
                type: 'string',
                defaultValue: ''
            }, {
                name: 'bufferBackEnabled',
                type: 'boolean',
                defaultValue: true
            }, {
                name: 'momentumEnabled',
                type: 'boolean',
                defaultValue: true
            }]
        });
    })(ui = WOZLLA.ui || (WOZLLA.ui = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var utils;
    (function (utils) {
        var Ease = (function () {
            function Ease() {
            }
            Ease.get = function (amount) {
                if (amount < -1) {
                    amount = -1;
                }
                if (amount > 1) {
                    amount = 1;
                }
                return function (t) {
                    if (amount == 0) {
                        return t;
                    }
                    if (amount < 0) {
                        return t * (t * -amount + 1 + amount);
                    }
                    return t * ((2 - t) * amount + (1 - amount));
                };
            };
            Ease.getPowIn = function (pow) {
                return function (t) {
                    return Math.pow(t, pow);
                };
            };
            Ease.getPowOut = function (pow) {
                return function (t) {
                    return 1 - Math.pow(1 - t, pow);
                };
            };
            Ease.getPowInOut = function (pow) {
                return function (t) {
                    if ((t *= 2) < 1)
                        return 0.5 * Math.pow(t, pow);
                    return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow));
                };
            };
            Ease.sineIn = function (t) {
                return 1 - Math.cos(t * Math.PI / 2);
            };
            Ease.sineOut = function (t) {
                return Math.sin(t * Math.PI / 2);
            };
            Ease.sineInOut = function (t) {
                return -0.5 * (Math.cos(Math.PI * t) - 1);
            };
            Ease.getBackIn = function (amount) {
                return function (t) {
                    return t * t * ((amount + 1) * t - amount);
                };
            };
            Ease.getBackOut = function (amount) {
                return function (t) {
                    t = t - 1;
                    return (t * t * ((amount + 1) * t + amount) + 1);
                };
            };
            Ease.getBackInOut = function (amount) {
                amount *= 1.525;
                return function (t) {
                    if ((t *= 2) < 1)
                        return 0.5 * (t * t * ((amount + 1) * t - amount));
                    return 0.5 * ((t -= 2) * t * ((amount + 1) * t + amount) + 2);
                };
            };
            Ease.circIn = function (t) {
                return -(Math.sqrt(1 - t * t) - 1);
            };
            Ease.circOut = function (t) {
                return Math.sqrt(1 - (t) * t);
            };
            Ease.circInOut = function (t) {
                if ((t *= 2) < 1) {
                    return -0.5 * (Math.sqrt(1 - t * t) - 1);
                }
                return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
            };
            Ease.bounceIn = function (t) {
                return 1 - Ease.bounceOut(1 - t);
            };
            Ease.bounceOut = function (t) {
                if (t < 1 / 2.75) {
                    return (7.5625 * t * t);
                }
                else if (t < 2 / 2.75) {
                    return (7.5625 * (t -= 1.5 / 2.75) * t + 0.75);
                }
                else if (t < 2.5 / 2.75) {
                    return (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375);
                }
                else {
                    return (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375);
                }
            };
            Ease.bounceInOut = function (t) {
                if (t < 0.5)
                    return Ease.bounceIn(t * 2) * .5;
                return Ease.bounceOut(t * 2 - 1) * 0.5 + 0.5;
            };
            Ease.getElasticIn = function (amplitude, period) {
                var pi2 = Math.PI * 2;
                return function (t) {
                    if (t == 0 || t == 1)
                        return t;
                    var s = period / pi2 * Math.asin(1 / amplitude);
                    return -(amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
                };
            };
            Ease.getElasticOut = function (amplitude, period) {
                var pi2 = Math.PI * 2;
                return function (t) {
                    if (t == 0 || t == 1)
                        return t;
                    var s = period / pi2 * Math.asin(1 / amplitude);
                    return (amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * pi2 / period) + 1);
                };
            };
            Ease.getElasticInOut = function (amplitude, period) {
                var pi2 = Math.PI * 2;
                return function (t) {
                    var s = period / pi2 * Math.asin(1 / amplitude);
                    if ((t *= 2) < 1)
                        return -0.5 * (amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
                    return amplitude * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * pi2 / period) * 0.5 + 1;
                };
            };
            Ease.linear = function (t) {
                return t;
            };
            Ease.expoIn = function (time) {
                return time == 0 ? 0 : Math.pow(2, 10 * (time - 1)) - 0.001;
            };
            Ease.expoOut = function (time) {
                return time == 1 ? 1 : (-Math.pow(2, -10 * time) + 1);
            };
            Ease.expoInOut = function (time) {
                time /= 0.5;
                if (time < 1) {
                    time = 0.5 * Math.pow(2, 10 * (time - 1));
                }
                else {
                    time = 0.5 * (-Math.pow(2, -10 * (time - 1)) + 2);
                }
                return time;
            };
            Ease.getByKey = function (key) {
                return Ease[Ease.keyMap[key]];
            };
            Ease.quadIn = Ease.getPowIn(2);
            Ease.quadOut = Ease.getPowOut(2);
            Ease.quadInOut = Ease.getPowInOut(2);
            Ease.cubicIn = Ease.getPowIn(3);
            Ease.cubicOut = Ease.getPowOut(3);
            Ease.cubicInOut = Ease.getPowInOut(3);
            Ease.quartIn = Ease.getPowIn(4);
            Ease.quartOut = Ease.getPowOut(4);
            Ease.quartInOut = Ease.getPowInOut(4);
            Ease.quintIn = Ease.getPowIn(5);
            Ease.quintOut = Ease.getPowOut(5);
            Ease.quintInOut = Ease.getPowInOut(5);
            Ease.backIn = Ease.getBackIn(1.7);
            Ease.backOut = Ease.getBackOut(1.7);
            Ease.backInOut = Ease.getBackInOut(1.7);
            Ease.elasticIn = Ease.getElasticIn(1, 0.3);
            Ease.elasticOut = Ease.getElasticOut(1, 0.3);
            Ease.elasticInOut = Ease.getElasticInOut(1, 0.3 * 1.5);
            Ease.keyMap = {
                0: 'linear',
                1: 'sineIn',
                2: 'sineOut',
                3: 'sineInOut',
                4: 'quadIn',
                5: 'quadOut',
                6: 'quadInOut',
                7: 'cubicIn',
                8: 'cubicOut',
                9: 'cubicInOut',
                10: 'quartIn',
                11: 'quartOut',
                12: 'quartInOut',
                13: 'quintIn',
                14: 'quintOut',
                15: 'quintInOut',
                16: 'expoIn',
                17: 'expoOut',
                18: 'expoInOut',
                19: 'circIn',
                20: 'circOut',
                21: 'circInOut',
                22: 'elasticIn',
                23: 'elasticOut',
                24: 'elasticInOut',
                25: 'backIn',
                26: 'backOut',
                27: 'backInOut',
                28: 'bounceIn',
                29: 'bounceOut',
                30: 'bounceInOut'
            };
            return Ease;
        })();
        utils.Ease = Ease;
    })(utils = WOZLLA.utils || (WOZLLA.utils = {}));
})(WOZLLA || (WOZLLA = {}));
//# sourceMappingURL=WOZLLA.js.map