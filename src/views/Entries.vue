<template>
  <div class="entries">
    <EntriesFilter />
    <EntriesList />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import EntriesFilter from "@/components/EntriesFilter.vue";
import EntriesList from "@/components/EntriesList.vue";

import {
  GET_STATUS,
  ROUTE_ENTRIES,
  ACTION_ENTRIES_REQUEST,
  ACTION_ENTRY_TAGS_REQUEST,
} from "../types";

export default {
  name: "Entries",
  components: {
    EntriesFilter,
    EntriesList,
  },
  data() {
    return {
      ROUTE_ENTRIES,
    };
  },
  computed: {
    ...mapGetters({
      status: GET_STATUS,
    }),
  },
  methods: {
    queryParamsChanged() {
      const $route = this.$route;
      // watcher is global, but makes sense only on /entries/
      if ($route.name !== this.ROUTE_ENTRIES) {
        return;
      }
      // poor man's debouncing
      if (this.status === "loading") {
        return;
      }
      const newQuery = {};
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
