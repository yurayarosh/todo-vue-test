<template>
  <div class="input">
    <input :value="value" v-bind="$attrs" v-on="listeners" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Input',

  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number],
    },
    id: {
      type: String,
    },
  },
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: this.updateValue,
      };
    },
  },
  methods: {
    updateValue(event: InputEvent) {
      this.$emit('input', (event.target as HTMLInputElement).value);
    },
  },
});
</script>

<style lang="scss" scoped>
.input {
  input {
    width: 100%;
    background-color: #fff;
    border-radius: 5px;
    height: 41px;
    padding: 5px 10px;
  }
}
</style>
