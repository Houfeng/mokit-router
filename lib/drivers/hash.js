/*istanbul ignore next*/'use strict';

var mokit = require('mokit-plugin').mokit;
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
    location.hash = SEPARATOR + path;
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