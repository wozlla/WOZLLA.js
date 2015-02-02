/// <reference path="Transform.ts"/>
/// <reference path="RectTransform.ts"/>
/// <reference path="Collider.ts"/>
/// <reference path="../event/EventDispatcher.ts"/>

module WOZLLA {

    var comparator = function(a:GameObject, b:GameObject) {
        return a.z - b.z;
    };

    var idMap:any = {};

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
    export class GameObject extends WOZLLA.event.EventDispatcher {

        public static MASK_TRANSFORM_DIRTY:number = 0x1;
        public static MASK_VISIBLE = 0x10;

        /**
         * return the GameObject with the specified id.
         * @method {WOZLLA.GameObject} getById
         * @static
         * @param id the specified id
         * @member WOZLLA.GameObject
         */
        public static getById(id:string):GameObject {
            return idMap[id];
        }

        /**
         * get or set the id of this game object
         * @property {string} id
         * @member WOZLLA.GameObject
         */
        get id():string { return this._id; }
        set id(value:string) {
            var oldId = this._id;
            this._id = value;
            if(oldId) {
                delete idMap[oldId];
            }
            idMap[value] = this;
        }

        /**
         * get or set the name of this game object
         * @property {string} name
         * @member WOZLLA.GameObject
         */
        get name():string { return this._name; }
        set name(value:string) { this._name = value; }

        /**
         * get transform of this game object
         * @property {WOZLLA.Transform} transform
         * @member WOZLLA.GameObject
         * @readonly
         */
        get transform():Transform { return this._transform; }

        /**
         * get rect transform of this game object
         * @property {WOZLLA.RectTransform} rectTransform
         * @member WOZLLA.GameObject
         * @readonly
         */
        get rectTransform():RectTransform { return this._rectTransform; }

        /**
         * get parent game object
         * @property {WOZLLA.GameObject} parent
         * @member WOZLLA.GameObject
         * @readonly
         */
        get parent():GameObject { return this._parent; }

        /**
         * get children of this game object
         * @property {WOZLLA.GameObject[]} children
         * @member WOZLLA.GameObject
         * @readonly
         */
        get children():GameObject[] { return this._children.slice(0); }

        /**
         * get raw children
         * @returns {WOZLLA.GameObject[]}
         */
        get rawChildren():GameObject[] { return this._children; }

        /**
         * get child count
         * @property {number} childCount
         * @member WOZLLA.GameObject
         * @readonly
         */
        get childCount():number { return this._children.length; }

        /**
         * get or set z order of this game object, and then resort children.
         * @property {number} z
         * @member WOZLLA.GameObject
         */
        get z():number { return this._z; }
        set z(value:number) {
            this.setZ(value, true);
        }

        /**
         * get or set active of this game object.
         * the update method would be call every frame when active was true, false otherwise.
         * if active is set from false to true, the transform dirty would be true.
         * @property {boolean} active
         * @member WOZLLA.GameObject
         */
        get active():boolean { return this._active; }
        set active(value:boolean) {
            var oldActive = this._active;
            this._active = value;
            if(!oldActive && value) {
                this._transform.dirty = true;
            }
        }

        /**
         * get visible of this game object.
         * the render method would be call every frame when visible and active both true.
         * @property {boolean} visible
         * @member WOZLLA.GameObject
         */
        get visible():boolean { return this._visible; }
        set visible(value:boolean) { this._visible = value; }

        /**
         * get initialized of this game object
         * @property {boolean} initialized
         * @member WOZLLA.GameObject
         * @readonly
         */
        get initialized():boolean { return this._initialized; }

        /**
         * get destroyed of this game object
         * @property {boolean} destroyed
         * @member WOZLLA.GameObject
         * @readonly
         */
        get destroyed():boolean { return this._destroyed; }

        /**
         * get or set touchable of this game object. identify this game object is interactive.
         * @property {boolean} touchable
         * @member WOZLLA.GameObject
         * @readonly
         */
        get touchable():boolean { return this._touchable; }
        set touchable(value:boolean) { this._touchable = value; }

