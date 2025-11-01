import {useEffect} from "react";
import {useSession} from "../customHooks/useSession.ts";

const Profile = () => {
    const user = useSession()
    useEffect(() => {
        console.log('user: ', user)
    }, [user]);
    return (
        <div>
            <p>User: {[user.userId, user.role]}</p>
        </div>
    );
};

export default Profile;