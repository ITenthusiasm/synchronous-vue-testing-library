import Vue from "vue";
import { render, fireEvent, waitFor } from "@testing-library/vue";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import EventsTester from "../EventsTester.vue";

// Silence fireEvent warnings
jest.spyOn(console, "warn").mockImplementation();

describe("Events Tester", () => {
  /* Basic DOM updates */
  test("Select interactions (basic)", () => {
    const selectOption = "Red";

    const { getByLabelText } = render(EventsTester);

    const select = getByLabelText(/select/i);

    userEvent.selectOptions(select, selectOption);
    expect(select).toHaveValue(selectOption);
  });

  test("Input interactions (basic)", () => {
    const userInput = "userInput";
    const fireInput = "fireInput";
    const fakeInputEvent = { target: { value: fireInput } };

    const { getByLabelText } = render(EventsTester);

    const input = getByLabelText(/input/i);

    fireEvent.input(input, fakeInputEvent);
    expect(input).toHaveValue(fireInput);

    userEvent.clear(input);
    expect(input).toHaveValue("");

    userEvent.type(input, userInput);
    expect(input).toHaveValue(userInput);
  });

  test("Radio interactions (basic)", () => {
    const fakeChangeEvent = { target: { checked: true } };
    const { getByLabelText } = render(EventsTester);

    const radio1 = getByLabelText(/one/i);
    fireEvent.change(radio1, fakeChangeEvent);
    expect(radio1).toBeChecked();

    const radio2 = getByLabelText(/two/i);
    userEvent.click(radio2);
    expect(radio2).toBeChecked();

    // Note: The previous radio button was not unchecked. This could be due to
    // v-model, and more specifically not using fireEvent.update
  });

  /* ONE store interaction */
  test("Dispatching an action", () => {
    const selectOption = "Red";
    const textInput = "TEST_TEXT";
    const store = { actions: { someAction: jest.fn() } };

    const { getByLabelText, getByText } = render(EventsTester, { store });

    const select = getByLabelText(/select/i);
    const input = getByLabelText(/input/i);
    const radio1 = getByLabelText(/one/i);
    const dispatchButton = getByText(/dispatch action/i);

    userEvent.selectOptions(select, "Red");
    userEvent.type(input, textInput);
    userEvent.click(radio1);
    userEvent.click(dispatchButton);

    expect(store.actions.someAction.mock.calls[0][1]).toMatchObject({
      selectOption,
      textInput,
      radioOption: radio1.value, // It is an ANTI-PATTERN to access "value" directly. Done for demonstration purposes only.
    });
  });

  /* Vue complications related to state and v-model */
  test("Altering values via state instead of DOM", async () => {
    const selectOption = "Red";
    const vueSelectOption = "Blue";

    const textInput = "TEST_TEXT";
    const vueTextInput = "VUE_TEST_TEXT";

    const { getByLabelText, getByText } = render(EventsTester);

    const select = getByLabelText(/select/i);
    const input = getByLabelText(/input/i);
    const stateButton = getByText(/change values/i);

    userEvent.selectOptions(select, selectOption);
    userEvent.type(input, textInput);
    expect(select).toHaveValue(selectOption);
    expect(input).toHaveValue(textInput);

    // Add an awaited userEvent OR fireEvent to make this test pass
    // NOTE: IT DOES NOT MATTER if the function is asynchronous. It only matters if some process is `await`ed.
    await userEvent.click(stateButton);
    expect(select).toHaveValue(vueSelectOption);
    expect(input).toHaveValue(vueTextInput);
  });

  test("Radios correctly being altered via v-model", () => {
    const { getByLabelText } = render(EventsTester);

    const radio1 = getByLabelText(/one/i);
    const radio2 = getByLabelText(/two/i);

    userEvent.click(radio1);
    expect(radio1).toBeChecked();

    userEvent.click(radio2);
    expect(radio2).toBeChecked();

    // This is do to Vue's asynchronous behavior
    // `await`ing Vue.nextTick() will not work this time
    // `await`ing userEvent or fireEvent.change will not work this time
    // Notice that because waitFor is used, async functions are unnecessary
    waitFor(() => {
      expect(radio1).not.toBeChecked();
    });
  });

  it("Increments count when button is clicked", async () => {
    const { getByText, getByLabelText } = render(EventsTester);

    const counter = getByLabelText(/count/i);
    const countButton = getByText("+");

    // After awaiting fireEvent
    await fireEvent.click(countButton);
    expect(counter.innerHTML).toBe("1");

    // After awaiting userEvent
    await userEvent.click(countButton);
    expect(counter.innerHTML).toBe("2");

    // After awaiting Vue.nextTick()
    userEvent.click(countButton);
    await Vue.nextTick();
    expect(counter.innerHTML).toBe("3");

    // Using the safe `waitFor` function
    userEvent.click(countButton);
    waitFor(() => expect(counter.innerHTML).toBe("4"));
  });
});
