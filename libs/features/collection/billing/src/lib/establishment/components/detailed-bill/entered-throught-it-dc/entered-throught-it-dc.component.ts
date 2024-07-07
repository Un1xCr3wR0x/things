import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import { ItemizedMiscResponse } from '../../../../shared/models';

@Component({
  selector: 'blg-entered-throught-it-dc',
  templateUrl: './entered-throught-it-dc.component.html',
  styleUrls: ['./entered-throught-it-dc.component.scss']
})
export class EnteredThroughtItDcComponent implements OnInit {

  // @Input adjustments;
  @Input() miscAdjustmentResponse: ItemizedMiscResponse;
  @Input() exchangeRate = 1;
  @Input() currencyType: BilingualText;

  // Local variables
  total = 0;
  hidenDetails = {
    oh: true,
    annuity: true,
    ui: true,
    rejectedOh: true,
    violation: true,
    PPAAnnuity: true,
    PRAnnuity: true,
  };

  constructor() {}

  ngOnInit(): void {
    if(this.miscAdjustmentResponse){
      for(const adjustment of this.miscAdjustmentResponse.adjustments){
        this.total += adjustment.totalAmount;
        this.hideAdjustmentDetails();
      }
    }
  }

  ngChanges(changes: SimpleChanges){
    if(changes){
      changes.exchangeRate = changes.exchangeRate.currentValue;
      changes.currencyType = changes.currencyType.currentValue;
    }
  }
  hideAdjustmentDetails(){
    this.miscAdjustmentResponse.adjustments.forEach(adjustment => {
      if(adjustment.annContribution || adjustment.annPenality){
        this.hidenDetails["annuity"] = false;
      }
      if(adjustment.ohcontribution || adjustment.ohpenality){
        this.hidenDetails["oh"] = false;
      }
      if(adjustment.uicontribution || adjustment.uipenality){
        this.hidenDetails["ui"] = false;
      }
      if(adjustment.violationAmount){
        this.hidenDetails["violation"] = false;
      }
      if(adjustment.violationAmount){
        this.hidenDetails["violation"] = false;
      }
      if (adjustment.rejectedOHCaseNo && adjustment.rejectedOHAmount) {
        this.hidenDetails['rejectedOh'] = false;
      }
      if (adjustment.rejectedOHAmount){
        this.hidenDetails["rejectedOh"] = false;
      }
      if(adjustment.ppaAnnContribution || adjustment.ppaAnnPenality){
        this.hidenDetails['PPAAnnuity'] = false;
      }
      if(adjustment.prAnnContribution || adjustment.prAnnPenality){
        this.hidenDetails['PRAnnuity'] = false;
      }
    });
  }
}
