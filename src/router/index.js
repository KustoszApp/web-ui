import { createRouter, createWebHashHistory } from "vue-router";
import store from "../store";
const Login = () => import(/* webpackChunkName: "login" */ "../views/Login");
const Entries = () =>
    import(/* webpackChunkName: "entries" */ "../views/Entries");
const Maintenance = () =>
    import(/* webpackChunkName: "maintenance" */ "../views/Maintenance");
const Settings = () =>
    import(/* webpackChunkName: "settings" */ "../views/Settings");
const Filters = () =>
    import(/* webpackChunkName: "filters" */ "../views/Filters");

import {
    ACTION_CHECK_TOKEN,
    ACTION_HIDE_SIDEBAR,
    ACTION_USER_DATA_REQUEST,
    ROUTE_LOGIN,
    ROUTE_ENTRIES,
    ROUTE_FILTERS,
    ROUTE_SETTINGS,
    ROUTE_MAINTENANCE_INACTIVE_CHANNELS,
    ROUTE_MAINTENANCE_NOT_UPDATED_CHANNELS,
    ROUTE_MAINTENANCE_STALE_CHANNELS,
} from "../types";

/* eslint-disable no-unused-vars */
const hasToken = (to, from) => {
    return store.dispatch(ACTION_CHECK_TOKEN).then((hasToken) => {
        if (!hasToken) return { name: ROUTE_LOGIN };
    });
};
const tokenIsValid = (to, from) => {
    return store.dispatch(ACTION_USER_DATA_REQUEST).catch(() => {
        return { name: ROUTE_LOGIN };
    });
};

const notHasTokenOrNotValidToken = (to, from) => {
    return store
        .dispatch(ACTION_CHECK_TOKEN)
        .then((hasToken) => {
            if (hasToken) {
                return store
                    .dispatch(ACTION_USER_DATA_REQUEST)
                    .then(() => false);
            }
        })
        .catch(() => true);
};

const updatePageTitle = (to, from, failure) => {
    if (failure) {
        return;
    }

    const baseTitle = "Kustosz";
    let title = baseTitle;
    if (to.meta.title) {
        title = `${to.meta.title} - ${baseTitle}`;
    }
    document.title = title;
};

const hideSidebar = (to, from, failure) => {
    if (!failure) {
        store.dispatch(ACTION_HIDE_SIDEBAR);
    }
};

const afterEachHandler = (to, from, failure) => {
    updatePageTitle(to, from, failure);
    hideSidebar(to, from, failure);
};
/* eslint-enable no-unused-vars */

const routes = [
    {
        path: "/",
        redirect: { name: ROUTE_ENTRIES },
    },
    {
        path: "/login",
        name: ROUTE_LOGIN,
        component: Login,
        beforeEnter: notHasTokenOrNotValidToken,
        meta: {
            title: "Login",
        },
    },
    {
        path: "/entries/",
        name: ROUTE_ENTRIES,
        component: Entries,
        beforeEnter: [hasToken, tokenIsValid],
    },
    {
        path: "/maintenance/stale_channels",
        name: ROUTE_MAINTENANCE_STALE_CHANNELS,
        component: Maintenance,
        beforeEnter: [hasToken, tokenIsValid],
        meta: {
            title: "Stale channels - Maintenance",
        },
    },
    {
        path: "/maintenance/not_updated_channels",
        name: ROUTE_MAINTENANCE_NOT_UPDATED_CHANNELS,
        component: Maintenance,
        beforeEnter: [hasToken, tokenIsValid],
        meta: {
            title: "Channels without new entries - Maintenance",
        },
    },
    {
        path: "/maintenance/inactive_channels",
        name: ROUTE_MAINTENANCE_INACTIVE_CHANNELS,
        component: Maintenance,
        beforeEnter: [hasToken, tokenIsValid],
        meta: {
            title: "Inactive channels - Maintenance",
        },
    },
    {
        path: "/settings",
        name: ROUTE_SETTINGS,
        component: Settings,
        beforeEnter: [hasToken, tokenIsValid],
        meta: {
            title: "Settings",
        },
    },
    {
        path: "/filters",
        name: ROUTE_FILTERS,
        component: Filters,
        beforeEnter: [hasToken, tokenIsValid],
        meta: {
            title: "Filters",
        },
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.afterEach(afterEachHandler);

export default router;
