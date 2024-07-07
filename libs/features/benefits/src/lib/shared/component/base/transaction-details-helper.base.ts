import { HeirStatus, BenefitType } from '../../enum';
import { Directive, TemplateRef } from '@angular/core';
import { Channel, WorkFlowActions, RouterConstants, Person } from '@gosi-ui/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BenefitBaseScComponent } from './benefit-base-sc.component';
import { BenefitTypeLabels, EachBenefitHeading } from '../../models';
import { setWorkFlowDataForMerge } from '../../utils';
import { ModalOptions } from 'ngx-bootstrap/modal';
@Directive()
export abstract class TransactionDetailsBaseHelper extends BenefitBaseScComponent {
  disableApprove = false;
  heading: string;
  subHeading: string; //For status change hold, stop, restart, ...etc
  modifyNonOCC: boolean;
  modifyOcc: boolean;
  modifyPension: boolean;
  modifyJailed: boolean;
  modifyHazardous: boolean;
  modifyEarly: boolean;
  modifyHeir: boolean;
  holdHeir: boolean;
  stopHeir: boolean;
  restartHeir: boolean;
  stopWaive: boolean;
  startWaive: boolean;
  authPersonDetails: Person;

  setHeading(benefitType: string, requestType: string, actionType: string) {
    //TODO: get resource type (hold, stop, etc)
    this.heading = new BenefitTypeLabels(this.benefitType).getHeading();
    if (requestType === BenefitType.addModifyBenefit) {
      // Defect 480483 : Only one heading needed for add/modify dependents
      this.heading = 'BENEFITS.ADD-DEPENDENT-UPDATE-NOTIFICATION';
      if (benefitType === BenefitType.nonOccPensionBenefitType) {
        // this.heading = 'BENEFITS.ADD-MODIFY-NON-OCC-PENSION';
        this.modifyNonOCC = true;
      } else if (benefitType === BenefitType.occPension) {
        // this.heading = 'BENEFITS.ADD-MODIFY-OCC-PENSION';
        this.modifyOcc = true;
      } else if (benefitType === BenefitType.retirementPension) {
        // this.heading = 'BENEFITS.ADD-MODIFY-RETIREMENT-PENSION';
        this.modifyPension = true;
      } else if (benefitType === BenefitType.jailedContributorPension) {
        // this.heading = 'BENEFITS.ADD-MODIFY-JAILED-PENSION';
        this.modifyJailed = true;
      } else if (benefitType === BenefitType.hazardousPension) {
        // this.heading = 'BENEFITS.ADD-MODIFY-HAZARDOUS-PENSION';
        this.modifyHazardous = true;
      } else if (benefitType === BenefitType.earlyretirement) {
        // this.heading = 'BENEFITS.ADD-MODIFY-EARLT-RETIREMENT-PENSION';
        this.modifyEarly = true;
      }
    } else if (requestType === BenefitType.addModifyHeir) {
      if (benefitType === BenefitType.heirMissingPension) {
        this.heading = 'BENEFITS.ADD-MODIFY-HEIR-MISSING-PENSION-PENSION';
        this.modifyHeir = true;
      } else if (benefitType === BenefitType.heirDeathPension2) {
        this.heading = 'BENEFITS.ADD-MODIFY-HEIR-DEATH-PENSION-PENSION';
        this.modifyHeir = true;
      }
    } else if (requestType === BenefitType.stopBenefitWaive) {
      this.heading = 'BENEFITS.STOP-WAIVE';
      this.subHeading = new EachBenefitHeading(this.benefitType).getHeading();
      this.stopWaive = true;
    } else if (requestType === BenefitType.startBenefitWaive) {
      this.heading = 'BENEFITS.START-WAIVE';
      this.subHeading = new EachBenefitHeading(this.benefitType).getHeading();
      this.startWaive = true;
    } else if (requestType === BenefitType.nonOccPensionBenefitType) {
      this.heading = 'BENEFITS.NONOCC-PENSION-BENEFIT-HEADING';
    } else if (requestType === BenefitType.restartbenefit) {
      this.subHeading = 'RESTART';
      this.heading = new BenefitTypeLabels(this.benefitType).getHeading();
    } else if (actionType && actionType !== HeirStatus.NO_ACTION) {
      // Possible values in enum HeirStatus
      this.subHeading = actionType;
    }
  }
  // Method to show approve modal  /
  // approveTransaction(templateRef: TemplateRef<HTMLElement>) {
  //   if (!this.disableApprove) {
  //     this.showModal(templateRef);
  //   }
  // }
  // Show modal for rejection
  rejectTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }
  // This method is to show the modal reference
  showModal(templateRef: TemplateRef<HTMLElement>, config: ModalOptions = { class: 'modal-lg' }) {
    this.commonModalRef = this.modalService.show(templateRef, Object.assign({}, config));
    return this.commonModalRef;
  }
  // Show modal for return
  returnTransaction(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }
  // Show modal for return
  requestInspection(templateRef: TemplateRef<HTMLElement>) {
    this.showModal(templateRef);
  }
  // This method is used to show the cancellation template on click of cancel
  showCancelTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.commonModalRef = this.modalService.show(template, config);
  }
  /*To show Button conditions*/
  setButtonConditions(assignedRole) {
    switch (assignedRole) {
      case this.rolesEnum.VALIDATOR_1:
        {
          this.canReject = true;
          if (
            this.channel === Channel.TAMINATY ||
            this.channel === Channel.TAMINATY_VALUE ||
            this.channel === Channel.INDIVIDUAL ||
            this.channel === Channel.SYSTEM
          ) {
            this.canReturn = true;
          }
        }
        break;
      case this.rolesEnum.VALIDATOR_2:
        {
          this.canReturn = true;
          this.canReject = true;
        }
        break;
      case this.rolesEnum.GDS:
        {
          this.canReturn = true;
          this.canReject = true;
        }
        break;
      case this.rolesEnum.FC_APPROVER_ANNUITY:
        {
          this.canReturn = true;
        }
        break;
      case this.rolesEnum.CNT_FC_APPROVER:
        {
          this.canReturn = true;
        }
        break;
      case this.rolesEnum.DOCTOR:
        {
          this.canReturn = false;
          this.canRequestClarification = true;
        }
        break;
    }
    if (this.channel === Channel.BATCH) {
      this.canReject = false;
    }
  }
  /** Method to send request inspection */
  submitRequestInspection(reqForm, selectedInspection) {
    reqForm.addControl(
      'selectedInspection',
      new FormGroup({
        english: new FormControl(selectedInspection.english),
        arabic: new FormControl(selectedInspection.arabic)
      })
    );
    reqForm.updateValueAndValidity();
    const workflowData = setWorkFlowDataForMerge(this.routerData, reqForm, WorkFlowActions.SEND_FOR_INSPECTION);
    this.manageBenefitService.sendRequestInspection(workflowData).subscribe(
      () => {
        this.alertService.showSuccessByKey('BENEFITS.REQUEST_STATUS_INSPECTION');
        this.router.navigate([RouterConstants.ROUTE_INBOX]);
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
    this.hideModal();
  }
  getContributorPersonDetails(agentId: number) {
    this.manageBenefitService.getContributorPersonDetails(agentId).subscribe(person => {
      this.authPersonDetails = person?.listOfPersons[0];
    });
  }
}
