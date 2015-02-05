/// <reference path="PropertyConverter.ts"/>
module WOZLLA.component {

    export class PropertySnip {

        public static createRect(propertyName) {
            return {
                name: propertyName,
                type: 'rect',
                convert: PropertyConverter.array2rect,
                defaultValue: [0, 0, 100, 100]
            };
        }

        public static createCircle(propertyName) {
            return {
                name: propertyName,
                type: 'circle',
                convert: PropertyConverter.array2circle,
                defaultValue: [0, 0, 50]
            };
        }

        public static createSpriteFrame(propertName, fromSpriteAtlas='spriteAtlasSrc') {
            return {
                name: propertName,
                type: 'spriteFrame',
                defaultValue: '',
                data: {
                    fromSpriteAtlas: fromSpriteAtlas
                }
            };
        }

    }

}