<template>
  <form>
    <div class="panel-content">
      <label for="sourceName">Name of channel</label>
      <div class="form-control">
        <input
          id="sourceName"
          class="input-field"
          type="text"
          v-model="title"
          placeholder="Leave empty to fetch title"
        />
      </div>
      <label for="sourceTags">Tags</label>
      <div class="form-control">
        <Multiselect
          id="sourceTags"
          v-model="sourceTags"
          mode="tags"
          :options="sourceTagsOptions"
          :closeOnSelect="false"
          :searchable="true"
          :createTag="true"
          @keypress.stop
        ></Multiselect>
      </div>
      <label for="sourceURL">URL</label>
      <div class="form-control">
        <input
          id="sourceURL"
          class="input-field"
          type="url"
          v-model="sourceURL"
        />
      </div>
    </div>
    <button type="submit" class="btn btn--primary">Save</button>
  </form>
</template>

<script>
import Multiselect from "@vueform/multiselect";
import { mapGetters } from "vuex";

export default {
  name: "AddSource",
  components: {
    Multiselect,
  },
  computed: {
    ...mapGetters(["channelTags"]),
  },
  data() {
    return {
      title: "",
      sourceTags: [],
      sourceTagsOptions: [],
      sourceURL: "",
      type: "RSS Feed",
    };
  },
  created() {
    this.sourceTagsOptions = this.channelTags.map((tag) => tag.name);
  },
};
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
