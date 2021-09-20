<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="ReadOrganizer" />
    <Entries />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import Entries from "@/components/Entries.vue";

export default {
  name: "Home",
  components: {
    HelloWorld,
    Entries,
  },
};
</script>
