<template>
  <div class="home">
    <EntriesFilter />
    <Entries />
  </div>
</template>

<script>
// @ is an alias to /src
import Entries from "@/components/Entries.vue";
import EntriesFilter from "@/components/EntriesFilter.vue";

export default {
  name: "Home",
  components: {
    Entries,
    EntriesFilter,
  },
  created() {
    this.$watch(
      () => this.$route.params,
      (toParams) => {
        if (!("entryId" in toParams)) {
          return;
        }
        let param = toParams.entryId;
        let query = `channel=${toParams.entryId}`;
        if (isNaN(param)) {
          if (param.includes("=")) {
            query = param;
          } else {
            query = `channel_tags=${param}`;
          }
        }
        this.$store.dispatch({
          type: "entries_request",
          query: query,
        });
      }
    );
  },
};
</script>
