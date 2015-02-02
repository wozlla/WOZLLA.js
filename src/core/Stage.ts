/// <reference path="GameObject.ts"/>
module WOZLLA {

    /**
     * the root game object of WOZLLA engine
     * @class WOZLLA.Stage
     * @extends WOZLLA.GameObject
     */
    export class Stage extends GameObject {

        public static ID:string = 'WOZLLAStage';

        get viewRectTransform():RectTransform { return this._viewRectTransform; }

        _rootTransform:Transform;
        _viewRectTransform:RectTransform;

        constructor() {
            super();
            this.id = Stage.ID;
            this.name = Stage.ID;
            this._rootTransform = new Transform();
            this._viewRectTransform = new RectTransform();
            this._viewRectTransform.anchorMode = RectTransform.ANCHOR_TOP | RectTransform.ANCHOR_LEFT;
            this._viewRectTransform.width = Director.getInstance().renderer.viewport.width;
            this._viewRectTransform.height = Director.getInstance().renderer.viewport.height;
            this._viewRectTransform.px = 0;
            this._viewRectTransform.py = 0;
            this.init();
        }

        visitStage(renderer:WOZLLA.renderer.IRenderer):void {
            super.visit(renderer, this._rootTransform, GameObject.MASK_VISIBLE);
        }

    }

}