import {type ChangeEvent, useEffect, useRef, useState} from "react";
import theoryLessonEditor from '../Styles/CourseConstructorStyles/TheoryLessonEditor.module.css'
import {setReduxLessonMaterials, setLesson} from "../store/slices/editLessonsReducer.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../store/store.ts";

type LessonType = {
    moduleName : string,
    name : string,
    type : string,
    description : string,
    video : string,
    time : number,
    numberoflesson : number,
    materials : MaterialType[]
}
type ReduxLessonType = {
    name : string,
    type : string,
    description : string,
    video : string,
    time : number,
    numberoflesson : number,
}
type MaterialType = {
    materialName : string,
    materialLink : string
}
type ModuleLessonType = {
    moduleName : string,
    lesson : ReduxLessonType
}

const TheoryLessonEditor = (props : LessonType) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isDescEditing, setIsDescEditing] = useState(false)
    const [lessonDesc, setLessonDesc] = useState(props.description)
    const [video, setVideo] = useState<string>(props.video)
    const [isLinkEditing, setIsLinkEditing] = useState(false)
    const [time, setTime] = useState(props.time)
    const [type, setType] = useState(props.type)
    const reduxLessonMaterials = useSelector((state : RootState) => state.editLessonsReducer.lessonsMaterials.filter(e => e.numberOfLesson === props.numberoflesson)[0]?.materialNames)
    const [lessonMaterials, setLessonMaterials] = useState(reduxLessonMaterials ?? [])
    const materialInputRef = useRef<HTMLInputElement | null>(null)
    const dispatch = useDispatch()

    const uploadFile = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const fileNames = Array.from(files).map(f => f.name);

        setLessonMaterials(prev => {
            const updated = [...prev, ...fileNames];

            dispatch(setReduxLessonMaterials({
                numberOfLesson: props.numberoflesson,
                materialNames: updated
            }));

            return updated;
        });
    };

    useEffect(() => {
        const lessonObj : ModuleLessonType = {
            moduleName : props.moduleName,
            lesson : {
                name : props.name,
                type : type,
                time : time,
                description : lessonDesc,
                video : video,
                numberoflesson : props.numberoflesson
            }
        }
        console.log(lessonObj)
        dispatch(setLesson(lessonObj))
    }, [dispatch, lessonDesc, props.moduleName, props.name, props.numberoflesson, time, type, video]);


    return (
        <section style={{overflow : 'auto', height : '95vh'}}>
            <section style={{display : 'flex', flexDirection : 'row', backgroundColor : '#f4f4f4'}}>
                <section className={theoryLessonEditor.videoBlock}>
                    {props.video !== '' ? <iframe className={theoryLessonEditor.video} src="https://rutube.ru/play/embed/08a07d2506fb8ae8656545263ee6f640/?p=2roLTVy1B5Behu5Ei0eKXQ"></iframe> :
                        <div></div>}
                    <section style={{display : 'flex', alignItems : 'center'}} onClick={() => setIsLinkEditing(!isLinkEditing)}>
                        <img src={'http://localhost:8080/siteImages/Link.svg'} className={theoryLessonEditor.linkImg}/>
                        <textarea className={theoryLessonEditor.linkEditor} value={video} onChange={(event) => setVideo(event.target.value)}>
                        </textarea>
                    </section>
                </section>
                <section className={theoryLessonEditor.nameBlock}>
                    <p className={theoryLessonEditor.name}>Занятие {props.numberoflesson}: {props.name}</p>
                    <section className={theoryLessonEditor.typeAndTimeBlock}>
                        <section className={theoryLessonEditor.typeOrTimeBlock}>
                            <img className={theoryLessonEditor.typeOrTimeImg} src={'http://localhost:8080/siteImages/Clock.svg'}/>
                            <textarea className={theoryLessonEditor.timeTextEditor} value={!isNaN(time) ? time : ''} onChange={(event) => setTime(Number(event.target.value))}></textarea>
                            <p className={theoryLessonEditor.typeOrTimeText}>минут</p>
                        </section>
                        <section className={theoryLessonEditor.typeOrTimeBlock}>
                            <img className={theoryLessonEditor.typeOrTimeImg} src={'http://localhost:8080/siteImages/List.svg'}/>
                            <p onClick={() => {
                                if (type === 'Теория'){
                                    setType('Практика')
                                } else {
                                    setType('Теория')
                                }
                            }} className={theoryLessonEditor.typeOrTimeText}>{type}</p>
                        </section>
                        <img className={theoryLessonEditor.infoImg} onMouseEnter={() => setIsHovered(true)}
                             onMouseLeave={() => setIsHovered(false)}
                             src={'http://localhost:8080/siteImages/Info.svg'}
                             alt={'Информация'}/>
                        {isHovered ?
                            <section>
                                <p className={theoryLessonEditor.infoText}>нажмите, чтобы поменять</p>
                            </section>
                            : <></>}
                    </section>
                </section>
            </section>
            <section style={{display : 'flex', flexDirection : 'row', marginLeft : 'calc(50vw / 1920 * 100)'}}>
                <section className={theoryLessonEditor.materialBlock}>
                    <p className={theoryLessonEditor.materialTitle}>Материалы к занятию</p>
                    {lessonMaterials?.map(e => <p className={theoryLessonEditor.materialName}>{e}</p>)}
                    <section style={{display : 'flex', alignItems : 'center'}}>
                        <img className={theoryLessonEditor.uploadImg} src={'http://localhost:8080/siteImages/Download.svg'}/>
                        <button onClick={() => materialInputRef.current?.click()} className={theoryLessonEditor.materialBtn}>
                            Загрузить файл
                        </button>
                        <input onChange={uploadFile} hidden={true} ref={materialInputRef} type={'file'}/>
                    </section>
                </section>
                <section className={theoryLessonEditor.descBlock}>
                    <section style={{display : 'flex', flexDirection : 'row', alignItems : 'center'}}>
                        <p className={theoryLessonEditor.descTitle}>Описание занятия</p>
                        <img className={theoryLessonEditor.descEditImg} src={'http://localhost:8080/siteImages/Edit.svg'}
                             onClick={() => setIsDescEditing(!isDescEditing)}/>
                    </section>
                    {isDescEditing ? <section>
                        <textarea className={theoryLessonEditor.descEdit} value={lessonDesc} onChange={(event) => setLessonDesc(event.target.value)}></textarea>
                    </section> : <section className={theoryLessonEditor.descEdit}>
                    <p>{lessonDesc}</p>
                    </section>}
                </section>
            </section>
        </section>
    );
};

export default TheoryLessonEditor;