/// <reference path="Transform.ts"/>
module WOZLLA {

    /**
     * RectTransform is a subclass of {@link WOZLLA.Transform}, define a rect region
     * for {@WOZLLA.GameObject} and a anchor mode to specify how to related to it's parent.
     * @class WOZLLA.RectTransform
     */
    export class RectTransform extends Transform {

        public static getMode(name):number {
            var names = name.split('_');
            var value = 0;
            switch(names[0]) {
                case 'Left':
                    value |= RectTransform.ANCHOR_LEFT;
                    break;
                case 'Right':
                    value |= RectTransform.ANCHOR_RIGHT;
                    break;
                case 'HStrength':
                    value |= RectTransform.ANCHOR_HORIZONTAL_STRENGTH;
                    break;
                default:
                    value |= RectTransform.ANCHOR_CENTER;
                    break;
            }
            switch(names[1]) {
                case 'Top':
                    value |= RectTransform.ANCHOR_TOP;
                    break;
                case 'Bottom':
                    value |= RectTransform.ANCHOR_BOTTOM;
                    break;
                case 'VStrength':
                    value |= RectTransform.ANCHOR_VERTICAL_STRENGTH;
                    break;
                default:
                    value |= RectTransform.ANCHOR_MIDDLE;
                    break;
            }
            return value;
        }

        /**
         * vertical anchor mode
         * @property {number} ANCHOR_TOP
         * @readonly
         * @static
         */
        public static ANCHOR_TOP = 0x1;

        /**
         * vertical anchor mode
         * @property {number} ANCHOR_MIDDLE
         * @readonly
         * @static
         */
        public static ANCHOR_MIDDLE = 0x10;

        /**
         * vertical anchor mode
         * @property {number} ANCHOR_BOTTOM
         * @readonly
         * @static
         */
        public static ANCHOR_BOTTOM = 0x100;

        /**
         * vertical anchor mode
         * @property {number} ANCHOR_VERTICAL_STRENGTH
         * @readonly
         * @static
         */
        public static ANCHOR_VERTICAL_STRENGTH = 0x1000;

        /**
         * horizontal anchor mode
         * @property {number} ANCHOR_LEFT
         * @readonly
         * @static
         */
        public static ANCHOR_LEFT = 0x10000;

        /**
         * horizontal anchor mode
         * @property {number} ANCHOR_CENTER
         * @readonly
         * @static
         */
        public static ANCHOR_CENTER = 0x100000;

        /**
         * horizontal anchor mode
         * @property {number} ANCHOR_RIGHT
         * @readonly
         * @static
         */
        public static ANCHOR_RIGHT = 0x1000000;

        /**
         * horizontal anchor mode
         * @property {number} ANCHOR_HORIZONTAL_STRENGTH
         * @readonly
         * @static
         */
        public static ANCHOR_HORIZONTAL_STRENGTH = 0x10000000;

        /**
         * get or set width, this property only effect on fixed size mode
         * @property {number} width
         */
        get width():number { return this._width; }
        set width(value:number) {
            if(this._width === value) return;
            this._width = value;
            this.dirty = true;
        }

        /**
         * get or set height, this property only effect on fixed size mode
         * @property {number} height
         */
        get height():number { return this._height; }
        set height(value:number) {
            if(this._height === value) return;
            this._height = value;
            this.dirty = true;
        }

        /**
         * get or set top
         * @property {number} top
         */
        get top():number { return this._top; }
        set top(value:number) {
            if(this._top === value) return;
            this._top = value;
            this.dirty = true;
        }

        /**
         * get or set left
         * @property {number} left
         */
        get left():number { return this._left; }
        set left(value:number) {
            if(this._left === value) return;
            this._left = value;
            this.dirty = true;
        }

        /**
         * get or set right
         * @property {number} right
         */
        get right():number { return this._right; }
        set right(value:number) {
            if(this._right === value) return;
            this._right = value;
            this.dirty = true;
        }

