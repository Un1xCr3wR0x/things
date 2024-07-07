import { Component, OnInit, TemplateRef, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  LovList,
  Lov,
  BilingualText,
  AlertService,
  LanguageToken,
  RouterDataToken,
  RouterData,
  DocumentService,
  DocumentItem,
  UuidGeneratorService,
  BPMUpdateRequest,
  WorkFlowActions,
  WorkflowService,
  TransactionReferenceData
} from '@gosi-ui/core';
import { BehaviorSubject, throwError, noop, of } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EventDateService, BillingRoutingService } from '../../../shared/services';
import { EventDate } from '../../../shared/models/event-date';
import { BillingConstants } from '../../../shared/constants';
import { tap, catchError, map } from 'rxjs/operators';

@Component({
  selector: 'blg-event-date-sc',
  templateUrl: './event-date-sc.component.html',
  styleUrls: ['./event-date-sc.component.scss']
})
export class EventDateScComponent implements OnInit {
  currentDate: Date;
  currentYear: number;
  previousYear: number;
  nextYear: number;
  items: Lov[];
  yearListLov: LovList;
  selectedyearList = [];
  yearList = [];
  verifyDueDateParentForm: FormGroup;
  selectedValues: BilingualText[];
  contributionListTemp;
  contributionList;
  modalRef: BsModalRef;
  submitValue;
  dateRange;
  transformedEventInfo;
  lang: string;
  pendingEventInfo;
  modifyFlag = false;
  eventBpmData;
  documents: DocumentItem[] = [];
  uuid: string;
  idNumber = 0;
  isValid = false;
  comments: TransactionReferenceData[] = [];
  /** Constants */
  documentTransactionId = BillingConstants.MAINTAIN_EVENTDATE_TRANSACTION_ID;
  @ViewChild('confirmTemplate', { static: true })
  confirmTemplate: TemplateRef<HTMLElement>;

  constructor(
    private fb: FormBuilder,
    readonly eventService: EventDateService,
    readonly modalService: BsModalService,
    readonly billingRoutingService: BillingRoutingService,
    readonly route: ActivatedRoute,
    private alertService: AlertService,
    readonly router: Router,
    readonly documentService: DocumentService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    private uuidGeneratorService: UuidGeneratorService,
    readonly workflowService: WorkflowService
  ) {}

  ngOnInit(): void {
    this.getYearList();
    this.verifyDueDateParentForm = this.fb.group({
      selectedYear: this.fb.group({
        english: ['', { validators: Validators.required }],
        arabic: ['', { validators: Validators.required }]
      })
    });
    this.selectedValues = [
      { english: new Date().getFullYear().toString(), arabic: new Date().getFullYear().toString() }
    ];
    this.getLang();
    this.getData();
    this.getRequiredDocument();
    this.getRouteParam();
    if (this.routerDataToken.taskId) {
      this.buildBpmReq(this.routerDataToken);
      if (this.routerDataToken.userComment) {
        if (this.routerDataToken.comments.length > 0) {
          this.comments = this.routerDataToken.comments;
        }
      }
    }
  }

  getRouteParam() {
    this.route.queryParams.subscribe(params => {
      if (params['from'] === 'inbox') {
        this.modifyFlag = true;
        this.eventService.getEventDetailsByApprovalStatus('PENDING_APPROVAL').subscribe((data: EventDate) => {
          this.pendingEventInfo = this.transformData(data['eventDateInfo']);
        });
      } else {
        this.modifyFlag = false;
        this.uuid = this.uuidGeneratorService.getUuid();
        this.pendingEventInfo = [];
      }
    });
  }

  buildBpmReq(routerValue) {
    this.eventBpmData = {
      taskId: routerValue['taskId'],
      user: routerValue['assigneeId'],
      referenceNo: JSON.parse(routerValue['payload'])['referenceNo']
    };
  }

  getLang() {
    this.language.subscribe((lan: string) => {
      this.lang = lan;
    });
  }

  getData() {
    this.getEventDate();
    this.eventService
      .getEventDetailsByDate(this.dateRange['fromDate'], 0, this.dateRange['toDate'], 0)
      .subscribe(data => {
        this.contributionListTemp = data;
        this.contributionList = this.transformData(this.contributionListTemp['eventDateInfo']);
      });
  }

  unique(array) {
    return array.map(item => item['year']).filter((value, index, self) => self.indexOf(value) === index);
  }

  transformData(eventDateInfoList) {
    return this.unique(eventDateInfoList).map(res => {
      return {
        year: res,
        eventDateInfo: eventDateInfoList
          .filter(datas => datas['year'] === res)
          .map(newdata => {
            return {
              month: {
                arabic: newdata['month']['arabic'],
                english: newdata['month']['english']
              },
              year: newdata['year'],
              eventDate: {
                gregorian: new Date(newdata['eventDate']['gregorian']),
                hijiri: newdata['eventDate']['hijiri']
              }
            };
          })
      };
    });
  }

