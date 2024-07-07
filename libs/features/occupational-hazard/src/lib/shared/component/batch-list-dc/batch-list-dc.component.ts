/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { LanguageToken, LovList, TransactionReferenceData, DocumentItem } from '@gosi-ui/core';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ClaimSummaryDetails,
  Contributor,
  PreviousClaims,
  PaginationSort,
  ReceiveClarification
} from '../../../shared/models';
import { ClaimFilterParams } from '../../../shared/models/claim-filter-params';
import { ClaimsService } from '../../../shared/models/claims-service';
import { ClaimsSummary } from '../../../shared/models/claims-summary';
import { InvoiceDetails } from '../../../shared/models/invoice-details';
import { TreatmentService } from '../../../shared/models/treatment-service';

@Component({
  selector: 'oh-batch-list-dc',
  templateUrl: './batch-list-dc.component.html',
  styleUrls: ['./batch-list-dc.component.scss']
})
export class BatchListDcComponent implements OnInit, OnChanges, AfterViewChecked {
  /**
   * Variables
   */
  lang = 'en';
  isSelected = true;
  modalRef: BsModalRef;
  selectedId: number;
  isFiltered = false;
  currentPage = 0;
  pageLimit = 10;
  pageTotal: number;
  minValue: number;
  maxValue: number;
  selectionTreatmentlist: ClaimsService[] = [];
  unitList = [];
  unitLovList: LovList;
  noOfUnits: number;
  noCases = false;
  auditForm: FormGroup = new FormGroup({});
  daysList = [];
  isNewBatch = false;
  isViewed = false;
  showClarificationButton = true;
  @Input() checkBoxDisabled = false;
  @Input() invoiceDetails: InvoiceDetails;
  @Input() contributor: Contributor;
  @Input() referenceNo: number;
  @Input() claimSummaryDetails: ClaimSummaryDetails;
  @Output() claim: EventEmitter<ClaimsSummary> = new EventEmitter();
  @Output() navigate: EventEmitter<ClaimSummaryDetails> = new EventEmitter();
  @Output() pageChange: EventEmitter<number> = new EventEmitter();
  @Input() canDifferentiateClaims = true;

