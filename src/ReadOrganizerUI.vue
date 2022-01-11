<template>
  <div class="login-wrapper" v-if="!isAuthenticated">
    <router-view class="view" />
  </div>
  <div class="reader-wrapper" v-else>
    <Sidebar />
    <router-view id="router-view" class="view" />
  </div>
  <Spinner :isVisible="this.status === 'loading'" />
</template>

<script>
import "sanitize.css";
import "sanitize.css/forms.css";
import "sanitize.css/assets.css";
import "sanitize.css/typography.css";
import "@kouts/vue-modal/dist/vue-modal.css";
import "@vueform/multiselect/themes/default.css";

import Sidebar from "@/components/Sidebar.vue";
import Spinner from "@/components/Spinner.vue";
import { mapGetters } from "vuex";

import { GET_HAS_TOKEN, GET_STATUS, GET_USER } from "./types";

export default {
  name: "ReadOrganizerUI",
  components: {
    Sidebar,
    Spinner,
  },
  computed: {
    ...mapGetters({
      status: GET_STATUS,
      hasToken: GET_HAS_TOKEN,
      user: GET_USER,
    }),
    isAuthenticated() {
      return this.hasToken && this.user.is_active;
    },
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
  height: 100%;
  overflow: hidden;
}

.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--darker);
}

.reader-wrapper {
  display: grid;
  grid-template-columns: 280px auto;
  line-height: 1.5;
  height: 100%;
  overflow: hidden;
}

.view {
  background-color: var(--darker);
  overflow-y: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

.view__title {
  border-bottom: 1px solid var(--primary);
  margin: 0;
  padding: 0.5rem 1.5rem 0;
}
</style>
