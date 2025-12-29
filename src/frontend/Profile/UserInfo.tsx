import {useEffect, useState} from "react";
import userInfoStyle from '../Styles/ProfileStyles/userInfo.module.css'
import {useLocation, useNavigate} from "react-router-dom";
type PropsType = {
    userId : number,
    role : string,
}
type StudentType = {
    id: number,
    name: string,
    login: string,
    password: string,
    surname: string | null,
    gender: string | null,
    nickname: string | null,
    email: string | null,
    age: number | null,
    image: string,
    description: string
}
type TeacherType = {
    id: number,
    name: string,
    login: string,
    password: string,
    surname: string,
    gender: string | null,
    email: string,
    image: string,
    description: string,
    age: number | null
}

const UserInfo = ({userId, role} : PropsType) => {
    const nav = useNavigate()
    const [student, setStudent] = useState<StudentType>({
        age: null,
        description: "",
        email: null,
        gender: null,
        id: 0,
        image: "",
        login: "",
        name: "",
        nickname: null,
        password: "",
        surname: null
    })
    const [teacher, setTeacher] = useState<TeacherType>({
        age: null,
        description: "",
        email: "",
        gender: null,
        id: 0,
        image: "",
        login: "",
        name: "",
        password: "",
        surname: ""
    })
    const {state} = useLocation()
    const [userSubjects, setUserSubjects] = useState<string[]>([])

    useEffect(() => {
        async function getUserInfo(){
            if (role === 'student'){
                try{
                    const resp = await fetch(`http://localhost:4200/api/getStudentInfo/${userId}`,{
                        credentials : 'include'
                    })
                    if (resp.ok){
                        const userInfo : StudentType = await resp.json()
                        setStudent(userInfo)
                    }
                    else {
                        console.log('jmhnbgvcd')
                        throw new Error()
                    }
                    const subjectsResp = await fetch(`http://localhost:4200/api/getUserSubjects/${userId}/${role}`, {
                        credentials : 'include'
                    })
                    if (resp.ok){
                        const subjects : string[] = await subjectsResp.json()
                        setUserSubjects(subjects)
                    }
                    else {
                        throw new Error()
                    }
                } catch (e) {
                    console.log(e)
                    alert('Произошла ошибка при получении данных. Попробуйте позже')
                }
            }
            if (role === 'teacher'){
                try{
                    const resp = await fetch(`http://localhost:4200/api/getTeacherInfo/${userId}`,{
                        credentials : 'include'
                    })
                    if (resp.ok){
                        const userInfo : TeacherType = await resp.json()
                        setTeacher(userInfo)
                    }
                    else {
                        throw new Error()
                    }
                    const subjectsResp = await fetch(`http://localhost:4200/api/getUserSubjects/${userId}/${role}`, {
                        credentials : 'include'
                    })
                    if (resp.ok){
                        const subjects : string[] = await subjectsResp.json()
                        setUserSubjects(subjects)
                    }
                    else {
                        throw new Error()
                    }
                } catch (e) {
                    console.log(e)
                    alert('Произошла ошибка при получении данных. Попробуйте позже')
                }
            }
        }
        getUserInfo()
    }, [userId, role, state?.updated]);
    useEffect(() => {
        async function getUserSubjects(){
            if (role === 'student' || role === 'teacher'){
                try{
                    const resp = await fetch(`http://localhost:4200/api/getUserSubjects/${userId}/${role}`, {
                        credentials : 'include'
                    })
                    if (resp.ok){
                        const subjectsData = await resp.json()
                        setUserSubjects(subjectsData)
                    } else {
                        throw new Error()
                    }
                } catch (e) {
                    console.log(e)
                    alert('Что-то пошло не так. Зайдите на сайт позже')
                }
            }
        }
        getUserSubjects()
    }, [userId,role, state?.updated]);
    useEffect(() => {
        console.log(userSubjects)
    }, [userSubjects]);

    function hasFullInfo(){
        const hasNullsInstudent = Object.values(student).some(e => e === null)
        const hasNullsInTeacher  = Object.values(teacher).some(e => e === null)
        if (userSubjects.length > 0 && role === 'student' && student?.name !== '' && student?.surname !== '' && student?.nickname !== '' && student?.description !== '' && student?.age !== 0 && hasNullsInstudent){
            return true
        }
        if (userSubjects.length > 0 && role === 'teacher' && teacher.name !== '' && teacher.surname !== '' && teacher.description !== '' && teacher.age !== 0 && hasNullsInTeacher){
            return true
        }
        return false
    }
    if (role === 'teacher'){
        return (
            <section className={userInfoStyle.userInfo}>
                <section className={userInfoStyle.nameAndImage}>
                    <section>
                        <img className={userInfoStyle.image} src={teacher?.image !== null ? teacher?.image : 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTiIYEVBeDnTWCRgMuGkoSrsGddu-4tDkNL_jxjwYhaCDkOWmgaxvY2yF55HqpLEJajNv-a-zwyN83Q5HNC0TEC717EY4EMeGAFcpmrs1sGjyoNATVzEX9r'}/>
                    </section>
                    <section>
                        <p className={userInfoStyle.name}>{teacher?.name}</p>
                    </section>
                </section>
                <section>
                    <section>
                        <p>Информация</p>
                        <img src={'http://localhost:8080/siteImages/Edit.svg'} alt={'Изменить информацию'}/>
                    </section>
                    <section>
                        <p>{teacher?.surname} {teacher?.name}</p>
                        <p>Фамилия имя</p>
                    </section>
                    <section>
                        <p>{teacher?.age} лет</p>
                        <p>Возраст</p>
                    </section>
                    <section>
                        <p>{teacher?.description}</p>
                        <p>Описание</p>
                    </section>
                </section>
            </section>
        );
    } else{
        return (
            <section className={userInfoStyle.userInfo}>
                <section className={userInfoStyle.nameAndImage}>
                    <section>
                        <img className={userInfoStyle.image}
                             src={student?.image !== null ? student?.image : 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTiIYEVBeDnTWCRgMuGkoSrsGddu-4tDkNL_jxjwYhaCDkOWmgaxvY2yF55HqpLEJajNv-a-zwyN83Q5HNC0TEC717EY4EMeGAFcpmrs1sGjyoNATVzEX9r'}/>
                    </section>
                    <section>
                        <p className={userInfoStyle.name}>{student?.nickname}</p>
                    </section>
                </section>
                <section className={userInfoStyle.infoTitle}>
                    <section className={userInfoStyle.titleChanger}>
                        <p className={userInfoStyle.title}>Информация</p>
                        <img className={userInfoStyle.titleImage} src={'http://localhost:8080/siteImages/Edit.svg'}
                             alt={'Изменить информацию'} onClick={() => nav(`/profile/${role}_${userId}/edit`)}/>
                    </section>
                    <p className={userInfoStyle.infoError}>{hasFullInfo() ? '' : 'Необходима дополнительная информация!'}</p>
                </section>
                <section className={userInfoStyle.infoBlock}>
                    <section>
                        <p className={userInfoStyle.info}>Ученик</p>
                        <p className={userInfoStyle.underHeading}>Тип аккаунта</p>
                    </section>
                    <section>
                        <p className={userInfoStyle.info}>{student?.surname} {student?.name}</p>
                        <p className={userInfoStyle.underHeading}>Фамилия имя</p>
                    </section>
                    <section>
                        <p className={userInfoStyle.info}>{student?.age} лет</p>
                        <p className={userInfoStyle.underHeading}>Возраст</p>
                    </section>
                    <section>
                        <p className={userInfoStyle.info}>{student?.description}</p>
                        <p className={userInfoStyle.underHeading}>Описание</p>
                    </section>
                    <section>
                        <p className={userInfoStyle.info}>{userSubjects.join(', ')}</p>
                        <p className={userInfoStyle.underHeading}>Предметы ЕГЭ</p>
                    </section>
                </section>
            </section>
        );
    }
};

export default UserInfo;