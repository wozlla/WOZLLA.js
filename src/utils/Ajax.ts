module WOZLLA.utils {

    function applyProperties(target, source) {
        for(var i in source) {
            if(typeof target[i] === 'undefined') {
                target[i] = source[i];
            }
        }
        return target;
    }

    var contentParser = {
        'json' : function(xhr) {
            return JSON.parse(xhr.responseText);
        },
        'arraybuffer' : function(xhr) {
            return xhr.response;
        }
    };

    var empty = function() {};

    /**
     * @class WOZLLA.utils.Ajax
     */
    export class Ajax {

        /**
         * internal ajax error code when timeout
         * @property ERROR_TIMEOUT
         * @static
         * @readonly
         */
        public static ERROR_TIMEOUT = 1;

        /**
         * internal ajax error code when server error
         * @property ERROR_SERVER
         * @static
         * @readonly
         */
        public static ERROR_SERVER = 2;

        /**
         * send a request with options
         * @param {object} options
         * @param {boolean} options.async
         * @param {string} options.method GET/POST
         * @param {string} options.contentType text/json/xml
         * @param {string} options.responseType text/plain,text/javascript,text/css,arraybuffer
         * @param {number} [options.timeout=30000]
         * @param {function} options.success call when ajax request successfully
         * @param {function} options.error call when ajax request error
         */
        public static request(options:any={}) {
            var xhr;
            var timeoutId;
            options = applyProperties(options, {
                url: '',
                async: true,
                method: 'GET',
                dataType: 'text',
                responseType: 'text/plain',
                timeout: 30000,
                success: empty,
                error: empty,
                withCredentials: false
            });

            xhr = new XMLHttpRequest();
            xhr.responseType = options.responseType;
            xhr.onreadystatechange = () => {
                var parser;
                if (xhr.readyState === 4) {
                    xhr.onreadystatechange = empty;
                    clearTimeout(timeoutId);
                    parser = contentParser[options.dataType] || function() {
                        return xhr.responseText;
                    };
                    options.success(parser(xhr));
                }
            };
            xhr.open(options.method, options.url, options.async);
            xhr.withCredentials = options.withCredentials;
            timeoutId = setTimeout(function() {
                xhr.onreadystatechange = empty;
                xhr.abort();
                options.error({
                    code: Ajax.ERROR_TIMEOUT,
                    message: 'request timeout'
                });
            }, options.timeout);
            xhr.send();
        }

    }

}