### 使用方法

#### html结构
```
<div class="roll-wrap">
    <div class="roll-body">
          <!--要滚动的内容-->
    </div>
</div>
```

传入「配置对象」

```javascript
	// 初始化
	$('.roll-wrap').roll( config );
```

「配置对象」可支持的配置属性包括：

```javascript
  {
  	infinite: boolean, // 是否循环
  	speed: number, // 每帧移动多少像素
  	direction: string, // 移动的方向，只支持 'x' 和 'y'
  	reverse: boolean // 是否反向
  	dragging: boolean // 是否可以拖动滚动的内容
  	start: number // 开始的位置，-1 or 0 or 1, -1和css中translate值为负数时的方向相同，1和-1相反，0则为原地
  }

```

当想停止滚动时，可以：

```javascript
    $('.roll-wrap').roll('stop');
```


当想继续滚动时，可以：

```javascript
    $('.roll-wrap').roll('recover');
```

当想重置滚动时，可以：

```javascript
    $('.roll-wrap'),roll('reset');
```


如果有多条同时滚动，想终止特定的一个滚动时，可以：

```javascript
    $('.roll-wrap').eq(exactIndex).roll('stop');
```

如果想在多条滚动中继续滚动特定的一条，同上，只需`$('.roll-wrap').eq(exactIndex)`获取到相应的对象，再执行`roll('recover')`即可。