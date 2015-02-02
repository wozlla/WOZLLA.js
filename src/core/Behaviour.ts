/// <reference path="Component.ts"/>
module WOZLLA {

    /**
     * Abstract base class for all behaviours, the {@link WOZLLA.Behaviour#update} function would be call
     * by WOZLLA engine every frame when the gameObject is actived and the property enabled of this behaviour is true
     * @class WOZLLA.Behaviour
     * @extends WOZLLA.Component
     * @abstract
     */
    export class Behaviour extends Component {

        /**
         * enabled or disabled this behaviour
         * @property {boolean} [enabled=true]
         */
        enabled:boolean = true;

        /**
         * call by Engine every frame
         * @method update
         */
        update():void {}

    }

}