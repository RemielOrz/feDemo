(function(){
//    工具方法集合
    var u= {};
//    构造函数
    var Roll;

//    取绝对值函数
    u.abs = Math.abs;

//    自动添加前缀
    u.addPrefix = function(className) {
        return '.roll-'+className;
    };

//    封装requestAnimationFramework
    u.rAF = function(){
        var prefixed = window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function( callback ){
                var id = window.setTimeout(callback, 1000 / 60);
                return id;
            };
        return function(){
            var id = prefixed.apply(window, arguments);
            return id;
        }
    }();

    u.cancelRAF = function(){
        var prefixed = window.cancelAnimationFrame ||
            window.webkitCancelRequestAnimationFrame ||
            window.mozCancelRequestAnimationFrame ||
            window.oCancelRequestAnimationFrame ||
            window.msCancelRequestAnimationFrame ||
            function(){
                window.clearTimeout(arguments[0]);
            };
        return function(){
            prefixed.apply(window, arguments);
        }
    }();

//    获取带有特定前缀的css属性，目前只检测-webkit和无前缀两种情况，name只支持首字母大写的字符串
    u.getStyle = function(name){
        var prefix = 'webkit';
        var testStyle = document.createElement('div').style;
        if(testStyle[prefix+name]!=undefined) {
            return prefix+name;
        } else if(testStyle[name]!=undefined){
            return name.toLowerCase();
        } else {
            return false;
        }
    };

//    检测是否支持3d
    u.detect3D = function(){
//        只在webkit浏览器下有效
        if( !! (window.WebKitCSSMatrix && 'm11' in new WebKitCSSMatrix())) {
            return true
        }

        return false;
    };

//    移动函数
    u.translate = function(elem, distance, direction){
        var propValue;
        var twoD = 'translate';
        var threeD = 'translate3d';
        var prop = u.getStyle('Transform');

        direction ? direction.toLowerCase() : direction='x';

//        判断方向
        if(u.detect3D()) {
            switch (direction){
                case 'x':
                    propValue = threeD+'('+ distance+'px, 0, 0)';
                    break;
                case 'y':
                    propValue = threeD+'(0,'+distance+'px, 0)';
                    break;
                default :
                    propValue = threeD+'('+ distance+'px, 0, 0)';
            }
        } else {
            switch (direction) {
                case 'x':
                    propValue = twoD+'X('+distance+')';
                    break;
                case 'y':
                    propValue = twoD+'Y('+distance+')';
                    break;
                default :
                    propValue = twoD+'X('+distance+')';
            }
        }

        elem = elem[0];
        elem.style[prop] = propValue;
    };

//    获取touch点的clientX和clientY
    u.getChangedTouches = function(e, direction) {
        var touches = e.changedTouches[0];
          if(direction === 'x') {
              return touches.clientX;
          } else if(direction === 'y') {
              return touches.clientY;
          }
    };

//    构造函数
    Roll = function(elem, config){
        this.setConfig(config);
        this.getDOM(elem);
        this.initStyle();
        this.getWidthAndHeight();
        this.getOffset();
        this.bindEvent();
        this.setStartPoint();
        this.roll();
    };

//    配置
    Roll.prototype.setConfig = function(conf){
        var config = {};
        var direction;
        var speed;
        var defaultConfig = {
            infinite: false,
            direction: 'x',
            speed: 1,
            reverse: false,
//            小于0就从translate值小于0时那一侧出来
//            等于0，从原位出发
//            大于0，和小于0相反
            start: -1
        };
        config = $.extend(config, defaultConfig, conf);
        this.config = config;
        direction = config.direction.toLowerCase();
        speed = config.speed;
//        只支持xy
        if(direction!=='x' && direction!=='y') {
            direction = 'x';
        }
        if(speed > 10){
            speed = 10;
        } else if(speed <0.5){
            speed = 0.5;
        } else {
            speed = config.speed;
        }
        this.config.direction = direction;
        this.config.speed = speed;
    };

//    初始化dom树主体
    Roll.prototype.getDOM = function(elem){
        var c = u.addPrefix;
        this.rollRoot = elem;
        this.rollBody = elem.children(c('body'));
    };

//    初始化样式
    Roll.prototype.initStyle = function(){
        this.rollRoot.css({
            'position': 'relative',
            'overflow': 'hidden'
        });
    };

//    绑定事件
    Roll.prototype.bindEvent = function(){
        var _this = this;
        var direction = this.config.direction;
        var oldTouch;
        var newTouch;
        this.rollRoot
            .on('touchstart', function(e){
                e.preventDefault();
                oldTouch = u.getChangedTouches(e, direction);
                _this.stop();
            })
            .on('touchmove', function(e){
                newTouch = u.getChangedTouches(e, direction);
                _this.currentRoll += (newTouch - oldTouch);
                u.translate(_this.rollBody, _this.currentRoll, direction);
                oldTouch = newTouch;
            })
            .on('touchend', function(){
                _this.recover();
            });
    };

//    获取滚动距离
    Roll.prototype.getOffset = function(){
        var direction = this.config.direction.toLowerCase();

        if(direction==='x'){
            this.rollIn = -this.rollBody[0].clientWidth;
            this.rollOut = this.rollRoot[0].clientWidth;
        } else if(direction === 'y') {
            this.rollIn = -this.rollBody[0].clientHeight;
            this.rollOut = this.rollRoot[0].clientHeight;
        } else {
            this.rollIn = -this.rollBody[0].clientWidth;
            this.rollOut = this.rollRoot[0].clientWidth;
        }
    };

//    获取长宽
    Roll.prototype.getWidthAndHeight = function(){
//        获取主体的宽度
        this.clientWidth = this.rollBody[0].clientWidth;
        this.clientHeight = this.rollBody[0].clientHeight;
    };

//    停止滚动
    Roll.prototype.stop = function(){
        u.cancelRAF(this.rAF_ID);
    };

//    继续滚动
    Roll.prototype.recover = function(){
        this.stop();
        this.roll();
    };

//    重置滚动
    Roll.prototype.reset = function(){
        var body = this.rollBody;
        this.stop();
        this.currentRoll = this.startPoint;
        u.translate(body, this.startPoint, this.config.direction);
        this.roll();
    };

//    动作中转站
    Roll.prototype.action = function(action){
        switch (action) {
            case 'stop':
                this.stop();
                break;
            case 'recover':
                this.recover();
                break;
            case 'reset':
                this.reset();
                break;
        }
    };

//    获取滚动的起点
    Roll.prototype.setStartPoint = function(){
        var start = this.config.start;
        this.startPoint = start <0 ? this.rollIn : start > 0 ? this.rollOut : 0;
        this.currentRoll = this.startPoint;
        u.translate(this.rollBody, this.currentRoll, this.config.direction);
    };

//    滚动
    Roll.prototype.roll = function(){
        var self = this;
        var body = self.rollBody;
        var isReverse = self.config.reverse;
        var isInfinite = self.config.infinite;
        function roll() {
            if(isReverse !== true) {
                self.currentRoll -= self.config.speed;
            } else {
                self.currentRoll += self.config.speed;
            }
            u.translate(body, self.currentRoll, self.config.direction);
            if(self.currentRoll <= self.rollIn) {
                self.currentRoll = self.rollOut;
            } else if(self.currentRoll >= self.rollOut) {
                self.currentRoll = self.rollIn;
            }
            if(isInfinite === false) {
                if(u.abs(self.currentRoll)!==self.config.speed && u.abs(self.currentRoll) <= self.config.speed) {
                    u.translate(body, 0, self.config.direction);
                    u.cancelRAF(self.rAF_ID);
                    return;
                }
            }
            self.rAF_ID = u.rAF(roll);
        }
        roll();
    };

//    导出到zepto
    $.fn.roll = function(config) {
        var action;
        var self = this;
        self.each(function(index, elem){
            elem = self.eq(index);
            if(typeof config === 'object' && !elem[0]._roll) {
                elem[0]._roll = new Roll(elem, config);
                elem.data('rollIndex', index);
            } else if(typeof config === 'string') {
                action = config;
                elem[0]._roll.action(action);
            }
        });
        return this;
    }
})();