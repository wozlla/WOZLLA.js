/// <reference path="Component.ts"/>
/// <reference path="../renderer/ILayerManager.ts"/>
/// <reference path="../renderer/CustomCommand.ts"/>
module WOZLLA {

    /**
     * Base class for all mask, mask is based on webgl stencil.
     * @class WOZLLA.Mask
     * @extends WOZLLA.Component
     * @abstract
     */
    export class Mask extends Component {

        reverse:boolean = false;

        get startGlobalZ():number {
            return this._startGlobalZ;
        }
        set startGlobalZ(value:number) {
            this._startGlobalZ = value;
        }

        get endGlobalZ():number {
            return this._endGlobalZ;
        }
        set endGlobalZ(value:number) {
            this._endGlobalZ = value;
        }

        get layer():string {
            return this._maskLayer;
        }
        set layer(value:string) {
            this._maskLayer = value;
        }

        _startGlobalZ:number = 0;
        _endGlobalZ:number = 0;
        _maskLayer:string = WOZLLA.renderer.ILayerManager.DEFAULT;

        /**
         * set mask range, mask range is effect on globalZ of render commmand
         * @param start
         * @param end
         * @param layer
         */
        setMaskRange(start:number, end:number, layer:string=WOZLLA.renderer.ILayerManager.DEFAULT) {
            this._startGlobalZ = start;
            this._endGlobalZ = end;
            this._maskLayer = layer;
        }

        /**
         * render this mask
         * @param renderer
         * @param flags
         */
        render(renderer:WOZLLA.renderer.IRenderer, flags:number):void {
            renderer.addCommand(new EnableMaskCommand(this._startGlobalZ, this._maskLayer, this._gameObject.name + '[EnableMask]'));
            this.renderMask(renderer, flags);
            renderer.addCommand(new EndMaskCommand(this._startGlobalZ, this._maskLayer, this.reverse, this._gameObject.name + '[EndMask]'));
            renderer.addCommand(new DisableMaskCommand(this._endGlobalZ, this._maskLayer, this._gameObject.name + '[DisableMask]'));
        }

        /**
         * do render mask graphics
         * @param renderer
         * @param flags
         */
        protected renderMask(renderer:WOZLLA.renderer.IRenderer, flags:number) {
        }

    }


    class EnableMaskCommand extends WOZLLA.renderer.CustomCommand {

        execute(renderer:WOZLLA.renderer.IRenderer) {
            var gl = renderer.gl;
            gl.enable(gl.STENCIL_TEST);
            gl.clear(gl.STENCIL_BUFFER_BIT);
            gl.colorMask(false, false, false, false);
            gl.stencilFunc(gl.ALWAYS, 1, 0);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
        }

    }

    class EndMaskCommand extends WOZLLA.renderer.CustomCommand {

        private reverse:boolean;

        constructor(globalZ:number, layer:string, reverse:boolean, flags?:string) {
            super(globalZ, layer, flags);
            this.reverse = reverse;
        }

        execute(renderer:WOZLLA.renderer.IRenderer) {
            var gl = renderer.gl;
            gl.colorMask(true, true, true, true);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
            gl.stencilFunc(this.reverse ? gl.NOTEQUAL : gl.EQUAL, 1, 0xFF);
        }

    }

    class DisableMaskCommand extends WOZLLA.renderer.CustomCommand {

        execute(renderer:WOZLLA.renderer.IRenderer) {
            renderer.gl.disable(renderer.gl.STENCIL_TEST);
        }

    }

    Component.register(Mask, {
        name: 'Mask',
        abstractComponent: true,
        properties: [{
            name: 'startGlobalZ',
            type: 'int',
            defaultValue: 0
        }, {
            name: 'endGlobalZ',
            type: 'int',
            defaultValue: 1
        }, {
            name: 'layer',
            type: 'string',
            editor: 'renderLayer',
            defaultValue: WOZLLA.renderer.ILayerManager.DEFAULT
        }, {
            name: 'reverse',
            type: 'boolean',
            defaultValue: false
        }]
    });

}