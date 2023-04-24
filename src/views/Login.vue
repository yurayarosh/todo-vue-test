<template>
  <div class="form-fullpage">
    <Form @submit.prevent="onSubmit">
      <div class="form-top">description</div>

      <div class="form-body">
        <p>description</p>

        <div class="form-field">
          <Input placeholder="Username" v-model="username" />
        </div>
        <div class="form-field">
          <Input placeholder="Phone Number" v-model="phone" />
        </div>
        <div v-show="hasError" class="form-field is-error">Login error</div>
        <div class="form-field is-btn">
          <Button type="submit" :disabled="!isValid">Register</Button>
        </div>
      </div>
    </Form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Input from '../components/Input.vue';
import Button from '../components/Button.vue';
import Form from '../components/Form.vue';
import { baseApi } from '../api/api';
import { IUser } from '../types/users';
import { RouteNames } from '../router';

export default defineComponent({
  name: 'Login',
  components: { Input, Button, Form },
  data() {
    return {
      username: '',
      phone: '',
      isTouched: false,
      hasError: false,
    };
  },
  computed: {
    isValid() {
      return this.username.length > 0 && this.phone.length > 0;
    },
  },
  watch: {
    username(val, prevVal) {
      const res = /^[a-zA-Z_.\-]+$/.test(val);
      if (!res) {
        this.username = val.length === 0 ? '' : prevVal;
      }
    },
    phone(val, prevVal) {
      const res = /^[0-9+#() x\-]*$/.test(val);
      if (!res) {
        this.phone = val.length === 0 ? '' : prevVal;
      }
    },
  },
  methods: {
    async findUser() {
      return await baseApi
        .get(`/users?username=${this.username}&phone=${this.phone}`)
        .then(res => (res.data as IUser[])[0] || null)
        .catch(err => {
          console.error(err);
          return null;
        });
    },
    async onSubmit() {
      this.isTouched = true;
      if (!this.isValid) return;

      const user = await this.findUser();

      if (!user) {
        this.hasError = true;
      } else {
        this.hasError = false;
        localStorage.setItem('userId', user.id.toString());
        this.$router.push(`${RouteNames.USER}/${user.id}`);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.form-fullpage {
  display: flex;

  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;

  background-color: rgba(#000, 0.5);
  padding: 15px;
  overflow: auto;

  .form {
    margin: auto;
    width: 100%;
    max-width: 447px;
  }
}
</style>
