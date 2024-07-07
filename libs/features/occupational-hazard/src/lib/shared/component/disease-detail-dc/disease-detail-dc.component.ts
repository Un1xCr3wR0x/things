import { Component, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApplicationTypeEnum, ApplicationTypeToken } from '@gosi-ui/core';
import { Disease, DiseaseWrapper, Injury } from '../../models';

@Component({
  selector: 'oh-disease-detail-dc',
  templateUrl: './disease-detail-dc.component.html',
  styleUrls: ['./disease-detail-dc.component.scss']
})
export class DiseaseDetailDcComponent implements OnInit {
 /**
   * Input variables
   */
 @Input() diseaseDetails: Disease;
 @Input() diseaseDetailsWrapper: DiseaseWrapper;
 @Input() isTransferredInjury: boolean;
 
 @Output() viewInjury: EventEmitter<Injury> = new EventEmitter();
  // Local variables
  isAppPrivate = false;

  constructor(  @Inject(ApplicationTypeToken) readonly appToken: string ) {} 

  ngOnInit(): void {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
  }
  ngOnChanges(changes: SimpleChanges){
    if (changes && changes.diseaseDetails) {
      this.diseaseDetails = changes.diseaseDetails.currentValue;
    }
    if(changes && changes.diseaseDetailsWrapper){
      this.diseaseDetailsWrapper = changes.diseaseDetailsWrapper.currentValue;
    }
  }
  navigateToDisease(){}
  navigateToInjuryDetails(){
    this.viewInjury.emit();
  }

}
