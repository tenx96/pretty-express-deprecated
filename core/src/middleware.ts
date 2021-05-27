
import { MIDDLEWARE_META_KEYS } from "./keys";



export function middleware(...args : Function[]) : Function{

    return (target: Object , propertyKey? : string | symbol) => {
            Reflect.defineMetadata(MIDDLEWARE_META_KEYS.middlewares , args , target, propertyKey);
    };
}



export function errorMiddleware(...args : Function[]) : Function {

    return (target: Object , propertyKey? : string | symbol) => {
            Reflect.defineMetadata(MIDDLEWARE_META_KEYS.errorMiddlewares , args , target , propertyKey);
    };
}