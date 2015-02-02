/// <reference path="Sprite.ts"/>
/// <reference path="../utils/Ajax.ts"/>
module WOZLLA.assets {

    var imageTest = /(\.png|\.jpg)$/i;

    function isImageURL(url) {
        return imageTest.test(url);
    }

    function getFileName(url) {
        var idx = url.lastIndexOf('/');
        if(idx !== -1) {
            return url.substr(idx+1, url.length);
        }
        return url;
    }

    /**
     * a sprite atlas contains many {@link WOZLLA.assets.Sprite}.
     * it's recommended to user {@link WOZLLA.assets.AssetLoader} to load SpriteAtlas.
     * @class WOZLLA.assets.SpriteAtlas
     * @extends WOZLLA.assets.GLTextureAsset
     * <br/>
     * see also:
     * {@link WOZLLA.assets.Sprite}
     * {@link WOZLLA.assets.AssetLoader}
     */
    export class SpriteAtlas extends GLTextureAsset {

        /**
         * @property {string} imageSrc
         * @readonly
         */
        get imageSrc():string { return this._imageSrc; }

        /**
         * an file url descript sprite atlas infos.
         * @property {string} metaSrc
         * @readonly
         */
        get metaSrc():string { return this._metaSrc; }

        /**
         * @property {any} sourceImage
         * @readonly
         */
        get sourceImage():any { return this._sourceImage; }

        /**
         * @property {any} spriteData
         * @readonly
         */
        get spriteData():any { return this._spriteData; }

        _imageSrc:string;
        _metaSrc:string;
        _sourceImage;
        _entireSprite:Sprite;
        _spriteData:any;
        _spriteCache:any = {};

        _frameLengthCache:number;

        getFrameLength():number {
            var frames;
            if(!this._spriteData) {
                return 1;
            }
            frames = this._spriteData.frames;
            if(Object.prototype.toString.call(frames) === '[object Array]') {
                return frames.length;
            }
            if(this._frameLengthCache == void 0) {
                this._frameLengthCache = 0;
                for(var _ in frames) {
                    this._frameLengthCache ++;
                }
            }
            return this._frameLengthCache;
        }

        /**
         * get sprite by name
         * @param name
         * @returns {WOZLLA.assets.Sprite}
         */
        getSprite(name?:any):Sprite {
            var frameData, sprite;
            if(name == void 0) {
                return this._entireSprite;
            }
            sprite = this._spriteCache[name];
            if(sprite) {
                return sprite;
            }
            if(!this._spriteData) {
                return null;
            }
            frameData = this._spriteData.frames[name];
            if(frameData) {
                if(typeof frameData.frame.width === 'undefined') {
                    frameData.frame.width = frameData.frame.w;
                    frameData.frame.height = frameData.frame.h;
                }
                sprite = new Sprite(this, {
                    x: frameData.frame.x,
                    y: frameData.frame.y,
                    width: frameData.frame.width,
                    height: frameData.frame.height,
                    offsetX: Math.ceil(frameData.spriteSourceSize ? (frameData.spriteSourceSize.x || 0) : 0),
                    offsetY: Math.ceil(frameData.spriteSourceSize ? (frameData.spriteSourceSize.y || 0) : 0)
                }, name);
                this._spriteCache[name] = sprite;
                return sprite;
            }
            return null;
        }

        /**
         * load this asset
         * @param onSuccess
         * @param onError
         */
        load(onSuccess:()=>any, onError:(error)=>any) {
            if(isImageURL(this.fullPath)) {
                this._imageSrc = this.fullPath;
                this._loadImage((error, image) => {
                    if(error) {
                        onError && onError(error);
                    } else {
                        this._generateTexture(image);
                        this._sourceImage = image;
                        this._entireSprite = new Sprite(this, {
                            x: 0,
                            y: 0,
                            width: image.width,
                            height: image.height
                        });
                        onSuccess && onSuccess();
                    }
                });
            } else {
                this._metaSrc = this.fullPath;
                this._loadSpriteAtlas((error, image, spriteData) => {
                    if(error) {
                        onError && onError(error);
                    } else {
                        this._sourceImage = image;
                        this._generateTexture(image);
                        this._entireSprite = new Sprite(this, {
                            x: 0,
                            y: 0,
                            width: image.width,
                            height: image.height
                        });
                        this._spriteData = spriteData;
                        onSuccess && onSuccess();
                    }
                });
            }
        }

        _loadImage(callback:(error:string, image?)=>any) {
            var image = new Image();
            image.src = this._imageSrc;
            image.onload = () => {
                callback && callback(null, image);
            };
            image.onerror = () => {
                callback('Fail to load image: ' + this._imageSrc);
            };
        }

        _loadSpriteAtlas(callback:(error:string, image?, spriteData?)=>any) {
            var me = this;
            WOZLLA.utils.Ajax.request({
                url: me._metaSrc,
                dataType: 'json',
                success: function(data:any) {
                    var imageSuffix = data.meta.image;
                    var metaFileName = getFileName(me._metaSrc);
                    me._imageSrc = me._metaSrc.replace(new RegExp(metaFileName + '$'), imageSuffix);
                    me._loadImage(function(error, image) {
                        if(error) {
                            callback && callback(error);
                        } else {
                            callback && callback(null, image, data);
                        }
                    });
                },
                error : function(err) {
                    callback('Fail to load sprite: ' + this._metaSrc + ', ' + err.code + ':' + err.message);
                }
            });
        }

    }

}