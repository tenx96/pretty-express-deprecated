import { AUTH_META_KEYS } from "./keys";

export function authenticate(
  strategy: string,
  data?: { role: string }
): Function {
  return (target: Object, propertyKey: string | symbol) => {
    Reflect.defineMetadata(
      AUTH_META_KEYS.strategy,
      strategy,
      target,
      propertyKey
    );

    Reflect.defineMetadata(
      AUTH_META_KEYS.role,
      data && data.role ? data.role : "",
      target,
      propertyKey
    );
  };
}

export function AuthStrategy(strategy: string): ClassDecorator {
  return (target: Object) => {
    Reflect.defineMetadata(AUTH_META_KEYS.authService, strategy, target);
  };
}
