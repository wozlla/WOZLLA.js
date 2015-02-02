module WOZLLA.renderer {

    /**
     * @class WOZLLA.renderer.WebGLExtension
     */
    export class WebGLExtension {

        public static VENDOR_WEBKIT = 'WEBKIT_';

        public static PVRTC = 'WEBGL_compressed_texture_pvrtc';

        public static COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02;
        public static COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03;

        public static getExtension(gl, extName, doThrow:boolean=true):any {
            var ext = gl.getExtension(extName) || gl.getExtension(gl, WebGLExtension.VENDOR_WEBKIT + extName);
            if(ext != null) {
                return ext;
            } else if(doThrow) {
                throw new Error('Unsupported extension: ' + extName);
            }
        }

    }

}