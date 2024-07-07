import { Component, Input } from '@angular/core';
import { EstablishmentDetails } from '../../../shared/models';

@Component({
  selector: 'blg-establishment-info-ms-dc',
  templateUrl: './establishment-info-ms-dc.component.html',
  styleUrls: ['./establishment-info-ms-dc.component.scss']
})
export class EstablishmentInfoMsDcComponent {
  @Input() establishmentDetails?: EstablishmentDetails;
}
