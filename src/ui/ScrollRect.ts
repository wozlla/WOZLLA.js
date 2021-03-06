/// <reference path="../core/Component.ts"/>
/// <reference path="../component/PropertyConverter.ts"/>
/// <reference path="../math/MathUtils.ts"/>
module WOZLLA.ui {

    var helpPoint = { x: 0, y: 0 };

    var rectIntersect2 = math.MathUtils.rectIntersect2;

    function middle(a:number, b:number, c:number) {
        return (a < b ? (b < c ? b : a < c ? c : a) : (b > c ? b : a > c ? c : a));
    }

    export class ScrollRect extends Behaviour {

        public static globalScrollEnabled:boolean = true;

        public static HORIZONTAL:string = 'Horizontal';
        public static VERTICAL:string = 'Vertical';
        public static BOTH:string = 'both';

        get direction():string { return this._direction; }
        set direction(value:string) { this._direction = value; }

        get enabled():boolean { return this._enabled; }
        set enabled(value:boolean) { this._enabled = value; }

        get content():string { return this._content; }
        set content(value:string) { this._content = value; }

        get visibleWidth():number { return this.gameObject.rectTransform.width; }
        get visibleHeight():number { return this.gameObject.rectTransform.height; }

        get contentWidth():number { return this._contentGameObject.rectTransform.width; }
        get contentHeight():number { return this._contentGameObject.rectTransform.height; }

        get bufferBackEnabled():boolean { return this._bufferBackEnabled; }
        set bufferBackEnabled(value:boolean) { this._bufferBackEnabled = value; }

        get momentumEnabled():boolean { return this._momentumEnabled; }
        set momentumEnabled(value:boolean) { this._momentumEnabled = value; }

        set interactiveRect(value:WOZLLA.math.Rectangle) {
            this._gameObject._interactiveRect = value;
        }

        public optimizeList:boolean = false;

        _direction:string = ScrollRect.VERTICAL;
        _enabled:boolean = true;
        _bufferBackEnabled:boolean = true;
        _momentumEnabled:boolean = true;

        _content:string;
        _dragMovedInLastSession:boolean = false;
        _dragging:boolean = false;
        _values = {
            velocityX: 0,
            velocityY: 0,
            momentumX: 0,
            momentumY: 0,
            lastDragX: 0,
            lastDragY: 0,
            momentumXTween: undefined,
            momentumYTween: undefined,
            bufferXTween: undefined,
            bufferYTween: undefined
        };

        _contentGameObject:GameObject;

        _bufferBackCheckRequired:boolean = false;

        listRequiredComponents():Array<Function> {
            return [RectTransform];
        }

        init():void {
            if(this._content) {
                this._contentGameObject = this.gameObject.query(this._content);
            }
            this.gameObject.addListenerScope('panstart', this.onDragStart, this);
            this.gameObject.addListenerScope('panmove', this.onDrag, this);
            this.gameObject.addListenerScope('panend', this.onDragEnd, this);
            super.init();
        }

        destroy():void {
            this.gameObject.removeListenerScope('panstart', this.onDragStart, this);
            this.gameObject.removeListenerScope('panmove', this.onDrag, this);
            this.gameObject.removeListenerScope('panend', this.onDragEnd, this);
            this.clearAllTweens();
            super.destroy();
        }

