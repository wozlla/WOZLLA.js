module WOZLLA.renderer {

    /**
     * @class WOZLLA.renderer.IShaderManager
     * @abstract
     */
    export interface IShaderManager {
        createShaderProgram(vertexSource:string, fragmentSource:string, ShaderClass:Function):IShaderProgram;
        getShaderProgram(id):IShaderProgram;
        deleteShaderProgram(shaderProgram:IShaderProgram):void;
        clear():void;
    }

    export module IShaderManager {
        /**
         * @property DOC
         * @readonly
         * @static
         * @member WOZLLA.renderer.IShaderManager
         */
        export var DOC = 'DOC';
    }

}