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
      const container = this.entryRefs[index];

      this.initialEntryContent = entry.preferred_content.content;
      this.$store.dispatch({
        type: ACTION_ENTRY_REQUEST,
        id: entry.id,
      });
      this.$nextTick(() => {
        this.openEntryScroll(entry, container);
        this.setupContentObserver(index);
      });
      this.setupEntryHeaderObserver(index);
    },
    closeEntry(index) {
      this.initialEntryContent = "";
      this.openedIndex = -1;
      this.openedEntryObserver.disconnect();
      this.openedEntryObserver = null;
      const elem = this.entryRefs[index];

      this.$nextTick(() => {
        this.ensureElementInViewport(elem);
      });
    },
    openEntryScroll(entry, ref) {
      const clientHeight = window.innerHeight;
      const refDomRect = ref.getBoundingClientRect();

      if (refDomRect.top > clientHeight / 2) {
        ref.scrollIntoView(true);
      }

      if (0.02 >= entry.reader_position) {
        return;
      }

      const content = ref.querySelector(".entry__content");
      const headerHeight = ref
        .querySelector(".entry__meta")
        .getBoundingClientRect().height;
      const entryHeight = content.getBoundingClientRect().height;
      const entryTop = content.getBoundingClientRect().top;
      const ratio = entryHeight * entry.reader_position;
      for (let curElem of content.getElementsByTagName("*")) {
        const elemDomRect = curElem.getBoundingClientRect();
        const elemPos = elemDomRect.top - entryTop;
        const elemPosWithOffset = elemPos + headerHeight;
        if (elemPosWithOffset > ratio) {
          curElem.scrollIntoView();
          break;
        }
      }
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
        const elem = this.entryRefs[index];
        const entryContentElem = elem.querySelector(".entry__content");
        this.openedEntryObserver = new IntersectionObserver(
          this.openedEntryScrolled,
          { threshold: [0] }
        );
        for (let child of entryContentElem.getElementsByTagName("*")) {
          this.openedEntryObserver.observe(child);
        }
      });
    },
    openedEntryScrolled(observerEntries) {
      const contentNode = observerEntries[0].target.closest(".entry__content");
      if (contentNode === null) {
        return;
      }
      // ignore observer initialization callback
      const allTargets = contentNode.getElementsByTagName("*").length;
      if (observerEntries.length === allTargets) {
        return;
      }
      const entriesLeaving = observerEntries.filter((entry) => {
        return !entry.isIntersecting;
      });
      if (entriesLeaving.length === 0) {
        return;
      }

      // if multiple elements left viewport, pick up the highest one
      let observerTarget = entriesLeaving[0];
      if (entriesLeaving.length > 1) {
        let largestHeightSeen = -1;
        entriesLeaving.forEach((target) => {
          const height = target.boundingClientRect.height;
          if (height > largestHeightSeen) {
            observerTarget = target;
            largestHeightSeen = height;
          }
        });
      }

      let readerPosition = null;
      const clientHeight = window.innerHeight;
      const entryTop = contentNode.getBoundingClientRect().top;
      const elemDomRect = observerTarget.target.getBoundingClientRect();
      const elemPos = elemDomRect.top - entryTop;

      // element is above viewport - user scrolls down
      if (0 > elemDomRect.top) {
        readerPosition = elemPos + elemDomRect.height;
      }
      // element is below viewport - user scrolls up
      if (elemDomRect.top > clientHeight) {
        readerPosition = elemPos - clientHeight;
      }

      if (readerPosition === null) {
        console.error("Element left viewport in undefined way");
        return;
      }

      const readerPositionRatio = readerPosition / contentNode.clientHeight;
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
        return;
      }
      const entry = observerEntries[0];
      if (!entry.isIntersecting) {
        return;
      }
      this.$store.dispatch(ACTION_ENTRIES_NEXT_PAGE_REQUEST);
    },
    sendEntryReadPositionRequest(entry_id, readerPosition) {
      this.$store.dispatch({
        type: ACTION_ENTRY_EDIT_REQUEST,
        id: entry_id,
        reader_position: readerPosition,
      });
    },
    ensureElementInViewport(elem) {
      const domrect = elem.getBoundingClientRect();
      const clientHeight = window.innerHeight;

      if (0 > domrect.top) {
        elem.scrollIntoView(true);
        return;
      }

      if (domrect.top >= clientHeight) {
        elem.scrollIntoView(false);
      }
    },

    // browser event handlers
    onKeypress(e) {
      if (event.isComposing || event.keyCode === 229) {
        return;
      }
      switch (e.code) {
        case "KeyJ":
          this.openNext();
          break;
        case "KeyK":
          this.openPrev();
          break;
        case "KeyB":
        case "KeyP":
          this.focusPrev();
          break;
        case "KeyN":
          this.focusNext();
          break;
        case "Enter":
        case "Space":
        case "KeyO":
          this.toggleOpened(this.focusedIndex);
          break;
        case "KeyM":
          this.changeArchivedState(this.focusedIndex);
          break;
        default:
          () => {}; // noop
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
      const elem = this.entryRefs[focusedIndexNew];
      this.ensureElementInViewport(elem);
    },
    focusPrev() {
      const focusedIndexNew = this.focusedIndex - 1;

      if (0 > focusedIndexNew) {
        return;
      }

      this.focusedIndex = focusedIndexNew;
      const elem = this.entryRefs[focusedIndexNew];
      this.ensureElementInViewport(elem);
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

    document.addEventListener("keydown", this.onKeypress);
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
    document.removeEventListener("keydown", this.onKeypress);
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
