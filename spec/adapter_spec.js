describe("Ember.Test.JasmineAdapter", function() {
  var adapter = Ember.Test.adapter;

  it("uses the jasmine adapter", function() {
    expect(adapter).toBeTypeof(Ember.Test.JasmineAdapter);
  });

  describe("asyncStart", function() {
    beforeEach(function() {
      spyOn(jasmine.Spec.prototype, "waitsFor");
      adapter.asyncStart();
    });

    it("sets asyncRunning to true", function() {
      expect(adapter.asyncRunning).toBeTrue();
    });

    it("calls jasmine 'waitsFor' method", function() {
      expect(jasmine.Spec.prototype.waitsFor).toHaveBeenCalledWith(adapter.asyncComplete);
    });
  });

  describe("asyncComplete", function() {
    beforeEach(function() {
      adapter.asyncRunning = true;
    });

    it("returns the boolean opposite of asyncRunning", function() {
      expect(adapter.asyncComplete()).toBeFalse();
      adapter.asyncRunning = false;
      expect(adapter.asyncComplete()).toBeTrue();
    });
  });

  describe("asyncEnd", function() {
    beforeEach(function() {
      adapter.asyncEnd();
    });

    it("sets asyncRunning to false", function() {
      expect(adapter.asyncRunning).toBeFalse();
    });
  });

  describe("exception", function() {
    it("calls Ember.inspect with the error", function() {
      adapter.exception("");
    });
  });
});