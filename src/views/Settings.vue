<template>
  <div class="settings">
    <h2 class="view__title">
      <BIconGearFill />
      Settings
    </h2>
    <div class="section">
      <h3 class="section-title">Theme</h3>
      <ThemeSwitcher />
    </div>
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
    <div class="section">
      <h3 class="section-title">About Us</h3>
      <p>Self-hosted RSS Reader</p>
    </div>
  </div>
</template>

<script>
import { BIconGearFill } from "bootstrap-icons-vue";
import ThemeSwitcher from "@/components/ThemeSwitcher";

import { ACTION_AUTH_LOGOUT } from "../types";

export default {
  name: "Settings",
  components: {
    BIconGearFill,
    ThemeSwitcher,
  },
  methods: {
    logout() {
      this.$store.dispatch(ACTION_AUTH_LOGOUT);
    },
  },
};
</script>
