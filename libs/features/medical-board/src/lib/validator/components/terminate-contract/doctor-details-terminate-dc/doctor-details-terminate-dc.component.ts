import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MemberDetails } from '../../../../shared/models';
import { checkBilingualTextNull } from '@gosi-ui/core';

@Component({
  selector: 'mb-doctor-details-terminate-dc',
  templateUrl: './doctor-details-terminate-dc.component.html',
  styleUrls: ['./doctor-details-terminate-dc.component.scss']
})
export class DoctorDetailsTerminateDcComponent {
  /**Input variables */
  @Input() memberDetails: MemberDetails;
  @Output() navigateToProfile: EventEmitter<number> = new EventEmitter();

  /**
   * This method is to check if the data is null or not
   * @param control
   */
  checkNull(control) {
    return checkBilingualTextNull(control);
  }
}
