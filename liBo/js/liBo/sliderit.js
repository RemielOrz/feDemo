// 方法工具
var u = {};

// Math.round
u.round = Math.round;
// Math.abs
u.abs = Math.abs;
// Math.cos
u.cos = Math.cos;

// 带前缀的特殊类名
u.classSet = {
    wrapper: '.slider-wrap',
    inner: '.slider-inner',
    item: '.slider-item'
};

// 事件名后缀
u.eventAfterFixed = '.slider';

// requestAnimationFramework 的id
u.id=0;

//    封装requestAnimationFramework
u.rAF = function(){
    var prefixed = window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
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
        function(id){
            clearTimeout(id);
        };
    return function(id){
        var id = prefixed.apply(window, arguments);
        return id;
    }
}();

// 检测是否支持3d
u.detect3D = function(){
//        只在webkit浏览器下有效
    if( !! (window.WebKitCSSMatrix && 'm11' in new WebKitCSSMatrix())) {
        return true
    }
    return false;
};

// 检测浏览器环境，分两大类，一类是安卓原生webview环境，一类是ios和chrome
u.detectEnv = function(){
    var ua = navigator.userAgent;
    var uv = navigator.vendor;
    var isChrome = !! window.chrome;
    var isIOS = /iPhone|iPad/.test(ua) && /Apple Computer/.test(uv);

    return isChrome || isIOS ? true : false;
};

//    获取带有特定前缀的css属性，目前只检测-webkit和无前缀两种情况，name只支持首字母大写的字符串
u.getStyle = function(name){
    var prefix = 'webkit';
    var firstChar;
    var testStyle = document.createElement('div').style;
    if(testStyle[prefix+name]!=undefined) {
        return prefix+name;
    } else if(testStyle[name]!=undefined){
//        Z 的 ascii码是90
        if(name.charCodeAt(0) > 90) {
            return name
        } else {
            firstChar = name.slice(0, 1);
            name = name.slice(1, -1);
            name  = firstChar + name;
        }
        return name;
    } else {
        return false;
    }
};

// 兼容新旧设备的 transform 方法
u.transform = function(elem, distance, direction) {
    var propValue;
    var twoD = 'translate';
    var threeD = 'translate3d';
    var prop = u.getStyle('Transform');
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
                propValue = twoD+'X('+distance+'px'+')';
                break;
            case 'y':
                propValue = twoD+'Y('+distance+'px'+')';
                break;
            default :
                propValue = twoD+'X('+distance+'px'+')';
        }
    }
    elem.style[prop] = propValue;
};

// 获取坐标
u.getXY = function(evt) {
    var touches = evt.touches[0];
    return {
        x: touches.clientX,
        y: touches.clientY
    };
};

// 记录坐标
u.xySet = {
    old: {},
    cur: {}
};

var Slider = function(element, opt){
    this.option = this.setOption(opt);
    this.initElement(element);
    this.initLayout();
    this.initOffset();
    this.addEvent();

//    触发无限循环，以便一开始就可以向两个方向滑
    if(this.option.infinite) {
        this.initInfinite();
    }
};

// 设置配置
Slider.prototype.setOption = function(opt){
//    默认配置
    var defOpt = {
        infinite: false,
        direction: 'x',
        moveRadius: 20,
        duration: 0.6
    };
    var option = {};
    option = $.extend(option, defOpt, opt);
    option.direction = option.direction.toLowerCase();
//    和css的相同
    return option;
};

// 初始化元素
Slider.prototype.initElement = function(element){
    this.$wrapper = $(element);
    this.$inner = this.$wrapper.children(u.classSet.inner);
    this.$items = this.$inner.children(u.classSet.item);
    this.$itemsCache = this.$items.clone();
    this._length = this.$items.length;
    this._index = 0;
    this.$firstItem = this.$items.eq(0);
    this.$lastItem = this.$items.eq(-1);
//    确定刚才是否滑了一屏
    this._hasSlided = false;
//    是否在当前列表前面插入了列表
    this._isInsertBefore = false;
//    与上面一个相反
    this._isInsertAfter = false;
};

