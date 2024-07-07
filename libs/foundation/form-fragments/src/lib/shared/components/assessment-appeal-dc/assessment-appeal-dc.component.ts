import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gosi-ui-assessment-appeal-dc',
  templateUrl: './assessment-appeal-dc.component.html',
  styleUrls: ['./assessment-appeal-dc.component.scss']
})
export class AssessmentAppealDcComponent implements OnInit {
  @Input() assessmentDetails;
  constructor() { }

  ngOnInit(): void {
  }

}
