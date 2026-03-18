/** FIREDRAGON SETTINGS */

lockPref("firedragon.cfg.version", gVersion.version);

/** INDEX
 *
 * The file is organized in categories, and each one has a number of sections:
 *
 *
 * - PRIVACY [ISOLATION, SANITIZING, CACHE AND STORAGE, HISTORY AND SESSION RESTORE, QUERY STRIPPING]

 * - NETWORKING [HTTPS, REFERERS, WEBRTC, PROXY, DNS, DOH, PREFETCHING AND SPECULATIVE CONNECTIONS]
 *
 * - FINGERPRINTING [RFP, WEBGL]
 *
 * - SECURITY [SITE ISOLATION, CERTIFICATES, TLS/SSL, PERMISSIONS, SAFE BROWSING, OTHERS]
 *
 * - REGION [LOCATION, LANGUAGE]
 *
 * - BEHAVIOR [DRM, SEARCH AND URLBAR, DOWNLOADS, AUTOPLAY, POP-UPS AND WINDOWS, MOUSE, MACHINE LEARNING]
 *
 * - EXTENSIONS [USER INSTALLED, SYSTEM, EXTENSION FIREWALL]
 *
 * - BUILT-IN FEATURES [UPDATER, SYNC, LOCKWISE, CONTAINERS, DEVTOOLS, SHOPPING, OTHERS]
 *
 * - UI [BRANDING, HANDLERS, FIRST LAUNCH, NEW TAB PAGE, ABOUT, RECOMMENDED, OTHERS]
 *
 * - TELEMETRY
 *
 * - WINDOWS [UPDATES, OTHERS]
 *
 * - FIREDRAGON []
 *
 */

/** ------------------------------
 * [CATEGORY] PRIVACY
 * ------------------------------- */

/** [SECTION] ISOLATION
 * default to strict mode, which includes:
 * 1. dFPI for both normal and private windows
 * 2. strict blocking lists for trackers
 * 3. shims to avoid breakage caused by blocking lists
 * 4. stricter policies for xorigin referrers
 * 5. dFPI specific cookie cleaning mechanism
 * 6. query stripping
 */
unsetOverride("browser.contentblocking.category");
// Set strict mode rules as default: tp,tpPrivate,cookieBehavior5,cookieBehaviorPBM5,cryptoTP,fp,stp,emailTP,emailTPPrivate,-consentmanagerSkip,-consentmanagerSkipPrivate,lvl2,rp,rpTop,ocsp,qps,qpsPBM,fpp,fppPrivate,btp,lna
defaultPref("privacy.trackingprotection.enabled", true);
defaultPref("privacy.trackingprotection.pbmode.enabled", true);
defaultPref("network.cookie.cookieBehavior", 5);
defaultPref("network.cookie.cookieBehavior.pbmode", 5);
defaultPref("privacy.trackingprotection.cryptomining.enabled", true);
defaultPref("privacy.trackingprotection.fingerprinting.enabled", true);
defaultPref("privacy.trackingprotection.socialtracking.enabled", true);
defaultPref("privacy.trackingprotection.emailtracking.enabled", true);
defaultPref("privacy.trackingprotection.emailtracking.pbmode.enabled", true);
defaultPref("privacy.trackingprotection.consentmanager.skip.enable", false);
defaultPref("privacy.trackingprotection.consentmanager.skip.pbmode.enable", false);
defaultPref("privacy.annotate_channels.strict_list.enabled", true);
defaultPref("network.http.referer.disallowCrossSiteRelaxingDefault", true);
defaultPref("network.http.referer.disallowCrossSiteRelaxingDefault.top_navigation", true);
defaultPref("privacy.partition.network_state.ocsp_cache", true);
defaultPref("privacy.query_stripping.enabled", true);
defaultPref("privacy.query_stripping.enabled.pbmode", true);
defaultPref("privacy.fingerprintingProtection", true);
defaultPref("privacy.fingerprintingProtection.pbmode", true);
defaultPref("privacy.bounceTrackingProtection.mode", 1);
if (getPref("network.lna.etp.enabled", false)) {
    defaultPref("network.lna.blocking", true);
}
// Reconfigure strict mode rules to be even more restrictive by disallowing all cookies: cookieBehavior5,cookieBehaviorPBM5 -> cookieBehavior2,cookieBehaviorPBM2
defaultPref("browser.contentblocking.features.strict", "tp,tpPrivate,cookieBehavior2,cookieBehaviorPBM2,cryptoTP,fp,stp,emailTP,emailTPPrivate,-consentmanagerSkip,-consentmanagerSkipPrivate,lvl2,rp,rpTop,ocsp,qps,qpsPBM,fpp,fppPrivate,btp,lna")

