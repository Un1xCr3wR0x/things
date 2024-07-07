import { Location } from '@angular/common';
import { Inject, Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  LanguageToken,
  LovList,
  AlertService,
  checkIqamaOrBorderOrPassport,
  CommonIdentity,
  IdentityTypeEnum,
  ApplicationTypeToken,
  RouterDataToken,
  RouterData,
  GosiCalendar,
  CoreActiveBenefits,
  CoreAdjustmentService,
  BilingualText
} from '@gosi-ui/core';
import { SystemParameter } from '@gosi-ui/features/contributor';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  AnnuityResponseDto,
  BenefitConstants,
  BenefitDetails,
  BenefitDocumentService,
  BenefitResponse,
  BypassReassessmentService,
  DependentDetails,
  DependentService,
  DependentTransaction,
  HeirActiveService,
  HeirBenefitService,
  HeirStatusType,
  ManageBenefitService,
  ModifyBenefitService,
  EligibilityWarningPopupDcComponent,
  UiBenefitsService,
  SanedBenefitService
} from '../../shared';
@Component({
  selector: 'bnt-ann-active-heir-base',
  template: `<form><input type="text" /></form>`
})
export class ActiveHeirBase {
  activeAdjustmentsExist = false;
  acitveBenefit: CoreActiveBenefits;
  activeBenefitDetails: AnnuityResponseDto;
  adjustmentEligibility = false;
  adjustmentEligibilityWarningList: BilingualText[];
  benefitCalculation: BenefitDetails;
  lang = 'en';
  sin: number;
  benefit: string;
  benefitRequestId: number;
  personId: number;
  benefitType: string;
  heading: string;
  status: string[] = [];
  isModifyEligible: boolean;
  heirDetails: DependentDetails[];
  heirHistoryDetails: DependentTransaction[];
  heirList: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(null);
  isAppPrivate = false;
  isSmallScreen: boolean;
  isHeir = true;
  isLumpsum: boolean;
  commonModalRef: BsModalRef;
  modalRef: BsModalRef;
  referenceNo: number;
  systemParameter: SystemParameter;
  systemRunDate: GosiCalendar;
  newTab: boolean;
  benefitResponse: BenefitResponse;
  statusEnums = HeirStatusType;
  dependentHeirStatusCount = {
    [HeirStatusType.ACTIVE]: 0,
    [HeirStatusType.ON_HOLD]: 0,
    [HeirStatusType.STOPPED]: 0,
    [HeirStatusType.WAIVED]: 0,
    [HeirStatusType.INACTIVE]: 0
  };
  constructor(
    readonly alertService: AlertService,
    readonly benefitDocumentService: BenefitDocumentService,
    readonly dependentService: DependentService,
    readonly heirService: HeirBenefitService,
    readonly heirActiveService: HeirActiveService,
    readonly manageBenefitService: ManageBenefitService,
    readonly modifyPensionService: ModifyBenefitService,
    readonly modalService: BsModalService,
    readonly sanedBenefitService: SanedBenefitService,
    readonly location: Location,
    readonly router: Router,
    readonly bypassReaassessmentService: BypassReassessmentService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    readonly adjustmentService: CoreAdjustmentService,
    readonly uiBenefitService: UiBenefitsService
  ) {}

  getSystemParamAndRundate() {
    this.manageBenefitService.getSystemParams().subscribe(res => {
      this.systemParameter = new SystemParameter().fromJsonToObject(res);
    });
    this.manageBenefitService.getSystemRunDate().subscribe(res => {
      this.systemRunDate = res;
    });
  }

  checkIdentity(index: number) {
    if (this.heirDetails) {
      const value = checkIqamaOrBorderOrPassport(this.heirDetails[index]?.identity);
      return value?.id;
    }
  }

  checkIdentityLabel(index: number) {
    if (this.heirDetails) {
      const value = checkIqamaOrBorderOrPassport(this.heirDetails[index]?.identity);
      return this.getIdentityLabel(value);
    }
  }

