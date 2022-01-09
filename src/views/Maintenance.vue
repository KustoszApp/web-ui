<template>
  <div class="maintenance">
    <h2 class="view__title">
      <BIconTools />
      Maintenance
    </h2>
    <div class="section">
      <ChannelsMaintenance />
    </div>
  </div>
</template>

<script>
import { BIconTools } from "bootstrap-icons-vue";
import ChannelsMaintenance from "@/components/ChannelsMaintenance.vue";

export default {
  name: "Maintenance",
  components: {
    BIconTools,
    ChannelsMaintenance,
  },
};
</script>
