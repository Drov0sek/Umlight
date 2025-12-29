import { useState} from "react";
import taskNavBar from '../Styles/TaskDBStyles/TaskNavBar.module.css'

type PropsType = {
    currentSubjectId : number,
    setCurrentSubjectId : (subjectId : number) => void
}

const TaskNavBar = ({currentSubjectId, setCurrentSubjectId} : PropsType) => {
    const [subjects] = useState<string[]>(["Профильная математика","Русский язык","Информатика","Физика","Базовая математика","Химия","История","Обществознание","Биология","География","Английский язык","Немецкий язык","Французский язык","Испанский язык","Китайский язык","Литература"])
    const [currentSubject, setCurrentSubject] = useState(subjects[currentSubjectId])

    function getSubjectOptions(){
        return subjects.map(e =>
            <button onClick={() => {
                setCurrentSubject(e)
                setCurrentSubjectId(subjects.indexOf(e))
            }}
                    className={e != currentSubject ? taskNavBar.option : taskNavBar.currentOption}>
                <div className={e === 'Математика' ? taskNavBar.mathOptionBlock : taskNavBar.optionBlock}>{e === 'Математика' ? <img src={'http://localhost:8080/siteImages/List.svg'}/> : <></>}{e}</div>
            </button>)
    }

    return (
        <section>
            <section className={taskNavBar.taskNavBar}>
                <p className={taskNavBar.title}>Предметы</p>
                <section className={taskNavBar.optionsBlock}>
                    {getSubjectOptions()}
                </section>
            </section>
        </section>
    );
};

export default TaskNavBar;