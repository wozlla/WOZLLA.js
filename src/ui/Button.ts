/// <reference path="StateWidget.ts"/>
/// <reference path="../component/renderer/SpriteRenderer.ts"/>
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

        init() {
            this.gameObject.addListener('touch', (e) => this.onTouch(e));
            this.gameObject.addListener('release', (e) => this.onRelease(e));
            this.gameObject.addListener('tap', (e) => this.onTap(e));
            super.init();
        }

        destroy() {
            this._stateMachine.clearAllListeners();
            super.destroy();
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
        }

        protected onRelease(e) {
            this._stateMachine.changeState(Button.STATE_NORMAL);
        }

        protected onTap(e) {

        }


    }

}