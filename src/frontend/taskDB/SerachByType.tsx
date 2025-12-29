import MultipleSelect from "../Styles/templates/MultipleSelect.tsx";
import {useEffect, useState} from "react";
import searchByType from '../Styles/TaskDBStyles/SearchByType.module.css'

type PropsType = {
    taskTypes : string[],
    setTypes : (newTypes : string[]) => void
}

const SerachByType = ({taskTypes, setTypes} : PropsType) => {
    const [chosenTypes, setChosenTypes] = useState<string[]>([])
    useEffect(() => {
        console.log(chosenTypes)
    }, [chosenTypes]);
    return (
        <section className={searchByType.search}>
            <p className={searchByType.title}>Поиск по типу</p>
            <section className={searchByType.searchBlock}>
                <MultipleSelect sentOptions={chosenTypes} options={taskTypes} changer={(newTypes) => {
                    setChosenTypes(newTypes)
                }}/>
                <button onClick={() => setTypes(chosenTypes)} className={searchByType.searchButton}>Показать задания</button>
            </section>
        </section>
    );
};

export default SerachByType;