import { Directive } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent } from '@gosi-ui/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { InstallmentPeriodDetails, InstallmentScheduleDetails } from '../../../shared/models';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
@Directive()
export abstract class InstallmentDetailsViewBaseDc extends BaseComponent {
  modalRef: BsModalRef;
  modifyInstallmentForm: FormGroup;
  currentInstallmentNumber = 0;
  currentInstallmentAmount = 0;
  installmentValue: number;
  installmentNumber: number;
  minInstalmentValidatorAmount = 2000;
  minInstallmentAmount = 0;
  maxInstallmentPeriod = 0;
  maxExceptionInstallment = 0;
  totalInstallmentAmount = 0;
  lastPaidAmount = 0;
  startDate: string;
  endDate: string;
  lang = 'en';
  isValid = false;
  dueAmount = 0;
  downPaymentAmount = 0;
  eligibleForIncreasingMaxInstallPeriod = false;
  isModify = false;
  installmentTableDetails: InstallmentScheduleDetails[] = [];
  detailsToSave: InstallmentPeriodDetails = new InstallmentPeriodDetails();
  noOfRecords: number;
  modalRefs: BsModalRef;
  paginationId = 'installmentSchedule';
  isInstallmentModified = false;
  itemsPerPage = 10;
  currentPage = 0;
  pageDetails = {
    currentPage: 1,
    goToPage: ''
  };
  isMinimumInstallment = false;
  minimumInstallment = 0;
  constructor(readonly fb: FormBuilder) {
    super();
  }
}
