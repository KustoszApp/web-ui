<template>
  <div class="filters">
    <div class="row" v-for="filter in filters" :key="filter.id">
      <div class="col">
        <label class="form-switch">
          <input
            type="checkbox"
            class="form-switch__input"
            :checked="filter.enabled"
          />
          {{ filter.name }}
        </label>
      </div>
      <div class="col">
        <button class="btn btn--warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            @click="fillEditFilerForm(filter)"
          >
            <path
              fill="currentColor"
              d="M 19.171875 2 C 18.448125 2 17.724375 2.275625 17.171875 2.828125 L 16 4 L 20 8 L 21.171875 6.828125 C 22.275875 5.724125 22.275875 3.933125 21.171875 2.828125 C 20.619375 2.275625 19.895625 2 19.171875 2 z M 14.5 5.5 L 3 17 L 3 21 L 7 21 L 18.5 9.5 L 14.5 5.5 z"
            ></path>
          </svg>
        </button>
      </div>
      <div class="col">
        <div class="btn btn--danger">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            @click="deleteFilter(filter)"
          >
            <path
              fill="currentColor"
              d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
    <div class="panel">
      <h3 class="panel-title">New Filter</h3>
      <form @submit.prevent="save">
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
            <!--
            <select class="select-menu">
              <option default="">Field</option>
              <option>Field 1</option>
              <option>Field 2</option>
              <option>Field 3</option>
              <option>Field 4</option>
            </select>
            <select class="select-menu">
              <option default="">Condition</option>
              <option>Condition 1</option>
              <option>Condition 2</option>
              <option>Condition 3</option>
              <option>Condition 4</option>
            </select>
            -->
            <input
              type="text"
              class="input-field"
              v-model="editedFilterCondition"
            />
          </div>
          <h4 class="h4">Then</h4>
          <div class="form-control if-wrapper">
            <select
              v-model="editedFilterActionName"
              class="select-menu"
              name=""
              id=""
            >
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
            />
          </div>
        </div>
        <div class="panel-footer">
          <button type="button" class="btn btn--primary">Try</button>
          <button type="submit" name="run" class="btn btn--primary ml-2">
            Run
          </button>
          <button type="submit" name="save" class="btn btn--primary ml-2">
            Save
          </button>
          <button
            type="button"
            class="btn btn--primary ml-2"
            @click="cancelEditing"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Filters",
  data() {
    return {
      editedFilterId: undefined,
      editedFilterEnabled: true,
      editedFilterName: "",
      editedFilterCondition: "",
      editedFilterActionName: "",
      editedFilterActionArgument: "",
      filterActions: [
        { value: "mark_as_read", label: "Mark as read" },
        { value: "assign_tag", label: "Assign tag" },
        { value: "run_script", label: "Run external application" },
      ],
    };
  },
  computed: {
    ...mapGetters(["filters"]),
  },
  methods: {
    save(e) {
      if (e.submitter.name === "run") {
        return this.runFilter();
      } else if (e.submitter.name === "save") {
        return this.saveFilter();
      }
    },
    runFilter() {},
    saveFilter() {
      this.$store
        .dispatch({
          type:
            this.editedFilterId === undefined
              ? "filter_create_request"
              : "filter_edit_request",
          id: this.editedFilterId,
          enabled: this.editedFilterEnabled,
          name: this.editedFilterName,
          condition: this.editedFilterCondition,
          action_name: this.editedFilterActionName,
          action_argument: this.editedFilterActionArgument,
        })
        .then(() => this.cancelEditing());
    },
    fillEditFilerForm(filter) {
      this.editedFilterId = filter.id;
      this.editedFilterEnabled = filter.enabled;
      this.editedFilterName = filter.name;
      this.editedFilterCondition = filter.condition;
      this.editedFilterActionName = filter.action_name;
      this.editedFilterActionArgument = filter.action_argument;
    },
    deleteFilter(filter) {
      this.$store.dispatch({
        type: "filter_delete_request",
        id: filter.id,
      });
    },
    cancelEditing() {
      this.editedFilterId = undefined;
      this.editedFilterEnabled = true;
      this.editedFilterName = "";
      this.editedFilterCondition = "";
      this.editedFilterActionName = "";
      this.editedFilterActionArgument = "";
    },
  },
  created() {
    this.$store.dispatch("filters_request");
  },
};
</script>

<style lang="scss">
.row {
  display: flex;
  margin-bottom: 0.5rem;
}

.form-switch {
  padding: 0.25rem 0;
  margin-right: 4rem;
}

.form-switch__input {
  border: 2px solid var(--primary);
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
  background-color: var(--secondary);
  background-position: right center;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e");
}

.panel-title {
  border-bottom: 1px solid var(--primary);
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
</style>
