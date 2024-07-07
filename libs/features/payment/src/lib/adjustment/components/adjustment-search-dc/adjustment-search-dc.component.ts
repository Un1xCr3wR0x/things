import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'pmt-adjustment-search-dc',
  templateUrl: './adjustment-search-dc.component.html',
  styleUrls: ['./adjustment-search-dc.component.scss']
})
export class AdjustmentSearchDcComponent implements OnInit {
  @Output() onAdjustmentIdSearch = new EventEmitter();
  searchAdjustmentForm: FormGroup;

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.searchAdjustmentForm = this.fb.group({
      adjustmentId: [null]
    });
  }
  searchAdjustment() {
    this.onAdjustmentIdSearch.emit({
      adjustmentId: this.searchAdjustmentForm.get('adjustmentId').value
        ? parseInt(this.searchAdjustmentForm.get('adjustmentId').value, 10)
        : null
    });
  }
}
