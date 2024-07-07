import { Location } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  AppConstants,
  ApplicationTypeToken,
  DocumentService,
  Lov,
  LovList,
  RouterData,
  RouterDataToken,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  ChangeEstablishmentScBaseComponent,
  ChangeEstablishmentService,
  EstablishmentConstants,
  EstablishmentSafetyChecklist,
  EstablishmentService,
  SCAddInfoResponseList,
  SCAdditionalInfoList,
  SCGuideLines,
  SCGuidelineResponseList,
  SCListSubCategory,
  SafetyCheckData,
  SafetyCheckListQuestionare,
  SafetyCheckListResponse,
  SafetyInspectionService,
  ScFullChecklistDcComponent,
  SubmittedCheckList,
  navigateToTransactionTracking,
  setPreviousSubmissionDatesDropdown
} from '../../../shared';

@Component({
  selector: 'est-safety-evaluation-sc',
  templateUrl: './safety-evaluation-sc.component.html',
  styleUrls: ['./safety-evaluation-sc.component.scss']
})
export class SafetyEvaluationScComponent extends ChangeEstablishmentScBaseComponent implements OnInit {
  estRegNo: number;
  declarationForm: FormControl = new FormControl(null, { validators: Validators.requiredTrue, updateOn: 'blur' });
  maxLengthComments = AppConstants.MAXLENGTH_COMMENTS;
  selfEvaluationForm: FormGroup;
  checkList: SafetyCheckListQuestionare;
  accordionPanel = -1;
  categoryForm: FormArray = new FormArray([]);
  valueTypeSingle = 'single';
  isIIndCycle = false; //todo remove this one
  refNumber: number;
  estData: SafetyCheckData;
  safetyCheckListResponse: SafetyCheckListResponse = new SafetyCheckListResponse();
  isApiTriggered = false;
  violationSelectionForm: FormControl = new FormControl('');
  previousSubmissionDatesList?: LovList;
  previousSubmissionDateForm: FormGroup;
  modalRef: BsModalRef;

  @ViewChild('submitConfirmationTemplate', { static: true })
  submitConfirmationTemplate: TemplateRef<HTMLElement>;
  previousSubmittedData: SubmittedCheckList;
  compliantValueEnum = 'Compliant';
  notCompliantValueEnum = 'Not Compliant';
  notApplicableValueEnum = 'Not Applicable';
  heading = 'ESTABLISHMENT.OH-SAFETY-EVALUATION-FIRST';
  disabledComplainceValueValues: string[] = [];

  constructor(
    readonly location: Location,
    readonly safetyInspectionService: SafetyInspectionService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly establishmentService: EstablishmentService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly bsModalService: BsModalService,
    readonly workflowService: WorkflowService,
    readonly router: Router,
    readonly fb: FormBuilder,
    readonly route: ActivatedRoute,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly modalService: BsModalService
  ) {
    super(
      establishmentService,
      changeEstablishmentService,
      alertService,
      bsModalService,
      documentService,
      workflowService
    );
    this.selfEvaluationForm = this.createSelfEvaluationForm();
    this.disabledComplainceValueValues = [this.notCompliantValueEnum];
  }

