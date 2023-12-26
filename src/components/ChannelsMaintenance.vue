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
  <div class="maintenance">
    <div
      class="row list-item"
      v-for="channel in maintenance_channels"
      :key="channel.id"
    >
      <div class="col col--icon">
        <input
          :id="`channel-${channel.id}`"
          :value="channel.id"
          class="input-check"
          type="checkbox"
          v-model="checkedChannels"
        />
      </div>
      <div class="col col--label">
        <label :for="`channel-${channel.id}`">
          {{ channel.displayed_title }}
        </label>
      </div>
      <div class="col">
        <ActionsList>
          <button
            class="btn"
            title="Edit"
            @click="showChannelEditModal(channel)"
          >
            <BIconPencilFill />
            <span>Edit</span>
          </button>

          <router-link
            :to="{
              name: this.ROUTE_ENTRIES,
              query: { channel: channel.id, channel_tags: null },
            }"
            title="See channel content"
          >
            <button class="btn btn--main-action">
              <BIconBinocularsFill />
              <span>See channel content</span>
            </button>
          </router-link>
        </ActionsList>
      </div>
    </div>
  </div>

  <div class="btn-row">
    <button
      v-if="displayInactivateButton"
      class="btn btn--main-action"
      type="submit"
      @click="inactivateChannels"
    >
      {{ inactivateButtonLabel }}
    </button>
    <button
      v-if="displayActivateButton"
      class="btn btn--main-action"
      type="submit"
      @click="activateChannels"
    >
      {{ activateButtonLabel }}
    </button>
    <button
      v-if="displayDeleteButton"
      class="btn btn--danger"
      type="submit"
      @click="deleteChannelsModalDisplayed = true"
    >
      {{ deleteButtonLabel }}
    </button>
  </div>
  <Modal
    v-model="deleteChannelsModalDisplayed"
    :title="`Delete channels (${this.channelsSelectedCount})`"
  >
    <div class="modal-body">
      <p>
        You are about to delete <strong>{{ channelsSelectedCount }}</strong>
        channels.
      </p>
      <p>This can't be undone.</p>
      <p v-if="totalTaggedEntriesCount > 0">
        <input
          class="input-check"
          type="checkbox"
          id="deleteTaggedEntries"
          v-model="deleteTaggedEntries"
        />
        <label for="deleteTaggedEntries">
          Delete also <strong>{{ totalTaggedEntriesCount }}</strong> tagged
          entries.
        </label>
      </p>
    </div>

    <div class="modal-footer">
      <div class="btn-row">
        <button class="btn" @click="deleteChannelsModalDisplayed = false">
          Close this window
        </button>
        <button class="btn btn--danger" @click="deleteChannels">Delete</button>
      </div>
    </div>
  </Modal>
  <ChannelEditModal
    :channel="editedChannel"
    :modalDisplayed="channelEditModalDisplayed"
    @update:modalDisplayed="(newVal) => (channelEditModalDisplayed = newVal)"
  />
</template>

<script>
import { BIconPencilFill, BIconBinocularsFill } from "bootstrap-icons-vue";
import { mapGetters } from "vuex";
import ActionsList from "@/components/ActionsList.vue";
import ChannelEditModal from "@/components/ChannelEditModal.vue";
import { Modal } from "@kouts/vue-modal";
import { calculateReferenceDate } from "../utils";

import {
  ACTION_MAINTENANCE_CHANNELS_GET_REQUEST,
  ACTION_MAINTENANCE_CHANNELS_ACTIVATE_REQUEST,
  ACTION_MAINTENANCE_CHANNELS_DELETE_REQUEST,
  ACTION_MAINTENANCE_CHANNELS_INACTIVATE_REQUEST,
  GET_MAINTENANCE_CHANNELS,
  ROUTE_ENTRIES,
} from "../types";

export default {
  name: "ChannelsMaintenance",
  components: {
    ActionsList,
    BIconPencilFill,
    BIconBinocularsFill,
    ChannelEditModal,
    Modal,
  },
  props: {
    initialQuery: Object,
    displayDaySelector: Boolean,
    displayInactivateButton: Boolean,
    displayActivateButton: Boolean,
    displayDeleteButton: Boolean,
  },
  data() {
    return {
      checkedChannels: [],
      daySelectorValue: 30,
      editedChannel: {},
      ROUTE_ENTRIES,
      channelEditModalDisplayed: false,
      deleteChannelsModalDisplayed: false,
      deleteTaggedEntries: false,
    };
  },
  computed: {
    ...mapGetters({
      maintenance_channels: GET_MAINTENANCE_CHANNELS,
    }),
    channelsSelected() {
      return this.checkedChannels.length > 0;
    },
    channelsSelectedCount() {
      if (this.channelsSelected) {
        return this.checkedChannels.length;
      }
      return this.maintenance_channels.length;
    },
    totalTaggedEntriesCount() {
      return this.maintenance_channels
        .filter((channel) => {
          return (
            !this.channelsSelected || this.checkedChannels.includes(channel.id)
          );
        })
        .reduce((sum, elem) => sum + elem.tagged_entries, 0);
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
    deleteButtonLabel() {
      if (this.channelsSelected) {
        return "Delete selected channels";
      }
      return "Delete all channels";
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
      this.channelEditModalDisplayed = false;
      this.deleteChannelsModalDisplayed = false;
      this.editedChannel = {};
      this.requestChannels();
    },
    daySelectorChanged(e) {
      const newValue = parseInt(e.target.value);
      this.daySelectorValue = newValue;
      this.requestChannels();
    },
    showChannelEditModal(channel) {
      this.editedChannel = channel;
      this.channelEditModalDisplayed = true;
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
    deleteChannels() {
      this.$store
        .dispatch({
          type: ACTION_MAINTENANCE_CHANNELS_DELETE_REQUEST,
          query: this.modifyChannelsQuery,
          keep_tagged_entries: !this.deleteTaggedEntries,
        })
        .then(() => this.resetComponentState());
    },
  },
  created() {
    this.$watch(
      () => this.initialQuery,
      (newVal /* eslint-disable-line no-unused-vars*/) => {
        this.resetComponentState();
      },
    );
  },
};
</script>
