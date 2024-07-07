/**
 * Model class to hold field level errors.
 *
 * @export
 * @class FieldError
 */
export class FieldError {
  error: string = undefined;
  value?: number = undefined;
  length?: number = undefined;
  invalidSelection?: string = undefined;
  inputValue?: string = undefined;
  validatorValue?: string = undefined;
  requiredFormat?: string = undefined;
}
