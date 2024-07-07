/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit } from '@angular/core';
import { EstablishmentHeadingInterface } from '../../models';

@Component({
  selector: 'est-establishment-heading-dc',
  templateUrl: './establishment-heading-dc.component.html',
  styleUrls: ['./establishment-heading-dc.component.scss']
})
export class EstablishmentHeadingDcComponent implements OnInit {
  @Input() establishment: EstablishmentHeadingInterface;
  @Input() heading: string;
  @Input() showType = false;
  @Input() showStatus = true;
  @Input() showRegNo = true;

  constructor() {}

  ngOnInit(): void {}
}
