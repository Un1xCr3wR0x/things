import {AlertService} from '@gosi-ui/core/lib/services/alert.service';
import {HttpErrorResponse} from '@angular/common/http';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LovList, RouterData} from '@gosi-ui/core';
import { AdjustmentConstants } from '../constants/adjustment-constants';

export const showErrorMessage = function (err: HttpErrorResponse, alertService: AlertService) {
  if (err.error.details && err.error.details.length > 0) {
    alertService.showError(null, err.error.details);
  } else {
    alertService.showError(err.error.message);
  }
};
export const isHeirBenefit = function (benefitType: string) {
  return (
    benefitType === 'Heir Lumpsum Dead Contributor Benefit' ||
    benefitType === 'Heir Pension Dead Contributor Benefit' ||
    benefitType === 'Heir Pension Death Contributor Benefit' ||
    benefitType === 'Heir Pension Missing Contributor Benefit' ||
    benefitType === 'Heir Lumpsum Missing Contributor Benefit' ||
    benefitType === 'Heir Lumpsum Benefit' ||
    benefitType === 'Heir Pension Benefit' ||
    benefitType === 'Heir Benefit'
  );
};
export const createDetailForm = function (fb: FormBuilder) {
  let form: FormGroup;
  form = fb.group({
    taskId: [null],
    user: [null],
    status: [null],
    rejectionIndicator: [null]
  });
  return form;
};
export const bindQueryParamsToForm = function (routerData: RouterData, childForm: FormGroup) {
  if (routerData) {
    childForm.get('taskId').setValue(routerData.taskId);
    childForm.get('user').setValue(routerData.assigneeId);
  }
};


export const getAdjustmentReasonForReform = function (reasons: LovList, eligibleForPensionReform = false): LovList {
  if (eligibleForPensionReform) {
    return new LovList(reasons.items.filter(lov => AdjustmentConstants.REFORM_ADJUSTMENT_LOV().includes(lov.code.toString())));
  } else {
    return reasons;
  }
};
