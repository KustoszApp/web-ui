import { createStore } from "vuex";

import auth from "./modules/auth";
import autodetect from "./modules/autodetect";
import channels from "./modules/channels";
import data_export from "./modules/data_export";
import entries from "./modules/entries";
import filters from "./modules/filters";
import maintenance from "./modules/maintenance";
import user from "./modules/user";
import views from "./modules/views";

export default createStore({
    modules: {
        auth,
        autodetect,
        channels,
        data_export,
        entries,
        filters,
        maintenance,
        user,
        views,
    },
});
