module WOZLLA.renderer {

    /**
     * @class WOZLLA.renderer.QuadType
     */
    export class QuadType {

        get size() {return this.strade * 4; }
        get strade() { return this._info[0]; }
        get vertexIndex() { return this._info[1]; }
        get texCoordIndex() { return this._info[2]; }
        get alphaIndex() { return this._info[3]; }
        get colorIndex() { return this._info[4]; }

        _info;
        constructor(info) {
            this._info = info;
        }
    }

    /**
     * @class WOZLLA.renderer.Quad
     */
    export class Quad {

        public static V2T2C1A1 = new QuadType([6, 0, 2, 4, 5]);

        get storage():number[] { return this._storage; }
        get count():number { return this._count; }
        get type():QuadType { return this._type; }
        get renderOffset():number { return this._renderOffset; }
        get renderCount():number { return this._renderCount; }

        _storage:number[];
        _count:number;
        _type:QuadType;
        _renderOffset:number;
        _renderCount:number;

        constructor(count:number, type:QuadType=Quad.V2T2C1A1) {
            this._count = count;
            this._type = type;
            this._storage = new Array(type.size * count);
            this._renderOffset = 0;
            this._renderCount = count;
        }

        setRenderRange(offset:number, count:number):void {
            this._renderOffset = offset;
            this._renderCount = count;
        }

        setVertices(x1, y1, x2, y2, x3, y3, x4, y4, offset=0):void {
            var strade = this._type.strade;
            var size = this._type.size;
            var index = this._type.vertexIndex;
            var base = size*offset + index;

            this._storage[0 + base             ] = x1;
            this._storage[1 + base             ] = y1;

            this._storage[0 + base + strade * 1] = x2;
            this._storage[1 + base + strade * 1] = y2;

            this._storage[0 + base + strade * 2] = x3;
            this._storage[1 + base + strade * 2] = y3;

            this._storage[0 + base + strade * 3] = x4;
            this._storage[1 + base + strade * 3] = y4;
        }

        setTexCoords(x1, y1, x2, y2, x3, y3, x4, y4, offset=0):void {
            var strade = this._type.strade;
            var size = this._type.size;
            var index = this._type.texCoordIndex;
            var base = size*offset + index;
            this._storage[0 + base             ] = x1;
            this._storage[1 + base             ] = y1;

            this._storage[0 + base + strade * 1] = x2;
            this._storage[1 + base + strade * 1] = y2;

            this._storage[0 + base + strade * 2] = x3;
            this._storage[1 + base + strade * 2] = y3;

            this._storage[0 + base + strade * 3] = x4;
            this._storage[1 + base + strade * 3] = y4;
        }

        setAlpha(alpha:number, offset=0):void {
            var strade = this._type.strade;
            var size = this._type.size;
            var index = this._type.alphaIndex;
            var base = size*offset + index;
            this._storage[base             ] = alpha;
            this._storage[base + strade * 1] = alpha;
            this._storage[base + strade * 2] = alpha;
            this._storage[base + strade * 3] = alpha;
        }

        setColor(color, offset=0):void {
            var strade = this._type.strade;
            var size = this._type.size;
            var index = this._type.colorIndex;
            var base = size*offset + index;
            this._storage[base             ] = color;
            this._storage[base + strade * 1] = color;
            this._storage[base + strade * 2] = color;
            this._storage[base + strade * 3] = color;
        }

    }

}