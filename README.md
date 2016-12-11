mokit 路由插件

# 安装
```sh
npm install mokit-router --save-dev
```

# 使用
```js
const mokit = require('mokit');
const Router = require('mokit-router');

mokit.use(Router);

var router = new mokit.Router();
router.map({
  '/': '/test1',
  '/test1': require('./component1'),
  '/test2': require('./component2')
});

var App = mokit.Component({
  template: '<div>\
  <button m:link="/test1">test1</button>\
  <button m:link="/test2">test2</button>\
  <m:router-view></m:router-view>\
  </div>'
});

router.start(App, document.getElementById('app'));

...
...

```

# 路由匹配

路由定义

```js
router.map({
  //常规无参数
  '/test1': require('./your-component'),
  //包含一个路由参数 id
  '/test2/{id}': require('./your-component'),
  //包含两个路由参数 type 和 id，并指定了 id 的限定「正则表达式」
  '/test2/{type}/{id:^[a-zA-Z]+$}': require('./your-component')
});
```

在组件中可以通过 $route 属性访问路由对象及相关参数

```js
this.$route //当前中路由对象
this.$route.path //当前 path
this.$route.params //当前参数 map 
this.route.params.id //路由参数 id
```

# QueryString 
查询字符串，不会影响路由匹配，同时在 $route 对象中可以通过 $route.query 读取。

比如当访问 /test2/abc?name=efg 时

```js
this.$route.query.name //当前 name 的值为 efg
```

# Link 指令
link 可用于任意元素，比如 a、button 等，默认情况下 link 在 click 时触发，当然也可以指定它的触发事件，如下:

```html
<button m:link:tap="/test1">test1</button>
```

# route-view

当使用了 router 插件后，就可以直接使用 Router-View 组件了，Router-View 继承自 View 组件，
所有 View 具体的特性和能力它都有，比如：

 - 「转场动画」的属性 tranistion
 - 「加载组件」的属性 component
 - 「切换组件」的方法 switchTo