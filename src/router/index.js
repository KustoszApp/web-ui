import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
    {
        path: "/",
        redirect: "/feeds",
    },
    {
        path: "/feeds/:entryId?",
        name: "home",
        component: Home,
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
        path: "/about",
        name: "about",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: function () {
            return import(/* webpackChunkName: "about" */ "../views/About.vue");
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
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
