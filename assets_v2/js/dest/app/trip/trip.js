define(["OE","Menu","lazyload","Calendar","DropBox","_","Loading","Swipe"],function(a,b,c,d,e,f,g,h){function i(a){m.currentPlan=a,"string"==typeof m.currentPlan.onwardTraffic&&(m.currentPlan.onwardTraffic=JSON.parse(m.currentPlan.onwardTraffic)),"string"==typeof m.currentPlan.returnTraffic&&(m.currentPlan.returnTraffic=JSON.parse(m.currentPlan.returnTraffic))}function j(b){var c=k("#j-line__trip-container");q?c.html(q(b)):k.get(a.BASE_URL+"/template/trip/tpl_trip_info.html",function(a){var d=k(a);q=f.template(d.html()),c.html(q(b))})}console.log("Page Module: trip");var k=a.$,l=a.utils;g.hide(),product.description=JSON.parse(product.description);var m={product:product};plans.sort(function(a,b){return l.date.parse(a.startAt)-l.date.parse(b.startAt)});var n,o;if(window.localStorage&&(n=localStorage.getItem("planId")),n)for(var p=0;p<plans.length;p++)plans[p].id==n&&(i(plans[p]),o=1);o||i(plans[0]);var q;g.show(),k.get(a.BASE_URL+"/template/trip/tpl.html",function(a){console.log("template [tpl.html] onload"),g.hide();var b=k(a),c=f.template(b.html());k(".wrapper").append(c(m)),new e,new d(k("#calendar"),{date:l.date.parse(m.currentPlan.startAt),plans:plans,callback:function(){var a=k(this).attr("planid");k(".jsf_form_plan_id").val(a);for(var b=0;b<plans.length;b++)plans[b].id==a&&(i(plans[b]),j(m));k("#j-line__start-at").html(m.currentPlan.startAt),k("#j-line__origin-price").text(m.currentPlan.originPrice),k("#j-line__discount-price").text(m.currentPlan.discountPrice),window.localStorage&&localStorage.setItem("planId",a)}});var n=k(".swipe"),o=n.find(".swipe-item");if(o.length>1){h(n[0],{startSlide:0,auto:2e3,continuous:!0,disableScroll:!0,stopPropagation:!0,callback:function(){},transitionEnd:function(){}})}k("[lazyload]").lazyload(function(a){console.log(a)}),k(window).on("scroll",function(){var a=k(".line .__ft");document.body.scrollTop<k(".__info-hd-date").offset().top?a.addClass("_hide"):a.removeClass("_hide")}),k(".jsf_form_plan_id").val(m.currentPlan.id),k(".j-form-btn").on("click",function(){console.log("__price-btn, 买买买"),k("#jsf_form").find(".jsf_form_btn").trigger("click")}),k(".jsf_form_btn").on("click",function(a){console.log("买买买",a)})})});