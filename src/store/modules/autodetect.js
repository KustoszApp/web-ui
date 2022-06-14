import axios from "axios";

import {
    GET_AUTODETECT_STATE,
    GET_AUTODETECTED_CHANNELS,
    GET_AUTODETECTED_ENTRIES,
    MUTATION_AUTODETECT_REQUEST,
    MUTATION_AUTODETECT_SUCCESS,
    MUTATION_AUTODETECT_ERROR,
    MUTATION_AUTODETECT_RESET,
    ACTION_AUTODETECT_REQUEST,
    ACTION_AUTODETECT_RESET,
} from "../../types";

const state = {
    status: "",
    autodetectState: "",
    autodetectedChannels: [],
    autodetectedEntries: [],
};

const getters = {
    [GET_AUTODETECT_STATE]: (state) => state.autodetectState,
    [GET_AUTODETECTED_CHANNELS]: (state) => state.autodetectedChannels,
    [GET_AUTODETECTED_ENTRIES]: (state) => state.autodetectedEntries,
};

const mutations = {
    [MUTATION_AUTODETECT_REQUEST]: (state) => {
        state.status = "loading";
        state.autodetectState = "in_progress";
    },
    [MUTATION_AUTODETECT_SUCCESS]: (state, data) => {
        state.status = "success";
        state.autodetectState = data.state;
        state.autodetectedChannels = data.channels;
        state.autodetectedEntries = data.entries;
    },
    [MUTATION_AUTODETECT_ERROR]: (state) => (state.status = "error"),
    [MUTATION_AUTODETECT_RESET]: (state) => {
        state.autodetectState = "";
        state.autodetectedChannels = [];
        state.autodetectedEntries = [];
    },
};

const actions = {
    [ACTION_AUTODETECT_REQUEST]: ({ commit }, param) => {
        commit(MUTATION_AUTODETECT_REQUEST);
        const url = "autodetect_add";
        const data = {
            url: param.url,
        };
        const options = {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        };
        return axios
            .post(url, data, options)
            .then((response) => {
                commit(MUTATION_AUTODETECT_SUCCESS, response.data);
            })
            .catch(() => {
                commit(MUTATION_AUTODETECT_ERROR);
            });
    },
    [ACTION_AUTODETECT_RESET]: ({ commit }) => {
        commit(MUTATION_AUTODETECT_RESET);
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