  @Output() filterValues: EventEmitter<ClaimFilterParams> = new EventEmitter();
  @Input() treatmentList: TreatmentService;
  @Input() comment: TransactionReferenceData[];
  @Input() previousClaims: PreviousClaims;
  @Output() loadMore: EventEmitter<object> = new EventEmitter();
  @Output() rejectionForm: EventEmitter<FormArray> = new EventEmitter();
  @Output() getTreatmentServiceDetails = new EventEmitter(null);
  @Input() claimNo: number;
  @Input() closeModal = false;
  @Input() hideAction = false;
  @Input() documents: DocumentItem[] = [];
  @Input() rejectReasonList$: Observable<LovList> = null;
  @Input() serviceTypeList$: Observable<LovList> = null;
  @Output() sortEvent: EventEmitter<PaginationSort> = new EventEmitter();
  @Output() requestEvent: EventEmitter<ClaimsService[]> = new EventEmitter();
  @Input() receiveClarification: ReceiveClarification[];

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly modalService: BsModalService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  /**
   *
   * @param changes Capturing input on change
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.invoiceDetails) {
      this.batchConditions();
    }
    if (changes && changes.claimSummaryDetails) {
      this.claimSummaryDetails = changes.claimSummaryDetails.currentValue;
    }
    if (changes && changes.contributor) {
      this.contributor = changes.contributor.currentValue;
    }
    if (changes && changes.comment?.currentValue) {
      this.comment = changes.comment.currentValue;
    }
    if (changes && changes.receiveClarification?.currentValue) {
      this.receiveClarification = changes.receiveClarification.currentValue;
      const value = this.receiveClarification?.filter(item => item.clarificationReceived === false);
      if (value?.length > 0) {
        this.showClarificationButton = false;
      } else {
        this.showClarificationButton = true;
      }
    }
    if (changes && changes.previousClaims) {
      this.previousClaims = changes.previousClaims.currentValue;
    }
    if (changes && changes.treatmentList?.currentValue) {
      this.treatmentList = changes.treatmentList.currentValue;
      if (this.treatmentList) {
        this.pageTotal = this.treatmentList.serviceCount;
      }
    }
    if (changes && changes.closeModal) {
      this.hideModal();
      this.selectionTreatmentlist = [];
      this.closeModal = false;
    }
  }
  fetchTreatmentDetails(filters) {
    this.getTreatmentServiceDetails.emit(filters);
  }
  /**
   *
   * @param startDate Get Date Difference
   * @param endDate
   */
  getDays() {
    this.invoiceDetails?.cases?.forEach(element => {
      element.daysDiff = null;
      const started = moment(element.startDate.gregorian);
      const ended = moment(element.endDate.gregorian);
      element.daysDiff = ended.diff(started, 'days') + 1;
      this.daysList.push(ended.diff(started, 'days') + 1);
    });
  }
  batchConditions() {
    this.getDays();
    this.checkNoCase();
    if (this.invoiceDetails && this.invoiceDetails.cases) {
      this.isSelected = false;
      this.selectedId = this.invoiceDetails?.cases[0]?.claimNo;
      let details;
      let claimIndex;
      this.invoiceDetails?.cases?.forEach((element, index) => {
        if (element.claimNo === this.claimNo) {
          details = this.invoiceDetails.cases[index];
          claimIndex = index;
        }
      });
      if (!this.claimNo) {
        details = this.invoiceDetails?.cases[0];
        claimIndex = 0;
      }
      this.selectClaim(details, claimIndex, true);
    }
  }
  emitModal(event) {
    this.requestEvent.emit(this.selectionTreatmentlist);
  }
  /**
   *
   * @param claims Select Claims
   */
  selectClaim(claims: ClaimsSummary, index: number, fetch?: boolean) {
    this.isFiltered = false;
    this.isNewBatch = true;
    if (claims && claims.claimNo) {
      if (this.selectedId !== claims.claimNo || fetch) {
        this.claimSummaryDetails = null;
        this.previousClaims = null;
        this.receiveClarification = null;
        this.contributor = null;
        this.treatmentList = null;
        this.selectedId = claims.claimNo;
        this.invoiceDetails.cases[index].isViewed = true;
        this.invoiceDetails?.cases[index]?.receiveClarification?.forEach((element, item) => {
          this.invoiceDetails.cases[index].receiveClarification[item].clarificationRead = true;
        });
        this.invoiceDetails.cases[index].workItemReadStatus = true;
        setTimeout(() => {
          this.claim.emit(claims);
        }, 500);
      }
      //  this.fetchTreatmentDetails(null);
    }
  }
  /**
   *
   * @param claimsSummary Navigation with id
   */
  navigateTo(claimsSummary: ClaimSummaryDetails) {
    this.isFiltered = false;
    this.navigate.emit(claimsSummary);
  }
  /**
   * check cases is there and also filter is applied or not
   */
  checkNoCase() {
    if (this.invoiceDetails && this.invoiceDetails.cases.length > 0) {
      this.noCases = false;
    } else {
      this.noCases = true;
    }
    if (this.isFiltered) {
      this.selectedId = this.invoiceDetails?.cases[0]?.claimNo;
      this.invoiceDetails.cases[0].isViewed = true;
    }
  }
  /** Method to show modal. */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, {
      class: 'modal-size-medium modal-dialog-centered',
      backdrop: true,
      ignoreBackdropClick: true
    });
  }

  /** This method is to hide the modal reference. */
  hideModal() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
  /** This method is to confirm rejection of treatment service. */

  confirmRejection(rejectArray) {
    this.rejectionForm.emit(rejectArray);
    this.modalRef.hide();
  }
  onPagination(selectedpageNo: number) {
    this.pageChange.emit(selectedpageNo);
  }
  /**
   *
   * @param loadmoreObj Load more event
   */
  onLoadMore(loadmoreObj) {
    this.currentPage = loadmoreObj.currentPage;
    this.loadMore.emit(loadmoreObj);
  }
  getSelection(claim) {
    if (this.isNewBatch) this.selectionTreatmentlist = [];
    if (this.selectionTreatmentlist.length < 0) {
      this.selectionTreatmentlist.push(claim);
    } else if (this.selectionTreatmentlist.indexOf(claim) === -1) {
      this.selectionTreatmentlist.push(claim);
    }
    this.noOfUnits = claim.noOfUnits;
    this.unitList = [];
    this.unitList[0] = claim.noOfUnits;
    for (let i = 1; i < claim.noOfUnits; i++) {
      this.noOfUnits = this.noOfUnits - 1;
      this.unitList[i] = this.noOfUnits;
    }
    claim.unitLovList = new LovList(this.unitList);
    this.isNewBatch = false;
  }
  /**
   *
   * @param filterValues Emit values for filtering
   */
  applyFilter(filterValues: ClaimFilterParams) {
    this.isFiltered = true;
    this.filterValues.emit(filterValues);
  }
  getSortDetails(event) {
    this.sortEvent.emit(event);
  }
  removeSelection(claim) {
    this.selectionTreatmentlist.forEach(element => {
      if (element.serviceId === claim.serviceId) {
        const index = this.selectionTreatmentlist.indexOf(element);
        this.selectionTreatmentlist.splice(index, 1);
      }
    });
  }
  /**
   * Setting minimum and maximum value for filter
   */
  ngAfterViewChecked() {
    if (this.invoiceDetails?.cases[0]?.payableAmount && !this.minValue) {
      this.minValue = this.invoiceDetails?.cases[0].payableAmount;
      this.maxValue = this.invoiceDetails?.cases[0].payableAmount;
      this.invoiceDetails?.cases?.forEach(element => {
        if (this.minValue > element.payableAmount) {
          this.minValue = element.payableAmount;
        }
        if (this.maxValue < element.payableAmount) {
          this.maxValue = element.payableAmount;
        }
      });
      if (this.minValue === this.maxValue) {
        this.minValue = 0;
      }
      this.cdr.detectChanges();
    }
    if (this.comment?.length > 0 && this.receiveClarification?.length > 0) {
      this.comment.forEach((element, index) => {
        this.receiveClarification.forEach((item, value) => {
          if (index === value) {
            this.comment[index].documents = item.documents;
          }
        });
      });
      this.cdr.detectChanges();
    }
  }
  viewedComments(receiveClarification) {
    const value = receiveClarification?.filter(item => item.clarificationRead === false);
    if (value?.length > 0) {
      return false;
    } else {
      return true;
    }
  }
}
