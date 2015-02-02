module WOZLLA.renderer {

    /**
     * @class WOZLLA.renderer.ITexture
     * @abstract
     */
    export interface ITexture {
        id:any;
        descriptor:ITextureDescriptor;
        bind(gl):void;
    }

    export module ITexture {
        /**
         * @property DOC
         * @readonly
         * @static
         * @member WOZLLA.renderer.ITexture
         */
        export var DOC = 'DOC';
    }

}