        /**
         * get renderer component of this game object
         * @property {WOZLLA.Renderer} renderer
         * @member WOZLLA.GameObject
         * @readonly
         */
        get renderer():Renderer { return this._renderer; }

        /**
         * get collider of this game object
         * @property {WOZLLA.Collider} collider
         * @member WOZLLA.GameObject
         * @readonly
         */
        get collider():Collider { return this._collider; }

        /**
         * get behaviours of this game object
         * @property {WOZLLA.Behaviour[]} behaviours
         * @member WOZLLA.GameObject
         * @readonly
         */
        get behaviours():Behaviour[] { return this._behaviours.slice(0); }

        /**
         * get mask component of this game object
         * @property {WOZLLA.Mask} mask
         * @member WOZLLA.GameObject
         * @readonly
         */
        get mask():Mask { return this._mask; }

        _uuid:string;
        _id:string;
        _name;
        _active:boolean = true;
        _visible:boolean = true;
        _initialized:boolean = false;
        _destroyed:boolean = false;
        _touchable:boolean = false;
        _loadingAssets:boolean = false;
        _children:GameObject[];
        _components:Component[];
        _transform:Transform;
        _rectTransform:RectTransform;
        _parent:GameObject;
        _z:number;

        _renderer:Renderer;
        _collider:Collider;
        _behaviours:Behaviour[];
        _mask:Mask;

        /**
         * new a GameObject
         * @method constructor
         * @member WOZLLA.GameObject
         * @param {boolean} useRectTransform specify which transform this game object should be used.
         */
        constructor(useRectTransform:boolean=false) {
            super();
            this._name = 'GameObject';
            this._children = [];
            this._components = [];
            this._transform = useRectTransform ? new RectTransform() : new Transform();
            this._rectTransform = useRectTransform ? <RectTransform>this._transform : null;
            this._z = 0;

            this._behaviours = [];
        }

        /**
         * set z order
         * @param value
         * @param sort true is set to resort children
         */
        setZ(value:number, sort:boolean=true) {
            if(this._z === value) return;
            this._z = value;
            if(sort) {
                this._children.sort(comparator);
            }
        }

        /**
         * add a child game object, it would be fail when this game object has contains the child.
         * @param child
         * @param sort true is set to resort children
         * @returns {boolean} true is success to, false otherwise.
         */
        addChild(child:GameObject, sort:boolean=true):boolean {
            if(this._children.indexOf(child) !== -1) {
                return false;
            }
            if(child._parent) {
                child.removeMe();
            }
            child.dispatchEvent(new CoreEvent('beforeadd', false, {
                parent: this
            }));
            this._children.push(child);
            if(sort) {
                this._children.sort(comparator);
            }
            child._parent = this;
            child._transform.dirty = true;
            child.dispatchEvent(new CoreEvent('add', false));
            this.dispatchEvent(new CoreEvent('childadd', false, {
                child: child
            }));
            return true;
        }

        /**
         * remove the specified child.
         * @param child
         * @returns {boolean} true is success to, false otherwise.
         */
        removeChild(child:GameObject):boolean {
            var idx = this._children.indexOf(child);
            if(idx !== -1) {
                child.dispatchEvent(new CoreEvent('beforeremove', false));
                this._children.splice(idx, 1);
                child._parent = null;
                child.dispatchEvent(new CoreEvent('remove', false, {
                    parent: this
                }));
                this.dispatchEvent(new CoreEvent('childremove', false, {
                    child: child
                }));
                return true;
            }
            return false;
        }

        /**
         * get the first child with the specified name.
         * @param name
         * @returns {WOZLLA.GameObject}
         */
        getChild(name:string):GameObject {
            var child, i, len;
            for(i=0,len=this._children.length; i<len; i++) {
                child = this._children[i];
                if(child._name === name) {
                    return child;
                }
            }
            return null;
        }

