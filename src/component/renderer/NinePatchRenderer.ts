/// <reference path="SpriteRenderer.ts"/>
module WOZLLA.component {

    var QuadCommand = WOZLLA.renderer.QuadCommand;
    var helperRect = new WOZLLA.math.Rectangle(0, 0, 0, 0);

    /**
     * @class WOZLLA.component.NinePatchRenderer
     */
    export class NinePatchRenderer extends SpriteRenderer {

        get renderRegion():WOZLLA.math.Rectangle {
            return this._renderRegion;
        }
        set renderRegion(value:WOZLLA.math.Rectangle) {
            this._renderRegion = value;
        }

        get patch():WOZLLA.layout.Padding {
            return this._patch;
        }

        set patch(value:WOZLLA.layout.Padding) {
            this._patch = value;
            this._quadVertexDirty = true;
        }

        _patch:WOZLLA.layout.Padding;
        _renderRegion:WOZLLA.math.Rectangle;

        _initQuad() {
            this._quad = new WOZLLA.renderer.Quad(9);
        }

        _updateNinePatchQuads() {
            this._updateNinePatchQuadVertices();
            this._updateNinePatchQuadAlpha();
            this._updateNinePatchQuadColor();
            this._textureUpdated = false;
        }

        _updateNinePatchQuadVertices() {
            var transform = sharedHelpTransform;
            var frame = this._getTextureFrame();
            var patchUVS:any;
            var patchOffset = { x:0, y: 0 };
            var paddingPatch:WOZLLA.layout.Padding = this._patch || new WOZLLA.layout.Padding(0, 0, 0, 0);
            var region = this._renderRegion || new WOZLLA.math.Rectangle(0, 0, frame.width, frame.height);

            var patch:WOZLLA.math.Rectangle = helperRect;
            patch.x = paddingPatch.left;
            patch.y = paddingPatch.top;
            patch.width = frame.width - paddingPatch.left - paddingPatch.right;
            patch.height = frame.height - paddingPatch.top - paddingPatch.bottom;

            var patchSideW = frame.width - patch.width;
            var patchSideH = frame.height - patch.height;

            function getPatchUVS(patchFrame, texture) {
                var tw = texture.descriptor.width;
                var th = texture.descriptor.height;
                var patchUVS:any = {};
                patchUVS.x0 = patchFrame.x / tw;
                patchUVS.y0 = patchFrame.y / th;
                patchUVS.x1 = (patchFrame.x + patchFrame.width) / tw;
                patchUVS.y1 = patchFrame.y / th;
                patchUVS.x2 = (patchFrame.x + patchFrame.width) / tw;
                patchUVS.y2 = (patchFrame.y + patchFrame.height) / th;
                patchUVS.x3 = patchFrame.x / tw;
                patchUVS.y3 = (patchFrame.y + patchFrame.height) / th;
                return patchUVS;
            }

            var patches = [{
                // left top
                frame: {
                    x : frame.x,
                    y : frame.y,
                    width: patch.left,
                    height: patch.top
                },
                pos : {
                    x: region.x,
                    y: region.y
                },
                size: {
                    width: 1,
                    height: 1
                }
            }, {
                // left center
                frame: {
                    x : frame.x + patch.left,
                    y : frame.y ,
                    width: patch.width,
                    height: patch.top
                },
                pos : {
                    x: region.x + patch.left,
                    y: region.y
                },
                size : {
                    width: (region.width - patchSideW) / patch.width,
                    height: 1
                }
            }, {
                // right top
                frame: {
                    x : frame.x + patch.right,
                    y : frame.y ,
                    width: frame.width - patch.right,
                    height: patch.top
                },
                pos: {
                    x : region.right - paddingPatch.right,
                    y : region.y
                },
                size : {
                    width: 1,
                    height: 1
                }
            }, {
                // left middle
                frame: {
                    x : frame.x,
                    y : frame.y + patch.top,
                    width: patch.left,
                    height: patch.height
                },
                pos: {
                    x : region.x,
                    y : region.y + patch.top
                },
                size : {
                    width: 1,
                    height: (region.height - patchSideH) / patch.height
                }
            }, {
                // center middle
                frame: {
                    x : frame.x + patch.left,
                    y : frame.y + patch.top,
                    width: patch.width,
                    height: patch.height
                },
                pos: {
                    x : region.x + patch.left,
                    y : region.y + patch.top
                },
                size : {
                    width: (region.width - patchSideW) / patch.width,
                    height: (region.height - patchSideH) / patch.height
                }
            }, {
                // right middle
                frame: {
                    x : frame.x + patch.right,
                    y : frame.y + patch.top,
                    width: frame.width - patch.right,
                    height: patch.height
                },
                pos: {
                    x : region.right - paddingPatch.right,
                    y : region.y + patch.top
                },
                size : {
                    width: 1,
                    height: (region.height - patchSideH) / patch.height
                }
            }, {
                // left bottom
                frame: {
                    x : frame.x,
                    y : frame.y + patch.bottom,
                    width: frame.width - patch.right,
                    height: frame.height - patch.bottom
                },
                pos: {
                    x : region.x,
                    y : region.bottom - paddingPatch.bottom
                },
                size : {
                    width: 1,
                    height: 1
                }
            }, {
                // center bottom
                frame: {
                    x : frame.x + patch.left,
                    y : frame.y + patch.bottom,
                    width: patch.width,
                    height: frame.height - patch.bottom
                },
                pos: {
                    x : region.x + patch.left,
                    y : region.bottom - paddingPatch.bottom
                },
                size : {
                    width: (region.width - patchSideW) / patch.width,
                    height: 1
                }
            }, {
                // right bottom
                frame: {
                    x : frame.x + patch.right,
                    y : frame.y + patch.bottom,
                    width: frame.width - patch.right,
                    height: frame.height - patch.bottom
                },
                pos: {
                    x : region.right - paddingPatch.right,
                    y : region.bottom - paddingPatch.bottom
                },
                size : {
                    width: 1,
                    height: 1
                }
            }];

            for(var i=0, p; i<9; i++) {
                p = patches[i];
                if(p.frame.width > 0 && p.frame.height > 0) {
                    patchUVS = getPatchUVS(p.frame, this._texture);
                    transform.reset();
                    transform.x += p.pos.x;
                    transform.y += p.pos.y;
                    transform.setScale(p.size.width, p.size.height);
                    transform.transform(this.transform);
                    this._updateQuadVerticesByArgs(patchUVS, p.frame, patchOffset, transform.worldMatrix, i);
                } else {
                    this._clearQuadVertices(i);
                }
            }

            this._quadVertexDirty = false;
        }

