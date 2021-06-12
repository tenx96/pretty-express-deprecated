import { ValidationError, ValidatorOptions } from "class-validator";
import { VALIDATOR_META_KEYS } from "../keys";

type Constructor<T> = { new (): T };

export function validate(
  schema: Constructor<any>,
  options?: ValidatorOptions
): Function {
  return (target: Object, propertyKey?: string | symbol) => {
    Reflect.defineMetadata(
      VALIDATOR_META_KEYS.schema,
      schema,
      target,
      propertyKey
    );
    Reflect.defineMetadata(
      VALIDATOR_META_KEYS.options,
      options,
      target,
      propertyKey
    );
  };
}

export function validateResponse(
  schema: Constructor<any>,
  options?: ValidatorOptions,
  onError?: (err: ValidationError[]) => void
): Function {
  return (target: Object, propertyKey?: string | symbol) => {
    Reflect.defineMetadata(
      VALIDATOR_META_KEYS.resSchema,
      schema,
      target,
      propertyKey
    );
    Reflect.defineMetadata(
      VALIDATOR_META_KEYS.resOptions,
      options,
      target,
      propertyKey
    );
  };
}
