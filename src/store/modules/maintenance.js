import axios from "axios";

import {
    GET_MAINTENANCE_CHANNELS,
    MUTATION_MAINTENANCE_CHANNELS_REQUEST,
    MUTATION_MAINTENANCE_CHANNELS_SUCCESS,
    MUTATION_MAINTENANCE_CHANNELS_ERROR,
    MUTATION_MAINTENANCE_CHANNELS_CHANGE_SUCCESS,
    ACTION_MAINTENANCE_CHANNELS_GET_REQUEST,
    ACTION_MAINTENANCE_CHANNELS_INACTIVATE_REQUEST,
    ACTION_MAINTENANCE_CHANNELS_ACTIVATE_REQUEST,
} from "../../types";

const state = {
    status: "",
    maintenance_channels: [],
};

const getters = {
    [GET_MAINTENANCE_CHANNELS]: (state) => state.maintenance_channels,
};

const mutations = {
    [MUTATION_MAINTENANCE_CHANNELS_REQUEST]: (state) =>
        (state.status = "loading"),
    [MUTATION_MAINTENANCE_CHANNELS_SUCCESS]: (state, data) => {
        state.status = "success";
        state.maintenance_channels = data.results;
    },
    [MUTATION_MAINTENANCE_CHANNELS_ERROR]: (state) => (state.status = "error"),
    [MUTATION_MAINTENANCE_CHANNELS_CHANGE_SUCCESS]: (state) =>
        (state.status = "success"),
};

const actions = {
    [ACTION_MAINTENANCE_CHANNELS_GET_REQUEST]: ({ commit }, param) => {
        const base = "channels/?limit=200";
        const url = param && param.query ? `${base}&${param.query}` : base;
        axios
            .get(url)
            .then((response) => {
                commit(MUTATION_MAINTENANCE_CHANNELS_SUCCESS, response.data);
            })
            .catch(() => {
                commit(MUTATION_MAINTENANCE_CHANNELS_ERROR);
            });
    },
    [ACTION_MAINTENANCE_CHANNELS_INACTIVATE_REQUEST]: ({ commit }, param) => {
        const base = "channels/inactivate";
        const url = param && param.query ? `${base}?${param.query}` : base;
        const options = {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        };
        axios
            .post(url, options)
            .then((response) => response)
            .then(() => {
                commit(MUTATION_MAINTENANCE_CHANNELS_CHANGE_SUCCESS);
            })
            .catch(() => {
                commit(MUTATION_MAINTENANCE_CHANNELS_ERROR);
            });
    },
    [ACTION_MAINTENANCE_CHANNELS_ACTIVATE_REQUEST]: ({ commit }, param) => {
        const base = "channels/activate";
        const url = param && param.query ? `${base}?${param.query}` : base;
        const options = {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        };
        axios
            .post(url, options)
            .then((response) => response)
            .then(() => {
                commit(MUTATION_MAINTENANCE_CHANNELS_CHANGE_SUCCESS);
            })
            .catch(() => {
                commit(MUTATION_MAINTENANCE_CHANNELS_ERROR);
            });
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