  getEventDate() {
    this.dateRange = {
      fromDate: new Date().getFullYear() - 1,
      toDate: new Date().getFullYear() + 1
    };
  }
  // for year dropdown populating
  getYearList() {
    this.currentDate = new Date();
    this.currentYear = this.currentDate.getFullYear();
    this.previousYear = this.currentDate.getFullYear() - 1;
    this.nextYear = this.currentDate.getFullYear() + 1;
    this.yearList = [this.previousYear, this.currentYear, this.nextYear];

    if (this.yearList.length > 0) {
      this.items = this.yearList.map((document, i) => {
        const lov = new Lov();
        lov.value.english = document.toString();
        lov.value.arabic = document.toString();
        lov.sequence = i;
        return lov;
      });
      this.yearListLov = new LovList(this.items);
    }
  }
  //get the selected years list
  onYearSelection(yearList) {
    this.selectedyearList = yearList;
    yearList
      .map(res => res['english'])
      .forEach(year => {
        if (this.selectedValues?.map(val => val['english'])?.indexOf(year) < 0) {
          this.selectedValues.push({ english: year, arabic: year });
        }
      });
  }

  submitEventDate(value) {
    if (this.checkMandatoryDocuments()) {
      this.isValid = true;
      this.submitValue = value;
      this.transformedEventInfo = this.transformData(this.submitValue['eventDateInfo']);
      this.showTemplate(this.confirmTemplate);
    } else {
      this.isValid = false;
      this.alertService.showMandatoryErrorMessage();
    }
  }
  /** Method to check whether mandatory documents are scanned/uploaded or not. */
  checkMandatoryDocuments() {
    return this.documentService.checkMandatoryDocuments(this.documents);
  }
  confirmCancel() {
    this.hideModal();
  }

  confirmSubmit() {
    if (!this.modifyFlag) {
      this.eventService.submitEventDetails(this.submitValue).subscribe(
        data => {
          this.hideModal();
          this.alertService.showSuccess(data['transactionMessage'], null, 10);
          this.billingRoutingService.navigateToInbox();
        },
        err => {
          this.hideModal();
          this.alertService.showError(err['error']['message']);
        }
      );
    } else {
      if (this.eventBpmData) this.submitValue['workflow']['referenceNo'] = this.eventBpmData['referenceNo'];
      this.eventService.modifyEventDetails(this.submitValue).subscribe(
        data => {
          this.hideModal();
          this.updateBpm(this.submitValue, data['transactionMessage']);
          this.billingRoutingService.navigateToInbox();
        },
        err => {
          this.hideModal();
          this.alertService.showError(err['error']['message']);
        }
      );
    }
  }

  updateBpm(submitValue, message) {
    const bpmUpdateRequest = new BPMUpdateRequest();
    bpmUpdateRequest.outcome = WorkFlowActions.UPDATE;
    bpmUpdateRequest.taskId = this.routerDataToken.taskId;
    bpmUpdateRequest.user = this.routerDataToken.assigneeId;
    bpmUpdateRequest.commentScope = 'BPM';
    if (submitValue && submitValue.workflow) bpmUpdateRequest.comments = submitValue.workflow.comments;
    this.workflowService.updateTaskWorkflow(bpmUpdateRequest, WorkFlowActions.UPDATE).subscribe(
      () => {
        this.alertService.showSuccess(message, null, 10);
        this.hideModal();
      },
      err => {
        this.alertService.showError(err.error.message);
        this.hideModal();
      }
    );
  }

  /**
   * This method is used to show given template
   * @param template
   * @memberof EmploymentDetailsDcComponent
   */
  showTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }

  /**
   * This method is to hide the modal reference.
   * @param modalRef
   */

  hideModal() {
    this.modalRef.hide();
  }

  cancelNavigation() {
    if (this.modifyFlag) {
      this.billingRoutingService.navigateToInbox();
    } else {
      this.router.navigate(['/home']);
    }
  }
  /** Method to get required documents */
  getRequiredDocument() {
    this.documentService
      .getRequiredDocuments(BillingConstants.MAINTAIN_EVENT_DATE, BillingConstants.MAINTAIN_EVENT_DATE)
      .pipe(
        map(docs => this.documentService.removeDuplicateDocs(docs)),
        catchError(error => of(error))
      )
      .subscribe(res => {
        this.documents = res;
        if (this.modifyFlag) this.documents.forEach(doc => this.refreshDocuments(doc, false));
      });
  }

  /** Method to refresh documents after scan. */
  refreshDocuments(doc: DocumentItem, newUpload: boolean): void {
    if (doc && doc.name) {
      this.documentService
        .refreshDocument(
          doc,
          this.idNumber,
          BillingConstants.MAINTAIN_EVENT_DATE,
          BillingConstants.MAINTAIN_EVENT_DATE,
          this.modifyFlag && !newUpload ? this.routerDataToken.transactionId : null,
          null,
          this.uuid
        )
        .pipe(
          tap(res => {
            doc = res;
          }),
          catchError(err => {
            this.showError(err);
            return throwError(err);
          })
        )
        .subscribe(noop, noop);
    }
  }

  /** Method to show error alert. */
  showError(error): void {
    this.alertService.showError(error.error.message, error.error.details);
  }
}
