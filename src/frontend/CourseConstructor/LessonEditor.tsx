import {useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../store/store.ts";
import PracticeLessonEditor from "./PracticeLessonEditor.tsx";
import TheoryLessonEditor from "./TheoryLessonEditor.tsx";
import {useEffect} from "react";

type MaterialType = {
    materialName : string,
    materialLink : string
}


const LessonEditor = () => {
    const {moduleName, numberOfLesson} = useParams<string>()
    const dispatch = useDispatch()
    const lessonData = useSelector((state: RootState) => {
        if (!moduleName) return null;
        const module = state.editLessonsReducer.moduleLessons[moduleName];
        if (!module || !Array.isArray(module)) return null;
        const index = Number(numberOfLesson) - 1;
        if (index < 0 || index >= module.length) return null;

        return module[index];
    });
    useEffect(() => {
        console.log(lessonData)
    }, [lessonData]);

    return (
        <main>
            {lessonData?.type === 'Практика' ? <PracticeLessonEditor moduleName={moduleName || ''} name={lessonData.name} type={lessonData.type} description={lessonData.description} video={lessonData.video || ''} time={lessonData.time} numberoflesson={lessonData.numberoflesson}/>
                :
                <TheoryLessonEditor moduleName={moduleName || ''} name={lessonData?.name || ''} type={lessonData?.type || 'Теория'} description={lessonData?.description || ''} video={lessonData?.video || 'https://rutube.ru/video/private/08a07d2506fb8ae8656545263ee6f640/?p=2roLTVy1B5Behu5Ei0eKXQ'} time={lessonData?.time || 0} numberoflesson={lessonData?.numberoflesson || 0} materials={[]}/>}
        </main>
    );
};

export default LessonEditor;