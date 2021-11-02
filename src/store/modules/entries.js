const state = {
    status: "",
    entries: [],
    entry: [],
};

const getters = {
    entries: (state) => state.entries,
    entry: (state) => state.entry,
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
};

const actions = {
    entries_request: ({ commit }, param) => {
        const base = "http://127.0.0.1:8000/api/v1/entries/";
        const url = param && param.query ? `${base}?${param.query}` : base;
        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                commit("entries_success", data);
            })
            .catch(() => {
                commit("entries_error");
            });
    },
    entry_request: ({ commit }, param) => {
        const url = `http://127.0.0.1:8000/api/v1/entries/${param.id}/`;
        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                commit("entry_success", data);
            })
            .catch(() => {
                commit("entry_error");
            });
    },
    entry_archived_request: ({ commit }, param) => {
        const url = `http://127.0.0.1:8000/api/v1/entries/${param.id}/`;
        const data = { archived: param.archived };
        fetch(url, {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                commit("entry_success", data);
            })
            .catch(() => {
                commit("entry_error");
            });
    },
    channel_edit_request: ({ commit }, param) => {
        const url = `http://127.0.0.1:8000/api/v1/channels/${param.channel_id}/`;
        const data = {
            active: param.active,
            deduplication_enabled: param.deduplication_enabled,
            title: param.title,
            update_frequency: param.update_frequency,
        };
        fetch(url, {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                commit("channel_edit_success", data);
            })
            .catch(() => {
                commit("channel_edit_error");
            });
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
