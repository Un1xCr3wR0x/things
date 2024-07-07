import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import { LateFeeWaiveOff } from '../../../../shared/models/late-fee-waiveoff';

@Component({
  selector: 'blg-itemized-gosi-initiative-view-dc',
  templateUrl: './itemized-gosi-initiative-view-dc.component.html',
  styleUrls: ['./itemized-gosi-initiative-view-dc.component.scss']
})
export class ItemizedGosiInitiativeViewDcComponent implements OnInit {
  // input variables
  @Input() lateFeeWavier: LateFeeWaiveOff = new LateFeeWaiveOff();
  @Input() currencyType: BilingualText;
  // local variables
  totalAmount:number;
  constructor() { }
  ngOnInit(): void {
  }
  /**
   * Method to detect changes in inputs.
   * @param changes changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if(changes.lateFeeWavier && changes.lateFeeWavier.currentValue){
      this.calculateTotalAmount();
    }
  }
  calculateTotalAmount() {
    this.lateFeeWavier.waiveOffDetails.forEach(item=>{
      if(item.type == "Gosi-Initiative"){
        this.totalAmount=item.amount+item.violationsWaiverAmount;
      }
    });
  }

}
 

