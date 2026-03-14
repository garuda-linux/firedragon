import type { TrackedEnvelope } from '@trpc/server';
import { isTrackedEnvelope, tracked } from '@trpc/server';
import * as z from 'zod';

export const DEFAULT_WORKSPACE_ID: WorkspaceId = 'u6ir16ut7wjn4mkd0yiurcbv';
export const CONTEXT_MENU_ID = 'move-to-workspace';

export const zWorkspaceId = z.cuid2();
export type WorkspaceId = z.infer<typeof zWorkspaceId>;

export const zTabId = z.int();
export type TabId = z.infer<typeof zTabId>;

export const zWindowId = z.int();
export type WindowId = z.infer<typeof zWindowId>;

export const zWorkspace = z.object({
    id: zWorkspaceId,
    name: z.string(),
});
export type Workspace = z.infer<typeof zWorkspace>;

export const zMenuItemId = z.codec(z.templateLiteral([CONTEXT_MENU_ID, '--', zWorkspaceId]), zWorkspaceId, {
    encode: (value) => `${CONTEXT_MENU_ID}--${value}` as const,
    decode: (value) => value.split('--')[1],
});
export type MenuItemId = z.input<typeof zMenuItemId>;

function isAsyncIterable<TValue, TReturn = unknown>(value: unknown): value is AsyncIterable<TValue, TReturn> {
    return !!value && typeof value === 'object' && Symbol.asyncIterator in value;
}
const trackedEnvelopeSchema = z.custom<TrackedEnvelope<unknown>>(isTrackedEnvelope);
export function zAsyncIterable<
    TYieldIn,
    TYieldOut,
    TReturnIn = void,
    TReturnOut = void,
    Tracked extends boolean = false,
>(opts: { yield: z.ZodType<TYieldIn, TYieldOut>; return?: z.ZodType<TReturnIn, TReturnOut>; tracked?: Tracked }) {
    return z
        .custom<AsyncIterable<Tracked extends true ? TrackedEnvelope<TYieldIn> : TYieldIn, TReturnIn>>((val) =>
            isAsyncIterable(val),
        )
        .transform(async function* (iter) {
            const iterator = iter[Symbol.asyncIterator]();
            try {
                let next;
                while ((next = await iterator.next()) && !next.done) {
                    yield opts.yield.parseAsync(next.value);
                }
                if (opts.return) {
                    return await opts.return.parseAsync(next.value);
                }
                return;
            } finally {
                await iterator.return?.();
            }
        }) as z.ZodType<
        AsyncIterable<Tracked extends true ? TrackedEnvelope<TYieldIn> : TYieldIn, TReturnIn, unknown>,
        AsyncIterable<Tracked extends true ? TrackedEnvelope<TYieldOut> : TYieldOut, TReturnOut, unknown>
    >;
}
