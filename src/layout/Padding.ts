module WOZLLA.layout {

    export class Padding {

        get width():number {
            return this.boxWidth - this.left - this.right
        }

        get height():number {
            return this.boxHeight - this.top - this.bottom;
        }

        constructor(public top:number,
                    public left:number,
                    public bottom:number,
                    public right:number,
                    public boxWidth:number=0,
                    public boxHeight:number=0) {

        }

        equals(padding:Padding) {
            return this.top === padding.top &&
                    this.bottom === padding.bottom &&
                    this.right === padding.right &&
                    this.left === padding.left;
        }
    }

}