<template>
  <div class="maintenance">
    <h2 class="view__title">
      <BIconTools />
      {{ sectionTitle }} - Maintenance
    </h2>
    <div class="section">
      <p v-html="pageDescription"></p>
      <ChannelsMaintenance
        :initialQuery="initialQuery"
        :displayDaySelector="displayDaySelector"
        :displayInactivateButton="displayInactivateButton"
        :displayActivateButton="displayActivateButton"
        :displayDeleteButton="displayDeleteButton"
      />
    </div>
  </div>
</template>

<script>
import { BIconTools } from "bootstrap-icons-vue";
import ChannelsMaintenance from "@/components/ChannelsMaintenance.vue";

import {
  ROUTE_MAINTENANCE_STALE_CHANNELS,
  ROUTE_MAINTENANCE_INACTIVE_CHANNELS,
  ROUTE_MAINTENANCE_NOT_UPDATED_CHANNELS,
} from "../types";

export default {
  name: "Maintenance",
  components: {
    BIconTools,
    ChannelsMaintenance,
  },
  data() {
    return {
      initialQuery: {},
      displayDaySelector: false,
      displayInactivateButton: false,
      displayActivateButton: false,
      displayDeleteButton: false,
      pageDescription: "",
      sectionTitle: "",
    };
  },
  methods: {
    resetInitialData() {
      this.initialQuery = {};
      this.displayDaySelector = false;
      this.displayInactivateButton = false;
      this.displayActivateButton = false;
      this.displayDeleteButton = false;
      this.pageDescription = "";
      this.sectionTitle = "";
    },
    setupViewBasedOnRouteName() {
      const routeName = this.$route.name;
      switch (routeName) {
        case ROUTE_MAINTENANCE_STALE_CHANNELS:
          this.resetInitialData();
          this.displayInactivateButton = true;
          this.initialQuery = {
            active: true,
            is_stale: true,
          };
          this.sectionTitle = "Stale channels";
          this.pageDescription =
            "Channels become stale when Kustosz can't access them for extended period of time. They disappeared from the web or have been moved without leaving proper redirection in place. <a href='https://docs.kustosz.org/en/stable/basic-usage.html#stale-channels'>Read more</a>.";
          break;
        case ROUTE_MAINTENANCE_NOT_UPDATED_CHANNELS:
          this.resetInitialData();
          this.displayDaySelector = true;
          this.displayInactivateButton = true;
          this.initialQuery = {
            active: true,
            last_entry_published_time__lte: "",
          };
          this.sectionTitle = "Channels without new entries";
          this.pageDescription =
            "Channels that are online, but have not produced a new entry in number of days. <a href='https://docs.kustosz.org/en/stable/basic-usage.html#channels-without-new-entries'>Read more</a>.";
          break;
        case ROUTE_MAINTENANCE_INACTIVE_CHANNELS:
          this.resetInitialData();
          this.displayActivateButton = true;
          this.displayDeleteButton = true;
          this.initialQuery = { active: false };
          this.sectionTitle = "Inactive channels";
          this.pageDescription =
            "Channels that have “active” flag turned off. <a href='https://docs.kustosz.org/en/stable/basic-usage.html#inactive-channels'>Read more</a>.";
          break;
        default:
          () => {}; // noop
      }
    },
  },
  created() {
    this.$watch(
      () => this.$route.name,
      (newRouteName /* eslint-disable-line no-unused-vars*/) => {
        this.setupViewBasedOnRouteName();
      }
    );
  },
  mounted() {
    this.setupViewBasedOnRouteName();
  },
};
</script>
