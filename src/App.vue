<template>
  <div id="nav" class="nav">
    <div class="nav__add">
      <button class="btn btn--primary btn--big">Dodaj kanał</button>
    </div>
    <div class="nav__sources">
      <HelloWorld msg="Lista Źródeł" />
    </div>
    <div class="nav__menu">
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
    </div>
  </div>
  <router-view />
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    HelloWorld,
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: grid;
  grid-template-columns: 200px auto;
  height: 100vh;
}

.btn {
  display: inline-block;
  padding: 0.5rem 0.75rem;
}

.nav {
  background-color: #f1f4f6;
  padding: 1rem;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
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
</style>
