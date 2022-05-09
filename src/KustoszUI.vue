<template>
  <div class="login-wrapper" v-if="!isAuthenticated">
    <router-view class="view" />
  </div>
  <div class="reader-wrapper" v-else>
    <Sidebar />
    <router-view id="router-view" class="view" />
  </div>
  <Spinner :isVisible="this.status === 'loading'" />
</template>

<script>
import "sanitize.css";
import "sanitize.css/forms.css";
import "sanitize.css/assets.css";
import "sanitize.css/typography.css";
import "@kouts/vue-modal/dist/vue-modal.css";
import "@vueform/multiselect/themes/default.css";

import Sidebar from "@/components/Sidebar.vue";
import Spinner from "@/components/Spinner.vue";
import { mapGetters } from "vuex";

import {
  GET_HAS_TOKEN,
  GET_STATUS,
  GET_USER,
  GET_USER_THEME_COLOR,
  GET_DEFAULT_THEME_COLOR,
} from "./types";

export default {
  name: "KustoszUI",
  components: {
    Sidebar,
    Spinner,
  },
  computed: {
    ...mapGetters({
      status: GET_STATUS,
      hasToken: GET_HAS_TOKEN,
      user: GET_USER,
      userThemeColor: GET_USER_THEME_COLOR,
      defaultThemeColor: GET_DEFAULT_THEME_COLOR,
    }),
    isAuthenticated() {
      return this.hasToken && this.user.is_active;
    },
  },
  created() {
    document.documentElement.dataset.theme = this.defaultThemeColor;
    this.$watch(
      () => this.userThemeColor,
      (newVal) => {
        if (newVal === undefined || newVal === "") {
          newVal = this.defaultThemeColor;
        }
        document.documentElement.dataset.theme = newVal;
      }
    );
  },
};
</script>

<style lang="scss">
@import "./scss/mixins";

// 1. variables

:root {
  --kustosz-1: #6b8469;
  --kustosz-2: #b5cab2;
  --kustosz-3: #415242;
  --kustosz-4: #ece6d6;
  --kustosz-5: #242b31;
  --kustosz-6: #344655;

  /* forms */
  --main-border-width: 1px;
  --main-border-radius: 0.25rem;
  --ms-border-width: var(--main-border-width);
  --ms-py: 0.25rem;
}

html[data-theme="light"] {
  --main-text-color: #242b31;
  --main-bg-color: #ece6d6;
  --secondary-text-color: #505050;
  --main-link-color: #1d9bf3;
  --focus-outline-color: #1d9bf3;
  --nav-bg-color: #e4ebed;
  /* buttons */
  --btn-bg-color: #e0dbcc;
  --btn-active-text-color: #020304;
  --btn-active-bg-color: #948c78;
  --main-action-bg-color: #b5cab2;
  --main-action-active-text-color: var(--btn-active-text-color);
  --main-action-active-bg-color: #657d61;
  --danger-bg-color: #ff5130;
  --danger-text-color: #f0f0f0;
  --danger-active-bg-color: #cc4227;
  --danger-active-text-color: var(--danger-text-color);
  /* entry */
  --entry-header-bg-color: #ffffff;
  --entry-archived-header-bg-color: var(--main-bg-color);
  --entry-focused-header-bg-color: var(--main-action-bg-color);
  --entry-archived-focused-header-bg-color: #cfd6b2;
  --entry-focused-header-link-color: #06457c;

  /* used by multiselect */
  --ms-bg: transparent;
  --ms-placeholder-color: #8f8f8f;
  --ms-tag-bg: var(--main-action-bg-color);
  --ms-tag-color: var(--main-text-color);
  --ms-border-color: var(--main-text-color);
}