// 初始化offset
Slider.prototype.initOffset = function(){
    var dire = this.option.direction;
    var $item = this.$items.eq(0);
    if(dire === 'x'){
        this._unitOffset = $item.eq(0).width();
//        wrapper宽度
        this.$wrapper.width(this._unitOffset);
    } else if(dire === 'y') {
        this._unitOffset = $item.eq(0).height();
//    wrapper高度
        this.$wrapper.height(this._unitOffset);
    }

//    inneroffset总和
    this._totalOffset = this._unitOffset * this._length;
//    inner整体的offset
    this._innerOffset = 0;
//    开始的地方
    this._startOffset = 0;
//    每次touchmove的offset
    this._offset = 0;
};

// 初始化布局
Slider.prototype.initLayout = function(){
    var $inner = this.$inner;
    var ua = navigator.userAgent;
    var dire = this.option.direction;
    if(dire==='x') {
        $inner.addClass('is-horizon');
    }
//    消除不支持 font-size：0 的安卓的 inline-block 空隙
    if(ua.indexOf('Android 2.3') > -1) {
        $inner.addClass('is-horizon--oldAndroid');
    }
};

// 初始化无限循环
Slider.prototype.initInfinite = function(){
    var cloneFirst = this.$firstItem.clone();
    var cloneLast = this.$lastItem.clone();
    var $inner = this.$inner;
    var _this = this;

    cloneLast.insertBefore(this.$firstItem);
    cloneFirst.insertAfter(this.$lastItem);

    u.transform($inner[0], -this._unitOffset, this.option.direction);
    this._startOffset = -this._unitOffset;
    this._innerOffset = this._startOffset;
    $inner
        .on('infinite:jumpToStart', function(){
            _this._innerOffset = _this._startOffset;
            u.transform($inner[0], _this._innerOffset, _this.option.direction);
            _this._index = 0;
        })
        .on('infinite:jumpToEnd', function(){
            _this._innerOffset = -_this._totalOffset;
            u.transform($inner[0], _this._innerOffset, _this.option.direction);
            _this._index = _this._length-1;
        });
};

// 获取移动距离（offset）
Slider.prototype.getOffset = function(){
    var dire = this.option.direction;
    var unitOffset = this._unitOffset;
    this._offset = u.xySet.cur[dire] - u.xySet.old[dire];
    this._offset = u.round(this._offset * unitOffset / (u.abs(this._offset) + unitOffset));
};

// 绑定事件
Slider.prototype.addEvent = function() {
    var $inner = this.$inner;
    var inner = $inner[0];
    var _this = this;
    var infinite = this.option.infinite;

//    添加touch事件
    _this.touchEvent();

//    防止ios边缘弹起
    $(document).on('touchmove', function(evt){
        var offsetTop = _this.$wrapper.offset().top;
        var touchY = u.getXY(evt).y;
        if(touchY > offsetTop && touchY < offsetTop + _this.$wrapper.height()) {
            evt.preventDefault();
        }
    });
    $inner
        .on('webkitTransitionEnd transitionend' + u.eventAfterFixed, function() {
            _this.disableTransition();
            if(_this._hasSlided === false) {
                return;
            }
//            触发翻页后事件
            $inner.trigger('slide:after');
            if(infinite) {
                if(_this._index === _this._length) {
                    $inner.triggerHandler('infinite:jumpToStart');
                } else if(_this._index === -1) {
                    $inner.triggerHandler('infinite:jumpToEnd');
                }
            }
            setTimeout(function(){
                //            恢复touch事件
                _this.touchEvent();
            }, 100);
        });
};

// 删除transition
Slider.prototype.disableTransition = function() {
    var inner = this.$inner[0];
    inner.style['transition'] = 'none';
    inner.style['webkitTransition']= 'none';
};

// 加上transition
Slider.prototype.enableTransition = function(){
    var inner = this.$inner[0];
    inner.style['transition'] = 'all '+this.option.duration+'s ease';
    inner.style['webkitTransition'] = 'all '+this.option.duration+'s ease';
};

