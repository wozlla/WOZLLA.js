/// <reference path="../ILayerManager.ts"/>
module WOZLLA.renderer {

    /**
     * @class WOZLLA.renderer.LayerManager
     * @extends WOZLLA.renderer.ILayerManager
     */
    export class LayerManager implements ILayerManager {

        _layerIndexMap;
        _sortedLayers;

        constructor() {
            this._layerIndexMap = {};
            this._sortedLayers = [];
            this.define(ILayerManager.DEFAULT, 0);
        }

        define(layer:string, zindex:number):void {
            if(this._layerIndexMap[layer]) {
                throw new Error('Layer has been defined: ' + layer);
            }
            this._layerIndexMap[layer] = zindex;
            this._sortedLayers.push(layer);
            this._sortedLayers.sort((a, b) => {
                return this.getZIndex(a) - this.getZIndex(b);
            });
        }

        undefine(layer:string):void {
            this._sortedLayers.splice(this._sortedLayers.indexOf(layer), 1);
            delete this._layerIndexMap[layer];
        }

        getZIndex(layer:string):number {
            return this._layerIndexMap[layer];
        }

        getSortedLayers():Array<string> {
            return this._sortedLayers.slice(0);
        }

        _getSortedLayers():Array<string> {
            return this._sortedLayers;
        }
    }

}