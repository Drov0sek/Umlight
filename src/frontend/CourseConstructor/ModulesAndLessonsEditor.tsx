import {useEffect, useState} from "react";
import modulesAndLessonsEditor from '../Styles/CourseConstructorStyles/ModulesAndLessonsEditor.module.css'
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../store/store.ts";
import {setReduxModulesLessons, setReduxModules, setReduxDesc} from '../store/slices/editLessonsReducer.ts'
import {useNavigate} from "react-router-dom";

type ModuleType = {
    numberOfModule : number,
    name : string,
    numberOfLessons : number
}
type LessonType = {
    name : string,
    type : string,
    description : string,
    video : string,
    time : number,
    numberoflesson : number
}
type ModuleLessons = {
    [moduleName: string]: LessonType[];
}

const ModulesAndLessonsEditor = () => {
    const dispatch = useDispatch()
    const data = useSelector((state : RootState) => state.editLessonsReducer)
    const reduxModules = useSelector((state: RootState) => state.editLessonsReducer.modules)
    const reduxModuleLessons = useSelector((state: RootState) => state.editLessonsReducer.moduleLessons)
    const [modules, setModules] = useState<ModuleType[]>(reduxModules)
    const [moduleLessons, setModuleLessons] = useState<ModuleLessons>(reduxModuleLessons)
    const [isHovered, setIsHovered] = useState(false)
    const [openedIndexes, setOpenedIndexes] = useState<number[]>(modules.map((_e, index) => index))
    const [courseDesc, setCourseDesc] = useState(data.description)
    const [isDescEditing, setIsDescEditing] = useState(false)
    const nav = useNavigate()

    function renderLessons(moduleName : string){
        return <section>
            {moduleLessons?.[moduleName]?.map(e => <section className={modulesAndLessonsEditor.actualLesson}>
                <p className={modulesAndLessonsEditor.actualLessonText} onClick={() => {
                    nav(`/courseConstructor/${moduleName}/${e.numberoflesson}`)
                }}>Занятие {e.numberoflesson}: </p>
                <div>
                    <textarea className={modulesAndLessonsEditor.nameEditor} value={e.name} onChange={(event) => {
                        const newValue = event.target.value;
                        setModuleLessons(prev => {
                            const moduleLessons = prev?.[moduleName] || [];
                            const lessonIndex = moduleLessons.findIndex(
                                lesson => lesson.numberoflesson === e.numberoflesson
                            );
                            if (lessonIndex === -1) return prev;
                            const updatedLessons = [...moduleLessons];
                            updatedLessons[lessonIndex] = {
                                ...updatedLessons[lessonIndex],
                                name: newValue
                            };
                            return {
                                ...prev,
                                [moduleName]: updatedLessons
                            };
                        });
                    }}>{e.name}</textarea>
                </div>
                <button className={modulesAndLessonsEditor.deleteBtn} onClick={() => {
                    setModuleLessons(prevState => ({
                        ...prevState,
                        [moduleName]: prevState ? prevState?.[moduleName].filter(r => e.numberoflesson !== r.numberoflesson) : []
                    }))
                }}>Удалить занятие
                </button>
            </section>)}
            <section className={modulesAndLessonsEditor.suggestedLesson} onClick={() => {
                const newLesson = {
                    name: '',
                    type: '',
                    description: '',
                    video: '',
                    time: 0,
                    numberoflesson : moduleLessons ? moduleLessons?.[moduleName].length + 1 : 1
                }
                console.log(newLesson)
                setModuleLessons(prev => ({
                    ...prev,
                    [moduleName]: [...(prev?.[moduleName] || []), newLesson]
                }))
            }}>
                <p className={modulesAndLessonsEditor.suggestedLessonText}>Занятие {(moduleLessons?.[moduleName]?.length || 0) + 1}</p>
            </section>
        </section>
    }
    function renderModulesAndLessons(){
        return <section className={modulesAndLessonsEditor.actualModuleBlock}>
            {modules.map((e, index) => {
                const isOpened = openedIndexes.includes(index)
                return <section key={modules.indexOf(e)} className={modulesAndLessonsEditor.actualModuleBlock}>
                    <section className={modulesAndLessonsEditor.actualModule}>
                        <p className={modulesAndLessonsEditor.actualModuleText}>Модуль {e.numberOfModule}:</p>
                        <img
                            className={isOpened ? modulesAndLessonsEditor.unfolder : modulesAndLessonsEditor.unfolderClosed}
                            onClick={() => {
                                setOpenedIndexes(prev =>
                                    prev.includes(index)
                                        ? prev.filter(i => i !== index)
                                        : [...prev, index]
                                );
                            }} src={'http://localhost:8080/siteImages/Play.svg'}/>
                        <div>
                            <textarea style={{backgroundColor: '#FFFFFF'}}
                                      className={modulesAndLessonsEditor.nameEditor} value={e.name}
                                      onChange={(event) => {
                                          const newValue = event.target.value;
                                          const oldModuleName = e.name;

                                          // 1. Обновляем имя модуля
                                          setModules(prev =>
                                              prev.map(m =>
                                                  m.numberOfModule === e.numberOfModule
                                                      ? { ...m, name: newValue }
                                                      : m
                                              )
                                          );

                                          // 2. Переносим уроки на новое имя модуля
                                          setModuleLessons(prev => {
                                              if (!prev) return {};

                                              const lessonsForThisModule = prev[oldModuleName] || [];
                                              const restModules = { ...prev };
                                              delete restModules[oldModuleName];

                                              return {
                                                  ...restModules,
                                                  [newValue]: lessonsForThisModule
                                              };
                                          });
                                      }}>
                                {e.name}
                            </textarea>
                        </div>
                        <button className={modulesAndLessonsEditor.deleteBtn} onClick={() => {
                            const newModulesArr = modules.filter(r => r.numberOfModule !== e.numberOfModule)
                            setModules(newModulesArr)
                        }}>Удалить модуль
                        </button>
                    </section>
                    {isOpened ? renderLessons(e.name) : <></>}
                </section>
            })}
            <section>
                <section className={modulesAndLessonsEditor.suggestedModule} onClick={() => {
                    setModules([...modules, {
                        numberOfModule: modules.length + 1,
                        name: `${modules.length + 1}`,
                        numberOfLessons: 0
                    }])
                    setModuleLessons(prev => ({
                        ...prev,
                        [`${modules.length + 1}`]: []
                    }))
                }}>
                    <p className={modulesAndLessonsEditor.suggestedModuleText}>Модуль {modules.length + 1}: {}</p>
                </section>
                <section className={modulesAndLessonsEditor.suggestedLessonBlock}>
                    <section className={modulesAndLessonsEditor.suggestedLesson}>
                        <p className={modulesAndLessonsEditor.suggestedLessonText}>Занятие {1}</p>
                    </section>
                    <section className={modulesAndLessonsEditor.suggestedLesson}>
                        <p className={modulesAndLessonsEditor.suggestedLessonText}>Занятие {1}</p>
                    </section>
                    <section className={modulesAndLessonsEditor.suggestedLesson}>
                        <p className={modulesAndLessonsEditor.suggestedLessonText}>Занятие {1}</p>
                    </section>
                </section>
            </section>
        </section>
    }
    function renderDescription(){
        return <section>
            <section className={modulesAndLessonsEditor.descTitleBlock}>
                <p className={modulesAndLessonsEditor.descTitle}>Описание курса</p>
                <img className={modulesAndLessonsEditor.descEditImg} onClick={() => setIsDescEditing(!isDescEditing)}
                     src={'http://localhost:8080/siteImages/Edit.svg'}/>
            </section>
            {isDescEditing ? <section>
                <textarea className={modulesAndLessonsEditor.descEdit} value={courseDesc} onChange={(event) => setCourseDesc(event.target.value)}></textarea>
            </section> : <section className={modulesAndLessonsEditor.descTextBlock}>
                <p className={modulesAndLessonsEditor.descText}>{courseDesc}</p>
            </section>}
        </section>
    }

    useEffect(() => {
        setOpenedIndexes([...openedIndexes, modules.length])
    }, [modules]);
    useEffect(() => {
        dispatch(setReduxModules(modules))
    }, [modules, dispatch]);
    useEffect(() => {
        dispatch(setReduxModulesLessons(moduleLessons))
    }, [moduleLessons, dispatch]);
    useEffect(() => {
        dispatch(setReduxDesc(courseDesc))
    }, [courseDesc, dispatch]);

    return (
        <section className={modulesAndLessonsEditor.editorBlock}>
            <section className={modulesAndLessonsEditor.titleBlock}>
                <p className={modulesAndLessonsEditor.title}>Занятия</p>
                <img className={modulesAndLessonsEditor.infoImage} onMouseEnter={() => setIsHovered(true)}
                     onMouseLeave={() => setIsHovered(false)} src={'http://localhost:8080/siteImages/Info.svg'}
                     alt={'Информация'}/>
                {isHovered ?
                    <section>
                        <p className={modulesAndLessonsEditor.infoTip}>нажмите в центр блока/названия, чтобы редактировать</p>
                        <p className={modulesAndLessonsEditor.infoTip}>название модулей должны быть уникальными</p>
                    </section>
                    : <></>}
            </section>
            {renderModulesAndLessons()}
            {renderDescription()}
        </section>
    );
};

export default ModulesAndLessonsEditor;