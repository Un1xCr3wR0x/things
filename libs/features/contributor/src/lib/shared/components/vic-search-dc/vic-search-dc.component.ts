import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MaxLengthEnum } from '../../../shared/enums';

@Component({
  selector: 'cnt-vic-search-dc',
  templateUrl: './vic-search-dc.component.html',
  styleUrls: ['./vic-search-dc.component.scss']
})
export class VicSearchDcComponent implements OnInit {
  //Variable declarations & initialization
  sinLength = MaxLengthEnum.SIN;
  socialInsuranceNo = new FormControl(null, {
    validators: [Validators.required]
  });

  /**
   * Input & output event emitters
   */

  @Output() vicSearch: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  /**
   * Method to emit entered registration number
   */
  searchVIC(): void {
    this.socialInsuranceNo.markAsTouched();
    if (this.socialInsuranceNo.valid) this.vicSearch.emit(this.socialInsuranceNo.value);
    else this.vicSearch.emit(null);
  }
}
