// import Header from "./Header.tsx";
import CourseCard from "../Styles/templates/Courses/CourseCard.tsx";
import {useEffect, useState} from "react";
import userCourses from "../Styles/UserCoursesStyles/UserCourses.module.css";

const Main = () => {
    const [courseIds, setCourseIds] = useState<number[]>([])

    useEffect(() => {
        async function getCourseIds(){
            try{
                const resp = await fetch('http://localhost:4200/api/getCourseIds')
                if (resp.ok){
                    const Ids: number[] = await resp.json()
                    setCourseIds(Ids)
                }
                else{
                    throw new Error()
                }
            } catch (e) {
                console.log(e)
                alert('Произошла ошибка при загрузке курсов. Зайдите на сат позже')
            }
        }
        getCourseIds()
    }, []);
    function renderCourses() {
        return <section className={userCourses.userCoursesBlock}>
            {courseIds.map(e => <div>
                <CourseCard courseId={e}/>
            </div>)}
        </section>
    }
    return (
        <section>
            {renderCourses()}
        </section>
    );
};

export default Main;