# Why `async fireEvent` should be replaced with `await waitFor`

As I'm looking across the various children of the Testing Library family, I'm noticing that many of them are exporting asynchronous versions of `fireEvent` that effectively do the same thing, but differently: They wait for nothing or `FRAMEWORK.tick()` and then return the results of the original `fireEvent`. From personal experience, I think this adds confusion for developers switching between frameworks. As a standard between libraries, I want to advocate for two things: 1) All testing libraries should export _unaltered_ versions of `fireEvent` and 2) All testing library documentations should encourage developers to use `await waitFor(() => expect...)` whenever a JS framework applies updates asynchronously.\* Here are 3 main reasons:

## 1) It more accurately describes what the developer is waiting for

Technically speaking, the developer is not waiting for a random, async, no-op function. Thus, using an "async" version of `fireEvent` that simply adds `await waitFor(() => {})` is somewhat misleading. In reality, the developer is waiting for an update to a Framework's state variable to be properly reflected in the DOM. In the classic counter example, this is more accurately reflected by `await waitFor(() => expect(ELEMENT).toHaveTextContent(VALUE))`. And `await` isn't even necessary if only one check is done.

Note that it's safer to use this approach universally. In peculiar circumstances, like when people use Vue's `v-model`, using "async" versions of the core `fireEvent` functions can sometimes fail. But using `waitFor` always succeeds.

## 2) It increases the comfort of using the `userEvent` library

Doing a quick scan of the Testing Library Discord's comments, `userEvent` seems to be largely preferred over `fireEvent` in most circumstances, and for good reason. But when the implementation of `fireEvent` is desynchronized from the original DTL by adding `await Vue.nextTick()`, `await waitFor(() => {})`, or the like, it becomes unclear whether or not it's okay to use `userEvent`. (In fact, I questioned whether `userEvent` was viable when I first started using the current version of Vue Testing Library.)

If developers are encouraged to use `await waitFor(() => expect...)`, then all the implementations of `fireEvent` can remain in sync with the original ones. This in turn means that developers will know how to use _both_ `fireEvent` _and_ `userEvent` in _all_ Testing Libraries without any confusion.

## 3) It increases framework agnosticism

When I think of the Testing Library family, I think of a set of tools that work the same. The implementation of `render` will naturally change between frameworks, but the core set of tools given to the user should be as similar as possible between the Testing Libraries. The `fireEvent` portion in particular, in my opinion, should be geared strictly towards simulating user interactions with the DOM. It shouldn't try to be concerned with the implementation details of a framework, because those are concerns of the framework, not the "user" simulating an event.

Leaving a framework's asynchronous issues up to the developer (through an encouraged `waitFor` solution) further clarifies what is an `X Framework` issue vs. a `Testing Library` issue; it helps people expect the same experience whenever they start testing a new framework; and it gives a common solution to all async issues related to a framework.

##### \* I'm specifically advocating this for frameworks that render to the DOM. So tools like Native Testing Library are naturally excluded from this.
