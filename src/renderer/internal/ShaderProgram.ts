module WOZLLA.renderer {

    /**
     * @class WOZLLA.renderer.ShaderProgram
     * @extends WOZLLA.renderer.IShaderProgram
     */
    export class ShaderProgram implements IShaderProgram {

        get id():any { return this._id ; }
        get vertexShader():any { return this._vertexShader; }
        get fragmentShader():any { return this._fragmentShader; }

        _id;
        _vertexShader;
        _fragmentShader;

        constructor(id, vertexShader, fragmentShader) {
            this._id = id;
            this._vertexShader = vertexShader;
            this._fragmentShader = fragmentShader;
        }

        useProgram(gl):void {
            gl.useProgram(this._id);
        }

        syncUniforms(gl, uniforms:{projection}) {

        }
    }

}