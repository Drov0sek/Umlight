import desc from '../../../CourseStyles/LessonDescription.module.css'

type PropsType = {
    description : string
}

const LessonDesc = (props : PropsType) => {
    return (
        <section className={desc.description}>
            <p className={desc.title}>Описание занятия</p>
            <section className={desc.descriptionText}>
                <p>{props.description}</p>
            </section>
        </section>
    );
};

export default LessonDesc;