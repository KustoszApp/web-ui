<template>
  <div class="entries-list">
    <ul>
      <li v-for="(entry, index) in entries" :key="entry.id">
        <Entry
          :index="index"
          :title="entry.title"
          :link="entry.link"
          :addedTime="entry.added_time"
          :entryContent="entry.preferred_content.content"
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
export default {
  name: "Entries",
  data() {
    return {
      focusedPrevIndex: -1,
      focusedIndex: -1,
      entries: [],
    };
  },
  created() {
    fetch("http://127.0.0.1:8000/api/v1/entries")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.entries = data.results.map((item) => {
          return { ...item, isFocused: false, isOpened: false };
        });
      });
  },
  methods: {
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
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 0 10px;
}
a {
  color: #1d9bf3;
}
</style>
