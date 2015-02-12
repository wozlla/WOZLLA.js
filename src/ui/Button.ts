/// <reference path="StateWidget.ts"/>
/// <reference path="../component/renderer/SpriteRenderer.ts"/>
/// <reference path="../component/PropertySnip.ts"/>
module WOZLLA.ui {

    /**
     * @class WOZLLA.ui.Button
     */
    export class Button extends StateWidget {

        public static STATE_NORMAL = 'normal';
        public static STATE_DISABLED = 'disabled';
        public static STATE_PRESSED = 'pressed';

        get normalSpriteName():string { return this.getStateSpriteName(Button.STATE_NORMAL); }
        set normalSpriteName(spriteName:string) {
            this.setStateSpriteName(Button.STATE_NORMAL, spriteName);
        }

        get disabledSpriteName():string { return this.getStateSpriteName(Button.STATE_DISABLED); }
        set disabledSpriteName(spriteName:string) {
            this.setStateSpriteName(Button.STATE_DISABLED, spriteName);
        }

        get pressedSpriteName():string { return this.getStateSpriteName(Button.STATE_PRESSED); }
        set pressedSpriteName(spriteName:string) {
            this.setStateSpriteName(Button.STATE_PRESSED, spriteName);
        }

        get scaleOnPress():number { return this._scaleOnPress; }
        set scaleOnPress(value:number) { this._scaleOnPress = value; }

        _scaleOnPress:number = 1.2;
        _originScaleX:number;
        _originScaleY:number;

        _touchTime:number;
        _touchTween;
        _scaleTimer;

        init() {
            this._originScaleX = this.transform.scaleX;
            this._originScaleY = this.transform.scaleY;
            this.gameObject.addListener('touch', (e) => this.onTouch(e));
            this.gameObject.addListener('release', (e) => this.onRelease(e));
            super.init();
        }

        isEnabled() {
            return this._stateMachine.getCurrentState() !== Button.STATE_DISABLED;
        }

        setEnabled(enabled:boolean=true) {
            this._stateMachine.changeState(enabled ? Button.STATE_NORMAL : Button.STATE_DISABLED);
            this._gameObject.touchable = enabled;
        }

        protected initStates():void {
            this._stateMachine.defineState(Button.STATE_NORMAL, true);
            this._stateMachine.defineState(Button.STATE_DISABLED);
            this._stateMachine.defineState(Button.STATE_PRESSED);
        }

        protected onTouch(e) {
            this._stateMachine.changeState(Button.STATE_PRESSED);
            if(this._scaleOnPress) {
                this._touchTime = Time.now;
                this._touchTween = this.transform.tween(false).to({
                    scaleX: this._scaleOnPress * this._originScaleX,
                    scaleY: this._scaleOnPress * this._originScaleY
                }, 100);
            }
        }

        protected onRelease(e) {
            this._stateMachine.changeState(Button.STATE_NORMAL);
            this._scaleTimer && this.scheduler.removeSchedule(this._scaleTimer);
            if(this._scaleOnPress) {
                this._scaleTimer = this.scheduler.scheduleTime(() => {
                    this._touchTween.setPaused();
                    this.transform.tween(false).to({
                        scaleX: this._originScaleX,
                        scaleY: this._originScaleY
                    }, 100);
                }, 100 + this._touchTime - Time.now);
            }
        }

    }

    Component.register(Button, {
        name: "Button",
        properties: [
            Component.extendConfig(StateWidget),
            WOZLLA.component.PropertySnip.createSpriteFrame('disabledSpriteName'),
            WOZLLA.component.PropertySnip.createSpriteFrame('normalSpriteName'),
            WOZLLA.component.PropertySnip.createSpriteFrame('pressedSpriteName'),
            {
                name: 'scaleOnPress',
                type: 'number',
                defaultValue: 1.2
            }
        ]
    });

}