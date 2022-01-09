<template>
  <div class="settings">
    <h2 class="view__title">
      <BIconFunnelFill />
      Filters
    </h2>
    <FiltersComponent />
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

<style lang="scss">
.view__title-icon {
  height: 20px;
  width: 20px;
  color: var(--primary);
}

.section {
  padding: 0.5rem 2rem;
}
</style>
