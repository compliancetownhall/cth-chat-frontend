<template>
  <div
    :class="[
      'chatHead',
      { active: $store.getters.selectedChat?._id === chat._id },
    ]"
  > 
  <img
      :src="chat.isGroupChat ? groupIcon : getSenderAvatar"
      alt=""
      class="avatar"
      width="40"
      height="40"
    />
  <div class="chatHeadContainer">
    
    <h3 class="chatName">
      {{
        !chat.isGroupChat
          ? getSender($store.getters.user, chat.users)
          : chat.chatName
      }}
    </h3>
    <h6>
      {{ chat.latestMessage ? chat.latestMessage.content : "Start a conversation..."}}
      <span class="time">{{ getMsgDate }}</span>
    </h6>
  </div>
  </div>
</template>
<script>
import {groupIconURL} from "../constants"

export default {
  props: {
    chat: {
      type: Object,
    },
  },
  data() {
    return {
      groupIcon : groupIconURL
    }
  },
  methods: {
    getSender(loggedIn, users) {
      return users[0]._id === loggedIn._id ? users[1].name : users[0].name;
    }
  },
  computed: {
    getSenderAvatar(){
      return this.chat.users[0]._id === this.$store.getters.user._id ? this.chat.users[1].avatar : this.chat.users[0].avatar;
    },
    getMsgDate(){
      return this.chat?.latestMessage ? new Date(this.chat?.latestMessage?.createdAt).toLocaleString('en-US', {year:'numeric', month:'short',day : 'numeric'}) + ' ' + new Date(this.chat?.latestMessage?.createdAt).toLocaleTimeString('en-US',{hour : 'numeric', minute:'2-digit' }) : '' ;
    }
  },
};
</script>
<style scoped>
.chatHead {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 10px;
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid #0014256b;
  cursor: pointer;
  margin-bottom: 5px;
  border-radius: 10px;
  transition: 300ms;
  gap: 1rem;
}
.chatHeadContainer{
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
}

.chatHeadContainer h6{
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.chatHead:hover,
.active {
  background: #0014256b;
  transition: 300ms;
}
.avatar {
  border-radius: 50%;
  object-fit: cover;
  min-width: 40px;
}
.time{
  font-size: 8px;
  font-weight: 100;
  padding-right: 5px;
}
</style>
