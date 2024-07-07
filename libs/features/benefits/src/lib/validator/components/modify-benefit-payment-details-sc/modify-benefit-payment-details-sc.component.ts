import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import {
  ApplicationTypeEnum,
  Channel,
  checkIqamaOrBorderOrPassport,
  CommonIdentity,
  Role,
  RoleIdEnum,
  formatDate
} from '@gosi-ui/core';
import {
  ActiveBenefits,
  AdjustmentDetails,
  BenefitConstants,
  bindQueryParamsToForm,
  createDetailForm,
  getIdentityLabel,
  HeirsDetails,
  ModifyPayeeDetails,
  RecalculationConstants
} from '../../../shared';
import { Contributor } from '../../../shared/models/contributor';
import { ValidatorBaseScComponent } from '../../base/validator-sc.base-component';
import { TerminateRequest } from '@gosi-ui/features/establishment';

@Component({
  selector: 'bnt-modify-benefit-payment-details-sc',
  templateUrl: './modify-benefit-payment-details-sc.component.html',
  styleUrls: ['./modify-benefit-payment-details-sc.component.scss']
})
export class ModifyBenefitPaymentDetailsScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  modifyBenefitForm: FormGroup;
  modifyPayeeType: string;
  payeeDetails: ModifyPayeeDetails;
  identity: CommonIdentity | null;
  authorizedPersonId: CommonIdentity | null;
  guardianPersonId: CommonIdentity | null;
  contributorDetails: Contributor;
  modifyPayeeDetails: HeirsDetails[];
  adjustmentDetails: AdjustmentDetails[];
  checkListValue: FormArray = new FormArray([]);
  directDisabled: boolean;
  isDirectEligible: boolean;
  iscolfour = true;
  accessRole = [RoleIdEnum.FC, RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER];
  rejectAccess = [RoleIdEnum.INSURANCE_BENEFIT_OPERATION_OFFICER];
  identityLabel = '';
  Channel = Channel;
  selectedId: number[] = [];

  ngOnInit() {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.modifyBenefitForm = createDetailForm(this.fb);
    bindQueryParamsToForm(this.routerData, this.modifyBenefitForm);
    this.intialiseTheView(this.routerData);
    if (
      this.routerData.assignedRole === this.rolesEnum.VALIDATOR_1 ||
      this.routerData.assignedRole === this.rolesEnum.VALIDATOR_2
    ) {
      this.directDisabled = false;
    } else if (
      this.routerData.assignedRole === this.rolesEnum.FC_APPROVER ||
      this.routerData.assignedRole === this.rolesEnum.FC_CONTROLLER ||
      this.routerData.assignedRole === 'FCApprover' ||
      this.routerData.assignedRole === 'FC Approver'
    ) {
      this.directDisabled = true;
    }
    super.getRejectionReason(this.modifyBenefitForm);
    if (this.socialInsuranceNo && this.requestId && this.referenceNo) {
      this.getModifyPayeeDetails(this.socialInsuranceNo, this.requestId, this.referenceNo);
    }
  }
  createCheckForm(): FormGroup {
    return this.fb.group({
      checkBoxFlag: [
        {
          value: false
        }
      ],
      personId: null
    });
  }
  // fetch modify payee details
  getModifyPayeeDetails(sin: number, benefitRequestId: number, referenceNo: number) {
    this.modifyBenefitService.getModifyPaymentDetails(sin, benefitRequestId, referenceNo).subscribe(
      res => {
        this.payeeDetails = res;
        this.contributorDetails = res?.contributor;
        this.identity = checkIqamaOrBorderOrPassport(this.contributorDetails?.identity);
        this.identityLabel = getIdentityLabel(this.identity);
        this.modifyPayeeDetails = res?.heirs;
        this.checkSamaRejected();
        this.fetchModifyPayeeDocs();
        this.setAuthorizedIdentity();
        this.setGuardianIdentity();
        this.modifyPayeeDetails?.forEach(data => {
          if (data?.adjustments?.length > 0) {
            this.isDirectEligible = true;
          } else {
            this.isDirectEligible = true;
          }
        });
        this.modifyPayeeDetails?.forEach((response, index) => {
          this.checkListValue.push(this.createCheckForm());
          this.checkListValue.controls[index].get('checkBoxFlag').setValue(response?.isDirectPaymentOpted);
          this.checkListValue.controls[index].get('personId').setValue(response?.personId);
          //this.checkForm.get('checkBoxFlag').setValue(response?.isDirectPaymentOpted);
          // if(response?.isDirectPaymentOpted && response.personId){
          //   this.selectedId.push(response.personId);
          //   console.log(this.selectedId);
          // }
        });
      },
      err => {
        this.showError(err);
      }
    );
  }
  setAuthorizedIdentity() {
    this.modifyPayeeDetails?.forEach(res => {
      if (res?.authorizedPersonIdentity) {
        this.authorizedPersonId = checkIqamaOrBorderOrPassport(res?.authorizedPersonIdentity);
      }
    });
  }
  setGuardianIdentity() {
    this.modifyPayeeDetails?.forEach(res => {
      if (res?.guardianPersonIdentity) {
        this.guardianPersonId = checkIqamaOrBorderOrPassport(res?.guardianPersonIdentity);
      }
    });
  }
  checkSamaRejected(){
    const index = this.modifyPayeeDetails.findIndex(eachHierBank => eachHierBank?.bankAccount?.disableApprove === true);
    if(index >=0 ){
      this.disableApprove = true;
      this.alertService.showWarning(this.modifyPayeeDetails[index]?.bankAccount?.bankWarningMessage); 
    }
  }
  fetchModifyPayeeDocs() {
    this.transactionKey = 'MODIFY_PAYEE';
    this.modifyPayeeType = this.channel === Channel.FIELD_OFFICE ? 'REQUEST_BENEFIT_FO' : 'REQUEST_BENEFIT_GOL';
    this.getDocumentsForModifyPayee(
      this.socialInsuranceNo,
      this.requestId,
      this.referenceNo,
      this.transactionKey,
      this.modifyPayeeType
    );
  }
  getDocumentsForModifyPayee(
    sin: number,
    benefitRequestId: number,
    referenceNo: number,
    transactionKey: string,
    modifyPayeeType: string
  ) {
    this.benefitDocumentService
      .getModifyPayeeDocuments(sin, benefitRequestId, referenceNo, transactionKey, modifyPayeeType)
      .subscribe(res => {
        this.documentList = res;
      });
  }
  navigateToEdit() {
    this.router.navigate([BenefitConstants.ROUTE_MODIFY_BENEFIT_PAYMENT], {
      queryParams: {
        edit: true
      }
    });
  }
  navigateToInjuryDetails() {
    this.router.navigate([`home/profile/contributor/${this.socialInsuranceNo}/info`]);
  }
  navigateToPrevAdjustment(personId: number) {
    this.adjustmentPaymentService.identifier = personId;
    this.adjustmentPaymentService.socialNumber = this.socialInsuranceNo;
    this.router.navigate([BenefitConstants.ROUTE_ADJUSTMENT], {
      queryParams: { from: RecalculationConstants.MODIFY_PAYEE }
    });
  }
  //checkStatusEditable(selected?:boolean,personId?:number,i?: number){
  // if(selected){
  //   this.selectedId.push(personId);
  // }else{
  //   const index = this.selectedId.findIndex(element => {
  //     return element === personId
  //   });
  //   this.selectedId.splice(index,1);
  // }
  // console.log(this.selectedId);
  //}
  confirmApproveBenefit() {
    this.checkListValue.controls.forEach(eachItem => {
      if (eachItem?.get('checkBoxFlag').value) {
        this.selectedId.push(eachItem?.get('personId').value);
      }
    });
    if (
      (this.routerData.assignedRole === Role.VALIDATOR_1 || this.routerData.assignedRole === Role.VALIDATOR_2) &&
      this.selectedId?.length > 0 &&
      this.isDirectEligible === true
    ) {
      /**
       * Check if this condition to be added above
       * this.modifyCommitment?.netAdjustmentAmount > 0 && !this.modifyCommitment?.debit
       */
      this.modifyBenefitService
        .editDirectPayment(
          this.socialInsuranceNo,
          this.requestId,
          this.referenceNo,
          this.selectedId?.length > 0,
          this.selectedId
        )
        .subscribe(
          () => {
            this.confirmApprove(this.modifyBenefitForm);
          },
          err => {
            this.alertService.showError(err.error.message);
          }
        );
    } else {
      this.confirmApprove(this.modifyBenefitForm);
    }
  }
  confirmRejectBenefit() {
    this.confirmReject(this.modifyBenefitForm);
  }
  returnBenefit() {
    this.confirmReturn(this.modifyBenefitForm);
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }

  onViewBenefitDetails() {
    const data = new ActiveBenefits(
      this.socialInsuranceNo,
      this.requestId,
      this.payeeDetails?.benefitType,
      this.referenceNo
    );
    this.coreBenefitService.setActiveBenefit(data);
    this.router.navigate([BenefitConstants.ROUTE_ACTIVE_HEIR_BENEFIT]);
  }
}
