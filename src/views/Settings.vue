<template>
  <div class="settings">
    <h2 class="view__title">Ustawienia</h2>
    <NavList title="Wszystkie Źródła" />
    <ThemeSwitcher />
  </div>
</template>

<script>
// @ is an alias to /src
import NavList from "@/components/NavList.vue";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default {
  name: "Home",
  components: {
    NavList,
    ThemeSwitcher,
  },
};
</script>
