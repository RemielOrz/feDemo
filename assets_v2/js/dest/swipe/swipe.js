function Swipe(a,b){"use strict";function c(){p=t.children,s=p.length,p.length<2&&(b.continuous=!1),o.transitions&&b.continuous&&p.length<3&&(t.appendChild(p[0].cloneNode(!0)),t.appendChild(t.children[1].cloneNode(!0)),p=t.children),q=new Array(p.length),r=a.getBoundingClientRect().width||a.offsetWidth,t.style.width=p.length*r+"px";for(var c=p.length;c--;){var d=p[c];d.style.width=r+"px",d.setAttribute("data-index",c),o.transitions&&(d.style.left=c*-r+"px",h(c,u>c?-r:c>u?r:0,0))}b.continuous&&o.transitions&&(h(f(u-1),-r,0),h(f(u+1),r,0)),o.transitions||(t.style.left=u*-r+"px"),a.style.visibility="visible"}function d(){b.continuous?g(u-1):u&&g(u-1)}function e(){b.continuous?g(u+1):u<p.length-1&&g(u+1)}function f(a){return(p.length+a%p.length)%p.length}function g(a,c){if(u!=a){if(o.transitions){var d=Math.abs(u-a)/(u-a);if(b.continuous){var e=d;d=-q[f(a)]/r,d!==e&&(a=-d*p.length+a)}for(var g=Math.abs(u-a)-1;g--;)h(f((a>u?a:u)-g-1),r*d,0);a=f(a),h(u,r*d,c||v),h(a,0,c||v),b.continuous&&h(f(a-d),-(r*d),0)}else a=f(a),j(u*-r,a*-r,c||v);u=a,n(b.callback&&b.callback(u,p[u]))}}function h(a,b,c){i(a,b,c),q[a]=b}function i(a,b,c){var d=p[a],e=d&&d.style;e&&(e.webkitTransitionDuration=e.MozTransitionDuration=e.msTransitionDuration=e.OTransitionDuration=e.transitionDuration=c+"ms",e.webkitTransform="translate("+b+"px,0)translateZ(0)",e.msTransform=e.MozTransform=e.OTransform="translateX("+b+"px)")}function j(a,c,d){if(!d)return void(t.style.left=c+"px");var e=+new Date,f=setInterval(function(){var g=+new Date-e;return g>d?(t.style.left=c+"px",y&&k(),b.transitionEnd&&b.transitionEnd.call(event,u,p[u]),void clearInterval(f)):void(t.style.left=(c-a)*(Math.floor(g/d*100)/100)+a+"px")},4)}function k(){w=setTimeout(e,y)}function l(){y=0,clearTimeout(w)}var m=function(){},n=function(a){setTimeout(a||m,0)},o={addEventListener:!!window.addEventListener,touch:"ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch,transitions:function(a){var b=["transitionProperty","WebkitTransition","MozTransition","OTransition","msTransition"];for(var c in b)if(void 0!==a.style[b[c]])return!0;return!1}(document.createElement("swipe"))};if(a){var p,q,r,s,t=a.children[0];b=b||{};var u=parseInt(b.startSlide,10)||0,v=b.speed||300;b.continuous=void 0!==b.continuous?b.continuous:!0;var w,x,y=b.auto||0,z={},A={},B={handleEvent:function(a){switch(a.type){case"touchstart":this.start(a);break;case"touchmove":this.move(a);break;case"touchend":n(this.end(a));break;case"webkitTransitionEnd":case"msTransitionEnd":case"oTransitionEnd":case"otransitionend":case"transitionend":n(this.transitionEnd(a));break;case"resize":n(c)}b.stopPropagation&&a.stopPropagation()},start:function(a){var b=a.touches[0];z={x:b.pageX,y:b.pageY,time:+new Date},x=void 0,A={},t.addEventListener("touchmove",this,!1),t.addEventListener("touchend",this,!1)},move:function(a){if(!(a.touches.length>1||a.scale&&1!==a.scale)){b.disableScroll&&a.preventDefault();var c=a.touches[0];A={x:c.pageX-z.x,y:c.pageY-z.y},"undefined"==typeof x&&(x=!!(x||Math.abs(A.x)<Math.abs(A.y))),x||(a.preventDefault(),l(),b.continuous?(i(f(u-1),A.x+q[f(u-1)],0),i(u,A.x+q[u],0),i(f(u+1),A.x+q[f(u+1)],0)):(A.x=A.x/(!u&&A.x>0||u==p.length-1&&A.x<0?Math.abs(A.x)/r+1:1),i(u-1,A.x+q[u-1],0),i(u,A.x+q[u],0),i(u+1,A.x+q[u+1],0)))}},end:function(){var a=+new Date-z.time,c=Number(a)<250&&Math.abs(A.x)>20||Math.abs(A.x)>r/2,d=!u&&A.x>0||u==p.length-1&&A.x<0;b.continuous&&(d=!1);var e=A.x<0;x||(c&&!d?(e?(b.continuous?(h(f(u-1),-r,0),h(f(u+2),r,0)):h(u-1,-r,0),h(u,q[u]-r,v),h(f(u+1),q[f(u+1)]-r,v),u=f(u+1)):(b.continuous?(h(f(u+1),r,0),h(f(u-2),-r,0)):h(u+1,r,0),h(u,q[u]+r,v),h(f(u-1),q[f(u-1)]+r,v),u=f(u-1)),b.callback&&b.callback(u,p[u])):b.continuous?(h(f(u-1),-r,v),h(u,0,v),h(f(u+1),r,v)):(h(u-1,-r,v),h(u,0,v),h(u+1,r,v))),t.removeEventListener("touchmove",B,!1),t.removeEventListener("touchend",B,!1)},transitionEnd:function(a){parseInt(a.target.getAttribute("data-index"),10)==u&&(y&&k(),b.transitionEnd&&b.transitionEnd.call(a,u,p[u]))}};return c(),y&&k(),o.addEventListener?(o.touch&&t.addEventListener("touchstart",B,!1),o.transitions&&(t.addEventListener("webkitTransitionEnd",B,!1),t.addEventListener("msTransitionEnd",B,!1),t.addEventListener("oTransitionEnd",B,!1),t.addEventListener("otransitionend",B,!1),t.addEventListener("transitionend",B,!1)),window.addEventListener("resize",B,!1)):window.onresize=function(){c()},{setup:function(){c()},slide:function(a,b){l(),g(a,b)},prev:function(){l(),d()},next:function(){l(),e()},stop:function(){l()},getPos:function(){return u},getNumSlides:function(){return s},kill:function(){l(),t.style.width="",t.style.left="";for(var a=p.length;a--;){var b=p[a];b.style.width="",b.style.left="",o.transitions&&i(a,0,0)}o.addEventListener?(t.removeEventListener("touchstart",B,!1),t.removeEventListener("webkitTransitionEnd",B,!1),t.removeEventListener("msTransitionEnd",B,!1),t.removeEventListener("oTransitionEnd",B,!1),t.removeEventListener("otransitionend",B,!1),t.removeEventListener("transitionend",B,!1),window.removeEventListener("resize",B,!1)):window.onresize=null}}}}console.log("module:Swipe"),(window.jQuery||window.Zepto)&&!function(a){a.fn.Swipe=function(b){return this.each(function(){a(this).data("Swipe",new Swipe(a(this)[0],b))})}}(window.jQuery||window.Zepto);