import LessonTask from "./LessonTask.tsx";
import {useEffect, useState} from "react";
import {useParams} from "react-router";
import TaskStats from "./TaskStats.tsx";
import practiceLessonStyle from '../../../CourseStyles/PraciceLesson.module.css'
import PracticeLessonDesc from "./PracticeLessonDesc.tsx";

type PracticeLessonsType = {
    id: number
    description: string
    time: number
    type: string
    name: string
    numberoflesson: number
}
type LessonTask = {
    id: number
    text: string
    image: string
    answer: string
}
type CompletedTask = {
    numberOfTask : number,
    answer : string
}

const PracticeLesson = () => {
    const {practiceId} = useParams<{practiceId : string}>()
    const lessonId = Number(practiceId) || 2
    const [lessonTasks,setLessonTasks] = useState<LessonTask[]>([{id : 0, text : '', image : '', answer : ''}])
    const [currentTaskNumber,setCurrentTaskNumber] = useState(1)
    const [currentTask,setTask] = useState<LessonTask>(lessonTasks[0])
    const [practiceLesson,setPracticeLesson] = useState<PracticeLessonsType>({id : 0, description : '', time : 0, type : '', numberoflesson : 0, name : ''})
    const [completedTasks,setCompletedTasks] = useState<CompletedTask[]>([])
    const [completedTaskNumbers, setCompletedTaskNumbers] = useState<number[]>([])
    const [rightTasks,setRightTasks] = useState<number[]>([])

    function setCurrentTask(taskNumber : number){
        setCurrentTaskNumber(taskNumber)
        setTask(lessonTasks[taskNumber - 1])
    }
    function setCompletedTask(taskNumber : number, answer : string){
        if (!answer) return;
        setCompletedTasks(prev => {
            const idx = prev.findIndex(e => e.numberOfTask === taskNumber);
            if (idx === -1) {
                // добавляем новый
                return [...prev, { numberOfTask: taskNumber, answer }];
            } else {
                // заменяем существующий элемент (без мутаций)
                return prev.map((e, i) => i === idx ? { numberOfTask: taskNumber, answer } : e);
            }
        });
        setCompletedTaskNumbers(prev => {
            if (prev.includes(taskNumber)) return prev;
            return [...prev, taskNumber].sort((a,b) => a - b);
        });
    }

    function checkAnswers(){
        const sortedCompleted = [...completedTasks].sort((a,b) => a.numberOfTask - b.numberOfTask);
        const correctNums: number[] = [];
        for (let i = 0; i < sortedCompleted.length; i++){
            const userAnswer = sortedCompleted[i].answer ?? '';
            const taskNum = sortedCompleted[i].numberOfTask;
            const correctAnswer = lessonTasks[taskNum - 1]?.answer ?? '';
            if (userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()){
                correctNums.push(taskNum);
            }
        }
        setRightTasks(correctNums);
    }



    useEffect(() => {
        async function getLesson(){
            try {
                const resp = await fetch(`http://localhost:4200/api/getPracticeLesson/${lessonId}`)
                if (resp.ok){
                    const practiceLessonData: PracticeLessonsType = await resp.json()
                    setPracticeLesson(practiceLessonData)
                }
                else {
                    throw new Error()
                }
            } catch (e) {
                console.log(e)
                alert('Произошла ошибка при получении занятия. Зайдите на сайт позже')
            }
        }
        getLesson()
        async function getLessonTasks(){
            try {
                const resp = await fetch(`http://localhost:4200/api/getPracticeLessonTasks/${2}`)
                if (resp.ok){
                    const lessonTasksData: LessonTask[] = await resp.json()
                    setLessonTasks(lessonTasksData)
                    setTask(lessonTasksData[0])
                }
                else {
                    throw new Error()
                }
            } catch (e) {
                console.log(e)
                alert('Произошла ошибка при получении заданий занятия. Зайдите на сайт позже')
            }
        }
        getLessonTasks()
    }, [lessonId]);
    useEffect(() => {
        console.log(lessonTasks)
        console.log(completedTaskNumbers)
    }, [lessonTasks, completedTaskNumbers]);
    return (
        <main className={practiceLessonStyle.main}>
            <LessonTask text={currentTask.text} numberOfTask={currentTaskNumber} answer={currentTask.answer} id={currentTask.id}
                        image={currentTask.image} setCompletedTask={setCompletedTask}>
                <section>
                    <div>
                        <img src='http://localhost:8080/siteImages/Clock.svg'/>
                        <p>40 минут</p>
                    </div>
                    <div>
                        <img onClick={() => {
                            checkAnswers()
                        }} src='http://localhost:8080/siteImages/List.svg'/>
                        <p>16 егэ</p>
                    </div>
                </section>
            </LessonTask>
            <section className={practiceLessonStyle.bottom}>
                <TaskStats tasks={lessonTasks} numOfTask={currentTaskNumber} completedTasks={completedTaskNumbers}
                           setCurrentTask={setCurrentTask} rightTasks={rightTasks} checkAnswers={checkAnswers}/>
                <PracticeLessonDesc description={practiceLesson.description}/>
            </section>
        </main>
    );
};

export default PracticeLesson;