        /**
         * get all children with the specified name.
         * @param name
         * @returns {Array}
         */
        getChildren(name:string):GameObject[] {
            var child, i, len;
            var result = [];
            for(i=0,len=this._children.length; i<len; i++) {
                child = this._children[i];
                if(child._name === name) {
                    result.push(child);
                }
            }
            return result;
        }

        /**
         * remove this game object from parent.
         * @returns {boolean}
         */
        removeMe():boolean {
            var parent = this._parent;
            return parent && parent.removeChild(this);
        }

        /**
         * iterator children of this game object
         * @param func interator function.
         */
        eachChild(func:(value: GameObject, index: number, array: GameObject[]) => any):void {
            this._children.forEach(func);
        }

        /**
         * sort children
         */
        sortChildren():void {
            this._children.sort(comparator);
        }

        /**
         * get path of this game object
         * @param split delimiter
         * @returns {string}
         */
        getPath(split:string='/'):string {
            var arr = [];
            var obj:GameObject = this;
            while(obj) {
                arr.unshift(obj.name);
                obj = obj.parent;
            }
            return arr.join(split);
        }

        /**
         * whether contains the specified game object of this tree structure.
         * @param child
         * @returns {boolean}
         */
        contains(child:GameObject):boolean {
            if(child === this) {
                return true;
            }
            var parent = child;
            while(parent = parent.parent) {
                if(parent === this) {
                    return true;
                }
            }
            return false;
        }

        /**
         * get first component of type of the specified Type(constructor).
         * @param Type
         * @returns {WOZLLA.Component}
         */
        getComponent(Type:Function):Component {
            var comp, i, len;
            if(this._components.length <= 0) {
                return null;
            }
            for(i=0,len=this._components.length; i<len; i++) {
                comp = this._components[i];
                if(comp instanceof Type) {
                    return comp;
                }
            }
            return null;
        }

        /**
         * @method hasComponent
         * @param Type
         * @returns {boolean}
         */
        hasComponent(Type:Function):boolean {
            var comp, i, len;
            if(Type === RectTransform) {
                return !!this._rectTransform;
            }
            if(this._components.length <= 0) {
                return false;
            }
            for(i=0,len=this._components.length; i<len; i++) {
                comp = this._components[i];
                if(comp instanceof Type) {
                    return true;
                }
            }
            return false;
        }

        /**
         * get all components of type of Type(constructor).
         * @param Type
         * @returns {Array}
         */
        getComponents(Type:Function):Component[] {
            var comp, i, len;
            var result = [];
            if(this._components.length <= 0) {
                return result;
            }
            for(i=0,len=this._components.length; i<len; i++) {
                comp = this._components[i];
                if(comp instanceof Type) {
                    result.push(comp);
                }
            }
            return result;
        }

        /**
         * add componen to this game object. this method would check component dependency
         * by method of component's listRequiredComponents.
         * @param comp
         * @returns {boolean}
         */
        addComponent(comp:Component):boolean {
            if(this._components.indexOf(comp) !== -1) {
                return false;
            }
            this.checkComponentDependency(comp);
            if(comp._gameObject) {
                comp._gameObject.removeComponent(comp);
            }
            this._components.push(comp);
            comp._gameObject = this;
            if(comp instanceof Behaviour) {
                this._behaviours.push(<Behaviour>comp);
            } else if(comp instanceof Renderer) {
                this._renderer = <Renderer>comp;
            } else if(comp instanceof Collider) {
                this._collider = <Collider>comp;
            } else if(comp instanceof Mask) {
                this._mask = <Mask>comp;
            }
            return true;
        }

