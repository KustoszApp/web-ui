<template>
  <button
    type="button"
    class="btn btn--main-action btn--big"
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
          <label for="url">Full URL of RSS / Atom XML file</label>
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
              @keydown.stop
            ></Multiselect>
          </div>
        </div>
      </form>
    </div>

    <div class="modal-footer">
      <div class="btn-row">
        <button class="btn" @click="addChannelModalDisplayed = false">
          Close this window
        </button>
        <button class="btn btn--main-action" @click="createChannelClicked">
          Save
        </button>
      </div>
    </div>
  </Modal>
</template>

<script>
import Multiselect from "@vueform/multiselect";
import VueModal from "@kouts/vue-modal";
import { mapGetters } from "vuex";

import { ACTION_CHANNEL_CREATE_REQUEST, GET_CHANNEL_TAGS } from "../types";

export default {
  name: "AddChannel",
  components: {
    Modal: VueModal,
    Multiselect,
  },
  computed: {
    ...mapGetters({
      channelTags: GET_CHANNEL_TAGS,
    }),
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
          type: ACTION_CHANNEL_CREATE_REQUEST,
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
