import { Component, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApplicationTypeEnum, ApplicationTypeToken } from '@gosi-ui/core';
import { DiseaseHistory } from '../../shared/models/disease-history';

@Component({
  selector: 'oh-disease-tab-dc',
  templateUrl: './disease-tab-dc.component.html',
  styleUrls: ['./disease-tab-dc.component.scss']
})
export class DiseaseTabDcComponent implements OnInit {

   /**
   *
   * @param fb  creating an instance
   * @param router
   */
   constructor(@Inject(ApplicationTypeToken) readonly appToken: string) {}

   /**
    * Input variables
    */
   @Input() registrationNo: number;
   @Input() establishmentRegNo: number;
   @Input() socialInsuranceNo: number;
   @Input() diseaseHistory: DiseaseHistory;
   @Input() isDisease: boolean;
 
   /**
    * Output variables
    */
   @Output() viewDisease: EventEmitter<number> = new EventEmitter();
   isAppPrivate = false;
   isAppPublic = false;
   isAppIndividual = false;  
   url='';
   /**This method is for initialization tasks */
   ngOnInit() {
     if (this.appToken === ApplicationTypeEnum.PRIVATE) {
       this.isAppPrivate = true;
     }
     this.isAppPublic = this.appToken === ApplicationTypeEnum.PUBLIC ? true : false;
     this.isAppIndividual = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
   }
   /**
    *Method to detect changes in input
    * @param changes Capturing input on changes
    */
   ngOnChanges(changes: SimpleChanges) {
     if (changes && changes.diseaseHistory && changes.diseaseHistory.currentValue) {
       this.diseaseHistory = changes.diseaseHistory.currentValue;
     }
     if (changes && changes.registrationNo) {
       this.registrationNo = Number(changes.registrationNo.currentValue);
     }
     if (changes && changes.establishmentRegNo) {
       this.establishmentRegNo = Number(changes.establishmentRegNo.currentValue);
     }
   }
   /**
    * Method to navigate to injury details page
    * @param injuryHistory
    */
   navigateToDiseaseDetails(diseaseHistory: DiseaseHistory) {
     this.viewDisease.emit(diseaseHistory?.diseaseId);
   }
  
 }
 
