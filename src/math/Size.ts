module WOZLLA.math {

    /**
     * @class WOZLLA.math.Size
     * a util class contains width and height properties
     */
    export class Size {


        width: number;

        height: number;

        /**
         * @method constructor
         * create a new instance of Size
         * @member WOZLLA.math.Size
         * @param {number} width
         * @param {number} height
         */
        constructor (width: number, height: number) {
            /**
             * @property {number} width
             * get or set width of this object
             * @member WOZLLA.math.Size
             */
            this.width = width;
            /**
             * @property {number} height
             * get or set height of this object
             * @member WOZLLA.math.Size
             */
            this.height = height;
        }

        /**
         * get simple description of this object
         * @returns {string}
         */
        toString() {
            return 'Size[' + this.width + ',' + this.height + ']';
        }
    }

}