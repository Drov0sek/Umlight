import {useSelector} from "react-redux";
import type {RootState} from "./store/store.ts";
import {Navigate, Outlet} from "react-router";


const ProtectedRoutes = () => {
    const isAuth = useSelector((state: RootState) => state.authController.isOnline);
    if (!isAuth){
        return <Navigate to={'/'} replace/>
    }
    return <Outlet/>
};

export default ProtectedRoutes;