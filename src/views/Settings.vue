<template>
  <div class="settings">
    <h2 class="view__title">Ustawienia</h2>
    <h3 class="section-title">Motywy</h3>
    <ThemeSwitcher />
    <h3 class="section-title">Żródła</h3>
    <NavList title="Wszystkie Źródła" />
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
