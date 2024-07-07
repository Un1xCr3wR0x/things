import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'bnt-individual-search-benefits-dc',
  templateUrl: './individual-search-benefits-dc.component.html',
  styleUrls: ['./individual-search-benefits-dc.component.scss']
})
export class IndividualSearchBenefitsDcComponent {
  @Output() idNum: EventEmitter<null> = new EventEmitter();
  idNumber = new FormControl(null, {
    validators: Validators.required
  });

  /**
   * This method is used to search establishment
   */
  searchValuesBenefit() {
    this.idNum.emit(this.idNumber.value);
  }
}
