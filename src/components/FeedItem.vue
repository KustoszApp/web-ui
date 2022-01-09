<template>
  <div class="feed">
    <BIconRssFill class="feed__item-icon" />
    <router-link
      class="feed__item-link"
      :title="feed.displayed_title"
      :to="{ name: 'entries', query: { channel: feed.id, channel_tags: null } }"
    >
      {{ feed.displayed_title }}
    </router-link>
    <span class="unread-count">{{ feed.unarchived_entries }}</span>
    <BIconPencilFill class="feed__item-edit-icon" @click="$emit('edit')" />
  </div>
</template>

<script>
import { BIconPencilFill, BIconRssFill } from "bootstrap-icons-vue";

export default {
  name: "FeedItem",
  components: {
    BIconPencilFill,
    BIconRssFill,
  },
  props: {
    feed: Object,
  },
};
</script>

<style lang="scss">
.feed {
  display: flex;
  align-items: center;
}

.feed__item-icon {
  vertical-align: middle;
  margin-right: 0.125rem;
  height: 12px;
  width: 12px;
  flex-shrink: 0;
}

.feed__item-edit-icon {
  margin-left: 0.25rem;
  height: 12px;
  width: 12px;
  flex-shrink: 0;
}

.feed__item-link {
  color: var(--primary);
  text-decoration: none;
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
}
</style>
