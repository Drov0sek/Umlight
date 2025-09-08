export function checkPasswordDifficulty(password : string){
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/
    return (regex.test(password) && password.length >= 8)
}