import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApplicationTypeEnum, ApplicationTypeToken } from '@gosi-ui/core';
import { DiseaseHistory } from '../../shared/models/disease-history';

@Component({
  selector: 'oh-view-disease-complication-dc',
  templateUrl: './view-disease-complication-dc.component.html',
  styleUrls: ['./view-disease-complication-dc.component.scss']
})
export class ViewDiseaseComplicationDcComponent implements OnInit, OnChanges {
  showActualStatus: boolean;
  showOtherStatus: boolean;
  color: string;

  /**
   * This method is used to initialise the component
   */
  constructor(@Inject(ApplicationTypeToken) readonly appToken: string) {}
/**
   * Local Variables
   */
  isAppPrivate = false;
  /**
   * Input Variables
   */
@Input() diseaseComplication: DiseaseHistory;
/**
   * Output Variables
   */
  @Output() complicationSelected: EventEmitter<DiseaseHistory> = new EventEmitter();
  ngOnInit(): void {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    /*Condition to show actual status in Private for Below complication status */
    if (
      this.diseaseComplication.actualStatus.english === 'Cured With Disability' ||
      this.diseaseComplication.actualStatus.english === 'Cured Without Disability' ||
      this.diseaseComplication.actualStatus.english === 'Closed without continuing treatment' ||
      this.diseaseComplication.actualStatus.english === 'Closed' ||
      this.diseaseComplication.actualStatus.english === 'Resulted in Death'
    ) {
      this.showActualStatus = true;
    } else {
      this.showOtherStatus = true;
    }
  }
   /**
   * This method is to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.diseaseComplication) {
      this.diseaseComplication = changes.diseaseComplication.currentValue;
    }
  }
/**
   * Methode to view complication
   * @param complication
   */
  viewComplicationDetails(complication: DiseaseHistory) {
    this.complicationSelected.emit(complication);
  }
  getColor(status) {
    switch (status.english) {
      case 'Approved':
        {
          this.color = 'green';
        }
        break;
      case 'In Progress':
      case 'Resulted in Death':
        {
          this.color = 'orange';
        }
        break;
      case 'Cancelled':
      case 'Cured With Disability':
      case 'Cured Without Disability':
      case 'Closed without continuing treatment':
      case 'Closed':
      case 'Cancelled By System':
        {
          this.color = 'grey';
        }
        break;
      case 'Rejected':
        {
          this.color = 'red';
        }
        break;
    }
    return this.color;
  }
}
 
