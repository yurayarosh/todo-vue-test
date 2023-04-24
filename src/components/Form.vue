<template>
  <form class="form" v-on="$listeners" v-bind="$attrs">
    <slot />
  </form>
</template>

<style lang="scss" scoped>
.form {
  border-radius: 5px;
  background-color: #c4c4c4;
  overflow: hidden;
}

.form-top {
  background-color: #a5a5a5;
  padding: 15px 25px;
  text-align: center;
  color: #5f5f5f;
}

.form-body {
  padding: 15px 25px 30px;

  > p {
    margin-bottom: 14px;
    color: #5f5f5f;
    font-size: 15px;
    line-height: 1.4;
  }
}

.form-field {
  > .btn {
    width: 100%;
  }

  &:not(:last-child) {
    margin-bottom: 20px;
  }

  &.is-btn {
    margin-top: 25px;
  }

  &.is-error {
    color: red;
  }
}
</style>
