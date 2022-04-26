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
  <ChannelEditModal
    :channel="editedChannel"
    :modalDisplayed="channelEditModalDisplayed"
    @update:modalDisplayed="(newVal) => (channelEditModalDisplayed = newVal)"
  />
</template>

<script>
import { BIconChevronDown, BIconChevronRight } from "bootstrap-icons-vue";
import Collapse from "@/components/Collapse.vue";
import ChannelEditModal from "@/components/ChannelEditModal.vue";
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
    ChannelEditModal,
    ChannelItem,
  },
  data() {
    return {
      channelEditModalDisplayed: false,
      editedChannel: {},
      visibleGroups: new Set(),
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
      this.editedChannel = channel;
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
