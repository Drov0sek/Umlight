import {useEffect, useState} from "react";
import studentCourses from "../Styles/ProfileStyles/StudentCourses.module.css";
import ProgressCircle from "../Styles/templates/Courses/ProgressCircle.tsx";
import CircleLeaderLine from "../Styles/templates/Courses/TheoryLessons/CircleLeaderLine.tsx";

type PropsType = {
    userId : number,
    role : string
}
type CourseType = {
    id: number,
    name: string,
    description: string,
    time: number,
    titleImage: string,
    authorid: number
}
type TeacherType = {
    id: number,
    name: string,
    login: string,
    password: string,
    surname: string,
    gender: string | null,
    email: string,
    age: number | null,
    image: string | null,
    description: string | null
}
type SeenTeacherType = {
    courseId : number,
    name : string,
    surname : string
}
type userCourseDataType = {
    courseId : number,
    seenLessonsPercentage : number,
    donePracticeLessonsPercentage : number,
    seenModulesPercentage : number
}
type UserLessonTaskDataType = {
    tasksAmount : number,
    rightAnswersPercentage : number,
    lessonName : string
}

const StudentCourses = ({userId, role} : PropsType) => {
    const [coursesData, setCoursesData] = useState<CourseType[]>([])
    const [seenTeachersData, setSeenTeachersData] = useState<SeenTeacherType[]>([])
    const [isOpened, setIsOpened] = useState(true)
    const [userCoursesData, setUserCoursesData] = useState<userCourseDataType[]>([])
    const [userTasksData, setUserTasksData] = useState<UserLessonTaskDataType[][]>([[]])

    function renderCoursesData(){
        return coursesData.map(e => {
            return <section key={coursesData.indexOf(e)}>
                <section className={studentCourses.courseTitleBlock}>
                    <section>
                        <p className={studentCourses.courseTitle}>{e.name}</p>
                        <p className={studentCourses.courseAuthor}>{seenTeachersData.filter(r => r.courseId === e.id)[0]?.name} {seenTeachersData.filter(r => r.courseId === e.id)[0]?.surname}</p>
                    </section>
                    <img onClick={() => setIsOpened(!isOpened)} className={isOpened ? studentCourses.openedOpenBtn : studentCourses.closedOpenBtn} src={'http://localhost:8080/siteImages/Chevron%20down.svg'}/>
                </section>
                {isOpened ? <section>
                    {renderStats()}
                    {renderTaskStats(coursesData.map(r => r.id).indexOf(e.id))}
                </section> : <></>}
            </section>
        })
    }
    function renderStats(){
        return <section>
            <p className={studentCourses.statsTitle}>Успеваемость</p>
            {userCoursesData.map(e => {
                const size = 360
                return <section className={studentCourses.statsDiag} key={userCoursesData.indexOf(e)}>
                    <svg  overflow={'visible'} height={size} width={610}>
                        <ProgressCircle size={size} percent={Math.round((e.seenLessonsPercentage + e.donePracticeLessonsPercentage + e.seenModulesPercentage) / 3)} sign={'Средний результат'}/>
                        <CircleLeaderLine angleDeg={-45} topText={`${e.seenLessonsPercentage}% просмотренных занятий`} horizontalLength={350} bottomText={''}/>
                        <CircleLeaderLine angleDeg={0} topText={`${e.donePracticeLessonsPercentage}% выполненных практик`} horizontalLength={350} bottomText={''}/>
                        <CircleLeaderLine angleDeg={45} topText={`${e.seenModulesPercentage}% пройденных модулей`} horizontalLength={350} bottomText={''}/>
                    </svg>
                </section>
            })}
        </section>
    }
    function renderTaskStats(courseIndex : number){
        const courseTasks = userTasksData[courseIndex];
        if (!courseTasks || courseTasks.length === 0) {
            return <p>Нет данных по заданиям</p>;
        }
        return <section className={studentCourses.taskStatsTitle}>
            <p>{Math.round(userTasksData[courseIndex].map(e => e.rightAnswersPercentage).reduce((r, tmp) => tmp + r, 0) / userTasksData[courseIndex].map(e => e.rightAnswersPercentage).length)}% выполнения</p>
            <section className={studentCourses.lessonsTasksStatsBlock}>
                {userTasksData[courseIndex].map(e => {
                    return <section key={userTasksData[courseIndex].indexOf(e)} className={studentCourses.lessonTasksStatsBlock}>
                        <ProgressCircle percent={e.rightAnswersPercentage} sign={`${e.tasksAmount} заданий`}/>
                        <p className={studentCourses.lessonName}>{e.lessonName}</p>
                    </section>
                })}
            </section>
        </section>
    }

    useEffect(() => {
        if (role !== '') {
            async function getCoursesData(){
                try{
                    const resp = await fetch(`http://localhost:4200/api/getStudentCoursesData/${userId}`)
                    if (resp.ok){
                        const data : CourseType[] = await resp.json()
                        setCoursesData(data)
                    } else {
                        throw new Error()
                    }
                } catch (e) {
                    console.log(e)
                }
            }
            getCoursesData()
        }
    }, [userId, role]);
    useEffect(() => {
        if (!coursesData.length) return

        const getTeachers = async () => {
            try {
                const result = await Promise.all(
                    coursesData.map(async (course) => {
                        const resp = await fetch(
                            `http://localhost:4200/api/getTeacherInfo/${course.authorid}`
                        )
                        if (!resp.ok) throw new Error()

                        const data: TeacherType = await resp.json()
                        return {
                            courseId: course.id,
                            name: data.name,
                            surname: data.surname
                        }
                    })
                )

                setSeenTeachersData(result)
            } catch (e) {
                console.log(e)
            }
        }

        getTeachers()
    }, [coursesData])
    useEffect(() => {
        async function getUserCoursesData(){
            if (role !== ''){
                try{
                    for (let i = 0; i < coursesData.length; i++){
                        const resp1 = await fetch(`http://localhost:4200/api/getUserSeenLessonsAmount/${userId}/${coursesData[i].id}`)
                        const resp2 = await fetch(`http://localhost:4200/api/getUserSeenModulePercentage/${userId}/${coursesData[i].id}`)
                        const resp3 = await fetch(`http://localhost:4200/api/getUserDonePracticeLessonsPercentage/${userId}/${coursesData[i].id}`)
                        if (!resp1.ok || !resp2.ok || !resp3.ok){
                            throw new Error()
                        }
                        else{
                            const seenLessonsPercentage : number = await resp1.json()
                            const donePracticeLessonsPercentage : number = await resp3.json()
                            const seenModulesPercentage : number = await resp2.json()
                            const userCourseData : userCourseDataType = {
                                courseId : coursesData[i].id,
                                seenLessonsPercentage : seenLessonsPercentage,
                                donePracticeLessonsPercentage : donePracticeLessonsPercentage,
                                seenModulesPercentage : seenModulesPercentage
                            }
                            setUserCoursesData([...userCoursesData, userCourseData])
                        }
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        }
        getUserCoursesData()
    }, [userId, role, coursesData]);
    useEffect(() => {
        if (role !== '' && coursesData.length > 0){
            async function getUserTasksRightAnswersData(){
                try{
                    const dataArr : UserLessonTaskDataType[][] = []
                    for (let i = 0;i < coursesData.length;i++){
                        const resp = await fetch(`http://localhost:4200/api/getUserTasksAnswerRightData/${userId}/${coursesData[i].id}`)
                        if (resp.ok){
                            const data : UserLessonTaskDataType[] = await resp.json()
                            dataArr.push(data)
                        } else {
                            throw new Error()
                        }
                    }
                    setUserTasksData(dataArr)
                } catch (e) {
                    console.log(e)
                }
            }
            getUserTasksRightAnswersData()
        }
    }, [userId, role, coursesData]);
    useEffect(() => {
        console.log(userTasksData)
    }, [userTasksData]);
    return (
        <section>
            {renderCoursesData()}
        </section>
    );
};

export default StudentCourses;