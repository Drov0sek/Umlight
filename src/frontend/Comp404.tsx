import {Link} from "react-router-dom";

const Comp404 = () => {
    return (
        <div>
            <h1>
                Упс... Вы зашли куда-то не туда!Вернитесь на главную страницу
            </h1>
            <Link to={'/'}>
                <button>Вернуться</button>
            </Link>
        </div>
    );
};

export default Comp404;