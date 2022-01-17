<template>
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
    <form v-if="displayInactivateButton" @submit.prevent="inactivateChannels">
      <button class="btn btn--primary" type="submit">
        Inactivate selected channels
      </button>
    </form>
    <form v-if="displayActivateButton" @submit.prevent="activateChannels">
      <button class="btn btn--primary" type="submit">
        Activate selected channels
      </button>
    </form>
    <form v-if="displayRemoveButton" @submit.prevent="removeChannels">
      <button class="btn btn--primary" type="submit">
        Remove selected channels
      </button>
    </form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import {
  ACTION_MAINTENANCE_CHANNELS_ACTIVATE_REQUEST,
  ACTION_MAINTENANCE_CHANNELS_GET_REQUEST,
  ACTION_MAINTENANCE_CHANNELS_INACTIVATE_REQUEST,
  GET_MAINTENANCE_CHANNELS,
  ROUTE_ENTRIES,
} from "../types";

export default {
  name: "NavList",
  data() {
    return {
      query: "",
      checkedChannels: [],
      displayInactivateButton: true,
      displayActivateButton: false,
      displayRemoveButton: false,
      ROUTE_ENTRIES,
    };
  },
  computed: {
    ...mapGetters({
      maintenance_channels: GET_MAINTENANCE_CHANNELS,
    }),
  },
  methods: {
    inactivateChannels() {
      this.$store.dispatch({
        type: ACTION_MAINTENANCE_CHANNELS_INACTIVATE_REQUEST,
        query: `id=${this.checkedChannels.join(",")}`,
      });
    },
    activateChannels() {
      this.$store.dispatch({
        type: ACTION_MAINTENANCE_CHANNELS_ACTIVATE_REQUEST,
        query: `id=${this.checkedChannels.join(",")}`,
      });
    },
    removeChannels() {
      this.$store.dispatch({
        type: "not_implemented_maintenance_channels_delete_request",
        query: `id=${this.checkedChannels.join(",")}`,
      });
    },
  },
  watch: {
    $route(to) {
      this.checkedChannels = [];
      if (to.path.includes("stale")) {
        this.query = "is_stale=true";
        this.displayInactivateButton = true;
        this.displayActivateButton = false;
        this.displayRemoveButton = false;
      } else if (to.path.includes("not_updated")) {
        const date = new Date();
        date.setDate(date.getDate() - 30); // FIXME: hardcoded
        const referenceDate = date.toISOString().slice(0, -5);
        this.query = `last_entry_published_time__lte=${referenceDate}`;
        this.displayInactivateButton = true;
        this.displayActivateButton = false;
        this.displayRemoveButton = false;
      } else if (to.path.includes("inactive")) {
        this.query = "active=false";
        this.displayInactivateButton = false;
        this.displayActivateButton = true;
        this.displayRemoveButton = false; // FIXME: should be true
      }
      this.$store.dispatch({
        type: ACTION_MAINTENANCE_CHANNELS_GET_REQUEST,
        query: this.query,
      });
    },
  },
};
</script>
