import {Modal} from "../Styles/templates/Modal.tsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useSession} from "../customHooks/useSession.ts";
import infoEditor from '../Styles/ProfileStyles/InfoEditor.module.css'
import MultipleSelect from "../Styles/templates/MultipleSelect.tsx";

type StudentType = {
    id: number,
    name: string,
    login: string,
    password: string,
    surname: string | null,
    gender: string | null,
    nickname: string | null,
    email: string | null,
    age: number,
    image: string | null,
    description: string | null
}
type TeacherType = {
    age: number,
    email: string,
    image: string | null,
    password: string,
    id: number,
    name: string,
    login: string,
    surname: string,
    gender: string | null,
    description: string | null,
}
type DataType = {
    name : string,
    surname : string,
    desc : string,
    nickname : string,
    age : number,
    subjects : string[]
}

const InfoEditor = () => {
    const user = useSession()
    const nav = useNavigate()
    const [isOpened] = useState(true)
    const [nickname, setNickname] = useState<string>('')
    const [surnameName, setSurnameName] = useState<string>('')
    const [desc, setDesc] = useState<string>('')
    const [age, setAge] = useState<number>(0)
    const [isEdited, setIsEdited] = useState(false)
    const [subjects] = useState<string[]>(["Профильная математика","Русский язык","Информатика","Физика","Базовая математика","Химия","История","Обществознание","Биология","География","Английский язык","Немецкий язык","Французский язык","Испанский язык","Китайский язык","Литература"])
    const [userSubjects, setUserSubjects] = useState<string[]>([])

    useEffect(() => {
        async function getUserInfo(){
            try{
                if (user.role === 'student'){
                    const resp = await fetch(`http://localhost:4200/api/getStudentInfo/${user.userId}`)
                    if (resp.ok){
                        const studentData : StudentType = await resp.json()
                        if (studentData.nickname){
                            setNickname(studentData.nickname)
                        }
                        setSurnameName(studentData.surname + ' ' + studentData.name)
                        if (studentData.description){
                            setDesc(studentData.description)
                        }
                        setAge(studentData.age)
                    }
                    else {
                        throw new Error()
                    }
                }
                if (user.role === 'teacher'){
                    const resp = await fetch(`http://localhost:4200/api/getTeacherInfo/${user.userId}`)
                    if (resp.ok){
                        const teacherData : TeacherType = await resp.json()
                        setSurnameName(teacherData.surname + ' ' + teacherData.name)
                        if (teacherData.description){
                            setDesc(teacherData.description)
                        }
                        setAge(teacherData.age)
                    }
                    else {
                        throw new Error()
                    }
                }
            } catch (e) {
                console.log(e)
                alert('Произошла ошибка при получении данных. Зайдите сюда позже')
            }
        }
        getUserInfo()
    },[user, isEdited])
    useEffect(() => {
        async function getUserSubjects(){
            if (user.role === 'teacher' || user.role === 'student'){
                try{
                    const resp = await fetch(`http://localhost:4200/api/getUserSubjects/${user.userId}/${user.role}`)
                    if (resp.ok){
                        const subjectsData : string[] = await resp.json()
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
    }, [user, isEdited]);
    async function setNewInfo(){
        let newInfo : DataType
        if (surnameName.split(' ').length > 1){
            newInfo = {name : surnameName.split(' ')[1], surname : surnameName.split(' ')[0], age : age, desc : desc, nickname : nickname, subjects : userSubjects}
        }
        else {
            newInfo = {name : surnameName.split(' ')[0], surname : '', age : age, desc : desc, nickname : nickname, subjects : userSubjects}
        }
        if (user.role === 'teacher' || user.role === 'student'){
            try {
                const resp = await fetch(`http://localhost:4200/api/setNewInfo/${user.userId}/${user.role}`, {
                    headers : {
                        'Content-Type': 'application/json',
                    },
                    method : 'PUT',
                    body : JSON.stringify(newInfo),
                    credentials : 'include'
                })
                if (resp.ok){
                    alert('Информация обновлена!')
                    setIsEdited(true)
                } else {
                    throw new Error()
                }
            } catch (e) {
                console.log(e)
                alert('Что-то произошло не так при изменении информации')
            }
        }
    }

    return (
        <Modal isOpen={isOpened} onClose={() => nav(`/profile/${user.role}_${user.userId}/false`)} children={
            <section className={infoEditor.inputEditor}>
                {user.role === 'student' ? <section className={infoEditor.inputBlock}>
                    <p className={infoEditor.inputTitle}>Отображаемое имя</p>
                    <input className={infoEditor.inputText}
                           value={typeof nickname !== 'object' && typeof nickname !== 'undefined' ? nickname : ''}
                           type={'text'} onChange={e => setNickname(e.target.value)}/>
                </section> : <></>}
                <section className={infoEditor.inputBlock}>
                    <p className={infoEditor.inputTitle}>Описание</p>
                    <textarea className={infoEditor.inputText} rows={8}
                              value={typeof desc !== 'object' && typeof desc !== 'undefined' ? desc : ''}
                              onChange={e => setDesc(e.target.value)}></textarea>
                </section>
                <section className={infoEditor.inputBlock}>
                    <p className={infoEditor.inputTitle}>Фамилия Имя</p>
                    <input className={infoEditor.inputText} type={'text'} value={typeof surnameName !== 'object' && typeof surnameName !== 'undefined' ? surnameName : ''} onChange={e => setSurnameName(e.target.value)}/>
                </section>
                <section className={infoEditor.inputBlock}>
                    <p className={infoEditor.inputTitle}>Возраст</p>
                    <input className={infoEditor.inputText} type={'text'} value={typeof age !== 'object' && typeof age !== 'undefined' ? age : ''} onChange={e => setAge(Number(e.target.value))}/>
                </section>
                {user.role === 'student' ? <section className={infoEditor.inputBlock}>
                    <p className={infoEditor.inputTitle}>Предметы ГИА</p>
                    <MultipleSelect sentOptions={userSubjects} options={subjects}
                                    changer={(newSubjescts) => setUserSubjects(newSubjescts)}/>
                </section> : <></>}
                <button className={infoEditor.button} onClick={() => {
                    setNewInfo()
                    setIsEdited(false)
                    nav(`/profile/${user.role}_${user.userId}/false`, {
                        state: {updated: true}
                    })
                }}>Изменить</button>
            </section>
        }/>
    );
};

export default InfoEditor;