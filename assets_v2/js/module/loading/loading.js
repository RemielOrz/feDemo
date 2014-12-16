/*!
 * Created By remiel.
 * Date: 14-10-20
 * Time: 下午4:02
 */

define(["OE"],function(OE){

    console.log("module:Loading");

    var u = OE.utils
        ,$ = OE.$;

    function Loading(text){
        this.init(text);
    }

    Loading.prototype = {
        init: function(text){
            this
                .createElement()
                .bindEvt()
                .show();
            text && this.text(text);
            return this;
        }
        ,createElement:function(){
            var $el = $('#loading');
            if($el.length){
                this.$el = $el;
            }else{
                this.$el = $('<div id="loading" class="u-loading">loading...</div>')
                    .appendTo('body');
            }
            return this;
        }
        ,bindEvt: function(){
            this.$el
                .on('webkitTransitionEnd' + '.loading', $.proxy(function(e){
                    if(this.$el.hasClass('_show')){

                    }else{
                        this.$el.hide();
                    }
                }, this));
            return this;
        }
        ,show: function(){
            this.$el
                .show()
                .addClass("_show")
                .removeClass("_hide");
            return this;
        }
        ,hide: function(){
            this.$el
                .addClass("_hide")
                .removeClass("_show");
            return this;
        }
        ,text: function(text){
            this.$el.html(text);
            return this;
        }
    };

    var loading = new Loading();
    OE.ui.Loading = loading;
    return loading;
});