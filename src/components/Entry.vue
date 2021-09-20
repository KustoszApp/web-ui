<template>
  <div class="entry" :class="{ 'entry--open': isOpen }">
    <div
      class="entry-header"
      @click="handleClick"
      @click.middle="handleMiddleClick"
    >
      <a :href="link">{{ title }}</a> dodano: {{ formatDate(addedTime) }}
    </div>
    <div class="entry-content" v-show="isOpen" v-html="entryContent" />
  </div>
</template>

<script>
export default {
  name: "Entry",
  props: {
    title: String,
    link: String,
    addedTime: String,
    entryContent: String,
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    handleClick(e) {
      e.preventDefault();
      this.isOpen = !this.isOpen;
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

<style lang="scss" scoped>
.entry {
  border: 1px solid bisque;
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
