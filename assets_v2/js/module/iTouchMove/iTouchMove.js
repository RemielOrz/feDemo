/*!
 * Created By remiel.
 * Date: 14-10-15
 * Time: 上午10:25
 */
define(["OE"], function(OE){

    console.log("module:iTouchMove");

    var $ = OE.$
        ,u = OE.utils;

    function ITouchMove(el,options){
        this.options = $.extend({},{
            class:''
        },options);
        this.$el = $(el);
        this.$touch = $('<div></div>').css('overflow','hidden');
        this.options.class && this.$touch.addClass(this.options.class);

        this.$el
            .children()
            .appendTo(this.$touch);
        this.$touch.appendTo(this.$el);

        this.init();

    }

    ITouchMove.prototype = {
        init: function(){

            var $touch = this.$touch;
            var transformProperty = u.getProperty('Transform');
            var xy
                ,dx
                ,dy
                ,dragRadius = $touch.height() - this.$el.height()
                ,canceled = !(dragRadius >= 0)
                ,translateY;

            $touch.on(u.events.down, $.proxy(function(e){
                //console.log('ITouchMove Event: down',e);
                e.stopPropagation();
                //e.preventDefault();

                dragRadius = $touch.height() - this.$el.height();
                canceled = !(dragRadius >= 0);

                xy = u.getCursorPosition(e);
                translateY = parseInt($touch[0].style[transformProperty].split(',')[1]);
                if(isNaN(translateY)) translateY = 0;
            }, this));
            $touch.on(u.events.move, $.proxy(function(e){
                //console.log('ITouchMove Event: move',e);
                e.stopPropagation();
                e.preventDefault();
                var new_xy = u.getCursorPosition(e);
                if(!xy) return;
                dx = new_xy.x - xy.x;
                dy = new_xy.y - xy.y;

                if(canceled){

                }else{
                    var newTranslateY = translateY + dy;
                    if(newTranslateY > 0) newTranslateY = 0;
                    if(newTranslateY < -dragRadius) newTranslateY = -dragRadius;
                    if (u.support.transform3d){
                        $touch[0].style[transformProperty] = 'translate3d(0,' + newTranslateY + 'px' + ',0)';
                    }else{
                        $touch[0].style[transformProperty] = 'translate(0,' + newTranslateY + 'px' + ')';
                    }
                }

            }, this));
            $touch.on(u.events.up, $.proxy(function(e){
                e.stopPropagation();
                //e.preventDefault();
                console.log('ITouchMove Event: up',e);
            }, this));
        }
    };

    //add to OE
    OE.ui.ITouchMove = ITouchMove;

    //add to jq or zepto
    (function($) {
        $.fn.iTouchMove = function (options) {
            var opts = $.extend({},options);
            this.each(function () {
                var $this = $(this)
                    , iTouchMove = this._iTouchMove;

                if (!iTouchMove) {
                    iTouchMove = new OE.ui.ITouchMove(this, options);
                }

                this._iTouchMove = iTouchMove;
            });
            return this;
        };

    })(OE.$);

    return ITouchMove;
});