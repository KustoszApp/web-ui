import {
    GET_SIDEBAR_STATE,
    MUTATION_SIDEBAR_DISPLAYED,
    MUTATION_SIDEBAR_HIDDEN,
    ACTION_DISPLAY_SIDEBAR,
    ACTION_HIDE_SIDEBAR,
} from "../../types";

const state = {
    sidebarDisplayed: false,
};

const getters = {
    [GET_SIDEBAR_STATE]: (state) => state.sidebarDisplayed,
};

const mutations = {
    [MUTATION_SIDEBAR_DISPLAYED]: (state) => (state.sidebarDisplayed = true),
    [MUTATION_SIDEBAR_HIDDEN]: (state) => (state.sidebarDisplayed = false),
};

const actions = {
    [ACTION_DISPLAY_SIDEBAR]: ({ commit }) => {
        commit(MUTATION_SIDEBAR_DISPLAYED);
    },
    [ACTION_HIDE_SIDEBAR]: ({ commit }) => {
        commit(MUTATION_SIDEBAR_HIDDEN);
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
