export const HTTP_METHOD = {
  GET: "get",
  POST: "post",
  PATCH: "patch",
  DELETE: "delete",
};

export const FUNCTION_META_KEYS = {
  path: Symbol.for("path"),
  httpMethod: Symbol.for("httpMethod"),
};

export const CONTROLLER_META_KEYS = {
  type: Symbol.for("type"),
  baseUrl: Symbol.for("baseUrl"),
};

export const MIDDLEWARE_META_KEYS = {
  middlewares: Symbol.for("middlewares"),
  errorMiddlewares: Symbol.for("errorMiddlewares"),
};

export const AUTH_META_KEYS = {
  strategy: Symbol.for("strategy"),
  role: Symbol.for("role"),
  authService : Symbol.for("auth service")
};
