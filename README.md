Jasmine - Test.Adapter for Ember.js test harness
=====================

Implements ember integration test helpers for the Jasmine test suite.

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