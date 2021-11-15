<template>
  <div class="list">
    <ul class="list__content">
      <li
        class="list__item"
        v-for="group in groupedChannels()"
        :key="group.tag.slug"
      >
        <router-link
          class="list__item-link"
          :to="{ name: 'home', params: { entryId: group.tag.slug } }"
        >
          {{ group.tag.name }}
        </router-link>
        <span class="unread-count">{{ group.unarchived_entries }}</span>
        <ul class="list__content">
          <li class="list__item" v-for="feed in group.channels" :key="feed.id">
            <svg
              class="list__item-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -256 1792 1792"
            >
              <path
                d="M384 192q0-80-56-136T192 0Q112 0 56 56T0 192q0 80 56 136t136 56q80 0 136-56t56-136zM896 69q2-28-17-48-18-21-47-21H697q-25 0-43 16.5T634 58q-22 229-184.5 391.5T58 634q-25 2-41.5 20T0 697v135q0 29 21 47 17 17 43 17h5q160-13 306-80.5T634 634q114-113 181.5-259T896 69zm512-2q2-27-18-47-18-20-46-20h-143q-26 0-44.5 17.5T1137 60q-12 215-101 408.5t-231.5 336Q662 947 468.5 1036T60 1138q-25 1-42.5 19.5T0 1201v143q0 28 20 46 18 18 44 18h3q262-13 501.5-120T994 994q187-186 294-425.5T1408 67z"
                style="fill: currentColor"
                transform="matrix(1 0 0 -1 212.61 1346.17)"
              />
            </svg>
            <router-link
              class="list__item-link"
              :to="{ name: 'home', params: { entryId: feed.id } }"
            >
              {{ feed.displayed_title }}
            </router-link>
            <span class="unread-count">{{ feed.unarchived_entries }}</span>
            <svg
              class="list__item-edit-icon"
              @click="showChannelEditModal(feed)"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 50 50"
              enable-background="new 0 0 50 50"
            >
              <path
                d="M9.6 40.4l2.5-9.9L27 15.6l7.4 7.4-14.9 14.9-9.9 2.5zm4.3-8.9l-1.5 6.1 6.1-1.5L31.6 23 27 18.4 13.9 31.5z"
              />
              <path
                d="M17.8 37.3c-.6-2.5-2.6-4.5-5.1-5.1l.5-1.9c3.2.8 5.7 3.3 6.5 6.5l-1.9.5z"
              />
              <path d="M29.298 19.287l1.414 1.414-13.01 13.02-1.414-1.412z" />
              <path d="M11 39l2.9-.7c-.3-1.1-1.1-1.9-2.2-2.2L11 39z" />
              <path
                d="M35 22.4L27.6 15l3-3 .5.1c3.6.5 6.4 3.3 6.9 6.9l.1.5-3.1 2.9zM30.4 15l4.6 4.6.9-.9c-.5-2.3-2.3-4.1-4.6-4.6l-.9.9z"
              />
            </svg>
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <transition name="modal" v-if="channelEditModalDisplayed">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              Editing channel {{ editedChannelDisplayedTitle }}
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <p>
                <input
                  class="input-check mr-1"
                  type="checkbox"
                  id="editedChannelActive"
                  v-model="editedChannelActive"
                />
                <label for="editedChannelActive">active</label>
              </p>
              <p>
                <input
                  class="input-check mr-1"
                  type="checkbox"
                  id="editedChannelDeduplicationEnabled"
                  v-model="editedChannelDeduplicationEnabled"
                />
                <label for="editedChannelDeduplicationEnabled"
                  >is deduplicated</label
                >
              </p>
              <p>
                <label for="channel-title">Name of channel:</label>
                <input
                  id="channel-title"
                  class="input-field"
                  v-model="editedChannelTitleUser"
                  @keypress.stop
                />
                <small class="muted"
                  >(default name provided by channel author: "{{
                    editedChannelTitleUpstream
                  }}")
                </small>
              </p>
              <p>
                <label for="update-frequency">
                  Update frequency (seconds):
                </label>
                <input
                  id="update-frequency"
                  class="input-field"
                  type="number"
                  v-model="editedChannelUpdateFrequency"
                  min="1"
                />
              </p>
              <p>
                Tags:
                <Multiselect
                  v-model="editedChannelTags"
                  mode="tags"
                  :options="editedChannelTagsOptions"
                  :closeOnSelect="false"
                  :searchable="true"
                  :createTag="true"
                  @keypress.stop
                ></Multiselect>
              </p>
              <table>
                <tr>
                  <td class="text-right">Date of last entry publication:</td>
                  <td>
                    {{
                      formatDate(
                        editedChannelLastEntryPublishedTime,
                        undefined,
                        dateFormat
                      )
                    }}
                  </td>
                </tr>
                <tr>
                  <td class="text-right">Date of last content check:</td>
                  <td>
                    {{
                      formatDate(
                        editedChannelLastCheckTime,
                        undefined,
                        dateFormat
                      )
                    }}
                  </td>
                </tr>
                <tr>
                  <td class="text-right">Channel added date:</td>
                  <td>
                    {{
                      formatDate(editedChannelAddedTime, undefined, dateFormat)
                    }}
                  </td>
                </tr>
                <tr>
                  <td class="text-right">Channel link:</td>
                  <td>
                    <a :href="editedChannelLink">{{ editedChannelLink }}</a>
                  </td>
                </tr>
                <tr>
                  <td class="text-right">Channel URL:</td>
                  <td>
                    <a :href="editedChannelUrl">{{ editedChannelUrl }}</a>
                  </td>
                </tr>
              </table>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="btn btn--primary" @click="submitNewChannelData()">
                Save
              </button>
              <button
                class="btn btn--secondary ml-2"
                @click="channelEditModalDisplayed = false"
              >
                Close this window
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Multiselect from "@vueform/multiselect";
import { mapGetters } from "vuex";
import { formatDate } from "../utils";

