<template>
  <div class="settings">
    <h2 class="view__title">
      <svg
        class="view__title-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        xml:space="preserve"
      >
        <path
          d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"
          style="fill: currentColor"
        />
      </svg>
      Filters
    </h2>
    <Filters />
  </div>
</template>

<script>
import Filters from "@/components/Filters";

export default {
  name: "Filters",
  components: {
    Filters,
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
