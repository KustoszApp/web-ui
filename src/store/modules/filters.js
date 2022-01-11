import axios from "axios";
import qs from "qs";

import {
    GET_TRY_FILTER_STATUS,
    GET_TRY_FILTER_ENTRIES_ALL_COUNT,
    GET_TRY_FILTER_ENTRIES,
    GET_FILTERS,
    GET_CURRENT_FILTER,
    MUTATION_FILTERS_REQUEST,
    MUTATION_FILTERS_SUCCESS,
    MUTATION_FILTERS_ERROR,
    MUTATION_FILTER_CREATE_REQUEST,
    MUTATION_FILTER_CREATE_SUCCESS,
    MUTATION_FILTER_CREATE_ERROR,
    MUTATION_FILTER_EDIT_REQUEST,
    MUTATION_FILTER_EDIT_SUCCESS,
    MUTATION_FILTER_EDIT_ERROR,
    MUTATION_FILTER_DELETE_REQUEST,
    MUTATION_FILTER_DELETE_SUCCESS,
    MUTATION_FILTER_DELETE_ERROR,
    MUTATION_FILTER_TRY_DATA_RESET,
    MUTATION_FILTER_TRY_REQUEST,
    MUTATION_FILTER_TRY_SUCCESS,
    MUTATION_FILTER_TRY_ERROR,
    ACTION_FILTERS_REQUEST,
    ACTION_FILTER_CREATE_REQUEST,
    ACTION_FILTER_EDIT_REQUEST,
    ACTION_FILTER_DELETE_REQUEST,
    ACTION_FILTER_TRY_DATA_RESET,
    ACTION_FILTER_TRY_REQUEST,
} from "../../types";

const state = {
    status: "",
    tryFilterStatus: "",
    tryFilterEntriesAllCount: 0,
    tryFilterEntries: [],
    filters: [],
    currentFilter: {},
};

const getters = {
    [GET_TRY_FILTER_STATUS]: (state) => state.tryFilterStatus,
    [GET_TRY_FILTER_ENTRIES_ALL_COUNT]: (state) =>
        state.tryFilterEntriesAllCount,
    [GET_TRY_FILTER_ENTRIES]: (state) => state.tryFilterEntries,
    [GET_FILTERS]: (state) => state.filters,
    [GET_CURRENT_FILTER]: (state) => state.currentFilter,
};

const mutations = {
    [MUTATION_FILTERS_REQUEST]: (state) => (state.status = "loading"),
    [MUTATION_FILTERS_SUCCESS]: (state, data) => {
        state.status = "success";
        state.filters = data.results;
    },
    [MUTATION_FILTERS_ERROR]: (state) => (state.status = "error"),

    [MUTATION_FILTER_CREATE_REQUEST]: (state) => (state.status = "loading"),
    [MUTATION_FILTER_CREATE_SUCCESS]: (state, data) => {
        state.status = "success";
        state.filters.push(data);
    },
    [MUTATION_FILTER_CREATE_ERROR]: (state) => (state.status = "error"),

    [MUTATION_FILTER_EDIT_REQUEST]: (state) => (state.status = "loading"),
    [MUTATION_FILTER_EDIT_SUCCESS]: (state, data) => {
        state.status = "success";
        state.filters.forEach((item, idx) => {
            if (item.id === data.id) {
                state.filters[idx] = data;
            }
        });
    },
    [MUTATION_FILTER_EDIT_ERROR]: (state) => (state.status = "error"),

    [MUTATION_FILTER_DELETE_REQUEST]: (state) => (state.status = "loading"),
    [MUTATION_FILTER_DELETE_SUCCESS]: (state, data) => {
        state.status = "success";
        state.filters = state.filters.filter((filter) => filter.id !== data.id);
    },
    [MUTATION_FILTER_DELETE_ERROR]: (state) => (state.status = "error"),

    [MUTATION_FILTER_TRY_DATA_RESET]: (state) => {
        state.tryFilterStatus = "";
        state.tryFilterEntriesAllCount = 0;
        state.tryFilterEntries = [];
    },
    [MUTATION_FILTER_TRY_REQUEST]: (state) =>
        (state.tryFilterStatus = "loading"),
    [MUTATION_FILTER_TRY_SUCCESS]: (state, data) => {
        state.tryFilterStatus = "success";
        state.tryFilterEntries = data.results.map((item) => {
            item.preferred_content = undefined;
            return item;
        });
        state.tryFilterEntriesAllCount = data.count;
    },
    [MUTATION_FILTER_TRY_ERROR]: (state) => (state.tryFilterStatus = "error"),
};

const actions = {
    [ACTION_FILTERS_REQUEST]: ({ commit }) => {
        commit(MUTATION_FILTERS_REQUEST);
        axios
            .get("filters/")
            .then((response) => {
                commit(MUTATION_FILTERS_SUCCESS, response.data);
            })
            .catch(() => {
                commit(MUTATION_FILTERS_ERROR);
            });
    },
    [ACTION_FILTER_CREATE_REQUEST]: ({ commit }, param) => {
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
                commit(MUTATION_FILTER_CREATE_SUCCESS, response.data);
            })
            .catch(() => {
                commit(MUTATION_FILTER_CREATE_ERROR);
            });
    },
    [ACTION_FILTER_EDIT_REQUEST]: ({ commit }, param) => {
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
                commit(MUTATION_FILTER_EDIT_SUCCESS, response.data);
            })
            .catch(() => {
                commit(MUTATION_FILTER_EDIT_ERROR);
            });
    },
    [ACTION_FILTER_DELETE_REQUEST]: ({ commit }, param) => {
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
                commit(MUTATION_FILTER_DELETE_SUCCESS, param);
            })
            .catch(() => {
                commit(MUTATION_FILTER_DELETE_ERROR);
            });
    },
    [ACTION_FILTER_TRY_DATA_RESET]: ({ commit }) => {
        commit(MUTATION_FILTER_TRY_DATA_RESET);
    },
    [ACTION_FILTER_TRY_REQUEST]: ({ commit }, param) => {
        commit(MUTATION_FILTER_TRY_REQUEST);
        const url = `entries/`;
        let params = qs.parse(param.condition);
        params["limit"] = 10;
        axios
            .get(url, {
                params: params,
            })
            .then((response) => {
                commit(MUTATION_FILTER_TRY_SUCCESS, response.data);
            })
            .catch(() => {
                commit(MUTATION_FILTER_TRY_ERROR);
            });
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
