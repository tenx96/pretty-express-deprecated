export const HTTP_METHOD = {
  GET: "get",
  POST: "post",
  PATCH: "patch",
  DELETE: "delete",
  PUT: "put",
  ALL: "all",
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
  authService: Symbol.for("auth service"),
};

export const VALIDATOR_META_KEYS = {
  schema: Symbol.for("Validation Schema"),
  options: Symbol.for("Validation Options"),
  resSchema: Symbol.for("Response Schema"),
  resValidationOptions: Symbol.for("Response Validator Options"),
  resTransformOptions: Symbol.for("Response Transform Options"),
  resValidate : Symbol.for("Response Validate")
};




export const PARAMETER_META_KEYS = {
  requestBody: Symbol.for("request body"),
  requestParams: Symbol.for("request params"),
  requestQuery: Symbol.for("request query"),
  authUser: Symbol.for("auth user"),
};

export const AUTH_CREDENTIAL_KEY = "currentUser";
