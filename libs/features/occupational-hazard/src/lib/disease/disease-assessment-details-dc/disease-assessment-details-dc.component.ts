import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Disease } from '../../shared';

@Component({
  selector: 'oh-disease-assessment-details-dc',
  templateUrl: './disease-assessment-details-dc.component.html',
  styleUrls: ['./disease-assessment-details-dc.component.scss']
})
export class DiseaseAssessmentDetailsDcComponent implements OnInit, OnChanges {
 

  @Input() diseaseDetails: Disease = new Disease();
  constructor() { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
   if(changes.diseaseDetails && changes.diseaseDetails.currentValue){
     this.diseaseDetails = changes.diseaseDetails.currentValue;
   }
  }
}
