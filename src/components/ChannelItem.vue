<template>
  <div class="channel">
    <BIconRssFill class="channel__item-icon" />
    <router-link
      class="channel__item-link"
      :class="{
        'router-link-really-active':
          $route.query.channel === channel.id.toString(),
      }"
      :title="channel.displayed_title"
      :to="{
        name: this.ROUTE_ENTRIES,
        query: { channel: channel.id, channel_tags: null },
      }"
    >
      {{ channel.displayed_title }}
    </router-link>
    <span class="unread-count">{{ channel.unarchived_entries }}</span>
    <BIconPencilFill class="channel__item-edit-icon" @click="$emit('edit')" />
  </div>
</template>

<script>
import { BIconPencilFill, BIconRssFill } from "bootstrap-icons-vue";

import { ROUTE_ENTRIES } from "../types";

export default {
  name: "ChannelItem",
  components: {
    BIconPencilFill,
    BIconRssFill,
  },
  props: {
    channel: Object,
  },
  data() {
    return {
      ROUTE_ENTRIES,
    };
  },
};
</script>

<style lang="scss">
.channel {
  display: flex;
  align-items: baseline;
}

.channel__item-icon {
  vertical-align: middle;
  margin-right: 0.125rem;
  height: 12px;
  width: 12px;
  flex-shrink: 0;
}

.channel__item-edit-icon {
  margin-left: 0.25rem;
  height: 12px;
  width: 12px;
  flex-shrink: 0;
}

.channel__item-link {
  color: var(--main-text-color);
  text-decoration: none;
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
}
</style>
