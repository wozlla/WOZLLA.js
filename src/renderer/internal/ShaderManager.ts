/// <reference path="ShaderProgram.ts"/>
/// <reference path="../IShaderProgram.ts"/>
/// <reference path="../shader/V2T2C1A1.ts"/>
/// <reference path="../WebGLUtils.ts"/>
module WOZLLA.renderer {

    /**
     * @class WOZLLA.renderer.ShaderManager
     * @extends WOZLLA.renderer.IShaderManager
     */
    export class ShaderManager implements IShaderManager {

        _gl:any;

        _shaderMap:any;

        constructor(gl) {
            this._gl = gl;
            this._shaderMap = {};
            this._shaderMap[IShaderProgram.V2T2C1A1] = this.createShaderProgram(
                shader.V2T2C1A1.VERTEX_SOURCE,
                shader.V2T2C1A1.FRAGMENT_SOURCE,
                shader.V2T2C1A1);
        }

        getShaderProgram(id):IShaderProgram {
            return this._shaderMap[id];
        }

        createShaderProgram(vertexSource:string, fragmentSource:string, ShaderClass:Function=ShaderProgram):IShaderProgram {
            var result = WebGLUtils.compileProgram(this._gl, vertexSource, fragmentSource);
            var shaderProgram = <IShaderProgram>new (<any>ShaderClass)(result.program, result.vertexShader, result.fragmentShader);
            this._shaderMap[shaderProgram.id] = shaderProgram;
            return shaderProgram;
        }

        deleteShaderProgram(shaderProgram:IShaderProgram):void {
            this._gl.deleteProgram(shaderProgram.id);
            this._gl.deleteShader(shaderProgram.vertexShader);
            this._gl.deleteShader(shaderProgram.fragmentShader);
            delete this._shaderMap[shaderProgram.id];
        }

        clear():void {
            for(var id in this._shaderMap) {
                this.deleteShaderProgram(this._shaderMap[id]);
            }
        }

    }

}