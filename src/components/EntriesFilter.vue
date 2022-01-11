<template>
  <div class="search-bar">
    <div class="column">
      <form
        v-if="advancedFormDisplayed"
        @submit.prevent="advancedQueryStringChanged"
      >
        <input
          type="text"
          class="input-field"
          placeholder="Advanced query string"
          style="width: 36.75rem"
          v-model="advancedQueryString"
          @keypress.stop
        />
        <button class="btn btn--primary ml-2" type="submit">Go!</button>
      </form>
      <form v-else>
        <button
          type="button"
          class="btn btn--secondary"
          :class="{ 'btn--active': unreadOnly }"
          @click="toggleUnreadOnly"
        >
          Unread only
        </button>
        <select
          v-model="publishedOperator"
          @change="publishedChanged()"
          class="select-menu mx-2"
          name=""
          id=""
        >
          <option
            v-for="item in publishedOperatorChoices"
            :key="item.label"
            :value="item.value"
          >
            {{ item.label }}
          </option>
        </select>
        than
        <select
          v-model="publishedRefValue"
          @change="publishedChanged()"
          class="select-menu mx-2"
          name=""
          id=""
        >
          <option
            v-for="item in publishedRefValues"
            :key="item.label"
            :value="item.timeAgo"
          >
            {{ item.label }}
          </option>
        </select>
        tagged:
        <Multiselect
          class="mx-2 search-bar__multiselect"
          v-model="tags"
          placeholder="start typing"
          mode="tags"
          :options="entryTags"
          valueProp="slug"
          trackBy="name"
          label="name"
          :closeOnSelect="true"
          :searchable="true"
          :createTag="false"
          @keypress.stop
          @change="newTagsSet"
        ></Multiselect>
      </form>
    </div>
    <div class="column ml-auto">
      <button
        type="button"
        class="btn btn--secondary"
        :class="{ 'btn--active': advancedFormDisplayed }"
        @click="toggleAdvancedFormDisplayed"
      >
        Advanced search
      </button>
      <!-- <button type="button" class="btn btn--secondary">
        Set filter as default
      </button> -->
      <button
        type="button"
        class="btn btn--secondary"
        @click="showMarkAllReadModal"
      >
        Mark all as read
      </button>
    </div>
  </div>
  <Modal
    v-model="markAllReadModalDisplayed"
    :title="`Mark as read (${this.entriesAllCount})`"
  >
    <div class="modal-body">
      <p>
        <strong>{{ entriesAllCount }}</strong> entries are about to be marked as
        read.
      </p>
      <p>This can't be undone.</p>
    </div>

    <div class="modal-footer">
      <button
        class="btn btn--secondary"
        @click="markAllReadModalDisplayed = false"
      >
        Close this window
      </button>
      <button class="btn btn--primary ml-2" @click="markAllReadClicked">
        Mark as read
      </button>
    </div>
  </Modal>
</template>

<script>
import Multiselect from "@vueform/multiselect";
import VueModal from "@kouts/vue-modal";
import qs from "qs";
import { mapGetters } from "vuex";

export default {
  name: "EntriesFilter",
  components: {
    Modal: VueModal,
    Multiselect,
  },
  data() {
    return {
      advancedFormDisplayed: false,
      advancedQueryString: "",
      unreadOnly: false,
      publishedOperator: "",
      publishedRefValue: "",
      tags: [],
      publishedOperatorChoices: [
        { label: "Newer", value: "published_time__gte" },
        { label: "Older", value: "published_time__lte" },
      ],
      publishedRefValues: [
        { label: "-", timeAgo: null },
        { label: "1 day", timeAgo: 1 },
        { label: "2 days", timeAgo: 2 },
        { label: "1 week", timeAgo: 7 },
        { label: "2 weeks", timeAgo: 14 },
      ],
      markAllReadModalDisplayed: false,
    };
  },
  computed: {
    ...mapGetters(["entriesRequestParams", "entriesAllCount", "entryTags"]),
    publishedOperatorChoicesValues() {
      return this.publishedOperatorChoices.map((choice) => choice.value);
    },
  },
  methods: {
    dispatchFilteredEntriesRequest(params) {
      this.$store.dispatch({
        type: "entries_request",
        ...params,
      });
    },
    toggleUnreadOnly() {
      this.unreadOnly = !this.unreadOnly;
      let archived = null;
      if (this.unreadOnly === true) {
        archived = false;
      }
      this.dispatchFilteredEntriesRequest({ archived: archived });
    },
    publishedChanged() {
      const params = {};
      this.publishedOperatorChoicesValues.forEach((paramName) => {
        let paramValue = null;
        if (
          this.publishedRefValue !== null &&
          paramName === this.publishedOperator
        ) {
          paramValue = this.calculateReferenceDate(this.publishedRefValue);
        }
        params[paramName] = paramValue;
      });
      this.dispatchFilteredEntriesRequest(params);
    },
    newTagsSet(newValue) {
      let newTags = newValue.join(",");
      this.dispatchFilteredEntriesRequest({ tags: newTags });
    },
    advancedQueryStringChanged() {
      let params = qs.parse(this.advancedQueryString);
      params["setParamsAsIs"] = true;
      this.dispatchFilteredEntriesRequest(params);
    },
    calculateReferenceDate(daysAgo, sliceNum = -5) {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      return date.toISOString().slice(0, sliceNum);
    },
    setAdvancedFormValues() {
      this.advancedQueryString = qs.stringify(this.entriesRequestParams);
    },
    setSimpleFormValues() {
      this.unreadOnly = this.entriesRequestParams.archived === false;
      this.publishedOperator = this.publishedOperatorChoicesValues[0];
      this.publishedRefValue = null;

      this.publishedOperatorChoicesValues.forEach((choice) => {
        if (choice in this.entriesRequestParams) {
          this.publishedOperator = choice;
        }
      });
      if (this.publishedOperator in this.entriesRequestParams) {
        const dateValue = this.entriesRequestParams[
          this.publishedOperator
        ].slice(0, -9);
        this.publishedRefValues
          .filter((refValueObj) => !(refValueObj.timeAgo === null))
          .forEach((refValueObj) => {
            const refValue = refValueObj.timeAgo;
            const refDateValue = this.calculateReferenceDate(refValue, -14);
            if (refDateValue === dateValue) {
              this.publishedRefValue = refValue;
            }
          });
      }
      if ("tags" in this.entriesRequestParams) {
        this.tags = this.entriesRequestParams.tags.split(",");
      }
    },
    toggleAdvancedFormDisplayed() {
      this.advancedFormDisplayed = !this.advancedFormDisplayed;
      if (this.advancedFormDisplayed) {
        this.setAdvancedFormValues();
      } else {
        this.setSimpleFormValues();
      }
    },
    showMarkAllReadModal() {
      this.markAllReadModalDisplayed = true;
    },
    markAllReadClicked() {
      this.$store.dispatch("entries_mark_as_read").then(() => {
        this.markAllReadModalDisplayed = false;
      });
    },
  },
  created() {
    this.$watch(
      () => this.$route,
      ($route /* eslint-disable-line no-unused-vars*/) => {
        if (this.advancedFormDisplayed) {
          this.setAdvancedFormValues();
        } else {
          this.setSimpleFormValues();
        }
      }
    );
  },
  mounted() {
    this.setSimpleFormValues();
  },
};
</script>

<style lang="scss">
.search-bar {
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
}

.search-bar__multiselect {
  width: 300px;
  display: inline-flex;
}
</style>
