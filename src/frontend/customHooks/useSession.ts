import {useEffect, useState} from "react";

type UserType = {
    userId : number,
    role : string
}

export function useSession(){
    const [user, setUser] = useState<UserType>({userId : 0, role : ''})

    useEffect(() => {
        async function getSession() {
            try {
                const resp = await fetch('http://localhost:4200/api/auth',{
                    credentials : 'include'
                })
                if (resp.ok){
                    const data : UserType = await resp.json()
                    setUser(data)
                }
            } catch (e) {
                console.log(e)
                alert('Сессия закончилось. Авторизуйтесь снова')
            }
        }
        getSession()
    }, []);
    return user
}