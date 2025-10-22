export interface MenuBarLink {
  icon: string;
  label: string;
  routerLink?: string;
  url?: string;
  translocoKey: string;
  id: string;
}

export type MenuBarItems = MenuBarLink[];

export interface ContactLink {
  link: string;
  logo: string;
  routerLink?: string;
  subtitle: string;
  title: string;
}

export type ContactLinks = ContactLink[];

export interface ServiceLink {
  icon: string;
  link: string;
  routerLink?: string;
  subtitle: string;
  title: string;
  id: string;
}

export type ServiceLinks = ServiceLink[];

export interface WallpaperEntry {
  label: string;
  value: string | null;
}

export type WallpaperList = {
  label: string;
  items: WallpaperEntry[];
}[];

export interface Logo {
  label: string;
  value: string;
}

export type LogoList = {
  label: string;
  items: Logo[];
}[];
