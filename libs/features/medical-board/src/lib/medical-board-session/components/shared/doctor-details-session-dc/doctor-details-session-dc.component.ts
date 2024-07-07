import { Component, Input } from '@angular/core';
import { IndividualSessionDetails } from '../../../../shared/models';

@Component({
  selector: 'mb-doctor-details-session-dc',
  templateUrl: './doctor-details-session-dc.component.html',
  styleUrls: ['./doctor-details-session-dc.component.scss']
})
export class DoctorDetailsSessionDcComponent {
  /**Input variables */
  @Input() individualSessionDetails: IndividualSessionDetails;
}