html[data-theme="dark"] {
  --main-text-color: #dfdfdf;
  --main-bg-color: #2d2d2d;
  --secondary-text-color: #707070;
  --main-link-color: #00fec5;
  --focus-outline-color: #00fec5;
  --nav-bg-color: #323232;
  /* buttons */
  --btn-bg-color: #e0dbcc;
  --btn-active-text-color: var(--main-action-active-text-color);
  --btn-active-bg-color: #948c78;
  --main-action-bg-color: #ffae00;
  --main-action-active-text-color: #020304;
  --main-action-active-bg-color: #657d61;
  --danger-bg-color: #ff5130;
  --danger-text-color: #323232;
  --danger-active-bg-color: #ff5130;
  --danger-active-text-color: #ff5130;
  /* entry */
  --entry-header-bg-color: #ffffff;
  --entry-archived-header-bg-color: var(--main-bg-color);
  --entry-focused-header-bg-color: var(--main-action-bg-color);
  --entry-archived-focused-header-bg-color: #cfd6b2;
  --entry-focused-header-link-color: #06457c;

  /* used by multiselect */
  --ms-bg: transparent;
  --ms-placeholder-color: #8f8f8f;
  --ms-tag-bg: var(--main-action-bg-color);
  --ms-tag-color: var(--main-text-color);
  --ms-border-color: var(--main-text-color);
}

// 2. default styles and resets

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--main-text-color);
  background-color: var(--main-bg-color);
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: normal;
  margin-top: 0;
}

a {
  color: var(--main-link-color);
}

span.vm {
  top: inherit;
  background-color: inherit;
  box-shadow: inherit;
}

// 3. Specific elements

// 3.1. Buttons

.btn {
  border-radius: var(--main-border-radius);
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border: var(--main-border-width) solid transparent;
  transition: all 0.3s ease-out, visibility 0s;
  line-height: 1.5;
  background-color: var(--btn-bg-color);

  &:hover,
  &.btn--active {
    color: var(--btn-active-text-color);
    background-color: var(--btn-active-bg-color);
  }
}

.btn--block {
  width: 100%;
}

.btn--main-action {
  color: var(--main-text-color);
  background-color: var(--main-action-bg-color);

  &:hover,
  &.btn--active {
    color: var(--main-action-active-text-color);
    background-color: var(--main-action-active-bg-color);
  }
}

.btn--danger {
  color: var(--danger-text-color);
  background-color: var(--danger-bg-color);

  &:hover,
  &.btn--active {
    color: var(--danger-active-text-color);
    background-color: var(--danger-active-bg-color);
  }
}

.btn-row {
  display: flex;
  gap: 1rem;
}

// 3.2. Select

.select-menu {
  background-color: transparent;
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%204%205'%3E%3Cpath%20fill='%23505050'%20d='M2%200L0%202h4zm0%205L0%203h4z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center right 0.25rem;
  background-size: 0.5rem 0.6rem;
  appearance: none;
  border: var(--main-border-width) solid;
  border-radius: var(--main-border-radius);
  color: inherit;
  line-height: 1.5;
  padding: 0.25rem 0.75rem;
}

// 3.3. Input fields

.input-field {
  background-color: transparent;
  border: var(--main-border-width) solid var(--main-text-color);
  border-radius: var(--main-border-radius);
  display: inline-block;
  line-height: 1.5;
  padding: 0.25rem 0.75rem;
  width: 100%;
}

input[type="checkbox"] + label {
  margin-left: 0.5rem;
}

// 3.4. Modals

@media (min-width: 992px) {
  .modal.modal-lg {
    max-width: 800px;
  }
}

.modal-header {
  font-size: 1.25rem;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 1rem 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
}

// 3.5. Common elements

.view__title-icon {
  height: 20px;
  width: 20px;
  color: var(--main-text-color);
}

.section {
  padding: 0.5rem 2rem;
}

// 3.6. Utility classes
.ml-auto {
  margin-left: auto;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.text-center {
  text-align: center;
}

.mobile-only {
  @include for-tablet-landscape-up {
    display: none !important;
  }
}

.hidden {
  visibility: hidden;
}

// 4. Specific to this view

#kustosz {
  height: 100%;
  overflow: hidden;
}

@include for-tablet-landscape-up {
  .reader-wrapper {
    display: grid;
    grid-template-columns: 280px auto;
    height: 100%;
    overflow: hidden;
  }

  #nav {
    display: flex;
  }
}

.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--main-bg-color);
}

.view {
  background-color: var(--main-bg-color);
  overflow-y: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  height: 100vh;
  padding-bottom: 3rem; /* offsets button on top of sidebar */
  @include for-tablet-landscape-up {
    padding-bottom: 0;
  }
}

.view.login {
  height: auto;
}

.view__title {
  border-bottom: 1px solid var(--main-text-color);
  margin: 0;
  padding: 0.5rem 1.5rem 0;
}
</style>
