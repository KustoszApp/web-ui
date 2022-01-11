import axios from "axios";

const state = {
    status: "",
    user: {},
};

const getters = {
    user: (state) => state.user,
};

const mutations = {
    user_data_request: (state) => (state.status = "loading"),
    user_data_success: (state, data) => {
        state.status = "success";
        state.user = data;
    },
    user_data_error: (state) => (state.status = "error"),
};

const actions = {
    user_data_request: ({ commit }) => {
        return axios
            .get("/users/me")
            .then((response) => {
                commit("user_data_success", response.data);
            })
            .catch(() => {
                commit("user_data_error");
                return Promise.reject();
            });
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
