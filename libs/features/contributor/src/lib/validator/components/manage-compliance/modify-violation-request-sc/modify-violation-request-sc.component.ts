/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BPMUpdateRequest,
  convertToYYYYMMDD,
  LanguageToken,
  LookupService,
  Lov,
  LovList,
  markFormGroupTouched,
  OccupationList,
  RouterConstants,
  RouterData,
  RouterDataToken,
  wageValidator,
  WizardItem,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import moment from 'moment-timezone';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import {
  ContractAuthenticationService,
  ContributorConstants,
  ContributorService,
  EngagementService,
  EstablishmentService,
  FormWizardTypes,
  PersonTypesEnum,
  SystemParameter
} from '../../../../shared';
import { ComplianceBaseScComponent } from '../../../../shared/components/base/compliance-base-sc/compliance-base-sc.component';

@Component({
  selector: 'cnt-modify-violation-request-sc',
  templateUrl: './modify-violation-request-sc.component.html',
  styleUrls: ['./modify-violation-request-sc.component.scss']
})
export class ModifyViolationRequestScComponent extends ComplianceBaseScComponent implements OnInit {
  violationRequestForm: FormGroup;
  wageUpdateForm: FormGroup;
  /**Progress wizard */
  @ViewChild('progressWizardItems', { static: false })
  progressWizardItems: ProgressWizardDcComponent;
  activeTab = 0;
  formWizardItems: WizardItem[] = [];
  isJoiningDateChanged = false;
  isLeavingDateChanged = false;
  isLeavingReasonChanged = false;
  modalRef: BsModalRef;
  isLeavingDateTooltip = false;
  isLeavingReasonTooltip = false;
  isJoiningDateTooltip = false;
  isModifyWageTooltip = false;
  /** Observables. */
  leavingReasonList$: Observable<LovList>;
  leavingReasonList: LovList;
  occupationList$: Observable<OccupationList>;
  isAppPrivate;
  validatorData;
  currentDate = new Date();
  systemJoiningDate: Date;
  systemLeavingDate: Date;
  systemActualLeavingDate: Date;
  systemActualJoiningDate: Date;
  minimumJoiningDate: Date;
  wageSeparatorLimit = ContributorConstants.WAGE_SEPARATOR_LIMIT;
  constructor(
    alertService: AlertService,
    @Inject(ApplicationTypeToken) appToken: string,
    contractAuthenticationService: ContractAuthenticationService,
    contributorService: ContributorService,
    establishmentService: EstablishmentService,
    engagementService: EngagementService,
    @Inject(RouterDataToken) routerDataToken: RouterData,
    @Inject(LanguageToken) language: BehaviorSubject<string>,
    router: Router,
    readonly fb: FormBuilder,
    readonly modalService: BsModalService,
    readonly workFlowService: WorkflowService,
    readonly lookupService: LookupService
  ) {
    super(
      alertService,
      appToken,
      contractAuthenticationService,
      contributorService,
      establishmentService,
      engagementService,
      routerDataToken,
      language,
      router
    );
  }

  ngOnInit(): void {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.initialiseWizardItems();
    this.listenLanguageChange();
    this.setRouterData();
    if (!this.isWageUpdate) this.initialiseForm();
    else this.initialiseWageUpdateForm();
    this.populateFormValues();
  }
  /** Method to initialise wizard items */
  initialiseWizardItems() {
    this.formWizardItems = this.getWizardItems();
    this.formWizardItems[0].isDisabled = false;
    this.formWizardItems[0].isActive = true;
  }
  /**Method to get wizard items */
  getWizardItems() {
    return [new WizardItem(FormWizardTypes.ENGAGEMENT_DETAILS, 'briefcase')];
  }
  /** Method to initialise Form */
  initialiseForm() {
    this.violationRequestForm = this.fb.group({
      registrationNumber: [
        { value: null, disabled: true },
        {
          validators: Validators.required
        }
      ],
      nameEn: [
        { value: null, disabled: true },
        {
          validators: Validators.required
        }
      ],
      nameAr: [
        { value: '', disabled: true },
        {
          validators: Validators.required
        }
      ],
      joiningDate: this.fb.group({
        gregorian: [
          { value: '', disabled: false },
          {
            validators: Validators.required
          }
        ],
        hijiri: [null, {}]
      }),
      leavingDate: this.fb.group({
        gregorian: [
          { value: '', disabled: false },
          {
            validators: Validators.required
          }
        ],
        hijiri: [null, {}]
      }),
      leavingReason: this.fb.group({
        english: [{ value: null, disabled: false }, { validators: Validators.required }],
        arabic: [{ value: null, disabled: false }]
      })
    });
  }
  initialiseWageUpdateForm() {
    this.wageUpdateForm = this.fb.group({
      applicableFrom: this.fb.group({
        gregorian: ['', Validators.required],
        hijiri: [null, {}]
      }),
      wage: this.fb.group({
        basicWage: [
          parseFloat('0.00').toFixed(2),
          { validators: [Validators.required, wageValidator], updateOn: 'blur' }
        ],
        commission: [parseFloat('0.00').toFixed(2)],
        housingBenefit: [parseFloat('0.00').toFixed(2)],
        otherAllowance: [parseFloat('0.00').toFixed(2)],
        totalWage: [parseFloat('0').toFixed(2), { validators: Validators.required, updateOn: 'blur' }]
      }),
      occupation: this.fb.group({
        english: [null, Validators.required],
        arabic: [{ value: null, disabled: false }]
      })
    });
  }

