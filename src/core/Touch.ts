/// <reference path="../../typings/tsd.d.ts"/>
/// <reference path="Scheduler.ts"/>
/// <reference path="Stage.ts"/>
/// <reference path="Director.ts"/>
module WOZLLA {

    function getCanvasOffset(canvas:any) {
        var obj = canvas;
        var offset = { x : obj.offsetLeft, y : obj.offsetTop };
        while ( obj = obj.offsetParent ) {
            offset.x += obj.offsetLeft;
            offset.y += obj.offsetTop;
        }
        return offset;
    }

    export class GestureEvent extends WOZLLA.event.Event {

        x:number;
        y:number;
        touch:any;
        touchMoveDetection:boolean = false;
        gesture:any;
        identifier:any;

        constructor(params:any) {
            super(params.type, params.bubbles, params.data);
            this.x = params.x;
            this.y = params.y;
            this.touch = params.touch;
            this.touchMoveDetection = params.touchMoveDetection;
            this.gesture = params.gesture;
            this.identifier = params.identifier;
        }

        setTouchMoveDetection(value:boolean) {
            this.touchMoveDetection = value;
        }
    }

    /**
     * class for touch management <br/>
     * get the instance form {@link WOZLLA.Director}
     * @class WOZLLA.Touch
     * @protected
     */
    export class Touch {

        private static enabledGestures:string;

        public static setEanbledGestures(gestures) {
            this.enabledGestures = gestures;
        }

        /**
         * get or set enabled of touch system
         * @property {boolean} enabled
         */
        enabled:boolean = true;
        canvas:HTMLCanvasElement = null;
        canvasOffset:any = null;
        touchScale:number;
        hammer:HammerManager;

        channelMap = {};

        constructor(canvas:HTMLCanvasElement, touchScale:number=1) {
            var me = this;
            var nav:any = window.navigator;
            me.canvas = canvas;
            me.canvasOffset = getCanvasOffset(canvas);
            me.touchScale = touchScale;

            if(window['Hammer']) {
                me.hammer = new Hammer(canvas, {
                    transform: false,
                    doubletap: false,
                    hold: false,
                    rotate: false,
                    pinch: false
                });

                me.hammer.on(Touch.enabledGestures || 'touch release tap swipe drag dragstart dragend', function (e) {
                    if (e.type === 'release' || me.enabled) {
                        Scheduler.getInstance().scheduleFrame(function () {
                            me.onGestureEvent(e);
                        });
                    }
                });
            } else {
                me.canvas.addEventListener('touchstart', function() {
                    console.error('please import hammer.js');
                });
                me.canvas.addEventListener('mousedown', function() {
                    console.error('please import hammer.js');
                });
            }
        }

        onGestureEvent(e) {
            var x, y,
                i, len,
                touch,
                identifier,
                channel,
                changedTouches,
                target,
                type = e.type,
                stage = Director.getInstance().stage;

            var me = this;
            var canvasScale = this.touchScale || 1;

            changedTouches = e.gesture.srcEvent.changedTouches;

            if (!changedTouches) {
                identifier = 1;
                x = e.gesture.srcEvent.pageX - me.canvasOffset.x;
                y = e.gesture.srcEvent.pageY - me.canvasOffset.y;

                x *= canvasScale;
                y *= canvasScale;

                if (type === 'touch') {
                    target = stage.getUnderPoint(x, y, true);
                    if (target) {
                        me.channelMap[identifier] = me.createDispatchChanel(target);
                    } else {
                        delete me.channelMap[identifier];
                    }
                }

                channel = me.channelMap[identifier];
                channel && channel.onGestureEvent(e, target, x, y, identifier);
            } else {
                len = changedTouches.length;
                for(i=0; i<len; i++) {
                    touch = changedTouches[i];
                    identifier = parseInt(touch.identifier);
                    x = touch.pageX - me.canvasOffset.x;
                    y = touch.pageY - me.canvasOffset.y;

                    x *= canvasScale;
                    y *= canvasScale;

                    if (type === 'touch') {
                        target = stage.getUnderPoint(x, y, true);
                        if (target) {
                            me.channelMap[identifier] = me.createDispatchChanel(target);
                            delete me.channelMap[identifier - 10];
                        }
                    }

                    channel = me.channelMap[identifier];
                    channel && channel.onGestureEvent(e, target, x, y, identifier);
                }
            }
        }

        createDispatchChanel(touchTarget) {
            var touchMoveDetection = true;
            return {
                onGestureEvent : function(e, target, x, y, identifier) {
                    var touchEvent,
                        type = e.type,
                        stage = Director.getInstance().stage;

                    switch(type) {
                        case 'drag':
                            if(!touchMoveDetection) {
                                target = touchTarget;
                                break;
                            }
                        case 'tap':
                        case 'release':
                            target = stage.getUnderPoint(x, y, true);
                            break;
                    }

                    if(type === 'tap' && touchTarget !== target) {
                        return;
                    }

                    touchEvent = new GestureEvent({
                        x: x,
                        y: y,
                        type: type,
                        bubbles: true,
                        touch: target,
                        gesture : e.gesture,
                        identifier : identifier,
                        touchMoveDetection : false
                    });

                    touchTarget.dispatchEvent(touchEvent);
                    touchMoveDetection = touchEvent.touchMoveDetection;
                }
            }

        }
    }

}