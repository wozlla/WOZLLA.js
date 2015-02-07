/// <reference path="../renderer/CanvasRenderer.ts"/>
module WOZLLA.component {

    export class PrimitiveRenderer extends CanvasRenderer {

        get primitiveStyle():PrimitiveStyle {
            return this._primitiveStyle;
        }

        set primitiveStyle(value:PrimitiveStyle) {
            this._primitiveStyle = value;
            this._graphicsDirty = true;
        }

        _primitiveStyle:PrimitiveStyle = new PrimitiveStyle();

        render(renderer: renderer.IRenderer, flags: number): void {
            var size;
            if(!this._primitiveStyle) {
                return;
            }
            if(this._graphicsDirty || this._primitiveStyle.dirty) {
                size = this.measurePrimitiveSize();
                this.canvasWidth = size.width;
                this.canvasHeight = size.height;
                this._graphicsDirty = true;
                this._primitiveStyle.dirty = false;
            }
            super.render(renderer, flags);
        }

        draw(context):void {
            context.save();
            this.applyPrimitiveStyle(context);
            this.drawPrimitive(context);
            context.restore();
        }

        protected applyPrimitiveStyle(context) {
            if(this._primitiveStyle.stroke) {
                context.lineWidth = this._primitiveStyle.strokeWidth;
                context.strokeStyle = this._primitiveStyle.strokeColor;
            }
            if(this._primitiveStyle.fill) {
                context.fillStyle = this._primitiveStyle.fillColor;
            }
            context.globalAlpha = this._primitiveStyle.alpha;
        }

        protected drawPrimitive(context):void {
            throw new Error('abstract method');
        }

        protected measurePrimitiveSize():any {
            throw new Error('abstract method');
        }

    }

    export class PrimitiveStyle {

        dirty:boolean = true;

        get alpha():number { return this._alpha; }
        set alpha(value:number) {
            this._alpha = value;
            this.dirty = true;
        }

        get stroke():boolean { return this._stroke; }
        set stroke(value:boolean) {
            if(value === this._stroke) return;
            this._stroke = value;
            this.dirty = true;
        }

        get strokeColor():string { return this._strokeColor; }
        set strokeColor(value:string) {
            if(value === this._strokeColor) return;
            this._strokeColor = value;
            this.dirty = true;
        }

        get strokeWidth():number { return this._strokeWidth; }
        set strokeWidth(value:number) {
            if(value === this._strokeWidth) return;
            this._strokeWidth = value;
            this.dirty = true;
        }

        get fill():boolean { return this._fill; }
        set fill(value:boolean) {
            if(value === this._fill) return;
            this._fill = value;
            this.dirty = true;
        }

        get fillColor():string { return this._fillColor; }
        set fillColor(value:string) {
            if(value === this._fillColor) return;
            this._fillColor = value;
            this.dirty = true;
        }

        _alpha:number = 1;

        _stroke:boolean = true;
        _fill:boolean = false;

        _strokeColor:string = '#000000';
        _strokeWidth:number = 1;
        _fillColor:string = '#FFFFFF';


    }

    Component.register(PrimitiveRenderer, {
        name: 'PrimitiveRenderer',
        abstractComponent: true,
        properties: [{
            name: 'primitiveStyle',
            type: 'primitiveStyle',
            defaultValue: {
                alpha: 1,
                stroke: true,
                fill: false,
                strokeColor: '#000000',
                strokeWidth: 1,
                fillColor: '#FFFFFF'
            }
        }]
    });

}