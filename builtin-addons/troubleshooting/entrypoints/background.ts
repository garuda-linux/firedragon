export default defineBackground(() => {
    browser.runtime.onStartup.addListener(async () => {
        if (await browser.safeMode.isSafeMode()) {
            await browser.tabs.create({
                url: browser.runtime.getURL('/index.html'),
            });
        }
    });
});
