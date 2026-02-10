import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../store/store.ts";
import {useEffect, useState} from "react";
import randomTaskGetter from '../Styles/CourseConstructorStyles/RandomTaskGetter.module.css'
import {useNavigate} from "react-router-dom";
import {addLessonTask} from "../store/slices/editLessonsReducer.ts";

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
    publicTaskId : number,
}

const RandomTasksGetter = () => {
    const dispatch = useDispatch()
    const tags = useSelector((state : RootState) => state.editLessonsReducer.tags)
    const [tasks, setTasks] = useState<TaskType[]>([])
    const [taskTypes, setTaskTypes] = useState<(string | null)[]>([])
    const [tasksNumbers, setTasksNumbers] = useState<number[]>(Array(taskTypes.length).fill(0))
    const currentLesson = useSelector((state : RootState) => state.editLessonsReducer.currentLesson)
    const pickedTaskIds = useSelector((state : RootState) => state.editLessonsReducer.lessonPublicTasks.map(e => e.publicTaskId))
    const nav = useNavigate()

    function pickAndSaveTasks(){
        for (let i = 0; i < taskTypes.length; i++){
            const tasksNumber = tasksNumbers[i]
            const tasksIdsArray : number[] = []
            const tasksType = tasks.filter(e => e.type === taskTypes[i])
            for (let h = 0; h < tasksNumber; h++){
                let randomId = tasksType[Math.floor(Math.random() * tasksType.length)].id
                while (pickedTaskIds.includes(randomId)){
                    randomId = tasksType[Math.floor(Math.random() * tasksType.length)].id
                }
                tasksIdsArray.push(randomId)
            }
            for (let a = 0; a < tasksIdsArray.length; a++){
                const newPublicTaskObj : PracticeLessonPublicTaskType = {
                    moduleName : currentLesson.moduleName,
                    numberOfLesson : currentLesson.numberOfLesson,
                    publicTaskId : tasksIdsArray[a]
                }
                dispatch(addLessonTask(newPublicTaskObj))
            }
        }
        nav(`/courseConstructor/${currentLesson.moduleName}/${currentLesson.numberOfLesson}`)
    }

    useEffect(() => {
        async function getTasks(){
            try {
                const resp = await fetch('http://localhost:4200/api/getTasks')
                if (resp.ok){
                    const tasksData : TaskType[] = await resp.json()
                    setTasks(tasksData.filter(e => tags.map(r => tags.indexOf(r)).includes(e.subject_id - 1)))
                }
                else{
                    throw new Error()
                }
            } catch (e) {
                console.log(e)
                alert('Что-то пошло не так при загрузке заданий. Зайдите на сайт позже')
            }
        }
        getTasks()
    }, [tags]);
    useEffect(() => {
        setTaskTypes(tasks.map(e => e.type))
    }, [tasks]);
    useEffect(() => {
        setTasksNumbers(Array(taskTypes.length).fill(0))
    }, [taskTypes]);

    function renderTaskTypes(){
        return <section style={{display : 'flex', flexDirection : 'row', alignItems : 'self-start'}} className={randomTaskGetter.randomTaskGetterBlock}>
            <section style={{marginLeft : 'calc(46vw / 1920 * 100)'}}>
                <p className={randomTaskGetter.title}>Конструктор заданий</p>
                <button className={randomTaskGetter.resetBtn} onClick={() => setTasksNumbers(Array(taskTypes.length).fill(0))}>
                    {<img src={'http://localhost:8080/siteImages/Add.svg'}/>}
                    <p>Сбросить задания</p>
                </button>
                <section className={randomTaskGetter.saveAndCancelBtn}>
                    <button className={randomTaskGetter.saveBtn} onClick={() => pickAndSaveTasks()}>Сохранить в занятие</button>
                    <button onClick={() => nav(`/courseConstructor/${currentLesson.moduleName}/${currentLesson.numberOfLesson}`)} className={randomTaskGetter.cancelBtn}>Отменить</button>
                </section>
            </section>
            <section className={randomTaskGetter.rightBlock}>
                <p className={randomTaskGetter.tasksTitle}>Задания</p>
                <section>
                    {taskTypes.filter((item, index) => taskTypes.indexOf(item) === index).map(r => {
                        return <section className={randomTaskGetter.typeBlock}>
                            <button className={randomTaskGetter.changeTasksNumber} onClick={() => {
                                const typeTasks = tasks.filter(e => e.type === r)
                                if (tasksNumbers[taskTypes.indexOf(r)] < typeTasks.length){
                                    const currentTaskIndex = taskTypes.indexOf(r)
                                    const newTaskNumbers = tasksNumbers.slice(0, currentTaskIndex).concat(tasksNumbers[taskTypes.indexOf(r)] + 1, tasksNumbers.slice(currentTaskIndex + 1))
                                    setTasksNumbers(newTaskNumbers)
                                }
                            }}>+</button>
                            <section className={randomTaskGetter.tasksNumber}>
                                {tasksNumbers[taskTypes.indexOf(r)]}
                            </section>
                            <button className={randomTaskGetter.changeTasksNumber} onClick={() => {
                                if (tasksNumbers[taskTypes.indexOf(r)] > 0){
                                    const currentTaskIndex = taskTypes.indexOf(r)
                                    const newTaskNumbers = tasksNumbers.slice(0, currentTaskIndex).concat(tasksNumbers[taskTypes.indexOf(r)] - 1, tasksNumbers.slice(currentTaskIndex + 1))
                                    setTasksNumbers(newTaskNumbers)
                            }}}>-</button>
                            <p className={randomTaskGetter.typeName}>{r === null ? 'Неизвестый тип' : r}</p>
                        </section>
                    })}
                </section>
            </section>
        </section>
    }

    return (
        <main>
            {renderTaskTypes()}
        </main>
    );
};

export default RandomTasksGetter;