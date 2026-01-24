import UserInfo from "./UserInfo.tsx";
import profileStyle from '../Styles/ProfileStyles/Profile.module.css'
import {Outlet, useParams} from "react-router";
import TimeChecker from "./TimeChecker.tsx";
import EgeStats from "./EgeStats.tsx";
import StudentCourses from "./StudentCourses.tsx";
import {useNavigate} from "react-router-dom";
import TeacherCourses from "./TeacherCourses.tsx";
import {useEffect} from "react";
import {useSession} from "../customHooks/useSession.ts";

type UserType = {
    userId : number,
    role : string
}

const Profile = () => {
    const {userId, isRedirected} = useParams()
    const ogUser = useSession()
    const user : UserType = {
        userId : userId ? Number(userId.split('_')[1]) : 0,
        role : userId ? userId.split('_')[0] : ''
    }
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
            console.log(e)
            alert('Разлогирование произошло безуспешно. Попробуйте ещё раз позже')
        }
    }

    useEffect(() => {
        console.log(ogUser,user, isRedirected)
    }, [user, ogUser]);
    return (
        <main className={profileStyle.profile}>
            {(isRedirected !== 'false' || (Number(ogUser.userId) === Number(user.userId) && ogUser.role === user.role) ? <section>
                <UserInfo userId={user.userId} role={user.role} isRedirected = {isRedirected ? isRedirected : ''}/>
                <p className={profileStyle.statsTitle}>Статистика</p>
                <section className={profileStyle.statsBlock}>
                    <TimeChecker userId={user.userId} role={user.role}/>
                    {user.role === 'student' ? <section>
                        <p className={profileStyle.egeTitle}>Предметы ЕГЭ</p>
                        <section className={profileStyle.egeBlock}>
                            <EgeStats userId={user.userId} role={user.role}/>
                        </section>
                    </section> : <></>}
                    <p className={profileStyle.studentCoursesTitle}>Мои курсы</p>
                    <section className={profileStyle.studentCoursesBlock}>
                        {user.role === 'student' ? <StudentCourses userId={user.userId} role={user.role}/> : <TeacherCourses userId={user.userId} role={user.role}/>}
                    </section>
                </section>
                <button onClick={async () => {
                    await logout()
                    nav('/')
                }}>Выйти</button>
                <Outlet/>
            </section> : <></>)}
        </main>
    );
};

export default Profile;