<template>
  <div class="btn--dropdown">
    <button
      type="button"
      class="btn btn--main-action btn--big"
      @click="openAddContentModal"
    >
      Add content
    </button>
    <button
      type="button"
      class="btn btn--main-action btn--big btn--dropdown"
      @click="addContentDropdownDisplayed = !addContentDropdownDisplayed"
    >
      <BIconCaretDownFill />
    </button>
  </div>
  <ul class="dropdown--menu list" v-if="addContentDropdownDisplayed">
    <li class="dropdown__item list__item">
      <a @click="openAddChannelModal">Add channel</a>
    </li>
    <li class="dropdown__item list__item">
      <a @click="openAddEntryModal">Add article</a>
    </li>
  </ul>
  <Modal
    v-model="addContentModalDisplayed"
    title="Add content"
    modal-class="modal modal-lg"
  >
    <div class="modal-body">
      <label for="url">URL</label>
      <div class="panel-content row">
        <div class="col col--label">
          <div class="form-control">
            <input id="url" class="input-field" type="url" v-model="url" />
          </div>
        </div>
        <div class="col btn-row">
          <button
            class="btn btn--main-action"
            @click="detectContentClicked"
            :disabled="url.length === 0"
          >
            Detect
          </button>
        </div>
      </div>
      <div v-if="autodetectState === 'in_progress'">
        <p>Detecting available content. Please wait...</p>
        <div class="spinner">
          <div class="spinner__element"></div>
          <div class="spinner__element"></div>
        </div>
      </div>
      <div v-else-if="autodetectState === 'failed'">
        <p>
          Content could not be detected. This is probably a permanent problem.
          If you want to add this URL as a bookmark, use "Add article" button in
          navigation bar. You can also try again in about an hour.
        </p>
      </div>
      <div
        v-else-if="autodetectState === 'completed'"
        class="autodetect-results"
      >
        <div v-if="autodetectedEntries.length > 0" class="entries">
          <h2>Found articles:</h2>
          <div
            v-for="(entry, index) in autodetectedEntries"
            :key="`entry-${index}`"
            class="entries__entry row"
          >
            <div class="col col--label">
              <a :href="entry.link" :title="entry.title" class="entry__link">
                {{ entryTitle(entry) }}
              </a>
            </div>
            <div class="col btn-row">
              <button
                class="btn btn--main-action"
                @click="addEntryClicked(entry.link)"
              >
                Add article
              </button>
            </div>
          </div>
        </div>
        <div v-if="autodetectedChannels.length > 0" class="channels">
          <h2>Found channels:</h2>
          <div
            v-for="(channel, index) in autodetectedChannels"
            :key="`channel-${index}`"
            class="channel row list-item direction-column"
          >
            <Collapse :show="false">
              <template v-slot:header>
                <div class="row">
                  <div class="col col--label">
                    <p class="channel__meta row">
                      <span class="entry__link">{{ channel.url }}</span>
                      <span
                        class="entry__author"
                        v-if="channel.title_upstream"
                        v-html="channel.title_upstream"
                      />
                      <span class="entry__count"
                        >entries: {{ channel.total_entries }}</span
                      >
                    </p>
                  </div>
                  <div class="col btn-row">
                    <button
                      class="btn btn--main-action"
                      @click="addChannelClicked(channel.url, $event)"
                    >
                      Add channel
                    </button>
                  </div>
                </div>
              </template>
              <template v-slot:collapse>
                <ul class="channel__entries list__content">
                  <li
                    v-for="(entry, index) in channel.entries"
                    :key="`channel-entry-${index}`"
                    class="channel__entry list__item"
                  >
                    <a :href="entry.link" :title="entry.title">
                      {{ entryTitle(entry) }}
                    </a>
                    <span class="entry__published">
                      added:
                      {{
                        formatDate(entry.published_time, {
                          dateStyle: "short",
                          timeStyle: "short",
                        })
                      }}
                    </span>
                  </li>
                </ul>
              </template>
            </Collapse>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <div class="btn-row">
        <button class="btn" @click="addContentModalDisplayed = false">
          Close this window
        </button>
      </div>
    </div>
  </Modal>

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
        <button
          class="btn btn--main-action"
          @click="addChannelClicked(this.url, $event)"
          :disabled="url.length === 0"
        >
          Save
        </button>
      </div>
    </div>
  </Modal>

  <Modal
    v-model="addEntryModalDisplayed"
    title="Add new article"
    modal-class="modal modal-lg"
  >
    <div class="modal-body">
      <form>
        <div class="panel-content">
          <label for="url">URL</label>
          <div class="form-control">
            <input id="url" class="input-field" type="url" v-model="url" />
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
        <button class="btn" @click="addEntryModalDisplayed = false">
          Close this window
        </button>
        <button
          class="btn btn--main-action"
          @click="addEntryClicked(this.url)"
          :disabled="url.length === 0"
        >
          Save
        </button>
      </div>
    </div>
  </Modal>
