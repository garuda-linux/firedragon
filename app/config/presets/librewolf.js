null;

/** LIBREWOLF SETTINGS
 *
 * take the time to read and understand, but also to customize the settings to find your own setup.
 * the answers to the most common questions can be found at https://librewolf.net/docs/faq/.
 *
 * WARNING: make sure the first line of this file is empty. this is a known bug.
 */

lockPref("librewolf.cfg.version", "8.6");

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
 * - LIBREWOLF []
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
 *
 * the desired category must be set with pref() otherwise it won't stick.
 * the UI that allows to change mode manually is hidden.
 */
pref("browser.contentblocking.category", "strict");

/** [SECTION] SANITIZING
 * all the cleaning prefs true by default except for siteSettings which is what
 * we want. users should set manual exceptions in the UI if there are cookies
 * they want to keep.
 */
// Sanitize on Shutdown, see: https://support.mozilla.org/en-US/questions/1275887
defaultPref("privacy.sanitize.sanitizeOnShutdown", true);
defaultPref("privacy.sanitize.timeSpan", 0);
defaultPref("privacy.clearOnShutdown_v2.historyFormDataAndDownloads", false);
defaultPref("privacy.clearOnShutdown_v2.browsingHistoryAndDownloads", false);
// The sanitation settings have actually changed..
defaultPref("privacy.sanitize.clearOnShutdown.hasMigratedToNewPrefs3", true);

/** [SECTION] CACHE AND STORAGE */
defaultPref("browser.cache.disk.enable", false); // disable disk cache
/** prevent media cache from being written to disk in pb, but increase max cache size to avoid playback issues */
defaultPref("browser.privatebrowsing.forceMediaMemoryCache", true);
defaultPref("media.memory_cache_max_size", 65536);
defaultPref("browser.shell.shortcutFavicons", false); // disable favicons in profile folder
defaultPref("browser.helperApps.deleteTempFileOnExit", true); // delete temporary files opened with external apps

/** [SECTION] HISTORY AND SESSION RESTORE
 * since we hide the UI for modes other than custom we want to reset it for
 * everyone. same thing for always on PB mode.
 */
pref("privacy.history.custom", true);
pref("browser.privatebrowsing.autostart", false);
defaultPref("browser.formfill.enable", false); // disable form history
defaultPref("browser.sessionstore.privacy_level", 2); // prevent websites from storing session data like cookies and forms

/** [SECTION] QUERY STRIPPING
 * currently we set the same query stripping and allow list that brave uses:
 * https://github.com/brave/brave-core/blob/3dcdad4c8a5cf62f83ca4f893fc7f0c4d3d086bc/components/query_filter/browser/utils.cc#L33-L138
 * https://github.com/brave/brave-core/blob/3dcdad4c8a5cf62f83ca4f893fc7f0c4d3d086bc/components/query_filter/browser/utils.cc#L182
 */
defaultPref(
  "privacy.query_stripping.strip_list",
  "__hsfp __hssc __hstc __s _bhlid _branch_match_id _branch_referrer _gl _hsenc _openstat at_recipient_id at_recipient_list bbeml bsft_clkid bsft_uid dclid et_rid fb_action_ids fb_comment_id fbclid gclid guce_referrer guce_referrer_sig hsCtaTracking irclickid mc_eid ml_subscriber ml_subscriber_hash msclkid mtm_cid oft_c oft_ck oft_d oft_id oft_ids oft_k oft_lk oft_sk oly_anon_id oly_enc_id pk_cid rb_clickid s_cid sc_customer sc_eh sc_uid sfmc_activityid sfmc_id sms_click sms_source sms_uph srsltid ss_email_id syclid ttclid twclid unicorn_click_id vero_conv vero_id vgo_ee wbraid wickedid yclid ymclid ysclid"
);
defaultPref("privacy.query_stripping.allow_list", "urldefense.com");

/** [SECTION] LOGGING
 * these prefs are off by default in the official Mozilla builds,
 * so it only makes sense that we also disable them.
 * See https://gitlab.com/librewolf-community/settings/-/issues/240
 */
pref("browser.dom.window.dump.enabled", false);
pref("devtools.console.stdout.chrome", false);

/** ------------------------------
 * [CATEGORY] NETWORKING
 * ------------------------------- */

