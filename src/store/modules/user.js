import axios from "axios";

import {
    GET_USER,
    MUTATION_USER_DATA_REQUEST,
    MUTATION_USER_DATA_SUCCESS,
    MUTATION_USER_DATA_ERROR,
    ACTION_USER_DATA_REQUEST,
} from "../../types";

const state = {
    status: "",
    user: {},
};

const getters = {
    [GET_USER]: (state) => state.user,
};

const mutations = {
    [MUTATION_USER_DATA_REQUEST]: (state) => (state.status = "loading"),
    [MUTATION_USER_DATA_SUCCESS]: (state, data) => {
        state.status = "success";
        state.user = data;
    },
    [MUTATION_USER_DATA_ERROR]: (state) => (state.status = "error"),
};

const actions = {
    [ACTION_USER_DATA_REQUEST]: ({ commit }) => {
        return axios
            .get("/users/me")
            .then((response) => {
                commit(MUTATION_USER_DATA_SUCCESS, response.data);
            })
            .catch(() => {
                commit(MUTATION_USER_DATA_ERROR);
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
