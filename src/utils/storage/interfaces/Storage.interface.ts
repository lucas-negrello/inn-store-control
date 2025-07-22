export type TStorage = keyof typeof CStorage;

export const CStorage = {
    local: 'local',
    session: 'session',
} as const;

export interface ICacheItem<T> {
    value: T;
    expiresAt: number; // Timestamp in milliseconds
}