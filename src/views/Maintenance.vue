<template>
  <div class="maintenance">
    <h2 class="view__title">
      <BIconTools />
      Maintenance
    </h2>
    <div class="section">
      <ChannelsMaintenance
        :initialQuery="initialQuery"
        :displayDaySelector="displayDaySelector"
        :displayInactivateButton="displayInactivateButton"
        :displayActivateButton="displayActivateButton"
        :displayRemoveButton="displayRemoveButton"
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
      displayRemoveButton: false,
    };
  },
  methods: {
    resetInitialData() {
      this.initialQuery = {};
      this.displayDaySelector = false;
      this.displayInactivateButton = false;
      this.displayActivateButton = false;
      this.displayRemoveButton = false;
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
          break;
        case ROUTE_MAINTENANCE_NOT_UPDATED_CHANNELS:
          this.resetInitialData();
          this.displayDaySelector = true;
          this.displayInactivateButton = true;
          this.initialQuery = {
            active: true,
            last_entry_published_time__lte: "",
          };
          break;
        case ROUTE_MAINTENANCE_INACTIVE_CHANNELS:
          this.resetInitialData();
          this.displayActivateButton = true;
          this.displayRemoveButton = true;
          this.initialQuery = { active: false };
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
