import publicTaskPreview from "../Styles/CourseConstructorStyles/PublicTaskPreview.module.css";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {deleteLessonOwnTask} from "../store/slices/editLessonsReducer.ts";

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
const OwnTaskPreview = (task : PracticeLessonOwnTaskType) => {
    const [isAnswerOpened, setIsAnswerOpened] = useState(false)
    const [imagePreview, setImagePreview] = useState('')
    const dispatch = useDispatch()

    useEffect(() => {
        const url = URL.createObjectURL(task.image)
        setImagePreview(url)
        return URL.revokeObjectURL(imagePreview)
    }, []);

    return (
        <section>
            <section className={publicTaskPreview.taskBlock}>
                <section>
                    <section>
                        <p className={publicTaskPreview.title}>Безымянное занятие</p>
                        <p className={publicTaskPreview.taskText}>{task?.taskText}</p>
                    </section>
                    {imagePreview ? <img src={imagePreview}/> : <></>}
                </section>
                <section style={{
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    alignItems: 'self-start',
                    justifyContent: 'flex-end'
                }}>
                    <button onClick={() => setIsAnswerOpened(!isAnswerOpened)}
                            className={publicTaskPreview.showAnswerBtn}>Показать ответ
                    </button>
                    <p className={publicTaskPreview.answerText}>{isAnswerOpened ? task.answer : ''}</p>
                </section>
            </section>

            <section onClick={() => {
                dispatch(deleteLessonOwnTask(task))
            }}>
                <button className={publicTaskPreview.deleteBtn}>
                    Удалить из занятия
                </button>
            </section>
        </section>
    );
};

export default OwnTaskPreview;