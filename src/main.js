import { createApp } from "vue";
import axios from "axios";
import "normalize.css";
import ReadOrganizerUI from "./ReadOrganizerUI.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

axios.defaults.baseURL = "http://127.0.0.1:8000/api/v1/";

createApp(ReadOrganizerUI).use(store).use(router).mount("#readorganizer");
