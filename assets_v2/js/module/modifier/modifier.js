/*!
 * Created By remiel.
 * Date: 14-10-20
 * Time: 下午4:02
 */

define(["OE"],function(OE){

    console.log("module:Modifier");

    var u = OE.utils
        ,$ = OE.$;

    function Modifier(options){
        if(typeof options !== 'object') options = {};
        this.options = $.extend({},{
            class:'',
            value:0,
            callback: function(newValue){
                console.log('callback',newValue)
            }
        },options);
        this.init();
        return this.$el;
    }

    Modifier.prototype = {
        init: function(){
            this.value = this.options.value
                ? isNaN(this.options.value) ? 0 : this.options.value
                : 0;
            if(this.value < 0) this.value = 0;
            this.createElement();
            this.bindEvt();
        },
        createElement:function(){
            this.$el = $('<div>' +
                '<div class="ui-modifier__minus"></div>' +
                '<div class="ui-modifier__bd">' +
                '<input type="text" class="ui-modifier__ipt">' +
                '</div>' +
                '<div class="ui-modifier__plus"></div>' +
                '</div>')
                .addClass('ui-modifier')
                .addClass(this.options.class);
            this.$plus = this.$el.find('.ui-modifier__plus');
            this.$minus = this.$el.find('.ui-modifier__minus');
            this.$ipt = this.$el.find('.ui-modifier__ipt');

            this.$ipt.val(this.value);
        },
        bindEvt: function(){
            this.$plus.on(u.events.click+'.ui-modifier', $.proxy(function(){
                console.log('+');
                this.toChange('plus');
            }, this));
            this.$minus.on(u.events.click+'.ui-modifier', $.proxy(function(){
                console.log('-');
                this.toChange('minus');
            }, this));
            this.$ipt.on('change'+'.ui-modifier', $.proxy(function(e){
                var value = this.$ipt.val();
                value = value
                    ? isNaN(value) ? 0 : value
                    : 0;
                if(value < 0) value = 0;
                this.hasChange(value);
                this.$ipt.val(value);
            }, this))
        },
        toChange: function(e){
            var value = parseInt(this.$ipt.val())
                ,newValue;
            switch (e){
                case 'plus':
                    newValue = value + 1;
                    this.$ipt.val(newValue);
                    break;
                case 'minus':
                    newValue = value > 1 ? value -1 : 0;
                    this.$ipt.val(newValue);
                    break;
                default :
                    break;
            }
            if(!(value == newValue)) this.hasChange(newValue);
        }
        ,hasChange: function(newValue){
            console.log('Modifier:hasChange');
            this.value = newValue;
            typeof this.options.callback === 'function' && this.options.callback.call(this, newValue);
        }
    };

    OE.ui.Modifier = Modifier;
    return Modifier;
});