import LessonMaterials from "./LessonMaterials.tsx";
import LessonDesc from "./LessonDesc.tsx";
import theoryLesson from '../../../CourseStyles/TheoryLesson.module.css'
import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {useSession} from "../../../../customHooks/useSession.ts";

type LessonType = {
    id : number,
    type : string,
    video : string,
    time : number,
    name : string,
    numberOfLesson : number,
    description : string
}
type MaterialType = {
    id : number,
    material : string,
    materialName : string
}

const TheoryLesson = () => {
    const {userId} = useSession()
    const {taskId} = useParams<{taskId : string}>()
    const lessonId = Number(taskId)
    const [lesson,setLesson] = useState<LessonType>({id : 0, type : '',video : '',time : 0,name : '',numberOfLesson : 0,description : ''})
    const [materials,setMaterials] = useState<MaterialType[]>([])
    useEffect(() => {
        async function getLesson(){
            try {
                const resp = await fetch(`http://localhost:4200/api/getLesson/${lessonId}`)
                if (resp.ok){
                    const lessonData : LessonType = await resp.json()
                    setLesson({id : lessonData.id,
                        type : lessonData.type,
                        video : lessonData.video,
                        time : lessonData.time,
                        name : lessonData.name,
                        numberOfLesson : lessonData.numberOfLesson,
                        description : lessonData.description})
                } else {
                    console.log(await resp.json())
                    alert('Произошла ошибка при загрузке задания.Войдите на сайт позже')
                }
            } catch (e) {
                console.log(e)
                alert('Произошла ошибка при загрузке задания.Войдите на сайт позже')
            }
        }
        async function getLessonsMaterials(){
            try {
                const resp = await fetch(`http://localhost:4200/api/getLessonMaterials/${lessonId}`)
                if (resp.ok){
                    const lessonsMaterialData : MaterialType[] = await resp.json()
                    setMaterials(lessonsMaterialData)
                    console.log(lessonsMaterialData)
                }
            } catch (e) {
                console.log(e)
                alert('Произошла ошибка при загрузке материалов занятия. Попробуйте позже')
            }
        }
        getLesson()
        getLessonsMaterials()
    }, []);
    useEffect(() => {
        async function setSeenLesson(){
            if (lesson.id > 0){
                try {
                    const resp = await fetch(`http://localhost:4200/api/setSeenLesson/${userId}/${lesson.id}`,{
                        method : 'POST'
                    })
                    if (!resp.ok){
                        throw new Error()
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        }
        setSeenLesson()
    }, [lesson]);
    return (
        <div className={theoryLesson.main}>
            <section className={theoryLesson.lesson}>
                <section className='video'>
                    <video src={lesson.video} controls={true} preload={'metadata'} width={854} height={480}/>
                </section>
                <section>
                    <p style={{marginLeft : '65px'}}>Занятие {lesson.numberOfLesson}: {lesson.name}</p>
                    <section className={theoryLesson.timeAndType}>
                        <div className={theoryLesson.time}>
                            <img src={'http://localhost:8080/siteImages/Clock.svg'}/>
                            <p>{lesson.time} минут</p>
                        </div>
                        <div className={theoryLesson.type}>
                            <img src={'http://localhost:8080/siteImages/List.svg'}/>
                            <p>Теория</p>
                        </div>
                    </section>
                </section>
            </section>
            <section className={theoryLesson.materialsAndDesc}>
                <LessonMaterials materials={materials}/>
                <LessonDesc description={lesson.description}/>
            </section>
        </div>
    );
};

export default TheoryLesson;