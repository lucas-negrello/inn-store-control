import {Navigate} from "react-router-dom";
import type {IFallbackProps} from "@/routes/types.ts";

export default function ({ route, relative, replace }: IFallbackProps){
    return <Navigate to={route ?? '/home'} replace={replace ?? true} relative={relative} />
}