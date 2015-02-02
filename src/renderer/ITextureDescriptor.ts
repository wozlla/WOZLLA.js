module WOZLLA.renderer {

    /**
     * @enum WOZLLA.renderer.TextureFormat
     */
    export enum TextureFormat {
        /** @property {number} [PNG] */
        PNG,
        /** @property {number} [JPEG] */
        JPEG,
        /** @property {number} [PVR] */
        PVR,
    }

    /**
     * @enum WOZLLA.renderer.PixelFormat
     */
    export enum PixelFormat {
        /** @property {number} [RPGA8888] */
        RGBA8888,
        /** @property {number} [RGBA4444] */
        RGBA4444,
        /** @property {number} [RGB888] */
        RGB888,
        /** @property {number} [RGB565] */
        RGB565,
        /** @property {number} [PVRTC4] */
        PVRTC4,
        /** @property {number} [PVRTC2] */
        PVRTC2
    }

    /**
     * @class WOZLLA.renderer.ITextureDescriptor
     * @abstract
     */
    export interface ITextureDescriptor {
        width:number;
        height:number;
        textureFormat:TextureFormat;
        pixelFormat:PixelFormat;
        source:any;
    }
}