  /** Method to update form value */
  updateFormValue(establishmentDetails) {
    this.violationRequestForm.patchValue({
      registrationNumber: this.registrationNumber,
      nameEn: establishmentDetails?.name?.english,
      nameAr: establishmentDetails?.name?.arabic
    });
  }
  /** Method to populate form values */
  populateFormValues() {
    forkJoin([
      this.getEstablishment(),
      this.getContributor(),
      this.getViolationRequest(),
      this.getMinimumJoiningDate()
    ]).subscribe(
      () => {
        if (!this.isWageUpdate) this.updateFormValue(this.establishmentDetails);
        if (this.personDetails?.person && this.engagementDetails) {
          this.fetchLookup(this.personDetails, this.engagementDetails).subscribe(res => {
            this.leavingReasonList = res;
          });
        }
        if (this.violationDetails && this.engagementDetails) {
          this.setDateValidaion(this.violationDetails, this.engagementDetails);
          this.setFormModifyDate(this.violationDetails, this.engagementDetails);
          // this.listentoFormChanges(this.violationDetails);
        }
      },
      err => this.alertService.showError(err.error.message)
    );
  }

  /** MEthod to get system param for EINSPECTION_MAX_BACKDATED_JOINING_DATE. */
  getMinimumJoiningDate() {
    return this.contributorService
      .getSystemParams()
      .pipe(
        tap(
          res =>
            (this.minimumJoiningDate = new SystemParameter().fromJsonToObject(
              res
            ).EINSPECTION_MAX_BACKDATED_JOINING_DATE)
        )
      );
  }

