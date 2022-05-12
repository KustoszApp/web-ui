<template>
  <div class="settings">
    <h2 class="view__title topmost-elem">
      <BIconFunnelFill />
      Filters
    </h2>
    <div class="section">
      <FiltersComponent />
    </div>
  </div>
</template>

<script>
import { BIconFunnelFill } from "bootstrap-icons-vue";
import FiltersComponent from "@/components/Filters";

export default {
  name: "Filters",
  components: {
    BIconFunnelFill,
    FiltersComponent,
  },
};
</script>
