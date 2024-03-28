export enum statusType {
  OK = 'OK', //200
  Created = 'Created', //201
  NoContent = 'NoContent', //204
  BadRequest = 'BadRequest', //400
  Unauthorized = 'Unauthorized', //401
  Forbidden = 'Forbidden', //403
  NotFound = 'NotFound', //404
  TooManyRequests = 'TooManyRequests', //429
  Success = 'Success',
}
// export type ObjectResult<D = null> = {
//   status: statusType;
//   errorMessages?: string;
//   data: D;
// };
export class ObjectClassResult<D = null> {
  status: statusType;
  errorMessages?: string;
  data: D;
}
