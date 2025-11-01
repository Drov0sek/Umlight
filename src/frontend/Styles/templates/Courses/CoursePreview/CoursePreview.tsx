import {useEffect, useMemo, useState} from "react";
import CourseDescription from "./CourseDescription.tsx";
import ModulesList from "./ModulesList.tsx";
import preview from '../../../CourseStyles/CoursePreview.module.css'
import {useParams} from "react-router";
import {useSelector} from "react-redux";
import type {RootState} from "../../../../store/store.ts";
import {HasAlreadyJoinedError} from "../../../../../backend/errors/HasAlreadyJoinedError.ts";
type CourseDataType = {
    courseId: number;
    courseName: string;
    courseDescription: string;
    titleImage: string;
    courseTime: number;
    courseAuthor: {
        authorName: string;
        authorSurname: string;
    };
};

type ModuleType = {
    numberOfModule : number,
    name : string,
    numberOfLessons : number
}

const CoursePreview = () => {
    const [isLoading,setIsLoading] = useState(true)
    const { courseId } = useParams<{ courseId: string }>();
    const id = Number(courseId);
    const [lessonsAmount,setLessonsAmount] = useState(0)
    const [courseAuthor,setCourseAuthor] = useState('')
    const [courseName,setcourseName] = useState('')
    const [courseTime,setcourseTime] = useState(0)
    const [courseStudentsAmount,setCourseStudentsAmount] = useState(0)
    const [titleImage,setTitleImage] = useState('')
    const [courseDescription,setCourseDescription] = useState('')
    const [courseTags,setCourseTags] = useState([])
    const login = useSelector((state : RootState) => state.authController.userLogin)
    const [hasJoined,setHasjoined] = useState(false)
    const [modules,setModules] = useState<ModuleType[]>([])

    useEffect(() => {
        async function getCourseData() {
            try {
                const resp = await fetch(`http://localhost:4200/api/getCourseData/${id}`)
                if (!resp.ok){
                    alert('Произошла техническая ошибка. Зайдите на сайт позже')
                }
                else {
                    const courseData : CourseDataType = await resp.json()
                    setcourseName(courseData.courseName)
                    setCourseDescription(courseData.courseDescription)
                    setcourseTime(courseData.courseTime)
                    setTitleImage(courseData.titleImage)
                    setCourseAuthor(courseData.courseAuthor.authorName + ' ' + courseData.courseAuthor.authorSurname)
                }
            } catch (e) {
                console.log(e)
                alert('На сайте произошла техническая ошибка. Зайдите на сайт позже')
            }
            try {
                const resp = await fetch(`http://localhost:4200/api/getCourseLessonsAmount/${id}`)
                if(!resp.ok){
                    alert('Техническая ошибка на сайте. Зайдите позже')
                }
                else {
                    const lessonsAmountData : number = await resp.json()
                    setLessonsAmount(lessonsAmountData)
                }
            } catch (e) {
                alert('На сайте техническая ошибка. Зайдите на сайт позже')
                console.log(e)
            }
            try {
                const resp = await fetch(`http://localhost:4200/api/getCourseStudentsAmount/${id}`)
                if(!resp.ok){
                    alert("На сайте произошла техническая ошибка. Зайдите на сайт попозже")
                }
                else {
                    const courseStudentAmountData : number = await resp.json()
                    setCourseStudentsAmount(courseStudentAmountData)
                }
            } catch (e) {
                alert("На сайте произошла техническая ошибка. Зайдите на сайт попозже")
                console.log(e)
            }
            try {
                const resp = await fetch(`http://localhost:4200/api/getTags/${id}`)
                if(!resp.ok){
                    alert('На сайте техническая ошибка. Зайдите на сайт попозже')
                }
                else {
                    const tagsData = await resp.json()
                    setCourseTags(tagsData)
                }
            } catch (e) {
                console.log(e)
                alert('На сайте техническая ошибка. Зайдите на сайт попозже')
            }
        }
        async function getCourseModules(){
            try {
                const resp = await fetch(`http://localhost:4200/api/getModules/${id}`)
                if (resp.ok){
                    const modulesData : ModuleType[] = await resp.json()
                    setModules(modulesData)
                }
            } catch (e) {
                console.log(e)
                alert('Произошла ошибка при загрузке модулей. Попробуйте зайти на сайт позже')
            }
        }
        getCourseData()
        getCourseModules()
    }, []);
    useEffect(() => {
        async function getModules(){
            try {
                const resp = await fetch(`http://localhost:4200/api/getModules/${id}`)
                if (resp.ok){
                    const modulesData : ModuleType[] = await resp.json()
                    setModules(modulesData)
                }
                else {
                    throw new Error()
                }
            } catch (e) {
                console.log(e)
                alert('Произошла ошибка при загрузке модулей. Зайдите на сайт позже')
            }
        }
        getModules()
    }, [id]);
    useEffect(() => {
        async function isInCourse(){
            try{
                const resp = await fetch('http://localhost:4200/api/isInCourse', {
                    method : 'POST',
                    headers : {
                        'Content-Type': 'application/json',
                    },
                    body : JSON.stringify({
                        userLogin : login,
                        courseId : id
                    })
                })
                if (resp.ok){
                    const isInCourseData : boolean = await resp.json()
                    setHasjoined(isInCourseData)
                    setIsLoading(false)
                } else {
                    console.error('Error checking course membership:', resp.status)
                }
            } catch (e) {
                alert('На сервере произошла ошибка. Попробуйте зайти на сайт позже')
                console.log(e)
            }
        }
        console.log('erfef')
        isInCourse()
    },[login,id])
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem(`course_${id}_joined`, JSON.stringify(hasJoined));
        }
    }, [hasJoined, isLoading, id]);
    useEffect(() => {
        const savedHasJoined = localStorage.getItem(`course_${id}_joined`);
        if (savedHasJoined) {
            setHasjoined(JSON.parse(savedHasJoined));
        }
    }, [id]);
    useEffect(() => {
        console.log('modules: ', modules)
    }, [modules]);

    const getCourseTags = useMemo(() => {
        return courseTags.map((tag, i) => <p key={i}>{tag}</p>);
    }, [courseTags]);
    async function joinCourse(login : string){
        try {
            const resp = await fetch(`http://localhost:4200/api/joinCourse`,{
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify({
                    userLogin : login,
                    courseId : id
                })
            })
            if (resp.ok){
                setHasjoined(true)
            }
            else {
                if (resp.status === 404){
                    throw new HasAlreadyJoinedError('Вы уже вступили в этот курс')
                }
                throw new Error(await resp.json().then(e => e.message))
            }
        } catch (e) {
            if (e instanceof HasAlreadyJoinedError){
                alert('Вы уже вступили в этот курс')
            }
            else {
                alert('Что-то пошло не так при вступлении в курс. Попробуйте ещё раз позже')
            }
        }
    }

    return (
        <main className={preview.main}>
            <section  className={preview.preview}>
                <img src={titleImage} className={preview.titleImage}/>
                <section className={preview.info}>
                    <div className={preview.authorAndTitle}>
                        <p className={preview.title}>{courseName}</p>
                        <p className={preview.author}>{courseAuthor}</p>
                    </div>
                    <section>
                        <section className={preview.lessonAndStudentAmount}>
                            <div className={preview.lessonAmount}>
                                <img src={'http://localhost:8080/siteImages/List.svg'}/>
                                <p>{lessonsAmount} занятий</p>
                            </div>
                            <div className={preview.studentAmount}>
                                <img src={'http://localhost:8080/siteImages/User.svg'}/>
                                <p>{courseStudentsAmount} учеников</p>
                            </div>
                        </section>
                        <section className={preview.timeAndTags}>
                            <div className={preview.time}>
                                <img src={'http://localhost:8080/siteImages/Clock.svg'}/>
                                <p>{courseTime} месяцев</p>
                            </div>
                            <div className={preview.tags}>
                                <img src={'http://localhost:8080/siteImages/Book.svg'}/>
                                {getCourseTags}
                            </div>
                        </section>
                    </section>
                    <button className={preview.signUp} onClick={() => {
                        console.log(modules, hasJoined)
                        joinCourse(login)
                    }}>{hasJoined ? 'Вы уже вступили в этот курс' : 'Вступить'}</button>
                </section>
            </section>
            <CourseDescription courseDesc={courseDescription}/>
            <hr/>
            <ModulesList modules={modules}
                         courseId={id}/>
        </main>
    );
};

export default CoursePreview;