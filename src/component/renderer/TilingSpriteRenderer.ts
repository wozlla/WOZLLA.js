/// <reference path="SpriteRenderer.ts"/>
/// <reference path="../PropertySnip.ts"/>
module WOZLLA.component {

    var QuadCommand = WOZLLA.renderer.QuadCommand;

    /**
     * @class WOZLLA.component.TilingSpriteRenderer
     */
    export class TilingSpriteRenderer extends SpriteRenderer {

        get renderRegion():WOZLLA.math.Rectangle {
            return this._renderRegion;
        }
        set renderRegion(value:WOZLLA.math.Rectangle) {
            this._renderRegion = value;
            this._quadVertexDirty = true;
        }

        get tileMargin():WOZLLA.layout.Margin {
            return this._tileMargin;
        }

        set tileMargin(value:WOZLLA.layout.Margin) {
            this._tileMargin = value;
        }

        _renderRegion:WOZLLA.math.Rectangle;
        _tileMargin:WOZLLA.layout.Margin = new WOZLLA.layout.Margin(0, 0, 0, 0);

        _initQuad() {
            if(this._renderRegion && this._sprite) {
                var frame = this._sprite.frame;
                var count = Math.ceil(this._renderRegion.width/frame.width) *
                    Math.ceil(this._renderRegion.height/frame.height);
                this._quad = new WOZLLA.renderer.Quad(count);
            }
        }

        _updateTilingQuads() {
            this._updateTilingQuadVertices();
            this._updateTilingQuadAlpha();
            this._updateTilingQuadColor();
            this._textureUpdated = false;
        }

        _updateTilingQuadVertices() {
            var frame = this._getTextureFrame();
            var textureOffset = this._getTextureOffset();
            var normalUVS = this._getTextureUVS();
            var colNum = Math.ceil(this._renderRegion.width/frame.width);
            var rowNum = Math.ceil(this._renderRegion.height/frame.height);
            var thisTrans = this.gameObject.transform;
            var margin = this._tileMargin;
            var posX, posY;
            for(var i=0; i<rowNum; i++) {
                for(var j=0; j<colNum; j++) {
                    sharedHelpTransform.reset();
                    posX = (margin.left + margin.right + frame.width) * j + margin.left + this._renderRegion.x;
                    posY = (margin.top + margin.bottom + frame.height) * i + margin.top + this._renderRegion.y;
                    sharedHelpTransform.x += posX;
                    sharedHelpTransform.y += posY;
                    sharedHelpTransform.transform(thisTrans);
                    this._updateQuadVerticesByArgs(normalUVS, frame, textureOffset, sharedHelpTransform.worldMatrix, i*colNum+j);
                }
            }
            this._quadVertexDirty = false;
        }

        _updateTilingQuadAlpha() {
            for(var i=0; i<this._quad.count; i++) {
                this._updateQuadAlpha(i);
            }
            this._quadAlphaDirty = false;
        }

        _updateTilingQuadColor() {
            for(var i=0; i<this._quad.count; i++) {
                this._updateQuadColor(i);
            }
            this._quadColorDirty = false;
        }

        render(renderer:WOZLLA.renderer.IRenderer, flags:number):void {
            if (!this._texture || !this._quad) {
                return;
            }
            if((flags & GameObject.MASK_TRANSFORM_DIRTY) === GameObject.MASK_TRANSFORM_DIRTY) {
                this._quadVertexDirty = true;
            }
            if (this._textureUpdated) {
                this._updateTilingQuads();
            }
            if (this._quadVertexDirty) {
                this._updateTilingQuadVertices();
            }
            if (this._quadAlphaDirty) {
                this._updateTilingQuadAlpha();
            }
            if (this._quadColorDirty) {
                this._updateTilingQuadColor();
            }
            renderer.addCommand(QuadCommand.init(
                this._quadGlobalZ,
                this._quadLayer,
                this._texture,
                this._quadMaterialId,
                this._quad,
                this._gameObject.name + '[tiling]'));
        }

    }

    Component.register(TilingSpriteRenderer, {
        name: "TilingSpriteRenderer",
        properties: [
            Component.extendConfig(SpriteRenderer),
            PropertySnip.createRect('renderRegion'),
            PropertySnip.createMargin('tileMargin')
        ]
    });

}