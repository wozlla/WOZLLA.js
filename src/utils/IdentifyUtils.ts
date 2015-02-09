module WOZLLA.utils {

    export class IdentifyUtils {

        private static UID_gen = 10000;

        public static genUID():string {
            return (IdentifyUtils.UID_gen++) + '';
        }

        public static UUID():string {
            var d = new Date().getTime();
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
        }

    }

}