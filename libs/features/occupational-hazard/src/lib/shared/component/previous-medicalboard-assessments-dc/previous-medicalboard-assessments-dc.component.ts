import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { PreviousMedicalboardAssessments } from '../../models/previous-medicalboard-assessments';

@Component({
  selector: 'oh-previous-medicalboard-assessments-dc',
  templateUrl: './previous-medicalboard-assessments-dc.component.html',
  styleUrls: ['./previous-medicalboard-assessments-dc.component.scss']
})
export class PreviousMedicalboardAssessmentsDcComponent implements OnInit, OnChanges {
  
  noResults: boolean;
  @Input() previousMedicalAssessmentList : PreviousMedicalboardAssessments[] = [];
  @Output() close = new EventEmitter();

  constructor() { }  
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    if(changes.previousMedicalAssessmentList && changes.previousMedicalAssessmentList.currentValue){
      this.previousMedicalAssessmentList = changes.previousMedicalAssessmentList.currentValue;
    }
    if(this.previousMedicalAssessmentList .length>0){
      this.noResults = false;
    }else{
      this.noResults = true;
    }
  }
  hideModal(){
    this.close.emit();
  }
}
