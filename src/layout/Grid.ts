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

        _padding:Padding;
        _itemMargin:Margin;

        doLayout():void {
            var padding = this._padding;
            var margin = this._itemMargin;
            var children = this.gameObject.rawChildren;

            var col = 0;
            var row = 0;
            var totalHeight = padding.top + padding.bottom;
            var rowHeight = 0;
            var x = padding.left;
            var y = padding.top;
            var child;
            var rect = this.gameObject.rectTransform;
            for(var i=0,len=children.length; i<len; i++) {
                child = children[i];
                this.measureChildSize(child, i, helpSize);

                // measure x, y
                x += margin.left;
                y += margin.top;

                // resolve new row
                if(x + helpSize.width + margin.right + padding.right > rect.width) {
                    row ++;
                    col = 0;
                    y += margin.bottom;
                    y += helpSize.height;
                    x = padding.left + margin.left;
                    totalHeight += margin.top + margin.bottom + rowHeight;
                }

                // apply position
                if(child.rectTransform) {
                    child.rectTransform.px = x;
                    child.rectTransform.py = y;
                } else {
                    child.transform.x = x;
                    child.transform.y = y;
                }

                // determine row height
                if(helpSize.height > rowHeight) {
                    rowHeight = helpSize.height;
                }

                // grow col num
                x += margin.right + helpSize.width;
                col++;
            }

            rect.height = totalHeight + rowHeight;
        }

        protected measureChildSize(child:GameObject, idx:number, size:WOZLLA.math.Size) {
            var rectTransform = child.rectTransform;
            if(!rectTransform) {
                size.height = size.width = 0;
            } else {
                size.width = rectTransform.width;
                size.height = rectTransform.height;
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
        }]
    });



}