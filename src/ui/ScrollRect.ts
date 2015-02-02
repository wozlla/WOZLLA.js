/// <reference path="../core/Component.ts"/>
module WOZLLA.ui {

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

        _direction:string = ScrollRect.VERTICAL;
        _enabled:boolean = true;
        _bufferBackEnabled:boolean = true;
        _momentumEnabled:boolean = true;

        _content:string;
        _dragMovedInLastSession:boolean = false;
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

        listRequiredComponents():Array<Function> {
            return [RectTransform];
        }

        init():void {
            if(this._content) {
                this._contentGameObject = this.gameObject.query(this._content);
            }
            this.gameObject.addListenerScope('dragstart', this.onDragStart, this);
            this.gameObject.addListenerScope('drag', this.onDrag, this);
            this.gameObject.addListenerScope('dragend', this.onDragEnd, this);
            super.init();
        }

        destroy():void {
            this.gameObject.removeListenerScope('dragstart', this.onDragStart, this);
            this.gameObject.removeListenerScope('drag', this.onDrag, this);
            this.gameObject.removeListenerScope('dragend', this.onDragEnd, this);
            super.destroy();
        }

        update() {
            if(!this._contentGameObject) return;
            if(!this._bufferBackEnabled && !this._momentumEnabled) return;
            var contentTrans = this._contentGameObject.rectTransform;
            if(this._direction === ScrollRect.BOTH || this._direction === ScrollRect.HORIZONTAL) {
                contentTrans.px += (this._values.velocityX + this._values.momentumX) * Time.delta;
                var minScrollX = this.getMinScrollX();
                if(!this._bufferBackEnabled) {
                    contentTrans.px = middle(contentTrans.px, minScrollX, 0);
                }
                var bufferMomentumX = false;
                if (contentTrans.px > 0 && this._values.velocityX !== 0) {
                    contentTrans.px = 0;
                    this._values.momentumX = this._values.velocityX;
                    bufferMomentumX = true;
                } else if (contentTrans.px < minScrollX && this._values.velocityX !== 0) {
                    contentTrans.px = minScrollX;
                    this._values.momentumX = this._values.velocityX;
                    bufferMomentumX = true;
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
                if(contentTrans.py > 0 && this._values.velocityY !== 0) {
                    contentTrans.py = 0;
                    this._values.momentumY = this._values.velocityY;
                    bufferMomentumY = true;
                } else if(contentTrans.py < minScrollY && this._values.velocityY !== 0) {
                    contentTrans.py = minScrollY;
                    this._values.momentumY = this._values.velocityY;
                    bufferMomentumY = true;
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
            this._dragMovedInLastSession = true;
            this._values.lastDragX = e.x;
            this._values.lastDragY = e.y;
            this._values.velocityX = 0;
            this._values.velocityY = 0;
            this._values.momentumX = 0;
            this._values.momentumY = 0;
            this._contentGameObject.rectTransform.clearTweens();
            utils.Tween.removeTweens(this);
        }

        protected onDrag(e) {
            if(!this.isScrollable()) {
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
            if(!this.isScrollable()) {
                return;
            }
            if(this._direction === ScrollRect.BOTH || this._direction === ScrollRect.HORIZONTAL) {
                if(!this.tryBufferBackX()) {
                    if(this._momentumEnabled) {
                        this._values.velocityX = e.gesture.velocityX * (e.gesture.deltaX >= 0 ? 1 : -1);
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
                        this._values.velocityY = e.gesture.velocityY * (e.gesture.deltaY >= 0 ? 1 : -1);
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

    }

    Component.register(ScrollRect, {
        name: 'UI.ScrollRect',
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
            name: 'bufferBackEnabled',
            type: 'boolean',
            defaultValue: true
        }, {
            name: 'momentumEnabled',
            type: 'boolean',
            defaultValue: true
        }]
    });

}