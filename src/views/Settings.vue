<template>
  <div class="settings">
    <h2 class="view__title">
      <svg
        class="view__title-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 489.802 489.802"
        xml:space="preserve"
      >
        <path
          d="m20.701 281.901 32.1.2c4.8 24.7 14.3 48.7 28.7 70.5l-22.8 22.6c-8.2 8.1-8.2 21.2-.2 29.4l24.6 24.9c8.1 8.2 21.2 8.2 29.4.2l22.8-22.6c21.6 14.6 45.5 24.5 70.2 29.5l-.2 32.1c-.1 11.5 9.2 20.8 20.7 20.9l35 .2c11.5.1 20.8-9.2 20.9-20.7l.2-32.1c24.7-4.8 48.7-14.3 70.5-28.7l22.6 22.8c8.1 8.2 21.2 8.2 29.4.2l24.9-24.6c8.2-8.1 8.2-21.2.2-29.4l-22.6-22.8c14.6-21.6 24.5-45.5 29.5-70.2l32.1.2c11.5.1 20.8-9.2 20.9-20.7l.2-35c.1-11.5-9.2-20.8-20.7-20.9l-32.1-.2c-4.8-24.7-14.3-48.7-28.7-70.5l22.8-22.6c8.2-8.1 8.2-21.2.2-29.4l-24.6-24.9c-8.1-8.2-21.2-8.2-29.4-.2l-22.8 22.6c-21.6-14.6-45.5-24.5-70.2-29.5l.2-32.1c.1-11.5-9.2-20.8-20.7-20.9l-35-.2c-11.5-.1-20.8 9.2-20.9 20.7l-.3 32.1c-24.8 4.8-48.8 14.3-70.5 28.7l-22.6-22.8c-8.1-8.2-21.2-8.2-29.4-.2l-24.8 24.6c-8.2 8.1-8.2 21.2-.2 29.4l22.6 22.8c-14.6 21.6-24.5 45.5-29.5 70.2l-32.1-.2c-11.5-.1-20.8 9.2-20.9 20.7l-.2 35c-.1 11.4 9.2 20.8 20.7 20.9zm158.6-103.3c36.6-36.2 95.5-35.9 131.7.7s35.9 95.5-.7 131.7-95.5 35.9-131.7-.7-35.9-95.5.7-131.7z"
          style="fill: currentColor"
        />
      </svg>
      Settings
    </h2>
    <h3 class="section-title">Theme</h3>
    <ThemeSwitcher />
    <h3 class="section-title">Sources</h3>
    <NavList />
  </div>
</template>

<script>
// @ is an alias to /src
import NavList from "@/components/NavList.vue";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default {
  name: "Home",
  components: {
    NavList,
    ThemeSwitcher,
  },
};
</script>

<style lang="scss">
.view__title-icon {
  height: 20px;
  width: 20px;
  color: var(--primary);
}
</style>