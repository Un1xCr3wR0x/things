/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DocumentItem, formatDate } from '@gosi-ui/core';
import { BenefitPaymentDetails } from '../../../shared/models';

@Component({
  selector: 'bnt-view-bank-template-dc',
  templateUrl: './view-bank-template-dc.component.html',
  styleUrls: ['./view-bank-template-dc.component.scss']
})
export class ViewBankTemplateDcComponent implements OnInit, OnChanges {
  isView = false;
  @Input() documentList: DocumentItem[] = [];
  @Input() benefitDetails: BenefitPaymentDetails = new BenefitPaymentDetails();
  @Input() lang = 'en';
  @Output() open: EventEmitter<null> = new EventEmitter();
  @Output() close: EventEmitter<DocumentItem> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    //this.documentList.forEach(val => val.name.english = 'Ceritificate of Commitment')
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.benefitDetails) this.benefitDetails = changes.benefitDetails.currentValue;
    if (changes && changes.documentList) this.documentList = changes.documentList.currentValue;
  }

  openImage() {
    this.open.emit();
  }
  closeModal() {
    this.close.emit();
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
