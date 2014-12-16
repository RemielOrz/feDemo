/*!
 * Created By remiel.
 * Date: 14-10-14
 * Time: 上午10:38
 */
define(["OE"], function(OE){
    console.log("module:DropBox");

    var $ = OE.$
        ,u = OE.utils;

    var init;
    function DropBox(){
        var $box = $('.ui-drop-box')
            ,$hd = $box.find('.ui-drop-box__hd')
            ,$bd = $box.find('.ui-drop-box__bd');

        if(init) return ;
        $box.on('tap' + '.ui-drop-box', '.ui-drop-box__switch', function(e){
            var $this = $(this)
                ,$thisBox = $this.closest('.ui-drop-box');
            $thisBox.toggleClass('_on');
            //console.log($thisBox.hasClass('_on'));
        });
        init = 1;
    }

    return DropBox;
});