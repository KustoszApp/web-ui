<template>
  <div v-if="displayDaySelector">
    <p>
      That did not receive any entries in last
      <input
        type="number"
        :value="daySelectorValue"
        @change="daySelectorChanged"
      />
      days
    </p>
  </div>
  <div class="list">
    <ul class="list__content">
      <li
        class="list__item"
        v-for="channel in maintenance_channels"
        :key="channel.id"
      >
        <input
          :id="channel.id"
          :value="channel.id"
          class="input-check mr-1"
          type="checkbox"
          v-model="checkedChannels"
        />
        <label :for="channel.id">{{ channel.displayed_title }}</label>
        (<router-link
          class="list__item-link"
          :to="{
            name: this.ROUTE_ENTRIES,
            query: { channel: channel.id, channel_tags: null },
          }"
        >
          see content </router-link
        >)
      </li>
    </ul>
  </div>
  <div>
    <button
      v-if="displayInactivateButton"
      class="btn btn--primary"
      type="submit"
      @click="inactivateChannels"
    >
      {{ inactivateButtonLabel }}
    </button>
    <button
      v-if="displayActivateButton"
      class="btn btn--primary"
      type="submit"
      @click="activateChannels"
    >
      {{ activateButtonLabel }}
    </button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { calculateReferenceDate } from "../utils";

import {
  ACTION_MAINTENANCE_CHANNELS_GET_REQUEST,
  ACTION_MAINTENANCE_CHANNELS_ACTIVATE_REQUEST,
  ACTION_MAINTENANCE_CHANNELS_INACTIVATE_REQUEST,
  GET_MAINTENANCE_CHANNELS,
  ROUTE_ENTRIES,
} from "../types";

export default {
  name: "NavList",
  props: {
    initialQuery: Object,
    displayDaySelector: Boolean,
    displayInactivateButton: Boolean,
    displayActivateButton: Boolean,
    displayRemoveButton: Boolean,
  },
  data() {
    return {
      checkedChannels: [],
      daySelectorValue: 30,
      ROUTE_ENTRIES,
    };
  },
  computed: {
    ...mapGetters({
      maintenance_channels: GET_MAINTENANCE_CHANNELS,
    }),
    channelsSelected() {
      return this.checkedChannels.length > 0;
    },
    inactivateButtonLabel() {
      if (this.channelsSelected) {
        return "Inactivate selected channels";
      }
      return "Inactivate all channels";
    },
    activateButtonLabel() {
      if (this.channelsSelected) {
        return "Activate selected channels";
      }
      return "Activate all channels";
    },
    getChannelsQuery() {
      const queryParams = { ...this.initialQuery };
      if (this.displayDaySelector) {
        queryParams["last_entry_published_time__lte"] =
          this.calculateReferenceDate(this.daySelectorValue);
      }
      return queryParams;
    },
    modifyChannelsQuery() {
      const queryParams = { ...this.getChannelsQuery };
      if (this.channelsSelected) {
        queryParams["id"] = this.checkedChannels.join(",");
      }
      return queryParams;
    },
  },
  methods: {
    calculateReferenceDate,
    requestChannels() {
      this.$store.dispatch({
        type: ACTION_MAINTENANCE_CHANNELS_GET_REQUEST,
        query: this.getChannelsQuery,
      });
    },
    resetComponentState() {
      this.checkedChannels = [];
      this.requestChannels();
    },
    daySelectorChanged(e) {
      const newValue = parseInt(e.target.value);
      this.daySelectorValue = newValue;
      this.requestChannels();
    },
    inactivateChannels() {
      this.$store
        .dispatch({
          type: ACTION_MAINTENANCE_CHANNELS_INACTIVATE_REQUEST,
          query: this.modifyChannelsQuery,
        })
        .then(() => this.resetComponentState());
    },
    activateChannels() {
      this.$store
        .dispatch({
          type: ACTION_MAINTENANCE_CHANNELS_ACTIVATE_REQUEST,
          query: this.modifyChannelsQuery,
        })
        .then(() => this.resetComponentState());
    },
  },
  created() {
    this.$watch(
      () => this.initialQuery,
      (newVal /* eslint-disable-line no-unused-vars*/) => {
        this.resetComponentState();
      }
    );
  },
};
</script>
