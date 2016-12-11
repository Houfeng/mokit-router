/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var Plugin = __webpack_require__(1);
	module.exports = new Plugin(function () {
	  return __webpack_require__(2);
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	/*istanbul ignore next*/'use strict';
	
	var factory = function factory(thunk) {
	  function Plugin(opts) {
	    return typeof Plugin.entity === 'function' ? new Plugin.entity(opts) : Plugin.entity;
	  }
	  Plugin.install = function (mokit) {
	    factory.mokit = mokit;
	    this.entity = thunk();
	    this.entity.install(mokit);
	  };
	  if (typeof mokit !== 'undefined') {
	    mokit.use(Plugin);
	  }
	  return Plugin;
	};
	
	module.exports = factory;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var mokit = __webpack_require__(1).mokit;
	var utils = mokit.utils;
	var Class = mokit.Class;
	var Component = mokit.Component;
	var RouterBase = __webpack_require__(3);
	var HashDirver = __webpack_require__(5);
	var RouterView = __webpack_require__(6);
	var LinkDirective = __webpack_require__(7);
	
	var ROOT_PATH = '/';
	
	var Router = new Class({
	  $name: 'Router',
	  $extends: RouterBase,
	
	  /**
	   * 路由类构造函数
	   * @param {Object} options 选项
	   * @returns {void} 无返回
	   */
	  constructor: function /*istanbul ignore next*/constructor(options) {
	    this.$super();
	    options = options || utils.create(null);
	    if (options.view) this.view = options.view;
	    this.dirvier = options.dirvier || new HashDirver(this);
	    this.dirvier.on('changed', this._onChanged.bind(this));
	  },
	
	  /**
	   *「路由视组」访问器
	   * @returns {RouterView} 路由视图组件实例
	   */
	  get view() {
	    return this._view;
	  },
	
	  /**
	   *「路由视组」设置器
	   * @param {RouterView} view 路由视图组件实例
	   * @returns {void} 无返回
	   */
	  set view(view) {
	    if (!(view instanceof RouterView)) {
	      throw new Error('Invalid RouterView');
	    }
	    this._view = view;
	    this._view._router = this;
	    this._onChanged(this.dirvier.get());
	  },
	
	  /**
	   * 路由发生变化时的处理函数
	   * @param {string} path 将要转到的路径
	   * @returns {void} 无返回
	   */
	  _onChanged: function /*istanbul ignore next*/_onChanged(path) {
	    path = path || '/';
	    var routes = this.get(path.split('?')[0]);
	    if (!routes || routes.length < 1) return;
	    this.route = routes[0];
	    this.route.path = path;
	    this.route.query = this.parseQuery();
	    if (this.view) {
	      this.view.component = this.route.component;
	    }
	  },
	
	  /**
	   * 转到一个路径
	   * @param {string} path 将要转到的路径
	   * @returns {void} 无返回
	   */
	  go: function /*istanbul ignore next*/go(path) {
	    this.dirvier.set(path);
	  },
	
	  /**
	   * 映射路由配置
	   * @param {Object} map 路由配置
	   * @returns {void} 无返回
	   */
	  map: function /*istanbul ignore next*/map(_map) {
	    utils.each(_map, function (pattern, item) {
	      if (utils.isString(item)) {
	        item = _map[item];
	      }
	      if (item instanceof Component) {
	        item = { component: item };
	      }
	      if (!item) throw new Error('Invalid route `' + pattern + '`');
	      item.pattern = pattern;
	      this.addOne(item);
	    }, this);
	  },
	
	  /**
	   * 解析相对路径
	   * @param {string} toUri 原始路径
	   * @param {string} fromUri 参数路径
	   * @returns {string} 解析后的相关路径
	   */
	  resolveUri: function /*istanbul ignore next*/resolveUri(toUri, fromUri) {
	    toUri = toUri || ROOT_PATH;
	    if (toUri[0] == ROOT_PATH) return toUri;
	    fromUri = fromUri || ROOT_PATH;
	    fromUri = fromUri.split('?')[0].split('#')[0];
	    var baseDir = fromUri.substring(0, fromUri.lastIndexOf(ROOT_PATH));
	    var uriParts = toUri.split('#')[0].split(ROOT_PATH);
	    var uriHash = toUri.split('#')[1];
	    var newUriParts = baseDir.length > 0 ? baseDir.split(ROOT_PATH) : [];
	    uriParts.forEach(function (part) {
	      if (part == '..') {
	        newUriParts.pop();
	      } else if (part && part != '.') {
	        newUriParts.push(part);
	      }
	    }, this);
	    return ROOT_PATH + newUriParts.join(ROOT_PATH) + (uriHash ? '#' + uriHash : '');
	  },
	
	  /**
	   * 解析查询字符串并生成查询参数对象
	   * @returns {Object} 查询参数对象
	   */
	  parseQuery: function /*istanbul ignore next*/parseQuery() {
	    var queryString = (location.href.split('#')[1] || '').split('?')[1] || '';
	    var pairs = queryString.split('&');
	    var query = utils.create(null);
	    pairs.forEach(function (pair) {
	      var strs = pair.split('=');
	      query[strs[0]] = strs[1];
	    }, this);
	    return query;
	  },
	
	  /**
	   * 启动应用
	   * @param {Component} root 应用根组件类
	   * @param {element} element 挂载元素
	   * @returns {Component} 应用根件实例
	   */
	  start: function /*istanbul ignore next*/start(root, element) {
	    this.app = new root({
	      _router: this
	    });
	    this.app.$mount(element, true);
	    return this.app;
	  }
	
	});
	
	Router.HashDirver = HashDirver;
	
	/**
	 * 路由插件安装方法
	 * @param {Component} owner 组件类
	 * @returns {void} 无返回
	 */
	Router.install = function (owner) {
	
	  owner.Router = this;
	
	  //为组件实例扩展 $router 属性
	  Object.defineProperty(owner.prototype, '$router', {
	    get: function /*istanbul ignore next*/get() {
	      if (this instanceof RouterView) {
	        return this._router || this.$parent && this.$parent.$router;
	      } else if (this.$parent) {
	        return this.$parent.$router;
	      } else if (!this.$parent) {
	        return this._router || this.router;
	      } else {
	        return null;
	      }
	    }
	  });
	
	  //为组件实例扩展 $route 属性
	  Object.defineProperty(owner.prototype, '$route', {
	    get: function /*istanbul ignore next*/get() {
	      return this.$router && this.$router.route;
	    }
	  });
	
	  //添加全局组件 RouterView
	  owner.component('RouterView', RouterView);
	
	  //添加 link 指令
	  owner.directives.push(LinkDirective);
	};
	
	module.exports = Router;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var utils = __webpack_require__(4);
	
	/**
	 * 定义正则表达式常量
	 */
	var PLACE_HOLDER_EXPR = /\{.+?\}/gim;
	var COLLECT_EXPR_STR = '([^\\/]+)';
	var GREEDY_COLLECT_EXPR_STR = '(.+)';
	
	/**
	 * 定义路由实例扩展 __proto__
	 **/
	var routeInstanceProto = {};
	
	/**
	 * 生成 action URL
	 * @param {String} action action 名称
	 * @return {String} 对应的 path
	 **/
	routeInstanceProto.actionUrl = function (action) {
	  var self = this;
	  var actionUrl = self.withoutActionUrl + '/' + action;
	  actionUrl = actionUrl.replace(/\/\//igm, '/');
	  return actionUrl;
	};
	
	/**
	 * 定义路由对象
	 * @param {Object} routes 路由眏射表
	 * @param {Object} options 选项
	 * @returns {void} 无返回
	 */
	function Router(routes, options) {
	  var self = this;
	  options = options || {};
	  self.options = options;
	  self.table = [];
	  if (routes) {
	    self.add(routes);
	  }
	}
	
	/**
	 * 解析占位符 key 定义
	 * @param {String} _keyDefStr 占位符定义
	 * @returns {Object} 占符符信息对象
	 **/
	Router.prototype._parseKeyDef = function (_keyDefStr) {
	  var keyDefStr = _keyDefStr.substring(1, _keyDefStr.length - 1);
	  var keyDefParts = keyDefStr.split(':');
	  var keyDef = {};
	  keyDef.name = keyDefParts[0];
	  if (keyDef.name[0] == '*') {
	    keyDef.greedy = true;
	    keyDef.name = keyDef.name.substring(1);
	  }
	  if (keyDefParts[1]) {
	    keyDef.expr = new RegExp(keyDefParts[1], 'igm');
	  }
	  return keyDef;
	};
	
	/**
	 * 添加一个路由配置
	 * @param {Object} route 路由项
	 * @returns {void} 无返回
	 */
	Router.prototype.addOne = function (route) {
	  var self = this;
	  if (!route || !route.pattern) return;
	  //取到所有路由key
	  PLACE_HOLDER_EXPR.lastIndex = 0;
	  var keyDefs = route.pattern.match(PLACE_HOLDER_EXPR) || [];
	  route.keys = {};
	  //初始化 url 匹配测试表达式字符串
	  var exprStr = '^' + route.pattern + '$';
	  utils.each(keyDefs, function (i) {
	    //处理 key 定义
	    var keyDef = self._parseKeyDef(keyDefs[i]);
	    route.keys[keyDef.name] = {
	      index: i,
	      expr: keyDef.expr
	    };
	    //将 'key 占位符' 的表达式，替换为 '提交值的正则表达式'
	    var collectExprStr = keyDef.greedy ? GREEDY_COLLECT_EXPR_STR : COLLECT_EXPR_STR;
	    exprStr = exprStr.replace(keyDefs[i], collectExprStr);
	  });
	  //生成 url 匹配测试表达式
	  route.expr = new RegExp(exprStr, 'igm');
	  //处理所有 route 的 method 
	  route.methods = route.methods || self.options.defaultMethods;
	  if (route.methods && route.methods.length > 0) {
	    route.methods = route.methods.map(function (method) {
	      return method.toUpperCase();
	    });
	  }
	  //继承原型
	  route.__proto__ = routeInstanceProto;
	  self.table.push(route);
	};
	
	/**
	 * 添加一组路由配置表
	 * @param {Route} routes 一个路由实体,格式:{pattern:'',target:object}
	 * @returns {void} 无返回
	 */
	Router.prototype.add = function (routes) {
	  var self = this;
	  utils.each(routes, function (_name, _route) {
	    //判断是字符串还是一个对象，并都将 _route 转为对象
	    var route = utils.isString(_route) ? { 'target': _route } : _route;
	    //尝试从名称中解析出 method 和 pattern
	    var name = (_name || '/').toString();
	    var nameParts = name.split(' ');
	    if (nameParts.length > 1) {
	      route.methods = nameParts[0].split(',');
	      route.pattern = route.pattern || nameParts[1];
	    } else {
	      route.pattern = route.pattern || nameParts[0];
	    }
	    //解析 controller 和 action
	    //target 和 controller 不可同时配置，target 可以为 'controller action' 这样的格式
	    if (route.target) {
	      var targetParts = route.target.split(' ');
	      route.controller = route.controller || targetParts[0];
	      route.action = route.action || targetParts[1];
	    }
	    route.target = route.controller;
	    //添加 route
	    self.addOne(route);
	  });
	};
	
	/**
	 * 解析路由动态 action
	 * @param {Object} route 路由项
	 * @returns {Object} 解析后路由项
	 **/
	Router.prototype._parseDynamicAction = function (route) {
	  if (route && route.action && route.action.indexOf('{') > -1) {
	    utils.each(route.params, function (key, val) {
	      route.action = utils.replace(route.action, '{' + key + '}', val);
	    });
	  }
	  return route;
	};
	
	/**
	 * 创建一个路由实例
	 * @param {object} srcRoute 路由项原型 proto
	 * @param {String} url URL
	 * @param {Object} params 参数
	 * @returns {Object} 路由实例
	 **/
	Router.prototype._createRouteInstance = function (srcRoute, url, params) {
	  var self = this;
	  var routeInstance = { __proto__: srcRoute };
	  routeInstance.params = params;
	  if (routeInstance.action) {
	    var urlParts = url.split('/');
	    routeInstance.withoutActionUrl = urlParts.slice(0, urlParts.length - 1);
	  } else {
	    routeInstance.withoutActionUrl = url;
	  }
	  routeInstance = self._parseDynamicAction(routeInstance);
	  return routeInstance;
	};
	
	/**
	 * 通过请求路径获取第一个匹配的路由
	 * @param {String} url 请求路径
	 * @param {Boolean} handleActionFromUrl 是否从 URL 中分析 action
	 * @returns {Route} 路由实体
	 */
	Router.prototype.get = function (url, handleActionFromUrl) {
	  var self = this;
	  var routeArray = [];
	  if (utils.isNull(url)) {
	    return routeArray;
	  }
	  url = url.replace(/\/\//igm, '/');
	  utils.each(self.table, function (i, route) {
	    route.expr.lastIndex = 0;
	    if (!route.expr.test(url)) return;
	    //通过子表达式 '正则的()' 取值
	    route.expr.lastIndex = 0;
	    var values = route.expr.exec(url);
	    //生成 params
	    var params = {};
	    var failed = utils.each(route.keys, function (key, keyDef) {
	      params[key] = values[keyDef.index + 1];
	      if (!keyDef.expr) return;
	      keyDef.expr.lastIndex = 0;
	      if (!keyDef.expr.test(params[key])) {
	        return true;
	      }
	    });
	    if (failed) return;
	    routeArray.push(self._createRouteInstance(route, url, params));
	  });
	  //确定 parseActionFromUrl 的值
	  handleActionFromUrl = utils.isNull(handleActionFromUrl) ? self.options.parseActionFromUrl : handleActionFromUrl;
	  //如果需要 parseActionFromUrl
	  if (handleActionFromUrl) {
	    var _routeArray = self._getForActionFromUrl(url);
	    routeArray.push.apply(routeArray, _routeArray);
	  }
	  return routeArray;
	};
	
	/**
	 * 从 url 中分解出来 action ，然后获取 route array
	 * @param {String} url 路径
	 * @returns {Object} 路由实例
	 **/
	Router.prototype._getForActionFromUrl = function (url) {
	  var self = this;
	  /*
	  一是在如果直接匹配不成功时，才将 “/” 分隔的最后一个 “字串” 当作 action 进行再一次匹配
	  */
	  var urlParts = url.split('/');
	  var lastIndex = urlParts.length - 1;
	  var action = urlParts[lastIndex];
	  //检查分解出来的 action 是否合法
	  if (action === '' || action.indexOf('.') > -1) {
	    return null;
	  }
	  var ctrlRouteUrl = urlParts.slice(0, lastIndex).join('/');
	  if (ctrlRouteUrl === '') ctrlRouteUrl = '/';
	  var ctrlRouteArray = self.get(ctrlRouteUrl, false) || [];
	  var routeArray = ctrlRouteArray.filter(function (route) {
	    /**
	     * 从 URL 分解出来的 action 不可能是动态的 action
	     * route.action 没有指定时才能作为 parseAction 的合法 route
	     **/
	    if (route.action) return false;
	    //设定 action 作为指向 action 的 route
	    route.action = action;
	    //标记一下 action 在 url 中
	    route.actionFromUrl = true;
	    return true;
	  });
	  return routeArray;
	};
	
	/**
	 * 过滤出包含指定 method 的 route
	 * @param {array} routeArray 路由实例数组
	 * @param {String} method HTTP method
	 * @returns {Object} 匹配的路由实例
	 **/
	Router.prototype.matchByMethod = function (routeArray, method) {
	  if (!routeArray || routeArray.length < 1) {
	    return routeArray;
	  }
	  return routeArray.filter(function (route) {
	    if (!route || !route.methods || route.methods.length < 1) {
	      return false;
	    }
	    return route.methods.indexOf(method) > -1;
	  })[0];
	};
	
	module.exports = Router;
	
	/*end*/

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	(function (ntils) {
	
	  /**
	   * 空函数
	   */
	  ntils.noop = function () {};
	
	  /**
	   * 验证一个对象是否为NULL
	   * @method isNull
	   * @param  {Object}  obj 要验证的对象
	   * @return {Boolean}     结果
	   * @static
	   */
	  ntils.isNull = function (obj) {
	    return obj === null || typeof obj === "undefined";
	  };
	
	  /**
	   * 除去字符串两端的空格
	   * @method trim
	   * @param  {String} str 源字符串
	   * @return {String}     结果字符串
	   * @static
	   */
	  ntils.trim = function (str) {
	    if (this.isNull(str)) return str;
	    if (str.trim) {
	      return str.trim();
	    } else {
	      return str.replace(/(^[\\s]*)|([\\s]*$)/g, "");
	    }
	  };
	
	  /**
	   * 替换所有
	   * @method replace
	   * @param {String} str 源字符串
	   * @param {String} str1 要替换的字符串
	   * @param {String} str2 替换为的字符串
	   * @static
	   */
	  ntils.replace = function (str, str1, str2) {
	    if (this.isNull(str)) return str;
	    return str.replace(new RegExp(str1, 'g'), str2);
	  };
	
	  /**
	   * 从字符串开头匹配
	   * @method startWith
	   * @param {String} str1 源字符串
	   * @param {String} str2 要匹配的字符串
	   * @return {Boolean} 匹配结果
	   * @static
	   */
	  ntils.startWith = function (str1, str2) {
	    if (this.isNull(str1) || this.isNull(str2)) return false;
	    return str1.indexOf(str2) === 0;
	  };
	
	  /**
	   * 是否包含
	   * @method contains
	   * @param {String} str1 源字符串
	   * @param {String} str2 检查包括字符串
	   * @return {Boolean} 结果
	   * @static
	   */
	  ntils.contains = function (str1, str2) {
	    var self = this;
	    if (this.isNull(str1) || this.isNull(str2)) return false;
	    return str1.indexOf(str2) > -1;
	  };
	
	  /**
	   * 从字符串结束匹配
	   * @method endWidth
	   * @param {String} str1 源字符串
	   * @param {String} str2 匹配字符串
	   * @return {Boolean} 匹配结果
	   * @static
	   */
	  ntils.endWith = function (str1, str2) {
	    if (this.isNull(str1) || this.isNull(str2)) return false;
	    return str1.indexOf(str2) === str1.length - str2.length;
	  };
	
	  /**
	   * 是否包含属性
	   * @method hasProperty
	   * @param  {Object}  obj  对象
	   * @param  {String}  name 属性名
	   * @return {Boolean}      结果
	   * @static
	   */
	  ntils.has = ntils.hasProperty = function (obj, name) {
	    if (this.isNull(obj) || this.isNull(name)) return false;
	    return name in obj || obj.hasOwnProperty(name);
	  };
	
	  /**
	   * 验证一个对象是否为Function
	   * @method isFunction
	   * @param  {Object}  obj 要验证的对象
	   * @return {Boolean}     结果
	   * @static
	   */
	  ntils.isFunction = function (obj) {
	    if (this.isNull(obj)) return false;
	    return typeof obj === "function";
	  };
	
	  /**
	   * 验证一个对象是否为String
	   * @method isString
	   * @param  {Object}  obj 要验证的对象
	   * @return {Boolean}     结果
	   * @static
	   */
	  ntils.isString = function (obj) {
	    if (this.isNull(obj)) return false;
	    return typeof obj === 'string' || obj instanceof String;
	  };
	
	  /**
	   * 验证一个对象是否为Number
	   * @method isNumber
	   * @param  {Object}  obj 要验证的对象
	   * @return {Boolean}     结果
	   * @static
	   */
	  ntils.isNumber = function (obj) {
	    if (this.isNull(obj)) return false;
	    return typeof obj === 'number' || obj instanceof Number;
	  };
	
	  /**
	   * 验证一个对象是否为Boolean
	   * @method isBoolean
	   * @param  {Object}  obj 要验证的对象
	   * @return {Boolean}     结果
	   * @static
	   */
	  ntils.isBoolean = function (obj) {
	    if (this.isNull(obj)) return false;
	    return typeof obj === 'boolean' || obj instanceof Boolean;
	  };
	
	  /**
	   * 验证一个对象是否为HTML Element
	   * @method isElement
	   * @param  {Object}  obj 要验证的对象
	   * @return {Boolean}     结果
	   * @static
	   */
	  ntils.isElement = function (obj) {
	    if (this.isNull(obj)) return false;
	    if (window.Element) {
	      return obj instanceof Element;
	    } else {
	      return obj.tagName && obj.nodeType && obj.nodeName && obj.attributes && obj.ownerDocument;
	    }
	  };
	
	  /**
	   * 验证一个对象是否为HTML Text Element
	   * @method isText
	   * @param  {Object}  obj 要验证的对象
	   * @return {Boolean}     结果
	   * @static
	   */
	  ntils.isText = function (obj) {
	    if (this.isNull(obj)) return false;
	    return obj instanceof Text;
	  };
	
	  /**
	   * 验证一个对象是否为Object
	   * @method isObject
	   * @param  {Object}  obj 要验证的对象
	   * @return {Boolean}     结果
	   * @static
	   */
	  ntils.isObject = function (obj) {
	    if (this.isNull(obj)) return false;
	    return (/*istanbul ignore next*/(typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object"
	    );
	  };
	
	  /**
	   * 验证一个对象是否为Array或伪Array
	   * @method isArray
	   * @param  {Object}  obj 要验证的对象
	   * @return {Boolean}     结果
	   * @static
	   */
	  ntils.isArray = function (obj) {
	    if (this.isNull(obj)) return false;
	    var v1 = Object.prototype.toString.call(obj) === '[object Array]';
	    var v2 = obj instanceof Array;
	    var v3 = !this.isString(obj) && this.isNumber(obj.length) && this.isFunction(obj.splice);
	    var v4 = !this.isString(obj) && this.isNumber(obj.length) && obj[0];
	    return v1 || v2 || v3 || v4;
	  };
	
	  /**
	   * 验证是不是一个日期对象
	   * @method isDate
	   * @param {Object} val   要检查的对象
	   * @return {Boolean}           结果
	   * @static
	   */
	  ntils.isDate = function (val) {
	    if (this.isNull(val)) return false;
	    return val instanceof Date;
	  };
	
	  /**
	   * 验证是不是一个正则对象
	   * @method isDate
	   * @param {Object} val   要检查的对象
	   * @return {Boolean}           结果
	   * @static
	   */
	  ntils.isRegexp = function (val) {
	    return val instanceof RegExp;
	  };
	
	  /**
	   * 转换为数组
	   * @method toArray
	   * @param {Array|Object} array 伪数组
	   * @return {Array} 转换结果数组
	   * @static
	   */
	  ntils.toArray = function (array) {
	    if (this.isNull(array)) return [];
	    return Array.prototype.slice.call(array);
	  };
	
	  /**
	   * 转为日期格式
	   * @method toDate
	   * @param {Number|String} val 日期字符串或整型数值
	   * @return {Date} 日期对象
	   * @static
	   */
	  ntils.toDate = function (val) {
	    var self = this;
	    if (self.isNumber(val)) return new Date(val);else if (self.isString(val)) return new Date(self.replace(self.replace(val, '-', '/'), 'T', ' '));else if (self.isDate(val)) return val;else return null;
	  };
	
	  /**
	   * 遍历一个对像或数组
	   * @method each
	   * @param  {Object or Array}   obj  要遍历的数组或对象
	   * @param  {Function} fn            处理函数
	   * @return {void}                   无返回值
	   * @static
	   */
	  ntils.each = function (list, handler, scope) {
	    if (this.isNull(list) || this.isNull(handler)) return;
	    if (this.isArray(list)) {
	      var listLength = list.length;
	      for (var i = 0; i < listLength; i++) {
	        var rs = handler.call(scope || list[i], i, list[i]);
	        if (!this.isNull(rs)) return rs;
	      }
	    } else {
	      for (var key in list) {
	        var rs = handler.call(scope || list[key], key, list[key]);
	        if (!this.isNull(rs)) return rs;
	      }
	    }
	  };
	
	  /**
	   * 格式化日期
	   * @method formatDate
	   * @param {Date|String|Number} date 日期
	   * @param {String} format 格式化字符串
	   * @param {object} dict 反译字典
	   * @return {String} 格式化结果
	   * @static
	   */
	  ntils.formatDate = function (date, format, dict) {
	    if (this.isNull(format) || this.isNull(date)) return date;
	    date = this.toDate(date);
	    dict = dict || {};
	    var placeholder = {
	      "M+": date.getMonth() + 1, //month
	      "d+": date.getDate(), //day
	      "h+": date.getHours(), //hour
	      "m+": date.getMinutes(), //minute
	      "s+": date.getSeconds(), //second
	      "w+": date.getDay(), //week
	      "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
	      "S": date.getMilliseconds() //millisecond
	    };
	    if (/(y+)/.test(format)) {
	      format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	    }
	    for (var key in placeholder) {
	      if (new RegExp("(" + key + ")").test(format)) {
	        var value = placeholder[key];
	        value = dict[value] || value;
	        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? value : ("00" + value).substr(("" + value).length));
	      }
	    }
	    return format;
	  };
	
	  /**
	   * 拷贝对象
	   * @method copy
	   * @param {Object} src 源对象
	   * @param {Object} dst 目标对象
	   * @param {String} err 错误消息模板
	   * @static
	   */
	  ntils.copy = function (src, dst, igonres, err) {
	    dst = dst || (this.isArray(src) ? [] : {});
	    this.each(src, function (key) {
	      if (igonres && igonres.indexOf(key) > -1) {
	        if (err) throw new Error(err.replace('{name}', key));
	        return;
	      }
	      try {
	        if (Object.getOwnPropertyDescriptor) {
	          Object.defineProperty(dst, key, Object.getOwnPropertyDescriptor(src, key));
	        } else {
	          dst[key] = src[key];
	        }
	      } catch (ex) {}
	    });
	    return dst;
	  };
	
	  /**
	   * 深度克隆对象
	   * @method clone
	   * @param {Object} src 源对象
	   * @return {Object} 新对象
	   * @static
	   */
	  ntils.clone = function (src, igonres) {
	    if (this.isNull(src) || this.isString(src) || this.isNumber(src) || this.isBoolean(src) || this.isDate(src)) {
	      return src;
	    }
	    var objClone = src;
	    try {
	      objClone = new src.constructor();
	    } catch (ex) {}
	    this.each(src, function (key, value) {
	      if (objClone[key] != value && !this.contains(igonres, key)) {
	        if (this.isObject(value)) {
	          objClone[key] = this.clone(value, igonres);
	        } else {
	          objClone[key] = value;
	        }
	      }
	    }, this);
	    ['toString', 'valueOf'].forEach(function (key) {
	      if (this.contains(igonres, key)) return;
	      this.defineFreezeProp(objClone, key, src[key]);
	    }, this);
	    return objClone;
	  };
	
	  /**
	   * 合并对象
	   * @method mix
	   * @return 合并后的对象
	   * @param {Object} dst 目标对象
	   * @param {Object} src 源对象
	   * @param {Array} igonres 忽略的属性名,
	   * @param {Number} mode 模式
	   */
	  ntils.mix = function (dst, src, igonres, mode) {
	    //根据模式来判断，默认是Obj to Obj的  
	    if (mode) {
	      switch (mode) {
	        case 1:
	          // proto to proto  
	          return ntils.mix(dst.prototype, src.prototype, igonres, 0);
	        case 2:
	          // object to object and proto to proto  
	          ntils.mix(dst.prototype, src.prototype, igonres, 0);
	          break; // pass through  
	        case 3:
	          // proto to static  
	          return ntils.mix(dst, src.prototype, igonres, 0);
	        case 4:
	          // static to proto  
	          return ntils.mix(dst.prototype, src, igonres, 0);
	        default: // object to object is what happens below  
	      }
	    }
	    //---
	    src = src || {};
	    dst = dst || (this.isArray(src) ? [] : {});
	    this.keys(src).forEach(function (key) {
	      if (this.contains(igonres, key)) return;
	      if (this.isObject(src[key]) && (src[key].constructor == Object || src[key].constructor == Array || src[key].constructor == null)) {
	        dst[key] = ntils.mix(dst[key], src[key], igonres, 0);
	      } else {
	        dst[key] = src[key];
	      }
	    }, this);
	    return dst;
	  };
	
	  /**
	   * 定义不可遍历的属性
	   **/
	  ntils.defineFreezeProp = function (obj, name, value) {
	    try {
	      Object.defineProperty(obj, name, {
	        value: value,
	        enumerable: false,
	        configurable: true, //能不能重写定义
	        writable: false //能不能用「赋值」运算更改
	      });
	    } catch (err) {
	      //noop
	    }
	  };
	
	  /**
	   * 获取所有 key 
	   */
	  ntils.keys = function (obj) {
	    if (Object.keys) return Object.keys(obj);
	    var keys = [];
	    this.each(obj, function (key) {
	      keys.push(key);
	    });
	    return keys;
	  };
	
	  /**
	   * 创建一个对象
	   */
	  ntils.create = function (proto) {
	    if (Object.create) return Object.create(proto);
	    return { __proto__: proto };
	  };
	
	  /**
	   * 设置 proto
	   */
	  ntils.setProto = function (obj, prototype) {
	    if (obj.__proto__) {
	      return ntils.setPrototype(obj.__proto__);
	    } else {
	      obj.__proto__ = prototype;
	    }
	  };
	
	  /**
	   * 是否深度相等
	   */
	  ntils.deepEqual = function (a, b) {
	    if (a === b) return true;
	    if (!this.isObject(a) || !this.isObject(b)) return false;
	    var aKeys = this.keys(a);
	    var bKeys = this.keys(b);
	    if (aKeys.length !== bKeys.length) return false;
	    var allKeys = aKeys.concat(bKeys);
	    var checkedMap = this.create(null);
	    var result = true;
	    this.each(allKeys, function (i, key) {
	      if (checkedMap[key]) return;
	      if (!this.deepEqual(a[key], b[key])) result = false;
	      checkedMap[key] = true;
	    }, this);
	    return result;
	  };
	
	  /**
	   * 从一个数值循环到别一个数
	   * @param {number} fromNum 开始数值
	   * @param {Number} toNum 结束数值
	   * @param {Number} step 步长值
	   * @param {function} handler 执行函数
	   * @returns {void} 无返回
	   */
	  ntils.fromTo = function (fromNum, toNum, step, handler) {
	    if (!handler) handler = [step, step = handler][0];
	    step = Math.abs(step || 1);
	    if (fromNum < toNum) {
	      for (var i = fromNum; i <= toNum; i += step) /*istanbul ignore next*/{
	        handler(i);
	      }
	    } else {
	      for (var i = fromNum; i >= toNum; i -= step) /*istanbul ignore next*/{
	        handler(i);
	      }
	    }
	  };
	
	  /**
	   * 生成一个Guid
	   * @method newGuid
	   * @return {String} GUID字符串
	   * @static
	   */
	  ntils.newGuid = function () {
	    var S4 = function S4() {
	      return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
	    };
	    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
	  };
	
	  /**
	   * 对象变换
	   **/
	  ntils.map = function (list, fn) {
	    var buffer = this.isArray(list) ? [] : {};
	    this.each(list, function (name, value) {
	      buffer[name] = fn(name, value);
	    });
	    return buffer;
	  };
	
	  /**
	   * 通过路径设置属性值
	   */
	  ntils.setByPath = function (obj, path, value) {
	    if (this.isNull(obj) || this.isNull(path) || path === '') {
	      return;
	    }
	    if (!this.isArray(path)) {
	      path = path.replace(/\[/, '.').replace(/\]/, '.').split('.');
	    }
	    this.each(path, function (index, name) {
	      if (this.isNull(name) || name.length < 1) return;
	      if (index === path.length - 1) {
	        obj[name] = value;
	      } else {
	        obj[name] = obj[name] || {};
	        obj = obj[name];
	      }
	    }, this);
	  };
	
	  /**
	   * 通过路径获取属性值
	   */
	  ntils.getByPath = function (obj, path) {
	    if (this.isNull(obj) || this.isNull(path) || path === '') {
	      return obj;
	    }
	    if (!this.isArray(path)) {
	      path = path.replace(/\[/, '.').replace(/\]/, '.').split('.');
	    }
	    this.each(path, function (index, name) {
	      if (this.isNull(name) || name.length < 1) return;
	      if (!this.isNull(obj)) obj = obj[name];
	    }, this);
	    return obj;
	  };
	
	  /**
	   * 数组去重
	   **/
	  ntils.unique = function (array) {
	    if (this.isNull(array)) return array;
	    var newArray = [];
	    this.each(array, function (i, value) {
	      if (newArray.indexOf(value) > -1) return;
	      newArray.push(value);
	    });
	    return newArray;
	  };
	
	  /**
	   * 解析 function 的参数列表
	   **/
	  ntils.getFunctionArgumentNames = function (fn) {
	    if (!fn) return [];
	    var src = fn.toString();
	    var parts = src.split(')')[0].split('=>')[0].split('(');
	    return (parts[1] || parts[0]).split(',').map(function (name) {
	      return name.trim();
	    }).filter(function (name) {
	      return name != 'function';
	    });
	  };
	
	  /**
	   * 缩短字符串
	   */
	  ntils.short = function (str, maxLength) {
	    if (!str) return str;
	    maxLength = maxLength || 40;
	    var strLength = str.length;
	    var trimLength = maxLength / 2;
	    return strLength > maxLength ? str.substr(0, trimLength) + '...' + str.substr(strLength - trimLength) : str;
	  };
	
	  /**
	   * 首字母大写
	   */
	  ntils.firstUpper = function (str) {
	    if (this.isNull(str)) return;
	    str[0] = str[0].toLowerCase();
	    return str;
	  };
	
	  /**
	   * 解析字符串为 dom 
	   * @param {string} str 字符串
	   * @returns {HTMLNode} 解析后的 DOM 
	   */
	  ntils.parseDom = function (str) {
	    this._PARSER_DOM_DIV = this._PARSER_DOM_DIV || document.createElement('dev');
	    this._PARSER_DOM_DIV.innerHTML = str;
	    var domNodes = this.toArray(this._PARSER_DOM_DIV.childNodes);
	    this._PARSER_DOM_DIV.innerHTML = '';
	    return domNodes;
	  };
	})( false ? window.ntils = {} : exports);

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var mokit = __webpack_require__(1).mokit;
	var Class = mokit.Class;
	var EventEmitter = mokit.EventEmitter;
	
	var SEPARATOR = '#!';
	var ROOT_PATH = '/';
	
	/**
	 * 基于 has 的路由驱动
	 */
	var HashDriver = new Class({
	  $name: 'HashDriver',
	  $extends: EventEmitter,
	
	  /**
	   * 路由驱动构造函数
	   * @param {Object} router 路径实例
	   * @returns {void} 无返回
	   */
	  constructor: function /*istanbul ignore next*/constructor(router) {
	    this.$super();
	    this.router = router;
	    window.addEventListener('hashchange', function () {
	      this._onChange();
	    }.bind(this));
	  },
	
	  /**
	   * 获取当前路径
	   * @returns {string} 当前路径
	   */
	  get: function /*istanbul ignore next*/get() {
	    return location.hash.split(SEPARATOR)[1] || ROOT_PATH;
	  },
	
	  /**
	   * 设置当前路径
	   * @param {string} path 要转到的路径
	   * @returns {void} 无返回
	   */
	  set: function /*istanbul ignore next*/set(path) {
	    path = path || ROOT_PATH;
	    location.hash = SEPARATOR + this.router.resolveUri(path, this.get());
	  },
	
	  /**
	   * 路由发生变化时的处理函数
	   * @param {string} path 将要转到的路径
	   * @returns {void} 无返回
	   */
	  _onChange: function /*istanbul ignore next*/_onChange(path) {
	    path = path || this.get() || '';
	    if (path[0] != ROOT_PATH) path = ROOT_PATH + path;
	    this.emit('changed', path);
	  }
	
	});
	
	module.exports = HashDriver;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var mokit = __webpack_require__(1).mokit;
	var View = mokit.components.View;
	
	var RouterView = View.extend({
	  properties: {
	    router: {
	      test: function /*istanbul ignore next*/test(router) {
	        return !!router;
	      },
	      get: function /*istanbul ignore next*/get() {
	        return this._router;
	      },
	      set: function /*istanbul ignore next*/set(router) {
	        this._router = router;
	        this._router.view = this;
	      }
	    }
	  },
	  onCreated: function /*istanbul ignore next*/onCreated() {
	    if (!this.router && this.$router) {
	      this.router = this.$router;
	    }
	  }
	});
	
	module.exports = RouterView;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*istanbul ignore next*/'use strict';
	
	var mokit = __webpack_require__(1).mokit;
	var Directive = mokit.Directive;
	var EventEmitter = mokit.EventEmitter;
	
	module.exports = new Directive({
	  name: 'link',
	  type: Directive.TYPE_ATTRIBUTE,
	  literal: true,
	
	  bind: function /*istanbul ignore next*/bind() {
	    var eventTarget = this.node.$target || this.node;
	    this.emiter = new EventEmitter(eventTarget);
	    this.emiter.addListener(this.decorates[0] || 'click', function () {
	      if (!this.scope || !this.scope.$router) return;
	      this.scope.$router.go(this.path);
	    }.bind(this), false);
	  },
	
	  unbind: function /*istanbul ignore next*/unbind() {
	    this.emiter.removeListener();
	  },
	
	  update: function /*istanbul ignore next*/update(path) {
	    this.path = path;
	  }
	
	});

/***/ }
/******/ ]);
//# sourceMappingURL=mokit-router.js.map