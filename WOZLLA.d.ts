/// <reference path="typings/tsd.d.ts" />
declare module WOZLLA.event {
    /**
     * @enum {number} WOZLLA.event.EventPhase
     * all enumerations of event phase
     */
    enum EventPhase {
        /** @property {number} [CAPTURE] */
        CAPTURE = 0,
        /** @property {number} [BUBBLE] */
        BUBBLE = 1,
        /** @property {number} [TARGET] */
        TARGET = 2,
    }
    /**
     * @class WOZLLA.event.Event
     * Base class for all event object of WOZLLA engine.    <br/>
     * see also:    <br/>
     * {@link WOZLLA.event.EventPhase}  <br/>
     * {@link WOZLLA.event.EventDispatcher}     <br/>
     */
    class Event {
        /**
         * event data.
         * @member WOZLLA.event.Event
         * @property {any} data
         * @readonly
         */
        data: any;
        /**
         * event type.
         * @member WOZLLA.event.Event
         * @property {string} type
         * @readonly
         */
        type: string;
        /**
         * event origin target.
         * @member WOZLLA.event.Event
         * @property {WOZLLA.event.EventDispatcher} target
         * @readonly
         */
        target: EventDispatcher;
        /**
         * current event target in event bubbling.
         * @member WOZLLA.event.Event
         * @property {WOZLLA.event.EventDispatcher} currentTarget
         * @readonly
         */
        currentTarget: EventDispatcher;
        /**
         * which phase this event is in.
         * @member WOZLLA.event.Event
         * @property {WOZLLA.event.EventPhase} eventPhase
         * @readonly
         */
        eventPhase: EventPhase;
        /**
         * true to identify this event could be bubbled, false otherwise.
         * @member WOZLLA.event.Event
         * @property {boolean} bubbles
         * @readonly
         */
        bubbles: boolean;
        /**
         * true to identify this event could be stop bubbles, false otherwise.
         * @member WOZLLA.event.Event
         * @property {boolean} canStopBubbles
         * @readonly
         */
        canStopBubbles: boolean;
        _type: string;
        _target: EventDispatcher;
        _currentTarget: EventDispatcher;
        _data: any;
        _bubbles: boolean;
        _canStopBubbles: boolean;
        _eventPhase: EventPhase;
        _immediatePropagationStoped: boolean;
        _propagationStoped: boolean;
        _listenerRemove: boolean;
        /**
         * @method constructor
         * create a new Event object
         * @member WOZLLA.event.Event
         * @param {string} type
         * @param {boolean} bubbles
         * @param {any} data
         * @param {boolean} canStopBubbles
         */
        constructor(type: string, bubbles?: boolean, data?: any, canStopBubbles?: boolean);
        /**
         * @method isStopPropagation
         * @member WOZLLA.event.Event
         * @returns {boolean}
         */
        isStopPropagation(): boolean;
        /**
         * stop bubble to next parent
         * @method stopPropagation
         * @member WOZLLA.event.Event
         */
        stopPropagation(): void;
        /**
         * @method isStopImmediatePropagation
         * @member WOZLLA.event.Event
         * @returns {boolean}
         */
        isStopImmediatePropagation(): boolean;
        /**
         * stop event bubble immediately even other listeners dosen't receive this event.
         * @method stopImmediatePropagation
         * @member WOZLLA.event.Event
         */
        stopImmediatePropagation(): void;
        /**
         * call from current listener to remove the current listener
         */
        removeCurrentListener(): void;
    }
}
declare module WOZLLA.event {
    /**
     * @class WOZLLA.event.EventDispatcher
     * Base class for bubblable event system
     *
     */
    class EventDispatcher {
        private _captureDict;
        private _bubbleDict;
        private _bubbleParent;
        /**
         * @method setBubbleParent
         * set bubble parent of this dispatcher
         * @param {WOZLLA.event.EventDispatcher} bubbleParent
         */
        setBubbleParent(bubbleParent: EventDispatcher): void;
        /**
         * @method hasListener
         * @param {string} type
         * @param {boolean} useCapture true to check capture phase, false to check bubble and target phases.
         */
        hasListener(type: string, useCapture?: boolean): boolean;
        /**
         * @method getListenerCount
         * @param {string} type
         * @param {boolean} useCapture true to check capture phase, false to check bubble and target phases.
         * @returns {number}
         */
        getListenerCount(type: string, useCapture: boolean): number;
        /**
         * @method addListener
         * @param {string} type
         * @param {boolean} useCapture true to check capture phase, false to check bubble and target phases.
         */
        addListener(type: string, listener: Function, useCapture?: boolean): void;
        addListenerScope(type: string, listener: Function, scope: any, useCapture?: boolean): void;
        /**
         * @method removeListener
         * @param {string} type
         * @param {boolean} useCapture true to check capture phase, false to check bubble and target phases.
         */
        removeListener(type: string, listener: Function, useCapture?: boolean): boolean;
        removeListenerScope(type: string, listener: Function, scope: any, userCapture?: boolean): boolean;
        /**
         * @method clearListeners
         * @param {string} type
         * @param {boolean} useCapture true to check capture phase, false to check bubble and target phases.
         */
        clearListeners(type: string, useCapture: boolean): void;
        /**
         * @method clearAllListeners
         *  clear all listeners
         */
        clearAllListeners(): void;
        /**
         * @method dispatch an event
         * @param {WOZLLA.event.Event} event
         */
        dispatchEvent(event: Event): void;
        _dispatchEventInPhase(event: Event, phase: EventPhase): boolean;
        private _getAncients();
        private _getListenerList(type, useCapture);
    }
}
declare module WOZLLA.assets {
    /**
     * Base class of all assets in WOZLLA engine.
     * an asset contains a reference count which increase by **retain** function,
     * decrease by **release** function.
     * an asset would be unload when reference count reach 0.
     * @class WOZLLA.assets.Asset
     * @extends WOZLLA.event.EventDispatcher
     * @abstract
     */
    class Asset extends WOZLLA.event.EventDispatcher {
        static EVENT_UNLOAD: string;
        /**
         * @property {string} src
         * @readonly
         */
        src: string;
        fullPath: string;
        private _src;
        private _baseDir;
        private _refCount;
        constructor(src: string, baseDir?: string);
        /**
         * retain this asset
         */
        retain(): void;
        /**
         * release this asset
         * @param {boolean} [decreaceRefCount=true]
         */
        release(decreaceRefCount?: boolean): void;
        /**
         * load this asset
         * @param onSuccess
         * @param onError
         */
        load(onSuccess: () => any, onError: (error) => any): void;
        /**
         * unload this asset
         * @fires unload event
         */
        unload(): void;
    }
}
declare module WOZLLA.assets {
    interface AssetDescription {
        src: string;
        AssetClass: Function;
        callback: Function;
    }
    /**
     * an singleton class for asset loading and asset management
     * @class WOZLLA.assets.AssetLoader
     * @singleton
     */
    class AssetLoader {
        private static instance;
        /**
         * return the singleton of this class
         * @method getInstance
         * @static
         * @returns {WOZLLA.assets.AssetLoader}
         */
        static getInstance(): AssetLoader;
        _loadedAssets: {};
        _loadingUnits: {};
        _baseDir: string;
        getBaseDir(): string;
        setBaseDir(baseDir: string): void;
        /**
         * get an asset by src
         * @param src
         * @returns {any}
         */
        getAsset(src: any): any;
        /**
         * add asset to asset loader, the asset would be auto removed when unloaded.
         * @param asset
         */
        addAsset(asset: Asset): void;
        /**
         * remove asset from asset loader
         * @param asset
         */
        removeAsset(asset: Asset): void;
        /**
         * load all asset
         * @param items
         */
        loadAll(items: Array<AssetDescription>): void;
        /**
         * load an asset by src, AssetClass(constructor/factory)
         * @param src
         * @param AssetClass
         * @param callback
         */
        load(src: string, AssetClass: Function, callback?: () => any): void;
    }
}
declare module WOZLLA.renderer {
    /**
     * @class WOZLLA.renderer.ITexture
     * @abstract
     */
    interface ITexture {
        id: any;
        descriptor: ITextureDescriptor;
        bind(gl: any): void;
    }
    module ITexture {
        /**
         * @property DOC
         * @readonly
         * @static
         * @member WOZLLA.renderer.ITexture
         */
        var DOC: string;
    }
}
declare module WOZLLA.renderer {
    /**
     * @class WOZLLA.renderer.IRenderer
     * @abstract
     */
    interface IRenderer {
        /**
         * @property {WOZLLA.renderer.ILayerManager} layerManager
         */
        layerManager: ILayerManager;
        materialManager: IMaterialManager;
        shaderManager: IShaderManager;
        textureManager: ITextureManager;
        viewport: any;
        gl: any;
        addCommand(command: IRenderCommand): void;
        render(): void;
        flush(): void;
    }
    module IRenderer {
        /**
         * @property DOC
         * @readonly
         * @static
         * @member WOZLLA.renderer.IRenderer
         */
        var DOC: string;
    }
}
declare module WOZLLA.math {
    /**
     * @class WOZLLA.math.Matrix
     * a util class for 2d matrix
     */
    class Matrix {
        /**
         * @property DEG_TO_RAD
         * @member WOZLLA.math.Matrix
         * @readonly
         * @static
         */
        static DEG_TO_RAD: number;
        values: Float32Array;
        constructor();
        /**
         * apply from another matrix
         * @param matrix
         */
        applyMatrix(matrix: Matrix): void;
        /**
         * identify this matrix
         */
        identity(): void;
        /**
         * invert this matrix
         */
        invert(): void;
        /**
         * prepend 2d params to this matrix
         * @param a
         * @param b
         * @param c
         * @param d
         * @param tx
         * @param ty
         */
        prepend(a: number, b: number, c: number, d: number, tx: number, ty: any): void;
        /**
         * append 2d params to this matrix
         * @param a
         * @param b
         * @param c
         * @param d
         * @param tx
         * @param ty
         */
        append(a: number, b: number, c: number, d: number, tx: number, ty: any): void;
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
        prependTransform(x: any, y: any, scaleX: any, scaleY: any, rotation: any, skewX: any, skewY: any, regX: any, regY: any): Matrix;
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
        appendTransform(x: any, y: any, scaleX: any, scaleY: any, rotation: any, skewX: any, skewY: any, regX: any, regY: any): Matrix;
    }
}
declare module WOZLLA.utils {
    class Tween {
        static NONE: number;
        static LOOP: number;
        static REVERSE: number;
        private static _tweens;
        private static IGNORE;
        private static _plugins;
        private static _inited;
        private _target;
        private _useTicks;
        private ignoreGlobalPause;
        private loop;
        private pluginData;
        private _curQueueProps;
        private _initQueueProps;
        private _steps;
        private _actions;
        private paused;
        private duration;
        private _prevPos;
        private position;
        private _prevPosition;
        private _stepPosition;
        private passive;
        static get(target: any, props?: any, pluginData?: any, override?: boolean): Tween;
        static removeTweens(target: any): void;
        static tick(delta: any, paused?: boolean): void;
        private static _register(tween, value);
        static removeAllTweens(): void;
        constructor(target: any, props: any, pluginData: any);
        private initialize(target, props, pluginData);
        private setPosition(value, actionsMode?);
        private _runActions(startPos, endPos, includeStart?);
        private _updateTargetProps(step, ratio);
        setPaused(value: boolean): Tween;
        private _cloneProps(props);
        private _addStep(o);
        private _appendQueueProps(o);
        private _addAction(o);
        private _set(props, o);
        wait(duration: number, passive?: boolean): Tween;
        to(props: any, duration: number, ease?: any): Tween;
        call(callback: Function, thisObj?: any, params?: any): Tween;
        set(props: any, target?: any): Tween;
        play(tween: Tween): Tween;
        pause(tween: Tween): Tween;
        tick(delta: number): void;
    }
}
declare module WOZLLA {
    /**
     * this class define the position, scale, rotation and about transform information of {@link WOZLLA.GameObject}
     * @class WOZLLA.Transform
     */
    class Transform {
        __local_matrix: any;
        /**
         * @property {number} DEG_TO_RAD
         * @readonly
         * @static
         */
        static DEG_TO_RAD: number;
        /**
         * @property {WOZLLA.math.Matrix} worldMatrix
         * @readonly
         */
        worldMatrix: WOZLLA.math.Matrix;
        /**
         * specify this tranform
         * @type {boolean}
         */
        useGLCoords: boolean;
        _values: Array<number>;
        _relative: boolean;
        _dirty: boolean;
        constructor();
        x: any;
        y: any;
        rotation: any;
        scaleX: any;
        scaleY: any;
        skewX: any;
        skewY: any;
        relative: boolean;
        dirty: boolean;
        setPosition(x: any, y: any): void;
        setAnchor(anchorX: any, anchorY: any): void;
        setRotation(rotation: any): void;
        setScale(scaleX: any, scaleY: any): void;
        setSkew(skewX: any, skewY: any): void;
        reset(): void;
        set(transform: any): void;
        transform(parentTransform?: Transform): void;
        updateWorldMatrix(): void;
        globalToLocal(x: any, y: any, updateMatrix?: boolean): {
            x: number;
            y: number;
        };
        localToGlobal(x: any, y: any, updateMatrix?: boolean): {
            x: number;
            y: number;
        };
        tween(override: boolean): any;
        clearTweens(): void;
    }
}
declare module WOZLLA {
    /**
     * RectTransform is a subclass of {@link WOZLLA.Transform}, define a rect region
     * for {@WOZLLA.GameObject} and a anchor mode to specify how to related to it's parent.
     * @class WOZLLA.RectTransform
     */
    class RectTransform extends Transform {
        static getMode(name: any): number;
        /**
         * vertical anchor mode
         * @property {number} ANCHOR_TOP
         * @readonly
         * @static
         */
        static ANCHOR_TOP: number;
        /**
         * vertical anchor mode
         * @property {number} ANCHOR_MIDDLE
         * @readonly
         * @static
         */
        static ANCHOR_MIDDLE: number;
        /**
         * vertical anchor mode
         * @property {number} ANCHOR_BOTTOM
         * @readonly
         * @static
         */
        static ANCHOR_BOTTOM: number;
        /**
         * vertical anchor mode
         * @property {number} ANCHOR_VERTICAL_STRENGTH
         * @readonly
         * @static
         */
        static ANCHOR_VERTICAL_STRENGTH: number;
        /**
         * horizontal anchor mode
         * @property {number} ANCHOR_LEFT
         * @readonly
         * @static
         */
        static ANCHOR_LEFT: number;
        /**
         * horizontal anchor mode
         * @property {number} ANCHOR_CENTER
         * @readonly
         * @static
         */
        static ANCHOR_CENTER: number;
        /**
         * horizontal anchor mode
         * @property {number} ANCHOR_RIGHT
         * @readonly
         * @static
         */
        static ANCHOR_RIGHT: number;
        /**
         * horizontal anchor mode
         * @property {number} ANCHOR_HORIZONTAL_STRENGTH
         * @readonly
         * @static
         */
        static ANCHOR_HORIZONTAL_STRENGTH: number;
        /**
         * get or set width, this property only effect on fixed size mode
         * @property {number} width
         */
        width: number;
        /**
         * get or set height, this property only effect on fixed size mode
         * @property {number} height
         */
        height: number;
        /**
         * get or set top
         * @property {number} top
         */
        top: number;
        /**
         * get or set left
         * @property {number} left
         */
        left: number;
        /**
         * get or set right
         * @property {number} right
         */
        right: number;
        /**
         * get or set bottom
         * @property {number} bottom
         */
        bottom: number;
        /**
         * get or set px, this only effect on strengthen mode
         * @property {number} px specify x coords
         */
        px: number;
        /**
         * get or set py, this only effect on strengthen mode
         * @property {number} py specify y coords
         */
        py: number;
        /**
         * get or set anchor mode
         * @property {number} anchorMode
         */
        anchorMode: number;
        _width: number;
        _height: number;
        _top: number;
        _left: number;
        _right: number;
        _bottom: number;
        _px: number;
        _py: number;
        _anchorMode: number;
        /**
         * set rect transform
         * @param {WOZLLA.RectTransform} rectTransform
         */
        set(rectTransform: RectTransform): void;
        /**
         * transform with parent transform
         * @param {WOZLLA.Transform} parentTransform
         */
        transform(parentTransform?: Transform): void;
    }
}
declare module WOZLLA {
    class Assert {
        static DEFAULT_MESSAGE: string;
        static isTrue(test: any, msg?: string): void;
        static isFalse(test: any, msg?: string): void;
        static isTypeof(test: any, type: string, msg?: string): void;
        static isNotTypeof(test: any, type: string, msg?: string): void;
        static isString(test: any, msg?: string): void;
        static isObject(test: any, msg?: string): void;
        static isUndefined(test: any, msg?: string): void;
        static isNotUndefined(test: any, msg?: string): void;
        static isFunction(test: any, msg?: string): void;
    }
}
declare module WOZLLA {
    /**
     * Top class of all components
     * @class WOZLLA.Component
     * @extends WOZLLA.event.EventDispatcher
     * @abstract
     */
    class Component extends WOZLLA.event.EventDispatcher {
        /**
         * get the GameObject of this component belongs to.
         * @property {WOZLLA.GameObject} gameObject
         */
        gameObject: GameObject;
        /**
         *  get transform of the gameObject of this component
         *  @property {WOZLLA.Transform} transform
         */
        transform: Transform;
        _gameObject: GameObject;
        _uuid: string;
        /**
         * init this component
         */
        init(): void;
        /**
         * destroy this component
         */
        destroy(): void;
        loadAssets(callback: Function): void;
        listRequiredComponents(): Array<Function>;
        private static ctorMap;
        private static configMap;
        static getType(name: string): any;
        static getName(Type: Function): any;
        /**
         * register an component class and it's configuration
         * @method register
         * @static
         * @param ctor
         * @param configuration
         */
        static register(ctor: Function, config: any): void;
        static unregister(name: string): void;
        /**
         * create component by it's registed name.
         * @param name the component name
         * @returns {WOZLLA.Component}
         */
        static create(name: string): WOZLLA.Component;
        static getConfig(name: any): any;
        static extendConfig(Type: any, filter?: any): any;
    }
}
declare module WOZLLA {
    /**
     * abstract base class for all colliders
     * @class WOZLLA.Collider
     * @extends WOZLLA.Component
     * @abstract
     */
    class Collider extends Component {
        /**
         * @method {boolean} containsXY
         * @param localX x coords relate to the gameObject of this collider
         * @param localY y coords relate to the gameObject of this collider
         * @returns {boolean}
         */
        collideXY(localX: number, localY: number): boolean;
        collide(collider: Collider): boolean;
    }
}
declare module WOZLLA {
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
    class GameObject extends WOZLLA.event.EventDispatcher {
        static MASK_TRANSFORM_DIRTY: number;
        static MASK_VISIBLE: number;
        /**
         * return the GameObject with the specified id.
         * @method {WOZLLA.GameObject} getById
         * @static
         * @param id the specified id
         * @member WOZLLA.GameObject
         */
        static getById(id: string): GameObject;
        /**
         * get or set the id of this game object
         * @property {string} id
         * @member WOZLLA.GameObject
         */
        id: string;
        /**
         * get or set the name of this game object
         * @property {string} name
         * @member WOZLLA.GameObject
         */
        name: string;
        /**
         * get transform of this game object
         * @property {WOZLLA.Transform} transform
         * @member WOZLLA.GameObject
         * @readonly
         */
        transform: Transform;
        /**
         * get rect transform of this game object
         * @property {WOZLLA.RectTransform} rectTransform
         * @member WOZLLA.GameObject
         * @readonly
         */
        rectTransform: RectTransform;
        /**
         * get parent game object
         * @property {WOZLLA.GameObject} parent
         * @member WOZLLA.GameObject
         * @readonly
         */
        parent: GameObject;
        /**
         * get children of this game object
         * @property {WOZLLA.GameObject[]} children
         * @member WOZLLA.GameObject
         * @readonly
         */
        children: GameObject[];
        /**
         * get raw children
         * @returns {WOZLLA.GameObject[]}
         */
        rawChildren: GameObject[];
        /**
         * get child count
         * @property {number} childCount
         * @member WOZLLA.GameObject
         * @readonly
         */
        childCount: number;
        /**
         * get or set z order of this game object, and then resort children.
         * @property {number} z
         * @member WOZLLA.GameObject
         */
        z: number;
        /**
         * get or set active of this game object.
         * the update method would be call every frame when active was true, false otherwise.
         * if active is set from false to true, the transform dirty would be true.
         * @property {boolean} active
         * @member WOZLLA.GameObject
         */
        active: boolean;
        /**
         * get visible of this game object.
         * the render method would be call every frame when visible and active both true.
         * @property {boolean} visible
         * @member WOZLLA.GameObject
         */
        visible: boolean;
        /**
         * get initialized of this game object
         * @property {boolean} initialized
         * @member WOZLLA.GameObject
         * @readonly
         */
        initialized: boolean;
        /**
         * get destroyed of this game object
         * @property {boolean} destroyed
         * @member WOZLLA.GameObject
         * @readonly
         */
        destroyed: boolean;
        /**
         * get or set touchable of this game object. identify this game object is interactive.
         * @property {boolean} touchable
         * @member WOZLLA.GameObject
         * @readonly
         */
        touchable: boolean;
        /**
         * get renderer component of this game object
         * @property {WOZLLA.Renderer} renderer
         * @member WOZLLA.GameObject
         * @readonly
         */
        renderer: Renderer;
        /**
         * get collider of this game object
         * @property {WOZLLA.Collider} collider
         * @member WOZLLA.GameObject
         * @readonly
         */
        collider: Collider;
        /**
         * get behaviours of this game object
         * @property {WOZLLA.Behaviour[]} behaviours
         * @member WOZLLA.GameObject
         * @readonly
         */
        behaviours: Behaviour[];
        /**
         * get mask component of this game object
         * @property {WOZLLA.Mask} mask
         * @member WOZLLA.GameObject
         * @readonly
         */
        mask: Mask;
        _uuid: string;
        _id: string;
        _name: any;
        _active: boolean;
        _visible: boolean;
        _initialized: boolean;
        _destroyed: boolean;
        _touchable: boolean;
        _loadingAssets: boolean;
        _children: GameObject[];
        _components: Component[];
        _transform: Transform;
        _rectTransform: RectTransform;
        _parent: GameObject;
        _z: number;
        _renderer: Renderer;
        _collider: Collider;
        _behaviours: Behaviour[];
        _mask: Mask;
        /**
         * new a GameObject
         * @method constructor
         * @member WOZLLA.GameObject
         * @param {boolean} useRectTransform specify which transform this game object should be used.
         */
        constructor(useRectTransform?: boolean);
        /**
         * get active in tree
         * @method isActive
         * @member WOZLLA.GameObject
         * @return {boolean}
         */
        isActive(): boolean;
        /**
         * get visible in tree
         * @method isVisible
         * @member WOZLLA.GameObject
         * @return {boolean}
         */
        isVisible(): boolean;
        /**
         * set z order
         * @param value
         * @param sort true is set to resort children
         */
        setZ(value: number, sort?: boolean): void;
        /**
         * add a child game object, it would be fail when this game object has contains the child.
         * @param child
         * @param sort true is set to resort children
         * @returns {boolean} true is success to, false otherwise.
         */
        addChild(child: GameObject, sort?: boolean): boolean;
        /**
         * remove the specified child.
         * @param child
         * @returns {boolean} true is success to, false otherwise.
         */
        removeChild(child: GameObject): boolean;
        /**
         * get the first child with the specified name.
         * @param name
         * @returns {WOZLLA.GameObject}
         */
        getChild(name: string): GameObject;
        /**
         * get all children with the specified name.
         * @param name
         * @returns {Array}
         */
        getChildren(name: string): GameObject[];
        /**
         * remove this game object from parent.
         * @returns {boolean}
         */
        removeMe(): boolean;
        /**
         * iterator children of this game object
         * @param func interator function.
         */
        eachChild(func: (value: GameObject, index: number, array: GameObject[]) => any): void;
        /**
         * sort children
         */
        sortChildren(): void;
        /**
         * get path of this game object
         * @param split delimiter
         * @returns {string}
         */
        getPath(split?: string): string;
        /**
         * whether contains the specified game object of this tree structure.
         * @param child
         * @returns {boolean}
         */
        contains(child: GameObject): boolean;
        /**
         * get first component of type of the specified Type(constructor).
         * @param Type
         * @returns {WOZLLA.Component}
         */
        getComponent(Type: Function): Component;
        /**
         * @method hasComponent
         * @param Type
         * @returns {boolean}
         */
        hasComponent(Type: Function): boolean;
        /**
         * get all components of type of Type(constructor).
         * @param Type
         * @returns {Array}
         */
        getComponents(Type: Function): Component[];
        /**
         * add componen to this game object. this method would check component dependency
         * by method of component's listRequiredComponents.
         * @param comp
         * @returns {boolean}
         */
        addComponent(comp: Component): boolean;
        /**
         * remove the specified component
         * @param comp
         * @returns {boolean}
         */
        removeComponent(comp: Component): boolean;
        /**
         * init this game object.
         */
        init(): void;
        /**
         * destroy this game object.
         */
        destroy(): void;
        /**
         * call every frame when active was true.
         */
        update(): void;
        /**
         * visit this game object and it's all chidlren, children of children.
         * @param renderer
         * @param parentTransform
         * @param flags
         */
        visit(renderer: WOZLLA.renderer.IRenderer, parentTransform: Transform, flags: number): number;
        /**
         * render this game object
         * @param renderer
         * @param flags
         */
        render(renderer: WOZLLA.renderer.IRenderer, flags: number): void;
        /**
         * get a game object under the point.
         * @param x
         * @param y
         * @param touchable
         * @returns {WOZLLA.GameObject}
         */
        getUnderPoint(x: number, y: number, touchable?: boolean): GameObject;
        /**
         * try to do a hit test
         * @param localX
         * @param localY
         * @returns {boolean}
         */
        testHit(localX: number, localY: number): boolean;
        loadAssets(callback: Function): void;
        static QUERY_FULL_REGEX: RegExp;
        static QUERY_COMP_REGEX: RegExp;
        static QUERY_OBJ_ATTR_REGEX: RegExp;
        query(expr: string, record?: QueryRecord): any;
        protected checkComponentDependency(comp: Component, isRemove?: boolean): void;
    }
    class QueryRecord {
        compExpr: any;
        objExpr: any;
        compName: any;
        attrName: any;
        target: any;
    }
}
declare module WOZLLA {
    /**
     * the root game object of WOZLLA engine
     * @class WOZLLA.Stage
     * @extends WOZLLA.GameObject
     */
    class Stage extends GameObject {
        static ID: string;
        viewRectTransform: RectTransform;
        _rootTransform: Transform;
        _viewRectTransform: RectTransform;
        constructor();
        visitStage(renderer: WOZLLA.renderer.IRenderer): void;
    }
}
declare module WOZLLA {
    /**
     * @class WOZLLA.Time
     * @static
     */
    class Time {
        /**
         * @property {number} delta
         * @readonly
         * @static
         */
        static delta: number;
        /**
         * @property {number} now
         * @readonly
         * @static
         */
        static now: number;
        /**
         * @property {number} measuredFPS
         * @readonly
         * @static
         */
        static measuredFPS: number;
        static _nowIncrease: number;
        static update(timeScale: any): void;
        static reset(): void;
    }
}
declare module WOZLLA {
    /**
     * @class WOZLLA.Scheduler
     * @singleton
     */
    class Scheduler {
        private static instance;
        /**
         * @method {WOZLLA.Scheduler} getInstance
         * @static
         * @member WOZLLA.Scheduler
         */
        static getInstance(): any;
        private _scheduleCount;
        private _lastSchedules;
        private _schedules;
        runSchedule(): void;
        /**
         * remove the specify schedule by id
         * @param id
         */
        removeSchedule(id: any): void;
        /**
         * schedule the task to each frame
         * @param task
         * @param args
         * @returns {string} schedule id
         */
        scheduleLoop(task: any, args?: any): string;
        /**
         * schedule the task to the next speficied frame
         * @param task
         * @param {number} frame
         * @param args
         * @returns {string} schedule id
         */
        scheduleFrame(task: any, frame?: number, args?: any): string;
        /**
         * schedule the task to internal, like setInterval
         * @param task
         * @param time
         * @param args
         * @returns {string} schedule id
         */
        scheduleInterval(task: any, time?: number, args?: any): string;
        /**
         * schedule the task to time, like setTimeout
         * @param task
         * @param time
         * @param args
         * @returns {string} schedule id
         */
        scheduleTime(task: any, time?: number, args?: any): string;
        /**
         * resume the specified schedule
         * @param scheduleId
         */
        resumeSchedule(scheduleId: any): void;
        /**
         * pause the specified schedule
         * @param scheduleId
         */
        pauseSchedule(scheduleId: any): void;
    }
}
declare module WOZLLA {
    class GestureEvent extends WOZLLA.event.Event {
        x: number;
        y: number;
        touch: any;
        touchMoveDetection: boolean;
        gesture: any;
        identifier: any;
        constructor(params: any);
        setTouchMoveDetection(value: boolean): void;
    }
    /**
     * class for touch management <br/>
     * get the instance form {@link WOZLLA.Director}
     * @class WOZLLA.Touch
     * @protected
     */
    class Touch {
        private static enabledGestures;
        static setEanbledGestures(gestures: any): void;
        /**
         * get or set enabled of touch system
         * @property {boolean} enabled
         */
        enabled: boolean;
        inSchedule: boolean;
        canvas: HTMLCanvasElement;
        canvasOffset: any;
        touchScale: number;
        hammer: HammerManager;
        channelMap: {};
        constructor(canvas: HTMLCanvasElement, touchScale?: number);
        updateCanvasOffset(): void;
        onGestureEvent(e: any): void;
        createDispatchChanel(touchTarget: any): {
            onGestureEvent: (e: any, target: any, x: any, y: any, identifier: any) => void;
        };
    }
}
declare module WOZLLA.renderer {
    /**
     * @class WOZLLA.renderer.WebGLUtils
     * @abstract
     */
    class WebGLUtils {
        static getGLContext(canvas: any, options?: any): any;
        static compileShader(gl: any, shaderType: any, shaderSrc: any): any;
        static compileProgram(gl: any, vertexSrc: any, fragmentSrc: any): {
            program: any;
            vertexShader: any;
            fragmentShader: any;
        };
    }
}
declare module WOZLLA.renderer {
    /**
     * @class WOZLLA.renderer.ILayerManager
     * @abstract
     */
    interface ILayerManager {
        define(layer: string, zindex: number): void;
        undefine(layer: string): void;
        getZIndex(layer: string): number;
        getSortedLayers(): Array<string>;
    }
    module ILayerManager {
        /**
         * @property {string} DEFAULT
         * @readonly
         * @static
         * @member WOZLLA.renderer.ILayerManager
         */
        var DEFAULT: string;
    }
}
declare module WOZLLA.renderer {
    /**
     * @class WOZLLA.renderer.LayerManager
     * @extends WOZLLA.renderer.ILayerManager
     */
    class LayerManager implements ILayerManager {
        _layerIndexMap: any;
        _sortedLayers: any;
        constructor();
        define(layer: string, zindex: number): void;
        undefine(layer: string): void;
        getZIndex(layer: string): number;
        getSortedLayers(): Array<string>;
        _getSortedLayers(): Array<string>;
    }
}
declare module WOZLLA.renderer {
    /**
     * @class WOZLLA.renderer.BlendType
     */
    class BlendType {
        static NORMAL: number;
        static ADD: number;
        static MULTIPLY: number;
        static SCREEN: number;
        srcFactor: any;
        distFactor: any;
        _srcFactor: any;
        _distFactor: any;
        constructor(srcFactor: any, distFactor: any);
        applyBlend(gl: any): void;
    }
}
declare module WOZLLA.renderer {
    /**
     * @class WOZLLA.renderer.Material
     * @extends WOZLLA.renderer.IMaterial
     */
    class Material implements IMaterial {
        id: any;
        shaderProgramId: string;
        blendType: number;
        _id: any;
        _shaderProgramId: string;
        _blendType: number;
        constructor(id: any, shaderProgramId: string, blendType: number);
        equals(other: IMaterial): boolean;
    }
}
declare module WOZLLA.renderer {
    /**
     * @class WOZLLA.renderer.IMaterial
     * @abstract
     */
    interface IMaterial {
        id: string;
        shaderProgramId: string;
        blendType: number;
        equals(other: IMaterial): boolean;
    }
    module IMaterial {
        /**
         * default material key of built-in
         * @property {string} DEFAULT
         * @readonly
         * @static
         * @member WOZLLA.renderer.IMaterial
         */
        var DEFAULT: string;
    }
}
declare module WOZLLA.renderer {
    /**
     * @class WOZLLA.renderer.IShaderProgram
     * @abstract
     */
    interface IShaderProgram {
        id: any;
        vertexShader: any;
        fragmentShader: any;
        useProgram(gl: any): void;
        syncUniforms(gl: any, uniforms: {
            projection;
        }): any;
    }
    module IShaderProgram {
        /**
         * @property {string} V2T2C1A1
         * @readonly
         * @static
         * @member WOZLLA.renderer.IShaderProgram
         */
        var V2T2C1A1: string;
    }
}
declare module WOZLLA.renderer {
    /**
     * @class WOZLLA.renderer.MaterialManager
     * @extends WOZLLA.renderer.IMaterialManager
     */
    class MaterialManager implements IMaterialManager {
        _materialMap: {};
        constructor();
        createMaterial(id: string, shaderProgramId: string, blendType: number): IMaterial;
        getMaterial(id: string): IMaterial;
        deleteMaterial(material: IMaterial): void;
        clear(): void;
    }
}
declare module WOZLLA.renderer {
    /**
     * @class WOZLLA.renderer.ShaderProgram
     * @extends WOZLLA.renderer.IShaderProgram
     */
    class ShaderProgram implements IShaderProgram {
        id: any;
        vertexShader: any;
        fragmentShader: any;
        _id: any;
        _vertexShader: any;
        _fragmentShader: any;
        constructor(id: any, vertexShader: any, fragmentShader: any);
        useProgram(gl: any): void;
        syncUniforms(gl: any, uniforms: {
            projection;
        }): void;
    }
}
declare module WOZLLA.renderer.shader {
    /**
     * @class WOZLLA.renderer.shader.V2T2C1A1
     */
    class V2T2C1A1 extends WOZLLA.renderer.ShaderProgram implements IShaderProgram {
        static VERTEX_SOURCE: string;
        static FRAGMENT_SOURCE: string;
        _locations: any;
        constructor(id: any, vertexShader: any, fragmentShader: any);
        useProgram(gl: any): void;
        syncUniforms(gl: any, uniforms: {
            projection;
        }): void;
        _initLocaitions(gl: any): void;
        _activate(gl: any): void;
    }
}
declare module WOZLLA.renderer {
    /**
     * @class WOZLLA.renderer.ShaderManager
     * @extends WOZLLA.renderer.IShaderManager
     */
    class ShaderManager implements IShaderManager {
        _gl: any;
        _shaderMap: any;
        constructor(gl: any);
        getShaderProgram(id: any): IShaderProgram;
        createShaderProgram(vertexSource: string, fragmentSource: string, ShaderClass?: Function): IShaderProgram;
        deleteShaderProgram(shaderProgram: IShaderProgram): void;
        clear(): void;
    }
}
declare module WOZLLA.renderer {
    /**
     * @class WOZLLA.renderer.Texture
     * @extends WOZLLA.renderer.ITexture
     */
    class Texture implements ITexture {
        id: any;
        descriptor: ITextureDescriptor;
        _id: any;
        _descriptor: ITextureDescriptor;
        constructor(id: any, descriptor: ITextureDescriptor);
        bind(gl: any): void;
    }
}
declare module WOZLLA.renderer {
    /**
     * @class WOZLLA.renderer.TextureManager
     * @extends WOZLLA.renderer.ITextureManager
     */
    class TextureManager implements ITextureManager {
        _gl: any;
        _textureMap: any;
        constructor(gl: any);
        getTexture(id: any): any;
        generateTexture(descriptor: ITextureDescriptor, textureId?: any): ITexture;
        updateTexture(texture: ITexture): void;
        deleteTexture(texture: ITexture): void;
        clear(): void;
    }
}
declare module WOZLLA.renderer {
    class Renderer implements IRenderer {
        static MAX_QUAD_SIZE: number;
        layerManager: ILayerManager;
        materialManager: IMaterialManager;
        shaderManager: IShaderManager;
        textureManager: ITextureManager;
        gl: any;
        viewport: any;
        _gl: any;
        _viewport: any;
        _layerManager: LayerManager;
        _materialManager: IMaterialManager;
        _shaderManager: IShaderManager;
        _textureManager: ITextureManager;
        _commandQueueMap: any;
        _blendModes: any;
        _usingMaterial: IMaterial;
        _usingTexture: ITexture;
        _uniforms: any;
        private _quadBatch;
        constructor(gl: any, viewport: any);
        addCommand(command: IRenderCommand): void;
        render(): void;
        flush(): void;
        _clearCommands(): void;
        _eachCommand(func: Function): void;
    }
}
declare module WOZLLA {
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
    class Director {
        private static instance;
        static getInstance(): Director;
        /**
         * get the canvas element
         * @property {any} view
         */
        view: any;
        /**
         * get the touch instance
         * @property {WOZLLA.Touch} touch
         * @readonly
         */
        touch: Touch;
        /**
         * get the stage instance
         * @property {WOZLLA.Stage} stage
         * @readonly
         */
        stage: Stage;
        /**
         * get the scheduler instance
         * @property {WOZLLA.Scheduler} scheduler
         * @readonly
         */
        scheduler: Scheduler;
        /**
         * get the renderer instance
         * @property {WOZLLA.renderer.IRenderer} renderer
         * @readonly
         */
        renderer: WOZLLA.renderer.IRenderer;
        /**
         * get the asset loader instance
         * @property {WOZLLA.assets.AssetLoader} assetLoader
         * @readonly
         */
        assetLoader: WOZLLA.assets.AssetLoader;
        /**
         * get the root instance of RectTransform
         * @returns {WOZLLA.RectTransform} viewRectTransform
         */
        viewRectTransform: WOZLLA.RectTransform;
        private _runing;
        private _paused;
        private _timeScale;
        private _view;
        private _touch;
        private _stage;
        private _renderer;
        private _scheduler;
        private _assetLoader;
        constructor(view: any, options?: any);
        /**
         *  start main loop
         */
        start(): void;
        /**
         * stop main loop
         */
        stop(): void;
        /**
         * run one frame
         * @param {number} [timeScale=1]
         */
        runStep(timeScale?: number): void;
    }
}
declare module WOZLLA.assets {
    /**
     * internal class
     * @class WOZLLA.assets.GLTextureAsset
     * @extends WOZLLA.assets.Asset
     * @abstract
     */
    class GLTextureAsset extends Asset {
        glTexture: renderer.ITexture;
        _glTexture: WOZLLA.renderer.ITexture;
        unload(): void;
        _generateTexture(image: HTMLImageElement): void;
        _generatePVRTexture(pvrSource: any): void;
    }
    class HTMLImageDescriptor implements WOZLLA.renderer.ITextureDescriptor {
        width: number;
        height: number;
        source: any;
        textureFormat: WOZLLA.renderer.TextureFormat;
        pixelFormat: WOZLLA.renderer.PixelFormat;
        _source: any;
        _textureFormat: WOZLLA.renderer.TextureFormat;
        _pixelFormat: WOZLLA.renderer.PixelFormat;
        constructor(source: any);
    }
    class PVRDescriptor implements WOZLLA.renderer.ITextureDescriptor {
        width: number;
        height: number;
        source: any;
        textureFormat: WOZLLA.renderer.TextureFormat;
        pixelFormat: WOZLLA.renderer.PixelFormat;
        _source: any;
        _textureFormat: WOZLLA.renderer.TextureFormat;
        _pixelFormat: WOZLLA.renderer.PixelFormat;
        constructor(source: any, pixelFormat: WOZLLA.renderer.PixelFormat);
    }
}
declare module WOZLLA.utils {
    /**
     * @class WOZLLA.utils.Ajax
     */
    class Ajax {
        /**
         * internal ajax error code when timeout
         * @property ERROR_TIMEOUT
         * @static
         * @readonly
         */
        static ERROR_TIMEOUT: number;
        /**
         * internal ajax error code when server error
         * @property ERROR_SERVER
         * @static
         * @readonly
         */
        static ERROR_SERVER: number;
        static ERROR_PARSE: number;
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
        static request(options?: any): void;
    }
}
declare module WOZLLA.assets {
    class JSONAsset extends Asset {
        _data: any;
        cloneData(): any;
        load(onSuccess: () => any, onError: (error) => any): void;
        unload(): void;
    }
}
declare module WOZLLA.assets.proxy {
    class AssetProxy {
        protected proxyTarget: IProxyTarget;
        protected asset: Asset;
        protected newAssetSrc: string;
        protected loading: boolean;
        constructor(proxyTarget: IProxyTarget);
        setAssetSrc(src: string): void;
        loadAsset(callback: Function): void;
        onDestroy(): void;
        protected checkDirty(): boolean;
        protected doLoad(callback: (asset: Asset) => void): void;
    }
    interface IProxyTarget {
        onAssetLoaded(asset: Asset): any;
    }
}
declare module WOZLLA.assets.proxy {
    class SpriteAtlasProxy extends AssetProxy {
        getSprite(spriteName: any): Sprite;
        getFrameLength(): number;
        protected doLoad(callback: (asset: Asset) => void): void;
    }
}
declare module WOZLLA.assets {
    /**
     * an sprite is a part of a sprite atlas
     * @class WOZLLA.assets.Sprite
     * <br/>
     * see also: <br/>
     * {@link WOZLLA.assets.SpriteAtlas}<br/>
     */
    class Sprite {
        /**
         * get the sprite atlas of this sprite belongs to
         * @property {WOZLLA.assets.SpriteAtlas} spriteAltas
         * @readonly
         */
        spriteAtlas: SpriteAtlas;
        /**
         * get frame info
         * @property {any} frame
         * @readonly
         */
        frame: any;
        /**
         * get sprite name
         * @property {string} name
         * @readonly
         */
        name: string;
        _spriteAtlas: SpriteAtlas;
        _frame: any;
        _name: string;
        /**
         * new a sprite
         * @method constructor
         * @param spriteAtlas
         * @param frame
         * @param name
         */
        constructor(spriteAtlas: SpriteAtlas, frame: any, name?: any);
    }
}
declare module WOZLLA.assets {
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
    class SpriteAtlas extends GLTextureAsset {
        /**
         * @property {string} imageSrc
         * @readonly
         */
        imageSrc: string;
        /**
         * an file url descript sprite atlas infos.
         * @property {string} metaSrc
         * @readonly
         */
        metaSrc: string;
        /**
         * @property {any} sourceImage
         * @readonly
         */
        sourceImage: any;
        /**
         * @property {any} spriteData
         * @readonly
         */
        spriteData: any;
        _imageSrc: string;
        _metaSrc: string;
        _sourceImage: any;
        _entireSprite: Sprite;
        _spriteData: any;
        _spriteCache: any;
        _frameLengthCache: number;
        getFrameLength(): number;
        /**
         * get sprite by name
         * @param name
         * @returns {WOZLLA.assets.Sprite}
         */
        getSprite(name?: any): Sprite;
        /**
         * load this asset
         * @param onSuccess
         * @param onError
         */
        load(onSuccess: () => any, onError: (error) => any): void;
        _loadImage(callback: (error: string, image?) => any): void;
        _loadSpriteAtlas(callback: (error: string, image?, spriteData?) => any): void;
    }
}
declare module WOZLLA.math {
    /**
     * @class WOZLLA.math.Rectangle
     *  a utils class for rectangle, provider some math methods
     */
    class Rectangle {
        x: number;
        y: number;
        width: number;
        height: number;
        /**
         * @property {number} left x
         * @readonly
         */
        left: number;
        /**
         * @property {number} right x+width
         * @readonly
         */
        right: number;
        /**
         * @property {number} top y
         * @readonly
         */
        top: number;
        /**
         * @property {number} bottom y+height
         * @readonly
         */
        bottom: number;
        constructor(x: number, y: number, width: number, height: number);
        /**
         * @method containsXY
         * @param x
         * @param y
         * @returns {boolean}
         */
        containsXY(x: number, y: number): boolean;
        /**
         * get simple description of this object
         * @returns {string}
         */
        toString(): string;
    }
}
declare module WOZLLA.component {
    class PropertyConverter {
        static array2point(arr: Array<number>): WOZLLA.math.Point;
        static array2rect(arr: Array<number>): WOZLLA.math.Rectangle;
        static array2circle(arr: Array<number>): WOZLLA.math.Circle;
        static json2TextStyle(json: any): TextStyle;
        static array2Padding(arr: Array<number>): WOZLLA.layout.Padding;
        static array2Margin(arr: Array<number>): WOZLLA.layout.Margin;
    }
}
declare module WOZLLA.component {
    class PropertySnip {
        static createRect(propertyName: any): {
            name: any;
            type: string;
            convert: (arr: number[]) => math.Rectangle;
            defaultValue: number[];
        };
        static createCircle(propertyName: any): {
            name: any;
            type: string;
            convert: (arr: number[]) => math.Circle;
            defaultValue: number[];
        };
        static createSpriteFrame(propertName: any, fromSpriteAtlas?: string): {
            name: any;
            type: string;
            defaultValue: string;
            data: {
                fromSpriteAtlas: string;
            };
        };
    }
}
declare module WOZLLA.component {
    /**
     * @class WOZLLA.component.CircleCollider
     */
    class CircleCollider extends WOZLLA.Collider {
        region: WOZLLA.math.Circle;
        collideXY(localX: number, localY: number): boolean;
        collide(collider: Collider): boolean;
    }
}
declare module WOZLLA.component {
    /**
     * @class WOZLLA.component.MaskCollider
     */
    class MaskCollider extends WOZLLA.Collider {
        collideXY(localX: number, localY: number): boolean;
        collide(collider: Collider): boolean;
    }
}
declare module WOZLLA.component {
    /**
     * @class WOZLLA.component.RectCollider
     */
    class RectCollider extends WOZLLA.Collider {
        static fromSpriteRenderer(spriteRenderer: SpriteRenderer): RectCollider;
        region: WOZLLA.math.Rectangle;
        collideXY(localX: number, localY: number): boolean;
        collide(collider: Collider): boolean;
    }
}
declare module WOZLLA.renderer {
    /**
     * @class WOZLLA.renderer.RenderCommandBase
     * @abstract
     */
    class RenderCommandBase implements IRenderCommand {
        globalZ: number;
        layer: string;
        _globalZ: number;
        _layer: string;
        _addIndex: number;
        constructor(globalZ: number, layer: string);
    }
}
declare module WOZLLA.renderer {
    /**
     * @class WOZLLA.renderer.CustomCommand
     * @extends WOZLLA.renderer.RenderCommandBase
     */
    class CustomCommand extends RenderCommandBase {
        constructor(globalZ: number, layer: string);
        execute(renderer: IRenderer): void;
    }
}
declare module WOZLLA {
    /**
     * Base class for all mask, mask is based on webgl stencil.
     * @class WOZLLA.Mask
     * @extends WOZLLA.Component
     * @abstract
     */
    class Mask extends Component {
        reverse: boolean;
        startGlobalZ: number;
        endGlobalZ: number;
        layer: string;
        _startGlobalZ: number;
        _endGlobalZ: number;
        _maskLayer: string;
        /**
         * set mask range, mask range is effect on globalZ of render commmand
         * @param start
         * @param end
         * @param layer
         */
        setMaskRange(start: number, end: number, layer?: string): void;
        /**
         * render this mask
         * @param renderer
         * @param flags
         */
        render(renderer: WOZLLA.renderer.IRenderer, flags: number): void;
        /**
         * do render mask graphics
         * @param renderer
         * @param flags
         */
        protected renderMask(renderer: WOZLLA.renderer.IRenderer, flags: number): void;
    }
}
declare module WOZLLA {
    /**
     * Abstract base class for Renderer component
     * @class WOZLLA.Renderer
     * @abstract
     */
    class Renderer extends Component {
        /**
         * render this object
         * @param renderer
         * @param flags
         */
        render(renderer: WOZLLA.renderer.IRenderer, flags: number): void;
    }
}
declare module WOZLLA.renderer {
    /**
     * @class WOZLLA.renderer.QuadType
     */
    class QuadType {
        size: number;
        strade: any;
        vertexIndex: any;
        texCoordIndex: any;
        alphaIndex: any;
        colorIndex: any;
        _info: any;
        constructor(info: any);
    }
    /**
     * @class WOZLLA.renderer.Quad
     */
    class Quad {
        static V2T2C1A1: QuadType;
        storage: number[];
        count: number;
        type: QuadType;
        renderOffset: number;
        renderCount: number;
        _storage: number[];
        _count: number;
        _type: QuadType;
        _renderOffset: number;
        _renderCount: number;
        constructor(count: number, type?: QuadType);
        setRenderRange(offset: number, count: number): void;
        setVertices(x1: any, y1: any, x2: any, y2: any, x3: any, y3: any, x4: any, y4: any, offset?: number): void;
        setTexCoords(x1: any, y1: any, x2: any, y2: any, x3: any, y3: any, x4: any, y4: any, offset?: number): void;
        setAlpha(alpha: number, offset?: number): void;
        setColor(color: any, offset?: number): void;
    }
}
declare module WOZLLA.utils {
    interface Poolable {
        isPoolable: boolean;
        release(): any;
    }
    class ObjectPool<T extends Poolable> {
        _minCount: any;
        _factory: any;
        _pool: Array<T>;
        constructor(minCount: number, factory: () => T);
        retain(): T;
        release(obj: T): void;
    }
}
declare module WOZLLA.renderer {
    /**
     * @class WOZLLA.renderer.QuadCommand
     * @extends WOZLLA.renderer.RenderCommandBase
     */
    class QuadCommand extends RenderCommandBase implements WOZLLA.utils.Poolable {
        static init(globalZ: number, layer: string, texture: ITexture, materialId: string, quad: Quad): QuadCommand;
        isPoolable: boolean;
        texture: ITexture;
        materialId: string;
        quad: Quad;
        _texture: ITexture;
        _materialId: string;
        _quad: Quad;
        constructor(globalZ: number, layer: string);
        initWith(globalZ: number, layer: string, texture: ITexture, materialId: string, quad: any): void;
        release(): void;
    }
}
declare module WOZLLA.component {
    /**
     * @class WOZLLA.component.QuadRenderer
     * @abstract
     */
    class QuadRenderer extends WOZLLA.Renderer {
        _quad: WOZLLA.renderer.Quad;
        _quadLayer: string;
        _quadMaterialId: string;
        _quadGlobalZ: number;
        _quadAlpha: number;
        _quadColor: number;
        _quadVertexDirty: boolean;
        _quadAlphaDirty: boolean;
        _quadColorDirty: boolean;
        _texture: WOZLLA.renderer.ITexture;
        _textureOffset: any;
        _textureFrame: any;
        _textureUVS: any;
        _textureUpdated: boolean;
        setQuadRenderRange(offset: number, count: number): void;
        setQuadGlobalZ(globalZ: number): void;
        setQuadLayer(layer: string): void;
        setQuadMaterialId(materialId: string): void;
        setQuadAlpha(alpha: number): void;
        setQuadColor(color: number): void;
        setTexture(texture: WOZLLA.renderer.ITexture): void;
        setTextureFrame(frame: any): void;
        setTextureOffset(offset: any): void;
        init(): void;
        render(renderer: WOZLLA.renderer.IRenderer, flags: number): void;
        _initQuad(): void;
        _getTextureFrame(): any;
        _getTextureOffset(): any;
        _getTextureUVS(): any;
        _updateQuad(quadIndex?: number): void;
        _updateQuadVertices(quadIndex?: number): void;
        _updateQuadVerticesByArgs(uvs: any, frame: any, offset: any, matrix: any, quadIndex?: number): void;
        _clearQuadVertices(quadIndex?: number): void;
        _updateQuadAlpha(quadIndex?: number): void;
        _updateQuadColor(quadIndex?: number): void;
    }
}
declare module WOZLLA.component {
    /**
     * @class WOZLLA.component.RectMask
     */
    class RectMask extends Mask {
        region: WOZLLA.math.Rectangle;
        _helperGameObject: WOZLLA.GameObject;
        _region: WOZLLA.math.Rectangle;
        _maskQuadRenderer: any;
        protected renderMask(renderer: WOZLLA.renderer.IRenderer, flags: number): void;
        private _initMaskQuadRenderer(renderer);
    }
}
declare module WOZLLA.component {
    class CanvasRenderer extends QuadRenderer {
        canvasSize: WOZLLA.math.Size;
        canvasWidth: number;
        canvasHeight: number;
        _canvas: any;
        _context: any;
        _canvasSize: WOZLLA.math.Size;
        _glTexture: any;
        _graphicsDirty: boolean;
        _sizeDirty: boolean;
        destroy(): void;
        draw(context: any): void;
        render(renderer: renderer.IRenderer, flags: number): void;
        clearCanvas(): void;
        protected initCanvas(): void;
        protected updateCanvas(): void;
        protected destroyCanvas(): void;
        protected generateCanvasTexture(renderer: renderer.IRenderer): void;
    }
}
declare module WOZLLA.component {
    class PrimitiveRenderer extends CanvasRenderer {
        primitiveStyle: PrimitiveStyle;
        _primitiveStyle: PrimitiveStyle;
        render(renderer: renderer.IRenderer, flags: number): void;
        draw(context: any): void;
        protected applyPrimitiveStyle(context: any): void;
        protected drawPrimitive(context: any): void;
        protected measurePrimitiveSize(): any;
    }
    class PrimitiveStyle {
        dirty: boolean;
        alpha: number;
        stroke: boolean;
        strokeColor: string;
        strokeWidth: number;
        fill: boolean;
        fillColor: string;
        _alpha: number;
        _stroke: boolean;
        _fill: boolean;
        _strokeColor: string;
        _strokeWidth: number;
        _fillColor: string;
    }
}
declare module WOZLLA.component {
    class CircleRenderer extends PrimitiveRenderer {
        circle: WOZLLA.math.Circle;
        _circle: WOZLLA.math.Circle;
        drawPrimitive(context: any): void;
        protected measurePrimitiveSize(): any;
        protected generateCanvasTexture(renderer: renderer.IRenderer): void;
    }
}
declare module WOZLLA.component {
    class RectRenderer extends PrimitiveRenderer {
        rect: WOZLLA.math.Rectangle;
        _rect: WOZLLA.math.Rectangle;
        drawPrimitive(context: any): void;
        protected measurePrimitiveSize(): any;
        protected generateCanvasTexture(renderer: renderer.IRenderer): void;
    }
}
declare module WOZLLA.component {
    /**
     * @class WOZLLA.component.SpriteRenderer
     */
    class SpriteRenderer extends QuadRenderer implements WOZLLA.assets.proxy.IProxyTarget {
        color: number;
        alpha: number;
        materialId: string;
        renderLayer: string;
        renderOrder: number;
        sprite: WOZLLA.assets.Sprite;
        spriteOffset: any;
        imageSrc: string;
        spriteAtlasSrc: string;
        spriteName: string;
        _spriteProxy: WOZLLA.assets.proxy.SpriteAtlasProxy;
        _sprite: WOZLLA.assets.Sprite;
        _spriteAtlasSrc: string;
        _spriteName: string;
        constructor();
        destroy(): void;
        onAssetLoaded(asset: WOZLLA.assets.Asset): void;
        loadAssets(callback: Function): void;
    }
}
declare module WOZLLA.component {
    class AnimationRenderer extends SpriteRenderer {
        static MODE_LOOP: string;
        static MODE_NONLOOP: string;
        autoOffset: boolean;
        frameNum: number;
        duration: number;
        playMode: string;
        frameLength: number;
        _frameNum: number;
        _frameNumDirty: boolean;
        _autoOffset: boolean;
        _playMode: string;
        _playing: boolean;
        _duration: number;
        _playTween: utils.Tween;
        play(duration?: number): void;
        pause(): void;
        resume(): void;
        stop(): void;
        render(renderer: WOZLLA.renderer.IRenderer, flags: number): void;
        protected updateAnimationFrame(): void;
    }
}
declare module WOZLLA.component {
    /**
     * @class WOZLLA.component.NinePatchRenderer
     */
    class NinePatchRenderer extends SpriteRenderer {
        renderRegion: WOZLLA.math.Rectangle;
        patch: WOZLLA.math.Rectangle;
        _patch: WOZLLA.math.Rectangle;
        _renderRegion: WOZLLA.math.Rectangle;
        _initQuad(): void;
        _updateNinePatchQuads(): void;
        _updateNinePatchQuadVertices(): void;
        _updateNinePatchQuadAlpha(): void;
        _updateNinePatchQuadColor(): void;
        render(renderer: WOZLLA.renderer.IRenderer, flags: number): void;
    }
}
declare module WOZLLA.component {
    /**
     * @class WOZLLA.component.SpriteFrameText
     */
    class SpriteFrameText extends SpriteRenderer {
        _textSample: string;
        _text: string;
    }
}
declare module WOZLLA.component {
    class TextRenderer extends CanvasRenderer {
        static measureText(style: TextStyle, text: string): {
            width: any;
            height: any;
        };
        text: string;
        textStyle: TextStyle;
        textWidth: number;
        textHeight: number;
        _textDirty: boolean;
        _text: string;
        _textStyle: TextStyle;
        render(renderer: renderer.IRenderer, flags: number): void;
        draw(context: any): void;
        protected drawText(context: any, measuredWidth: any, measuredHeight: any): void;
        protected measureTextSize(): any;
        protected generateCanvasTexture(renderer: renderer.IRenderer): void;
    }
    class TextStyle {
        static START: string;
        static CENTER: string;
        static END: string;
        static TOP: string;
        static MIDDLE: string;
        static BOTTOM: string;
        dirty: boolean;
        font: string;
        color: string;
        shadow: boolean;
        shadowColor: string;
        shadowOffsetX: number;
        shadowOffsetY: number;
        stroke: boolean;
        strokeColor: string;
        strokeWidth: number;
        align: string;
        baseline: string;
        _font: string;
        _color: string;
        _shadow: boolean;
        _shadowColor: string;
        _shadowOffsetX: number;
        _shadowOffsetY: number;
        _stroke: boolean;
        _strokeColor: string;
        _strokeWidth: number;
        _align: string;
        _baseline: string;
    }
}
declare module WOZLLA {
    /**
     * Abstract base class for all behaviours, the {@link WOZLLA.Behaviour#update} function would be call
     * by WOZLLA engine every frame when the gameObject is actived and the property enabled of this behaviour is true
     * @class WOZLLA.Behaviour
     * @extends WOZLLA.Component
     * @abstract
     */
    class Behaviour extends Component {
        /**
         * enabled or disabled this behaviour
         * @property {boolean} [enabled=true]
         */
        enabled: boolean;
        /**
         * call by Engine every frame
         * @method update
         */
        update(): void;
    }
}
declare module WOZLLA {
    /**
     * internal class
     * @class WOZLLA.CoreEvent
     * @extends WOZLLA.event.Event
     */
    class CoreEvent extends WOZLLA.event.Event {
        /**
         * new a CoreEvent
         * @method constructor
         * @param type
         * @param bubbles
         * @param data
         * @param canStopBubbles
         */
        constructor(type: string, bubbles?: boolean, data?: any, canStopBubbles?: boolean);
    }
}
declare module WOZLLA.jsonx {
    class JSONXBuilder {
        static Factory: Function;
        static create(): JSONXBuilder;
        private src;
        private data;
        private err;
        private root;
        private newCallback;
        private doLoad;
        private doInit;
        private loadCallback;
        private async;
        private uuidMap;
        getByUUID(uuid: any): any;
        setSync(): void;
        instantiateWithSrc(src: any, callback?: (root: WOZLLA.GameObject, done: Function) => void): JSONXBuilder;
        instantiateWithJSON(data: any, callback?: (root: WOZLLA.GameObject, done: Function) => void): JSONXBuilder;
        load(callback?: (root: WOZLLA.GameObject, done: Function) => void): JSONXBuilder;
        init(): JSONXBuilder;
        build(callback: (error: any, root: WOZLLA.GameObject) => void): void;
        protected _checkError(callback: (error: any, root: WOZLLA.GameObject) => void): boolean;
        protected _loadJSONData(callback: Function): void;
        protected _newGameObjectTree(callback: Function): void;
        protected _newGameObject(data: any, callback: (gameObj: WOZLLA.GameObject) => void): void;
        protected _newReferenceObject(data: any, callback: (gameObj: WOZLLA.GameObject) => void): void;
        protected _newComponent(compData: any, gameObj: WOZLLA.GameObject): WOZLLA.Component;
        protected _applyComponentProperties(component: any, properties: any, compData: any): void;
        protected _loadAssets(callback: Function): void;
        protected _init(): void;
    }
}
declare module WOZLLA.layout {
    class LayoutBase extends Behaviour {
        private _layoutRequired;
        init(): void;
        destroy(): void;
        doLayout(): void;
        requestLayout(): void;
        update(): void;
        protected onChildAdd(e: any): void;
        protected onChildRemove(e: any): void;
    }
}
declare module WOZLLA.math {
    /**
     * @class WOZLLA.math.Size
     * a util class contains width and height properties
     */
    class Size {
        width: number;
        height: number;
        /**
         * @method constructor
         * create a new instance of Size
         * @member WOZLLA.math.Size
         * @param {number} width
         * @param {number} height
         */
        constructor(width: number, height: number);
        /**
         * get simple description of this object
         * @returns {string}
         */
        toString(): string;
    }
}
declare module WOZLLA.layout {
    class Grid extends LayoutBase {
        listRequiredComponents(): Array<Function>;
        padding: Padding;
        itemMargin: Margin;
        _padding: Padding;
        _itemMargin: Margin;
        doLayout(): void;
        protected measureChildSize(child: GameObject, idx: number, size: WOZLLA.math.Size): void;
    }
}
declare module WOZLLA.layout {
    class Margin {
        top: number;
        left: number;
        bottom: number;
        right: number;
        constructor(top: number, left: number, bottom: number, right: number);
        equals(padding: Padding): boolean;
    }
}
declare module WOZLLA.layout {
    class Padding {
        top: number;
        left: number;
        bottom: number;
        right: number;
        constructor(top: number, left: number, bottom: number, right: number);
        equals(padding: Padding): boolean;
    }
}
declare module WOZLLA.layout {
    class VBox extends LayoutBase {
        padding: Padding;
        itemMargin: number;
        _padding: Padding;
        _itemMargin: number;
        doLayout(): void;
        protected measureChildHeight(child: GameObject, idx: number): number;
    }
}
declare module WOZLLA.math {
    /**
     * @class WOZLLA.math.Circle
     * a util class for circle
     */
    class Circle {
        centerX: number;
        centerY: number;
        radius: number;
        constructor(centerX: number, centerY: number, radius: number);
        /**
         * @method containsXY
         * @param x
         * @param y
         * @returns {boolean}
         */
        containsXY(x: number, y: number): boolean;
        /**
         * get simple description of this object
         * @returns {string}
         */
        toString(): string;
    }
}
declare module WOZLLA.math {
    module MathUtils {
        function rectIntersect(a: any, b: any): boolean;
        function rectIntersect2(ax: any, ay: any, aw: any, ah: any, bx: any, by: any, bw: any, bh: any): boolean;
    }
}
declare module WOZLLA.math {
    /**
     * @class WOZLLA.math.Point
     * a util class contains x and y properties
     */
    class Point {
        x: number;
        y: number;
        /**
         * @method constructor
         * create a new instance of Point
         * @member WOZLLA.math.Point
         * @param {number} x
         * @param {number} y
         */
        constructor(x: number, y: number);
        /**
         * get simple description of this object
         * @returns {string}
         */
        toString(): string;
    }
}
declare module WOZLLA.renderer {
    /**
     * @class WOZLLA.renderer.IMaterialManager
     * @abstract
     */
    interface IMaterialManager {
        createMaterial(id: string, shaderProgramId: string, blendType: number): IMaterial;
        getMaterial(id: string): IMaterial;
        deleteMaterial(material: IMaterial): void;
        clear(): void;
    }
    module IMaterialManager {
        /**
         * @property DOC
         * @readonly
         * @static
         * @member WOZLLA.renderer.IMaterialManager
         */
        var DOC: string;
    }
}
declare module WOZLLA.renderer {
    /**
     * @class WOZLLA.renderer.IRenderCommand
     * @abstract
     */
    interface IRenderCommand {
        globalZ: number;
        layer: string;
        _addIndex: number;
    }
}
declare module WOZLLA.renderer {
    /**
     * @class WOZLLA.renderer.IShaderManager
     * @abstract
     */
    interface IShaderManager {
        createShaderProgram(vertexSource: string, fragmentSource: string, ShaderClass: Function): IShaderProgram;
        getShaderProgram(id: any): IShaderProgram;
        deleteShaderProgram(shaderProgram: IShaderProgram): void;
        clear(): void;
    }
    module IShaderManager {
        /**
         * @property DOC
         * @readonly
         * @static
         * @member WOZLLA.renderer.IShaderManager
         */
        var DOC: string;
    }
}
declare module WOZLLA.renderer {
    /**
     * @enum WOZLLA.renderer.TextureFormat
     */
    enum TextureFormat {
        /** @property {number} [PNG] */
        PNG = 0,
        /** @property {number} [JPEG] */
        JPEG = 1,
        /** @property {number} [PVR] */
        PVR = 2,
    }
    /**
     * @enum WOZLLA.renderer.PixelFormat
     */
    enum PixelFormat {
        /** @property {number} [RPGA8888] */
        RGBA8888 = 0,
        /** @property {number} [RGBA4444] */
        RGBA4444 = 1,
        /** @property {number} [RGB888] */
        RGB888 = 2,
        /** @property {number} [RGB565] */
        RGB565 = 3,
        /** @property {number} [PVRTC4] */
        PVRTC4 = 4,
        /** @property {number} [PVRTC2] */
        PVRTC2 = 5,
    }
    /**
     * @class WOZLLA.renderer.ITextureDescriptor
     * @abstract
     */
    interface ITextureDescriptor {
        width: number;
        height: number;
        textureFormat: TextureFormat;
        pixelFormat: PixelFormat;
        source: any;
    }
}
declare module WOZLLA.renderer {
    /**
     * @class WOZLLA.renderer.ITextureManager
     * @abstract
     */
    interface ITextureManager {
        generateTexture(descriptor: ITextureDescriptor): ITexture;
        updateTexture(texture: ITexture): void;
        deleteTexture(texture: ITexture): void;
        getTexture(id: any): ITexture;
        clear(): void;
    }
    module ITextureManager {
        /**
         * @property DOC
         * @readonly
         * @static
         * @member WOZLLA.renderer.ITextureManager
         */
        var DOC: string;
    }
}
declare module WOZLLA.renderer {
    /**
     * @class WOZLLA.renderer.WebGLExtension
     */
    class WebGLExtension {
        static VENDOR_WEBKIT: string;
        static PVRTC: string;
        static COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: number;
        static COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: number;
        static getExtension(gl: any, extName: any, doThrow?: boolean): any;
    }
}
declare module WOZLLA.utils {
    class StateMachine extends WOZLLA.event.EventDispatcher {
        static INIT: string;
        static CHANGE: string;
        _defaultState: string;
        _currentState: string;
        _currentTransition: ITransition;
        _stateConfig: any;
        defineState(name: string, isDefault?: boolean): void;
        getStateData(state: string, key: string): any;
        setStateData(state: string, key: string, data: any): void;
        defineTransition(fromState: string, toState: string, transition: ITransition): void;
        init(): void;
        getCurrentState(): string;
        changeState(state: string): void;
    }
    class StateEventData {
        state: string;
        constructor(state: string);
    }
    interface ITransition {
        reset(): any;
        cancel(): any;
        execute(fromState: string, toState: string, onComplete: Function): any;
    }
    class EmptyTransition implements ITransition {
        private static instance;
        static getInstance(): EmptyTransition;
        _canceled: boolean;
        reset(): void;
        cancel(): void;
        execute(fromState: string, toState: string, onComplete: Function): void;
    }
}
declare module WOZLLA.ui {
    /**
     * @class WOZLLA.ui.StateWidget
     * @protected
     */
    class StateWidget extends WOZLLA.component.SpriteRenderer {
        _stateMachine: WOZLLA.utils.StateMachine;
        constructor();
        init(): void;
        protected initStates(): void;
        protected getStateSpriteName(state: string): string;
        protected setStateSpriteName(state: string, spriteName: string): void;
        protected onStateChange(e: any): void;
    }
}
declare module WOZLLA.ui {
    /**
     * @class WOZLLA.ui.Button
     */
    class Button extends StateWidget {
        static STATE_NORMAL: string;
        static STATE_DISABLED: string;
        static STATE_PRESSED: string;
        normalSpriteName: string;
        disabledSpriteName: string;
        pressedSpriteName: string;
        init(): void;
        destroy(): void;
        isEnabled(): boolean;
        setEnabled(enabled?: boolean): void;
        protected initStates(): void;
        protected onTouch(e: any): void;
        protected onRelease(e: any): void;
        protected onTap(e: any): void;
    }
}
declare module WOZLLA.ui {
    /**
     * @class WOZLLA.ui.CheckBox
     */
    class CheckBox extends StateWidget {
        static STATE_UNCHECKED: string;
        static STATE_CHECKED: string;
        static STATE_DISABLED: string;
        uncheckedSpriteName: string;
        disabledSpriteName: string;
        checkedSpriteName: string;
        init(): void;
        destroy(): void;
        isEnabled(): boolean;
        setEnabled(enabled?: boolean): void;
        protected initStates(): void;
        protected onTap(e: any): void;
    }
}
declare module WOZLLA.ui {
    class ScrollRect extends Behaviour {
        static globalScrollEnabled: boolean;
        static HORIZONTAL: string;
        static VERTICAL: string;
        static BOTH: string;
        direction: string;
        enabled: boolean;
        content: string;
        visibleWidth: number;
        visibleHeight: number;
        contentWidth: number;
        contentHeight: number;
        bufferBackEnabled: boolean;
        momentumEnabled: boolean;
        _direction: string;
        _enabled: boolean;
        _bufferBackEnabled: boolean;
        _momentumEnabled: boolean;
        _content: string;
        _dragMovedInLastSession: boolean;
        _values: {
            velocityX: number;
            velocityY: number;
            momentumX: number;
            momentumY: number;
            lastDragX: number;
            lastDragY: number;
            momentumXTween: any;
            momentumYTween: any;
            bufferXTween: any;
            bufferYTween: any;
        };
        _contentGameObject: GameObject;
        listRequiredComponents(): Array<Function>;
        init(): void;
        destroy(): void;
        update(): void;
        isScrollable(): boolean;
        protected getMinScrollX(): number;
        protected getMinScrollY(): number;
        protected onDragStart(e: any): void;
        protected onDrag(e: any): void;
        protected onDragEnd(e: any): void;
        protected tryBufferBackX(): boolean;
        protected tryBufferBackY(): boolean;
    }
}
declare module WOZLLA.utils {
    class Ease {
        static get(amount: any): Function;
        static getPowIn(pow: any): Function;
        static getPowOut(pow: any): Function;
        static getPowInOut(pow: any): Function;
        static quadIn: Function;
        static quadOut: Function;
        static quadInOut: Function;
        static cubicIn: Function;
        static cubicOut: Function;
        static cubicInOut: Function;
        static quartIn: Function;
        static quartOut: Function;
        static quartInOut: Function;
        static quintIn: Function;
        static quintOut: Function;
        static quintInOut: Function;
        static sineIn(t: any): number;
        static sineOut(t: any): number;
        static sineInOut(t: any): number;
        static getBackIn(amount: any): Function;
        static backIn: Function;
        static getBackOut(amount: any): Function;
        static backOut: Function;
        static getBackInOut(amount: any): Function;
        static backInOut: Function;
        static circIn(t: any): number;
        static circOut(t: any): number;
        static circInOut(t: any): number;
        static bounceIn(t: any): number;
        static bounceOut(t: any): number;
        static bounceInOut(t: any): number;
        static getElasticIn(amplitude: any, period: any): Function;
        static elasticIn: Function;
        static getElasticOut(amplitude: any, period: any): Function;
        static elasticOut: Function;
        static getElasticInOut(amplitude: any, period: any): Function;
        static elasticInOut: Function;
        static linear(t: any): any;
        static expoIn(time: any): number;
        static expoOut(time: any): number;
        static expoInOut(time: any): any;
        static keyMap: {
            0: string;
            1: string;
            2: string;
            3: string;
            4: string;
            5: string;
            6: string;
            7: string;
            8: string;
            9: string;
            10: string;
            11: string;
            12: string;
            13: string;
            14: string;
            15: string;
            16: string;
            17: string;
            18: string;
            19: string;
            20: string;
            21: string;
            22: string;
            23: string;
            24: string;
            25: string;
            26: string;
            27: string;
            28: string;
            29: string;
            30: string;
        };
        static getByKey(key: any): any;
    }
}
