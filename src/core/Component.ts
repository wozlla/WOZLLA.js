/// <reference path="Transform.ts"/>
/// <reference path="../utils/Assert.ts"/>
module WOZLLA {

    /**
     * Top class of all components
     * @class WOZLLA.Component
     * @extends WOZLLA.event.EventDispatcher
     * @abstract
     */
    export class Component extends WOZLLA.event.EventDispatcher {

        /**
         * get the GameObject of this component belongs to.
         * @property {WOZLLA.GameObject} gameObject
         */
        get gameObject():GameObject { return this._gameObject; }
        set gameObject(value:GameObject) { this._gameObject = value; }

        /**
         *  get transform of the gameObject of this component
         *  @property {WOZLLA.Transform} transform
         */
        get transform():Transform { return this._gameObject.transform; }

        _gameObject:GameObject;
        _uuid:string;

        /**
         * init this component
         */
        init():void {}

        /**
         * destroy this component
         */
        destroy():void {}

        loadAssets(callback:Function) {
            callback && callback();
        }

        listRequiredComponents():Array<Function> {
            return [];
        }

        private static ctorMap:any = {};
        private static configMap:any = {};

        public static getType(name:string) {
            var ret = this.ctorMap[name]
            Assert.isNotUndefined(ret, 'Can\'t found component: ' + name);
            return ret;
        }

        public static getName(Type:Function) {
            return (<any>Type).componentName;
        }

        /**
         * register an component class and it's configuration
         * @method register
         * @static
         * @param ctor
         * @param configuration
         */
        public static register(ctor:Function, config) {
            Assert.isObject(config);
            Assert.isString(config.name);
            Assert.isUndefined(Component.configMap[config.name]);
            Component.ctorMap[config.name] = ctor;
            Component.configMap[config.name] = config;
            (<any>ctor).componentName = config.name;
        }

        public static unregister(name:string) {
            Assert.isString(name);
            Assert.isNotUndefined(Component.configMap[name]);
            delete Component.ctorMap[name];
            delete Component.configMap[name];
        }

        /**
         * create component by it's registed name.
         * @param name the component name
         * @returns {WOZLLA.Component}
         */
        public static create(name:string):WOZLLA.Component {
            Assert.isString(name);
            var ctor:Function = Component.ctorMap[name];
            Assert.isFunction(ctor);
            return <WOZLLA.Component>new (<any>ctor)();
        }

        public static getConfig(name:any):any {
            var config:any;
            Assert.isNotUndefined(name);
            if(typeof name === 'function') {
                name = Component.getName(name);
            }
            config = Component.configMap[name];
            Assert.isNotUndefined(config);
            return config;
        }

        public static extendConfig(Type:Function):any {
            var name = Component.getName(Type);
            return {
                group: name,
                properties: Component.getConfig(name).properties
            };
        }

    }

}