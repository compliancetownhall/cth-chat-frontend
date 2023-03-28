<template>
  <!-- <header>
    <h1>{{ title }}</h1>
    <router-link class="link" to="/chat">Chat</router-link>
  </header> -->
  <nav class="navbar">
    <router-link class="logo link" to="/">
      <img src="../assets/logo.png" alt="Babble Logo" width="40" height="40" />
      <span class="logoText">Townhall</span>
    </router-link>

    <div class="user" v-if="$store.getters.loginStatus">
      <img
        @click="
          () => {
            $store.commit('SET_PROFILESTATES', $store.getters.user);
            $store.commit('TOGGLE_PROFILE');
            $store.commit('SET_ISPROFILE', true);
          }
        "
        class="avatar"
        :src="$store.getters.user.avatar"
        alt=""
      />
      <LogoutOutlined
        @click="logout"
        :style="{
          fontSize: '25px',
          color: '#d4122b',
          cursor: 'pointer',
        }"
      />
    </div>
  </nav>
</template>

<script>
import { LogoutOutlined } from "@ant-design/icons-vue";

export default {
  name: "Header",
  components: {
    LogoutOutlined,
  },
  props: {
    title: {
      type: String,
      default: "Title",
    },
  },
  updated() {
    // if (!this.$store.getters.loginStatus) {
    //   this.$router.push("/");
    // }
  },
  mounted() {
    //Setting Mobile View State
    if (window.innerWidth < 600) {
      this.$store.commit("SET_MOBILE_VIEW", true);
    } else {
      this.$store.commit("SET_MOBILE_VIEW", false);
    }
  },
  created() {
    // if (!this.$store.getters.loginStatus) {
    //   this.$router.push("/");
    // }
  },

  methods: {
    logout() {
      localStorage.removeItem("user");
      this.$store.commit("LOGOUT");
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.navbar {
  box-sizing: border-box;
  padding: 15px 10vw;
  transition: 600ms;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  position: fixed;
  top: 0;
}
.navbar {
  transition: 300ms;
  box-shadow: 0 0 2px #7facff, 0 0 4px #7facff, 0 0 6px #7facff,
    0 0 15px #7facff;
}
.link {
  text-decoration: none;
  color: aliceblue;
  display: flex;
  align-items: center;
  transition: 300ms;
}

.link span {
  padding: 0 15px;
  font-size: 22px;
  font-weight: bold;
}

.user {
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  height: 40px;
  border-radius: 50%;
  width: 40px;
  margin: 0 10px;
  cursor: pointer;
  object-fit: cover;
}
</style>
