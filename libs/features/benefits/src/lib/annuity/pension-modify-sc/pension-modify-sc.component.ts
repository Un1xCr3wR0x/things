/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  HostListener,
  Output,
  EventEmitter
} from '@angular/core';
import {
  DependentDetails,
  BenefitConstants,
  ActiveBenefits,
  createRequestBenefitForm,
  clearAlerts,
  showModal,
  decline,
  showErrorMessage,
  isDependentOrHeirWizardPresent,
  BenefitTypeLabels,
  HeirDetailsRequest,
  EachBenefitHeading,
  getTransactionTypeOrId,
  BenefitDetails,
  Benefits,
  setStatusForNicDependents,
  getDependentHeirEligibilityStatus,
  AnnuityResponseDto,
  deepCopy,
  DependentHeirConstants,
  HeirEvent,
  HeirEligibilityDetails,
  BenefitStatus,
  RequestModificationDateDetailsDto
} from '../../shared';
import { HeirStatus, HeirStatusType } from '../../shared/enum';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import {
  WizardItem,
  GosiCalendar,
  LovList,
  scrollToTop,
  CoreActiveBenefits,
  RouterConstants,
  ApplicationTypeEnum,
  Channel
} from '@gosi-ui/core';
import { AnnuityBaseComponent } from '../base/annuity.base-component';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src/lib/components/widgets';
import { FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment-timezone';
import { ModifyDepentsHeadingTypes } from '../../shared/models/modify-dependents-heading-types';
import { Observable } from 'rxjs/internal/Observable';
@Component({
  selector: 'bnt-pension-modify-sc',
  templateUrl: './pension-modify-sc.component.html',
  styleUrls: ['./pension-modify-sc.component.scss']
})
export class PensionModifyScComponent extends AnnuityBaseComponent implements OnInit, AfterViewInit {
  acitveBenefit: CoreActiveBenefits;
  activeBenefitsList: ActiveBenefits[];
  activeBenefitDetails: AnnuityResponseDto;
  contributorDeathOrMissingDate: GosiCalendar;
  wizardItems: WizardItem[] = [];
  pensionTransactionId: string;
  benefitType: string;
  heading: string;
  isHeir = false;
  actionType: string;
  fetchWithStatusList: string[];
  heirStatusList: string[] = [];
  isSmallScreen: boolean;
  requestDetailsForm: FormGroup;
  disableDate = false;
  heirStatusEnums = HeirStatus;
  isConfirmClicked = false;
  isModifyBackdated = false;
  deductionPlanList$: Observable<LovList>;
 // showConfirmButton:boolean=true;
  @ViewChild('retirementDetailsTab', { static: false })
  retirementDetailsTab: TabsetComponent;

  @ViewChild('applyretirementWizard', { static: false })
  applyretirementWizard: ProgressWizardDcComponent;

  @ViewChild('confirmTemplate', { static: true })
  confirmTemplate: TemplateRef<HTMLElement>;

  benefitStartDate: GosiCalendar;
  savedDependents: DependentDetails[];
  savedHeirs: HeirDetailsRequest;
  updatedHoldReasonForm: FormGroup;
  // historyBenefitDetails: BenefitDetails[] = [];
  annuitybenefits: Benefits[] = [];
  minDate: Date;
  channel:any
  addOrModifyHeir:boolean=false;
  ngOnInit(): void {
    super.ngOnInit();

    this.pensionModify = true;
    const payload = this.routerData.payload ? JSON.parse(this.routerData.payload) : "";
    this.channel = payload?.channel;
   // routerData.channel !=='taminaty' && routerData?.payload?.titleEnglish !== 'Add/Modify Heirs'
    this.addOrModifyHeir=(this.channel === Channel.TAMINATY && payload?.titleEnglish === 'Add/Modify Heirs')?true:false;
    // fetching selected language
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.requestDetailsForm = this.createrequestDetailsForm();
    this.benefitsForm = this.requestDetailsForm;
    this.isModifyBackdated = true;
    this.getSystemRunDate();
    this.initAdditionalContributionPlanLookup();
    this.fetchWithStatusList = [];
    this.route.queryParams.subscribe(params => {
      this.checkValidatorEditFlow();
      this.actionType = params.actionType;
      this.isHeir = /true/i.test(params.isHeir);
      // this.isHeir = isHeirBenefit()
      if (this.actionType) {
        this.setHeirByStatus();
      } else {
        //Add/Modify Case
        this.fetchWithStatusList.push(HeirStatusType.ACTIVE);
        this.fetchWithStatusList.push(HeirStatusType.INACTIVE);
        this.fetchWithStatusList.push(HeirStatusType.ONHOLD);
        if (this.isValidator) {
          //If its validator edit skip the actiontype for Heir/Dependent api call
          this.fetchWithStatusList = null;
        }
      }
      // this.setValuesForValidator();
      this.benefitsForm = createRequestBenefitForm(this.isAppPrivate, this.fb);
      this.dependentDetails = null;

      // accessing the active Benefit details which set which user click on active benefits carousel
      this.acitveBenefit = this.coreBenefitService.getSavedActiveBenefit();

      if (this.acitveBenefit) {
        this.socialInsuranceNo = this.acitveBenefit.sin;
        // this.socialInsuranceNo = this.sin;
        if (this.acitveBenefit.deathDate) {
          this.contributorDeathOrMissingDate = this.acitveBenefit.deathDate;
        } else if (this.acitveBenefit.missingDate) {
          this.contributorDeathOrMissingDate = this.acitveBenefit.missingDate;
        }
        this.benefitType = this.acitveBenefit.benefitType.english;
        this.benefitRequestId = this.acitveBenefit.benefitRequestId;
        this.referenceNo = this.acitveBenefit.referenceNo;
        this.getEligibiliyStartDate();
        if (this.acitveBenefit.requestDate) {
          this.minDate = moment(this.acitveBenefit.requestDate?.gregorian).toDate();
        } else if (this.acitveBenefit.startDate) {
          this.minDate = moment(this.acitveBenefit.startDate?.gregorian).toDate();
        }

        if (this.isHeir && !this.addOrModifyHeir) {
          //Top banner with details only for Heir
          this.getAnnuityBenefitDetails(
            this.socialInsuranceNo,
            this.benefitRequestId,
            this.isValidator ? this.referenceNo : null
          );
          this.getListOfHeirs(
            this.socialInsuranceNo,
            this.benefitRequestId,
            this.isValidator ? this.referenceNo : null
          );
        } else if (this.actionType !== HeirStatus.START_WAIVE && this.actionType !== HeirStatus.STOP_WAIVE) {
          // this.getEligibiliyStartDate();
          this.getAnnuityBenefitDetails(
            this.socialInsuranceNo,
            this.benefitRequestId,
            this.isValidator ? this.referenceNo : null
          );
          // this.getListOfDependents(
          //   this.socialInsuranceNo,
          //   this.benefitRequestId,
          //   this.isValidator ? this.referenceNo : null,
          //   this.fetchWithStatusList
          // );
          //this.getDependentsBackdated(this.benefitsForm.get('requestDate')?.value, this.benefitRequestId, this.referenceNo, this.fetchWithStatusList);
        }
        this.wizardItems = this.getWizardItems(this.actionType, this.isHeir);
        this.benefitStartDate = this.acitveBenefit.startDate || this.acitveBenefit.benefitStartDate;
        if (this.wizardItems && this.wizardItems.length > 0) {
          this.hasDependentOrHeir = isDependentOrHeirWizardPresent(this.wizardItems);
        }

      }
      if (
        this.isValidator &&
        (this.actionType === HeirStatus.START_WAIVE || this.actionType === HeirStatus.STOP_WAIVE)
      ) {
        this.benefitsForm.addControl('waiveBenefit', this.waiveBenefitFrom(this.actionType, this.acitveBenefit));
      }
      this.activeBenefitDetails = this.modifyPensionService.getAnnuityDetails();
      this.setHeadingForEachBenefits(this.benefitType, this.actionType);
    });
    if (this.actionType === HeirStatus.START_WAIVE) {
      this.initialiseWaivedTowardsLookup();
    }
    this.selectedWizard(0);
    this.setTransacrtionIDs();
    this.getScreenSize();
    this.loadBenefitDetailsPageContents();
    
  }
  setHeirByStatus() {
    if (this.actionType === HeirStatus.HOLD || this.actionType === HeirStatus.START_WAIVE) {
      this.fetchWithStatusList.push(HeirStatusType.ACTIVE);
    } else if (this.actionType === HeirStatus.RESTART) {
      this.fetchWithStatusList.push(HeirStatusType.ONHOLD);
    } else if (this.actionType === HeirStatus.STOP) {
      this.fetchWithStatusList.push(HeirStatusType.ACTIVE);
      this.fetchWithStatusList.push(HeirStatusType.ONHOLD);
    } else if (this.actionType === HeirStatus.STOP_WAIVE) {
      this.fetchWithStatusList.push(HeirStatusType.WAIVED);
    } else {
      this.fetchWithStatusList.push(HeirStatusType.ACTIVE);
      this.fetchWithStatusList.push(HeirStatusType.INACTIVE);
    }
  }

  createrequestDetailsForm() {
    return this.fb.group({
      requestDate: this.fb.group({
        gregorian: [null, Validators.required],
        hijiri: [null]
      })
    });
  }
  getSystemRunDate() {
    this.manageBenefitService.getSystemRunDate().subscribe(res => {
      this.systemRunDate = res;
      this.maxDate = moment(this.systemRunDate.gregorian).toDate();
    });
  }
  waiveBenefitFrom(action: string, acitveBenefit: CoreActiveBenefits): FormGroup {
    const form = this.fb.group({
      //For calling api action needed
      // action: action === HeirStatus.START_WAIVE ? HeirStatus.START_WAIVE_STRING : HeirStatus.STOP_WAIVE_STRING,
      action: action,
      notes: [acitveBenefit.notes, Validators.required]
    });
    if (action === HeirStatus.START_WAIVE) {
      form.addControl(
        'startDate',
        this.fb.group({
          gregorian: [moment(acitveBenefit?.waiveStartDate?.gregorian).toDate(), Validators.required],
          hijiri: [acitveBenefit?.waiveStartDate?.hijiri]
        })
      );
    } else if (action === HeirStatus.STOP_WAIVE) {
      form.addControl(
        'stopDate',
        this.fb.group({
          gregorian: [moment(acitveBenefit?.waiveStopDate?.gregorian).toDate(), Validators.required],
          hijiri: [acitveBenefit?.waiveStopDate?.hijiri]
        })
      );
    }
    return form;
  }

  ngAfterViewInit() {
    this.isNavigatedFromInbox();
    if (this.isConfirmClicked) {
      this.getDependentsBackdated(this.benefitsForm.get('requestDate')?.value, this.benefitRequestId, this.referenceNo);
    }
  }

  setTransacrtionIDs() {
    if (
      this.actionType &&
      (this.actionType === HeirStatus.HOLD ||
        this.actionType === HeirStatus.STOP ||
        this.actionType === HeirStatus.RESTART ||
        this.actionType === HeirStatus.START_WAIVE ||
        this.actionType === HeirStatus.STOP_WAIVE)
    ) {
      // this.pensionTransactionId = BenefitConstants.REQUEST_MODIFY_BENEFIT;
      this.pensionTransactionId = getTransactionTypeOrId(this.isHeir, this.actionType, false);
    } else if (this.isHeir) {
      this.pensionTransactionId = BenefitConstants.REQUEST_MODIFY_HEIR;
    } else {
      this.pensionTransactionId = BenefitConstants.REQUEST_MODIFY_DEPENDENT;
    }
  }

  isNavigatedFromInbox() {
    if (this.routerData && this.routerData.selectWizard) {
      if (this.routerData.selectWizard === BenefitConstants.UI_DOCUMENTS) {
        this.applyretirementWizard.wizardItems = this.wizardService.addWizardItem(
          this.applyretirementWizard.wizardItems,
          new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt')
        );
        this.benefitDocumentService
          .getReqDocs(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo)
          .subscribe(response => {
            if (response.length) {
              this.requiredDocs = response;
              this.applyretirementWizard.wizardItems = this.wizardService.addWizardItem(
                this.applyretirementWizard.wizardItems,
                new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt')
              );
            }
          });
      }
      // this.nextForm(this.retirementDetailsTab, this.applyretirementWizard, this.routerData.selectWizard);
      this.loadBenefitDetailsPageContents();
    }
    // else {
    //   this.selectedWizard(0);
    //   this.loadBenefitDetailsPageContents();
    // }
  }

  loadBenefitDetailsPageContents() {
    if (
      this.isTabSlctdInWizard(this.uiConst.BENEFIT_DETAILS, this.currentTab, this.wizardItems) ||
      this.isTabSlctdInWizard(this.uiConst.HOLD_BENEFIT, this.currentTab, this.wizardItems)
    ) {
      if (this.benefitRequestId) {
        this.getAnnuityCalculation(this.socialInsuranceNo, this.benefitRequestId, this.referenceNo);
      }
      this.getBenefitHistoryDetails(this.socialInsuranceNo, this.benefitRequestId);
    }
    this.getEligibilityDetails(this.socialInsuranceNo);
  }

  /**method to get Imprisionment details*/
  getEligibilityDetails(sin: number) {
    if (this.isValidator) {
      this.manageBenefitService.getAnnuityBenefits(sin).subscribe(data => {
        this.annuitybenefits = data;
        if (this.annuitybenefits && this.annuitybenefits.length > 0) {
          this.annuitybenefits.forEach(benefit => {
            if (benefit.eligibleForDependentAmount) {
              this.benefitPropertyService.setEligibleDependentAmount(benefit.eligibleForDependentAmount);
            }
          });
        }
      });
    }
  }

  getEligibiliyStartDate(requestDate?: GosiCalendar) {
    this.dependentService
      .getBenefitStartAndEligibilityDate(
        this.socialInsuranceNo,
        this.benefitType,
        this.imprissionmentDetails,
        this.heirDetailsData,
        requestDate,
        this.benefitRequestId
      )
      .subscribe(
        benefitEligibilityStartDate => {
          this.benefitEligibilityAndStartDate = benefitEligibilityStartDate;
          if (this.benefitEligibilityAndStartDate?.benefitEligibilityDate && !this.actionType) {
            // for add/modify dep and heir, modification request date can be backdated till benefit eligibility date (Defect: 509917)
            this.minDate = moment(this.benefitEligibilityAndStartDate?.benefitEligibilityDate?.gregorian).toDate();
          }
        },
        err => {
          showErrorMessage(err, this.alertService);
        }
      );
  }
  requestDatedetailsPayload(requestDate:GosiCalendar) {
    const requestDatedetails = new RequestModificationDateDetailsDto();
    requestDatedetails.requestModificationDate = requestDate;
    requestDatedetails.referenceNo=this.referenceNo;
    return requestDatedetails;
  }

  getConfirmDate(){

  }
  getDependentList(requestDate: GosiCalendar) {
     if(this.addOrModifyHeir){
     
      const payload = this.requestDatedetailsPayload(requestDate)
      this.dependentService.saveDetails(this.socialInsuranceNo,
        this.benefitRequestId.toString(),
         this.referenceNo,
         payload) .subscribe(
        res => {
          if(res){
           /* if(res.dateModified){
            this.referenceNo=null;
           } */
            setTimeout(() => {
              this.getAnnuityBenefitDetails(
                this.socialInsuranceNo,
                this.benefitRequestId,
                res.dateModified ? null:this.referenceNo 
              );
              this.getListOfHeirs(
                this.socialInsuranceNo,
                this.benefitRequestId,
                res.dateModified ? null:this.referenceNo 
              );
            }, 200);
           
          }
        },
        err => {
          showErrorMessage(err, this.alertService);
        }
      );
    } 
    
    this.dependentService
      .getDependentDetailsById(
        this.socialInsuranceNo,
        this.benefitRequestId.toString(),
        this.isValidator ? this.referenceNo : null,
        this.fetchWithStatusList
      )
      .subscribe(
        res => {
          this.eligibleForBenefit = true;
          this.dependentDetails = setStatusForNicDependents(res, true, false, null, true, this.systemRunDate);
        },
        err => {
          showErrorMessage(err, this.alertService);
        }
      );
  }
  getListOfDependents(sin: Number, benefitRequestId: number, referenceNo: number, status: string[]) {
    this.dependentService.getDependentDetailsById(sin, benefitRequestId.toString(), referenceNo, status).subscribe(
      res => {
        this.dependentDetails = setStatusForNicDependents(res, true, false, null, true);
      },
      err => {
        showErrorMessage(err, this.alertService);
      }
    );
  }

  // setEligibilityStatusForDependents(dependents: DependentDetails[] = [], isValidatorEdit = false) {
  //   const depList = deepCopy(dependents);
  //   const notEligibleBilingual = DependentHeirConstants.notEligible();
  //   depList.forEach(eachDep => {
  //     eachDep.statusAfterValidation = eachDep?.valid
  //       ? DependentHeirConstants.eligible()
  //       : DependentHeirConstants.notEligible();
  //     if (!isValidatorEdit) {
  //       eachDep.showMandatoryDetails =
  //         eachDep.statusAfterValidation?.english === notEligibleBilingual.english ? false : true;
  //     }
  //   });
  //   return depList;
  // }

  getListOfHeirs(sin: Number, benefitRequestId: number, referenceNo: any) {
    // const status = [
    //   HeirStatusType.ACTIVE,
    //   HeirStatusType.STOPPED,
    //   HeirStatusType.ON_HOLD,
    //   HeirStatusType.WAIVED_TOWARDS_GOSI,
    //   HeirStatusType.WAIVED_TOWARDS_HEIR
    // ];
    if (this.actionType === HeirStatus.START_WAIVE || this.actionType === HeirStatus.STOP) {
      this.heirStatusList.push(HeirStatusType.ACTIVE);
      //New requirement 466000
      this.heirStatusList.push(HeirStatusType.ON_HOLD);
    } else if (this.actionType === HeirStatus.HOLD) {
      //Defect 523295 passing active value for Hold heir and removing inactive heir
      this.heirStatusList.push(HeirStatusType.ACTIVE);
    } else if (this.actionType === HeirStatus.STOP_WAIVE) {
      this.heirStatusList.push(HeirStatusType.WAIVED_TOWARDS_GOSI);
      this.heirStatusList.push(HeirStatusType.WAIVED_TOWARDS_HEIR);
    } else if (this.actionType === HeirStatus.RESTART) {
      this.heirStatusList.push(HeirStatusType.ON_HOLD);
    } else {
      this.heirStatusList.push(HeirStatusType.ACTIVE);
      this.heirStatusList.push(HeirStatusType.ON_HOLD);
      this.heirStatusList.push(HeirStatusType.WAIVED_TOWARDS_GOSI);
      this.heirStatusList.push(HeirStatusType.WAIVED_TOWARDS_HEIR);
      this.heirStatusList.push(HeirStatusType.STOPPED);
    }
    // if (this.isValidator) {
    //   this.heirBenefitService
    //     .getHeirById(sin, benefitRequestId.toString(), referenceNo, this.benefitType, null, null)
    //     .subscribe(
    //       dependents => {
    //         this.setDependents(dependents);
    //       },
    //       err => {
    //         showErrorMessage(err, this.alertService);
    //       }
    //     );
    // } else {
    this.heirBenefitService
      .getHeirBenefit(
        sin,
        benefitRequestId.toString(),
        referenceNo,
        this.heirStatusList,
        this.actionType === HeirStatus.HOLD || this.actionType === HeirStatus.RESTART ? false : true
      )
      .subscribe(
        res => {
          this.setDependents(res);
        },
        err => {
          showErrorMessage(err, this.alertService);
        }
      );
    // }
  }
  setDependents(dependents) {
    this.dependentDetails = dependents;
    this.dependentDetails.forEach(eachDep => {
      eachDep.statusAfterValidation = eachDep?.eligibleHeir
        ? DependentHeirConstants.eligible()
        : DependentHeirConstants.notEligible();
    });

    // the status is not required on modify scenariosG
    // this.dependentDetails.forEach(eachDep => {
    //   eachDep.statusAfterValidation = getDependentHeirEligibilityStatus(
    //     eachDep.eligibilityList,
    //     eachDep.valid,
    //     this.systemRunDate
    //   );
    // });
  }
  /** Method to handle doc upload. */
  docUploadSuccess(event) {
    this.patchBenefitWithCommentsAndNavigate(event, this.retirementDetailsTab, this.applyretirementWizard, [
      RouterConstants.ROUTE_INDIVIDUAL_PROFILE_INFO(this.socialInsuranceNo)
    ]);
  }
  getWizardItems(actionType: string, isHeir: boolean) {
    if (isHeir) {
      if (this.actionType === HeirStatus.HOLD) {
        return this.wizardService.getHoldHeirPensionItems();
      } else if (this.actionType === HeirStatus.RESTART) {
        return this.wizardService.getRestartHeirPensionItems();
      } else {
        return this.wizardService.getHeirPensionItems();
      }
    } else {
      //TODO: call the api from here itself to check eligibility
      const eligibleDependent = !this.isValidator ? this.benefitPropertyService.getEligibleDependentAmount() : true;
      return this.wizardService.getRetirementPensionItems(eligibleDependent, actionType, true);
      //return this.wizardService.getBackdatedPensionModificationItems(eligibleDependent, actionType);
    }
  }
  /*
   * This method is to select wizard
   */
  selectedWizard(index: number) {
    // this.currentTab = index;
    this.selectWizard(index, this.retirementDetailsTab, this.wizardItems);
  }

  saveDependent(data: DependentDetails[]) {
    this.savedDependents = data ? data : null;
    this.applyBenefit(this.retirementDetailsTab, this.applyretirementWizard, data, null, null, true);
  }

  saveHeir(data: HeirDetailsRequest) {
    if (this.benefitsForm.valid) {
      this.savedHeirs = data ? data : null;
      // this.router.navigate(navigateTo, {state: {loadPageWithLabel : 'BENEFITS'}});
      // this.coreBenefitService.setBenefitAppliedMessage({english: 'hsfdfda', arabic: ''});
      if (this.actionType === HeirStatus.HOLD) {
        const navigateTo = [BenefitConstants.ROUTE_BENEFIT_LIST(null, this.socialInsuranceNo)];
        this.applyBenefit(
          this.retirementDetailsTab,
          this.applyretirementWizard,
          null,
          data,
          navigateTo,
          true,
          this.actionType
        );
      } else {
        this.applyBenefit(this.retirementDetailsTab, this.applyretirementWizard, null, data, null, true, this.actionType);
      }
    } else {
      this.benefitsForm.markAllAsTouched()
    }

  }

  /*
   * This method is to go to previous form
   */
  previousForm() {
    this.goToPreviousForm(this.retirementDetailsTab, this.applyretirementWizard);
  }

  /** Method to handle cancellation of transaction. */
  cancelTransaction() {
    this.showOtpError = clearAlerts(this.alertService, this.showOtpError);
    this.commonModalRef = showModal(this.modalService, this.confirmTemplate);
    // this.benefitsForm.removeControl('requestDate');
  }

  /*
   * This method is to submit benefit details
   */
  submitBenefitDetails() {
    // const navigateTo = [
    //   BenefitConstants.ROUTE_BENEFIT_LIST(
    //     this.manageBenefitService.registrationNo,
    //     this.manageBenefitService.socialInsuranceNo
    //   )
    // ];
    const navigateTo =
      this.isValidator && this.annuityResponse?.status?.english !== BenefitStatus.DRAFT
        ? [RouterConstants.ROUTE_TODOLIST]
        : this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP
        ? [BenefitConstants.ROUTE_INDIVIDUAL_BENEFITS]
        : [BenefitConstants.ROUTE_BENEFIT_LIST(null, this.socialInsuranceNo)];
    let waiveFormValid = true;
    if (
      this.benefitsForm.get('waiveBenefit') &&
      (this.actionType === HeirStatus.STOP_WAIVE || this.actionType === HeirStatus.START_WAIVE)
    ) {
      waiveFormValid = this.benefitsForm.get('waiveBenefit')?.valid;
    }
    if (waiveFormValid) {
      this.applyBenefit(
        this.retirementDetailsTab,
        this.applyretirementWizard,
        this.savedDependents,
        this.savedHeirs,
        navigateTo,
        true,
        this.actionType
      );
    } else {
      this.benefitsForm.markAllAsTouched();
      this.benefitsForm.updateValueAndValidity();
    }
  }
  /**
   * this function will set the heading according to the benfit type
   */
  setHeadingForEachBenefits(benefitType: string, actionType?: string) {
    if (actionType) {
      if (actionType === this.heirStatusEnums.START_WAIVE || actionType === this.heirStatusEnums.STOP_WAIVE) {
        this.heading = new EachBenefitHeading(benefitType).getHeading();
      } else if (
        this.isHeir &&
        (actionType === this.heirStatusEnums.HOLD || actionType === this.heirStatusEnums.RESTART)
      ) {
        this.heading = 'BENEFITS.HEIR-BENEFIT';
      } else {
        this.heading = new BenefitTypeLabels(benefitType).getHeading();
      }
    } else {
      //add/modify heir or dependent

      if (this.isHeir) {
        this.heading = new ModifyDepentsHeadingTypes(benefitType).getHeading();
        // if(annualnotificationDate){
        // this.heading = 'BENEFITS.ADD-MODIFY-HEIR-UPDATE-NOTIFICATION';
        // }
      } else {
        this.heading = 'BENEFITS.MANAGE-DEPENDENTS-HEADING';
      }
    }
    // if (this.isHeir) {
    //   if (actionType === HeirStatus.HOLD) {
    //     this.heading = 'BENEFITS.HOLD-HEIR-BENEFIT';
    //   } else if (actionType === HeirStatus.RESTART) {
    //     this.heading = 'BENEFITS.RESTART-HEIR-BENEFIT';
    //   } else if (actionType === HeirStatus.STOP) {
    //     this.heading = 'BENEFITS.STOP-HEIR-BENEFIT';
    //   } else {
    //     this.heading = new ModifyDepentsHeadingTypes(benefitType).getHeading();
    //   }
    // } else {
    //   if (actionType === HeirStatus.HOLD) {
    //     this.heading = 'BENEFITS.HOLD-DEPENDENT-BENEFIT';
    //   } else if (actionType === HeirStatus.RESTART) {
    //     this.heading = 'BENEFITS.RESTART-DEPENDENT-BENEFIT';
    //   } else if (actionType === HeirStatus.STOP) {
    //     this.heading = 'BENEFITS.STOP-DEPENDENT-BENEFIT';
    //   } else {
    //     this.heading = new ModifyDepentsHeadingTypes(benefitType).getHeading();
    //   }
    // }
  }
  /**
   * Method to fetch the annuity request details
   */

  getAnnuityBenefitDetails(socialInsuranceNo: number, benefitrequestId: number, referenceNo: number) {
    this.manageBenefitService
      .getAnnuityBenefitRequestDetail(socialInsuranceNo, benefitrequestId, referenceNo)
      .subscribe(
        res => {
          if (res) {
            if (this.isValidator) {
              this.benefitPropertyService
                .validatorEditCall(socialInsuranceNo, benefitrequestId, this.referenceNo)
                .subscribe();
            }
            this.annuityResponse = res;
            if (this.annuityResponse.modificationRequestDate?.gregorian && !this.addOrModifyHeir) {
              this.benefitsForm
                .get('requestDate.gregorian')
                ?.patchValue(moment(this.annuityResponse.modificationRequestDate?.gregorian).toDate());
              this.benefitsForm.updateValueAndValidity();
            }
            if (this.activeBenefitDetails || this.isValidator) {
              this.getPersonDetailsWithPersonId(
                this.activeBenefitDetails ? this.activeBenefitDetails?.personId : this.annuityResponse?.personId
              );
            }
          }
        },
        err => {
          this.showError(err);
        }
      );
  }

  setRequestDate(date) {
    this.requestDate = date;
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }

  decline() {
    decline(this.commonModalRef);
  }
  showErrorMessages($event) {
    showErrorMessage($event, this.alertService);
  }

  reasonFormValueChanged(data) {
    this.updatedHoldReasonForm = data;
  }

  referenceNoChanged(refNo: number) {
    this.referenceNo = refNo;
  }
  /*
   * This method is to get deduction plan.
   */
  initAdditionalContributionPlanLookup() {
    this.deductionPlanList$ = this.lookUpService.getAdditionalContributionPlan();
  }
}
