import {useSession} from "../customHooks/useSession.ts";
import UserInfo from "./UserInfo.tsx";
import profileStyle from '../Styles/ProfileStyles/Profile.module.css'
import {Outlet} from "react-router";

const Profile = () => {
    const user = useSession()
    return (
        <main className={profileStyle.profile}>
            <UserInfo userId={user.userId} role={user.role}/>
            <section>
                <p>Статистика</p>
            </section>
            <Outlet/>
        </main>
    );
};

export default Profile;