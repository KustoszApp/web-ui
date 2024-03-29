<template>
  <div class="filters">
    <button
      type="button"
      class="btn btn--main-action btn--big"
      @click="newFilter()"
    >
      Add filter
    </button>
    <div class="row list-item" v-for="filter in filters" :key="filter.id">
      <div class="col col--icon">
        <input
          :id="`filter-${filter.id}`"
          type="checkbox"
          class="col--icon__input"
          :checked="filter.enabled"
          @change="enableChanged(filter)"
        />
      </div>
      <div class="col col--label">
        <label :for="`filter-${filter.id}`">
          {{ filter.name }}
        </label>
      </div>
      <div class="col">
        <ActionsList>
          <button class="btn" title="Edit" @click="editFilter(filter)">
            <BIconPencilFill />
            <span>Edit</span>
          </button>
          <button class="btn" title="Copy" @click="copyFilter(filter)">
            <BIconFileEarmarkPlus />
            <span>Copy</span>
          </button>
          <button
            class="btn btn--danger"
            title="Delete"
            @click="showDeleteFilterModal(filter)"
          >
            <BIconTrash />
            <span>Delete</span>
          </button>
        </ActionsList>
      </div>
    </div>
  </div>
  <Modal
    v-model="editFilterModalDisplayed"
    :title="editFilterModalTitle"
    modal-class="modal modal-lg"
    @closed="afterModalClose"
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
              :disabled="!filterFormIsValid()"
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
  <Modal v-model="deleteFilterModalDisplayed" title="Delete filter">
    <div class="modal-body">
      <p>
        You are about to delete filter <strong>{{ deletedFilterName }}</strong
        >.
      </p>
      <p>This can't be undone.</p>
    </div>

    <div class="modal-footer">
      <div class="btn-row">
        <button class="btn" @click="hideDeleteFilterModal()">
          Close this window
        </button>
        <button class="btn btn--danger" @click="deleteFilter()">Delete</button>
      </div>
    </div>
  </Modal>
</template>

<script>
import {
  BIconFileEarmarkPlus,
  BIconPencilFill,
  BIconTrash,
} from "bootstrap-icons-vue";
import { Modal } from "@kouts/vue-modal";
import { mapGetters } from "vuex";
import ActionsList from "@/components/ActionsList.vue";
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
    ActionsList,
    BIconFileEarmarkPlus,
    BIconPencilFill,
    BIconTrash,
    Modal,
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
        { value: "", label: "Select action", has_argument: false },
        { value: "mark_as_read", label: "Mark as read", has_argument: false },
        { value: "assign_tag", label: "Assign tag", has_argument: true },
        {
          value: "run_script",
          label: "Run external application",
          has_argument: true,
        },
      ],
      deleteFilterModalDisplayed: false,
      deletedFilterId: undefined,
      deletedFilterName: "",
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
        (action) => action.value === this.editedFilterActionName,
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
    copyFilter(filter) {
      this.editedFilterName = `${filter.name} - Copy`;
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
    filterFormIsValid() {
      if (!this.editedFilterName.trim()) {
        return false;
      }
      if (!this.editedFilterCondition.trim()) {
        return false;
      }
      if (!this.editedFilterActionName) {
        return false;
      }
      if (
        this.editedFilterActionArgumentRequired &&
        !this.editedFilterActionArgument
      ) {
        return false;
      }
      const filterNames = this.filters.map((filter) => filter.name);
      if (this.isNewFilter && filterNames.includes(this.editedFilterName)) {
        return false;
      }
      return true;
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
    deleteFilter() {
      this.$store
        .dispatch({
          type: ACTION_FILTER_DELETE_REQUEST,
          id: this.deletedFilterId,
        })
        .then(() => this.hideDeleteFilterModal());
    },
    cancelEditing() {
      this.editFilterModalDisplayed = false;
      this.clearForm();
    },
    showDeleteFilterModal(filter) {
      this.deletedFilterId = filter.id;
      this.deletedFilterName = filter.name;
      this.deleteFilterModalDisplayed = true;
    },
    hideDeleteFilterModal() {
      this.deleteFilterModalDisplayed = false;
      this.deletedFilterName = "";
      this.deletedFilterId = undefined;
    },
  },
  created() {
    this.$store.dispatch(ACTION_FILTERS_REQUEST);
  },
};
</script>

<style lang="scss">
.filters > .btn--main-action {
  margin-bottom: 0.5rem;
}

.col--icon__input {
  /* BIconToggleOff */
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 16 16'%3E%3Cpath d='M11 4a4 4 0 0 1 0 8H8a4.992 4.992 0 0 0 2-4 4.992 4.992 0 0 0-2-4h3zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  appearance: none;
  border: none;
  background-color: var(--main-text-color);
}

.col--icon__input:checked {
  /* BIconToggleOn */
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 16 16'%3E%3Cpath d='M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8z'/%3E%3C/svg%3E");
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
