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
        inSchedule:boolean = true;
        canvas:HTMLCanvasElement = null;
        canvasOffset:any = null;
        touchScale:number;
        hammer:HammerManager;

        channelMap = {};

        constructor(canvas:HTMLCanvasElement, touchScale:number=1) {
            var me = this;
            //var nav:any = window.navigator;
            me.canvas = canvas;
            me.touchScale = touchScale;
            me.updateCanvasOffset();

            if(window['Hammer']) {
                me.hammer = new Hammer.Manager(canvas);
                me.hammer.add(new Hammer.Tap());
                me.hammer.add(new Hammer.Pan({ threshold: 2 }));
                me.hammer.on(Touch.enabledGestures || 'hammer.input tap swipe panstart panmove panend', function (e) {
                    if(e.type === 'hammer.input' && !e.isFinal && !e.isFirst) {
                        return;
                    }
                    if(e.type.indexOf('pan') === 0) {
                        console.log(e.type, e.velocityX, e.velocityY);
                    }
                    if (e.isFinal || me.enabled) {
                        if(me.inSchedule) {
                            Scheduler.getInstance().scheduleFrame(function () {
                                me.onGestureEvent(e);
                            });
                        } else {
                            me.onGestureEvent(e);
                        }
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

        updateCanvasOffset() {
            this.canvasOffset = getCanvasOffset(this.canvas);
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

            if(type === 'hammer.input') {
                if (e.isFirst) {
                    type = 'touch';
                }
                else if (e.isFinal) {
                    type = 'release';
                }
            }

            changedTouches = e.srcEvent.changedTouches;

            if (!changedTouches) {
                identifier = 1;
                x = e.srcEvent.pageX - me.canvasOffset.x;
                y = e.srcEvent.pageY - me.canvasOffset.y;

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

                    if(type === 'hammer.input') {
                        if(e.isFirst) {
                            type = 'touch';
                        }
                        else if(e.isFinal) {
                            type = 'release';
                        }
                    }

                    switch (type) {
                        case 'panmove':
                            if (!touchMoveDetection) {
                                target = touchTarget;
                                break;
                            }
                        case 'release':
                        case 'tap':
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
                        gesture : e,
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