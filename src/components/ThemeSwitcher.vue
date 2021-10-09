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
      class="btn btn--secondary"
      @click="switchTheme('dark')"
    >
      Dark Theme
    </button>
  </div>
</template>

<script>
export default {
  name: "ThemeSwitcher",
  data() {
    return {
      themes: {
        light: "Jasny Motyw",
        dark: "Ciemy Motyw",
      },
    };
  },
  methods: {
    switchTheme(value) {
      if (value in this.themes)
        document.documentElement.setAttribute("theme", value);
    },
  },
};
</script>
