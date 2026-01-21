export function getRequiredEnv(key) {
    const val = process.env[key];
    if (!val)
        throw new Error(`Missing env ${key}`);
    return val;
}
export function getNumberEnv(key, fallback) {
    const raw = process.env[key];
    if (!raw)
        return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
}
