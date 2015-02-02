/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="Assert.ts"/>
module WOZLLA.utils {

    export class StateMachine extends WOZLLA.event.EventDispatcher {

        public static INIT:string = 'state.init';
        public static CHANGE:string = 'state.change';

        _defaultState:string;
        _currentState:string;
        _currentTransition:ITransition;
        _stateConfig:any = {};

        defineState(name:string, isDefault:boolean=false) {
            Assert.isUndefined(this._stateConfig[name], 'state "' + name + '" has been defined');
            this._stateConfig[name] = {
                data: {}
            };
            if(isDefault) {
                this._defaultState = name;
            }
        }

        getStateData(state:string, key:string) {
            Assert.isNotUndefined(this._stateConfig[state], 'state "' + state + '" not defined');
            return this._stateConfig[state].data[key];
        }

        setStateData(state:string, key:string, data:any) {
            Assert.isNotUndefined(this._stateConfig[state], 'state "' + state + '" not defined');
            this._stateConfig[state].data[key] = data;
        }

        defineTransition(fromState:string, toState:string, transition:ITransition) {
            Assert.isNotUndefined(this._stateConfig[fromState], 'state "' + fromState + '" not defined');
            Assert.isNotUndefined(this._stateConfig[toState], 'state "' + toState + '" not defined');
            this._stateConfig[fromState][toState] = transition;
        }

        init() {
            this._currentState = this._defaultState;
            this.dispatchEvent(new WOZLLA.event.Event(StateMachine.INIT, false, new StateEventData(this._currentState)));
        }

        getCurrentState():string {
            return this._currentState;
        }

        changeState(state:string) {
            var from, to, transition;
            Assert.isNotUndefined(this._stateConfig[state]);
            from = this._currentState;
            to = state;
            transition = this._stateConfig[state][to] || EmptyTransition.getInstance();
            if(this._currentTransition) {
                this._currentTransition.cancel();
            }
            transition.reset();
            transition.execute(from, to, () => {
                this._currentTransition = null;
                this._currentState = to;
                this.dispatchEvent(new WOZLLA.event.Event(StateMachine.CHANGE, false, new StateEventData(this._currentState)));
            });
            this._currentTransition = transition;
        }

    }

    export class StateEventData {
        public state:string;
        constructor(state:string) {
            this.state = state;
        }
    }

    export interface ITransition {
        reset();
        cancel();
        execute(fromState:string, toState:string, onComplete:Function);
    }

    export class EmptyTransition implements ITransition {

        private static instance:EmptyTransition;

        public static getInstance():EmptyTransition {
            if(!EmptyTransition.instance) {
                EmptyTransition.instance = new EmptyTransition();
            }
            return EmptyTransition.instance;
        }

        _canceled:boolean = false;

        reset() {
            this._canceled = false;
        }

        cancel() {
            this._canceled = true;
        }

        execute(fromState:string, toState:string, onComplete:Function) {
            if(this._canceled) {
                return;
            }
            onComplete();
        }
    }

}