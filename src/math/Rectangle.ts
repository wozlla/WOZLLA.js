module WOZLLA.math {

    /**
     * @class WOZLLA.math.Rectangle
     *  a utils class for rectangle, provider some math methods
     */
    export class Rectangle {

        x: number;

        y: number;

        width: number;

        height: number;

        /**
         * @property {number} left x
         * @readonly
         */
        get left():number { return this.x; }

        /**
         * @property {number} right x+width
         * @readonly
         */
        get right():number { return this.x + this.width; }

        /**
         * @property {number} top y
         * @readonly
         */
        get top():number { return this.y; }

        /**
         * @property {number} bottom y+height
         * @readonly
         */
        get bottom():number { return this.y + this.height; }

        constructor (x: number, y: number, width: number, height: number) {
            /**
             * get or set x
             * @property {number} x
             */
            this.x = x;
            /**
             * get or set y
             * @property {number} y
             */
            this.y = y;
            /**
             * get or set width
             * @property {number} width
             */
            this.width = width;
            /**
             * get or set height
             * @property {number} height
             */
            this.height = height;
        }

        /**
         * @method containsXY
         * @param x
         * @param y
         * @returns {boolean}
         */
        containsXY(x:number, y:number):boolean {
            return this.x <= x && this.right > x && this.y <= y && this.bottom > y;
        }

        /**
         * get simple description of this object
         * @returns {string}
         */
        toString() {
            return 'Rectangle[' + this.x + ',' + this.y + ',' + this.width + ',' + this.height + ']';
        }
    }

}