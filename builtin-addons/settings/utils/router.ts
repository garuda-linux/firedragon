import { createRouter, createWebHashHistory } from 'vue-router';

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: () => import('@/pages/home/index.vue'),
        },
        {
            path: '/design',
            children: [
                {
                    path: '',
                    component: () => import('@/pages/design/index.vue'),
                },
                {
                    path: 'lepton',
                    component: () => import('@/pages/design/lepton/index.vue'),
                },
            ],
        },
        {
            path: '/keyboard-shortcuts',
            component: () => import('@/pages/keyboard-shortcuts/index.vue'),
        },
        {
            path: '/sidebar',
            component: () => import('@/pages/sidebar/index.vue'),
        },
    ],
});
