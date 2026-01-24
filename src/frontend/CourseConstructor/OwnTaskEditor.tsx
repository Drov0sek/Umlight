import {useParams} from "react-router";
import {type ChangeEvent, useEffect, useRef, useState} from "react";
import ownTaskEditor from '../Styles/CourseConstructorStyles/OwnTaskEditor.module.css'
import {addOwnLessonTask} from "../store/slices/editLessonsReducer.ts";
import {useDispatch} from "react-redux";
import practiceLessonEditor from "../Styles/CourseConstructorStyles/PracticeLessonEditor.module.css";

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

const OwnTaskEditor = () => {
    const emptyFile = new File([], '', { type: '' })
    const {moduleName, numberOfLesson} = useParams<string>()
    const [name, setName] = useState('')
    const [type, setType] = useState('')
    const [time, setTime] = useState(0)
    const [image, setImage] = useState<File>(emptyFile)
    const [answer, setAnswer] = useState('')
    const [taskText, setTaskText] = useState('')
    const [materials, setMaterials] = useState<File[]>([])
    const materialInputRef = useRef<HTMLInputElement | null>(null)
    const imageInputRef = useRef<HTMLInputElement | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isNameEditing, setIsNameEditing] = useState(false)
    const [isTimeAndTypeEditing, setIsTimeAndTypeEditing] = useState(false)
    const [isAnswerEditing, setIsAnswerEditing] = useState(false)
    const dispatch = useDispatch()

    function uploadImage(e: ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (!files || !files[0]) return
        const file = files[0]
        if (!file.type.startsWith('image/')) {
            alert('Можно загрузить только изображение')
            e.target.value = '' // сброс input
            return
        }
        setImage(file)

        const previewUrl = URL.createObjectURL(file)
        setImagePreview(previewUrl)
    }
    function uploadMaterial(e: ChangeEvent<HTMLInputElement>){
        const files = e.target.files
        if (!files){
            return
        }
        const file = files[0]
        setMaterials([...materials, file])
    }
    function getMaterialNames(){
        return materials.map(e => <section>
            <p className={ownTaskEditor.materialName}>{e.name}</p>
        </section>)
    }
    function saveTask(){
        if (moduleName && numberOfLesson && !isNaN(Number(numberOfLesson))){
            const newTaskObj : PracticeLessonOwnTaskType = {
                moduleName : moduleName,
                numberOfLesson : Number(numberOfLesson),
                taskText : taskText,
                answer : answer,
                time : time,
                type : type,
                image : image,
                materials : materials
            }
            dispatch(addOwnLessonTask(newTaskObj))
        }
    }

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview)
            }
        }
    }, [imagePreview])

    return (
        <main>
            <section className={ownTaskEditor.ownTaskEditorBlock}>
                <section className={ownTaskEditor.leftBlock}>
                    <section className={ownTaskEditor.nameBlock}>
                        {isNameEditing ? <textarea rows={1} className={ownTaskEditor.titleEditor} value={name}
                                                   onChange={(e) => setName(e.target.value)}/> :
                            <p className={ownTaskEditor.title}>{name === '' ? 'Название задания' : name}</p>}
                        <img onClick={() => setIsNameEditing(!isNameEditing)} className={ownTaskEditor.editImg}
                             src={'http://localhost:8080/siteImages/Edit.svg'}/>
                    </section>
                    <section className={ownTaskEditor.typeAndTimeBlock}>
                        <section style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            {isTimeAndTypeEditing ?
                                <textarea rows={1} className={ownTaskEditor.titleEditor} value={isNaN(time) ? '' : time}
                                          onChange={(e) => setTime(Number(e.target.value))}/>
                                :
                                <p className={ownTaskEditor.title}>{time === 0 ? 'Тип задания' : time}</p>
                            }
                            <p className={ownTaskEditor.title}> | </p>
                            {isTimeAndTypeEditing ?
                                <textarea rows={1} className={ownTaskEditor.titleEditor} value={type}
                                          onChange={(e) => setType(e.target.value)}/>
                                :
                                <p className={ownTaskEditor.title}>{type === '' ? 'Время выполнения' : type}</p>
                            }
                        </section>
                        <img onClick={() => setIsTimeAndTypeEditing(!isTimeAndTypeEditing)}
                             className={ownTaskEditor.editImg} src={'http://localhost:8080/siteImages/Edit.svg'}/>
                    </section>
                    <section className={ownTaskEditor.textBlock}>
                        <p className={ownTaskEditor.title}>Текст задания</p>
                        <textarea value={taskText} onChange={(event) => setTaskText(event.target.value)}/>
                    </section>
                    <section className={ownTaskEditor.answerBlock}>
                        {isAnswerEditing ?
                            <textarea rows={1} className={ownTaskEditor.answerEditor} value={answer}
                                      onChange={(e) => setAnswer(e.target.value)}/>
                            :
                            <p className={ownTaskEditor.title}>Ответ</p>
                        }
                        <img onClick={() => setIsAnswerEditing(!isAnswerEditing)} className={ownTaskEditor.editImg}
                             src={'http://localhost:8080/siteImages/Edit.svg'}/>
                    </section>
                </section>
                <section>
                    <section>
                        <section className={ownTaskEditor.imageBlock}>
                            <p className={ownTaskEditor.title}>Фото задания</p>
                            <img onClick={() => imageInputRef.current?.click()} className={ownTaskEditor.editImg}
                                 src={'http://localhost:8080/siteImages/BlueDownload.svg'}/>
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                ref={imageInputRef}
                                onChange={uploadImage}
                            />
                        </section>
                        {imagePreview && (
                            <img className={ownTaskEditor.taskImage}
                                 src={imagePreview}
                                 alt="Превью задания"
                                 style={{maxWidth: '100%', marginTop: '8px'}}
                            />
                        )}
                    </section>
                    <section>
                        <section className={ownTaskEditor.filesBlock}>
                            <p className={ownTaskEditor.title}>Файлы для задания</p>
                            <img onClick={() => materialInputRef.current?.click()} className={ownTaskEditor.editImg}
                                 src={'http://localhost:8080/siteImages/BlueDownload.svg'}/>
                            <input
                                type="file"
                                hidden
                                ref={materialInputRef}
                                onChange={uploadMaterial}
                            />
                        </section>
                        {getMaterialNames()}
                    </section>
                </section>
            </section>
            <section style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: '3vh',
            }}>
                <button className={practiceLessonEditor.saveBtn} style={{marginRight : '2vw'}} onClick={() => saveTask()}>Сохранить подборку</button>
                <button className={ownTaskEditor.cancelBtn}>Отменить</button>
            </section>
        </main>
    );
};

export default OwnTaskEditor;