        /**
         * remove the specified component
         * @param comp
         * @returns {boolean}
         */
        removeComponent(comp:Component):boolean {
            var i, len, otherComp;
            var idx = this._components.indexOf(comp);
            if(idx !== -1) {
                for(i=0,len=this._components.length; i<len; i++) {
                    otherComp = this._components[i];
                    if(otherComp !== comp) {
                        this.checkComponentDependency(otherComp, true);
                    }
                }
                this._components.splice(idx, 1);
                if(comp instanceof Behaviour) {
                    this._behaviours.splice(this._behaviours.indexOf(<Behaviour>comp), 1);
                } else if(comp instanceof Renderer) {
                    this._renderer = null;
                } else if(comp instanceof Collider) {
                    this._collider = null;
                } else if(comp instanceof Mask) {
                    this._mask = null;
                }
                comp._gameObject = null;
                return true;
            }
            return false;
        }

        /**
         * init this game object.
         */
        init():void {
            var i, len;
            if(this._initialized || this._destroyed) return;
            for(i=0,len=this._components.length; i<len; i++) {
                this._components[i].init();
            }
            for(i=0,len=this._children.length; i<len; i++) {
                this._children[i].init();
            }
            this._initialized = true;
        }

        /**
         * destroy this game object.
         */
        destroy():void {
            var i, len;
            if(this._destroyed || !this._initialized) return;
            for(i=0,len=this._components.length; i<len; i++) {
                this._components[i].destroy();
            }
            for(i=0,len=this._children.length; i<len; i++) {
                this._children[i].destroy();
            }
            if(this._id) {
                delete idMap[this._id];
            }
            this.clearAllListeners();
            this._destroyed = true;
        }

        /**
         * call every frame when active was true.
         */
        update():void {
            var i, len, behaviour;
            if(!this._active) return;
            if(this._behaviours.length > 0) {
                for (i = 0, len = this._behaviours.length; i < len; i++) {
                    behaviour = this._behaviours[i];
                    behaviour.enabled && behaviour.update();
                }
            }
            if(this._children.length > 0) {
                for (i = 0, len = this._children.length; i < len; i++) {
                    this._children[i].update();
                }
            }
        }

        /**
         * visit this game object and it's all chidlren, children of children.
         * @param renderer
         * @param parentTransform
         * @param flags
         */
        visit(renderer:WOZLLA.renderer.IRenderer, parentTransform:Transform, flags:number):number {
            var i, len;
            if(!this._active || !this._initialized || this._destroyed) {
                if((flags & GameObject.MASK_TRANSFORM_DIRTY) === GameObject.MASK_TRANSFORM_DIRTY) {
                    this._transform.dirty = true;
                }
                return;
            }
            if(this._transform.dirty) {
                flags |= GameObject.MASK_TRANSFORM_DIRTY;
            }
            if((flags & GameObject.MASK_TRANSFORM_DIRTY) == GameObject.MASK_TRANSFORM_DIRTY) {
                this._transform.transform(parentTransform);
            }

            if(!this._visible) {
                flags &= (~GameObject.MASK_VISIBLE);
            }

            if((flags & GameObject.MASK_VISIBLE) === GameObject.MASK_VISIBLE) {
                this.render(renderer, flags);
            }

            for(i=0,len=this._children.length; i<len; i++) {
                this._children[i].visit(renderer, this._transform, flags);
            }

            return flags;
        }

        /**
         * render this game object
         * @param renderer
         * @param flags
         */
        render(renderer:WOZLLA.renderer.IRenderer, flags:number) {
            this._mask && this._mask.render(renderer, flags);
            this._renderer && this._renderer.render(renderer, flags);
        }

        /**
         * get a game object under the point.
         * @param x
         * @param y
         * @param touchable
         * @returns {WOZLLA.GameObject}
         */
        public getUnderPoint(x:number, y:number, touchable:boolean=false):GameObject {
            var found, localP, child;
            var childrenArr;
            if(!this._active || !this._visible) return null;
            childrenArr = this._children;
            if(childrenArr.length > 0) {
                for(var i=childrenArr.length-1; i>=0; i--) {
                    child = childrenArr[i];
                    found = child.getUnderPoint(x, y, touchable);
                    if(found) {
                        return found;
                    }
                }
            }

            if(!touchable || this._touchable) {
                localP = this.transform.globalToLocal(x, y);
                if(this.testHit(localP.x, localP.y)) {
                    return this;
                }
            }
            return null;
        }

