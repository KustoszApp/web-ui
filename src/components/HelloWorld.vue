<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <ul>
      <li v-for="feed in feeds" :key="feed.id">
        {{ feed.id }}. <a :href="feed.url">{{ feed.url }}</a> dodano:
        {{ formatDate(feed.added_time) }}
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
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
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
