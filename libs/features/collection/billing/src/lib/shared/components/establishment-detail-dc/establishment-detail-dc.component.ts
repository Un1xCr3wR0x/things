import { Component, OnInit, Input } from '@angular/core';
import { EstablishmentDetails } from '../../../shared/models/establishment-details';

@Component({
  selector: 'blg-establishment-detail-dc',
  templateUrl: './establishment-detail-dc.component.html',
  styleUrls: ['./establishment-detail-dc.component.scss']
})
export class EstablishmentDetailDcComponent implements OnInit {
  @Input() establishmentDetails?: EstablishmentDetails;

  constructor() {}

  ngOnInit(): void {}
}
