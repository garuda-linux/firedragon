import { createStorage } from '@firedragon/shared/vue';

import { localExtStorage, syncExtStorage } from '@/utils/storage';

export const useLocalExtStorage = createStorage(localExtStorage);
export const useSyncExtStorage = createStorage(syncExtStorage);
