export class HasAlreadyJoinedError extends Error{
    constructor(message : string) {
        super(message);
        this.name = 'HasAlreadyJoinedError'
        Object.setPrototypeOf(this,HasAlreadyJoinedError.prototype)
    }
}