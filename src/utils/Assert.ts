module WOZLLA {

    export class Assert {

        public static DEFAULT_MESSAGE = 'Assertion Fail';

        public static isTrue(test:any, msg=Assert.DEFAULT_MESSAGE) {
            if(test !== true) {
                throw new Error(msg);
            }
        }

        public static isFalse(test:any, msg=Assert.DEFAULT_MESSAGE) {
            if(test !== false) {
                throw new Error(msg);
            }
        }

        public static isTypeof(test:any, type:string, msg=Assert.DEFAULT_MESSAGE) {
            if(typeof test !== type) {
                throw new Error(msg);
            }
        }

        public static isNotTypeof(test:any, type:string, msg=Assert.DEFAULT_MESSAGE) {
            if(typeof test === type) {
                throw new Error(msg);
            }
        }

        public static isString(test:any, msg=Assert.DEFAULT_MESSAGE) {
            Assert.isTypeof(test, 'string', msg);
        }

        public static isObject(test:any, msg=Assert.DEFAULT_MESSAGE) {
            Assert.isTypeof(test, 'object', msg);
        }

        public static isUndefined(test:any, msg=Assert.DEFAULT_MESSAGE) {
            Assert.isTypeof(test, 'undefined', msg);
        }

        public static isNotUndefined(test:any, msg=Assert.DEFAULT_MESSAGE) {
            Assert.isNotTypeof(test, 'undefined', msg);
        }

        public static isFunction(test:any, msg=Assert.DEFAULT_MESSAGE) {
            Assert.isTypeof(test, 'function', msg);
        }

    }

}