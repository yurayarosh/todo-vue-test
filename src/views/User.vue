<template>
  <div class="user-page">
    <div class="container">
      <div class="user-meta">
        <Loader v-if="!user" class="loader" color="#fff" />

        <div v-else>
          <h1>{{ user.name }}</h1>
          <p class="subttl">{{ user.username }}</p>

          <dl>
            <dt>Phone:</dt>
            <dd>
              <a :href="`tel:${user.phone}`">{{ user.phone }}</a>
            </dd>
            <dt>Email:</dt>
            <dd>
              <a :href="`mailto:${user.email}`">{{ user.email }}</a>
            </dd>
            <dt>Website:</dt>
            <dd>
              <a :href="user.website" target="_blank" rel="nofollow noopener">{{ user.website }}</a>
            </dd>
            <dt>Address:</dt>
            <dd>
              {{ user.address.zipcode }}, {{ user.address.city }}, {{ user.address.street }},
              {{ user.address.suite }}
            </dd>
            <dt>Company:</dt>
            <dd>{{ user.company.name }}, {{ user.company.catchPhrase }}</dd>
          </dl>

          <Button @click="onLogoutBtnClick">Logout</Button>
        </div>
      </div>

      <TodoList />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IUser } from '../types/users';
import { baseApi } from '../api/api';
import TodoList from '../components/TodoList.vue';
import Loader from '../components/Loader.vue';
import Button from '../components/Button.vue';
import { RouteNames } from '../router';

export default defineComponent({
  name: 'User',
  components: { TodoList, Loader, Button },
  data() {
    return {
      user: null as IUser | null,
    };
  },
  async mounted() {
    this.user = await this.fetchUser();
  },
  methods: {
    onLogoutBtnClick() {
      localStorage.removeItem('userId');
      this.$router.push(RouteNames.LOGIN);
    },
    async fetchUser() {
      return await baseApi
        .get(`/users?id=${this.$route.params.id}`)
        .then(res => {
          return res.data[0] as IUser;
        })
        .catch(err => {
          console.error(err);
          return null;
        });
    },
  },
});
</script>

<style lang="scss" scoped>
.user-page {
  padding-top: 30px;
  padding-bottom: 30px;
}

.user-meta {
  background-color: #c4c4c4;
  border-radius: 5px;
  padding: 15px 25px 30px;

  margin-bottom: 30px;

  > .loader {
    display: block;
    margin: auto;
  }

  dl {
    display: flex;
    flex-wrap: wrap;
  }

  dt,
  dd {
    margin-bottom: 10px;
  }

  dt {
    width: 100px;
    font-weight: 700;
  }

  dd {
    width: calc(100% - 100px);
  }
}

.subttl {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 30px;
}
</style>
