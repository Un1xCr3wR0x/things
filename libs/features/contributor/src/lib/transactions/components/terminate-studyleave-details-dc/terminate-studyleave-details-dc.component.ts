import { Component, OnInit, Input } from '@angular/core';
import { StudyLeaveDetailsDto } from '../../../shared/models/terminate-contributor-payload';

@Component({
  selector: 'cnt-terminate-studyleave-details-dc',
  templateUrl: './terminate-studyleave-details-dc.component.html',
  styleUrls: ['./terminate-studyleave-details-dc.component.scss']
})
export class TerminateStudyleaveDetailsDcComponent implements OnInit {
  /** Input variables */
  @Input() studyLeaveDetails: StudyLeaveDetailsDto;

  constructor() {}

  ngOnInit(): void {}
}