        /**
         * try to do a hit test
         * @param localX
         * @param localY
         * @returns {boolean}
         */
        public testHit(localX:number, localY:number):boolean {
            var collider:Collider = this._collider;
            return collider && collider.collideXY(localX, localY);
        }

        public loadAssets(callback:Function) {
            var i, len, count, comp;
            if(this._loadingAssets) return;
            count = this._components.length + this._children.length;
            if(count === 0) {
                callback && callback();
                return;
            }
            for(i=0,len=this._components.length; i<len; i++) {
                comp = this._components[i];
                comp.loadAssets(() => {
                    if(--count === 0) {
                        callback && callback();
                    }
                });
            }
            for(i=0,len=this._children.length; i<len; i++) {
                this._children[i].loadAssets(() => {
                    if(--count === 0) {
                        callback && callback();
                    }
                });
            }
        }


        static QUERY_FULL_REGEX = /((.*?):(.*?))\[(.*?)\]$/;
        static QUERY_COMP_REGEX = /((.*?):(.*?))$/;
        static QUERY_OBJ_ATTR_REGEX = /(.*?)\[(.*?)\]$/;

        query(expr:string, record?:QueryRecord):any {
            var result,
                compExpr,
                objExpr,
                compName,
                attrName;

            var objArr;

            var hasAttr = expr.indexOf('[') !== -1 && expr.indexOf(']') !== -1;
            var hasComp = expr.indexOf(':') !== -1;

            if(hasComp && hasAttr) {
                result = GameObject.QUERY_FULL_REGEX.exec(expr);
                compExpr = result[1];
                objExpr = result[2];
                compName = result[3];
                attrName = result[4];
            } else if(hasComp && !hasAttr) {
                result = GameObject.QUERY_COMP_REGEX.exec(expr);
                compExpr = result[1];
                objExpr = result[2];
                compName = result[3];
            } else if(!hasComp && hasAttr) {
                result = GameObject.QUERY_OBJ_ATTR_REGEX.exec(expr);
                objExpr = result[1];
                attrName = result[2];
            } else {
                objExpr = expr;
            }
            if(record) {
                record.compExpr = compExpr;
                record.objExpr = objExpr;
                record.compName = compName;
                record.attrName = attrName;
            }

            if(!objExpr) {
                result = this;
            } else {
                result = this;
                objArr = objExpr.split('/');
                for(var i=0,len=objArr.length; i<len; i++) {
                    if(!objArr[i]) {
                        break;
                    }
                    result = result.getChild(objArr[i]);
                    if(!result) {
                        break;
                    }
                }
            }

            if(result && compName) {
                result = result.getComponent(Component.getType(compName));
            }

            if(result && record) {
                record.target = result;
            }

            if(result && attrName) {
                result = result[attrName];
            }
            return result;
        }

        protected checkComponentDependency(comp:Component, isRemove:boolean=false) {
            var Type:Function;
            var requires = comp.listRequiredComponents();
            if(!requires || requires.length === 0) return;
            for(var i=0, len=requires.length; i<len; i++) {
                Type = requires[i];
                if(!this.hasComponent(Type)) {
                    if(isRemove) {
                        throw new Error('Can NOT remove: Component[' + Component.getName(comp['constructor']) + '] depend on it');
                    } else {
                        var name = Type === RectTransform ? 'RectTransform' : Component.getName(Type);
                        throw new Error('Can NOT add: Component[' + name + '] required');
                    }
                }
            }
        }

    }

    export class QueryRecord {
        compExpr = null;
        objExpr = null;
        compName = null;
        attrName = null;
        target = null;
    }

}