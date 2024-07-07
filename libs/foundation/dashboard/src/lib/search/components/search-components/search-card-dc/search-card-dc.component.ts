/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
  Inject,
  ViewChild,
  OnChanges
} from '@angular/core';
import { RequestLimit } from '../../../../shared';
import { LanguageToken, Transaction, Establishment, Person } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme';
import { getIdentificationNumber } from '../../../utils';

@Component({
  selector: 'dsb-search-card-dc',
  templateUrl: './search-card-dc.component.html',
  styleUrls: ['./search-card-dc.component.scss']
})
export class SearchCardDcComponent implements OnInit, OnChanges {
  /**
   * Local variables
   */
  selectedLang = 'en';
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  itemsPerPage = 10;
  estPagination = 'estAdminPagination';
  /**
   * Input variables
   */
  @Input() isEstablishment = false;
  @Input() isTransaction = false;
  @Input() isIndividual = false;
  @Input() isWorkflow = false;
  @Input() isPrivate = true;
  @Input() establishmentEntry: Establishment[];
  @Input() transactionDetails: Transaction[];
  @Input() individualEntry: Person[];
  @Input() transactionEntry: Transaction[];
  @Input() totalSize: number;
  @Input() limitItem: RequestLimit = new RequestLimit();
  /**
   * Output variables
   */
  @Output() limit: EventEmitter<RequestLimit> = new EventEmitter();
  @Output() navigate: EventEmitter<number | Person> = new EventEmitter();
  @ViewChild('paginationComponent') paginationDcComponent: PaginationDcComponent;
  /**
   *
   * @param language
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  /**
   * Initialisation Method
   */
  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.selectedLang = lang;
    });
  }
  /**
   * Method is to detect changes input property
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.establishmentEntry && changes.establishmentEntry.currentValue)
      this.establishmentEntry = changes.establishmentEntry.currentValue;
    if (changes && changes.transactionEntry && changes.transactionEntry.currentValue)
      this.transactionEntry = changes.transactionEntry.currentValue;
    if (changes && changes.individualEntry && changes.individualEntry.currentValue)
      this.individualEntry = changes.individualEntry.currentValue;
    if (changes && changes.limitItem && changes.limitItem.currentValue) {
      this.limitItem = changes.limitItem.currentValue;
      this.pageDetails.currentPage = this.pageDetails.goToPage = this.limitItem.pageNo + 1;
    }
    if (changes && changes.totalSize) {
      this.totalSize = changes.totalSize.currentValue;
    }
  }
  /**
   * Method to navigate for each entry
   * @param value
   */
  navigateTo(value: number | Person) {
    this.navigate.emit(value);
  }
  /**
   * Method  to select each page
   * @param pageNo
   */
  selectPage(pageNo: number) {
    if (pageNo - 1 !== this.limitItem.pageNo) {
      this.pageDetails.currentPage = pageNo;
      this.limitItem.pageNo = pageNo - 1;
      this.onLimit();
    }
  }

  /**
   * Method  to emit the selected page
   */
  private onLimit() {
    this.limit.emit(this.limitItem);
  }
  /**
   * Method  to reset pagination details
   */
  resetPagination() {
    this.pageDetails.currentPage = 1;
    this.limitItem.pageNo = 0;
    if (this.paginationDcComponent) this.paginationDcComponent.resetPage();
  }
  getIdentificationNumberDetails(identity) {
    return getIdentificationNumber(identity);
  }
}
