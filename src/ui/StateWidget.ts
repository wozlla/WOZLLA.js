/// <reference path="../core/Component.ts"/>
/// <reference path="../utils/StateMachine.ts"/>
/// <reference path="../component/renderer/SpriteRenderer.ts"/>
/// <reference path="../component/PropertySnip.ts"/>
module WOZLLA.ui {

    var StateMachine = WOZLLA.utils.StateMachine;

    /**
     * @class WOZLLA.ui.StateWidget
     * @protected
     */
    export class StateWidget extends WOZLLA.component.SpriteRenderer {

        _stateMachine:WOZLLA.utils.StateMachine = new WOZLLA.utils.StateMachine();

        constructor() {
            super();
            this.initStates();
        }

        init():void {
            this._stateMachine.addListener(StateMachine.INIT, (e) => this.onStateChange(e));
            this._stateMachine.addListener(StateMachine.CHANGE, (e) => this.onStateChange(e));
            this._stateMachine.init();
            super.init();
        }

        destroy() {
            this._stateMachine.clearAllListeners();
            super.destroy();
        }

        protected initStates():void {
        }

        protected getStateSpriteName(state:string):string {
            return this._stateMachine.getStateData(state, 'spriteName');
        }

        protected setStateSpriteName(state:string, spriteName:string) {
            this._stateMachine.setStateData(state, 'spriteName', spriteName);
        }

        protected onStateChange(e) {
            this.spriteName = this.getStateSpriteName(e.data.state);
        }

    }

    Component.register(StateWidget, {
        name: "StateWidget",
        abstractComponent: true,
        properties: [
            Component.extendConfig(WOZLLA.component.SpriteRenderer, function(propConfig) {
                return propConfig.name !== 'spriteName' &&
                    propConfig.name !== 'imageSrc';
            })
        ]
    });

}