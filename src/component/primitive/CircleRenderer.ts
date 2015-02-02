/// <reference path="PrimitiveRenderer.ts"/>
module WOZLLA.component {

    export class CircleRenderer extends PrimitiveRenderer {

        get circle():WOZLLA.math.Circle {
            return this._circle;
        }

        set circle(value:WOZLLA.math.Circle) {
            this._circle = value;
            this._graphicsDirty = true;
        }

        _circle:WOZLLA.math.Circle;

        drawPrimitive(context):void {
            var style = this._primitiveStyle;
            var centerX:number = this._canvasSize.width/2;
            var centerY:number = this._canvasSize.height/2;
            context.beginPath();
            context.arc(centerX, centerY, this._circle.radius, 0, 2 * Math.PI);
            if(style.stroke) {
                context.stroke();
            }
            if(style.fill) {
                context.fill();
            }
        }

        protected measurePrimitiveSize():any {
            var style = this._primitiveStyle;
            if(!this._circle) {
                return {
                    width: 0,
                    height: 0
                };
            }
            return {
                width: Math.ceil(this._circle.radius*2 + (style.stroke ? style.strokeWidth : 0)),
                height: Math.ceil(this._circle.radius*2 + (style.stroke ? style.strokeWidth : 0))
            };
        }

        protected generateCanvasTexture(renderer:renderer.IRenderer):void {
            var offset = {
                x: this._circle.centerX/this._circle.radius + 0.5,
                y: this._circle.centerY/this._circle.radius + 0.5
            };
            super.generateCanvasTexture(renderer);
            this.setTextureOffset(offset);
        }

    }

}