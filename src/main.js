import { createApp } from "vue";
import axios from "axios";
import KustoszUI from "./KustoszUI.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

axios.defaults.baseURL = "http://127.0.0.1:8000/api/v1/";

createApp(KustoszUI).use(store).use(router).mount("#kustosz");
