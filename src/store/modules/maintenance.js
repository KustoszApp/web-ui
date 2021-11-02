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
        const base = "http://127.0.0.1:8000/api/v1/channels/?limit=200";
        const url = param && param.query ? `${base}&${param.query}` : base;
        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                commit("maintenance_channels_success", data);
            })
            .catch(() => {
                commit("maintenance_channels_error");
            });
    },
    maintenance_channels_inactivate_request: ({ commit }, param) => {
        const base = "http://127.0.0.1:8000/api/v1/channels/inactivate";
        const url = param && param.query ? `${base}?${param.query}` : base;
        fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                return response.json();
            })
            .then(() => {
                commit("maintenance_channels_change_success");
            })
            .catch(() => {
                commit("maintenance_channels_error");
            });
    },
    maintenance_channels_activate_request: ({ commit }, param) => {
        const base = "http://127.0.0.1:8000/api/v1/channels/activate";
        const url = param && param.query ? `${base}?${param.query}` : base;
        fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                return response.json();
            })
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
