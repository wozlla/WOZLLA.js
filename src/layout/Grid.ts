/// <reference path="LayoutBase.ts"/>
/// <reference path="../math/Size.ts"/>
/// <reference path="../component/PropertyConverter.ts"/>
module WOZLLA.layout {

    var helpSize = new WOZLLA.math.Size(0, 0);

    export class Grid extends LayoutBase {

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
            if(this._itemMargin && this._itemMargin.equals(margin)) return;
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