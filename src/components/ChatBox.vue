<template>
  <div v-if="$store.getters.selectedChat" class="chatBox">
    <div class="chatBoxHeader">
      <div
        v-if="$store.getters.isMobile"
        @click="
          () => {
            $store.commit('SET_CHATCLOSE');
            $store.commit('SET_SELECTED_CHAT', null);
          }
        "
        class="backBtn"
      >
        <ArrowLeftOutlined
          :style="{
            fontSize: '15px',
          }"
        />
      </div>
      <span class="chatName"
        >{{
          $store.getters.selectedChat.isGroupChat
            ? $store.getters.selectedChat.chatName
            : getSender($store.getters.user, $store.getters.selectedChat.users)
                .name
        }}
      </span>

      <div
        @click="
          () => {
            $store.commit(
              'SET_PROFILESTATES',
              getSender($store.getters.user, $store.getters.selectedChat.users)
            );
            $store.commit('TOGGLE_PROFILE');

            $store.getters.selectedChat.isGroupChat
              ? $store.commit('SET_ISPROFILE', false)
              : $store.commit('SET_ISPROFILE', true);
          }
        "
        class="viewProfile"
      >
        <span v-if="!$store.getters.isMobile">
          {{
            $store.getters.selectedChat.isGroupChat
              ? "Group Info"
              : "View Profile"
          }}
        </span>
        <SettingFilled
          v-if="$store.getters.selectedChat.isGroupChat"
          :style="{
            fontSize: '25px',
            padding: '0 10px',
          }"
        />

        <EyeTwoTone
          v-else
          :style="{
            fontSize: '25px',
            padding: '0 10px',
          }"
          class="eye"
        />
      </div>
    </div>
    <div class="messagesWindow">
      <Loading3QuartersOutlined
        v-if="isLoading"
        :style="{ fontSize: '35px', overflow: 'hidden' }"
        :spin="true"
      />
      <div v-show="!isLoading" class="messagesContainer">
        <div class="messages" id="messages" ref="scrollMe">
          <Message
            v-for="message in messages"
            :message="message"
            :key="message._id"
          />
        </div>

        <div class="searchHeader">
          <div class="searchbar">
            <Lottie
              v-if="isTyping"
              :options="{ animationData: typingJson }"
              :height="18"
              :width="18"
            />
            <AlignCenterOutlined
              v-else
              :style="{
                fontSize: '18px',
                color: '#ffffff',
              }"
            />
            <input
              type="text"
              placeholder="Type a Message"
              v-on:keyup.enter="send"
              v-model="message"
              v-on:input="typingHandler"
            />
          </div>
          <SendOutlined
            @click="send"
            :style="{
              fontSize: '15px',
              color: '#ffffff',
              background: '#001425',
              cursor: 'pointer',
              padding: '10px',
              borderRadius: '50%',
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  EyeTwoTone,
  SettingFilled,
  ArrowLeftOutlined,
  Loading3QuartersOutlined,
  AlignCenterOutlined,
  SendOutlined,
} from "@ant-design/icons-vue";

import Message from "./Message.vue";
import io from "socket.io-client";
import Lottie from "vue-lottie";
import jsonData from "../assets/dots.json";

