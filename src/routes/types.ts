export interface IFallbackProps {
    route?: string;
    relative?: 'route' | 'path';
    replace?: boolean;
}

export interface IPrivateRouteProps {
    isAllowed: boolean;
    userId?: string;
    fallbackProps?: IFallbackProps;
}