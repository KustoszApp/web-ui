<template>
  <div class="list">
    <h2 class="list__title">{{ title }}</h2>
    <ul class="list__content">
      <li class="list__item" v-for="feed in feeds" :key="feed.id">
        <svg
          class="list__item-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -256 1792 1792"
        >
          <path
            d="M384 192q0-80-56-136T192 0Q112 0 56 56T0 192q0 80 56 136t136 56q80 0 136-56t56-136zM896 69q2-28-17-48-18-21-47-21H697q-25 0-43 16.5T634 58q-22 229-184.5 391.5T58 634q-25 2-41.5 20T0 697v135q0 29 21 47 17 17 43 17h5q160-13 306-80.5T634 634q114-113 181.5-259T896 69zm512-2q2-27-18-47-18-20-46-20h-143q-26 0-44.5 17.5T1137 60q-12 215-101 408.5t-231.5 336Q662 947 468.5 1036T60 1138q-25 1-42.5 19.5T0 1201v143q0 28 20 46 18 18 44 18h3q262-13 501.5-120T994 994q187-186 294-425.5T1408 67z"
            style="fill: currentColor"
            transform="matrix(1 0 0 -1 212.61 1346.17)"
          />
        </svg>
        <a class="list__item-link" :href="feed.url">
          {{ feed.displayed_title }}</a
        >
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "NavList",
  props: {
    title: String,
  },
  data() {
    return {
      feeds: [],
    };
  },
  created() {
    fetch("http://127.0.0.1:8000/api/v1/channels")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.feeds = data.results;
      });
  },
};
</script>

<style lang="scss">
.list {
  font-size: 0.875rem;
}

.list__title {
  font-size: inherit;
  font-weight: 300;
  text-transform: uppercase;
  margin: 0 0 0.5rem;
}

.list__content {
  list-style-type: none;
  padding: 0;
  margin: 0 0 1rem;
  max-height: 200px;
  scrollbar-width: thin;
  overflow-y: scroll;
}

.list__item {
  color: var(--secondary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list__item-icon {
  vertical-align: middle;
  margin-right: 0.125rem;
  height: 12px;
  width: 12px;
}

.list__item-link {
  color: var(--primary);
  text-decoration: none;
  vertical-align: middle;
}
</style>
