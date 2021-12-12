<template>
  <div id="nav" class="nav">
    <div class="nav__add">
      <button type="button" class="btn btn--primary btn--big">
        Add source
      </button>
    </div>
    <h2 class="nav__title">Feeds</h2>
    <div class="nav__sources">
      <NavList />
    </div>
    <h2 class="nav__title">Maintenance</h2>
    <div class="nav__menu">
      <ul class="menu mb-0">
        <li class="menu__item">
          <router-link to="/maintenance/stale_channels"
            >Stale channels</router-link
          >
        </li>
        <li class="menu__item">
          <router-link to="/maintenance/not_updated_channels"
            >Channels without new entries</router-link
          >
        </li>
        <li class="menu__item">
          <router-link to="/maintenance/inactive_channels"
            >Inactive channels</router-link
          >
        </li>
        <li class="menu__item">
          <router-link to="/settings">Options</router-link>
        </li>
      </ul>
    </div>
  </div>
  <router-view class="view" />
  <Spinner :isVisible="this.status === 'loading'" />
</template>

<script>
import NavList from "@/components/NavList.vue";
import Spinner from "@/components/Spinner.vue";
import { mapGetters } from "vuex";

export default {
  name: "App",
  components: {
    NavList,
    Spinner,
  },
  computed: {
    ...mapGetters(["status", "entry"]),
  },
  methods: {
    switchTheme(value) {
      if (value in this.themes)
        document.documentElement.setAttribute("theme", value);
    },
  },
  created() {
    this.$store.dispatch("entries_request");
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

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--primary);
  display: grid;
  grid-template-columns: 280px auto;
  line-height: 1.5;
  height: 100%;
  overflow: hidden;
}

.nav {
  background-color: var(--lighter);
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.nav__title {
  font-size: 0.75rem;
  font-weight: 300;
  text-transform: uppercase;
  margin: 0 0 0.5rem;
}

.nav__add {
  display: grid;
  flex: 0;
  margin: 0 0 0.5rem;
}

.nav__sources {
  font-size: 0.875rem;
  flex: 1;
  overflow-y: scroll;
  scrollbar-width: thin;
  margin: 0 0 0.5rem;
}

.nav__menu {
  flex: 0;
}

.menu {
  list-style: none;
  margin: 0 0 0.5rem;
  padding: 0;
}

.menu__item a {
  display: block;
  color: var(--primary);
  text-decoration: none;
  border-left: 3px solid transparent;
  padding: 0.25rem 0.5rem;
}

.menu__item a.router-link-exact-active {
  color: var(--link);
  border-left-color: var(--link);
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
