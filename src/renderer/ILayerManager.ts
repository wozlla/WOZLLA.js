module WOZLLA.renderer {

    /**
     * @class WOZLLA.renderer.ILayerManager
     * @abstract
     */
    export interface ILayerManager {

        define(layer:string, zindex:number):void;

        undefine(layer:string):void;

        getZIndex(layer:string):number;

        getSortedLayers():Array<string>;
    }

    export module ILayerManager {
        /**
         * @property {string} DEFAULT
         * @readonly
         * @static
         * @member WOZLLA.renderer.ILayerManager
         */
        export var DEFAULT = 'default';
    }

}