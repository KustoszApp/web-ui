<template>
  <div class="theme-selection">
    <button
      v-for="(value, key) in colorThemes"
      :key="key"
      type="button"
      class="btn"
      @click="switchTheme(key)"
    >
      {{ value }}
    </button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import {
  GET_ALL_COLOR_THEMES,
  ACTION_SET_USER_THEME_COLOR,
  ACTION_USER_DATA_EDIT_REQUEST,
} from "../types";

export default {
  name: "ThemeSwitcher",
  computed: {
    ...mapGetters({
      colorThemes: GET_ALL_COLOR_THEMES,
    }),
  },
  methods: {
    switchTheme(value) {
      this.$store.dispatch(ACTION_SET_USER_THEME_COLOR, value).then(() => {
        this.$store.dispatch({
          type: ACTION_USER_DATA_EDIT_REQUEST,
          theme_color: value,
        });
      });
    },
  },
};
</script>

<style lang="scss">
.theme-selection {
  display: flex;
  flex-wrap: wrap;
  gap: 1ex;
}
</style>
