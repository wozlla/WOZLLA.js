module WOZLLA.math {

    /**
     * @class WOZLLA.math.Point
     * a util class contains x and y properties
     */
    export class Point {

        x: number;

        y: number;

        /**
         * @method constructor
         * create a new instance of Point
         * @member WOZLLA.math.Point
         * @param {number} x
         * @param {number} y
         */
        constructor (x: number, y: number) {
            /**
             * @property {number} x
             * get or set x of this object
             * @member WOZLLA.math.Point
             */
            this.x = x;
            /**
             * @property {number} y
             * get or set y of this object
             * @member WOZLLA.math.Point
             */
            this.y = y;
        }

        /**
         * get simple description of this object
         * @returns {string}
         */
        toString() {
            return 'Point[' + this.x + ',' + this.y + ']';
        }
    }

}