/** [SECTION] SANITIZING
 * all the cleaning prefs true by default except for siteSettings which is what
 * we want. users should set manual exceptions in the UI if there are cookies
 * they want to keep.
 */
// Sanitize on Shutdown, see: https://support.mozilla.org/en-US/questions/1275887
unsetDefault("privacy.sanitize.sanitizeOnShutdown");
unsetDefault("privacy.sanitize.timeSpan");
unsetDefault("privacy.clearOnShutdown_v2.historyFormDataAndDownloads");
unsetDefault("privacy.clearOnShutdown_v2.browsingHistoryAndDownloads");
// The sanitation settings have actually changed..
unsetDefault("privacy.sanitize.clearOnShutdown.hasMigratedToNewPrefs3");

/** [SECTION] CACHE AND STORAGE */

/** [SECTION] HISTORY AND SESSION RESTORE
 * since we hide the UI for modes other than custom we want to reset it for
 * everyone. same thing for always on PB mode.
 */
unsetOverride("privacy.history.custom");
unsetOverride("browser.privatebrowsing.autostart");
unsetDefault("browser.formfill.enable");

/** [SECTION] QUERY STRIPPING
 * currently we set the same query stripping and allow list that brave uses:
 * https://github.com/brave/brave-core/blob/31d1281d572590225062ea510bddb9c87bfc06a2/components/query_filter/utils.cc#L26-L127
 * https://github.com/brave/brave-core/blob/31d1281d572590225062ea510bddb9c87bfc06a2/components/query_filter/utils.cc#L166
 */

/** [SECTION] LOGGING
 * these prefs are off by default in the official Mozilla builds,
 * so it only makes sense that we also disable them.
 * See https://gitlab.com/librewolf-community/settings/-/issues/240
 */

/** ------------------------------
 * [CATEGORY] NETWORKING
 * ------------------------------- */

/** [SECTION] HTTPS */

/** [SECTION] REFERERS
 * to enhance privacy but keep a certain level of usability we trim cross-origin
 * referers to only send scheme, host and port, instead of completely avoid sending them.
 * as a general rule, the behavior of referes which are not cross-origin should not
 * be changed.
 */

/** [SECTION] WEBRTC
 * there is no point in disabling webrtc as mDNS protects the private IP on linux, osx and win10+.
 * the private IP address is only used in trusted environments, eg. allowed camera and mic access.
 */

/** [SECTION] PROXY */

/** [SECTION] DNS */

/** [SECTION] DOH */

/** [SECTION] PREFETCHING AND SPECULATIVE CONNECTIONS
 * disable prefecthing for different things such as links, bookmarks and predictions.
 */

/** [SECTION] OTHER */

/** ------------------------------
 * [CATEGORY] FINGERPRINTING
 * ------------------------------- */

/** [SECTION] RFP
 * librewolf should stick to RFP for fingerprinting. we should not set prefs that interfere with it
 * and disabling API for no good reason will be counter productive, so it should also be avoided.
 */
unsetDefault("privacy.resistFingerprinting");

/** [SECTION] WEBGL */
defaultPref("webgl.disabled", true);

/** ------------------------------
 * [CATEGORY] SECURITY
 * ------------------------------- */

/** [SECTION] CERTIFICATES */

/** [SECTION] TLS/SSL */

/** [SECTION] PERMISSIONS */

/** [SECTION] SAFE BROWSING
 * disable safe browsing, including the fetch of updates. reverting the 7 prefs below
 * allows to perform local checks and to fetch updated lists from google.
 */

