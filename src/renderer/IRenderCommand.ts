module WOZLLA.renderer {

    /**
     * @class WOZLLA.renderer.IRenderCommand
     * @abstract
     */
    export interface IRenderCommand {
        globalZ:number;
        layer:string;
        _addIndex:number;
    }

}