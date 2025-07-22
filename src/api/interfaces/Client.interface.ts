export type TClient = keyof typeof CClient;

export const CClient = {
    axios: 'axios',
    fetch: 'fetch',
    mock: 'mock'
} as const;