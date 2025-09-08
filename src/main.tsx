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

const router = createBrowserRouter([
    {path : '/',element : <App/>},
    {path : '/login', element : <Login/>},
    {path : '/register', element : <Signup/>},
    {path : '*', element : <Comp404/>},
    {
        element : <ProtectedRoutes/>,
        children : [
            {path : '/main/:id',element : <Main/>},
            
        ]
    },
    {
        path : '/course/:courseId', element : <CoursePreview/>,
        children : [
            {path: 'tasks/theory/:taskId',element : <TheoryLesson/>}
        ]
    },

])

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router}/>
        </Provider>
    </StrictMode>
);