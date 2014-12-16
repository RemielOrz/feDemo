/*!
 * Created By remiel.
 * Date: 14-9-17
 * Time: 下午2:35
 */

//lazyload
$.fn.lazyload = function(callback){
    return this.each(function(index, item){
        var $item = $(item);
        var src = $item.attr('lazyload')
            ,img;
        if(!src) {
            console.log("lazyload url is error",item);
            return;
        }
        $item.addClass('img_hide');
        img = document.createElement('img');
        img.onload = function() {
            if(item.tagName === "IMG"){
                item.src = src;
            }else{
                $item.css({
                    backgroundImage: 'url("' + src + '")'
                });
            }
            $item.addClass('img_show').removeClass('img_hide').removeAttr('lazyload');
            typeof callback === 'function' && callback.call(this, 'onload');
        };
        img.onerror= function() {
            console.log('img lazyload onerror');
            typeof callback === 'function' && callback.call(this, 'onerror');
        };
        img.src = src;
    });
};