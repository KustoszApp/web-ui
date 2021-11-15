import axios from "axios";

const state = {
    status: "",
    entries: [],
    entry: [],
    entryTags: [],
};

const getters = {
    entries: (state) => state.entries,
    entry: (state) => state.entry,
    entryTags: (state) => state.entryTags,
    status: (state) => state.status,
};

const mutations = {
    entries_request: (state) => (state.status = "loading"),
    entries_success: (state, data) => {
        state.status = "success";
        state.entries = data.results.map((item) => {
            return { ...item, isFocused: false, isOpened: false };
        });
    },
    entries_error: (state) => (state.status = "error"),
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
    entries_request: ({ commit }, param) => {
        commit("entries_request");
        const base = "entries/";
        const url = param && param.query ? `${base}?${param.query}` : base;
        axios
            .get(url)
            .then((response) => {
                commit("entries_success", response.data);
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