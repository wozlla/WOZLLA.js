module WOZLLA.renderer {

    /**
     * @class WOZLLA.renderer.BlendType
     */
    export class BlendType {

        public static NORMAL = 1;
        public static ADD = 2;
        public static MULTIPLY = 3;
        public static SCREEN = 4;

        get srcFactor():any { return this._srcFactor; }
        get distFactor():any { return this._distFactor; }

        _srcFactor;
        _distFactor;

        constructor(srcFactor, distFactor) {
            this._srcFactor = srcFactor;
            this._distFactor = distFactor;
        }

        applyBlend(gl) {
            gl.blendFunc(this._srcFactor, this._distFactor);
        }

    }

}