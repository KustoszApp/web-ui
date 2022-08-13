import axios from "axios";

import { ACTION_EXPORT_GET_OTT_REQUEST } from "../../types";

const state = {};

const getters = {};

const mutations = {};

const actions = {
    [ACTION_EXPORT_GET_OTT_REQUEST]: () => {
        const url = "/export/ott";
        const options = {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        };

        return axios.get(url, options).then((response) => {
            return response.data.token;
        });
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
