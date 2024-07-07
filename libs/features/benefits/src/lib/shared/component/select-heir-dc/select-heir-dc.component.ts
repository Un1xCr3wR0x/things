/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DependentDetails } from '../../models';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'bnt-select-heir-dc',
  templateUrl: './select-heir-dc.component.html',
  styleUrls: ['./select-heir-dc.component.scss']
})
export class SelectHeirDcComponent implements OnInit {
  @Input() heirs: DependentDetails[];
  @Input() parentForm: FormGroup;
  @Output() select: EventEmitter<number> = new EventEmitter();
  selectedHeir: FormControl;
  constructor() {}

  ngOnInit(): void {
    this.selectedHeir = new FormControl(null, Validators.required);
    // this.identifier = getIdentityByType(this.admin.person.identity, this.admin.person.nationality.english);
    // this.identifier.idType = 'ESTABLISHMENT.' + this.identifier.idType;
    if (this.parentForm) {
      if (this.parentForm.get('selectedHeir')) {
        this.selectedHeir.patchValue(this.parentForm.get('selectedHeir').value);
        this.parentForm.removeControl('selectedHeir');
        this.parentForm.addControl('selectedHeir', this.selectedHeir);
      } else {
        this.parentForm.addControl('selectedHeir', this.selectedHeir);
      }
      this.parentForm.updateValueAndValidity();
    }
  }

  selected(index: number) {
    //Call from html
    this.select.emit(index);
  }
}
