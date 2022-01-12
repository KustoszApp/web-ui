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
        class="select-menu"
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
      <div class="row">
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
    </div>
    <div class="entry__content" v-show="isOpen" v-html="entryContent" />
  </div>
</template>

<script>
import Multiselect from "@vueform/multiselect";
import { formatDate } from "../utils";
import { mapGetters } from "vuex";
import {
  ACTION_CHANNEL_UNARCHIVED_ENTRIES_CHANGE,
  ACTION_ENTRY_EDIT_REQUEST,
  ACTION_ENTRY_REQUEST,
  ACTION_ENTRY_TAGS_REQUEST,
  GET_ENTRY,
  GET_ENTRY_TAGS,
} from "../types";

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
    ...mapGetters({
      entry: GET_ENTRY,
      entryTags: GET_ENTRY_TAGS,
    }),
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
              type: ACTION_ENTRY_REQUEST,
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
          type: ACTION_ENTRY_EDIT_REQUEST,
          id: this.entryId,
          archived: this.entryArchived,
        })
        .then(() => {
          let unarchived_entries_count = this.entryArchived
            ? "decrease"
            : "increase";
          this.$store.dispatch({
            type: ACTION_CHANNEL_UNARCHIVED_ENTRIES_CHANGE,
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
      this.$store.dispatch({
        type: ACTION_ENTRY_EDIT_REQUEST,
        id: this.entryId,
        preferred_content: newContent.id,
      });
    },
    editedEntryTagsChanged(value) {
      this.$store
        .dispatch({
          type: ACTION_ENTRY_EDIT_REQUEST,
          id: this.entryId,
          tags: value,
        })
        .then(() => {
          this.$store.dispatch(ACTION_ENTRY_TAGS_REQUEST);
        });
    },
  },
};
</script>

<style lang="scss">
@import "../scss/mixins";

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
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  @include for-tablet-landscape-up {
    justify-content: flex-start;
    gap: 1ex;
  }

  & > * {
    flex-basis: calc(50% - 1ex);
    @include for-tablet-landscape-up {
      flex-basis: unset;
    }
  }

  .select-menu {
    max-width: 50%;
  }

  .row {
    display: flex;
    align-items: baseline;
    flex-basis: 100%;
    gap: 1ex;
    margin-top: 0.5rem;
    @include for-tablet-landscape-up {
      flex-basis: unset;
      margin-top: unset;

      .multiselect {
        width: 50ex;
        max-width: 100%;
      }
    }
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