/** [SECTION] HTTPS */
defaultPref("dom.security.https_only_mode", true); // only allow https in all windows, including private browsing
defaultPref("network.auth.subresource-http-auth-allow", 1); // block HTTP authentication credential dialogs
defaultPref("network.http.prompt-temp-redirect", true); // // Enable prompts for unsafe HTTP redirects
defaultPref("dom.security.https_only_mode.upgrade_local", true);

/** [SECTION] REFERERS
 * to enhance privacy but keep a certain level of usability we trim cross-origin
 * referers to only send scheme, host and port, instead of completely avoid sending them.
 * as a general rule, the behavior of referes which are not cross-origin should not
 * be changed.
 */
defaultPref("network.http.referer.XOriginTrimmingPolicy", 2);

/** [SECTION] WEBRTC
 * there is no point in disabling webrtc as mDNS protects the private IP on linux, osx and win10+.
 * the private IP address is only used in trusted environments, eg. allowed camera and mic access.
 */
defaultPref("media.peerconnection.ice.default_address_only", true); // use a single interface for ICE candidates, the vpn one when a vpn is used

/** [SECTION] PROXY */
defaultPref("network.gio.supported-protocols", ""); // disable gio as it could bypass proxy
defaultPref("network.file.disable_unc_paths", true); // hidden, disable using uniform naming convention to prevent proxy bypass
defaultPref("network.proxy.socks_remote_dns", true); // forces dns query through the proxy when using one
defaultPref("media.peerconnection.ice.proxy_only_if_behind_proxy", true); // force webrtc inside proxy when one is used

/** [SECTION] DNS */
defaultPref("network.dns.disablePrefetch", true); // disable dns prefetching
defaultPref("network.dns.disablePrefetchFromHTTPS", true); // disable dns prefetching HTTPS

/** [SECTION] DOH */

// The current DoH providers are:
//  ->  LibreDNS, Quad9, Wikimedia, dns4all, Mullvad.
// For more providers: https://github.com/curl/curl/wiki/DNS-over-HTTPS

defaultPref(
  "doh-rollout.provider-list",
  `[
  {
    "UIName": "Quad9 (No Filtering)",
    "uri": "https://dns10.quad9.net/dns-query"
  },
  {
    "UIName": "Quad9 (Malware blocking)",
    "uri": "https://dns.quad9.net/dns-query"
  },
  {
    "UIName": "LibreDNS (No Filtering)",
    "uri": "https://doh.libredns.gr/dns-query"
  },
  {
    "UIName": "LibreDNS (Adblocking)",
    "uri": "https://doh.libredns.gr/noads"
  },
  {
    "UIName": "Wikimedia DNS (No Filtering)",
    "uri": "https://wikimedia-dns.org/dns-query"
  },
  {
    "UIName": "DNS4All (No Filtering)",
    "uri": "https://doh.dns4all.eu/dns-query"
  },
  {
    "UIName": "Mullvad (No Filtering)",
    "uri": "https://dns.mullvad.net/dns-query"
  }
]`
);

/** librewolf does use DoH:
 *
 * the possible modes are:
 * 0 = default
 * 1 = browser picks faster
 * 2 = DoH with system dns fallback
 * 3 = DoH without fallback
 * 5 = DoH is off, default currently
 */

defaultPref("network.trr.mode", 5); // DoH is turned off.
defaultPref("network.trr.uri", "https://dns10.quad9.net/dns-query"); // Current 'reasonable default' proposal: NON-malware-blocking quad9 endpoint.
defaultPref("doh-rollout.enabled", false); // Disable DoH rollout
defaultPref("network.trr.useGET", false);

// Additions by Acideburn in https://codeberg.org/librewolf/issues/issues/1975
defaultPref(
  "network.trr.default_provider_uri",
  "https://doh.dns4all.eu/dns-query"
); // Define a fallback DoH server

/** [SECTION] PREFETCHING AND SPECULATIVE CONNECTIONS
 * disable prefecthing for different things such as links, bookmarks and predictions.
 */
pref("network.prefetch-next", false);
pref("network.http.speculative-parallel-limit", 0);
pref("network.early-hints.preconnect.max_connections", 0);
defaultPref("browser.places.speculativeConnect.enabled", false);
// disable speculative connections and domain guessing from the urlbar
defaultPref("browser.urlbar.speculativeConnect.enabled", false);

