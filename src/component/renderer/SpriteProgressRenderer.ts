/// <reference path="SpriteRenderer.ts"/>
/// <reference path="../../assets/proxy/SpriteAtlasProxy.ts"/>
/// <reference path="../../assets/Sprite.ts"/>
/// <reference path="../../assets/SpriteAtlas.ts"/>
module WOZLLA.component {

    /**
     * @class WOZLLA.component.SpriteProgressRenderer
     */
    export class SpriteProgressRenderer extends SpriteRenderer {

        public static HORIZONTAL = 'horizontal';
        public static VERTICAL = 'vertical';

        get progress():number {
            return this._progress;
        }
        set progress(value:number) {
            if(this._progress === value) return;
            this._progress = value;
            this._textureUVS = null;
            this._quadVertexDirty = true;
        }

        set animateProgress(value:number) {
            this.setProgress(value);
        }

        public animate:boolean = false;
        public speed:number = 1;
        public direction:string = SpriteProgressRenderer.HORIZONTAL;

        _progress:number = 100.0;
        _tween;

        _progressFrame = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };

        setProgress(progress:number) {
            if(this.animate) {
                var delta = Math.abs(progress-this._progress);
                utils.Tween.get(this).to({
                    progress: progress
                }, 1000/this.speed*delta/100);
            } else {
                this.progress = progress;
                this._tween && this._tween.setPaused();
                this._tween = null;
            }
        }

        destroy() {
            this._tween && this._tween.setPaused();
            this._tween = null;
            super.destroy();
        }

        _getTextureFrame() {
            var frame = super._getTextureFrame();
            var persentage = 0;
            this._progressFrame.x = frame.x;
            this._progressFrame.y = frame.y;
            if(this._progress > 100) {
                persentage = this._progress % 100 / 100.0;
            } else {
                persentage = this._progress / 100.0;
            }
            if(this.direction === SpriteProgressRenderer.HORIZONTAL) {
                this._progressFrame.width = frame.width * persentage;
                this._progressFrame.height = frame.height;
            } else {
                this._progressFrame.width = frame.width;
                this._progressFrame.height = frame.height * persentage;
            }
            return this._progressFrame;
        }

    }

    Component.register(SpriteProgressRenderer, {
        name: "SpriteProgressRenderer",
        properties: [
            Component.extendConfig(SpriteRenderer),
            {
                name: 'progress',
                type: 'number',
                defaultValue: 100.0
            },
            {
                name: 'animate',
                type: 'boolean',
                defaultValue: false
            },
            {
                name: 'speed',
                type: 'number',
                defaultValue: 1
            },
            {
                name: 'direction',
                type: 'string',
                editor: 'combobox',
                defaultValue: SpriteProgressRenderer.HORIZONTAL,
                data: [SpriteProgressRenderer.HORIZONTAL, SpriteProgressRenderer.VERTICAL]
            }
        ]
    });

}