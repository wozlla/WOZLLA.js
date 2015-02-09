/// <reference path="../renderer/SpriteRenderer.ts"/>
module WOZLLA.component {

    var QuadCommand = WOZLLA.renderer.QuadCommand;

    /**
     * @class WOZLLA.component.QuadArrayRenderer
     */
    export class QuadArraySpriteRenderer extends SpriteRenderer {

        _initQuad() {

        }

        _updateQuads() {
            this._updateQuadsVertices();
            this._updateQuadsAlpha();
            this._updateQuadsColor();
            this._textureUpdated = false;
        }

        _updateQuadsVertices() {
        }

        _updateQuadsAlpha() {
            for(var i=0; i<this._quad.count; i++) {
                this._updateQuadAlpha(i);
            }
            this._quadAlphaDirty = false;
        }

        _updateQuadsColor() {
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
                this._updateQuads();
            }
            if (this._quadVertexDirty) {
                this._updateQuadsVertices();
            }
            if (this._quadAlphaDirty) {
                this._updateQuadsAlpha();
            }
            if (this._quadColorDirty) {
                this._updateQuadsColor();
            }
            renderer.addCommand(QuadCommand.init(
                this._quadGlobalZ,
                this._quadLayer,
                this._texture,
                this._quadMaterialId,
                this._quad,
                this._gameObject.name + 'QuadArrayRenderer'));
        }

    }

    Component.register(QuadArraySpriteRenderer, {
        name: "QuadArraySpriteRenderer",
        abstractComponent: true,
        properties: [
            Component.extendConfig(SpriteRenderer),
        ]
    });

}