<template>
  <div class="mark-as-read-selection">
    <div class="row">
      <input
        type="radio"
        id="mark-as-read-never"
        :value="'never'"
        v-model="markAsReadStrategy"
      />
      <label for="mark-as-read-never">Never</label>
    </div>
    <div class="row">
      <input
        type="radio"
        id="mark-as-read-opened"
        :value="'opened'"
        v-model="markAsReadStrategy"
      />
      <label for="mark-as-read-opened">Upon opening</label>
    </div>
    <div class="row">
      <input
        type="radio"
        id="mark-as-read-open_for_time"
        :value="'open_for_time'"
        v-model="markAsReadStrategy"
      />
      <label for="mark-as-read-open_for_time">
        When opened for
        <input
          type="number"
          min="1"
          step="1"
          :disabled="markAsReadStrategy !== 'open_for_time'"
          v-model="markAsReadOpenTime"
        />
        seconds
      </label>
    </div>
    <div class="row">
      <input
        type="radio"
        id="mark-as-read-percent_read"
        :value="'percent_read'"
        v-model="markAsReadStrategy"
      />
      <label for="mark-as-read-percent_read">
        When
        <input
          type="number"
          min="0"
          max="100"
          step="1"
          :disabled="markAsReadStrategy !== 'percent_read'"
          v-model="markAsReadRatio"
        />
        % has been read
      </label>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { GET_USER, ACTION_USER_DATA_EDIT_REQUEST } from "../types";

export default {
  name: "MarkAsReadStrategySwitcher",
  computed: {
    ...mapGetters({
      user: GET_USER,
    }),
    markAsReadStrategy: {
      get() {
        return this.user.entry_mark_as_read_strategy;
      },
      set(newValue) {
        this.$store.dispatch({
          type: ACTION_USER_DATA_EDIT_REQUEST,
          entry_mark_as_read_strategy: newValue,
        });
      },
    },
    markAsReadOpenTime: {
      get() {
        return this.user.entry_mark_as_read_open_time;
      },
      set(newValue) {
        this.$store.dispatch({
          type: ACTION_USER_DATA_EDIT_REQUEST,
          entry_mark_as_read_open_time: newValue,
        });
      },
    },
    markAsReadRatio: {
      get() {
        return this.user.entry_mark_as_read_ratio * 100;
      },
      set(newValue) {
        let newRatio = 0;
        if (newValue > 0) {
          newRatio = newValue / 100;
        }
        this.$store.dispatch({
          type: ACTION_USER_DATA_EDIT_REQUEST,
          entry_mark_as_read_ratio: newRatio,
        });
      },
    },
  },
};
</script>

<style lang="scss">
.mark-as-read-selection {
  .row {
    align-items: baseline;

    input {
      margin-right: 0.5rem;
    }
  }
}
</style>
