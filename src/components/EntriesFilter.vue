<template>
  <div class="search-bar">
    <div class="column">
      <form v-if="isAdvancedSearch" @submit.prevent="setFilter">
        <input
          type="text"
          class="input-field"
          placeholder="Advanced query string"
          style="width: 36.75rem"
          v-model="advancedQueryString"
          @keypress.stop
        />
        <button class="btn btn--primary" type="submit">Go!</button>
      </form>
      <form v-else @submit.prevent="setFilter">
        <button
          type="button"
          class="btn btn--secondary"
          :class="{ 'btn--active': !showArchived }"
          @click="toggleShowArchived"
        >
          Unread only
        </button>
        <select v-model="published" class="select-menu" name="" id="">
          <option value="published_time__gte" default>Newer</option>
          <option value="published_time__lte">Older</option>
        </select>
        than
        <select v-model="selected" class="select-menu" name="" id="">
          <option v-for="item in times" :key="item.label" :value="item.timeAgo">
            {{ item.label }}
          </option>
        </select>
        tagged:
        <input
          v-model="tags"
          class="input-field"
          type="text"
          placeholder="start typing"
          @keypress.stop
        />
        <button class="btn btn--primary" type="submit">Go!</button>
      </form>
    </div>
    <div class="column ml-auto">
      <button
        type="button"
        class="btn btn--secondary"
        :class="{ 'btn--active': isAdvancedSearch }"
        @click="toggleIsAdvancedSearch"
      >
        Advanced search
      </button>
      <!-- <button type="button" class="btn btn--secondary">
        Set filter as default
      </button> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "EntriesFilter",
  data() {
    return {
      isAdvancedSearch: false,
      advancedQueryString: "",
      showArchived: true,
      published: "published_time__gte",
      selected: false,
      tags: "",
      times: [
        { label: "1 day", timeAgo: -1 },
        { label: "2 days", timeAgo: -2 },
        { label: "1 week", timeAgo: -7 },
        { label: "2 weeks", timeAgo: -14 },
      ],
    };
  },
  methods: {
    setFilter() {
      const filters = [];
      filters.push(`archived=${this.showArchived}`);
      if (this.published && this.selected) {
        filters.push(
          `${this.published}=${this.calculateDateFilter(this.selected)}`
        );
      }
      if (this.tags) {
        filters.push(`tags=${this.tags}`);
      }

      let qs = "";
      if (this.isAdvancedSearch) {
        qs = this.advancedQueryString;
      } else {
        qs = filters.join("&");
      }
      if (this.$route.params.entryId) {
        qs += `&channel=${this.$route.params.entryId}`;
      }
      console.log(qs);
      this.$store.dispatch({
        type: "entries_request",
        query: qs,
      });
    },
    calculateDateFilter(daysAgo) {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      return date.toISOString().slice(0, -5);
    },
    toggleShowArchived() {
      this.showArchived = !this.showArchived;
    },
    toggleIsAdvancedSearch() {
      this.isAdvancedSearch = !this.isAdvancedSearch;
    },
  },
};
</script>

<style lang="scss">
.search-bar {
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
}

.ml-auto {
  margin-left: auto;
}
</style>
