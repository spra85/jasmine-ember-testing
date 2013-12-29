/**
  @class JasmineAdapter
  @namespace Ember.Test
*/
Ember.Test.JasmineAdapter = Ember.Test.Adapter.extend({
  asyncRunning: false,

  asyncStart: function() {
    Ember.Test.adapter.asyncRunning = true;
    waitsFor(Ember.Test.adapter.asyncComplete);
  },

  asyncComplete: function() {
    return !Ember.Test.adapter.asyncRunning;
  },

  asyncEnd: function() {
    Ember.Test.adapter.asyncRunning = false;
  },

  exception: function(error) {
    expect(Ember.inspect(error)).toBeFalsy();
  }
});