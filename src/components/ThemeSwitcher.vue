<template>
  <div class="nav__themes">
    <button
      type="button"
      class="btn btn--secondary"
      @click="switchTheme('light')"
    >
      Light Theme
    </button>
    <button
      type="button"
      class="btn btn--secondary ml-2"
      @click="switchTheme('dark')"
    >
      Dark Theme
    </button>
  </div>
</template>

<script>
import { ACTION_USER_DATA_EDIT_REQUEST } from "../types";

export default {
  name: "ThemeSwitcher",
  data() {
    return {
      themes: ["light", "dark"],
    };
  },
  methods: {
    switchTheme(value) {
      // theme is set by watcher in ReadOrganizerUI
      if (this.themes.includes(value)) {
        this.$store.dispatch({
          type: ACTION_USER_DATA_EDIT_REQUEST,
          theme_color: value,
        });
      }
    },
  },
};
</script>
