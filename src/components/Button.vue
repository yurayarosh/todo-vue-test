<template>
  <button class="btn" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Button',
});
</script>

<style lang="scss" scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  text-align: center;
  font-weight: 500;
  color: #fff;

  border-radius: 5px;
  background-color: #519945;
  padding: 10px;
  min-width: 180px;

  &:disabled {
    opacity: 0.5;
  }
}
</style>
