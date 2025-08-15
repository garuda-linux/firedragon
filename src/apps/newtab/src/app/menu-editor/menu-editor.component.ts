import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  untracked,
  ViewChild,
} from "@angular/core";
import { Toolbar } from "primeng/toolbar";
import { Button } from "primeng/button";
import { type Table, TableModule } from "primeng/table";
import type { MenuBarItems, MenuBarLink } from "../types";
import { ConfigService } from "../../config/config.service";
import { ConfirmationService } from "primeng/api";
import { MessageToastService } from "@garudalinux/core";
import { TranslocoDirective, TranslocoService } from "@jsverse/transloco";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { InputText } from "primeng/inputtext";
import { Dialog } from "primeng/dialog";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-menu-editor",
  imports: [
    Toolbar,
    Button,
    TableModule,
    TranslocoDirective,
    IconField,
    InputIcon,
    InputText,
    Dialog,
    FormsModule,
  ],
  templateUrl: "./menu-editor.component.html",
  styleUrl: "./menu-editor.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuEditorComponent {
  @ViewChild("linkTable")
  linkTable!: Table;

  menuLinks = signal<MenuBarItems>([]);
  link = signal<MenuBarLink>({} as MenuBarLink);
  linkDialog = signal<boolean>(false);
  linkSubmitted = signal<boolean>(false);
  selectedLinks = signal<MenuBarItems | null>(null);

  protected readonly configService = inject(ConfigService);

  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageToastService = inject(MessageToastService);
  private readonly translocoService = inject(TranslocoService);

  constructor() {
    effect(() => {
      this.menuLinks.set(this.configService.settings().customMenuLinks);
    });
    effect(() => {
      const currentSettings: MenuBarItems =
        untracked(this.configService.settings).customMenuLinks;
      const newSettings: MenuBarItems = this.menuLinks();

      if (currentSettings.length !== newSettings.length) {
        this.configService.updateConfig("customMenuLinks", newSettings);
        return;
      }

      for (const i in newSettings) {
        if (currentSettings[i].id !== newSettings[i].id) {
          this.configService.updateConfig("customMenuLinks", newSettings);
          break;
        }
      }
    });
  }

  /**
   * Open the link dialog for creating a new link.
   */
  openNew() {
    this.link.set({} as MenuBarLink);
    this.linkSubmitted.set(false);
    this.linkDialog.set(true);
  }

  /**
   * Open the link dialog for editing an existing link.
   * @param link The link to edit
   */
  editLink(link: MenuBarLink) {
    this.link.set({ ...link });
    this.linkDialog.set(true);
  }

  /**
   * Delete selected links after confirmation. Always keep the settings link.
   */
  deleteSelectedLinks() {
    this.confirmationService.confirm({
      message: this.translocoService.translate("settings.confirmDelete"),
      header: this.translocoService.translate("settings.confirm"),
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.menuLinks.update((links: MenuBarItems) =>
          links.filter((val: MenuBarLink) => {
            if (val.routerLink === "/settings") return true;
            return !this.selectedLinks()?.includes(val);
          })
        );
        this.selectedLinks.set(null);
        this.messageToastService.success(
          this.translocoService.translate("settings.success"),
          this.translocoService.translate("settings.linksDeleted"),
        );
      },
    });
  }

  /**
   * Hide the link dialog.
   */
  hideDialog() {
    this.linkDialog.set(false);
    this.linkSubmitted.set(false);
  }

  /**
   * Delete a link after confirmation.
   * @param link The link to delete
   */
  deleteLink(link: MenuBarLink) {
    this.confirmationService.confirm({
      message: `${
        this.translocoService.translate("settings.confirmDeleteLink")
      } ${link.label} ?`,
      header: this.translocoService.translate("settings.confirmHeader"),
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.menuLinks.update((links) =>
          links.filter((val) => val.id !== link.id)
        );
        this.link.set({} as MenuBarLink);
        this.messageToastService.success(
          this.translocoService.translate("settings.success"),
          this.translocoService.translate("settings.linkDeleted"),
        );
      },
    });
  }

  /**
   * Find the index of a link by its link as a string.
   * @param link The link ID to search for
   * @return The index of the link in the menuLinks array, or -1 if not found
   */
  findIndexById(link: string): number {
    let index = -1;
    for (let i = 0; i < this.menuLinks().length; i++) {
      if (this.menuLinks()[i].id === link) {
        index = i;
        break;
      }
    }
    return index;
  }

  /**
   * Generate a random ID for a new link.
   * @returns A random string of 5 characters
   */
  createId(): string {
    let id = "";
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  /**
   * Save the link after validation.
   */
  saveLink() {
    this.linkSubmitted.set(true);
    const link: MenuBarLink = this.link();

    if (link.id) {
      this.menuLinks.update((links: MenuBarItems) => {
        links[this.findIndexById(link.id)] = link;
        return [...links];
      });
      this.messageToastService.success(
        this.translocoService.translate("settings.success"),
        this.translocoService.translate("settings.linkUpdated"),
      );
    } else {
      link.id = this.createId();
      if (!link.icon) link.icon = "pi pi-heart";
      this.menuLinks.update((links: MenuBarItems) => [...links, link]);
      this.messageToastService.success(
        this.translocoService.translate("settings.success"),
        this.translocoService.translate("settings.linkCreated"),
      );
    }
    this.linkDialog.set(false);
    this.link.set({} as MenuBarLink);
  }

  /**
   * Reorder the links in the table. PrimeNG table does automatic reordering,
   * but doesn't update the signal. This method updates the signal with the new order.
   */
  onRowReorder() {
    const newLinks: MenuBarItems = [...this.menuLinks()];
    this.configService.updateConfig("customMenuLinks", newLinks);
  }
}
