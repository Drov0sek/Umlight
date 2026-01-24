import {useEffect, useState} from "react";
import moduleList from '../../../CourseStyles/ModuleList.module.css'
import {useNavigate} from "react-router-dom";

type ModuleType = {
    numberOfModule : number,
    name : string,
    numberOfLessons : number
}
type LessonType = {
    id : number,
    name : string,
    type : string,
    description : string,
    video : string,
    time : number,
    numberoflesson : number
}
type PropsType = {
    modules : ModuleType[],
    courseId : number
}

type ModuleLessons = {
    [moduleName: string]: LessonType[];
}


const ModulesList = ({modules,courseId} : PropsType) => {
    const [lessonsByModule, setLessonsByModule] = useState<ModuleLessons>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isOpened,setIsOpened] = useState(true)
    const nav = useNavigate()

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const lessonsData: ModuleLessons = {};
                await Promise.all(modules.map(async (module) => {
                    try {
                        const resp = await fetch(`http://localhost:4200/api/getLessons/${module.name}/${courseId}`);

                        if (!resp.ok) {
                            alert('trgfd')
                            throw new Error(`Ошибка загрузки уроков для модуля ${module.name}`);
                        }

                        const lessons: LessonType[] = await resp.json();
                        lessonsData[module.name] = lessons;
                    } catch (e) {
                        console.error(e);
                        lessonsData[module.name] = [];
                        setError(`Ошибка загрузки уроков для модуля ${module.name}`);
                    }
                }));

                setLessonsByModule(lessonsData);

            } catch (e) {
                console.error(e);
                setError("Общая ошибка загрузки данных");
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
    }, [modules]);
    useEffect(() => {
        console.log('moduleLessons: ',lessonsByModule['Введение'])
    }, [lessonsByModule]);

    if (loading) return <div>Загрузка уроков...</div>;
    if (error) return <div>Ошибка: {error}</div>;
    return (
        <section>
            <p className={moduleList.title}>Занятия на курсе</p>
            <div>
                {modules.map(r => <div key={r.numberOfModule}>
                    <div className={moduleList.module}>
                        <div className={moduleList.moduleName} onClick={() => setIsOpened(!isOpened)}>
                            <p>Модуль {r.numberOfModule}: {r.name}</p>
                            <img className={(isOpened) ? moduleList.unfolder : moduleList.unfolderClosed} src={'http://localhost:8080/siteImages/Play.svg'}/>
                        </div>
                        <p>{r.numberOfLessons} занятий</p>
                    </div>
                    <div className={moduleList.lessons}>
                    {lessonsByModule[r.name]?.map(e => <div onClick={() => {
                        if (e.type === 'Теория'){
                            nav(`/course/${courseId}/theory/${e.id}`)
                        } else {
                            nav(`/course/${courseId}/practice/${e.id}`)
                        }
                    }} className={(isOpened) ? moduleList.lesson : moduleList.lessonClosed} key={e.id}>
                            <p>{e.numberoflesson}. {e.name}</p>
                            <p onClick={() => console.log(lessonsByModule)}>{e.time} минут</p>
                        </div>)}
                    </div>
                </div>)}
            </div>
        </section>
    );
};

export default ModulesList;