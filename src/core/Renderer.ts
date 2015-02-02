module WOZLLA {

    /**
     * Abstract base class for Renderer component
     * @class WOZLLA.Renderer
     * @abstract
     */
    export class Renderer extends Component {

        /**
         * render this object
         * @param renderer
         * @param flags
         */
        render(renderer:WOZLLA.renderer.IRenderer, flags:number):void {}

    }

}