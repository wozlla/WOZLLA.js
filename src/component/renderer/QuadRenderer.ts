/// <reference path="../../core/Renderer.ts"/>
/// <reference path="../../renderer/IRenderer.ts"/>
/// <reference path="../../renderer/ILayerManager.ts"/>
/// <reference path="../../renderer/QuadCommand.ts"/>
module WOZLLA.component {

    var QuadCommand = WOZLLA.renderer.QuadCommand;

    /**
     * @class WOZLLA.component.QuadRenderer
     * @abstract
     */
    export class QuadRenderer extends WOZLLA.Renderer {

        _quad:WOZLLA.renderer.Quad;
        _quadLayer:string = WOZLLA.renderer.ILayerManager.DEFAULT;
        _quadMaterialId:string = WOZLLA.renderer.IMaterial.DEFAULT;
        _quadGlobalZ:number = 0;
        _quadAlpha:number = 1;
        _quadColor:number = 0xFFFFFF;
        _quadVertexDirty:boolean = true;
        _quadAlphaDirty:boolean = true;
        _quadColorDirty:boolean = true;
        _texture:WOZLLA.renderer.ITexture;
        _textureOffset:any;
        _textureFrame:any;
        _textureUVS:any;
        _textureUpdated:boolean = false;

        setQuadRenderRange(offset:number, count:number) {
            this._quad.setRenderRange(offset, count);
        }

        setQuadGlobalZ(globalZ:number) {
            this._quadGlobalZ = globalZ;
        }

        setQuadLayer(layer:string) {
            this._quadLayer = layer;
        }

        setQuadMaterialId(materialId:string) {
            this._quadMaterialId = materialId;
        }

        setQuadAlpha(alpha:number) {
            this._quadAlpha = alpha;
            this._quadAlphaDirty = true;
        }

        setQuadColor(color:number) {
            this._quadColor = color;
            this._quadColorDirty = true;
        }

        setTexture(texture:WOZLLA.renderer.ITexture) {
            this._texture = texture;
            this._textureUVS = null;
            this._textureUpdated = true;
        }

        setTextureFrame(frame) {
            this._textureFrame = frame;
            this._textureUVS = null;
            this._textureUpdated = true;
        }

        setTextureOffset(offset) {
            this._textureOffset = offset;
            this._textureUpdated = true;
        }

        init():void {
            this._initQuad();
            super.init();
        }

        render(renderer:WOZLLA.renderer.IRenderer, flags:number):void {
            if (!this._texture) {
                return;
            }
            if((flags & GameObject.MASK_TRANSFORM_DIRTY) === GameObject.MASK_TRANSFORM_DIRTY) {
                this._quadVertexDirty = true;
            }
            if (this._textureUpdated) {
                this._updateQuad();
            }
            if (this._quadVertexDirty) {
                this._updateQuadVertices();
                this._quadVertexDirty = false;
            }
            if (this._quadAlphaDirty) {
                this._updateQuadAlpha();
            }
            if (this._quadColorDirty) {
                this._updateQuadColor();
            }
            renderer.addCommand(QuadCommand.init(
                this._quadGlobalZ,
                this._quadLayer,
                this._texture,
                this._quadMaterialId,
                this._quad));
        }

        _initQuad():void {
            this._quad = new WOZLLA.renderer.Quad(1);
        }

        _getTextureFrame() {
            return this._textureFrame || {
                x: 0,
                y: 0,
                width: this._texture.descriptor.width,
                height: this._texture.descriptor.height
            };
        }

        _getTextureOffset() {
            return this._textureOffset || { x: 0, y: 0 };
        }

        _getTextureUVS() {
            var tw, th, frame:any, uvs:any;
            if(this._textureUVS) {
                return this._textureUVS;
            }
            tw = this._texture.descriptor.width;
            th = this._texture.descriptor.height;
            frame = this._textureFrame || {
                x: 0,
                y: 0,
                width: tw,
                height: th
            };
            uvs = {};
            uvs.x0 = frame.x / tw;
            uvs.y0 = frame.y / th;
            uvs.x1 = (frame.x + frame.width) / tw;
            uvs.y1 = frame.y / th;
            uvs.x2 = (frame.x + frame.width) / tw;
            uvs.y2 = (frame.y + frame.height) / th;
            uvs.x3 = frame.x / tw;
            uvs.y3 = (frame.y + frame.height) / th;
            this._textureUVS = uvs;
            return uvs;
        }

        _updateQuad(quadIndex=0) {
            this._updateQuadVertices(quadIndex);
            this._updateQuadAlpha(quadIndex);
            this._updateQuadColor(quadIndex);
            this._textureUpdated = false;
        }

        _updateQuadVertices(quadIndex=0) {
            var uvs = this._getTextureUVS();
            var frame = this._getTextureFrame();
            var offset = this._getTextureOffset();
            var matrix = this._gameObject.transform.worldMatrix;
            this._updateQuadVerticesByArgs(uvs, frame, offset, matrix, quadIndex);
            this._quadVertexDirty = false;
        }

        _updateQuadVerticesByArgs(uvs, frame, offset, matrix, quadIndex=0) {
            var a = matrix.values[0];
            var c = matrix.values[1];
            var b = matrix.values[3];
            var d = matrix.values[4];
            var tx = matrix.values[6];
            var ty = matrix.values[7];

            var w1 = -offset.x * frame.width;
            var w0 = w1 + frame.width;
            var h1 = -offset.y * frame.height;
            var h0 = h1 + frame.height;

            var x1 = a * w1 + b * h1 + tx;
            var y1 = d * h1 + c * w1 + ty;
            var x2 = a * w0 + b * h1 + tx;
            var y2 = d * h1 + c * w0 + ty;
            var x3 = a * w0 + b * h0 + tx;
            var y3 = d * h0 + c * w0 + ty;
            var x4 = a * w1 + b * h0 + tx;
            var y4 = d * h0 + c * w1 + ty;

            this._quad.setVertices(x1, y1, x2, y2, x3, y3, x4, y4, quadIndex);
            this._quad.setTexCoords(uvs.x0, uvs.y0, uvs.x1, uvs.y1, uvs.x2, uvs.y2, uvs.x3, uvs.y3, quadIndex);
        }

        _clearQuadVertices(quadIndex=0) {
            this._quad.setVertices(0, 0, 0, 0, 0, 0, 0, 0);
            this._quad.setTexCoords(0, 0, 0, 0, 0, 0, 0, 0);
        }

        _updateQuadAlpha(quadIndex=0) {
            this._quad.setAlpha(this._quadAlpha, quadIndex);
            this._quadAlphaDirty = false;
        }

        _updateQuadColor(quadIndex=0) {
            this._quad.setColor(this._quadColor, quadIndex);
            this._quadColorDirty = false;
        }
    }

}