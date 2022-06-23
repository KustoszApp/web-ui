<template>
  <button type="button" class="btn actions-list-trigger" @click="toggleDisplay">
    Actions <BIconCaretDownFill />
  </button>
  <div class="actions-list" :class="{ show: actionsDisplayed }">
    <div class="btn-row">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { BIconCaretDownFill } from "bootstrap-icons-vue";

export default {
  name: "ActionsList",
  components: {
    BIconCaretDownFill,
  },
  data() {
    return {
      actionsDisplayed: false,
    };
  },
  methods: {
    toggleDisplay() {
      this.actionsDisplayed = !this.actionsDisplayed;
    },
  },
};
</script>

<style lang="scss">
@import "../scss/mixins";

.actions-list-trigger {
  white-space: nowrap;
  @include for-tablet-portrait-up {
    display: none;
  }
}

@include for-phone-only {
  .actions-list:not(.show) {
    display: none;
  }

  .actions-list {
    position: relative;

    .btn-row {
      position: absolute;
      flex-direction: column;
      background-color: var(--main-bg-color);
      gap: 0.5rem;
      right: 0;
      width: max-content;
      z-index: 10;

      .btn {
        text-align: left;

        span {
          margin-left: 1rem;
        }
      }
    }
  }
}

@include for-tablet-portrait-up {
  .actions-list .btn span {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    top: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
  }
}
</style>
