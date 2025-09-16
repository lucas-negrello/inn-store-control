import {Route} from "react-router-dom";
import Fallback from "@/routes/FallbackRoutes.tsx";
import LayoutPublic from "@/layouts/LayoutPublic/Index.tsx";
import HomePage from "@/pages/public/home/HomePage.tsx";

export default function () {
    return (
        <Route path='/' element={<LayoutPublic />}>
            <Route index element={<HomePage />} />
            <Route path='*' element={<Fallback /> }  />
        </Route>
    );
}