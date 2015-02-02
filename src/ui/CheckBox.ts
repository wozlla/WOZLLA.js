/// <reference path="StateWidget.ts"/>
/// <reference path="../component/renderer/SpriteRenderer.ts"/>
module WOZLLA.ui {

    /**
     * @class WOZLLA.ui.CheckBox
     */
    export class CheckBox extends StateWidget {

        public static STATE_UNCHECKED = 'unchecked';
        public static STATE_CHECKED = 'checked';
        public static STATE_DISABLED = 'disabled';

        get uncheckedSpriteName():string { return this.getStateSpriteName(CheckBox.STATE_UNCHECKED); }
        set uncheckedSpriteName(spriteName:string) {
            this.setStateSpriteName(CheckBox.STATE_UNCHECKED, spriteName);
        }

        get disabledSpriteName():string { return this.getStateSpriteName(CheckBox.STATE_DISABLED); }
        set disabledSpriteName(spriteName:string) {
            this.setStateSpriteName(CheckBox.STATE_DISABLED, spriteName);
        }

        get checkedSpriteName():string { return this.getStateSpriteName(CheckBox.STATE_CHECKED); }
        set checkedSpriteName(spriteName:string) {
            this.setStateSpriteName(CheckBox.STATE_CHECKED, spriteName);
        }

        init() {
            this._gameObject.addListener('tap', (e) => this.onTap(e));
            super.init();
        }

        destroy() {
            this._stateMachine.clearAllListeners();
            super.destroy();
        }

        isEnabled() {
            return this._stateMachine.getCurrentState() !== CheckBox.STATE_DISABLED;
        }

        setEnabled(enabled:boolean=true) {
            this._stateMachine.changeState(enabled ? CheckBox.STATE_UNCHECKED : CheckBox.STATE_DISABLED);
            this._gameObject.touchable = enabled;
        }

        protected initStates():void {
            this._stateMachine.defineState(CheckBox.STATE_UNCHECKED, true);
            this._stateMachine.defineState(CheckBox.STATE_DISABLED);
            this._stateMachine.defineState(CheckBox.STATE_CHECKED);
        }

        protected onTap(e) {
            if(this._stateMachine.getCurrentState() === CheckBox.STATE_CHECKED) {
                this._stateMachine.changeState(CheckBox.STATE_UNCHECKED);
            } else {
                this._stateMachine.changeState(CheckBox.STATE_CHECKED);
            }
        }
    }

}