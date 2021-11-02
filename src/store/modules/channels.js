import axios from "axios";

const state = {
    status: "",
    channels: [],
};

const getters = {
    channels: (state) => state.channels,
};

const mutations = {
    channels_request: (state) => (state.status = "loading"),
    channels_success: (state, data) => {
        state.status = "success";
        state.channels = data.results;
    },
    channels_error: (state) => (state.status = "error"),
    channel_edit_success: (state, data) => {
        state.status = "success";
        state.channels.forEach((item, idx) => {
            if (item.id === data.id) {
                state.channels[idx] = data;
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
};

export default {
    state,
    getters,
    mutations,
    actions,
};
