import axios from "axios";
import router from "../../router";

const TOKEN_STORAGE_KEY = "token";

const state = {
    status: "",
    token: null,
};

const getters = {
    hasToken: (state) => !!state.token,
};

const mutations = {
    set_token: (state, token) => {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        axios.defaults.headers.common["Authorization"] = `Token ${token}`;
        state.token = token;
    },
    remove_token: (state) => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        delete axios.defaults.headers.common["Authorization"];
        state.token = null;
    },
    auth_login_request: (state) => (state.status = "loading"),
    auth_login_success: (state) => {
        state.status = "success";
    },
    auth_login_error: (state) => (state.status = "error"),
};

const actions = {
    check_token: ({ commit }) => {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (token) {
            commit("set_token", token);
        }
        return !!token;
    },
    auth_login: ({ commit }, param) => {
        commit("remove_token");
        commit("auth_login_request");
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
                commit("set_token", response.data.token);
                commit("auth_login_success");
            })
            .then(() => {
                router.push({ path: "/" });
            })
            .catch(() => {
                commit("auth_login_error");
            });
    },
    auth_logout: ({ commit }) => {
        commit("remove_token");
        router.push({ path: "/" });
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
