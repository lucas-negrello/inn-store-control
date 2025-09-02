import type {TPermission} from "@/api/models/Permissions.interface.ts";

interface IRouteConfig {
    path: string;
    roles?: string[];
    permissions?: TPermission[];
    requireAll?: boolean;
}

export class AccessControlService {
    private static routeConfigs: IRouteConfig[] = [
        {
            path: '/stock',
            roles: ['admin', 'manager'],
            permissions: ['read'],
            requireAll: false
        },
        {
            path: '/maintenance',
            roles: ['admin', 'manager'],
            permissions: ['read'],
            requireAll: false
        },
        {
            path: '/market',
            roles: ['admin', 'manager'],
            permissions: ['read'],
            requireAll: false
        },
        {
            path: '/reports',
            roles: ['admin'],
            permissions: ['read'],
            requireAll: false
        },
    ];

    static getRouteConfig(path: string): IRouteConfig | undefined {
        return this.routeConfigs.find(config => config.path === path);
    }

    static addRouteConfig(config: IRouteConfig): void {
        const existingIndex = this.routeConfigs.findIndex(c => c.path === config.path);
        if (existingIndex >= 0) this.routeConfigs[existingIndex] = config;
        else this.routeConfigs.push(config);
    }

    static removeRouteConfig(path: string): void {
        this.routeConfigs = this.routeConfigs.filter(config => config.path !== path);
    }
}