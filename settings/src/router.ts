import { createMemoryHistory, createRouter } from "vue-router";

export default createRouter({
    history: createMemoryHistory(),
    routes: [
        {
            path: '/',
            component: () => import('@/pages/home/index.vue'),
        },
        {
            path: '/design',
            component: () => import('@/pages/design/index.vue'),
        },
    ],
});
