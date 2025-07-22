export type TStorage = keyof typeof CStorage;

export const CStorage = {
    local: 'local',
    session: 'session',
} as const;