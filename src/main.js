import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import store from "./store";

axios.defaults.baseURL = "https://compliancetownhall-chat.onrender.com/";

const app = createApp(App);

app.config.globalProperties.$axios = axios;
app.use(router);
app.use(store);
app.mount("#app");
