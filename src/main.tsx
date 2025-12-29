import {StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import App from './frontend/App.tsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Login from "./frontend/Login/Login.tsx";
import Signup from "./frontend/Login/Signup.tsx";
import Comp404 from "./frontend/Comp404.tsx";
import Main from "./frontend/MainPage/Main.tsx";
import {store} from "./frontend/store/store.ts";
import {Provider} from "react-redux";
import ProtectedRoutes from "./frontend/ProtectedRoutes.tsx";
import CoursePreview from "./frontend/Styles/templates/Courses/CoursePreview/CoursePreview.tsx";
import TheoryLesson from "./frontend/Styles/templates/Courses/TheoryLessons/TheoryLesson.tsx";
import PracticeLesson from "./frontend/Styles/templates/Courses/PracticeLessons/PracticeLesson.tsx";
import Layout from "./frontend/MainPage/Layout.tsx";
import Profile from "./frontend/Profile/Profile.tsx";
import InfoEditor from "./frontend/Profile/InfoEditor.tsx";
import TaskDB from "./frontend/taskDB/TaskDB.tsx";
import UserCourses from "./frontend/UserCourses/UserCourses.tsx";
import Task from "./frontend/taskDB/Task.tsx";

const router = createBrowserRouter([
    {path : '/',element : <App/>},
    {path : '/login', element : <Login/>},
    {path : '/register', element : <Signup/>},
    {path : '*', element : <Comp404/>},
    {
        element : <ProtectedRoutes/>,
        children : [
            {
                element : <Layout/>,
                children : [
                    {
                        path : '/main/:id',element : <Main/>
                    },
                    {
                        path : '/course/:courseId', element : <CoursePreview/>,
                    },
                    {
                        path: '/course/:courseId/theory/:taskId', element: <TheoryLesson/>
                    },
                    {
                        path: '/course/:courseId/practice/:practiceId', element: <PracticeLesson/>
                    },
                    {
                        path : '/profile/:userId', element: <Profile/>, children: [
                            {
                                path : '/profile/:userId/edit', element: <InfoEditor/>
                            }
                        ]
                    },
                    {
                        path : '/taskDB', element : <TaskDB/>
                    },
                    {
                        path : '/userCourses/:id', element : <UserCourses/>
                    },
                    {
                        path : '/taskDB/task/:id', element : <Task/>
                    }
                ]
            }
        ]
    }

])

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router}/>
        </Provider>
    </StrictMode>
);