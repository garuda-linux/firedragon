export default defineBackground(() => {
    const manager = new WorkspacesManager().initialized;
    createHandler(async ({ port }) => {
        return {
            port,
            manager: await manager,
        };
    });
});
