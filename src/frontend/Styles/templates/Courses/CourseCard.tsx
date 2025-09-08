import courseCard from '../../CourseStyles/CourseCard.module.css'
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

type PropsType = {
    courseId : number
}
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

const CourseCard = ({courseId} : PropsType) => {
    const nav = useNavigate()
    const [courseData,setCourseData] = useState<CourseDataType>({courseId : 0,courseName : '', courseDescription : '',titleImage : '',courseTime : 0,courseAuthor : {authorName : '',authorSurname : ''}})
    const [author,setAuthor] = useState('')
    const [studentAmount,setStudentAmount] = useState(0)

    useEffect(() => {
        async function getCourseData(){
            try {
                const resp = await fetch(`http://localhost:4200/api/getCourseData/${courseId}`)
                if (resp.ok){
                    const data : CourseDataType = await resp.json()
                    setCourseData({courseId : data.courseId,courseName : data.courseName, courseDescription : data.courseDescription,titleImage : data.titleImage,courseTime : data.courseTime,courseAuthor : {authorName : data.courseAuthor.authorName,authorSurname : data.courseAuthor.authorSurname}})
                    setAuthor(data.courseAuthor.authorName + ' ' + data.courseAuthor.authorSurname)
                } else {
                    alert('Что-то пошло не так. Зайдите позже')
                    console.log(await resp.json())
                    setCourseData({courseId : 0,courseName : '', courseDescription : '',titleImage : '',courseTime : 0,courseAuthor : {authorName : '',authorSurname : ''}})
                }
                const getStudentsAmount = await fetch(`http://localhost:4200/api/getCourseStudentsAmount/${courseId}`)
                if (getStudentsAmount.ok){
                    const studentAmount = await getStudentsAmount.json()
                    setStudentAmount(studentAmount)
                }
                else {
                    alert('fg')
                }
            } catch (e) {
                alert("Произошли технические неполадки. Зайдите позже")
                console.log(e)
                setCourseData({courseId : 0,courseName : '', courseDescription : '',titleImage : '',courseTime : 0,courseAuthor : {authorName : '',authorSurname : ''}})
            }
        }
        getCourseData()
    }, [courseId]);
    return (
        <section className={courseCard.courseCard} onClick={() => {
            nav(`/course/${courseId}`)
        }}>
            <img src={courseData.titleImage} className={courseCard.titleImage}/>
            <div>
                <div className={courseCard.timeAndStudentAmount}>
                    <p className={courseCard.studentAmount}>{studentAmount} учеников</p>
                    <p className={courseCard.time}>{courseData.courseTime} месяцев</p>
                </div>
                <p className={courseCard.name}>
                    {courseData.courseName}
                </p>
                <div className={courseCard.authorAndButton}>
                    <p className={courseCard.author}>{author}</p>
                    <img className={courseCard.button} src={'http://localhost:8080/siteImages/Bookmark.svg'}/>
                </div>
            </div>
        </section>
    );
};

export default CourseCard;