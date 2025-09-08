import HeaderTab from "../Styles/templates/HeaderTab.tsx";
import header from "../Styles/Header.module.css"
import {useState} from "react";

const Header = () => {
    const [tabActive,setTabActive] = useState('Библиотека')
    return (
        <header className={header.header}>
            <p className={header.title}>
                Умлайт
            </p>
            <section className={header.buttons}>
                <HeaderTab title = 'Библиотека' isActive={(tabActive === 'Библиотека')} onClick={() => setTabActive('Библиотека')}/>
                <HeaderTab title = 'Мои курсы' isActive={(tabActive === 'Мои курсы')} onClick={() => setTabActive('Мои курсы')}/>
                <HeaderTab title = 'Поиск преподавателей' isActive={(tabActive === 'Поиск преподавателей')} onClick={() => setTabActive('Поиск преподавателей')}/>
                <HeaderTab title = 'Профиль' isActive={(tabActive === 'Профиль')} onClick={() => setTabActive('Профиль')}/>
                <HeaderTab title = 'База заданий' isActive={(tabActive === 'База заданий')} onClick={() => setTabActive('База заданий')}/>
                <HeaderTab title = 'Связь с нами' isActive={(tabActive === 'Связь с нами')} onClick={() => setTabActive('Связь с нами')}/>
                <img src={'http://localhost:8080/siteImages/Settings.svg'} alt={"Настройки"}/>
            </section>
        </header>
    );
};

export default Header;