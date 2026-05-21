import { initTRPC } from '@trpc/server';
import { pEventIterator } from 'p-event';
import createWebextHandler, { type CreateWebextContextOptions } from 'trpc-webext/adapter';
import * as z from 'zod';

import { zAsyncIterable } from '@/utils/types';

export interface Context {
    port: import('webextension-polyfill').Runtime.Port;
    manager: WorkspacesManager;
}

const t = initTRPC.context<Context>().create({
    allowOutsideOfServer: true,
    isServer: false,
});

export const router = t.router({
    getWorkspaces: t.procedure
        .input(z.object({}))
        .output(z.array(zWorkspace))
        .query(({ ctx }) => ctx.manager.getWorkspaces()),
    getActiveWorkspaceForWindow: t.procedure
        .input(
            z.object({
                windowId: zWindowId,
            }),
        )
        .output(zWorkspaceId)
        .query(({ ctx, input }) => ctx.manager.getActiveWorkspaceForWindow(input.windowId)),

    onWorkspacesChanged: t.procedure
        .input(z.object({}))
        .output(zAsyncIterable({ yield: z.array(zWorkspace) }))
        .subscription(
            ({ ctx, signal }) =>
                pEventIterator(ctx.manager, 'workspacesChanged', { signal }) as AsyncIterable<Workspace[]>,
        ),
    onWindowDataChanged: t.procedure
        .input(
            z.object({
                windowId: zWindowId,
            }),
        )
        .output(zAsyncIterable({ yield: z.void() }))
        .subscription(async function* ({ ctx, input, signal }) {
            for await (const event of pEventIterator(ctx.manager, 'windowDataChanged', { signal })) {
                if (event === input.windowId) {
                    yield;
                }
            }
        }),

    createWorkspace: t.procedure
        .input(
            z.object({
                workspace: zWorkspace.omit({ id: true }),
            }),
        )
        .output(z.void())
        .mutation(({ ctx, input }) => ctx.manager.createWorkspace(input.workspace)),
    updateWorkspace: t.procedure
        .input(
            z.object({
                workspace: zWorkspace,
            }),
        )
        .output(z.void())
        .mutation(({ ctx, input }) => ctx.manager.updateWorkspace(input.workspace)),
    moveWorkspace: t.procedure
        .input(
            z.object({
                workspaceId: zWorkspaceId,
                direction: z.literal(-1).or(z.literal(1)),
            }),
        )
        .output(z.void())
        .mutation(({ ctx, input }) => ctx.manager.moveWorkspace(input.workspaceId, input.direction)),
    deleteWorkspace: t.procedure
        .input(
            z.object({
                workspaceId: zWorkspaceId,
            }),
        )
        .output(z.void())
        .mutation(({ ctx, input }) => ctx.manager.deleteWorkspace(input.workspaceId)),
    switchWorkspace: t.procedure
        .input(z.object({ windowId: zWindowId, workspaceId: zWorkspaceId }))
        .output(z.void())
        .mutation(({ ctx, input }) => ctx.manager.switchWorkspace(input.windowId, input.workspaceId)),
});

export type Router = typeof router;

export function createHandler(createContext: (options: CreateWebextContextOptions) => Promise<Context>) {
    return createWebextHandler({
        router,
        createContext,
    });
}
