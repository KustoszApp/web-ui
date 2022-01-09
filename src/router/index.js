import { createRouter, createWebHashHistory } from "vue-router";
import Entries from "../views/Entries.vue";

const routes = [
    {
        path: "/",
        redirect: "/entries",
    },
    {
        path: "/entries/",
        name: "entries",
        component: Entries,
    },
    {
        path: "/maintenance/stale_channels",
        name: "maintenance_stale_channels",
        component: function () {
            return import(
                /* webpackChunkName: "maintenance_stale_channels" */ "../views/Maintenance.vue"
            );
        },
    },
    {
        path: "/maintenance/not_updated_channels",
        name: "maintenance_not_updated_channels",
        component: function () {
            return import(
                /* webpackChunkName: "maintenance_not_updated_channels" */ "../views/Maintenance.vue"
            );
        },
    },
    {
        path: "/maintenance/inactive_channels",
        name: "maintenance_inactive_channels",
        component: function () {
            return import(
                /* webpackChunkName: "maintenance_inactive_channels" */ "../views/Maintenance.vue"
            );
        },
    },
    {
        path: "/settings",
        name: "settings",
        component: function () {
            return import(
                /* webpackChunkName: "settings" */ "../views/Settings.vue"
            );
        },
    },
    {
        path: "/filters",
        name: "filters",
        component: function () {
            return import(
                /* webpackChunkName: "filters" */ "../views/Filters.vue"
            );
        },
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
