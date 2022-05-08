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
}

html[data-theme="light"] {
  @include makeTheme($lightTheme);
}

html[data-theme="dark"] {
  @include makeTheme($darkTheme);
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
  color: var(--primary);
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
  color: var(--link);
}

span.vm {
  top: inherit;
  background-color: inherit;
  box-shadow: inherit;
}

// 3. Specific elements

// 3.1. Buttons

.btn {
  border-radius: 0.25rem;
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border: 2px solid transparent;
  transition: all 0.3s ease-out, visibility 0s;
  line-height: 1.5;
}

.btn--active {
  box-shadow: 0 0 0 4px var(--focus);
}

.btn--block {
  width: 100%;
}

.btn--primary {
  color: var(--primary);
  background-color: var(--warning);
}

.btn--primary:hover {
  color: var(--warning);
  background-color: transparent;
  border-color: var(--warning);
}

.btn--secondary {
  color: var(--primary);
  border-color: var(--primary);
  background-color: transparent;
}

.btn--secondary.btn--active,
.btn--secondary:hover {
  background-color: var(--primary);
  color: var(--lighter);
}

.btn--warning {
  color: var(--primary);
  border-color: transparent;
  background-color: var(--warning);
}

.btn--danger {
  color: var(--lighter);
  border-color: transparent;
  background-color: var(--danger);
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
  border: 2px solid;
  border-radius: 0.25rem;
  color: inherit;
  line-height: 1.5;
  padding: 0.25rem 0.75rem;
}

// 3.3. Input fields

.input-field {
  background-color: transparent;
  border: 2px solid var(--primary);
  border-radius: 0.25rem;
  display: inline-block;
  line-height: 1.5;
  padding: 0.25rem 0.75rem;
  width: 100%;
}

.input-check {
  border-radius: 0.25rem;
  width: 1rem;
  height: 1rem;
  margin-top: 0.15rem;
  vertical-align: top;
  background-color: #fff;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  border: 2px solid var(--primary);
  appearance: none;
  color-adjust: exact;
}

.input-check:checked {
  background-color: var(--secondary);
  border-color: var(--secondary);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3l6-6'/%3e%3c/svg%3e");
}

.multiselect {
  border-width: 2px;
  border-color: var(--primary);
}

.input-check + label {
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
  color: var(--primary);
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
  background-color: var(--darker);
}

.view {
  background-color: var(--darker);
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
  border-bottom: 1px solid var(--primary);
  margin: 0;
  padding: 0.5rem 1.5rem 0;
}
</style>
