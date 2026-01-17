import { defineExtensionStorage } from '@webext-core/storage';

export interface LocalExtStorage {
    workspaces: Workspace[];
}

export const localExtStorage = defineExtensionStorage<LocalExtStorage>(browser.storage.local);
