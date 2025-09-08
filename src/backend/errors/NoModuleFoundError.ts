export class NoModuleFoundError extends Error{
    constructor(message : string) {
        super(message);
        this.name = 'NotModuleFoundError'
        Object.setPrototypeOf(this,NoModuleFoundError.prototype)
    }
}