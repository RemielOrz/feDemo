(function(){
    var config = null;
    var callback;
    var process;
    var get = function(prop) {
        return config[prop];
    };
    var u = {};

//    copy from https://github.com/sofish/pen/blob/master/src/pen.js
    u.is = function(obj, type){
        return Object.prototype.toString.call(obj).slice(8, -1) === type;
    };
    u.copy = function(input, output){
        for(var key in input) {
            if(input.hasOwnProperty(key)) {
                var value = input[key];
                output[key] = u.is(value, 'Object') ? u.copy(value, {}) : u.is(value, 'Array') ? u.copy(val, []) : value;
            }
        }
        return output;
    };

    var set = function(prop, value) {
        if(u.is(prop, 'String')) {
            if(config !== null) {
                config[prop] = value;
            } else {
                config = {};
                config[prop] = value;
            }
        } else if(u.is(prop, 'Object')) {
            if(config === null) {
                config = prop;
            } else {
                config = u.copy(prop, config);
            }
        }
    };
    var setCallBack = function(callBackFunc) {
        callback = callBackFunc;
    };
    var setProcess = function(processFunc){
        process = processFunc;
    };

    document.addEventListener('WeixinJSBridgeReady', function(){
        WeixinJSBridge.on('menu:share:appmessage', function(){
            process && process();
            WeixinJSBridge.invoke('sendAppMessage', config, function(res){
                callback();
            });
        });
        WeixinJSBridge.on('menu:share:timeline', function(){
            process && process();
            WeixinJSBridge.invoke('shareTimeline', config, function(res){
                callback();
            });
        });
    });

    var wxShare = {
        get: get,
        set: set,
        setCallBack: setCallBack,
        setProcess: setProcess
    };
    window.OE = window.OE || {};
    window.OE.wxShare = wxShare;
})();