        update() {
            if(!this._contentGameObject) return;

            if(this.optimizeList) {
                this.doOptimizeList();
            }

            if(!this._bufferBackEnabled && !this._momentumEnabled) return;
            var contentTrans = this._contentGameObject.rectTransform;
            if(this._direction === ScrollRect.BOTH || this._direction === ScrollRect.HORIZONTAL) {
                contentTrans.px += (this._values.velocityX + this._values.momentumX) * Time.delta;
                var minScrollX = this.getMinScrollX();
                if(!this._bufferBackEnabled) {
                    contentTrans.px = middle(contentTrans.px, minScrollX, 0);
                }
                var bufferMomentumX = false;
                if (contentTrans.px > 0 && this._values.velocityX !== 0 || this._bufferBackCheckRequired) {
                    contentTrans.px = 0;
                    this._values.momentumX = this._values.velocityX;
                    bufferMomentumX = true;
                    this._bufferBackCheckRequired = false;
                } else if (contentTrans.px < minScrollX && this._values.velocityX !== 0 || this._bufferBackCheckRequired) {
                    contentTrans.px = minScrollX;
                    this._values.momentumX = this._values.velocityX;
                    bufferMomentumX = true;
                    this._bufferBackCheckRequired = false;
                }
                if (bufferMomentumX) {
                    if (this._values.momentumXTween) {
                        this._values.momentumXTween.setPaused(true);
                    }
                    this._values.momentumXTween = utils.Tween.get(this._values).to({
                        momentumX: 0
                    }, 100).call(() => {
                        this.tryBufferBackX();
                    });
                }
            }

            if(this._direction === ScrollRect.BOTH || this._direction === ScrollRect.VERTICAL) {
                contentTrans.py += (this._values.velocityY + this._values.momentumY) * Time.delta;
                var minScrollY = this.getMinScrollY();
                if(!this._bufferBackEnabled) {
                    contentTrans.py = middle(contentTrans.py, minScrollY, 0);
                }
                var bufferMomentumY = false;
                if(contentTrans.py > 0 && this._values.velocityY !== 0 || this._bufferBackCheckRequired) {
                    contentTrans.py = 0;
                    this._values.momentumY = this._values.velocityY;
                    bufferMomentumY = true;
                    this._bufferBackCheckRequired = false;
                } else if(contentTrans.py < minScrollY && this._values.velocityY !== 0 || this._bufferBackCheckRequired) {
                    contentTrans.py = minScrollY;
                    this._values.momentumY = this._values.velocityY;
                    bufferMomentumY = true;
                    this._bufferBackCheckRequired = false;
                }
                if(bufferMomentumY) {
                    if(this._values.momentumYTween) {
                        this._values.momentumYTween.setPaused(true);
                    }
                    this._values.momentumYTween = utils.Tween.get(this._values).to({
                        momentumY: 0
                    }, 100).call(() => {
                        this.tryBufferBackY();
                    });
                }
            }
        }

        isScrollable() {
            return this._contentGameObject && ScrollRect.globalScrollEnabled && this._enabled;
        }

        requestCheckBufferBack() {
            this._bufferBackCheckRequired = true;
        }

        stopScroll() {
            this.clearAllTweens();
            this._values.lastDragX = 0;
            this._values.lastDragY = 0;
            this._values.velocityX = 0;
            this._values.velocityY = 0;
            this._values.momentumX = 0;
            this._values.momentumY = 0;
        }

        protected clearAllTweens() {
            if(this._contentGameObject) {
                this._contentGameObject.rectTransform.clearTweens();
            }
            if (this._values.momentumXTween) {
                this._values.momentumXTween.setPaused(true);
                this._values.momentumXTween = null;
            }
            if (this._values.momentumYTween) {
                this._values.momentumYTween.setPaused(true);
                this._values.momentumYTween = null;
            }
            if (this._values.bufferXTween) {
                this._values.bufferXTween.setPaused(true);
                this._values.bufferXTween = null;
            }
            if (this._values.bufferYTween) {
                this._values.bufferYTween.setPaused(true);
                this._values.bufferYTween = null;
            }
        }

        protected getMinScrollX() {
            return this.visibleWidth - this.contentWidth;
        }

        protected getMinScrollY() {
            return this.visibleHeight - this.contentHeight;
        }

        protected onDragStart(e) {
            if(!this.isScrollable()) {
                return;
            }
            this._dragging = true;
            this._dragMovedInLastSession = true;
            this._values.lastDragX = e.x;
            this._values.lastDragY = e.y;
            this._values.velocityX = 0;
            this._values.velocityY = 0;
            this._values.momentumX = 0;
            this._values.momentumY = 0;
            this.clearAllTweens();
        }

        protected onDrag(e) {
            if(!this.isScrollable() || !this._dragging) {
                return;
            }
            var contentTrans = this._contentGameObject.rectTransform;
            if(this._direction === ScrollRect.BOTH || this._direction === ScrollRect.HORIZONTAL) {
                var deltaX = e.x - this._values.lastDragX;
                var minScrollX = this.getMinScrollX();
                if(minScrollX === 0 ||
                    (contentTrans.px >= 0 && deltaX >  0) ||
                    (contentTrans.px <= minScrollX && deltaX < 0)) {
                    deltaX /= 10;
                }
                contentTrans.px += deltaX;
                this._values.lastDragX += deltaX;
                if(!this._bufferBackEnabled) {
                    contentTrans.px = middle(contentTrans.px, minScrollX, 0);
                }
            }
            if(this._direction === ScrollRect.BOTH || this._direction === ScrollRect.VERTICAL) {
                var deltaY = e.y - this._values.lastDragY;
                var minScrollY = this.getMinScrollY();
                if(minScrollY === 0 ||
                    (contentTrans.py >= 0 && deltaY >  0) ||
                    (contentTrans.py <= minScrollY && deltaY < 0)) {
                    deltaY /= 10;
                }
                contentTrans.py += deltaY;
                this._values.lastDragY += deltaY;
                if(!this._bufferBackEnabled) {
                    contentTrans.py = middle(contentTrans.py, minScrollY, 0);
                }
            }
        }

