/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { EstablishmentHeader } from '../../models/establishment-header';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LovList, Lov, BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'blg-detailed-bill-header-dc',
  templateUrl: './detailed-bill-header-dc.component.html',
  styleUrls: ['./detailed-bill-header-dc.component.scss']
})
export class DetailedBillHeaderDcComponent implements OnInit, OnChanges {
  establishmentListDetailsForm: FormGroup;
  establishmentList: LovList;
  establishmentDetails: Lov[] = [];
  establishmentName: BilingualText;
  pdfImgSrc = 'assets/images/downloadicons/pdf-on-green-bg-normal.svg';
  excelImgSrc = 'assets/images/downloadicons/xcel-on-green-bg-normal.svg';
  printImgSrc = 'assets/images/downloadicons/print-on-green-bg-normal.svg';
  @Input() establishmentHeader: EstablishmentHeader;
  @Input() isMofFlag: boolean;
  @Input() isClicked: boolean;
  @Input() isGccCountry: boolean;
  @Output() download: EventEmitter<null> = new EventEmitter();
  @Output() print: EventEmitter<null> = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.establishmentListDetailsForm = this.createEstablishmentListForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && !changes?.establishmentHeader?.isFirstChange()) {
      this.establishmentDetails.push({
        value: {
          english: this.establishmentHeader.name.english
            ? this.establishmentHeader.name.english
            : this.establishmentHeader.name.arabic,
          arabic: this.establishmentHeader.name.arabic
        },
        sequence: 1
      });
      this.establishmentList = new LovList(this.establishmentDetails);
      this.establishmentListDetailsForm
        .get('establishmentName')
        .get('english')
        .setValue(
          this.establishmentHeader.name.english
            ? this.establishmentHeader.name.english
            : this.establishmentHeader.name.arabic
        );
    }
  }
  /** Method to create establishment list form. */
  createEstablishmentListForm() {
    return this.fb.group({
      establishmentName: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
  downloadTransaction(val) {
    if (!this.isClicked) this.download.emit(val);
  }
  printTransaction() {
    this.print.emit();
  }
}
