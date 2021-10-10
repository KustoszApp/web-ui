<template>
  <div class="settings">
    <h2 class="view__title">Settings</h2>
    <h3 class="section-title">Theme</h3>
    <ThemeSwitcher />
    <h3 class="section-title">Sources</h3>
    <NavList />
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
