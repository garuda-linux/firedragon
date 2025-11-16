import { createI18n } from 'vue-i18n';

import messages from '@intlify/unplugin-vue-i18n/messages'

const i18n = createI18n({
    fallbackLocale: 'en',
    messages,
});
export default i18n;

export function t(key: string) {
    return i18n.global.t(key);
}