  getIdentityLabel(idObj: CommonIdentity) {
    let label = '';
    if (idObj?.idType === IdentityTypeEnum.NIN) {
      label = 'BENEFITS.NIN-ID';
    } else if (idObj?.idType === IdentityTypeEnum.IQAMA) {
      label = 'BENEFITS.IQAMA-NUMBER';
    } else if (idObj?.idType === IdentityTypeEnum.PASSPORT) {
      label = 'BENEFITS.PASSPORT-NO';
    } else if (idObj?.idType === IdentityTypeEnum.NATIONALID) {
      label = 'BENEFITS.GCC-NIN';
    } else if (idObj?.idType === IdentityTypeEnum.BORDER) {
      label = 'BENEFITS.BORDER-NO';
    } else {
      label = 'BENEFITS.NATIONAL-ID';
    }
    return label;
  }

  /** Route back to previous page */

  /**
   * Method to show error messages coming from api
   * @param err
   */
  showErrorMessage(err) {
    if (err.error.details && err.error.details.length > 0) {
      this.alertService.showError(null, err.error.details);
    } else {
      this.alertService.showError(err.error.message);
    }
  }
  onAccept(assessmentId: number) {
    this.bypassReaassessmentService.accceptMedicalAssessment(this.sin, this.benefitRequestId, assessmentId).subscribe(
      res => {
        this.benefitResponse = res;
        this.router.navigate([BenefitConstants.ROUTE_ASSESSMENT_DISPLAY], {
          queryParams: {
            assessmentId: assessmentId
          }
        });
      },
      err => this.alertService.showError(err.error.message)
    );
  }
  onAppeal(appealTimelineDto) {
    this.sanedBenefitService.setDisabilityAssessmentId(appealTimelineDto.assessmentId);
    this.sanedBenefitService.setSocialInsuranceNumber(this.sin);
    this.sanedBenefitService.setBenefitRequestId(this.benefitRequestId);
    this.sanedBenefitService.setNin(this.acitveBenefit?.nin);
    this.modalRef?.hide();
    this.router.navigate(['home/benefits/saned/appealAssessment']); // this.bypassReaassessmentService
    //   .appealMedicalAssessment(this.sin, this.benefitRequestId, appealTimelineDto?.assessmentId)
    //   .subscribe(
    //     res => {
    //       this.benefitResponse = res;
    //     },
    //     err => this.alertService.showError(err.error.message)
    //   );
    // if (!appealTimelineDto?.isAssessment) {
    //   window.open('https://gositest.gosi.ins/GOSIOnline/ContactUs_Request?userType=2001&requestType=2022&locale=en_US');
    // }
    //window.open('https://www.gosi.gov.sa/GOSIOnline/ContactUs_Request?userType=2001&requestType=2022&locale=en_US');
  }

  routeBack() {
    this.location.back();
  }

  showModal(modal) {}

  hideModal() {}
  showEligibilityPopup() {
    this.commonModalRef = this.modalService.show(
      EligibilityWarningPopupDcComponent,
      Object.assign({}, { class: 'modal-md' })
    );
    this.commonModalRef.content.activeAdjustmentsExist = this.activeAdjustmentsExist;
    this.commonModalRef.content.gosiEligibilityWarningMsg = this.adjustmentService.mapMessagesToAlert({
      details: this.adjustmentEligibilityWarningList,
      message: null
    });
    this.commonModalRef.content.onModalCloseBtnClicked.subscribe(() => this.commonModalRef.hide());
  }
  getAdjustmentDetails(sin: number, benefitRequestId: number, individualHeir = false) {
    if (individualHeir) {
      this.uiBenefitService.getAdjustmentEligiblity(this.personId, this.sin).subscribe(eligibleData => {
        this.adjustmentEligibility = eligibleData.eligible;
        this.adjustmentEligibilityWarningList = eligibleData.gosiAdjustmentErrorMessages;
      });
    } else {
      //Defect 526050
      this.uiBenefitService.getHeirAdjustmentEligibility(sin, benefitRequestId).subscribe(eligibleData => {
        this.adjustmentEligibility = eligibleData.eligible;
        this.adjustmentEligibilityWarningList = eligibleData.gosiAdjustmentErrorMessages;
      });
    }
  }
}
