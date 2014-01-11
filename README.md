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

### Ember & Handlebars Versions

Currently pointing at the latest Ember.js release channel (http://emberjs.com/builds/#/release) for tests and beta for Ember data:

```
// Handlebars
http://builds.handlebarsjs.com.s3.amazonaws.com/handlebars-v1.3.0.js

// Ember
http://builds.emberjs.com/release/ember.js

// Ember Data
http://builds.emberjs.com/beta/ember-data.js
```

### Jasmine Versions

Currently supports Jasmine 1.3

### TODOs:


- Added underscore.js to implement equivalent toBeDeepEqual matcher that is in QUnit.  Really should just implement a stand alone deepEqual function

- Add Travis CI build

- Add support for Jasmine 2.0

### Running Tests

Need to add a headless test suite.  For the time being just open the spec/index.html file in a browser.


## Contributing

1. Fork it ( https://github.com/spra85/jasmine-ember-testing/fork )
2. Create your feature branch (`git checkout -b new-feature`)
3. Commit your changes (`git commit -am 'Fixed X'`)
4. Push to the branch (`git push origin new-feature`)
5. Create new Pull Request