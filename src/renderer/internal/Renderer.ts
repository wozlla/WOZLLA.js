/// <reference path="LayerManager.ts"/>
/// <reference path="../BlendType.ts"/>
/// <reference path="MaterialManager.ts"/>
/// <reference path="ShaderManager.ts"/>
/// <reference path="TextureManager.ts"/>
module WOZLLA.renderer {

    export class Renderer implements IRenderer {

        public static MAX_QUAD_SIZE = 500;

        get layerManager():ILayerManager { return this._layerManager; }
        get materialManager():IMaterialManager { return this._materialManager; }
        get shaderManager():IShaderManager { return this._shaderManager; }
        get textureManager():ITextureManager { return this._textureManager; }

        get gl():any { return this._gl; }
        get viewport():any { return this._viewport; }

        _gl;
        _viewport;
        _layerManager:LayerManager;
        _materialManager:IMaterialManager;
        _shaderManager:IShaderManager;
        _textureManager:ITextureManager;

        _commandQueueMap:any = {};
        _blendModes:any = {};

        _usingMaterial:IMaterial;
        _usingTexture:ITexture;

        _uniforms:any = {};

        private _quadBatch:QuadBatch;

        constructor(gl, viewport) {
            this._gl = gl;
            this._viewport = viewport;

            this._blendModes[BlendType.NORMAL]        = new BlendType(gl.ONE,       gl.ONE_MINUS_SRC_ALPHA);
            this._blendModes[BlendType.ADD]           = new BlendType(gl.SRC_ALPHA, gl.DST_ALPHA);
            this._blendModes[BlendType.MULTIPLY]      = new BlendType(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
            this._blendModes[BlendType.SCREEN]        = new BlendType(gl.SRC_ALPHA, gl.ONE);

            this._layerManager = new LayerManager();
            this._materialManager = new MaterialManager();
            this._shaderManager = new ShaderManager(gl);
            this._textureManager = new TextureManager(gl);
            this._quadBatch = new QuadBatch(gl);

            this._uniforms.projection = {
                x: viewport.width/2,
                y: -viewport.height/2
            };

            gl.disable(gl.DEPTH_TEST);
            gl.disable(gl.CULL_FACE);
            gl.enable(gl.BLEND);
        }

        addCommand(command:IRenderCommand) {
            var layer = command.layer;
            var commandQueue = this._commandQueueMap[layer];
            if(!commandQueue) {
                commandQueue = this._commandQueueMap[layer] = new CommandQueue(layer);
            }
            commandQueue.add(command);
        }

        render():void {
            var lastCommand;
            var currentTexture;
            var currentMaterial;

            var gl = this._gl;
            gl.viewport(0, 0, this._viewport.width, this._viewport.height);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            this._eachCommand((command) => {
                var quadCommand;
                var customCommand;
                if(!lastCommand) {
                    this.flush();
                } else if(lastCommand instanceof CustomCommand) {
                    this.flush();
                } else if(command instanceof CustomCommand) {
                    this.flush();
                } else if((<QuadCommand>command).materialId !== currentMaterial.id) {
                    this.flush();
                } else if((<QuadCommand>command).texture !== currentTexture) {
                    this.flush();
                }
                if(command instanceof CustomCommand) {
                    customCommand = <CustomCommand>command;
                    customCommand.execute(this);
                } else {
                    quadCommand = <QuadCommand>command;
                    if(this._quadBatch.canFill(quadCommand.quad)) {
                        this._quadBatch.fillQuad(quadCommand.quad);
                    } else {
                        this.flush();
                        this._quadBatch.fillQuad(quadCommand.quad);
                    }
                }
                this._usingMaterial = currentMaterial = this._materialManager.getMaterial(command.materialId);
                this._usingTexture = currentTexture  = command.texture;
                lastCommand = command;
            });
            if(lastCommand) {
                this.flush();
                this._clearCommands();
                this._usingTexture = null;
                this._usingMaterial = null;
            }
        }

        flush():void {
            var gl, shaderProgram;
            if(!this._usingMaterial) {
                return;
            }

            gl = this._gl;
            shaderProgram = this._shaderManager.getShaderProgram(this._usingMaterial.shaderProgramId);
            shaderProgram.useProgram(gl);
            shaderProgram.syncUniforms(gl, this._uniforms);
            this._blendModes[this._usingMaterial.blendType].applyBlend(gl);
            if(this._usingTexture) {
                this._usingTexture.bind(gl);
            }
            this._quadBatch.flush(gl);
        }

        _clearCommands() {
            var commandQueueMap = this._commandQueueMap;
            for(var layer in commandQueueMap) {
                commandQueueMap[layer].clear();
            }
        }

        _eachCommand(func:Function) {
            var i, len, j, len2;
            var layer;
            var commandQueue;
            var zQueue;
            var command;
            var commandQueueMap = this._commandQueueMap;
            var layers = this._layerManager._getSortedLayers();
            for(i=0,len=layers.length; i<len; i++) {
                layer = layers[i];
                commandQueue = commandQueueMap[layer];
                if(commandQueue) {
                    zQueue = commandQueue.negativeZQueue;
                    if(zQueue.length > 0) {
                        for(j=0, len2=zQueue.length; j<len2; j++) {
                            command = zQueue[j];
                            func(command);
                        }
                    }
                    zQueue = commandQueue.zeroZQueue;
                    if(zQueue.length > 0) {
                        for(j=0, len2=zQueue.length; j<len2; j++) {
                            command = zQueue[j];
                            func(command);
                        }
                    }
                    zQueue = commandQueue.positiveZQueue;
                    if(zQueue.length > 0) {
                        for(j=0, len2=zQueue.length; j<len2; j++) {
                            command = zQueue[j];
                            func(command);
                        }
                    }
                }
            }
        }
    }

