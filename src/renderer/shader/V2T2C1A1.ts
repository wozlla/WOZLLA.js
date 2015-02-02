module WOZLLA.renderer.shader {

    /**
     * @class WOZLLA.renderer.shader.V2T2C1A1
     */
    export class V2T2C1A1 extends WOZLLA.renderer.ShaderProgram implements IShaderProgram {

        public static VERTEX_SOURCE:string = [
            'attribute vec2 aVertexPosition;\n',
            'attribute vec2 aTextureCoord;\n',
            'attribute vec2 aColor;\n',
            'uniform vec2 projectionVector;\n',
            'uniform vec2 offsetVector;\n',
            'varying vec2 vTextureCoord;\n',
            'varying vec4 vColor;\n',
            'const vec2 center = vec2(-1.0, 1.0);\n',
            'void main(void) {\n',
                'gl_Position = vec4( ((aVertexPosition + offsetVector) / projectionVector) + center , 0.0, 1.0);\n',
                'vTextureCoord = aTextureCoord;\n',
                'vec3 color = mod(vec3(aColor.y/65536.0, aColor.y/256.0, aColor.y), 256.0) / 256.0;\n',
                'vColor = vec4(color * aColor.x, aColor.x);\n',
            '}'
        ].join('');

        public static FRAGMENT_SOURCE:string = [
            'precision mediump float;\n',
            'varying vec2 vTextureCoord;\n',
            'varying vec4 vColor;\n',
            'uniform sampler2D uSampler;\n',
            'void main(void) {\n',
                'gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;\n',
            '}'
        ].join('');

        _locations:any = {
            initialized: false
        };

        constructor(id, vertexShader, fragmentShader) {
            super(id, vertexShader, fragmentShader);
        }

        useProgram(gl):void {
            super.useProgram(gl);
            if(!this._locations.initialized) {
                this._initLocaitions(gl);
                this._locations.initialized = true;
            }
            this._activate(gl);
        }

        syncUniforms(gl, uniforms:{projection}) {
            gl.uniform2f(this._locations.projectionVector, uniforms.projection.x, uniforms.projection.y);
        }

        _initLocaitions(gl) {
            var program = this._id;
            this._locations.uSampler = gl.getUniformLocation(program, 'uSampler');
            this._locations.projectionVector = gl.getUniformLocation(program, 'projectionVector');
            this._locations.offsetVector = gl.getUniformLocation(program, 'offsetVector');
            this._locations.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
            this._locations.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');
            this._locations.aColor = gl.getAttribLocation(program, 'aColor');
        }

        _activate(gl) {
            gl.activeTexture(gl.TEXTURE0);

            var stride =  Quad.V2T2C1A1.strade * 4;
            gl.vertexAttribPointer(this._locations.aVertexPosition, 2, gl.FLOAT, false, stride, 0);
            gl.vertexAttribPointer(this._locations.aTextureCoord, 2, gl.FLOAT, false, stride, 2 * 4);
            gl.vertexAttribPointer(this._locations.aColor, 2, gl.FLOAT, false, stride, 4 * 4);

            gl.enableVertexAttribArray(this._locations.aVertexPosition);
            gl.enableVertexAttribArray(this._locations.aTextureCoord);
            gl.enableVertexAttribArray(this._locations.aColor);
        }
    }

}