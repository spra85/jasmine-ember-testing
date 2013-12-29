Ember.Test.adapter = Ember.Test.JasmineAdapter.create();

beforeEach(function() {
  this.addMatchers({
    toBeTrue: function() {
      return this.actual === true;
    },

    toBeFalse: function() {
      return this.actual === false;
    },

    toBeDeepEqual: function(expected) {
      return _.isEqual(this.actual, expected);
    },

    toHaveClass: function(className) {
      return this.actual.hasClass(className);
    },

    toBeHidden: function() {
      return !this.actual.is(":visible");
    },

    toBeVisible: function() {
      return this.actual.is(":visible");
    },

    toExist: function() {
      return this.actual.exists();
    },

    toHaveText: function(text) {
      return this.actual.text().trim() === text;
    },

    toHaveHTML: function(html) {
      return this.actual.html().trim() === html;
    },

    toBeEmpty: function() {
      return this.actual.length === 0;
    },

    toBeObject: function() {
      return compareConstructor(this.actual, Object);
    },

    toBeArray: function() {
      return compareConstructor(this.actual, Array);
    },

    toBeNumber: function() {
      return Object.prototype.toString.call(this.actual) == '[object Number]';
    },

    toBeString: function() {
      return compareConstructor(this.actual, String);
    },

    toBeFunction: function() {
      return compareConstructor(this.actual, Function);
    },

    toBeTypeof: function(b) {
      return compareConstructor(this.actual, b);
    },

    toBeJqueryWrapped: function(selector) {
      if (selector && this.actual && this.actual.selector !== selector) return false;
      return checkElementExistence(this.actual);
    },

    toBeChecked: function() {
      return this.actual.prop("checked");
    },

    toHaveAttribute: function(attr, value) {
      if (!value) {
        return !!this.actual.attr(attr);
      } else {
        return this.actual.attr(attr) === value;
      }
    }
  });

  function compareConstructor(a, b) {
    if (!a) {
      return false;
    }
    return a.constructor == b;
  }

  function checkElementExistence(element) {
    if (typeof element === "undefined") return false;
    if (typeof element.selector === "undefined") return false;
    if (!element.length) return false;
    return compareConstructor(element, jQuery);
  }
});