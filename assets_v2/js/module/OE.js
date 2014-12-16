/*!
 * Created By remiel.
 * Date: 14-9-26
 * Time: 上午11:37
 */
define(['$'],function($){
    console.log("module:OE");

    var utils = {};
    utils.support = {'touch': 'ontouchend' in document};
    utils.events = (utils.support.touch)
        ? {down: 'touchstart', move: 'touchmove', up: 'touchend', click: 'tap'}
        : {down: 'mousedown', move: 'mousemove', up: 'mouseup', click: 'click'};
    if($.os.phone || $.os.tablet){
        //utils.events.click = 'tap';
    }else{
        utils.events.click = 'click';
    }
    /*utils.events = ($.os.phone || $.os.tablet)
        ? {down: 'touchstart', move: 'touchmove', up: 'touchend'}
        : {down: 'mousedown', move: 'mousemove', up: 'mouseup'};*/

    /**
     Returns the position of a mouse or touch event in (x, y)
     @function
     @param {Event} touch or mouse event
     @returns {Object} X and Y coordinates
     */
    utils.getCursorPosition = (utils.support.touch)
        ? function(e) {e = e.originalEvent || e; return {x: e.touches[0] ? e.touches[0].clientX : e.changedTouches[0].clientX, y: e.touches[0] ? e.touches[0].clientY : e.changedTouches[0].clientY}}
        : function(e) {return {x: e.clientX, y: e.clientY}};

    utils.getProperty = function(name) {
        var prefixes = ['Webkit', 'Moz', 'O', 'ms', '']
            , testStyle = document.createElement('div').style;

        for (var i = 0; i < prefixes.length; ++i) {
            if (testStyle[prefixes[i] + name] !== undefined) {
                return prefixes[i] + name;
            }
        }

        // Not Supported
        return;
    };

    $.extend(utils.support, {
        'transform': !! (utils.getProperty('Transform'))
        , 'transform3d': !! (window.WebKitCSSMatrix && 'm11' in new WebKitCSSMatrix())
    });


    utils.requestAnimationFrame = (function() {
        var prefixed = (window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            });

        var requestAnimationFrame = function() {
            prefixed.apply(window, arguments);
        };

        return requestAnimationFrame;
    })();

    utils.renderTpl = function(str,data) {
        return str
            .replace(/{(.*?)}/igm,function($,$1) {
                return typeof data[$1] !== "undefined" ? data[$1] : "";
            });
    };


    utils.date = {
        parse: function(s) {
            // Parse a partial RFC 3339 string into a Date.
            var m;
            if ((m = s.match(/^(\d{4,4})-(\d{2,2})-(\d{2,2})$/))) {
                return new Date(m[1], m[2] - 1, m[3]);
            } else {
                return null;
            }
        }
        , format: function(date) {
            // Format a Date into a string as specified by RFC 3339.
            var month = (date.getMonth() + 1).toString(),
                dom = date.getDate().toString();
            if (month.length === 1) {
                month = '0' + month;
            }
            if (dom.length === 1) {
                dom = '0' + dom;
            }
            return date.getFullYear() + '-' + month + "-" + dom;
        }
    };
    //console.log
    var _log = function () {
        if($.browser.msie){
            if(typeof console != 'undefined' && typeof arguments != 'undefined'){
                var len = arguments.length;
                for(var i=0; i<len; i++){
                    console.log(arguments[i]);
                }
            }
        }
        else if (window.console && window.console.log) {
            console.log.apply(window.console, arguments);
        }
    };

    return {
        utils: utils,
        ui:{},
        $:$,
        log: _log,
        BASE_URL: location.port === "3000" ? "" : "./assets"
    }
});