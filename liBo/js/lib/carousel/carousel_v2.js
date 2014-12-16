var Mobify = window.Mobify = window.Mobify || {};
Mobify.$ = Mobify.$ || window.Zepto || window.jQuery;
Mobify.UI = Mobify.UI || { classPrefix: 'm-' };

(function($, document) {
    $.support = $.support || {};

    $.extend($.support, {
        'touch': 'ontouchend' in document
    });

})(Mobify.$, document);



/**
 @module Holds common functions relating to UI.
 */
Mobify.UI.Utils = (function($) {
    var exports = {}
        , has = $.support;

    /**
     Events (either touch or mouse)
     */
    exports.events = (has.touch)
        ? {down: 'touchstart', move: 'touchmove', up: 'touchend'}
        : {down: 'mousedown', move: 'mousemove', up: 'mouseup'};

    /**
     Returns the position of a mouse or touch event in (x, y)
     @function
     @param {Event} touch or mouse event
     @returns {Object} X and Y coordinates
     */
    exports.getCursorPosition = (has.touch)
        ? function(e) {e = e.originalEvent || e; return {x: e.touches[0].clientX, y: e.touches[0].clientY}}
        : function(e) {return {x: e.clientX, y: e.clientY}};


    /**
     Returns prefix property for current browser.
     @param {String} CSS Property Name
     @return {String} Detected CSS Property Name
     */
    exports.getProperty = function(name) {
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

    $.extend(has, {
        'transform': !! (exports.getProperty('Transform'))
        , 'transform3d': !! (window.WebKitCSSMatrix && 'm11' in new WebKitCSSMatrix())
    });

    // translateX(element, delta)
    // Moves the element by delta (px)
    var transformProperty = exports.getProperty('Transform');
    if (has.transform3d) {
        exports.translateX = function(element, delta) {
            if (typeof delta == 'number') delta = delta + 'px';
            element.style[transformProperty] = 'translate3d(' + delta  + ',0,0)';
        };
        exports.translateY = function(element, delta) {
            if (typeof delta == 'number') delta = delta + 'px';
            element.style[transformProperty] = 'translate3d(0,' + delta  + ',0)';
        };
    } else if (has.transform) {
        exports.translateX = function(element, delta) {
            if (typeof delta == 'number') delta = delta + 'px';
            element.style[transformProperty] = 'translate(' + delta  + ',0)';
        };
        exports.translateY = function(element, delta) {
            if (typeof delta == 'number') delta = delta + 'px';
            element.style[transformProperty] = 'translate(0,' + delta  + ')';
        };
    } else {
        exports.translateX = function(element, delta) {
            if (typeof delta == 'number') delta = delta + 'px';
            element.style.left = delta;
        };
        exports.translateY = function(element, delta) {
            if (typeof delta == 'number') delta = delta + 'px';
            element.style.top = delta;
        };
    }

    // setTransitions
    var transitionProperty = exports.getProperty('Transition')
        , durationProperty = exports.getProperty('TransitionDuration');

    exports.setTransitions = function(element, enable, sec) {
        if (enable) {
            element.style[durationProperty] = sec ? (isNaN(sec) ? '' : sec + 's') : '';
        } else {
            element.style[durationProperty] = '0s';
        }
    }


    // Request Animation Frame
    // courtesy of @paul_irish
    exports.requestAnimationFrame = (function() {
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

    return exports;

})(Mobify.$);

Mobify.UI.Carousel = (function($, Utils) {
    var defaults = {
            dragRadius: 1//10
            , moveRadius: 20//20
            , classPrefix: undefined
            , classNames: {
                outer: 'carousel'
                , inner: 'carousel-inner'
                , transformY: 'carousel-y'
                , scaled: 'scaled'
                , item: 'item'
                , center: 'center'
                , touch: 'has-touch'
                , dragging: 'dragging'
                , active: 'active'
            }
            , axis: 'X'
        }
        , has = $.support;

    // Constructor
    var Carousel = function(element, options) {
        this.setOptions(options);
        this.initElements(element);
        this.initOffsets();
        this.initAnimation();
        this.bind();
    };

    // Expose Dfaults
    Carousel.defaults = defaults;

    Carousel.prototype.setOptions = function(opts) {
        var options = this.options || $.extend({}, defaults, opts);

        /* classNames requires a deep copy */
        options.classNames = $.extend({}, options.classNames, opts.classNames || {});

        /* By default, classPrefix is `undefined`, which means to use the Mobify-wide level prefix */
        options.classPrefix = options.classPrefix || Mobify.UI.classPrefix;

        if(options.axis !== "Y") options.axis = "X";

        this.options = options;

    };

    Carousel.prototype.initElements = function(element) {
        this._index = 1;

        this.element = element;
        this.$element = $(element);
        this.$inner = this.$element.find('.' + this._getClass('inner'));
        this.$items = this.$inner.children();

        this.$start = this.$items.eq(0);
        this.$sec = this.$items.eq(1);
        this.$current = this.$items.eq(this._index);

        this._length = this.$items.length;
        this._alignment = this.$element.hasClass(this._getClass('center')) ? 0.5 : 0;

        this._width = this.$element.width();

        this.options.axis === "Y" && this.$element.addClass(this._getClass('transformY'));

        this.options.scaled && this.$element.addClass(this._getClass('scaled'));
    };

    Carousel.prototype.initOffsets = function() {
        this._offset = 0;
        this._offsetDrag = 0;
    }

    Carousel.prototype.initAnimation = function() {
        this.animating = false;
        this.dragging = false;
        this._needsUpdate = false;
        this._enableAnimation();
    };


    Carousel.prototype._getClass = function(id) {
        return this.options.classPrefix + this.options.classNames[id];
    };


    Carousel.prototype._enableAnimation = function() {
        if (this.animating) {
            return;
        }

        Utils.setTransitions(this.$inner[0], true, this.options.duration);
        this.$inner.removeClass(this._getClass('dragging'));
        this.animating = true;
    }

    Carousel.prototype._disableAnimation = function() {
        if (!this.animating) {
            return;
        }

        Utils.setTransitions(this.$inner[0], false);
        this.$inner.addClass(this._getClass('dragging'));
        this.animating = false;
    }

    Carousel.prototype.update = function(callback) {
        /* We throttle calls to the real `_update` for efficiency */
        if (this._needsUpdate) {
            return;
        }

        var self = this;
        this._needsUpdate = true;
        Utils.requestAnimationFrame(function() {
            self._update(callback);
        });
    }

    Carousel.prototype._update = function(callback) {
        if (!this._needsUpdate) {
            return;
        }

        var x = Math.round(this._offset + this._offsetDrag);

        this.options.axis === "Y"
            ? Utils.translateY(this.$inner[0], x)
            : Utils.translateX(this.$inner[0], x);

        this._needsUpdate = false;
        typeof callback === 'function' && callback.call(this)
    }

    Carousel.prototype.bind = function() {
        var abs = Math.abs
            , dragging = false
            , canceledX = false
            , canceledY = false
            , dragRadius = this.options.dragRadius
            , xy
            , dx
            , dy
            , dragThresholdMet
            , dragThresholdMetX
            , dragThresholdMetY
            , self = this
            , $element = this.$element
            , $inner = this.$inner
            , opts = this.options
            , dragLimit = this.$element.width()
            , lockLeft = false
            , lockRight = false

            , dragStart = false;


        var axis = self.options.axis;

        function start(e) {
            e.preventDefault();
            if (!has.touch) e.preventDefault();

            dragging = true;
            canceledX = false;
            canceledY = false;

            dragStart = true;

            xy = Utils.getCursorPosition(e);
            dx = 0;
            dy = 0;
            dragThresholdMet = false;
            dragThresholdMetX = false;
            dragThresholdMetY = false;

            // Disable smooth transitions
            self._disableAnimation();

            lockLeft = self._index == 1;
            lockRight = self._index == self._length;
        }

        function drag(e) {
            e.preventDefault();
            if (!dragging || (canceledX && canceledY)) return;

            var newXY = Utils.getCursorPosition(e);
            dx = xy.x - newXY.x;
            dy = xy.y - newXY.y;

            if(dragThresholdMet){
                e.preventDefault();
                //已判断运动轴
                if (dragThresholdMetX) {
                    canceledY = true;
                    //e.preventDefault();

                    if (lockLeft && (dx < 0)) {
                        dx = dx * (-dragLimit)/(dx - dragLimit);
                    } else if (lockRight && (dx > 0)) {
                        dx = dx * (dragLimit)/(dx + dragLimit);
                    }
                    if(axis === "X"){
                        self._offsetDrag = -dx;
                        self.options.dragging && self.update();
                    }
                } else if (dragThresholdMetY) {
                    canceledX = true;
                    //e.preventDefault();

                    if (lockLeft && (dy < 0)) {
                        dy = dy * (-dragLimit)/(dy - dragLimit);
                    } else if (lockRight && (dy > 0)) {
                        dy = dy * (dragLimit)/(dy + dragLimit);
                    }
                    if(axis === "Y"){
                        self._offsetDrag = -dy;
                        self.options.dragging && self.update();
                    }
                }else{
                    //canceledX = true;
                    //canceledY = true;
                }
            }else{
                //初始化运动轴
                if (axis === 'X' && abs(dx) > abs(dy) && (abs(dx) > dragRadius)) {
                    dragThresholdMetX = dragThresholdMet = true;
                    canceledY = true;
                    e.preventDefault();

                    if (lockLeft && (dx < 0)) {
                        dx = dx * (-dragLimit)/(dx - dragLimit);
                    } else if (lockRight && (dx > 0)) {
                        dx = dx * (dragLimit)/(dx + dragLimit);
                    }

                    self._offsetDrag = -dx;
                    self.options.dragging && self.update();
                } else if (axis === 'Y' && abs(dy) >= abs(dx) && abs(dy) > dragRadius) {
                    dragThresholdMetY = dragThresholdMet = true;
                    canceledX = true;
                    e.preventDefault();

                    if (lockLeft && (dy < 0)) {
                        dy = dy * (-dragLimit)/(dy - dragLimit);
                    } else if (lockRight && (dy > 0)) {
                        dy = dy * (dragLimit)/(dy + dragLimit);
                    }

                    self._offsetDrag = -dy;
                    self.options.dragging && self.update();
                }else{
                    canceledX = true;
                    canceledY = true;
                    console.log('drag cancel xxxxxx YYYYYYY')
                }
            }
        }

        function end(e) {
            e.preventDefault();
            if (!dragging) {
                return;
            }

            dragging = false;

            self._enableAnimation();

            if (!canceledX && abs(dx) > opts.moveRadius) {
                // Move to the next slide if necessary
                if(axis === "X"){
                    if (dx > 0 ) {
                        self.next();
                    } else {
                        self.prev();
                    }
                }
            } else if( !canceledY && abs(dy) > opts.moveRadius){
                // Move to the next slide if necessary
                if(axis === "Y") {
                    if (dy > 0) {
                        self.next();
                    } else {
                        self.prev();
                    }
                }
            } else {
                // Reset back to regular position
                self._offsetDrag = 0;
                self.update(function(){

                });
            }

        }

        function click(e) {
            if (dragThresholdMet) e.preventDefault();
        }

        $inner
            .on(Utils.events.down + '.carousel', start)
            .on(Utils.events.move + '.carousel', drag)
            .on(Utils.events.up + '.carousel', end)
            .on('click.carousel', click)
            .on('mouseout.carousel', end);

        $element.on('click', '[data-slide]', function(e){
            e.preventDefault();
            var action = $(this).attr('data-slide')
                , index = parseInt(action, 10);

            if (isNaN(index)) {
                self[action]();
            } else {
                self.move(index);
            }
        });

        $element.on('afterSlide', function(e, previousSlide, nextSlide) {
            self.$items.eq(previousSlide - 1).removeClass(self._getClass('active'));
            self.$items.eq(nextSlide - 1).addClass(self._getClass('active'));

            self.$element.find('[data-slide=\'' + previousSlide + '\']').removeClass(self._getClass('active'));
            self.$element.find('[data-slide=\'' + nextSlide + '\']').addClass(self._getClass('active'));
        });


        $element.trigger('beforeSlide', [1, 1]);
        $element.trigger('afterSlide', [1, 1]);

        self.update();

    };

    Carousel.prototype.unbind = function() {
        this.$inner.off();
    }

    Carousel.prototype.destroy = function() {
        this.unbind();
        this.$element.trigger('destroy');
        this.$element.remove();

        // Cleanup
        this.$element = null;
        this.$inner = null;
        this.$start = null;
        this.$current = null;
    }

    Carousel.prototype.move = function(newIndex, opts) {
        var $element = this.$element
            , $inner = this.$inner
            , $items = this.$items
            , $start = this.$start
            , $current = this.$current
            , length = this._length
            , index = this.__currentIndex = this._index
            , self = this;

        opts = opts || {type:'move'};

        // Bound Values between [1, length];
        if (newIndex < 1) {
            newIndex = 1;
        } else if (newIndex > this._length) {
            newIndex = length;
        }


        // Bail out early if no move is necessary.
        if (newIndex == this._index) {
            //return; // Return Type?
        }

        // Trigger beforeSlide event
        $element.trigger('beforeSlide', [index, newIndex]);


        // Index must be decremented to convert between 1- and 0-based indexing.
        this.$current = $current = $items.eq(newIndex - 1);

        /*var currentOffset = $current.prop('offsetLeft') + $current.prop('clientWidth') * this._alignment
            , startOffset = $start.prop('offsetLeft') + $start.prop('clientWidth') * this._alignment*/

        var currentOffset = this.options.axis == 'Y'
                ? $current.prop('offsetTop') + $current.prop('clientHeight') * this._alignment
                : $current.prop('offsetLeft') + $current.prop('clientWidth') * this._alignment
            , startOffset = this.options.axis == 'Y'
                ? $start.prop('offsetTop') + $start.prop('clientHeight') * this._alignment
                : $start.prop('offsetLeft') + $start.prop('clientWidth') * this._alignment

        //var transitionOffset = -(currentOffset - startOffset);
        //this._offset = transitionOffset;
        this._offset = -(currentOffset - startOffset);


        this._offsetDrag = 0;
        this.update(function(){
            this.__currentIndex = this._index;
        });
        this._index = newIndex;
        // Trigger afterSlide event
        $element.trigger('afterSlide', [index, newIndex]);
    };

    Carousel.prototype.next = function(opt) {
        var initOptions = $.extend({type:'prev'}, opt);
        this.move(this._index + 1,initOptions);
    };

    Carousel.prototype.prev = function(opt) {
        var initOptions = $.extend({type:'next'}, opt);
        this.move(this._index - 1,initOptions);
    };

    return Carousel;

})(Mobify.$, Mobify.UI.Utils);



(function($) {
    /**
     jQuery interface to set up a carousel


     @param {String} [action] Action to perform. When no action is passed, the carousel is simply initialized.
     @param {Object} [options] Options passed to the action.
     */
    $.fn.carousel = function (action, options) {
        var initOptions = $.extend({}, $.fn.carousel.defaults);

        // Handle different calling conventions
        if (typeof action == 'object') {
            //initOptions = $(initOptions, action);
            initOptions = $.extend(action, initOptions);
            options = null;
            action = null;
        }

        this.each(function () {
            var $this = $(this)
                , carousel = this._carousel;


            if (!carousel) {
                carousel = new Mobify.UI.Carousel(this, initOptions);
            }

            if (action) {
                carousel[action](options);

                if (action === 'destroy') {
                    carousel = null;
                }
            }

            this._carousel = carousel;
        })

        return this;
    };

    $.fn.carousel.defaults = {};

})(Mobify.$);
