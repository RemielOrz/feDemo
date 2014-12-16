/*!
 * Created By remiel.
 * Date: 14-10-21
 * Time: 下午2:05
 */
define(["OE"], function(OE){

    console.log("module:tabSelection");

    var $ = OE.$
        ,u = OE.utils;

    function TabSelection(options){
        if(typeof options !== 'object') options = {};
        this.options = $.extend({},{
            class:'',
            items:[
                {
                    text: '男',
                    value: 0
                },
                {
                    text: '女',
                    value: 1
                }
            ],
            selected: 0,
            callback: function(newValue){
                console.log('callback',newValue)
            }
        },options);
        this.init();
        return this;
    }

    TabSelection.prototype = {
        init: function(){
            this.createElement();
            this.bindEvt();
        },
        createElement: function(){
            this.$el = $(['<div class="ui-tab-selection u-box-flex">','</div>'].join(''));
            var itemTpl = '<div class="ui-tab-selection__item u-box-flex__inner" data-value="{value}">{text}</div>';

            var items = [];
            $.each(this.options.items, function(i, v){
                items.push(u.renderTpl(itemTpl, v));
            });
            this.$el
                .append(items.join(''));
            this.$item = this.$el.find('.ui-tab-selection__item');
            this.$item.eq(this.options.selected).addClass('_selected');
        },
        bindEvt: function(){
            var _this = this;
            this.$item.on(u.events.click+'.tabSelection', function(e){
                var $this = $(this)
                    ,index = $this.index();
                _this.$item
                    .removeClass('_selected')
                    .eq(index)
                    .addClass('_selected');
                typeof _this.options.callback === 'function' && _this.options.callback.call(_this, $this.attr('data-value'));
            });
        }
    };

    OE.ui.TabSelection = TabSelection;
    //add to jq or zepto
    (function($) {
        $.fn.tabSelection = function (options) {
            //var initOptions = $.extend({},$.fn.tabSelection.defaults, options,{});
            this.each(function () {
                var $this = $(this)
                    , tabSelection = this._tabSelection;
                if (!tabSelection) {
                    tabSelection = new OE.ui.TabSelection(options);
                    $this.append(tabSelection.$el);
                }
                this._tabSelection = tabSelection;
            });
            return this;
        };
        //$.fn.tabSelection.defaults = {};
    })(OE.$);
    return TabSelection;
});