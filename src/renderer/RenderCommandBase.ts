module WOZLLA.renderer {

    /**
     * @class WOZLLA.renderer.RenderCommandBase
     * @abstract
     */
    export class RenderCommandBase implements IRenderCommand {

        get globalZ():number { return this._globalZ; }
        get layer():string { return this._layer; }
        get flags():string { return this._flags; }

        _globalZ:number;
        _layer:string;
        _flags:string;

        _addIndex:number;

        constructor(globalZ:number, layer:string, flags?:string) {
            this._globalZ = globalZ;
            this._layer = layer;
            this._flags = flags;
        }

    }

}