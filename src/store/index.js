import { createStore } from "vuex";

import channels from "./modules/channels";
import entries from "./modules/entries";
import filters from "./modules/filters";
import maintenance from "./modules/maintenance";

export default createStore({
    modules: {
        channels,
        entries,
        filters,
        maintenance,
    },
});
