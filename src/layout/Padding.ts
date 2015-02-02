module WOZLLA.layout {

    export class Padding {

        constructor(public top:number,
                    public left:number,
                    public bottom:number,
                    public right:number) {

        }

        equals(padding:Padding) {
            return this.top === padding.top &&
                    this.bottom === padding.bottom &&
                    this.right === padding.right &&
                    this.left === padding.left;
        }
    }

}