export default {
  name: "NavList",
  components: {
    Multiselect,
  },
  data() {
    return {
      channelEditModalDisplayed: false,
      editedChannelId: 0,
      editedChannelActive: false,
      editedChannelDeduplicationEnabled: false,
      editedChannelDisplayedTitle: "",
      editedChannelTitleUpstream: "",
      editedChannelTitleUser: "",
      editedChannelUpdateFrequency: 0,
      editedChannelTags: [],
      editedChannelTagsOptions: [],
      editedChannelAddedTime: "",
      editedChannelLastCheckTime: "",
      editedChannelLastEntryPublishedTime: "",
      editedChannelLink: "",
      editedChannelUrl: "",
      dateFormat: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      },
    };
  },
  computed: {
    ...mapGetters(["channels", "channelTags"]),
  },
  methods: {
    groupedChannels() {
      let totalUnarchived = 0;
      let groups = {};
      this.channels.forEach((channel) => {
        totalUnarchived += channel.unarchived_entries;
        let tags = channel.tags;
        if (!tags.length) {
          tags = ["Untagged"];
        }
        tags.forEach((tagName) => {
          if (!(tagName in groups)) {
            groups[tagName] = {
              unarchived_entries: 0,
              channels: [],
            };
          }
          groups[tagName].channels.push(channel);
          groups[tagName].unarchived_entries += channel.unarchived_entries;
        });
      });
      let totalObj = {
        unarchived_entries: totalUnarchived,
        channels: [],
        tag: {
          name: "All entries",
          slug: "",
        },
      };
      groups = Object.keys(groups)
        .sort()
        .reduce((obj, key) => {
          let tag = this.channelTags.find((tag) => tag.name === key);
          if (tag === undefined) {
            tag = {
              name: "Untagged",
              slug: "channel_has_tags=false",
            };
          }
          return [...obj, { ...groups[key], tag: tag }];
        }, []);
      groups.unshift(totalObj);
      return groups;
    },
    showChannelEditModal(feed) {
      this.editedChannelId = feed.id;
      this.editedChannelActive = feed.active;
      this.editedChannelDeduplicationEnabled = feed.deduplication_enabled;
      this.editedChannelTitleUpstream = feed.title_upstream;
      this.editedChannelTitleUser = feed.title;
      this.editedChannelDisplayedTitle = feed.displayed_title;
      this.editedChannelUpdateFrequency = feed.update_frequency;
      this.editedChannelTags = feed.tags;
      this.editedChannelTagsOptions = this.channelTags.map((tag) => tag.name);
      this.editedChannelAddedTime = feed.added_time;
      this.editedChannelLastCheckTime = feed.last_check_time;
      this.editedChannelLastEntryPublishedTime = feed.last_entry_published_time;
      this.editedChannelLink = feed.link;
      this.editedChannelUrl = feed.url;
      this.channelEditModalDisplayed = true;
    },
    submitNewChannelData() {
      this.$store
        .dispatch({
          type: "channel_edit_request",
          channel_id: this.editedChannelId,
          active: this.editedChannelActive,
          deduplication_enabled: this.editedChannelDeduplicationEnabled,
          tags: this.editedChannelTags,
          title: this.editedChannelTitleUser,
          update_frequency: this.editedChannelUpdateFrequency,
        })
        .then(() => {
          this.$store.dispatch({
            type: "channel_tags_request",
          });
        });
    },
    formatDate,
  },
};
</script>
<style src="@vueform/multiselect/themes/default.css"></style>

<style lang="scss">
.list {
  font-size: 0.875rem;
}

.list__content {
  list-style-type: none;
  padding: 0;
  margin: 0 0 1rem;
}

.list__item {
  color: var(--secondary);
  margin: 0;
  overflow: hidden;
  padding: 0.25rem 0.5rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list__item-icon {
  vertical-align: middle;
  margin-right: 0.125rem;
  height: 12px;
  width: 12px;
}

.list__item-edit-icon {
  margin-left: 0.25rem;
  height: 14px;
  width: 14px;
}

.list__item-link {
  color: var(--primary);
  text-decoration: none;
  vertical-align: middle;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  min-width: 300px;
  max-width: 75%;
  margin: 0px auto;
  padding: 1rem;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header {
  font-size: 1.25rem;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 1rem 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
