import { createRouter } from "vue-router";
import { createHashHistory } from '@firedragon13/lib-vue-router';

export default createRouter({
    history: createHashHistory(),
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
    ],
});
