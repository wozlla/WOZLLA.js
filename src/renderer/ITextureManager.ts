module WOZLLA.renderer {

    /**
     * @class WOZLLA.renderer.ITextureManager
     * @abstract
     */
    export interface ITextureManager {
        generateTexture(descriptor:ITextureDescriptor):ITexture;
        updateTexture(texture:ITexture):void;
        deleteTexture(texture:ITexture):void;
        getTexture(id):ITexture;
        clear():void;
    }

    export module ITextureManager {
        /**
         * @property DOC
         * @readonly
         * @static
         * @member WOZLLA.renderer.ITextureManager
         */
        export var DOC = 'DOC';
    }

}