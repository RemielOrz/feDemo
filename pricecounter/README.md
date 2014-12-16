## 使用方法

### 调用
在`body`最底部添加：     
`<script src="/yours/zepto.min.js"></script>`
`<script src="/yours/counter.js"></script>`

### HTML结构

比如：    

```
<body class="js-PaymentMaker">
	<p class="js-Price">100/ton</p>
	<input type="hidden" class="js-Remain" name="remain" value="10"/>
	<button class="js-Minus">-</button>
	<span class="js-Amount" contenteditable="true">1</span>
	<button class="js-Plus">+</button>
	<p>&yen;<span class="js-TotalPrice"></span></p>
</body>
```

最外层为`class="js-PaymentMaker"`的容器，**所有的东西都要放在里面**！

其他必须要有的元素是：   

* `js-Price`: 字符串，必须以数字开头，比如`1000元/kg`。
* `js-Remain`: 库存剩余数，必须为`type="hidden"`的`input标签`，如`<input type="hidden" class="js-Remain" name="remain" value="10"/>`
*  `js-TotalPrice`: 总价计算结果输出的地方。
*  `js-Amount`: 购买数量。
*  `js-Plus`: 按钮，每点击一次，`js-Amount`的值加`1`。
*  `js-Minus`: 按钮，每点击一次，`js-Amount`的值减`1`。

### 依赖：`Zepto`