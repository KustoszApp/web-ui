import axios from "axios";
import router from "../../router";

import {
    GET_HAS_TOKEN,
    MUTATION_SET_TOKEN,
    MUTATION_REMOVE_TOKEN,
    MUTATION_AUTH_LOGIN_REQUEST,
    MUTATION_AUTH_LOGIN_SUCCESS,
    MUTATION_AUTH_LOGIN_ERROR,
    ACTION_AUTH_LOGIN,
    ACTION_AUTH_LOGOUT,
    ACTION_CHECK_TOKEN,
} from "../../types";

const TOKEN_STORAGE_KEY = "token";

const state = {
    status: "",
    token: null,
};

const getters = {
    [GET_HAS_TOKEN]: (state) => !!state.token,
};

const mutations = {
    [MUTATION_SET_TOKEN]: (state, token) => {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        axios.defaults.headers.common["Authorization"] = `Token ${token}`;
        state.token = token;
    },
    [MUTATION_REMOVE_TOKEN]: (state) => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        delete axios.defaults.headers.common["Authorization"];
        state.token = null;
    },
    [MUTATION_AUTH_LOGIN_REQUEST]: (state) => (state.status = "loading"),
    [MUTATION_AUTH_LOGIN_SUCCESS]: (state) => {
        state.status = "success";
    },
    [MUTATION_AUTH_LOGIN_ERROR]: (state) => (state.status = "error"),
};

const actions = {
    [ACTION_CHECK_TOKEN]: ({ commit }) => {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (token) {
            commit(MUTATION_SET_TOKEN, token);
        }
        return !!token;
    },
    [ACTION_AUTH_LOGIN]: ({ commit }, param) => {
        commit(MUTATION_REMOVE_TOKEN);
        commit(MUTATION_AUTH_LOGIN_REQUEST);
        const url = "/users/login";
        const data = {
            username: param.username,
            password: param.password,
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
                commit(MUTATION_SET_TOKEN, response.data.token);
                commit(MUTATION_AUTH_LOGIN_SUCCESS);
            })
            .then(() => {
                router.push({ path: "/" });
            })
            .catch(() => {
                commit(MUTATION_AUTH_LOGIN_ERROR);
            });
    },
    [ACTION_AUTH_LOGOUT]: ({ commit }) => {
        commit(MUTATION_REMOVE_TOKEN);
        router.push({ path: "/" });
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
