import { HTTP_METHOD, CONTROLLER_META_KEYS, FUNCTION_META_KEYS } from "./keys"


/**
 *
 * @param path | path value for meta data on Method
 * @returns Method Decorator
 * adds two meta data on function
 * @path sub path of url
 * @method eg get , post , update , delete
 */

export function get(path: string): MethodDecorator {
  return (
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    _addMetaDataToFunction(HTTP_METHOD.GET, target, key, path);
  };
}

/**
 *
 * @param path | path value for meta data on Method
 * @returns Method Decorator
 * adds two meta data on function
 * @path sub path of url
 * @method eg get , post , update , delete
 */

export function post(path: string): MethodDecorator {
  return (
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    _addMetaDataToFunction(HTTP_METHOD.POST, target, key, path);
  };
}

/**
 *
 * @param path | path value for meta data on Method
 * @returns Method Decorator
 * adds two meta data on function
 * @path sub path of url
 * @method eg get , post , update , delete
 */

export function patch(path: string): MethodDecorator {
  return (
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    _addMetaDataToFunction(HTTP_METHOD.PATCH, target, key, path);
  };
}

/**
 *
 * @param path | path value for meta data on Method
 * @returns Method Decorator
 * adds two meta data on function
 * @path sub path of url
 * @method eg get , post , update , delete
 */
export function del(path: string): MethodDecorator {
  return (
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    _addMetaDataToFunction(HTTP_METHOD.DELETE, target, key, path);
  };
}

/**
 *
 * @param baseUrl base url for router
 * @returns Class Decorator
 *
 * adds two meta types on class
 * @base_url base url for router
 * @type type of Class , eg controller
 */

export function Controller(baseUrl?: string): ClassDecorator {
  return (target: Object) => {
    _addMetaDataToClass("controller", target, baseUrl || "");
  };
}

/**
 *
 * @param httpMethod eg get, post , delete
 * @param target eg target object
 * @param propertyKey propertyKey
 * @param path path to append to base_url. this will be concatenated with base_url
 */

function _addMetaDataToFunction(
  httpMethod: string,
  target: Object,
  propertyKey: string | symbol,
  path: string
) {
  Reflect.defineMetadata(FUNCTION_META_KEYS.path, path, target, propertyKey);
  Reflect.defineMetadata(
    FUNCTION_META_KEYS.httpMethod,
    httpMethod,
    target,
    propertyKey
  );
}

/**
 *
 * @param type eg : controller
 * @param target eg target object
 * @param baseUrl eg :  /users or empty string ""
 */

function _addMetaDataToClass(type: string, target: Object, baseUrl: string) {
  Reflect.defineMetadata(CONTROLLER_META_KEYS.type, type, target);
  Reflect.defineMetadata(CONTROLLER_META_KEYS.baseUrl, baseUrl || "", target);
}





