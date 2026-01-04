import HeaderTab from "../Styles/templates/HeaderTab.tsx";
import header from "../Styles/Header.module.css"
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useSession} from "../customHooks/useSession.ts";

const Header = () => {
    const user = useSession()
    const location = useLocation()
    const [tabActive,setTabActive] = useState('Библиотека')
    const nav = useNavigate()
    useEffect(() => {
        const pathname = location.pathname
        if (pathname.includes('/main')){
            setTabActive('Библиотека')
        }
        if (pathname.includes('/userCourses')){
            setTabActive('Мои курсы')
        }
        if (pathname.includes('/profile')){
            setTabActive('Профиль')
        }
        if (pathname.includes('/taskDB')){
            setTabActive('База заданий')
        }
    }, [location]);
    return (
        <header className={header.header}>
            <p className={header.title}>
                Умлайт
            </p>
            <section className={header.buttons}>
                <HeaderTab title = 'Библиотека' isActive={(tabActive === 'Библиотека')} onClick={() => {
                    setTabActive('Библиотека')
                    nav(`/main/${user.role + '_' + user.userId}`)
                }}/>
                <HeaderTab title = 'Мои курсы' isActive={(tabActive === 'Мои курсы')} onClick={() => {
                    setTabActive('Мои курсы')
                    nav(`/userCourses/${user.role + '_' + user.userId}`)
                }}/>
                <HeaderTab title = 'Поиск преподавателей' isActive={(tabActive === 'Поиск преподавателей')} onClick={() => setTabActive('Поиск преподавателей')}/>
                <HeaderTab title = 'Профиль' isActive={(tabActive === 'Профиль')} onClick={() => {
                    setTabActive('Профиль')
                    nav(`/profile/${user.role + '_' + user.userId}`)
                }}/>
                <HeaderTab title = 'База заданий' isActive={(tabActive === 'База заданий')} onClick={() => {
                    setTabActive('База заданий')
                    nav('/taskDB')
                }}/>
                <HeaderTab title = 'Связь с нами' isActive={(tabActive === 'Связь с нами')} onClick={() => setTabActive('Связь с нами')}/>
                <img src={'http://localhost:8080/siteImages/Settings.svg'} alt={"Настройки"}/>
            </section>
        </header>
    );
};

export default Header;