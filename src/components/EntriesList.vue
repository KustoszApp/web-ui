<template>
  <div class="entries">
    <ul class="entries-list">
      <div v-if="entries.length == 0">No entries</div>
      <li
        class="entries-list__item"
        v-for="(entry, index) in entries"
        :data-vue-index="index"
        :key="entry.id"
        :ref="storeEntryRef"
      >
        <Entry
          :index="index"
          :entry="entry"
          :initialContent="initialEntryContentFor(index)"
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
  GET_USER,
} from "../types";

export default {
  name: "EntriesList",
  data() {
    return {
      focusedIndex: -1,
      openedIndex: -1,
      initialEntryContent: "",
      entryRefs: {},
      scrollEventDebounce: {},
      scrollRequestDebounce: {},
      markAsReadTimeout: {},
      entriesListEndObserver: null,
      openedEntryObserver: null,
      entryHeaderObserver: null,
      entryMarkAsReadObserver: null,
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
      user: GET_USER,
    }),
    hasMoreEntries() {
      return this.entriesNextPage !== null && this.entriesNextPage !== "";
    },
    markAsReadStrategy() {
      return this.user.entry_mark_as_read_strategy;
    },
    markAsReadOpenTime() {
      return this.user.entry_mark_as_read_open_time;
    },
    markAsReadRatio() {
      return this.user.entry_mark_as_read_ratio;
    },
  },
  methods: {
    isAnyOpened() {
      return this.openedIndex >= 0;
    },
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
      const key = elem.dataset.vueIndex;
      this.entryRefs[key] = elem;
    },
    clearObserver(observer) {
      if (observer === null) {
        return;
      }
      observer.disconnect();
    },
    initialEntryContentFor(index) {
      const currentlyOpened = this.isOpened(index);
      if (!currentlyOpened) {
        return "";
      }
      return this.initialEntryContent;
    },
    getEntryRef(index) {
      const key = index.toString(10);
      return this.entryRefs[key];
    },
    toggleOpened(index) {
      const anyOpened = this.isAnyOpened();
      const currentlyOpened = this.isOpened(index);
      // close previous entry - clean up observers and CSS classes
      if (anyOpened) {
        this.closeEntry(this.openedIndex, currentlyOpened);
      }
      if (!currentlyOpened) {
        this.openEntry(index);
      }
    },
    openEntry(index) {
      this.openedIndex = index;
      this.focusedIndex = index;

      const entry = this.entries[index];
      const container = this.getEntryRef(index);

      const initialEntryContentObj = entry.preferred_content;
      if (initialEntryContentObj) {
        this.initialEntryContent = initialEntryContentObj.content;
      }
      this.$store
        .dispatch({
          type: ACTION_ENTRY_REQUEST,
          id: entry.id,
        })
        .then(() => {
          // This needs to be here to prevent race condition mostly visible
          // when using 'opened' strategy.
          // Marking as read modifies store and then sends request.
          // If we call setupMarkAsRead with other setups below, following
          // could happen:
          // 1. We send ACTION_ENTRY_REQUEST
          // 2. We mark entry as read in store and send request
          // 3. We get response from ACTION_ENTRY_REQUEST, which was generated
          //    when entry was still unread - and it will cancel our marking
          //    as read
          this.$nextTick(() => {
            this.setupMarkAsRead(index);
          });
        });
      this.$nextTick(() => {
        this.setupEntryHeaderObserver(index);
        this.openEntryScroll(entry, container);
        this.setupContentObserver(index);
      });
    },
    closeEntry(index, ensureElementInViewport = false) {
      this.initialEntryContent = "";
      this.openedIndex = -1;
      this.clearObserver(this.openedEntryObserver);
      this.clearObserver(this.entryHeaderObserver);
      this.clearObserver(this.entryMarkAsReadObserver);
      clearTimeout(this.markAsReadTimeout);
      this.openedEntryObserver = null;
      this.entryHeaderObserver = null;
      this.entryMarkAsReadObserver = null;
      const elem = this.getEntryRef(index);
      elem.querySelector(".entry__meta").classList.remove("on-top");

      // make sure header is visible, so user doesn't end up looking at random
      // part of list
      // unless this closing is part of process of opening another entry,
      // in which case we can leave it up to openEntryScroll
      if (ensureElementInViewport) {
        this.$nextTick(() => {
          this.ensureElementInViewport(elem);
        });
      }
    },
    openEntryScroll(entry, ref) {
      const clientHeight = window.innerHeight;
      const refDomRectTop = ref.getBoundingClientRect().top;

      // scroll entry to top of page if:
      // 1. header is at the bottom half of screen
      // 2. we just closed another entry, and header ended up way above
      //    top of viewport
      if (refDomRectTop > clientHeight / 2 || 0 > refDomRectTop) {
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
        let elemMarginBottom = parseInt(
          window.getComputedStyle(curElem).marginBottom,
          10
        );
        if (isNaN(elemMarginBottom)) {
          elemMarginBottom = 0;
        }
        const elemPos = elemDomRect.top - entryTop;
        const elemPosWithOffset = elemPos + elemMarginBottom + headerHeight;
        if (elemPosWithOffset > ratio) {
          curElem.scrollIntoView();
          break;
        }
      }
    },
    setupEntryHeaderObserver(index) {
      this.clearObserver(this.entryHeaderObserver);
      const rootElem = document.getElementById("router-view");
      const elem = this.getEntryRef(index);
      const entrySentinelElem = elem.querySelector(".entry__sentinel");
      const entryMetaElem = elem.querySelector(".entry__meta");
      const observerRootMarginT = entryMetaElem.getBoundingClientRect().height;
      const observerOptions = {
        root: rootElem,
        threshold: [1],
        rootMargin: `-${observerRootMarginT}px 0px 0px 0px`,
      };
      this.entryHeaderObserver = new IntersectionObserver((observerEntries) => {
        const entry = observerEntries[0];
        // if element is intersecting (~ is visible), then we are NOT
        // at the top of the screen anymore
        // if it's not intersecting, then it is above top of viewport,
        // meaning we should add `on-top` class
        const force = entry.isIntersecting === false;
        entryMetaElem.classList.toggle("on-top", force);
      }, observerOptions);
      this.entryHeaderObserver.observe(entrySentinelElem);
    },
    setupContentObserver(index) {
      this.clearObserver(this.openedEntryObserver);
      this.$nextTick(() => {
        const elem = this.getEntryRef(index);
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
    setupMarkAsRead(index) {
      if (this.markAsReadStrategy === "opened") {
        const entry = this.entries[this.openedIndex];
        if (!entry.archived) {
          this.changeArchivedState(this.openedIndex);
        }
        return;
      }

      if (this.markAsReadStrategy === "open_for_time") {
        const timeout = this.markAsReadOpenTime * 1000;
        clearTimeout(this.markAsReadTimeout);
        this.markAsReadTimeout = setTimeout(() => {
          const entry = this.entries[this.openedIndex];
          if (!entry.archived) {
            this.changeArchivedState(this.openedIndex);
          }
        }, timeout);
        return;
      }

      if (
        this.markAsReadStrategy === "percent_read" &&
        this.markAsReadRatio >= 1
      ) {
        this.clearObserver(this.entryMarkAsReadObserver);
        const rootElem = document.getElementById("router-view");
        const elem = this.getEntryRef(index);
        const entrySentinelElem = elem.querySelector(".entry__end__sentinel");
        const observerOptions = {
          root: rootElem,
          threshold: [1],
        };
        this.entryMarkAsReadObserver = new IntersectionObserver(
          (observerEntries) => {
            const observerEntry = observerEntries[0];
            if (observerEntry.isIntersecting === false) {
              return;
            }
            const entry = this.entries[this.openedIndex];
            if (!entry.archived) {
              this.changeArchivedState(this.openedIndex);
            }
          },
          observerOptions
        );
        this.entryMarkAsReadObserver.observe(entrySentinelElem);
        return;
      }
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

      if (
        !entry.archived &&
        this.markAsReadStrategy === "percent_read" &&
        readerPositionRatio > this.markAsReadRatio
      ) {
        this.changeArchivedState(this.openedIndex);
      }

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

      if (domrect.bottom >= clientHeight) {
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
        case "Space":
          e.preventDefault();
          this.toggleOpened(this.focusedIndex);
          break;
        case "Enter":
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
      const elem = this.getEntryRef(focusedIndexNew);
      this.ensureElementInViewport(elem);
    },
    focusPrev() {
      const focusedIndexNew = this.focusedIndex - 1;

      if (0 > focusedIndexNew) {
        return;
      }

      this.focusedIndex = focusedIndexNew;
      const elem = this.getEntryRef(focusedIndexNew);
      this.ensureElementInViewport(elem);
    },
    scrolledUpClass(e) {
      const element = e.target;
      const domrect = element
        .getElementsByTagName("*")[0]
        .getBoundingClientRect();
      const currentTop = parseInt(domrect.top, 10);
      const currentHeight = parseInt(domrect.height, 10);
      const previousTop = this.previousTop;
      const previousHeight = this.previousHeight;

      this.previousTop = currentTop;
      this.previousHeight = currentHeight;

      // app navigation triggered scroll event
      if (currentHeight !== previousHeight) {
        element.classList.remove("scroll-up");
        return;
      }

      if (previousTop === currentTop) {
        return;
      }

      const force = currentTop > previousTop;
      element.classList.toggle("scroll-up", force);
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
    this.entryRefs = {};
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.onKeypress);
    this.clearObserver(this.entriesListEndObserver);
    this.clearObserver(this.openedEntryObserver);
    this.clearObserver(this.entryHeaderObserver);
    this.clearObserver(this.entryMarkAsReadObserver);
    clearTimeout(this.markAsReadTimeout);
  },
  components: {
    Entry,
  },
};
</script>

<style lang="scss">
.entries-list {
  list-style-type: none;
  padding: 0;
  margin-top: 0;
}

.entries-list__item {
  margin: 0;
}
</style>
