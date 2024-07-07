import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  WizardItem,
  AlertService,
  LovList,
  LookupService,
  BaseComponent,
  scrollToTop,
  DocumentService,
  DocumentItem,
  BilingualText,
  WorkflowService,
  ApplicationTypeToken,
  RouterDataToken,
  RouterData,
  RouterConstants,
  RouterConstantsBase,
  DocumentSubmitItem
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { Observable, noop, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import {MedicalBoardWizardTypes, MbDocumentTransactionEnum , DocumentTransactionType, DocumentTransactionId} from '../../../../shared/enums';
import {MemberData, MbProfile, Contracts } from '../../../../shared/models';
import {MedicalBoardService , DoctorService} from '../../../../shared/services';
import {MbRouteConstants } from '../../../../shared/constants';


@Component({
  selector: 'mb-modify-contract-sc',
  templateUrl: './modify-contract-sc.component.html',
  styleUrls: ['./modify-contract-sc.component.scss']
})
export class ModifyContractScComponent extends BaseComponent implements OnInit {
  modifywizardItems: WizardItem[] = [];
  data: MemberData = new MemberData();
  contractForm: FormGroup = new FormGroup({});
  modalRef: BsModalRef;
  identificationNo: number;
  activeTab = 0;
  totalTabs = 3;
  comments: string;
  fees: number;
  hasInitialised = false;
  ContractType = false;
  person: MbProfile;
  previousUrl: string;
  medicalProfessionalId: number;
  contractId: number;
  identifier: number;
  transactionRefNo: number;
  mbProfessionalId: number;
  contractedDoctor: boolean;
  visitingDoctor: boolean;
  nurse: boolean;
  showFees: boolean;
  contract: Contracts = new Contracts();
  initialContract: Contracts = new Contracts();
  documentList: DocumentItem[];
  documentList$: Observable<DocumentItem[]>;
  key = MbDocumentTransactionEnum.MTN_MED_BOARD_DOCTOR;
  /** Child components. */
  @ViewChild('modifyTab', { static: false })
  modifyTab: TabsetComponent;
  @ViewChild('modifycontractWizard', { static: false })
  modifycontractWizard: ProgressWizardDcComponent;

  /** Observables */
  medicalBoardType$: Observable<LovList>;
  feesPerVisit$: Observable<LovList>;
  responseMessage: BilingualText;
  isEditMode = false;
  member: MemberData = new MemberData();

  constructor(
    readonly alertService: AlertService,
    private modalService: BsModalService,
    readonly lookUpService: LookupService,
    readonly router: Router,
    readonly documentService: DocumentService,
    readonly doctorService: DoctorService,
    readonly route: ActivatedRoute,
    readonly mbService: MedicalBoardService,
    readonly workflowService: WorkflowService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
  ) {
    super();
    this.contractedDoctor = true;
    this.visitingDoctor = true;
    this.nurse = true;
  }

  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.initializeWizard();
    this.medicalBoardType$ = this.lookUpService.getMedicalBoardTypeList();
    this.feesPerVisit$ = this.lookUpService.getFeespervisitList();
    this.isEditMode = this.router.url.indexOf('/edit') > 0 ? true : false;
    this.route.paramMap
      .pipe(
        tap(params => {
          if (params && params.get('identificationNo')) this.identificationNo = +params.get('identificationNo');
          if (params && params.get('contractId')) {
            this.contractId = +params.get('contractId');
          }
        })
      )
      .subscribe(noop, err => this.showErrorMessage(err));
    this.contractedDoctor = false;
    this.visitingDoctor = false;
    this.nurse = false;
    this.showFees = false;
    this.getPersonDetails(this.identificationNo, this.contractId);
    this.documentList$ = this.getDocumentList();
  }

  getPersonDetails(identificationNo, contractId) {
    this.doctorService
      .getContractDetails(identificationNo, contractId)
      .pipe(
        tap(res => {
          this.contract = res;
          this.initialContract = JSON.parse(JSON.stringify(this.contract));
        })
      )
      .subscribe(noop, err => this.showErrorMessage(err));
  }

  showErrorMessage(err) {
    if (err && err.error) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
  getFees(data: MemberData) {
    this.doctorService.getFees(data).subscribe(res => {
      this.fees = res;
    });
  }

  /**
   * Event emitted method from progress wizard to make form navigation
   * @param index
   */
  selectModifyWizard(wizardIndex: number) {
    this.alertService.clearAlerts();
    this.activeTab = wizardIndex;
  }
  /** Method to initialize wizard. */
  initializeWizard() {
    this.modifywizardItems = this.getWizardItems();
    this.modifywizardItems[0].isActive = true;
    this.modifywizardItems[0].isDisabled = false;
    this.hasInitialised = true;
  }

  /** Method to get wizard items. */
  getWizardItems() {
    return [
      new WizardItem(MedicalBoardWizardTypes.CONTRACT_DETAILS, 'file-signature'),
      new WizardItem(MedicalBoardWizardTypes.DOCUMENTS, 'file-alt')
    ];
  }
  mapValue(res) {
    this.data = res;
    if (this.data.contractType) {
      this.ContractType = true;
      this.modifywizardItems[0].isActive = true;
      this.modifywizardItems[0].isDisabled = false;
      this.hasInitialised = true;
    }
  }

  /**
   * Display Next Form
   */
  nextForm() {
    this.alertService.clearAlerts();
    this.activeTab++;
    if (this.activeTab < this.totalTabs) {
      this.modifyTab.tabs[this.activeTab].active = true;
    }
    if (this.modifycontractWizard) {
      this.modifycontractWizard.setNextItem(this.activeTab);
    }
    scrollToTop();
  }
  /**
   * This method is to navigate to previous tab
   */
  previousForm() {
    this.alertService.clearAlerts();
    this.activeTab--;
    scrollToTop();
    if (this.modifywizardItems && this.modifywizardItems.length > 0) {
      if (this.modifycontractWizard) {
        this.modifycontractWizard.setPreviousItem(this.activeTab);
      }
    }
  }
  saveContractDetail(contract) {
    this.contract = contract;
    contract.transactionTraceId = null;
    this.doctorService
      .modifyDoctorDetail(contract)
      .pipe(
        tap(res => {
          this.contract.contractId = res.contractId;
          this.contract.transactionTraceId = res.transactionTraceId;
          this.responseMessage = res.message;
          this.nextForm();
        })
      )
      .subscribe(noop, err => {
        this.showErrorMessage(err);
      });
  }
  popUpCancel(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template);
  }
  /** This method is used to show given template   */
  showTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }
  /**
   * This method is to confirm cancelation the form
   */
  confirmCancel() {
    this.alertService.clearAlerts();
    this.mbProfessionalId = this.doctorService.getmbProfessionalId();
    if (!this.isEditMode) {
      if (this.mbProfessionalId && this.contract?.transactionTraceId && this.contract?.contractId) {
        this.doctorService
          .revertTransactionDetails(this.mbProfessionalId, this.contract.contractId, this.contract.transactionTraceId)
          .subscribe(res => {
            this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
          }),
          catchError(err => {
            this.alertService.showError(err?.error?.message, err?.error?.message);
            return of(null);
          });
      } else {
        this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
      }
    } else {
      if (
        this.routerDataToken.state &&
        (this.routerDataToken.state === 'REASSIGNED' ||
          this.routerDataToken.state === 'ASSIGNED' ||
          this.routerDataToken.state === 'RETURN')
      ) {
        this.router.navigate([RouterConstants.ROUTE_INBOX]);
      } else {
        this.router.navigate([RouterConstantsBase.ROUTE_TRANSACTION_HISTORY]);
      }
    }
    this.modalRef.hide();
  }

  showFormInvalid() {
    this.alertService.showMandatoryErrorMessage();
  }
  /**
   * This method is to decline cancelation the form   *
   */
  decline() {
    this.modalRef.hide();
  }

  refreshDocument(document: DocumentItem) {
    this.documentService.refreshDocument(document, this.contractId).subscribe(res => (document = res));
  }
  /**
   * Method to get document list
   */
  getDocumentList(): Observable<DocumentItem[]> {
    return this.documentService
      .getDocuments(DocumentTransactionId.MTN_MB_DOCTOR, DocumentTransactionType.MEDICAL_BOARD, this.contractId)
      .pipe(tap(docs => (this.documentList = docs)));
  }
  submitDocument(comments) {
    if (this.contract.commentsDto) this.contract.commentsDto.comments = comments;
    const submitDocumentList: DocumentSubmitItem[] = [];
    let isDocumentsValid = true;
    if (this.documentList?.length > 0) {
      for (const documentItem of this.documentList) {
        const submitItem: DocumentSubmitItem = new DocumentSubmitItem();
        if (
          documentItem.required &&
          (documentItem.documentContent === null || documentItem.documentContent === 'NULL')
        ) {
          documentItem.uploadFailed = true;
          isDocumentsValid = false;
        } else {
          documentItem.uploadFailed = false;
        }

        if (documentItem.documentContent && isDocumentsValid) {
          submitItem.contentId = documentItem.contentId;
          submitItem.type = documentItem.name;
          submitDocumentList.push(submitItem);
        }
      }
    }
    if (isDocumentsValid) {
      this.doctorService
        .submitModifyContractDetail(this.contract)
        .pipe(
          tap(res => {
            if (res) {
              this.doctorService.responseMessage = this.responseMessage;
              this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
            }
          })
        )
        .subscribe(noop, err => {
          this.showErrorMessage(err);
        });
      } 
      else {
        this.alertService.showMandatoryDocumentsError();
      }
    }
  }