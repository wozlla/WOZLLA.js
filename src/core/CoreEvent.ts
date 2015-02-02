/// <reference path="../event/Event.ts"/>
module WOZLLA {

    /**
     * internal class
     * @class WOZLLA.CoreEvent
     * @extends WOZLLA.event.Event
     */
    export class CoreEvent extends WOZLLA.event.Event {

        /**
         * new a CoreEvent
         * @method constructor
         * @param type
         * @param bubbles
         * @param data
         * @param canStopBubbles
         */
        constructor(type:string, bubbles:boolean=false, data:any=null, canStopBubbles:boolean=true) {
            super(type, bubbles, data, canStopBubbles);
        }

    }

}