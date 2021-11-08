import axios from "axios";

const state = {
    status: "",
    filters: [],
    currentFilter: {},
};

const getters = {
    filters: (state) => state.filters,
    currentFilter: (state) => state.currentFilter,
};

const mutations = {
    filters_request: (state) => (state.status = "loading"),
    filters_success: (state, data) => {
        state.status = "success";
        state.filters = data.results;
    },
    filters_error: (state) => (state.status = "error"),

    filter_create_request: (state) => (state.status = "loading"),
    filter_create_success: (state, data) => {
        state.status = "success";
        state.filters.push(data);
    },
    filter_create_error: (state) => (state.status = "error"),

    filter_edit_request: (state) => (state.status = "loading"),
    filter_edit_success: (state, data) => {
        state.status = "success";
        state.filters.forEach((item, idx) => {
            if (item.id === data.id) {
                state.filters[idx] = data;
            }
        });
    },
    filter_edit_error: (state) => (state.status = "error"),

    filter_delete_request: (state) => (state.status = "loading"),
    filter_delete_success: (state, data) => {
        state.status = "success";
        state.filters = state.filters.filter((filter) => filter.id !== data.id);
    },
    filter_delete_error: (state) => (state.status = "error"),
};

const actions = {
    filters_request: ({ commit }) => {
        commit("filters_request");
        axios
            .get("filters/")
            .then((response) => {
                commit("filters_success", response.data);
            })
            .catch(() => {
                commit("filters_error");
            });
    },
    filter_create_request: ({ commit }, param) => {
        const url = "filters/";
        const data = {
            enabled: param.enabled,
            name: param.name,
            condition: param.condition,
            action_name: param.action_name,
            action_argument: param.action_argument,
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
                commit("filter_create_success", response.data);
            })
            .catch(() => {
                commit("filter_create_error");
            });
    },
    filter_edit_request: ({ commit }, param) => {
        const url = `filters/${param.id}/`;
        const data = {
            enabled: param.enabled,
            name: param.name,
            condition: param.condition,
            action_name: param.action_name,
            action_argument: param.action_argument,
        };
        const options = {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        };
        return axios
            .patch(url, data, options)
            .then((response) => {
                commit("filter_edit_success", response.data);
            })
            .catch(() => {
                commit("filter_edit_error");
            });
    },
    filter_delete_request: ({ commit }, param) => {
        const url = `filters/${param.id}/`;
        const options = {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        };
        return axios
            .delete(url, options)
            .then(() => {
                commit("filter_delete_success", param);
            })
            .catch(() => {
                commit("filter_delete_error");
            });
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
