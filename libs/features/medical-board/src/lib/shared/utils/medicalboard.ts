/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertService, CommonIdentity, IdentityTypeEnum, RouterData } from '@gosi-ui/core';
export const clearAlerts = function (alertService: AlertService, showOtpError: boolean) {
  alertService.clearAlerts();
  showOtpError = false;
  return showOtpError;
};
export const getIdentityLabel = (idObj: CommonIdentity) => {
  let label = '';
  if (idObj?.idType === IdentityTypeEnum.NIN) {
    label = 'MEDICAL-BOARD.NATIONAL-ID';
  } else if (idObj?.idType === IdentityTypeEnum.IQAMA || idObj?.idType === 'Iqama') {
    label = 'MEDICAL-BOARD.IQAMA-NUMBER';
  } else if (idObj?.idType === IdentityTypeEnum.PASSPORT || idObj?.idType === 'Passport') {
    label = 'MEDICAL-BOARD.PASSPORT-NO';
  } else if (idObj?.idType === IdentityTypeEnum.NATIONALID || idObj?.idType === 'GCCId') {
    label = 'MEDICAL-BOARD.GCC-NIN';
  } else if (idObj?.idType === IdentityTypeEnum.BORDER) {
    label = 'MEDICAL-BOARD.BORDER-NO';
  } else {
    label = 'MEDICAL-BOARD.NATIONAL-ID';
  }
  return label;


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