</template>

<script>
import Multiselect from "@vueform/multiselect";
import VueModal from "@kouts/vue-modal";
import { BIconCaretDownFill } from "bootstrap-icons-vue";
import { mapGetters } from "vuex";
import Collapse from "@/components/Collapse.vue";
import { formatDate } from "../utils";

import {
  ACTION_AUTODETECT_REQUEST,
  ACTION_AUTODETECT_RESET,
  ACTION_CHANNEL_CREATE_REQUEST,
  ACTION_ENTRY_ADD_MANUAL_REQUEST,
  GET_CHANNEL_TAGS,
  GET_ENTRY_TAGS,
  GET_AUTODETECT_STATE,
  GET_AUTODETECTED_CHANNELS,
  GET_AUTODETECTED_ENTRIES,
} from "../types";

export default {
  name: "AddContent",
  components: {
    BIconCaretDownFill,
    Collapse,
    Modal: VueModal,
    Multiselect,
  },
  computed: {
    ...mapGetters({
      channelTags: GET_CHANNEL_TAGS,
      entryTags: GET_ENTRY_TAGS,
      autodetectState: GET_AUTODETECT_STATE,
      autodetectedChannels: GET_AUTODETECTED_CHANNELS,
      autodetectedEntries: GET_AUTODETECTED_ENTRIES,
    }),
  },
  data() {
    return {
      addContentDropdownDisplayed: false,
      addContentModalDisplayed: false,
      addChannelModalDisplayed: false,
      addEntryModalDisplayed: false,
      url: "",
      title: "",
      tags: [],
      tagsOptions: [],
    };
  },
  methods: {
    formatDate,
    entryTitle(entry) {
      if (entry.title.length > 0) {
        return entry.title;
      }
      const url = new URL(entry.link);
      return `${url.host}/…`;
    },
    openAddContentModal() {
      this.addContentModalDisplayed = true;
    },
    openAddChannelModal() {
      this.addChannelModalDisplayed = true;
      this.tagsOptions = this.channelTags.map((tag) => tag.name);
    },
    openAddEntryModal() {
      this.addEntryModalDisplayed = true;
      this.tagsOptions = this.entryTags.map((tag) => tag.name);
    },
    hideAddContentModal() {
      this.addContentDropdownDisplayed = false;
      this.addContentModalDisplayed = false;
      this.addChannelModalDisplayed = false;
      this.addEntryModalDisplayed = false;
      this.url = "";
      this.title = "";
      this.tags = [];
      this.tagsOptions = [];
      this.$store.dispatch(ACTION_AUTODETECT_RESET);
    },
    detectContentClicked() {
      this.$store.dispatch({
        type: ACTION_AUTODETECT_REQUEST,
        url: this.url,
      });
    },
    addEntryClicked(link) {
      this.$store
        .dispatch({
          type: ACTION_ENTRY_ADD_MANUAL_REQUEST,
          link: link,
        })
        .then(() => {
          this.hideAddContentModal();
        });
    },
    addChannelClicked(link, event) {
      const payload = {
        url: link,
      };
      event.stopPropagation();
      if (this.title.length > 0) {
        payload.title = this.title;
      }
      if (this.tags.length > 0) {
        payload.tags = this.tags;
      }

      this.$store
        .dispatch({
          type: ACTION_CHANNEL_CREATE_REQUEST,
          ...payload,
        })
        .then(() => {
          this.hideAddContentModal();
        });
    },
  },
};
</script>

<style lang="scss">
@import "@vueform/multiselect/themes/default.css";
@import "../scss/mixins";
div.btn--dropdown {
  display: flex;
  width: 100%;

  button:not(.btn--dropdown) {
    flex-grow: 2;
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }

  button.btn--dropdown {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
}

ul.dropdown--menu {
  background-color: var(--main-action-bg-color);
  padding-inline-start: 1rem;
  border-radius: var(--main-border-radius);
  margin-top: 2px;

  .dropdown__item {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  a {
    display: block;
  }
}

.modal .spinner {
  left: 50%;
  margin-left: -40px;
}
.panel-content.row {
  gap: 1rem;
}

.autodetect-results {
  h2 {
    margin-bottom: 0;
  }

  p {
    margin-block-start: 0;
  }

  .row {
    align-items: baseline;
  }

  .btn-row {
    white-space: nowrap;
  }

  .channel {
    &.row.list-item {
      gap: unset;
      align-items: baseline;
    }

    .collapse-trigger {
      width: 100%;
    }

    .channel__meta {
      flex-wrap: wrap;

      span:not(:first-of-type)::before {
        content: "•";
        margin: 0 0.5ex;
      }
    }

    .channel__entries {
      margin-left: 1rem;
    }

    .channel__entry.list__item {
      white-space: unset;
    }
  }
}
</style>
