/// <reference path="../math/Matrix.ts"/>
/// <reference path="../utils/Tween.ts"/>
module WOZLLA {

    var helpMatrix = new WOZLLA.math.Matrix();

    /**
     * this class define the position, scale, rotation and about transform information of {@link WOZLLA.GameObject}
     * @class WOZLLA.Transform
     */
    export class Transform {

        // for dragonbone
        public __local_matrix:any;

        /**
         * @property {number} DEG_TO_RAD
         * @readonly
         * @static
         */
        public static DEG_TO_RAD = Math.PI/180;

        /**
         * @property {WOZLLA.math.Matrix} worldMatrix
         * @readonly
         */
        public worldMatrix:WOZLLA.math.Matrix = new WOZLLA.math.Matrix();

        /**
         * specify this tranform 
         * @type {boolean}
         */
        public useGLCoords:boolean = false;

        _values:Array<number>;
        _relative:boolean = true;
        _dirty:boolean = false;

        constructor() {
            this._values = new Array<number>(9);
            this.reset();
        }

        get x() {
            return this._values[0];
        }

        set x(value:any) {
            this._values[0] = value;
            this._dirty = true;
        }

        get y() {
            return this._values[1];
        }

        set y(value:any) {
            this._values[1] = value;
            this._dirty = true;
        }

        get rotation() {
            return this._values[4];
        }

        set rotation(value:any) {
            this._values[4] = value;
            this._dirty = true;
        }

        get scaleX() {
            return this._values[5];
        }

        set scaleX(value:any) {
            this._values[5] = value;
            this._dirty = true;
        }

        get scaleY() {
            return this._values[6];
        }

        set scaleY(value:any) {
            this._values[6] = value;
            this._dirty = true;
        }

        get skewX() {
            return this._values[7];
        }

        set skewX(value:any) {
            this._values[7] = value;
            this._dirty = true;
        }

        get skewY() {
            return this._values[8];
        }

        set skewY(value:any) {
            this._values[8] = value;
            this._dirty = true;
        }

        get relative():boolean {
            return this._relative;
        }

        set relative(relative:boolean) {
            this._relative = relative;
            this._dirty = true;
        }

        get dirty() {
            return this._dirty;
        }

        set dirty(value:boolean) {
            this._dirty = value;
        }

        setPosition(x, y) {
            this._values[0] = x;
            this._values[1] = y;
            this._dirty = true;
        }

        setAnchor(anchorX, anchorY) {
            this._values[2] = anchorX;
            this._values[3] = anchorY;
            this._dirty = true;
        }

        setRotation(rotation) {
            this._values[4] = rotation;
            this._dirty = true;
        }

        setScale(scaleX, scaleY) {
            this._values[5] = scaleX;
            this._values[6] = scaleY;
            this._dirty = true;
        }

        setSkew(skewX, skewY) {
            this._values[7] = skewX;
            this._values[8] = skewY;
            this._dirty = true;
        }

        reset() {
            this._values[0] = 0; // x
            this._values[1] = 0; // y
            this._values[2] = 0; // @deprecated
            this._values[3] = 0; // @deprecated
            this._values[4] = 0; // rotation
            this._values[5] = 1; // scaleX
            this._values[6] = 1; // scaleY
            this._values[7] = 0; // skewX
            this._values[8] = 0; // skewY
        }

        set(transform:any) {
            if(typeof transform.x === "number") {
                this._values[0] = transform.x; //x
            }
            if(typeof transform.y === "number") {
                this._values[1] = transform.y; // y
            }
            if(typeof transform.rotation === 'number') {
                this._values[4] = transform.rotation; // rotation
            }
            if(typeof transform.scaleX === 'number') {
                this._values[5] = transform.scaleX; // scaleX
            }
            if(typeof transform.scaleY === 'number') {
                this._values[6] = transform.scaleY; // scaleY
            }
            if(typeof transform.skewX === 'number') {
                this._values[7] = transform.skewX; // skewX
            }
            if(typeof transform.skewY === 'number') {
                this._values[8] = transform.skewY; // skewY
            }
            if(typeof transform.relative !== 'undefined') {
                this._relative = transform.relative;
            }
            this._dirty = true;
        }

        transform(parentTransform:Transform=null) {
            var cos, sin, r;
            var matrix;
            var worldMatrix = this.worldMatrix;
            var x = this._values[0];
            var y = this._values[1];
            var rotation = this._values[4];
            var scaleX = this._values[5];
            var scaleY = this._values[6];
            var skewX = this._values[7];
            var skewY = this._values[8];

            if(this.useGLCoords) {
                skewX += 180;
            }

            if(parentTransform && this._relative) {
                worldMatrix.applyMatrix(parentTransform.worldMatrix);
            } else {
//                worldMatrix.identity();
//                parentTransform = Director.getInstance().getStage().transform;
                // if this is the transform of stage
                if(this === parentTransform) {
                    worldMatrix.identity();
                } else {
                    worldMatrix.applyMatrix(parentTransform.worldMatrix);
                }
            }

            if(this.__local_matrix) {
                matrix = this.__local_matrix;
                worldMatrix.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
                this._dirty = false;
                return;
            }

            if (rotation%360) {
                r = rotation*Transform.DEG_TO_RAD;
                cos = Math.cos(r);
                sin = Math.sin(r);
            } else {
                cos = 1;
                sin = 0;
            }

            if (skewX || skewY) {
                skewX *= Transform.DEG_TO_RAD;
                skewY *= Transform.DEG_TO_RAD;
                worldMatrix.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
                worldMatrix.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
            } else {
                worldMatrix.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
            }
            this._dirty = false;
        }

        updateWorldMatrix() {
            if(!this._dirty) {
                return;
            }
            var matrix = this.worldMatrix;
            if (matrix) {
                matrix.identity();
            }
            else {
                matrix = new WOZLLA.math.Matrix();
            }
            var o:any = this;
            while (o != null) {
                matrix.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, 0, 0);
                o = o.parent;
            }
        }

        globalToLocal(x, y, updateMatrix:boolean=false) {
            if(updateMatrix) {
                this.updateWorldMatrix();
            }
            helpMatrix.applyMatrix(this.worldMatrix);
            helpMatrix.invert();
            helpMatrix.append(1, 0, 0, 1, x, y);
            return {
                x : helpMatrix.values[6],
                y : helpMatrix.values[7]
            };
        }

        localToGlobal(x, y, updateMatrix:boolean=false) {
            if(updateMatrix) {
                this.updateWorldMatrix();
            }
            helpMatrix.applyMatrix(this.worldMatrix);
            helpMatrix.append(1, 0, 0, 1, x, y);
            return {
                x : helpMatrix.values[6],
                y : helpMatrix.values[7]
            };
        }

        tween(override:boolean):any {
            return WOZLLA.utils.Tween.get(this, null, null, override);
        }

        clearTweens() {
            return WOZLLA.utils.Tween.removeTweens(this);
        }

    }

}