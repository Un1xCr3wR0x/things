import { Component, Input, OnInit } from '@angular/core';
import { EstablishmentDetails } from '../../../../shared/models';

@Component({
  selector: 'blg-installment-establishment-details-dc',
  templateUrl: './installment-establishment-details-dc.component.html',
  styleUrls: ['./installment-establishment-details-dc.component.scss']
})
export class InstallmentEstablishmentDetailsDcComponent implements OnInit {
  @Input() establishmentDetails: EstablishmentDetails;
  constructor() {}

  ngOnInit(): void {}
}
