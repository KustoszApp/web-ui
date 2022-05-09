<template>
  <div class="spinner-wrapper" v-show="isVisible">
    <div class="spinner">
      <div class="spinner__element"></div>
      <div class="spinner__element"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Spinner",
  props: {
    isVisible: Boolean,
  },
};
</script>

<style>
.spinner-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}

.spinner > .spinner__element {
  position: absolute;
  border: 4px solid var(--main-text-color);
  opacity: 1;
  border-radius: 50%;
  animation: spinner 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.spinner > .spinner__element:nth-child(2) {
  animation-delay: -0.5s;
}

@keyframes spinner {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
</style>
