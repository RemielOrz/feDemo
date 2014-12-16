/*!
 * Created By remiel.
 * Date: 14-9-25
 * Time: 下午2:52
 */

//提示框
define(['OE'], function(OE){
    console.log("module:MsgBox");

    var u = OE.utils
        ,$ = OE.$;

    var MsgBox = function (){
        this.init();
    };
    MsgBox.prototype.init = function(){
        this
            .initElement()
            .bind();
    };
    MsgBox.prototype.initElement = function(){
        var html = [
            '<div class="ui-msg-box u-mask">',
            '<div class="ui-msg-box__main">',
            '<div class="ui-msg-box__hd"></div>',
            '<div class="ui-msg-box__bd"></div>',
            '<div class="ui-msg-box__ft u-box-flex">',
            '<div class="u-box-flex__inner">',
            '<a href="javascript:;" class="ui-msg-box__btn">确 定</a>',
            '</div></div></div></div>'
        ];
        this.$el = $(html.join(''));
        this.$title = this.$el.find('.ui-msg-box__hd');
        this.$content = this.$el.find('.ui-msg-box__bd');
        this.$btn = this.$el.find('.ui-msg-box__btn');
        this.$el.appendTo($('body'));
        return this;
    };
    MsgBox.prototype.setContent = function (title,content,btnText,url){
        this.$title.html(title);
        this.$content.html(content);
        this.$btn.html(btnText?btnText:'确 定');
        if(url){
            this.$btn.attr('href',url);
        }else{
            this.$btn.attr('href','javascript:;');
        }
        return this;
    };
    MsgBox.prototype.show = function(){
        this.$el.show();
        return this;
    };
    MsgBox.prototype.hide = function(){
        this.$el.hide();
        return this;
    };
    MsgBox.prototype.bind = function(){
        var self = this;
        this.$btn.on(u.events.down, function(){
            self.hide();
        });
        return this;
    };


    OE.ui.msgBox = MsgBox;
    return MsgBox;
});