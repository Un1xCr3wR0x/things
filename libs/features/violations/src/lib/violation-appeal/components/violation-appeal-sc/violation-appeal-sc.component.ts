import {AfterViewInit, Component, Inject, OnInit, Optional, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  AlertService,
  AppealRequest,
  ApplicationTypeToken,
  AuthTokenService,
  DocumentItem,
  DocumentService,
  LanguageToken,
  LookupService,
  markFormGroupTouched,
  MenuService,
  RouterData,
  RouterDataToken,
  scrollToTop,
  TransactionService,
  UuidGeneratorService,
  WizardItem,
  WorkflowService
} from '@gosi-ui/core';
import {BehaviorSubject, forkJoin} from 'rxjs';
import {ViolationConstants, ViolationsBaseScComponent, ViolationsValidatorService} from '../../../shared';
import {BsModalService} from "ngx-bootstrap/modal";
import {Location} from "@angular/common";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ContributorDetail} from "../../../../lib/shared/models/contributor-detail";
import {ProgressWizardDcComponent} from "@gosi-ui/foundation-theme";
import {AppealContributor} from "../../../shared/models/appeal-contributor";
import {map, switchMap, tap} from "rxjs/operators";
import {AppealViolationsService} from '../../../shared/services/appeal-violations.service';
import {ConstantAppealViolation} from '../../../shared/constants/appeal-violatoin-constant';
import {AppealResourceTypeEnum} from "@gosi-ui/features/violations/lib/shared/enums/appeal-resource-type-enum";

