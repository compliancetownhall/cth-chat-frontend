<template>
  <button
    class="btn"
    :style="[leave ? { background: 'rgb(170, 0, 0)', padding: '8px 4px' } : {}]"
  >
    <span>{{ text }}</span>

    <TeamOutlined v-if="group" />
    <EditFilled v-else-if="edit" />
    <LogoutOutlined v-else-if="leave" :style="{ fontSize: '25px' }" />
    <ArrowRightOutlined v-else />
  </button>
</template>
<script>
import {
  ArrowRightOutlined,
  TeamOutlined,
  EditFilled,
  LogoutOutlined,
} from "@ant-design/icons-vue";
export default {
  props: {
    text: {
      type: String,
      default: "Next",
    },
    group: {
      type: Boolean,
      default: false,
    },
    edit: {
      type: Boolean,
      default: false,
    },
    leave: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ArrowRightOutlined,
    TeamOutlined,
    EditFilled,
    LogoutOutlined,
  },
};
</script>
<style scoped>
.btn {
  background: #0077ff;
  padding: 8px 12px;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 15px auto;
  font-size: 14px;
  font-weight: bold;
  border-radius: 40px;
  color: #fff;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 200ms ease-in-out;
}

.btn:hover {
  /* background: #004da5; */
  background: #092b46;
  box-shadow: 0 0 2px #7facff, 0 0 4px #7facff, 0 0 6px #7facff, 0 0 8px #7facff;
}

span {
  margin-right: 5px;
}
</style>
