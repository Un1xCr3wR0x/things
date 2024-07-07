import { Component, OnInit, Input } from '@angular/core';
import { StudyLeaveDetailsDto } from '../../../../shared/models';

@Component({
  selector: 'cnt-view-terminate-studyleave-details-dc',
  templateUrl: './view-terminate-studyleave-details-dc.component.html',
  styleUrls: ['./view-terminate-studyleave-details-dc.component.scss']
})
export class ViewTerminateStudyleaveDetailsDcComponent implements OnInit {
  /** Input variables */
  @Input() studyLeaveDetails: StudyLeaveDetailsDto;

  constructor() {}

  ngOnInit(): void {}
}
