import { PARAMETER_META_KEYS } from "../keys";

export function requestBody(target: Object, propertyKey: string | symbol, parameterIndex: number) {
        Reflect.defineMetadata(PARAMETER_META_KEYS.requestBody , parameterIndex , target , propertyKey)
  }


  export function requestParams(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    Reflect.defineMetadata(PARAMETER_META_KEYS.requestParams , parameterIndex , target , propertyKey)
}


export function authUser(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    Reflect.defineMetadata(PARAMETER_META_KEYS.authUser , parameterIndex , target , propertyKey)
}

export function requestQuery(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    Reflect.defineMetadata(PARAMETER_META_KEYS.requestQuery , parameterIndex , target , propertyKey)
}