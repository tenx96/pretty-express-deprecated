
export const HTTP_METHOD = {
  GET: "get",
  POST: "post",
  PATCH: "patch",
  DELETE: "delete",
};

export const FUNCTION_META_KEYS = {
  path: "path",
  httpMethod: "httpMethod",
};

export const CONTROLLER_META_KEYS = {
  type: "type",
  baseUrl: "baseUrl",
};


export const MIDDLEWARE_META_KEYS = {
  middlewares: Symbol.for("middlewares"),
  errorMiddlewares: Symbol.for("errorMiddlewares"),
};
