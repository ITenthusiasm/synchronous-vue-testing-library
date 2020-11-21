# synchronous-vue-testing-library

A **temporary** repository intended to show the ways Vue Testing Library can be used synchronously

## Findings

The purpose of this experiment is to understand under what circumstances `async/await` is necessary and under what circumstances it isn't. So far, the conclusion seems to be this:

- When an update to the DOM occurs normally (eg. a user typing into an input), Vue's state is updated properly without the need to use `async/await`.
- When Vue updates a state variable that influences the DOM, the DOM is _not_ updated synchronously, and `async/await` is needed for the related test.

These findings seem to make sense when considering [the documentation](https://vue-test-utils.vuejs.org/guides/#testing-asynchronous-behavior), where the only asynchronous concerns seem to be 1) Vue's updates and 2) regular asynchronous functions.

## Test Structure

The tests are dividend into three categories:

1. **Synchronous Tests** (3). These are synchronous tests where a normal DOM update changes the Vue state variables.
2. **Vuex Tests** (1). These are synchronous tests that check usage of Vuex.
3. **Asynchronous Tests** (3). These are asynchronous tests where Vue updates state variables that influence the DOM.
