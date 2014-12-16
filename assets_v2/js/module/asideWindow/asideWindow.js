/*!
 * Created By remiel.
 * Date: 14-10-15
 * Time: 上午9:58
 */
define(["OE","ITouchMove"], function(OE,ITouchMove){
    console.log("module:AsideWindow");

    var $ = OE.$
        ,u = OE.utils;


    function AsideWindow(options){

        this.options = $.extend({},this.defaults,options);
        this.events = {};
        this.init();
    }

    AsideWindow.prototype = {
        defaults:{
            class: ''
            ,dir:'left'
            //,position:'80%'
            //,speed:.5
            ,setContent: function (){
                console.log('setContent');

            }
            ,onSetContentEnd: function(){
                console.log('onSetContentEnd');
            }
            ,$triggerEl:null
        }
        ,init: function(){
            this.isActive = 0;
            this.setDir();
            this.createElement();
            this.bindTargetEvt();
        }

        ,createElement: function(){
            var $win = $('.ui-aside-win');
            if($win.length){
                this.$el = $win;
                this.$mask = $('.ui-aside-win__mask');
                this.$inner = $('.ui-aside-win__inner',$win);
                this.$icon = $('.ui-aside-win__icon',$win);
                return;
            }
            this.$mask = $('<div></div>')
                .addClass('u-mask')
                .addClass('ui-aside-win__mask')
                .hide();
            this.$el = $('<div></div>')
                .addClass('ui-aside-win')
                .addClass(this.options.class)
                .hide();
            this.$icon = $('<i class="oefont-arrow-right ui-aside-win__icon"></i>')
                .appendTo(this.$el);
            this.dir == 1 && this.$el.addClass('_left');
            this.dir == -1 && this.$el.addClass('_right');
            this.dir == 11 && this.$el.addClass('_top');
            this.dir == -11 && this.$el.addClass('_bottom');

            //this.$mask[0].style[u.getProperty('TransitionDuration')] = this.options.speed + 's';
            //this.$el[0].style[u.getProperty('TransitionDuration')] = this.options.speed + 's';

            this.$el.add(this.$mask).appendTo('body');
            this.bindEvt();
        }
        ,bindEvt: function(){
            this.$el.iTouchMove({
                class: 'ui-aside-win__inner'
            });
            this.$inner = $('.ui-aside-win__inner',this.$el);

            this.$el
                .on(u.events.down + '.asideWindow', $.proxy(function(e){
                    //e.stopPropagation();
                    e.preventDefault();
                }, this))
                .on('webkitTransitionEnd' + '.asideWindow', $.proxy(function(e){
                    //e.stopPropagation();
                    //console.log('webkitTransitionEnd')
                    if(this.$el.hasClass('_active')){

                    }else{
                        this.$el.hide();
                    }
                }, this));

            this.$mask
                .on(u.events.down + '.asideWindow', function(e){
                    e.stopPropagation();
                    e.preventDefault();
                })
                .on(u.events.move + '.asideWindow', function(e){
                    e.stopPropagation();
                    e.preventDefault();
                })
                .on(u.events.up + '.asideWindow', $.proxy(function(e){
                    e.stopPropagation();
                    e.preventDefault();
                    this.hide();
                }, this))
                .on('webkitTransitionEnd' + '.asideWindow', $.proxy(function(e){
                    //e.stopPropagation();
                    if(this.$mask.hasClass('_active')){

                    }else{
                        this.$mask.hide();
                    }
                }, this));


            /*this.$el.add(this.$mask).add('body')
                .on('mousemove' + '.asideWindow', '.ui-aside-win._active', function(e){
                    e.stopPropagation();
                    e.preventDefault();
                    console.log('moveee')
                });*/

            this.$icon
                .on(u.events.up + '.asideWindow', $.proxy(function(e){
                    e.stopPropagation();
                    e.preventDefault();
                    this.hide();
                }, this));

        }
        ,bindTargetEvt: function(){
            var _this = this;
            if(this.options.$triggerEl && this.options.$triggerEl.length){
                this.options.$triggerEl.on('click' + '.asideWindow', function(e){
                    _this.initialized = (_this.__target == this);
                    _this.__target = this;
                    _this.show();
                });
            }

        }
        ,setDir: function(){
            switch (this.options.dir){
                case "left":
                    this.dir = 1;
                    break;
                case "right":
                    this.dir = -1;
                    break;
                case "top":
                    this.dir = 11;
                    break;
                case "bottom":
                    this.dir = -11;
                    break;
                case 1:
                    this.dir = 1;
                    break;
                case -1:
                    this.dir = -1;
                    break;
                case 11:
                    this.dir = 11;
                    break;
                case -11:
                    this.dir = -11;
                    break;
                default :
                    this.dir = -1;
                    break;
            }
        }

        ,setContent: function(){
            this.$inner.empty();
            this.$inner.append(this.$icon);
            this.resetTouchMove();
            /*if(this.initialized){
                this.$inner.append(this._cache);
            }else{
                typeof this.options.setContent === 'function' && this.options.setContent.call(this,this.$inner);
                this._cache = this.$inner.children();
            }*/
            typeof this.options.setContent === 'function' && this.options.setContent.call(this,this.$inner);

            typeof this.options.onSetContentEnd === 'function' && this.options.onSetContentEnd.call(this);
        }

        ,resetTouchMove: function(){
            var transformProperty = u.getProperty('Transform');
            if (u.support.transform3d){
                this.$inner[0].style[transformProperty] = 'translate3d(0,' + 0 + 'px' + ',0)';
            }else{
                this.$inner[0].style[transformProperty] = 'translate(0,' + 0 + 'px' + ')';
            }

        }

        ,toggle: function(){
            var $els = this.$el.add(this.$mask);
            this.isActive && $els.show();
            this.isActive = !this.isActive;
            $els.toggleClass('_active');
        }

        ,hide: function(){
            var $els = this.$el.add(this.$mask);
            this.isActive = 0;
            $els.removeClass('_active');
        }
        ,show: function(){
            var $bd = $('body');
            this.isActive = 1;
            this.$el
                .add(this.$mask)
                .css({
                    top: this.$el.height() + document.body.scrollTop > $bd.height()
                        ? $bd.height() - this.$el.height() + 'px'
                        : document.body.scrollTop + 'px',
                    //safari 窗口尺寸会变啊 我擦!!
                    height:  $(window).height()+'px'
                })
                .show()
                .addClass('_active');
            this.setContent();
        }
    };

    OE.ui.AsideWindow = AsideWindow;
    (function($) {
        $.fn.asideWindow = function (options) {
            this.each(function () {
                var $this = $(this)
                    , asideWindow = this._asideWindow;

                if (!asideWindow) {
                    var opts = $.extend({$triggerEl:$this},options);
                    asideWindow = new OE.ui.AsideWindow(opts);
                }

                this._asideWindow = asideWindow;
            });
            return this;
        };
    })(OE.$);
    return AsideWindow;
});