    function compareCommandByGlobalZ(a, b) {
        if(a.globalZ === b.globalZ) {
            return a._addIndex - b._addIndex;
        }
        return a.globalZ - b.globalZ;
    }

    class CommandQueue {

        _addIndex = 0;
        layer:string;

        public negativeZQueue = [];
        public zeroZQueue = [];
        public positiveZQueue = [];

        constructor(layer) {
            this.layer = layer;
        }

        add(command:IRenderCommand) {
            command._addIndex = this._addIndex++;
            if(command.globalZ === 0) {
                this.zeroZQueue.push(command);
            }
            else if(command.globalZ > 0) {
                this.positiveZQueue.push(command);
            }
            else {
                this.negativeZQueue.push(command);
            }
        }

        clear() {
            var i, len, command;
            for(i=0,len=this.negativeZQueue.length; i<len; i++) {
                command = this.negativeZQueue[i];
                if(command.isPoolable) {
                    command.release();
                }
            }
            for(i=0,len=this.zeroZQueue.length; i<len; i++) {
                command = this.zeroZQueue[i];
                if(command.isPoolable) {
                    command.release();
                }
            }
            for(i=0,len=this.positiveZQueue.length; i<len; i++) {
                command = this.positiveZQueue[i];
                if(command.isPoolable) {
                    command.release();
                }
            }
            this.negativeZQueue.length = 0;
            this.zeroZQueue.length = 0;
            this.positiveZQueue.length = 0;
            this._addIndex = 0;
        }

        sort() {
            this.positiveZQueue.sort(compareCommandByGlobalZ);
            this.negativeZQueue.sort(compareCommandByGlobalZ);
        }
    }

    class QuadBatch {

        private _gl;

        private _size = Renderer.MAX_QUAD_SIZE;
        private _vertices;
        private _indices;

        private _vertexBuffer;
        get vertexBuffer() { return this._vertexBuffer; }
        private _indexBuffer;
        get indexBuffer() { return this._indexBuffer; }

        private _curVertexIndex:number = 0;
        private _curBatchSize = 0;

        constructor(gl) {
            this._gl = gl;
            this._initBuffers();
        }

        canFill(quad:Quad):boolean {
            return this._curVertexIndex  < this._size;
        }

        fillQuad(quad:Quad):void {
            var vertexIndex, storage;
            var vertices = this._vertices;
            vertexIndex = this._curVertexIndex;
            if(quad.count === quad.renderCount) {
                vertices.set(quad.storage, vertexIndex);
            } else {
                var j = 0;
                var i = quad.renderOffset * quad.type.size;
                var len = quad.renderCount * quad.type.size;
                storage = quad.storage;
                for(; j<len; i++,j++) {
                    vertices[vertexIndex+j] = storage[i];
                }
            }
            this._curVertexIndex += quad.renderCount * quad.type.size;
            this._curBatchSize += quad.renderCount;
        }

        flush(gl):void {
            if (this._curBatchSize === 0) {
                return;
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this._vertices, gl.DYNAMIC_DRAW);
            gl.drawElements(gl.TRIANGLES, this._curBatchSize * 6, gl.UNSIGNED_SHORT, 0);
            this._curVertexIndex = 0;
            this._curBatchSize = 0;
        }

        _initBuffers() {
            var i, j;
            var gl = this._gl;
            var numVerts = this._size * 4 *  6;
            var numIndices = this._size * 6;

            this._vertices = new Float32Array(numVerts);
            this._indices = new Uint16Array(numIndices);

            for (i=0, j=0; i < numIndices; i += 6, j += 4) {
                this._indices[i    ] = j;
                this._indices[i + 1] = j + 1;
                this._indices[i + 2] = j + 2;
                this._indices[i + 3] = j;
                this._indices[i + 4] = j + 2;
                this._indices[i + 5] = j + 3;
            }

            // create a couple of buffers
            this._vertexBuffer = gl.createBuffer();
            this._indexBuffer = gl.createBuffer();

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._indices, gl.STATIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this._vertices, gl.DYNAMIC_DRAW);
        }

    }

}