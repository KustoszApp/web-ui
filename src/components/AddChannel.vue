<template>
  <button
    type="button"
    class="btn btn--primary btn--big"
    @click="openAddChannelModal"
  >
    Add channel
  </button>
  <Modal
    v-model="addChannelModalDisplayed"
    title="Add new channel"
    modal-class="modal modal-lg"
  >
    <div class="modal-body">
      <form>
        <div class="panel-content">
          <label for="url">URL</label>
          <div class="form-control">
            <input id="url" class="input-field" type="url" v-model="url" />
          </div>
          <label for="title">Name of channel</label>
          <div class="form-control">
            <input
              id="title"
              class="input-field"
              type="text"
              v-model="title"
              placeholder="Leave empty to fetch title"
            />
          </div>
          <label for="tags">Tags</label>
          <div class="form-control">
            <Multiselect
              id="tags"
              v-model="tags"
              mode="tags"
              :options="tagsOptions"
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
      <button class="btn btn--primary ml-2" @click="createChannelClicked">
        Save
      </button>
    </div>
  </Modal>
</template>

<script>
import Multiselect from "@vueform/multiselect";
import VueModal from "@kouts/vue-modal";
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
      url: "",
      title: "",
      tags: [],
      tagsOptions: [],
    };
  },
  methods: {
    openAddChannelModal() {
      this.addChannelModalDisplayed = true;
      this.tagsOptions = this.channelTags.map((tag) => tag.name);
    },
    createChannelClicked() {
      this.$store
        .dispatch({
          type: "channel_create_request",
          url: this.url,
          title: this.title,
          tags: this.tags,
        })
        .then(() => {
          this.addChannelModalDisplayed = false;
        });
    },
  },
};
</script>