/** [SECTION] OTHERS */

/** ------------------------------
 * [CATEGORY] REGION
 * ------------------------------- */

/** [SECTION] LOCATION
 * replace google with beacondb as the default geolocation provide and prevent use of OS location services
 */

/** [SECTION] LANGUAGE
 * show language as en-US for all users, regardless of their OS language and browser language.
 * both prefs must use pref() and not defaultPref to work.
 */

/** ------------------------------
 * [CATEGORY] BEHAVIOR
 * ------------------------------- */

/** [SECTION] DRM */

/** [SECTION] SEARCH AND URLBAR
 * disable search suggestion and do not update opensearch engines.
 */
defaultPref('browser.search.separatePrivateDefault', false);

/** [SECTION] DOWNLOADS
 * user interaction should always be required for downloads, as a way to enhance security by asking
 * the user to specific a certain save location.
 */

/** [SECTION] AUTOPLAY
 * block autoplay unless element is right-clicked. this means background videos, videos in a different tab,
 * or media opened while other media is played will not start automatically.
 * thumbnails will not autoplay unless hovered. exceptions can be set from the UI.
 */

/** [SECTION] POP-UPS AND WINDOWS
 * prevent scripts from resizing existing windows and opening new ones, by forcing them into
 * new tabs that can't be resized as well.
 */

/** [SECTION] MOUSE */

/** [SECTION] MACHINE LEARNING **/
defaultPref("browser.preferences.aiControls", true);
unlock("browser.preferences.aiControls");
unlock("browser.ai.control.default");
unlock("browser.ai.control.linkPreviewKeyPoints");
unlock("browser.ai.control.pdfjsAltText");
unlock("browser.ai.control.sidebarChatbot");
unlock("browser.ai.control.smartTabGroups");

/** ------------------------------
 * [CATEGORY] EXTENSIONS
 * ------------------------------- */

/** [SECTION] USER INSTALLED
 * extensions are allowed to operate on restricted domains, while their scope
 * is set to profile+applications (https://mike.kaply.com/2012/02/21/understanding-add-on-scopes/).
 * an installation prompt should always be displayed.
 */

/** [SECTION] SYSTEM
 * built-in extension are not allowed to auto-update. additionally the reporter extension
 * of webcompat is disabled. urls are stripped for defense in depth.
 */
unsetDefault("extensions.systemAddon.update.enabled");
unsetDefault("extensions.systemAddon.update.url");

/** [SECTION] EXTENSION FIREWALL
 * the firewall can be enabled with the below prefs, but it is not a sane default:
 * defaultPref("extensions.webextensions.base-content-security-policy", "default-src 'none'; script-src 'none'; object-src 'none';");
 * defaultPref("extensions.webextensions.base-content-security-policy.v3", "default-src 'none'; script-src 'none'; object-src 'none';");
 */

/** ------------------------------
 * [CATEGORY] BUILT-IN FEATURES
 * ------------------------------- */

/** [SECTION] UPDATER
 * since we do not bake auto-updates in the browser it doesn't make sense at the moment.
 */
#ifdef FIREDRAGON_UPDATE
defaultPref("app.update.auto", true);
unlock("app.update.auto");
#endif

/** [SECTION] SYNC
 * this functionality is disabled by default but it can be activated in one click.
 * this pref fully controls the feature, including its ui.
 */
defaultPref("identity.fxaccounts.enabled", true);
defaultPref("identity.sync.tokenserver.uri", "https://ffsync.garudalinux.org/token/1.0/sync/1.5");

/** [SECTION] LOCKWISE
 * disable the default password manager built into the browser, including its autofill
 * capabilities and formless login capture.
 */

/** [SECTION] CONTAINERS
 * enable containers and show the settings to control them in the stock ui
 */

/** [SECTION] DEVTOOLS
 * disable remote debugging.
 */
unsetOverride("devtools.debugger.remote-enabled");

/** ------------------------------
 * [CATEGORY] UI
 * ------------------------------- */

