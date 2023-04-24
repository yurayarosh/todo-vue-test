<template>
  <div class="select">
    <select v-bind="$attrs" v-on="listeners">
      <slot />
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Select',
  inheritAttrs: false,
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
      this.$emit('input', (event.target as HTMLSelectElement).value);
    },
  },
});
</script>

<style lang="scss" scoped>
.select {
  select {
    width: 100%;
    background-color: #fff;
    border-radius: 5px;
    border: 0;
    height: 41px;
    padding: 5px 10px;
    cursor: pointer;
  }
}
</style>
