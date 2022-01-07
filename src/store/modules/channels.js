import axios from "axios";

const state = {
    status: "",
    channels: [],
    channelTags: [],
};

const getters = {
    channels: (state) => state.channels,
    channelTags: (state) => state.channelTags,
};

const mutations = {
    channels_request: (state) => (state.status = "loading"),
    channels_success: (state, data) => {
        state.status = "success";
        state.channels = data.results;
    },
    channels_error: (state) => (state.status = "error"),
    channel_create_request: (state) => (state.status = "loading"),
    channel_create_success: (state) => (state.status = "success"),
    channel_create_error: (state) => (state.status = "error"),
    channel_edit_success: (state, data) => {
        state.status = "success";
        state.channels.forEach((item, idx) => {
            if (item.id === data.id) {
                state.channels[idx] = data;
            }
        });
    },
    channel_tags_request: (state) => (state.status = "loading"),
    channel_tags_success: (state, data) => {
        state.status = "success";
        state.channelTags = data.results;
    },
    channel_unarchived_entries_change: (state, data) => {
        state.channels.forEach((item) => {
            if (item.id === data.channel_id) {
                if (data.unarchived_entries_count === "increase") {
                    item.unarchived_entries += 1;
                } else if (data.unarchived_entries_count === "decrease") {
                    item.unarchived_entries -= 1;
                }
                if (item.unarchived_entries < 0) {
                    item.unarchived_entries = 0;
                }
            }
        });
    },
};

const actions = {
    channels_request: ({ commit }) => {
        axios
            .get("channels/?limit=200")
            .then((response) => {
                commit("channels_success", response.data);
            })
            .catch(() => {
                commit("channels_error");
            });
    },
    channel_create_request: ({ dispatch, commit }, param) => {
        const url = "channels/";
        const data = {
            url: param.url,
            title: param.title,
            tags: param.tags,
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
                commit("channel_create_success", response.data);
            })
            .then(() => {
                dispatch("channel_tags_request");
                setTimeout(() => dispatch("channels_request"), 1000);
            })
            .catch(() => {
                commit("channel_create_error");
            });
    },
    channel_edit_request: ({ commit }, param) => {
        const url = `channels/${param.channel_id}/`;
        const data = {
            active: param.active,
            deduplication_enabled: param.deduplication_enabled,
            tags: param.tags,
            title: param.title,
            update_frequency: param.update_frequency,
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
                commit("channel_edit_success", response.data);
            })
            .catch(() => {
                commit("channel_edit_error");
            });
    },
    channel_tags_request: ({ commit }) => {
        axios
            .get("tags/channel")
            .then((response) => {
                commit("channel_tags_success", response.data);
            })
            .catch(() => {
                commit("channels_error");
            });
    },
    channel_unarchived_entries_change: ({ commit }, param) => {
        commit("channel_unarchived_entries_change", param);
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
