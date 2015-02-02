module WOZLLA.assets {

    /**
     * an sprite is a part of a sprite atlas
     * @class WOZLLA.assets.Sprite
     * <br/>
     * see also: <br/>
     * {@link WOZLLA.assets.SpriteAtlas}<br/>
     */
    export class Sprite {

        /**
         * get the sprite atlas of this sprite belongs to
         * @property {WOZLLA.assets.SpriteAtlas} spriteAltas
         * @readonly
         */
        get spriteAtlas():SpriteAtlas { return this._spriteAtlas; }

        /**
         * get frame info
         * @property {any} frame
         * @readonly
         */
        get frame():any { return this._frame; }

        /**
         * get sprite name
         * @property {string} name
         * @readonly
         */
        get name():string { return this._name; }

        _spriteAtlas:SpriteAtlas;
        _frame:any;
        _name:string;

        /**
         * new a sprite
         * @method constructor
         * @param spriteAtlas
         * @param frame
         * @param name
         */
        constructor(spriteAtlas:SpriteAtlas, frame, name?) {
            this._spriteAtlas = spriteAtlas;
            this._frame = frame;
            this._name = name;
        }

    }

}