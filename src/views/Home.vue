<template>
  <div class="home">
    <Entries />
  </div>
</template>

<script>
// @ is an alias to /src
import Entries from "@/components/Entries.vue";

export default {
  name: "Home",
  components: {
    Entries,
  },
};
</script>
