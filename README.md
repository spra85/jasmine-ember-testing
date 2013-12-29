jasmine-ember-testing
=====================

Implements ember integration test helpers for the Jasmine test suite based on @pixelhandler's feedback in this since closed pull request (https://github.com/emberjs/ember.js/pull/2626)

# Nuances of writing this:

- In ember.js:

```
Ember.FEATURES["reduceComputed-non-array-dependencies"] = true;
Ember.FEATURES["ember-testing-lazy-routing"] = true;
Ember.FEATURES["ember-testing-wait-hooks"] = true;
Ember.FEATURES["ember-testing-routing-helpers"] = true;
```

- Added underscore.js to implement equivalent toBeDeepEqual matcher that is in QUnit

# TODOs:

- Implement ```expectAssertion```, used in qunit_configuration within ember.js testing framework.