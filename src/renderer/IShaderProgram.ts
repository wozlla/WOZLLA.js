module WOZLLA.renderer {

    /**
     * @class WOZLLA.renderer.IShaderProgram
     * @abstract
     */
    export interface IShaderProgram {
        id:any;
        vertexShader:any;
        fragmentShader:any;

        useProgram(gl):void;
        syncUniforms(gl, uniforms:{projection});
    }

    export module IShaderProgram {
        /**
         * @property {string} V2T2C1A1
         * @readonly
         * @static
         * @member WOZLLA.renderer.IShaderProgram
         */
        export var V2T2C1A1 = 'Builtin_V2T2C1A1';
    }

}