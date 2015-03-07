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

        gl:any;
        viewport:any;
        projectionMatrix:Float32Array;

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


        export var debugEnabled:boolean = true;
    }

}