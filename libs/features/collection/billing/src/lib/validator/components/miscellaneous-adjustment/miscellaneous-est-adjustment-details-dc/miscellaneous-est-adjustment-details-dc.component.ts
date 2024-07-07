import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { EstablishmentDetails, MiscellaneousRequest } from '../../../../shared/models';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'blg-miscellaneous-est-adjustment-details-dc',
  templateUrl: './miscellaneous-est-adjustment-details-dc.component.html',
  styleUrls: ['./miscellaneous-est-adjustment-details-dc.component.scss']
})
export class MiscellaneousEstAdjustmentDetailsDcComponent implements OnInit, OnChanges {
  // Local Variables
  adjustmentReason: string;
  isEdit = false;
  adjustmentfor: string;
  totalBalance = 0;
  isContributorLevel: boolean;
  lang = 'en';
  AdjReason: string;

  // Input Variables
  @Input() establishmentDetails: EstablishmentDetails;
  @Input() miscellanousDetails: MiscellaneousRequest;
  @Input() editFlag;
  @Input() isReopenClosingInProgress : boolean;
  @Input() isPPAEst = false;

  ///Output variables
  @Output() onEdit: EventEmitter<null> = new EventEmitter();

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });

    this.calculateTotal();
    if (this.miscellanousDetails) {
      this.miscellanousDetails.adjustmentLevel === 'CONTRIBUTOR_LEVEL'
        ? (this.isContributorLevel = true)
        : (this.isContributorLevel = false);
    }
    this.setAdjustmentReason();
  }

  /**
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.miscellanousDetails && changes.miscellanousDetails.currentValue) {
      this.miscellanousDetails = changes.miscellanousDetails.currentValue;
      this.adjustmentReason = this.miscellanousDetails.adjustmentReason?.english;
      this.adjustmentfor = this.miscellanousDetails?.adjustmentLevel;
    }
    if (changes?.editFlag?.currentValue) {
      this.editFlag = changes?.editFlag?.currentValue;
    }
    this.setAdjustmentReason();
  }
  /** Method to calculate total balance */
  calculateTotal() {
    if (this.miscellanousDetails.adjustmentDetails) {
      this.miscellanousDetails.adjustmentDetails.forEach(product => {
        this.totalBalance += product.amount;
      });
    }
  }

  setAdjustmentReason() {
    if (this.miscellanousDetails.adjustmentType) {
      if (this.miscellanousDetails.adjustmentType === 'MISC_CREDIT') {
        this.AdjReason = 'BILLING.MISCELLANEOUS-CREDIT';
      } else {
        this.AdjReason = 'BILLING.MISCELLANEOUS-DEBIT';
      }
    }
  }

  navigateToEdit() {
    this.onEdit.emit();
  }
}
