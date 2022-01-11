<template>
  <div class="entries">
    <EntriesFilter />
    <EntriesList />
  </div>
</template>

<script>
import EntriesFilter from "@/components/EntriesFilter.vue";
import EntriesList from "@/components/EntriesList.vue";

export default {
  name: "Entries",
  components: {
    EntriesFilter,
    EntriesList,
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
    this.$store.dispatch("entry_tags_request");
    this.queryParamsChanged();
  },
};
</script>
