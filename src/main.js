import { createApp } from "vue";
import axios from "axios";
import KustoszUI from "./KustoszUI.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

axios.defaults.baseURL = window.kustoszBackendURL;

createApp(KustoszUI).use(store).use(router).mount("#kustosz");
