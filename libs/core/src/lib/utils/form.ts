import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

/**
 * This method to mark all the fields in a form as touched and dirty
 * @param formGroup
 * @param data
 */
export const markFormGroupTouched = function (formGroup: FormGroup) {
  if (formGroup) {
    Object.values(formGroup.controls).forEach((control: FormGroup) => {
      control.markAsTouched();
      control.markAsDirty();
      if (control.controls) {
        markFormGroupTouched(control);
      }
    });
  }
};

/**
 * This method to mark all the fields in a form as untouched and pristine
 * @param formGroup
 * @param data
 */
export const markFormGroupUntouched = function (formGroup: FormGroup) {
  Object.values(formGroup.controls).forEach((control: FormGroup) => {
    control.markAsUntouched();
    control.markAsPristine();
    if (control.controls) {
      markFormGroupUntouched(control);
    }
  });
};

/**
 *
 * @param formGroup This method to get the number of errors in form
 */
export const getFormErrorCount = function (formGroup: FormGroup) {
  let errorCount: number;
  if (!errorCount) {
    errorCount = 0;
  }
  Object.values(formGroup.controls).forEach((control: FormGroup) => {
    if (control.errors && control.touched) {
      errorCount = errorCount + Object.keys(control.errors).length;
    }
    if (control.controls) {
      errorCount += getFormErrorCount(control);
    }
  });
  return errorCount;
};

/**
 * This method is to reset all the forms
 * @param formGroup
 */
export const resetForms = function (formGroup: FormGroup) {
  formGroup.reset();
  formGroup.markAsPristine();
  formGroup.markAsUntouched();
};

/**
 * This method to populate the child form with data from service
 * @param formGroup
 * @param data
 */
export const bindToForm = function (formGroup: FormGroup, data) {
  if (data) {
    Object.keys(data).forEach(name => {
      if (formGroup.get(name) && data[name]) {
        formGroup.get(name).patchValue(data[name]);
      }
    });
  }
  formGroup.updateValueAndValidity();
  formGroup.markAsPristine();
};

/**
 * Make form validation required
 * @param formControl
 */
export const updateValidation = (formControl: FormControl, isMandatory: boolean, validators?: ValidatorFn[]) => {
  if (formControl) {
    formControl.clearValidators();
    if (isMandatory === true) {
      const validatorFns = [];
      validatorFns.push(Validators.required);
      if (validators) {
        validatorFns.push(...validators);
      }
      formControl.setValidators(validatorFns);
    } else {
      if (validators) {
        formControl.setValidators(validators);
      } else {
        formControl.clearValidators();
      }
    }
    formControl.markAsUntouched();
    formControl.updateValueAndValidity();
  }
};

export const hasRequiredField = (abstractControl: AbstractControl): boolean => {
  if (abstractControl.validator) {
    const validator = abstractControl.validator({} as AbstractControl);
    if (validator && validator.required && !abstractControl.hasError('required')) {
      return false;
    }
  }
  if (abstractControl['controls']) {
    for (const controlName in abstractControl['controls']) {
      if (abstractControl['controls'][controlName]) {
        if (!hasRequiredField(abstractControl['controls'][controlName])) {
          return false;
        }
      }
    }
  }
  return true;
};
