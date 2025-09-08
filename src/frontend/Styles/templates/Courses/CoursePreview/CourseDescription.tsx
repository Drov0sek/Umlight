import courseDescription from '../../../CourseStyles/CourseDescription.module.css'

type PropsType = {
    courseDesc : string
}

const CourseDescription = ({courseDesc}: PropsType) => {
    return (
        <section className={courseDescription.desc}>
            <p className={courseDescription.title}>Описание курса</p>
            <div className={courseDescription.descTextBlock}>
                <p className={courseDescription.descText}>{courseDesc}</p>
            </div>
        </section>

    );
};

export default CourseDescription;