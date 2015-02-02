/// <reference path="SpriteRenderer.ts"/>
/// <reference path="../../utils/Tween.ts"/>
module WOZLLA.component {

    export class AnimationRenderer extends SpriteRenderer {

        public static MODE_LOOP = 'loop';
        public static MODE_NONLOOP = 'nonloop';

        get autoOffset():boolean { return this._autoOffset; }
        set autoOffset(value:boolean) { this._autoOffset = value; }

        get frameNum():number { return this._frameNum; }
        set frameNum(value:number) {
            var value = Math.floor(value);
            if(this._frameNum === value) return;
            this._frameNum = value;
            this._frameNumDirty = true;
        }

        get duration():number {
            return this._duration;
        }
        set duration(value:number) {
            this._duration = value;
        }

        get playMode():string {
            return this._playMode;
        }
        set playMode(value:string) {
            this._playMode = value;
        }

        get frameLength():number {
            return this._spriteProxy.getFrameLength();
        }

        _frameNum:number;
        _frameNumDirty:boolean = true;
        _autoOffset:boolean = true;
        _playMode:string = AnimationRenderer.MODE_NONLOOP;

        _playing:boolean = false;
        _duration:number;
        _playTween:utils.Tween;

        play(duration:number=this._duration) {
            if(this.frameLength <= 0) return;
            this._duration = duration;
            this._playing = true;
            this._frameNum = 0;
            if(this._playTween) {
                this._playTween.setPaused(true);
            }
            this._playTween = utils.Tween.get(this).to({
                frameNum: this.frameLength
            }, duration);
        }

        pause() {
            if(this._playing) {
                this._playTween.setPaused(true);
                this._playing = false;
            }
        }

        resume() {
            if(!this._playing && this._playTween) {
                this._playTween.setPaused(false);
                this._playing = true;
            }
        }

        stop() {
            if(this._playing || this._playTween) {
                this._playTween.setPaused(false);
                this._playTween = null;
            }
        }

        render(renderer:WOZLLA.renderer.IRenderer, flags:number):void {
            if(this._frameNumDirty) {
                this._frameNumDirty = false;
                this.updateAnimationFrame();
            }
            super.render(renderer, flags);
        }

        protected updateAnimationFrame() {
            var frame;
            var frameLength = this.frameLength;
            if(frameLength === 0) {
                this.sprite = null;
            } else {
                if(this._frameNum >= frameLength) {
                    if(this._playMode === AnimationRenderer.MODE_LOOP) {
                        this.play();
                    } else {
                        this._frameNum = frameLength - 1;
                        this.dispatchEvent(new WOZLLA.event.Event('animationend'));
                        this.stop();
                    }
                }
                this.sprite = this._spriteProxy.getSprite(this._frameNum);
                frame = this.sprite.frame;
                if(this._autoOffset) {
                    this.spriteOffset = {
                        x: -frame.offsetX/frame.width || 0,
                        y: -frame.offsetY/frame.height || 0
                    };
                }
                this.dispatchEvent(new WOZLLA.event.Event('framechanged', false, {
                    frame: this._frameNum
                }))
            }
        }

    }



}