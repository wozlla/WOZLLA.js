module WOZLLA.assets {

    export interface AssetDescription {
        src:string;
        AssetClass:Function;
        callback:Function;
    }

    /**
     * an singleton class for asset loading and asset management
     * @class WOZLLA.assets.AssetLoader
     * @singleton
     */
    export class AssetLoader {

        private static instance:AssetLoader;

        /**
         * return the singleton of this class
         * @method getInstance
         * @static
         * @returns {WOZLLA.assets.AssetLoader}
         */
        public static getInstance():AssetLoader {
            if(!AssetLoader.instance) {
                AssetLoader.instance = new AssetLoader();
            }
            return AssetLoader.instance;
        }

        _loadedAssets = {};
        _loadingUnits = {};

        _baseDir:string = '';

        getBaseDir() {
            return this._baseDir;
        }

        setBaseDir(baseDir:string) {
            this._baseDir = baseDir;
        }

        /**
         * get an asset by src
         * @param src
         * @returns {any}
         */
        getAsset(src):any {
            return this._loadedAssets[src];
        }

        /**
         * add asset to asset loader, the asset would be auto removed when unloaded.
         * @param asset
         */
        addAsset(asset:Asset):void {
            this._loadedAssets[asset.src] = asset;
            asset.addListener(Asset.EVENT_UNLOAD, (e) => {
                e.removeCurrentListener();
                this.removeAsset(asset);
            });
        }

        /**
         * remove asset from asset loader
         * @param asset
         */
        removeAsset(asset:Asset) {
            delete this._loadedAssets[asset.src];
        }

        /**
         * load all asset
         * @param items
         */
        loadAll(items:Array<AssetDescription>) {
            var item:any, i, len;
            for(i=0, len=items.length; i<len; i++) {
                item = items[i];
                this.load(item.src, item.AssetClass, item.callback);
            }
        }

        /**
         * load an asset by src, AssetClass(constructor/factory)
         * @param src
         * @param AssetClass
         * @param callback
         */
        load(src:string, AssetClass:Function, callback?:()=>any) {
            var asset, loadUnit:LoadUnit;
            asset = this._loadedAssets[src];
            if(asset) {
                callback && callback();
                return;
            }
            loadUnit = this._loadingUnits[src];
            if(loadUnit) {
                loadUnit.addCallback(callback, callback);
                return;
            }
            asset = <Asset>(new (<any>AssetClass)(src, this._baseDir ? this._baseDir + "/" : ""));
            loadUnit = new LoadUnit(src);
            loadUnit.addCallback(callback, callback);
            this._loadingUnits[src] = loadUnit;
            asset.load(() => {
                delete this._loadingUnits[src];
                this.addAsset(asset);
                loadUnit.complete(null, asset);
            }, (error) => {
                console.log(error);
                delete this._loadingUnits[src];
                loadUnit.complete(error);
            });
        }

    }

    class LoadUnit {

        src;

        callbacks = [];

        constructor(src) {
            this.src = src;
        }

        addCallback(onSuccess, onError) {
            this.callbacks.push({
                onSuccess: onSuccess,
                onError: onError
            });
        }

        complete(error, asset?) {
            this.callbacks.forEach(function(callback) {
                if(error) {
                    callback.onError && callback.onError(error);
                } else {
                    callback.onSuccess && callback.onSuccess(asset);
                }
            });
        }

    }

}