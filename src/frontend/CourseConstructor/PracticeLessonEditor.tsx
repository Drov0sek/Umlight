import {useEffect, useState} from "react";
import practiceLessonEditor from '../Styles/CourseConstructorStyles/PracticeLessonEditor.module.css'
import {useNavigate} from "react-router-dom";
import {setCurrentLesson, addOwnLessonTask} from "../store/slices/editLessonsReducer.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../store/store.ts";
import PublicTaskPreview from "./PublicTaskPreview.tsx";
import {Modal} from "../Styles/templates/Modal.tsx";
import OwnTaskPreview from "./OwnTaskPreview.tsx";
import OwnTaskEditor from "./OwnTaskEditor.tsx";

type LessonType = {
    name : string,
    type : string,
    description : string,
    video : string,
    time : number,
    numberoflesson : number,
    moduleName : string
}
type CurrentLessonType = {
    numberOfLesson : number,
    moduleName : string
}
type PracticeLessonOwnTaskType = {
    numberOfLesson : number,
    moduleName : string,
    taskText : string,
    answer : string,
    image : File,
    type : string,
    time : number,
    materials : File[]
}

const PracticeLessonEditor = (props : LessonType) => {
    const nav = useNavigate()
    const [name, setName] = useState(props.name)
    const dispatch = useDispatch()
    const publicTasks = useSelector((state : RootState) => state.editLessonsReducer.lessonPublicTasks.filter(e => e.numberOfLesson === props.numberoflesson && e.moduleName === props.moduleName))
    const ownTasks = useSelector((state : RootState) => state.editLessonsReducer.lessonOwnTasks.filter(e => e.numberOfLesson === props.numberoflesson && e.moduleName === props.moduleName))
    const [isFormOpened, setIsFormOpened] = useState(false)
    const [taskLink, setTaskLink] = useState('')
    const [answer, setAnswer] = useState('')
    const [isTaskEditorOpened, setIsTaskEditorOpened] = useState(false)

    function addLinkTaskForm(){
        setIsFormOpened(true)
    }

    useEffect(() => {
        const currentLessonObJ : CurrentLessonType = {
            moduleName : props.moduleName,
            numberOfLesson : props.numberoflesson
        }
        dispatch(setCurrentLesson(currentLessonObJ))
    }, [props.numberoflesson, props.moduleName, dispatch]);

    return (
        <section style={{backgroundColor : '#f4f4f4',}}>
            <Modal isOpen={isFormOpened} onClose={() => setIsFormOpened(false)} children={
                <section style={{display : 'flex', flexDirection : 'column', alignItems : 'center'}}>
                    <section>
                        <p className={practiceLessonEditor.linkTitle}>Ссылка</p>
                        <input className={practiceLessonEditor.linkInput} type='text' value={taskLink} onChange={(e) => setTaskLink(e.target.value)}/>
                    </section>
                    <section>
                        <p className={practiceLessonEditor.linkTitle}>Ответ</p>
                        <input className={practiceLessonEditor.linkInput} type='text' value={answer} onChange={(e) => setAnswer(e.target.value)}/>
                    </section>
                    <button className={practiceLessonEditor.saveLinkTaskBtn} onClick={() => {
                        const emptyFile = new File([], '', { type: '' })
                        const taskObj : PracticeLessonOwnTaskType = {
                            moduleName: props.moduleName,
                            numberOfLesson: props.numberoflesson,
                            taskText: taskLink,
                            answer: answer,
                            image: emptyFile,
                            time : 0,
                            type : '',
                            materials : []
                        }
                        dispatch(addOwnLessonTask(taskObj))
                        setIsFormOpened(false)
                    }}>Добавить задание</button>
                </section>
            }/>
            <Modal isOpen={isTaskEditorOpened} onClose={() => setIsTaskEditorOpened(false)} children={
                <section>
                    <OwnTaskEditor/>
                </section>
            }/>
            <p className={practiceLessonEditor.title}>Новое практическое занятие</p>
            <section className={practiceLessonEditor.mainBlock}>
            <section style={{marginLeft: '2.6vw'}}>
                    <section>
                        <p className={practiceLessonEditor.name}>Название занятия</p>
                        <input className={practiceLessonEditor.nameInput} type='text' value={name}
                               onChange={(e) => setName(e.target.value)}/>
                    </section>
                    <section>
                        <section style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <p className={practiceLessonEditor.btnsTitle}>Занятия</p>
                            <p className={practiceLessonEditor.btnsTitle}>0/100</p>
                        </section>
                        <section style={{display: 'flex', flexDirection: 'column'}}>
                            <button onClick={() => nav('/taskDb/true')} className={practiceLessonEditor.addTaskBtn}>
                                {<img src={'http://localhost:8080/siteImages/Plus.svg'}/>}
                                Выбрать задание из базы заданий
                            </button>
                            <button onClick={() => addLinkTaskForm()} className={practiceLessonEditor.addTaskBtn}>
                                {<img src={'http://localhost:8080/siteImages/btnLink.svg'}/>}
                                Ссылка на задание
                            </button>
                            <button className={practiceLessonEditor.addTaskBtn}>
                                {<img src={'http://localhost:8080/siteImages/Create.svg'}/>}
                                Добавить случайное задание из базы заданий
                            </button>
                            <button className={practiceLessonEditor.addTaskBtn} onClick={() => setIsTaskEditorOpened(true)}>
                                {<img src={'http://localhost:8080/siteImages/Add.svg'}/>}
                                Создать задание с нуля
                            </button>
                        </section>
                    </section>
                    <section style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginTop: '29vh',
                        justifyContent: 'space-between'
                    }}>
                        <button className={practiceLessonEditor.saveBtn}>Сохранить подборку</button>
                        <button className={practiceLessonEditor.cancelBtn}>Отменить</button>
                    </section>
                </section>
                <section>
                    <p className={practiceLessonEditor.tasksBlockTitle}>{name === '' ? 'Здесь будет название вашего занятия' : name}</p>
                    <section className={practiceLessonEditor.tasksBlock}>
                        {publicTasks.map(e => <section>
                            <PublicTaskPreview numberOfLesson={props.numberoflesson} moduleName={props.moduleName} taskId={e.publicTaskId}/>
                        </section>)}
                        {ownTasks.map(e => <section>
                            <OwnTaskPreview numberOfLesson={e.numberOfLesson} moduleName={e.moduleName} taskText={e.taskText} answer={e.answer} image={e.image} type={e.type} time={e.time} materials={e.materials}/>
                        </section>)}
                    </section>
                </section>
            </section>
        </section>
    );
};

export default PracticeLessonEditor;