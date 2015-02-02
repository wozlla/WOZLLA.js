module WOZLLA.renderer {

    function applyProperties(target, source) {
        for(var i in source) {
            if(typeof target[i] === 'undefined') {
                target[i] = source[i];
            }
        }
        return target;
    }

    /**
     * @class WOZLLA.renderer.WebGLUtils
     * @abstract
     */
    export class WebGLUtils {

        public static getGLContext(canvas, options?) {
            var gl;
            options = applyProperties(options || {}, {
                alpha: true,
                antialias: true,
                premultipliedAlpha: false,
                stencil:true
            });
            try {
                gl = canvas.getContext('experimental-webgl', options);
            } catch (e) {
                try {
                    gl = canvas.getContext('webgl', options);
                } catch (e2) {}
            }
            return gl;
        }

        public static compileShader(gl, shaderType, shaderSrc) {
            var src = shaderSrc;
            var shader = gl.createShader(shaderType);
            gl.shaderSource(shader, src);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.log(gl.getShaderInfoLog(shader));
                return null;
            }
            return shader;
        }

        public static compileProgram(gl, vertexSrc, fragmentSrc) {
            var vertexShader = WebGLUtils.compileShader(gl, gl.VERTEX_SHADER, vertexSrc);
            var fragmentShader = WebGLUtils.compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);
            var shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                console.log("Could not initialise program");
            }
            return {
                program: shaderProgram,
                vertexShader: vertexShader,
                fragmentShader: fragmentShader
            };
        }

    }

}