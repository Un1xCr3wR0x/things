/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { OnInit, Directive, TemplateRef } from '@angular/core';
import { AnnuityBaseComponent } from '../../annuity/base/annuity.base-component';
import { EligibilityResponse } from '../../shared/models/eligibility-response';
import { BenefitType } from '../../shared/enum/benefit-type';
import { Benefits } from '../../shared/models/benefits';
import { BenefitValues } from '../../shared';
import { Role } from '@gosi-ui/core';

@Directive()
export abstract class SanedbaseComponent extends AnnuityBaseComponent implements OnInit {
  // local variables
  // view eligibility variables

  response: EligibilityResponse;

  ngOnInit(): void {}
  /**
   * This method is to show the modal reference.
   * @param commonModalRef
   */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.commonModalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-lg' }));
  }
  /** This method is to hide the modal reference. */
  hideModal() {
    this.commonModalRef.hide();
  }
  /**
   *
   * @param assignedRole Checking the assigned role is validator1 or not
   */
  checkIfValidator(assignedRole): boolean {
    if (
      assignedRole === Role.VALIDATOR ||
      assignedRole === Role.VALIDATOR_1 ||
      assignedRole === Role.VALIDATOR_2 ||
      assignedRole === Role.FC_APPROVER_ANNUITY ||
      assignedRole === Role.CNT_FC_APPROVER
    ) {
      return true;
    }
  }
  //Method to  check  eligibility of a benefit
  checkIfEligible(status: string) {
    if (status === BenefitValues.new) {
      return true;
    } else if (
      status === BenefitValues.active ||
      status === BenefitValues.workflow ||
      status === BenefitValues.reopen
    ) {
      return false;
    }
  }
  //Method to  check if reopen
  checkIfReopen(status: string) {
    return status === BenefitValues.reopen;
  }
}
