<template>
  <div
    class="entry"
    :class="{ 'entry--open': isOpen, 'entry--focused': isFocused }"
  >
    <div
      class="entry-header"
      @click="handleClick"
      @click.middle="handleMiddleClick"
    >
      <a ref="entryLink" :href="link">{{ title }}</a> dodano:
      {{ formatDate(addedTime) }}
    </div>
    <div class="entry-content" v-show="isOpen" v-html="entryContent" />
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
  border: 1px solid bisque;
}

.entry--focused {
  outline: 2px dotted brown;
}

.entry-header {
  padding: 0.5rem 0;
  cursor: pointer;
}
.entry--open .entry-header {
  border-bottom-color: transparent;
}
.entry-content {
  max-width: 50rem;
}
</style>
