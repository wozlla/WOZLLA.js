/// <reference path="Asset.ts"/>
/// <reference path="../renderer/ITexture.ts"/>
/// <reference path="../renderer/IRenderer.ts"/>
/// <reference path="../core/Director.ts"/>
module WOZLLA.assets {

    /**
     * internal class
     * @class WOZLLA.assets.GLTextureAsset
     * @extends WOZLLA.assets.Asset
     * @abstract
     */
    export class GLTextureAsset extends Asset {

        get glTexture() { return this._glTexture; }
        _glTexture:WOZLLA.renderer.ITexture;

        _generateTexture(image:HTMLImageElement):void {
            var renderer:WOZLLA.renderer.IRenderer = Director.getInstance().renderer;
            if(!renderer) {
                throw new Error("Director not initialized");
            }
            this._glTexture = renderer.textureManager.generateTexture(new HTMLImageDescriptor(image));
        }

        _generatePVRTexture(pvrSource:any):void {
            throw new Error("Unsupported now");
        }

    }

    export class HTMLImageDescriptor implements WOZLLA.renderer.ITextureDescriptor {

        get width():number { return this._source.width; }
        get height():number { return this._source.height; }
        get source():any { return this._source; }
        get textureFormat():WOZLLA.renderer.TextureFormat { return this._textureFormat; }
        get pixelFormat():WOZLLA.renderer.PixelFormat { return this._pixelFormat; }

        _source;
        _textureFormat:WOZLLA.renderer.TextureFormat;
        _pixelFormat:WOZLLA.renderer.PixelFormat;

        constructor(source) {
            this._source = source;
            this._textureFormat = WOZLLA.renderer.TextureFormat.PNG;
            this._pixelFormat = WOZLLA.renderer.PixelFormat.RGBA8888;
        }
    }

    export class PVRDescriptor implements WOZLLA.renderer.ITextureDescriptor {

        get width():number { return this._source.width; }
        get height():number { return this._source.height; }
        get source():any { return this._source; }
        get textureFormat():WOZLLA.renderer.TextureFormat { return this._textureFormat; }
        get pixelFormat():WOZLLA.renderer.PixelFormat { return this._pixelFormat; }

        _source;
        _textureFormat:WOZLLA.renderer.TextureFormat;
        _pixelFormat:WOZLLA.renderer.PixelFormat;

        constructor(source, pixelFormat:WOZLLA.renderer.PixelFormat) {
            this._source = source;
            this._textureFormat = WOZLLA.renderer.TextureFormat.PVR;
            this._pixelFormat = pixelFormat;
        }
    }

}