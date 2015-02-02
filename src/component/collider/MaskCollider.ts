/// <reference path="../../core/Collider.ts"/>
/// <reference path="../../math/Rectangle.ts"/>
module WOZLLA.component {

    /**
     * @class WOZLLA.component.MaskCollider
     */
    export class MaskCollider extends WOZLLA.Collider {

        collideXY(localX:number, localY:number):boolean {
            return true;
        }

        collide(collider:Collider):boolean {
            return false;
        }

    }

}