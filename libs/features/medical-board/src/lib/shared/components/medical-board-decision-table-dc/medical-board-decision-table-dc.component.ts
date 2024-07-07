import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Assessments } from '../../models';

@Component({
  selector: 'mb-medical-board-decision-table-dc',
  templateUrl: './medical-board-decision-table-dc.component.html',
  styleUrls: ['./medical-board-decision-table-dc.component.scss']
})
export class MedicalBoardDecisionTableDcComponent implements OnInit {
  @Input() isOcc = false;
  @Input() isNonOcc = false;
  @Input() assessments: Assessments[];
  @Input() isContractDoctor = false;
  
  @Output() onDisabilityAssessmentIdClicked = new EventEmitter<Assessments>();
  constructor() {}

  ngOnInit(): void {}
}
