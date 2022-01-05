import axios from "axios";
import { omit } from "../../utils";

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
    entries: (state) => state.entries,
    entriesRequestParams: (state) => state.entriesRequestParams,
    entriesNextPage: (state) => state.entriesNextPage,
    entriesAllCount: (state) => state.entriesAllCount,
    entry: (state) => state.entry,
    entryTags: (state) => state.entryTags,
    status: (state) => state.status,
};

const mutations = {
    set_entries_request_params: (state, data) => {
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
    entries_request: (state) => (state.status = "loading"),
    entries_success: (state, payload) => {
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
    entries_error: (state) => (state.status = "error"),
    entries_mark_as_read_success: (state) => (state.status = "success"),
    entry_request: (state) => (state.status = "loading"),
    entry_success: (state, data) => {
        state.status = "success";
        state.entry = data;
    },
    entry_error: (state) => (state.status = "error"),
    entry_tags_request: (state) => (state.status = "loading"),
    entry_tags_success: (state, data) => {
        state.status = "success";
        state.entryTags = data.results;
    },
};

const actions = {
    entries_request: ({ commit, state }, param) => {
        commit("entries_request");
        commit("set_entries_request_params", omit(param, ["type"]));
        const url = "entries/";
        axios
            .get(url, {
                params: state.entriesRequestParams,
            })
            .then((response) => {
                commit("entries_success", {
                    context: "initial_page",
                    data: response.data,
                });
            })
            .catch(() => {
                commit("entries_error");
            });
    },
    entries_next_page_request: ({ commit, state }) => {
        if (state.entriesNextPage === null) {
            return;
        }
        commit("entry_request");
        axios
            .get(state.entriesNextPage)
            .then((response) => {
                commit("entries_success", {
                    context: "next_page",
                    data: response.data,
                });
            })
            .catch(() => {
                commit("entries_error");
            });
    },
    entries_mark_as_read: ({ dispatch, commit, state }) => {
        commit("entries_request");
        const url = "entries/archive";
        return axios
            .post(url, null, {
                params: state.entriesRequestParams,
            })
            .then(() => {
                commit("entries_mark_as_read_success");
                return dispatch("channels_request").then(() => {
                    return dispatch("entries_request");
                });
            })
            .catch(() => {
                commit("entries_error");
            });
    },
    entry_request: ({ commit }, param) => {
        const url = `entries/${param.id}/`;
        return axios
            .get(url)
            .then((response) => {
                commit("entry_success", response.data);
            })
            .catch(() => {
                commit("entry_error");
            });
    },
    entry_edit_request: ({ commit }, param) => {
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
                commit("entry_success", response.data);
            })
            .catch(() => {
                commit("entry_error");
            });
    },
    entry_tags_request: ({ commit }) => {
        axios
            .get("tags/entry")
            .then((response) => {
                commit("entry_tags_success", response.data);
            })
            .catch(() => {
                commit("entry_error");
            });
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
