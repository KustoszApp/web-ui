import axios from "axios";
import { omit } from "../../utils";

import {
    GET_ENTRIES,
    GET_ENTRIES_REQUEST_PARAMS,
    GET_ENTRIES_NEXT_PAGE,
    GET_ENTRIES_ALL_COUNT,
    GET_ENTRY,
    GET_ENTRY_TAGS,
    GET_STATUS,
    MUTATION_SET_ENTRIES_REQUEST_PARAMS,
    MUTATION_ENTRIES_REQUEST,
    MUTATION_ENTRIES_SUCCESS,
    MUTATION_ENTRIES_ERROR,
    MUTATION_ENTRIES_MARK_AS_READ_SUCCESS,
    MUTATION_ENTRY_REQUEST,
    MUTATION_ENTRY_SUCCESS,
    MUTATION_ENTRY_ERROR,
    MUTATION_ENTRY_TAGS_REQUEST,
    MUTATION_ENTRY_TAGS_SUCCESS,
    ACTION_ENTRIES_REQUEST,
    ACTION_ENTRIES_NEXT_PAGE_REQUEST,
    ACTION_ENTRIES_MARK_AS_READ,
    ACTION_ENTRY_REQUEST,
    ACTION_ENTRY_EDIT_REQUEST,
    ACTION_ENTRY_TAGS_REQUEST,
    ACTION_CHANNELS_REQUEST,
} from "../../types";

const state = {
    status: "",
    entriesRequestParams: {
        archived: false,
    },
    entriesNextPage: "",
    entriesAllCount: 0,
    entries: [],
    entry: [],
    entryTags: [],
};

const getters = {
    [GET_ENTRIES]: (state) => state.entries,
    [GET_ENTRIES_REQUEST_PARAMS]: (state) => state.entriesRequestParams,
    [GET_ENTRIES_NEXT_PAGE]: (state) => state.entriesNextPage,
    [GET_ENTRIES_ALL_COUNT]: (state) => state.entriesAllCount,
    [GET_ENTRY]: (state) => state.entry,
    [GET_ENTRY_TAGS]: (state) => state.entryTags,
    [GET_STATUS]: (state) => state.status,
};

const mutations = {
    [MUTATION_SET_ENTRIES_REQUEST_PARAMS]: (state, data) => {
        const { setParamsAsIs, ...params } = data;
        let allRequestParams = {};
        if (setParamsAsIs) {
            allRequestParams = { ...params };
        } else {
            allRequestParams = { ...state.entriesRequestParams, ...params };
        }
        const newRequestParams = {};
        Object.keys(allRequestParams)
            .filter((key) => {
                const val = allRequestParams[key];
                return !(val === null || val === "");
            })
            .forEach((key) => {
                let val = allRequestParams[key];
                if (key === "archived") {
                    if (val === "true") {
                        val = true;
                    } else {
                        val = false;
                    }
                }
                newRequestParams[key] = val;
            });
        state.entriesRequestParams = newRequestParams;
    },
    [MUTATION_ENTRIES_REQUEST]: (state) => (state.status = "loading"),
    [MUTATION_ENTRIES_SUCCESS]: (state, payload) => {
        const context = payload.context;
        const data = payload.data;
        state.status = "success";
        const newEntries = data.results.map((item) => {
            return { ...item, isFocused: false, isOpened: false };
        });
        if (context === "initial_page") {
            state.entries = newEntries;
        } else {
            state.entries.push(...newEntries);
        }
        state.entriesNextPage = data.next;
        state.entriesAllCount = data.count;
    },
    [MUTATION_ENTRIES_ERROR]: (state) => (state.status = "error"),
    [MUTATION_ENTRIES_MARK_AS_READ_SUCCESS]: (state) =>
        (state.status = "success"),
    [MUTATION_ENTRY_REQUEST]: (state) => (state.status = "loading"),
    [MUTATION_ENTRY_SUCCESS]: (state, data) => {
        state.status = "success";
        state.entry = data;
    },
    [MUTATION_ENTRY_ERROR]: (state) => (state.status = "error"),
    [MUTATION_ENTRY_TAGS_REQUEST]: (state) => (state.status = "loading"),
    [MUTATION_ENTRY_TAGS_SUCCESS]: (state, data) => {
        state.status = "success";
        state.entryTags = data.results;
    },
};

const actions = {
    [ACTION_ENTRIES_REQUEST]: ({ commit, state }, param) => {
        commit(MUTATION_ENTRIES_REQUEST);
        commit(MUTATION_SET_ENTRIES_REQUEST_PARAMS, omit(param, ["type"]));
        const url = "entries/";
        axios
            .get(url, {
                params: state.entriesRequestParams,
            })
            .then((response) => {
                commit(MUTATION_ENTRIES_SUCCESS, {
                    context: "initial_page",
                    data: response.data,
                });
            })
            .catch(() => {
                commit(MUTATION_ENTRIES_ERROR);
            });
    },
    [ACTION_ENTRIES_NEXT_PAGE_REQUEST]: ({ commit, state }) => {
        if (state.entriesNextPage === null) {
            return;
        }
        commit(MUTATION_ENTRY_REQUEST);
        axios
            .get(state.entriesNextPage)
            .then((response) => {
                commit(MUTATION_ENTRIES_SUCCESS, {
                    context: "next_page",
                    data: response.data,
                });
            })
            .catch(() => {
                commit(MUTATION_ENTRIES_ERROR);
            });
    },
    [ACTION_ENTRIES_MARK_AS_READ]: ({ dispatch, commit, state }) => {
        commit(MUTATION_ENTRIES_REQUEST);
        const url = "entries/archive";
        return axios
            .post(url, null, {
                params: state.entriesRequestParams,
            })
            .then(() => {
                commit(MUTATION_ENTRIES_MARK_AS_READ_SUCCESS);
                return dispatch(ACTION_CHANNELS_REQUEST).then(() => {
                    return dispatch(ACTION_ENTRIES_REQUEST);
                });
            })
            .catch(() => {
                commit(MUTATION_ENTRIES_ERROR);
            });
    },
    [ACTION_ENTRY_REQUEST]: ({ commit }, param) => {
        const url = `entries/${param.id}/`;
        return axios
            .get(url)
            .then((response) => {
                commit(MUTATION_ENTRY_SUCCESS, response.data);
            })
            .catch(() => {
                commit(MUTATION_ENTRY_ERROR);
            });
    },
    [ACTION_ENTRY_EDIT_REQUEST]: ({ commit }, param) => {
        const url = `entries/${param.id}/`;
        let data = Object.entries(param).filter(
            ([key]) => !["id", "type"].includes(key)
        );
        data = Object.fromEntries(data);
        const options = {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        };
        return axios
            .patch(url, data, options)
            .then((response) => {
                commit(MUTATION_ENTRY_SUCCESS, response.data);
            })
            .catch(() => {
                commit(MUTATION_ENTRY_ERROR);
            });
    },
    [ACTION_ENTRY_TAGS_REQUEST]: ({ commit }) => {
        axios
            .get("tags/entry")
            .then((response) => {
                commit(MUTATION_ENTRY_TAGS_SUCCESS, response.data);
            })
            .catch(() => {
                commit(MUTATION_ENTRY_ERROR);
            });
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