        _updateNinePatchQuadAlpha() {
            for(var i=0; i<9; i++) {
                this._updateQuadAlpha(i);
            }
            this._quadAlphaDirty = false;
        }

        _updateNinePatchQuadColor() {
            for(var i=0; i<9; i++) {
                this._updateQuadColor(i);
            }
            this._quadColorDirty = false;
        }

        render(renderer:WOZLLA.renderer.IRenderer, flags:number):void {
            if (!this._texture) {
                return;
            }
            if((flags & GameObject.MASK_TRANSFORM_DIRTY) === GameObject.MASK_TRANSFORM_DIRTY) {
                this._quadVertexDirty = true;
            }
            if (this._textureUpdated) {
                this._updateNinePatchQuads();
            }
            if (this._quadVertexDirty) {
                this._updateNinePatchQuadVertices();
            }
            if (this._quadAlphaDirty) {
                this._updateNinePatchQuadAlpha();
            }
            if (this._quadColorDirty) {
                this._updateNinePatchQuadColor();
            }
            renderer.addCommand(QuadCommand.init(
                this._quadGlobalZ,
                this._quadLayer,
                this._texture,
                this._quadMaterialId,
                this._quad,
                this._gameObject.name + '[9patch]'));
        }

    }

    Component.register(NinePatchRenderer, {
        name: "NinePatchRenderer",
        properties: [
            Component.extendConfig(SpriteRenderer),
            {
                name: 'patch',
                type: 'padding',
                defaultValue: [0, 0, 0, 0],
                convert: PropertyConverter.array2Padding
            }, {
                name: 'renderRegion',
                type: 'rect',
                defaultValue: [0, 0, 0, 0],
                convert: PropertyConverter.array2rect
            }]
    });

}