  /** Method to set date validation. */
  setDateValidaion(violationDetail, engDetail) {
    //Joining date max date should be leaving date
    if (engDetail?.leavingDate) {
      this.systemActualLeavingDate = new Date(engDetail?.leavingDate?.gregorian);
    } else {
      this.systemActualLeavingDate = this.currentDate;
    }
    //Joining date min date should be maximum of EINSPECTION_MAX_BACKDATED_JOINING_DATE and establishment start date (Story 384576)
    this.systemActualJoiningDate = moment(this.establishmentDetails.startDate.gregorian).isAfter(
      this.minimumJoiningDate,
      'day'
    )
      ? new Date(this.establishmentDetails.startDate.gregorian)
      : this.minimumJoiningDate;
    //For Modify Leaving Date and terminate - Leaving date min date should be joining date
    this.systemJoiningDate = new Date(engDetail?.joiningDate?.gregorian);
    //For terminate - Leaving date max date should be current date
    this.systemLeavingDate = this.currentDate;
    //For Modify Leaving Date - Leaving date max date should be leavingDate date or current date ,lesser one is taken.
    if (
      violationDetail?.violationType?.english === 'Modify Engagement' &&
      violationDetail?.violationSubType?.english === 'Modify Leaving Date'
    ) {
      this.systemLeavingDate =
        new Date(engDetail?.leavingDate?.gregorian) > this.currentDate
          ? this.currentDate
          : this.systemActualLeavingDate;
    }
  }
  /** Method to set form date */
  setFormModifyDate(violationDetail, engDetail) {
    if (
      violationDetail?.violationType?.english === 'Modify Engagement' &&
      violationDetail?.violationSubType?.english === 'Modify Leaving Date'
    ) {
      this.isLeavingDateTooltip = true;
      this.violationRequestForm.get('joiningDate.gregorian').setValue(new Date(engDetail?.joiningDate?.gregorian));
      this.violationRequestForm.get('joiningDate.gregorian').disable();
      this.violationRequestForm.get('leavingReason').setValue(engDetail?.leavingReason);
      this.violationRequestForm.get('leavingReason').disable();
      if (this.payload.assignedRole === 'Validator1') {
        this.violationRequestForm
          .get('joiningDate.gregorian')
          .setValue(new Date(violationDetail?.leavingDate.gregorian));
      }
      if (violationDetail?.validatorData) {
        this.violationRequestForm
          .get('leavingDate.gregorian')
          .setValue(new Date(violationDetail?.validatorData?.modifiedDate?.gregorian));
        this.isLeavingDateChanged = false;
      }
    } else if (violationDetail?.violationType?.english === 'Terminate Engagement') {
      this.isLeavingDateTooltip = true;
      this.isLeavingReasonTooltip = true;
      this.violationRequestForm.get('joiningDate.gregorian').setValue(new Date(engDetail?.joiningDate?.gregorian));
      this.violationRequestForm.get('leavingDate.gregorian').setValue(new Date(engDetail?.leavingDate?.gregorian));
      if (this.payload.assignedRole === 'Validator1') {
        this.violationRequestForm
          .get('leavingDate.gregorian')
          .setValue(new Date(violationDetail?.leavingDate.gregorian));
        this.violationRequestForm.get('leavingReason').setValue(violationDetail?.leavingReason);
      }
      if (violationDetail?.validatorData) {
        this.violationRequestForm
          .get('leavingDate.gregorian')
          .setValue(new Date(violationDetail?.validatorData?.modifiedDate?.gregorian));
        this.violationRequestForm.get('leavingReason').setValue(violationDetail?.validatorData?.leavingReason);
        this.isLeavingDateChanged = false;
        this.isLeavingReasonChanged = false;
      }
    } else if (
      violationDetail?.violationType?.english === 'Modify Engagement' &&
      violationDetail?.violationSubType?.english === 'Modify Joining Date'
    ) {
      this.isJoiningDateTooltip = true;
      if (engDetail?.leavingDate) {
        this.violationRequestForm.get('leavingDate.gregorian').setValue(new Date(engDetail?.leavingDate?.gregorian));
        this.violationRequestForm.get('leavingReason').setValue(engDetail?.leavingReason);
      }
      this.violationRequestForm.get('leavingDate.gregorian').disable();
      this.violationRequestForm.get('leavingReason.english').disable();
      this.violationRequestForm.get('leavingReason.arabic').disable();
      if (this.payload.assignedRole === 'Validator1') {
        this.violationRequestForm
          .get('joiningDate.gregorian')
          .setValue(new Date(violationDetail?.joiningDate.gregorian));
      }
      if (violationDetail?.validatorData) {
        this.violationRequestForm
          .get('joiningDate.gregorian')
          .setValue(new Date(violationDetail?.validatorData?.modifiedDate?.gregorian));
        this.isJoiningDateChanged = false;
      }
    } else if (
      violationDetail?.violationType?.english === 'Modify Engagement' &&
      violationDetail?.violationSubType?.english === 'Modify Wage And Occupation'
    ) {
      let totalWage;
      this.isModifyWageTooltip = true;
      this.wageUpdateForm.get('applicableFrom.gregorian').setValue(new Date(engDetail?.joiningDate?.gregorian));
      this.wageUpdateForm.get('occupation').setValue(violationDetail.wage.requestedWage.occupation);
      this.wageUpdateForm.get('wage.basicWage').setValue(violationDetail.wage.requestedWage.basicWage);
      this.wageUpdateForm.get('wage.commission').setValue(violationDetail.wage.requestedWage.commission);
      this.wageUpdateForm.get('wage.housingBenefit').setValue(violationDetail.wage.requestedWage.housingBenefit);
      this.wageUpdateForm.get('wage.otherAllowance').setValue(violationDetail.wage.requestedWage.otherAllowance);
      totalWage =
        violationDetail.wage.requestedWage.otherAllowance +
        violationDetail.wage.requestedWage.basicWage +
        violationDetail.wage.requestedWage.commission +
        violationDetail.wage.requestedWage.housingBenefit;
      this.wageUpdateForm.get('wage.totalWage').setValue(totalWage);
      if (this.state === WorkFlowActions.RETURN && violationDetail?.validatorData) {
        this.wageUpdateForm.get('applicableFrom.gregorian').setValue(new Date(engDetail?.joiningDate?.gregorian));
        this.wageUpdateForm.get('occupation').setValue(violationDetail.validatorData.occupation);
        this.wageUpdateForm.get('wage.basicWage').setValue(violationDetail.validatorData.basicWage);
        this.wageUpdateForm.get('wage.commission').setValue(violationDetail.validatorData.commission);
        this.wageUpdateForm.get('wage.housingBenefit').setValue(violationDetail.validatorData.housingBenefit);
        this.wageUpdateForm.get('wage.otherAllowance').setValue(violationDetail.validatorData.otherAllowance);
        totalWage =
          violationDetail.validatorData.otherAllowance +
          violationDetail.validatorData.basicWage +
          violationDetail.validatorData.commission +
          violationDetail.validatorData.housingBenefit;
        this.wageUpdateForm.get('wage.totalWage').setValue(totalWage);
      }
    }
  }
  onBlur(wageDetail: FormGroup) {
    this.calculateTotalWage(wageDetail);
  }
  calculateTotalWage(updateWageForm: FormGroup) {
    const wageValues = updateWageForm.getRawValue();
    let totalWage = 0;
    let contributoryWage = 0;
    if (wageValues.wage.basicWage) {
      totalWage += parseFloat(wageValues.wage.basicWage);
      contributoryWage += parseFloat(wageValues.wage.basicWage);
    }
    if (wageValues.wage.commission) {
      totalWage += parseFloat(wageValues.wage.commission);
      contributoryWage += parseFloat(wageValues.wage.commission);
    }
    if (wageValues.wage.housingBenefit) {
      totalWage += parseFloat(wageValues.wage.housingBenefit);
      contributoryWage += parseFloat(wageValues.wage.housingBenefit);
    }
    if (wageValues.wage.otherAllowance) {
      totalWage += parseFloat(wageValues.wage.otherAllowance);
    }
    updateWageForm.get('wage').patchValue({
      totalWage: totalWage.toFixed(2)
    });
    updateWageForm.get('wage').patchValue({
      contributoryWage: contributoryWage.toFixed(2)
    });
  }
  /** Method to listen to form changes */
  listentoFormChanges(violationDetail) {
    this.violationRequestForm.get('joiningDate.gregorian').valueChanges.subscribe(joiningDate => {
      if (
        joiningDate &&
        violationDetail?.violationType?.english === 'Modify Engagement' &&
        violationDetail?.violationSubType?.english === 'Modify Joining Date'
      ) {
        this.isJoiningDateChanged = true;
      }
    });
    this.violationRequestForm.get('leavingDate.gregorian').valueChanges.subscribe(leavingDate => {
      if (
        leavingDate &&
        violationDetail?.violationType?.english === 'Modify Engagement' &&
        violationDetail?.violationSubType?.english === 'Modify Leaving Date'
      ) {
        this.isLeavingDateChanged = true;
      } else if (leavingDate && violationDetail?.violationType?.english === 'Terminate Engagement') {
        this.isLeavingDateChanged = true;
      }
    });
    this.violationRequestForm.get('leavingReason').valueChanges.subscribe(leavingReason => {
      if (leavingReason && violationDetail?.violationType?.english === 'Terminate Engagement') {
        this.isLeavingReasonChanged = true;
      }
    });
  }
  /** Method to submit engagement */
  confirmEngagement(violationDetails, routerDataToken) {
    if (!this.isWageUpdate) {
      this.violationRequestForm.markAllAsTouched();
      markFormGroupTouched(this.violationRequestForm);
      if (
        violationDetails?.violationType?.english === 'Modify Engagement' &&
        violationDetails?.violationSubType?.english === 'Modify Joining Date'
      ) {
        this.validatorData = {
          modifiedDate: {
            gregorian: convertToYYYYMMDD(this.violationRequestForm.get('joiningDate.gregorian').value),
            hijiri: this.violationRequestForm.get('joiningDate.hijiri').value
          }
        };
      } else if (
        violationDetails?.violationType?.english === 'Modify Engagement' &&
        violationDetails?.violationSubType?.english === 'Modify Leaving Date'
      ) {
        this.validatorData = {
          modifiedDate: {
            gregorian: convertToYYYYMMDD(this.violationRequestForm.get('leavingDate.gregorian').value),
            hijiri: this.violationRequestForm.get('leavingDate.hijiri').value
          }
        };
      } else if (violationDetails?.violationType?.english === 'Terminate Engagement') {
        this.validatorData = {
          modifiedDate: {
            gregorian: convertToYYYYMMDD(this.violationRequestForm.get('leavingDate.gregorian').value),
            hijiri: this.violationRequestForm.get('leavingDate.hijiri').value
          },
          leavingReason: this.violationRequestForm.get('leavingReason').value
        };
      }
    } else {
      this.wageUpdateForm.markAllAsTouched();
      markFormGroupTouched(this.wageUpdateForm);
      if (
        violationDetails?.violationType?.english === 'Modify Engagement' &&
        violationDetails?.violationSubType?.english === 'Modify Wage And Occupation'
      ) {
        this.validatorData = {
          modifiedWageAndOccupation: {
            basicWage: this.wageUpdateForm.get('wage.basicWage').value,
            commission: this.wageUpdateForm.get('wage.commission').value,
            housingBenefit: this.wageUpdateForm.get('wage.housingBenefit').value,
            otherAllowance: this.wageUpdateForm.get('wage.otherAllowance').value,
            occupation: this.wageUpdateForm.get('occupation').value
          }
        };
      }
    }
    const workflowData = new BPMUpdateRequest();
    workflowData.taskId = routerDataToken.taskId;
    workflowData.user = routerDataToken.assigneeId;
    workflowData.outcome = WorkFlowActions.SUBMIT;
    if (this.violationRequestForm?.valid || this.wageUpdateForm?.valid) {
      this.contractAuthenticationService
        .modifyDate(
          this.registrationNumber,
          this.socialInsuranceNumber,
          this.engagementDetails.engagementId,
          this.requestId,
          this.validatorData
        )
        .subscribe(
          violationRes => {
            this.updateTaskWorkFlow(workflowData, violationRes);
          },
          err => {
            this.alertService.showError(err.error.message);
          }
        );
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }
  /** Method to update task workflow */
  updateTaskWorkFlow(workflowData: BPMUpdateRequest, violationRes) {
    this.workFlowService.updateTaskWorkflow(workflowData, WorkFlowActions.SUBMIT).subscribe(() => {
      this.alertService.showSuccess(violationRes, null, 5);
      this.router.navigate([RouterConstants.ROUTE_INBOX]);
    });
  }
  /** Method to cancel transaction */
  cancelTransaction(isChanged, cancelEngagementTemplate) {
    if (isChanged) {
      this.showModal(cancelEngagementTemplate, 'md');
    } else {
      this.router.navigate(['home/contributor/validator/violate-engagement']);
    }
  }
  /** Method to show modal. */
  showModal(template: TemplateRef<HTMLElement>, size: string): void {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }
  /** Method to hide modal. */
  hideModal(): void {
    this.modalRef.hide();
  }
  /** Method: cancel click */
  confirmCancel() {
    this.hideModal();
    this.router.navigate(['home/contributor/validator/violate-engagement']);
  }
  /** Method to hide modal */
  decline() {
    this.hideModal();
  }
  /** Method to handle lookup. */
  fetchLookup(contributor, engDetail?) {
    //To fetch leaving reason based on nationality of the person.
    const nationalityType: string = contributor.person.personType === PersonTypesEnum.SAUDI ? '1' : '2';
    this.leavingReasonList$ = this.lookupService.getReasonForLeavingList(nationalityType);
    this.occupationList$ = this.lookupService.getOccupationList();
    //Government job joining should be available only in FO.
    if (!this.isAppPrivate)
      this.leavingReasonList$ = this.leavingReasonList$.pipe(
        filter(lovlist => lovlist && lovlist !== null),
        map(lovList => {
          return new LovList(lovList.items.filter(lov => lov.value.english !== ContributorConstants.GOV_JOB_JOINING));
        })
      );
    if (engDetail?.leavingReason) this.checkForAutomaticReasons(engDetail);
    if (!contributor.person.deathDate?.gregorian) this.extractLeavingReason();
    return this.leavingReasonList$;
  }
  /** Method to check for obsolete reason and add it to leaving reason list. */
  checkForAutomaticReasons(engDetail) {
    this.leavingReasonList$ = this.leavingReasonList$.pipe(
      filter(lovlists => lovlists && lovlists !== null),
      map(lovLists => {
        if (!lovLists.items.some(item => item.value.english === engDetail.leavingReason.english)) {
          const lovData = new Lov();
          lovData.items = undefined;
          lovData.value = engDetail.leavingReason;
          lovLists.items.push(lovData);
        }
        return lovLists;
      })
    );
  }
  /** Method for filtering leaving reason */
  extractLeavingReason() {
    this.leavingReasonList$ = this.leavingReasonList$.pipe(
      filter(lovlist => lovlist && lovlist !== null),
      map(lovList => {
        return new LovList(
          lovList.items.filter(lov => ContributorConstants.DEAD_LEAVING_REASONS.indexOf(lov.value.english) === -1)
        );
      })
    );
  }
  leavingReasonSelect() {}
}
