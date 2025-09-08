export class NotUniqueLoginError extends Error{
    constructor(message : string) {
        super(message);
        this.name = 'NotUniqueLoginError'
        Object.setPrototypeOf(this,NotUniqueLoginError.prototype)
    }
}