/** [SECTION] Local Network Access */
defaultPref("network.lna.blocking", true); // This preference controls if we need to fail transactions for Local Network Access (LNA) failures. FF 147 started rolling it out for ETP Strict users.
defaultPref("network.lna.block_trackers", true); // When this pref is true, loads triggered by scripts classified as trackers will automatically be blocked.
defaultPref("network.lna.websocket.enabled", true); // When true, WebSocket connections follow normal LNA rules.
defaultPref("network.lna.allow_top_level_navigation", false); // When this pref is true, top-level document navigation to local network addresses will bypass LNA permission checks.
defaultPref("network.lna.local-network-to-localhost.skip-checks", false); // When this pref is true, skip LNA checks for requests from private network to localhost (private -> local IP address space transitions).

/** [SECTION] OTHER */
defaultPref("security.csp.reporting.enabled", false); // https://codeberg.org/librewolf/issues/issues/2688

/** ------------------------------
 * [CATEGORY] FINGERPRINTING
 * ------------------------------- */

/** [SECTION] RFP
 * librewolf should stick to RFP for fingerprinting. we should not set prefs that interfere with it
 * and disabling API for no good reason will be counter productive, so it should also be avoided.
 */
defaultPref("privacy.resistFingerprinting", true);
// rfp related settings
defaultPref("privacy.resistFingerprinting.block_mozAddonManager", true); // prevents rfp from breaking AMO
defaultPref("browser.display.use_system_colors", false); // default, except Win
/** increase the size of new RFP windows for better usability, while still using a rounded value.
 * if the screen resolution is lower it will stretch to the biggest possible rounded value.
 * also, expose hidden letterboxing pref but do not enable it for now.
 */
defaultPref("privacy.window.maxInnerWidth", 1600);
defaultPref("privacy.window.maxInnerHeight", 900);
defaultPref("privacy.resistFingerprinting.letterboxing", false);
// this ensures there is no rounding error when computing the window size, see #1569.
defaultPref("browser.toolbars.bookmarks.visibility", "always");
// Enable GPC ( see issue: https://codeberg.org/librewolf/issues/issues/1840 )
defaultPref("privacy.globalprivacycontrol.enabled", true);
defaultPref("privacy.globalprivacycontrol.pbmode.enabled", true);
defaultPref("privacy.globalprivacycontrol.functionality.enabled", true);

/** [SECTION] WEBGL */
pref("webgl.disabled", false);
defaultPref("dom.webgpu.enabled", false);
defaultPref("pdfjs.enableWebGPU", false);

/** ------------------------------
 * [CATEGORY] SECURITY
 * ------------------------------- */

/** [SECTION] CERTIFICATES */
defaultPref("security.cert_pinning.enforcement_level", 2); // enable strict public key pinning, might cause issues with AVs
/** enable safe negotiation and show warning when it is not supported. might cause breakage
 * if the the server does not support RFC 5746, in tha case SSL_ERROR_UNSAFE_NEGOTIATION
 * will be shown.
 */
defaultPref("security.ssl.require_safe_negotiation", true);
defaultPref("security.ssl.treat_unsafe_negotiation_as_broken", true);
/** Use CRLite whenever possible
 *    0: Disable CRLite entirely.
 *    1: Consult CRLite but only collect telemetry.
 * -> 2: Consult CRLite and enforce both "Revoked" and "Not Revoked" results.
 *    3: Consult CRLite and enforce "Not Revoked" results, but defer to OCSP for "Revoked".
 */
defaultPref("security.pki.crlite_mode", 2);
defaultPref("security.remote_settings.crlite_filters.enabled", true);

// Disable OCSP
defaultPref("security.OCSP.enabled", 0);
defaultPref("security.OCSP.require", false);

// Disable third-party/OS-level root certificates
defaultPref("security.certerrors.mitm.auto_enable_enterprise_roots", false);
defaultPref("security.enterprise_roots.enabled", false);

defaultPref("dom.security.https_only_mode_error_page_user_suggestions", true); // Show suggestions when an HTTPS page can not be found

/** [SECTION] TLS/SSL */
pref("security.tls.enable_0rtt_data", false); // disable 0 RTT to improve tls 1.3 security
pref("network.http.http3.enable_0rtt", false);
pref("security.tls.version.enable-deprecated", false); // make TLS downgrades session only by enforcing it with pref(), default
defaultPref("browser.xul.error_pages.expert_bad_cert", true); // show relevant and advanced issues on warnings and error screens

