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
};
</script>
