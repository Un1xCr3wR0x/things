/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input } from '@angular/core';
import { EstablishmentProfile } from '@gosi-ui/core';

@Component({
  selector: 'cim-establishment-details-dc',
  templateUrl: './establishment-details-dc.component.html',
  styleUrls: ['./establishment-details-dc.component.scss']
})
export class EstablishmentDetailsDcComponent implements OnInit {
  //Input Variables
  @Input()
  establishmentDetails: EstablishmentProfile = new EstablishmentProfile();
  @Input() canEdit = false;

  /**
   * Creates an instance of EstablishmentDetailsDcComponent
   * @memberof  EstablishmentDetailsDcComponent
   *
   */
  constructor() {}
  /**
   * This method handles the initialization tasks.
   *
   */
  ngOnInit() {}
}
