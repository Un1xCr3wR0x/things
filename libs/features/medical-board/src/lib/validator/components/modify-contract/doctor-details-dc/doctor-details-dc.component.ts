import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MemberDetails } from '../../../../shared/models';
import { checkBilingualTextNull, getPersonArabicName } from '@gosi-ui/core';

@Component({
  selector: 'mb-doctor-details-dc',
  templateUrl: './doctor-details-dc.component.html',
  styleUrls: ['./doctor-details-dc.component.scss']
})
export class DoctorDetailsDcComponent {
  /**Input variables */
  @Input() memberDetails: MemberDetails;
  @Output() profileNavigate: EventEmitter<number> = new EventEmitter();
  arabicName: string;

  /**
   * This method is to check if the data is null or not
   * @param control
   */
  checkNull(control) {
    return checkBilingualTextNull(control);
  }
}
