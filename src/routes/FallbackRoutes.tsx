import {Navigate} from "react-router-dom";

type Props =  {
    route?: string;
    relative?: 'route' | 'path';
    replace?: boolean;
};

export default function ({ route, relative, replace }: Props){
    return <Navigate to={route ?? '/'} replace={replace ?? true} relative={relative} />
}