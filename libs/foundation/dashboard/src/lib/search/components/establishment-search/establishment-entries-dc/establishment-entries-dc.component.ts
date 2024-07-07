/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnChanges,
  SimpleChanges,
  Inject
} from '@angular/core';
import { RequestLimit } from '../../../../shared';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme';
import { Establishment, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'dsb-establishment-entries-dc',
  templateUrl: './establishment-entries-dc.component.html',
  styleUrls: ['./establishment-entries-dc.component.scss']
})
export class EstablishmentEntriesDcComponent implements OnInit, OnChanges {
  /**
   * local variables
   */
  selectedLang = 'en';
  estPagination = 'estPagination';
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  itemsPerPage = 10;
  @ViewChild('paginationComponent') paginationDcComponent: PaginationDcComponent;
  /**
   * input variables
   */
  @Input() establishmentEntry: Establishment[];
  @Input() isRecent = false;
  @Input() establishmentSearchCount: number;
  @Input() limitItem: RequestLimit = new RequestLimit();
  @Input() isPrivate = true;
  /**
   * output variables
   */
  @Output() limit: EventEmitter<RequestLimit> = new EventEmitter();
  @Output() navigate: EventEmitter<number> = new EventEmitter();

  /**
   *
   * @param language
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.selectedLang = lang;
    });
  }
  /**
   * method for pagination
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
   * method to handle changes in the input variables
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.establishmentEntry && changes.establishmentEntry.currentValue)
      this.establishmentEntry = changes.establishmentEntry.currentValue;

    if (changes && changes.establishmentSearchCount && changes.establishmentSearchCount.currentValue)
      this.establishmentSearchCount = changes.establishmentSearchCount.currentValue;
    if (changes && changes.limitItem && changes.limitItem.currentValue) {
      this.limitItem = changes.limitItem.currentValue;
      this.pageDetails.currentPage = this.limitItem.pageNo + 1;
    }
  }
  /**
   * method to emit page number and page size
   */
  private onLimit() {
    this.limit.emit(this.limitItem);
  }
  /**
   * method to emit est registration number
   * @param registrationNo
   */
  navigateToEstablishment(registrationNo: number) {
    this.navigate.emit(registrationNo);
  }
  /**
   * method to reset pagination
   */
  resetPagination() {
    this.pageDetails.currentPage = 1;
    this.limitItem.pageNo = 0;
    if (this.paginationDcComponent) this.paginationDcComponent.resetPage();
  }
}
