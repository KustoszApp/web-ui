<template>
  <div
    class="search-bar topmost-elem"
    :class="{ 'has-more-options': moreOptionsDisplayed }"
  >
    <div class="column row">
      <form
        class="advanced"
        v-if="advancedFormDisplayed"
        @submit.prevent="advancedQueryStringChanged"
      >
        <div class="row">
          <input
            type="text"
            class="input-field advanced"
            placeholder="Advanced query string"
            v-model="advancedQueryString"
            @keydown.stop
          />
          <button class="btn btn--main-action" type="submit">Go!</button>
        </div>
      </form>
      <form class="simple" v-else>
        <div class="row">
          <button
            type="button"
            class="btn btn--main-action"
            :class="{ 'btn--active': unreadOnly }"
            @click="toggleUnreadOnly"
          >
            Unread only
          </button>
          <button
            type="button"
            class="btn mobile-only"
            @click="toggleMoreOptions"
          >
            {{ moreOptionsButtonText }}
          </button>
        </div>
        <div class="row">
          <select
            v-model="publishedOperator"
            @change="publishedChanged()"
            class="select-menu"
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
            class="select-menu"
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
        </div>
        <div class="row multiselect-wrapper">
          tagged:
          <Multiselect
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
            @keydown.stop
            @change="newTagsSet"
          ></Multiselect>
        </div>
      </form>
    </div>
    <div class="column row btn-row">
      <button
        type="button"
        class="btn"
        :class="{ 'btn--active': advancedFormDisplayed }"
        @click="toggleAdvancedFormDisplayed"
      >
        Advanced search
      </button>
      <!-- <button type="button" class="btn">
        Save filter
      </button> -->
      <button type="button" class="btn" @click="showMarkAllReadModal">
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
      <div class="btn-row">
        <button class="btn" @click="markAllReadModalDisplayed = false">
          Close this window
        </button>
        <button class="btn btn--main-action" @click="markAllReadClicked">
          Mark as read
        </button>
      </div>
    </div>
  </Modal>
</template>

<script>
import Multiselect from "@vueform/multiselect";
import VueModal from "@kouts/vue-modal";
import qs from "qs";
import { mapGetters } from "vuex";
import { calculateReferenceDate } from "../utils";

import {
  ACTION_ENTRIES_MARK_AS_READ,
  ACTION_ENTRIES_REQUEST,
  GET_ENTRIES_ALL_COUNT,
  GET_ENTRIES_REQUEST_PARAMS,
  GET_ENTRY_TAGS,
} from "../types";

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
      moreOptionsDisplayed: false,
    };
  },
  computed: {
    ...mapGetters({
      entriesRequestParams: GET_ENTRIES_REQUEST_PARAMS,
      entriesAllCount: GET_ENTRIES_ALL_COUNT,
      entryTags: GET_ENTRY_TAGS,
    }),
    publishedOperatorChoicesValues() {
      return this.publishedOperatorChoices.map((choice) => choice.value);
    },
    moreOptionsButtonText() {
      if (this.moreOptionsDisplayed) {
        return "Fewer options";
      }
      return "More options";
    },
  },
  methods: {
    calculateReferenceDate,
    dispatchFilteredEntriesRequest(params) {
      this.$store.dispatch({
        type: ACTION_ENTRIES_REQUEST,
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
    toggleMoreOptions() {
      this.moreOptionsDisplayed = !this.moreOptionsDisplayed;
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
      this.$store.dispatch(ACTION_ENTRIES_MARK_AS_READ).then(() => {
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

<style lang="scss" scoped>
@import "@vueform/multiselect/themes/default.css";
@import "../scss/mixins";
@mixin full-form-visible {
  form.simple .row {
    display: flex;
  }
  .column.btn-row {
    display: flex;
  }
}

.row {
  margin-bottom: 0;
}

.search-bar {
  @include for-tablet-landscape-up {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
  }

  @include for-desktop-up {
    flex-direction: row;
    gap: 5rem;
  }

  form {
    display: flex;
    gap: 1rem;
    flex-grow: 1;
    margin-bottom: 1rem;
    @include for-tablet-landscape-up {
      margin-bottom: unset;
    }
  }

  form.simple {
    flex-flow: column;
    @include for-tablet-landscape-up {
      flex-flow: row;
    }

    .row {
      display: none;
      align-items: baseline;
      gap: 1ex;

      &:first-child {
        display: flex;
        flex-shrink: 0;
      }

      &.multiselect-wrapper {
        flex-grow: 1;
        justify-content: normal;
      }

      @include for-desktop-up {
        .multiselect {
          max-width: 50ex;
          margin: 0;
        }
      }
    }
  }

  form.advanced {
    .row {
      flex-grow: 1;
      gap: 1ex;
    }

    input.advanced {
      flex-grow: 1;
      max-width: 100%;
    }
  }

  .column.row:not(.btn-row) {
    flex-grow: 1;
  }

  .column.btn-row {
    display: none;
    flex-wrap: wrap;
    gap: 1ex;

    .btn {
      flex-grow: 1;

      @include for-tablet-landscape-up {
        flex-grow: unset;
      }
    }
  }

  &.has-more-options {
    @include full-form-visible;
  }

  @include for-tablet-landscape-up {
    @include full-form-visible;
  }
}
</style>
