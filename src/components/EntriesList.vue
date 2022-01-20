<template>
  <div class="entries">
    <ul class="entries__list">
      <div v-if="entries.length == 0">No entries</div>
      <li
        class="entries__list-item"
        v-for="(entry, index) in entries"
        :key="entry.id"
        :ref="storeEntryRef"
      >
        <Entry
          :index="index"
          :entry="entry"
          :initialContent="initialEntryContent"
          :isFocused="isFocused(index)"
          :isOpen="isOpened(index)"
          @archived-change-request="changeArchivedState"
          @entry-header-clicked="toggleOpened"
          @entry-content-changed="setupContentObserver"
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
  ACTION_ENTRY_REQUEST,
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
      entryRefs: [],
      scrollEventDebounce: {},
      scrollRequestDebounce: {},
      entriesListEndObserver: null,
      openedEntryObserver: null,
      entryHeaderObserver: null,
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
    storeEntryRef(elem) {
      if (!elem) {
        return;
      }
      this.entryRefs.push(elem);
    },
    clearObserver(observer) {
      if (observer === null) {
        return;
      }
      observer.disconnect();
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

      this.initialEntryContent = entry.preferred_content.content;
      this.$store.dispatch({
        type: ACTION_ENTRY_REQUEST,
        id: entry.id,
      });
      this.setupContentObserver(index);
      this.setupEntryHeaderObserver(index);
    },
    closeEntry(index) {
      console.log(index); // FIXME: only for linter to shut up
      this.initialEntryContent = "";
      this.openedIndex = -1;
      this.openedEntryObserver.disconnect();
      this.openedEntryObserver = null;
    },
    setupEntryHeaderObserver(index) {
      this.clearObserver(this.entryHeaderObserver);
      const rootElem = document.getElementById("router-view");
      const elem = this.entryRefs[index];
      const entryHeaderElem = elem.querySelector(".entry__header");
      const observerOptions = {
        root: rootElem,
        threshold: [1],
        rootMargin: "-1px 0px 0px 0px",
      };
      this.entryHeaderObserver = new IntersectionObserver((observerEntries) => {
        const entry = observerEntries[0];
        const elem = entry.target.parentNode;
        elem.classList.toggle("on--top", entry.intersectionRatio < 1);
      }, observerOptions);
      this.entryHeaderObserver.observe(entryHeaderElem);
    },
    setupContentObserver(index) {
      this.clearObserver(this.openedEntryObserver);
      this.$nextTick(() => {
        // DOM is updated, we have correct height now
        // FIXME: here's a good place to scroll to last known position,
        // or to ensure entry is on top - do it before we install observer
        const elem = this.entryRefs[index];
        const entryContentElem = elem.querySelector(".entry__content");
        this.openedEntryObserver = new IntersectionObserver(
          this.openedEntryScrolled,
          { threshold: [0] }
        );
        for (let child of entryContentElem.children) {
          this.openedEntryObserver.observe(child);
        }
      });
    },
    openedEntryScrolled(observerEntries) {
      const entriesLeaving = observerEntries.filter((entry) => {
        return !entry.isIntersecting;
      });

      if (entriesLeaving.length === 0) {
        return;
      }

      const observerTarget = entriesLeaving[0];
      const parentNode = observerTarget.target.parentNode;
      const clientHeight = window.innerHeight;
      let readerPosition = null;

      if (0 > observerTarget.boundingClientRect.top) {
        readerPosition = observerTarget.target.offsetTop;
      }
      if (observerTarget.boundingClientRect.top > clientHeight) {
        readerPosition = observerTarget.target.offsetTop - clientHeight;
      }

      if (readerPosition === null) {
        console.error("Element left viewport in undefined way");
        return;
      }

      const readerPositionRatio = readerPosition / parentNode.clientHeight;
      const entry = this.entries[this.openedIndex];

      // FIXME: here's a good place to mark entry as read automatically as we reach bottom

      clearTimeout(this.scrollRequestDebounce);
      this.scrollRequestDebounce = setTimeout(() => {
        this.sendEntryReadPositionRequest(entry.id, readerPositionRatio);
      }, 1000);
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
  beforeUpdate() {
    this.entryRefs = [];
  },
  beforeUnmount() {
    document.removeEventListener("keypress", this.onKeypress);
    this.clearObserver(this.entriesListEndObserver);
    this.clearObserver(this.openedEntryObserver);
    this.clearObserver(this.entryHeaderObserver);
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
