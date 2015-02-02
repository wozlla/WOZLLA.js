module WOZLLA.math {

    /**
     * @class WOZLLA.math.Matrix
     * a util class for 2d matrix
     */
    export class Matrix {

        /**
         * @property DEG_TO_RAD
         * @member WOZLLA.math.Matrix
         * @readonly
         * @static
         */
        public static DEG_TO_RAD = Math.PI/180;

        public values:Float32Array;

        constructor() {
            /**
             * get values of this matrix
             * @property {Float32Array} values
             * @readonly
             */
            this.values = new Float32Array(9);
            this.identity();
        }

        /**
         * apply from another matrix
         * @param matrix
         */
        applyMatrix(matrix:Matrix) {
            this.values.set(matrix.values);
        }

        /**
         * identify this matrix
         */
        identity() {
            this.values[0] = 1; // a
            this.values[1] = 0; // b
            this.values[2] = 0;
            this.values[3] = 0; // c
            this.values[4] = 1; // d
            this.values[5] = 0;
            this.values[6] = 0; // tx
            this.values[7] = 0; // ty
            this.values[8] = 1;
        }

        /**
         * invert this matrix
         */
        invert() {
            var a1 = this.values[0];
            var b1 = this.values[1];
            var c1 = this.values[3];
            var d1 = this.values[4];
            var tx1 = this.values[6];
            var ty1 = this.values[7];
            var n = a1*d1-b1*c1;

            this.values[0] = d1/n;
            this.values[1] = -b1/n;
            this.values[3] = -c1/n;
            this.values[4] = a1/n;
            this.values[6] = (c1*ty1-d1*tx1)/n;
            this.values[7] = -(a1*ty1-b1*tx1)/n;
        }

        /**
         * prepend 2d params to this matrix
         * @param a
         * @param b
         * @param c
         * @param d
         * @param tx
         * @param ty
         */
        prepend(a:number, b:number, c:number, d:number, tx:number, ty) {
            var a1, b1, c1, d1;
            var values = this.values;
            var tx1 = values[6];
            var ty1 = values[7];
            if (a != 1 || b != 0 || c != 0 || d != 1) {
                a1 = values[0];
                b1 = values[1];
                c1 = values[3];
                d1 = values[4];
                values[0] = a1*a+b1*c;
                values[1] = a1*b+b1*d;
                values[3] = c1*a+d1*c;
                values[4] = c1*b+d1*d;
            }
            values[6] = tx1*a+ty1*c+tx;
            values[7] = tx1*b+ty1*d+ty;
        }

        /**
         * append 2d params to this matrix
         * @param a
         * @param b
         * @param c
         * @param d
         * @param tx
         * @param ty
         */
        append(a:number, b:number, c:number, d:number, tx:number, ty) {
            var a1, b1, c1, d1;
            var values = this.values;
            a1 = values[0];
            b1 = values[1];
            c1 = values[3];
            d1 = values[4];

            values[0]  = a*a1+b*c1;
            values[1]  = a*b1+b*d1;
            values[3]  = c*a1+d*c1;
            values[4]  = c*b1+d*d1;
            values[6] = tx*a1+ty*c1+values[6];
            values[7] = tx*b1+ty*d1+values[7];
        }

        /**
         * prepend 2d transform params to this matrix
         * @param x
         * @param y
         * @param scaleX
         * @param scaleY
         * @param rotation
         * @param skewX
         * @param skewY
         * @param regX
         * @param regY
         * @returns {WOZLLA.math.Matrix}
         */
        prependTransform(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
            if (rotation%360) {
                var r = rotation*Matrix.DEG_TO_RAD;
                var cos = Math.cos(r);
                var sin = Math.sin(r);
            } else {
                cos = 1;
                sin = 0;
            }

            if (regX || regY) {
                this.values[6] -= regX;
                this.values[7] -= regY;
            }
            if (skewX || skewY) {
                skewX *= Matrix.DEG_TO_RAD;
                skewY *= Matrix.DEG_TO_RAD;
                this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
                this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
            } else {
                this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
            }
            return this;
        }

        /**
         * append 2d transform params to this matrix
         * @param x
         * @param y
         * @param scaleX
         * @param scaleY
         * @param rotation
         * @param skewX
         * @param skewY
         * @param regX
         * @param regY
         * @returns {WOZLLA.math.Matrix}
         */
        appendTransform(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
            if (rotation%360) {
                var r = rotation*Matrix.DEG_TO_RAD;
                var cos = Math.cos(r);
                var sin = Math.sin(r);
            } else {
                cos = 1;
                sin = 0;
            }

            if (skewX || skewY) {
                skewX *= Matrix.DEG_TO_RAD;
                skewY *= Matrix.DEG_TO_RAD;
                this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
                this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
            } else {
                this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
            }

            if (regX || regY) {
                // prepend the registration offset:

                this.values[6] -= regX*this.values[0]+regY*this.values[3];
                this.values[7] -= regX*this.values[1]+regY*this.values[4];
            }
            return this;
        }

    }

}