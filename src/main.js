import { createApp } from "vue";
import axios from "axios";
import KustoszUI from "./KustoszUI.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

let baseURL = window.kustoszBackendURL;
if (process.env.NODE_ENV === "development") {
    baseURL = process.env.KUSTOSZ_BACKEND_URL || "http://127.0.0.1:8000/api/v1";
}
axios.defaults.baseURL = baseURL;

createApp(KustoszUI).use(store).use(router).mount("#kustosz");
