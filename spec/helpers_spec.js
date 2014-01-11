var set = Ember.set, App, originalAdapter = Ember.Test.adapter;

function cleanup(){
  Ember.Test.adapter = originalAdapter;

  if (App) {
    App.removeTestHelpers();
    Ember.run(App, App.destroy);
    App = null;
  }

  Ember.run(function(){
    Ember.$(document).off('ajaxStart');
    Ember.$(document).off('ajaxStop');
  });

  Ember.TEMPLATES = {};
}

function assertHelpers(application, helperContainer, expected){
  if (!helperContainer) { helperContainer = window; }
  if (expected === undefined) { expected = true; }

  function checkHelperPresent(helper, expected){
    var presentInHelperContainer = !!helperContainer[helper],
        presentInTestHelpers = !!application.testHelpers[helper];

    //console.log("Expected '" + helper + "' to be present in the helper container (defaults to window).");
    expect(presentInHelperContainer).toEqual(expected);
    //console.log("Expected '" + helper + "' to be present in App.testHelpers.");
    expect(presentInTestHelpers).toEqual(expected);
  }

  checkHelperPresent('visit', expected);
  checkHelperPresent('click', expected);
  checkHelperPresent('keyEvent', expected);
  checkHelperPresent('fillIn', expected);
  checkHelperPresent('wait', expected);

  if (Ember.FEATURES.isEnabled("ember-testing-triggerEvent-helper")) {
    checkHelperPresent('triggerEvent', expected);
  }
}

function assertNoHelpers(application, helperContainer) {
  assertHelpers(application, helperContainer, false);
}

