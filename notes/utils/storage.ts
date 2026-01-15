import { defineExtensionStorage } from '@webext-core/storage';

export type SyncExtStorage = {
    split: number;
    notes: string[];
} & {
    [K in string as `note:${K}`]?: {
        title: string;
        content: string;
    };
};

export const syncExtStorage = defineExtensionStorage<SyncExtStorage>(browser.storage.sync);
