export const tryCatch = async (cb: () => Promise<any>) => {
    try {
        await cb();
        return;
    } catch (e) {
        return e;
    }
};