// 事件绑定
Slider.prototype.touchEvent = function(isRemove){
    var _this = this;
    var $inner = this.$inner;
    var infinite = this.option.infinite;

    if(isRemove === true) {
        $inner
            .off('touchstart', startHandler)
            .off('touchmove', moveHandler)
            .off('touchend', endHandler);
        return;
    }

//    touchstart handler
    var startHandler = function(evt){
        if(u.detectEnv()===false) {
            evt.preventDefault();
        }
        u.xySet.old = u.getXY(evt);
//            每次触摸都是新的开始，所以归0
        _this._offset = 0;
    };
//    touchmove handler
    var moveHandler = function(evt){
        u.xySet.cur = u.getXY(evt);
        _this.getOffset();
        _this.move('move');
    };
//    touchend handler
    var endHandler = function(evt){
//        移动前保证清除raf，以免这次transform被raf的那次覆盖
        u.cancelRAF(u.id);
        if(u.abs(_this._offset) >= _this.option.moveRadius) {
            !infinite &&
            ((_this._offset > 0 && _this._index === 0) ||
                (_this._offset < 0 && _this._index === _this._length-1)) ?
                _this.move('back') :
                _this.move('slide');
        } else {
            _this.move('back');
        }
    };
    $inner
        .on('touchstart'+ u.eventAfterFixed, startHandler)
        .on('touchmove'+ u.eventAfterFixed, moveHandler)
        .on('touchend'+ u.eventAfterFixed, endHandler)
};

// move方法(重要)
Slider.prototype.move = function(command){
    var $inner = this.$inner;
    var inner = $inner[0];
    var offset = this._offset;
    var innerOffset = this._innerOffset;
    var dire = this.option.direction;
    var curIndex = this._index;
    var endOffset;

    this.enableTransition();
    if(command === 'move') {
        u.cancelRAF(u.id);
        this.disableTransition();
        this._hasSlided = false;
        u.id = u.rAF(function(){
            u.transform(inner, offset+innerOffset, dire);
        });
    } else if(command === 'slide') {
        //        解除touch事件绑定，以免误操作
        this.touchEvent(true);

        //            触发翻页前事件
        $inner.trigger('slide:before');
        if(this._offset < 0) {
            endOffset = (++curIndex) * this._unitOffset * (-1) + this._startOffset;
        } else {
            endOffset = (--curIndex) * this._unitOffset * (-1) + this._startOffset;
        }
        this._index = curIndex;
        u.transform(inner, endOffset, dire);
        this._innerOffset = endOffset;
        this._hasSlided = true;
    } else if('back') {
        u.transform(inner, innerOffset, dire);
        this._hasSlided = false;
    }
};

// 基于move方法的上一页、下一页方法
Slider.prototype.prev = function(){
    this._offset = this._unitOffset;
    this.$inner.triggerHandler('touchend');
};

Slider.prototype.next = function(){
    this._offset = -this._unitOffset;
    this.$inner.triggerHandler('touchend');
};

// 跳到指定页数
Slider.prototype.go = function(index){
    var _this = this;
    var curIndex = this._index;
    var paramIndex = index;
    var slideDuration = this.option.duration*1000 + 150;
// 如果不是数字，尝试转换为数字
    if(isNaN(index)) {
        paramIndex = parseInt(paramIndex);
    }

    var go = function(){
        if(isNaN(paramIndex) || curIndex === paramIndex) {
            return;
        } else if(curIndex > paramIndex) {
            _this.prev();
            curIndex -= 1;
        } else if(curIndex < paramIndex) {
            _this.next();
            curIndex += 1;
        }
        setTimeout(go, slideDuration);
    };
    go();
};

$.fn.slider = function(opt, index) {
    var action;
    var $this = $(this);
    var func;
    var pageIndex = index;
    $this.each(function(index, element) {
        if(typeof opt === 'object'){
            element._slider = new Slider(element, opt);
        } else if(typeof  opt === 'string') {
            action = opt;
            func = element._slider[action];
            typeof func === 'function' && element._slider[action](pageIndex);
        }
    });
};