defaultPref("security.insecure_field_warning.ignore_local_ip_address", false); // Do not ignore local addresses

defaultPref("security.ssl3.ecdhe_ecdsa_aes_128_sha", false);
defaultPref("security.ssl3.ecdhe_ecdsa_aes_256_sha", false);

/** [SECTION] PERMISSIONS */
pref("permissions.manager.defaultsUrl", ""); // revoke special permissions for some mozilla domains

/** [SECTION] SAFE BROWSING
 * disable safe browsing, including the fetch of updates. reverting the 7 prefs below
 * allows to perform local checks and to fetch updated lists from google.
 */
defaultPref("browser.safebrowsing.malware.enabled", false);
defaultPref("browser.safebrowsing.phishing.enabled", false);
defaultPref("browser.safebrowsing.blockedURIs.enabled", false);
defaultPref("browser.safebrowsing.provider.google4.gethashURL", "");
defaultPref("browser.safebrowsing.provider.google4.updateURL", "");
defaultPref("browser.safebrowsing.provider.google.gethashURL", "");
defaultPref("browser.safebrowsing.provider.google.updateURL", "");
/** disable safe browsing checks on downloads, both local and remote. the resetting prefs
 * control remote checks, while the first one is for local checks only.
 */
defaultPref("browser.safebrowsing.downloads.enabled", false);
pref("browser.safebrowsing.downloads.remote.enabled", false);
pref("browser.safebrowsing.downloads.remote.block_potentially_unwanted", false);
pref("browser.safebrowsing.downloads.remote.block_uncommon", false);
// empty for defense in depth
pref("browser.safebrowsing.downloads.remote.url", "");
pref("browser.safebrowsing.provider.google4.dataSharingURL", "");

/** [SECTION] OTHERS */
defaultPref("network.IDN_show_punycode", true); // use punycode in idn to prevent spoofing
defaultPref("pdfjs.enableScripting", false); // disable js scripting in the built-in pdf reader

/** ------------------------------
 * [CATEGORY] REGION
 * ------------------------------- */

/** [SECTION] LOCATION
 * replace google with beacondb as the default geolocation provide and prevent use of OS location services
 */
defaultPref(
  "geo.provider.network.url",
  "https://api.beacondb.net/v1/geolocate"
);
defaultPref("geo.provider.ms-windows-location", false); // [WINDOWS]
defaultPref("geo.provider.use_corelocation", false); // [MAC]
defaultPref("geo.provider.use_geoclue", false); // [LINUX]

/** [SECTION] LANGUAGE
 * show language as en-US for all users, regardless of their OS language and browser language.
 * both prefs must use pref() and not defaultPref to work.
 */
//pref("privacy.spoof_english", 2);
//pref("intl.accept_languages", "en-US, en");
// disable region specific updates from mozilla
pref("browser.region.network.url", "");
pref("browser.region.update.enabled", false);

/** ------------------------------
 * [CATEGORY] BEHAVIOR
 * ------------------------------- */

/** [SECTION] DRM */
defaultPref("media.eme.enabled", false); // master switch for drm content
defaultPref("media.gmp-manager.url", "data:text/plain,"); // prevent checks for plugin updates when drm is disabled
// disable the widevine and the openh264 plugins
defaultPref("media.gmp-provider.enabled", false);
defaultPref("media.gmp-gmpopenh264.enabled", false);
// but allow h264 itself.
defaultPref("media.webrtc.hw.h264.enabled", true);

/** [SECTION] SEARCH AND URLBAR
 * disable search suggestion and do not update opensearch engines.
 */

defaultPref("browser.urlbar.suggest.searches", false);
defaultPref("browser.search.suggest.enabled", false);
defaultPref("browser.search.update", false);
defaultPref("browser.search.separatePrivateDefault", true); // [FF70+] // Arkenfox user.js v119
defaultPref("browser.search.separatePrivateDefault.ui.enabled", true); // [FF71+]  // Arkenfox user.js v119
defaultPref("browser.search.serpEventTelemetryCategorization.enabled", false);

defaultPref("browser.urlbar.suggest.mdn", true);
defaultPref("browser.urlbar.addons.featureGate", false);
defaultPref("browser.urlbar.mdn.featureGate", false);
defaultPref("browser.urlbar.trending.featureGate", false);
defaultPref("browser.urlbar.weather.featureGate", false);
defaultPref("browser.urlbar.importantDates.featureGate", false);
defaultPref("browser.urlbar.market.featureGate", false);
defaultPref("browser.urlbar.yelp.featureGate", false);
defaultPref("browser.urlbar.yelpRealtime.featureGate", false);