        protected onDragEnd(e) {
            if(!this.isScrollable() || !this._dragging) {
                return;
            }
            if(this._direction === ScrollRect.BOTH || this._direction === ScrollRect.HORIZONTAL) {
                if(!this.tryBufferBackX()) {
                    if(this._momentumEnabled) {
                        this._values.velocityX = -e.gesture.velocityX;
                        if (this._values.momentumXTween) {
                            this._values.momentumXTween.setPaused(true);
                        }
                        this._values.momentumXTween = utils.Tween.get(this._values).to({
                            velocityX: 0
                        }, 1000);
                    } else {
                        this._values.velocityX = 0;
                        this._values.momentumY = 0;
                    }
                }
            }
            if(this._direction === ScrollRect.BOTH || this._direction === ScrollRect.VERTICAL) {
                if(!this.tryBufferBackY()) {
                    if(this._momentumEnabled) {
                        this._values.velocityY = -e.gesture.velocityY;
                        if (this._values.momentumYTween) {
                            this._values.momentumYTween.setPaused(true);
                        }
                        this._values.momentumYTween = utils.Tween.get(this._values).to({
                            velocityY: 0
                        }, 1000);
                    } else {
                        this._values.velocityY = 0;
                        this._values.momentumY = 0;
                    }
                }
            }
            this._dragging = false;
        }

        protected tryBufferBackX() {
            if(!this._bufferBackEnabled) {
                return false;
            }
            var minScrollX = this.getMinScrollX();
            var contentTrans = this._contentGameObject.rectTransform;
            if(contentTrans.px > 0) {
                if(this._values.bufferXTween) {
                    this._values.bufferXTween.setPaused(true);
                }
                this._values.bufferXTween = contentTrans.tween(false).to({
                    px : 0
                }, 100);
                return true;
            }
            else if(contentTrans.px < minScrollX) {
                if(this._values.bufferXTween) {
                    this._values.bufferXTween.setPaused(true);
                }
                this._values.bufferXTween = contentTrans.tween(false).to({
                    px : minScrollX
                }, 100);
                return true;
            }
            return false;
        }

        protected tryBufferBackY() {
            if(!this._bufferBackEnabled) {
                return false;
            }
            var minScrollY = this.getMinScrollY();
            var contentTrans = this._contentGameObject.rectTransform;
            if(contentTrans.py > 0) {
                if(this._values.bufferYTween) {
                    this._values.bufferYTween.setPaused(true);
                }
                this._values.bufferYTween = contentTrans.tween(false).to({
                    py : 0
                }, 100);
                return true;
            }
            else if(contentTrans.py < minScrollY) {
                if(this._values.bufferYTween) {
                    this._values.bufferYTween.setPaused(true);
                }
                this._values.bufferYTween = contentTrans.tween(false).to({
                    py : minScrollY
                }, 100);
                return true;
            }
            return false;
        }

        protected doOptimizeList() {
            var children = this._contentGameObject.rawChildren;
            if(children.length === 0) return;
            var thisTrans = this.rectTransform;
            for(var i=0, len=children.length; i<len; i++) {
                var child = children[i];
                var rect = child.rectTransform;
                var globalP = rect.localToGlobal(0, 0, helpPoint);
                var localP = thisTrans.globalToLocal(globalP.x, globalP.y, helpPoint);
                child.visible = rectIntersect2(
                    0, 0, thisTrans.width, thisTrans.height,
                    localP.x, localP.y, rect.width, rect.height
                );
            }
        }

    }

    Component.register(ScrollRect, {
        name: 'ScrollRect',
        properties: [{
            name: 'enabeld',
            type: 'boolean',
            defaultValue: true
        }, {
            name: 'direction',
            type: 'string',
            defaultValue: ScrollRect.VERTICAL,
            editor: 'combobox',
            data: [
                ScrollRect.HORIZONTAL,
                ScrollRect.VERTICAL,
                ScrollRect.BOTH
            ]
        }, {
            name: 'content',
            type: 'string',
            defaultValue: ''
        }, {
            name: 'interactiveRect',
            type: 'rect',
            defaultValue: [0, 0, 0, 0],
            convert: component.PropertyConverter.array2rect
        }, {
            name: 'bufferBackEnabled',
            type: 'boolean',
            defaultValue: true
        }, {
            name: 'momentumEnabled',
            type: 'boolean',
            defaultValue: true
        }, {
            name: 'optimizeList',
            type: 'boolean',
            defaultValue: false
        }]
    });

}