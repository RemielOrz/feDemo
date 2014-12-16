为了防止世界被破坏！
为了守护世界的和平！
***
# 前端命名规范
参考[BEM](http://bem.info/method/definitions/)命名规范，  
**块（Block），元素（Element），修饰符（Modifier）**,  
正常类不需加前缀,特定的类才需加上前缀  
如ui（ui组件）, u（utility,通用类）, j（js钩子）等  
属性类, 元素也可独立
### 举个栗子
```
.ui-msg-box__hd-nav_color_red{}
```
ui:组件,  
-msg-box:块,  
\_\_hd-nav:元素  
_color_red:属性  

###属性类,元素也可独立
如: 属性:_blue, _default, _ani_bounce_in,元素:\_\_inner,\_\_item等, css里必须带父类限定,防止全局污染, 如:
```
.ui-msg-box ._black{color: #000}
.ui-msg-box .__header{}
```

### utilities
```
.u-fl{float:left}
.u-fr{float:right}
.u-cf{.cf();}
.u-ti_2em{ text-indent:2em;}
.u-hide{ display:none;}
.u-show{ display:block;}
.u-placeholder{ background-color:#f1f1f1; background-image:url("/assets/placeholder/logo.png"); background-repeat:no-repeat; background-size:120/@m; background-position:center center;}
.u-opacity_0{ opacity:0;}
.u-opacity_1{ opacity:1;}
.u-transition_default{.transition(all .4s ease-in .01s);}
.u-wx-indicator{ background:rgba(0,0,0,.5) url('/assets/images/indicator.png') no-repeat center top; background-size:100% auto; position:fixed; top:0; left:0; right:0; bottom:0; width:100%; height:100%; z-index:9999; display:none;}
.u-box-flex{.display-box();}
.u-box-flex__inner{.box-flex();width: .001%;}
.u-link-box{ display:block; color:#000;}
.u-mask{ background:rgba(0,0,0,.5); 
```
### msgBox
```
.ui-msg-box{ display:none;
    &:extend(.u-mask);
}
.ui-msg-box__main{ position:absolute; left:0; right:0; top:50%;  margin:-240/@m auto 0; width:580/@m; padding:46/@m 0 28/@m; background:#fff; border-radius:10/@m;}
.ui-msg-box__hd{ font-size:32/@m; margin-bottom:32/@m; text-align:center;}
.ui-msg-box__bd{ font-size:28/@m; padding:0 80/@m; margin-bottom:32/@m;}
.ui-msg-box__ft{
    .u-box-flex__inner{ text-align:center;}
}
.ui-msg-box__btn{ display:inline-block;vertical-align:top; padding:0 28/@m;min-width:100/@m; line-height:46/@m; color:#fff; font-size:28/@m; background:#7fe5f4; border-radius:8/@m;}
```

#前端LESS CSS说明
##lib
- base_font_size.less  
 初始化html字体大小为16px,为配合使用rem
- base_var.less  
 产生变量@ px,@ m(两个变量相等,因前期项目使用@ m,现在使用@ px),  
 如: 100/@ px自动转化为rem为单位的数值: 其中100为psd上的像素值(ratio=2),计算转化后为 x rem(该值默认为ratio=1的rem值)  
 默认的ratio可通过@ n控制,@ n=0.5*1: ratio = 1;@ n = 0.5*2: ratio = 2;以此类推.
- fit_font_size.less  
 通过media查询设置html字体,改变整体尺寸
- mixins.less
- reset.less  
 重置元素默认属性
- utility.less
 通用内裤
#### 页面引入 css/base.css 初始化页面
#### 模块less引入base_var.less和mixins.less两个文件
#### less文件顶部设置@(v):版本号,@ img_base_url:图片基础路径
  
#js说明
##requirejs模块化
- 各个模块都引入基础模块:OE  
- 模块按命名分文件夹放置于js/module
- 模块引用的css文件按命名分文件夹放置于css/module  

# font icon 说明
[点击查看](https://bitbucket.org/oengine/fe-demo/src/f50f7f6e2ce8a9bd20b7dc61d965e30055d4ec09/assets_v2/css/module/oefont/README.md?at=master)

#未完待续