// these are from Arkenfox, I decided to put them here.
defaultPref("browser.download.start_downloads_in_tmp_dir", true); // Arkenfox user.js v118

/** the pref disables the whole feature and hide it from the ui
 * (as noted in https://bugzilla.mozilla.org/show_bug.cgi?id=1755057).
 * this also includes the best match feature, as it is part of firefox suggest.
 */
pref("browser.urlbar.quicksuggest.enabled", false);
defaultPref("browser.urlbar.suggest.weather", false); // disable weather suggestions in urlbar once they are no longer behind feature gate

/** [SECTION] DOWNLOADS
 * user interaction should always be required for downloads, as a way to enhance security by asking
 * the user to specific a certain save location.
 */
defaultPref("browser.download.useDownloadDir", false);
defaultPref("browser.download.autohideButton", false); // do not hide download button automatically
defaultPref("browser.download.manager.addToRecentDocs", false); // do not add downloads to recents
defaultPref("browser.download.alwaysOpenPanel", false); // do not expand toolbar menu for every download, we already have enough interaction

/** [SECTION] AUTOPLAY
 * block autoplay unless element is right-clicked. this means background videos, videos in a different tab,
 * or media opened while other media is played will not start automatically.
 * thumbnails will not autoplay unless hovered. exceptions can be set from the UI.
 */
defaultPref("media.autoplay.default", 5);

/** [SECTION] POP-UPS AND WINDOWS
 * prevent scripts from resizing existing windows and opening new ones, by forcing them into
 * new tabs that can't be resized as well.
 */
defaultPref("dom.disable_window_move_resize", true);
defaultPref("browser.link.open_newwindow", 3);
defaultPref("browser.link.open_newwindow.restriction", 0);

/** [SECTION] MOUSE */
defaultPref("browser.tabs.searchclipboardfor.middleclick", false); // prevent mouse middle click on new tab button to trigger searches or page loads

/** [SECTION] MACHINE LEARNING **/
// See ticket: #1919 - LibreWolf should delete all AI code - https://codeberg.org/librewolf/issues/issues/1919
defaultPref("browser.ml.enable", false);
defaultPref("browser.ml.chat.enabled", false);
// some leftover menu still appears otherwise:
defaultPref("browser.ml.chat.menu", false);
defaultPref("browser.ml.linkPreview.supportedLocales", "null");
defaultPref("extensions.ui.mlmodel.hidden", true);
// disable smart tab groups
defaultPref("browser.tabs.groups.smart.enabled", false);
defaultPref("browser.tabs.groups.smart.userEnabled", false);

// Removes the AI pane
lockPref("browser.preferences.aiControls", false);

// These usually get set by the new AI Controls

lockPref("browser.ai.control.default", "blocked");
lockPref("browser.ai.control.linkPreviewKeyPoints", "blocked");
lockPref("browser.ai.control.pdfjsAltText", "blocked");
lockPref("browser.ai.control.sidebarChatbot", "blocked");
lockPref("browser.ai.control.smartTabGroups", "blocked");
lockPref("browser.ai.control.smartWindow", "blocked");

defaultPref("browser.ai.control.translations", "available");
/** ------------------------------
 * [CATEGORY] EXTENSIONS
 * ------------------------------- */

/** [SECTION] USER INSTALLED
 * extensions are allowed to operate on restricted domains, while their scope
 * is set to profile+applications (https://mike.kaply.com/2012/02/21/understanding-add-on-scopes/).
 * an installation prompt should always be displayed.
 */
defaultPref("extensions.webextensions.restrictedDomains", "");
defaultPref("extensions.enabledScopes", 5); // hidden
defaultPref("extensions.postDownloadThirdPartyPrompt", false);

/** [SECTION] SYSTEM
 * built-in extension are not allowed to auto-update. additionally the reporter extension
 * of webcompat is disabled. urls are stripped for defense in depth.
 */
defaultPref("extensions.systemAddon.update.enabled", false);
defaultPref("extensions.systemAddon.update.url", "");
lockPref("extensions.webcompat-reporter.enabled", false);
lockPref("extensions.webcompat-reporter.newIssueEndpoint", "");

