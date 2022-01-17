<template>
  <div class="list">
    <ul class="list__content">
      <li
        class="list__item all__entries"
        :class="{ 'has--unarchived': sumOfAllUnarchived > 0 }"
      >
        <div class="header">
          <router-link
            class="list__item-link"
            :class="{
              'router-link-really-active': isAllEntriesPage,
            }"
            :to="{
              name: this.ROUTE_ENTRIES,
              query: { channel_tags: null, channel: null },
            }"
            @click.stop
          >
            All entries
          </router-link>
          <span class="unread-count">{{ sumOfAllUnarchived }}</span>
        </div>
      </li>
      <li
        class="list__item list__item--group"
        v-for="group in groupedChannels"
        :key="group.tag.slug"
        :class="{ 'has--unarchived': group.unarchived_entries > 0 }"
      >
        <Collapse :show="false">
          <template v-slot:header>
            <div class="header">
              <span v-if="group.tag.slug" class="list__item-collapse-icon">
                <BIconChevronRight class="icon__right" />
                <BIconChevronDown class="icon__down" />
              </span>
              <router-link
                class="list__item-link"
                :class="{
                  'router-link-really-active':
                    $route.query.channel_tags === group.tag.slug,
                }"
                :to="{
                  name: this.ROUTE_ENTRIES,
                  query: { channel_tags: group.tag.slug, channel: null },
                }"
                @click.stop
              >
                {{ group.tag.name }}
              </router-link>
              <span class="unread-count">{{ group.unarchived_entries }}</span>
            </div>
          </template>
          <template v-slot:collapse>
            <div class="nav__sources">
              <ul class="list__content">
                <li
                  class="list__item"
                  v-for="channel in group.channels"
                  :key="channel.id"
                  :class="{ 'has--unarchived': channel.unarchived_entries > 0 }"
                >
                  <ChannelItem
                    :channel="channel"
                    @edit="showChannelEditModal(channel)"
                  />
                </li>
              </ul>
            </div>
          </template>
        </Collapse>
      </li>
      <li
        class="list__item"
        v-for="channel in splitChannelsWithTags.channelsWithoutTags"
        :key="channel.id"
        :class="{ 'has--unarchived': channel.unarchived_entries > 0 }"
      >
        <ChannelItem :channel="channel" @edit="showChannelEditModal(channel)" />
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
import Collapse from "@/components/Collapse.vue";
import Multiselect from "@vueform/multiselect";
import VueModal from "@kouts/vue-modal";
import { mapGetters } from "vuex";
import { formatDate } from "../utils";
import ChannelItem from "./ChannelItem.vue";

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
    Collapse,
    Modal: VueModal,
    Multiselect,
    ChannelItem,
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
    isAllEntriesPage() {
      const isEntries = this.$route.name === ROUTE_ENTRIES;
      const hasNoQueryParams = Object.keys(this.$route.query).length === 0;
      return isEntries && hasNoQueryParams;
    },
    splitChannelsWithTags() {
      const channelsWithTags = [];
      const channelsWithoutTags = [];
      this.channels.forEach((channel) => {
        const tags = channel.tags;
        if (!tags.length) {
          channelsWithoutTags.push(channel);
        } else {
          channelsWithTags.push(channel);
        }
      });
      return {
        channelsWithTags: channelsWithTags,
        channelsWithoutTags: channelsWithoutTags,
      };
    },
    groupedChannels() {
      const { channelsWithTags } = this.splitChannelsWithTags;
      const groups = {};
      this.channelTags.forEach((tag) => {
        const tagName = tag.name;
        groups[tagName] = {
          unarchived_entries: 0,
          channels: [],
          tag: tag,
        };
      });
      channelsWithTags.forEach((channel) => {
        channel.tags.forEach((tagName) => {
          if (tagName in groups) {
            groups[tagName].channels.push(channel);
            groups[tagName].unarchived_entries += channel.unarchived_entries;
          }
        });
      });
      return Object.keys(groups)
        .sort()
        .map((tagName) => groups[tagName]);
    },
    sumOfAllUnarchived() {
      return this.channels.reduce((prev, currentElem) => {
        return prev + currentElem.unarchived_entries;
      }, 0);
    },
  },
  methods: {
    showChannelEditModal(channel) {
      this.editedChannelId = channel.id;
      this.editedChannelActive = channel.active;
      this.editedChannelDeduplicationEnabled = channel.deduplication_enabled;
      this.editedChannelTitleUpstream = channel.title_upstream;
      this.editedChannelTitleUser = channel.title;
      this.editedChannelDisplayedTitle = channel.displayed_title;
      this.editedChannelUpdateFrequency = channel.update_frequency;
      this.editedChannelTags = channel.tags;
      this.editedChannelTagsOptions = this.channelTags.map((tag) => tag.name);
      this.editedChannelAddedTime = channel.added_time;
      this.editedChannelLastCheckTime = channel.last_check_time;
      this.editedChannelLastEntryPublishedTime =
        channel.last_entry_published_time;
      this.editedChannelLink = channel.link;
      this.editedChannelUrl = channel.url;
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
@import "../scss/mixins";

.list__content {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.list__item {
  .header {
    display: flex;
    align-items: baseline;
  }

  &.has--unarchived > .channel,
  &.has--unarchived .header {
    font-weight: 700;

    .unread-count {
      visibility: visible;
    }
  }
}

.list__item--group {
  .list__content {
    margin-left: 1rem;
  }
  .unread-count {
    margin-left: 0.75rem;
  }
}

.all__entries .unread-count {
  margin-left: 0.75rem;
}

.list__item-collapse-icon {
  display: inline-block;
  height: 18px;
  width: 18px;
  vertical-align: middle;
}

.collapse-trigger:not(.show) {
  .icon__right {
    display: initial;
  }
  .icon__down {
    display: none;
  }
}

.collapse-trigger.show {
  .icon__right {
    display: none;
  }
  .icon__down {
    display: initial;
  }
}

.list__item-link {
  color: var(--primary);
  text-decoration: none;
  vertical-align: middle;
}

.unread-count {
  font-size: 0.85rem;
  padding: 0 0.5rem;
  margin-left: auto;
  line-height: 1;
  visibility: hidden;
}

.channel .unread-count {
  margin-left: auto;
}
</style>
