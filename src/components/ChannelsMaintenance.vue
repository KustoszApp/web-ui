<template>
  <div class="list">
    <ul class="list__content">
      <li
        class="list__item"
        v-for="feed in maintenance_channels"
        :key="feed.id"
      >
        <input
          :id="feed.id"
          :value="feed.id"
          class="input-check mr-1"
          type="checkbox"
          v-model="checkedChannels"
        />
        <label :for="feed.id">{{ feed.displayed_title }}</label>
        (<router-link
          class="list__item-link"
          :to="{ name: 'home', params: { entryId: feed.id } }"
        >
          see content </router-link
        >)
      </li>
    </ul>
  </div>
  <div>
    <form v-if="displayInactivateButton" @submit.prevent="inactivateChannels">
      <button class="btn btn--primary" type="submit">
        Inactivate selected channels
      </button>
    </form>
    <form v-if="displayActivateButton" @submit.prevent="activateChannels">
      <button class="btn btn--primary" type="submit">
        Activate selected channels
      </button>
    </form>
    <form v-if="displayRemoveButton" @submit.prevent="removeChannels">
      <button class="btn btn--primary" type="submit">
        Remove selected channels
      </button>
    </form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "NavList",
  data() {
    return {
      query: "",
      checkedChannels: [],
      displayInactivateButton: true,
      displayActivateButton: false,
      displayRemoveButton: false,
    };
  },
  computed: {
    ...mapGetters(["maintenance_channels"]),
  },
  methods: {
    inactivateChannels() {
      this.$store.dispatch({
        type: "maintenance_channels_inactivate_request",
        query: `id=${this.checkedChannels.join(",")}`,
      });
    },
    activateChannels() {
      this.$store.dispatch({
        type: "maintenance_channels_activate_request",
        query: `id=${this.checkedChannels.join(",")}`,
      });
    },
    removeChannels() {
      this.$store.dispatch({
        type: "not_implemented_maintenance_channels_delete_request",
        query: `id=${this.checkedChannels.join(",")}`,
      });
    },
  },
  watch: {
    $route(to) {
      this.checkedChannels = [];
      if (to.path.includes("stale")) {
        this.query = "is_stale=true";
        this.displayInactivateButton = true;
        this.displayActivateButton = false;
        this.displayRemoveButton = false;
      } else if (to.path.includes("not_updated")) {
        const date = new Date();
        date.setDate(date.getDate() - 30); // FIXME: hardcoded
        const referenceDate = date.toISOString().slice(0, -5);
        this.query = `last_entry_published_time__lte=${referenceDate}`;
        this.displayInactivateButton = true;
        this.displayActivateButton = false;
        this.displayRemoveButton = false;
      } else if (to.path.includes("inactive")) {
        this.query = "active=false";
        this.displayInactivateButton = false;
        this.displayActivateButton = true;
        this.displayRemoveButton = false; // FIXME: should be true
      }
      this.$store.dispatch({
        type: "maintenance_channels_get_request",
        query: this.query,
      });
    },
  },
};
</script>
