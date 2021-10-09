<template>
  <div
    class="entry"
    :class="{ 'entry--open': isOpen, 'entry--focused': isFocused }"
  >
    <div
      class="entry__header"
      @click="handleClick"
      @click.middle="handleMiddleClick"
    >
      <a ref="entryLink" :href="link">{{ title }}</a> dodano:
      {{ formatDate(addedTime) }}
    </div>
    <div class="entry__content" v-show="isOpen" v-html="entryContent" />
  </div>
</template>

<script>
export default {
  name: "Entry",
  props: {
    index: Number,
    title: String,
    link: String,
    addedTime: String,
    entryContent: String,
    isFocused: Boolean,
    isOpen: Boolean,
  },
  watch: {
    isOpen(value) {
      this.$nextTick(() => {
        if (value) {
          this.$refs.entryLink.scrollIntoView(true);
        }
      });
    },
  },
  methods: {
    handleClick(e) {
      e.preventDefault();
      this.$emit("entryClick", this.index);
    },
    handleMiddleClick() {
      window.open(this.link, "_blank");
    },
    formatDate(value) {
      const date = new Date(value);
      return date.toLocaleString("pl-PL");
    },
  },
};
</script>

<style lang="scss">
.entry {
  border-top: 1px solid #7e7e7e;
}

.entry--focused {
  outline: 3px solid var(--focus);
  border-top-color: transparent;
}

.entry__header {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.entry--open .entry__header {
  border-bottom-color: transparent;
}

.entry__content {
  max-width: 50rem;
  padding: 0.5rem 1rem;
}

.entry__content p {
  margin: 0 0 1rem;
}
</style>