  ngOnInit(): void {
    if (this.routerData?.payload) {
      const token = JSON.parse(this.routerData?.payload);
      if (token?.registrationNo) this.estRegNo = token?.registrationNo;
      if (token?.referenceNo) this.refNumber = token?.referenceNo;
    } else {
      this.location.back();
    }
    if (this.estRegNo) this.getCheckList();
    this.previousSubmissionDateForm = this.fb.group({
      english: null,
      arabic: null
    });
  }
  getEstData(estRegNo: number, refNumber: number) {
    this.safetyInspectionService.getEstablishmentSafetyData(estRegNo, refNumber).subscribe(
      res => {
        this.estData = res;
        if (res?.allSubmissions?.length > 0) this.heading = 'ESTABLISHMENT.OH-SAFETY-EVALUATION-FOLLOW-UP';
        this.setLatestDataToForm(res);
        this.setViolationDetails(res);
      },
      err => {
        this.alertService.showError(err?.error?.message, err?.error?.details);
      }
    );
  }
  setViolationDetails(safetyData: SafetyCheckData) {
    if (
      safetyData?.allSubmissions?.length > 0 &&
      safetyData?.latestSubmissions?.establishmentSafetyViolations.length > 0
    ) {
      this.setViolationType('Latest');
    } else if (safetyData?.allSubmissions?.length > 0) {
      this.setViolationType('Previous');
    }
    if (safetyData?.comments) {
      this.selfEvaluationForm.get('comments').setValue(safetyData?.comments);
    }
    if (safetyData?.allSubmissions?.length > 0) {
      this.previousSubmissionDatesList = setPreviousSubmissionDatesDropdown(safetyData?.allSubmissions);
      this.previousSubmittedData = safetyData?.allSubmissions[0];
      this.previousSubmissionDateForm.setValue(this.previousSubmissionDatesList?.items[0]?.value);
    }
  }

