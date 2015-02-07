/// <reference path="RenderCommandBase.ts"/>
/// <reference path="IRenderer.ts"/>
module WOZLLA.renderer {

    /**
     * @class WOZLLA.renderer.CustomCommand
     * @extends WOZLLA.renderer.RenderCommandBase
     */
    export class CustomCommand extends RenderCommandBase {

        constructor(globalZ:number, layer:string, flags?:string) {
            super(globalZ, layer, flags);
        }

        execute(renderer:IRenderer):void {
            throw new Error('abstract method');
        }

    }

}