module WOZLLA.renderer {

    /**
     * @class WOZLLA.renderer.IMaterialManager
     * @abstract
     */
    export interface IMaterialManager {

        createMaterial(id:string, shaderProgramId:string, blendType:number):IMaterial;
        getMaterial(id:string):IMaterial;
        deleteMaterial(material:IMaterial):void;
        clear():void;

    }

    export module IMaterialManager {
        /**
         * @property DOC
         * @readonly
         * @static
         * @member WOZLLA.renderer.IMaterialManager
         */
        export var DOC = 'DOC';
    }

}