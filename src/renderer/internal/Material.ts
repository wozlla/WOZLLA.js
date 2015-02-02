module WOZLLA.renderer {

    /**
     * @class WOZLLA.renderer.Material
     * @extends WOZLLA.renderer.IMaterial
     */
    export class Material implements IMaterial {

        get id():any { return this._id; }

        get shaderProgramId():string { return this._shaderProgramId; }
        get blendType():number { return this._blendType; }

        _id:any;
        _shaderProgramId:string;
        _blendType:number;

        constructor(id, shaderProgramId:string, blendType:number) {
            this._id = id;
            this._shaderProgramId = shaderProgramId;
            this._blendType = blendType;
        }

        equals(other:IMaterial):boolean {
            return other.blendType === this._blendType && other.shaderProgramId === this._shaderProgramId;
        }
    }

}