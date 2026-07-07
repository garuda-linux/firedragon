import messages from '@intlify/unplugin-vue-i18n/messages';
import { createI18n } from 'vue-i18n';

const i18n = createI18n({
    fallbackLocale: 'en-US',
    messages,
});
export default i18n;

export const t = i18n.global.t;
