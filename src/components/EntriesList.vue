<template>
  <div class="entries">
    <ul class="entries__list">
      <div v-if="entries.length == 0">Brak wpisów</div>
      <li
        class="entries__list-item"
        v-for="(entry, index) in entries"
        :key="entry.id"
      >
        <Entry
          :index="index"
          :entryId="entry.id"
          :channelId="entry.channel"
          :title="entry.title"
          :link="entry.link"
          :source="getChannelTitle(entry.channel)"
          :author="entry.author"
          :readerPosition="entry.reader_position"
          :publishedTime="entry.published_time"
          :entryDefaultContent="entry.preferred_content"
          :entryAvailableContents="entry.available_contents"
          :isArchived="entry.archived"
          :isFocused="entry.isFocused"
          :isOpen="entry.isOpened"
          @entryClick="handleEntryClick"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import Entry from "./Entry.vue";
import { mapGetters } from "vuex";

import {
  ACTION_ENTRY_EDIT_REQUEST,
  ACTION_ENTRIES_NEXT_PAGE_REQUEST,
  GET_CHANNELS,
  GET_ENTRIES,
  GET_STATUS,
} from "../types";

export default {
  name: "EntriesList",
  data() {
    return {
      focusedPrevIndex: -1,
      focusedIndex: -1,
      scrollRequestDebounce: {},
    };
  },
  computed: {
    ...mapGetters({
      status: GET_STATUS,
      entries: GET_ENTRIES,
      channels: GET_CHANNELS,
    }),
  },
  methods: {
    getChannelTitle(channelId) {
      const channel = this.channels.find((item) => item.id === channelId);
      if (channel) return channel.title || channel.displayed_title;
      return "";
    },
    closeAllOpen(index) {
      const previousState = this.entries[index].isOpened;
      this.entries
        .filter((entry) => entry.isOpened)
        .forEach((entry) => {
          entry.isOpened = false;
        });
      this.entries[index].isOpened = previousState;
    },
    open() {
      this.closeAllOpen(this.focusedIndex);
      this.entries[this.focusedIndex].isOpened =
        !this.entries[this.focusedIndex].isOpened;
    },
    openNext() {
      if (this.focusedIndex < this.entries.length) {
        this.focusNext();
        if (this.focusedPrevIndex < this.entries.length) {
          if (this.focusedPrevIndex > -1) {
            this.entries[this.focusedPrevIndex].isOpened = false;
          }
        }
        this.entries[this.focusedIndex].isOpened = true;
      }
    },
    openPrev() {
      if (this.focusedIndex > 0) {
        this.focusPrev();
        if (this.focusedPrevIndex >= 0) {
          this.entries[this.focusedPrevIndex].isOpened = false;
        }
        this.entries[this.focusedIndex].isOpened = true;
      }
    },
    focusNext() {
      this.focusedPrevIndex = this.focusedIndex;
      this.focusedIndex += 1;
      if (this.focusedIndex < this.entries.length) {
        if (this.focusedPrevIndex > -1) {
          this.entries[this.focusedPrevIndex].isFocused = false;
        }
        this.entries[this.focusedIndex].isFocused = true;
      } else {
        this.focusedIndex = this.entries.length - 1;
      }
    },
    focusPrev() {
      this.focusedPrevIndex = this.focusedIndex;
      this.focusedIndex -= 1;
      if (this.focusedIndex >= 0) {
        this.entries[this.focusedPrevIndex].isFocused = false;
        this.entries[this.focusedIndex].isFocused = true;
      } else {
        this.focusedIndex = 0;
      }
    },
    onKeypress(e) {
      if (e.code == "KeyJ") {
        this.openNext();
      }
      if (e.code == "KeyK") {
        this.openPrev();
      }
      if (e.code == "KeyP") {
        this.focusPrev();
      }
      if (e.code == "KeyN") {
        this.focusNext();
      }
      if (e.code == "KeyO") {
        this.open();
      }
    },
    handleEntryClick(index) {
      this.closeAllOpen(index);
      this.entries[index].isOpened = !this.entries[index].isOpened;
    },
    onScroll(e) {
      this.openEntryClasses(e);
      this.fetchMoreEntries(e);
    },
    openEntryClasses(e) {
      const scrollElement = e.target;
      const currentTop = scrollElement.scrollTop;

      document.querySelectorAll(".entry--open").forEach((element) => {
        const previousPos = parseInt(element.dataset.previousPos, 10);
        const currentPos = currentTop - element.offsetTop;

        element.classList.toggle("on--top", currentPos > 0);

        element.dataset.previousPos = currentPos;

        if (isNaN(previousPos)) {
          return;
        }

        const force = previousPos > currentPos;
        element.classList.toggle("scroll--up", force);

        if (currentPos === previousPos) {
          return;
        }

        const clientHeight = element.clientHeight;
        const readerPosition = currentPos / clientHeight;
        const entry = this.entries.find((entry) => entry.isOpened);
        clearTimeout(this.scrollRequestDebounce);
        this.scrollRequestDebounce = setTimeout(() => {
          this.sendEntryReadPositionRequest(entry.id, readerPosition);
        }, 1000);
      });
    },
    fetchMoreEntries(e) {
      if (this.status === "loading") {
        return;
      }
      const element = e.target;
      const currentPos = element.scrollHeight - Math.abs(element.scrollTop);
      const thresholdPos = 2 * element.clientHeight;
      const bottomOfView = currentPos <= thresholdPos;
      if (bottomOfView) {
        this.$store.dispatch(ACTION_ENTRIES_NEXT_PAGE_REQUEST);
      }
    },
    sendEntryReadPositionRequest(entry_id, readerPosition) {
      this.$store.dispatch({
        type: ACTION_ENTRY_EDIT_REQUEST,
        id: entry_id,
        reader_position: readerPosition,
      });
    },
  },
  mounted() {
    document.addEventListener("keypress", this.onKeypress);
    document
      .getElementById("router-view")
      .addEventListener("scroll", this.onScroll);
  },
  beforeUnmount() {
    document.removeEventListener("keypress", this.onKeypress);
  },
  components: {
    Entry,
  },
};
</script>

<style lang="scss">
.entries__list {
  list-style-type: none;
  padding: 0;
  margin-top: 0;
}

.entries__list-item {
  margin: 0;
}
</style>
