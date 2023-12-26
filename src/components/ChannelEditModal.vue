<template>
  <Modal
    v-model="channelEditModalDisplayed"
    :title="`Editing channel ${this.editedChannelDisplayedTitle}`"
    modal-class="modal modal-lg"
  >
    <div class="modal-body">
      <p class="row">
        <input
          class="input-check"
          type="checkbox"
          id="editedChannelActive"
          v-model="editedChannelActive"
        />
        <label for="editedChannelActive">active</label>
      </p>
      <p class="row">
        <input
          class="input-check"
          type="checkbox"
          id="editedChannelDeduplicationEnabled"
          v-model="editedChannelDeduplicationEnabled"
        />
        <label for="editedChannelDeduplicationEnabled">is deduplicated</label>
      </p>
      <p class="row direction-column">
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
      <p class="row direction-column">
        <label for="update-frequency"> Update channel every: </label>
        <select
          v-model="editedChannelUpdateFrequency"
          class="select-menu"
          id="update-frequency"
        >
          <option
            v-for="item in editedChannelUpdateFrequencyChoices"
            :key="item.label"
            :value="item.value"
          >
            {{ item.label }}
          </option>
        </select>
      </p>
      <p class="row direction-column">
        <label>Tags:</label>
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
      <div class="row label-left">
        <p><label class="text-right">Number of entries:</label></p>
        <p class="row entries-count">
          <span>
            <strong>{{ editedChannelUnarchivedEntriesCount }}</strong> unread
          </span>
          <span>
            <strong>{{ editedChannelTaggedEntriesCount }}</strong> tagged
          </span>
          <span>
            <strong>{{ editedChannelTotalEntriesCount }}</strong> total
          </span>
        </p>
      </div>
      <div class="row label-left">
        <p><label class="text-right">Date of last entry publication:</label></p>
        <p>
          {{ formatDate(editedChannelLastEntryPublishedTime, dateFormat) }}
        </p>
      </div>
      <div class="row label-left">
        <p><label class="text-right">Date of last content check:</label></p>
        <p>
          {{ formatDate(editedChannelLastCheckTime, dateFormat) }}
        </p>
      </div>
      <div class="row label-left">
        <p><label class="text-right">Channel added date:</label></p>
        <p>
          {{ formatDate(editedChannelAddedTime, dateFormat) }}
        </p>
      </div>
      <div class="row label-left">
        <p><label class="text-right">Channel link:</label></p>
        <p>
          <a :href="editedChannelLink">{{ editedChannelLink }}</a>
        </p>
      </div>
      <div class="row label-left">
        <p><label class="text-right">Channel URL:</label></p>
        <p class="row" v-if="editedChannelUrlEditingEnabled">
          <input
            id="editedChannelUrl"
            type="text"
            class="input-field"
            v-model="editedChannelUrl"
            @keydown.stop
          />
          <button class="btn" @click="editedChannelUrlEditingEnabled = false">
            OK
          </button>
        </p>
        <p class="row" v-else>
          <a :href="editedChannelUrl">{{ editedChannelUrl }}</a>
          <button class="btn" @click="editedChannelUrlEditingEnabled = true">
            <BIconPencilFill />
          </button>
        </p>
      </div>
    </div>

    <div class="modal-footer">
      <div class="btn-row">
        <button class="btn" @click="channelEditModalDisplayed = false">
          Close this window
        </button>
        <button class="btn btn--main-action" @click="submitNewChannelData()">
          Save
        </button>
      </div>
    </div>
  </Modal>
</template>

<script>
import { BIconPencilFill } from "bootstrap-icons-vue";
import Multiselect from "@vueform/multiselect";
import { Modal } from "@kouts/vue-modal";
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
    Modal,
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
      editedChannelUnarchivedEntriesCount: 0,
      editedChannelTaggedEntriesCount: 0,
      editedChannelTotalEntriesCount: 0,

      dateFormat: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      },
      editedChannelUpdateFrequencyChoices: [
        { label: "5 minutes", value: 5 * 60 },
        { label: "10 minutes", value: 10 * 60 },
        { label: "15 minutes", value: 15 * 60 },
        { label: "30 minutes", value: 30 * 60 },
        { label: "1 hour", value: 60 * 60 },
        { label: "2 hours", value: 120 * 60 },
      ],
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
      this.editedChannelUnarchivedEntriesCount = channel.unarchived_entries;
      this.editedChannelTaggedEntriesCount = channel.tagged_entries;
      this.editedChannelTotalEntriesCount = channel.total_entries;
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
      (newChannel) => this.setupChannelEditModal(newChannel),
    );
  },
};
</script>

<style lang="scss" scoped>
@import "@vueform/multiselect/themes/default.css";
@import "../scss/mixins";

.row {
  align-items: baseline;
}

.select-menu {
  width: 100%;
}

.row.label-left {
  flex-direction: column;

  @include for-tablet-landscape-up {
    flex-direction: unset;
    gap: 1rem;
    height: 2rem;
  }

  p {
    margin: 0;

    &:first-child {
      min-width: max-content;
      @include for-tablet-landscape-up {
        text-align: right;
        width: 28ex;
      }
    }

    &.row {
      gap: 0.25rem;

      &.entries-count {
        gap: 1rem;
      }
    }
  }
}
</style>
