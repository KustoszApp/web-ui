<template>
  <div class="search-bar">
    <div class="column">
      <button type="button" class="btn btn--primary">Unread only</button>
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
      <button type="button" class="btn btn--primary">Advanced search</button>
      <button type="button" class="btn btn--primary">
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

.select-menu {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%204%205'%3E%3Cpath%20fill='%23505050'%20d='M2%200L0%202h4zm0%205L0%203h4z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center right 0.25rem;
  background-size: 0.5rem 0.6rem;
  appearance: none;
  border: 2px solid;
  border-radius: 0.25rem;
  color: inherit;
  padding: 0.25rem 0.75rem;
}

.input-field {
  border: 2px solid;
  border-radius: 0.25rem;
  padding: 0.25rem 0.75rem;
}
</style>
