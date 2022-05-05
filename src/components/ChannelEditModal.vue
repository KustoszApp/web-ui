<template>
  <Modal
    v-model="channelEditModalDisplayed"
    :title="`Editing channel ${this.editedChannelDisplayedTitle}`"
    modal-class="modal modal-lg"
  >
    <div class="modal-body">
      <p>
        <input
          class="input-check mr-1"
          type="checkbox"
          id="editedChannelActive"
          v-model="editedChannelActive"
        />
        <label for="editedChannelActive">active</label>
      </p>
      <p>
        <input
          class="input-check mr-1"
          type="checkbox"
          id="editedChannelDeduplicationEnabled"
          v-model="editedChannelDeduplicationEnabled"
        />
        <label for="editedChannelDeduplicationEnabled">is deduplicated</label>
      </p>
      <p>
        <label for="channel-title">Name of channel:</label>
        <input
          id="channel-title"
          class="input-field"
          v-model="editedChannelTitleUser"
          @keydown.stop
        />
        <small class="muted"
          >(default name provided by channel author: "{{
            editedChannelTitleUpstream
          }}")
        </small>
      </p>
      <p>
        <label for="update-frequency"> Update frequency (seconds): </label>
        <input
          id="update-frequency"
          class="input-field"
          type="number"
          v-model="editedChannelUpdateFrequency"
          min="1"
        />
      </p>
      <p>
        Tags:
        <Multiselect
          v-model="editedChannelTags"
          mode="tags"
          :options="editedChannelTagsOptions"
          :closeOnSelect="false"
          :searchable="true"
          :createTag="true"
          @keydown.stop
        ></Multiselect>
      </p>
      <table>
        <tr>
          <td class="text-right">Date of last entry publication:</td>
          <td>
            {{ formatDate(editedChannelLastEntryPublishedTime, dateFormat) }}
          </td>
        </tr>
        <tr>
          <td class="text-right">Date of last content check:</td>
          <td>
            {{ formatDate(editedChannelLastCheckTime, dateFormat) }}
          </td>
        </tr>
        <tr>
          <td class="text-right">Channel added date:</td>
          <td>
            {{ formatDate(editedChannelAddedTime, dateFormat) }}
          </td>
        </tr>
        <tr>
          <td class="text-right">Channel link:</td>
          <td>
            <a :href="editedChannelLink">{{ editedChannelLink }}</a>
          </td>
        </tr>
        <tr>
          <td class="text-right">Channel URL:</td>
          <td class="channel-input-cell" v-if="editedChannelUrlEditingEnabled">
            <input
              id="editedChannelUrl"
              type="text"
              class="input-field"
              v-model="editedChannelUrl"
              @keydown.stop
            />
            <button
              class="btn btn--secondary"
              @click="editedChannelUrlEditingEnabled = false"
            >
              OK
            </button>
          </td>
          <td v-else>
            <a :href="editedChannelUrl">{{ editedChannelUrl }}</a>
            <button
              class="btn btn--secondary"
              @click="editedChannelUrlEditingEnabled = true"
            >
              <BIconPencilFill />
            </button>
          </td>
        </tr>
      </table>
    </div>

    <div class="modal-footer">
      <button
        class="btn btn--secondary"
        @click="channelEditModalDisplayed = false"
      >
        Close this window
      </button>
      <button class="btn btn--primary ml-2" @click="submitNewChannelData()">
        Save
      </button>
    </div>
  </Modal>
</template>

<script>
import { BIconPencilFill } from "bootstrap-icons-vue";
import Multiselect from "@vueform/multiselect";
import VueModal from "@kouts/vue-modal";
import { mapGetters } from "vuex";
import { formatDate } from "../utils";

import {
  ACTION_CHANNEL_EDIT_REQUEST,
  ACTION_CHANNEL_TAGS_REQUEST,
  GET_CHANNEL_TAGS,
} from "../types";

export default {
  name: "ChannelEditModal",
  components: {
    BIconPencilFill,
    Modal: VueModal,
    Multiselect,
  },
  props: {
    channel: Object,
    modalDisplayed: Boolean,
  },
  emits: ["update:modalDisplayed"],
  data() {
    return {
      editedChannelId: 0,
      editedChannelActive: false,
      editedChannelDeduplicationEnabled: false,
      editedChannelDisplayedTitle: "",
      editedChannelTitleUpstream: "",
      editedChannelTitleUser: "",
      editedChannelUpdateFrequency: 0,
      editedChannelTags: [],
      editedChannelAddedTime: "",
      editedChannelLastCheckTime: "",
      editedChannelLastEntryPublishedTime: "",
      editedChannelLink: "",
      editedChannelUrl: "",
      editedChannelUrlEditingEnabled: false,
      dateFormat: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      },
    };
  },
  computed: {
    ...mapGetters({
      channelTags: GET_CHANNEL_TAGS,
    }),
    channelEditModalDisplayed: {
      get() {
        return this.modalDisplayed;
      },
      set(value) {
        this.$emit("update:modalDisplayed", value);
      },
    },
    editedChannelTagsOptions() {
      return this.channelTags.map((tag) => tag.name);
    },
  },
  methods: {
    setupChannelEditModal(channel) {
      this.editedChannelId = channel.id;
      this.editedChannelActive = channel.active;
      this.editedChannelDeduplicationEnabled = channel.deduplication_enabled;
      this.editedChannelTitleUpstream = channel.title_upstream;
      this.editedChannelTitleUser = channel.title;
      this.editedChannelDisplayedTitle = channel.displayed_title;
      this.editedChannelUpdateFrequency = channel.update_frequency;
      this.editedChannelTags = channel.tags;
      this.editedChannelAddedTime = channel.added_time;
      this.editedChannelLastCheckTime = channel.last_check_time;
      this.editedChannelLastEntryPublishedTime =
        channel.last_entry_published_time;
      this.editedChannelLink = channel.link;
      this.editedChannelUrl = channel.url;
      this.editedChannelUrlEditingEnabled = false;
    },
    submitNewChannelData() {
      const payloadMap = [
        ["active", "Active"],
        ["deduplication_enabled", "DeduplicationEnabled"],
        ["tags", "Tags"],
        ["title", "TitleUser"],
        ["update_frequency", "UpdateFrequency"],
        ["url", "Url"],
      ];
      const payload = {
        channel_id: this.editedChannelId,
      };

      payloadMap.forEach(([payloadKey, thisKey]) => {
        thisKey = `editedChannel${thisKey}`;
        if (this.channel[payloadKey] !== this[thisKey]) {
          payload[payloadKey] = this[thisKey];
        }
      });

      this.$store
        .dispatch({
          type: ACTION_CHANNEL_EDIT_REQUEST,
          ...payload,
        })
        .then(() => {
          this.$store.dispatch({
            type: ACTION_CHANNEL_TAGS_REQUEST,
          });
        });
    },
    formatDate,
  },
  created() {
    this.$watch(
      () => this.channel,
      (newChannel) => this.setupChannelEditModal(newChannel)
    );
  },
};
</script>

<style lang="scss">
.channel-input-cell {
  white-space: nowrap;
}
td button {
  margin-left: 0.2rem;
}
</style>
