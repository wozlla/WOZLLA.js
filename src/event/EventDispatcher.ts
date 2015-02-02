/// <reference path="Event.ts"/>
module WOZLLA.event {

    var SCOPE = '_EventDispatcher_scope';

    class ListenerList {

        _listeners = [];

        add(listener:Function) {
            this._listeners.push(listener);
        }

        remove(listener:Function, scope?:any) {
            var i, len = this._listeners.length;
            var l;
            for(i=0; i<len; i++) {
                l = this._listeners[i];
                if(l === listener) {
                    if(!scope || scope === l[SCOPE]) {
                        this._listeners.splice(i, 1);
                    }
                    return true;
                }
            }
            return false;
        }

        removeAt(idx):any {
            return this._listeners.splice(idx, 1);
        }

        get(idx) {
            return this._listeners[idx];
        }

        length() {
            return this._listeners.length;
        }

        clear() {
            this._listeners.length = 0;
        }
    }

    /**
     * @class WOZLLA.event.EventDispatcher
     * Base class for bubblable event system
     *
     */
    export class EventDispatcher {

        private _captureDict = {};
        private _bubbleDict = {};
        private _bubbleParent:EventDispatcher;

        /**
         * @method setBubbleParent
         * set bubble parent of this dispatcher
         * @param {WOZLLA.event.EventDispatcher} bubbleParent
         */
        setBubbleParent(bubbleParent:EventDispatcher) {
            this._bubbleParent = bubbleParent;
        }

        /**
         * @method hasListener
         * @param {string} type
         * @param {boolean} useCapture true to check capture phase, false to check bubble and target phases.
         */
        hasListener(type:string, useCapture:boolean=false):boolean {
            return this._getListenerList(type, useCapture).length() > 0;
        }

        /**
         * @method getListenerCount
         * @param {string} type
         * @param {boolean} useCapture true to check capture phase, false to check bubble and target phases.
         * @returns {number}
         */
        getListenerCount(type:string, useCapture:boolean):number {
            return this._getListenerList(type, useCapture).length()
        }

        /**
         * @method addListener
         * @param {string} type
         * @param {boolean} useCapture true to check capture phase, false to check bubble and target phases.
         */
        addListener(type:string, listener:Function, useCapture:boolean=false) {
            this._getListenerList(type, useCapture).add(listener);
        }

        addListenerScope(type:string, listener:Function, scope:any, useCapture:boolean=false) {
            listener[SCOPE] = scope;
            this.addListener(type, listener, useCapture);
        }

        /**
         * @method removeListener
         * @param {string} type
         * @param {boolean} useCapture true to check capture phase, false to check bubble and target phases.
         */
        removeListener(type:string, listener:Function, useCapture:boolean=false):boolean {
            return this._getListenerList(type, useCapture).remove(listener);
        }

        removeListenerScope(type:string, listener:Function, scope:any , userCapture:boolean=false):boolean {
            return this._getListenerList(type, userCapture).remove(listener, scope);
        }

        /**
         * @method clearListeners
         * @param {string} type
         * @param {boolean} useCapture true to check capture phase, false to check bubble and target phases.
         */
        clearListeners(type:string, useCapture:boolean) {
            this._getListenerList(type, useCapture).clear();
        }

        /**
         * @method clearAllListeners
         *  clear all listeners
         */
        clearAllListeners() {
            this._captureDict = {};
            this._bubbleDict = {};
        }

        /**
         * @method dispatch an event
         * @param {WOZLLA.event.Event} event
         */
        dispatchEvent(event:Event) {
            var i,
                len,
                ancients,
                ancient;

            event._target = this;
            if(!event.bubbles) {
                this._dispatchEventInPhase(event, EventPhase.TARGET);
                return;
            }

            ancients = this._getAncients();
            len = ancients.length;
            for(i=len-1; i>=0; i--) {
                ancient = ancients[i];
                if(ancient._dispatchEventInPhase(event, EventPhase.CAPTURE)) {
                    return;
                }
            }

            if(this._dispatchEventInPhase(event, EventPhase.CAPTURE)) {
                return;
            }

            if(this._dispatchEventInPhase(event, EventPhase.TARGET)) {
                return;
            }

            for(i=0; i<len; i++) {
                ancient = ancients[i];
                if(ancient._dispatchEventInPhase(event, EventPhase.BUBBLE)) {
                    return;
                }
            }
        }

        _dispatchEventInPhase(event:Event, phase:EventPhase):boolean {
            var i, len;
            var listener:Function;
            var scope:any;
            var listenerList:ListenerList;

            event._eventPhase = phase;
            event._listenerRemove = false;
            event._currentTarget = this;

            listenerList = this._getListenerList(event.type, phase === EventPhase.CAPTURE);
            len = listenerList.length();
            if(len > 0) {
                for (i = len-1; i >= 0; i--) {
                    listener = listenerList.get(i);
                    scope = listener[SCOPE];
                    if(scope) {
                        listener.call(scope, event);
                    } else {
                        listener(event);
                    }

                    // handle remove listener when client call event.removeCurrentListener();
                    if(event._listenerRemove) {
                        event._listenerRemove = false;
                        listenerList.removeAt(i);
                    }

                    if(event.isStopImmediatePropagation()) {
                        return true;
                    }
                }
                if(event.isStopPropagation()) {
                    return true;
                }
            }
            return false;
        }

        private _getAncients() {
            var ancients = [];
            var parent:any = this;
            while (parent._bubbleParent) {
                parent = parent._bubbleParent;
                ancients.push(parent);
            }
            return ancients;
        }

        private _getListenerList(type:string, useCapture:boolean):ListenerList {
            var listenerList;
            var dict = useCapture ? this._captureDict : this._bubbleDict;
            listenerList = dict[type];
            if(!listenerList) {
                listenerList = new ListenerList();
                dict[type] = listenerList;
            }
            return listenerList;
        }

    }

}