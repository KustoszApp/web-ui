<template>
  <div class="filters">
    <button
      type="button"
      class="btn btn--main-action btn--big"
      @click="newFilter()"
    >
      Add filter
    </button>
    <div class="row" v-for="filter in filters" :key="filter.id">
      <div class="col">
        <label class="form-switch">
          <input
            type="checkbox"
            class="form-switch__input"
            :checked="filter.enabled"
            @change="enableChanged(filter)"
          />
          {{ filter.name }}
        </label>
      </div>
      <div class="col">
        <button class="btn" @click="editFilter(filter)">
          <BIconPencilFill />
        </button>
      </div>
      <div class="col">
        <button class="btn btn--danger" @click="deleteFilter(filter)">
          <BIconTrash />
        </button>
      </div>
    </div>
  </div>
  <Modal
    v-model="editFilterModalDisplayed"
    :title="editFilterModalTitle"
    modal-class="modal modal-lg"
    @after-close="afterModalClose"
  >
    <div class="modal-body">
      <form>
        <div class="panel-content">
          <label for="filterName">Name</label>
          <div class="form-control">
            <input
              id="filterName"
              type="text"
              class="input-field"
              v-model="editedFilterName"
            />
          </div>
          <h4 class="h4">If</h4>
          <div>
            <input
              type="text"
              class="input-field"
              v-model="editedFilterCondition"
            />
          </div>
          <h4 class="h4">Then</h4>
          <div class="form-control if-wrapper">
            <select v-model="editedFilterActionName" class="select-menu">
              <option
                v-for="item in filterActions"
                :key="item.label"
                :value="item.value"
              >
                {{ item.label }}
              </option>
            </select>
            <input
              type="text"
              class="input-field"
              v-model="editedFilterActionArgument"
              :required="editedFilterActionArgumentRequired"
              :disabled="!editedFilterActionArgumentRequired"
            />
          </div>
        </div>
        <div class="panel-footer">
          <div class="btn-row">
            <button
              type="button"
              class="btn btn--main-action"
              @click="tryFilter"
              :disabled="tryFilterStatus === 'loading'"
            >
              Try
            </button>
            <!--<button type="button" class="btn btn--main-action">
              Run
            </button>-->
            <button
              type="button"
              class="btn btn--main-action"
              @click="saveFilter"
            >
              Save
            </button>
            <button
              type="button"
              class="btn btn--main-action"
              @click="cancelEditing"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
      <div class="try-results" v-if="tryFilterStatus === 'success'">
        <p>
          Entries found by this filter:
          <strong>{{ tryFilterEntriesAllCount }}</strong>
        </p>
        <ul class="list__content">
          <li
            class="list__item"
            v-for="entry in tryFilterEntries"
            :key="entry.id"
          >
            <a :href="entry.link" :title="entry.title">{{ entry.title }}</a> •
            <span class="entry__source">{{
              getChannelTitle(entry.channel)
            }}</span>
            • <span class="entry__author">{{ entry.author }}</span> • added:
            <span class="entry__published">{{
              formatDate(entry.published_time)
            }}</span>
          </li>
        </ul>
      </div>
    </div>
  </Modal>
</template>

<script>
import { BIconPencilFill, BIconTrash } from "bootstrap-icons-vue";
import VueModal from "@kouts/vue-modal";
import { mapGetters } from "vuex";
import { formatDate } from "../utils";

import {
  ACTION_FILTER_CREATE_REQUEST,
  ACTION_FILTER_DELETE_REQUEST,
  ACTION_FILTER_EDIT_REQUEST,
  ACTION_FILTER_TRY_DATA_RESET,
  ACTION_FILTER_TRY_REQUEST,
  ACTION_FILTERS_REQUEST,
  GET_CHANNELS,
  GET_FILTERS,
  GET_TRY_FILTER_ENTRIES,
  GET_TRY_FILTER_ENTRIES_ALL_COUNT,
  GET_TRY_FILTER_STATUS,
} from "../types";

