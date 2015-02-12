/// <reference path="../renderer/SpriteRenderer.ts"/>
/// <reference path="TextRenderer.ts"/>
module WOZLLA.component {

    var sharedFrame:any = {};
    var sharedUVS:any = {};

    /**
     * @class WOZLLA.component.SpriteFrameText
     */
    export class SpriteFrameText extends QuadArraySpriteRenderer {

        get sample():string {
            return this._sample;
        }
        set sample(value:string) {
            if(value === this._sample) return;
            this._sample = value;
            this._quadVertexDirty = true;
        }

        get text():string {
            return this._text;
        }

        set text(value:string) {
            if(typeof value !== 'string') {
                value += '';
            }
            if(value === this._text) return;
            this._text = value;
            this._quadVertexDirty = true;
        }

        get wordMargin():number {
            return this._wordMargin;
        }

        set wordMargin(value:number) {
            if(value === this._wordMargin) {
                return;
            }
            this._wordMargin = value;
            this._quadVertexDirty = true;
        }

        get align():string {
            return this._align;
        }

        set align(value:string) {
            if(value === this._align) {
                return;
            }
            this._align = value;
            this._quadVertexDirty = true;
        }

        get baseline():string {
            return this._align;
        }

        set baseline(value:string) {
            if(value === this._baseline) {
                return;
            }
            this._baseline = value;
            this._quadVertexDirty = true;
        }

        _sample:string;
        _text:string;
        _wordMargin:number = 0;
        _align:string = TextStyle.START;
        _baseline:string = TextStyle.END;

        _updateQuadSize() {
            if(this._sample && this._text) {
                if(this._quad && this._quad.count === this._text.length) {
                    return;
                }
                this._quad = new WOZLLA.renderer.Quad(this._text.length);
                this._quadAlphaDirty = true;
                this._quadColorDirty = true;
            }
        }

        _updateQuadsVertices() {
            var textureOffset = this._getTextureOffset();
            var textureFrame = this._getTextureFrame();
            var wordLen = this._text.length;
            var wordFrameW = textureFrame.width/this._sample.length;
            var wordUVS;
            var character;
            var characterIndex;

            var totalW = wordLen * (this._wordMargin*2+wordFrameW);
            var totalH = textureFrame.height;

            var offsetX = 0, offsetY = 0;
            switch(this._align) {
                case TextStyle.CENTER:
                    offsetX = -totalW / 2;
                    break;
                case TextStyle.END:
                    offsetX = -totalW;
                    break;
            }
            switch(this._baseline) {
                case TextStyle.MIDDLE:
                    offsetY = -totalH / 2;
                    break;
                case TextStyle.BOTTOM:
                    offsetY = -totalH;
                    break;
            }

            sharedFrame.y = textureFrame.y;
            sharedFrame.width = wordFrameW;
            sharedFrame.height = textureFrame.height;

            for(var i=0; i<wordLen; i++) {
                character = this._text.charAt(i);
                characterIndex = this._sample.indexOf(character);
                if(characterIndex === -1) {
                    throw new Error('character "' + character + '" not found in sample "' + this._sample + '"');
                }
                sharedHelpTransform.reset();
                sharedHelpTransform.x = i * (this._wordMargin * 2 + wordFrameW) + this._wordMargin + offsetX;
                sharedHelpTransform.y = offsetY;
                sharedHelpTransform.transform(this.transform);

                sharedFrame.x = textureFrame.x + characterIndex*wordFrameW;
                wordUVS = QuadRenderer.getTextureUVS(sharedFrame, this._texture, sharedUVS);
                this._updateQuadVerticesByArgs(wordUVS, sharedFrame, textureOffset, sharedHelpTransform.worldMatrix, i);
            }

            this._quadVertexDirty = false;
        }

        render(renderer:WOZLLA.renderer.IRenderer, flags:number):void {
            if (!this._sample || !this._text) {
                return;
            }
            if(this._quadVertexDirty) {
                this._updateQuadSize();
            }
            super.render(renderer, flags);
        }

    }

    Component.register(SpriteFrameText, {
        name: "SpriteFrameText",
        properties: [
            Component.extendConfig(QuadArraySpriteRenderer),
            {
                name: 'sample',
                type: 'string',
                defaultValue: ''
            },
            {
                name: 'text',
                type: 'string',
                defaultValue: ''
            },
            {
                name: 'wordMargin',
                type: 'int',
                defaultValue: 0
            },
            {
                name: 'align',
                type: 'string',
                editor: 'combobox',
                defaultValue: TextStyle.START,
                data: [TextStyle.START, TextStyle.CENTER, TextStyle.END]
            },
            {
                name: 'baseline',
                type: 'string',
                editor: 'combobox',
                defaultValue: TextStyle.TOP,
                data: [TextStyle.TOP, TextStyle.MIDDLE, TextStyle.BOTTOM]
            }
        ]
    });

}