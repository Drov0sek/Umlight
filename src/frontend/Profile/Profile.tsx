import {useSession} from "../customHooks/useSession.ts";
import UserInfo from "./UserInfo.tsx";
import profileStyle from '../Styles/ProfileStyles/Profile.module.css'
import {Outlet} from "react-router";
import TimeChecker from "./TimeChecker.tsx";
import EgeStats from "./EgeStats.tsx";
import StudentCourses from "./StudentCourses.tsx";

const Profile = () => {
    const user = useSession()
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
            <Outlet/>
        </main>
    );
};

export default Profile;