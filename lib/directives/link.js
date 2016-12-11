const mokit = require('mokit-plugin').mokit;
const Directive = mokit.Directive;
const EventEmitter = mokit.EventEmitter;

module.exports = new Directive({
  name: 'link',
  type: Directive.TYPE_ATTRIBUTE,
  literal: true,

  bind: function () {
    let eventTarget = this.node.$target || this.node;
    this.emiter = new EventEmitter(eventTarget);
    this.emiter.addListener(this.decorates[0] || 'click', function () {
      if (!this.scope || !this.scope.$router) return;
      this.scope.$router.go(this.path);
    }.bind(this), false);
  },

  unbind: function () {
    this.emiter.removeListener();
  },

  update: function (path) {
    this.path = path;
  }

});