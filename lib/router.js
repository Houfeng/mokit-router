/*istanbul ignore next*/'use strict';

var mokit = require('mokit-plugin').mokit;
var utils = mokit.utils;
var Class = mokit.Class;
var EventEmitter = mokit.EventEmitter;
var Component = mokit.Component;
var RouterBase = require('general-router');
var HashDirver = require('./drivers/hash');
var RouterView = require('./components/router-view');
var LinkDirective = require('./directives/link');

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
    this.emitter = new EventEmitter(this);
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
    var fromPath = this.dirvier.get();
    var toPath = this.resolveUri(path, fromPath);
    toPath = path.split('?')[0].split('!')[0];
    var routes = this.get(toPath);
    if (!routes || routes.length < 1) return;
    this.route = routes[0];
    this.route.path = toPath;
    this.route.query = this.parseQuery();
    if (this.view) {
      setTimeout(function () {
        this.view.switchTo(this.route.component, this._transition);
        this._transition = null;
      }.bind(this), 0);
    }
    this.emitter.$emit('enter', toPath);
    this.emitter.$emit('leave', fromPath);
  },

  /**
   * 转到一个路径
   * @param {string} path 将要转到的路径
   * @param {Object} transition 转场动画
   * @returns {void} 无返回
   */
  go: function /*istanbul ignore next*/go(path, transition) {
    this._transition = transition;
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
        item = {
          component: item
        };
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
    this.app.$appendTo(element);
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
  owner.directive('link', LinkDirective);
};

module.exports = Router;