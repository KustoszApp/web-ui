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
      <h3 class="section-title">“Add a page” bookmarklet</h3>
      <p>
        The link below is a
        <a href="https://en.wikipedia.org/wiki/Bookmarklet">bookmarklet</a> - a
        special bookmark that executes JavaScript in the context of currently
        opened page. Add it to your browser bookmarks and click the bookmark
        next time you visit a page you would like to add to Kustosz.
        <a
          href="https://docs.kustosz.org/en/stable/basic-usage.html#adding-web-page-manually"
          >Read more</a
        >.
      </p>
      <p>
        <a :href="getBookmarkletHref" title="Add to Kustosz">
          Add to Kustosz
        </a>
      </p>
    </div>
    <div class="section">
      <h3 class="section-title">Export data</h3>
      <button
        type="button"
        class="btn btn--main-action btn--big"
        @click="exportOPML"
      >
        Export channels as OPML
      </button>
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
import axios from "axios";
import { mapGetters } from "vuex";
import { BIconGearFill } from "bootstrap-icons-vue";
import MarkAsReadStrategySwitcher from "@/components/MarkAsReadStrategySwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";

import {
  GET_USER,
  ACTION_AUTH_LOGOUT,
  ACTION_EXPORT_GET_OTT_REQUEST,
  ACTION_USER_DATA_EDIT_REQUEST,
  TOKEN_STORAGE_KEY,
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
    getBookmarkletHref() {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      const href = `javascript:(function(){
          fetch('${axios.defaults.baseURL}/entries/manual_add',
          {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': 'Token ${token}'},
            body: JSON.stringify({link: window.location.href.split("#")[0]})
          })
        })()`;
      return href;
    },
  },
  methods: {
    exportOPML() {
      this.$store.dispatch(ACTION_EXPORT_GET_OTT_REQUEST).then((token) => {
        const url = `${axios.defaults.baseURL}/export/channels?token=${token}`;
        document.location.href = url;
      });
    },
    logout() {
      this.$store.dispatch(ACTION_AUTH_LOGOUT);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/mixins";

.section {
  max-width: 100%;
  @include for-tablet-landscape-up {
    max-width: 50rem;
  }

  .section-title {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }
}
</style>
