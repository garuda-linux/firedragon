export interface TopPage {
  bookmarkGuid: string | null;
  frecency: number;
  guid: string;
  hostname: string;
  lastVisitDate: number;
  favicon: string;
  title: string;
  type: "history" | "bookmark";
  typedBonus: boolean;
  url: string;
}
