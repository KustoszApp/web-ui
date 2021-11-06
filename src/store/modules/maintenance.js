import axios from "axios";

const state = {
    status: "",
    maintenance_channels: [],
};

const getters = {
    maintenance_channels: (state) => state.maintenance_channels,
};

const mutations = {
    maintenance_channels_request: (state) => (state.status = "loading"),
    maintenance_channels_success: (state, data) => {
        state.status = "success";
        state.maintenance_channels = data.results;
    },
    maintenance_channels_error: (state) => (state.status = "error"),
    maintenance_channels_change_success: (state) => (state.status = "success"),
};

const actions = {
    maintenance_channels_get_request: ({ commit }, param) => {
        const base = "channels/?limit=200";
        const url = param && param.query ? `${base}&${param.query}` : base;
        axios
            .get(url)
            .then((response) => {
                commit("maintenance_channels_success", response.data);
            })
            .catch(() => {
                commit("maintenance_channels_error");
            });
    },
    maintenance_channels_inactivate_request: ({ commit }, param) => {
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
                commit("maintenance_channels_change_success");
            })
            .catch(() => {
                commit("maintenance_channels_error");
            });
    },
    maintenance_channels_activate_request: ({ commit }, param) => {
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
                commit("maintenance_channels_change_success");
            })
            .catch(() => {
                commit("maintenance_channels_error");
            });
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
