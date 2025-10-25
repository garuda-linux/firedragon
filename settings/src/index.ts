import { Quasar, Dialog } from 'quasar';
import { createHead } from '@unhead/vue/client';

import App from './App.vue';
import i18n from './i18n.ts';
import router from './router.ts';

const app = createApp(App);

app.use(Quasar, {
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
