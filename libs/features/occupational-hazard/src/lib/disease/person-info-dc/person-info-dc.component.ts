/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Lov, LovList } from '@gosi-ui/core';

@Component({
  selector: 'oh-person-info-dc',
  templateUrl: './person-info-dc.component.html',
  styleUrls: ['./person-info-dc.component.scss']
})
export class PersonInfoDcComponent implements OnInit {
  
    /**
   * Local Variables
   */
  paymentList: LovList = null;
  paymentListForm: FormGroup;
  items: Lov[] = [];
  payee = 2;

 /**
   * input Variables
   */
  @Input() disabled;
  
  constructor( readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.paymentListForm = this.createListForm();
    this.paymentList = new LovList(this.items);
  }


  createListForm() {
    return this.fb.group({
      paymentType: this.fb.group({
        english: ['Contributor', { validators: Validators.required, updateOn: 'blur' }],
        arabic: null
      })
    });
  }

  /*This method to select Payement List*/

  selectedpaymentList(type) {
    if (type === 'Contributor') {
      this.paymentListForm.get('paymentType.english').setValue('Contributor');
      this.payee = 2;
    } else if (type === 'Establishment') {
      this.paymentListForm.get('paymentType.english').setValue('Establishment');
      this.payee = 1;
    }
  }
}
