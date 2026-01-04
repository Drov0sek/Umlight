import {Navigate, Outlet} from "react-router";
import {useEffect, useRef, useState} from "react";
import {useSession} from "./customHooks/useSession.ts";
import {useNavigate} from "react-router-dom";


const ProtectedRoutes = () => {
    const startTime = useRef<number>(Date.now())
    const nav = useNavigate()
    const date = new Date()
    const userTimeDate = `${date.getDate()}.${date.getMonth() + 1}`
    const {userId, role} = useSession()
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
                nav('/')

            }
        }
        getSession()
    }, []);
    useEffect(() => {
        async function getActiveTime(){
            const activeTime = Date.now() - startTime.current;
            const data = new Blob(
                [JSON.stringify({
                    activeTime,
                    userId,
                    role,
                    userTimeDate
                })],
                { type: 'application/json' }
            );

            navigator.sendBeacon(
                'http://localhost:4200/api/setActiveTime',
                data
            );
        }

        window.addEventListener('beforeunload', getActiveTime);
        return () => {
            window.removeEventListener('beforeunload', getActiveTime);
        };
    }, [userId, role]);
    if (hasSession !== undefined && !hasSession){
        return <Navigate to={'/'} replace/>
    }
    return <Outlet/>
};

export default ProtectedRoutes;