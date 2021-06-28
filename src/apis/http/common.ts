import { message as antdMessage } from 'antd';

export enum CommonErrorCode {
  unknown = 'unknown',
  notFound = 'notFound',
  unauthorized = 'unauthorized',
  forbidden = 'forbidden',
  redirect = 'redirect',
  refresh = 'refresh',
  authorizeExpired = 'authorizeExpired',
  handled = 'handled',
  noToast = 'noToast'
}
export class CustomError<Detail = any> {
  private httpCode: { [key: string]: string } = {
    '401': CommonErrorCode.unauthorized,
    '402': CommonErrorCode.authorizeExpired,
    '403': CommonErrorCode.forbidden,
    '404': CommonErrorCode.notFound,
    '300': CommonErrorCode.refresh,
    '301': CommonErrorCode.redirect,
    '302': CommonErrorCode.redirect
  };
  public constructor(public code: string, public message: string, public detail?: Detail) {
    if (parseFloat(code)) {
      this.code = this.httpCode[code];
    }
  }
}