describe("ember-testing Helpers", function() {

  beforeEach(function() {
    cleanup();
  });

  afterEach(function() {
    cleanup();
  });

  var AsyncTest = {
    counter: 0,
    complete: false,

    testAsync: function() {
      AsyncTest.counter++;
      AsyncTest.complete = true;
      console.log("Async test method complete");
    },

    isAsyncComplete: function() {
      console.log("isAsyncComplete", AsyncTest.complete);
      return AsyncTest.complete;
    }
  };

  it("implements jasmine async stuff", function() {
    console.log("start test feature");
    setTimeout(AsyncTest.testAsync, 1000);
    waitsFor(AsyncTest.isAsyncComplete, "test async to have run", 5000);

    runs(function(){
      console.log("runs block post waitFor asyncComplete");
      expect(AsyncTest.counter).toEqual(1);
    });
  });

  it("Ember.Application#injectTestHelpers/#removeTestHelpers", function() {
    App = Ember.run(Ember.Application, Ember.Application.create);
    assertNoHelpers(App);

    App.injectTestHelpers();
    assertHelpers(App);

    App.removeTestHelpers();
    assertNoHelpers(App);
  });

  it("Ember.Application#setupForTesting", function() {
    Ember.run(function() {
      App = Ember.Application.create();
      App.setupForTesting();
    });

    expect(App.__container__.lookup('router:main').location.implementation).toEqual("none");
  });

  if (Ember.FEATURES.isEnabled('ember-testing-lazy-routing')){
    it("Ember.Application.setupForTesting sets the application to `testing`.", function(){
      Ember.run(function() {
        App = Ember.Application.create();
        App.setupForTesting();
      });

      expect(App.testing).toEqual(true);
    });

    it("Ember.Application.setupForTesting leaves the system in a deferred state.", function(){
      Ember.run(function() {
        App = Ember.Application.create();
        App.setupForTesting();
      });

      expect(App._readinessDeferrals).toEqual(1);
    });

    it("App.reset() after Application.setupForTesting leaves the system in a deferred state.", function(){
      Ember.run(function() {
        App = Ember.Application.create();
        App.setupForTesting();
      });

      expect(App._readinessDeferrals).toEqual(1);

      App.reset();
      expect(App._readinessDeferrals).toEqual(1);
    });

    it("`visit` advances readiness.", function(){
      Ember.run(function() {
        App = Ember.Application.create();
        App.setupForTesting();
        App.injectTestHelpers();
      });

      expect(App._readinessDeferrals).toEqual(1);

      App.testHelpers.visit('/').then(function(){
        expect(App._readinessDeferrals).toEqual(0);
      });
    });
  }

  it("`wait` helper can be passed a resolution value", function() {
    var promise, wait;

    promise = new Ember.RSVP.Promise(function(resolve) {
      Ember.run(null, resolve, 'promise');
    });

    Ember.run(function() {
      App = Ember.Application.create();
      App.setupForTesting();
    });

    App.injectTestHelpers();

    Ember.run(App, App.advanceReadiness);

    wait = App.testHelpers.wait;

    wait('text').then(function(val) {
      expect(val).toEqual("text");
      return wait(1);
    }).then(function(val) {
      expect(val).toEqual(1);
      return wait({ age: 10 });
    }).then(function(val) {
      expect(val).toBeDeepEqual({ age: 10 });
      return wait(promise);
    }).then(function(val) {
      expect(val).toEqual("promise");
    });

  });

  it("`click` triggers appropriate events in order", function() {
    var click, wait, events;

    Ember.run(function() {
      App = Ember.Application.create();
      App.setupForTesting();
    });

    App.IndexView = Ember.View.extend({
      classNames: 'index-view',

      didInsertElement: function() {
        this.$().on('mousedown focusin mouseup click', function(e) {
          events.push(e.type);
        });
      },

      Checkbox: Ember.Checkbox.extend({
        click: function() {
          events.push('click:' + this.get('checked'));
        },

        change: function() {
          events.push('change:' + this.get('checked'));
        }
      })
    });

    Ember.TEMPLATES.index = Ember.Handlebars.compile('{{input type="text"}} {{view view.Checkbox}} {{textarea}}');

    App.injectTestHelpers();

    Ember.run(App, App.advanceReadiness);

    click = App.testHelpers.click;
    wait  = App.testHelpers.wait;

    wait().then(function() {
      events = [];
      return click('.index-view');
    }).then(function() {
      expect(events).toBeDeepEqual(['mousedown', 'mouseup', 'click']);
    }).then(function() {
      events = [];
      return click('.index-view input[type=text]');
    }).then(function() {
      expect(events).toBeDeepEqual(
        ['mousedown', 'focusin', 'mouseup', 'click']);
    }).then(function() {
      events = [];
      return click('.index-view textarea');
    }).then(function() {
      expect(events).toBeDeepEqual(
        ['mousedown', 'focusin', 'mouseup', 'click']);
    }).then(function() {
      // In IE (< 8), the change event only fires when the value changes before element focused.
      Ember.$('.index-view input[type=checkbox]').focus();
      events = [];
      return click('.index-view input[type=checkbox]');
    }).then(function() {
      // i.e. mousedown, mouseup, change:true, click, click:true
      // Firefox differs so we can't assert the exact ordering here.
      // See https://bugzilla.mozilla.org/show_bug.cgi?id=843554.
      expect(events.length).toEqual(5);
    });
  });

  it("Ember.Application#injectTestHelpers", function() {
    var documentEvents;

    Ember.run(function() {
      App = Ember.Application.create();
      App.setupForTesting();
    });

    documentEvents = Ember.$._data(document, 'events');

    if (!documentEvents) {
      documentEvents = {};
    }

    expect(documentEvents['ajaxStart']).toBeUndefined();
    expect(documentEvents['ajaxStop']).toBeUndefined();

    App.injectTestHelpers();
    documentEvents = Ember.$._data(document, 'events');

    expect(documentEvents['ajaxStart'].length).toEqual(1);
    expect(documentEvents['ajaxStop'].length).toEqual(1);
  });

  it("Ember.Application#injectTestHelpers calls callbacks registered with onInjectHelpers", function(){
    var injected = 0;

    Ember.Test.onInjectHelpers(function(){
      injected++;
    });

    Ember.run(function() {
      App = Ember.Application.create();
      App.setupForTesting();
    });

    expect(injected).toEqual(0);

    App.injectTestHelpers();

    expect(injected).toEqual(1);
  });

  it("Ember.Application#injectTestHelpers adds helpers to provided object.", function(){
    var helpers = {};

    Ember.run(function() {
      App = Ember.Application.create();
      App.setupForTesting();
    });

    App.injectTestHelpers(helpers);
    assertHelpers(App, helpers);

    App.removeTestHelpers();
    assertNoHelpers(App, helpers);
  });

  it("Ember.Application#removeTestHelpers resets the helperContainer's original values", function(){
    var helpers = {visit: 'snazzleflabber'};

    Ember.run(function() {
      App = Ember.Application.create();
      App.setupForTesting();
    });

    App.injectTestHelpers(helpers);

    expect(helpers["visit"]).not.toEqual("snazzleflabber");
    App.removeTestHelpers();

    expect(helpers["visit"]).toEqual("snazzleflabber");
  });

  if (Ember.FEATURES.isEnabled("ember-testing-wait-hooks")) {
    it("`wait` respects registerWaiters", function() {
      var counter=0;
      function waiter() {
        return ++counter > 2;
      }

      Ember.run(function() {
        App = Ember.Application.create();
        App.setupForTesting();
      });

      App.injectTestHelpers();

      Ember.run(App, App.advanceReadiness);
      Ember.Test.registerWaiter(waiter);

      App.testHelpers.wait().then(function() {
        expect(waiter()).toBeTrue();
        Ember.Test.unregisterWaiter(waiter);
        expect(Ember.Test.waiters.length).toEqual(0);
      });
    });

    it("`wait` waits for outstanding timers", function() {
      var wait_done = false;

      Ember.run(function() {
        App = Ember.Application.create();
        App.setupForTesting();
      });

      App.injectTestHelpers();

      Ember.run(App, App.advanceReadiness);

      Ember.run.later(this, function() {
        wait_done = true;
      }, 500);

      App.testHelpers.wait().then(function() {
        expect(wait_done).toBeTrue();
      });
    });


    it("`wait` respects registerWaiters with optional context", function() {
      var obj = {
        counter: 0,
        ready: function() {
    return ++this.counter > 2;
        }
      };

      Ember.run(function() {
        App = Ember.Application.create();
        App.setupForTesting();
      });

      App.injectTestHelpers();

      Ember.run(App, App.advanceReadiness);
      Ember.Test.registerWaiter(obj, obj.ready);

      App.testHelpers.wait().then(function() {
        expect(obj.ready()).toBeTrue();
        Ember.Test.unregisterWaiter(obj, obj.ready);
        expect(Ember.Test.waiters.length).toEqual(0);
      });


    });
  }
});

