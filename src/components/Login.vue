<template>
  <div class="login-container">
    <div class="inputContainer">
      <label for="">Email</label>
      <input type="text" placeholder="Enter Your Email" v-model.trim="email" />
    </div>
    <div class="inputContainer">
      <label for="">Password</label>
      <input
        type="password"
        placeholder="Create a Password"
        v-model.trim="password"
        v-on:keyup.enter="login"
      />
    </div>
    <h6 class="error">{{ errorMsg }}</h6>
    <Button @click="login" text="Login" />
    <p>or</p>
    <Button @click="guest" text="Continue as Guest" color="" />
  </div>
</template>
<script>
import Button from "./Button.vue";
export default {
  name: "Login",
  components: {
    Button,
  },
  data() {
    return {
      email: "",
      password: "",
      errorMsg: "",
    };
  },
  methods: {
    async login() {
      if (!this.email || !this.password) {
        this.errorMsg = "Both fields are required!";
        return;
      }
      this.errorMsg = "";

      try {
        this.$emit("loading");
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };

        const { data } = await this.$axios.post(
          `/api/user/login`,
          {
            email: this.email,
            password: this.password,
          },
          config
        );

        localStorage.setItem("user", JSON.stringify(data));
        this.$emit("stop");
        this.$router.push(`/chat`);
        this.$store.commit("SET_NAME", data.name);
        this.$store.commit("SET_EMAIL", data.email);
        this.$store.commit("SET_AVATAR", data.avatar);
        this.$store.commit("SET_TOKEN", data.token);
        this.$store.commit("SET_ID", data._id);
        this.$store.commit("SET_LOGINSTATUS");
      } catch (error) {
        this.$emit("stop");
        this.errorMsg = "Invalid Credentials!";
        console.log(error);
      }
    },
    guest() {
      this.email = "guest@gmail.com";
      this.password = "justTakeATour";
      this.login();
    },
  },
};
</script>
<style scoped>
input {
  background: #001425;
  border: none;
  padding: 12px 20px;
  width: 300px;
  max-width: 60vw;
  color: #ffffff;
  font-size: 14px;
  outline: none;
  border-radius: 5px;
  transition: all 300ms ease-in-out;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  margin: 5px 0;
}
.inputContainer {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  font-weight: bold;
  font-size: 15px;
}
.error {
  color: rgb(219, 0, 0);
  font-size: 14px;
  height: 20px;
  margin: 4px 0;
  overflow: hidden;
}
</style>
