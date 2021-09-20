<template>
  <div class="entries-list">
    <ul>
      <li v-for="entry in entries" :key="entry.id">
        <Entry
          :title="entry.title"
          :link="entry.link"
          :addedTime="entry.added_time"
          :entryContent="entry.preferred_content.content"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import Entry from "./Entry.vue";
export default {
  name: "Entries",
  data() {
    return {
      entries: [],
    };
  },
  created() {
    fetch("http://127.0.0.1:8000/api/v1/entries")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.entries = data.results;
      });
  },
  components: {
    Entry,
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
