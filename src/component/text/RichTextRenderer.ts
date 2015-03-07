/// <reference path="TextRenderer.ts"/>
/// <reference path="../PropertyConverter.ts"/>
module WOZLLA.component {

    export class RichTextRenderer extends TextRenderer {

        get offset():any { return this._getTextureOffset(); }
        set offset(value) { this.setTextureOffset(value); }

        public lineWidth:number = 256;
        public lineHeight:number = 24;

        _fragments:Array<any>;

        protected drawText(context, measuredWidth, measuredHeight) {
            var startX = 0;
            var startY = 0;
            if (this._textStyle.stroke) {
                startX += this._textStyle.strokeWidth;
                startY += this._textStyle.strokeWidth;
            }
            if (this._textStyle.shadow) {
                startX += Math.abs(this._textStyle.shadowOffsetX);
                startY += Math.abs(this._textStyle.shadowOffsetX);
            }

            var drawShadow = this._textStyle.shadow && (this._textStyle.shadowOffsetX > 0 || this._textStyle.shadowOffsetY > 0);
            var drawStroke = this._textStyle.stroke && this._textStyle.strokeWidth > 0;
            var fragments = this._fragments;
            var textData;
            var text;
            var color = this._textStyle.color;
            var x=0, y=startY;
            var offsetX = 0;

            context.font = this._textStyle.font;
            context.textAlign = 'start';
            context.textBaseline = 'top';

            for (var i = 0, len = fragments.length; i < len; i++) {
                textData = fragments[i];
                if(typeof textData !== 'string') {
                    if(textData.start) {
                        color = textData.color;
                        offsetX = textData.x;
                        textData = fragments[i+1];
                        i ++;
                    } else if(textData.end) {
                        color = this._textStyle.color;
                        offsetX = textData.x;
                        textData = fragments[i+1];
                        if(typeof textData !== 'string') {
                            continue;
                        }
                        i ++;
                    }
                } else {
                    offsetX = 0;
                }
                text = textData;
                x = startX + offsetX;
                if (i !== 0 && offsetX === 0) {
                    y += this.lineHeight;
                }

                if (drawShadow) {
                    context.fillStyle = this._textStyle.shadowColor;
                    context.fillText(text,
                        x + this._textStyle.shadowOffsetX,
                        y + this._textStyle.shadowOffsetY);
                }
                if (drawStroke) {
                    context.strokeStyle = this._textStyle.strokeColor;
                    context.lineWidth = this._textStyle.strokeWidth;
                    context.strokeText(text, x, y);
                }
                context.fillStyle = color;
                context.fillText(text, x, y);
            }
        }
        protected measureTextSize() {
            var measureSize;
            if(!this._text) {
                measureSize = {
                    width: 0,
                    height: 0
                };
            } else {
                var lineNum = this.parseText();
                var strokeExtend = this._textStyle.stroke ? this._textStyle.strokeWidth * 2 : 0;
                var shadowXExtend = this._textStyle.shadow ? Math.abs(this._textStyle.shadowOffsetX)*2 : 0;
                var shadowYExtend = this._textStyle.shadow ? Math.abs(this._textStyle.shadowOffsetY)*2 : 0;
                measureSize = {
                    width: this.lineWidth + strokeExtend + shadowXExtend,
                    height: this.lineHeight*lineNum + strokeExtend + shadowYExtend
                };
            }
            return measureSize;
        }

        protected generateCanvasTexture(renderer:renderer.IRenderer):void {
            super.generateCanvasTexture(renderer);
        }

        protected parseText() {
            var text = this._text;
            var fragments:Array<any> = [];
            text.trim();
            text = text.replace(/([\s\S]*?)<color value='(.*?)'>([\s\S]*?)<\/color>/ig, (word:string) => {
                var result = /([\s\S]*?)<color value='(.*?)'>([\s\S]*?)<\/color>/ig.exec(word);
                var presetText = result[1];
                var color = result[2];
                var colorText = result[3];
                if(presetText) {
                    fragments.push(presetText);
                }
                if(colorText) {
                    fragments.push({
                        color: color,
                        text: colorText
                    });
                }
                return '';
            });
            if(text) {
                fragments.push(text)
            }

            var helpContext = TextRenderer.helpContext;
            var lineWidth = this.lineWidth;
            var lineNum = 0;
            var line = '';
            var frag;
            var words;
            var wrappedFragments = [];
            var testWidthPreset = 0;

            helpContext.font = this._textStyle.font;

            for(var i=0,len=fragments.length; i<len; i++) {
                frag = fragments[i];
                if(typeof frag === 'string') {
                    words = frag;
                    for (var n = 0; n < words.length; n++) {
                        if(words[n] === '\n') {
                            wrappedFragments.push(line);
                            line = '';
                            lineNum++;
                            testWidthPreset = 0;
                        } else {
                            var testLine = line + words[n];
                            var metrics = helpContext.measureText(testLine);
                            var testWidth = metrics.width + testWidthPreset;
                            if (testWidth > lineWidth && n > 0) {
                                wrappedFragments.push(line);
                                line = words[n];
                                lineNum++;
                                testWidthPreset = 0;
                            }
                            else {
                                line = testLine;
                            }
                        }
                    }
                } else {
                    if(line) {
                        wrappedFragments.push(line);
                        testWidthPreset = Math.ceil(helpContext.measureText(line).width);
                        line = '';
                    }
                    var color = frag.color;
                    var words = frag.text;
                    wrappedFragments.push({
                        color: color,
                        start: true,
                        x: testWidthPreset
                    });
                    for (var n = 0; n < words.length; n++) {
                        if(words[n] === '\n') {
                            wrappedFragments.push(line);
                            line = '';
                            lineNum++;
                            testWidthPreset = 0;
                        } else {
                            var testLine = line + words[n];
                            var metrics = helpContext.measureText(testLine);
                            var testWidth = metrics.width + testWidthPreset;
                            if (testWidth > lineWidth && n > 0) {
                                wrappedFragments.push(line);
                                line = words[n];
                                lineNum++;
                                testWidthPreset = 0;
                            }
                            else {
                                line = testLine;
                            }
                        }
                    }
                    if(line) {
                        wrappedFragments.push(line);
                        testWidthPreset += Math.ceil(helpContext.measureText(line).width);
                        line = '';
                    } else {
                        testWidthPreset = 0;
                    }
                    wrappedFragments.push({
                        color: color,
                        end: true,
                        x: testWidthPreset
                    });
                }
            }

            if (line) {
                wrappedFragments.push(line);
                lineNum ++;
            }

            this._fragments = wrappedFragments;
            return lineNum;
        }

    }

    Component.register(RichTextRenderer, {
        name: 'RichTextRenderer',
        properties: [
            Component.extendConfig(CanvasRenderer),
            {
            name: 'text',
            type: 'string',
            defaultValue: ''
        }, {
            name: 'offset',
            type: 'spriteOffset',
            convert: PropertyConverter.array2point,
            defaultValue: [0, 0]
        }, {
            name: 'lineWidth',
            type: 'int',
            defaultValue: 256
        }, {
            name: 'lineHeight',
            type: 'int',
            defaultValue: 24
        }, {
            name: 'textStyle',
            type: 'textStyle',
            convert: PropertyConverter.json2TextStyle,
            defaultValue: {
                font: 'normal 24px Arial',
                color: '#000000',
                shadow: false,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                stroke: false,
                strokeColor: '#000000',
                strokeWidth: 0,
                align: TextStyle.START,
                baseline: TextStyle.TOP
            }
        }]
    });

}