if (Ember.FEATURES.isEnabled('ember-testing-routing-helpers')){

  describe("ember-testing routing helpers", function() {
    beforeEach(function() {
      cleanup();

      Ember.run(function() {
        App = Ember.Application.create();
        App.Router = Ember.Router.extend({
          location: 'none'
        });

        App.Router.map(function() {
          this.resource("posts", function() {
            this.route("new");
          });
        });

        App.setupForTesting();
      });

      App.injectTestHelpers();
      Ember.run(App, 'advanceReadiness');
    });

    afterEach(function() {
      cleanup();
    });

    it("currentRouteName for '/'", function(){
      App.testHelpers.visit('/').then(function(){
        expect(App.testHelpers.currentRouteName()).toEqual('index');
        expect(App.testHelpers.currentPath()).toEqual('index');
        expect(App.testHelpers.currentURL()).toEqual('/');
      });
    });


    it("currentRouteName for '/posts'", function(){
      App.testHelpers.visit('/posts').then(function(){
        expect(App.testHelpers.currentRouteName()).toEqual('posts.index');
        expect(App.testHelpers.currentPath()).toEqual('posts.index');
        expect(App.testHelpers.currentURL()).toEqual('/posts');
      });
    });

    it("currentRouteName for '/posts/new'", function(){
      App.testHelpers.visit('/posts/new').then(function(){
        expect(App.testHelpers.currentRouteName()).toEqual('posts.new');
        expect(App.testHelpers.currentPath()).toEqual('posts.new');
        expect(App.testHelpers.currentURL()).toEqual('/posts/new');
      });
    });
  });

}

describe("ember-testing pendingAjaxRequests", function() {
  beforeEach(function() {
    cleanup();

    Ember.run(function() {
      App = Ember.Application.create();
      App.setupForTesting();
    });

    App.injectTestHelpers();
  });

  afterEach(function() {
    cleanup();
  });

  it("pendingAjaxRequests is incremented on each document ajaxStart event", function() {
    Ember.Test.pendingAjaxRequests = 0;

    Ember.run(function(){
      Ember.$(document).trigger('ajaxStart');
    });

    expect(Ember.Test.pendingAjaxRequests).toEqual(1);
  });

  it("pendingAjaxRequests is decremented on each document ajaxStop event", function() {
    Ember.Test.pendingAjaxRequests = 1;

    Ember.run(function(){
      Ember.$(document).trigger('ajaxStop');
    });

    expect(Ember.Test.pendingAjaxRequests).toEqual(0);
  });

  it("it should raise an assertion error if ajaxStop is called without pendingAjaxRequests", function() {
    Ember.Test.pendingAjaxRequests = 0;

    expectAssertion(function() {
      Ember.run(function(){
        Ember.$(document).trigger('ajaxStop');
      });
    });
  });

});

if (Ember.FEATURES.isEnabled("ember-testing-triggerEvent-helper")) {
  it("`trigger` can be used to trigger arbitrary events", function() {
    var triggerEvent, wait, event;

    Ember.run(function() {
      App = Ember.Application.create();
      App.setupForTesting();
    });

    App.IndexView = Ember.View.extend({
      template: Ember.Handlebars.compile('{{input type="text" id="foo"}}'),

      didInsertElement: function() {
        this.$('#foo').on('blur change', function(e) {
          event = e;
        });
      }
    });

    App.injectTestHelpers();

    Ember.run(App, App.advanceReadiness);

    triggerEvent = App.testHelpers.triggerEvent;
    wait         = App.testHelpers.wait;

    wait().then(function() {
      return triggerEvent('#foo', 'blur');
    }).then(function() {
      expect(event.type).toEqual("blur");
      expect(event.target.getAttribute("id")).toEqual("foo");
    });
  });
}
