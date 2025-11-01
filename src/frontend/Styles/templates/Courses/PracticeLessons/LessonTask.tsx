import {type ReactElement, useState} from "react";
import lessonTask from '../../../CourseStyles/LessonTask.module.css'

type PropsType = {
    id : number,
    text : string,
    image : string,
    answer : string,
    numberOfTask : number,
    children : ReactElement,
    setCompletedTask(taskNumber : number, answer : string) : void
}

const LessonTask = (props : PropsType) => {
    const [answer,setAnswer] = useState('')
    return (
        <section className={lessonTask.lessonTask}>
            <section className={lessonTask.taskContent}>
                <p className={lessonTask.taskNum}>Задание №{props.numberOfTask}</p>
                <section className={lessonTask.children}>{props.children}</section>
                <section>
                    <p className={lessonTask.text}>
                        {props.text}
                    </p>
                    <input className={lessonTask.answerInput} type='text' placeholder='Ответ' value={answer} onChange={e => setAnswer(e.target.value)}/>
                    <button className={lessonTask.answerBtn} onClick={() => {
                        console.log(props.numberOfTask, answer)
                        props.setCompletedTask(props.numberOfTask, answer)
                        setAnswer('')
                    }}>Ответить</button>
                </section>
            </section>
            <section className={lessonTask.taskImgAndMaterials}>
                {props.image != '' ? <img src={props.image}/> : <></>}
            </section>
        </section>
    );
};

export default LessonTask;