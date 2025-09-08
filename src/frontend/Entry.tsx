
import entry from './Styles/Entry.module.css'
import {Link} from "react-router";

const Entry = () => {
    return (
        <div className={entry.site}>
            <header className={entry.name}>
                <div>
                    <img src='https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTiIYEVBeDnTWCRgMuGkoSrsGddu-4tDkNL_jxjwYhaCDkOWmgaxvY2yF55HqpLEJajNv-a-zwyN83Q5HNC0TEC717EY4EMeGAFcpmrs1sGjyoNATVzEX9r' alt='тут будет лого'/>
                    <p className={entry.siteName}>Умлайт</p>
                </div>
                <p className={entry.desc}>образовательная платформа</p>
            </header>
            <main className={entry.pros}>
                <div>
                    <p className={entry.prosTitle}>Онлайн-курсы</p>
                    <p className={entry.prosText}>
                        Проходите курсы от ваших преподавателей или создайте собственный!
                    </p>
                </div>
                <div className={entry.center}>
                    <p className={entry.prosTitle}>Отслеживание прогресса</p>
                    <p className={entry.prosText}>
                        Всегда знайте, где вы находитесь: наглядное отслеживание прогресса поможет вам оставаться мотивированным и не сбиться с пути.
                    </p>
                </div>
                <div>
                    <p className={entry.prosTitle}>Проверьте свои знания</p>
                    <p className={entry.prosText}>
                        В нашей базе заданий вы найдете интерактивные упражнения, тесты и проекты, которые помогут применить ваши знания на практике.
                    </p>
                </div>
            </main>
            <section className={entry.buttons}>
                <Link to={'/register'}>
                    <button className={entry.register}>
                        Регистрация
                    </button>
                </Link>
                <Link to={'/login'}>
                    <button className={entry.login}>
                        Вход
                    </button>
                </Link>
            </section>
        </div>
    );
};

export default Entry;