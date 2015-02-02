/// <reference path="Asset.ts"/>
/// <reference path="../utils/Ajax.ts"/>
module WOZLLA.assets {

    function deepCopyJSON(o) {
        var copy = o,k;
        if (o && typeof o === 'object') {
            copy = Object.prototype.toString.call(o) === '[object Array]' ? [] : {};
            for (k in o) {
                copy[k] = deepCopyJSON(o[k]);
            }
        }
        return copy;
    }

    export class JSONAsset extends Asset {

        _data:any;

        cloneData():any {
            if(!this._data) {
                return this._data;
            }
            return deepCopyJSON(this._data);
        }

        load(onSuccess:()=>any, onError:(error)=>any) {
            WOZLLA.utils.Ajax.request({
                url: this.fullPath,
                dataType: 'json',
                success: (data) => {
                    this._data = data;
                    onSuccess();
                },
                error: function(error) {
                    onError(error);
                }
            });
        }

        unload() {
            this._data = null;
            super.unload();
        }

    }

}