/** [SECTION] EXTENSION FIREWALL
 * the firewall can be enabled with the below prefs, but it is not a sane default:
 * defaultPref("extensions.webextensions.base-content-security-policy", "default-src 'none'; script-src 'none'; object-src 'none';");
 * defaultPref("extensions.webextensions.base-content-security-policy.v3", "default-src 'none'; script-src 'none'; object-src 'none';");
 */

defaultPref("privacy.antitracking.isolateContentScriptResources", true);

defaultPref("devtools.aboutdebugging.showHiddenAddons", true); // Disabled for non MOZILLA_OFFICIAL builds

defaultPref("extensions.getAddons.langpacks.url", ""); // Since we do not allow installing langpacks

/** ------------------------------
 * [CATEGORY] BUILT-IN FEATURES
 * ------------------------------- */

/** [SECTION] UPDATER
 * since we do not bake auto-updates in the browser it doesn't make sense at the moment.
 */
lockPref("app.update.auto", false);

/** [SECTION] SYNC
 * this functionality is disabled by default but it can be activated in one click.
 * this pref fully controls the feature, including its ui.
 */
defaultPref("identity.fxaccounts.enabled", false);

/** [SECTION] LOCKWISE
 * disable the default password manager built into the browser, including its autofill
 * capabilities and formless login capture.
 */
defaultPref("signon.rememberSignons", false);
defaultPref("signon.autofillForms", false);
defaultPref("extensions.formautofill.addresses.enabled", false);
defaultPref("extensions.formautofill.creditCards.enabled", false);
defaultPref("signon.formlessCapture.enabled", false);

/** [SECTION] CONTAINERS
 * enable containers and show the settings to control them in the stock ui
 */
defaultPref("privacy.userContext.enabled", true);
defaultPref("privacy.userContext.ui.enabled", true);

/** [SECTION] DEVTOOLS
 * disable remote debugging.
 */
pref("devtools.debugger.remote-enabled", false); // default, but subject to branding so keep it
defaultPref("devtools.selfxss.count", 0); // required for devtools console to work

/** ------------------------------
 * [CATEGORY] UI
 * ------------------------------- */

/** [SECTION] BRANDING
 * set librewolf support and releases urls in the UI, so that users land in the proper places.
 */
defaultPref("app.support.baseURL", "https://support.librewolf.net/");
defaultPref(
  "browser.search.searchEnginesURL",
  "https://librewolf.net/docs/faq/#how-do-i-add-a-search-engine"
);
defaultPref(
  "browser.geolocation.warning.infoURL",
  "https://librewolf.net/docs/faq/#how-do-i-enable-location-aware-browsing"
);
defaultPref("app.feedback.baseURL", "https://librewolf.net/#questions");
defaultPref("app.releaseNotesURL", "https://codeberg.org/librewolf/source");
defaultPref(
  "app.releaseNotesURL.aboutDialog",
  "https://codeberg.org/librewolf/source"
);
defaultPref("app.update.url.details", "https://codeberg.org/librewolf/source");
defaultPref("app.update.url.manual", "https://codeberg.org/librewolf/source");

/** [SECTION] FIRST LAUNCH
 * disable what's new, ui tour, and privacy notice/terms of use on first start and updates. the browser
 * should also not stress user about being the default one.
 */
defaultPref("browser.shell.checkDefaultBrowser", false);
defaultPref("browser.startup.homepage_override.mstone", "ignore");
lockPref("browser.uitour.enabled", false);
lockPref("browser.uitour.url", "");
lockPref("datareporting.policy.dataSubmissionPolicyAcceptedVersion", 999);
lockPref("datareporting.policy.dataSubmissionPolicyBypassNotification", true);
lockPref(
  "datareporting.policy.dataSubmissionPolicyNotifiedTime",
  "32503679999000"
);
lockPref("startup.homepage_override_nimbus_disable_wnp", true);
defaultPref("startup.homepage_override_url", "about:blank");
defaultPref("startup.homepage_welcome_url", "about:blank");
defaultPref("startup.homepage_welcome_url.additional", "");
lockPref("termsofuse.acceptedDate", "32503679999000");
lockPref("termsofuse.acceptedVersion", 999);
lockPref("termsofuse.bypassNotification", true);

