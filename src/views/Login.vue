<template>
  <div id="login" class="login">
    <form @submit.prevent="tryLogin">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          id="username"
          type="text"
          class="form-control"
          v-model="username"
          required
          autofocus
        />
      </div>
      <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <input
          id="password"
          type="password"
          class="form-control"
          v-model="password"
          required
        />
      </div>
      <button type="submit" class="btn btn--primary btn--block">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      error: "",
    };
  },
  methods: {
    tryLogin() {
      this.$store
        .dispatch({
          type: "auth_login",
          username: this.username,
          password: this.password,
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style lang="scss">
#login .form-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;

  input {
    width: 65%;
  }
}
</style>
