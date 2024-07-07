import { Component, Input, Output,OnInit, EventEmitter } from '@angular/core';
import { CommonIdentity, IdentityTypeEnum } from '@gosi-ui/core';

@Component({
  selector: 'bnt-transcation-payment-details-sc',
  templateUrl: './transcation-payment-details-sc.component.html',
  styleUrls: ['./transcation-payment-details-sc.component.scss']
})
export class TranscationPaymentDetailsScComponent implements OnInit {
  isSmallScreen = false;
  bankTransferValue = { arabic: 'التحويل المصرفي', english: 'Bank Transfer' };
  @Input() heirDetails;
  @Input() validatorCanEdit;
  @Input() identity: CommonIdentity;
  @Output() navigateToEditHeir: EventEmitter<any> = new EventEmitter();
  @Output() viewContributorDetailsPage: EventEmitter<any> = new EventEmitter();
  @Output() viewAdjustmentDetailsPage: EventEmitter<any> = new EventEmitter();
 
  constructor() { }

  ngOnInit(): void {
    console.log(this.heirDetails)
  }
  viewContributorDetails(){
    this.viewContributorDetailsPage.emit()
  }
  getIdentityLabel(idObj: CommonIdentity) {
    let label = '';
    if (idObj?.idType === IdentityTypeEnum.NIN) {
      label = 'BENEFITS.NIN-ID';
    } else if (idObj?.idType === IdentityTypeEnum.IQAMA) {
      label = 'BENEFITS.IQAMA-NUMBER';
    } else if (idObj?.idType === IdentityTypeEnum.PASSPORT) {
      label = 'BENEFITS.PASSPORT-NO';
    } else if (idObj?.idType === IdentityTypeEnum.NATIONALID) {
      label = 'BENEFITS.GCC-NIN';
    } else if (idObj?.idType === IdentityTypeEnum.BORDER) {
      label = 'BENEFITS.BORDER-NO';
    } else {
      label = 'BENEFITS.NATIONAL-ID';
    }
    return label;
  }

  viewAdjustmentDetails(heir){
   this.viewAdjustmentDetailsPage.emit(heir)
  }
  navigateToEdit(){
    this.navigateToEditHeir.emit();
  }
}
