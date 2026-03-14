import { defineExtensionStorage } from '@webext-core/storage';

export type LocalExtStorage = {
    split: number;
};

export type SyncExtStorage = {
    notes: string[];
} & {
    [K in string as `note:${K}`]?: {
        title: string;
        content: string;
    };
};

export const localExtStorage = defineExtensionStorage<LocalExtStorage>(browser.storage.local);
export const syncExtStorage = defineExtensionStorage<SyncExtStorage>(browser.storage.sync);
