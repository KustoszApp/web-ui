<template>
  <div
    class="entry"
    :class="{
      'entry--open': isOpen,
      'entry--focused': isFocused,
      'entry--archived': entryArchived,
    }"
  >
    <div
      class="entry__header"
      @click="handleClick"
      @click.middle="handleMiddleClick"
    >
      <a ref="entryLink" :href="link">{{ title }}</a> •
      <span class="entry__source">{{ source }}</span> •
      <span class="entry__author">{{ author }}</span> • added:
      <span class="entry__published">{{ formatDate(publishedTime) }}</span>
    </div>
    <div class="entry__footer" v-show="isOpen">
      <button
        type="button"
        class="btn btn--secondary"
        @click="toggleArchivedState"
      >
        Mark as {{ isArchivedString }}
      </button>
      <select
        v-model="entrySelectedContent"
        @change="newContentSelected"
        class="select-menu ml-2"
      >
        <option
          v-for="content in entryAvailableContents"
          :key="content.id"
          :value="content.id"
        >
          {{ content.source }} {{ content.language }} {{ content.mimetype }} ({{
            formatReadingTime(content.estimated_reading_time)
          }}
          min)
        </option>
      </select>
      Tags:
      <Multiselect
        v-model="editedEntryTags"
        mode="tags"
        :options="editedEntryTagsOptions"
        valueProp="name"
        trackBy="name"
        label="name"
        :closeOnSelect="false"
        :searchable="true"
        :createTag="true"
        @change="editedEntryTagsChanged"
        @keypress.stop
      ></Multiselect>
    </div>
    <div class="entry__content" v-show="isOpen" v-html="entryContent" />
  </div>
</template>

<script>
import Multiselect from "@vueform/multiselect";
import { formatDate } from "../utils";
import { mapGetters } from "vuex";
export default {
  name: "Entry",
  components: {
    Multiselect,
  },
  data() {
    return {
      entrySelectedContent: this.entryDefaultContent.id,
      entryContent: "",
      entryArchived: this.isArchived,
      editedEntryTags: [],
      editedEntryTagsOptions: [],
    };
  },
  props: {
    index: Number,
    entryId: Number,
    channelId: Number,
    title: String,
    link: String,
    publishedTime: String,
    source: String,
    author: String,
    entryDefaultContent: Object,
    entryAvailableContents: Array,
    isArchived: Boolean,
    isFocused: Boolean,
    isOpen: Boolean,
  },
  computed: {
    ...mapGetters(["entry", "entryTags"]),
    isArchivedString() {
      if (this.entryArchived) {
        return "unread";
      }
      return "read";
    },
  },
  watch: {
    isOpen(value) {
      this.$nextTick(() => {
        if (value) {
          this.entryContent = this.entryDefaultContent.content;
          this.$refs.entryLink.scrollIntoView(true);
          this.editedEntryTagsOptions = this.entryTags;
          this.$store
            .dispatch({
              type: "entry_request",
              id: this.entryId,
            })
            .then(() => {
              this.editedEntryTags = this.entry.tags;
            });
        } else {
          this.entryContent = "";
        }
      });
    },
  },
  methods: {
    toggleArchivedState() {
      this.entryArchived = !this.entryArchived;
      this.$store
        .dispatch({
          type: "entry_edit_request",
          id: this.entryId,
          archived: this.entryArchived,
        })
        .then(() => {
          let unarchived_entries_count = this.entryArchived
            ? "decrease"
            : "increase";
          this.$store.dispatch({
            type: "channel_unarchived_entries_change",
            channel_id: this.channelId,
            unarchived_entries_count: unarchived_entries_count,
          });
        });
    },
    handleClick(e) {
      e.preventDefault();
      this.$emit("entryClick", this.index);
    },
    handleMiddleClick() {
      window.open(this.link, "_blank");
    },
    formatDate,
    formatReadingTime(value) {
      return Math.round(value);
    },
    newContentSelected() {
      const newContent = this.entry.contents.find(
        (x) => x.id === this.entrySelectedContent
      );
      this.entryContent = newContent.content;
    },
    editedEntryTagsChanged(value) {
      this.$store
        .dispatch({
          type: "entry_edit_request",
          id: this.entryId,
          tags: value,
        })
        .then(() => {
          this.$store.dispatch("entry_tags_request");
        });
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
  background-color: var(--unread);
}

.entry__footer {
  padding: 0.5rem 1rem;

  .multiselect {
    width: auto;
    min-width: 30%;
    max-width: 70%;
    display: inline-flex;
  }
}

.entry--archived .entry__header {
  background-color: var(--darker);

  .entry__author,
  .entry__published {
    color: var(--secondary);
  }
}

.entry__author,
.entry__published {
  color: var(--secondary);
}

.entry--open .entry__header {
  border-bottom-color: transparent;
}

.entry__content {
  max-width: 50rem;
  padding: 0.5rem 1rem;
}

.entry__content::after {
  content: "";
  clear: both;
  display: block;
}

.entry__content .entry__content {
  padding: 0;
}

.entry__content p {
  margin: 0 0 1rem;
}
</style>
