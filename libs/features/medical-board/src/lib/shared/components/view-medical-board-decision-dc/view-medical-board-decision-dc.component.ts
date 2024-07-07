import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Assessments, SessionAssessments } from '../../models';

@Component({
  selector: 'mb-view-medical-board-decision-dc',
  templateUrl: './view-medical-board-decision-dc.component.html',
  styleUrls: ['./view-medical-board-decision-dc.component.scss']
})
export class ViewMedicalBoardDecisionDcComponent implements OnInit {
  @Input() sessionAssessments: SessionAssessments;
  @Input() isContractDoctor = false;
  @Output()
  onDisabilityAssessmentIdClicked = new EventEmitter<Assessments>();
  currentTab = 0;
  isOcc = true;
  isNonOcc = true;
  constructor() {}

  ngOnInit(): void {}
  onDisabilityIdClick(assessment: Assessments, disabilityType: string) {
    this.onDisabilityAssessmentIdClicked.emit({ ...assessment, disabilityType: disabilityType });
  }
}
