module WOZLLA.renderer {

    /**
     * @class WOZLLA.renderer.RenderCommandBase
     * @abstract
     */
    export class RenderCommandBase implements IRenderCommand {

        get globalZ():number { return this._globalZ; }
        get layer():string { return this._layer; }

        _globalZ:number;
        _layer:string;

        _addIndex:number;

        constructor(globalZ:number, layer:string) {
            this._globalZ = globalZ;
            this._layer = layer;
        }

    }

}