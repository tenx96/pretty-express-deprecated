import { HTTP_STATUS_CODES } from "../http-status-codes";
export class HttpErrorResponse extends Error {
  status: number;
  message: string;
  phrase: string;
  data: any;

  constructor(status: number, message: string, phrase?: string, data?: any) {
    super(message);
    this.status = status;
    this.message = message;
    this.phrase = phrase;
    this.data = data;
  }

  static BAD_REQUEST(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.BAD_REQUEST.status,
      message,
      HTTP_STATUS_CODES.BAD_REQUEST.phrase,
      data
    );
  }
  static UNAUTHORIZED(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.UNAUTHORIZED.status,
      message,
      HTTP_STATUS_CODES.UNAUTHORIZED.phrase,
      data
    );
  }
  static PAYMENT_REQUIRED(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.PAYMENT_REQUIRED.status,
      message,
      HTTP_STATUS_CODES.PAYMENT_REQUIRED.phrase,
      data
    );
  }
  static FORBIDDEN(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.FORBIDDEN.status,
      message,
      HTTP_STATUS_CODES.FORBIDDEN.phrase,
      data
    );
  }
  static NOT_FOUND(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.NOT_FOUND.status,
      message,
      HTTP_STATUS_CODES.NOT_FOUND.phrase,
      data
    );
  }
  static METHOD_NOT_ALLOWED(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.METHOD_NOT_ALLOWED.status,
      message,
      HTTP_STATUS_CODES.METHOD_NOT_ALLOWED.phrase,
      data
    );
  }
  static NOT_ACCEPTABLE(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.NOT_ACCEPTABLE.status,
      message,
      HTTP_STATUS_CODES.NOT_ACCEPTABLE.phrase,
      data
    );
  }
  static PROXY_AUTHENTICATION_REQUIRED(
    message: string,
    data?: any
  ): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.PROXY_AUTHENTICATION_REQUIRED.status,
      message,
      HTTP_STATUS_CODES.PROXY_AUTHENTICATION_REQUIRED.phrase,
      data
    );
  }
  static REQUEST_TIMEOUT(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.REQUEST_TIMEOUT.status,
      message,
      HTTP_STATUS_CODES.REQUEST_TIMEOUT.phrase,
      data
    );
  }
  static CONFLICT(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.CONFLICT.status,
      message,
      HTTP_STATUS_CODES.CONFLICT.phrase,
      data
    );
  }
  static GONE(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.GONE.status,
      message,
      HTTP_STATUS_CODES.GONE.phrase,
      data
    );
  }
  static LENGTH_REQUIRED(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.LENGTH_REQUIRED.status,
      message,
      HTTP_STATUS_CODES.LENGTH_REQUIRED.phrase,
      data
    );
  }
  static PRECONDITION_FAILED(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.PRECONDITION_FAILED.status,
      message,
      HTTP_STATUS_CODES.PRECONDITION_FAILED.phrase,
      data
    );
  }
  static REQUEST_TOO_LONG(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.REQUEST_TOO_LONG.status,
      message,
      HTTP_STATUS_CODES.REQUEST_TOO_LONG.phrase,
      data
    );
  }
  static REQUEST_URI_TOO_LONG(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.REQUEST_URI_TOO_LONG.status,
      message,
      HTTP_STATUS_CODES.REQUEST_URI_TOO_LONG.phrase,
      data
    );
  }
  static UNSUPPORTED_MEDIA_TYPE(
    message: string,
    data?: any
  ): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.UNSUPPORTED_MEDIA_TYPE.status,
      message,
      HTTP_STATUS_CODES.UNSUPPORTED_MEDIA_TYPE.phrase,
      data
    );
  }
  static REQUESTED_RANGE_NOT_SATISFIABLE(
    message: string,
    data?: any
  ): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.REQUESTED_RANGE_NOT_SATISFIABLE.status,
      message,
      HTTP_STATUS_CODES.REQUESTED_RANGE_NOT_SATISFIABLE.phrase,
      data
    );
  }
  static EXPECTATION_FAILED(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.EXPECTATION_FAILED.status,
      message,
      HTTP_STATUS_CODES.EXPECTATION_FAILED.phrase,
      data
    );
  }
  static IM_A_TEAPOT(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.IM_A_TEAPOT.status,
      message,
      HTTP_STATUS_CODES.IM_A_TEAPOT.phrase,
      data
    );
  }
  static INSUFFICIENT_SPACE_ON_RESOURCE(
    message: string,
    data?: any
  ): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.INSUFFICIENT_SPACE_ON_RESOURCE.status,
      message,
      HTTP_STATUS_CODES.INSUFFICIENT_SPACE_ON_RESOURCE.phrase,
      data
    );
  }
  static METHOD_FAILURE(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.METHOD_FAILURE.status,
      message,
      HTTP_STATUS_CODES.METHOD_FAILURE.phrase,
      data
    );
  }
  static UNPROCESSABLE_ENTITY(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY.status,
      message,
      HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY.phrase,
      data
    );
  }
  static LOCKED(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.LOCKED.status,
      message,
      HTTP_STATUS_CODES.LOCKED.phrase,
      data
    );
  }
  static FAILED_DEPENDENCY(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.FAILED_DEPENDENCY.status,
      message,
      HTTP_STATUS_CODES.FAILED_DEPENDENCY.phrase,
      data
    );
  }
  static PRECONDITION_REQUIRED(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.PRECONDITION_REQUIRED.status,
      message,
      HTTP_STATUS_CODES.PRECONDITION_REQUIRED.phrase,
      data
    );
  }
  static TOO_MANY_REQUESTS(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.TOO_MANY_REQUESTS.status,
      message,
      HTTP_STATUS_CODES.TOO_MANY_REQUESTS.phrase,
      data
    );
  }
  static REQUEST_HEADER_FIELDS_TOO_LARGE(
    message: string,
    data?: any
  ): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.REQUEST_HEADER_FIELDS_TOO_LARGE.status,
      message,
      HTTP_STATUS_CODES.REQUEST_HEADER_FIELDS_TOO_LARGE.phrase,
      data
    );
  }
  static UNAVAILABLE_FOR_LEGAL_REASONS(
    message: string,
    data?: any
  ): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.UNAVAILABLE_FOR_LEGAL_REASONS.status,
      message,
      HTTP_STATUS_CODES.UNAVAILABLE_FOR_LEGAL_REASONS.phrase,
      data
    );
  }
  static INTERNAL_SERVER_ERROR(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR.status,
      message,
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR.phrase,
      data
    );
  }
  static NOT_IMPLEMENTED(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.NOT_IMPLEMENTED.status,
      message,
      HTTP_STATUS_CODES.NOT_IMPLEMENTED.phrase,
      data
    );
  }
  static BAD_GATEWAY(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.BAD_GATEWAY.status,
      message,
      HTTP_STATUS_CODES.BAD_GATEWAY.phrase,
      data
    );
  }
  static SERVICE_UNAVAILABLE(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.SERVICE_UNAVAILABLE.status,
      message,
      HTTP_STATUS_CODES.SERVICE_UNAVAILABLE.phrase,
      data
    );
  }
  static GATEWAY_TIMEOUT(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.GATEWAY_TIMEOUT.status,
      message,
      HTTP_STATUS_CODES.GATEWAY_TIMEOUT.phrase,
      data
    );
  }
  static HTTP_VERSION_NOT_SUPPORTED(
    message: string,
    data?: any
  ): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.HTTP_VERSION_NOT_SUPPORTED.status,
      message,
      HTTP_STATUS_CODES.HTTP_VERSION_NOT_SUPPORTED.phrase,
      data
    );
  }
  static INSUFFICIENT_STORAGE(message: string, data?: any): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.INSUFFICIENT_STORAGE.status,
      message,
      HTTP_STATUS_CODES.INSUFFICIENT_STORAGE.phrase,
      data
    );
  }
  static NETWORK_AUTHENTICATION_REQUIRED(
    message: string,
    data?: any
  ): HttpErrorResponse {
    return new HttpErrorResponse(
      HTTP_STATUS_CODES.NETWORK_AUTHENTICATION_REQUIRED.status,
      message,
      HTTP_STATUS_CODES.NETWORK_AUTHENTICATION_REQUIRED.phrase,
      data
    );
  }
}
