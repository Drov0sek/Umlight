export class IncorrectDataError extends Error{
    constructor(message : string) {
        super(message);
        this.name = 'IncorrectDataError'
        Object.setPrototypeOf(this,IncorrectDataError.prototype)
    }
}