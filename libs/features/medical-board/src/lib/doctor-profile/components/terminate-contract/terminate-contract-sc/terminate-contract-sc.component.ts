import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { MbBaseScComponent } from '../../../../shared/components';
import {
  ApplicationTypeToken,
  LookupService,
  AlertService,
  StorageService,
  WizardItem,
  scrollToTop,
  LovList,
  DocumentService,
  DocumentItem,
  BilingualText
} from '@gosi-ui/core';
import { DoctorService, MemberService } from '../../../../shared/services';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';

import { tap, catchError } from 'rxjs/operators';
import { noop, Observable, of } from 'rxjs';

import { TabsetComponent } from 'ngx-bootstrap/tabs';
import {MBConstants, MbRouteConstants} from '../../../../shared/constants';
import {TerminateData, Contracts} from '../../../../shared/models';
import {MedicalBoardWizardTypes, MbDocumentTransactionEnum, DocumentTransactionType, DocumentTransactionId} from '../../../../shared/enums';



@Component({
  selector: 'mb-terminate-contract-sc',
  templateUrl: './terminate-contract-sc.component.html',
  styleUrls: ['./terminate-contract-sc.component.scss']
})
export class TerminateContractScComponent extends MbBaseScComponent implements OnInit {
  terminateWizardItems: WizardItem[] = [];
  activeTab = 0;
  totalTabs = 3;
  identificationNo: number;
  contractId: number;
  mbProfessionalId: number;
  modalRef: BsModalRef;
  reasonMaxLength = MBConstants.REASON_MAX_LENGTH;
  terminateDate;
  terminateReasonList: Observable<LovList>;
  hasInitialised = false;
  contract: Contracts = new Contracts();
  documentList: DocumentItem[];
  documentList$: Observable<DocumentItem[]>;
  responseMessage: BilingualText;
  terminateData: TerminateData;
  initialContract: Contracts = new Contracts();
  key = MbDocumentTransactionEnum.MTN_MED_BOARD_MEMBER_CONTRACT_TERMINATE;

  /** Child components. */
  @ViewChild('modifyTab', { static: false })
  modifyTab: TabsetComponent;
  @ViewChild('terminateContractWizard', { static: false })
  terminateContractWizard: ProgressWizardDcComponent;

  constructor(
    readonly lookUpService: LookupService,
    readonly doctorService: DoctorService,
    readonly memberService: MemberService,
    private modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly alertService: AlertService,
    readonly router: Router,
    private route: ActivatedRoute,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super(alertService, lookUpService, memberService, appToken);
  }

  ngOnInit() {
    this.alertService.clearAlerts();
    this.initializeWizard();
    this.terminateReasonList = this.lookUpService.getTerminateContractReasonList();
    this.route.paramMap
      .pipe(
        tap(params => {
          if (params && params.get('identificationNo')) this.identificationNo = +params.get('identificationNo');
          if (params && params.get('contractId')) {
            this.contractId = +params.get('contractId');
          }
        })
      )
      .subscribe(noop, err => this.showError(err));
    this.documentList$ = this.getDocumentList();
    this.getPersonDetails(this.identificationNo,this.contractId)
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
  /** Method to initialize wizard. */
  initializeWizard() {
    this.terminateWizardItems = this.getWizardItems();
    this.terminateWizardItems[0].isActive = true;
    this.terminateWizardItems[0].isDisabled = false;
    this.hasInitialised = true;
  }

  /** Method to get wizard items. */
  getWizardItems() {
    return [
      new WizardItem(MedicalBoardWizardTypes.CONTRACT_DETAILS, 'file-signature'),
      new WizardItem(MedicalBoardWizardTypes.DOCUMENTS, 'file-alt')
    ];
  }
  /**
   * Event emitted method from progress wizard to make form navigation
   * @param index
   */
  selectTerminateWizard(wizardIndex: number) {
    this.alertService.clearAlerts();
    this.activeTab = wizardIndex;
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

    if (this.terminateContractWizard) {
      this.terminateContractWizard.setNextItem(this.activeTab);
    }
    scrollToTop();
  }

  /**
   * This method is to navigate to previous tab
   */
  previousForm() {
    this.alertService.clearAlerts();
    this.activeTab--;
    if (this.terminateWizardItems && this.terminateWizardItems.length > 0) {
      if (this.terminateContractWizard) {
        this.terminateContractWizard.setPreviousItem(this.activeTab);
      }
    }
    scrollToTop();
  }

  saveDetails(terminateData: TerminateData) {
    terminateData.contractId = this.contractId;
    this.terminateData = terminateData;
    this.doctorService
      .terminateContract(terminateData)
      .pipe(
        tap(res => {
          this.responseMessage = res.message;
          this.terminateData.contractId = res.contractId;
          this.terminateData.transactionTraceId = res.transactionTraceId;
          this.nextForm();
        })
      )
      .subscribe(noop, err => {
        this.showError(err);
      });
    this.terminateData = terminateData;
  }

  popUpCancel(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }

  /** This method is used to show given template   */
  showTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }

  confirmCancel() {
    this.alertService.clearAlerts();
    this.mbProfessionalId = this.doctorService.getmbProfessionalId();
    if (this.mbProfessionalId && this.terminateData?.transactionTraceId && this.terminateData?.contractId) {
      this.doctorService
        .revertTransactionDetails(
          this.mbProfessionalId,
          this.terminateData?.contractId,
          this.terminateData?.transactionTraceId
        )
        .subscribe(() => {
          this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
        }),
        catchError(err => {
          this.alertService.showError(err?.error?.message, err?.error?.message);
          return of(null);
        });
    } else
     {
      this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
     }
    this.modalRef?.hide();
  }

  decline() {
    this.modalRef.hide();
  }
  /**
   *
   * @param err This method to show the page level error
   */
  showError(err) {
    if (err && err.error && err.error.message) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }

  showFormInvalid() {
    this.alertService.showMandatoryErrorMessage();
  }
  /**
   * Method to get document list
   */
  getDocumentList(): Observable<DocumentItem[]> {
    return this.documentService
      .getDocuments(
        DocumentTransactionId.MTN_MB_DOCTOR_TERMINATE,
        DocumentTransactionType.MEDICAL_BOARD,
        this.contractId
      )
      .pipe(tap(docs => (this.documentList = docs)));
  }

  refreshDocument(document: DocumentItem) {
    this.documentService.refreshDocument(document, this.contractId).subscribe(res => (document = res));
  }

  submitDocument(comment) {
    if (this.terminateData) this.terminateData.commentsDto.comments = comment;
    this.doctorService
      .submitTerminateContract(this.terminateData)
      .pipe(
        tap(res => {
          if (res) {
            this.doctorService.responseMessage = this.responseMessage;
            this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(this.identificationNo)]);
          }
        })
      )
      .subscribe(noop, err => {
        this.showError(err);
      });
  }
}
