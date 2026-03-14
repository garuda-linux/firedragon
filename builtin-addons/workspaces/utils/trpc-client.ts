import { createTRPCClient } from '@trpc/client';
import webextLink from 'trpc-webext/link';

export const trpc = createTRPCClient<Router>({
    links: [webextLink()],
});
