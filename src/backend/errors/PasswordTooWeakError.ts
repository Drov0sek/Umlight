export class PasswordTooWeakError extends Error{
    constructor(message : string) {
        super(message);
        this.name = 'PasswordTooWeakError'
        Object.setPrototypeOf(this,PasswordTooWeakError.prototype)
    }
}