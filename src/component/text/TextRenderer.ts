/// <reference path="../renderer/CanvasRenderer.ts"/>
/// <reference path="../PropertyConverter.ts"/>
module WOZLLA.component {

    var helpCanvas = document.createElement('canvas');
    helpCanvas.width = 1;
    helpCanvas.height = 1;
    var helpContext = helpCanvas.getContext('2d');

    export class TextRenderer extends CanvasRenderer {

        public static measureText(style:TextStyle, text:string) {
            var measuredWidth,
                measuredHeight;
            var extendSize;

            helpContext.font = style.font;

            measuredWidth = Math.ceil(helpContext.measureText(text).width);
            measuredHeight = Math.ceil(helpContext.measureText("M").width*1.2);

            if(style.shadow || style.stroke) {
                extendSize = Math.max(style.strokeWidth,
                    Math.abs(style.shadowOffsetX), Math.abs(style.shadowOffsetY));
                measuredWidth += extendSize*2;
                measuredHeight += extendSize*2+4;
            }

            measuredWidth = Math.ceil(measuredWidth);
            measuredHeight = Math.ceil(measuredHeight);

            if(measuredWidth % 2 !== 0) {
                measuredWidth += 1;
            }
            if(measuredHeight % 2 !== 0) {
                measuredHeight += 1;
            }

            return {
                width: measuredWidth,
                height: measuredHeight
            };
        }

        get text():string { return this._text; }
        set text(value:string) {
            if(typeof value !== 'string') {
                value = value + '';
            }
            if(value === this._text) return;
            this._text = value;
            this._textDirty = true;
        }

        get textStyle():TextStyle { return this._textStyle; }
        set textStyle(value:TextStyle) {
            this._textStyle = value;
            this._textDirty = true;
        }

        get textWidth():number { return this._canvasSize.width; }
        get textHeight():number { return this._canvasSize.height; }

        _textDirty:boolean = true;

        _text:string;
        _textStyle:TextStyle = new TextStyle();

        render(renderer: renderer.IRenderer, flags: number): void {
            var size;
            if(this._textDirty || this._textStyle.dirty) {
                size = this.measureTextSize();
                this.canvasWidth = size.width;
                this.canvasHeight = size.height;
                this._textStyle.dirty = false;
                this._textDirty = false;
                this._graphicsDirty = true;
            }
            super.render(renderer, flags);
        }

        draw(context):void {
            this.drawText(context, this._canvasSize.width, this._canvasSize.height);
        }

        protected drawText(context, measuredWidth, measuredHeight) {
            context.save();
            context.font = this._textStyle.font;
            context.textAlign = 'center';
            context.textBaseline = 'middle';

            if (this._textStyle.shadow && (this._textStyle.shadowOffsetX > 0 || this._textStyle.shadowOffsetY > 0)) {
                context.fillStyle = this._textStyle.shadowColor;
                context.fillText(
                    this._text,
                    measuredWidth / 2 + this._textStyle.shadowOffsetX,
                    measuredHeight / 2 + this._textStyle.shadowOffsetY);
            }

            if (this._textStyle.stroke && this._textStyle.strokeWidth > 0) {
                context.strokeStyle = this._textStyle.strokeColor;
                context.lineWidth = this._textStyle.strokeWidth;
                context.strokeText(this._text, measuredWidth / 2, measuredHeight / 2);
            }
            context.fillStyle = this._textStyle.color;
            context.fillText(this._text, measuredWidth / 2, measuredHeight / 2);
            context.restore();
        }

        protected measureTextSize() {
            var measureSize;
            if(!this._text) {
                measureSize = {
                    width: 0,
                    height: 0
                };
            } else {
                measureSize = TextRenderer.measureText(this._textStyle, this._text);
            }
            return measureSize;
        }

        protected generateCanvasTexture(renderer:renderer.IRenderer):void {
            var offset = { x: 0, y: 0 };
            super.generateCanvasTexture(renderer);
            if(this._textStyle.align === TextStyle.CENTER) {
                offset.x = 0.5;
            } else if(this._textStyle.align === TextStyle.END) {
                offset.x = 1;
            }
            if(this._textStyle.baseline === TextStyle.MIDDLE) {
                offset.y = 0.5;
            } else if(this._textStyle.baseline === TextStyle.BOTTOM) {
                offset.y = 1;
            }
            this.setTextureOffset(offset);
        }

    }

    export class TextStyle {

        public static START = 'start';
        public static CENTER = 'center';
        public static END = 'end';
        public static TOP = 'top';
        public static MIDDLE = 'middle';
        public static BOTTOM = 'bottom';

        dirty:boolean = true;

        get font():string { return this._font; }
        set font(value:string) {
            if(value === this._font) return;
            this._font = value;
            this.dirty = true;
        }

        get color():string { return this._color; }
        set color(value:string) {
            if(value === this._color) return;
            this._color = value;
            this.dirty = true;
        }

        get shadow():boolean { return this._shadow; }
        set shadow(value:boolean) {
            if(value === this._shadow) return;
            this._shadow = value;
            this.dirty = true;
        }

        get shadowColor():string { return this._shadowColor; }
        set shadowColor(value:string) {
            this._shadowColor = value;
            this.dirty = true;
        }

        get shadowOffsetX():number { return this._shadowOffsetX; }
        set shadowOffsetX(value:number) {
            if(value === this._shadowOffsetX) return;
            this._shadowOffsetX = value;
            this.dirty = true;
        }

        get shadowOffsetY():number { return this._shadowOffsetY; }
        set shadowOffsetY(value:number) {
            if(value === this._shadowOffsetY) return;
            this._shadowOffsetY = value;
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

        get align():string { return this._align; }
        set align(value:string) {
            if(value === this._align) return;
            this._align = value;
            this.dirty = true;
        }

        get baseline():string { return this._baseline; }
        set baseline(value:string) {
            if(value === this._baseline) return;
            this._baseline = value;
            this.dirty = true;
        }

        _font:string = 'normal 24px Arial';
        _color:string = '#000000';
        _shadow:boolean = false;
        _shadowColor = '#000000';
        _shadowOffsetX:number = 0;
        _shadowOffsetY:number = 0;
        _stroke:boolean = false;
        _strokeColor = '#000000';
        _strokeWidth:number = 0;
        _align:string = TextStyle.START;
        _baseline:string = TextStyle.TOP;

    }

    Component.register(TextRenderer, {
        name: 'TextRenderer',
        properties: [{
            name: 'text',
            type: 'string'
        }, {
            name: 'style',
            type: 'object',
            convert: PropertyConverter.json2TextStyle,
            editor: 'textStyle'
        }]
    });

}