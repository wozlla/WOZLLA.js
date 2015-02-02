module WOZLLA {

    /**
     * @class WOZLLA.Time
     * @static
     */
    export class Time {

        /**
         * @property {number} delta
         * @readonly
         * @static
         */
        static delta:number = 0;

        /**
         * @property {number} now
         * @readonly
         * @static
         */
        static now:number = 0;

        /**
         * @property {number} measuredFPS
         * @readonly
         * @static
         */
        static measuredFPS:number = 0;

        static _nowIncrease:number = 0;

        public static update(timeScale) {
            var now = Date.now() + this._nowIncrease;
            if(this.now) {
                this.delta = (now - this.now) * timeScale;
                this._nowIncrease += this.delta * (timeScale - 1);
                this.now += this.delta;
                this.measuredFPS = 1000/this.delta;
            } else {
                this.now = now;
                this.delta = 1000/60;
            }
        }

        public static reset() {
            this.delta = 0;
            this.now = 0;
            this._nowIncrease = 0;
            this.measuredFPS = 0;
        }

    }

}