// Defined in ember-dev (https://github.com/emberjs/ember-dev)
// Add `expectAssertion` which replaces
// `raises` to detect uncatchable assertions
function expectAssertion(fn, expectedMessage) {
  var originalAssert = Ember.assert,
    actualMessage, actualTest,
    arity, sawAssertion;

  var AssertionFailedError = new Error('AssertionFailed');

  try {
    Ember.assert = function(message, test) {
      arity = arguments.length;
      actualMessage = message;
      actualTest = test;

      if (!test) {
        throw AssertionFailedError;
      }
    };

    try {
      fn();
    } catch(error) {
      if (error === AssertionFailedError) {
        sawAssertion = true;
      } else {
        throw error;
      }
    }

    if (!sawAssertion) {
      expect("Expected Ember.assert: '" + expectedMessage + "', but no assertions were run").toBeTrue();
    } else if (arity === 2) {

      if (expectedMessage) {
        if (expectedMessage instanceof RegExp) {
          expect(expectedMessage.test(actualMessage)).toBeTrue();
        } else{
          expect(actualMessage).toEqual(expectedMessage);
        }
      } else {
        expect(!actualTest).toBeTrue();
      }
    } else if (arity === 1) {
      expect(!actualTest).toBeTrue();
    } else {
      expect('Ember.assert was called without the assertion').toBeTrue();
    }

  } finally {
    Ember.assert = originalAssert;
  }
}