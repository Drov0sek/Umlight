import taskPreview from '../Styles/TaskDBStyles/TaskPreview.module.css'
import {useNavigate} from "react-router-dom";

type PropsType = {
    image: string | null,
    text: string,
    time: string | null,
    type: string | null,
    id: number,
    answer: string | null,
    solution: string | null,
    subject_id : number
}

const TaskPreview = (props : PropsType) => {
    const nav = useNavigate()

    return (
        <section className={taskPreview.preview} onClick={() => nav(`/taskDB/task/${props.id}`)}>
            <section className={taskPreview.idAndType}>
                <p>№ {props.id} {props.type}</p>
            </section>
            <p className={taskPreview.taskText}>
                {props.text}
            </p>
        </section>
    );
};

export default TaskPreview;