/// <reference path="Material.ts"/>
/// <reference path="../IMaterial.ts"/>
/// <reference path="../IShaderProgram.ts"/>
module WOZLLA.renderer {

    /**
     * @class WOZLLA.renderer.MaterialManager
     * @extends WOZLLA.renderer.IMaterialManager
     */
    export class MaterialManager implements IMaterialManager {

        _materialMap = {};

        constructor() {
            this._materialMap[IMaterial.DEFAULT] = this.createMaterial(
                IMaterial.DEFAULT,
                IShaderProgram.V2T2C1A1,
                BlendType.NORMAL
            );
        }

        createMaterial(id:string, shaderProgramId:string, blendType:number):IMaterial {
            var material = new Material(id, shaderProgramId, blendType);
            this._materialMap[id] = material;
            return material;
        }

        getMaterial(id:string):IMaterial {
            return this._materialMap[id];
        }

        deleteMaterial(material:IMaterial):void {
            delete this._materialMap[material.id];
        }

        clear():void {
            this._materialMap = {};
        }
    }

}