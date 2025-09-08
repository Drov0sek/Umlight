import Header from "./Header.tsx";
import CourseCard from "../Styles/templates/Courses/CourseCard.tsx";
// import CoursePreview from "../Styles/templates/Courses/CoursePreview/CoursePreview.tsx";
// import ModulesList from "../Styles/templates/Courses/CoursePreview/ModulesList.tsx";
// import TheoryLesson from "../Styles/templates/Courses/TheoryLessons/TheoryLesson.tsx";

const Main = () => {
    return (
        <div>
            <Header/>
            {/*<TheoryLesson video={'http://localhost:8080/umlight/videos/graph.mp4'} time={58} name={'Графики'} numberOfLesson={3} materials={[{name : 'Графики',materialLink :'http://localhost:8080/umlight/materials/%D0%93%D1%80%D0%B0%D1%84%D0%B8%D0%BA%D0%B8%20%D0%B2%20%D0%BA%D0%B8%D0%BD%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B5.%20%D0%9A%D0%BE%D0%BD%D1%81%D0%BF%D0%B5%D0%BA%D1%82.pptx'},{name : 'Графики',materialLink :'http://localhost:8080/umlight/materials/%D0%93%D1%80%D0%B0%D1%84%D0%B8%D0%BA%D0%B8%20%D0%B2%20%D0%BA%D0%B8%D0%BD%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B5.%20%D0%9A%D0%BE%D0%BD%D1%81%D0%BF%D0%B5%D0%BA%D1%82.pptx'},{name : 'Графики',materialLink :'http://localhost:8080/umlight/materials/%D0%93%D1%80%D0%B0%D1%84%D0%B8%D0%BA%D0%B8%20%D0%B2%20%D0%BA%D0%B8%D0%BD%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B5.%20%D0%9A%D0%BE%D0%BD%D1%81%D0%BF%D0%B5%D0%BA%D1%82.pptx'}]} description={'fsdsdvsdvsdv'}/>*/}
            {/*<ModulesList modules={[{numberOfModule : 1,name : 'Введение', numberOfLessons : 1}]} courseId={1}/>*/}
            {/*<CoursePreview courseId={1} lessonsAmount={1} courseAuthor={'Дмитрий Волков'} courseName={'Фэзыка'} courseTime={47} courseStudentsAmount={35432} titleImage={'http://localhost:8080/siteImages/maslo.png'} courseDescription={'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibu'} courseTags={[{tag : 'Физика'}]}/>*/}
            <CourseCard courseId={1}/>
        </div>
    );
};

export default Main;