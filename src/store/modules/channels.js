import axios from "axios";

import {
    GET_CHANNELS,
    GET_CHANNEL_TAGS,
    MUTATION_CHANNELS_REQUEST,
    MUTATION_CHANNELS_SUCCESS,
    MUTATION_CHANNELS_ERROR,
    MUTATION_CHANNEL_CREATE_REQUEST,
    MUTATION_CHANNEL_CREATE_SUCCESS,
    MUTATION_CHANNEL_CREATE_ERROR,
    MUTATION_CHANNEL_EDIT_SUCCESS,
    MUTATION_CHANNEL_EDIT_ERROR,
    MUTATION_CHANNEL_TAGS_REQUEST,
    MUTATION_CHANNEL_TAGS_SUCCESS,
    MUTATION_CHANNEL_UNARCHIVED_ENTRIES_CHANGE,
    ACTION_CHANNELS_REQUEST,
    ACTION_CHANNEL_CREATE_REQUEST,
    ACTION_CHANNEL_EDIT_REQUEST,
    ACTION_CHANNEL_TAGS_REQUEST,
    ACTION_CHANNEL_UNARCHIVED_ENTRIES_CHANGE,
} from "../../types";

const state = {
    status: "",
    channels: [],
    channelTags: [],
};

const getters = {
    [GET_CHANNELS]: (state) => state.channels,
    [GET_CHANNEL_TAGS]: (state) => state.channelTags,
};

const mutations = {
    [MUTATION_CHANNELS_REQUEST]: (state) => (state.status = "loading"),
    [MUTATION_CHANNELS_SUCCESS]: (state, data) => {
        state.status = "success";
        state.channels = data.results;
    },
    [MUTATION_CHANNELS_ERROR]: (state) => (state.status = "error"),
    [MUTATION_CHANNEL_CREATE_REQUEST]: (state) => (state.status = "loading"),
    [MUTATION_CHANNEL_CREATE_SUCCESS]: (state) => (state.status = "success"),
    [MUTATION_CHANNEL_CREATE_ERROR]: (state) => (state.status = "error"),
    [MUTATION_CHANNEL_EDIT_SUCCESS]: (state, data) => {
        state.status = "success";
        state.channels.forEach((item, idx) => {
            if (item.id === data.id) {
                state.channels[idx] = data;
            }
        });
    },
    [MUTATION_CHANNEL_TAGS_REQUEST]: (state) => (state.status = "loading"),
    [MUTATION_CHANNEL_TAGS_SUCCESS]: (state, data) => {
        state.status = "success";
        state.channelTags = data.results;
    },
    [MUTATION_CHANNEL_UNARCHIVED_ENTRIES_CHANGE]: (state, data) => {
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
    [ACTION_CHANNELS_REQUEST]: ({ commit }) => {
        axios
            .get("channels/?limit=200")
            .then((response) => {
                commit(MUTATION_CHANNELS_SUCCESS, response.data);
            })
            .catch(() => {
                commit(MUTATION_CHANNELS_ERROR);
            });
    },
    [ACTION_CHANNEL_CREATE_REQUEST]: ({ dispatch, commit }, param) => {
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
                commit(MUTATION_CHANNEL_CREATE_SUCCESS, response.data);
            })
            .then(() => {
                dispatch(ACTION_CHANNEL_TAGS_REQUEST);
                setTimeout(() => dispatch(ACTION_CHANNELS_REQUEST), 1000);
            })
            .catch(() => {
                commit(MUTATION_CHANNEL_CREATE_ERROR);
            });
    },
    [ACTION_CHANNEL_EDIT_REQUEST]: ({ commit }, param) => {
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
                commit(MUTATION_CHANNEL_EDIT_SUCCESS, response.data);
            })
            .catch(() => {
                commit(MUTATION_CHANNEL_EDIT_ERROR);
            });
    },
    [ACTION_CHANNEL_TAGS_REQUEST]: ({ commit }) => {
        axios
            .get("tags/channel")
            .then((response) => {
                commit(MUTATION_CHANNEL_TAGS_SUCCESS, response.data);
            })
            .catch(() => {
                commit(MUTATION_CHANNELS_ERROR);
            });
    },
    [ACTION_CHANNEL_UNARCHIVED_ENTRIES_CHANGE]: ({ commit }, param) => {
        commit(MUTATION_CHANNEL_UNARCHIVED_ENTRIES_CHANGE, param);
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
