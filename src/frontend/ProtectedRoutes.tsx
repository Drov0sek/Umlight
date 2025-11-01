// import {useSelector} from "react-redux";
// import type {RootState} from "./store/store.ts";
import {Navigate, Outlet} from "react-router";
import {useEffect, useState} from "react";


const ProtectedRoutes = () => {
    // const isAuth = useSelector((state: RootState) => state.authController.isOnline);
    const [hasSession, setHasSession] = useState<boolean>()
    useEffect(() => {
        async function getSession() {
            try {
                const resp = await fetch('http://localhost:4200/api/auth',{
                    credentials : 'include'
                })
                if (resp.ok){
                    setHasSession(true)
                }
                else {
                    setHasSession(false)
                    throw new Error()
                }
            } catch (e) {
                console.log(e)
                alert('Сессия закончилось. Авторизуйтесь снова')
            }
        }
        getSession()
    }, []);
    if (hasSession !== undefined && !hasSession){
        return <Navigate to={'/'} replace/>
    }
    return <Outlet/>
};

export default ProtectedRoutes;