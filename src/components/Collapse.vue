<template>
  <div
    class="collapse-trigger"
    :class="{ show: containerDisplayed }"
    @click="toggleDisplay"
  >
    <slot name="header"></slot>
  </div>
  <div class="collapse-container" :class="{ show: containerDisplayed }">
    <slot name="collapse"></slot>
  </div>
</template>

<script>
export default {
  name: "Collapse",
  props: {
    show: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      containerDisplayed: this.show,
    };
  },
  methods: {
    toggleDisplay() {
      this.containerDisplayed = !this.containerDisplayed;
    },
  },
  created() {
    this.$watch(
      () => this.show,
      (newVal) => (this.containerDisplayed = newVal)
    );
  },
};
</script>

<style lang="scss">
.collapse-container:not(.show) {
  display: none;
}
</style>
