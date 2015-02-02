/// <reference path="../../core/Mask.ts"/>
/// <reference path="../renderer/QuadRenderer.ts"/>
module WOZLLA.component {

    /**
     * @class WOZLLA.component.RectMask
     */
    export class RectMask extends Mask {

        get region():WOZLLA.math.Rectangle { return this._region; }
        set region(value:WOZLLA.math.Rectangle) {
            this._region = value;
            this._helperGameObject.transform.setPosition(value.x, value.y);
            this._helperGameObject.transform.setScale(value.width, value.height);
        }

        _helperGameObject:WOZLLA.GameObject = new WOZLLA.GameObject();
        _region:WOZLLA.math.Rectangle;
        _maskQuadRenderer;

        protected renderMask(renderer:WOZLLA.renderer.IRenderer, flags:number) {
            if(this._region) {
                if(!this._maskQuadRenderer) {
                    this._initMaskQuadRenderer(renderer);
                }
                if(this._helperGameObject.transform.dirty) {
                    flags |= GameObject.MASK_TRANSFORM_DIRTY;
                }
                if((flags & GameObject.MASK_TRANSFORM_DIRTY) == GameObject.MASK_TRANSFORM_DIRTY) {
                    this._helperGameObject.transform.transform(this.transform);
                }
                this._maskQuadRenderer.setQuadGlobalZ(this._startGlobalZ);
                this._maskQuadRenderer.render(renderer, flags);
            }
        }

        private _initMaskQuadRenderer(renderer:WOZLLA.renderer.IRenderer) {
            var canvas:any = document.createElement('canvas');
            var context:any = canvas.getContext('2d');
            canvas.width = 1;
            canvas.height = 1;
            context.fillStyle = '#FFFFFF';
            context.fillRect(0, 0, canvas.width, canvas.height);
            var descriptor = new WOZLLA.assets.HTMLImageDescriptor(canvas);
            var texture = renderer.textureManager.generateTexture(descriptor);
            this._maskQuadRenderer = new WOZLLA.component.QuadRenderer();
            this._maskQuadRenderer.setTexture(texture);
            this._helperGameObject.addComponent(this._maskQuadRenderer);
            this._helperGameObject.init();
        }

    }

}