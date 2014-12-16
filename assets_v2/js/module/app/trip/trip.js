/*!
 * Created By remiel.
 * Date: 14-9-29
 * Time: 上午11:15
 */
define(["OE","Menu","lazyload","Calendar","DropBox","_","Loading","Swipe"],function(OE,Menu,lazyload,Calendar,DropBox,_,Loading,Swipe){
    console.log('Page Module: trip');
    var $ = OE.$;
    var u = OE.utils;
    Loading.hide();

    product.description = JSON.parse(product.description);
    var data = {
        product: product
    };
    plans.sort(function(a,b){
        return u.date.parse(a.startAt) - u.date.parse(b.startAt);
    });
    function setPlan(plan){
        data.currentPlan = plan;
        if(typeof data.currentPlan.onwardTraffic == 'string'){
            data.currentPlan.onwardTraffic = JSON.parse(data.currentPlan.onwardTraffic);
        }
        if(typeof data.currentPlan.returnTraffic == 'string') {
            data.currentPlan.returnTraffic = JSON.parse(data.currentPlan.returnTraffic);
        }
    }
    var lsPlanId,hasSetPlan;
    if(window.localStorage){
        lsPlanId = localStorage.getItem("planId");
    }
    if(lsPlanId){
        for(var i = 0; i < plans.length; i++){
            if(plans[i].id == lsPlanId){
                setPlan(plans[i]);
                hasSetPlan = 1;
            }
        }
    }
    if(!hasSetPlan){
        setPlan(plans[0]);
    }

    var template__trip;
    function renderTrip(d){
        var $container = $('#j-line__trip-container');
        if(!template__trip){
            $.get(OE.BASE_URL+'/template/trip/tpl_trip_info.html', function(html){
                var $html = $(html);
                template__trip = _.template($html.html());
                $container.html(template__trip(d));
            });
        }else{
            $container.html(template__trip(d));
        }
    }
    Loading.show();
    $.get(OE.BASE_URL+'/template/trip/tpl.html', function(html){
        console.log('template [tpl.html] onload');
        Loading.hide();
        var $html = $(html);
        var compiled = _.template($html.html());
        $('.wrapper').append(compiled(data));

        new DropBox();

        new Calendar($('#calendar'),{
            date: u.date.parse(data.currentPlan.startAt),
            plans: plans,
            callback: function(){
                var planid = $(this).attr('planid');
                $('.jsf_form_plan_id').val(planid);
                for(var i = 0;i<plans.length;i++){
                    if(plans[i].id == planid){
                        setPlan(plans[i]);
                        renderTrip(data);
                    }
                }
                $('#j-line__start-at').html(data.currentPlan.startAt);
                $('#j-line__origin-price').text(data.currentPlan.originPrice);
                $('#j-line__discount-price').text(data.currentPlan.discountPrice);
                window.localStorage && localStorage.setItem("planId",planid);
            }
        });
        /*var $carousel = $('.m-carousel'),
            $carousel__item = $carousel.find('li');
        if($carousel__item.length > 1){
            $carousel
                .on(u.events.down + ' ' + u.events.move + ' ' + u.events.up, function(e){
                    //阻止触发滑出菜单
                    e.stopPropagation();
                })
                .carousel();
        }*/
        var $swipe = $('.swipe')
            ,$swipe__item = $swipe.find('.swipe-item');
        if($swipe__item.length > 1){
            var theSwipe = Swipe($swipe[0], {
                startSlide: 0,
                auto: 2000,
                continuous: true,
                disableScroll: true,
                stopPropagation: true,
                callback: function(index, element) {},
                transitionEnd: function(index, element) {}
            });
        }

        $("[lazyload]").lazyload(function(e){console.log(e)});

        $(window).on('scroll', function(){
            var $ft = $('.line .__ft');

            if(document.body.scrollTop < $('.__info-hd-date').offset().top){
                $ft.addClass('_hide');
            }else{
                $ft.removeClass('_hide');
            }

        });


        $('.jsf_form_plan_id').val(data.currentPlan.id);
        $('.j-form-btn').on('click', function(){
            console.log('__price-btn, 买买买');
            $('#jsf_form').find('.jsf_form_btn').trigger('click');
        });
        $('.jsf_form_btn').on('click', function(e){
            console.log('买买买',e)
        });

    });


});