/** [SECTION] BRANDING
* Set Firedragon support and releases urls in the UI, so that users land in the proper places.
*/
defaultPref("app.support.baseURL", "https://firedragon.garudalinux.org/faq/");
defaultPref("browser.search.searchEnginesURL", "https://searx.garudalinux.org/?q={searchTerms}");
defaultPref("browser.geolocation.warning.infoURL", "https://firedragon.garudalinux.org/faq#how-do-i-enable-location-aware-browsing");
defaultPref("app.feedback.baseURL", "https://forum.garudalinux.org");
defaultPref("app.releaseNotesURL", "https://firedragon.garudalinux.org/changelogs");
defaultPref("app.releaseNotesURL.aboutDialog", "https://firedragon.garudalinux.org/changelogs");
defaultPref("app.update.url.details", "https://gitlab.com/garuda-linux/firedragon/firedragon12/-/releases");
defaultPref("app.update.url.manual", "https://gitlab.com/garuda-linux/firedragon/firedragon12/-/releases");

/** [SECTION] FIRST LAUNCH
 * disable what's new, ui tour, and privacy notice/terms of use on first start and updates. the browser
 * should also not stress user about being the default one.
 */
unsetDefault("browser.startup.homepage_override.mstone");
unsetDefault("startup.homepage_override_url");
unsetDefault("startup.homepage_welcome_url");
unsetDefault("startup.homepage_welcome_url.additional");

/** [SECTION] NEW TAB PAGE
 * we want NTP to display nothing but the search bar without anything distracting.
 * the three prefs below are just for minimalism and they should be easy to revert for users.
 */

/** [SECTION] ABOUT
 * remove annoying ui elements from the about pages, including about:protections
 */

/** [SECTION] RECOMMENDED
 * disable all "recommend as you browse" activity.
 */

/** [SECTION] OTHERS
 * other unwanted UI
 */

/** ------------------------------
 * [CATEGORY] TELEMETRY
 * telemetry is already disabled elsewhere and most of the stuff in here is just for redundancy.
 * ------------------------------- */

/** ------------------------------
 * [CATEGORY] WINDOWS
 * the prefs in this section only apply to windows installations and they don't have any
 * effect on linux, macos and bsd users.
 * ------------------------------- */

/** [SECTION] UPDATES
 * disable windows specific update services.
 */
defaultPref("app.update.service.enabled", true);
unlock("app.update.service.enabled");

/** [SECTION] OTHERS */
unsetOverride("toolkit.winRegisterApplicationRestart", false);

/** ------------------------------
 * [CATEGORY] FIREDRAGON
 * prefs introduced by FireDragon-specific patches
 * ------------------------------- */
defaultPref("browser.startup.page", 3);
defaultPref("sidebar.revamp", true);
defaultPref("sidebar.main.tools", "history,bookmarks,firedragon-notes@firedragon.garudalinux.org,firedragon-workspaces@firedragon.garudalinux.org");
defaultPref("toolkit.legacyUserProfileCustomizations.stylesheets", true);
// Disabled for now, since it is quite buggy:
// defaultPref("widget.gtk.global-menu.enabled", true);
// defaultPref("widget.gtk.global-menu.wayland.enabled", true);
/** Possible values are:
 * 0 – Never
 * 1 – Always
 * 2 – Auto (typically depends on whether Firefox is run from within Flatpak or whether the GDK_DEBUG=portals environment is set)
 * Other settings in the same category are:
 * widget.use-xdg-desktop-portal.mime-handler – Whether to use XDG portal for the mime handler
 * widget.use-xdg-desktop-portal.settings – Whether to try to use XDG portal for settings/look-and-feel information
 * widget.use-xdg-desktop-portal.location – Whether to use XDG portal for geolocation
 * widget.use-xdg-desktop-portal.open-uri – Whether to use XDG portal for opening to a file
 */
defaultPref("widget.use-xdg-desktop-portal.file-picker", 1);

/** ------------------------------
 * [CATEGORY] OVERRIDES
 * allow settings to be overriden with a file placed in the right location
 * https://librewolf.net/docs/settings/#where-do-i-find-my-librewolfoverridescfg
 * ------------------------------- */
// See overrides preset
