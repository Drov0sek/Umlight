import {useEffect, useState} from "react";
import publicTaskPreview from '../Styles/CourseConstructorStyles/PublicTaskPreview.module.css'
import {deleteLessonPublicTask} from "../store/slices/editLessonsReducer.ts";
import {useDispatch} from "react-redux";

type PropsType = {
    taskId : number,
    numberOfLesson : number,
    moduleName : string
}
type TaskType = {
    image: string | null,
    text: string,
    time: string | null,
    type: string | null,
    id: number,
    answer: string | null,
    solution: string | null,
    subject_id : number
}
type PracticeLessonPublicTaskType = {
    numberOfLesson : number,
    moduleName : string,
    publicTaskId : number
}

const PublicTaskPreview = ({taskId, numberOfLesson, moduleName} : PropsType) => {
    const [task, setTask] = useState<TaskType>({
        id: taskId,
        text: "",
        time: "",
        type: "",
        image: '',
        answer: '',
        solution: '',
        subject_id: 1
    })
    const [isAnswerOpened, setIsAnsweropened] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        async function getTask(){
            if (taskId){
                try{
                    const resp = await fetch(`http://localhost:4200/api/getTaskById/${taskId}`)
                    if (resp.ok){
                        const taskData : TaskType = await resp.json()
                        setTask(taskData)

                    } else{
                        alert('Произошла ошибка при загрузке задания. Зайдите на сайт позже')
                        throw new Error()
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        }
        getTask()
    }, [taskId]);
    return (
        <section>
            <section className={publicTaskPreview.taskBlock}>
                <section>
                    <section>
                        <p className={publicTaskPreview.title}>Безымянное занятие</p>
                        <section className={publicTaskPreview.timeAndTypeBlock}>
                            <section className={publicTaskPreview.timeOrTypeBlock}>
                                <img src={'http://localhost:8080/siteImages/Clock.svg'} alt="Время"/>
                                <p>{task?.time} минут</p>
                            </section>
                            <section className={publicTaskPreview.timeOrTypeBlock}>
                                <img src={'http://localhost:8080/siteImages/List.svg'} alt="Тип"/>
                                <p>{task?.type}</p>
                            </section>
                        </section>
                        <p className={publicTaskPreview.taskText}>{task?.text}</p>
                    </section>
                    {task?.image ? <img src={task?.image}/> : <></>}
                </section>
                <section style={{display : 'flex', flexDirection : 'row-reverse', alignItems : 'self-start', justifyContent :'flex-end'}}>
                    <button onClick={() => setIsAnsweropened(!isAnswerOpened)} className={publicTaskPreview.showAnswerBtn}>Показать ответ</button>
                    <p className={publicTaskPreview.answerText}>{isAnswerOpened ? task.answer : ''}</p>
                </section>
            </section>

            <section  onClick={() => {
                const taskObj :PracticeLessonPublicTaskType = {
                    numberOfLesson : numberOfLesson,
                    moduleName : moduleName,
                    publicTaskId : taskId
                }
                alert('tybgfdsc')
                console.log('tsd: ', taskObj)
                dispatch(deleteLessonPublicTask(taskObj))
            }}>
                <button className={publicTaskPreview.deleteBtn}>
                Удалить из занятия
                </button>
            </section>
        </section>
    );
};

export default PublicTaskPreview;