/*istanbul ignore next*/'use strict';

var mokit = require('mokit-plugin').mokit;
var Directive = mokit.Directive;
var EventEmitter = mokit.EventEmitter;

module.exports = new Directive({
  literal: true,

  bind: function /*istanbul ignore next*/bind() {
    var eventTarget = this.node.$target || this.node;
    this.emiter = new EventEmitter(eventTarget);
    this.emiter.addListener(this.decorates[0] || 'click', function () {
      if (!this.scope || !this.scope.$router) return;
      this.scope.$router.go(this.path, eventTarget.transition);
    }.bind(this), false);
  },

  unbind: function /*istanbul ignore next*/unbind() {
    this.emiter.removeListener();
  },

  update: function /*istanbul ignore next*/update(path) {
    this.path = path;
  }

});