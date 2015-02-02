/// <reference path="../../core/Collider.ts"/>
/// <reference path="../../math/Rectangle.ts"/>
module WOZLLA.component {

    /**
     * @class WOZLLA.component.RectCollider
     */
    export class RectCollider extends WOZLLA.Collider {

        public static fromSpriteRenderer(spriteRenderer:SpriteRenderer):RectCollider {
            var rectCollider = new WOZLLA.component.RectCollider();
            var frame = spriteRenderer.sprite.frame;
            var offset = spriteRenderer.spriteOffset;
            rectCollider.region = new WOZLLA.math.Rectangle(0-frame.width*offset.x, 0-frame.height*offset.y, frame.width, frame.height);
            return rectCollider;
        }

        region:WOZLLA.math.Rectangle;

        collideXY(localX:number, localY:number):boolean {
            return this.region && this.region.containsXY(localX, localY);
        }

        collide(collider:Collider):boolean {
            return false;
        }

    }

}