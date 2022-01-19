<template>
  <div
    class="entry"
    :class="{
      'entry--open': isOpen,
      'entry--focused': isFocused,
      'entry--archived': this.entry.archived,
    }"
    ref="entryWrapper"
  >
    <div class="entry__meta">
      <div
        class="entry__header"
        @click="handleEntryHeaderClick"
        @click.middle="handleEntryHeaderMiddleClick"
      >
        <BIconXLg class="entry__close mobile-only" />
        <a class="entry__link" ref="entryLink" :href="entry.link">
          {{ entry.title }}
        </a>
        <span class="entry__source">{{ entryChannelTitle }}</span>
        <span class="entry__author">{{ entry.author }}</span>
        <span class="entry__published"
          >added: {{ formatDate(entry.published_time) }}</span
        >
      </div>
      <div class="entry__footer" v-show="isOpen">
        <button
          type="button"
          class="btn btn--secondary"
          @click="requestArchiveStateChange"
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
            {{ content.source }} {{ content.language }}
            {{ content.mimetype }} ({{
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
    </div>
    <div class="entry__content" v-show="isOpen" v-html="entryContent" />
  </div>
</template>

<script>
import { BIconXLg } from "bootstrap-icons-vue";
import Multiselect from "@vueform/multiselect";
import { formatDate } from "../utils";
import { mapGetters } from "vuex";
import {
  ACTION_ENTRY_EDIT_REQUEST,
  ACTION_ENTRY_REQUEST,
  ACTION_ENTRY_TAGS_REQUEST,
  GET_CHANNELS,
  GET_ENTRY_TAGS,
} from "../types";

export default {
  name: "Entry",
  components: {
    BIconXLg,
    Multiselect,
  },
  emits: ["archived-change-request", "entry-header-clicked"],
  data() {
    return {
      entrySelectedContent: this.entry.preferred_content.id,
      entryContent: this.initialContent,
      editedArchived: false,
      editedEntryTags: [],
      editedEntryTagsOptions: [],
    };
  },
  props: {
    index: Number,
    entry: Object,
    initialContent: String,
    isFocused: Boolean,
    isOpen: Boolean,
  },
  computed: {
    ...mapGetters({
      channels: GET_CHANNELS,
      entryTags: GET_ENTRY_TAGS,
    }),
    readerPosition() {
      return this.entry.reader_position;
    },
    isArchivedString() {
      if (this.entry.archived) {
        return "unread";
      }
      return "read";
    },
    entryChannelTitle() {
      if (this.channels.length === 0) {
        return;
      }
      const channel = this.channels.find(
        (item) => item.id === this.entry.channel
      );
      return channel.displayed_title;
    },
    entryAvailableContents() {
      if ("available_contents" in this.entry) {
        return this.entry.available_contents;
      }
      return this.entry.contents;
    },
  },
  watch: {
    initialContent(value) {
      this.entryContent = value;
    },
    isOpen(value) {
      this.$nextTick(() => {
        if (value) {
          this.editedEntryTagsOptions = this.entryTags;
          this.$store
            .dispatch({
              type: ACTION_ENTRY_REQUEST,
              id: this.entry.id,
            })
            .then(() => {
              this.editedEntryTags = this.entry.tags;
            });
        } else {
          delete this.$refs.entryWrapper.dataset.previousPos;
        }
        return value;
      }).then((value) => {
        if (!value) {
          /*this.$refs.entryLink.scrollIntoView(true);*/
          return;
        }
        /*console.debug(`this.readerPosition: ${this.readerPosition}`);*/
        if (this.readerPosition <= 0) {
          /*this.$refs.entryLink.scrollIntoView(true);*/
          return;
        }
        const elementHeight = this.$refs.entryWrapper.clientHeight;
        const readerPosition = elementHeight * this.readerPosition;
        const scrollOffset = this.$refs.entryWrapper.offsetTop + readerPosition;
        /*console.debug(`elementHeight: ${elementHeight}`);*/
        /*console.debug(`readerPosition: ${readerPosition}`);*/
        /*console.debug(`scrollOffset: ${scrollOffset}`);*/
        document
          .getElementById("router-view")
          .scrollTo({ top: scrollOffset, behavior: "smooth" });
      });
    },
  },
  methods: {
    requestArchiveStateChange() {
      this.$emit("archived-change-request", this.index);
    },
    handleEntryHeaderClick(e) {
      e.preventDefault();
      this.$emit("entry-header-clicked", this.index);
    },
    handleEntryHeaderMiddleClick(e) {
      if (e.target.tagName === "A") {
        return;
      }
      window.open(this.entry.link, "_blank");
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
        id: this.entry.id,
        preferred_content: newContent.id,
      });
    },
    editedEntryTagsChanged(value) {
      this.$store
        .dispatch({
          type: ACTION_ENTRY_EDIT_REQUEST,
          id: this.entry.id,
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

.entry__meta {
  position: sticky;
  top: 0;
}

.entry__header {
  padding: 0.5rem 1rem;
  cursor: pointer;
  background-color: var(--unread);

  .entry__close {
    display: none;
    font-size: 2rem;
    float: right;
  }

  a.entry__link {
    margin-right: 0.5ex;
  }

  span:not(:first-of-type)::before {
    content: "•";
    margin: 0 0.5ex;
  }
}

.entry--open .entry__header .entry__close {
  display: inherit;
}

.entry__footer {
  padding: 0.5rem 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background-color: var(--darker);

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
    align-items: last baseline;
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

.on--top .entry__header {
  .entry__source,
  .entry__author,
  .entry__published {
    display: none;
    @include for-tablet-landscape-up {
      display: unset;
    }
  }
}

.on--top:not(.scroll--up) .entry__meta {
  visibility: hidden;
  @include for-tablet-landscape-up {
    visibility: unset;
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
