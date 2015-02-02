module WOZLLA.event {

    /**
     * @enum {number} WOZLLA.event.EventPhase
     * all enumerations of event phase
     */
    export enum EventPhase {
        /** @property {number} [CAPTURE] */
        CAPTURE,
        /** @property {number} [BUBBLE] */
        BUBBLE,
        /** @property {number} [TARGET] */
        TARGET
    }

    /**
     * @class WOZLLA.event.Event
     * Base class for all event object of WOZLLA engine.    <br/>
     * see also:    <br/>
     * {@link WOZLLA.event.EventPhase}  <br/>
     * {@link WOZLLA.event.EventDispatcher}     <br/>
     */
    export class Event {

        /**
         * event data.
         * @member WOZLLA.event.Event
         * @property {any} data
         * @readonly
         */
        public get data():any { return this._data; }

        /**
         * event type.
         * @member WOZLLA.event.Event
         * @property {string} type
         * @readonly
         */
        get type():string {
            return this._type;
        }

        /**
         * event origin target.
         * @member WOZLLA.event.Event
         * @property {WOZLLA.event.EventDispatcher} target
         * @readonly
         */
        get target():EventDispatcher {
            return this._target;
        }

        /**
         * current event target in event bubbling.
         * @member WOZLLA.event.Event
         * @property {WOZLLA.event.EventDispatcher} currentTarget
         * @readonly
         */
        get currentTarget():EventDispatcher {
            return this._currentTarget;
        }

        /**
         * which phase this event is in.
         * @member WOZLLA.event.Event
         * @property {WOZLLA.event.EventPhase} eventPhase
         * @readonly
         */
        get eventPhase():EventPhase {
            return this._eventPhase;
        }

        /**
         * true to identify this event could be bubbled, false otherwise.
         * @member WOZLLA.event.Event
         * @property {boolean} bubbles
         * @readonly
         */
        get bubbles():boolean {
            return this._bubbles;
        }

        /**
         * true to identify this event could be stop bubbles, false otherwise.
         * @member WOZLLA.event.Event
         * @property {boolean} canStopBubbles
         * @readonly
         */
        get canStopBubbles():boolean {
            return this._canStopBubbles;
        }

        _type:string;
        _target:EventDispatcher;
        _currentTarget:EventDispatcher;
        _data:any;
        _bubbles:boolean;
        _canStopBubbles:boolean;
        _eventPhase:EventPhase = EventPhase.CAPTURE;
        _immediatePropagationStoped:boolean = false;
        _propagationStoped:boolean = false;

        _listenerRemove:boolean = false;

        /**
         * @method constructor
         * create a new Event object
         * @member WOZLLA.event.Event
         * @param {string} type
         * @param {boolean} bubbles
         * @param {any} data
         * @param {boolean} canStopBubbles
         */
        constructor(type:string, bubbles:boolean=false, data:any=null, canStopBubbles:boolean=true) {
            this._type = type;
            this._bubbles = bubbles;
            this._data = data;
            this._canStopBubbles = canStopBubbles;
        }

        /**
         * @method isStopPropagation
         * @member WOZLLA.event.Event
         * @returns {boolean}
         */
        isStopPropagation():boolean {
            return this._propagationStoped;
        }

        /**
         * stop bubble to next parent
         * @method stopPropagation
         * @member WOZLLA.event.Event
         */
        stopPropagation() {
            if(!this._canStopBubbles) {
                return;
            }
            this._propagationStoped = true;
        }

        /**
         * @method isStopImmediatePropagation
         * @member WOZLLA.event.Event
         * @returns {boolean}
         */
        isStopImmediatePropagation():boolean {
            return this._immediatePropagationStoped;
        }

        /**
         * stop event bubble immediately even other listeners dosen't receive this event.
         * @method stopImmediatePropagation
         * @member WOZLLA.event.Event
         */
        stopImmediatePropagation() {
            if(!this._canStopBubbles) {
                return;
            }
            this._immediatePropagationStoped = true;
            this._propagationStoped = true;
        }

        /**
         * call from current listener to remove the current listener
         */
        removeCurrentListener() {
            this._listenerRemove = true;
        }

    }

}