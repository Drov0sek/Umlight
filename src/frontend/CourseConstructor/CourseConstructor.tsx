import ModulesAndLessonsEditor from "../CourseConstructor/ModulesAndLessonsEditor.tsx";

const CourseConstructor = () => {

    return (
        <main style={{
            height : '90vh',
            overflow : 'auto'
        }}>
            <ModulesAndLessonsEditor/>
        </main>
    );
};

export default CourseConstructor;