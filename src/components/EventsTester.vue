<template>
  <div>
    <!-- Counter -->
    <div aria-label="count">{{ count }}</div>
    <button @click="handleClick()">+</button>

    <!-- Select -->
    <label for="select">Select</label>
    <select id="select" v-model="selectOption">
      <option value="" disabled>Select Something</option>
      <option value="Red">Red</option>
      <option value="Blue">Blue</option>
    </select>

    <!-- Text Input -->
    <label for="input">Input</label>
    <input id="input" type="text" v-model="textInput" />

    <!-- Radio Input -->
    <label for="one">One</label>
    <input type="radio" id="one" value="One" v-model="radioOption" />

    <label for="two">Two</label>
    <input type="radio" id="two" value="Two" v-model="radioOption" />

    <label for="three">Three</label>
    <input type="radio" id="three" value="Three" v-model="radioOption" />

    <!-- Button for Dispatching Actions -->
    <button @click="dispatchAction()">Dispatch Action</button>

    <!-- Button for forcing Vue state updates -->
    <button @click="changeValues()">Change Values</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Counter",
  data() {
    return {
      count: 0,
      selectOption: "",
      textInput: "",
      radioOption: "",
    };
  },
  methods: {
    handleClick(): void {
      this.count = this.count + 1;
    },
    dispatchAction(): void {
      const data = {
        count: this.count,
        selectOption: this.selectOption,
        textInput: this.textInput,
        radioOption: this.radioOption,
      };

      this.$store.dispatch("someAction", data);
    },
    changeValues(): void {
      this.textInput = "VUE_TEST_TEXT";
      this.selectOption = "Blue";
    },
  },
});
</script>
