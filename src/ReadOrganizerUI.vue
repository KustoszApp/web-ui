<template>
  <Sidebar />
  <router-view id="router-view" class="view" />
  <Spinner :isVisible="this.status === 'loading'" />
</template>

<script>
import "normalize.css";
import "@kouts/vue-modal/dist/vue-modal.css";
import "@vueform/multiselect/themes/default.css";

import Sidebar from "@/components/Sidebar.vue";
import Spinner from "@/components/Spinner.vue";
import { mapGetters } from "vuex";

export default {
  name: "ReadOrganizerUI",
  components: {
    Sidebar,
    Spinner,
  },
  computed: {
    ...mapGetters(["status"]),
  },
  created() {
    this.$store.dispatch("channels_request");
    this.$store.dispatch("channel_tags_request");
    this.$store.dispatch("entry_tags_request");
  },
};
</script>

<style lang="scss">
@import "./scss/mixins";
@import "./scss/elements";

:root {
  @include makeTheme($lightTheme);
}

[theme="light"] {
  @include makeTheme($lightTheme);
}

[theme="dark"] {
  @include makeTheme($darkTheme);
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--primary);
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: normal;
  margin-top: 0;
}

a {
  color: var(--link);
}

#readorganizer {
  display: grid;
  grid-template-columns: 280px auto;
  line-height: 1.5;
  height: 100%;
  overflow: hidden;
}

.view {
  background-color: var(--darker);
  overflow-y: scroll;
  padding-left: 1rem;
  padding-right: 1rem;
}

.view__title {
  border-bottom: 1px solid var(--primary);
  margin: 0;
  padding: 0.5rem 1.5rem 0;
}
</style>