/** [SECTION] NEW TAB PAGE
 * we want NTP to display nothing but the search bar without anything distracting.
 * the three prefs below are just for minimalism and they should be easy to revert for users.
 */
defaultPref(
  "browser.newtabpage.activity-stream.section.highlights.includeDownloads",
  false
);
defaultPref(
  "browser.newtabpage.activity-stream.section.highlights.includeVisited",
  false
);
defaultPref("browser.newtabpage.activity-stream.feeds.topsites", false);
// hide stories and sponsored content from Firefox Home
lockPref("browser.newtabpage.activity-stream.feeds.section.topstories", false);
lockPref("browser.newtabpage.activity-stream.showSponsored", false);
lockPref("browser.newtabpage.activity-stream.showSponsoredTopSites", false);
// disable telemetry in Firefox Home
lockPref("browser.newtabpage.activity-stream.feeds.telemetry", false);
lockPref("browser.newtabpage.activity-stream.telemetry", false);
lockPref("browser.newtabpage.activity-stream.default.sites", "");
// disable weather info fetching (ticket #2048)
defaultPref("browser.newtabpage.activity-stream.feeds.weatherfeed", false);
defaultPref("browser.newtabpage.activity-stream.showWeather", false);

/** [SECTION] ABOUT
 * remove annoying ui elements from the about pages, including about:protections
 */
defaultPref("browser.contentblocking.report.lockwise.enabled", false);
lockPref("browser.contentblocking.report.hide_vpn_banner", true);
lockPref("browser.contentblocking.report.show_mobile_app", false);
lockPref("browser.vpn_promo.enabled", false);
lockPref("browser.promo.focus.enabled", false);
// ...about:addons recommendations sections and more
defaultPref("extensions.htmlaboutaddons.recommendations.enabled", false);
defaultPref("extensions.getAddons.showPane", false);
// ...about:preferences#home
defaultPref("browser.topsites.useRemoteSetting", false); // hide sponsored shortcuts button
defaultPref("browser.topsites.contile.enabled", false);
// ...and about:config
defaultPref("browser.aboutConfig.showWarning", false);
// hide about:preferences#moreFromMozilla
defaultPref("browser.preferences.moreFromMozilla", false);

/** [SECTION] RECOMMENDED
 * disable all "recommend as you browse" activity.
 */
lockPref(
  "browser.newtabpage.activity-stream.asrouter.userprefs.cfr.features",
  false
);
lockPref(
  "browser.newtabpage.activity-stream.asrouter.userprefs.cfr.addons",
  false
);

/** [SECTION] OTHERS
 * other unwanted UI
 */
// hide pxi ads on toolbar firefox sync button
lockPref("identity.fxaccounts.toolbar.pxiToolbarEnabled", false);
// remove the "send to device" tab by default from opt-in sidebar layout
defaultPref("sidebar.main.tools", "history");

// Avoids the "Firefox Labs" section from shortly appearing on first launch
defaultPref("browser.preferences.experimental.hidden", true); 

// Until the new UI is finished upstream
lockPref("browser.settings-redesign.enabled", false);

/** ------------------------------
 * [CATEGORY] TELEMETRY
 * telemetry is already disabled elsewhere and most of the stuff in here is just for redundancy.
 * ------------------------------- */
lockPref("toolkit.telemetry.unified", false); // master switch
lockPref("toolkit.telemetry.enabled", false); // master switch
lockPref("toolkit.telemetry.server", "data:,");
lockPref("toolkit.telemetry.archive.enabled", false);
lockPref("toolkit.telemetry.newProfilePing.enabled", false);
lockPref("toolkit.telemetry.updatePing.enabled", false);
lockPref("toolkit.telemetry.firstShutdownPing.enabled", false);
lockPref("toolkit.telemetry.shutdownPingSender.enabled", false);
lockPref("toolkit.telemetry.bhrPing.enabled", false);
lockPref("toolkit.telemetry.cachedClientID", "");
lockPref("toolkit.telemetry.previousBuildID", "");
lockPref("toolkit.telemetry.server_owner", "");
lockPref("toolkit.coverage.opt-out", true); // hidden
lockPref("toolkit.coverage.enabled", false);
lockPref("toolkit.coverage.endpoint.base", "");
lockPref("datareporting.healthreport.uploadEnabled", false);
lockPref("datareporting.policy.dataSubmissionEnabled", false);
// opt-out of normandy and studies
lockPref("app.normandy.enabled", false);
lockPref("app.normandy.api_url", "");
lockPref("app.shield.optoutstudies.enabled", false);
// disable personalized extension recommendations
lockPref("browser.discovery.enabled", false);
// disable crash report
lockPref("browser.tabs.crashReporting.sendReport", false);
lockPref("breakpad.reportURL", "");
lockPref("browser.crashReports.onDemand", false);
lockPref("browser.crashReports.requestedNeverShowAgain", true);
// disable connectivity checks
pref("network.connectivity-service.enabled", false);
// disable captive portal
pref("network.captive-portal-service.enabled", false);
pref("captivedetect.canonicalURL", "");
// disable Privacy-Preserving Attribution
pref("dom.private-attribution.submission.enabled", false);
// disable daily usage pings
lockPref("datareporting.usage.uploadEnabled", false);

