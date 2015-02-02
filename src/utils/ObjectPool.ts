module WOZLLA.utils {

    export interface Poolable {
        isPoolable:boolean;
        release();
    }

    export class ObjectPool<T extends Poolable> {

        _minCount;
        _factory;

        _pool:Array<T>;

        constructor(minCount:number, factory:()=>T) {
            this._minCount = minCount;
            this._factory = factory;
            this._pool = [];
            for(var i=0; i<this._minCount; i++) {
                this._pool.push(this._factory());
            }
        }

        retain():T {
            var object:T = this._pool.shift();
            if(object) {
                return object;
            }
            return this._factory();
        }

        release(obj:T) {
            if(this._pool.indexOf(obj) !== -1) {
                return;
            }
            this._pool.push(obj);
        }

    }

}