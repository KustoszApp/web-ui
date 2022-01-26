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

import {
  GET_HAS_TOKEN,
  GET_STATUS,
  GET_USER,
  GET_USER_THEME_COLOR,
} from "./types";

export default {
  name: "KustoszUI",
  components: {
    Sidebar,
    Spinner,
  },
  computed: {
    ...mapGetters({
      status: GET_STATUS,
      hasToken: GET_HAS_TOKEN,
      user: GET_USER,
      themeColor: GET_USER_THEME_COLOR,
    }),
    isAuthenticated() {
      return this.hasToken && this.user.is_active;
    },
  },
  created() {
    this.$watch(
      () => this.themeColor,
      (newVal) => {
        document.documentElement.setAttribute("theme", newVal);
      }
    );
  },
};
</script>

<style lang="scss">
@import "./scss/mixins";
@import "./scss/elements";

:root {
  @include makeTheme($lightTheme);
}

html[theme="light"] {
  @include makeTheme($lightTheme);
}

html[theme="dark"] {
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

#kustosz {
  height: 100%;
  overflow: hidden;
}

@include for-tablet-landscape-up {
  .reader-wrapper {
    display: grid;
    grid-template-columns: 280px auto;
    height: 100%;
    overflow: hidden;
  }

  #nav {
    display: flex;
  }
}

.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--darker);
}

.view {
  background-color: var(--darker);
  overflow-y: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  height: 100vh;
  padding-bottom: 3rem; /* offsets button on top of sidebar */
  @include for-tablet-landscape-up {
    padding-bottom: 0;
  }
}

.view.login {
  height: auto;
}

.view__title {
  border-bottom: 1px solid var(--primary);
  margin: 0;
  padding: 0.5rem 1.5rem 0;
}
</style>
