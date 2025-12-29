import {Link} from "react-router-dom";
import {useSession} from "./customHooks/useSession.ts";

const Comp404 = () => {
    const {userId, role} = useSession()
    return (
        <div>
            <h1>
                Упс... Вы зашли куда-то не туда!Вернитесь на главную страницу
            </h1>
            {role === 'teacher' || role === 'student'
                ?
                <Link to={`/main/${role}_${userId}`}>
                    <button>Вернуться</button>
                </Link>
                :
                <Link to={'/'}>
                <button>Вернуться</button>
            </Link>}
        </div>
    );
};

export default Comp404;