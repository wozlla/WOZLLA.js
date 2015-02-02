/// <reference path="Component.ts"/>
module WOZLLA {

    /**
     * abstract base class for all colliders
     * @class WOZLLA.Collider
     * @extends WOZLLA.Component
     * @abstract
     */
    export class Collider extends Component {

        /**
         * @method {boolean} containsXY
         * @param localX x coords relate to the gameObject of this collider
         * @param localY y coords relate to the gameObject of this collider
         * @returns {boolean}
         */
        collideXY(localX:number, localY:number):boolean {
            return false;
        }

        collide(collider:Collider):boolean {
            return false;
        }

    }

}