<template>
  <div class="settings">
    <h2 class="view__title topmost-elem">
      <BIconGearFill />
      Settings
    </h2>
    <!--  FIXME: hide until dark theme is usable
    <div class="section">
      <h3 class="section-title">Theme</h3>
      <ThemeSwitcher />
    </div>
    -->
    <div class="section">
      <h3 class="section-title">Account</h3>
      <button
        type="button"
        class="btn btn--main-action btn--big"
        @click="logout"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<script>
import { BIconGearFill } from "bootstrap-icons-vue";
/*import ThemeSwitcher from "@/components/ThemeSwitcher";*/

import { ACTION_AUTH_LOGOUT } from "../types";

export default {
  name: "Settings",
  components: {
    BIconGearFill,
    /*ThemeSwitcher,*/
  },
  methods: {
    logout() {
      this.$store.dispatch(ACTION_AUTH_LOGOUT);
    },
  },
};
</script>

<style lang="scss" scoped>
.section .section-title {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}
</style>
