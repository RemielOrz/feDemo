## 使用方法

#### HTML结构
```
<div class="slider-wrap">
        <div class="slider-inner">
            <div class="slider-item"></div>
            <div class="slider-item"></div>
            <div class="slider-item"></div>
            <div class="slider-item"></div>
            ......
        </div>
 </div>
 ```

#### 初始化

```
$('.slider-wrap').slider(option);
```
******

#### option 对象内容
1. **infinite ：定义是否循环**    
**类型：boolean**                
**值：**              
	* true： 无限循环            
	* false： 不循环              
	**默认：`false`**           
	
2. **direction：定义方向是`x`轴还是``轴**                 
 **类型：string**               
   ** 值：**                  
     * `x`：方向沿x轴                
     * `y`：方向沿y轴             
     **默认：`x`** 
     
3. **moveRadius：定义移动多长距离手才会翻页，单位（px）**     
 	**类型：number**                     
 	**默认：`20`**
 	
4. **duration: 定义过渡动画时长，单位（s）**
 	**类型：number**              
 	**默认：`0.6`**
              
     
******
     
#### 可用函数                  
`var action;    `             

调用方法：$('.slider-wrap').slider(action)               
**`action`可以是:**        
1. `prev`：翻到上一页               
2. `next`：翻到下一页               
3. `go`：跳到指定页数，比如：`$('.slider-wrap').slider('go', 1)`，就是跳到第二页               
                
****


#### 可用事件                
1. `slide:after`：每翻过一页后，并且翻页动画完成后触发                 
2. `slide:before`：开始翻页，但动画还没开始时触发              


> 事件会冒泡，所以在`.slide-inner`上或者更外层绑定事件即可。
