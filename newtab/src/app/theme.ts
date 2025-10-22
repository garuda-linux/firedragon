import * as flavors from "@catppuccin/palette";
import {
  CatppuccinAura,
  CatppuccinAuraAlt,
  CatppuccinLara,
  CatppuccinLaraAlt,
  CatppuccinMaterial,
  CatppuccinMaterialAlt,
  CatppuccinNora,
  CatppuccinNoraAlt,
} from "@garudalinux/themes/catppuccin";
import {
  Vo1dedAura,
  Vo1dedLara,
  Vo1dedMaterial,
  Vo1dedNora,
} from "@garudalinux/themes/vo1ded";
import {
  Dr460nizedAura,
  Dr460nizedLara,
  Dr460nizedMaterial,
  Dr460nizedNora,
} from "@garudalinux/themes/dr460nized";

const { latte, mocha, frappe, macchiato } = flavors.flavors;

export const scrollbarColors = {
  primary: {
    light: `${latte.colors.surface0.hex} rgba(230, 233, 239, 0.5)`,
    dark: `${mocha.colors.surface0.hex} rgba(24, 24, 37, 0.5)`,
  },
  alt: {
    light: `${frappe.colors.surface0.hex} rgba(48, 52, 70, 0.5)`,
    dark: `${macchiato.colors.surface0.hex} rgba(36, 39, 58, 0.5)`,
  },
  vo1ded: {
    light: "#dfdafa #aa96ef",
    dark: "#8c6ce6 #4b2989",
  },
};
export const backgroundColors = {
  primary: {
    light: latte.colors.base.hex,
    dark: mocha.colors.base.hex,
  },
  alt: {
    light: frappe.colors.base.hex,
    dark: macchiato.colors.base.hex,
  },
  vo1ded: {
    light: "#fbfafe",
    dark: "#291d44",
  },
};

export const themes: AppThemes = {
  "Catppuccin Mocha/Latte Aura": CatppuccinAura,
  "Catppuccin Mocha/Latte Nora": CatppuccinNora,
  "Catppuccin Mocha/Latte Material": CatppuccinMaterial,
  "Catppuccin Mocha/Latte Lara": CatppuccinLara,
  "Catppuccin Macchiato/Frappe Aura": CatppuccinAuraAlt,
  "Catppuccin Macchiato/Frappe Nora": CatppuccinNoraAlt,
  "Catppuccin Macchiato/Frappe Material": CatppuccinMaterialAlt,
  "Catppuccin Macchiato/Frappe Lara": CatppuccinLaraAlt,
  "Dr460nized Aura": Dr460nizedAura,
  "Dr460nized Nora": Dr460nizedNora,
  "Dr460nized Material": Dr460nizedMaterial,
  "Dr460nized Lara": Dr460nizedLara,
  "Vo1ded Aura": Vo1dedAura,
  "Vo1ded Nora": Vo1dedNora,
  "Vo1ded Material": Vo1dedMaterial,
  "Vo1ded Lara": Vo1dedLara,
};

export type AppTheme =
  | "Catppuccin Mocha/Latte Aura"
  | "Catppuccin Mocha/Latte Nora"
  | "Catppuccin Mocha/Latte Material"
  | "Catppuccin Mocha/Latte Lara"
  | "Catppuccin Macchiato/Frappe Aura"
  | "Catppuccin Macchiato/Frappe Nora"
  | "Catppuccin Macchiato/Frappe Material"
  | "Catppuccin Macchiato/Frappe Lara"
  | "Dr460nized Aura"
  | "Dr460nized Nora"
  | "Dr460nized Material"
  | "Dr460nized Lara"
  | "Vo1ded Aura"
  | "Vo1ded Nora"
  | "Vo1ded Material"
  | "Vo1ded Lara";

export interface AppThemes {
  [key: string]: any;
}
