jasmine-ember-testing
=====================

Enables use of ember integration test helpers for the Jasmine test suite by adding new Ember.js Test.Adapter for the Jasmine testing framework

### Nuances:

- In ember.js (Need to enable all relevant features for the helper jasmine tests):

```
Ember.FEATURES["reduceComputed-non-array-dependencies"] = true;
Ember.FEATURES["ember-testing-lazy-routing"] = true;
Ember.FEATURES["ember-testing-wait-hooks"] = true;
Ember.FEATURES["ember-testing-routing-helpers"] = true;
```

- Added underscore.js to implement equivalent toBeDeepEqual matcher that is in QUnit

### TODOs:

- Implement ```expectAssertion```, used in qunit_configuration within ember.js testing framework.