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
      <button
        type="button"
        class="btn btn--secondary"
        @click="toggleArchivedState"
      >
        Mark as {{ isArchivedString() }}
      </button>
      <a ref="entryLink" :href="link">{{ title }}</a> •
      <span class="entry__source">{{ source }}</span> •
      <span class="entry__author">{{ author }}</span> • added:
      <span class="entry__published">{{ formatDate(publishedTime) }}</span>
    </div>
    <div class="entry__content__selector" v-show="isOpen">
      <select
        v-model="selected_content_index"
        @change="newContentSelected"
        class="select-menu"
        name=""
        id=""
      >
        <option
          v-for="(content, index) in entryAvailableContents"
          :key="index"
          :value="index"
        >
          {{ content.source }} {{ content.language }} {{ content.mimetype }} ({{
            formatReadingTime(content.estimated_reading_time)
          }}
          min)
        </option>
      </select>
    </div>
    <div class="entry__content" v-show="isOpen" v-html="entryContent" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Entry",
  data() {
    return {
      selected_content_index: this.getDefaultContentIndex(),
      entryContent: this.entryDefaultContent.content,
      entryArchived: this.isArchived,
    };
  },
  props: {
    index: Number,
    entryId: Number,
    title: String,
    link: String,
    publishedTime: String,
    source: String,
    author: String,
    entryDefaultContent: {},
    entryAvailableContents: [],
    isArchived: Boolean,
    isFocused: Boolean,
    isOpen: Boolean,
  },
  computed: {
    ...mapGetters(["entry"]),
  },
  watch: {
    isOpen(value) {
      this.$nextTick(() => {
        if (value) {
          this.$refs.entryLink.scrollIntoView(true);
          this.$store.dispatch({
            type: "entry_request",
            id: this.entryId,
          });
        }
      });
    },
  },
  methods: {
    toggleArchivedState() {
      this.entryArchived = !this.entryArchived;
      this.$store.dispatch({
        type: "entry_archived_request",
        id: this.entryId,
        archived: this.entryArchived,
      });
    },
    isArchivedString() {
      if (this.entryArchived) {
        return "unread";
      }
      return "read";
    },
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
    formatReadingTime(value) {
      return Math.round(value);
    },
    getDefaultContentIndex() {
      return this.entryAvailableContents.findIndex((content) => {
        return (
          content.source === this.entryDefaultContent.source &&
          content.language === this.entryDefaultContent.language &&
          content.mimetype === this.entryDefaultContent.mimetype
        );
      });
    },
    newContentSelected() {
      if (this.selected_content_index < 0) {
        return;
      }
      let newContentMetadata =
        this.entryAvailableContents[this.selected_content_index];
      let newContent = this.entry.contents.find((content) => {
        return (
          content.source === newContentMetadata.source &&
          content.language === newContentMetadata.language &&
          content.mimetype === newContentMetadata.mimetype
        );
      });
      this.entryContent = newContent.content;
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

.entry__author,
.entry__published {
  color: var(--secondary);
}

.entry--open .entry__header {
  border-bottom-color: transparent;
}

.entry__content__selector {
  text-align: right;
}

.entry__content {
  max-width: 50rem;
  padding: 0.5rem 1rem;
}

.entry__content p {
  margin: 0 0 1rem;
}
</style>
