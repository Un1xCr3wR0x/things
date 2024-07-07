import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { OHReportTypes } from '../../shared/enums';
import { ApplicationTypeToken, ApplicationTypeEnum } from '@gosi-ui/core';
import { DiseaseHistory } from '../../shared/models/disease-history';
@Component({
  selector: 'oh-disease-item-dc',
  templateUrl: './disease-item-dc.component.html',
  styleUrls: ['./disease-item-dc.component.scss']
})
export class DiseaseItemDcComponent implements OnInit, OnChanges {
  /**
   *  Local Variables
   */
  isDiseaseType: boolean;
  isAppPrivate = false;
  isIndividualApp = false;


  constructor(readonly router: Router, @Inject(ApplicationTypeToken) readonly appToken: string) {}
  @Input() diseaseHistory: DiseaseHistory;
  @Input() registrationNo: number;

  /**
   * Output variables
   */
  @Output() diseaseSelected: EventEmitter<DiseaseHistory> = new EventEmitter();
  @Output() diseaseInjury: EventEmitter<DiseaseHistory> = new EventEmitter();

  ngOnInit() {
    if (this.diseaseHistory.type.english === OHReportTypes.Disease) {
      this.isDiseaseType = true;
    } else {
      this.isDiseaseType = false;
    }
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.isAppPrivate = true;
    }
    if(this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP){
      this.isIndividualApp = true;
    }
  }
  /**
   *
   * @param changes Capture input on changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.diseaseHistory) {
      this.diseaseHistory = changes.diseaseHistory.currentValue;
    }
    if (changes && changes.registrationNo) {
      this.registrationNo = Number(changes.registrationNo.currentValue);
    }
  }
  /**
   * Method to emit values to sc
   * @param diseaseHistory
   */

  viewDiseaseDetails(diseaseHistory: DiseaseHistory) {
    this.diseaseSelected.emit(diseaseHistory);
  }
  /**
   * Method to navigate to disease details page
   * @param diseaseHistory
   */
  navigateToDiseaseDetails(diseaseHistory: DiseaseHistory) {
    this.diseaseInjury.emit(diseaseHistory);
  }
}

  
  
 