/// <reference path="../../assets/GLTextureAsset.ts"/>
/// <reference path="QuadRenderer.ts"/>
module WOZLLA.component {

    export class CanvasRenderer extends QuadRenderer {

        get canvasSize():WOZLLA.math.Size {
            return this._canvasSize;
        }
        set canvasSize(value:WOZLLA.math.Size) {
            this._canvasSize = value;
            this._sizeDirty = true;
        }
        get canvasWidth():number { return this._canvasSize.width; }
        set canvasWidth(value:number) {
            this._canvasSize.width = value;
            this._sizeDirty = true;
        }
        get canvasHeight():number { return this._canvasSize.height; }
        set canvasHeight(value:number) {
            this._canvasSize.height = value;
            this._sizeDirty = true;
        }

        _canvas;
        _context;
        _canvasSize:WOZLLA.math.Size = new WOZLLA.math.Size(0, 0);

        _glTexture;

        _graphicsDirty:boolean = true;
        _sizeDirty:boolean = true;

        destroy():void {
            this.destroyCanvas();
            super.destroy();
        }

        draw(context):void {
            throw new Error('abstract method');
        }

        render(renderer: renderer.IRenderer, flags: number): void {
            if(!this._canvas) {
                this.initCanvas();
            }
            if(!this._canvas) {
                return;
            }
            if(this._sizeDirty) {
                this.updateCanvas();
            }
            if(this._graphicsDirty) {
                this.clearCanvas();
                this.draw(this._context);
                this._graphicsDirty = false;
                this.generateCanvasTexture(renderer);
            }
            if(this._glTexture) {
                super.render(renderer, flags);
            }
        }

        clearCanvas() {
            this._context.clearRect(0, 0, this._canvasSize.width, this._canvasSize.height);
        }

        protected initCanvas() {
            if(this._canvasSize.width <= 0 || this._canvasSize.height <= 0) {
                return;
            }
            this._canvas = document.createElement('canvas');
            this._canvas.width = this._canvasSize.width;
            this._canvas.height = this._canvasSize.height;
            this._context = this._canvas.getContext('2d');
            this._sizeDirty = false;
            this._graphicsDirty = true;
        }

        protected updateCanvas() {
            if(this._canvasSize.width <= 0 || this._canvasSize.height <= 0) {
                this.destroyCanvas();
                this._graphicsDirty = true;
            }
            this._canvas.width = this._canvasSize.width;
            this._canvas.height = this._canvasSize.height;
            this._sizeDirty = false;
            this._graphicsDirty = true;
        }

        protected destroyCanvas() {
            this._canvas && this._canvas.dispose && this._canvas.dispose();
            this._context && this._context.dispose && this._context.dispose();
            this._canvas = this._context = null;
        }

        protected generateCanvasTexture(renderer:renderer.IRenderer):void {
            if(!this._glTexture) {
                this._glTexture = renderer.textureManager.generateTexture(
                    new WOZLLA.assets.HTMLImageDescriptor(this._canvas));
                this.setTexture(this._glTexture);
            } else {
                renderer.textureManager.updateTexture(this._glTexture);
                this.setTexture(this._glTexture);
            }
        }

    }

}