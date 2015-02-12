/// <reference path="StateWidget.ts"/>
/// <reference path="../component/renderer/SpriteRenderer.ts"/>
/// <reference path="../component/PropertySnip.ts"/>
module WOZLLA.ui {

    /**
     * @class WOZLLA.ui.CheckBox
     */
    export class CheckBox extends StateWidget {

        public static EVENT_CHECK_CHANGE = 'CheckBox.checkChange';

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

        public initState:string = CheckBox.STATE_CHECKED;

        init() {
            this._gameObject.addListener('tap', (e) => this.onTap(e));
            super.init();
            if(!this.initState) {
                this.initState = CheckBox.STATE_CHECKED;
            }
            this._stateMachine.changeState(this.initState);
        }

        isEnabled() {
            return this._stateMachine.getCurrentState() !== CheckBox.STATE_DISABLED;
        }

        setEnabled(enabled:boolean=true) {
            this._stateMachine.changeState(enabled ? CheckBox.STATE_UNCHECKED : CheckBox.STATE_DISABLED);
            this._gameObject.touchable = enabled;
        }

        setChecked(checked:boolean=true) {
            if(this.isEnabled()) {
                this._stateMachine.changeState(checked ? CheckBox.STATE_CHECKED : CheckBox.STATE_UNCHECKED);
            }
        }

        isChecked() {
            return this._stateMachine.getCurrentState() === CheckBox.STATE_CHECKED;
        }

        protected initStates():void {
            if(!this.initState) {
                this.initState = CheckBox.STATE_CHECKED;
            }
            this._stateMachine.defineState(CheckBox.STATE_UNCHECKED, this.initState === CheckBox.STATE_UNCHECKED);
            this._stateMachine.defineState(CheckBox.STATE_DISABLED, this.initState === CheckBox.STATE_DISABLED);
            this._stateMachine.defineState(CheckBox.STATE_CHECKED, this.initState === CheckBox.STATE_CHECKED);
        }

        protected onTap(e) {
            if(this.isEnabled()) {
                this.setChecked(this._stateMachine.getCurrentState() !== CheckBox.STATE_CHECKED);
                this.gameObject.dispatchEvent(new WOZLLA.event.Event(
                    CheckBox.EVENT_CHECK_CHANGE, true, this.isChecked()));
            }
        }
    }

    Component.register(CheckBox, {
        name: "CheckBox",
        properties: [
            Component.extendConfig(StateWidget),
            WOZLLA.component.PropertySnip.createSpriteFrame('disabledSpriteName'),
            WOZLLA.component.PropertySnip.createSpriteFrame('uncheckedSpriteName'),
            WOZLLA.component.PropertySnip.createSpriteFrame('checkedSpriteName'),
            {
                name: 'initState',
                type: 'string',
                editor: 'combobox',
                defaultValue: CheckBox.STATE_CHECKED,
                data: [
                    CheckBox.STATE_CHECKED,
                    CheckBox.STATE_UNCHECKED,
                    CheckBox.STATE_DISABLED
                ]
            }
        ]
    });

}