/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input } from '@angular/core';
import { Establishment } from '@gosi-ui/core';

@Component({
  selector: 'est-terminate-establishment-details-dc',
  templateUrl: './terminate-establishment-details-dc.component.html',
  styleUrls: ['./terminate-establishment-details-dc.component.scss']
})
export class TerminateEstablishmentDetailsDcComponent implements OnInit {
  @Input() establishment: Establishment;

  constructor() {}

  ngOnInit(): void {}
}