export default {
  name: "Filters",
  components: {
    BIconPencilFill,
    BIconTrash,
    Modal: VueModal,
  },
  data() {
    return {
      editFilterModalDisplayed: false,
      editedFilterId: undefined,
      editedFilterEnabled: true,
      editedFilterName: "",
      editedFilterCondition: "",
      editedFilterActionName: "",
      editedFilterActionArgument: "",
      filterActions: [
        { value: "mark_as_read", label: "Mark as read", has_argument: false },
        { value: "assign_tag", label: "Assign tag", has_argument: true },
        {
          value: "run_script",
          label: "Run external application",
          has_argument: true,
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      tryFilterStatus: GET_TRY_FILTER_STATUS,
      tryFilterEntriesAllCount: GET_TRY_FILTER_ENTRIES_ALL_COUNT,
      tryFilterEntries: GET_TRY_FILTER_ENTRIES,
      filters: GET_FILTERS,
      channels: GET_CHANNELS,
    }),
    editFilterModalTitle() {
      if (this.isNewFilter) {
        return "New filter";
      }
      return `Edit filter ${this.editedFilterName}`;
    },
    editedFilterActionArgumentRequired() {
      const selectedAction = this.filterActions.find(
        (action) => action.value === this.editedFilterActionName
      );
      if (selectedAction === undefined) {
        return false;
      }
      return selectedAction.has_argument;
    },
    isNewFilter() {
      return this.editedFilterId === undefined;
    },
  },
  methods: {
    getChannelTitle(channelId) {
      const channel = this.channels.find((item) => item.id === channelId);
      if (!channel) {
        return "";
      }
      return channel.displayed_title;
    },
    formatDate,
    afterModalClose() {
      if (this.isNewFilter) {
        return;
      }
      this.clearForm();
    },
    clearForm() {
      this.editedFilterId = undefined;
      this.editedFilterEnabled = true;
      this.editedFilterName = "";
      this.editedFilterCondition = "";
      this.editedFilterActionName = "";
      this.editedFilterActionArgument = "";
      this.$store.dispatch(ACTION_FILTER_TRY_DATA_RESET);
    },
    newFilter() {
      this.editFilterModalDisplayed = true;
    },
    enableChanged(filter) {
      this.$store.dispatch({
        type: ACTION_FILTER_EDIT_REQUEST,
        id: filter.id,
        enabled: !filter.enabled,
      });
    },
    editFilter(filter) {
      this.editedFilterId = filter.id;
      this.editedFilterEnabled = filter.enabled;
      this.editedFilterName = filter.name;
      this.editedFilterCondition = filter.condition;
      this.editedFilterActionName = filter.action_name;
      this.editedFilterActionArgument = filter.action_argument;
      this.editFilterModalDisplayed = true;
    },
    tryFilter() {
      this.$store.dispatch({
        type: ACTION_FILTER_TRY_REQUEST,
        condition: this.editedFilterCondition,
      });
    },
    saveFilter() {
      let dispatch_type = ACTION_FILTER_EDIT_REQUEST;
      if (this.isNewFilter) {
        dispatch_type = ACTION_FILTER_CREATE_REQUEST;
      }
      const params = {
        id: this.editedFilterId,
        enabled: this.editedFilterEnabled,
        name: this.editedFilterName,
        condition: this.editedFilterCondition,
        action_name: this.editedFilterActionName,
      };
      if (this.editedFilterActionArgumentRequired) {
        params.action_argument = this.editedFilterActionArgument;
      }
      this.$store
        .dispatch({
          type: dispatch_type,
          ...params,
        })
        .then(() => this.cancelEditing());
    },
    deleteFilter(filter) {
      this.$store.dispatch({
        type: ACTION_FILTER_DELETE_REQUEST,
        id: filter.id,
      });
    },
    cancelEditing() {
      this.editFilterModalDisplayed = false;
      this.clearForm();
    },
  },
  created() {
    this.$store.dispatch(ACTION_FILTERS_REQUEST);
  },
};
</script>

<style lang="scss">
.form-switch {
  padding: 0.25rem 0;
  margin-right: 4rem;
}

.form-switch__input {
  border: 2px solid var(--main-text-color);
  border-radius: 1rem;
  margin-top: 0.25rem;
  width: 2rem;
  height: 1rem;
  appearance: none;
  background-position: left center;
  background-repeat: no-repeat;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='rgba%280, 0, 0, 0.25%29'/%3e%3c/svg%3e");
  transition: background-position 0.15s ease-in-out;
}

.form-switch__input:checked {
  background-color: var(--secondary-text-color);
  background-position: right center;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e");
}

.panel-title {
  border-bottom: 1px solid var(--main-text-color);
}

.panel-content {
  margin-bottom: 1rem;
}

.h4 {
  margin-bottom: 0;
}

.if-wrapper {
  display: flex;

  input {
    margin-left: 1rem;
  }
}

.try-results .list__item {
  display: flex;
  a {
    max-width: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