@Component({
  selector: 'vol-violation-appeal-sc',
  templateUrl: './violation-appeal-sc.component.html',
  styleUrls: ['./violation-appeal-sc.component.scss']
})
export class ViolationAppealScComponent
  extends ViolationsBaseScComponent
  implements OnInit, AfterViewInit {


  transactionId: number;
  formsContributor: FormGroup = this.fb.group({contributors: this.fb.array([])});
  selectedContributorsIdList: number[] = [];
  wizardItems: WizardItem[] = [];
  currentTab = 0;
  uuid: string;
  private category = 'Appeal';
  private sequenceNumber = 1;
  uploadDocuments: DocumentItem[] = [];
  appealContributors: ContributorDetail[] = [];
  filterContributors: ContributorDetail[] = [];
  chosenContributor: ContributorDetail[] = [];
  @ViewChild('violationWizard', {static: false}) /** Child components */
  violationWizard: ProgressWizardDcComponent;
  showErrorMessage: string = null;
  successMessage: string = null;
  noOfRecords: number;
  currentPage = 1;
  itemsPerPage = 10;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  requiredDocument: DocumentItem[] = [];
  isSelectedAll: boolean;
  selectedContributors: boolean[] = [];
  searchContributorNinOrIqama: number = null;
  isOpenModal = false;
  fileMandatory: boolean;
  inputMandatory: boolean;
  noSelectContributor: boolean;
  @ViewChild('declaration', {static: false}) declarationModal: TemplateRef<HTMLElement>;
  @ViewChild('appeal', {static: false}) appealModal: TemplateRef<HTMLElement>;
  declareDocuments = ConstantAppealViolation.documentsTextList();
  declareText = ConstantAppealViolation.declareText();
  isDocumentsValid = [];
  isSubmit = false;
  loadingViolationDetail: boolean = false;
  violationDetail;
  transactionRefNo: number;
  editedAppeal: boolean = false;
  appealDetails: AppealContributor[];
  typeAppealOnViolationTxn: any;
  requestBefore: boolean;


  constructor(
    readonly lookupService: LookupService,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly router: Router,
    readonly workflowService: WorkflowService,
    readonly alertService: AlertService,
    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly location: Location,
    readonly activatedroute: ActivatedRoute,
    readonly validatorService: ViolationsValidatorService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    private menuService: MenuService,
    readonly fb: FormBuilder,
    readonly uuidService: UuidGeneratorService,
    readonly appealVlcService: AppealViolationsService,
    readonly authService: AuthTokenService,
    @Optional() readonly transactionService: TransactionService,
    readonly activatedRoute: ActivatedRoute
  ) {
    super(
      lookupService,
      documentService,
      alertService,
      workflowService,
      modalService,
      router,
      validatorService,
      routerData,
      activatedroute,
      appToken,
      location,
      transactionService,
      appealVlcService,
      authService
    );
  }

  /** Method to get wizard items */
  getWizards() {
    this.wizardItems = [];
    this.wizardItems.push(new WizardItem(ViolationConstants.CONTRIBUTOR_DATA, 'building'));
    this.wizardItems.push(new WizardItem(ViolationConstants.APPEAL_DETAILS, 'file-alt'));
    this.wizardItems[0].isDisabled = false;
    this.wizardItems[0].isActive = true;
  }

  ngOnInit(): void {
    super.initializeData();
    this.transactionRefNo = +this.activatedRoute.snapshot.queryParamMap.get('traceId');
    const appealTypeId = +this.activatedRoute.snapshot.queryParamMap.get('type');
    this.requestBefore = this.activatedRoute.snapshot.queryParamMap.get('appeal') === 'true';

    if (appealTypeId == AppealResourceTypeEnum.REQUEST_VIEW) {
      this.typeAppealOnViolationTxn = this.appealVlcService.types_appeal_on_violation.requestView;
    } else if (appealTypeId == AppealResourceTypeEnum.APPEAL || this.requestBefore) {
      this.typeAppealOnViolationTxn = this.appealVlcService.types_appeal_on_violation.appeal;
    } else {
      this.navigateBack();
    }

    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAlerts();
    this.uuid = this.uuidService.getUuid();
    this.language.subscribe(language => this.lang = language);
    super.initializeData();
    // super.initializeView();
    this.getWizards();
    this.initViolationDetail();
  }

  /** Method to load violation detail. */
  initViolationDetail() {
    this.loadingViolationDetail = true;
    this.initViolationDetails();
    this.initTransactionDetails();
    this.getWizards();
  }

  initTransactionDetails() {
    super.getTransactionDetails(this.transactionRefNo);
  }

  initViolationDetails() {
    super.getViolationDetails(this.violationId, this.regNo)
      .pipe(
        map(resp => {
          const arr = resp.contributors;
          const contributors = arr.map((item, index): ContributorDetail => {
            return {
              contributorId: item.contributorId,
              contributorName: item.contributorName,
              violationAmount: item.penaltyAmount,
              identifier: index,
              idNumber: item.nationalId,
              idType: item.identity[0].idType
            }
          });
          return {
            contributors: contributors,
            violationInformation: {
              violationType: resp.violationType,
              violationId: resp.violationId,
              penaltyAmount: resp.penaltyAmount
            }
          }
        })
      )
      .subscribe(resp => {
        this.violationDetail = resp.violationInformation;
        this.appealContributors = resp.contributors;
        this.noOfRecords = resp.contributors.length;
        this.filterContributors = this.filterContributors.concat(this.appealContributors);
        // if (this.showAppealButton) {
        //   this.navigateBack();
        //   this.modalRef.hide();
        // }
        this.loadingViolationDetail = false;
      });
  }

  initGetAppealonViolationInfo() {
    this.appealVlcService.getAppealOnViolationDetail(this.transactionRefNo)
      .pipe(
        map(resp => {
          const contributorArray: AppealContributor[] = [];
          resp.decisions.forEach(item =>
            contributorArray.push({
              reason: item.reason,
              documents: item.contributorDocuments,
              contributorId: item.contributorId
            })
          );
          return contributorArray;
        })
      )
      .subscribe(resp => (this.appealDetails = resp));
  }

  /** Method to navigate back to previous section. */
  navigateBack() {
    this.location.back();
  }

  /** Load Modal declaration. */
  ngAfterViewInit() {
    if (this.typeAppealOnViolationTxn?.type == AppealResourceTypeEnum.REQUEST_VIEW) {
      this.modalRef = this.modalService.show(this.declarationModal, {
        class: 'modal-md modal-dialog-centered'
      });
      this.initDocuments(this.typeAppealOnViolationTxn?.documentTransactionId, this.typeAppealOnViolationTxn?.documentType);
    } else if (this.typeAppealOnViolationTxn?.type == AppealResourceTypeEnum.APPEAL || this.requestBefore) {
      if (this.requestBefore) {
        this.modalRef = this.modalService.show(this.declarationModal, {
          class: 'modal-md modal-dialog-centered'
        });
      } else {
        this.modalRef = this.modalService.show(this.appealModal, {
          class: 'modal-md modal-dialog-centered'
        });
        this.initGetAppealonViolationInfo();
      }
      this.initDocuments(this.typeAppealOnViolationTxn?.documentTransactionId, this.typeAppealOnViolationTxn?.documentType);
    }
  }

  /** Load documents. */
  initDocuments(transactionId: string, type: string) {
    this.appealVlcService.getRequiredDocs(transactionId, type).subscribe(res => {
      this.requiredDocument = res;
      this.requiredDocument.forEach(documentItem => documentItem.businessKey = 0);
    });
  }

  /** initiate contributors form. */
  get contributors(): FormArray {
    return this.formsContributor.get("contributors") as FormArray;
  }

  /** Method to select wizard items */
  selectWizards(index) {
    this.alertService.clearAlerts();
    this.currentTab = index;
  }

  /** chosen contributor */
  chooseContributors(index) {
    const isInListIndex = this.selectedContributorsIdList.indexOf(index);
    if (isInListIndex == -1 || isInListIndex == undefined) {
      this.chosenContributor.push(this.appealContributors[index]);
      this.selectedContributorsIdList.push(index);
    } else {
      this.chosenContributor.splice(isInListIndex, 1);
      this.selectedContributorsIdList.splice(isInListIndex, 1);
    }
    this.isSelectedAll = this.chosenContributor.length == this.noOfRecords;
  }

  /** Wizard to next step */
  nextStep() {
    scrollToTop();
    this.alertService.clearAlerts();
    if (this.violationWizard) this.violationWizard.setNextItem(this.currentTab);
  }

  /** Method to navigate back to previous section. */
  previousStep() {
    scrollToTop();
    this.alertService.clearAlerts();
    this.currentTab--;
    this.violationWizard.setNextItem(this.currentTab);
    this.clearAlert();
  }

  /** Search contributor */
  search(ninOrIqama: number) {
    if (ninOrIqama == null && this.searchContributorNinOrIqama == null) {
      this.filterContributors = [];
      this.filterContributors = this.filterContributors.concat(this.appealContributors);
      this.noOfRecords = this.filterContributors.length;
      this.isSelectedAll = false;
      this.searchContributorNinOrIqama = null;
    } else {
      this.cleanArray();
      const sea = ninOrIqama || this.searchContributorNinOrIqama;
      if (sea) {
        this.appealContributors.forEach(item => {
          if (item.idNumber.toString().indexOf(sea.toString()) > -1) {
            this.filterContributors.push(item);
          }
        })
      } else {
        this.filterContributors = this.filterContributors.concat(this.appealContributors);
      }
      this.searchContributorNinOrIqama = ninOrIqama;
      this.isSelectedAll = this.chosenContributor.length == this.noOfRecords;
      this.noOfRecords = this.filterContributors.length;
      this.pageDetails = {
        currentPage: 1,
        goToPage: '1'
      };
    }
  }

  /** Validate mandatory docs */
  checkMandatoryDocs(documents) {
    return this.documentService.checkMandatoryDocuments(documents);
  }

  /** select all contributor */
  selectAllContributors(bool) {
    this.cleanArray();
    if (bool) {
      // this.chosenContributor = [...this.appealContributors];
      if (this.searchContributorNinOrIqama) {
        this.appealContributors.forEach((item, index) => {
          if (item.idNumber.toString().indexOf(this.searchContributorNinOrIqama.toString()) > -1) {
            this.filterContributors.push(item);
            this.chosenContributor.push(item);
            this.selectedContributorsIdList.push(index);
          }
        });
      } else {
        this.filterContributors = this.filterContributors.concat(this.appealContributors);
        this.filterContributors.forEach((item, index) => {
          this.chosenContributor.push(item);
          this.selectedContributorsIdList.push(index);
        });
      }
      this.isSelectedAll = true;
    } else {
      if (this.searchContributorNinOrIqama) {
        this.appealContributors.forEach(item => {
          if (item.idNumber.toString().indexOf(this.searchContributorNinOrIqama.toString()) > -1) {
            this.filterContributors.push(item);
            this.chosenContributor.push(item);
          }
        });
      } else {
        this.filterContributors = this.filterContributors.concat(this.appealContributors);
        this.chosenContributor = [];
        this.selectedContributorsIdList = [];
        this.isSelectedAll = false;
      }
    }
  }

  /** pagination select which for contributor */
  selectPage(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.pageDetails.currentPage = this.currentPage = page;
    }
  }

  /** clear array */
  clearFormArray() {
    this.isSubmit = false;
    this.formsContributor.reset();
    while (this.contributors.length !== 0) {
      this.contributors.clear();
    }
  }

  /** After finishing after chosen contributor */
  onNextStep() {
    this.clearFormArray();
    if (this.chosenContributor.length == 0) {
      this.noSelectContributor = true;
      scrollToTop();
      return;
    }
    this.noSelectContributor = false;
    this.chosenContributor.forEach((item, i) => {
      item.documents = JSON.parse(JSON.stringify(this.requiredDocument));
      this.selectedContributors.push(false);
      this.contributors.push(this.fb.group({
          contributorId: [item.contributorId, Validators.required],
          appealReason: [null, Validators.required]
        })
      );
    });
    this.currentTab = 1;
    this.nextStep();
  }

  /** collapse */
  changeViwCard(i) {
    this.selectedContributors[i] = !this.selectedContributors[i]
  }

  /** Validate form document nad form */
  checkValidity(): boolean {
    let flag = true;
    this.chosenContributor.forEach(item => {
      if (this.checkMandatoryDocs(item.documents)) {
        this.showErrorMessage = null;
        this.isDocumentsValid.push(true);
      } else {
        this.isDocumentsValid.push(false);
      }
    });

    if (!this.formsContributor.valid) {
      flag = false;
      this.alertService.showMandatoryErrorMessage();
      markFormGroupTouched(this.formsContributor as FormGroup);
    } else if (this.isDocumentsValid.includes(false)) {
      flag = false;
      this.alertService.showMandatoryDocumentsError();
    }
    return flag;
  }

  saveContributorForm() {
    const contributorAppeal: AppealContributor[] = []
    this.chosenContributor.forEach((parent, indexParent) => {
      const document: string[] = [];
      parent.documents.forEach(child => document.push(child.contentId));

      const appealReason = this.contributors.controls[indexParent].get('appealReason').value;
      contributorAppeal.push({
        contributorId: parent.contributorId,
        reason: appealReason,
        documents: document
      })
    })
    return contributorAppeal
  }

  generateAppealRequest(contributors: AppealContributor[]): AppealRequest {
    return {
      contributors: contributors,
      appealType: this.typeAppealOnViolationTxn.type,
      edited: this.editedAppeal,
      initiatorComment: null,
      objector: this.authService.getEstablishmentUID(),
      registrationNo: this.regNo.toString(),
      transactionRefNumber: this.transaction.transactionRefNo,
      transactionSource: 'Violation'
    }
  }

  /** Submitting Appeal on Violation */
  onSubmitAppeal() {
    this.isDocumentsValid = [];
    this.isSubmit = true;
    if (this.checkValidity()) {
      this.fileMandatory = false;
      this.inputMandatory = false;

      const contributorAppeal = this.saveContributorForm();
      const appealRequest = this.generateAppealRequest(contributorAppeal);
      this.appealSubmit(appealRequest);
    }
  }

  appealSubmit(appealRequest: AppealRequest) {
    this.appealVlcService.submitAppealOnViolation(appealRequest).subscribe(
      response => {
        this.navigateBack();
        this.alertService.showSuccess(response.message);
      },
      err => {
        this.alertService.showError(err.error.message);
        scrollToTop();
      }
    );
  }

  /** Clear alert */
  clearAlert() {
    this.showErrorMessage = null;
    this.fileMandatory = false;
    this.inputMandatory = false;
    this.noSelectContributor = false;
  }

  cancelModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, {class: 'modal-md modal-dialog-centered'});

  }

  onConfirmGoToPreviousPage() {
    this.modalRef.hide();
    this.navigateBack();
  }

  onHideModal() {
    this.modalRef.hide();
  }

  confirmDeclaration(approved: boolean) {
    if (approved) this.modalRef.hide();
  }

  cleanArray() {
    this.filterContributors = [];
    this.selectedContributorsIdList = [];
    this.chosenContributor = [];
  }

  getDocumentsTransaction(referenceNo: number) {
    return this.documentService
      .getOldDocumentContentId(null, null, null, referenceNo)
      .pipe(
        tap(
          (documentResponse: DocumentItem[]) => {
            if (documentResponse.length === 0) this.sequenceNumber = 1;
            else this.sequenceNumber = Math.max(...documentResponse.map(doc => doc.sequenceNumber)) + 1;
          },
          () => {
            this.sequenceNumber = 1;
          },
        ),
        switchMap(response => {
          return forkJoin(
            response.map(doc => {
              if (response) {
                return this.documentService.getDocumentContent(doc.contentId).pipe(
                  map(documentResponse => {
                    return this.documentService.setContentToDocument(doc, documentResponse);
                  })
                );
              }
            })
          );
        })
      );
  }

  doModifyAppeal(e: boolean) {
    this.editedAppeal = e;
    if (this.editedAppeal) {
      this.editMode = true;
    } else {
      this.editMode = false;
      const appealDetails = this.generateAppealRequest(this.appealDetails);
      this.appealSubmit(appealDetails);
    }
    this.modalRef.hide();
  }

  cancel() {
    this.modalRef.hide();
    this.navigateBack();
  }

  onReturnBackToPreviousPage() {
    this.modalRef.hide();
  }
}
