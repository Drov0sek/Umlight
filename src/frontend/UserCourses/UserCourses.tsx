import {useSession} from "../customHooks/useSession.ts";
import {useEffect, useState} from "react";
import CourseCard from "../Styles/templates/Courses/CourseCard.tsx";
import {useNavigate} from "react-router-dom";
import userCourses from '../Styles/UserCoursesStyles/UserCourses.module.css'

const UserCourses = () => {
    const user = useSession()
    const [courseIds, setCourseIds] = useState<number[]>([])
    const nav = useNavigate()

    useEffect(() => {
        async function getUserCourses(){
            if (user.role === 'teacher' || user.role === 'student'){
                try{
                    const resp = await fetch(`http://localhost:4200/api/getUserCourses/${user.userId}/${user.role}`, {
                        credentials : 'include'
                    })
                    if (resp.ok){
                        const coursesData : number[] = await resp.json()
                        setCourseIds(coursesData)
                    } else {
                        throw new Error()
                    }
                } catch (e) {
                    console.log(e)
                    alert('Что-то пошло не так при получении ваших курсов. Попробуйте зайти сюда позже')
                }
            }
        }
        getUserCourses()
    }, [user]);
    useEffect(() => {
        console.log(courseIds)
    }, [courseIds]);

    function renderCourses() {
        return <section className={userCourses.userCoursesBlock}>
            {courseIds.map(e => <div>
                <CourseCard courseId={e}/>
            </div>)}
            {courseIds.map(e => <div>
                <CourseCard courseId={e}/>
            </div>)}
        </section>
    }
    return (
        <main>
            {renderCourses()}
            {user.role === 'teacher' ? <button className={userCourses.createCourseBtn} onClick={() => nav('/courseConstructor')}>Создать курс</button> : <></>}
        </main>
    );
};

export default UserCourses;