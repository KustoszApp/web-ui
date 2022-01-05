<template>
  <div class="feed">
    <svg
      class="feed__item-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -256 1792 1792"
    >
      <path
        d="M384 192q0-80-56-136T192 0Q112 0 56 56T0 192q0 80 56 136t136 56q80 0 136-56t56-136zM896 69q2-28-17-48-18-21-47-21H697q-25 0-43 16.5T634 58q-22 229-184.5 391.5T58 634q-25 2-41.5 20T0 697v135q0 29 21 47 17 17 43 17h5q160-13 306-80.5T634 634q114-113 181.5-259T896 69zm512-2q2-27-18-47-18-20-46-20h-143q-26 0-44.5 17.5T1137 60q-12 215-101 408.5t-231.5 336Q662 947 468.5 1036T60 1138q-25 1-42.5 19.5T0 1201v143q0 28 20 46 18 18 44 18h3q262-13 501.5-120T994 994q187-186 294-425.5T1408 67z"
        style="fill: currentColor"
        transform="matrix(1 0 0 -1 212.61 1346.17)"
      />
    </svg>
    <router-link
      class="feed__item-link"
      :title="feed.displayed_title"
      :to="{ name: 'home', query: { channel: feed.id, channel_tags: null } }"
    >
      {{ feed.displayed_title }}
    </router-link>
    <span class="unread-count">{{ feed.unarchived_entries }}</span>
    <svg
      class="feed__item-edit-icon"
      @click="$emit('edit')"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      enable-background="new 0 0 50 50"
    >
      <path
        d="M9.6 40.4l2.5-9.9L27 15.6l7.4 7.4-14.9 14.9-9.9 2.5zm4.3-8.9l-1.5 6.1 6.1-1.5L31.6 23 27 18.4 13.9 31.5z"
      />
      <path
        d="M17.8 37.3c-.6-2.5-2.6-4.5-5.1-5.1l.5-1.9c3.2.8 5.7 3.3 6.5 6.5l-1.9.5z"
      />
      <path d="M29.298 19.287l1.414 1.414-13.01 13.02-1.414-1.412z" />
      <path d="M11 39l2.9-.7c-.3-1.1-1.1-1.9-2.2-2.2L11 39z" />
      <path
        d="M35 22.4L27.6 15l3-3 .5.1c3.6.5 6.4 3.3 6.9 6.9l.1.5-3.1 2.9zM30.4 15l4.6 4.6.9-.9c-.5-2.3-2.3-4.1-4.6-4.6l-.9.9z"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "FeedItem",
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
  height: 16px;
  width: 16px;
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
