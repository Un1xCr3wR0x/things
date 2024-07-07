/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Inject } from '@angular/core';
import { RouterDataToken, RouterData } from '@gosi-ui/core';
import { Router } from '@angular/router';
import { BenefitConstants } from '../../constants';
import { AnnuityResponseDto } from '../../models';

@Component({
  selector: 'bnt-benefit-waive-details-dc',
  templateUrl: './benefit-waive-details-dc.component.html',
  styleUrls: ['./benefit-waive-details-dc.component.scss']
})
export class BenefitWaiveDetailsDcComponent implements OnInit {
  loadLessNotes = true;
  lessNotes = BenefitConstants.LESS_NOTES_LENGTH;
  /**
   *
   * @param language Creating an instance
   * @param router
   */
  @Input() annuityBenefitDetails: AnnuityResponseDto;
  constructor(@Inject(RouterDataToken) readonly routerData: RouterData, readonly router: Router) {}

  ngOnInit(): void {}

  loadFullNotes() {
    this.loadLessNotes = !this.loadLessNotes;
  }
}
