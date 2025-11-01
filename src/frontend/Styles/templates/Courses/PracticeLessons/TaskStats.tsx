import taskStats from '../../../CourseStyles/TaskStats.module.css'
import {useState} from "react";
type PropsType = {
    tasks : LessonTask[],
    numOfTask : number,
    completedTasks : number[],
    setCurrentTask(taskNumber : number) : void,
    checkAnswers() : void
    rightTasks : number[]
}
type LessonTask = {
    id : number,
    text : string,
    image : string,
    answer : string,
}


const TaskStats = ({tasks, numOfTask, completedTasks,setCurrentTask, rightTasks, checkAnswers} : PropsType) => {
    const [isDone, setIsDone] = useState(false)

    function getTask(){
        return <section className={taskStats.tasks}>
            {tasks.map(e => <div key={e.id} onClick={() => setCurrentTask(tasks.indexOf(e) + 1)} className={numOfTask === tasks.indexOf(e) + 1 ? taskStats.currentTask : !isDone ? (completedTasks.indexOf(e.id) !== -1 ? taskStats.completedTask : taskStats.unCompletedTask) : rightTasks.includes(tasks.indexOf(e) + 1) ? taskStats.rightTask : taskStats.wrongTask}>
                {tasks.indexOf(e) + 1}
            </div>)}
        </section>
    }

    return (
        <section className={taskStats.taskStats}>
            <p className={taskStats.title}>Твоя статистика</p>
            <section className={taskStats.tasksBlock}>
                {getTask()}
                <section className={taskStats.bottom}>
                    <p className={taskStats.stats}> Выполнено {completedTasks.length} из {tasks.length}</p>
                    <button className={taskStats.btn} onClick={() => {
                        checkAnswers()
                        setIsDone(true)
                    }}>Завершить практику</button>
                </section>
            </section>
        </section>
    );
};

export default TaskStats;