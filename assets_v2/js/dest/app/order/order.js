define(["OE","Menu","lazyload","carousel","Calendar","DropBox","_","Modifier","TabSelection"],function(a,b,c,d,e,f,g,h){function i(){var a=m.find(".__item").not("._cleaning").addClass("_cleaning");setTimeout(function(){a.remove(),i()},3e3)}console.log("Page Module: order");{var j=a.$;a.utils}new e(j("#calendar"));var k=new h({value:1}),l=new h;j("#order__modifier-1").append(k),j("#order__modifier-2").append(l);var m=j("#status-box");m.on("tap",".__item",function(){j(this).remove()}),i()});