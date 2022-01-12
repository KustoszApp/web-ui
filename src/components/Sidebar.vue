<template>
  <div id="nav" class="nav" :class="{ ['nav--open']: this.sidebarDisplayed }">
    <button class="mobile-only hide-menu" @click="hideSidebar">
      Hide menu
    </button>
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
          <router-link :to="{ name: this.ROUTE_MAINTENANCE_STALE_CHANNELS }"
            >Stale channels</router-link
          >
        </li>
        <li class="menu__item">
          <router-link
            :to="{ name: this.ROUTE_MAINTENANCE_NOT_UPDATED_CHANNELS }"
            >Channels without new entries</router-link
          >
        </li>
        <li class="menu__item">
          <router-link :to="{ name: this.ROUTE_MAINTENANCE_INACTIVE_CHANNELS }"
            >Inactive channels</router-link
          >
        </li>
      </ul>
    </div>
    <div class="nav__menu">
      <ul class="menu mb-0">
        <li class="menu__item">
          <router-link :to="{ name: this.ROUTE_FILTERS }">Filters</router-link>
        </li>
        <li class="menu__item">
          <router-link :to="{ name: this.ROUTE_SETTINGS }">Options</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AddChannel from "@/components/AddChannel";
import NavList from "@/components/NavList.vue";

import {
  ACTION_CHANNEL_TAGS_REQUEST,
  ACTION_CHANNELS_REQUEST,
  ACTION_HIDE_SIDEBAR,
  ROUTE_MAINTENANCE_STALE_CHANNELS,
  ROUTE_MAINTENANCE_INACTIVE_CHANNELS,
  ROUTE_MAINTENANCE_NOT_UPDATED_CHANNELS,
  ROUTE_FILTERS,
  ROUTE_SETTINGS,
  GET_SIDEBAR_STATE,
} from "../types";

export default {
  name: "Sidebar",
  components: {
    AddChannel,
    NavList,
  },
  data() {
    return {
      ROUTE_MAINTENANCE_STALE_CHANNELS,
      ROUTE_MAINTENANCE_INACTIVE_CHANNELS,
      ROUTE_MAINTENANCE_NOT_UPDATED_CHANNELS,
      ROUTE_FILTERS,
      ROUTE_SETTINGS,
    };
  },
  computed: {
    ...mapGetters({
      sidebarDisplayed: GET_SIDEBAR_STATE,
    }),
  },
  methods: {
    hideSidebar() {
      this.$store.dispatch(ACTION_HIDE_SIDEBAR);
    },
  },
  mounted() {
    this.$store.dispatch(ACTION_CHANNELS_REQUEST);
    this.$store.dispatch(ACTION_CHANNEL_TAGS_REQUEST);
  },
};
</script>

<style lang="scss">
.nav {
  background-color: var(--lighter);
  padding: 0.5rem;
  flex-direction: column;
  height: 100vh;
  display: none;
}

.nav--open {
  display: flex;
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
  overflow-y: auto;
  scrollbar-width: thin;
  margin: 0 0 0.5rem;
}

.hide-menu {
  margin-bottom: 1rem;
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
