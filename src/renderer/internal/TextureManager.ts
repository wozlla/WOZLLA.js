/// <reference path="Texture.ts"/>
module WOZLLA.renderer {

    function isPowerOf2(num) {
        return (num & (num - 1)) === 0;
    }

    /**
     * @class WOZLLA.renderer.TextureManager
     * @extends WOZLLA.renderer.ITextureManager
     */
    export class TextureManager implements ITextureManager {

        _gl:any;

        _textureMap:any;

        constructor(gl) {
            this._gl = gl;
            this._textureMap = {};
        }

        getTexture(id) {
            return this._textureMap[id];
        }

        generateTexture(descriptor:ITextureDescriptor, textureId?):ITexture {
            var texture;
            var pvrtcExt:any;
            var compressedType;
            var gl = this._gl;
            var id = textureId || gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, id);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            if(isPowerOf2(descriptor.width) && isPowerOf2(descriptor.height)) {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            }
            switch(descriptor.textureFormat) {
                case TextureFormat.PNG:
                case TextureFormat.JPEG:
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, descriptor.source);
                    break;
                case TextureFormat.PVR:
                    switch(descriptor.pixelFormat) {
                        case PixelFormat.PVRTC2:
                            pvrtcExt = WebGLExtension.getExtension(gl, WebGLExtension.PVRTC);
                            compressedType = pvrtcExt.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
                            break;
                        case PixelFormat.PVRTC4:
                            pvrtcExt = WebGLExtension.getExtension(gl, WebGLExtension.PVRTC);
                            compressedType = pvrtcExt.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
                            break;
                        default:
                            throw new Error('Unsupported pixel format: ' + descriptor.pixelFormat);
                    }
                    gl.compressedTexImage2D(gl.TEXTURE_2D, 0, compressedType, descriptor.width, descriptor.height, 0, descriptor.source);
                    break;
                default:
                    throw new Error('Unsupported texture format: ' + descriptor.textureFormat);
            }
            texture = new Texture(id, descriptor);
            this._textureMap[id] = texture;
            return texture;
        }

        updateTexture(texture:ITexture):void {
            this.generateTexture(texture.descriptor, texture.id);
        }

        deleteTexture(texture:ITexture):void {
            this._gl.deleteTexture(texture.id);
            delete this._textureMap[texture.id];
        }

        clear():void {
            for(var id in this._textureMap) {
                this.deleteTexture(this._textureMap[id]);
            }
        }

    }

}