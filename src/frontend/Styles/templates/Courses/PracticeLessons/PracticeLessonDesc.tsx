import pracDesc from '../../../CourseStyles/PracticeLessonDesc.module.css'

type PropsType = {
    description : string
}

const PracticeLessonDesc = (props : PropsType) => {
    return (
        <section className={pracDesc.description}>
            <p className={pracDesc.title}>Описание занятия</p>
            <section className={pracDesc.descriptionText}>
                <p>{props.description}</p>
            </section>
        </section>
    );
};

export default PracticeLessonDesc;