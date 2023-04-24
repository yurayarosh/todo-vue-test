<template>
  <div class="create-todo">
    <Form @submit.prevent="onSubmit">
      <div class="form-top"><h2>Create todo</h2></div>
      <div class="form-body">
        <div class="form-field">
          <Input type="text" placeholder="User id" v-model="userId" />
        </div>

        <div class="form-field">
          <Input type="text" placeholder="Title" v-model="title" />
        </div>

        <div class="form-field is-btn">
          <Button type="submit" :disabled="!userId || !title">Add</Button>
        </div>
      </div>
    </Form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { baseApi } from '../api/api';
import { ITodo } from '../types/todo';
import Input from './Input.vue';
import Button from './Button.vue';
import Form from './Form.vue';

export default defineComponent({
  name: 'CreateTodo',
  components: { Form, Input, Button },
  data() {
    return {
      title: '',
      userId: '',
    };
  },
  methods: {
    onSubmit() {
      if (!this.title || !this.userId) return;

      baseApi
        .post('/todos', {
          userId: this.userId,
          title: this.title,
        })
        .then(res => {
          const newTodo = res.data as ITodo;

          this.$emit('updateTodosList', newTodo);

          this.title = ''
          this.userId = ''
        })
        .catch(err => console.error(err));
    },
  },
});
</script>