  setLatestDataToForm(safetyData: SafetyCheckData) {
    if (safetyData?.latestSubmissions?.establishmentSafetyViolations?.length > 0) {
      this.checkList?.establishmentSafetyChecklists?.forEach((category, catIndex) => {
        category?.subCategory?.forEach((subCategory, subIndex) => {
          subCategory?.guideLines?.forEach((guideLine, guideIndex) => {
            const index = safetyData?.latestSubmissions?.establishmentSafetyViolations.findIndex(
              violation => violation?.guidelineId === guideLine?.guidelineId
            );
            if (index >= 0 && subCategory?.valueType !== this.valueTypeSingle) {
              guideLine.selected = true;
              const form = (
                (
                  (this.selfEvaluationForm?.get('checkListForm')?.get('categoryForm') as FormArray)?.controls[
                    catIndex
                  ]?.get('subCategoryForm') as FormArray
                )?.controls[subIndex]?.get('guideLineForm') as FormArray
              )?.controls[guideIndex];
              form.get('isSelected').setValue(true);
              this.handleAddInfo(catIndex, subIndex, guideIndex, true);
              this.addToViolationList(catIndex, subIndex, guideIndex);
              if (safetyData?.latestSubmissions?.establishmentSafetyViolations[index]?.addictionInfoList?.length > 0) {
                guideLine?.additionalInfoList?.forEach((addInfo, addIndex) => {
                  const addData = safetyData?.latestSubmissions?.establishmentSafetyViolations[
                    index
                  ]?.addictionInfoList?.find(item => item?.additionalInfoId === addInfo?.addInfoId);
                  (form.get('addInfoForm') as FormArray).controls[addIndex]
                    .get('addInfoValue')
                    .setValue(addData?.additionalInfoValue);
                  this.addInfoValueOnBlur(catIndex, subIndex, guideIndex, addIndex);
                });
              }
            } else if (index >= 0 && subCategory?.valueType === this.valueTypeSingle) {
              const complainceForm = (
                this.selfEvaluationForm?.get('checkListForm')?.get('categoryForm') as FormArray
              )?.controls[catIndex]?.get('complainceStatus');
              complainceForm
                ?.get('english')
                ?.setValue(safetyData?.latestSubmissions?.establishmentSafetyViolations[index]?.guideLineName?.english);
              complainceForm
                ?.get('arabic')
                ?.setValue(safetyData?.latestSubmissions?.establishmentSafetyViolations[index]?.guideLineName?.arabic);
              this.setCompliance(
                safetyData?.latestSubmissions?.establishmentSafetyViolations[index]?.guideLineName?.english,
                catIndex
              );
              this.handleAddInfo(catIndex, subIndex, guideIndex, false);
            }
          });
        });
      });
    }
  }
  navigateToProfile() {
    const url = '/establishment-private/#' + EstablishmentConstants.EST_PROFILE_ROUTE(this.estRegNo);
    window.open(url, '_blank');
  }
  navigateBack() {
    this.location.back();
  }
  /**
   * Method to confirm cancel
   */
  cancelModal() {
    this.alertService.clearAlerts();
    this.hideModal();
    this.navigateBack();
  }
  submitSelfEvaluation(isSubmit: boolean) {
    if (this.isApiTriggered) return;
    this.alertService.clearAlerts();
    this.setDataForSubmit();
    if (isSubmit) {
      this.declarationForm.markAllAsTouched();
      this.selfEvaluationForm.markAllAsTouched();
    }
    if (isSubmit && this.checkForValidation(this.safetyCheckListResponse?.safetyChecklists)) {
      this.showModal(this.submitConfirmationTemplate);
    } else if (!isSubmit) {
      if (this.checkForSaveVaidation(this.safetyCheckListResponse?.safetyChecklists)) {
        this.callSubmitApi(false);
      } else {
        this.alertService.showMandatoryErrorMessage();
      }
    } else {
      this.highlightErrorSection();
      this.alertService.showMandatoryErrorMessage();
    }
  }
  checkForSaveVaidation(safetyChecklists: SCGuidelineResponseList[]) {
    let valid = true;
    safetyChecklists.forEach(guideline => {
      let catIndex, guideIndex, subIndex;
      if (!guideline?.isCompliance) {
        catIndex = this.checkList?.establishmentSafetyChecklists?.findIndex(
          e => guideline?.categoryId === e?.categoryCode
        );
        this.checkList?.establishmentSafetyChecklists[catIndex]?.subCategory?.forEach((subcategory, index) => {
          const i = subcategory?.guideLines.findIndex(e => e.guidelineId === guideline?.violationGuideLineCode);
          if (i >= 0) {
            guideIndex = i;
            subIndex = index;
          }
        });
        const form = (
          (
            (this.selfEvaluationForm?.get('checkListForm')?.get('categoryForm') as FormArray)?.controls[catIndex]?.get(
              'subCategoryForm'
            ) as FormArray
          )?.controls[subIndex]?.get('guideLineForm') as FormArray
        )?.controls[guideIndex];
        if (!form?.valid) {
          this.checkList.establishmentSafetyChecklists[catIndex].highLightError = true;
          valid = false;
        }
      }
    });
    return valid;
  }
  highlightErrorSection() {
    (this.selfEvaluationForm?.get('checkListForm')?.get('categoryForm') as FormArray)?.controls.forEach(
      (form, catIndex) => {
        if (!form?.valid) {
          this.checkList.establishmentSafetyChecklists[catIndex].highLightError = true;
        }
      }
    );
  }
  checkForValidation(safetyChecklists: SCGuidelineResponseList[]) {
    if (this.declarationForm?.invalid || this.selfEvaluationForm?.invalid) return false;
    let valid = true;
    safetyChecklists?.forEach(violation => {
      if (violation?.isCompliance === true && violation?.violationGuideline?.english === this.notCompliantValueEnum) {
        const violationIndex = this.safetyCheckListResponse?.safetyChecklists.findIndex(
          item => item?.categoryId === violation?.categoryId && item?.isCompliance === false
        );
        if (violationIndex < 0) {
          valid = false;
          const catIndex = this.checkList?.establishmentSafetyChecklists.findIndex(
            cat => cat.categoryCode === violation?.categoryId
          );
          this.checkList.establishmentSafetyChecklists[catIndex].highLightError = true;
        }
      }
    });
    return valid;
  }
  confirmSubmit() {
    this.callSubmitApi(true);
    this.hideModal();
  }
  callSubmitApi(isSubmit: boolean) {
    this.isApiTriggered = true;
    this.safetyInspectionService.saveSafetyCheckList(this.estRegNo, this.safetyCheckListResponse, isSubmit).subscribe(
      res => {
        this.navigateBack();
        this.alertService.showSuccess(res?.successMessage);
        this.isApiTriggered = false;
      },
      err => {
        this.alertService.showError(err?.error?.message, err?.error?.details);
        this.isApiTriggered = false;
      }
    );
  }
  setDataForSubmit() {
    this.safetyCheckListResponse.comments = this.selfEvaluationForm.get('comments').value;
    this.safetyCheckListResponse.currentOHRate = this.estData?.currentOhRate;
    this.safetyCheckListResponse.isCompliant = this.checkIfCompliant();
    this.safetyCheckListResponse.referenceNumber = this.refNumber;
    this.safetyCheckListResponse.bpmTaskId = this.routerData?.taskId;
  }
  checkIfCompliant(): boolean {
    const nonCompliantIndex = this.safetyCheckListResponse?.safetyChecklists.findIndex(
      item => item?.isCompliance === false
    );
    if (nonCompliantIndex >= 0) {
      return false;
    } else return true;
  }
  /**
   * method to create  form
   */
  createSelfEvaluationForm() {
    return this.fb.group({
      comments: null
    });
  }
  getCheckList() {
    this.safetyInspectionService.getSafetyCheckList(this.estRegNo).subscribe(
      res => {
        this.checkList = res;
        this.createCheckListForm(res);
        this.setComplainceList(res);
        this.getEstData(this.estRegNo, this.refNumber);
      },
      err => {
        this.alertService.showError(err?.error?.message, err?.error?.details);
      }
    );
  }
  setComplainceList(list: SafetyCheckListQuestionare) {
    list.establishmentSafetyChecklists.forEach(category => {
      category.selectedCount = 0;
      category.complianceList = this.createComplainceList(JSON.parse(JSON.stringify(category?.subCategory)));
    });
  }
  createComplainceList(subCategory: SCListSubCategory[]): LovList {
    const compCategory = subCategory.filter(sub => sub?.valueType === this.valueTypeSingle);
    const items: Lov[] = [];
    compCategory[0]?.guideLines?.forEach((guide, i) => {
      const lookUpValue = new Lov();
      lookUpValue.code = guide?.guidelineId;
      lookUpValue.sequence = i;
      lookUpValue.value = guide?.guideline;
      items.push(lookUpValue);
    });
    return new LovList(items);
  }
  /**
   * Method to open the owner accordion
   * @param openEvent
   * @param tabIndex
   */
  selectPanel(openEvent: boolean, tabIndex: number) {
    if (openEvent === true) {
      this.accordionPanel = tabIndex;
    }
  }
  createCheckListForm(checkList: SafetyCheckListQuestionare) {
    this.selfEvaluationForm.addControl(
      'checkListForm',
      this.fb.group({
        categoryForm: this.createCategoryForm(checkList?.establishmentSafetyChecklists)
      })
    );
  }
  createCategoryForm(establishmentSafetyChecklists: EstablishmentSafetyChecklist[]) {
    const categoryForm: FormArray = new FormArray([]);
    establishmentSafetyChecklists?.forEach(category => {
      categoryForm.push(
        this.fb.group({
          subCategoryForm: this.createSubCategoryForm(category?.subCategory),
          complainceStatus: this.fb.group({
            english: [null, { validators: Validators.required }],
            arabic: [null]
          })
        })
      );
    });
    return categoryForm;
  }

