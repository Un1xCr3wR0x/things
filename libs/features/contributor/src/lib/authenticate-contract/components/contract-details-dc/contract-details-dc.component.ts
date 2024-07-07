/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { ContractWrapper, EngagementDetails } from '../../../shared/models';

@Component({
  selector: 'cnt-contract-details-dc',
  templateUrl: './contract-details-dc.component.html',
  styleUrls: ['./contract-details-dc.component.scss']
})
export class ContractDetailsDcComponent implements OnInit, OnChanges {
  /** Local variables. */
  noOfRecords: number;
  paginationId = 'contractList';
  itemsPerPage = 4;
  currentPage = 0;
  pageDetails = {
    currentPage: 1,
    goToPage: ''
  };
  selectedLang: string;

  /** Input variables. */
  @Input() contractDetails: ContractWrapper;
  @Input() individualApp: boolean;
  @Input() engagementDetails: EngagementDetails;

  /** Output variables */
  @Output() selectPageNo: EventEmitter<number> = new EventEmitter();
  @Output() onContractDetailsClicked: EventEmitter<object> = new EventEmitter();
  @Output() navigateToContributionPage: EventEmitter<null> = new EventEmitter();

  /** Creates an instance of  ContractDetailsDcComponent. */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  /** Methods to initialize the component. */
  ngOnInit(): void {
    this.language.subscribe(language => (this.selectedLang = language));
  }

  /**
   * Method to handle changes in input variables.
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.contractDetails && changes.contractDetails.currentValue) {
      this.contractDetails = changes.contractDetails.currentValue;
      this.noOfRecords = this.contractDetails.count;
    }
  }

  /** Method to trigger the page select event. */
  selectPage(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.pageDetails.currentPage = this.currentPage = page;
      this.selectPageNo.emit(this.currentPage - 1);
    }
  }

  /** Method to navigate to preview */
  navigateToPreview(contract) {
    this.onContractDetailsClicked.emit(contract);
  }

  navigateToContribution() {
    this.navigateToContributionPage.emit();
  }
}
