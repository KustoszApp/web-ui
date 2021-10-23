<template>
  <div class="filters">
    <div class="row" v-for="filter in filters" :key="filter.id">
      <div class="col">
        <label class="form-switch">
          <input
            type="checkbox"
            class="form-switch__input"
            :checked="filter.isActive"
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
              v-model="filterName"
            />
          </div>
          <h4 class="h4">If</h4>
          <div>
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
            <input id="filterName" type="text" class="input-field" />
          </div>
          <h4 class="h4">Then</h4>
          <div>
            <select class="select-menu">
              <option default="">Action</option>
              <option>Action 1</option>
              <option>Action 2</option>
              <option>Action 3</option>
              <option>Action 4</option>
            </select>
            <input id="filterName" type="text" class="input-field" />
          </div>
        </div>
        <div class="panel-footer">
          <button type="button" class="btn btn--primary">Try</button>
          <button type="submit" name="run" class="btn btn--primary">Run</button>
          <button type="submit" name="save" class="btn btn--primary">
            Save
          </button>
          <button type="button" class="btn btn--primary">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Filters",
  data() {
    return {
      filters: [
        { id: 1, isActive: false, name: "Filter 1" },
        { id: 2, isActive: true, name: "Filter 2" },
        { id: 3, isActive: true, name: "Filter 3" },
        { id: 4, isActive: false, name: "Filter 4" },
      ],
      filterName: "",
    };
  },
  methods: {
    save(e) {
      console.log(e.submitter);
      const item = {
        isActive: e.submitter.name === "run",
        name: this.filterName,
      };
      this.filters.push(item);
    },
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
</style>