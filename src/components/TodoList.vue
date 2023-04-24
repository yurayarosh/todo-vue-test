<template>
  <div>
    <CreateTodo @updateTodosList="updateTodosList" />

    <div class="todo-wrap">
      <div class="top">
        <Select v-model="filter">
          <option value="placeholder" hidden disabled>Filter</option>
          <option value="All">All</option>
          <option value="Completed">Completed</option>
          <option value="Uncompleted">Uncompleted</option>
          <option value="Favorites">Favorites</option>
        </Select>

        <Select v-if="users.length > 0" v-model="filterUser">
          <option value="placeholder" hidden disabled>Filter by user</option>
          <option value="All">All</option>
          <option v-for="user in users" :key="user.id" :value="user.id">{{ user.id }}</option>
        </Select>

        <Input type="search" placeholder="Search todo" v-model="searchValue" />
      </div>

      <div class="list-wrap" :class="{ 'is-loading': isLoading }">
        <Loader v-if="isLoading" class="loader" color="#fff" />

        <ul v-if="todosList.length > 0" class="list">
          <li v-for="todo in todosList" :key="todo.id" class="todo-card">
            <p class="title">{{ todo.title }}</p>
            <div><strong>Completed:</strong> {{ todo.completed }}</div>
            <label class="checkbox"
              ><strong>Favorite:</strong>
              <input
                type="checkbox"
                :value="todo.id"
                @change="onFavoriteChange"
                :checked="todo.favorite"
            /></label>
          </li>
        </ul>

        <p v-else>There are no items with the chosen parameters.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CreateComponentPublicInstance, defineComponent } from 'vue';
import { debounce } from 'throttle-debounce';

import { ITodo, TodoFilters } from '../types/todo';
import Loader from '../components/Loader.vue';
import CreateTodo from '../components/CreateTodo.vue';
import Input from '../components/Input.vue';
import Select from '../components/Select.vue';
import { baseApi } from '../api/api';
import { IUser } from '../types/users';
import deleteQueryMixin from '../mixins/deleteQueryMixin';

interface ITodoExt extends ITodo {
  favorite: boolean;
}

