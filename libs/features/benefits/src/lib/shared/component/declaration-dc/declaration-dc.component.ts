/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'bnt-declaration-dc',
  templateUrl: './declaration-dc.component.html',
  styleUrls: ['./declaration-dc.component.scss']
})
export class DeclarationDcComponent implements OnInit, OnDestroy {
  @Input() content = '';
  @Input() heading = '';
  @Input() checkBoxLabel = '';
  @Input() parentForm: FormControl;
  @Input() isAssessment = true;

  @Output() checkBoxClicked = new EventEmitter();

  constructor() {}
  /**
   * This method is used to initialise the component*
   */
  ngOnInit(): void {
    this.parentForm.patchValue({ checkBoxFlag: false });
  }

  // /** This method is to make Apply enable/disable on check   */
  changeCheck(event) {
    this.checkBoxClicked.emit(event);
  }

  ngOnDestroy() {}
}
