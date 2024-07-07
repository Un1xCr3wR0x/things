import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
  TemplateRef,
  Inject
} from '@angular/core';
import {
  ContributorCreditAllocation,
  IndividualAllocation,
  AllocationDetails,
  ContributorAllocationDetails
} from '../../../../shared/models';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { ContributorAllocationFilterRequest } from '../../../../shared/models/contributor-allocation-filter-request';

@Component({
  selector: 'blg-contributor-allocation-credit-details-dc',
  templateUrl: './contributor-allocation-credit-details-dc.component.html',
  styleUrls: ['./contributor-allocation-credit-details-dc.component.scss']
})
export class ContributorAllocationCreditDetailsDcComponent implements OnInit, OnChanges {
  //  Input Variables
  @Input() individualAllocation: ContributorCreditAllocation;
  @Input() allocationDetails: AllocationDetails;
  @Input() contributorAllocationSummary: ContributorAllocationDetails;
  @Input() exchangeRate = 1;
  @Input() currentCurrency = 'SAR';
  //  Output Variables
  @Output() selectPageNo: EventEmitter<number> = new EventEmitter();
  @Output() SearchAmount: EventEmitter<number> = new EventEmitter();
  @Output() sinNumber: EventEmitter<number> = new EventEmitter();
  @Output() allocationFiltervalues: EventEmitter<ContributorAllocationFilterRequest> = new EventEmitter();

  //  Local Variables
  itemlist: IndividualAllocation[];
  noOfRecords: number;
  paginationId = 'creditAllocation';
  itemsPerPage = 10;
  currentPage = 0;
  pageDetails = {
    currentPage: 1,
    goToPage: ''
  };
  lang = '';
  currentCurrencyLable: string;
  modalRef: BsModalRef;
  constructor(
    readonly modalService: BsModalService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.individualAllocation && changes.individualAllocation.currentValue) {
      this.individualAllocation = changes.individualAllocation.currentValue;
      this.noOfRecords = this.individualAllocation?.noOfRecords;
      this.itemlist = this.individualAllocation.individualAllocation;
      if (changes?.contributorAllocationSummary?.currentValue) {
        this.contributorAllocationSummary = changes.contributorAllocationSummary.currentValue;
      }
    }
    if (changes?.currentCurrency?.currentValue) {
      this.currentCurrencyLable = 'BILLING.' + changes.currentCurrency.currentValue;
    }
  }

  getContributorDetails() {}

  /**
   *
   * @param page method to trigger the page select event
   */
  selectPage(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.pageDetails.currentPage = this.currentPage = page;
      this.selectPageNo.emit(this.currentPage - 1);
    }
  }
  /**
   *
   * @param amount method to trigger the amount select event
   */
  onSearchAmount(amount: number) {
    this.pageDetails.currentPage = 1;
    this.pageDetails.goToPage = String(this.pageDetails.currentPage);
    this.SearchAmount.emit(amount);
  }

  /** Method to show modal. */
  showContributorDetModel(sin: number, template: TemplateRef<HTMLElement>, size: string): void {
    this.sinNumber.emit(sin);
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }

  /** Method to confirm cancellation of the form. */
  confirmCancel() {
    this.modalRef.hide();
  }

  applyFilterValues(filterParams) {
    this.pageDetails.currentPage = 1;
    this.pageDetails.goToPage = '1';
    this.allocationFiltervalues.emit(filterParams);
  }
}
