import axios from "axios";
import { omit } from "../../utils";

import {
    GET_USER,
    MUTATION_CLEAR_USER_DATA,
    MUTATION_USER_DATA_REQUEST,
    MUTATION_USER_DATA_SUCCESS,
    MUTATION_USER_DATA_ERROR,
    MUTATION_USER_DATA_EDIT_REQUEST,
    MUTATION_USER_DATA_EDIT_SUCCESS,
    MUTATION_USER_DATA_EDIT_ERROR,
    ACTION_USER_DATA_REQUEST,
    ACTION_USER_DATA_EDIT_REQUEST,
} from "../../types";

const state = {
    status: "",
    user: {},
};

const getters = {
    [GET_USER]: (state) => state.user,
};

const mutations = {
    [MUTATION_CLEAR_USER_DATA]: (state) => (state.user = {}),
    [MUTATION_USER_DATA_REQUEST]: (state) => (state.status = "loading"),
    [MUTATION_USER_DATA_SUCCESS]: (state, data) => {
        state.status = "success";
        state.user = data;
    },
    [MUTATION_USER_DATA_ERROR]: (state) => (state.status = "error"),
    [MUTATION_USER_DATA_EDIT_REQUEST]: (state) => (state.status = "loading"),
    [MUTATION_USER_DATA_EDIT_SUCCESS]: (state, data) => {
        state.status = "success";
        state.user = data;
    },
    [MUTATION_USER_DATA_EDIT_ERROR]: (state) => (state.status = "error"),
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
    [ACTION_USER_DATA_EDIT_REQUEST]: ({ commit }, param) => {
        const url = "/users/me";
        const data = omit(param, ["type"]);
        const options = {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        };
        return axios
            .patch(url, data, options)
            .then((response) => {
                commit(MUTATION_USER_DATA_EDIT_SUCCESS, response.data);
            })
            .catch(() => {
                commit(MUTATION_USER_DATA_ERROR);
            });
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
