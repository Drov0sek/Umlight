import {useState} from 'react';
import {Modal} from "../Styles/templates/Modal.tsx";
import  signup from '../Styles/Signup.module.css'
import {Link} from "react-router";
import {useNavigate} from "react-router-dom";
import {checkPasswordDifficulty} from "../../backend/API/checkPasswordDifficulty.ts";
import LoginField from "../Styles/templates/LoginField.tsx";

const Signup = () => {
    type Student = {
        name : string,
        login : string,
        password : string,
        surname : string,
        gender : string,
        nickname : string,
        email : string,
        age : number
    }
    type Teacher = {
        name : string,
        surname : string,
        email : string,
        login : string,
        password : string,
        gender : string
    }

    const nav = useNavigate()

    const [isActive,setIsAcive] = useState(true)
    const [wasFirstModalUsed,setWasFirstModalUsed] = useState(false)
    const [isStudent,setIsStudent] = useState(true)

    const [name, setName] = useState('')
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [checkPassword,setCheckPassword] = useState('')
    const [age,setAge] = useState('')
    const [surname, setSurname] = useState('')
    const [gender, setGender] = useState('')
    const [nickname, setNickname] = useState('')
    const [email,setEmail] = useState('')
    const [isAgreed,setIsAgreed] = useState(false)

    const createStudent = async (student: Student) => {
        if (checkPasswordDifficulty(student.password)){
            if (student.nickname === '' || student.name === '' || student.surname === '' || student.login === '' || student.password === '' || student.email === ''){
                alert('Вы не указали какое-то из полей. Заполните и попробуйте ещё раз')
                return
            }
            if (student.password !== checkPassword){
                alert('Ваши пароли не совпадают')
                return
            }
            if (!isAgreed){
                alert('Пожалуйста, согласитесь с условиями пользования')
                return
            }
            if (student.email.indexOf('@') === -1){
                alert('Некорректно заполнен email')
                return
            }
            try {
                const resp = await fetch('http://localhost:4200/api/register/student/',{
                    method : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body : JSON.stringify(student)
                })
                if (!resp.ok){
                    if (resp.status === 409){
                        alert('Ваши логин и пароль должны быть уникальными. Попробуйте другой')
                    }
                    else if (resp.status === 400){
                        alert('fbc')
                    }
                    else{
                        alert('Произошла ошибка. Попробуйте позже')
                    }
                }
            } catch (error){
                alert('Что-то пошло не так. Попробуйте позже')
                console.log(error)
            }
        }
        else {
            alert('Ваш пароль слишком слабый. Попробуйте другой. Он должен быть длиной минимум в 8 символов и содержать заглавные и строчные латинские буквы, а также специальные символы')
        }
    }
    async function createTeacher(teacher : Teacher){
        if (checkPasswordDifficulty(teacher.password)){
            if (teacher.name === '' || teacher.surname === '' || teacher.login === '' || teacher.password === '' || teacher.email === ''){
                alert('Вы не указали какое-то из полей. Заполните и попробуйте ещё раз')
                return
            }
            if (teacher.password !== checkPassword){
                alert('Ваши пароли не совпадают')
                return
            }
            if (!isAgreed){
                alert('Пожалуйста, согласитесь с условиями пользования')
                return
            }
            if (teacher.email.indexOf('@') === -1){
                alert('Некорректно заполнен email')
                return
            }
            try {
                const resp = await fetch('http://localhost:4200/api/register/teacher/',{
                    method : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body : JSON.stringify(teacher)
                })
                if (!resp.ok){
                    if (resp.status === 409){
                        alert('Ваш логин должен быть уникальным. Попробуйте другой')
                    }
                    else{
                        alert('Произошла ошибка. Попробуйте позже')
                    }
                }
            } catch (error){
                alert('Что-то пошло не так. Попробуйте позже')
                console.log(error)
            }
        }
        else {
            alert('Ваш пароль слишком слабый. Попробуйте другой. Он должен быть длиной минимум в 8 символов и содержать заглавные и строчные латинские буквы, а также специальные символы')
        }
    }

    return (
        <div>
            <div>
                <Modal
                    isOpen={!wasFirstModalUsed}
                    onClose={() => {
                        nav('/')
                    }}
                    children={<>
                        <p className={signup.type}>Выберите тип пользователя</p>
                        <div className={signup.buttons}>
                            <button className={signup.student} onClick={() => {
                                setIsAcive(false)
                                setWasFirstModalUsed(true)
                            }}>Ученик
                            </button>
                            <button className={signup.teacher} onClick={() => {
                                setIsAcive(false)
                                setWasFirstModalUsed(true)
                                setIsStudent(false)
                            }}>Преподаватель
                            </button>
                        </div>
                    </>}
                />
            </div>
            <Modal isOpen={!isActive}
                   onClose={() => {
                       nav('/')
                   }}
                   children={
                       <>
                           <p className={signup.type}>Выберите ваш пол</p>
                           <div className={signup.buttons}>
                               <button className={signup.male} onClick={() => {
                                   setIsAcive(true)
                                   setGender('Мужчина')
                               }}>Мужчина</button>
                               <button className={signup.female} onClick={() => {
                                   setIsAcive(true)
                                   setGender('Женщина')
                               }}>Женщина</button>
                           </div>
                       </>}

            />
            <Modal isOpen={(isActive && wasFirstModalUsed)}
                   onClose={() => {
                       nav('/')
                   }}
                   children={isStudent ?
                       <>
                           <div>
                               <LoginField title={'Отображаемое имя'} type={'text'} inputValue = {nickname} setInputValue = {setNickname}/>
                               <LoginField title={'Имя'} type={'text'} inputValue = {name} setInputValue = {setName}/>
                               <LoginField title={'Фамилия'} type={'text'} inputValue = {surname} setInputValue = {setSurname}/>
                               <LoginField title={'Возраст'} type={'text'} inputValue = {age} setInputValue = {setAge}/>
                               <LoginField title={'Логин'} type={'text'} inputValue = {login} setInputValue = {setLogin}/>
                               <LoginField title={'Электронная почта'} type={'email'} inputValue = {email} setInputValue = {setEmail}/>
                               <LoginField title={'Пароль'} type={'password'} inputValue = {password} setInputValue = {setPassword}/>
                               <section className={(password === checkPassword) ? signup.fields : signup.wrong}>
                                   <label>
                                       Подтвердите пароль
                                   </label>
                                   <input type={"password"} value={checkPassword}
                                          onChange={event => setCheckPassword(event.target.value)}/>
                               </section>
                               <p className={(password === checkPassword) ? signup.okText : signup.errorText}>Пароли
                                   не совпадают</p>
                               <section className={signup.terms}>
                                   <input type={"checkbox"} checked={isAgreed}
                                          onChange={event => setIsAgreed(event.target.checked)}/>
                                   <p>Я согласен(на) с <Link className={signup.link}
                                                             to={'https://policies.google.com/terms?hl=ru'}>
                                       условиями пользования
                                   </Link>
                                   </p>
                               </section>
                               <button className={signup.signup} onClick={() => {
                                   createStudent({
                                       name : name,
                                       login : login,
                                       password : password,
                                       surname : surname,
                                       gender : gender,
                                       nickname : nickname,
                                       email : email,
                                       age : Number(age)
                                   })
                               }
                               }>Зарегистрироваться
                               </button>
                           </div>

                       </> :
                       <div>
                           <LoginField title={'Ваше имя'} type={'text'} inputValue = {name} setInputValue = {setName}/>
                           <LoginField title={'Ваша фамилия'} type={'text'} inputValue = {surname} setInputValue = {setSurname}/>
                           <LoginField title={'Логин'} type={'text'} inputValue = {login} setInputValue = {setLogin}/>
                           <LoginField title={'Электронная почта'} type={'email'} inputValue = {email} setInputValue = {setEmail}/>
                           <LoginField title={'Пароль'} type={'password'} inputValue = {password} setInputValue = {setPassword}/>
                           <section className={(password === checkPassword) ? signup.fields : signup.wrong}>
                               <label>
                                   Подтвердите пароль
                               </label>
                               <input type={"password"} value={checkPassword}
                                      onChange={event => setCheckPassword(event.target.value)}/>
                           </section>
                           <p className={(password === checkPassword) ? signup.okText : signup.errorText}>Пароли не
                               совпадают</p>
                           <section className={signup.terms}>
                               <input type={"checkbox"} checked={isAgreed}
                                      onChange={event => setIsAgreed(event.target.checked)}/>
                               <p>Я согласен(на) с <Link className={signup.link}
                                                         to={'https://policies.google.com/terms?hl=ru'}>
                                   условиями пользования
                               </Link>
                               </p>
                           </section>
                           <button className={signup.signup} onClick={() =>{
                               createTeacher({
                                   name : name,
                                   surname : surname,
                                   email : email,
                                   login : login,
                                   password : password,
                                   gender : gender
                               }).then( r => {
                                   console.log(r)
                                   nav('/')
                               })
                           }}>Зарегистрироваться</button>
                       </div>}/>
        </div>
    );
};

export default Signup;