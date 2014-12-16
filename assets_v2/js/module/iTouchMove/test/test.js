require.config({
    paths: {
        'iTouchMove': '../iTouchMove',
        'OE': '../../OE',
        '$': '../../../lib/zepto.min'
    },
    shim: {
        '$': {
            exports: '$'
        }
    }
});

require(['iTouchMove'], function(iTouchMove){
    $('.test').iTouchMove();
});