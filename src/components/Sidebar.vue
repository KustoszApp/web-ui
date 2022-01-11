<template>
  <div id="nav" class="nav">
    <div class="nav__add">
      <AddChannel />
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
      </ul>
    </div>
    <div class="nav__menu">
      <ul class="menu mb-0">
        <li class="menu__item">
          <router-link to="/filters">Filters</router-link>
        </li>
        <li class="menu__item">
          <router-link to="/settings">Options</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import AddChannel from "@/components/AddChannel";
import NavList from "@/components/NavList.vue";

export default {
  name: "Sidebar",
  components: {
    AddChannel,
    NavList,
  },
  mounted() {
    this.$store.dispatch("channels_request");
    this.$store.dispatch("channel_tags_request");
  },
};
</script>

<style lang="scss">
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
</style>