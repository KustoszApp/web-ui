<template>
  <div class="entries">
    <button class="mobile-only" @click="showSidebar">Show menu</button>
    <EntriesFilter />
    <EntriesList />
  </div>
</template>

<script>
import EntriesFilter from "@/components/EntriesFilter.vue";
import EntriesList from "@/components/EntriesList.vue";

import {
  ACTION_ENTRIES_REQUEST,
  ACTION_ENTRY_TAGS_REQUEST,
  ACTION_DISPLAY_SIDEBAR,
} from "../types";

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
        type: ACTION_ENTRIES_REQUEST,
        ...$route.query,
      });
    },
    showSidebar() {
      this.$store.dispatch(ACTION_DISPLAY_SIDEBAR);
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
    this.$store.dispatch(ACTION_ENTRY_TAGS_REQUEST);
    this.queryParamsChanged();
  },
};
</script>
