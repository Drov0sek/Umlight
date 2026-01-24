import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import _ from 'lodash';

type ModuleType = {
    numberOfModule : number,
    name : string,
    numberOfLessons : number
}
type ReduxLessonType = {
    name : string,
    type : string,
    description : string,
    video : string,
    time : number,
    numberoflesson : number
}
type ModuleLessonType = {
    moduleName : string,
    lesson : ReduxLessonType
}
type LessonMaterialType = {
    numberOfLesson : number,
    materialNames : string[]
}
type ModuleLessons = {
    [moduleName: string]: ReduxLessonType[];
}
type EditLessonsState = {
    moduleLessons: ModuleLessons,
    modules: ModuleType[],
    description : string,
    lessonsMaterials : LessonMaterialType[],
    currentLesson : CurrentLessonType,
    lessonPublicTasks : PracticeLessonPublicTaskType[]
    lessonOwnTasks : PracticeLessonOwnTaskType[]
};
type CurrentLessonType = {
    numberOfLesson : number,
    moduleName : string
}
type PracticeLessonPublicTaskType = {
    numberOfLesson : number,
    moduleName : string,
    publicTaskId : number,
}
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
const initialState: EditLessonsState = {
    moduleLessons: {},
    modules: [],
    description : '',
    lessonsMaterials : [],
    currentLesson : {
        numberOfLesson : 0,
        moduleName : ''
    },
    lessonPublicTasks : [],
    lessonOwnTasks : []
};

export const editLessonsReducer = createSlice({
    name : 'editLessonsReducer',
    initialState : initialState,
    reducers : {
        setReduxModulesLessons : (state, {payload} : PayloadAction<ModuleLessons>) => {
            state.moduleLessons = payload
        },
        setReduxModules : (state, {payload} : PayloadAction<ModuleType[]>) => {
            state.modules = payload
        },
        setReduxDesc : (state, {payload} : PayloadAction<string>) => {
            state.description = payload
        },
        setReduxLessonMaterials : (state, {payload} : PayloadAction<LessonMaterialType>) => {
            if (state.lessonsMaterials.map(e => e.numberOfLesson).includes(payload.numberOfLesson)){
                const lessonIndex = state.lessonsMaterials.findIndex(e => e.numberOfLesson === payload.numberOfLesson)
                state.lessonsMaterials[lessonIndex] = payload
            } else {
                state.lessonsMaterials.push(payload)
            }
        },
        setLesson : (state, {payload} : PayloadAction<ModuleLessonType>) => {
            const lessonIndex = state.moduleLessons[payload.moduleName]?.findIndex(e => e.numberoflesson === payload.lesson.numberoflesson)
            if (lessonIndex !== undefined){
                state.moduleLessons[payload.moduleName][lessonIndex] = payload.lesson
            }
        },
        setCurrentLesson : (state, {payload} : PayloadAction<CurrentLessonType>) => {
            state.currentLesson = payload
        },
        addLessonTask : (state, {payload} : PayloadAction<PracticeLessonPublicTaskType>) => {
            state.lessonPublicTasks.push(payload)
        },
        deleteLessonPublicTask : (state, {payload} : PayloadAction<PracticeLessonPublicTaskType>) => {
            state.lessonPublicTasks = state.lessonPublicTasks.filter(e => (e.publicTaskId !== payload.publicTaskId && e.numberOfLesson === payload.numberOfLesson && e.moduleName === payload.moduleName) || e.numberOfLesson !== payload.numberOfLesson || e.moduleName !== payload.moduleName)
        },
        addOwnLessonTask : (state, {payload} : PayloadAction<PracticeLessonOwnTaskType>) => {
            state.lessonOwnTasks.push(payload)
        },
        deleteLessonOwnTask : (state, {payload} : PayloadAction<PracticeLessonOwnTaskType>) => {
            state.lessonOwnTasks = state.lessonOwnTasks.filter(e => !_.isEqual(e, payload))
        }
}})
export const { setReduxModulesLessons, setReduxModules, setReduxDesc, setReduxLessonMaterials, setLesson, setCurrentLesson, addLessonTask, deleteLessonPublicTask, addOwnLessonTask, deleteLessonOwnTask} = editLessonsReducer.actions
export default editLessonsReducer.reducer