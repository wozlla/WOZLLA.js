/// <reference path="LayoutBase.ts"/>
/// <reference path="../component/PropertyConverter.ts"/>
module WOZLLA.layout {

    export class VBox extends LayoutBase {

        get padding():Padding {
            return this._padding;
        }

        set padding(padding:Padding) {
            if(this._padding && this._padding.equals(padding)) return;
            this._padding = padding;
            this.requestLayout();
        }

        get itemMargin():number {
            return this._itemMargin;
        }

        set itemMargin(margin:number) {
            if(this._itemMargin === margin) return;
            this._itemMargin = margin;
            this.requestLayout();
        }

        _padding:Padding;
        _itemMargin:number;

        doLayout():void {
            var padding = this._padding;
            var y = padding.top;
            this.gameObject.eachChild((child:GameObject, idx:number) => {
                var rectTransform = child.rectTransform;
                if(!rectTransform) {
                    child.transform.x = padding.left;
                    child.transform.y = y;
                } else {
                    rectTransform.anchorMode = RectTransform.ANCHOR_LEFT | RectTransform.ANCHOR_TOP;
                    rectTransform.px = padding.left;
                    rectTransform.py = y;
                }
                y += this._itemMargin + this.measureChildHeight(child, idx);
            });
        }

        protected measureChildHeight(child:GameObject, idx:number):number {
            var rectTransform = child.rectTransform;
            if(!rectTransform) {
                return 0;
            } else {
                return rectTransform.height;
            }
        }

    }

    Component.register(VBox, {
        name: 'VBox',
        properties: [{
            name: 'padding',
            type: 'Padding',
            convert: component.PropertyConverter.array2Padding,
            defaultValue: [0, 0, 0, 0]
        }, {
            name: 'itemMargin',
            type: 'int',
            defaultValue: 0
        }]
    });



}