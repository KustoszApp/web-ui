<template>
  <div class="home">
    <EntriesFilter />
    <Entries />
  </div>
</template>

<script>
import Entries from "@/components/Entries.vue";
import EntriesFilter from "@/components/EntriesFilter.vue";

export default {
  name: "Home",
  components: {
    Entries,
    EntriesFilter,
  },
  methods: {
    queryParamsChanged() {
      const newQuery = {};
      const $route = this.$route;
      for (const key in $route.query) {
        const value = $route.query[key];
        if (value !== null && value !== "") {
          newQuery[key] = value;
        }
      }
      this.$router.replace({ path: $route.path, query: newQuery });
      this.$store.dispatch({
        type: "entries_request",
        ...$route.query,
      });
    },
  },
  created() {
    this.$watch(
      () => this.$route,
      ($route /* eslint-disable-line no-unused-vars*/) =>
        this.queryParamsChanged()
    );
  },
  mounted() {
    this.queryParamsChanged();
  },
};
</script>
