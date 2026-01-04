import TaskNavBar from "./TaskNavBar.tsx";
import SearchById from "./SearchById.tsx";
import SerachByType from "./SerachByType.tsx";
import taskDB from '../Styles/TaskDBStyles/TaskDB.module.css'
import {useEffect, useState} from "react";
import TaskPreview from "./TaskPreview.tsx";

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

const TaskDb = () => {
    const [mustHaveSolutions, setMustHaveSolutions] = useState(false)
    const [tasks, setTasks] = useState<TaskType[]>([])
    const [currentSubject, setCurrentSubject] = useState<string>('Профильная математика')
    const [isSortByNewest, setIsSortByNewest] = useState('Сначала новые')
    const [idFilter, setIdFilter] = useState<number>(0)
    const [types, setTypes] = useState<string[]>([])
    const [chosenTypes, setChosenTypes] = useState<string[]>([])
    const [subjects] = useState<string[]>(["Профильная математика","Русский язык","Информатика","Физика","Базовая математика","Химия","История","Обществознание","Биология","География","Английский язык","Немецкий язык","Французский язык","Испанский язык","Китайский язык","Литература"])

    function getTaskPreviews(){
        return tasks
            .filter(task => {
                const subjectMatch = task.subject_id - 1 === subjects.indexOf(currentSubject);
                const typeMatch = chosenTypes.length === 0 ||
                    (task.type && chosenTypes.includes(task.type));
                const idMatch = idFilter === 0 ||
                    task.id.toString().includes(idFilter.toString());
                const solutionMatch = !mustHaveSolutions || (task.solution !== null || task.solution !== '');

                return subjectMatch && typeMatch && idMatch && solutionMatch;
            })
            .map((e, index) => (
                <div key={e.id} className={taskDB.previewBlock}>
                    <div className={taskDB.previewNumber}>{index + 1}</div>
                    <TaskPreview
                        image={e.image}
                        text={e.text}
                        time={e.time}
                        type={e.type}
                        id={e.id}
                        answer={e.answer}
                        solution={e.solution}
                        subject_id={e.subject_id}
                    />
                </div>
            ));
    }
    function setCurrentSubjectFilter(subjectId : number){
        setCurrentSubject(subjects[subjectId])
    }
    function setId(newId : number){
        setIdFilter(newId)
    }
    function setTypesFilter(newTypes : string[]){
        setChosenTypes(newTypes)
    }

    useEffect(() => {
        for (let i = 0;i < tasks.length; i++){
            if (types.indexOf(tasks[i].type as string) === -1 && tasks[i].type){
                setTypes([...types, tasks[i].type as string])
            }
        }
    }, [tasks, types]);
    useEffect(() => {
        if (isSortByNewest === 'Сначала новые') {
            const newTasks = tasks.sort((a, b) => a.id - b.id)
            setTasks(newTasks)
        } else {
            const newTasks = tasks.sort((a, b) => b.id - a.id)
            setTasks(newTasks)
        }
    }, [isSortByNewest]);
    useEffect(() => {
        async function getTasks(){
            try {
                const resp = await fetch('http://localhost:4200/api/getTasks')
                if (resp.ok){
                    const tasksData : TaskType[] = await resp.json()
                    setTasks(tasksData)
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
    }, []);
    useEffect(() => {
        console.log(mustHaveSolutions)
    }, [mustHaveSolutions]);

    return (
        <main className={taskDB.taskDB}>
            <TaskNavBar currentSubjectId={subjects.indexOf(currentSubject)} setCurrentSubjectId={setCurrentSubjectFilter}/>
            <section className={taskDB.search}>
                <SearchById idFilter={idFilter} setIdFilter={setId}/>
                <SerachByType taskTypes={types} setTypes={setTypesFilter}/>
            </section>
            {/*<section>*/}
            {/*    <button>Создать практику</button>*/}
            {/*    <button>Вариант ЕГЭ 2025</button>*/}
            {/*</section>*/}
            <section className={taskDB.sort}>
                <p className={taskDB.sortTitle}>Сортировка: </p>
                <select className={taskDB.sorter} onChange={(e) => setIsSortByNewest(e.target.value)}>
                    <option className={taskDB.sorterOption}>Сначала новые</option>
                    <option className={taskDB.sorterOption}>Сначала старые</option>
                </select>
                <section className={taskDB.hasDecisionChecker}>
                    <input type='checkbox' checked={mustHaveSolutions}
                           onChange={e => setMustHaveSolutions(e.target.checked)}/>
                    <p>С решением</p>
                </section>
            </section>
            <section>
                {getTaskPreviews()}
            </section>
        </main>
    );
};

export default TaskDb;