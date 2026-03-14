import { createRouter, createWebHashHistory } from 'vue-router';

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: () => import('@/pages/list/index.vue'),
            children: [
                {
                    path: ':id',
                    component: () => import('@/pages/show/index.vue'),
                },
            ],
        },
    ],
});
