/// <reference path="RenderCommandBase.ts"/>
/// <reference path="IRenderer.ts"/>
module WOZLLA.renderer {

    /**
     * @class WOZLLA.renderer.CustomCommand
     * @extends WOZLLA.renderer.RenderCommandBase
     */
    export class CustomCommand extends RenderCommandBase {

        constructor(globalZ:number, layer:string) {
            super(globalZ, layer);
        }

        execute(renderer:IRenderer):void {
            throw new Error('abstract method');
        }

    }

}