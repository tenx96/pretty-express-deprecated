import { CONTROLLER_META_KEYS } from "../keys";


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
  