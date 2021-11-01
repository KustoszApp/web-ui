<template>
  <div class="home maintenance">
    <ChannelsMaintenance />
  </div>
</template>

<script>
// @ is an alias to /src
import ChannelsMaintenance from "@/components/ChannelsMaintenance.vue";

export default {
  name: "Maintenance",
  components: {
    ChannelsMaintenance,
  },
};
</script>
