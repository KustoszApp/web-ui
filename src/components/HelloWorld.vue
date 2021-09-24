<template>
  <div class="list">
    <h2 class="list__title">{{ msg }}</h2>
    <ul>
      <li v-for="feed in feeds" :key="feed.id">
        {{ feed.id }}.
        <a :href="feed.url"> {{ feed.displayed_title }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      feeds: [],
    };
  },
  methods: {
    formatDate(value) {
      const date = new Date(value);
      return date.toLocaleString("pl-PL");
    },
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.list {
  font-size: 0.875rem;
}

.list__title {
  font-size: inherit;
  font-weight: 300;
  text-transform: uppercase;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
