<template>
  <div>
    <div v-if="!chooseAvatar" class="signUp-container">
      <div class="inputContainer">
        <label for="">Name</label>
        <input type="text" placeholder="Enter Your Name" v-model.trim="name" />
      </div>
      <div class="inputContainer">
        <label for="">Email</label>
        <input
          type="text"
          placeholder="Enter Your Email"
          v-model.trim="email"
        />
      </div>
      <div class="inputContainer">
        <label for="">Password</label>
        <input
          type="password"
          placeholder="Create a Password"
          v-model.trim="password"
        />
      </div>
      <div class="inputContainer">
        <label for="">Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm your Password"
          v-model.trim="confirmPassword"
          v-on:keyup.enter="nextStep"
          v-on:input="
            () => {
              if (password !== confirmPassword) {
                errorMsg = `Passwords doesn't match!`;
              } else {
                errorMsg = ``;
              }
            }
          "
        />
      </div>
      <h6 class="error">{{ errorMsg }}</h6>
      <Button @click="nextStep" class="btn" text="Next" />
    </div>
    <div v-else class="chooseAvatar">
      <div class="avatarHeading">
        So {{ name.split(" ")[0] }}, Lets get you a Profile Picture!
      </div>
      <LoadingOutlined
        v-if="loading"
        :style="{
          fontSize: '50px',
          color: '#ffffff',
          margin: '45px 0',
          overflow: 'hidden',
        }"
      />
      <img
        v-else
        class="avatar"
        :src="avatar"
        alt=""
        srcset=""
        width="100"
        height="100"
      />
      <p>
        Continue with this ? or Upload Your Own<label
          class="uploadIcon"
          for="avatarInput"
          ><UploadOutlined
        /></label>
      </p>

      <input @change="captureImg" type="file" id="avatarInput" />
      <Button @click="submit" text="Create Account" />
    </div>
  </div>
</template>

<script>
import Button from "./Button.vue";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons-vue";
// import axios from "axios";
// import Avatars from "./avatars";

export default {
  components: {
    Button,
    UploadOutlined,
    LoadingOutlined,
  },
  name: "SignUp",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      showPass: false,
      showCPass: false,
      chooseAvatar: false,
      //   avatarNumber: Math.floor(Math.random() * 17),
      avatar: "https://cdn-icons-png.flaticon.com/512/3237/3237472.png",
      loading: false,
      errorMsg: "",
    };
  },

  methods: {
    captureImg(e) {
      const img = e.target.files[0];
      this.loading = true;

      if (
        img.type === "image/jpeg" ||
        img.type === "image/png" ||
        img.type === "image/jpg"
      ) {
        const data = new FormData();
        data.append("file", img);
        data.append("upload_preset", "babble");
        data.append("cloud_name", "dutfqtx9k");
        fetch("https://api.cloudinary.com/v1_1/dutfqtx9k/image/upload", {
          method: "post",
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            this.avatar = data.url.toString().replace("http", "https");
            this.loading = false;
          })
          .catch((err) => {
            console.log(err);
            this.loading = false;
          });
      } else {
        console.log("Please Select an Image!");
        this.loading = false;
      }
    },
    nextStep() {
      if (
        !this.name ||
        !this.email ||
        !this.password ||
        !this.confirmPassword
      ) {
        this.errorMsg = "All Fields are required!";
        return;
      }

      if (this.password !== this.confirmPassword) {
        this.errorMsg = "Passwords doesn't match!";
        return;
      }
      this.chooseAvatar = true;
    },
    async submit() {
      if (
        !this.name ||
        !this.email ||
        !this.password ||
        !this.confirmPassword ||
        !this.avatar
      ) {
        this.chooseAvatar = false;
        return;
      }

      try {
        console.log("emittingggg");
        this.$emit("loading");
        this.$emit("signUp");
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };

        const { data } = await this.$axios.post(
          `/api/user`,
          {
            name: this.name,
            email: this.email,
            password: this.password,
            avatar: this.avatar,
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
        console.log(error);
      }
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
#avatarInput {
  display: none;
}

.error {
  color: rgb(219, 0, 0);
  font-size: 14px;
  height: 20px;
  margin: 4px 0;
  overflow: hidden;
}

.uploadIcon {
  font-size: 25px;
  margin: 0 10px;
  cursor: pointer;
}
.chooseAvatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.chooseAvatar img {
  margin: 20px 0;
}
.chooseAvatar p {
  margin: 20px 0;
}

.avatarHeading {
  margin: 20px 0;
  font-size: 22px;
  font-weight: bold;
}

.avatar {
  border-radius: 50%;
  overflow: hidden;
  object-fit: cover;
}
</style>
