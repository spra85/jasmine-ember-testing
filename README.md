jasmine-ember-testing
=====================

Enables use of ember integration test helpers for the Jasmine test suite by adding a new Ember.js Test.Adapter described at the bottom of the [Ember.js Testing Guide](http://emberjs.com/guides/testing/integration/) for the Jasmine testing framework.

Uses principles of testing Jasmine asynchronous specs as described [here](https://github.com/pivotal/jasmine/wiki/Asynchronous-specs)

### Using

In your equivalent Jasmine spec_helper.js, you need to set the Ember test adapter to the Jasmine adapter:

```
Ember.Test.adapter = Ember.Test.JasmineAdapter.create();
```

In a Jasmine test runner debug console, ```Ember.test.adapter``` should be an instance of the JasmineAdapter, not the default QUnit Test Adapter.

### TODOs:

- In ember.js (Need to enable all relevant features for the helper jasmine tests)  This is currently managed in Ember core through features.json:

```
Ember.FEATURES["reduceComputed-non-array-dependencies"] = true;
Ember.FEATURES["ember-testing-lazy-routing"] = true;
Ember.FEATURES["ember-testing-wait-hooks"] = true;
Ember.FEATURES["ember-testing-routing-helpers"] = true;
```

- Added underscore.js to implement equivalent toBeDeepEqual matcher that is in QUnit.  Really should just implement a stand alone deepEqual function

- Implement ```expectAssertion```, used in qunit_configuration within ember.js testing framework.

## Contributing

1. Fork it ( https://github.com/spra85/jasmine-ember-testing/fork )
2. Create your feature branch (`git checkout -b new-feature`)
3. Commit your changes (`git commit -am 'Fixed X'`)
4. Push to the branch (`git push origin new-feature`)
5. Create new Pull Request