  createSubCategoryForm(subCategoryList: SCListSubCategory[]) {
    const subcategoryForm: FormArray = new FormArray([]);
    subCategoryList?.forEach(subCategory => {
      subcategoryForm.push(
        this.fb.group({
          guideLineForm: this.createGuideLineForm(subCategory)
        })
      );
    });
    return subcategoryForm;
  }
  createGuideLineForm(subCategory: SCListSubCategory) {
    const guideLineForm: FormArray = new FormArray([]);
    subCategory?.guideLines?.forEach(guideLine => {
      guideLineForm.push(
        this.fb.group({
          isSelected: [null],
          addInfoForm: this.createAddInfoForm(guideLine)
        })
      );
    });
    return guideLineForm;
  }
  createAddInfoForm(guideLine: SCGuideLines) {
    const addInfoForm: FormArray = new FormArray([]);
    if (guideLine?.additionalInfoList?.length > 0) {
      guideLine?.additionalInfoList?.forEach(() => {
        addInfoForm.push(
          this.fb.group({
            addInfoValue: [null]
          })
        );
      });
    }
    return addInfoForm;
  }
  guideLineChecked(value: string, catIndex: number, subIndex: number, guideIndex: number) {
    if (value === 'true') {
      this.handleAddInfo(catIndex, subIndex, guideIndex, true);
      // add to selected Guideline list
      this.addToViolationList(catIndex, subIndex, guideIndex);
    } else {
      this.handleAddInfo(catIndex, subIndex, guideIndex, false);
      // remove from selected Guideline list
      this.removeFromViolationList(catIndex, subIndex, guideIndex);
    }
    this.checkList.establishmentSafetyChecklists[catIndex].highLightError = false;
    this.setComplianceList(catIndex);
  }
  removeFromViolationList(catIndex: number, subIndex: number, guideIndex: number) {
    const violationIndex = this.getViolationIndex(catIndex, subIndex, guideIndex);
    this.safetyCheckListResponse?.safetyChecklists?.splice(violationIndex, 1);
    this.checkList.establishmentSafetyChecklists[catIndex].selectedCount--;
  }
  getViolationIndex(catIndex: number, subIndex: number, guideIndex: number) {
    return this.safetyCheckListResponse?.safetyChecklists?.findIndex(
      item =>
        item.violationGuideLineCode ===
        this.checkList?.establishmentSafetyChecklists[catIndex]?.subCategory[subIndex]?.guideLines[guideIndex]
          ?.guidelineId
    );
  }
  addToViolationList(catIndex: number, subIndex: number, guideIndex: number) {
    this.safetyCheckListResponse?.safetyChecklists?.push({
      categoryId: this.checkList?.establishmentSafetyChecklists[catIndex]?.categoryCode,
      violationGuideLineCode:
        this.checkList?.establishmentSafetyChecklists[catIndex]?.subCategory[subIndex]?.guideLines[guideIndex]
          ?.guidelineId,
      violationGuideline:
        this.checkList?.establishmentSafetyChecklists[catIndex]?.subCategory[subIndex]?.guideLines[guideIndex]
          ?.guideline,
      additionalInfoDtoList: this.setAddInfoValues(
        this.checkList?.establishmentSafetyChecklists[catIndex]?.subCategory[subIndex]?.guideLines[guideIndex]
          ?.additionalInfoList
      ),
      isCompliance: false
    });
    this.checkList.establishmentSafetyChecklists[catIndex].selectedCount++;
  }
  setAddInfoValues(additionalInfoList: SCAdditionalInfoList[]): SCAddInfoResponseList[] {
    const addInfoData = [];
    additionalInfoList?.forEach(item => {
      addInfoData.push({
        addInfo: item?.additionalInfo,
        addInfoId: item?.addInfoId,
        addInfoValue: null
      });
    });
    return addInfoData;
  }
  setComplianceList(catIndex: number) {
    const catId = this.checkList?.establishmentSafetyChecklists[catIndex]?.categoryCode;
    const violationIndex = this.safetyCheckListResponse?.safetyChecklists.findIndex(
      item => item?.categoryId === catId && item?.isCompliance === false
    );
    const form = (this.selfEvaluationForm?.get('checkListForm')?.get('categoryForm') as FormArray)?.controls[
      catIndex
    ]?.get('complainceStatus');
    form?.get('english').setValue(null);
    form?.get('arabic').setValue(null);
    form.updateValueAndValidity();
    form.markAsUntouched();
    if (violationIndex >= 0) {
      // todo: make as enum
      this.checkList.establishmentSafetyChecklists[catIndex].disabledComplainceValueValues = [
        this.compliantValueEnum,
        this.notApplicableValueEnum
      ];
      form?.get('english').setValue(this.notCompliantValueEnum);
      form?.get('arabic').setValue(this.notCompliantValueEnum);
      this.updateComplianceValue(form?.get('english').value, catIndex);
    } else {
      this.checkList.establishmentSafetyChecklists[catIndex].disabledComplainceValueValues = [
        this.notCompliantValueEnum
      ];
      const complianceIndex = this.safetyCheckListResponse?.safetyChecklists.findIndex(
        item =>
          item?.categoryId === this.checkList?.establishmentSafetyChecklists[catIndex]?.categoryCode &&
          item?.isCompliance === true
      );
      if (complianceIndex >= 0) {
        this.safetyCheckListResponse?.safetyChecklists.splice(complianceIndex, 1);
      }
    }
  }
  handleAddInfo(catIndex: number, subIndex: number, guideIndex: number, isMandatory: boolean) {
    if (
      this.checkList?.establishmentSafetyChecklists[catIndex]?.subCategory[subIndex]?.guideLines[guideIndex]
        ?.additionalInfoList?.length > 0
    ) {
      (
        (
          (
            (this.selfEvaluationForm?.get('checkListForm')?.get('categoryForm') as FormArray)?.controls[catIndex]?.get(
              'subCategoryForm'
            ) as FormArray
          )?.controls[subIndex]?.get('guideLineForm') as FormArray
        )?.controls[guideIndex].get('addInfoForm') as FormArray
      )?.controls.forEach((addForm, addIndex) => {
        const addInfoValidators = [];
        if (isMandatory) addInfoValidators.push(Validators.required);
        if (
          this.checkList?.establishmentSafetyChecklists[catIndex]?.subCategory[subIndex]?.guideLines[guideIndex]
            ?.additionalInfoList[addIndex]?.valueType === 'num'
        ) {
          addInfoValidators.push(Validators.pattern('[0-9.٠١٢٣٤٥٦٧٨٩+-]+$'));
          // addInfoValidators.push(lengthValidator(0, 5));
        } else {
          addInfoValidators.push(Validators.pattern('[a-zA-Z0-9.,۰۱۲۳٤٥٦٧۸۹\u0621-\u064A ]+$'));
        }
        addForm.get('addInfoValue').setValue(null);
        addForm.get('addInfoValue').setValidators(addInfoValidators);
        addForm.get('addInfoValue').updateValueAndValidity();
        addForm.get('addInfoValue').markAsUntouched();
        // make the red disappear on reselecting
      });
    }
  }
  setCompliance(value, catIndex) {
    if (value === this.compliantValueEnum || value === this.notApplicableValueEnum) {
      this.removeAddedViolation(catIndex);
      this.makeGuideLinesDisabled(catIndex, true);
    } else {
      this.makeGuideLinesDisabled(catIndex, false);
    }
    this.checkList.establishmentSafetyChecklists[catIndex].highLightError = false;
    // push the GuideLine value
    this.updateComplianceValue(value, catIndex);
  }
  makeGuideLinesDisabled(catIndex: any, makeDisable: boolean) {
    this.checkList?.establishmentSafetyChecklists[catIndex]?.subCategory?.forEach(subCategory => {
      if (subCategory?.valueType !== 'valueTypeSingle') {
        subCategory.guideLines?.forEach(guideLine => {
          guideLine.isDisabled = makeDisable;
        });
      }
    });
  }
  updateComplianceValue(value: any, catIndex: number) {
    const complianceIndex = this.safetyCheckListResponse?.safetyChecklists.findIndex(
      item =>
        item?.categoryId === this.checkList?.establishmentSafetyChecklists[catIndex]?.categoryCode &&
        item?.isCompliance === true
    );
    const complianceLov = this.checkList?.establishmentSafetyChecklists[catIndex]?.complianceList?.items?.find(
      lov => lov?.value?.english === value
    );
    if (complianceIndex >= 0) {
      this.safetyCheckListResponse.safetyChecklists[complianceIndex] = {
        additionalInfoDtoList: null,
        violationGuideline: complianceLov?.value,
        violationGuideLineCode: complianceLov?.code,
        categoryId: this.checkList?.establishmentSafetyChecklists[catIndex]?.categoryCode,
        isCompliance: true
      };
    } else {
      this.safetyCheckListResponse.safetyChecklists.push({
        additionalInfoDtoList: null,
        violationGuideline: complianceLov?.value,
        violationGuideLineCode: complianceLov?.code,
        categoryId: this.checkList?.establishmentSafetyChecklists[catIndex]?.categoryCode,
        isCompliance: true
      });
    }
  }
  removeAddedViolation(catIndex: number) {
    // remove the items from violationList with same category Id + isCompliance Value true
    this.safetyCheckListResponse.safetyChecklists = this.safetyCheckListResponse?.safetyChecklists.filter(
      item =>
        !(
          item?.categoryId == this.checkList?.establishmentSafetyChecklists[catIndex]?.categoryCode &&
          item?.isCompliance === false
        )
    );
    this.checkList.establishmentSafetyChecklists[catIndex].selectedCount = 0;
    this.checkList?.establishmentSafetyChecklists[catIndex]?.subCategory?.forEach((subcategory, subIndex) => {
      subcategory?.guideLines?.forEach((guideLine, guideIndex) => {
        (
          (
            (this.selfEvaluationForm?.get('checkListForm')?.get('categoryForm') as FormArray)?.controls[catIndex]?.get(
              'subCategoryForm'
            ) as FormArray
          )?.controls[subIndex]?.get('guideLineForm') as FormArray
        )?.controls[guideIndex]
          ?.get('isSelected')
          .setValue(false);
      });
    });
    {
    }
  }

