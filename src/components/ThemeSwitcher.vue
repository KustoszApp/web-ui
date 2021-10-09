<template>
  <div class="nav__themes">
    <h2 class="list__title">Motywy</h2>
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
