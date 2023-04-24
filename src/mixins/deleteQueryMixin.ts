import { defineComponent } from 'vue';

export default defineComponent({
  methods: {
    deleteQuery(prop: string) {
      const q = { ...this.$route.query };
      delete q[prop];
      this.$router.replace({ query: q });
    },
  },
});
