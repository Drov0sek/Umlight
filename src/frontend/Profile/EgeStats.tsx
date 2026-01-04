import {useEffect, useState} from "react";
import egeStats from '../Styles/ProfileStyles/EgeStats.module.css'
import ProgressCircle from "../Styles/templates/Courses/ProgressCircle.tsx";

type PropsType = {
    userId : number,
    role : string
}
type UserTaskType = {
    taskId : number,
    subject : string,
    isAnswerRight : boolean,
    type : string | null
}

const EgeStats = ({userId, role} : PropsType) => {
    const [userTasksSubjects, setUserTasksSubjects] = useState<string[]>([])
    const [userTasks, setUserTasks] = useState<UserTaskType[]>([])
    const [isOpened, setIsOpened] = useState(true)

    function getTypePercentages(){
        const userTasksTypes = userTasks.map(r => r.type)
        return userTasksTypes.map(r => {
            return <section className={egeStats.typePercentageBlock}>
                <section className={egeStats.typePercentageBlock}>
                    <ProgressCircle percent={Math.round(userTasks.filter(o => o.type === r && o.isAnswerRight).length / userTasks.filter(o => o.type === r).length *     100)} tasksNumber={userTasks.filter(o => o.type === r).length}/>
                    <p className={egeStats.typeSign}>{r}</p>
                </section>
            </section>
        })
    }
    function renderStats(){
        return userTasksSubjects.map(e => {
            const userTasksSubject = userTasks.filter(r => r.subject === e)
            return <section key={userTasksSubject.map(r => r.subject).indexOf(e)}>
                <section className={egeStats.subjectTitleBlock}>
                    <div className={egeStats.subjectTitleBlock}>
                        <p className={egeStats.subjectTitle}>{e}</p>
                        <img onClick={() => setIsOpened(!isOpened)} className={isOpened ? egeStats.openedOpenBtn : egeStats.closedOpenBtn} src={'http://localhost:8080/siteImages/Chevron%20down.svg'}/>
                    </div>
                    <p className={egeStats.tasksNumber}>{userTasksSubject.length} заданий</p>
                </section>
                {isOpened ? <section>
                    <p className={egeStats.taskDonePercentage}>{Math.round(userTasksSubject.filter(o => o.isAnswerRight).length / userTasksSubject.length * 100)} %
                        выполнения</p>
                    <section className={egeStats.typePercentagesBlock}>
                        {getTypePercentages()}
                    </section>
                </section> : <></>}
            </section>

        })
    }

    useEffect(() => {
        async function getUserTasksSubjects() {
            if (role !== '') {
                try {
                    const resp = await fetch(`http://localhost:4200/api/getUserTasksSubjects/${userId}/${role}`)
                    if (resp.ok) {
                        const data : string[] = await resp.json()
                        setUserTasksSubjects(data)
                    } else {
                        throw new Error()
                    }
                } catch (e) {
                    console.log(e)
                    alert('При загрузке вашей статистики произошла ошибка. Попробуйте позже')
                }
            }
        }
        getUserTasksSubjects()
    }, [userId, role]);
    useEffect(() => {
        async function getUserTasks(){
            if (role !== ''){
                try{
                    const resp = await fetch(`http://localhost:4200/api/getUserTasks/${userId}/${role}`)
                    if (resp.ok){
                        const data : UserTaskType[] = await resp.json()
                        setUserTasks(data)
                    }
                } catch (e) {
                    console.log(e)
                    alert('Произошла ошибка при загрузке статистики')
                }
            }
        }
        getUserTasks()
    }, [userId, role]);
    useEffect(() => {
        console.log(userTasks)
    }, [userTasks]);
    return (
        <section>
            {renderStats()}
        </section>
    );
};

export default EgeStats;