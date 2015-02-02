/// <reference path="../../core/Collider.ts"/>
/// <reference path="../../math/Rectangle.ts"/>
module WOZLLA.component {

    /**
     * @class WOZLLA.component.CircleCollider
     */
    export class CircleCollider extends WOZLLA.Collider {

        region:WOZLLA.math.Circle;

        collideXY(localX:number, localY:number):boolean {
            return this.region && this.region.containsXY(localX, localY);
        }

        collide(collider:Collider):boolean {
            return false;
        }

    }

}