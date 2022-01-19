<template>
  <div class="entries">
    <ul class="entries__list">
      <div v-if="entries.length == 0">No entries</div>
      <li
        class="entries__list-item"
        v-for="(entry, index) in entries"
        :key="entry.id"
      >
        <Entry
          :index="index"
          :entry="entry"
          :initialContent="initialEntryContent"
          :isFocused="isFocused(index)"
          :isOpen="isOpened(index)"
          @archived-change-request="changeArchivedState"
          @entry-header-clicked="toggleOpened"
        />
      </li>
    </ul>
    <div ref="entriesListEnd" :class="{ hidden: !hasMoreEntries }">
      Fetching more entries
    </div>
  </div>
</template>

<script>
import Entry from "./Entry.vue";
import { mapGetters } from "vuex";

import {
  ACTION_ENTRY_EDIT_REQUEST,
  ACTION_ENTRIES_NEXT_PAGE_REQUEST,
  ACTION_CHANNEL_UNARCHIVED_ENTRIES_CHANGE,
  GET_CHANNELS,
  GET_ENTRIES,
  GET_STATUS,
  GET_ENTRIES_REQUEST_PARAMS,
  GET_ENTRIES_NEXT_PAGE,
} from "../types";

export default {
  name: "EntriesList",
  data() {
    return {
      focusedIndex: -1,
      openedIndex: -1,
      initialEntryContent: "",
      scrollEventDebounce: {},
      scrollRequestDebounce: {},
      entriesListEndObserver: {},
      previousTop: 0,
      previousHeight: 0,
    };
  },
  computed: {
    ...mapGetters({
      status: GET_STATUS,
      entries: GET_ENTRIES,
      entriesNextPage: GET_ENTRIES_NEXT_PAGE,
      entriesRequestParams: GET_ENTRIES_REQUEST_PARAMS,
      channels: GET_CHANNELS,
    }),
    hasMoreEntries() {
      return this.entriesNextPage !== null && this.entriesNextPage !== "";
    },
  },
  methods: {
    isFocused(index) {
      return index === this.focusedIndex;
    },
    isOpened(index) {
      return index === this.openedIndex;
    },
    toggleOpened(index) {
      const currentlyOpened = this.isOpened(index);
      if (!currentlyOpened) {
        this.openEntry(index);
      } else {
        this.closeEntry(index);
      }
    },
    openEntry(index) {
      this.openedIndex = index;
      this.focusedIndex = index;

      const entry = this.entries[index];
      console.log(entry);
      this.initialEntryContent = entry.preferred_content.content;
    },
    closeEntry(index) {
      console.log(index); // FIXME: only for linter to shut up
      this.initialEntryContent = "";
      this.openedIndex = -1;
    },
    changeArchivedState(index) {
      const entry = this.entries[index];
      const archivedStateNew = !entry.archived;
      let unarchivedEntriesCountChange = "decrease";
      if (!archivedStateNew) {
        unarchivedEntriesCountChange = "increase";
      }
      this.$store
        .dispatch({
          type: ACTION_ENTRY_EDIT_REQUEST,
          id: entry.id,
          archived: archivedStateNew,
        })
        .then(() => {
          this.$store.dispatch({
            type: ACTION_CHANNEL_UNARCHIVED_ENTRIES_CHANGE,
            channel_id: entry.channel,
            unarchived_entries_count: unarchivedEntriesCountChange,
          });
        });
    },
    fetchMoreEntries(observerEntries) {
      if (this.entries.length === 0) {
        console.debug("entries observer: no entries");
        return;
      }
      const entry = observerEntries[0];
      if (!entry.isIntersecting) {
        console.debug("entries observer: target not intersecting");
        return;
      }
      console.debug("entries observer: target intersecting");
      this.$store.dispatch(ACTION_ENTRIES_NEXT_PAGE_REQUEST);
    },
    sendEntryReadPositionRequest(entry_id, readerPosition) {
      this.$store.dispatch({
        type: ACTION_ENTRY_EDIT_REQUEST,
        id: entry_id,
        reader_position: readerPosition,
      });
    },

    // browser event handlers
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
        this.toggleOpened(this.focusedIndex);
      }
      if (e.code == "KeyM") {
        this.changeArchivedState(this.focusedIndex);
      }
    },
    onScroll(e) {
      clearTimeout(this.scrollEventDebounce);
      this.scrollEventDebounce = setTimeout(() => {
        /*this.debugScrolling(e);*/
        this.scrolledUpClass(e);
      }, 10);
    },
    openNext() {
      const focusedIndexOld = this.focusedIndex;
      this.focusNext();
      const focusedIndexNew = this.focusedIndex;

      if (focusedIndexOld === focusedIndexNew) {
        return;
      }

      this.toggleOpened(focusedIndexNew);
    },
    openPrev() {
      const focusedIndexOld = this.focusedIndex;
      this.focusPrev();
      const focusedIndexNew = this.focusedIndex;

      if (focusedIndexOld === focusedIndexNew) {
        return;
      }

      this.toggleOpened(focusedIndexNew);
    },
    focusNext() {
      const focusedIndexNew = this.focusedIndex + 1;
      const entriesNumber = this.entries.length;

      if (focusedIndexNew >= entriesNumber) {
        return;
      }

      this.focusedIndex = focusedIndexNew;
    },
    focusPrev() {
      const focusedIndexNew = this.focusedIndex - 1;

      if (0 > focusedIndexNew) {
        return;
      }

      this.focusedIndex = focusedIndexNew;
    },
    debugScrolling(e) {
      const elem = e.target;
      console.log(new Date());
      console.log(`scrollTop: ${elem.scrollTop}`);
      console.log(`scrollHeight: ${elem.scrollHeight}`);
      console.log(`clientHeight: ${elem.clientHeight}`);
    },
    scrolledUpClass(e) {
      const element = e.target;
      const currentTop = element.scrollTop;
      const currentHeight = element.scrollHeight;
      const previousTop = this.previousTop;
      const previousHeight = this.previousHeight;

      this.previousTop = currentTop;
      this.previousHeight = currentHeight;

      if (currentHeight !== previousHeight) {
        return;
      }

      const force = previousTop > currentTop;
      element.classList.toggle("scroll--up", force);
    },
    openEntryClassesOld(e) {
      const scrollElement = e.target;
      const currentTop = scrollElement.scrollTop;

      document.querySelectorAll(".entry--open").forEach((element) => {
        const previousPos = parseInt(element.dataset.previousPos, 10);
        const currentPos = currentTop - element.offsetTop;
        console.debug(`currentTop: ${currentTop}`);
        console.debug(`previousPos: ${previousPos}`);
        console.debug(`currentPos: ${currentPos}`);

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
  },
  watch: {
    entriesRequestParams(newVal /* eslint-disable-line no-unused-vars*/) {
      this.focusedIndex = -1;
      this.openedIndex = -1;
    },
  },
  mounted() {
    const rootElem = document.getElementById("router-view");

    document.addEventListener("keypress", this.onKeypress);
    rootElem.addEventListener("scroll", this.onScroll);
    this.entriesListEndObserver = new IntersectionObserver(
      this.fetchMoreEntries,
      { root: rootElem }
    );
    this.entriesListEndObserver.observe(this.$refs.entriesListEnd);
  },
  beforeUnmount() {
    document.removeEventListener("keypress", this.onKeypress);
    this.entriesListEndObserver.disconnect();
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
