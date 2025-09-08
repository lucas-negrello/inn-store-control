export type TClient = keyof typeof CClient;

export const CClient = {
    axios: 'axios',
    fetch: 'fetch',
    local: 'local',
} as const;