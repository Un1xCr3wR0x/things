/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import { AllowancePayee } from '../../models';

@Component({
  selector: 'oh-allowance-payee-dc',
  templateUrl: './allowance-payee-dc.component.html',
  styleUrls: ['./allowance-payee-dc.component.scss']
})
export class AllowancePayeeDcComponent implements OnChanges {
  allowancePayeeType: BilingualText = new BilingualText();
  idLabel: string;
  dateLabel: string;
  @Input() allowancePayee: AllowancePayee;
  @Output() id: EventEmitter<null> = new EventEmitter();
  @Input() payeeId: number;
  @Input() showHeading = true;
  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.allowancePayee) {
      this.allowancePayee = changes.allowancePayee.currentValue;
      if (this.allowancePayee) {
        if (this.allowancePayee.ohType === 0) {
          this.idLabel = 'OCCUPATIONAL-HAZARD.INJURY.ID';
          this.dateLabel = 'OCCUPATIONAL-HAZARD.INJURY.DATE';
        } else if (this.allowancePayee.ohType === 1) {
          this.idLabel = 'OCCUPATIONAL-HAZARD.DISEASE.ID';
          this.dateLabel = 'OCCUPATIONAL-HAZARD.DISEASE.DATE';
        } else if (this.allowancePayee.ohType === 2) {
          this.idLabel = 'OCCUPATIONAL-HAZARD.COMPLICATION.ID';
          this.dateLabel = 'OCCUPATIONAL-HAZARD.COMPLICATION.DATE';
        }
      }
    }
    if (changes && changes.payeeId) {
      this.payeeId = changes.payeeId.currentValue;
    }
  }
  /**
   * get payee
   */
  getAllowancePayeeType() {
    if (this.allowancePayee.allowancePayee === 2) {
      this.allowancePayeeType.english = 'Contributor';
      this.allowancePayeeType.arabic = 'المشترك';
      return this.allowancePayeeType;
    } else if (this.allowancePayee.allowancePayee === 1) {
      this.allowancePayeeType.english = 'Establishment';
      this.allowancePayeeType.arabic = 'منشأة';
      return this.allowancePayeeType;
    }
  }
  /**
   * Navigate to details
   */
  viewDetails() {
    this.id.emit();
  }
}