export default {
  components: {
    Lottie,
    Message,
    EyeTwoTone,
    SettingFilled,
    ArrowLeftOutlined,
    Loading3QuartersOutlined,
    AlignCenterOutlined,
    SendOutlined,
  },
  data() {
    return {
      isLoading: true,
      messages: [],
      message: "",
      endPoint: "https://compliancetownhall-chat.onrender.com/",
      socket: "",
      selectedChatCompare: null,
      socketConnected: false,
      typing: false,
      isTyping: false,
      typingJson: jsonData,
    };
  },
  async mounted() {
    this.$nextTick(() => {
      this.fetchMsgs();
    });

    //Starting socket

    this.socket = io(this.endPoint);
    this.socket.emit("setup", this.$store.getters.user);
    this.socket.on("connected", () => (this.socketConnected = true));

    this.socket.on("Message recieved", (newMessageRecieved) => {
      if (
        !this.selectedChatCompare ||
        this.selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        //notification
      } else {
        this.messages = [...this.messages, newMessageRecieved];
      }
    });

    this.socket.on("typing", () => {
      this.isTyping = true;
    });
    this.socket.on("stopTyping", () => (this.isTyping = false));
  },
  watch: {
    "$store.state.selectedChat": {
      handler() {
        this.selectedChatCompare = this.$store.state.selectedChat;
        this.fetchMsgs();
        setTimeout(() => {
          this.scrollToBottom(0);
        }, 400);
      },
      immediate: true,
    },
    messages(newMessages, oldMessages) {
      setTimeout(() => {
        this.scrollToBottom(250);
      }, 200);
      this.$store.commit("TOGGLE_UPDATE_CHATS");
    },
  },
  methods: {
    getSender(loggedIn, users) {
      return users[0]._id === loggedIn._id ? users[1] : users[0];
    },
    async fetchMsgs() {
      if (!this.$store.getters.selectedChat) return;
      this.isLoading = true;
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${this.$store.getters.user.token}`,
          },
        };

        const { data } = await this.$axios.get(
          `api/message/${this.$store.getters.selectedChat._id}`,

          config
        );

        this.messages = data;

        this.isLoading = false;
        this.scrollToBottom(0);
        this.socket.emit("joinChat", this.$store.getters.selectedChat._id);
      } catch (error) {
        console.log(error);
      }
    },
    async send() {
      this.socket.emit("stopTyping", this.$store.getters.selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${this.$store.getters.user.token}`,
          },
        };
        const message = this.message;
        this.message = "";

        const { data } = await this.$axios.post(
          `api/message`,
          {
            content: message,
            chatId: this.$store.getters.selectedChat._id,
          },
          config
        );

        this.socket.emit("newMsg", data);
        this.messages = [...this.messages, data];

        //To scroll a little more for new msg
        setTimeout(() => {
          this.scrollToBottom(250);
        }, 200);

        this.$store.commit("TOGGLE_UPDATE_CHATS");
      } catch (error) {
        console.log(error);
      }
    },
    typingHandler() {
      if (!this.socketConnected) return;

      if (!this.typing) {
        this.typing = true;
        this.socket.emit("typing", this.$store.getters.selectedChat._id);
      }

      let recentTypingTime = new Date().getTime();
      var typingTimeout = 3000;
      setTimeout(() => {
        var timeNow = new Date().getTime();
        var timeDiff = timeNow - recentTypingTime;
        if (timeDiff >= typingTimeout && this.typing) {
          this.socket.emit("stopTyping", this.$store.getters.selectedChat._id);
          this.typing = false;
        }
      }, typingTimeout);
    },
    scrollToBottom(addScroll) {
      const el = this.$refs.scrollMe;

      el.scrollTop = el.scrollHeight - el.clientHeight + addScroll;
    },
  },
};
</script>
<style scoped>
.chatBox {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.chatBoxHeader {
  display: flex;
  width: 100%;
  height: fit-content;
  padding: 3px 5px;

  padding-bottom: 6px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #0014256b;
}
.eye:hover {
  background: #0014256b;
  transition: 300ms;
}
.chatName {
  font-size: 30px;
  font-weight: bold;
  padding: 0 20px;
}
.viewProfile {
  color: #ffffff;
  background: #001425;
  cursor: pointer;
  padding: 10px;
  border-radius: 010px;
  display: flex;
  align-items: center;
}
.viewProfile:hover {
  background: #001425b2;
  transition: 300ms;
  box-shadow: 0 0 2px #7facff, 0 0 4px #7facff, 0 0 3px #7facff, 0 0 5px #7facff;
}
.backBtn {
  color: #ffffff;
  background: #001425;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  display: flex;
  align-items: center;
}

.messagesWindow {
  flex-grow: 2;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  background: rgb(10, 49, 82);
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 90%;
}
.messagesContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}
.typing {
  position: absolute;
  bottom: 0;
  left: 0;
}

.messages {
  width: 100%;
  max-height: 92%;
}
.messageInput {
  justify-self: flex-end;
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.searchHeader {
  display: flex;
  width: 100%;
  padding: 0 5px;
  justify-content: space-between;
  align-items: center;
  min-height: fit-content;
  height: 60px;
}
.searchbar {
  background: #001425;
  border: none;
  padding: 10px 20px;
  color: #ffffff;
  font-size: 14px;
  outline: none;
  border-radius: 5px;
  transition: all 300ms ease-in-out;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  flex-grow: 1;
  margin-right: 10px;
  display: flex;
  align-items: center;
}
.searchbar input {
  outline: none;
  border: none;
  background: transparent;
  flex-grow: 1;
  padding: 0 10px;
  font-size: 14px;
  font-weight: bold;
}
</style>
