# 如何使用

### 1.实例化一个`waterfall`对象

`waterfall`的构造函数被导出到window.OE之下，所以，实例化一个新的waterfall对象，可以这样做：

```
var wtf = new OE.waterfall();
```

### 2.传入配置对象
`waterfall`构造函数接受一个对象来作为参数，达到配置的目的。如：

```
var wtf = new OE.waterfall({
	column: 2,
	width: 200,
	columnGap: 10,
	rowGap: 10,
	ajaxUrl: 'url',
	noMoreData: function nomoredata(){},
	cardMaker: function maker(){}
});
```

#### 配置对象支持的属性有：
`column (number)`：瀑布流的列数。     

`columnGap(number)`: 瀑布流列与列之间的间距。     

`rowGap(number)`：瀑布流卡片之间的上下间距。     

`width (number)`：每张瀑布流卡片的宽度。       

`cardMaker(function)`：**这个是必传参数**，用于生成瀑布流的每张卡片。这个函数必须要接受一个'data'对象参数，通过对象里的数据，生成一个`div`容器，里面包括自定义的html结构。       

`ajaxUrl(string)`：请求的URL。默认的URL是json文件名按页数变化的，比如第一页的URL是，yoururl/1.json，第二页是yoururl/2.json，以此类推。当然也支持自己定制每一页的URL如何变化，请看下一个参数。   
    
`joinUrl(function)`：这个函数用以生成每一页的URL必须接收两个参数，第一个参数是`baseUrl`，即基本的Url，也就是不变的部分。第二个参数是`page`，即页码。页码会在每次页面滚到底部的时候加1，每次请求时，都会根据本函数返回的URL来发起。所以，要求本函数能根据传入的页码，返回符合要求的URL。             
  
`noMoreData(function)`：当数据请求完毕时，执行这个函数。           

**注：除了特别表明是必传参数，其他都是可选的参数。**
