import {Route} from "react-router-dom";
import Home from "@/modules/home/pages/Index.tsx";
import LayoutGeral from "@/layouts/LayoutGeral/Index.tsx";
import Fallback from "@/routes/FallbackRoutes.tsx";

export default function () {
    return (
        <Route path='/' element={<LayoutGeral />}>
            <Route index element={<Home />} />
            <Route path='*' element={<Fallback /> }  />
        </Route>
    );
}