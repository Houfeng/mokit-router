/*istanbul ignore next*/'use strict';

var mokit = require('mokit-plugin').mokit;
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