/// <reference path="LayoutBase.ts"/>
/// <reference path="../math/Size.ts"/>
/// <reference path="Margin.ts"/>
/// <reference path="../component/PropertyConverter.ts"/>
module WOZLLA.layout {

    var helpSize = new WOZLLA.math.Size(0, 0);

    export class Grid extends LayoutBase {

        public static CONSTRAINT_HORIZONTAL:string = "Horizontal";
        public static CONSTRAINT_VERTICAL:String = "Vertical";
        public static CONSTRAINT_BOTH:string = "Both";

        listRequiredComponents():Array<Function> {
            return [RectTransform];
        }

        get padding():Padding {
            return this._padding;
        }

        set padding(padding:Padding) {
            if(this._padding && this._padding.equals(padding)) return;
            this._padding = padding;
            this.requestLayout();
        }

        get itemMargin():Margin {
            return this._itemMargin;
        }

        set itemMargin(margin:Margin) {
            this._itemMargin = margin;
            this.requestLayout();
        }

        get itemSize():math.Size {
            return this._itemSize;
        }
        set itemSize(value:math.Size) {
            this._itemSize = value;
            this.requestLayout();
        }

        get constraint():string {
            return this._constraint;
        }
        set constraint(value:string) {
            this._constraint = value;
            this.requestLayout();
        }

        _padding:Padding = new Padding(0, 0, 0, 0);
        _itemMargin:Margin = new Margin(0, 0, 0, 0);
        _itemSize:math.Size = new math.Size(0, 0);
        _constraint:string = Grid.CONSTRAINT_HORIZONTAL;
        ignoreInvisible:boolean = true;

        doLayout():void {
            var padding = this._padding;
            var margin = this._itemMargin;
            var itemSize = this._itemSize;
            var children = this.gameObject.rawChildren;
            var rowNum = Math.floor((this.rectTransform.width-padding.left-padding.right)/(itemSize.width+margin.left+margin.right));

            var visibleCount = 0;
            var child;
            var idx;

            if(this.ignoreInvisible) {
                for (var i = 0, len = children.length; i < len; i++) {
                    child = children[i];
                    if (child.active && child.visible) {
                        visibleCount++;
                    }
                }
            } else {
                visibleCount = children.length;
            }

            var colNum = Math.ceil(visibleCount/rowNum);

            if(this._constraint === Grid.CONSTRAINT_HORIZONTAL) {
                this.rectTransform.height = colNum * (itemSize.height+margin.top+margin.bottom)
                    + padding.top + padding.bottom;

                idx = 0;
                for(var i=0,len=children.length; i<len; i++) {
                    child = children[i];
                    if(!this.ignoreInvisible || (this.ignoreInvisible && child.active && child.visible)) {
                        var row = idx % rowNum;
                        var col = Math.floor(idx / rowNum);
                        var x = padding.left + margin.left + (margin.left + margin.right + itemSize.width) * row;
                        var y = padding.top + margin.top + (margin.top + margin.bottom + itemSize.height) * col;
                        if (child.rectTransform) {
                            child.rectTransform.px = x;
                            child.rectTransform.py = y;
                        } else {
                            child.transform.setPosition(x, y);
                        }
                        idx++;
                    }
                }
            } else {
                // TODO
            }

        }

    }

    Component.register(Grid, {
        name: 'Grid',
        properties: [{
            name: 'constraint',
            type: 'string',
            editor: 'combobox',
            data: [Grid.CONSTRAINT_HORIZONTAL],
            defaultValue: Grid.CONSTRAINT_HORIZONTAL
        }, {
            name: 'padding',
            type: 'Padding',
            convert: component.PropertyConverter.array2Padding,
            defaultValue: [0, 0, 0, 0]
        }, {
            name: 'itemMargin',
            type: 'Margin',
            convert: component.PropertyConverter.array2Margin,
            defaultValue: [0, 0, 0, 0]
        }, {
            name: 'itemSize',
            type: 'point',
            defaultValue: [0, 0],
            convert: component.PropertyConverter.array2size
        }, {
            name: 'ignoreInvisible',
            type: 'boolean',
            defaultValue: true
        }]
    });



}