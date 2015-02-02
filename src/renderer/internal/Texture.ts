module WOZLLA.renderer {

    /**
     * @class WOZLLA.renderer.Texture
     * @extends WOZLLA.renderer.ITexture
     */
    export class Texture implements ITexture {

        get id():any { return this._id; }

        get descriptor():ITextureDescriptor { return this._descriptor; }

        _id:any;
        _descriptor:ITextureDescriptor;

        constructor(id, descriptor:ITextureDescriptor) {
            this._id = id;
            this._descriptor = descriptor;
        }

        bind(gl) {
            gl.bindTexture(gl.TEXTURE_2D, this._id);
        }
    }

}