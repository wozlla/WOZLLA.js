module WOZLLA.renderer {

    /**
     * @class WOZLLA.renderer.IMaterial
     * @abstract
     */
    export interface IMaterial {
        id:string;
        shaderProgramId:string;
        blendType:number;

        equals(other:IMaterial):boolean;
    }

    export module IMaterial {
        /**
         * default material key of built-in
         * @property {string} DEFAULT
         * @readonly
         * @static
         * @member WOZLLA.renderer.IMaterial
         */
        export var DEFAULT = 'Builtin_default';
    }

}