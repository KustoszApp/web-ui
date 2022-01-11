import { createRouter, createWebHashHistory } from "vue-router";
import store from "../store";
import Entries from "../views/Entries.vue";

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
                    .then(() => from);
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
        component: function () {
            return import(/* webpackChunkName: "login" */ "../views/Login.vue");
        },
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
        component: function () {
            return import(
                /* webpackChunkName: "maintenance_stale_channels" */ "../views/Maintenance.vue"
            );
        },
        beforeEnter: [hasToken, tokenIsValid],
    },
    {
        path: "/maintenance/not_updated_channels",
        name: ROUTE_MAINTENANCE_NOT_UPDATED_CHANNELS,
        component: function () {
            return import(
                /* webpackChunkName: "maintenance_not_updated_channels" */ "../views/Maintenance.vue"
            );
        },
        beforeEnter: [hasToken, tokenIsValid],
    },
    {
        path: "/maintenance/inactive_channels",
        name: ROUTE_MAINTENANCE_INACTIVE_CHANNELS,
        component: function () {
            return import(
                /* webpackChunkName: "maintenance_inactive_channels" */ "../views/Maintenance.vue"
            );
        },
        beforeEnter: [hasToken, tokenIsValid],
    },
    {
        path: "/settings",
        name: ROUTE_SETTINGS,
        component: function () {
            return import(
                /* webpackChunkName: "settings" */ "../views/Settings.vue"
            );
        },
        beforeEnter: [hasToken, tokenIsValid],
    },
    {
        path: "/filters",
        name: ROUTE_FILTERS,
        component: function () {
            return import(
                /* webpackChunkName: "filters" */ "../views/Filters.vue"
            );
        },
        beforeEnter: [hasToken, tokenIsValid],
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
