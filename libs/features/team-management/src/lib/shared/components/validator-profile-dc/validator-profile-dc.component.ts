/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnInit, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { ValidatorProfile } from '../../models';
import { LanguageToken, ValidatorStatus } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'tm-validator-profile-dc',
  templateUrl: './validator-profile-dc.component.html',
  styleUrls: ['./validator-profile-dc.component.scss']
})
export class ValidatorProfileDcComponent implements OnInit, OnChanges {
  /**
   * input variables
   */
  @Input() profileDetails: ValidatorProfile;
  /**
   * Local variables
   *
   */
  transactionStatus = ValidatorStatus;
  /**
   *
   * @param language
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  /**
   * local variables
   */
  lang = 'en';
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    this.language.subscribe((res: string) => {
      this.lang = res;
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.profileDetails && changes.profileDetails.currentValue)
      this.profileDetails = changes.profileDetails.currentValue;
  }
}
