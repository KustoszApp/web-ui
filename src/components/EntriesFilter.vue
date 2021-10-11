<template>
  <div class="search-bar">
    <div class="column">
      <button type="button" class="btn btn--secondary">Unread only</button>
      <select class="select-menu" name="" id="">
        <option default>Newer</option>
        <option>Older</option>
      </select>
      than
      <select class="select-menu" name="" id="">
        <option default>----------</option>
        <option>1 day</option>
        <option>2 days</option>
        <option>1 week</option>
        <option>1 weeks</option>
      </select>
      tagged:
      <input class="input-field" type="text" placeholder="start typing" />
    </div>
    <div class="column ml-auto">
      <button type="button" class="btn btn--secondary">Advanced search</button>
      <button type="button" class="btn btn--secondary">
        Set filter as default
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "EntriesFilter",
};
</script>

<style lang="scss">
.search-bar {
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
}

.ml-auto {
  margin-left: auto;
}
</style>
