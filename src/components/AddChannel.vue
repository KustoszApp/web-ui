<template>
  <button
    type="button"
    class="btn btn--primary btn--big"
    @click="addChannelModalDisplayed = true"
  >
    Add source
  </button>
  <Modal
    v-model="addChannelModalDisplayed"
    title="Add new channel"
    modal-class="modal modal-lg"
  >
    <div class="modal-body">
      <form>
        <div class="panel-content">
          <label for="sourceURL">URL</label>
          <div class="form-control">
            <input
              id="sourceURL"
              class="input-field"
              type="url"
              v-model="sourceURL"
            />
          </div>
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
        </div>
      </form>
    </div>

    <div class="modal-footer">
      <button
        class="btn btn--secondary"
        @click="addChannelModalDisplayed = false"
      >
        Close this window
      </button>
      <button class="btn btn--primary ml-2" @click="markAllReadClicked">
        Save
      </button>
    </div>
  </Modal>
</template>

<script>
import Multiselect from "@vueform/multiselect";
import VueModal from "@kouts/vue-modal";
import "@kouts/vue-modal/dist/vue-modal.css";
import { mapGetters } from "vuex";

export default {
  name: "AddChannel",
  components: {
    Modal: VueModal,
    Multiselect,
  },
  computed: {
    ...mapGetters(["channelTags"]),
  },
  data() {
    return {
      addChannelModalDisplayed: false,
      title: "",
      sourceTags: [],
      sourceTagsOptions: [],
      sourceURL: "",
    };
  },
  created() {
    this.sourceTagsOptions = this.channelTags.map((tag) => tag.name);
  },
};
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
