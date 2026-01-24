import {useEffect, useState} from "react";
import teacherFinder from '../Styles/TeacherFinderStyles/TeacherFinder.module.css'
import {useNavigate} from "react-router-dom";

type TeacherType = {
    id: number,
    name: string,
    description: string | null,
    surname: string,
    email: string,
    login: string,
    password: string,
    gender: string | null,
    image: string | null,
    age: number | null
}

const TeacherFinder = () => {
    const [teachers, setTeachers] = useState<TeacherType[]>([])
    const nav = useNavigate()

    function getTeacherCards(){
        return teachers.map(e => {
            return <section key={teachers.indexOf(e)} className={teacherFinder.teacherFinderBlock} onClick={() => nav(`/profile/teacher_${e.id}/true`)}>
                <section className={teacherFinder.nameAndImgBlock}>
                    <img className={teacherFinder.image} src={e?.image !== null ? e?.image : 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTiIYEVBeDnTWCRgMuGkoSrsGddu-4tDkNL_jxjwYhaCDkOWmgaxvY2yF55HqpLEJajNv-a-zwyN83Q5HNC0TEC717EY4EMeGAFcpmrs1sGjyoNATVzEX9r'}/>
                    <p className={teacherFinder.name}>{e.surname} {e.name}</p>
                </section>
                <p className={teacherFinder.desc}>{e.description}</p>
            </section>
        })
    }

    useEffect(() => {
        async function getTeachers() {
            try {
                const resp = await fetch('http://localhost:4200/api/getAllTeachers')
                if (resp.ok) {
                    const data : TeacherType[] = await resp.json()
                    setTeachers(data)
                }
                else{
                    throw new Error()
                }
            } catch (e) {
                console.log(e)
                alert('Произошла ошибка при загрузке преподавателей. Зайдите сюда позже')
            }
        }
        getTeachers()
    }, []);
    return (
        <main className={teacherFinder.teacherFinder}>
            {getTeacherCards()}
        </main>
    );
};

export default TeacherFinder;