  addInfoValueOnBlur(catIndex, subIndex, guideIndex, addInfoIndex) {
    const addInfoValue = (
      (
        (
          (this.selfEvaluationForm?.get('checkListForm')?.get('categoryForm') as FormArray)?.controls[catIndex]?.get(
            'subCategoryForm'
          ) as FormArray
        )?.controls[subIndex]?.get('guideLineForm') as FormArray
      )?.controls[guideIndex]?.get('addInfoForm') as FormArray
    )?.controls[addInfoIndex]?.get('addInfoValue').value;
    const violationIndex = this.getViolationIndex(catIndex, subIndex, guideIndex);
    this.checkList.establishmentSafetyChecklists[catIndex].highLightError = false;
    if (violationIndex >= 0) {
      const addInfoDataIndex = this.safetyCheckListResponse?.safetyChecklists[
        violationIndex
      ]?.additionalInfoDtoList?.findIndex(
        violation =>
          violation.addInfoId ===
          this.checkList?.establishmentSafetyChecklists[catIndex]?.subCategory[subIndex]?.guideLines[guideIndex]
            ?.additionalInfoList[addInfoIndex]?.addInfoId
      );
      if (addInfoDataIndex >= 0) {
        this.safetyCheckListResponse.safetyChecklists[violationIndex].additionalInfoDtoList[
          addInfoDataIndex
        ].addInfoValue = addInfoValue;
      }
    }
  }
  setViolationType(value: string) {
    this.violationSelectionForm.setValue(value);
  }
  selectPreviousSubmissionDate(dateLov: Lov) {
    this.previousSubmittedData = this.estData?.allSubmissions.find(data => data?.referenceNumber === dateLov?.code);
  }
  navigateToTransactionTracking(refNumber) {
    const url = navigateToTransactionTracking(refNumber, this.appToken);
    window.open(url, '_blank');
  }
  viewFullCheckList(refNumber) {
    const initialState = {
      safetyChecklists: JSON.parse(JSON.stringify(this.checkList?.establishmentSafetyChecklists)),
      adminSelectedList: JSON.parse(
        JSON.stringify(this.estData?.allSubmissions.find(submission => submission?.referenceNumber === refNumber))
      )
    };

    this.modalRef = this.modalService.show(ScFullChecklistDcComponent, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-xl modal-dialog-centered',
      initialState
    });
  }
}
