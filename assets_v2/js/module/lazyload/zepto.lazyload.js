/*!
 * Created By remiel.
 * Date: 14-9-17
 * Time: 下午2:35
 */

//lazyload
console.log("module:lazyload");

$.fn.lazyload = function(callback){
    return this.each(function(index, item){
        var $item = $(item);
        var src = $item.attr('lazyload')
            ,size = $item.attr('lazyload-size')
            ,img
            ,w,h;
        if(!src) {
            console.log("lazyload url is error",item);
            return;
        }
        if(size){
            size = size.split('x');
            w = size[0];
            h = size[1];
            $item.css({
                height: h / w * $item.width() + 'px'
            });
        }
        $item.addClass('u-lazyload_hide');
        img = document.createElement('img');
        img.onload = function() {
            if(item.tagName === "IMG"){
                item.src = src;
            }else{
                $item.css({
                    backgroundImage: 'url("' + src + '")'
                });
            }
            $item.addClass('u-lazyload_show').removeClass('u-lazyload_hide').removeAttr('lazyload');
            typeof callback === 'function' && callback.call(this, 'onload');
        };
        img.onerror= function() {
            console.log('img lazyload onerror');
            typeof callback === 'function' && callback.call(this, 'onerror');
        };
        img.src = src;
    });
};