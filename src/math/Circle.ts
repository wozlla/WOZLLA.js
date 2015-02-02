module WOZLLA.math {

    /**
     * @class WOZLLA.math.Circle
     * a util class for circle
     */
    export class Circle {

        centerX:number;
        centerY:number;
        radius:number;

        constructor(centerX:number, centerY:number, radius:number) {
            /**
             * get or set centerX
             * @property {number} centerX
             */
            this.centerX = centerX;
            /**
             * get or set centerY
             * @property {number} centerY
             */
            this.centerY = centerY;
            /**
             * get or set radius
             * @property {number} radius
             */
            this.radius = radius;
        }

        /**
         * @method containsXY
         * @param x
         * @param y
         * @returns {boolean}
         */
        containsXY(x:number, y:number):boolean {
            return Math.pow((x - this.centerX), 2) + Math.pow((y - this.centerY), 2) <= this.radius;
        }

        /**
         * get simple description of this object
         * @returns {string}
         */
        toString() {
            return 'Circle[' + this.centerX + ',' + this.centerY + ',' + this.radius + ']';
        }

    }

}