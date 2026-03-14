import { createHead } from '@unhead/vue/client';
import { Quasar } from 'quasar';
import iconSet from 'quasar/icon-set/material-symbols-outlined';

import i18n from '@/utils/i18n';

import App from './App.vue';

const app = createApp(App);

app.use(i18n);
app.use(createHead());
app.use(Quasar, {
    config: {
        dark: 'auto',
    },
    iconSet,
});

app.mount('#app');