export default defineComponent({
  name: 'TodoList',
  components: { Loader, CreateTodo, Input, Select },
  mixins: [deleteQueryMixin],
  data() {
    return {
      filter: this.$route.query.filter || 'placeholder',
      filterUser: this.$route.query.filterUser || 'placeholder',
      searchValue: this.$route.query.search || '',
      isLoading: true,
      todosList: [] as ITodoExt[],
      todosListFull: [] as ITodoExt[],
      users: [] as IUser[],
    };
  },
  async mounted() {
    this.users = await this.fetchUsers();
    const todos = await this.fetchTodos();
    this.todosList = todos.map(todo => ({ ...todo, favorite: false }));

    const favoritesIt = localStorage.getItem('favoritesTodos');
    const favorites: number[] | null = favoritesIt && JSON.parse(favoritesIt);

    if (favorites && favorites.length > 0) {
      this.todosList = this.todosList.map(todo => ({
        ...todo,
        favorite: favorites.includes(todo.id),
      }));
    }

    this.todosListFull = this.todosList.concat();
    this.isLoading = false;

    this.onQueryChange();
  },
  watch: {
    filter(val: string) {
      if (val === 'placeholder' || val === TodoFilters.ALL) {
        this.deleteQuery('filter');
        return;
      }

      this.$router.push({ query: { ...this.$route.query, filter: val } });
    },
    filterUser(val: string) {
      if (val === 'placeholder' || val === 'All') {
        this.deleteQuery('filterUser');
        return;
      }
      this.$router.push({ query: { ...this.$route.query, filterUser: val } });
    },
    searchValue(val: string, prevVal: string) {
      this.debouncedSearchInput(val, prevVal, this);
    },
    '$route.query'() {
      this.onQueryChange();
    },
  },
  methods: {
    debouncedSearchInput: debounce(
      1000,
      (val: string, prevVal: string, that: CreateComponentPublicInstance) => {
        if (!val) {
          const q = { ...that.$route.query };
          delete q.search;
          that.$router.replace({ query: q });
          return;
        }
        that.$router.push({ query: { ...that.$route.query, search: val } });
      }
    ),
    async onQueryChange() {
      const { filter, filterUser, search } = this.$route.query;

      const addQueryVal = (prev: string, newKey: string, newVal: string) => {
        return prev.length === 0 ? `?${newKey}=${newVal}` : `${prev}&${newKey}=${newVal}`;
      };

      let query = '';

      if (filter || filterUser) query = '?';

      switch (filter) {
        case TodoFilters.ALL:
          query += '';
          break;
        case TodoFilters.COMPLETED:
          query += 'completed=true';
          break;
        case TodoFilters.UNCOMPLETED:
          query += 'completed=false';
          break;

        default:
          query = '';
          break;
      }

      if (filterUser) {
        query = addQueryVal(query, 'userId', filterUser);
      }

      this.isLoading = true;
      const todos = await this.fetchTodos(query);
      this.todosList =
        filter === TodoFilters.FAVORITES
          ? this.todosListFull.filter(todo => todos.some(t => t.id === todo.id && todo.favorite))
          : this.todosListFull.filter(todo => todos.some(t => t.id === todo.id));

      if (search) {
        this.todosList = this.todosList.filter(todo => todo.title.includes(search));
      }

      this.isLoading = false;
    },
    updateTodosList(newTodo: ITodo) {
      this.isLoading = true;
      this.todosList.unshift({ ...newTodo, favorite: false, completed: false });
      this.todosListFull.unshift({ ...newTodo, favorite: false, completed: false });
      setTimeout(() => {
        this.isLoading = false;
      });
    },
    async fetchTodos(filter: string = '') {
      return await baseApi
        .get(`todos${filter}`)
        .then(res => {
          return res.data as ITodo[];
        })
        .catch(err => {
          console.error(err);
          return [];
        });
    },
    async fetchUsers() {
      return await baseApi
        .get('/users')
        .then(res => {
          return res.data as IUser[];
        })
        .catch(err => {
          console.error(err);
          return [];
        });
    },
    onFavoriteChange(e: Event) {
      const checkbox = e.target as HTMLInputElement;

      const id = Number(checkbox.value);

      this.todosList = this.todosList.map(todo => ({
        ...todo,
        favorite: todo.id === id ? checkbox.checked : todo.favorite,
      }));
      this.todosListFull = this.todosListFull.map(todo => ({
        ...todo,
        favorite: todo.id === id ? checkbox.checked : todo.favorite,
      }));

      const favorites = this.todosList.reduce((acc: number[], todo) => {
        if (todo.favorite) {
          return acc.includes(todo.id) ? acc : [...acc, todo.id];
        }
        return acc;
      }, []);

      localStorage.setItem('favoritesTodos', JSON.stringify(favorites));
    },
  },
});
</script>

<style lang="scss" scoped>
.todo-wrap {
  .loader {
    display: block;
    margin: auto;
  }
}

.top {
  display: flex;
  flex-direction: column;
  gap: 10px;

  background: #c4c4c4;
  border-radius: 5px;
  padding: 15px 25px;
  margin-bottom: 15px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;

    .select {
      width: 150px;
    }

    .input {
      width: 300px;
    }
  }
}

.list-wrap {
  position: relative;
  min-height: 200px;

  > .loader {
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &.is-loading {
    &::before {
      content: '';
      position: absolute;
      z-index: 0;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(#000, 0.3);
    }
  }
}

.list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.todo-card {
  background-color: #c4c4c4;
  border-radius: 5px;
  padding: 10px;

  .title {
  }
}

.checkbox {
  display: inline-flex;
  align-items: flex-end;
  gap: 5px;
  cursor: pointer;

  input {
    margin-bottom: 3px;
    cursor: pointer;
  }
}

.create-todo {
  margin-bottom: 30px;
}
</style>
