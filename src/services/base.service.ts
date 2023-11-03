export class BaseService {
  constructor() {}
  checkFieldsExist<T>(item: T, fields: string[]): boolean {
    return fields.every((field) => item?.hasOwnProperty(field))
  }
}
