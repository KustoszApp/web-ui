<template>
  <div class="theme-selection">
    <button
      v-for="(value, key) in colorThemes"
      :key="key"
      type="button"
      class="btn"
      :class="{ 'btn--active': isCurrentThemeColor(key) }"
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
  GET_USER_THEME_COLOR,
  GET_DEFAULT_THEME_COLOR,
  ACTION_SET_USER_THEME_COLOR,
  ACTION_USER_DATA_EDIT_REQUEST,
} from "../types";

export default {
  name: "ThemeSwitcher",
  computed: {
    ...mapGetters({
      colorThemes: GET_ALL_COLOR_THEMES,
      userThemeColor: GET_USER_THEME_COLOR,
      defaultThemeColor: GET_DEFAULT_THEME_COLOR,
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
    isCurrentThemeColor(themeKey) {
      let currentThemeName = this.defaultThemeColor;
      if (this.userThemeColor !== "") {
        currentThemeName = this.userThemeColor;
      }
      return themeKey === currentThemeName;
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
