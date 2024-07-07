/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LanguageToken, BilingualText } from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { Claims } from '../../models/claims-wrapper';

@Component({
  selector: 'oh-amount-details-dc',
  templateUrl: './amount-details-dc.component.html',
  styleUrls: ['./amount-details-dc.component.scss']
})
export class AmountDetailsDcComponent implements OnInit, OnChanges {
  lang = 'en';
  @Input() claimBreakUpList: Claims;
  @Input() invoiceId: number;
  @Input() total: number;
  @Input() totalAmount: number;
  @Input() status: string;
  /**
   *
   * @param modalService
   */
  constructor(
    readonly modalService: BsModalService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  /**
   * This method is for initialization tasks
   */
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  /**
   *
   * @param changes Capturing input changes on change
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.claimBreakUpList) {
      this.claimBreakUpList = changes.claimBreakUpList.currentValue;
    }
  }
  /**
   * This method is for converting expense id
   */
  getExpenseId(expenseItem: BilingualText, claimType: string) {
    if (expenseItem.english === 'Invoice Claim' && claimType !== 'Reconciliation Claim') {
      expenseItem.english = 'Expenses';
      expenseItem.arabic = 'التكاليف';
    }
    if (expenseItem.english === 'Invoice Claim' && claimType === 'Reconciliation Claim') {
      expenseItem.english = 'Reconciled Amount';
      expenseItem.arabic = 'المبلغ الذي تمت تسويته';
    }
    if (expenseItem.english === 'Recovery Claim') {
      expenseItem.english = 'Rejected Claim Amount';
      expenseItem.arabic = 'مبلغ المطالبة المرفوضة';
    }
    return expenseItem;
  }
}
