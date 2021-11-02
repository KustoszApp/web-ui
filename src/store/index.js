import { createStore } from "vuex";

import channels from "./modules/channels";
import entries from "./modules/entries";
import maintenance from "./modules/maintenance";

export default createStore({
    modules: {
        channels,
        entries,
        maintenance,
    },
});