// Disable and deregister the Glean add-on ping scheduler
// https://codeberg.org/celenity/Phoenix/commit/1ff7ae1dbd3095c993a73af69c6bb2a6ad700c55
lockPref("extensions.gleanPingAddons.daily.interval", 2147483647);
lockPref("extensions.gleanPingAddons.updated.delay", 2147483647);
lockPref("extensions.gleanPingAddons.updated.idleTimeout", 2147483647);
lockPref("extensions.gleanPingAddons.updated.testing", false);
clearPref("app.update.lastUpdateTime.glean-addons-daily");

lockPref("nimbus.rollouts.enabled", false);

// Added via patches/autoconfig-setEnv.patch
setEnv("MOZ_GFX_CRASH_MOZ_CRASH", 1); // https://searchfox.org/firefox-main/rev/0989a082704f0bda8d370ccd57402645d834757e/gfx/thebes/gfxPlatform.cpp#381

/** ------------------------------
 * [CATEGORY] WINDOWS
 * the prefs in this section only apply to windows installations and they don't have any
 * effect on linux, macos and bsd users.
 * ------------------------------- */

/** [SECTION] UPDATES
 * disable windows specific update services.
 */
lockPref("app.update.service.enabled", false);

/** [SECTION] OTHERS */
lockPref("default-browser-agent.enabled", false); // disable windows specific telemetry
pref("toolkit.winRegisterApplicationRestart", false); // disable automatic start and session restore after reboot

/** ------------------------------
 * [CATEGORY] LIBREWOLF
 * prefs introduced by librewolf-specific patches
 * ------------------------------- */
defaultPref(
  "librewolf.uBO.assetsBootstrapLocation",
  "https://codeberg.org/librewolf/source/raw/branch/main/assets/uBOAssets.json"
);
defaultPref("librewolf.aboutMenu.checkVersion", false);
defaultPref("librewolf.hidePasswdmgr", false);
defaultPref("librewolf.debugger.force_detach", false);
defaultPref("librewolf.console.logging_disabled", false);
defaultPref(
  "librewolf.services.settings.allowedCollections",
  "security-state/*,main/tracking-protection-lists,main/public-suffix-list,main/translations-models-v2,main/translations-wasm-v2,main/translations-identification-models,main/addons-manager-settings,main/anti-tracking-url-decoration,main/hijack-blocklists,blocklists/gfx,blocklists/addons-bloomfilters,main/addons-data-leak-blocker-domains,main/cookie-banner-rules-list,main/query-stripping,blocklists/addons,blocklists/plugins,main/url-parser-default-unknown-schemes-interventions,main/webcompat-interventions,main/bounce-tracking-protection-exceptions,main/fingerprinting-protection-overrides,main/partitioning-exempt-urls,main/password-recipes,main/third-party-cookie-blocking-exempt-urls,main/url-classifier-exceptions,main/url-classifier-skip-urls"
);
defaultPref(
  "librewolf.services.settings.allowedCollectionsFromDump",
  "main/search-config-v2,main/search-config-icons,main/bounce-tracking-protection-exceptions"
);

defaultPref("librewolf.getBrowserInfo.setToFirefoxDefaults", true);

// Added via patches/moz-official.patch
defaultPref("librewolf.devHelpers", false);

/** ------------------------------
 * [CATEGORY] OVERRIDES
 * allow settings to be overriden with a file placed in the right location
 * https://librewolf.net/docs/settings/#where-do-i-find-my-librewolfoverridescfg
 * Moved to patches/profile-directory.patch
 * ------------------------------- */
