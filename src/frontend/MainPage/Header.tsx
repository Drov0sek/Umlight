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
        if (pathname.includes('/teacherFinder')){
            setTabActive('Поиск преподавателей')
        }
        if (pathname.includes('/techSupport')){
            setTabActive('Связь с нами')
        }
        if (pathname.includes('/courseConstructor')){
            setTabActive('Мои курсы')
        }
    }, [location]);
    return (
        <header className={header.header}>
            <p className={header.title}>
                Умлайт
            </p>
            <section className={header.buttons}>
                <HeaderTab title = 'Библиотека' isActive={(tabActive === 'Библиотека')} onClick={() => {
                    nav(`/main/${user.role + '_' + user.userId}`)
                }}/>
                <HeaderTab title = 'Мои курсы' isActive={(tabActive === 'Мои курсы')} onClick={() => {
                    nav(`/userCourses/${user.role + '_' + user.userId}`)
                }}/>
                <HeaderTab title = 'Поиск преподавателей' isActive={(tabActive === 'Поиск преподавателей')} onClick={() => nav('/teacherFinder')}/>
                <HeaderTab title = 'Профиль' isActive={(tabActive === 'Профиль')} onClick={() => {
                    nav(`/profile/${user.role + '_' + user.userId}/${false}`)
                }}/>
                <HeaderTab title = 'База заданий' isActive={(tabActive === 'База заданий')} onClick={() => {
                    nav('/taskDB/false')
                }}/>
                <HeaderTab title = 'Связь с нами' isActive={(tabActive === 'Связь с нами')} onClick={() => nav('/techSupport')}/>
                {/*<img src={'http://localhost:8080/siteImages/Settings.svg'} alt={"Настройки"}/>*/}
            </section>
        </header>
    );
};

export default Header;