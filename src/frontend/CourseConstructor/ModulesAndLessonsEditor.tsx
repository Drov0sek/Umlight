import {type ChangeEvent, useEffect, useRef, useState} from "react";
import modulesAndLessonsEditor from '../Styles/CourseConstructorStyles/ModulesAndLessonsEditor.module.css'
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../store/store.ts";
import {setReduxModulesLessons, setReduxModules, setReduxDesc, setUserCourseTags, setCourseName, setCourseTime, setCourseImage} from '../store/slices/editLessonsReducer.ts'
import {useNavigate} from "react-router-dom";
import MultipleSelect from "../Styles/templates/MultipleSelect.tsx";
import practiceLessonEditor from "../Styles/CourseConstructorStyles/PracticeLessonEditor.module.css";

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
    const savedTags = useSelector((state : RootState) => state.editLessonsReducer.tags)
    const [tags, setTags] = useState<string[]>(savedTags)
    const options = ["Профильная математика","Русский язык", "Информатика","Физика", "Базовая математика", "Химия", "История", "Обществознание", "Биология", "География", "Английский язык", "Немецкий язык", "Французский язык", "Испанский язык", "Китайский язык", "Литература", 'Пользовательский']
    const [name, setName] = useState('')
    const [time, setTime] = useState(0)
    const imageInputRef = useRef<HTMLInputElement | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const emptyFile = new File([], '', { type: '' })
    const [image, setImage] = useState<File>(emptyFile)

    function setCourseTags(e : string[]){
        setTags(e)
    }
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
                                          setModules(prev =>
                                              prev.map(m =>
                                                  m.numberOfModule === e.numberOfModule
                                                      ? { ...m, name: newValue }
                                                      : m
                                              )
                                          );
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
    async function saveCourse() {
        try {
            const formData = new FormData();
            formData.append(
                "meta",
                JSON.stringify({
                    modules: data.modules,
                    moduleLessons: data.moduleLessons,
                    description: data.description,
                    lessonsMaterials: data.lessonsMaterials,
                    lessonPublicTasks: data.lessonPublicTasks,
                    lessonOwnTasks: data.lessonOwnTasks.map(task => ({
                        numberOfLesson: task.numberOfLesson,
                        moduleName: task.moduleName,
                        taskText: task.taskText,
                        answer: task.answer,
                        type: task.type,
                        time: task.time,
                    })),
                    tags: data.tags,
                    name: data.name,
                    time: data.time
                })
            );
            data.lessonOwnTasks.forEach((task, index) => {
                if (task.image && task.image instanceof File) {
                    formData.append(`ownTaskImage_${index}`, task.image);
                }
                task.materials.forEach((file, fileIndex) => {
                    if (file instanceof File) {
                        formData.append(`ownTaskMaterial_${index}_${fileIndex}`, file);
                    }
                });
            });

            console.log("Отправляемые файлы:", data.lessonOwnTasks.map(t => ({
                hasImage: !!t.image,
                imageName: t.image?.name,
                materialsCount: t.materials.length
            })));

            const response = await fetch("http://localhost:4200/api/createCourse", {
                method: "POST",
                body: formData,
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error("Ошибка сохранения курса");
            }

            const result = await response.json();
            console.log("Курс сохранён:", result);

            alert("Курс успешно сохранён");
        } catch (err) {
            console.error(err);
            alert("Ошибка при сохранении курса");
        }
    }
    function uploadImage(e: ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (!files || !files[0]) return
        const file = files[0]
        if (!file.type.startsWith('image/')) {
            alert('Можно загрузить только изображение')
            e.target.value = ''
            return
        }
        setImage(file)

        const previewUrl = URL.createObjectURL(file)
        setImagePreview(previewUrl)
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
    useEffect(() => {
        dispatch(setUserCourseTags(tags))
    }, [tags, dispatch]);
    useEffect(() => {
        dispatch(setCourseName(name))
    }, [name]);
    useEffect(() => {
        dispatch(setCourseTime(time))
    }, [time]);
    useEffect(() => {
        dispatch(setCourseImage(image))
    }, [image, dispatch]);

    return (
        <section className={modulesAndLessonsEditor.editorBlock}>
            <p className={modulesAndLessonsEditor.courseInfoEditor}>Информация о занятии</p>
            <section style={{display : 'flex', flexDirection : 'row', alignItems : 'self-start'}}>
                <section style={{display : 'flex', flexDirection : 'column'}}>
                    <section>
                        <p className={practiceLessonEditor.name}>Название курса</p>
                        <input className={modulesAndLessonsEditor.courseInfoInput} type='text' value={name}
                               onChange={(e) => setName(e.target.value)}/>
                    </section>
                    <section>
                        <p style={{marginTop: '3vh'}} className={practiceLessonEditor.name}>Введите время курса</p>
                        <input className={modulesAndLessonsEditor.courseInfoInput} type='text' value={time}
                               onChange={(e) => {
                                   if (!isNaN(Number(e.target.value))) {
                                       setTime(Number(e.target.value))
                                   }
                               }}/>
                    </section>
                </section>
                <section style={{display : 'flex', flexDirection : 'column', marginLeft : 'calc(80vw / 1920 * 100)'}}>
                    <section>
                        <p className={modulesAndLessonsEditor.tagsTitle}>Выберите предметы для подготовки</p>
                        <MultipleSelect sentOptions={tags} options={options} changer={setCourseTags}/>
                    </section>
                    <section>
                        <p className={modulesAndLessonsEditor.courseImageEditor}>Титульное изображение</p>
                        <section style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'self-start',
                            marginTop: 'calc(19vh / 1080 * 100)'
                        }}>
                            <p className={modulesAndLessonsEditor.imageName}>{image.name === null || image.name === '' ? 'Здесь будет имя вашего изображения' : image.name}</p>
                            <img className={modulesAndLessonsEditor.courseImageDownload}
                                 onClick={() => imageInputRef.current?.click()}
                                 src={'http://localhost:8080/siteImages/Download.svg'}/>
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                ref={imageInputRef}
                                onChange={uploadImage}
                            />
                        </section>
                    </section>
                </section>
            </section>
            <section className={modulesAndLessonsEditor.titleBlock}>
                <p className={modulesAndLessonsEditor.title}>Занятия</p>
                <img className={modulesAndLessonsEditor.infoImage} onMouseEnter={() => setIsHovered(true)}
                     onMouseLeave={() => setIsHovered(false)} src={'http://localhost:8080/siteImages/Info.svg'}
                     alt={'Информация'}/>
                {isHovered ?
                    <section>
                        <p className={modulesAndLessonsEditor.infoTip}>нажмите в центр блока/названия, чтобы
                            редактировать</p>
                        <p className={modulesAndLessonsEditor.infoTip}>название модулей должны быть уникальными</p>
                    </section>
                    : <></>}
            </section>
            {renderModulesAndLessons()}
            {renderDescription()}
            <button onClick={() => saveCourse()}>Сохранить курс</button>
        </section>
    );
};

export default ModulesAndLessonsEditor;