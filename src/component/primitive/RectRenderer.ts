/// <reference path="PrimitiveRenderer.ts"/>
module WOZLLA.component {

    export class RectRenderer extends PrimitiveRenderer {

        get rect():WOZLLA.math.Rectangle {
            return this._rect;
        }

        set rect(value:WOZLLA.math.Rectangle) {
            this._rect = value;
            this._graphicsDirty = true;
        }

        _rect:WOZLLA.math.Rectangle;

        drawPrimitive(context):void {
            var style = this._primitiveStyle;
            if(style.stroke) {
                context.rect(style.strokeWidth/2, style.strokeWidth/2, this._rect.width, this._rect.height);
                context.stroke();
            } else {
                context.rect(0, 0, this._rect.width, this._rect.height);
            }
            if(style.fill) {
                context.fill();
            }
        }

        protected measurePrimitiveSize():any {
            var style = this._primitiveStyle;
            if(!this._rect) {
                return {
                    width: 0,
                    height: 0
                };
            }
            return {
                width: Math.ceil(this._rect.width + (style.stroke ? style.strokeWidth : 0)),
                height: Math.ceil(this._rect.height + (style.stroke ? style.strokeWidth : 0))
            };
        }

        protected generateCanvasTexture(renderer:renderer.IRenderer):void {
            var offset = {
                x: -this._rect.x/this._rect.width,
                y: -this._rect.y/this._rect.height
            };
            super.generateCanvasTexture(renderer);
            this.setTextureOffset(offset);
        }

    }

}