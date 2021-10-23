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
