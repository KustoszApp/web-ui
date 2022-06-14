import { createApp } from "vue";
import axios from "axios";
import KustoszUI from "./KustoszUI.vue";
import { repeatAsyncRequestWhileInProgress } from "./utils";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

let baseURL = window.kustoszBackendURL;
if (process.env.NODE_ENV === "development") {
    baseURL =
        process.env.VUE_APP_KUSTOSZ_BACKEND_URL ||
        "http://127.0.0.1:8000/api/v1";
}
axios.defaults.baseURL = baseURL;
axios.interceptors.response.use(repeatAsyncRequestWhileInProgress, null);

createApp(KustoszUI).use(store).use(router).mount("#kustosz");
