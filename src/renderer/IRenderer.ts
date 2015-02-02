module WOZLLA.renderer {

    /**
     * @class WOZLLA.renderer.IRenderer
     * @abstract
     */
    export interface IRenderer {

        /**
         * @property {WOZLLA.renderer.ILayerManager} layerManager
         */
        layerManager:ILayerManager;
        materialManager:IMaterialManager;
        shaderManager:IShaderManager;
        textureManager:ITextureManager;

        viewport:any;

        gl:any;

        addCommand(command:IRenderCommand):void;
        render():void;
        flush():void;

    }

    export module IRenderer {
        /**
         * @property DOC
         * @readonly
         * @static
         * @member WOZLLA.renderer.IRenderer
         */
        export var DOC = 'DOC';
    }

}