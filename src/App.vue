<template>
  <div class="layout">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RouteNames } from './router';

export default defineComponent({
  name: 'App',
  mounted() {
    this.$router.onReady(() => this.handleRedirect());
  },
  watch: {
    $route: {
      handler: 'handleRedirect',
    },
  },
  methods: {
    handleRedirect() {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        this.$router.push(RouteNames.LOGIN);
      } else if (this.$route.path === RouteNames.HOME) {
        this.$router.push(`${RouteNames.USER}/${userId}`);
      }
    },
  },
});
</script>
