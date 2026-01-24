import {useEffect, useState} from "react";
import teacherCourses from "../Styles/ProfileStyles/TeacherCourses.module.css";
import ProgressCircle from "../Styles/templates/Courses/ProgressCircle.tsx";
import CircleLeaderLine from "../Styles/templates/Courses/TheoryLessons/CircleLeaderLine.tsx";

type PropType = {
    userId : number,
    role : string
}
type CourseDataType = {
    id : number,
    name : string
}
type UserLessonTaskDataType = {
    tasksAmount : number,
    rightAnswersPercentage : number,
    lessonName : string
}
type TeacherStudentStatsDataType = {
    avgSeenLessonsPerc : number,
    avgDonePracticeLessonsPerc : number,
    avgSeenModulesPerc : number,
    studentsTaskData : UserLessonTaskDataType[][],
    studentsAmount : number
}
type LessonAvgStats = {
    lessonName: string
    avgRightAnswersPercentage: number
    avgTasksAmount: number
}


const TeacherCourses = ({userId, role} : PropType) => {
    const [userCourses, setUserCourses] = useState<CourseDataType[]>([])
    const [studentsStatsData, setStudentsData] = useState<TeacherStudentStatsDataType[]>([])
    const [isOpened, setIsOpened] = useState(true)

    function renderCoursesData(){
        return userCourses.map(e => {
            return <section key={userCourses.indexOf(e)}>
                <section className={teacherCourses.courseTitleBlock}>
                    <section className={teacherCourses.courseTitleAndImgBlock}>
                        <p className={teacherCourses.courseTitle}>{e.name}</p>
                        <img onClick={() => setIsOpened(!isOpened)}
                             className={isOpened ? teacherCourses.openedOpenBtn : teacherCourses.closedOpenBtn}
                             src={'http://localhost:8080/siteImages/Chevron%20down.svg'}/>
                    </section>
                    <p className={teacherCourses.courseTitle}>{studentsStatsData[userCourses.indexOf(e)]?.studentsAmount} учеников</p>
                </section>
                {isOpened ? <section>
                    <p className={teacherCourses.statsTitle}>Успеваемость</p>
                    {renderCourseStatsData(userCourses.indexOf(e))}
                    {renderCourseTasksStatsData(userCourses.indexOf(e))}
                </section> : <></>}
            </section>
        })
    }

    function renderCourseStatsData(courseIndex: number) {
        const e = studentsStatsData[courseIndex]
        return <section className={teacherCourses.statsDiag}>
        <svg overflow={'visible'} height={360} width={610}>
                <ProgressCircle size={360}
                                percent={Math.round((e?.avgSeenLessonsPerc + e?.avgDonePracticeLessonsPerc + e?.avgSeenModulesPerc) / 3)}
                                sign={'Средний результат'}/>
                <CircleLeaderLine angleDeg={-45} topText={`${e?.avgSeenLessonsPerc}% просмотренных занятий`}
                                  horizontalLength={350} bottomText={''}/>
                <CircleLeaderLine angleDeg={0}
                                  topText={`${e?.avgDonePracticeLessonsPerc}% выполненных практик`}
                                  horizontalLength={350} bottomText={''}/>
                <CircleLeaderLine angleDeg={45} topText={`${e?.avgSeenModulesPerc}% пройденных модулей`}
                                  horizontalLength={350} bottomText={''}/>
            </svg>
        </section>
    }
    function renderCourseTasksStatsData(courseIndex : number){
        const e = studentsStatsData[courseIndex]
        const percsArr = e?.studentsTaskData.map(r => r.map(o => o.rightAnswersPercentage))
        const visibleTasksData = getLessonStats(e?.studentsTaskData)
        return <section>
            <p className={teacherCourses.taskStatsTitle}>{percsArr?.reduce(
                (total, innerArray) =>
                    total + innerArray.reduce((innerSum, n) => innerSum + n, 0),
                0
            ) / percsArr?.length}% эффективность выполнения</p>
            <section className={teacherCourses.lessonsTasksStatsBlock}>
                {visibleTasksData?.map(o => {
                    return <section className={teacherCourses.lessonTasksStatsBlock}>
                        <ProgressCircle percent={o.avgRightAnswersPercentage} sign={`${o.avgTasksAmount} заданий`}/>
                        <p className={teacherCourses.lessonName}>{o.lessonName}</p>
                    </section>
                })}
            </section>
        </section>
    }
    function getLessonStats(data: UserLessonTaskDataType[][]): LessonAvgStats[] {
        if (!Array.isArray(data)) return []
        const map = new Map<string, {rightAnswersSum: number, tasksAmountSum: number, count: number}>()
        for (const userLessons of data) {
            for (const lesson of userLessons) {
                const entry = map.get(lesson.lessonName)
                if (entry) {
                    entry.rightAnswersSum += lesson.rightAnswersPercentage
                    entry.tasksAmountSum += lesson.tasksAmount
                    entry.count += 1
                } else {
                    map.set(lesson.lessonName, {
                        rightAnswersSum: lesson.rightAnswersPercentage,
                        tasksAmountSum: lesson.tasksAmount,
                        count: 1
                    })
                }
            }
        }
        return Array.from(map.entries()).map(
            ([lessonName, { rightAnswersSum, tasksAmountSum, count }]) => ({
                lessonName,
                avgRightAnswersPercentage: rightAnswersSum / count,
                avgTasksAmount: tasksAmountSum / count
            })
        )
    }


    useEffect(() => {
    if (role !== '') {
        async function getTeacherCourses() {
            try {
                const resp = await fetch(`http://localhost:4200/api/getTeacherCourses/${userId}`)
                if (resp.ok) {
                    const data: CourseDataType[] = await resp.json()
                    setUserCourses(data)
                } else {
                    throw new Error()
                }
            } catch (e) {
                console.log(e)
            }
        }

        getTeacherCourses()
    }
}, [userId, role]);
useEffect(() => {
    if (role !== '') {
        async function getStudentsStatsData() {
            try {
                const dataArr = []
                for (let i = 0; i < userCourses.length; i++) {
                    const resp = await fetch(`http://localhost:4200/api/getTeacherStudentsStatsData/${userCourses[i].id}`)
                    if (resp.ok) {
                        const data : TeacherStudentStatsDataType = await resp.json()
                            dataArr.push(data)
                        }
                        else {
                            throw new Error()
                        }
                    }
                    setStudentsData(dataArr)
                } catch (e) {
                    console.log(e)
                }
            }
            getStudentsStatsData()
        }
    }, [userCourses, role]);
    useEffect(() => {
        console.log(studentsStatsData)
    }, [studentsStatsData]);
    return (
        <section>
            {renderCoursesData()}
        </section>
    );
};

export default TeacherCourses;