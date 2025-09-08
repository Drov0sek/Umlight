import {useState} from 'react';
import {Modal} from "../Styles/templates/Modal.tsx";
import {Link} from "react-router";
import login from '../Styles/Login.module.css'
import {useNavigate} from "react-router-dom";
import LoginField from "../Styles/templates/LoginField.tsx";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../store/store.ts";
import {signIn} from "../store/slices/authControlSlice.ts";


type LoginForm = {
    login : string,
    password : string
}

const Login = () => {
    const [isActive] = useState(true)
    const [userLogin,setUserLogin] = useState('')
    const [password,setPassword] = useState('')
    const authController = useSelector((state : RootState) => state.authController.userLogin)
    const dispatch = useDispatch()

    const nav = useNavigate()
    async function createRoute(login : string,role : string){
        try {
            const resp = await fetch(`http://localhost:4200/api/getUser/${login}`)
            const data = await resp.json().then((data) => {return data})
            console.log(data)
            return `${role}_${data.id}`
        } catch (e) {
            alert('Что-то пошло не так. Зайдите на сайт позже')
            console.log(e)
        }
    }
    async function authorize(form : LoginForm){
        try {
            const resp = await fetch('http://localhost:4200/api/login',{
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify(form)
            })
            if (!resp.ok){
                if (resp.status === 403){
                    alert('Вы ввели неверные данные. Измените их и попробуйте ещё раз')
                }
                else{
                    alert('Что-то пошло не так. Возможно, вы ввели какие-то данные неверно. Попробуйте ещё раз')
                    console.error(await resp.text())
                }
            }
            else{
                const userData = await resp.json()
                const route = await createRoute(userLogin,userData.role)
                dispatch(signIn({userLogin : userLogin}))
                console.log(authController)
                nav(`/main/${route}`)
            }
        } catch (error){
            console.log(error)
            alert('Что-то пошло не так. Попробуйте позже')
        }
    }
    return (
        <div>
            <Modal isOpen={isActive}
                   onClose={() => {
                       nav('/')
                   }}
                   children={
                       <div className={login.login}>
                           <div className={login.fields}>
                               <LoginField title={'Логин'} type={"text"} inputValue = {userLogin} setInputValue = {setUserLogin}/>
                               <LoginField title={'Пароль'} type={"password"} inputValue = {password} setInputValue = {setPassword}/>
                           </div>
                           <Link className={login.forgotPassword}
                                 to='https://support.google.com/accounts/answer/27445?hl=ru'>
                               Забыли пароль?
                           </Link>
                           <button className={login.button} onClick={() => {
                               authorize({
                                   login : userLogin,
                                   password : password
                               })
                           }}>Войти</button>
                       </div>
                   }/>
        </div>
    );
};

export default Login;