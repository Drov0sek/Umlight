import multipleSelect from '../MultpleSelect.module.css'
import {useEffect, useState} from "react";

type PropsType = {
    sentOptions : string[],
    options : string[],
    changer: (newSubjescts : string[]) => void
}

const MultipleSelect = ({sentOptions, options, changer} : PropsType) => {
    const [isOpened, setIsopened] = useState(false)
    const [currentOptions, setCurrentOptions] = useState<string[]>([])

    useEffect(() => {
        setCurrentOptions(sentOptions || []);
    }, [sentOptions]);

    function getCurrentOptions() {
        if (currentOptions && currentOptions.length > 0) {
            return currentOptions.map(e => (
                <div key={e} className={multipleSelect.currentOptionBlock}>
                    <p className={multipleSelect.currentOption}>{e}</p>
                    <button
                        className={multipleSelect.closeButton}
                        onClick={() => {
                            const newOptions = currentOptions.filter(r => r !== e)
                            setCurrentOptions(newOptions)
                            changer(newOptions)
                        }}
                    >x</button>
                </div>
            ))
        } else {
            return <div></div>
        }
    }
    function getOptions() {
        return options.map(e => (
            <div key={e} className={multipleSelect.optionBlock}>
                <input
                    className={multipleSelect.checkbox}
                    type={'checkbox'}
                    onChange={() => {
                        if (currentOptions && currentOptions.includes(e)) {
                            const newOptions = currentOptions.filter(r => r !== e)
                            setCurrentOptions(newOptions)
                            changer(newOptions)
                        } else {
                            const newOptions = [...(currentOptions), e]
                            setCurrentOptions(newOptions)
                            changer(newOptions)
                        }
                    }}
                    checked={currentOptions ? currentOptions.includes(e) : false}
                />
                <p className={multipleSelect.option}>{e}</p>
            </div>
        ))
    }

    return (
        <section className={multipleSelect.multipleSelect}>
            <section className={multipleSelect.mainBlock}>
                <section className={multipleSelect.currentOptionsBlock}>
                    {getCurrentOptions()}
                </section>
                <img className={isOpened ? multipleSelect.openedOpenOptionsButton : multipleSelect.openOptionsButton} onClick={() => setIsopened(!isOpened)} src={'http://localhost:8080/siteImages/Chevron%20down.svg'}/>
            </section>
            <section className={isOpened ? multipleSelect.openedOptions : multipleSelect.closedOptions}>
                {getOptions()}
            </section>
        </section>
    );
};

export default MultipleSelect;