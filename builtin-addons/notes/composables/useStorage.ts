import createStorage from '@firedragon/shared/vue/createStorage';

import { localExtStorage, syncExtStorage } from '@/utils/storage';

export const useLocalExtStorage = createStorage(localExtStorage);
export const useSyncExtStorage = createStorage(syncExtStorage);
