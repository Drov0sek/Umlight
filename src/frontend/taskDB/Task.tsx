import {useParams} from "react-router";
import {useEffect, useState} from "react";
import taskStyle from '../Styles/TaskDBStyles/Task.module.css'
import {useSession} from "../customHooks/useSession.ts";

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

const Task = () => {
    const {userId, role} = useSession()
    const {id} = useParams<{id : string}>()
    const taskId = Number(id)
    const mockTask: TaskType = {
        id: taskId,
        text: "",
        time: "",
        type: "",
        image: '',
        answer: '',
        solution: '',
        subject_id: 1
    };
    const [task, setTask] = useState<TaskType>(mockTask)
    const [answerValue, setAnswerValue] = useState<string>('')

    async function checkAnswers() {
        const isAnswerRight = answerValue === task.answer
        console.log(JSON.stringify({
            userId : userId,
            role : role,
            taskId : taskId,
            isAnswerRight : isAnswerRight
        }))
        try{
            const resp = await fetch('http://localhost:4200/api/setUserAnswerRight', {
                headers : {
                    'Content-Type': 'application/json'
                },
                method : 'POST',
                body : JSON.stringify({
                    userId : userId,
                    role : role,
                    taskId : taskId,
                    isAnswerRight : isAnswerRight
                })
            })
            if (!resp.ok){throw new Error()}
        } catch (e) {
            console.log(e)
            alert('При сохранении правильности вашего ответа произошла ошибка')
        }
    }

    useEffect(() => {
        if (id){
            async function getTask(){
                if (!id){
                    return
                } if (id){
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
        }
    }, [id]);
    useEffect(() => {
        console.log(userId)
        console.log(role)
    }, [userId, role]);

    return (
        <main className={taskStyle.task}>
            <section className={taskStyle.taskText}>
                <section>
                    <section>
                        <p className={taskStyle.title}>Задание №{task?.id}</p>
                        <section className={taskStyle.timeAndType}>
                            <section className={taskStyle.time}>
                                <img src={'http://localhost:8080/siteImages/Clock.svg'} alt="Время"/>
                                <p>{task?.time} минут</p>
                            </section>
                            <section className={taskStyle.type}>
                                <img src={'http://localhost:8080/siteImages/List.svg'} alt="Тип"/>
                                <p>{task?.type}</p>
                            </section>
                        </section>
                        <p className={taskStyle.text}>{task?.text}</p>
                    </section>
                    {task?.image ? <img src={task?.image}/> : <></>}
                </section>
                <section className={taskStyle.getAnswer}>
                    <input className={taskStyle.answerInput} type='text' placeholder='Ответ' value={answerValue}
                           onChange={e => setAnswerValue(e.target.value)}/>
                    <button className={taskStyle.answerButton} onClick={() => {
                        if (answerValue.toLowerCase() === task.answer?.toLowerCase()) {
                            alert('Правильно')
                        } else {
                            alert('Неправильно')
                        }
                        checkAnswers()
                    }}>Ответить</button>
                </section>
            </section>
            <hr/>
            <section className={taskStyle.solutionBlock}>
                <p className={taskStyle.solutionBlockTitle}>Решение</p>
                <p className={taskStyle.solution}>{task?.solution}</p>
            </section>
        </main>
    );
};

export default Task;