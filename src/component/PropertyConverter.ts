module WOZLLA.component {

    export class PropertyConverter {

        public static array2rect(arr:Array<number>):WOZLLA.math.Rectangle {
            return new WOZLLA.math.Rectangle(arr[0], arr[1], arr[2], arr[3]);
        }

        public static array2circle(arr:Array<number>):WOZLLA.math.Circle {
            return new WOZLLA.math.Circle(arr[0], arr[1], arr[2]);
        }

        public static json2TextStyle(json:any):TextStyle {
            var style = new TextStyle();
            for(var i in json) {
                style[i] = json[i];
            }
            return style;
        }

        public static array2Padding(arr:Array<number>):WOZLLA.layout.Padding {
            return new WOZLLA.layout.Padding(arr[0], arr[1], arr[2], arr[3]);
        }

        public static array2Margin(arr:Array<number>):WOZLLA.layout.Margin {
            return new WOZLLA.layout.Margin(arr[0], arr[1], arr[2], arr[3]);
        }
    }

}