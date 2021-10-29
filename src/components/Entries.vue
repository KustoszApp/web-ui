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
          :title="entry.title"
          :link="entry.link"
          :source="getChannelTitle(entry.channel)"
          :author="entry.author"
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
export default {
  name: "Entries",
  data() {
    return {
      focusedPrevIndex: -1,
      focusedIndex: -1,
    };
  },
  computed: {
    ...mapGetters(["entries", "channels"]),
  },
  methods: {
    getChannelTitle(channelId) {
      const channel = this.channels.find((item) => item.id === channelId);
      if (channel) return channel.title || channel.displayed_title;
      return "";
    },
    open() {
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
      this.entries[index].isOpened = !this.entries[index].isOpened;
    },
  },
  mounted() {
    document.addEventListener("keypress", this.onKeypress);
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
}

.entries__list-item {
  margin: 0;
}
</style>
