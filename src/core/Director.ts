/// <reference path="Stage.ts"/>
/// <reference path="Touch.ts"/>
/// <reference path="../renderer/WebGLUtils.ts"/>
/// <reference path="../renderer/internal/Renderer.ts"/>
/// <reference path="Scheduler.ts"/>
/// <reference path="../assets/AssetLoader.ts"/>
module WOZLLA {

    var requestAnimationFrame =
        window.requestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(frameCall:Function, intervalTime=1000/62) {
            setTimeout(frameCall, intervalTime);
        };

    /**
     * a director hold this instances: <br/>
     * 1. {@link WOZLLA.Stage} <br/>
     * 2. {@link WOZLLA.renderer.IRenderer} <br/>
     * 3. {@link WOZLLA.Scheduler} <br/>
     * 4. {@link WOZLLA.Touch} <br/>
     * 5. {@link WOZLLA.assets.AssetLoader} <br/>
     * <br/>
     * <br/>
     * and also responsable to setup engine and control main loop.
     *
     * @class WOZLLA.Director
     * @singleton
     */
    export class Director {

        private static instance;

        public static getInstance():Director {
            return Director.instance;
        }

        /**
         * get the canvas element
         * @property {any} view
         */
        get view():any { return this._view; }

        /**
         * get the touch instance
         * @property {WOZLLA.Touch} touch
         * @readonly
         */
        get touch():Touch { return this._touch; }

        /**
         * get the stage instance
         * @property {WOZLLA.Stage} stage
         * @readonly
         */
        get stage():Stage { return this._stage; }

        /**
         * get the scheduler instance
         * @property {WOZLLA.Scheduler} scheduler
         * @readonly
         */
        get scheduler():Scheduler { return this._scheduler; }

        /**
         * get the renderer instance
         * @property {WOZLLA.renderer.IRenderer} renderer
         * @readonly
         */
        get renderer():WOZLLA.renderer.IRenderer { return this._renderer; }

        /**
         * get the asset loader instance
         * @property {WOZLLA.assets.AssetLoader} assetLoader
         * @readonly
         */
        get assetLoader():WOZLLA.assets.AssetLoader { return this._assetLoader; }

        /**
         * get the root instance of RectTransform
         * @returns {WOZLLA.RectTransform} viewRectTransform
         */
        get viewRectTransform():WOZLLA.RectTransform { return this._stage.viewRectTransform; }

        private _runing = false;
        private _paused = false;
        private _timeScale = 1;
        private _view;
        private _touch:Touch;
        private _stage:Stage;
        private _renderer:WOZLLA.renderer.IRenderer;
        private _scheduler:Scheduler;
        private _assetLoader:WOZLLA.assets.AssetLoader;

        constructor(view, options:any={}) {
            Director.instance = this;
            this._view = typeof view === 'string' ? document.getElementById('canvas') : view;
            this._scheduler = Scheduler.getInstance();
            this._assetLoader = WOZLLA.assets.AssetLoader.getInstance();
            this._touch = new WOZLLA.Touch(view, options.touchScale);
            this._renderer = new WOZLLA.renderer.Renderer(
                WOZLLA.renderer.WebGLUtils.getGLContext(view, options.renderer),
                {
                    x: 0,
                    y: 0,
                    width:  view.width,
                    height: view.height
                }
            );
            this._stage = new Stage();
        }

        /**
         *  start main loop
         */
        start():void {
            var frame;
            if(this._runing) {
                return;
            }
            this._runing = true;
            Time.reset();
            frame = ()=> {
                if(this._runing) {
                    requestAnimationFrame(frame);
                }
                this.runStep();
            };
            requestAnimationFrame(frame);
        }

        /**
         * stop main loop
         */
        stop() {
            this._runing = false;
        }

        /**
         * run one frame
         * @param {number} [timeScale=1]
         */
        public runStep(timeScale=this._timeScale) {
            Time.update(timeScale);
            this._stage.update();
            this._stage.visitStage(this._renderer);
            this._renderer.render();
            this._scheduler.runSchedule();
            WOZLLA.utils.Tween.tick(Time.delta);
        }

    }

}