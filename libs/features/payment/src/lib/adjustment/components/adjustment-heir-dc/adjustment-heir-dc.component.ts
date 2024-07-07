import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LovList, BilingualText, Lov } from '@gosi-ui/core';
import { AdjustmentConstants, HeirAdjustments } from '../../../shared';

@Component({
  selector: 'pmt-adjustment-heir-dc',
  templateUrl: './adjustment-heir-dc.component.html',
  styleUrls: ['./adjustment-heir-dc.component.scss']
})
export class AdjustmentHeirDcComponent implements OnInit {
  @Input() adjustmentAddForm: FormGroup;
  @Input() adjustmentReasonList$: LovList;
  @Input() heirAdjustments: HeirAdjustments;
  adjustmentTypeList: LovList = new LovList([]);
  adjustmentTypes: BilingualText[] = [
    { english: 'Credit', arabic: 'دائن' },
    { english: 'Debit', arabic: 'مدين' }
  ];
  percentageList = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100];
  debitPercentageList: LovList = new LovList([]);
  separatorLimit = AdjustmentConstants.AMOUNT_RECEIVED_SEPARATOR_LIMIT;

  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.adjustmentTypes.forEach(type => {
      this.adjustmentTypeList.items.push({ ...new Lov(), value: type });
    });
    this.percentageList.forEach(percent => {
      this.debitPercentageList.items.push({
        ...new Lov(),
        value: { english: percent.toString(), arabic: percent.toString() }
      });
    });
  }
  onAdjustmentTypeSelect(type) {
    if (type === 'Debit') {
      this.adjustmentAddForm.addControl(
        'adjustmentPercentage',
        this.fb.group({
          english: [null, { validators: Validators.required }],
          arabic: [null]
        })
      );
    } else if (type === 'Credit' && this.adjustmentAddForm.get('adjustmentPercentage')) {
      this.adjustmentAddForm.removeControl('adjustmentPercentage');
    }
  }
  onCheckHeir() {}
}
