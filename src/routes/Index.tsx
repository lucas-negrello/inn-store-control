import {BrowserRouter, Routes} from "react-router-dom";
import AuthRoutes from "@/routes/AuthRoutes.tsx";
import PublicRoutes from "@/routes/PublicRoutes.tsx";
import PrivateRoutes from "@/routes/PrivateRoutes.tsx";

export default function () {
    // Todo: Make a authentication service to get allow/don´t allow and userId for routes
    return (
        <BrowserRouter>
            <Routes>
                {AuthRoutes()}
                {PublicRoutes()}
                {PrivateRoutes({isAllowed: true, userId: '12345'})}
            </Routes>
        </BrowserRouter>
    );
}