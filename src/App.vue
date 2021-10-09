<template>
  <div id="nav" class="nav">
    <div class="nav__add">
      <button type="button" class="btn btn--primary btn--big">
        Dodaj kanał
      </button>
    </div>
    <div class="nav__sources">
      <NavList title="Lista Źródeł" />
    </div>
    <div class="nav__menu">
      <h2 class="list__title">Menu</h2>
      <router-link to="/">Home</router-link>
      <router-link to="/settings">Opcje</router-link>
      <router-link to="/about">O projekcie</router-link>
    </div>
  </div>
  <router-view class="view" />
</template>

<script>
import NavList from "@/components/NavList.vue";

export default {
  name: "App",
  components: {
    NavList,
  },
  methods: {
    switchTheme(value) {
      if (value in this.themes)
        document.documentElement.setAttribute("theme", value);
    },
  },
};
</script>

<style lang="scss">
@mixin makeTheme($theme) {
  --primary: #{map-get($map: $theme, $key: "primary")};
  --secondary: #{map-get($map: $theme, $key: "secondary")};
  --nav-bg: #{map-get($map: $theme, $key: "nav-bg")};
  --content-bg: #{map-get($map: $theme, $key: "content-bg")};
  --focus: #{map-get($map: $theme, $key: "focus")};
  --link: #{map-get($map: $theme, $key: "link")};
}

:root {
  @include makeTheme($lightTheme);
}

[theme="light"] {
  @include makeTheme($lightTheme);
}

[theme="dark"] {
  @include makeTheme($darkTheme);
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
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--primary);
  display: grid;
  grid-template-columns: 200px auto;
  line-height: 1.5;
  height: 100vh;
}

.btn {
  display: inline-block;
  padding: 0.5rem 0.75rem;
  border: 1px solid transparent;
}

.btn--primary {
  color: var(--primary);
  background-color: $yellow-sea;
}

.btn--secondary {
  color: var(--secondary);
  background-color: $alto;
}

.nav {
  background-color: var(--nav-bg);
  padding: 1rem;

  a {
    color: var(--primary);

    &.router-link-exact-active {
      color: var(--link);
    }
  }
}

.nav__add {
  display: grid;
}

.nav__sources {
  font-size: 0.875rem;
}

.nav__menu {
  display: flex;
  flex-direction: column;
}

.view {
  background-color: var(--content-bg);
}
</style>
