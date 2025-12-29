import {useEffect, useState} from "react";
import searchById from '../Styles/TaskDBStyles/SearchById.module.css'

type PropsType = {
    idFilter : number,
    setIdFilter : (newId : number) => void
}

const SearchById = ({idFilter, setIdFilter} : PropsType) => {
    const [id, setId] = useState<string>(idFilter ? idFilter.toString() : '')
    useEffect(() => {
        console.log(idFilter)
    }, [idFilter]);

    return (
        <section>
            <p className={searchById.title}>Поиск по номеру</p>
            <section>
                <input className={searchById.idInput} type='text' placeholder='Номер задачи' value={id} onChange={e => setId(e.target.value)}/>
                <button className={searchById.findIdButton} onClick={() => {
                    console.log('qwer')
                    if (!isNaN(Number(id))){
                        console.log('yes')
                        console.log(id)
                        setIdFilter(Number(id))
                } else {
                        alert('Введите число, пожалуйста')
                    }
                }}>Показать задание</button>
            </section>
        </section>
    );
};

export default SearchById;