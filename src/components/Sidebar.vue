<template>
  <div class="mobile-only sidebar-display-button">
    <button class="btn btn--secondary" @click="toggleSidebarDisplay">
      {{ showMenuLabel }}
    </button>
  </div>
  <div id="nav" class="nav" :class="{ 'nav--open': this.sidebarDisplayed }">
    <div class="nav__section">
      <div class="nav__add">
        <AddChannel />
      </div>
    </div>
    <div class="nav__section">
      <Collapse :show="true">
        <template v-slot:header>
          <h2 class="nav__title">Channels</h2>
        </template>
        <template v-slot:collapse>
          <div class="nav__sources">
            <NavList />
          </div>
        </template>
      </Collapse>
    </div>
    <div class="nav__section">
      <Collapse :show="false">
        <template v-slot:header>
          <h2 class="nav__title">Maintenance</h2>
        </template>
        <template v-slot:collapse>
          <div class="nav__menu">
            <ul class="menu mb-0">
              <li class="menu__item">
                <router-link
                  :to="{ name: this.ROUTE_MAINTENANCE_STALE_CHANNELS }"
                >
                  Stale channels
                </router-link>
              </li>
              <li class="menu__item">
                <router-link
                  :to="{ name: this.ROUTE_MAINTENANCE_NOT_UPDATED_CHANNELS }"
                  >Channels without new entries</router-link
                >
              </li>
              <li class="menu__item">
                <router-link
                  :to="{ name: this.ROUTE_MAINTENANCE_INACTIVE_CHANNELS }"
                >
                  Inactive channels
                </router-link>
              </li>
            </ul>
          </div>
        </template>
      </Collapse>
    </div>
    <div class="nav__section">
      <router-link :to="{ name: this.ROUTE_FILTERS }">Filters</router-link>
    </div>
    <div class="nav__section">
      <router-link :to="{ name: this.ROUTE_SETTINGS }">Options</router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AddChannel from "@/components/AddChannel";
import NavList from "@/components/NavList.vue";
import Collapse from "@/components/Collapse.vue";

import {
  ACTION_CHANNEL_TAGS_REQUEST,
  ACTION_CHANNELS_REQUEST,
  ACTION_HIDE_SIDEBAR,
  ACTION_DISPLAY_SIDEBAR,
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
    Collapse,
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
    showMenuLabel() {
      if (this.sidebarDisplayed) {
        return "Hide menu";
      }
      return "Show menu";
    },
  },
  methods: {
    toggleSidebarDisplay() {
      const action = this.sidebarDisplayed
        ? ACTION_HIDE_SIDEBAR
        : ACTION_DISPLAY_SIDEBAR;
      this.$store.dispatch(action);
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
  overflow-y: auto;
  scrollbar-width: thin;
}

.nav--open {
  display: flex;
  padding-bottom: 3rem; /* offsets button on top of sidebar */
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
  margin: 0 0 0.5rem;
}

.sidebar-display-button {
  display: grid;
  flex: 0;
  margin: 0.5rem;

  button {
    width: 100%;
  }
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
