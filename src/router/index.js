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
    },
    {
        path: "/maintenance/not_updated_channels",
        name: ROUTE_MAINTENANCE_NOT_UPDATED_CHANNELS,
        component: Maintenance,
        beforeEnter: [hasToken, tokenIsValid],
    },
    {
        path: "/maintenance/inactive_channels",
        name: ROUTE_MAINTENANCE_INACTIVE_CHANNELS,
        component: Maintenance,
        beforeEnter: [hasToken, tokenIsValid],
    },
    {
        path: "/settings",
        name: ROUTE_SETTINGS,
        component: Settings,
        beforeEnter: [hasToken, tokenIsValid],
    },
    {
        path: "/filters",
        name: ROUTE_FILTERS,
        component: Filters,
        beforeEnter: [hasToken, tokenIsValid],
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
