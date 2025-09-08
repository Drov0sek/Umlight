import {Link} from "react-router";
import lessonMaterials from '../../../CourseStyles/LessonMaterials.module.css'

type MaterialType = {
    id : number,
    material : string,
    materialName : string
}
type PropsType = {
    materials : MaterialType[]
}


const LessonMaterials = ({materials} : PropsType) => {
    function getMaterials(){
        return materials.map(r => <div className={lessonMaterials.material} key={materials.indexOf(r)}>
            <img src={'http://localhost:8080/siteImages/File.svg'} />
            <Link to={r.material} className={lessonMaterials.materialName}>{r.materialName}</Link>
        </div>)
    }
    return (
        <section style={{width : '620px'}}>
            <p className={lessonMaterials.title}>Материалы к занятию</p>
            <section className={lessonMaterials.materials}>{getMaterials()}</section>
        </section>
    );
};

export default LessonMaterials;