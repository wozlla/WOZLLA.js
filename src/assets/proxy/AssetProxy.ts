module WOZLLA.assets.proxy {

    export class AssetProxy {

        protected proxyTarget:IProxyTarget;
        protected asset:Asset;
        protected newAssetSrc:string;
        protected loading:boolean = false;

        constructor(proxyTarget:IProxyTarget) {
            this.proxyTarget = proxyTarget;
        }

        setAssetSrc(src:string) {
            this.newAssetSrc = src;
        }

        loadAsset(callback:Function) {
            if(this.checkDirty()) {
                if(this.loading) {
                    callback && callback();
                    return;
                }
                this.loading = true;
                this.asset && this.asset.release();
                this.asset = null;
                this.doLoad((asset:Asset) => {
                    if(!asset) {
                        this.asset = null;
                        callback && callback();
                    } else if(asset.src !== this.newAssetSrc) {
                        asset.retain();
                        asset.release();
                        this.asset = null;
                    } else {
                        this.asset = asset;
                        this.asset.retain();
                    }
                    this.loading = false;
                    this.proxyTarget.onAssetLoaded(asset);
                    callback && callback();
                });
            } else {
                callback && callback();
            }
        }

        onDestroy() {
            this.asset && this.asset.release();
            this.asset = null;
        }

        protected checkDirty():boolean {
            if(!this.asset) {
                return !!this.newAssetSrc;
            }
            return this.newAssetSrc !== this.asset.src;
        }

        protected doLoad(callback:(asset:Asset) => void) {
            callback(null);
        }

    }

    export interface IProxyTarget {
        onAssetLoaded(asset:Asset);
    }

}