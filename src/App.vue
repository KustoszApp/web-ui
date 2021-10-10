<template>
  <div id="nav" class="nav">
    <div class="nav__add">
      <button type="button" class="btn btn--primary btn--big">
        Dodaj kanał
      </button>
    </div>
    <h2 class="nav__title">Lista Źródeł</h2>
    <div class="nav__sources">
      <NavList />
    </div>
    <h2 class="nav__title">Menu</h2>
    <div class="nav__menu">
      <ul class="menu">
        <li class="menu__item">
          <router-link to="/">Home</router-link>
        </li>
        <li class="menu__item">
          <router-link to="/settings">Opcje</router-link>
        </li>
        <li class="menu__item">
          <router-link to="/about">O projekcie</router-link>
        </li>
      </ul>
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
@import "./scss/mixins";

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
  grid-template-columns: 200px auto;
  line-height: 1.5;
  height: 100%;
  overflow: hidden;
}

.btn {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border: 2px solid transparent;
}

.btn--primary {
  color: var(--btn-primary-color);
  border-color: var(--btn-primary-color);
  border-radius: 0.25rem;
  transition: all 0.3s ease-out;
}

.btn--primary:hover {
  color: var(--btn-primary-active-color);
  border-color: (var-btn-primary-active-color);
  background-color: var(--btn-primary-active-bg);
}

.btn--secondary {
  color: var(--secondary);
  background-color: $alto;
}

.nav {
  background-color: var(--nav-bg);
  padding-left: 0.5rem;
  padding-right: 0.5rem;
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
  margin: 0.5rem 0;
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
  background-color: var(--content-bg);
  overflow-y: scroll;
}
</style>
