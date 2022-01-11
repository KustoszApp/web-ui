import { createRouter, createWebHashHistory } from "vue-router";
import store from "../store";
import Entries from "../views/Entries.vue";

/* eslint-disable no-unused-vars */
const hasToken = (to, from) => {
    return store.dispatch("check_token").then((hasToken) => {
        if (!hasToken) return "/login";
    });
};
const tokenIsValid = (to, from) => {
    return store.dispatch("user_data_request").catch(() => "/login");
};

const notHasTokenOrNotValidToken = (to, from) => {
    return store
        .dispatch("check_token")
        .then((hasToken) => {
            if (hasToken) {
                return store.dispatch("user_data_request").then(() => from);
            }
        })
        .catch(() => true);
};
/* eslint-enable no-unused-vars */

const routes = [
    {
        path: "/",
        redirect: "/entries",
    },
    {
        path: "/login",
        name: "login",
        component: function () {
            return import(/* webpackChunkName: "login" */ "../views/Login.vue");
        },
        beforeEnter: notHasTokenOrNotValidToken,
    },
    {
        path: "/entries/",
        name: "entries",
        component: Entries,
        beforeEnter: [hasToken, tokenIsValid],
    },
    {
        path: "/maintenance/stale_channels",
        name: "maintenance_stale_channels",
        component: function () {
            return import(
                /* webpackChunkName: "maintenance_stale_channels" */ "../views/Maintenance.vue"
            );
        },
        beforeEnter: [hasToken, tokenIsValid],
    },
    {
        path: "/maintenance/not_updated_channels",
        name: "maintenance_not_updated_channels",
        component: function () {
            return import(
                /* webpackChunkName: "maintenance_not_updated_channels" */ "../views/Maintenance.vue"
            );
        },
        beforeEnter: [hasToken, tokenIsValid],
    },
    {
        path: "/maintenance/inactive_channels",
        name: "maintenance_inactive_channels",
        component: function () {
            return import(
                /* webpackChunkName: "maintenance_inactive_channels" */ "../views/Maintenance.vue"
            );
        },
        beforeEnter: [hasToken, tokenIsValid],
    },
    {
        path: "/settings",
        name: "settings",
        component: function () {
            return import(
                /* webpackChunkName: "settings" */ "../views/Settings.vue"
            );
        },
        beforeEnter: [hasToken, tokenIsValid],
    },
    {
        path: "/filters",
        name: "filters",
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
