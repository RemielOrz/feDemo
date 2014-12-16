/*!
 * Created By remiel.
 * Date: 14-10-10
 * Time: 上午9:37
 */
define(["OE", "ITouchMove"],function(OE, ITouchMove){
    console.log("module:Menu");

    var u = OE.utils
        ,$ = OE.$;

    function Menu(options) {
        if(typeof options !== 'object') options = {};
        this.options = $.extend({},{
            el: '.wrapper',
            appendTo: 'body',
            tpl: OE.BASE_URL+'/template/menu/menu.html'
        },options);
        this.$el = $(this.options.el);
        this.init();
    }

    Menu.prototype = {
        init: function(){
            $.get(this.options.tpl, $.proxy(function(html){
                this.$menu = $($(html).html());
                this.$menu
                    .css({height: $(window).height()+'px'})
                    .appendTo(this.options.appendTo);
                this.$icon = $('<i class="oefont-menu menu__icon"></i>')
                    .appendTo(this.options.el);
                this.bindEvt();
            }, this));
        }
        ,toggleMenu: function(){
            //document.body.scrollTop = 0;
            this.$menu
                .css({
                    top: this.$menu.height() + document.body.scrollTop > this.$el.height()
                        ? this.$el.height() - this.$menu.height() + 'px'
                        : document.body.scrollTop + 'px',
                    //safari 窗口尺寸会变啊 我擦!!
                    height:  $(window).height()+'px'
                })
                .add(this.$icon)
                .toggleClass("_active");
            this.$el
                .add('body')
                .toggleClass("__menu_active")
                .removeClass('_disable-transform');
            this.isActive = this.$el.hasClass('__menu_active');
        }
        ,bindEvt: function(){
            this.elSwipe();
            //this.innerSwipe();
            this.iTouchMove();
            this.$icon.on(u.events.up + '.menu',$.proxy(function(e) {
                e.stopPropagation();
                e.preventDefault();
                this.toggleMenu();
                console.log('click menu-icon', e)
            }, this));

            $('body')
                .on(u.events.move + '.menu', '.__menu_active', $.proxy(function(e) {
                    //console.log('move body');
                    this.isActive && e.preventDefault();
                }, this));
        }
        ,elSwipe: function(){
            var xy
                ,x1
                ,x2
                ,dx
                ,dy
                ,canceled
                ,dragThresholdMet
                ,abs = Math.abs;

            this.$el.on(u.events.down + '.menu', $.proxy(function(e){
                //e.preventDefault();
                if(this.isActive){
                    e.preventDefault();
                }
                xy = u.getCursorPosition(e);
                x1 = xy.x;
                canceled = 1;
                dragThresholdMet = 0;
            }, this));
            this.$el.on(u.events.move + '.menu', $.proxy(function(e){
                var new_xy = u.getCursorPosition(e);
                if(!xy) return
                dx = new_xy.x - xy.x;
                dy = new_xy.y - xy.y;
                if(dragThresholdMet || abs(dx) > abs(dy) + 1 && dx > 1){
                    dragThresholdMet = 1;
                    e.preventDefault();
                    canceled = 0;
                }else if(abs(dx) > abs(dy) + 1 && dx < -1){
                    canceled = 1;
                    e.preventDefault();
                }else{
                    canceled = 1;
                }
            }, this));
            this.$el.on(u.events.up + '.menu', $.proxy(function(e){
                //e.preventDefault();
                if(this.isActive){
                    e.preventDefault();
                    this.toggleMenu();
                }else{
                    !canceled && this.toggleMenu();
                }
            }, this));
            //fix元素bug
            this.$el.on('webkitTransitionEnd' + '.menu', $.proxy(function(e){
                if(this.isActive){

                }else{
                    this.$el.addClass('_disable-transform');
                }
            }, this));
            //蛋疼? 怎么处理好?
            /*$('body').on(u.events.move + '.menu', $.proxy(function(e){
                var b = document.body;
                if(b.scrollTop < 0 || b.scrollTop > b.clientHeight){
                    canceled = 1;
                    this.overflow = 1
                }else{
                    this.overflow = 0
                }
            }, this));*/
        }
        ,iTouchMove: function(){
            new ITouchMove(this.$menu);
        }

    };
    OE.ui.Menu = Menu;
    return Menu;
});