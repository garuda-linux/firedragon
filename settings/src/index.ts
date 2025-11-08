import { Quasar, Dialog } from 'quasar';
import iconSet from 'quasar/icon-set/material-symbols-outlined';
import { createHead } from '@unhead/vue/client';

import App from './App.vue';
import i18n from './i18n.ts';
import router from './router.ts';

const app = createApp(App);

app.use(Quasar, {
    iconSet,
    plugins: [
        Dialog,
    ],
    config: {
        dark: 'auto',
    },
});
app.use(createHead());
app.use(i18n);
app.use(router);

app.mount('#app');
