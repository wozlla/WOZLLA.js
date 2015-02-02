module WOZLLA.assets.proxy {

    export class SpriteAtlasProxy extends AssetProxy {

        getSprite(spriteName:any):Sprite {
            if(this.asset) {
                return (<SpriteAtlas>this.asset).getSprite(spriteName);
            }
            return null;
        }

        getFrameLength():number {
            if(!this.asset) {
                return 0;
            }
            return (<SpriteAtlas>this.asset).getFrameLength();
        }

        protected doLoad(callback:(asset:Asset) => void) {
            var src = this.newAssetSrc;
            if(!src) {
                callback(null);
                return;
            }
            AssetLoader.getInstance().load(src, SpriteAtlas, function() {
                callback(AssetLoader.getInstance().getAsset(src));
            });
        }
    }

}