/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Establishment } from '@gosi-ui/core';
import { EstablishmentConstants } from '../../../../shared';

@Component({
  selector: 'est-establishment-content-dc',
  templateUrl: './establishment-content-dc.component.html',
  styleUrls: ['./establishment-content-dc.component.scss']
})
export class EstablishmentContentDcComponent implements OnInit, OnChanges {
  /**
   * Input Variables
   */
  @Input() establishment: Establishment;
  @Input() name: string;
  @Input() canEdit = false;
  @Input() estHeading = 'ESTABLISHMENT.ESTABLISHMENT-DETAILS';
  @Input() isCloseEst = false;
  @Input() estIcon = 'briefcase';
  @Input() customIconPath: string;
  @Input() isReopenEst = false;

  /**
   * Output Variables
   */
  @Output() onEdit: EventEmitter<null> = new EventEmitter();

  /**
   * Local variables
   */
  isGcc = false;
  constructor(readonly router: Router) {}

  ngOnInit(): void {
    if (this.isCloseEst === true || this.isReopenEst === true) {
      this.estIcon = 'building';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.establishment) {
      if (this.establishment.gccEstablishment !== null && this.establishment.gccEstablishment.gccCountry === true) {
        this.isGcc = true;
      } else {
        this.isGcc = false;
      }
    }
    if (changes.canEdit) {
      this.canEdit = changes.canEdit.currentValue;
    }
  }

  goToEstProfile() {
    this.router.navigate([EstablishmentConstants.EST_PROFILE_ROUTE(this.establishment.registrationNo)]);
  }

  onEditEstablishment() {
    this.onEdit.emit();
  }
}