        /**
         * get or set bottom
         * @property {number} bottom
         */
        get bottom():number { return this._bottom; }
        set bottom(value:number) {
            if(this._bottom === value) return;
            this._bottom = value;
            this.dirty = true;
        }

        /**
         * get or set px, this only effect on strengthen mode
         * @property {number} px specify x coords
         */
        get px():number { return this._px; }
        set px(value:number) {
            if(this._px === value) return;
            this._px = value;
            this.dirty = true;
        }

        /**
         * get or set py, this only effect on strengthen mode
         * @property {number} py specify y coords
         */
        get py():number { return this._py; }
        set py(value:number) {
            if(this._py === value) return;
            this._py = value;
            this.dirty = true;
        }

        /**
         * get or set anchor mode
         * @property {number} anchorMode
         */
        get anchorMode():number { return this._anchorMode; }
        set anchorMode(value:number) {
            if(this._anchorMode === value) return;
            this._anchorMode = value;
            this.dirty = true;
        }

        _width:number = 0;
        _height:number = 0;

        _top:number = 0;
        _left:number = 0;
        _right:number = 0;
        _bottom:number = 0;

        _px:number = 0;
        _py:number = 0;

        _anchorMode = RectTransform.ANCHOR_CENTER | RectTransform.ANCHOR_MIDDLE;

        /**
         * set rect transform
         * @param {WOZLLA.RectTransform} rectTransform
         */
        set(rectTransform:any) {
            var anchorMode:any = rectTransform.anchorMode;
            if(typeof anchorMode === 'string') {
                anchorMode = RectTransform.getMode(anchorMode);
            }
            this._anchorMode = anchorMode;
            this._width = rectTransform.width || 0;
            this._height = rectTransform.height || 0;
            this._top = rectTransform.top || 0;
            this._left = rectTransform.left || 0;
            this._right = rectTransform.right || 0;
            this._bottom = rectTransform.bottom || 0;
            this._px = rectTransform.px || 0;
            this._py = rectTransform.py || 0;
            if(typeof rectTransform.relative !== 'undefined') {
                this._relative = rectTransform.relative;
            }
            this.dirty = true;
        }

        superSet(transform:Transform) {
            super.set(transform);
        }

        /**
         * transform with parent transform
         * @param {WOZLLA.Transform} parentTransform
         */
        transform(parentTransform:Transform=null) {
            var m, R, p:RectTransform;
            if(!parentTransform || !this._relative || !(parentTransform instanceof RectTransform)) {
                p = Director.getInstance().viewRectTransform;
            } else {
                p = <RectTransform>parentTransform;
            }
            m = this._anchorMode;
            R = RectTransform;

            if((m & R.ANCHOR_LEFT) === R.ANCHOR_LEFT) {
                this.x = this._px;
            } else if((m & R.ANCHOR_RIGHT) === R.ANCHOR_RIGHT) {
                this.x = p._width + this._px;
            } else if((m & R.ANCHOR_HORIZONTAL_STRENGTH) === R.ANCHOR_HORIZONTAL_STRENGTH) {
                this.x = this._left;
                this._width = p._width - this._left - this._right;
            } else {
                this.x = p._width/2 + this._px;
            }

            if((m & R.ANCHOR_TOP) === R.ANCHOR_TOP) {
                this.y = this._py;
            } else if((m & R.ANCHOR_BOTTOM) === R.ANCHOR_BOTTOM) {
                this.y = p._height + this._py;
            } else if((m & R.ANCHOR_VERTICAL_STRENGTH) === R.ANCHOR_VERTICAL_STRENGTH) {
                this.y = this._top;
                this._height = p._height - this._top - this._bottom;
            } else {
                this.y = p._height/2 + this._py;
            }

            super.transform(parentTransform);
        }

        protected getRootMatrix() {
            return Director.getInstance().stage.viewRectTransform.worldMatrix;
        }
    }

}