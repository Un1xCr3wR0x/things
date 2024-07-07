/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BilingualText, LanguageToken, RoleIdEnum } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { FilterStatusConstants } from '../../../shared/constants';
import { ViolationStatusEnum, ViolationTypeEnum, DocumentTransactionId } from '../../../shared/enums';
import { ViolationTransaction } from '../../../shared/models';

@Component({
  selector: 'vol-violation-details-dc',
  templateUrl: './violation-details-dc.component.html',
  styleUrls: ['./violation-details-dc.component.scss']
})
export class ViolationDetailsDcComponent implements OnInit, OnChanges {
  /**
   *
   * @param language
   */
  constructor(@Inject(LanguageToken) private language: BehaviorSubject<string>) {}
  lang = 'en';
  violatingProvision = ViolationTypeEnum.RAISE_VIOLATING_PROVISIONS;
  //Input variables
  @Input() isModifified = false;
  @Input() isAppPrivate: boolean;
  @Input() isSimisFlag: boolean;
  @Input() transactionDetails: ViolationTransaction;
  @Input() accessRoles: RoleIdEnum[] = [];
  @Input() isKashefInspection: boolean = false;
  @Output() goToTransaction = new EventEmitter<{ tnxId: string; tnxReference: number }>();

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.transactionDetails) {
      this.transactionDetails = changes.transactionDetails.currentValue;
    }
  }
  getStatus(status) {
    let item: BilingualText;
    switch (status) {
      case ViolationStatusEnum.APPROVED:
        item = FilterStatusConstants.STATUS_APPROVED;
        break;
      case ViolationStatusEnum.VIOLATION_CANCEL:
        item = FilterStatusConstants.STATUS_CANCELLED;
        break;
      case ViolationStatusEnum.VIOLATION_MODIFY:
        item = FilterStatusConstants.STATUS_MODIFIED;
        break;
      case ViolationStatusEnum.AUTO_APPROVED:
        item = FilterStatusConstants.STATUS_APPROVED;
        break;
    }
    return item;
  }
  getCancelledStatus() {
    return FilterStatusConstants.STATUS_CANCELLED;
  }
  goToTransactionProfile(isCancelled: boolean, modificationTransactionId: number) {
    this.goToTransaction.emit({
      tnxId: isCancelled ? DocumentTransactionId.CANCEL_VIOLATION_ID : DocumentTransactionId.MODIFY_VIOLATION_ID,
      tnxReference: modificationTransactionId
    });
  }
  goToTransactionPage(tnxRefNo: string) {
    this.goToTransaction.emit({
      tnxId: DocumentTransactionId.REGISTER_CONTRIBUTOR_VIOLATION_ID,
      tnxReference: Number(tnxRefNo)
    });
  }
}
