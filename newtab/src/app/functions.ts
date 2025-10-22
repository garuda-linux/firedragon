/**
 * Open a link in a new tab.
 * @param url The URL to open.
 */
export function openLinkInNewTab(url: string | undefined): void {
  if (!url) return;
  window.open(url, "_blank");
}
