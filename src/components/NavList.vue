<template>
  <div class="list">
    <ul class="list__content">
      <li
        class="list__item list__item--group"
        v-for="group in groupedChannels()"
        :key="group.tag.slug"
        :class="{ 'unarchived-items': group.unarchived_entries > 0 }"
      >
        <span
          v-if="group.tag.slug"
          class="list__item-collapse-icon"
          :class="{ visible: isGroupVisible(group.tag.slug) }"
          @click="toggleGroupVisibility(group.tag.slug)"
        >
          <BIconChevronDown v-if="isGroupVisible(group.tag.slug)" />
          <BIconChevronRight v-else />
        </span>
        <router-link
          class="list__item-link"
          :to="{
            name: this.ROUTE_ENTRIES,
            query: { channel_tags: group.tag.slug, channel: null },
          }"
        >
          {{ group.tag.name }}
        </router-link>
        <span class="unread-count">{{ group.unarchived_entries }}</span>
        <ul class="list__content" v-show="isGroupVisible(group.tag.slug)">
          <li
            class="list__item"
            v-for="feed in group.channels"
            :key="feed.id"
            :class="{ 'unarchived-items': feed.unarchived_entries > 0 }"
          >
            <FeedItem :feed="feed" @edit="showChannelEditModal(feed)" />
          </li>
        </ul>
      </li>
    </ul>
  </div>
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
          @keypress.stop
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
          @keypress.stop
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
          <td>
            <a :href="editedChannelUrl">{{ editedChannelUrl }}</a>
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
import { BIconChevronDown, BIconChevronRight } from "bootstrap-icons-vue";
import Multiselect from "@vueform/multiselect";
import VueModal from "@kouts/vue-modal";
import { mapGetters } from "vuex";
import { formatDate } from "../utils";
import FeedItem from "./FeedItem.vue";

import {
  ACTION_CHANNEL_EDIT_REQUEST,
  ACTION_CHANNEL_TAGS_REQUEST,
  GET_CHANNELS,
  GET_CHANNEL_TAGS,
  ROUTE_ENTRIES,
} from "../types";

export default {
  name: "NavList",
  components: {
    BIconChevronDown,
    BIconChevronRight,
    Modal: VueModal,
    Multiselect,
    FeedItem,
  },
  data() {
    return {
      channelEditModalDisplayed: false,
      editedChannelId: 0,
      editedChannelActive: false,
      editedChannelDeduplicationEnabled: false,
      editedChannelDisplayedTitle: "",
      editedChannelTitleUpstream: "",
      editedChannelTitleUser: "",
      editedChannelUpdateFrequency: 0,
      editedChannelTags: [],
      editedChannelTagsOptions: [],
      editedChannelAddedTime: "",
      editedChannelLastCheckTime: "",
      editedChannelLastEntryPublishedTime: "",
      editedChannelLink: "",
      editedChannelUrl: "",
      visibleGroups: new Set(),
      dateFormat: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      },
      ROUTE_ENTRIES,
    };
  },
  computed: {
    ...mapGetters({
      channels: GET_CHANNELS,
      channelTags: GET_CHANNEL_TAGS,
    }),
  },
  methods: {
    groupedChannels() {
      let totalUnarchived = 0;
      let groups = {};
      this.channels.forEach((channel) => {
        totalUnarchived += channel.unarchived_entries;
        let tags = channel.tags;
        if (!tags.length) {
          tags = ["Untagged"];
        }
        tags.forEach((tagName) => {
          if (!(tagName in groups)) {
            groups[tagName] = {
              unarchived_entries: 0,
              channels: [],
            };
          }
          groups[tagName].channels.push(channel);
          groups[tagName].unarchived_entries += channel.unarchived_entries;
        });
      });
      let totalObj = {
        unarchived_entries: totalUnarchived,
        channels: [],
        tag: {
          name: "All entries",
          slug: "",
        },
      };
      groups = Object.keys(groups)
        .sort()
        .reduce((obj, key) => {
          let tag = this.channelTags.find((tag) => tag.name === key);
          if (tag === undefined) {
            tag = {
              name: "Untagged",
              slug: "channel_has_tags=false",
            };
          }
          return [...obj, { ...groups[key], tag: tag }];
        }, []);
      groups.unshift(totalObj);
      return groups;
    },
    isGroupVisible(groupSlug) {
      return this.visibleGroups.has(groupSlug);
    },
    toggleGroupVisibility(groupSlug) {
      if (this.isGroupVisible(groupSlug)) {
        this.visibleGroups.delete(groupSlug);
      } else {
        this.visibleGroups.add(groupSlug);
      }
    },
    showChannelEditModal(feed) {
      this.editedChannelId = feed.id;
      this.editedChannelActive = feed.active;
      this.editedChannelDeduplicationEnabled = feed.deduplication_enabled;
      this.editedChannelTitleUpstream = feed.title_upstream;
      this.editedChannelTitleUser = feed.title;
      this.editedChannelDisplayedTitle = feed.displayed_title;
      this.editedChannelUpdateFrequency = feed.update_frequency;
      this.editedChannelTags = feed.tags;
      this.editedChannelTagsOptions = this.channelTags.map((tag) => tag.name);
      this.editedChannelAddedTime = feed.added_time;
      this.editedChannelLastCheckTime = feed.last_check_time;
      this.editedChannelLastEntryPublishedTime = feed.last_entry_published_time;
      this.editedChannelLink = feed.link;
      this.editedChannelUrl = feed.url;
      this.channelEditModalDisplayed = true;
    },
    submitNewChannelData() {
      this.$store
        .dispatch({
          type: ACTION_CHANNEL_EDIT_REQUEST,
          channel_id: this.editedChannelId,
          active: this.editedChannelActive,
          deduplication_enabled: this.editedChannelDeduplicationEnabled,
          tags: this.editedChannelTags,
          title: this.editedChannelTitleUser,
          update_frequency: this.editedChannelUpdateFrequency,
        })
        .then(() => {
          this.$store.dispatch({
            type: ACTION_CHANNEL_TAGS_REQUEST,
          });
        });
    },
    formatDate,
  },
};
</script>

<style lang="scss">
.list {
  font-size: 0.875rem;
}

.list__content {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.list__item {
  color: var(--secondary);
  margin: 0;
  overflow: hidden;
  padding: 0.25rem 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: normal;

  &.unarchived-items {
    font-weight: 700;

    & > .unread-count,
    & > .feed > .unread-count {
      visibility: visible;
    }
  }
}

.list__item--group > .unread-count {
  margin-left: 0.75rem;
}

.list__item--group .list__item {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.list__item-collapse-icon {
  display: inline-block;
  height: 18px;
  width: 18px;
  vertical-align: middle;
}

.list__item-link {
  color: var(--primary);
  text-decoration: none;
  vertical-align: middle;
}

.unread-count {
  border: 2px solid var(--secondary);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  padding: 0 0.5rem;
  margin-left: auto;
  line-height: 1;
  visibility: hidden;
}
</style>
