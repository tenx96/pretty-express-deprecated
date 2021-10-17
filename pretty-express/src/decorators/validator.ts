import { ValidatorOptions } from "class-validator";
import { VALIDATOR_META_KEYS } from "../keys";
import { ClassTransformOptions, ClassConstructor } from "class-transformer";

type Constructor<T> = { new (): T };

export function validate(
  schema: ClassConstructor<any>,
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

export function transformResponse(
  schema: ClassConstructor<any>,
  options?: {
    validate?: boolean;
    transformOptions?: ClassTransformOptions;
    validatorOptions?: ValidatorOptions;
  }
): Function {
  return (target: Object, propertyKey?: string | symbol) => {
    const validatorOp = options ? options.validatorOptions : undefined;
    const transformOp = options ? options.transformOptions : undefined;
    const validate = options ? options.validate : false;

    Reflect.defineMetadata(
      VALIDATOR_META_KEYS.resSchema,
      schema,
      target,
      propertyKey
    );
    Reflect.defineMetadata(
      VALIDATOR_META_KEYS.resValidationOptions,
      validatorOp,
      target,
      propertyKey
    );

    Reflect.defineMetadata(
      VALIDATOR_META_KEYS.resTransformOptions,
      transformOp,
      target,
      propertyKey
    );

    Reflect.defineMetadata(
      VALIDATOR_META_KEYS.resValidate,
      validate,
      target,
      propertyKey
    );
  };
}
