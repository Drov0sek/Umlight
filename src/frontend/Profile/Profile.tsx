import {useSession} from "../customHooks/useSession.ts";
import UserInfo from "./UserInfo.tsx";
import profileStyle from '../Styles/ProfileStyles/Profile.module.css'
import {Outlet} from "react-router";
import TimeChecker from "./TimeChecker.tsx";
import EgeStats from "./EgeStats.tsx";
import StudentCourses from "./StudentCourses.tsx";
import {useNavigate} from "react-router-dom";

const Profile = () => {
    const user = useSession()
    const nav = useNavigate()

    async function logout(){
        try {
            const resp = await fetch('http://localhost:4200/api/logout', {
                method : 'POST',
                credentials : 'include'
            })
            if (!resp.ok){
                throw new Error()
            }
        } catch (e) {
            alert('Разлогирование произошло безуспешно. Попробуйте ещё раз позже')
        }
    }
    return (
        <main className={profileStyle.profile}>
            <UserInfo userId={user.userId} role={user.role}/>
            <p className={profileStyle.statsTitle}>Статистика</p>
            <section className={profileStyle.statsBlock}>
                <TimeChecker userId={user.userId} role={user.role}/>
                <p className={profileStyle.egeTitle}>Предметы ЕГЭ</p>
                <section className={profileStyle.egeBlock}>
                    <EgeStats userId={user.userId} role={user.role}/>
                </section>
                <p className={profileStyle.studentCoursesTitle}>Мои курсы</p>
                <section className={profileStyle.studentCoursesBlock}>
                    <StudentCourses userId={user.userId} role={user.role}/>
                </section>
            </section>
            <button onClick={async () => {
                await logout()
                nav('/')
            }}>Выйти</button>
            <Outlet/>
        </main>
    );
};

export default Profile;