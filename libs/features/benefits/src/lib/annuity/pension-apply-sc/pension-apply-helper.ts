import { AnnuityBaseComponent } from '../base/annuity.base-component';
import {
  clearAlerts,
  showModal,
  EachHeirDetail,
  showErrorMessage,
  ReasonBenefit,
  BenefitStatus,
  decline,
  ValidateRequest,
  ActiveBenefits,
  BenefitConstants
} from '../../shared';
import { TemplateRef, HostListener, ViewChild, Directive } from '@angular/core';
import {ApplicationTypeEnum, GosiCalendar, RouterConstants, RouterConstantsBase, TransactionMixin} from '@gosi-ui/core';
import { BsModalRef } from 'ngx-bootstrap/modal/ngx-bootstrap-modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import moment from 'moment';

@Directive()
export abstract class PensionApplyHelperComponent extends AnnuityBaseComponent {
  /**
   * ViewChild components
   */
  @ViewChild('applyBenefitWizard', { static: false })
  applyBenefitWizard: ProgressWizardDcComponent;

  @ViewChild('cancelPension', { static: false })
  cancelPension: TemplateRef<HTMLElement>;
  @ViewChild('retirementDetailsTab', { static: false })
  retirementDetailsTab: TabsetComponent;
  @ViewChild('confirmTemplate', { static: true })
  confirmTemplate: TemplateRef<HTMLElement>;
  @ViewChild('confirmTransactionTemplate', { static: true })
  confirmTransactionTemplate: TemplateRef<HTMLElement>;
  @ViewChild('applyretirementWizard', { static: false })
  applyretirementWizard: ProgressWizardDcComponent;
  @ViewChild('eligibilityCriteria', { static: true })
  eligibilityCriteria: TemplateRef<HTMLElement>;
  @ViewChild('ineligibilityTemplate', { static: false })
  ineligibilityTemplate: TemplateRef<HTMLElement>;

  canceldepndent: boolean;
  saveDepeDetailsAction: boolean;
  benefitWageDetail: EachHeirDetail;
  modalRef: BsModalRef;
  // activeBenefitsList: ActiveBenefits[];
  saveHeirDetailsAction: boolean;
  isSmallScreen: boolean;

  /** Method to handle cancellation of transaction. */
  cancelTransaction() {
    clearAlerts(this.alertService, this.showOtpError);
    this.commonModalRef = showModal(
      this.modalService,
      (!this.benefitRequestId && !this.routerData?.draftRequest) || this.routerData?.assigneeId
        ? this.confirmTemplate
        : this.confirmTransactionTemplate
    );
  }

  /** Method to handle doc upload. */
  docUploadSuccess(event: { comments: string }) {
    this.patchBenefitWithCommentsAndNavigate(
      event,
      this.retirementDetailsTab,
      this.applyretirementWizard,
      this.isValidator && this.annuityResponse?.status?.english !== BenefitStatus.DRAFT
        ? [RouterConstants.ROUTE_TODOLIST]
        : this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP
        ? [BenefitConstants.ROUTE_INDIVIDUAL_BENEFITS]
        : [BenefitConstants.ROUTE_BENEFIT_LIST(null, this.socialInsuranceNo)]
      //       [RouterConstants.ROUTE_INDIVIDUAL_PROFILE_INFO(this.socialInsuranceNo)] :
      // [BenefitConstants.ROUTE_BENEFIT_LIST(null,this.socialInsuranceNo)]
    );
  }

  /** this method to sent input to dependent component to  cancel */
  depcancel() {
    this.canceldepndent = !this.canceldepndent;
  }

  /** this method to sent input to dependent component to  trigger save dependent */
  saveDependentDetailsAction() {
    this.saveDepeDetailsAction = !this.saveDepeDetailsAction;
  }

  /** this method is to close popup */
  closePopup() {
    this.modalRef.hide();
  }

  /** this method is to show other benefits and wage details */
  showBenefitsWagePopup(templateRef: TemplateRef<HTMLElement>, benefitWageDetail: EachHeirDetail) {
    this.benefitWageDetail = benefitWageDetail;
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-xl' }));
  }

  navigateToProfile(sin: number) {
    const url = '#' + BenefitConstants.ROUTE_BENEFIT_LIST(null, sin);
    window.open(url, '_blank');
  }

  /* this function fetch the active benefit details to display on the top */
  // getBenefitsWithStatus() {
  //     //get Annuity benefit details
  //     const status = [BenefitStatus.ACTIVE, BenefitStatus.DRAFT, BenefitStatus.INPROGRESS];
  //     this.sanedBenefitService.getBenefitsWithStatus(this.socialInsuranceNo, status).subscribe(response => {
  //         this.activeBenefitsList = response;
  //         this.benefitsForm.addControl(
  //             'requestDate',
  //             this.fb.group({
  //               gregorian: [null],
  //               hijiri: [null]
  //             })
  //           );
  //           this.benefitsForm
  //           .get('requestDate')
  //             .get('gregorian')
  //             .patchValue(moment(response[0]?.requestDate?.gregorian).toDate());
  //           this.benefitsForm.get('requestDate').get('hijiri').patchValue(response[0]?.requestDate?.hijiri);
  //     });
  // }
  /** this method to sent input to heir component to  trigger save heir */
  saveHeirDetailAction() {
    this.saveHeirDetailsAction = !this.saveHeirDetailsAction;
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 960 ? true : false;
  }

  decline() {
    decline(this.commonModalRef);
  }

  showErrorMessages($event) {
    showErrorMessage($event, this.alertService);
  }

  clearAllAlerts() {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
  }

  askForCancel() {
    showModal(this.modalService,this.confirmTemplate);
  }
}
