/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ChangeDetectorRef,
  AfterViewChecked
} from '@angular/core';
import {
  Contributor,
  LanguageToken,
  LovList,
  TransactionReferenceData,
  DocumentItem,
  AlertService
} from '@gosi-ui/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AllowanceList } from '../../../shared/models/allowance-list';
import { AllowanceSummary } from '../../../shared/models/allowance-summary';
import { AllowanceAuditSummary } from '../../../shared/models/allowance-audit-summary';
import { AuditAllowance } from '../../../shared/models/audit-allowance';
import { RejectAllowanceService } from '../../../shared/models/reject-allowance';
import { AuditorFilterParams, AllowanceFilterParams, PaginationSort, ReceiveClarification } from '../../../shared';
import { AuditAllowanceDetails } from '../../../shared/models/audit-details';

@Component({
  selector: 'oh-case-list-dc',
  templateUrl: './case-list-dc.component.html',
  styleUrls: ['./case-list-dc.component.scss']
})
export class CaseListDcComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() auditDetails: AllowanceList;
  @Input() allowanceDetails: AuditAllowance;
  @Input() previousAllowance: AuditAllowance;
  @Input() allAllowanceDetails = [];
  @Input() ohCategoryList: LovList;
  @Input() allowanceType: LovList;
  @Input() auditSummary: AllowanceAuditSummary;
  @Input() previousAuditSummary: AllowanceAuditSummary;
  @Input() contributor: Contributor;
  @Input() hideAction = false;
  @Input() documents: DocumentItem[] = [];
  @Input() rejectReasonList$: Observable<LovList> = null;
  @Input() sortList: LovList;
  @Input() currentPage = 0;
  @Input() caseId: number;
  @Input() previousAllowanceDetails: AuditAllowance;
  @Input() clarifications: ReceiveClarification[];
  @Input() comment: TransactionReferenceData[];
  @Input() canDifferentiateAllowance = true;
  @Input() checkBoxDisabled = false;

  //Output variables
  @Output() allowance: EventEmitter<AllowanceSummary> = new EventEmitter();
  @Output() navigate: EventEmitter<AllowanceSummary> = new EventEmitter();
  @Output() fetchAllAllowances: EventEmitter<Array<AuditAllowanceDetails>> = new EventEmitter();
  @Output() rejectEvent: EventEmitter<RejectAllowanceService> = new EventEmitter();
  @Output() requestEvent: EventEmitter<Array<AuditAllowanceDetails>> = new EventEmitter();
  @Output() filterValues: EventEmitter<AuditorFilterParams> = new EventEmitter();
  @Output() applyAllowance: EventEmitter<AllowanceFilterParams> = new EventEmitter();
  //@Output() pageChange: EventEmitter<number> = new EventEmitter();
  @Output() sortEvent: EventEmitter<PaginationSort> = new EventEmitter();
  @Output() loadMore: EventEmitter<object> = new EventEmitter();

  noCases = true;
  noOfInjuries: number;
  isSelected = false;
  selectedId: number;
  selectedCase: AllowanceSummary;
  lang = 'en';
  showFilter = false;
  class = 'arrow-down-reg';
  icon = 'chevron-down';
  labelValue = 'OCCUPATIONAL-HAZARD.RECOVER-OH.SHOW-ALLOWANCE';
  modalRef: BsModalRef;
  selectedAllowancelist = [];
  clarificationButton = true;
  visitList = [];
  visitLovList: LovList;
  visits: number;
  minValue: number;
  maxValue: number;
  minNewValue: number;
  maxNewValue: number;
  minDaysValue: number;
  maxDaysValue: number;
  minVisitsValue: number;
  maxVisitsValue: number;
  isFiltered: boolean;
  isNewAllowance = false;
  pageLimit = 10;
  pageTotal: number;

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly modalService: BsModalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.pageLimit = 10;
  }
  /**
   *
   * @param changes Capturing input on change
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.auditDetails) {
      this.auditDetails = changes.auditDetails?.currentValue;
      this.caseConditions();
    }
    if (changes && changes.auditSummary) {
      this.auditSummary = changes.auditSummary.currentValue;
    }
    if (changes && changes.allAllowanceDetails !== undefined && changes.allAllowanceDetails.currentValue) {
      this.allAllowanceDetails = changes.allAllowanceDetails.currentValue;
    }

    if (changes && changes.allowanceType !== undefined) {
      this.allowanceType = changes.allowanceType.currentValue;
    }
    if (changes && changes.previousAllowance && changes.previousAllowance?.currentValue) {
      this.previousAllowance = changes.previousAllowance?.currentValue;
      this.pageTotal = this.previousAllowance?.totalCount;
    }
    if (changes && changes.comment?.currentValue) {
      this.comment = changes.comment.currentValue;
    }
    if (changes && changes.clarifications?.currentValue) {
      this.clarifications = changes.clarifications.currentValue;
      this.setClarificationButton();
      this.cdr.detectChanges();
    }
    if (changes && changes.previousAllowanceDetails && changes.previousAllowanceDetails?.currentValue) {
      this.previousAllowanceDetails = changes.previousAllowanceDetails?.currentValue;
      this.pageTotal = this.previousAllowanceDetails?.totalCount;
    }
    this.cdr.detectChanges();
  }
  caseConditions() {
    this.auditDetails?.auditCases?.forEach(item => {
      if (item.newAllowances > 0) {
        this.isNewAllowance = true;
      }
    });

    if (this.auditDetails?.auditCases?.length > 0) {
      this.isSelected = false;
      this.noOfInjuries = this.auditDetails.auditCases.length;
      this.selectedId = this.auditDetails?.auditCases[0]?.caseId;
      let details;
      let allowanceIndex;
      this.auditDetails?.auditCases?.forEach((element, index) => {
        if (element.caseId === this.caseId) {
          details = this.auditDetails.auditCases[index];
          allowanceIndex = index;
        }
      });
      if (!this.caseId) {
        details = this.auditDetails?.auditCases[0];
        allowanceIndex = 0;
      }
      this.selectCase(details, allowanceIndex, true);
    }
    this.checkForCases();
  }
  rejectAllowance(event) {
    this.selectedAllowancelist = [];
    this.rejectEvent.emit(event);
    this.hideModal();
  }
  emitEvent(event) {
    this.requestEvent.emit(this.selectedAllowancelist);
  }
  showAllowance(event, icon) {
    if (icon === 'chevron-down') {
      this.labelValue = 'OCCUPATIONAL-HAZARD.RECOVER-OH.HIDE-ALLOWANCE';
      this.icon = 'chevron-up';
      this.class = 'arrow-up-reg';
    } else {
      this.labelValue = 'OCCUPATIONAL-HAZARD.RECOVER-OH.SHOW-ALLOWANCE';
      this.icon = 'chevron-down';
      this.class = 'arrow-down-reg';
    }
  }
  /**
   * check cases is there and also filter is applied or not
   */
  checkForCases() {
    if (this.auditDetails && this.auditDetails?.auditCases?.length > 0) {
      this.noCases = false;
    } else {
      this.noCases = true;
    }
    if (this.auditDetails && this.auditDetails?.auditCases?.length > 1 && !this.isFiltered) {
      this.showFilter = true;
    }
    if (this.isFiltered) {
      this.selectedId = this.auditDetails?.auditCases[0]?.caseId;
      this.auditDetails.auditCases[0].isViewed = true;
    }
  }
  /** Method to show modal. */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, {
      class: 'modal-dialog-centered modal-size-medium',
      backdrop: true,
      ignoreBackdropClick: true
    });
    this.fetchAllAllowances.emit(this.selectedAllowancelist);
  }
  hideModal() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
  getSelection(allowance) {
    this.selectedAllowancelist.push(allowance);
    this.visits = allowance.visits;
    this.visitList = [];

    if (this.lang === 'en') {
      this.visitList[0] = allowance.visits + '  ' + 'Visit';
    } else {
      this.visitList[0] = allowance.visits + '  ' + 'الزيارات';
    }
    for (let i = 1; i < allowance.visits; i++) {
      this.visits = this.visits - 1;
      if (this.lang === 'en') {
        this.visitList[i] = this.visits + '  ' + 'Visit';
      } else {
        this.visitList[i] = this.visits + '  ' + 'الزيارات';
      }
    }

    allowance.visitList = new LovList(this.visitList);
  }
  removeSelection(allowance) {
    this.selectedAllowancelist.forEach(element => {
      if (element.transactionId === allowance.transactionId) {
        const index = this.selectedAllowancelist.indexOf(element);
        this.selectedAllowancelist.splice(index, 1);
      }
    });
  }
  /**
   *
   * @param cases Selecting The Injury
   * @param index
   */
  selectCase(cases: AllowanceSummary, index: number, fetch?) {
    this.selectedAllowancelist = [];
    this.allowanceDetails = null;
    this.previousAuditSummary = null;
    this.clarifications = null;
    this.currentPage = 0;
    this.class = 'arrow-down-reg';
    this.icon = 'chevron-down';
    this.labelValue = 'OCCUPATIONAL-HAZARD.RECOVER-OH.SHOW-ALLOWANCE';
    if (cases && cases.caseId) {
      if (this.selectedId !== cases.caseId || fetch) {
        this.selectedId = cases.caseId;
        this.auditDetails?.auditCases[index]?.receiveClarification?.forEach((element, item) => {
          this.auditDetails.auditCases[index].receiveClarification[item].clarificationRead = true;
        });
        this.auditDetails.auditCases[index].workItemReadStatus = true;
        this.selectedCase = cases;
        this.allowance.emit(cases);
      }
    }
  }
  navigateTo(allowanceSummary: AllowanceSummary) {
    this.navigate.emit(allowanceSummary);
  }

  /**
   *
   * @param filterValues Emit values for filtering
   */
  applyFilter(filterValues: AuditorFilterParams) {
    this.isFiltered = true;
    this.filterValues.emit(filterValues);
  }
  /**
   * Setting minimum and maximum value for filter
   */
  ngAfterViewChecked() {
    if (this.auditDetails?.auditCases && !this.minValue) {
      this.minValue = this.auditDetails?.auditCases[0].totalAllowances;
      this.maxValue = this.auditDetails?.auditCases[0].totalAllowances;
      this.auditDetails?.auditCases?.forEach(element => {
        if (this.minValue > element.totalAllowances) {
          this.minValue = element.totalAllowances;
        }
        if (this.maxValue < element.totalAllowances) {
          this.maxValue = element.totalAllowances;
        }
      });
      if (this.minValue === this.maxValue) {
        this.minValue = 0;
      }
      this.cdr.detectChanges();
    }
    if (this.auditDetails?.auditCases && !this.minNewValue) {
      this.minNewValue = this.auditDetails.auditCases[0].newAllowances;
      this.maxNewValue = this.auditDetails?.auditCases[0].newAllowances;
      this.auditDetails?.auditCases?.forEach(element => {
        if (this.minNewValue > element.newAllowances) {
          this.minNewValue = element.newAllowances;
        }
        if (this.maxNewValue < element.newAllowances) {
          this.maxNewValue = element.newAllowances;
        }
      });
      if (this.minNewValue === this.maxNewValue) {
        this.minNewValue = 0;
      }
      this.cdr.detectChanges();
    }
    if (this.comment?.length > 0 && this.clarifications?.length > 0) {
      this.comment.forEach((element, index) => {
        this.clarifications.forEach((item, value) => {
          if (index === value) {
            this.comment[index].documents = item.documents;
          }
        });
      });
      this.cdr.detectChanges();
    }
  }
  applyAllowanceFilter(filterValues: AllowanceFilterParams) {
    this.applyAllowance.emit(filterValues);
  }

  sortAllowances(event) {
    this.sortEvent.emit(event);
    this.currentPage = 0;
  }

  /**
   *
   * @param loadmoreObj Load more event
   */
  onLoadMore(loadmoreObj) {
    this.currentPage = loadmoreObj.currentPage;
    this.loadMore.emit(loadmoreObj);
  }
  viewedComments(clarifications) {
    const value = clarifications?.filter(item => item.clarificationRead === false);
    if (value?.length > 0) {
      return false;
    } else {
      return true;
    }
  }
  setClarificationButton() {
    const value = this.clarifications?.filter(item => item.clarificationReceived === false);
    if (value?.length > 0) {
      this.clarificationButton = false;
    } else {
      this.clarificationButton = true;
    }
    this.cdr.detectChanges();
  }
}
