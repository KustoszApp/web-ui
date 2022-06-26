<template>
  <div class="settings">
    <h2 class="view__title topmost-elem">
      <BIconGearFill />
      Settings
    </h2>
    <div class="section">
      <h3 class="section-title">Theme</h3>
      <ThemeSwitcher />
    </div>
    <div class="section">
      <h3 class="section-title">Automatically mark article as read</h3>
      <MarkAsReadStrategySwitcher />
    </div>
    <div class="section">
      <h3 class="section-title">Behavior</h3>
      <input
        class="input-check"
        type="checkbox"
        id="entryOpenScrollToTop"
        v-model="entryOpenScrollToTop"
      />
      <label for="entryOpenScrollToTop">
        Always keep opened entry on top of list
      </label>
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { BIconGearFill } from "bootstrap-icons-vue";
import MarkAsReadStrategySwitcher from "@/components/MarkAsReadStrategySwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";

import {
  GET_USER,
  ACTION_AUTH_LOGOUT,
  ACTION_USER_DATA_EDIT_REQUEST,
} from "../types";

export default {
  name: "Settings",
  components: {
    BIconGearFill,
    MarkAsReadStrategySwitcher,
    ThemeSwitcher,
  },
  computed: {
    ...mapGetters({
      user: GET_USER,
    }),
    entryOpenScrollToTop: {
      get() {
        return this.user.entry_open_scroll_to_top;
      },
      set(newValue) {
        this.$store.dispatch({
          type: ACTION_USER_DATA_EDIT_REQUEST,
          entry_open_scroll_to_top: newValue,
        });
      },
    },
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
